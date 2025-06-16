import { toast as reactToast } from "react-hot-toast";

const toast = (type, message) => {
    if (type == "success") {
        reactToast.success(message, {
            duration: 1500,
            position: "top-center",
            className: "bg-gray2 text-black dark:bg-dark2 dark:text-white",
            iconTheme: {
                primary: "green",
            },
        });
    } else if (type == "error") {
        reactToast.error(message, {
            duration: 1500,
            position: "top-center",
            className: "bg-gray2 text-black dark:bg-dark2 dark:text-white",
            iconTheme: {
                primary: "red",
            },
        });
    } else if (type == "msg") {
        reactToast(message, {
            duration: 1500,
            position: "top-center",
            className: "bg-gray2 text-black dark:bg-dark2 dark:text-white",
        });
    }
};

export default toast;
