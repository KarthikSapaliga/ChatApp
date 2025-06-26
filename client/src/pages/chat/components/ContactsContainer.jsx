import { useState, useEffect } from "react";
import { useAppStore } from "@/store/store";

import toast from "@/lib/toast";
import { apiClient } from "@/lib/axios";
import {
    GET_CONTACTS_ROUTE,
    GET_USER_CHANNEL_ROUTE,
} from "@/lib/routes";

import ContactList from "./ContactList";
import NewDM from "./NewDM";
import NewChannel from "./NewChannel";
import ProfileInfo from "./ProfileInfo";

import { MessageCircleMore, Users } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";


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
            className={`${selectedChatType === undefined ? "flex" : "hidden sm:flex"
                } h-full flex-col w-full sm:w-auto min-w-[350px] lg:w-[30%] relative`}
        >
            <div className="flex items-center justify-between my-5 px-3 pl-4">
                <h1 className="text-lg font-bold md:text-[1.75rem] text-center ">
                    QuickChat
                </h1>
                <ThemeToggle />
            </div>

            <div className="grid grid-cols-2 gap-3 px-3">
                <button
                    onClick={() => setActiveSection("chats")}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md ${activeSection === "chats"
                            ? "bg-light3 dark:bg-dark3 shadow-sm"
                            : "bg-light1 dark:bg-dark2"
                        }`}
                >
                    <MessageCircleMore />
                    <span>Chats</span>
                </button>
                <button
                    onClick={() => setActiveSection("channels")}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md ${activeSection === "channels"
                            ? "bg-light3 dark:bg-dark3 shadow-sm"
                            : "bg-light1 dark:bg-dark2"
                        }`}
                >
                    <Users />
                    <span>Channels</span>
                </button>
            </div>

            {activeSection === "chats" && (
                <div className="h-full overflow-y-auto no-scrollbar my-2">
                    <div className="flex justify-between items-center bg-light1  dark:bg-dark2 px-3 py-2 my-2 border-stroke dark:border-strokedark">
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
