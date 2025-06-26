import { useAppStore } from "@/store/store";
import { useNavigate } from "react-router-dom";

import { apiClient } from "@/lib/axios";
import { LOGOUT_ROUTE } from "@/lib/routes";
import toast from "@/lib/toast";

import { LogOut } from "lucide-react";

function ProfileInfo() {
    const { userInfo, setUserInfo } = useAppStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await apiClient.post(
                LOGOUT_ROUTE,
                {},
                { withCredentials: true }
            );

            if (response.status === 200) {
                setUserInfo(undefined);
                navigate("/login");
            }
        } catch (error) {
            console.log(error.message);
            toast("error", "failed to logout");
        }
    };

    return (
        <div className=" bg-light1 dark:bg-dark2 flex gap-2 px-3 py-2 items-center h-[10vh] sm:h-[8vh] shrink-0">
            <div
                className="flex items-center gap-3 flex-1 px-3 py-2 rounded-md cursor-pointer"
                onClick={() => navigate("/profile")}
            >
                {userInfo.image && userInfo.image !== "" ? (
                    <img
                        src={userInfo.image}
                        alt={userInfo.name}
                        className="h-10 w-10 rounded-full object-cover object-center"
                    />
                ) : (
                    <div className="h-10 w-10 flex justify-center items-center rounded-full bg-gray-600 text-white">
                        {userInfo.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                )}

                <div className="flex flex-col leading-[5px]">
                    <p className="text-black dark:text-white font-medium text-sm">
                        {userInfo.name}
                    </p>
                    <p className="text-sm">{userInfo.email}</p>
                </div>
            </div>
            <div
                className="mx-auto border border-stroke dark:border-strokedark cursor-pointer relative group bg-light2 dark:bg-dark3 hover:bg-red hover:dark:bg-red hover:text-white hover:border-none flex items-center justify-center p-3 rounded-md"
                onClick={handleLogout}
            >
                <LogOut size={18} />
            </div>
        </div>
    );
}

export default ProfileInfo