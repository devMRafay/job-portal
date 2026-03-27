import firebase  from "firebase/compat/app";
import "firebase/compat/auth"
import "firebase/compat/database"
import "firebase/compat/firestore"
import "firebase/compat/storage"


const firebaseConfig = {
    apiKey: "AIzaSyBG--Js9tEcKf-SVZHiOU1ahNPwA6BsXbY",
    authDomain: "reactsyncfirebase.firebaseapp.com",
    projectId: "reactsyncfirebase",
    storageBucket: "reactsyncfirebase.appspot.com",
    messagingSenderId: "968590862555",
    appId: "1:968590862555:web:de29c6aa6c78f7f2e104fe"
  };


firebase.initializeApp(firebaseConfig);
  export const db = firebase.database()
  export const auth = firebase.auth();
  export const storage = firebase.storage();
  export const firestore = firebase.firestore();
  export default firebase