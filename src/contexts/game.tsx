import { createContext, useContext, type Dispatch } from "react";
import type { PuzzlePiece } from "../components/puzzle-item";

export type DifficultyLevel = "easy" | "medium" | "hard";
export type LocaleType = "en" | "fr";
export type OffsetType = {
    top: number;
    left: number;
    bottom: number;
    right: number;
};
export type SettingType = {
    difficulty: DifficultyLevel;
    locale: LocaleType;
    showTimer: boolean;
    showFps: boolean;
};

type GameContextType = {
    level: number;
    setLevel: Dispatch<React.SetStateAction<number>>;
    settings: SettingType;
    setSettings: Dispatch<React.SetStateAction<SettingType>>;
    openSettings: boolean;
    setOpenSettings: Dispatch<React.SetStateAction<boolean>>;
    puzzlePieces: (PuzzlePiece | null)[];
    setPuzzlePieces: Dispatch<React.SetStateAction<(PuzzlePiece | null)[]>>;
    isLoading: boolean;
    setIsLoading: Dispatch<React.SetStateAction<boolean>>;
    gameInitialized: boolean;
    setGameInitialized: Dispatch<React.SetStateAction<boolean>>;
    offset: OffsetType;
    setOffset: Dispatch<React.SetStateAction<OffsetType>>;
    started: boolean;
    setStarted: Dispatch<React.SetStateAction<boolean>>;
    isPaused: boolean;
    setIsPaused: Dispatch<React.SetStateAction<boolean>>;
    puzzleDims: { cols: number; rows: number };
    gridPadding: { x: number; y: number };
    gridDims: { cols: number; rows: number };
};

export const GameContext = createContext<GameContextType | undefined>(
    undefined
);

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGame must be used within a GameProvider");
    }
    return context;
};
