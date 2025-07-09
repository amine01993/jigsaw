import { useMemo, memo } from "react";
import {
    cubicBezier,
    motion,
    useMotionTemplate,
    useScroll,
    useTransform,
} from "motion/react";
import classNames from "classnames";
import {
    duplicateArray,
    getRange,
    mapRange,
    rotateRight,
} from "@/helpers/gallery";
import { MotionLink } from "@/App";
import { useApp } from "@/contexts/app";

interface GalleryItemProps {
    index: number;
    item: {
        id: string;
        url: string;
        title: string;
        coords: { x: number; y: number };
        width: number;
        isComplete: boolean;
    };
}

const scrollArray = getRange(10 * 10, 0, 1);
const initialTranslateZArray = mapRange(
    duplicateArray([0.95, 1, 0, 0, 0, 0, 0, 0.05, 0.35, 0.7], 10),
    [-700, 80]
);
const initialOpacityArray = duplicateArray(
    [0.95, 0, 0, 0, 0, 0, 1, 1, 1, 0.95],
    10
);

const GalleryItem = ({ item, index }: GalleryItemProps) => {
    const { scrollYProgress } = useScroll();
    const { userTheme } = useApp();

    const opacityArray = useMemo(() => {
        return rotateRight(initialOpacityArray, index);
    }, [index]);
    const translateZArray = useMemo(() => {
        return rotateRight(initialTranslateZArray, index);
    }, [index]);
    const opacity = useTransform(scrollYProgress, scrollArray, opacityArray);
    const translateZ = useTransform(
        scrollYProgress,
        scrollArray,
        translateZArray,
        {
            ease: cubicBezier(0.14, 0.43, 0.77, 0.74),
        }
    );
    const transform = useMotionTemplate`translate3d(calc(${item.coords.x}vw - 50%), calc(${item.coords.y}vh - 50%), ${translateZ}px)`;
    const zIndex = useTransform(() => {
        return opacity.get() > 0.2 ? translateZ.get() : -1000;
    });

    return (
        <MotionLink
            to={`/game/${item.id}`}
            className={classNames(
                "w-[300px] absolute z-0 p-4 rounded-md bg-white border-2 border-offset-2 border-gray-900",
                { "grayscale-80": !item.isComplete }
            )}
            whileHover={{
                boxShadow: `0 0 15px ${
                    userTheme === "dark"
                        ? "rgba(255, 255, 255, 0.5)"
                        : "rgba(0, 0, 0, 0.5)"
                }`,
            }}
            style={{
                opacity,
                transform,
                zIndex,
                width: `${item.width}vw`,
            }}
        >
            <motion.img
                src={item.url}
                title={item.title}
                className="object-cover w-full h-full"
            />
        </MotionLink>
    );
};

export default memo(GalleryItem);
