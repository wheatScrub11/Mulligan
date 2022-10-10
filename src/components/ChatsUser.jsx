import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";

function ChatsUser(props) {
  const { name, photoURL, userUid, changeFocusedChat, chats } = props;
  const { currentUser } = useContext(AuthContext);
  const [lastMessage, setLastMessage] = useState("");

  // Build the appropiate chatId between currentUser and chatFriend. This id already exists in firebase "chats" docs
  const createIdForChat = () => {
    let id = "";
    currentUser.uid > userUid
      ? (id = currentUser.uid + userUid)
      : (id = userUid + currentUser.uid);

    return id;
  };

  // When someome send a meesage (in the chat between currentUser and chatFriend), a snapshot will listen for this, go to that doc in firebase and get the Last message from the array, then update the "lastMessage" component so its gonna be display on screen
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "chats", `${createIdForChat()}`),
      (doc) => {
        setLastMessage(doc.data().messages.pop());
      }
    );

    return () => {
      unsub();
    };
  }, [chats]);

  return (
    <div className="chats-user" onClick={() => changeFocusedChat(userUid)}>
      <img src={photoURL} alt="" />
      <div className="info">
        <div className="name">{name}</div>
        {lastMessage && <div className="last-message">{lastMessage.text}</div>}
        {lastMessage && <div className="date">{lastMessage.date}</div>}
        
      </div>
    </div>
  );
}

export default ChatsUser;
