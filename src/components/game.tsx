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

            {/* <div className="absolute w-[min(500px, 90%);] bottom-4 left-1/2 -translate-x-1/2 border-3 border-[#8f3000] rounded-md text-[#8f3000] bg-[#FFD6C1] p-4 flex gap-4 items-center">
                <p className="font-semibold">
                    Well done! Let's get to the next puzzle...
                </p>{" "}
                <GiFastForwardButton size={20} />
            </div> */}

            <Settings />
            <PuzzleItemsOptions />
        </div>
    );
};

export default Game;
