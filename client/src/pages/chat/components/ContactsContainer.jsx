import { useState, useEffect } from "react";
import { useAppStore } from "@/store/store";
import { useNavigate } from "react-router-dom";

import toast from "@/lib/toast";
import { apiClient } from "@/lib/axios";
import {
    GET_CONTACTS_ROUTE,
    GET_USER_CHANNEL_ROUTE,
    LOGOUT_ROUTE,
} from "@/lib/routes";

import ContactList from "./ContactList";
import NewDM from "./NewDM";
import NewChannel from "./NewChannel";

import { MessageCircleMore, Users, LogOut } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

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
        <div className=" bg-light1 dark:bg-dark2 flex gap-2 px-3 py-2">
            <div
                className="flex items-center gap-3 flex-1 bg-light2 dark:bg-dark3 px-3 py-2 rounded-md cursor-pointer border border-stroke p-2 dark:border-strokedark"
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
                className="mx-auto border border-stroke px-3 dark:border-strokedark rounded-md cursor-pointer relative group bg-light2 dark:bg-dark3 hover:bg-red hover:dark:bg-red hover:text-white flex items-center justify-center"
                onClick={handleLogout}
            >
                <LogOut size={18} />
            </div>
        </div>
    );
}

function ContactsContainer() {
    const [activeSection, setActiveSection] = useState("chats");
    const {
        DMContacts,
        setDMContacts,
        channels,
        setChannels,
        selectedChatType,
    } = useAppStore();

    useEffect(() => {
        const getContacts = async () => {
            try {
                const response = await apiClient.get(GET_CONTACTS_ROUTE, {
                    withCredentials: true,
                });

                if (response.data) {
                    setDMContacts(response.data);
                }
            } catch (error) {
                console.log(error);
                toast("error", "Failed to load the contacts");
            }
        };

        const getChannels = async () => {
            try {
                const response = await apiClient.get(GET_USER_CHANNEL_ROUTE, {
                    withCredentials: true,
                });
                console.log({ response });
                if (response.data.channels) {
                    setChannels(response.data.channels);
                }
            } catch (error) {
                console.log(error);
                toast("error", "Failed to load the channels");
            }
        };
        getChannels();
        getContacts();
    }, []);

    return (
        <div
            className={`${
                selectedChatType === undefined ? "flex" : "hidden sm:flex"
            } h-full flex-col w-full sm:w-auto min-w-[350px] lg:w-[30%] relative`}
        >
            <div className="flex items-center justify-between my-5 px-3 pl-4">
                <h1 className="text-lg font-bold text-black/80 dark:text-white/80 sm:text-3xl text-center ">
                    QuickChat
                </h1>
                <ThemeToggle />
            </div>

            <div className="grid grid-cols-2 gap-3 px-3">
                <button
                    onClick={() => setActiveSection("chats")}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-stroke dark:border-strokedark ${
                        activeSection === "chats"
                            ? "bg-light3 dark:bg-dark3 "
                            : "bg-light1 dark:bg-dark2"
                    }`}
                >
                    <MessageCircleMore />
                    <span>Chats</span>
                </button>
                <button
                    onClick={() => setActiveSection("channels")}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-stroke dark:border-strokedark ${
                        activeSection === "channels"
                            ? "bg-light3 dark:bg-dark3"
                            : "bg-light1 dark:bg-dark2"
                    }`}
                >
                    <Users />
                    <span>Channels</span>
                </button>
            </div>

            {activeSection === "chats" && (
                <div className="h-full overflow-y-auto no-scrollbar my-2">
                    <div className="flex justify-between items-center bg-light1  dark:bg-dark2 px-3 py-2 my-2 border-t border-b border-stroke dark:border-strokedark">
                        <h1>Add&nbsp;New&nbsp;Contact&nbsp;</h1>
                        <NewDM />
                    </div>
                    <div>
                        <ContactList contacts={DMContacts} />
                    </div>
                </div>
            )}

            {activeSection === "channels" && (
                <div className="h-full overflow-y-auto no-scrollbar my-2">
                    <div className="flex justify-between items-center bg-light1 dark:bg-dark2 px-3 py-2 my-2 ">
                        <h1>Create&nbsp;New&nbsp;Channel&nbsp;</h1>
                        <NewChannel />
                    </div>
                    <div>
                        <ContactList contacts={channels} isChannel={true} />
                    </div>
                </div>
            )}
            <ProfileInfo />
        </div>
    );
}

export default ContactsContainer;
