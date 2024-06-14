export const host = process.env.HOST;
export const loginRoute = `${host}/api/auth/login`;
export const registerRoute = `${host}/api/auth/register`;
export const logoutRoute = `${host}/api/auth/logout`;
export const allUsersRoute = `${host}/api/auth/allusers`;
export const sendMessageRoute = `${host}/api/messages/addmsg`;
export const recieveMessageRoute = `${host}/api/messages/getmsg`;
export const setAvatarRoute = `${host}/api/auth/setavatar`;
export const contactsRoute = `${host}/api/auth/contacts`; 
export const sendRequestRoute = `${host}/api/auth/sendrequest`;
export const getCurrentUserRequestsRoute = `${host}/api/auth/getSentRequests`;
export const getRecievedRequestsRoute = `${host}/api/auth/getRecievedRequests`;
export const acceptRequestRoute = `${host}/api/auth/acceptrequest`;
export const rejectRequestRoute = `${host}/api/auth/rejectrequest`;
export const deleteuser = `${host}/api/auth/deleteuser`;


