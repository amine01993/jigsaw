import { useGame } from "@/contexts/game";
import { getDurationFromSeconds } from "@/helpers/helper";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import GameFPS from "./game-fps";
import { useTranslation } from "react-i18next";

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
        setIsPaused,
    } = useGame();
    const [playTime, setPlayTime] = useState(0);

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

    return (
        <div className="flex items-center text-[#072083] dark:text-[#FFD6C1] w-[200px] transition-colors duration-300">
            {settings.showTimer && (
                <button
                    className="text-md w-[90px] cursor-pointer"
                    aria-label={t("Play time")}
                    onClick={togglePause}
                >
                    {playTimeDisplay}
                </button>
            )}
            {settings.showFps && <GameFPS />}
        </div>
    );
};

export default memo(GameInfo);
