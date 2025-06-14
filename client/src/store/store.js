import { create } from "zustand";
import { createAuthSlice } from "./slices/authSlice";
import { createChatSlice } from "./slices/chatSlice";

export const useAppStore = create((...args) => {
    return {
        ...createAuthSlice(...args),
        ...createChatSlice(...args),
    };
});
