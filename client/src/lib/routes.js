export const HOST = "https://chatapp-server-notn.onrender.com/"

export const AUTH_ROUTE = "/api/users";
export const SIGNUP_ROUTE = `${AUTH_ROUTE}/register`;
export const LOGIN_ROUTE = `${AUTH_ROUTE}/login`;
export const LOGOUT_ROUTE = `${AUTH_ROUTE}/logout`;
export const GET_USER_INFO_ROUTE = `${AUTH_ROUTE}/user-info`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTE}/update-profile`;
export const UPDATE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTE}/update-profile-image`;

export const CONTACTS_ROUTE = "/api/contacts";
export const SEARCH_CONTACTS_ROUTE = `${CONTACTS_ROUTE}/search`;
export const GET_CONTACTS_ROUTE = `${CONTACTS_ROUTE}/get-contacts`;
export const GET_ALL_CONTACTS_ROUTE = `${CONTACTS_ROUTE}/get-all-contacts`;

export const MESSAGES_ROUTE = "/api/messages";
export const GET_MESSAGES_ROUTE = `${MESSAGES_ROUTE}/get-messages`;
export const UPLOAD_FILE_ROUTE = `${MESSAGES_ROUTE}/upload-file`;

export const CHANNEL_ROUTE = "/api/channels";
export const CREATE_CHANNEL_ROUTE = `${CHANNEL_ROUTE}/create-channel`;
export const GET_USER_CHANNEL_ROUTE = `${CHANNEL_ROUTE}/get-user-channel`;
export const GET_CHANNEL_MESSAGES = `${CHANNEL_ROUTE}/get-channel-messages`;
