import Header from "@/components/header";
import GameScreen from "@/components/game-screen";
import Settings from "@/components/settings";
import PuzzleItemsOptions from "@/components/puzzle-items-options";
import Help from "@/components/help";

const Game = () => {

    return (
        <div className="bg-linear-300 from-black via-[#072083] to-black w-full h-screen relative">
            <Header />

            <GameScreen />

            <Settings />
            <PuzzleItemsOptions />
            <Help />
        </div>
    );
};

export default Game;
