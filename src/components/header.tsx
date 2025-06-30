import { memo, useCallback } from "react";
import { motion } from "motion/react";
import { GiAbstract050, GiFastForwardButton, GiGears, GiHelp } from "react-icons/gi";
import GameInfo from "./game-info";
import { useGame } from "@/contexts/game";

const Header = () => {
    const { isGameComplete, setOpenSettings, setOpenPuzzleItemsOptions, handleNextLevel } = useGame();

    const handleOpenSettings = useCallback(() => {
        console.log("Open settings");
        setOpenSettings(true);
    }, []);

    const handleOpenPuzzleOptions = useCallback(() => {
        console.log("Open puzzle options");
        setOpenPuzzleItemsOptions(true);
    }, []);

    return (
        <header className="relative h-12 bg-white/10 backdrop-blur-sm">
            <h1 className="text-xl text-center text-[#FFD6C1] font-bold left-4 top-1/2 -translate-y-1/2 absolute">
                Jigsaw Puzzle
            </h1>

            <GameInfo />

            <div className="flex flex-wrap items-center text-[#FFD6C1] gap-5 right-4 top-1/2 -translate-y-1/2 absolute">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex gap-3 items-center hover:cursor-pointer"
                    onClick={handleOpenPuzzleOptions}
                >
                    <span className="hidden lg:inline-block text-md">Puzzle Size</span>
                    <GiAbstract050 size={25} />
                </motion.button>
                <motion.button
                    whileHover={{ scale: isGameComplete ? 1.1 : 1 }}
                    whileTap={{ scale: isGameComplete ? 0.95 : 1 }}
                    className={`flex gap-3 items-center hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
                    onClick={handleNextLevel}
                    disabled={!isGameComplete}
                >
                    <span className="hidden lg:inline-block text-md">
                        Next Puzzle
                    </span>
                    <GiFastForwardButton size={25} />
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex gap-3 items-center hover:cursor-pointer"
                    onClick={handleOpenSettings}
                >
                    <span className="hidden lg:inline-block text-md">
                        Settings
                    </span>
                    <GiGears size={25} />
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex gap-3 items-center hover:cursor-pointer"
                >
                    <span className="hidden lg:inline-block text-md">Help</span>
                    <GiHelp size={25} />
                </motion.button>
            </div>
        </header>
    );
};

export default memo(Header);
