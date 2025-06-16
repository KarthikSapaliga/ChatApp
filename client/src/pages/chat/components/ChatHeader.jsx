import { useAppStore } from "@/store/store";
import { X } from "lucide-react";

function ChatHeader() {
    const { selectedChatData, closeChat } = useAppStore();

    console.log({ selectedChatData });

    return (
        <>
            <div className="flex items-center justify-between border-b  border-stroke dark:border-strokedark px-6 py-4.5">
                <div className="flex items-center cursor-pointer">
                    <div className="mr-4.5 h-13 max-w-13 w-full overflow-hidden rounded-full">
                        {selectedChatData.image &&
                        selectedChatData.image !== "" ? (
                            <img
                                src={selectedChatData.image}
                                alt={selectedChatData.name}
                                className="h-full w-full object-cover object-center"
                            />
                        ) : (
                            <div className="h-13 w-13 flex justify-center items-center rounded-full bg-gray-600 text-white">
                                {selectedChatData.name
                                    ?.charAt(0)
                                    ?.toUpperCase() || "?"}
                            </div>
                        )}
                    </div>
                    <div>
                        <h1 className="font-medium text-black dark:text-white">
                            {selectedChatData.name}
                        </h1>
                        <p className="text-sm">Reply&nbsp;to&nbsp;message</p>
                    </div>
                </div>
                <div className="flex items-center space-x-6">
                    <button onClick={closeChat}>
                        <X />
                    </button>
                </div>
            </div>
        </>
    );
}

export default ChatHeader;
