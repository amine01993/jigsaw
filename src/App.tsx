import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import {
    GameContext,
    type OffsetType,
    type SettingType,
} from "./contexts/game";
import Game from "@/components/game";
import type { PuzzlePiece } from "./components/puzzle-item";
import { MotionConfig } from "motion/react";
import { getGridDims, getGridPadding, getPuzzleDims } from "./helpers/helper";
import ANIME_IMAGES from "./data/images.json";

function App() {
    const [level, setLevel] = useState(1);
    const [started, setStarted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [puzzleItemsNumber, setPuzzleItemsNumber] = useState<number>(9);
    const [openPuzzleItemsOptions, setOpenPuzzleItemsOptions] =
        useState<boolean>(false);
    const [settings, setSettings] = useState<SettingType>({
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
        return getPuzzleDims(puzzleItemsNumber);
    }, [puzzleItemsNumber]);

    const gridPadding = useMemo(() => {
        return getGridPadding(offset);
    }, [offset]);

    const gridDims = useMemo(() => {
        return getGridDims(puzzleDims, gridPadding);
    }, [puzzleDims, gridPadding]);

    const isGameComplete = useMemo(() => {
        if (puzzlePieces.length > 0) {
            console.log("isGameComplete puzzlePieces", puzzlePieces)
            for (const piece of puzzlePieces) {
                if (
                    piece &&
                    (!piece.position ||
                        piece.correctPosition.x !== piece.position.x ||
                        piece.correctPosition.y !== piece.position.y)
                ) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }, [puzzlePieces]);

    // Pass to the next level
    const handleNextLevel = useCallback(() => {
        console.log("handleNextLevel");
        if (level + 1 < ANIME_IMAGES.length) {
            setLevel(level + 1);
            setGameInitialized(false);
        }
    }, [level]);

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
                    puzzleItemsNumber,
                    setPuzzleItemsNumber,
                    openPuzzleItemsOptions,
                    setOpenPuzzleItemsOptions,
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
                    isGameComplete,
                    handleNextLevel,
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
