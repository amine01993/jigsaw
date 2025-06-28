import { memo, useCallback, useMemo } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { motion } from "motion/react";
import classNames from "classnames";
import { useGame, type DifficultyLevel } from "@/contexts/game";
import InputSwitch from "./input-switch";

const Settings = () => {
    console.log("Settings rendered");
    const {
        settings,
        openSettings,
        setOpenSettings,
        setSettings,
        setGameInitialized,
    } = useGame();

    const activeDifficulty = useMemo(() => {
        return settings.difficulty;
    }, [settings.difficulty]);

    const activeLocale = useMemo(() => {
        return settings.locale;
    }, [settings.locale]);

    const handleCloseSettings = useCallback(() => {
        console.log("Close settings");
        setOpenSettings(false);
    }, []);

    const handlePropagation = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    const handleDifficultyChange = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            const difficulty = e.currentTarget.dataset.difficulty;
            if (!difficulty) return;

            setSettings((prevSettings) => {
                // console.log(
                //     "handleDifficultyChange previous settings",
                //     prevSettings, settings
                // );
                return {
                    ...prevSettings,
                    difficulty: difficulty as DifficultyLevel,
                };
            });

            setGameInitialized(false);
        },
        []
    );

    const handleLocaleChange = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            const locale = e.currentTarget.dataset.locale;
            if (!locale) return;

            setSettings((prevSettings) => {
                // console.log(
                //     "handleLocaleChange previous settings",
                //     prevSettings, settings
                // );
                return {
                    ...prevSettings,
                    locale: locale as "en" | "fr",
                };
            });
        },
        []
    );

    const handleShowTimerChange = useCallback((value: boolean) => {
        setSettings((prevSettings) => ({
            ...prevSettings,
            showTimer: value,
        }));
    }, []);

    const handleShowFpsChange = useCallback((value: boolean) => {
        setSettings((prevSettings) => ({
            ...prevSettings,
            showFps: value,
        }));
    }, []);

    return (
        <>
            {openSettings && (
                <div
                    className="w-full h-screen fixed top-0 left-0 bg-white/50 backdrop-blur-md"
                    onClick={handleCloseSettings}
                >
                    <div
                        className="w-[500px] max-w-[90%] absolute top-1/2 left-1/2 -translate-1/2 rounded-md shadow-md bg-linear-100 from-[#072083] to-black p-5"
                        onClick={handlePropagation}
                    >
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCloseSettings}
                            className="absolute top-4 right-4 p-2 text-[#FFD6C1] hover:text-[#b33b00] transition-colors duration-300 cursor-pointer"
                        >
                            <AiOutlineClose />
                        </motion.button>
                        <h2 className="text-[#FFD6C1] text-2xl font-bold sm:text-center">
                            Settings
                        </h2>

                        <div className="flex flex-col gap-10 mt-10">
                            <div className="text-[#FFD6C1] flex">
                                <button
                                    data-difficulty="easy"
                                    onClick={handleDifficultyChange}
                                    className={classNames(
                                        `h-12 ring cursor-pointer flex-1 transition-colors duration-300 relative rounded-bl-md rounded-tl-md`,
                                        {
                                            "ring-[#b33b00]":
                                                activeDifficulty === "easy",
                                            "ring-[#FFD6C1]/30 hover:bg-[#FFD6C1]/30":
                                                activeDifficulty !== "easy",
                                        }
                                    )}
                                >
                                    {activeDifficulty === "easy" && (
                                        <motion.div
                                            style={{
                                                borderTopLeftRadius: 6,
                                                borderBottomLeftRadius: 6,
                                                borderBottomRightRadius: 0,
                                                borderTopRightRadius: 0,
                                            }}
                                            layoutId="difficulty-indicator"
                                            className="absolute inset-0 bg-[#b33b00] z-1"
                                        />
                                    )}
                                    <span className="absolute inset-0 flex items-center justify-center z-2">
                                        Easy
                                    </span>
                                </button>
                                <button
                                    data-difficulty="medium"
                                    onClick={handleDifficultyChange}
                                    className={classNames(
                                        `h-12 ring cursor-pointer flex-1 transition-colors duration-300 relative`,
                                        {
                                            "ring-[#b33b00]":
                                                activeDifficulty === "medium",
                                            "ring-[#FFD6C1]/30 hover:bg-[#FFD6C1]/30":
                                                activeDifficulty !== "medium",
                                        }
                                    )}
                                >
                                    {activeDifficulty === "medium" && (
                                        <motion.div
                                            style={{
                                                borderTopLeftRadius: 0,
                                                borderBottomLeftRadius: 0,
                                                borderBottomRightRadius: 0,
                                                borderTopRightRadius: 0,
                                            }}
                                            layoutId="difficulty-indicator"
                                            className="absolute inset-0 bg-[#b33b00] z-1"
                                        />
                                    )}
                                    <span className="absolute inset-0 flex items-center justify-center z-2">
                                        Medium
                                    </span>
                                </button>
                                <button
                                    data-difficulty="hard"
                                    onClick={handleDifficultyChange}
                                    className={classNames(
                                        `h-12 ring cursor-pointer flex-1 transition-colors duration-300 relative rounded-br-md rounded-tr-md`,
                                        {
                                            "ring-[#b33b00]":
                                                activeDifficulty === "hard",
                                            "ring-[#FFD6C1]/30 hover:bg-[#FFD6C1]/30":
                                                activeDifficulty !== "hard",
                                        }
                                    )}
                                >
                                    {activeDifficulty === "hard" && (
                                        <motion.div
                                            style={{
                                                borderTopLeftRadius: 0,
                                                borderBottomLeftRadius: 0,
                                                borderBottomRightRadius: 6,
                                                borderTopRightRadius: 6,
                                            }}
                                            layoutId="difficulty-indicator"
                                            className="absolute inset-0 bg-[#b33b00] z-1"
                                        />
                                    )}
                                    <span className="absolute inset-0 flex items-center justify-center z-2">
                                        Hard
                                    </span>
                                </button>
                            </div>

                            <div className="text-[#FFD6C1] flex">
                                <button
                                    data-locale="en"
                                    onClick={handleLocaleChange}
                                    className={classNames(
                                        `h-12 ring cursor-pointer flex-1 transition-colors duration-300 relative rounded-bl-md rounded-tl-md`,
                                        {
                                            "ring-[#b33b00]":
                                                activeLocale === "en",
                                            "ring-[#FFD6C1]/30 hover:bg-[#FFD6C1]/30":
                                                activeLocale !== "en",
                                        }
                                    )}
                                >
                                    {activeLocale === "en" && (
                                        <motion.div
                                            style={{
                                                borderTopLeftRadius: 6,
                                                borderBottomLeftRadius: 6,
                                                borderBottomRightRadius: 0,
                                                borderTopRightRadius: 0,
                                            }}
                                            layoutId="locale-indicator"
                                            className="absolute inset-0 bg-[#b33b00] z-1"
                                        />
                                    )}
                                    <span className="absolute inset-0 flex items-center justify-center z-2">
                                        English
                                    </span>
                                </button>
                                <button
                                    data-locale="fr"
                                    onClick={handleLocaleChange}
                                    className={classNames(
                                        `h-12 ring cursor-pointer flex-1 transition-colors duration-300 relative rounded-br-md rounded-tr-md`,
                                        {
                                            "ring-[#b33b00]":
                                                activeLocale === "fr",
                                            "ring-[#FFD6C1]/30 hover:bg-[#FFD6C1]/30":
                                                activeLocale !== "fr",
                                        }
                                    )}
                                >
                                    {activeLocale === "fr" && (
                                        <motion.div
                                            style={{
                                                borderTopLeftRadius: 0,
                                                borderBottomLeftRadius: 0,
                                                borderBottomRightRadius: 6,
                                                borderTopRightRadius: 6,
                                            }}
                                            layoutId="locale-indicator"
                                            className="absolute inset-0 bg-[#b33b00] z-1"
                                        />
                                    )}
                                    <span className="absolute inset-0 flex items-center justify-center z-2">
                                        Français
                                    </span>
                                </button>
                            </div>

                            <div className="text-[#FFD6C1] grid grid-cols-[100px_1fr] gap-x-4 gap-y-10 items-center">
                                <label htmlFor="show-timer">Show Timer</label>
                                <InputSwitch name="show-timer" value={settings.showTimer} onChange={handleShowTimerChange} />

                                <label htmlFor="show-fps">Show FPS</label>
                                <InputSwitch name="show-fps" value={settings.showFps} onChange={handleShowFpsChange} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default memo(Settings);
