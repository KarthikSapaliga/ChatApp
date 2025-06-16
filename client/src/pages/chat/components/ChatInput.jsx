import { useEffect, useRef, useState } from "react";

import { useAppStore } from "@/store/store";
import { useSocket } from "@/contexts/SocketContext";

import { apiClient } from "@/lib/axios";
import { UPLOAD_FILE_ROUTE } from "@/lib/routes";

import EmojiPicker from "emoji-picker-react";
import { Paperclip, SendHorizontal, Smile } from "lucide-react";

function ChatInput() {
    const { userInfo, selectedChatType, selectedChatData } = useAppStore();
    const socket = useSocket();

    const [message, setMessage] = useState("");
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

    const emojiRef = useRef();
    const fileInputRef = useRef();

    const handleAddEmoji = (emoji) => {
        setMessage((msg) => msg + emoji.emoji);
    };

    useEffect(() => {
        function handleClickOutside(e) {
            if (emojiRef.current && !emojiRef.current.contains(e.target)) {
                setEmojiPickerOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [emojiRef]);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (message.trim() == "") return;

        if (selectedChatType === "contact") {
            console.log(`[${userInfo.name}] sending message: ${message}`);
            socket.emit("sendMessage", {
                sender: userInfo.id,
                recipient: selectedChatData._id,
                content: message,
                messageType: "text",
                fileUrl: undefined,
            });
        } else if (selectedChatType === "channel") {
            console.log(`[${userInfo.name}] sending message in channel`);
            socket.emit("sendChannelMessage", {
                sender: userInfo.id,
                content: message,
                messageType: "text",
                fileUrl: undefined,
                channelId: selectedChatData._id,
            });
        }
        setMessage("");
    };

    const handleAttachmentClick = async (e) => {
        console.log("fired");
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleAttachmentChange = async (e) => {
        try {
            const file = e.target.files[0];
            const formData = new FormData();
            console.log({ file });

            if (!file) return;
            formData.append("file", file);

            const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log({ response });

            if (response.status === 200 && response.data) {
                console.log("emitting: ", response.data);

                if (selectedChatType === "contact") {
                    console.log(`[${userInfo.name}] sending file...`);
                    socket.emit("sendMessage", {
                        sender: userInfo.id,
                        recipient: selectedChatData._id,
                        content: undefined,
                        messageType: "file",
                        fileUrl: response.data.fileUrl,
                    });
                } else if (selectedChatType === "channel") {
                    console.log(
                        `[${userInfo.name}] sending message in channel`
                    );
                    socket.emit("sendChannelMessage", {
                        sender: userInfo.id,
                        content: undefined,
                        messageType: "file",
                        fileUrl: response.data.fileUrl,
                        channelId: selectedChatData._id,
                    });
                }
            }
        } catch (error) {
            console.log({ error });
        }
    };

    return (
        <>
            <div className="sticky bottom-0 border-t  border-stroke dark:border-strokedark px-6 py-3">
                <form
                    onSubmit={handleSendMessage}
                    className="flex items-center justify-between gap-4"
                >
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Type Something here"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full border focus:border-[2px] rounded border-stroke bg-light2 py-3 pl-5 pr-10 text-sm outline-none focus:border-primary dark:focus:border-primary dark:border-strokedark dark:bg-dark3"
                        />
                        <div className="absolute top-1/2 -translate-y-1/2 right-5 flex gap-2">
                            <span
                                onClick={handleAttachmentClick}
                                className="hover:text-primary"
                            >
                                <Paperclip size={20} />
                            </span>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleAttachmentChange}
                                className="hidden"
                            />
                            <span
                                onClick={() => setEmojiPickerOpen(true)}
                                className="hover:text-primary"
                            >
                                <Smile size={20} />
                            </span>
                            <div
                                className={`absolute bottom-10 right-0`}
                                ref={emojiRef}
                            >
                                <EmojiPicker
                                    open={emojiPickerOpen}
                                    theme="dark"
                                    onEmojiClick={handleAddEmoji}
                                    autoFocusSearch={false}
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="flex items-center justify-center p-3 rounded-md bg-primary text-white hover:bg-opacity-90"
                    >
                        <SendHorizontal size={20} />
                    </button>
                </form>
            </div>
        </>
    );
}

export default ChatInput;
