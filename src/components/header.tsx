import { memo, useCallback } from "react";
import { motion } from "motion/react";
import {
    GiAbstract050,
    GiFastForwardButton,
    GiGears,
    GiHelp,
    GiSoundOff,
    GiSoundOn,
} from "react-icons/gi";
import { useTranslation } from "react-i18next";
import { useGame } from "@/contexts/game";
import GameInfo from "@/components/game-info";

const Header = () => {
    const { t } = useTranslation();
    const {
        isGameComplete,
        settings,
        setSettings,
        setOpenSettings,
        setOpenPuzzleItemsOptions,
        handleNextLevel,
    } = useGame();

    const handleOpenSettings = useCallback(() => {
        setOpenSettings(true);
    }, []);

    const handleOpenPuzzleOptions = useCallback(() => {
        setOpenPuzzleItemsOptions(true);
    }, []);

    const handlePlaySoundChange = useCallback(() => {
        setSettings((prevSettings) => {
            return {
                ...prevSettings,
                playSound: !prevSettings.playSound,
            };
        });
    }, []);

    return (
        <header className="flex justify-between items-center px-4 h-12 bg-white/10 backdrop-blur-sm">
            <div className="">
                <img
                    src="/logo.svg"
                    alt="Jigsaw Puzzle Logo"
                    className="h-10"
                />
            </div>

            <GameInfo />

            <div className="flex flex-wrap items-center text-[#FFD6C1] gap-5">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex gap-3 items-center hover:cursor-pointer"
                    onClick={handleOpenPuzzleOptions}
                >
                    <span className="hidden lg:inline-block text-md">
                        {t("Puzzle Size")}
                    </span>
                    <GiAbstract050 size={25} />
                </motion.button>
                <motion.button
                    whileHover={{ scale: isGameComplete ? 1.1 : 1 }}
                    whileTap={{ scale: isGameComplete ? 0.95 : 1 }}
                    className={`flex gap-3 items-center hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
                    onClick={handleNextLevel}
                    // disabled={!isGameComplete}
                >
                    <span className="hidden lg:inline-block text-md">
                        {t("Next Puzzle")}
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
                        {t("Settings")}
                    </span>
                    <GiGears size={25} />
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex gap-3 items-center hover:cursor-pointer"
                >
                    <span className="hidden lg:inline-block text-md">
                        {t("Help")}
                    </span>
                    <GiHelp size={25} />
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex gap-3 items-center hover:cursor-pointer"
                    onClick={handlePlaySoundChange}
                >
                    <span className="hidden lg:inline-block text-md">
                        {t("Sound")}
                    </span>
                    {settings.playSound && <GiSoundOn size={25} />}
                    {!settings.playSound && <GiSoundOff size={25} />}
                </motion.button>
            </div>
        </header>
    );
};

export default memo(Header);
