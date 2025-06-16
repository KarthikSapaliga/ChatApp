import { useRef, useEffect } from "react";
import { useAppStore } from "@/store/store";

import toast from "@/lib/toast";
import { apiClient } from "@/lib/axios";
import { GET_CHANNEL_MESSAGES, GET_MESSAGES_ROUTE } from "@/lib/routes";

import moment from "moment";
import { ArrowUpRight, CloudDownload } from "lucide-react";

import Avatar from "@/components/Avatar";

function ChatMessages() {
    const scrollRef = useRef();
    const {
        userInfo,
        selectedChatType,
        selectedChatData,
        selectedChatMessages,
        setSelectedChatMessages,
    } = useAppStore();

    useEffect(() => {
        const getMessages = async () => {
            try {
                const response = await apiClient.post(
                    GET_MESSAGES_ROUTE,
                    { id: selectedChatData._id },
                    { withCredentials: true }
                );

                console.log(response.data);
                if (response.data.messages) {
                    setSelectedChatMessages(response.data.messages);
                }
            } catch (error) {
                console.log(error);
                toast("error", error.message || "Failed to load the messages");
            }
        };

        const getChannelMessages = async () => {
            try {
                const response = await apiClient.get(
                    `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
                    { withCredentials: true }
                );

                console.log(response.data);
                if (response.data.messages) {
                    setSelectedChatMessages(response.data.messages);
                }
            } catch (error) {
                console.log(error);
                toast("error", error.message || "Failed to load the messages");
            }
        };

        if (selectedChatData._id) {
            if (selectedChatType === "contact") {
                getMessages();
            } else if (selectedChatType === "channel") {
                getChannelMessages();
            }
        }
    }, [selectedChatData, selectedChatType]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }

        return () => {};
    }, [selectedChatMessages]);

    const checkIfImage = (fileUrl) => {
        const regex = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
        return regex.test(fileUrl);
    };

    const renderMessages = () => {
        let lastDate = null;
        return selectedChatMessages.map((msg, index) => {
            const msgDate = moment(msg.timestamp).format("YYYY-MM-DD");
            const showDate = msgDate != lastDate;
            lastDate = msgDate;
            return (
                <div key={index} className="m-2 p-2">
                    {showDate && (
                        <div className="text-center my-5">
                            <span className="bg-light1 dark:bg-dark3 py-2 px-3 rounded-md">
                                {moment(msg.timestamp).format("LL")}
                            </span>
                        </div>
                    )}
                    {selectedChatType === "contact" && renderDMs(msg)}
                    {selectedChatType === "channel" &&
                        renderChannelMessages(msg)}
                </div>
            );
        });
    };

    const renderDMs = (msg) => {
        const isOwn = msg.sender !== selectedChatData._id;

        return (
            <div className={`max-w-115 ${isOwn && "ml-auto"}`}>
                {msg.messageType === "text" && (
                    <p
                        className={`mb-1.5 rounded-2xl px-5 py-3 ${
                            isOwn
                                ? "bg-primary text-white rounded-br-none"
                                : "bg-light1 dark:bg-dark3 dark:text-white rounded-tl-none"
                        }`}
                    >
                        {msg.content}
                    </p>
                )}

                {msg.messageType === "file" && (
                    <div
                        className={`cursor-pointer rounded-2xl overflow-hidden p-1 mb-1.5 ${
                            isOwn
                                ? "bg-primary text-white rounded-br-none"
                                : "bg-light1 dark:bg-dark3 dark:text-white rounded-tl-none"
                        }`}
                    >
                        {checkIfImage(msg.fileUrl) ? (
                            <div className="group w-full h-auto object-cover object-center relative rounded-xl overflow-hidden">
                                <img
                                    src={msg.fileUrl}
                                    alt="Image"
                                    className="w-full h-auto"
                                />

                                <a
                                    href={msg.fileUrl}
                                    target="blank"
                                    download={true}
                                    className="hidden group-hover:flex absolute left-0 top-0 w-full h-full bg-black/50 items-center justify-center backdrop-blur-sm"
                                >
                                    <span className="flex gap-1 justify-center items-center py-2 px-3 rounded-md bg-primary">
                                        <span>Open in New Tab</span>
                                        <ArrowUpRight size={18} />
                                    </span>
                                </a>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 px-3 py-2">
                                <div className="w-15 h-15 flex justify-center items-center shrink-0 rounded-full bg-black/40">
                                    <CloudDownload size={25} />
                                </div>
                                <a
                                    href={msg.fileUrl}
                                    download={true}
                                    target="blank"
                                >
                                    {msg.fileUrl.split("/").pop()}
                                </a>
                            </div>
                        )}
                    </div>
                )}
                <p className={`text-xs ${isOwn && "text-right"}`}>
                    {moment(msg.timestamp).format("LT")}
                </p>
            </div>
        );
    };

    const renderChannelMessages = (msg) => {
        const isOwn = msg.sender._id === userInfo.id;

        return (
            <div>
                <div className={`max-w-115 ${isOwn && "ml-auto"}`}>
                    {!isOwn && (
                        <div className="flex items-end gap-1 mb-2 relative">
                            <div className="absolute top-1 w-6 h-6 rounded-full">
                                <Avatar
                                    src={msg.sender.image}
                                    name={msg.sender.name}
                                />
                            </div>
                            <p className="text-sm ml-7 absolute -top-3">
                                {msg.sender.name}
                            </p>
                        </div>
                    )}

                    {msg.messageType === "text" && (
                        <p
                            className={`mb-1.5 rounded-2xl px-5 py-3 ${
                                isOwn
                                    ? "bg-primary text-white rounded-br-none"
                                    : "bg-light1 dark:bg-dark3 dark:text-white rounded-tl-none ml-7"
                            }`}
                        >
                            {msg.content}
                        </p>
                    )}

                    {msg.messageType === "file" && (
                        <div
                            className={`cursor-pointer rounded-2xl overflow-hidden p-1 mb-1.5 ${
                                isOwn
                                    ? "bg-primary text-white rounded-br-none"
                                    : "bg-light1 dark:bg-dark3 dark:text-white rounded-tl-none ml-7"
                            }`}
                        >
                            {checkIfImage(msg.fileUrl) ? (
                                <div className="group w-full h-auto object-cover object-center relative rounded-xl overflow-hidden">
                                    <img
                                        src={msg.fileUrl}
                                        alt="Image"
                                        className="w-full h-auto"
                                    />
                                    <a
                                        href={msg.fileUrl}
                                        target="blank"
                                        download={true}
                                        className="hidden group-hover:flex absolute left-0 top-0 w-full h-full bg-black/50 items-center justify-center backdrop-blur-sm"
                                    >
                                        <span className="flex gap-1 justify-center items-center py-2 px-3 rounded-md bg-primary">
                                            <span>Open in New Tab</span>
                                            <ArrowUpRight size={18} />
                                        </span>
                                    </a>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 px-3 py-2">
                                    <div className="w-15 h-15 flex justify-center items-center shrink-0 rounded-full bg-black/40">
                                        <CloudDownload size={25} />
                                    </div>
                                    <a
                                        href={msg.fileUrl}
                                        download={true}
                                        target="blank"
                                    >
                                        {msg.fileUrl.split("/").pop()}
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                    <p className={`text-xs ${isOwn && "text-right"}`}>
                        {moment(msg.timestamp).format("LT")}
                    </p>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="max-h-full space-y-3.5 overflow-auto no-scrollbar px-3 md:px-6 py-7 grow">
                <div>{renderMessages()}</div>
                <div ref={scrollRef}></div>
            </div>
        </>
    );
}

export default ChatMessages;
