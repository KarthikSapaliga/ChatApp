import { useTheme } from "@/contexts/ThemeContext";

import { Sun } from "lucide-react";
import { Moon } from "lucide-react";

function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };
    return (
        <div
            onClick={toggleTheme}
            className="border p-2 border-stroke  dark:border-strokedark rounded-md cursor-pointer relative group hover:bg-light1 dark:hover:bg-dark3"
        >
            {theme === "light" ? (
                <Moon size={20} className="text-fgclr" />
            ) : (
                <Sun size={20} className="text-fgclr" />
            )}
        </div>
    );
}

export default ThemeToggle;
