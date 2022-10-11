import { createContext, useEffect, useState } from "react";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [chatId, setChatId] = useState(null);
  const [chatFriend, setChatFriend] = useState(null);

  return (
    <ChatContext.Provider
      value={{ chatId, setChatId, chatFriend, setChatFriend }}
    >
      {children}
    </ChatContext.Provider>
  );
};
