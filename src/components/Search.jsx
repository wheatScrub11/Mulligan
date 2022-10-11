import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useContext, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";

function Search() {
  const [userWanted, setUserWanted] = useState("");
  const [userSearched, setUserSearched] = useState(null);
  const { currentUser } = useContext(AuthContext);

  // Search in the "users" collection if the uid that was attached in the search bar exists, if it does, stores the data of the user in the state, if not, stays null
  const handleKeyDown = async (e) => {
    if (e.keyCode === 13) {
      const q = query(collection(db, "users"), where("uid", "==", userWanted));
      const qSnapshot = await getDocs(q);
      qSnapshot.docs.length > 0
        ? setUserSearched(qSnapshot.docs[0]?.data())
        : setUserSearched(null);
      e.target.value = ""
    }
  };

  const addFriend = async () => {

    const userToFriend = await (
      await getDoc(doc(db, "users", userSearched.uid))
    ).data();

    // Updates the friendlist of the current user, adds the user who was clicked in the searchbar
    await updateDoc(doc(db, "usersChats", `${currentUser.uid}`), {
      friends: arrayUnion({
        ...userToFriend,
        lastMessage : new Date().getTime()
      })
    });

    //updates de frienlist of the clicked user, adds the currentUser
    await updateDoc(doc(db, "usersChats", `${userSearched.uid}`), {
      friends: arrayUnion({
        name: currentUser.displayName,
        photoURL: currentUser.photoURL,
        uid: currentUser.uid,
        lastMessage: new Date().getTime()
      })
    }).then((E) =>{
      console.log("succesful");
    })

    const createIdForChat = () => {
      let id = "";
      currentUser.uid > userToFriend.uid
        ? (id = currentUser.uid + userToFriend.uid)
        : (id = userToFriend.uid + currentUser.uid);
      
        return id
    };

    // Creates a new chat for the clicked user in the search bar
    await setDoc(doc(db, "chats", `${createIdForChat()}`), {
      messages: [],
    });

    // Deletes the user searched when the currentUser clicks on it
    setUserSearched(null)
  };

  return (
    <>
      <div className="input-container">
        <BsSearch className="icon" />
        <input
          type="text"
          placeholder="Search"
          id="search"
          autoComplete="off"
          onChange={(e) => setUserWanted(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
        />
      </div>
      {userSearched && (
        <div className="user-searched" onClick={addFriend}>
          <img src={userSearched.photoURL} alt="" />
          <p>{userSearched.name}</p>
        </div>
      )}
    </>
  );
}

export default Search;
