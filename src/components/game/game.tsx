import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import {
    GameContext,
    type OffsetType,
    type SettingType,
} from "@/contexts/game";
import { clearGameProgress, getGridDims, getGridPadding, getIndexFromCoords, getPuzzleDims } from "@/helpers/helper";
import Header from "@/components/game/header";
import GameScreen from "@/components/game/game-screen";
import Settings from "@/components/game/settings";
import PuzzleItemsOptions from "@/components/game/puzzle-items-options";
import Help from "@/components/game/help";
import type { PuzzlePlaceholder } from "./puzzle-item-empty";
import type { PuzzlePiece } from "./puzzle-item";

const Game = () => {
    const { gameId } = useParams();
    const [started, setStarted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [playTime, setPlayTime] = useState(0);
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

    const handleRestartGame = useCallback(() => {
        setOpenMobileMenu(false);

        const newGamePieces: (PuzzlePiece | null)[] = Array.from(
            {
                length: puzzlePieces.length,
            },
            () => null
        );

        for (const piece of puzzlePieces) {
            if (piece) {
                const newIndex = getIndexFromCoords(
                    piece.outsidePosition.x + gridPadding.x,
                    piece.outsidePosition.y + gridPadding.y,
                    gridDims.rows,
                    gridDims.cols
                );
                newGamePieces[newIndex] = {
                    ...piece,
                    position: null,
                };
            }
        }

        setPuzzlePieces(newGamePieces);
        setStarted(false);

        if (gameId) {
            clearGameProgress(gameId, puzzleItemsNumber);
        }
    }, [puzzlePieces, gridPadding, gridDims, gameId, puzzleItemsNumber]);

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
            } else if (e.key === "R" || e.key === "r") {
                handleRestartGame();
            } else if (e.key === "H" || e.key === "h") {
                setOpenSettings(false);
                setOpenPuzzleItemsOptions(false);
                setOpenHelp(true);
            } else if (e.key === "D" || e.key === "d") {
                setOpenHelp(false);
                setOpenSettings(false);
                setOpenPuzzleItemsOptions(true);
            } else if (e.key === "S" || e.key === "s") {
                setOpenPuzzleItemsOptions(false);
                setOpenHelp(false);
                setOpenSettings(true);
            } else if (e.key === "M" || e.key === "m") {
                setSettings((prev) => ({
                    ...prev,
                    playSound: !prev.playSound,
                }));
            }
        },
        [openSettings, openPuzzleItemsOptions, openHelp, handleRestartGame]
    );

    const handleVisibilityChange = useCallback(() => {
        setIsVisible(document.visibilityState === "visible");
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
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.removeProperty("overflow");
        };
    }, []);

    return (
        <GameContext.Provider
            value={{
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
                playTime,
                setPlayTime,
                isVisible,
                setIsVisible,
                placeholders,
                setPlaceholders,
                puzzleDims,
                gridPadding,
                gridDims,
                isGameComplete,
                handleRestartGame,
            }}
        >
            <div className="bg-linear-300 from-[#caf0f8] via-white to-[#caf0f8] dark:from-black dark:via-[#072083] dark:to-black w-full h-screen relative transition-colors duration-300">
                <Header />

                <GameScreen />

                <Settings />
                <PuzzleItemsOptions />
                <Help />
            </div>
        </GameContext.Provider>
    );
};

export default Game;
