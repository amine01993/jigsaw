import {
    Fragment,
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";
import {
    DndContext,
    DragOverlay,
    KeyboardSensor,
    MeasuringStrategy,
    MouseSensor,
    rectIntersection,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
    type MeasuringConfiguration,
    type Modifier,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { isTouchEvent } from "@dnd-kit/utilities";
import classNames from "classnames";
import {
    clonePieces,
    getCoordsFromIndex,
    getGridDims,
    getGridPadding,
    getIndexFromCoords,
    getOffsetAndOutsidePositions,
    getPlaceholderCount,
    getPuzzleDims,
    isInsideTheGrid,
} from "@/helpers/helper";
import PuzzleItem, { type PuzzlePiece } from "@/components/puzzle-item";
import { useGame } from "@/contexts/game";
import Loading from "@/components/loading";
import PuzzleItemOverlay from "@/components/puzzle-item-overlay";
import PuzzleItemEmpty from "@/components/puzzle-item-empty";
import CongratsAnimation from "@/components/congrats-animation";
import ANIME_IMAGES from "@/data/images.json";

const GameScreen = () => {
    const { t } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const resizeTimeout = useRef<NodeJS.Timeout | null>(null);
    const dropSound = useRef<HTMLAudioElement | null>(null);
    const {
        isLoading,
        gameInitialized,
        level,
        puzzleItemsNumber,
        puzzlePieces,
        settings,
        placeholders,
        setPuzzlePieces,
        setGameInitialized,
        setIsLoading,
        setOffset,
        setStarted,
        setPlaceholders,
        puzzleDims,
        gridPadding,
        gridDims,
        isGameComplete,
    } = useGame();

    const measuringStrategy = useRef<MeasuringConfiguration>({
        droppable: {
            strategy: MeasuringStrategy.Always,
        },
    });
    const gridSize = useRef(700);
    const [activeId, setActiveId] = useState("");
    const [itemSize, setItemSize] = useState(140);
    const [resizing, setResizing] = useState(false);

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: (event, args) => {
                const coords = sortableKeyboardCoordinates(event, args);
                return coords;
            },
        }),
        useSensor(TouchSensor)
    );

    const sortItems = useMemo(() => {
        return puzzlePieces.map((piece, index) => {
            return piece ? piece.id.toString() : `empty-${index}`;
        });
    }, [puzzlePieces]);

    const activePiece = useMemo(() => {
        const piece = puzzlePieces.find(
            (piece) => piece?.id.toString() === activeId
        );
        return piece || null;
    }, [activeId, puzzlePieces]);

    const loadingText = useMemo(() => {
        if (isLoading) return t("Loading...");
        if (!gameInitialized) return t("Initializing game...");
        if (resizing) return t("Resizing puzzle grid...");
        return "";
    }, [isLoading, gameInitialized, resizing]);

    const restrictToPuzzleGrid = useCallback<Modifier>(
        ({ transform, activatorEvent, draggingNodeRect }) => {
            if (!containerRef.current || !draggingNodeRect) return transform;

            const containerRect = containerRef.current.getBoundingClientRect();

            const maxX = containerRect.right - draggingNodeRect.width;
            const minX = containerRect.left;
            const maxY = containerRect.bottom - draggingNodeRect.height;
            const minY = containerRect.top;

            const isTouchSorting = isTouchEvent(activatorEvent);

            // Get proposed new position + on touch screens the puzzle item should slightly higher for visibility
            const proposedLeft = draggingNodeRect.left + transform.x;
            const proposedTop =
                draggingNodeRect.top +
                transform.y -
                (isTouchSorting ? (itemSize * 3) / 4 : 0);

            // Clamp the position
            const clampedX =
                Math.min(Math.max(proposedLeft, minX), maxX) -
                draggingNodeRect.left;
            const clampedY =
                Math.min(Math.max(proposedTop, minY), maxY) -
                draggingNodeRect.top;

            return {
                ...transform,
                x: clampedX,
                y: clampedY,
            };
        },
        []
    );

    const handleDragStart = useCallback((event: DragStartEvent) => {
        setActiveId(String(event.active.id));

        setStarted(true);
    }, []);

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;

            if (!over) {
                setActiveId("");
                return;
            }

            const activeIndex = puzzlePieces.findIndex(
                (p) => p?.id.toString() === active.id
            );
            const overIndex = puzzlePieces.findIndex(
                (p, index) =>
                    p?.id.toString() === over.id || `empty-${index}` === over.id
            );

            const activeCoords = getCoordsFromIndex(activeIndex, gridDims.cols);
            const overCoords = getCoordsFromIndex(overIndex, gridDims.cols);

            if (
                !isInsideTheGrid(
                    activeCoords.x,
                    activeCoords.y,
                    gridPadding,
                    puzzleDims
                ) &&
                isInsideTheGrid(
                    overCoords.x,
                    overCoords.y,
                    gridPadding,
                    puzzleDims
                )
            ) {
                // if comes from outside the grid and dropped inside it
                setPuzzlePieces((pieces: (PuzzlePiece | null)[]) => {
                    const newPieces = clonePieces(pieces);
                    const piece = newPieces[activeIndex]!;

                    if (newPieces[overIndex]) {
                        // If the cell is occupied, we need to handle the existing piece
                        const existingPiece = newPieces[overIndex];

                        // If the dropped piece comes from outside the grid, then the existing piece should be moved to its original position
                        const newOverIndex = getIndexFromCoords(
                            existingPiece.outsidePosition.x + gridPadding.x,
                            existingPiece.outsidePosition.y + gridPadding.y,
                            gridDims.rows,
                            gridDims.cols
                        );
                        newPieces[newOverIndex] = {
                            ...existingPiece,
                            position: null,
                        };

                        newPieces[activeIndex] = null;

                        // Place the new piece in the desired position
                        newPieces[overIndex] = {
                            ...piece,
                            position: {
                                x: overCoords.x - gridPadding.x,
                                y: overCoords.y - gridPadding.y,
                            },
                        };
                    } else {
                        // If the cell is empty, simply place the new piece
                        newPieces[activeIndex] = null;

                        newPieces[overIndex] = {
                            ...piece,
                            position: {
                                x: overCoords.x - gridPadding.x,
                                y: overCoords.y - gridPadding.y,
                            },
                        };
                    }

                    return newPieces;
                });
            } else if (
                isInsideTheGrid(
                    activeCoords.x,
                    activeCoords.y,
                    gridPadding,
                    puzzleDims
                ) &&
                isInsideTheGrid(
                    overCoords.x,
                    overCoords.y,
                    gridPadding,
                    puzzleDims
                )
            ) {
                // if comes from inside the grid and dropped inside it
                setPuzzlePieces((pieces: (PuzzlePiece | null)[]) => {
                    const newPieces = clonePieces(pieces);
                    const piece = newPieces[activeIndex]!;

                    if (newPieces[overIndex]) {
                        // If the cell is occupied, we need to handle the existing piece
                        const existingPiece = newPieces[overIndex];

                        // If the position didn't change, we don't need to do anything
                        if (existingPiece.id === piece.id) {
                            return newPieces;
                        }

                        // Otherwise the pieces should be swapped
                        newPieces[activeIndex] = {
                            ...existingPiece,
                            position: {
                                x: activeCoords.x - gridPadding.x,
                                y: activeCoords.y - gridPadding.y,
                            },
                        };

                        // Place the new piece in the desired position
                        newPieces[overIndex] = {
                            ...piece,
                            position: {
                                x: overCoords.x - gridPadding.x,
                                y: overCoords.y - gridPadding.y,
                            },
                        };
                    } else {
                        // If the cell is empty, simply place the new piece
                        newPieces[activeIndex] = null;

                        // Place the new piece in the desired position
                        newPieces[overIndex] = {
                            ...piece,
                            position: {
                                x: overCoords.x - gridPadding.x,
                                y: overCoords.y - gridPadding.y,
                            },
                        };
                    }

                    return newPieces;
                });
            } else if (
                isInsideTheGrid(
                    activeCoords.x,
                    activeCoords.y,
                    gridPadding,
                    puzzleDims
                ) &&
                !isInsideTheGrid(
                    overCoords.x,
                    overCoords.y,
                    gridPadding,
                    puzzleDims
                )
            ) {
                // if comes from inside the grid and dropped outside of it
                setPuzzlePieces((pieces: (PuzzlePiece | null)[]) => {
                    const newPieces = clonePieces(pieces);
                    const piece = newPieces[activeIndex]!;

                    const newOverIndex = getIndexFromCoords(
                        piece.outsidePosition.x + gridPadding.x,
                        piece.outsidePosition.y + gridPadding.y,
                        gridDims.rows,
                        gridDims.cols
                    );

                    newPieces[activeIndex] = null;

                    newPieces[newOverIndex] = {
                        ...piece,
                        position: null,
                    };

                    return newPieces;
                });
            } else {
                // if comes from outside the grid and dropped outside of it
            }

            if (dropSound.current && settings.playSound) {
                dropSound.current.play().catch((error) => {
                    console.error("Error playing drop sound:", error);
                });
            }
        },
        [puzzlePieces, gridDims, gridPadding, puzzleDims, settings.playSound]
    );

    const handleDragCancel = useCallback(() => {}, []);

    const handleGridKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            if (!containerRef.current || event.key !== "Tab") return;

            const focusableElements =
                containerRef.current.querySelectorAll(".puzzle-item");

            if (focusableElements.length === 0) return;

            const first = focusableElements[0] as HTMLElement;
            const last = focusableElements[
                focusableElements.length - 1
            ] as HTMLElement;

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        },
        []
    );

    const getImageUrl = useCallback(async () => {
        try {
            const imageItem = ANIME_IMAGES[level];
            const imageModule = await import(imageItem.src);
            return imageModule.default;
        } catch (error) {
            console.error("Error fetching image:", error);
            return "";
        }
    }, [level]);

    // Generate puzzle pieces
    const generatePuzzle = useCallback(() => {
        // Choose image depending on the level
        const pieces: PuzzlePiece[] = [];

        const image = new Image();
        image.crossOrigin = "anonymous";

        getImageUrl().then((imageUrl) => {
            if (!imageUrl) {
                alert("Failed to load image!");
                return;
            }
            image.src = imageUrl;
        });

        image.onload = () => {
            const _puzzleDims = getPuzzleDims(puzzleItemsNumber);
            const data = getOffsetAndOutsidePositions(
                _puzzleDims.rows,
                _puzzleDims.cols
            );

            const _gridPadding = getGridPadding(data.offset);
            const _gridDims = getGridDims(_puzzleDims, _gridPadding);

            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext("2d");

                if (ctx) {
                    const w = image.width / _puzzleDims.cols;
                    const h = image.height / _puzzleDims.rows;
                    const pieceSize = Math.min(w, h);

                    canvasRef.current.width = pieceSize;
                    canvasRef.current.height = pieceSize;

                    // Loop through each cell and extract the puzzle piece
                    for (let r = 0; r < _puzzleDims.rows; r++) {
                        for (let c = 0; c < _puzzleDims.cols; c++) {
                            // Draw the puzzle piece on the canvas
                            ctx.drawImage(
                                image,
                                -c * pieceSize,
                                -r * pieceSize,
                                image.width,
                                image.height
                            );

                            pieces.push({
                                id: r * 10000 + c,
                                imageUrl: canvasRef.current.toDataURL(),
                                position: null,
                                correctPosition: { x: c, y: r },
                                outsidePosition: { x: -1, y: -1 },
                            });
                        }
                    }
                }
            }

            const _placeholders: { x: number; y: number; imageUrl: string }[] =
                [];
            const placeholderCount = getPlaceholderCount(puzzleItemsNumber);

            // Shuffle the grid positions
            pieces.sort((_, __) => {
                return Math.random() < 0.5 ? 1 : -1;
            });

            // Set the position of each piece outside the grid
            for (let i = 0; i < pieces.length; i++) {
                pieces[i].outsidePosition = data.outsidePositions[i];
                if (i < placeholderCount) {
                    _placeholders.push({
                        x: pieces[i].correctPosition.x,
                        y: pieces[i].correctPosition.y,
                        imageUrl: pieces[i].imageUrl,
                    });
                }
            }

            // Set the puzzle pieces in the grid
            const gamePieces: (PuzzlePiece | null)[] = Array.from(
                {
                    length: _gridDims.rows * _gridDims.cols,
                },
                () => null
            );

            for (const piece of pieces) {
                const index = getIndexFromCoords(
                    piece.outsidePosition.x + _gridPadding.x,
                    piece.outsidePosition.y + _gridPadding.y,
                    _gridDims.rows,
                    _gridDims.cols
                );

                gamePieces[index] = piece;
            }

            setOffset(data.offset);
            setPuzzlePieces(gamePieces);
            setGameInitialized(true);
            setPlaceholders(_placeholders);
            console.log("placeholders", _placeholders);
        };

        image.onerror = () => {
            alert("Failed to load image!");
        };
    }, [level, puzzleItemsNumber]);

    const updateItemSize = useCallback(() => {
        if (!isLoading && gameInitialized) {
            const gameSize = Math.min(
                window.innerWidth,
                window.innerHeight - 48
            );
            const maxItemSize = 140;
            gridSize.current = Math.min(gameSize, maxItemSize * gridDims.cols);

            const w = gridSize.current / gridDims.cols;
            const h = gridSize.current / gridDims.rows;
            const _itemSize = Math.min(w, h);
            setItemSize(_itemSize);
            setResizing(false);
        }
    }, [gameInitialized, isLoading, gridDims]);

    const handleWindowResize = useCallback(() => {
        setResizing(true);

        if (resizeTimeout.current) {
            clearTimeout(resizeTimeout.current);
        }

        resizeTimeout.current = setTimeout(() => {
            updateItemSize();
            resizeTimeout.current = null;
        }, 300);
    }, [updateItemSize]);

    useEffect(() => {
        updateItemSize();
    }, [updateItemSize]);

    // Initialize game on component mount
    useEffect(() => {
        setIsLoading(false);

        window.addEventListener("resize", handleWindowResize);

        return () => {
            window.removeEventListener("resize", handleWindowResize);
            if (resizeTimeout.current) {
                clearTimeout(resizeTimeout.current);
            }
        };
    }, [handleWindowResize]);

    useEffect(() => {
        generatePuzzle();
    }, [generatePuzzle]);

    return (
        <>
            {(isLoading || !gameInitialized || resizing) && (
                <motion.div
                    style={{
                        width: `${itemSize * gridDims.cols}px`,
                        height: `${itemSize * gridDims.rows}px`,
                    }}
                    className="absolute left-1/2 top-[calc(50%+1.5rem)] -translate-1/2 justify-center bg-[#FFD6C1]"
                >
                    <Loading text={loadingText} />
                </motion.div>
            )}
            {!isLoading && gameInitialized && !resizing && (
                <DndContext
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragCancel={handleDragCancel}
                    sensors={sensors}
                    collisionDetection={rectIntersection}
                    measuring={measuringStrategy.current}
                    modifiers={[restrictToPuzzleGrid]}
                >
                    <SortableContext items={sortItems}>
                        <div
                            ref={containerRef}
                            onKeyDown={handleGridKeyDown}
                            style={{
                                display: "grid",
                                gridTemplateColumns: `repeat(${gridDims.cols}, ${itemSize}px)`,
                                width: `${itemSize * gridDims.cols}px`,
                                height: `${itemSize * gridDims.rows}px`,
                            }}
                            className={classNames(
                                "absolute left-1/2 top-[calc(50%+1.5rem)] -translate-1/2 justify-center select-none",
                                "focus-within:outline-1 focus-within:outline-dashed focus-within:outline-offset-8 focus-within:outline-fuchsia-300/30"
                            )}
                        >
                            {puzzlePieces.length > 0 &&
                                puzzlePieces.map((piece, index) => {
                                    let placeholder = undefined;
                                    if (!piece) {
                                        const coords = getCoordsFromIndex(
                                            index,
                                            gridDims.cols
                                        );
                                        const isInside = isInsideTheGrid(
                                            coords.x,
                                            coords.y,
                                            gridPadding,
                                            puzzleDims
                                        );
                                        if (isInside) {
                                            const position = {
                                                x: coords.x - gridPadding.x,
                                                y: coords.y - gridPadding.y,
                                            };
                                            placeholder = placeholders.find(
                                                (p) =>
                                                    p.x === position.x &&
                                                    p.y === position.y
                                            );
                                        }
                                    }

                                    // console.log("coords", coords, "isInside", isInside, "position", position, "placeholder", placeholder);
                                    // const isPlaceHolder = placeholders.find(
                                    //     (placeholder) =>
                                    //         placeholder.x === index % gridDims.cols &&
                                    //         placeholder.y === Math.floor(index / gridDims.cols)
                                    // );
                                    return (
                                        <Fragment
                                            key={piece?.id ?? `piece-${index}`}
                                        >
                                            {piece && (
                                                <PuzzleItem
                                                    index={index}
                                                    piece={piece}
                                                    itemSize={itemSize}
                                                    disabled={isGameComplete}
                                                />
                                            )}
                                            {!piece && (
                                                <PuzzleItemEmpty
                                                    piece={placeholder}
                                                    index={index}
                                                    itemSize={itemSize}
                                                />
                                            )}
                                        </Fragment>
                                    );
                                })}
                            <AnimatePresence>
                                {!isGameComplete &&
                                    gridDims.rows &&
                                    Array(gridDims.rows)
                                        .fill(0)
                                        .map((_, index) => {
                                            if (
                                                index < gridPadding.y ||
                                                index >
                                                    puzzleDims.rows +
                                                        gridPadding.y
                                            )
                                                return;
                                            return (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        height: 0,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        height: "0.125rem",
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        height: 0,
                                                    }}
                                                    key={`puzzle-row-${index}`}
                                                    className="absolute bg-fuchsia-600 -translate-y-1/2"
                                                    style={{
                                                        top: itemSize * index,
                                                        left:
                                                            gridPadding.x *
                                                            itemSize,
                                                        width: `${
                                                            itemSize *
                                                            puzzleDims.cols
                                                        }px`,
                                                    }}
                                                />
                                            );
                                        })}
                                {!isGameComplete &&
                                    gridDims.cols &&
                                    Array(gridDims.cols)
                                        .fill(0)
                                        .map((_, index) => {
                                            if (
                                                index < gridPadding.x ||
                                                index >
                                                    puzzleDims.cols +
                                                        gridPadding.x
                                            )
                                                return;
                                            return (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        width: 0,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        width: "0.125rem",
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        width: 0,
                                                    }}
                                                    key={`puzzle-col-${index}`}
                                                    className="absolute bg-fuchsia-600 -translate-x-1/2"
                                                    style={{
                                                        top:
                                                            gridPadding.y *
                                                            itemSize,
                                                        left: itemSize * index,
                                                        height: `${
                                                            itemSize *
                                                            puzzleDims.rows
                                                        }px`,
                                                    }}
                                                />
                                            );
                                        })}
                            </AnimatePresence>
                        </div>
                    </SortableContext>

                    <DragOverlay>
                        <AnimatePresence>
                            {activePiece && (
                                <PuzzleItemOverlay
                                    piece={activePiece}
                                    itemSize={itemSize}
                                />
                            )}
                        </AnimatePresence>
                    </DragOverlay>
                </DndContext>
            )}
            <canvas ref={canvasRef} className="hidden"></canvas>
            <audio
                ref={dropSound}
                preload="auto"
                src="/sounds/card-place-1.ogg"
            />
            <CongratsAnimation itemSize={itemSize} />
        </>
    );
};

export default memo(GameScreen);
