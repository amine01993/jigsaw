import { memo, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSortable } from "@dnd-kit/sortable";
import classNames from "classnames";
import { getCoordsFromIndex, isInsideTheGrid } from "@/helpers/helper";
import { useGame } from "@/contexts/game";

export interface PuzzlePiece {
    id: number;
    imageUrl: string;
    position: { x: number; y: number } | null;
    correctPosition: { x: number; y: number };
    outsidePosition: { x: number; y: number };
}

const PuzzleItem: React.FC<{
    piece: PuzzlePiece;
    index: number;
    itemSize: number;
    disabled: boolean;
}> = ({ piece, index, itemSize, disabled }) => {
    const {
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
        isSorting,
        isOver,
        setNodeRef,
    } = useSortable({
        id: piece ? piece.id.toString() : `empty-${index}`,
        disabled,
        animateLayoutChanges: ({ isSorting, wasDragging }) => {
            return isSorting || wasDragging;
        },
    });
    const { puzzleDims, gridPadding, gridDims } = useGame();

    const oldCoords = useMemo(() => {
        const coords = getCoordsFromIndex(index, gridDims.cols);
        return coords;
    }, [index, gridDims]);

    const isInTheGrid = useMemo(() => {
        return isInsideTheGrid(
            oldCoords.x,
            oldCoords.y,
            gridPadding,
            puzzleDims
        );
    }, [oldCoords, gridPadding, puzzleDims]);

    const imgClasses = useMemo(() => {
        return classNames("puzzle-item", "object-cover", {
            "focus:outline-fuchsia-300 focus:outline-2 -outline-offset-2 transition-all duration-300":
                !disabled,
            "opacity-50": isDragging,
            "ring ring-fuchsia-600/50": !isInTheGrid,
        });
    }, [disabled, isDragging, isInTheGrid]);

    return (
        <div className="relative">
            <img
                ref={setNodeRef}
                className={imgClasses}
                src={piece.imageUrl}
                alt={`Piece Number (${oldCoords.x}, ${oldCoords.y})`}
                {...listeners}
                {...attributes}
                style={{
                    width: itemSize,
                    height: itemSize,
                    transform: isSorting
                        ? undefined
                        : `translate3d(${transform?.x || 0}px, ${
                              transform?.y || 0
                          }px, 0)`,
                    transition,
                }}
            />
            <AnimatePresence>
                {isOver && (
                    <motion.div
                        initial={{ backgroundColor: "#00996600" }}
                        animate={{ backgroundColor: "#00996640" }}
                        exit={{ backgroundColor: "#00996600" }}
                        className="absolute inset-0 mix-blend-normal"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default memo(PuzzleItem);
