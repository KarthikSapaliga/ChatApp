import { useState, useEffect } from "react";
import Modal from "@/components/Modal";

import { useAppStore } from "@/store/store";
import { apiClient } from "@/lib/axios";
import { CREATE_CHANNEL_ROUTE } from "@/lib/routes";
import { GET_ALL_CONTACTS_ROUTE } from "@/lib/routes";

import { X } from "lucide-react";
import toast from "@/lib/toast";

import ContactSelector from "./ContactSelector";
import { CirclePlus } from "lucide-react";

function NewChannel() {
    const { setSelectedChatType, setSelectedChatData, addChannel } =
        useAppStore();

    const [openNewChannelModal, setOpenNewChannelModal] = useState(false);
    const [channelName, setChannelName] = useState("");
    const [allContacts, setAllContats] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);

    useEffect(() => {
        console.log("All Contacts: ", allContacts);
    }, [allContacts]);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await apiClient.get(GET_ALL_CONTACTS_ROUTE, {
                    withCredentials: true,
                });
                setAllContats(response.data.contacts);
            } catch (error) {
                console.log({ error });
            }
        };
        getData();
    }, []);

    const createChannel = async (e) => {
        e.preventDefault();
        console.log({ selectedContacts });

        if (!channelName || selectedContacts.length < 2) {
            toast("error", "Channel name and at least 2 members required.");
            return;
        }

        try {
            const response = await apiClient.post(
                CREATE_CHANNEL_ROUTE,
                {
                    name: channelName,
                    members: selectedContacts.map((contact) => contact._id),
                },
                { withCredentials: true }
            );

            console.log({ response });

            if (response.status === 201) {
                addChannel(response.data.channel);
                setChannelName("");
                setSelectedContacts([]);
            }
        } catch (error) {
            console.log({ error });
            toast("error", error.message || "Failed to create Channel");
        }
        setOpenNewChannelModal(false);
    };

    return (
        <div className="flex items-center justify-center">
            <button
                onClick={() => setOpenNewChannelModal(true)}
                className="hover:scale-110"
            >
                <CirclePlus />
            </button>

            {openNewChannelModal && (
                <Modal>
                    <div className="bg-light2 text-black dark:bg-dark2 dark:text-white p-5 rounded-lg max-w-full md:min-w-[500px] md:max-w-[600px]">
                        <div className="w-full text-right">
                            <button
                                type="button"
                                onClick={() => setOpenNewChannelModal(false)}
                                className="py-2 px-3"
                            >
                                <X />
                            </button>
                        </div>
                        <h1 className="text-center text-2xl font-bold mt-4">
                            Create New Channel
                        </h1>
                        <p className="text-fgclr text-lg text-center my-3">
                            Please fill up the details for new channel
                        </p>
                        <form
                            onSubmit={createChannel}
                            className="flex flex-col"
                        >
                            <div className="w-full flex flex-col gap-2">
                                <input
                                    type="text"
                                    placeholder="Channel Name"
                                    value={channelName}
                                    onChange={(e) =>
                                        setChannelName(e.target.value)
                                    }
                                    className="flex-1 px-4 py-2 bg-light2 dark:bg-dark3 outline-none border border-stroke dark:border-strokedark focus:border focus:border-primary focus:dark:border-primary rounded-md"
                                />

                                <ContactSelector
                                    contacts={allContacts}
                                    selected={selectedContacts}
                                    setSelected={setSelectedContacts}
                                />

                                <button
                                    type="submit"
                                    className="py-2 px-3 bg-primary rounded-md text-white"
                                >
                                    Create Channel
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default NewChannel;
