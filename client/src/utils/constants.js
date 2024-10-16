import { privateMessageNotification } from "../controllers/PushNotificationController";

export const toastOptions = {
  position: "bottom-right",
  autoClose: 4000,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

export const sendMessage = async ({
  input,
  setInput,
  user,
  recipient,
  socket,
  socketEvent,
  setMessage,
}) => {
  const message = {
    content: input,
    author: user._id,
    recipient: recipient._id,
    userName: user.userName,
    timestamp: new Date().toISOString(),
  };

  socket.emit(socketEvent, { message, recipient });
  await privateMessageNotification(
    user.userName,
    recipient._id,
    "New Private Message",
    `${user.userName} has sent you a private message`
  );
  setMessage((prevMessages) => [...prevMessages, message]);
  setInput("");
};
