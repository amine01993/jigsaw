import { memo, useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { GiPauseButton, GiPlayButton } from "react-icons/gi";
import { AnimatePresence, motion } from "motion/react";
import { useGame } from "@/contexts/game";
import { getDurationFromSeconds } from "@/helpers/helper";
import GameFPS from "./game-fps";

const GameInfo = () => {
    const { t } = useTranslation();
    const {
        settings,
        started,
        isPaused,
        isVisible,
        openHelp,
        openPuzzleItemsOptions,
        openSettings,
        isGameComplete,
        playTime,
        setPlayTime,
        setIsPaused,
        setStarted,
    } = useGame();

    const playTimeDisplay = useMemo(() => {
        return getDurationFromSeconds(playTime);
    }, [playTime]);

    const isGamePaused = useMemo(() => {
        return (
            isPaused ||
            !started ||
            !isVisible ||
            openHelp ||
            openPuzzleItemsOptions ||
            openSettings
        );
    }, [
        isPaused,
        started,
        isVisible,
        openHelp,
        openPuzzleItemsOptions,
        openSettings,
    ]);

    const togglePause = useCallback(() => {
        setIsPaused((prev) => !prev);
    }, [isPaused]);

    // Update the play time
    useEffect(() => {
        let timeout: NodeJS.Timeout | null = null;
        if (!isGamePaused) {
            timeout = setTimeout(() => {
                setPlayTime((prev) => prev + 1);
            }, 1000);
        }

        if (!started) {
            setPlayTime(0);
        }

        return () => {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
        };
    }, [isGamePaused, started, playTime]);

    useEffect(() => {
        if (isGameComplete) {
            setStarted(false);
        }
    }, [isGameComplete]);

    return (
        <div className="flex items-center text-[#072083] dark:text-[#FFD6C1] w-[200px] transition-colors duration-300">
            {settings.showTimer && (
                <button
                    className="text-md w-[90px] cursor-pointer flex flex-row items-center gap-2"
                    aria-label={t("Play time")}
                    onClick={togglePause}
                >
                    <AnimatePresence mode="wait">
                        {isGamePaused && (
                            <motion.span
                                key="play-button"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                <GiPlayButton size={25} />
                            </motion.span>
                        )}
                        {!isGamePaused && (
                            <motion.span
                                key="pause-button"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                <GiPauseButton size={25} />
                            </motion.span>
                        )}
                    </AnimatePresence>
                    {playTimeDisplay}
                </button>
            )}
            {settings.showFps && <GameFPS />}
        </div>
    );
};

export default memo(GameInfo);
