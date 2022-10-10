function ChatTopBar(props) {
  const { name, photoURL } = props;
  return (
    <div className="top-bar-container">
      <div className="top-bar">
        <img className="friend-photo" src={photoURL} alt="" />
        <p className="friend-name">{name}</p>
      </div>
    </div>
  );
}

export default ChatTopBar;
