import { useState, useEffect, createContext, useContext } from "react";

const ThemeContext = createContext();

function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("chatApp-theme") || "dark";
    });

    useEffect(() => {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);
        window.localStorage.setItem("chatApp-theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

const useTheme = () => useContext(ThemeContext);

export { ThemeProvider, useTheme };
