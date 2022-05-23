import './styles/style.css'
import {initializeApp} from 'firebase/app'
import {
  getFirestore, collection, getDocs, 
  addDoc, deleteDoc,doc, onSnapshot, 
  query, where, orderBy, serverTimestamp,
  getDoc, updateDoc 
} from 'firebase/firestore'

import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCPe9UQF4wuxipPn8sNvOZmflcwzeC7hwE",
    authDomain: "chatroom-project-js-f7612.firebaseapp.com",
    projectId: "chatroom-project-js-f7612",
    storageBucket: "chatroom-project-js-f7612.appspot.com",
    messagingSenderId: "992049748458",
    appId: "1:992049748458:web:c58e88bb107ab52d40fa93"
  };

//Init firebase app
initializeApp(firebaseConfig)

// init firestore services
const db = getFirestore()
const auth = getAuth()

//collection reference
const colRef = collection(db, 'chats')

class Chatroom{
  constructor(room, username){
    this.room = room
    this.username = username

  }

  async addChat(message){
   
    //add document
    addDoc(colRef, {
      message,
      username: this.username,
      room: this.room,
      createdAt: serverTimestamp()

    })

  }

  getChats(callback){
    //query item
    // const q = query(colRef, where("username", "===", "caleb"))

    onSnapshot(colRef, (snapshot) => {
      snapshot.docChanges().forEach(change => {
        if(change.type === 'added'){
          //update the ui
          callback(change.doc.data())
        }
      })
    })

  }

}

const chatroom = new Chatroom('movies', 'caleb')

// chatroom.addChat('Seinfeld is the GOAT')
//   .then(() => console.log('chat added'))
//   .catch(err => console.log(err))

chatroom.getChats((data) => {
    console.log(data)
})