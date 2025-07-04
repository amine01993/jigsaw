import Header from "@/components/header";
import GameScreen from "@/components/game-screen";
import Settings from "@/components/settings";
import PuzzleItemsOptions from "@/components/puzzle-items-options";
import Help from "@/components/help";

const Game = () => {

    return (
        <div className="bg-linear-300 from-[#caf0f8] via-white to-[#caf0f8] dark:from-black dark:via-[#072083] dark:to-black w-full h-screen relative transition-colors duration-300">
            <Header />

            <GameScreen />

            <Settings />
            <PuzzleItemsOptions />
            <Help />
        </div>
    );
};

export default Game;
