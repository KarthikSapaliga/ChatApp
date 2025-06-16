import { useState, useEffect } from "react";
import Modal from "@/components/Modal";

import { useAppStore } from "@/store/store";
import { apiClient } from "@/lib/axios";
import { SEARCH_CONTACTS_ROUTE } from "@/lib/routes";

import { X } from "lucide-react";
import toast from "@/lib/toast";

import Avatar from "@/components/Avatar";

import { UserPlus } from "lucide-react";

function NewDM() {
    const {
        setSelectedChatType,
        setSelectedChatData,
        selectedChatType,
        selectedChatData,
    } = useAppStore();

    const [loading, setLoading] = useState(false);
    const [openNewContactModal, setOpenNewContactModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    const handleSearch = async (query) => {
        console.log("search query: ", query);
        setLoading(true);
        try {
            if (query.trim() !== "") {
                const response = await apiClient.post(
                    SEARCH_CONTACTS_ROUTE,
                    { searchQuery: query.trim() },
                    { withCredentials: true }
                );

                if (response.status === 200) {
                    setSearchResult(response.data);
                }
            } else {
                toast("error", "Enter name or emial");
            }
        } catch (error) {
            console.log({ error });
        }
        setLoading(false);
    };

    const selectContact = (contact) => {
        setOpenNewContactModal(false);
        setSearchQuery("");
        setSearchResult([]);

        setSelectedChatType("contact");
        setSelectedChatData(contact);

        console.log("contact details", contact);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSearch(searchQuery);
    };

    useEffect(() => {
        console.log("selectedChatType changed:", selectedChatType);
        console.log("selectedChatData changed:", selectedChatData);
    }, [selectedChatType, selectedChatData]);

    useEffect(() => {
        console.log("search result:", searchResult);
    }, [searchResult]);

    return (
        <div className="flex items-center justify-center">
            <button
                onClick={() => setOpenNewContactModal(true)}
                className="hover:scale-110"
            >
                <UserPlus />
            </button>

            {openNewContactModal && (
                <Modal>
                    <div className="bg-gray2 text-black dark:bg-dark2 dark:text-white p-5 rounded-lg max-w-full md:min-w-[500px] md:max-w-[600px]">
                        <div className="w-full text-right">
                            <button
                                type="button"
                                onClick={() => setOpenNewContactModal(false)}
                                className="py-2 px-3"
                            >
                                <X />
                            </button>
                        </div>
                        <h1 className="text-center text-2xl font-bold mt-4">
                            Add contact
                        </h1>
                        <p className="text-fgclr text-lg text-center my-3">
                            Search for contacts and select one
                        </p>
                        <form onSubmit={handleSubmit} className="flex flex-col">
                            <div className="w-full flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter the contact email"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="flex-1 px-4 py-2 bg-gray1 dark:bg-dark3 outline-none border border-stroke dark:border-strokedark focus:border focus:border-primary focus:dark:border-primary rounded-md"
                                />

                                <button
                                    type="submit"
                                    className="py-2 px-3 bg-primary rounded-md text-white"
                                >
                                    Search
                                </button>
                            </div>

                            <div className="min-h-[400px] w-full">
                                {loading && <p>loading...</p>}
                                {!loading && searchResult.length === 0 && (
                                    <p className="text-center text-fgclr mt-4">
                                        No contacts found
                                    </p>
                                )}

                                {searchResult &&
                                    searchResult.map((contact) => {
                                        return (
                                            <div
                                                key={contact._id}
                                                onClick={() =>
                                                    selectContact(contact)
                                                }
                                                className="my-3 cursor-pointer bg-light1 dark:bg-dark3 flex gap-4 p-3 rounded-md"
                                            >
                                                <Avatar
                                                    name={contact.name}
                                                    src={contact.image}

                                                    className="w-12 h-12 rounded-full"
                                                />
                                                <div>
                                                    <h1>{contact.name}</h1>
                                                    <p>{contact.email}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </form>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default NewDM;
