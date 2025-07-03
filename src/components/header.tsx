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
            <header className="flex justify-between items-center px-4 h-12 bg-white/10 backdrop-blur-sm">
                <div className="">
                    <img
                        src="/logo.svg"
                        alt="Jigsaw Puzzle Logo"
                        className="h-10 hidden md:inline-block"
                    />
                    <img
                        src="/mlogo.svg"
                        alt="Jigsaw Puzzle Logo"
                        className="h-10 md:hidden"
                    />
                </div>

                <GameInfo />

                <div className="flex flex-wrap items-center text-[#FFD6C1] gap-5">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="gap-3 items-center cursor-pointer hidden md:flex"
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
                        className="gap-3 items-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 hidden md:flex"
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
                        className="gap-3 items-center cursor-pointer hidden md:flex"
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
                        className="gap-3 items-center cursor-pointer hidden md:flex"
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
                        className="gap-3 items-center cursor-pointer hidden md:flex"
                        onClick={handlePlaySoundChange}
                    >
                        <span className="hidden lg:inline-block text-md">
                            {t("Sound")}
                        </span>
                        {settings.playSound && <GiSoundOn size={25} />}
                        {!settings.playSound && <GiSoundOff size={25} />}
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="size-[25px] cursor-pointer md:hidden relative"
                        onClick={toggleMobileMenu}
                    >
                        <motion.div
                            className="absolute bg-[#FFD6C1] w-full h-[3px] rounded-md top-0 right-0"
                            style={{ transformOrigin: "top right" }}
                            animate={{
                                rotateZ: openMobileMenu ? -45 : 0,
                                width: openMobileMenu ? "130%" : "100%",
                            }}
                        />
                        <motion.div
                            className="absolute bg-[#FFD6C1] w-full h-[3px] rounded-md top-[11px] right-0"
                            animate={{
                                opacity: openMobileMenu ? 0 : 1,
                            }}
                        />
                        <motion.div
                            className="absolute bg-[#FFD6C1] w-full h-[3px] rounded-md top-[22px] right-0"
                            style={{ transformOrigin: "bottom right" }}
                            animate={{
                                rotateZ: openMobileMenu ? 45 : 0,
                                width: openMobileMenu ? "130%" : "100%",
                            }}
                        />
                    </motion.button>
                </div>
            </header>

            <AnimatePresence>
                {openMobileMenu && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="fixed top-12 m-4 w-[calc(100%-2rem)] overflow-hidden rounded-md bg-white/10 backdrop-blur-sm z-1 flex flex-col gap-1 p-4 md:hidden text-[#FFD6C1]"
                    >
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex gap-3 items-center cursor-pointer max-w-fit relative py-2"
                            onClick={handleOpenPuzzleOptions}
                        >
                            <span className="text-md">
                                {t("Puzzle Size")}
                            </span>
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
                            <span className="text-md">
                                {t("Next Puzzle")}
                            </span>
                            <GiFastForwardButton size={25} />                            
                            <span className="absolute inset-0 w-[calc(100vw-4rem)]" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex gap-3 items-center cursor-pointer max-w-fit relative py-2"
                            onClick={handleOpenSettings}
                        >
                            <span className="text-md">
                                {t("Settings")}
                            </span>
                            <GiGears size={25} />                            
                            <span className="absolute inset-0 w-[calc(100vw-4rem)]" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex gap-3 items-center cursor-pointer max-w-fit relative py-2"
                            onClick={handleOpenHelp}
                        >
                            <span className="text-md">
                                {t("Help")}
                            </span>
                            <GiHelp size={25} />
                            <span className="absolute inset-0 w-[calc(100vw-4rem)]" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex gap-3 items-center cursor-pointer max-w-fit relative py-2"
                            onClick={handlePlaySoundChange}
                        >
                            <span className="text-md">
                                {t("Sound")}
                            </span>
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
