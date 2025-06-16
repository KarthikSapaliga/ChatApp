export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    DMContacts: [],
    channels: [],

    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setSelectedChatMessages: (selectedChatMessages) =>
        set({ selectedChatMessages }),
    setChannels: (channels) => set({ channels }),
    setDMContacts: (DMContacts) => set({ DMContacts }),

    closeChat: () =>
        set({
            selectedChatType: undefined,
            selectedChatData: undefined,
            selectedChatMessages: [],
        }),

    addMessage: (message) => {
        const selectedChatMessages = get().selectedChatMessages;
        const selectedChatType = get().selectedChatType;

        set({
            selectedChatMessages: [
                ...selectedChatMessages,
                {
                    ...message,
                    recipient:
                        selectedChatType === "channel"
                            ? message.recipient
                            : message.recipient._id,
                    sender:
                        selectedChatType === "channel"
                            ? message.sender
                            : message.sender._id,
                },
            ],
        });
    },

    addChannel: (channel) => {
        const channels = get().channels;
        set({ channels: [...channels, channel] });
    },

    addChannelInChannelList: (message) => {
        const channels = get().channels;
        const data = channels.find(
            (channel) => channel._id === message.channelId
        );
        const index = channels.findIndex(
            (channel) => channel._id === message.channelId
        );
        if (index !== -1 && index !== undefined) {
            channels.splice(index, 1);
            channels.unshift(data);
        }
    },

    addContactsInDMContacts: (message) => {
        const userId = get().userInfo.id;
        const DMContacts = get().DMContacts;
        const fromId =
            message.sender._id === userId
                ? message.recipient._id
                : message.sender._id;
        const fromData =
            message.sender._id === userId ? message.recipient : message.sender;
        const data = DMContacts.find((contact) => contact._id === fromId);
        const index = DMContacts.findIndex((contact) => contact._id === fromId);
        if (index !== -1 && index != undefined) {
            DMContacts.splice(index, 1);
            DMContacts.unshift(data);
        } else {
            DMContacts.unshift(fromData);
        }
        set({ DMContacts });
    },
});
