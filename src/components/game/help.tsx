import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useGame } from "@/contexts/game";
import Modal from "@/components/utilities/modal";

const Help = () => {
    const { t } = useTranslation();
    const { openHelp, setOpenHelp } = useGame();

    const handleClose = useCallback(() => {
        setOpenHelp(false);
    }, []);

    return (
        <Modal isOpen={openHelp} onClose={handleClose}>
            <h2 className="text-[#072083] dark:text-[#FFD6C1] text-2xl font-bold sm:text-center">
                {t("Help")}
            </h2>

            <div className="flex flex-col gap-10 mt-10">
                <p className="text-[#072083] dark:text-[#FFD6C1]">
                    <span className="font-semibold">
                        {t("Drag and drop: ")}
                    </span>
                    {t(
                        "Use drag & drop to position the pieces of the puzzle. On Touch screens, the dragged piece will show a bit higher for a better visibility."
                    )}
                </p>
                <p className="text-[#072083] dark:text-[#FFD6C1]">
                    <span className="font-semibold">{t("Keyboard: ")}</span>
                    {t(
                        "Use Tab to switch between pieces. Use Space or Enter to select a piece and to place a piece. Use arrow keys to move the pieces of the puzzle. Use Escape to deselect a piece."
                    )}
                </p>
                <p className="text-[#072083] dark:text-[#FFD6C1]">
                    <span className="font-semibold">{t("Pause: ")}</span>
                    {t(
                        "Click on the timer or press P to pause the game. The timer is paused automatically when you open a modal, switch to another tab, or minimize the window."
                    )}
                </p>
                <p className="text-[#072083] dark:text-[#FFD6C1] font-semibold">
                    {t("Shortcut keys: ")}
                </p>
                <table className="w-full text-[#072083] dark:text-[#FFD6C1] border-collapse">
                    <thead>
                        <tr>
                            <th className="border-1 p-2">{t("Key")}</th>
                            <th className="border-1 p-2">{t("Description")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border-1 p-2">P</td>
                            <td className="border-1 p-2">
                                {t("Pause the game")}
                            </td>
                        </tr>
                        <tr>
                            <td className="border-1 p-2">R</td>
                            <td className="border-1 p-2">
                                {t("Restart the game")}
                            </td>
                        </tr>
                        <tr>
                            <td className="border-1 p-2">H</td>
                            <td className="border-1 p-2">{t("Open help")}</td>
                        </tr>
                        <tr>
                            <td className="border-1 p-2">D</td>
                            <td className="border-1 p-2">
                                {t("Change the puzzle size")}
                            </td>
                        </tr>
                        <tr>
                            <td className="border-1 p-2">S</td>
                            <td className="border-1 p-2">
                                {t("Open the settings")}
                            </td>
                        </tr>
                        <tr>
                            <td className="border-1 p-2">M</td>
                            <td className="border-1 p-2">
                                {t("Turn sound on/off")}
                            </td>
                        </tr>
                        <tr>
                            <td className="border-1 p-2">Esc</td>
                            <td className="border-1 p-2">
                                {t("Close modal or unpause the game")}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Modal>
    );
};

export default memo(Help);
