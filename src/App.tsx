import { useCallback, useEffect, useMemo, useState } from "react";
import {
    AppContext,
    type ThemeType,
} from "@/contexts/app";
import Game from "@/components/game";
import "./App.css";
import Gallery from "./components/gallery";

const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

type Page = "home" | "game";

function App() {
    const [page, setPage] = useState<Page>("home");
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
            }}>
            {page === "home" && (
                <Gallery />
            )}
            {page === "game" && (
                <Game />
            )}
        </AppContext.Provider>
    );
}

export default App;
