import { useCallback, useRef, type RefObject } from "react";
import { motion, animate, useAnimation, useMotionValue } from "motion/react";
import { useGame } from "../contexts/game";

export interface PuzzlePiece {
    id: number;
    imageUrl: string;
    position: { x: number; y: number } | null;
    correctPosition: { x: number; y: number };
    // placed: boolean;
    outsidePosition: { x: number; y: number };
    isPlaceholder: boolean;
}

const PuzzleItem: React.FC<{
    piece: PuzzlePiece | null;
    row: number;
    col: number;
    container: RefObject<HTMLDivElement | null>;
    itemSize: number;
}> = ({ piece, row: oldRow, col: oldCol, container, itemSize }) => {
    const ref = useRef<HTMLImageElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    // const controls = useAnimation();
    const {
        offset,
        puzzleGridCols,
        puzzleGridRows,
        puzzlePieces,
        setPuzzlePieces,
        puzzleGrid,
        setPuzzleGrid,
    } = useGame();

    const isInsideTheGrid = useCallback(
        (col: number, row: number) => {
            return (
                col >= offset.left &&
                col < puzzleGridCols + offset.left &&
                row >= offset.top &&
                row < puzzleGridRows + offset.top
            );
        },
        [puzzleGridCols, puzzleGridRows, offset]
    );

    const handleDrop = useCallback(() => {
        if (ref.current && container.current && piece) {
            const rect = ref.current.getBoundingClientRect();
            const cRect = container.current.getBoundingClientRect();

            const adjustedParentTop =
                cRect.top + ((offset.top - offset.bottom) / 2) * itemSize;
            const adjustedParentLeft =
                cRect.left + ((offset.right - offset.left) / 2) * itemSize;

            const dy = Math.round(rect.top - adjustedParentTop);
            const dx = Math.round(rect.left - adjustedParentLeft);
            // console.log(`New position: (${rect.top}, ${rect.left})`);
            // console.log(`Container position: (${cRect.top}, ${cRect.left})`);
            // console.log(`Adjusted Parent position: (${adjustedParentTop}, ${adjustedParentLeft})`);
            // console.log(`Difference: (${dy}, ${dx})`, x.get(), y.get());

            // Calculate drop position
            const column = Math.round(dx / ref.current.width);
            const row = Math.round(dy / ref.current.height);

            // ref.current.style.removeProperty("transform");
            // x.set(0);
            // y.set(0);

            // if comes from outside the grid and dropped inside it
            if (
                !isInsideTheGrid(oldCol, oldRow) &&
                isInsideTheGrid(column, row)
            ) {
                console.log("outside to inside drop");
                console.log(
                    `Piece dropped at (${column}, ${row}) inside the grid`,
                    `Old position: (${oldCol}, ${oldRow})`,
                    x.get(),
                    y.get()
                );
                setPuzzleGrid((grid: (PuzzlePiece | null)[][]) => {
                    const newGrid: (PuzzlePiece | null)[][] = grid.map((r) =>
                        r.map((p) => (p ? { ...p } : null))
                    );

                    console.log(`New grid after drop:`, newGrid[row][column]);

                    if (newGrid[row][column]) {
                        // If the cell is occupied, we need to handle the existing piece
                        const existingPiece = newGrid[row][column];

                        // If the dropped piece comes from outside the grid, then the existing piece should be moved to its original position
                        console.log(
                            `Moving existing piece ${existingPiece.id} to outside position`,
                            oldRow,
                            oldCol,
                            existingPiece.outsidePosition
                        );
                        newGrid[existingPiece.outsidePosition.y + offset.top][
                            existingPiece.outsidePosition.x + offset.left
                        ] = {
                            ...existingPiece,
                            position: null,
                        };

                        newGrid[oldRow][oldCol] = null;

                        // Place the new piece in the desired position
                        newGrid[row][column] = {
                            ...piece,
                            position: {
                                x: column - offset.left,
                                y: row - offset.top,
                            },
                        };
                    } else {
                        // If the cell is empty, simply place the new piece
                        console.log(
                            `Placing new piece ${piece.id} at (${column}, ${row})`
                        );
                        newGrid[oldRow][oldCol] = null;

                        newGrid[row][column] = {
                            ...piece,
                            position: {
                                x: column - offset.left,
                                y: row - offset.top,
                            },
                        };
                    }

                    return newGrid;
                });
            } else if (
                isInsideTheGrid(oldCol, oldRow) &&
                isInsideTheGrid(column, row)
            ) {
                // if comes from inside the grid and dropped inside it
                console.log("inside to inside drop");
                console.log(
                    `Piece dropped at (${column}, ${row}) inside the grid`,
                    `Old position: (${oldCol}, ${oldRow})`,
                    x.get(),
                    y.get()
                );
                setPuzzleGrid((grid: (PuzzlePiece | null)[][]) => {
                    const newGrid: (PuzzlePiece | null)[][] = grid.map((r) =>
                        r.map((p) => (p ? { ...p } : null))
                    );

                    console.log(`New grid after drop:`, newGrid[row][column]);

                    if (newGrid[row][column]) {
                        // If the cell is occupied, we need to handle the existing piece
                        const existingPiece = newGrid[row][column];

                        // If the position didn't change, we don't need to do anything
                        if (existingPiece.id === piece.id) {
                            // controls.start({
                            //     x: 0,
                            //     y: 0,
                            // });
                            // animate(x, 0);
                            // animate(y, 0);
                            console.log(
                                `Piece ${piece.id} already exists at (${column}, ${row}), no action needed`
                            );
                            return newGrid;
                        }

                        // If the dropped piece comes from inside the grid, then the pieces should be swapped
                        console.log(
                            `Swapping existing piece ${existingPiece.id} at (${oldCol}, ${oldRow}) with new piece ${piece.id} at (${column}, ${row})`
                        );
                        newGrid[oldRow][oldCol] = {
                            ...existingPiece,
                            position: {
                                x: oldCol - offset.left,
                                y: oldRow - offset.top,
                            },
                        };

                        // Place the new piece in the desired position
                        newGrid[row][column] = {
                            ...piece,
                            position: {
                                x: column - offset.left,
                                y: row - offset.top,
                            },
                        };
                    } else {
                        // If the cell is empty, simply place the new piece
                        console.log(
                            `Placing new piece ${piece.id} at (${column}, ${row})`
                        );
                        newGrid[oldRow][oldCol] = null;

                        newGrid[row][column] = {
                            ...piece,
                            position: {
                                x: column - offset.left,
                                y: row - offset.top,
                            },
                        };
                    }

                    return newGrid;
                });
            } else {
                // if comes from outside the grid and dropped outside of it
                console.log(
                    `Piece dropped at (${column}, ${row}) outside the grid`,
                    x.get(),
                    y.get()
                );
                // controls.start({
                //     x: 0,
                //     y: 0,
                // });
                // animate(x, 0);
                // animate(y, 0);
            }

            animate(x, 0, {
                duration: 2,
            });
            animate(y, 0, {
                duration: 2,
            });

            // console.log(`Piece dropped at (${column}, ${row})`);
        }
    }, [
        x,
        y,
        offset,
        itemSize,
        puzzlePieces,
        isInsideTheGrid,
        oldRow,
        oldCol,
        setPuzzleGrid,
        piece,
    ]);

    return (
        <>
            {piece && (
                <motion.img
                    ref={ref}
                    drag
                    dragMomentum={false}
                    dragConstraints={container}
                    dragElastic={0}
                    className="object-cover"
                    src={piece.imageUrl}
                    alt={`Piece Number (${oldCol}, ${oldRow})`}
                    style={{ x, y }}
                    // animate={controls}
                    onDragEnd={handleDrop}
                    layoutId={`piece-${piece.id}`}
                />
            )}
            {!piece && <div style={{ width: itemSize, height: itemSize }} />}
        </>
    );
};

export default PuzzleItem;
