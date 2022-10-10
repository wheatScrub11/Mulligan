import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

function Message(props) {
  const { currentUser } = useContext(AuthContext);
  const { chatFriend } = useContext(ChatContext);
  const { date, senderId, text, imgURL } = props;

  return (
    <>
      {senderId == currentUser.uid ? (
        <div
          className="message-container"
          style={{ alignItems: "flex-start", flexDirection: "row-reverse" }}
        >
          <div className="img-time">
            <img src={currentUser.photoURL} />
            <div className="date">{date}</div>
          </div>
          <div className="message" style={{ alignItems: "flex-end" }}>
            {text}
            {imgURL && <img className="message-file" src={imgURL}></img>}
          </div>
        </div>
      ) : (
        <div
          className="message-container"
          style={{ alignItems: "flex-start", flexDirection: "row" }}
        >
          <div className="img-time">
            {chatFriend && <img src={chatFriend.photoURL} />}
            
            <div className="date">{date}</div>
          </div>
          <div className="message" style={{ alignItems: "flex-start" }}>
            {text}
            {imgURL && <img className="message-file" src={imgURL}></img>}
          </div>
        </div>
      )}
    </>
  );
}

export default Message;
