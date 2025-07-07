import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useScroll } from "motion/react";
import ANIME_IMAGES from "@/data/images.json";
import { getRandomCoords } from "../../helpers/gallery";
import GalleryItem from "./gallery-item";

const Gallery = () => {
    const galleryRef = useRef<HTMLDivElement | null>(null);
    const timeout = useRef<NodeJS.Timeout | null>(null);
    const currentItemWidth = useRef(300);
    const { scrollYProgress } = useScroll();
    const [itemWidth, setItemWidth] = useState(300);

    const list = useMemo(() => {
        return ANIME_IMAGES.map((item, index) => {
            const coords = getRandomCoords(
                index % 4,
                itemWidth,
                window.innerWidth,
                window.innerHeight
            );

            return {
                id: item.gameId,
                url: item.src,
                title: item.title,
                coords,
                width: itemWidth,
            };
        });
    }, [itemWidth]);

    const handleResize = useCallback(() => {
        if (window.innerWidth >= 1536) {
            currentItemWidth.current = 30;
        } else if (window.innerWidth >= 1280) {
            currentItemWidth.current = 30;
        } else if (window.innerWidth >= 1024) {
            currentItemWidth.current = 40;
        } else if (window.innerWidth >= 768) {
            currentItemWidth.current = 50;
        } else if (window.innerWidth >= 640) {
            currentItemWidth.current = 60;
        } else {
            currentItemWidth.current = 75;
        }

        if (timeout.current) {
            clearTimeout(timeout.current);
        }

        timeout.current = setTimeout(() => {
            setItemWidth(currentItemWidth.current);
            timeout.current = null;
        }, 300);
    }, []);

    const handleScroll = useCallback(() => {
        const maxScroll =
            document.documentElement.scrollHeight - window.innerHeight;
        const diff = Math.abs(
            scrollYProgress.getPrevious()! - scrollYProgress.get()
        );

        // Scroll to top when at bottom
        if (
            diff < 0.5 &&
            scrollYProgress.getPrevious()! < scrollYProgress.get() &&
            scrollYProgress.get() >= 0.91097
        ) {
            window.scrollTo({ top: maxScroll * 0.001, behavior: "instant" });
        }

        // Scroll to bottom when at top
        if (
            diff < 0.5 &&
            scrollYProgress.getPrevious()! > scrollYProgress.get() &&
            scrollYProgress.get() <= 0.001
        ) {
            window.scrollTo({ top: maxScroll * 0.91097, behavior: "instant" });
        }
    }, []);

    useEffect(() => {
        handleResize();

        if (scrollYProgress.get() === 0) {
            const maxScroll =
                document.documentElement.scrollHeight - window.innerHeight;
            window.scrollTo({ top: maxScroll * 0.001, behavior: "smooth" });
        }

        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div
            className="gallery h-[calc(5000px*10)] overflow-auto"
            ref={galleryRef}
        >
            <div className="fixed h-screen w-full perspective-normal">
                {list.map((item, index) => (
                    <GalleryItem key={item.url} item={item} index={index} />
                ))}
            </div>
        </div>
    );
};

export default memo(Gallery);
