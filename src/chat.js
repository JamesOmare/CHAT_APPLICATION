import './styles/style.css'
import { lastDayOfMonth, format, formatDistanceToNowStrict, formatDistance } from "date-fns"
import { formatDistanceToNow } from "date-fns/esm"

// import './ui.js'
// import './app.js'
import {initializeApp} from 'firebase/app'
import {
  getFirestore, collection, getDocs, 
  addDoc, deleteDoc,doc, onSnapshot, Timestamp,
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
    this.unsub
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
    const q = query(colRef, where("room", "==", this.room), orderBy('createdAt'))

    
    this.unsub = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach(change => {
        if(change.type === 'added'){
          //update the ui
          callback(change.doc.data())
        } 
      })
    })

  }

  updateName(username){
    this.username = username
  }

  updateRoom(room){
    this.room = room
    console.log('room updated')
    if(this.unsub){
      this.unsub()
    }
    
  }

}

// const chatroom = new Chatroom('movies', 'caleb')

// // chatroom.addChat('Seinfeld is the GOAT')
// //   .then(() => console.log('chat added'))
// //   .catch(err => console.log(err))

// chatroom.getChats((data) => {
//     console.log(data)
// })


// setTimeout(() => {
//   chatroom.updateRoom('gaming')
//   chatroom.updateName('Sonya')
//   chatroom.getChats((data) => {
//     console.log(data)
//   })
//   chatroom.addChat('Lets play Ghost of Tsushima my people')
// }, 3000)

// chatroom.updateRoom('gaming')

const now = new Date()

class ChatUI {
  constructor(list){
      this.list = list
  }

  render(data){

//     //date fns
// console.log(format(now, 'yyyy'))
// console.log(format(now, 'MMM'))
// console.log(format(now, 'EEEE'))
// console.log(format(now, 'do'))
// console.log(format(now, 'EEEE do MMMM yyyy'))

// //console.log(formatDistance(now, before, {addSuffix: true}))

// console.log(lastDayOfMonth(today))

      const when = formatDistanceToNow(Timestamp.fromDate(new Date()).toDate(), {addSuffix: true})

      const html = 
      `
      <li class = 'list-group-item>
          <span class = 'username'>${data.username}</span>
          <span class = 'message'>${data.message}</span>
          <div class='time'>${when}</div>
      </li>
      `

      this.list.innerHTML += html 
  }
}

//dom queries
const chatList = document.querySelector('.chat-list')

//class instance
const chatUI = new ChatUI(chatList)
const chatroom = new Chatroom('general', 'michael')

//get chats and render
chatroom.getChats((data) => {
    chatUI.render(data)
}) 