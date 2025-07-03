import { useCallback, useEffect, useMemo, useState } from "react";
import { MotionConfig } from "motion/react";
import {
    GameContext,
    type OffsetType,
    type SettingType,
} from "@/contexts/game";
import Game from "@/components/game";
import type { PuzzlePiece } from "@/components/puzzle-item";
import { getGridDims, getGridPadding, getPuzzleDims } from "@/helpers/helper";
import ANIME_IMAGES from "@/data/images.json";
import "./App.css";

function App() {
    const [level, setLevel] = useState(0);
    const [started, setStarted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [puzzleItemsNumber, setPuzzleItemsNumber] = useState(9);
    const [openPuzzleItemsOptions, setOpenPuzzleItemsOptions] = useState(false);
    const [openSettings, setOpenSettings] = useState(false);
    const [openHelp, setOpenHelp] = useState(false);
    const [openMobileMenu, setOpenMobileMenu] = useState(false);
    const [settings, setSettings] = useState<SettingType>({
        locale: "en",
        showTimer: true,
        showFps: true,
        showHints: true,
        playSound: true,
    });
    const [puzzlePieces, setPuzzlePieces] = useState<(PuzzlePiece | null)[]>(
        []
    );
    const [isLoading, setIsLoading] = useState(true);
    const [gameInitialized, setGameInitialized] = useState(false);
    const [offset, setOffset] = useState<OffsetType>({
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    });
    const [placeholders, setPlaceholders] = useState<
        { x: number; y: number; imageUrl: string }[]
    >([]);

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
        setLevel((level + 1) % ANIME_IMAGES.length);
        setGameInitialized(false);
        setStarted(false);
        setIsPaused(false);
        setOpenMobileMenu(false);
    }, [level]);

    const handleVisibilityChange = useCallback(() => {
        setIsVisible(document.visibilityState === "visible");
    }, []);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        console.log("Key pressed:", e.key);
        if (e.key === "Escape") {
            if (openSettings || openPuzzleItemsOptions || openHelp) {
                setOpenSettings(false);
                setOpenPuzzleItemsOptions(false);
                setOpenHelp(false);
            } else {
                setIsPaused(false);
            }
        } else if (e.key === "P" || e.key === "p") {
            setIsPaused(true);
        } else if (e.key === "H" || e.key === "h") {
            setOpenHelp(true);
        } else if (e.key === "D" || e.key === "d") {
            setOpenPuzzleItemsOptions(true);
        } else if (e.key === "S" || e.key === "s") {
            setOpenSettings(true);
        } else if (e.key === "M" || e.key === "m") {
            setSettings((prev) => ({
                ...prev,
                playSound: !prev.playSound,
            }));
        }
    }, [openSettings, openPuzzleItemsOptions, openHelp]);

    useEffect(() => {
        if (openSettings || openPuzzleItemsOptions || openHelp) {
            document.body.style.overflow = "hidden";
            setOpenMobileMenu(false);
        } else {
            document.body.style.removeProperty("overflow");
        }
    }, [openSettings, openPuzzleItemsOptions, openHelp]);

    useEffect(() => {
        document.addEventListener("visibilitychange", handleVisibilityChange);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleVisibilityChange, handleKeyDown]);

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
                    openSettings,
                    setOpenSettings,
                    openHelp,
                    setOpenHelp,
                    openMobileMenu,
                    setOpenMobileMenu,
                    settings,
                    setSettings,
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
                    isVisible,
                    setIsVisible,
                    puzzleDims,
                    gridPadding,
                    gridDims,
                    isGameComplete,
                    placeholders,
                    setPlaceholders,
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
