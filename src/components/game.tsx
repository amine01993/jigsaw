import { useCallback, useEffect, useMemo, useRef, type FC } from "react";
import ANIME_IMAGES from "../data/images.json";
import { useGame } from "../contexts/game";
import type { PuzzlePiece } from "./puzzle-item";
import { motion } from "motion/react";
import { GiFastForwardButton, GiGears, GiHelp } from "react-icons/gi";
import PuzzleItem from "./puzzle-item";
import { getOffsetAndOutsidePositions } from "@/helpers/helper";

export type DifficultyLevel = "easy" | "medium" | "hard";

const Game: FC = () => {
    // Game state
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const itemSize = useRef(0);
    const {
        level,
        puzzlePieces,
        puzzleGrid,
        offset,
        setLevel,
        setPuzzlePieces,
        setPuzzleGrid,
        setGameInitialized,
        setIsLoading,
        setOffset,
        puzzleGridCols,
        puzzleGridRows,
    } = useGame();

    const isGameComplete = useMemo(() => {
        if (puzzlePieces.length > 0) {
            for (const piece of puzzlePieces) {
                if (
                    !piece.position ||
                    piece.correctPosition.x !== piece.position.x ||
                    piece.correctPosition.y !== piece.position.y
                ) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }, [puzzlePieces]);

    // Generate puzzle pieces
    const generatePuzzle = useCallback(() => {
        // Choose image depending on the level
        const imageUrl = ANIME_IMAGES[level];
        const pieces: PuzzlePiece[] = [];

        // console.log("imageUrl", imageUrl);
        const image = new Image();
        image.src = imageUrl;
        image.crossOrigin = "anonymous";

        image.onload = () => {
            const data = getOffsetAndOutsidePositions(
                puzzleGridRows,
                puzzleGridCols
            );

            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext("2d");

                if (ctx) {
                    const w =
                        image.width /
                        (puzzleGridCols +
                            data.offset.leftCols +
                            data.offset.rightCols);
                    const h =
                        image.height /
                        (puzzleGridRows +
                            data.offset.topRows +
                            data.offset.bottomRows);
                    const pieceSize = Math.min(w, h);

                    canvasRef.current.width = pieceSize;
                    canvasRef.current.height = pieceSize;

                    // Loop through each grid cell and extract the piece
                    for (let r = 0; r < puzzleGridRows; r++) {
                        for (let c = 0; c < puzzleGridCols; c++) {
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
                                // placed: false,
                                outsidePosition: { x: -1, y: -1 },
                                isPlaceholder: false,
                            });
                        }
                    }
                }
            }

            // Shuffle the grid positions
            // console.log("pieces", pieces);
            pieces.sort((_, __) => {
                return Math.random() < 0.5 ? 1 : -1;
            });

            // Set the position of each piece outside the grid
            for (let i = 0; i < pieces.length; i++) {
                pieces[i].outsidePosition = data.outsidePositions[i];
            }

            // Set the puzzle pieces in the grid
            const gameGrid: (PuzzlePiece | null)[][] = Array.from(
                {
                    length:
                        puzzleGridRows +
                        (data.offset.topRows + data.offset.bottomRows),
                },
                () =>
                    Array.from(
                        {
                            length:
                                puzzleGridCols +
                                (data.offset.leftCols + data.offset.rightCols),
                        },
                        () => null
                    )
            );

            // console.log("offset", topRows, leftCols)
            for (const piece of pieces) {
                // console.log("outpos", piece.outsidePosition)
                gameGrid[piece.outsidePosition.y + data.offset.topRows][
                    piece.outsidePosition.x + data.offset.leftCols
                ] = piece;
            }

            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const w =
                    rect.width /
                    (puzzleGridCols +
                        data.offset.leftCols +
                        data.offset.rightCols);
                const h =
                    rect.height /
                    (puzzleGridRows +
                        data.offset.topRows +
                        data.offset.bottomRows);
                itemSize.current = Math.min(w, h);
                console.log(`Item dimensions: width=${w}, height=${h}`);
            }

            setOffset({
                top: data.offset.topRows,
                left: data.offset.leftCols,
                bottom: data.offset.bottomRows,
                right: data.offset.rightCols,
            });
            setPuzzlePieces(pieces);
            setPuzzleGrid(gameGrid);
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

    // Initialize game on component mount
    useEffect(() => {
        setIsLoading(false);
    }, []);

    useEffect(() => {
        console.log("level", level);
        generatePuzzle();
    }, [level]);

    return (
        <div className="bg-linear-300 from-black via-[#072083] to-black pt-10 h-[100vh] relative">
            <h1 className="text-5xl text-center text-[#FFD6C1] font-bold">
                Jigsaw Puzzle
            </h1>

            <div className="flex flex-wrap gap-10 text-[#FFD6C1] justify-center mt-10">
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
                >
                    <span className="text-xl">Settings</span>
                    <GiGears size={30} />
                </motion.button>
            </div>

            <motion.div
                layout
                ref={containerRef}
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${
                        puzzleGridCols + offset.left + offset.right
                    }, ${itemSize.current}px)`,
                    translateX: `${
                        ((offset.right - offset.left) / 2) * itemSize.current
                    }px`,
                    translateY: `${
                        ((offset.top - offset.bottom) / 2) * itemSize.current
                    }px`,
                }}
                className={`mx-auto mt-10  w-[500px] h-[500px] relative justify-center`}
            >
                {puzzleGrid.length > 0 &&
                    puzzleGrid[0].length > 0 &&
                    puzzleGrid.map((row, rowIndex) => {
                        return row.map((piece, colIndex) => {
                            // if (!piece) return null;
                            // if(piece) {
                            //     console.log(
                            //         `Rendering piece at (${rowIndex}, ${colIndex})`,
                            //         piece?.id
                            //     );
                            // }
                            return (
                                <PuzzleItem
                                    key={
                                        piece?.id ??
                                        `piece-${rowIndex}-${colIndex}`
                                    }
                                    row={rowIndex}
                                    col={colIndex}
                                    piece={piece}
                                    container={containerRef}
                                    itemSize={itemSize.current}
                                />
                            );
                        });
                    })}
                {puzzleGridRows &&
                    Array(puzzleGridRows + offset.top + offset.bottom + 1)
                        .fill(0)
                        .map((_, index) => {
                            if (
                                index < offset.top ||
                                index > puzzleGridRows + offset.top
                            )
                                return;
                            return (
                                <div
                                    key={`puzzle-row-${index}`}
                                    className="absolute h-1 bg-black -translate-y-1/2"
                                    style={{
                                        top: itemSize.current * index,
                                        left:
                                            offset.left * itemSize.current +
                                            ((offset.right - offset.left) / 2) *
                                                itemSize.current,
                                        width: `${
                                            itemSize.current * puzzleGridCols
                                        }px`,
                                    }}
                                ></div>
                            );
                        })}
                {puzzleGridCols &&
                    Array(puzzleGridCols + offset.left + offset.right + 1)
                        .fill(0)
                        .map((_, index) => {
                            if (
                                index < offset.left ||
                                index > puzzleGridCols + offset.left
                            )
                                return;
                            return (
                                <div
                                    key={`puzzle-col-${index}`}
                                    className="absolute w-1 bg-black -translate-x-1/2"
                                    style={{
                                        top: offset.top * itemSize.current,
                                        left:
                                            itemSize.current * index +
                                            ((offset.right - offset.left) / 2) *
                                                itemSize.current,
                                        height: `${
                                            itemSize.current * puzzleGridRows
                                        }px`,
                                    }}
                                ></div>
                            );
                        })}
            </motion.div>

            <div className="mt-10">
                <p className="text-[#FFD6C1] text-center">
                    Use{" "}
                    <span className="bg-[#8f3000] p-1.5 rounded-sm">
                        drag & drop
                    </span>{" "}
                    to position the pieces of the puzzle
                </p>
            </div>

            {/* <AnimatePresence>
        
      </AnimatePresence> */}
            <div className="absolute w-[min(500px, 90%);] bottom-4 left-1/2 -translate-x-1/2 border-3 border-[#8f3000] rounded-md text-[#8f3000] bg-[#FFD6C1] p-4 flex gap-4 items-center">
                <p className="font-semibold">
                    Well done! Let's get to the next puzzle...
                </p>{" "}
                <GiFastForwardButton size={20} />
            </div>

            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
    );
};

export default Game;
