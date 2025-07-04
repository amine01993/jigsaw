import { memo, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useGame } from "@/contexts/game";

const svgPaths = {
    darkPath: `M 186 3.5 
        C 166.8 3.5 148.3 6.4 130.9 11.9 
        C 122.1 14.7 121.7 20.4 129.8 24.8 
        C 187 55.3 226 115.6 226 185 
        C 226 253.6 187.9 313.3 131.8 344.2 
        C 122.6 349.3 123.3 355.9 133.3 358.9 
        C 150.2 364 168.1 366.6 186.7 366.5 
        C 288.4 365.9 369.1 282.7 367 181 
        C 364.9 82.6 284.9 3.7 186 3.5 Z`,
    lightPath: `M 270.8 99.3 
        C 248.9 77.4 218.6 63.8 185.1 63.8 
        C 153 63.8 123.8 76.2 102.1 96.6 
        C 78.5 118.7 63.8 150.1 63.8 185 
        C 63.8 219.7 78.4 251.1 101.9 273.2 
        C 123.6 293 152.8 306.2 185 306.2 
        C 217.9 306.2 247.7 293.1 269.6 271 
        C 292.2 249.8 306.2 219 306.2 185 
        C 306.2 151.5 292.7 121.2 270.8 99.3 Z`,
    sunLines: [
        "M185,49.6L185,49.6c-6.4,0-11.5-5.2-11.5-11.5V15c0-6.4,5.2-11.5,11.5-11.5h0c6.4,0,11.5,5.2,11.5,11.5v23.1C196.5,44.5,191.4,49.6,185,49.6z",
        "M185,320.4L185,320.4c-6.4,0-11.5,5.2-11.5,11.5V355c0,6.4,5.2,11.5,11.5,11.5h0c6.4,0,11.5-5.2,11.5-11.5v-23.1C196.5,325.5,191.4,320.4,185,320.4z",
        "M117.3,67.8L117.3,67.8c-5.5,3.2-12.6,1.3-15.7-4.2L90,43.6c-3.2-5.5-1.3-12.6,4.2-15.7l0,0c5.5-3.2,12.6-1.3,15.7,4.2l11.5,20C124.7,57.5,122.8,64.6,117.3,67.8z",
        "M252.7,302.2L252.7,302.2c-5.5,3.2-7.4,10.2-4.2,15.7l11.5,20c3.2,5.5,10.2,7.4,15.7,4.2v0c5.5-3.2,7.4-10.2,4.2-15.7l-11.5-20C265.3,301,258.2,299.1,252.7,302.2z",
        "M67.8,117.3L67.8,117.3c-3.2,5.5-10.2,7.4-15.7,4.2L32,110c-5.5-3.2-7.4-10.2-4.2-15.7l0,0c3.2-5.5,10.2-7.4,15.7-4.2l20,11.5C69,104.7,70.9,111.8,67.8,117.3z",
        "M302.2,252.7L302.2,252.7c-3.2,5.5-1.3,12.6,4.2,15.7l20,11.5c5.5,3.2,12.6,1.3,15.7-4.2h0c3.2-5.5,1.3-12.6-4.2-15.7l-20-11.5C312.5,245.3,305.4,247.2,302.2,252.7z",
        "M49.6,185L49.6,185c0,6.4-5.2,11.5-11.5,11.5H15c-6.4,0-11.5-5.2-11.5-11.5v0c0-6.4,5.2-11.5,11.5-11.5h23.1C44.5,173.5,49.6,178.6,49.6,185z",
        "M320.4,185L320.4,185c0,6.4,5.2,11.5,11.5,11.5H355c6.4,0,11.5-5.2,11.5-11.5v0c0-6.4-5.2-11.5-11.5-11.5h-23.1C325.5,173.5,320.4,178.6,320.4,185z",
        "M67.8,252.7L67.8,252.7c3.2,5.5,1.3,12.6-4.2,15.7l-20,11.5c-5.5,3.2-12.6,1.3-15.7-4.2h0c-3.2-5.5-1.3-12.6,4.2-15.7l20-11.5C57.5,245.3,64.6,247.2,67.8,252.7z",
        "M302.2,117.3L302.2,117.3c3.2,5.5,10.2,7.4,15.7,4.2l20-11.5c5.5-3.2,7.4-10.2,4.2-15.7l0,0c-3.2-5.5-10.2-7.4-15.7-4.2l-20,11.5C301,104.7,299.1,111.8,302.2,117.3z",
        "M117.3,302.2L117.3,302.2c5.5,3.2,7.4,10.2,4.2,15.7L110,338c-3.2,5.5-10.2,7.4-15.7,4.2l0,0c-5.5-3.2-7.4-10.2-4.2-15.7l11.5-20C104.7,301,111.8,299.1,117.3,302.2z",
        "M252.7,67.8L252.7,67.8c5.5,3.2,12.6,1.3,15.7-4.2l11.5-20c3.2-5.5,1.3-12.6-4.2-15.7v0c-5.5-3.2-12.6-1.3-15.7,4.2l-11.5,20C245.3,57.5,247.2,64.6,252.7,67.8z",
    ],
};

const ThemeToggle = () => {
    const { userTheme, setTheme } = useGame();

    const initialTheme = useMemo(() => {
        return userTheme;
    }, []);

    const toggleTheme = useCallback(() => {
        const newTheme = userTheme === "dark" ? "light" : "dark";
        setTheme(newTheme);
    }, [userTheme]);

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="size-11 cursor-pointer p-2"
            aria-label="Toggle Theme"
        >
            <motion.svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 370 370"
                xmlSpace="preserve"
                animate={{
                    rotateZ: userTheme === "dark" ? 45 : 0,
                }}
            >
                <defs>
                    <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
                        <stop
                            offset="10%"
                            style={{ stopColor: "#ffff2f" }}
                        ></stop>
                        <stop
                            offset="100%"
                            style={{ stopColor: "#ffbc1f" }}
                        ></stop>
                    </radialGradient>
                    <linearGradient
                        id="moonGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                    >
                        <stop
                            offset="0%"
                            style={{ stopColor: "#d4dec7" }}
                        ></stop>
                        <stop
                            offset="50%"
                            style={{ stopColor: "#c2cdbe" }}
                        ></stop>
                        <stop
                            offset="100%"
                            style={{ stopColor: "#a0abac" }}
                        ></stop>
                    </linearGradient>
                </defs>
                <motion.path
                    d={
                        initialTheme === "dark"
                            ? svgPaths.lightPath
                            : svgPaths.darkPath
                    }
                    fill={initialTheme === "dark" ? "url(#sunGradient)" : "url(#moonGradient)"}
                    animate={{
                        d:
                            userTheme === "dark"
                                ? svgPaths.lightPath
                                : svgPaths.darkPath,
                        fill: userTheme === "dark" ? "url(#sunGradient)" : "url(#moonGradient)",
                    }}
                    className={`transition-colors duration-300`}
                />

                <AnimatePresence mode="wait">
                    {userTheme === "dark" && (
                        <>
                            {svgPaths.sunLines.map((d, index) => (
                                <motion.path
                                    key={`sunLine-${index}`}
                                    initial={{ scale: 0 }}
                                    animate={{
                                        scale: 1,
                                        transition: { delay: 0.3 },
                                    }}
                                    exit={{ scale: 0 }}
                                    d={d}
                                    fill="#ff9618"
                                />
                            ))}
                        </>
                    )}
                </AnimatePresence>
            </motion.svg>
        </motion.button>
    );
};

export default memo(ThemeToggle);
