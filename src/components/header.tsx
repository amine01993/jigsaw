import { memo, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
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
import ThemeToggle from "./utilities/theme-toggle";

const Header = () => {
    const { t } = useTranslation();
    const {
        isGameComplete,
        settings,
        openMobileMenu,
        setOpenMobileMenu,
        setSettings,
        setOpenSettings,
        setOpenPuzzleItemsOptions,
        setOpenHelp,
        handleNextLevel,
    } = useGame();

    const toggleMobileMenu = useCallback(() => {
        setOpenMobileMenu((prev) => !prev);
    }, []);

    const handleOpenSettings = useCallback(() => {
        setOpenSettings(true);
    }, []);

    const handleOpenPuzzleOptions = useCallback(() => {
        setOpenPuzzleItemsOptions(true);
    }, []);

    const handleOpenHelp = useCallback(() => {
        setOpenHelp(true);
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
        <>
            <header className="flex justify-between items-center px-4 h-12 bg-black/10 dark:bg-white/10 backdrop-blur-sm transition-colors duration-300">
                <div className="">
                    <img
                        src="./logo.svg"
                        alt="Jigsaw Puzzle Logo"
                        className="h-10 hidden dark:md:inline-block"
                    />
                    <img
                        src="./logo-2.svg"
                        alt="Jigsaw Puzzle Logo"
                        className="h-10 hidden md:inline-block dark:hidden"
                    />
                    <img
                        src="./mlogo.svg"
                        alt="Jigsaw Puzzle Logo"
                        className="h-10 md:hidden hidden dark:inline-block dark:md:hidden"
                    />
                    <img
                        src="./mlogo-2.svg"
                        alt="Jigsaw Puzzle Logo"
                        className="h-10 md:hidden dark:hidden"
                    />
                </div>

                <GameInfo />

                <div className="flex flex-wrap items-center text-[#072083] dark:text-[#FFD6C1] gap-1 transition-colors duration-300">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="gap-3 items-center cursor-pointer hidden md:flex p-2"
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
                        className="gap-3 items-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 hidden md:flex p-2"
                        onClick={handleNextLevel}
                        disabled={!isGameComplete}
                    >
                        <span className="hidden lg:inline-block text-md">
                            {t("Next Puzzle")}
                        </span>
                        <GiFastForwardButton size={25} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="gap-3 items-center cursor-pointer hidden md:flex p-2"
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
                        className="gap-3 items-center cursor-pointer hidden md:flex p-2"
                        onClick={handleOpenHelp}
                    >
                        <span className="hidden lg:inline-block text-md">
                            {t("Help")}
                        </span>
                        <GiHelp size={25} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="gap-3 items-center cursor-pointer hidden md:flex p-2"
                        onClick={handlePlaySoundChange}
                    >
                        <span className="hidden lg:inline-block text-md">
                            {t("Sound")}
                        </span>
                        {settings.playSound && <GiSoundOn size={25} />}
                        {!settings.playSound && <GiSoundOff size={25} />}
                    </motion.button>
                    <ThemeToggle />

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="size-[25px] cursor-pointer md:hidden relative ml-2"
                        onClick={toggleMobileMenu}
                    >
                        <motion.div
                            className="absolute bg-[#072083] dark:bg-[#FFD6C1] w-full h-[3px] rounded-md top-0 right-0 transition-colors duration-300"
                            style={{ transformOrigin: "top right" }}
                            animate={{
                                rotateZ: openMobileMenu ? -45 : 0,
                                width: openMobileMenu ? "130%" : "100%",
                            }}
                        />
                        <motion.div
                            className="absolute bg-[#072083] dark:bg-[#FFD6C1] w-full h-[3px] rounded-md top-[11px] right-0 transition-colors duration-300"
                            animate={{
                                opacity: openMobileMenu ? 0 : 1,
                            }}
                        />
                        <motion.div
                            className="absolute bg-[#072083] dark:bg-[#FFD6C1] w-full h-[3px] rounded-md top-[22px] right-0 transition-colors duration-300"
                            style={{ transformOrigin: "bottom right" }}
                            animate={{
                                rotateZ: openMobileMenu ? 45 : 0,
                                width: openMobileMenu ? "130%" : "100%",
                            }}
                        />
                        <span className="absolute size-12 top-1/2 left-1/2 -translate-1/2 hidden pointer-coarse:inline-block" />
                    </motion.button>
                </div>
            </header>

            <AnimatePresence>
                {openMobileMenu && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="fixed top-12 m-4 w-[calc(100%-2rem)] overflow-hidden rounded-md bg-black/10 dark:bg-white/10 backdrop-blur-sm z-1 flex flex-col gap-1 p-4 md:hidden text-[#072083] dark:text-[#FFD6C1] transition-colors duration-300"
                    >
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex gap-3 items-center cursor-pointer max-w-fit relative py-2"
                            onClick={handleOpenPuzzleOptions}
                        >
                            <span className="text-md">{t("Puzzle Size")}</span>
                            <GiAbstract050 size={25} />
                            <span className="absolute inset-0 w-[calc(100vw-4rem)]" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: isGameComplete ? 1.1 : 1 }}
                            whileTap={{ scale: isGameComplete ? 0.95 : 1 }}
                            className="flex gap-3 items-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 max-w-fit relative py-2"
                            onClick={handleNextLevel}
                            disabled={!isGameComplete}
                        >
                            <span className="text-md">{t("Next Puzzle")}</span>
                            <GiFastForwardButton size={25} />
                            <span className="absolute inset-0 w-[calc(100vw-4rem)]" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex gap-3 items-center cursor-pointer max-w-fit relative py-2"
                            onClick={handleOpenSettings}
                        >
                            <span className="text-md">{t("Settings")}</span>
                            <GiGears size={25} />
                            <span className="absolute inset-0 w-[calc(100vw-4rem)]" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex gap-3 items-center cursor-pointer max-w-fit relative py-2"
                            onClick={handleOpenHelp}
                        >
                            <span className="text-md">{t("Help")}</span>
                            <GiHelp size={25} />
                            <span className="absolute inset-0 w-[calc(100vw-4rem)]" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex gap-3 items-center cursor-pointer max-w-fit relative py-2"
                            onClick={handlePlaySoundChange}
                        >
                            <span className="text-md">{t("Sound")}</span>
                            {settings.playSound && <GiSoundOn size={25} />}
                            {!settings.playSound && <GiSoundOff size={25} />}
                            <span className="absolute inset-0 w-[calc(100vw-4rem)]" />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default memo(Header);
