import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import ChatsUser from "./ChatsUser";

function Chats() {
  const [chats, setChats] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { setChatId, setChatFriend } = useContext(ChatContext);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "usersChats", `${currentUser.uid}`), //3rd parameter must be a string
      (doc) => {
        doc.data() != undefined 
          ? setChats(doc.data().friends) 
          : null;
      }
    );

    return () => {
      unsub();
    };
  }, [currentUser.uid]);

  // When someone clicks on any of the chats on the sidebar the context of the focused chat its gonna change to the one with ids adjoined of currentUser and the one of the user that is chatting with (this id comes as Props from this component to "ChatsUser")
  const changeFocusedChat = async (friendUid) => {
    setChatId(
      `${
        currentUser.uid > friendUid
          ? currentUser.uid + friendUid
          : friendUid + currentUser.uid
      }`
    );
    const q = query(
      collection(db, "users"),
      where("uid", "==", `${friendUid}`)
    );
    const friendUserData = await (await getDocs(q)).docs[0].data();
    
    // Change the current chatFriend. it adds his data {name, photoURL, uid}
    setChatFriend(friendUserData);
  };

  return (
    <div className="chats-container">
      {chats?.sort((a,b) => b.lastMessage - a.lastMessage).map((chat, index) => (
        <ChatsUser
          key={index}
          name={chat.name}
          photoURL={chat.photoURL}
          userUid={chat.uid}
          changeFocusedChat={changeFocusedChat}
          chats={chats}
        />
      ))}
    </div>
  );
}

export default Chats;
