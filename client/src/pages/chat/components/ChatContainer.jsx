import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

function ChatContainer() {
    return (
        <div className="flex flex-col h-full w-full border-l border-stroke dark:border-strokedark bg-light3 dark:bg-dark2 ">
            <ChatHeader />
            <ChatMessages />
            <ChatInput />
        </div>
    );
}

export default ChatContainer;
