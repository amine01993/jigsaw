import { memo } from "react";
import { motion } from "motion/react";
import type { PuzzlePiece } from "./puzzle-item";

const PuzzleItemOverlay: React.FC<{
    piece: PuzzlePiece;
    itemSize: number;
}> = ({ piece, itemSize }) => {

    return (
        <>
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
                className={"object-cover"}
                src={piece.imageUrl}
                alt="Drag overlay"
                style={{
                    width: itemSize,
                    height: itemSize,
                    touchAction: "manipulation",
                }}
            />
        </>
    );
};

export default memo(PuzzleItemOverlay);
