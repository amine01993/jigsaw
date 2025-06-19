import { createContext, useContext, type Dispatch } from 'react';
import type { DifficultyLevel } from '../components/game';
import type { PuzzlePiece } from '../components/puzzle-item';

type GameContextType = {
    level: number;
    setLevel: Dispatch<React.SetStateAction<number>>;
    difficulty: DifficultyLevel;
    setDifficulty: Dispatch<React.SetStateAction<DifficultyLevel>>;
    fps: number;
    setFps: Dispatch<React.SetStateAction<number>>;
    puzzlePieces: PuzzlePiece[];
    setPuzzlePieces: Dispatch<React.SetStateAction<PuzzlePiece[]>>;
    puzzleGrid: (PuzzlePiece | null)[][];
    setPuzzleGrid: Dispatch<React.SetStateAction<(PuzzlePiece | null)[][]>>;
    isLoading: boolean;
    setIsLoading: Dispatch<React.SetStateAction<boolean>>;
    gameInitialized: boolean;
    setGameInitialized: Dispatch<React.SetStateAction<boolean>>;
    offset: { top: number; left: number; bottom: number; right: number };
    setOffset: Dispatch<React.SetStateAction<{ top: number; left: number; bottom: number; right: number }>>;
    puzzleGridCols: number;
    puzzleGridRows: number;
};

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};