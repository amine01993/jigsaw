import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type FC,
} from "react";
import ANIME_IMAGES from "../data/images.json";
import { useGame } from "../contexts/game";
import type { PuzzlePiece } from "./puzzle-item";
import { AnimatePresence, motion } from "motion/react";
import { GiFastForwardButton, GiGears, GiHelp } from "react-icons/gi";
import PuzzleItem from "./puzzle-item";
import {
    clonePieces,
    getCoordsFromIndex,
    getGridDims,
    getGridPadding,
    getIndexFromCoords,
    getOffsetAndOutsidePositions,
    getPuzzleDims,
    isInsideTheGrid,
} from "@/helpers/helper";
import {
    DndContext,
    DragOverlay,
    MeasuringStrategy,
    rectIntersection,
    type DragEndEvent,
    type DragStartEvent,
    type MeasuringConfiguration,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import Loading from "./loading";
import Settings from "./settings";
import GameInfo from "./game-info";

const Game: FC = () => {
    // Game state
    
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {
        isLoading,
        gameInitialized,
        level,
        settings,
        puzzlePieces,
        started,
        setOpenSettings,
        setLevel,
        setPuzzlePieces,
        setGameInitialized,
        setIsLoading,
        setOffset,
        setStarted,
        puzzleDims,
        gridPadding,
        gridDims,
    } = useGame();
    const measuringStrategy = useRef<MeasuringConfiguration>({
        droppable: {
            strategy: MeasuringStrategy.Always,
        },
    });
    const [activeId, setActiveId] = useState("");
    const [showBorders, setShowBorders] = useState(true);
    const [itemSize, setItemSize] = useState(0);

    const isGameComplete = useMemo(() => {
        if (puzzlePieces.length > 0) {
            for (const piece of puzzlePieces) {
                if (
                    piece &&
                    (!piece.position ||
                        piece.correctPosition.x !== piece.position.x ||
                        piece.correctPosition.y !== piece.position.y)
                ) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }, [puzzlePieces]);

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

    const getImageUrl = useCallback(async () => {
        try {
            const imageModule = await import(`../assets/images/photo-1.png`);
            return imageModule.default;
        } catch (error) {
            console.error("Error fetching image:", error);
            return "";
        }
    }, []);

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
            const _puzzleDims = getPuzzleDims(settings.difficulty);
            const data = getOffsetAndOutsidePositions(
                _puzzleDims.rows,
                _puzzleDims.cols
            );
            const _gridPadding = getGridPadding(data.offset);
            const _gridDims = getGridDims(_puzzleDims, _gridPadding);

            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext("2d");

                if (ctx) {
                    const w = image.width / _gridDims.cols;
                    const h = image.height / _gridDims.rows;
                    const pieceSize = Math.min(w, h);
                    console.log(
                        `Piece dimensions: width=${w}, height=${h}, size=${pieceSize}`
                    );

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
                                id: r * 100 + c,
                                imageUrl: canvasRef.current.toDataURL(),
                                position: null,
                                correctPosition: { x: c, y: r },
                                outsidePosition: { x: -1, y: -1 },
                                isPlaceholder: false,
                            });
                        }
                    }
                }
            }

            // Shuffle the grid positions
            pieces.sort((_, __) => {
                return Math.random() < 0.5 ? 1 : -1;
            });

            // Set the position of each piece outside the grid
            for (let i = 0; i < pieces.length; i++) {
                pieces[i].outsidePosition = data.outsidePositions[i];
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
        };

        image.onerror = () => {
            alert("Failed to load image!");
        };
    }, [level]);

    // Pass to the next level
    const handleNextLevel = useCallback(() => {
        console.log("handleNextLevel");
        if (level + 1 < ANIME_IMAGES.length) {
            setLevel(level + 1);
            setGameInitialized(false);
        }
    }, [level]);

    const handleDragStart = useCallback(
        (event: DragStartEvent) => {
            console.log("Drag started", event);
            setActiveId(String(event.active.id));

            setStarted(true);
            if (!started) {
                console.log("Game started");
            }
        },
        [started]
    );

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            console.log("Drag ended");
            const { active, over } = event;

            if (!over) {
                console.log("No drop target, cancelling drag");
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
                console.log("outside to inside drop");

                setPuzzlePieces((pieces: (PuzzlePiece | null)[]) => {
                    const newPieces = clonePieces(pieces);
                    const piece = newPieces[activeIndex]!;

                    if (newPieces[overIndex]) {
                        // If the cell is occupied, we need to handle the existing piece
                        const existingPiece = newPieces[overIndex];

                        // If the dropped piece comes from outside the grid, then the existing piece should be moved to its original position
                        console.log(
                            `Moving existing piece ${existingPiece.id} to outside position`,
                            existingPiece.outsidePosition
                        );

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
                        console.log(
                            `Placing new piece ${piece.id} at (${overCoords.x}, ${overCoords.y})`
                        );
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
                console.log("inside to inside drop");

                setPuzzlePieces((pieces: (PuzzlePiece | null)[]) => {
                    const newPieces = clonePieces(pieces);
                    const piece = newPieces[activeIndex]!;

                    if (newPieces[overIndex]) {
                        // If the cell is occupied, we need to handle the existing piece
                        const existingPiece = newPieces[overIndex];

                        // If the position didn't change, we don't need to do anything
                        if (existingPiece.id === piece.id) {
                            console.log(`Same piece, no action needed`);
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
                        console.log(
                            `Placing new piece ${piece.id} at (${overCoords.x}, ${overCoords.y})`
                        );
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
                console.log("inside to outside drop");
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
                console.log(
                    `Piece dropped at (${overCoords.x}, ${overCoords.y}) outside the grid`
                );
            }
        },
        [puzzlePieces, gridDims, gridPadding, puzzleDims]
    );

    const handleDragCancel = useCallback(() => {
        console.log("Drag cancelled");
    }, []);

    const handleOpenSettings = useCallback(() => {
        console.log("Open settings");
        setOpenSettings(true);
    }, []);

    // Initialize game on component mount
    useEffect(() => {
        setIsLoading(false);
        // setGameInitialized(true);
        // setTimeout(() => {
        //     console.log("loading complete");
        //     setIsLoading(false);
        //     setTimeout(() => {
        //         console.log("Game initialized");
        //         setGameInitialized(true);
        //     }, 5000);
        // }, 5000);
    }, []);

    useEffect(() => {
        console.log("level", level);
        generatePuzzle();
    }, [level]);

    useEffect(() => {
        if (!isLoading && gameInitialized && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const w = rect.width / gridDims.cols;
            const h = rect.height / gridDims.rows;
            const _itemSize = Math.min(w, h);
            setItemSize(_itemSize);
            console.log(
                `Grid Item dimensions: width=${w}, height=${h}, size=${_itemSize}`
            );
        }
    }, [isLoading, gameInitialized, gridDims]);

    // console.log("Game component rendered");

    return (
        <div className="bg-linear-300 from-black via-[#072083] to-black py-10 min-h-screen relative">
            <h1 className="text-5xl text-center text-[#FFD6C1] font-bold">
                Jigsaw Puzzle
            </h1>

            <div className="flex flex-col items-center mt-10 text-[#FFD6C1] gap-7 justify-between">
                <div className="flex flex-wrap gap-10">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex gap-3 items-center hover:cursor-pointer"
                    >
                        <span className="hidden sm:inline-block text-md md:text-xl">
                            Help
                        </span>
                        <GiHelp size={30} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: isGameComplete ? 1.1 : 1 }}
                        whileTap={{ scale: isGameComplete ? 0.95 : 1 }}
                        className={`flex gap-3 items-center hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
                        onClick={handleNextLevel}
                        disabled={!isGameComplete}
                    >
                        <span className="text-xl">Next Level</span>
                        <GiFastForwardButton size={30} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex gap-3 items-center hover:cursor-pointer"
                        onClick={handleOpenSettings}
                    >
                        <span className="text-xl">Settings</span>
                        <GiGears size={30} />
                    </motion.button>
                </div>

                <GameInfo />
            </div>

            {(isLoading || !gameInitialized) && (
                <motion.div className="mx-auto mt-10 w-[700px] h-[700px] relative justify-center bg-[#FFD6C1]">
                    <Loading
                        text={isLoading ? "Loading..." : "Initializing game..."}
                    />
                </motion.div>
            )}
            {!isLoading && gameInitialized && (
                <DndContext
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragCancel={handleDragCancel}
                    collisionDetection={rectIntersection}
                    measuring={measuringStrategy.current}
                >
                    <SortableContext items={sortItems}>
                        <div
                            ref={containerRef}
                            style={{
                                display: "grid",
                                gridTemplateColumns: `repeat(${gridDims.cols}, ${itemSize}px)`,
                            }}
                            className={`mx-auto mt-10 w-[700px] h-[700px] relative justify-center`}
                        >
                            {puzzlePieces.length > 0 &&
                                puzzlePieces.map((piece, index) => {
                                    return (
                                        <PuzzleItem
                                            key={piece?.id ?? `piece-${index}`}
                                            index={index}
                                            piece={piece}
                                            itemSize={itemSize}
                                        />
                                    );
                                })}
                            <AnimatePresence>
                                {showBorders &&
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
                            </AnimatePresence>
                            {showBorders &&
                                gridDims.cols &&
                                Array(gridDims.cols)
                                    .fill(0)
                                    .map((_, index) => {
                                        if (
                                            index < gridPadding.x ||
                                            index >
                                                puzzleDims.cols + gridPadding.x
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
                                                exit={{ opacity: 0, width: 0 }}
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
                        </div>
                    </SortableContext>

                    <DragOverlay>
                        {activeId ? (
                            <PuzzleItem
                                piece={activePiece}
                                index={-1}
                                itemSize={itemSize}
                            />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            )}

            <div className="mt-10">
                <p className="text-[#FFD6C1] text-center">
                    Use{" "}
                    <span className="bg-[#8f3000] p-1.5 rounded-sm">
                        drag & drop
                    </span>{" "}
                    to position the pieces of the puzzle
                </p>
            </div>

            {/* <div className="absolute w-[min(500px, 90%);] bottom-4 left-1/2 -translate-x-1/2 border-3 border-[#8f3000] rounded-md text-[#8f3000] bg-[#FFD6C1] p-4 flex gap-4 items-center">
                <p className="font-semibold">
                    Well done! Let's get to the next puzzle...
                </p>{" "}
                <GiFastForwardButton size={20} />
            </div> */}

            <Settings />
            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
    );
};

export default Game;
