import { useGame } from "@/contexts/game";
import { getDurationFromSeconds } from "@/helpers/helper";
import { memo, useEffect, useMemo, useState } from "react";
import GameFPS from "./game-fps";

const GameInfo = () => {
    console.log("GameInfo rendered");

    const { level, settings, started, isPaused } = useGame();
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
        <div className="flex items-center gap-10">
            <p className="text-md">Level: {level + 1}</p>
            <p className="text-md">Difficulty: {settings.difficulty}</p>
            {settings.showTimer && <p className="text-md">Time: {playTimeDisplay}</p>}
            {settings.showFps && <GameFPS />}
        </div>
    );
};

export default memo(GameInfo);
