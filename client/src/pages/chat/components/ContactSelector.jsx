import { useState } from "react";

const ContactSelector = ({ contacts, selected, setSelected }) => {
    const [search, setSearch] = useState("");

    const toggleContact = (contact) => {
        const exists = selected.some((c) => c._id === contact._id);
        if (exists) {
            setSelected((prev) => prev.filter((c) => c._id !== contact._id));
        } else {
            setSelected((prev) => [...prev, contact]);
        }
    };

    const filteredContacts = contacts.filter((contact) =>
        contact.label?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-2">
            <input
                type="text"
                placeholder="Search contacts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 py-2 bg-light2 dark:bg-dark3 border border-stroke dark:border-strokedark rounded-md focus:border-primary outline-none"
            />
            <div className="max-h-40 overflow-y-auto border border-stroke dark:border-strokedark rounded-md p-2 space-y-2 no-scrollbar">
                {filteredContacts.length > 0 ? (
                    filteredContacts.map((contact) => {
                        const isSelected = selected.some(
                            (c) => c._id === contact._id
                        );
                        return (
                            <div
                                key={contact._id}
                                onClick={() => toggleContact(contact)}
                                className={`cursor-pointer px-3 py-2 rounded-md transition-all bg-light2 dark:bg-dark2 ${
                                    isSelected
                                        ? "bg-primary text-white"
                                        : "hover:bg-light1 hover:dark:bg-dark3"
                                }`}
                            >
                                {contact.label}
                            </div>
                        );
                    })
                ) : (
                    <p className="text-sm text-gray-500">No contacts found.</p>
                )}
            </div>
            {selected.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {selected.map((contact) => (
                        <div
                            key={contact._id}
                            className="bg-primary text-white px-3 py-1 rounded-full flex items-center gap-2"
                        >
                            <span>{contact.label}</span>
                            <button
                                onClick={() => toggleContact(contact)}
                                className="text-white font-bold"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContactSelector;
