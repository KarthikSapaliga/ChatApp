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
            className="mx-auto border border-stroke p-2 dark:border-strokedark rounded-md cursor-pointer relative group hover:bg-gray dark:hover:bg-boxdark-2"
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
