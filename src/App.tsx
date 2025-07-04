import { useCallback, useEffect, useMemo, useState } from "react";
import { MotionConfig } from "motion/react";
import {
    GameContext,
    type OffsetType,
    type SettingType,
    type ThemeType,
} from "@/contexts/game";
import { getGridDims, getGridPadding, getPuzzleDims } from "@/helpers/helper";
import Game from "@/components/game";
import type { PuzzlePiece } from "@/components/puzzle-item";
import type { PuzzlePlaceholder } from "./components/puzzle-item-empty";
import ANIME_IMAGES from "@/data/images.json";
import "./App.css";

const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

function App() {
    const [systemTheme, setSystemTheme] = useState<ThemeType>(
        mediaQuery.matches ? "dark" : "light"
    );
    const [theme, setTheme] = useState<ThemeType>("system");
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
        showFps: false,
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
    const [placeholders, setPlaceholders] = useState<PuzzlePlaceholder[]>([]);

    const userTheme = useMemo(() => {
        if (theme === "system") {
            return systemTheme;
        }
        return theme;
    }, [theme, systemTheme]);

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

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
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
        },
        [openSettings, openPuzzleItemsOptions, openHelp]
    );

    const handleThemeChange = useCallback((event: MediaQueryListEvent) => {
        if (event.matches) {
            setSystemTheme("dark");
        } else {
            setSystemTheme("light");
        }
    }, []);

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
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleVisibilityChange, handleKeyDown]);

    useEffect(() => {
        if (userTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [userTheme]);

    useEffect(() => {
        mediaQuery.addEventListener("change", handleThemeChange);
        return () => {
            mediaQuery.removeEventListener("change", handleThemeChange);
        };
    }, []);

    return (
        <>
            <GameContext.Provider
                value={{
                    theme,
                    setTheme,
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
                    placeholders,
                    setPlaceholders,
                    puzzleDims,
                    gridPadding,
                    gridDims,
                    isGameComplete,
                    userTheme,
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
