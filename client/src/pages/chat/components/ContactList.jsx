import Avatar from "@/components/Avatar";
import { useAppStore } from "@/store/store";

function ContactList({ contacts, isChannel = false }) {
    const {
        selectedChatData,
        setSelectedChatType,
        setSelectedChatData,
        setSelectedChatMessages,
    } = useAppStore();

    const handleClick = (user) => {
        if (isChannel) setSelectedChatType("channel");
        else setSelectedChatType("contact");

        if (selectedChatData && selectedChatData._id != user._id) {
            setSelectedChatMessages([]);
        }
        setSelectedChatData(user);
    };

    return (
        <div className="no-scrollbar overflow-auto h-full space-y-2.5 mx-3">
            {contacts.map((user) => {
                return (
                    <div
                        key={user._id}
                        onClick={() => handleClick(user)}
                        className={`flex cursor-pointer items-center rounded-md px-4 py-2 hover:bg-light1 dark:hover:bg-dark2 ${
                            selectedChatData &&
                            selectedChatData._id == user._id &&
                            "bg-light1 dark:bg-dark2"
                        }`}
                    >
                        <div className="relative mr-3.5 h-12 w-full max-w-12 rounded-full">
                            {!isChannel ? (
                                <Avatar
                                    name={user.name}
                                    src={user.image}
                                    className="h-full w-full rounded-full"
                                />
                            ) : (
                                <div className="flex justify-center items-center text-2xl w-full h-full bg-gray-600 rounded-full text-white">
                                    #
                                </div>
                            )}
                        </div>
                        <div className="w-full">
                            <h1 className="text-sm font-medium text-black dark:text-white">
                                {user.name}
                            </h1>
                            <p className="text-sm">{user.email}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default ContactList;
