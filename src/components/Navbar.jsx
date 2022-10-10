import { signOut } from "firebase/auth";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase";
import {GrCopy} from "react-icons/gr"

function Navbar() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="navbar-container">
      <div className="navbar">
        <div className="user">
          <img src={currentUser.photoURL} />
          <div className="name">{currentUser.displayName}</div>
        </div>
        <button onClick={() => signOut(auth)}>Log out</button>
      </div>
      <div className="uid">
        ID:  {currentUser.uid}
        <GrCopy className="copy-btn" onClick={() => {navigator.clipboard.writeText(`${currentUser.uid}`)}} />
        </div>
    </div>
  );
}

export default Navbar;
