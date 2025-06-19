import { useMemo, useState } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import { GameContext } from "./contexts/game";
import Game from "@/components/game";
import type { DifficultyLevel } from "./components/game";
import type { PuzzlePiece } from "./components/puzzle-item";
import { MotionConfig } from "motion/react";

function App() {
    const [level, setLevel] = useState(1);
    const [difficulty, setDifficulty] = useState<DifficultyLevel>("easy");
    const [fps, setFps] = useState(60);
    const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>([]);
    const [puzzleGrid, setPuzzleGrid] = useState<(PuzzlePiece | null)[][]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [gameInitialized, setGameInitialized] = useState<boolean>(false);
    const [offset, setOffset] = useState<{
        top: number;
        left: number;
        bottom: number;
        right: number;
    }>({
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    });

    const puzzleGridCols = useMemo(() => {
        switch (difficulty) {
            case "medium":
                return 5;
            case "hard":
                return 7;
            default:
                return 3;
        }
    }, [difficulty]);

    const puzzleGridRows = useMemo(() => {
        switch (difficulty) {
            case "medium":
                return 5;
            case "hard":
                return 7;
            default:
                return 3;
        }
    }, [difficulty]);

    return (
        <GameContext.Provider
            value={{
                level,
                setLevel,
                difficulty,
                setDifficulty,
                fps,
                setFps,
                puzzlePieces,
                setPuzzlePieces,
                isLoading,
                setIsLoading,
                gameInitialized,
                setGameInitialized,
                puzzleGrid,
                setPuzzleGrid,
                offset,
                setOffset,
                puzzleGridCols,
                puzzleGridRows,
            }}
        >
            <MotionConfig
                transition={{ duration: 2, type: "tween", ease: "easeInOut" }}
            >
                <Game />
            </MotionConfig>
        </GameContext.Provider>
    );
}

export default App;
