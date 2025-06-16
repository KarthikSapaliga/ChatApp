import { useEffect } from "react";

import toast from "@/lib/toast";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/store";

import ChatContainer from "./ChatContainer";
import ContactsContainer from "./components/ContactsContainer";
import EmptyChat from "./components/EmptyChat";

function Chat() {
    const { userInfo, selectedChatType } = useAppStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo.profileSetup) {
            toast("msg", "Please setup profile to continue.");
            navigate("/profile");
        }
    }, [userInfo, navigate]);

    return (
        <div className="h-screen overflow-hidden relative">
            <div className="h-full bg-light2 dark:bg-dark1 flex">
                <ContactsContainer />

                {selectedChatType === undefined ? (
                    <EmptyChat />
                ) : (
                    <ChatContainer />
                )}
            </div>
        </div>
    );
}

export default Chat;
