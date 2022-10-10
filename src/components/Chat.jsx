import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import ChatTopBar from "./ChatTopBar";
import Input from "./Input";
import Message from "./Message";

function Chat() {
  const [chatMessages, setChatMessages] = useState(null);
  const { chatId, chatFriend } = useContext(ChatContext);
  const scrollRef = useRef(null);

  // Fetch the chat messages of the chatid context
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", `${chatId}`), (doc) => {
      doc.data() != undefined ? setChatMessages(doc.data().messages) : null;
    });

    return () => {
      unsub();
    };
  }, [chatId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior: "smooth"});
  }, [chatMessages, chatId]);

  return (
    <div className="chat-container">
      {chatId != null ? (
        <>
        {chatFriend && <ChatTopBar name={chatFriend.name} photoURL={chatFriend.photoURL} />}
        
          <div className="chat">
            {chatMessages?.map((chat, index) => (
              <Message
                key={index}
                date={chat.date}
                senderId={chat.senderId}
                text={chat.text}
                imgURL={chat.imgURL ? chat.imgURL : undefined}
              />
            ))}
          <div ref={scrollRef} />
          </div>
          <Input />
        </>
      ) : (
        <div className="add-friend-advise">
          <p>
            Ask your friend for his unique ID and look for him in the searchbar on
            the top left corner
          </p>
        </div>
      )}
    </div>
  );
}

export default Chat;
