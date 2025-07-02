import { memo, useCallback, useRef, useState } from "react";
import { motion } from "motion/react";
import classNames from "classnames";
import { useGame } from "@/contexts/game";
import Modal from "@/components/utilities/modal";
import { useTranslation } from "react-i18next";

const PuzzleItemsOptions = () => {
    console.log("PuzzleItemsOptions rendered");
    const { t } = useTranslation();
    const {
        puzzleItemsNumber,
        openPuzzleItemsOptions,
        setOpenPuzzleItemsOptions,
        setPuzzleItemsNumber,
        setGameInitialized,
    } = useGame();
    const optionTimeout = useRef<NodeJS.Timeout | null>(null);
    const [puzzleOption, setPuzzleOption] = useState(puzzleItemsNumber);

    const options = useRef([
        { number: 9, label: "3x3" },
        { number: 16, label: "4x4" },
        { number: 25, label: "5x5" },
        { number: 36, label: "6x6" },
        { number: 49, label: "7x7" },
        { number: 64, label: "8x8" },
        { number: 81, label: "9x9" },
        { number: 100, label: "10x10" },
        { number: 121, label: "11x11" },
        { number: 144, label: "12x12" },
        { number: 169, label: "13x13" },
        { number: 196, label: "14x14" },
        { number: 225, label: "15x15" },
        { number: 256, label: "16x16" },
    ]);

    const handleClose = useCallback(() => {
        console.log("Close puzzle items options");
        setOpenPuzzleItemsOptions(false);
    }, []);

    const handlePuzzleItemsChange = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            const number = e.currentTarget.dataset.number;
            if (!number) return;

            setPuzzleOption(Number(number));
            setGameInitialized(false);

            if (optionTimeout.current) {
                clearTimeout(optionTimeout.current);
            }

            optionTimeout.current = setTimeout(() => {
                setPuzzleItemsNumber(Number(number));
                optionTimeout.current = null;
            }, 300);
        },
        []
    );

    return (
        <Modal isOpen={openPuzzleItemsOptions} onClose={handleClose}>
            <h2 className="text-[#FFD6C1] text-2xl font-bold sm:text-center">
                {t("Puzzle Size")}
            </h2>

            <div className="text-[#FFD6C1] grid grid-cols-3 mt-10">
                {options.current.map((option, index) => {
                    const firstRow = index < 3;
                    const lastRow = index >= options.current.length - 3;
                    const firstColumn = index % 3 === 0;
                    const lastColumn = index % 3 === 2;

                    return (
                        <button
                            key={`option-${option.number}`}
                            data-number={option.number}
                            onClick={handlePuzzleItemsChange}
                            className={classNames(
                                "h-12 ring cursor-pointer flex-1 transition-colors duration-300 relative",
                                {
                                    "rounded-tl-md": firstRow && firstColumn,
                                    "rounded-bl-md": lastRow && firstColumn,
                                    "rounded-tr-md": firstRow && lastColumn,
                                    "rounded-br-md": lastRow && lastColumn,
                                },
                                {
                                    "ring-[#b33b00]":
                                        puzzleOption === option.number,
                                    "ring-[#FFD6C1]/30 hover:bg-[#FFD6C1]/30":
                                        puzzleOption !== option.number,
                                }
                            )}
                        >
                            {puzzleOption === option.number && (
                                <motion.div
                                    style={{
                                        borderTopLeftRadius:
                                            firstRow && firstColumn ? 6 : 0,
                                        borderBottomLeftRadius:
                                            lastRow && firstColumn ? 6 : 0,
                                        borderBottomRightRadius:
                                            lastRow && lastColumn ? 6 : 0,
                                        borderTopRightRadius:
                                            firstRow && lastColumn ? 6 : 0,
                                    }}
                                    layoutId="puzzle-items-indicator"
                                    className="absolute inset-0 bg-[#b33b00] z-1"
                                />
                            )}
                            <span className="absolute inset-0 flex items-center justify-center z-2">
                                {option.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </Modal>
    );
};

export default memo(PuzzleItemsOptions);
