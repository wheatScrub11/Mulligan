import { useContext, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { AiOutlineSend } from "react-icons/ai";
import { MdAttachFile } from "react-icons/md";
import { v4 as uuid } from "uuid";
import { AuthContext } from "../context/AuthContext";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase";
import { ChatContext } from "../context/ChatContext";
import dayjs from "dayjs";

function Input() {
  const [img, setImg] = useState(null);
  const [text, setText] = useState("");
  const { currentUser } = useContext(AuthContext);
  const { chatId, chatFriend } = useContext(ChatContext);
  const textRef = useRef(null);
  const imgRef = useRef(null);

  const cleanInput = () => {
    setImg(null);
    setText(null);
    textRef.current.value = null;
    imgRef.current.files = null;
  };

  const updateLatestMessage = async () => {
    //  When a message is sended, I search for both friendlist of current user and the user im talking with, i look for the the chat.uid that is = chatFriend.uid and replace "lastMessage" for a new date.getTime, so when all the usersChats are fetched in the app, its gonna be sort depending on the more recent date.getTime

    const currentUserChats = (
      await getDoc(doc(db, "usersChats", currentUser.uid))
    ).data().friends;

    const friendChats = await (
      await getDoc(doc(db, "usersChats", chatFriend.uid))
    ).data().friends;

    const currentUserChatsUpdated = currentUserChats.map((chat) => {
      if (chat.uid == chatFriend.uid) {
        return {
          lastMessage: new Date().getTime(),
          name: chat.name,
          photoURL: chat.photoURL,
          uid: chat.uid,
        };
      } else {
        return chat;
      }
    });

    const friendChatsUpdated = friendChats.map((chat) => {
      if (chat.uid == currentUser.uid) {
        return {
          lastMessage: new Date().getTime(),
          name: chat.name,
          photoURL: chat.photoURL,
          uid: chat.uid,
        };
      } else {
        return chat;
      }
    });

    await updateDoc(doc(db, "usersChats", currentUser.uid), {
      friends: currentUserChatsUpdated,
    });
    await updateDoc(doc(db, "usersChats", chatFriend.uid), {
      friends: friendChatsUpdated,
    });
  };

  const handleSendMessage = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());
      await uploadBytes(storageRef, img);
      await getDownloadURL(storageRef).then(async (url) => {
        await updateDoc(doc(db, "chats", `${chatId}`), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            imgURL: url,
            date: `${dayjs().date()}/${
              dayjs().month() + 1
            }/${dayjs().year()} ${dayjs().hour()}:${dayjs().minute()}`,
          }),
        });
      });
    } else {
      if (text == null || text == undefined) return;
      await updateDoc(doc(db, "chats", `${chatId}`), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: `${dayjs().date()}/${
            dayjs().month() + 1
          }/${dayjs().year()} ${dayjs().hour()}:${dayjs().minute()}`,
        }),
      });
    }
    cleanInput();
    await updateLatestMessage();
  };

  return (
    <div className="input-container">
      <div className="input">
        <div className="inputs">
          <BsEmojiSmile />
          <input
            type="text"
            placeholder="Type a message"
            autoComplete="off"
            id="input-text"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => (e.keyCode == 13 ? handleSendMessage() : false)}
            ref={textRef}
          />

          <label htmlFor="input-file">
            <MdAttachFile className="attach-file" />
          </label>
          <input
            type="file"
            id="input-file"
            onChange={(e) => setImg(e.target.files[0])}
            ref={imgRef}
          />
        </div>

        <AiOutlineSend className="send-btn" onClick={handleSendMessage} />
      </div>
    </div>
  );
}

export default Input;
