import { memo, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSortable } from "@dnd-kit/sortable";
import classNames from "classnames";
import { useGame } from "@/contexts/game";
import { getCoordsFromIndex, isInsideTheGrid } from "@/helpers/helper";

export interface PuzzlePiece {
    id: number;
    imageUrl: string;
    position: { x: number; y: number } | null;
    correctPosition: { x: number; y: number };
    outsidePosition: { x: number; y: number };
    isPlaceholder: boolean;
}

const PuzzleItem: React.FC<{
    piece: PuzzlePiece | null;
    index: number;
    itemSize: number;
    disabled?: boolean;
}> = ({ piece, index, itemSize, disabled }) => {
    const {
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
        isSorting,
        over,
        setNodeRef,
    } = useSortable({
        id: piece ? piece.id.toString() : `empty-${index}`,
        disabled: !piece || disabled,
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

    return (
        <>
            {piece && index > -1 && (
                <div className="relative">
                    <motion.img
                        ref={setNodeRef}
                        className={classNames(
                            "puzzle-item",
                            "object-cover",
                            {
                                "focus:outline-fuchsia-300 transition-all duration-300": !disabled,
                            },
                            {
                                "opacity-50": isDragging,
                                "ring ring-fuchsia-600/50": !isInTheGrid,
                            }
                        )}
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
                                      (transform?.y || 0)
                                  }px, 0)`,
                            transition,
                        }}
                    />
                    <AnimatePresence>
                        {String(piece.id) === String(over?.id) && (
                            <motion.div
                                initial={{ backgroundColor: "#00996600" }}
                                animate={{ backgroundColor: "#00996640" }}
                                exit={{ backgroundColor: "#00996600" }}
                                className="absolute inset-0 mix-blend-normal"
                            />
                        )}
                    </AnimatePresence>
                </div>
            )}
            <AnimatePresence>
                {piece && index === -1 && (
                    <motion.img
                        initial={{ boxShadow: "none" }}
                        animate={{
                            boxShadow:
                                ".0rem .4rem .4rem #f4a8ff50," +
                                ".0rem -.4rem .4rem #f4a8ff50," +
                                ".4rem 0rem .4rem #f4a8ff50," +
                                "-.4rem 0rem .4rem #f4a8ff50",
                        }}
                        exit={{ boxShadow: "none" }}
                        ref={setNodeRef}
                        className={"object-cover"}
                        src={piece.imageUrl}
                        alt="Drag overlay"
                        style={{
                            width: itemSize,
                            height: itemSize,
                            touchAction: "manipulation",
                        }}
                    />
                )}
            </AnimatePresence>
            {!piece && (
                <div
                    ref={setNodeRef}
                    aria-label="Empty piece"
                    {...listeners}
                    {...attributes}
                    style={{ width: itemSize, height: itemSize }}
                    className={classNames(
                        "backdrop-blur-md transition-colors duration-300",
                        {
                            "bg-white/10":
                                isInTheGrid && `empty-${index}` !== over?.id,
                            "bg-emerald-600/40": `empty-${index}` === over?.id,
                        },
                        "select-none"
                    )}
                    tabIndex={-1}
                />
            )}
        </>
    );
};

export default memo(PuzzleItem);
