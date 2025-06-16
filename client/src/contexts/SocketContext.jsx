import { HOST } from "@/lib/routes";
import { useAppStore } from "@/store/store";
import { useEffect, useRef, createContext, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

function SocketProvider({ children }) {
    const socket = useRef();
    const { userInfo } = useAppStore();

    useEffect(() => {
        if (!userInfo) return;

        socket.current = io(HOST, {
            withCredentials: true,
            query: { userId: userInfo.id },
        });

        socket.current.on("connect", () => {
            console.log("Connected to socket server");
        });

        //========Recieve Messages===========
        const handleRecieveMessage = (message) => {
            const {
                selectedChatType,
                selectedChatData,
                addMessage,
                addContactsInDMContacts,
            } = useAppStore.getState();

            if (
                selectedChatType !== undefined &&
                (selectedChatData._id === message.sender._id ||
                    selectedChatData._id === message.recipient._id)
            ) {
                addMessage(message);
                console.log("recieved message: ", message);
            }
            addContactsInDMContacts(message);
        };

        const handleRecieveChannelMessage = (message) => {
            const {
                selectedChatType,
                selectedChatData,
                addMessage,
                addChannelInChannelList,
            } = useAppStore.getState();
            console.log("latest selectedChatData:", selectedChatData);

            if (
                selectedChatType !== undefined &&
                selectedChatData._id === message.channelId
            ) {
                addMessage(message);
                console.log("recieved message: ", message);
            }
            addChannelInChannelList(message);
        };

        socket.current.on("recieveMessage", handleRecieveMessage);
        socket.current.on("recieveChannelMessage", handleRecieveChannelMessage);

        return () => socket.current.disconnect();
    }, [userInfo]);

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    );
}

const useSocket = () => useContext(SocketContext);

export { SocketProvider, useSocket };
