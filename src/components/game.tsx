import { type FC } from "react";
import Settings from "@/components/settings";
import Header from "@/components/header";
import PuzzleItemsOptions from "@/components/puzzle-items-options";
import GameScreen from "@/components/game-screen";

const Game: FC = () => {
    // console.log("Game component rendered");

    return (
        <div className="bg-linear-300 from-black via-[#072083] to-black w-full h-screen relative">
            <Header />

            <GameScreen />

            {/* <div className="mt-10">
                <p className="text-[#FFD6C1] text-center">
                    Use{" "}
                    <span className="bg-[#8f3000] p-1.5 rounded-sm">
                        drag & drop
                    </span>{" "}
                    to position the pieces of the puzzle
                </p>
            </div> */}

            <Settings />
            <PuzzleItemsOptions />
        </div>
    );
};

export default Game;
