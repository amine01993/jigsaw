import { memo, useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import classNames from "classnames";
import { getCoordsFromIndex, isInsideTheGrid } from "@/helpers/helper";
import { useGame } from "@/contexts/game";

export interface PuzzlePlaceholder {
    x: number; y: number; image: string | Blob;
}

const PuzzleItemEmpty: React.FC<{
    piece?: PuzzlePlaceholder;
    index: number;
    itemSize: number;
}> = ({ index, itemSize, piece }) => {
    const { attributes, isOver, setNodeRef } = useSortable({
        id: `empty-${index}`,
        disabled: true,
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

    const emptyClasses = useMemo(() => {
        return classNames(
            "backdrop-blur-md transition-colors duration-300",
            {
                "bg-white/10": isInTheGrid && !isOver,
                "bg-emerald-600/40": isOver,
            },
            "select-none"
        );
    }, [isInTheGrid, isOver]);

    return (
        <div
            className={emptyClasses}
            ref={setNodeRef}
            aria-label="Empty piece"
            {...attributes}
            style={{ width: itemSize, height: itemSize }}
            tabIndex={-1}
        >
            {piece && (
                <img
                    src={piece.image as string}
                    alt="Hint puzzle piece"
                    className="object-cover opacity-40"
                    style={{
                        width: itemSize,
                        height: itemSize,
                        touchAction: "manipulation",
                    }}
                />
            )}
        </div>
    );
};

export default memo(PuzzleItemEmpty);
