import { useEffect, useMemo, useState } from "react";
import "./App.css";
import {
    GameContext,
    type DifficultyLevel,
    type OffsetType,
    type SettingType,
} from "./contexts/game";
import Game from "@/components/game";
import type { PuzzlePiece } from "./components/puzzle-item";
import { MotionConfig } from "motion/react";
import { getGridDims, getGridPadding, getPuzzleDims } from "./helpers/helper";

function App() {
    const [level, setLevel] = useState(1);
    const [started, setStarted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [settings, setSettings] = useState<SettingType>({
        difficulty: "easy" as DifficultyLevel,
        locale: "en",
        showTimer: true,
        showFps: true,
    });
    const [openSettings, setOpenSettings] = useState(false);
    const [puzzlePieces, setPuzzlePieces] = useState<(PuzzlePiece | null)[]>(
        []
    );
    const [isLoading, setIsLoading] = useState(true);
    const [gameInitialized, setGameInitialized] = useState<boolean>(false);
    const [offset, setOffset] = useState<OffsetType>({
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    });

    const puzzleDims = useMemo(() => {
        return getPuzzleDims(settings.difficulty);
    }, [settings.difficulty]);

    const gridPadding = useMemo(() => {
        return getGridPadding(offset);
    }, [offset]);

    const gridDims = useMemo(() => {
        return getGridDims(puzzleDims, gridPadding);
    }, [puzzleDims, gridPadding]);

    useEffect(() => {
        if (openSettings) {
            document.body.style.overflow = "hidden";
            setIsPaused(true);
        } else {
            document.body.style.removeProperty("overflow");
            setIsPaused(false);
        }
    }, [openSettings]);

    return (
        <>
            <GameContext.Provider
                value={{
                    level,
                    setLevel,
                    settings,
                    setSettings,
                    openSettings,
                    setOpenSettings,
                    puzzlePieces,
                    setPuzzlePieces,
                    isLoading,
                    setIsLoading,
                    gameInitialized,
                    setGameInitialized,
                    offset,
                    setOffset,
                    started,
                    setStarted,
                    isPaused,
                    setIsPaused,
                    puzzleDims,
                    gridPadding,
                    gridDims,
                }}
            >
                <MotionConfig
                    transition={{
                        duration: 0.3,
                        type: "tween",
                        ease: "easeInOut",
                    }}
                >
                    <Game />
                </MotionConfig>
            </GameContext.Provider>
        </>
    );
}

export default App;
