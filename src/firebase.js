// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 as uuid } from 'uuid';
import { doc, getFirestore, setDoc } from "firebase/firestore"



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCazF8AhC4W9nV3qKJ4FpFFK95KybrgXCc",
  authDomain: "darnoc-8279b.firebaseapp.com",
  projectId: "darnoc-8279b",
  storageBucket: "darnoc-8279b.appspot.com",
  messagingSenderId: "242942525157",
  appId: "1:242942525157:web:b2404116ab3b19348ade0c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);


export const signUpNewUser = async (data) => {
    await createUserWithEmailAndPassword(auth, data.email, data.password).then( async (userCredential) =>{
        const usersProfilePicturesRef = ref(storage, `pfps/${userCredential.user.uid}`)

        await uploadBytes(usersProfilePicturesRef, data.photo[0])
        await getDownloadURL(usersProfilePicturesRef).then( async (url) =>{

            await updateProfile(userCredential.user, {
                displayName: data.name,
                photoURL: url
            })
            await setDoc(doc(db, "users", userCredential.user.uid), {
                uid: userCredential.user.uid,
                name: data.name,
                photoURL: url
            })
            await setDoc(doc(db, "usersChats", userCredential.user.uid), {
                friends: []
            })
        })
    })
}

export const signInUser = async (data) =>{
    await signInWithEmailAndPassword(auth, data.email, data.password).then((userCredential) =>{
        console.log(userCredential.user);
    })
}