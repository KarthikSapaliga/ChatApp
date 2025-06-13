import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    UserRound,
    Mail,
    ArrowLeft,
    ImagePlus,
    Trash2,
    Pencil,
} from "lucide-react";

import { useAppStore } from "@/store/store";
import { apiClient } from "@/lib/axios";
import { UPDATE_PROFILE_ROUTE, UPDATE_PROFILE_IMAGE_ROUTE } from "@/lib/routes";
import toast from "@/lib/toast";

function Profile() {
    const navigate = useNavigate();
    const { userInfo, setUserInfo } = useAppStore();

    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [hovered, setHovered] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        setName(userInfo.name || "");
        setImage(userInfo.image || "");
    }, [userInfo]);

    const handleProfileClick = () => {
        fileInputRef.current?.click();
    };

    const handleChangeProfileImage = async (e) => {
        console.log("current image: ", image);

        const formData = new FormData();
        const file = e.target.files[0];

        if (file) {
            formData.append("profileImage", file);
        }

        try {
            const response = await apiClient.post(
                UPDATE_PROFILE_IMAGE_ROUTE,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (response.status === 200) {
                setUserInfo(response.data);
                console.log("updated image: ", userInfo.image);

                toast("success", "Successfully updated the profile image");
                console.log(response.data);
            }
        } catch (error) {
            toast(
                "error",
                error.message || "Failed to update the profile image"
            );
        }
    };

    const handleDeleteProfileImage = async () => {
        try {
            const response = await apiClient.delete(
                UPDATE_PROFILE_IMAGE_ROUTE,
                { withCredentials: true }
            );
            if (response.status === 200) {
                setUserInfo({
                    ...userInfo,
                    image: "",
                });
                setImage("");
            }
        } catch (error) {
            console.error(error);
            toast(
                "error",
                error.response?.message || "Failed to delete the image"
            );
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (name.trim() === "") {
            toast("error", "Name is required");
            return;
        }

        try {
            const response = await apiClient.post(
                UPDATE_PROFILE_ROUTE,
                { name },
                { withCredentials: true }
            );
            if (response.status === 200) {
                setUserInfo(response.data);
                toast("success", "User updated");
                navigate("/chat");
            }
        } catch (error) {
            console.log(error);
            toast("error", error.response?.data?.message || "Failed to update");
        }
    };

    return (
        <div className="w-full bg-gray3 dark:bg-dark1 h-screen relative p-10">
            <div className="flex items-center justify-center h-full overflow-auto no-scrollbar">
                <div className="w-full max-w-[520px] xl:max-w-[800px]">
                    <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                        <div className="w-full p-2 xl:mb-6">
                            <Link to="/login">
                                <ArrowLeft />
                            </Link>
                        </div>
                        <form
                            id="profileForm"
                            className="flex flex-col justify-center items-center gap-8 xl:flex-row xl:gap-12"
                            onSubmit={handleSubmit}
                        >
                            <div
                                className="relative"
                                onMouseEnter={() => setHovered(true)}
                                onMouseLeave={() => setHovered(false)}
                            >
                                {hovered && (
                                    <div className="absolute top-0 left-0 w-full h-full bg-white/80 dark:bg-black/90 rounded-full flex justify-center items-center gap-10">
                                        {image ? (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={handleProfileClick}
                                                >
                                                    <Pencil size={22} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleDeleteProfileImage
                                                    }
                                                >
                                                    <Trash2 size={22} />
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleProfileClick}
                                            >
                                                <ImagePlus size={22} />
                                            </button>
                                        )}
                                    </div>
                                )}
                                <label
                                    htmlFor="profileImage"
                                    className="w-[200px] h-[200px] bg-gray2 dark:bg-dark3 rounded-full flex items-center justify-center overflow-hidden border border-stroke dark:border-strokedark cursor-pointer"
                                >
                                    {image ? (
                                        <img
                                            src={userInfo.image}
                                            alt="Profile"
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <UserRound size={120} />
                                    )}
                                </label>
                                <input
                                    type="file"
                                    accept="image/jpeg, image/png"
                                    ref={fileInputRef}
                                    id="profileImage"
                                    className="hidden"
                                    onChange={handleChangeProfileImage}
                                />
                            </div>
                            <div className="w-full xl:w-[400px]">
                                <div className="relative mb-6">
                                    <input
                                        type="text"
                                        placeholder="Enter Username"
                                        value={name ? name : ""}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-stroke dark:border-strokedark py-3 pl-6 pr-10 bg-gray2 dark:bg-dark3 outline-none focus:border-[2px] focus:border-primary dark:focus:border-primary text-black dark:text-white"
                                    />
                                    <UserRound
                                        size={20}
                                        className="absolute right-4 top-1/2 -translate-y-1/2"
                                    />
                                </div>
                                <div className="relative mb-6">
                                    <input
                                        type="email"
                                        aria-label="Email address"
                                        value={userInfo.email}
                                        disabled={true}
                                        className="w-full rounded-lg border border-stroke dark:border-strokedark py-3 pl-6 pr-10 bg-gray2 dark:bg-dark3 outline-none cursor-not-allowed"
                                    />
                                    <Mail
                                        size={20}
                                        className="absolute right-4 top-1/2 -translate-y-1/2"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-primary text-white rounded-lg"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
