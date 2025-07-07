import { memo } from "react";
import { useTranslation } from "react-i18next";

const Loading = () => {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 w-full h-screen flex gap-4 items-center justify-center text-[#072083] dark:text-[#caf0f8] bg-linear-300 from-[#caf0f8] via-white to-[#caf0f8] dark:from-black dark:via-[#072083] dark:to-black transition-colors duration-300 z-1000">
            <div className="animate-spin rounded-full size-12 border-2 border-x-[#072083] dark:border-x-[#caf0f8] border-t-transparent border-b-transparent transition-colors duration-300" />
            <p>{ t("Loading...") }</p>
        </div>
    );
}

export default memo(Loading);