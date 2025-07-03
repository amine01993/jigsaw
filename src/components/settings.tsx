import { memo, useCallback } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { useGame } from "@/contexts/game";
import InputSwitch from "@/components/utilities/input-switch";
import Modal from "@/components/utilities/modal";

const Settings = () => {
    const { t, i18n } = useTranslation();
    const { settings, openSettings, setOpenSettings, setSettings } = useGame();

    const handleClose = useCallback(() => {
        setOpenSettings(false);
    }, []);

    const handleLocaleChange = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            const locale = e.currentTarget.dataset.locale;
            if (!locale) return;

            setSettings((prevSettings) => {
                return {
                    ...prevSettings,
                    locale: locale as "en" | "fr",
                };
            });
            i18n.changeLanguage(locale);
        },
        []
    );

    const handleShowTimerChange = useCallback((value: boolean) => {
        setSettings((prevSettings) => ({
            ...prevSettings,
            showTimer: value,
        }));
    }, []);

    const handleShowFpsChange = useCallback((value: boolean) => {
        setSettings((prevSettings) => ({
            ...prevSettings,
            showFps: value,
        }));
    }, []);

    const handleShowHintsChange = useCallback((value: boolean) => {
        setSettings((prevSettings) => ({
            ...prevSettings,
            showHints: value,
        }));
    }, []);

    return (
        <Modal isOpen={openSettings} onClose={handleClose}>
            <h2 className="text-[#FFD6C1] text-2xl font-bold sm:text-center">
                {t("Settings")}
            </h2>

            <div className="flex flex-col gap-10 mt-10">
                <div className="text-[#FFD6C1] flex">
                    <button
                        data-locale="en"
                        onClick={handleLocaleChange}
                        className={classNames(
                            `h-12 ring cursor-pointer flex-1 transition-colors duration-300 relative rounded-bl-md rounded-tl-md`,
                            {
                                "ring-[#b33b00]": settings.locale === "en",
                                "ring-[#FFD6C1]/30 hover:bg-[#FFD6C1]/30":
                                    settings.locale !== "en",
                            }
                        )}
                    >
                        {settings.locale === "en" && (
                            <motion.div
                                style={{
                                    borderTopLeftRadius: 6,
                                    borderBottomLeftRadius: 6,
                                    borderBottomRightRadius: 0,
                                    borderTopRightRadius: 0,
                                }}
                                layoutId="locale-indicator"
                                className="absolute inset-0 bg-[#b33b00] z-1"
                            />
                        )}
                        <span className="absolute inset-0 flex items-center justify-center z-2">
                            English
                        </span>
                    </button>
                    <button
                        data-locale="fr"
                        onClick={handleLocaleChange}
                        className={classNames(
                            `h-12 ring cursor-pointer flex-1 transition-colors duration-300 relative rounded-br-md rounded-tr-md`,
                            {
                                "ring-[#b33b00]": settings.locale === "fr",
                                "ring-[#FFD6C1]/30 hover:bg-[#FFD6C1]/30":
                                    settings.locale !== "fr",
                            }
                        )}
                    >
                        {settings.locale === "fr" && (
                            <motion.div
                                style={{
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0,
                                    borderBottomRightRadius: 6,
                                    borderTopRightRadius: 6,
                                }}
                                layoutId="locale-indicator"
                                className="absolute inset-0 bg-[#b33b00] z-1"
                            />
                        )}
                        <span className="absolute inset-0 flex items-center justify-center z-2">
                            Français
                        </span>
                    </button>
                </div>

                <div className="text-[#FFD6C1] grid grid-cols-[200px_1fr] gap-x-4 gap-y-10 items-center">
                    <label htmlFor="show-timer">{t("Show Timer")}</label>
                    <InputSwitch
                        name="show-timer"
                        value={settings.showTimer}
                        onChange={handleShowTimerChange}
                    />

                    <label htmlFor="show-fps">{t("Show FPS")}</label>
                    <InputSwitch
                        name="show-fps"
                        value={settings.showFps}
                        onChange={handleShowFpsChange}
                    />

                    <label htmlFor="show-hints">{t("Show Hints")}</label>
                    <InputSwitch
                        name="show-hints"
                        value={settings.showHints}
                        onChange={handleShowHintsChange}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default memo(Settings);
