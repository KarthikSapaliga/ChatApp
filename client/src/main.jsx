import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SocketProvider } from "./contexts/SocketContext";

createRoot(document.getElementById("root")).render(
    <SocketProvider>
        <ThemeProvider>
            <App />
            <Toaster />
        </ThemeProvider>
    </SocketProvider>
);
