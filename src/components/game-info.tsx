import { useGame } from "@/contexts/game";
import { getDurationFromSeconds } from "@/helpers/helper";
import { memo, useEffect, useMemo, useState } from "react";
import GameFPS from "./game-fps";
import { useTranslation } from "react-i18next";

const GameInfo = () => {
    // console.log("GameInfo rendered");
    const { t } = useTranslation();
    const { settings, started, isPaused } = useGame();
    const [playTime, setPlayTime] = useState(0);

    const playTimeDisplay = useMemo(() => {
        return getDurationFromSeconds(playTime);
    }, [playTime]);

    // Update the play time
    useEffect(() => {
        let timeout: NodeJS.Timeout | null = null;
        if (started && !isPaused) {
            timeout = setTimeout(() => {
                setPlayTime((prev) => prev + 1);
            }, 1000);
        }

        return () => {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
        };
    }, [isPaused, started, playTime]);

    return (
        <div className="flex items-center text-[#FFD6C1] absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-[calc(50%+30px)] w-[200px]">
            {settings.showTimer && <p className="text-md w-[90px]" aria-label={t("Play time")}>{playTimeDisplay}</p>}
            {settings.showFps && <GameFPS />}
        </div>
    );
};

export default memo(GameInfo);
