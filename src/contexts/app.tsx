import { createContext, useContext, type Dispatch } from "react";

export type ThemeType = "dark" | "light" | "system";

type AppContextType = {
    theme: ThemeType;
    setTheme: Dispatch<React.SetStateAction<ThemeType>>;
    userTheme: ThemeType;
};

export const AppContext = createContext<AppContextType | undefined>(
    undefined
);

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
};
