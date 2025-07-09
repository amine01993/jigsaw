import { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet, Link } from "react-router";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { AppContext, type ThemeType } from "@/contexts/app";
import "./App.css";

export const MotionLink = motion.create(Link);
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

function App() {
    const [systemTheme, setSystemTheme] = useState<ThemeType>(
        mediaQuery.matches ? "dark" : "light"
    );
    const [theme, setTheme] = useState<ThemeType>("system");

    const userTheme = useMemo(() => {
        if (theme === "system") {
            return systemTheme;
        }
        return theme;
    }, [theme, systemTheme]);

    const handleThemeChange = useCallback((event: MediaQueryListEvent) => {
        if (event.matches) {
            setSystemTheme("dark");
        } else {
            setSystemTheme("light");
        }
    }, []);

    useEffect(() => {
        if (userTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [userTheme]);

    useEffect(() => {
        mediaQuery.addEventListener("change", handleThemeChange);
        return () => {
            mediaQuery.removeEventListener("change", handleThemeChange);
        };
    }, []);

    return (
        <AppContext.Provider
            value={{
                theme,
                setTheme,
                userTheme,
            }}
        >
            <MotionConfig
                transition={{
                    duration: 0.3,
                    type: "tween",
                    ease: "easeInOut",
                }}
            >
                <AnimatePresence mode="wait">
                    <Outlet />
                </AnimatePresence>
            </MotionConfig>
        </AppContext.Provider>
    );
}

export default App;
