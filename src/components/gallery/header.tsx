import { memo } from "react";
import { motion } from "motion/react";
import ThemeToggle from "../utilities/theme-toggle";
import { MotionLink } from "@/App";

const Header = () => {
    return (
        <>
            <motion.header
                initial={{ y: -16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                className="fixed top-4 left-1/2 -translate-x-1/2 flex justify-between items-center p-4 h-12 rounded-lg bg-black/10 dark:bg-white/10 backdrop-blur-sm transition-colors duration-300 z-1"
            >
                <MotionLink to="/">
                    <img
                        src="/logo.svg"
                        alt="Jigsaw Puzzle Logo"
                        className="h-10 hidden dark:inline-block"
                    />
                    <img
                        src="/logo-2.svg"
                        alt="Jigsaw Puzzle Logo"
                        className="h-10 inline-block dark:hidden"
                    />
                </MotionLink>

                <div className="flex flex-wrap items-center text-[#072083] dark:text-[#FFD6C1] gap-1 transition-colors duration-300">
                    <ThemeToggle />
                </div>
            </motion.header>
        </>
    );
};

export default memo(Header);
