import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useScroll } from "motion/react";
import ANIME_IMAGES from "@/data/images.json";
import { getRandomCoords } from "../../helpers/gallery";
import GalleryItem from "./gallery-item";
import Header from "./header";
import Loading from "./loading";

const Gallery = () => {
    const galleryRef = useRef<HTMLDivElement | null>(null);
    const timeout = useRef<NodeJS.Timeout | null>(null);
    const currentItemWidth = useRef(300);
    const { scrollYProgress } = useScroll();
    const [itemWidth, setItemWidth] = useState(300);
    const [loading, setLoading] = useState(true);

    const list = useMemo(() => {
        return ANIME_IMAGES.map((item, index) => {
            const coords = getRandomCoords(
                index % 4,
                itemWidth,
                window.innerWidth,
                window.innerHeight - 80
            );

            const completeData = JSON.parse(localStorage.getItem(`puzzle-${item.gameId}-complete`) || "{}")
            const dates = Object.values(completeData).map(date => new Date(String(date)));
            const maxDate = Math.max(...dates.map(d => d.getTime()));

            const now = new Date();
            const threeMonthsAgo = new Date(now);
            threeMonthsAgo.setMonth(now.getMonth() - 3);

            const isComplete = maxDate > 0 && new Date(maxDate) > threeMonthsAgo;

            return {
                id: item.gameId,
                url: item.src,
                title: item.title,
                coords,
                width: itemWidth,
                isComplete,
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
            scrollYProgress.get() <= 0.00199
        ) {
            window.scrollTo({ top: maxScroll * 0.91097, behavior: "instant" });
        }
    }, []);

    useEffect(() => {
        handleResize();

        if (scrollYProgress.get() === 0) {
            const maxScroll =
                document.documentElement.scrollHeight - window.innerHeight;
            window.scrollTo({ top: maxScroll * 0.001, behavior: "instant" });
        }

        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleScroll);

        setTimeout(() => {
            setLoading(false);
        }, 300);

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
            <Header />

            <div className="fixed h-screen w-full perspective-normal bg-linear-300 from-[#caf0f8] via-white to-[#caf0f8] dark:from-black dark:via-[#072083] dark:to-black transition-colors duration-300">
                {loading && <Loading />}
                {list.map((item, index) => (
                    <GalleryItem key={item.url} item={item} index={index} />
                ))}
            </div>
        </div>
    );
};

export default memo(Gallery);
