// export const host = "http://localhost:4000";
export const host = "https://forum-app-57g1.onrender.com";

export const registerRoute = `${host}/auth/register`;
export const loginRoute = `${host}/auth/login`;
export const requestPasswordResetRoute = `${host}/auth/request-password-reset-link`;
export const resetPasswordRoute = `${host}/auth/reset-password`;
export const adminDashboardRoute = `${host}/admin/dashboard`;

//Push notification routes
export const pushNotificationSubscribeRoute = `${host}/web-push/subscribe`;
export const sendPrivateMessagePushNotificationRoute = `${host}/web-push/private-message-notification`;
export const sendGroupMessagePushNotificationRoute = `${host}/web-push/group-message-notification`;
export const sendPostCreationPushNotificationRoute = `${host}/web-push/post-create-notification`;

export const getAllUsersRoute = `${host}/auth/users`;
export const getCurrentUserInfo = `${host}/auth/user-info`;
export const postsRoute = `${host}/forum`;
export const deletePostRoute = `${host}/forum/post`;
export const chatRoute = `${host}/chat`;
export const privateChatRoute = `${host}/chat/private`;
export const followUnfollowRoute = `${host}/forum/post/follow`;
