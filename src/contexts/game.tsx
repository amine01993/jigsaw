import { createContext, useContext, type Dispatch } from "react";
import type { PuzzlePiece } from "@/components/puzzle-item";
import type { PuzzlePlaceholder } from "@/components/puzzle-item-empty";

export type LocaleType = "en" | "fr";
export type OffsetType = {
    top: number;
    left: number;
    bottom: number;
    right: number;
};
export type SettingType = {
    locale: LocaleType;
    showTimer: boolean;
    showFps: boolean;
    playSound: boolean;
    showHints: boolean;
};
export interface GameData {
    pieces: (PuzzlePiece | null)[];
    placeholders: PuzzlePlaceholder[];
    offset: OffsetType;
}

type GameContextType = {
    level: number;
    setLevel: Dispatch<React.SetStateAction<number>>;
    puzzleItemsNumber: number;
    setPuzzleItemsNumber: Dispatch<React.SetStateAction<number>>;
    openPuzzleItemsOptions: boolean;
    setOpenPuzzleItemsOptions: Dispatch<React.SetStateAction<boolean>>;
    setSettings: Dispatch<React.SetStateAction<SettingType>>;
    openSettings: boolean;
    setOpenSettings: Dispatch<React.SetStateAction<boolean>>;
    openHelp: boolean;
    setOpenHelp: Dispatch<React.SetStateAction<boolean>>;
    openMobileMenu: boolean;
    setOpenMobileMenu: Dispatch<React.SetStateAction<boolean>>;
    settings: SettingType;
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
    isVisible: boolean;
    setIsVisible: Dispatch<React.SetStateAction<boolean>>;
    placeholders: PuzzlePlaceholder[];
    setPlaceholders: Dispatch<React.SetStateAction<PuzzlePlaceholder[]>>;
    puzzleDims: { cols: number; rows: number };
    gridPadding: { x: number; y: number };
    gridDims: { cols: number; rows: number };
    isGameComplete: boolean;
    handleNextLevel: () => void;
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
