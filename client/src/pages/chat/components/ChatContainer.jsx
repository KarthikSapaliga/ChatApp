import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";

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
