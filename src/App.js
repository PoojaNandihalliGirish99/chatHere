import React, { useState, useRef }  from 'react';
import './App.css';

import firebase from 'firebase/app'
import 'firebase/firestore' //for DB
import 'firebase/auth' //for user authentication

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

firebase.initializeApp({
  
  apiKey: "AIzaSyAr7KmZWaE89UhLbe466n_gJonZWW2-lWE",
  authDomain: "f-r-i-e-n-d-s-ef962.firebaseapp.com",
  projectId: "f-r-i-e-n-d-s-ef962",
  storageBucket: "f-r-i-e-n-d-s-ef962.appspot.com",
  messagingSenderId: "385599306169",
  appId: "1:385599306169:web:f0de65e70734ef8ac9de68"

})

if (!firebase.apps.length) {
  firebase.initializeApp({});
}else {
  firebase.app(); // if already initialized, use that one
}

const auth = firebase.auth()
const firestore = firebase.firestore()

function App() {

  const [user] = useAuthState(auth);

  return (
    <div>
    <div className="container">
      <header>
      <div className="row g-0">
      <h3 className="col-sm-6 col-md-8 text-center">f-r-i-e-n-d-s</h3>
      <span class="col-6 col-md-4">
      <SignOut /></span>
      
      </div>

      <div className="mt-4">
      {user ? <Chatroom /> : <SignIn />}
      </div>
        
      </header>
      </div>
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
  }

  return(
    <button className="nav-link active"
    onClick={signInWithGoogle}>Sign In with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    
    <button className="nav-link active"
    onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function Chatroom() {

  const dummy = useRef()
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField:'id'});
  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {

    e.preventDefault()
    const {uid, photoURL} = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL

    });

    setFormValue('');
    dummy.current.scrollIntoView({behavior: 'smooth'});

  }

  return (
    <div className="container-fluid">
      <main className="ml-2 mr-2 bg-dark text-white">
      {messages && messages.map(msg =>(
        <div className="container-fluid">
        <ChatMessage
        key={msg.id} 
        message={msg} />
        </div>
      )
        )}
      <div ref={dummy}></div>
      </main>
      <form className="row g-0"
      onSubmit={sendMessage}>
      <input className="col-sm-6 col-md-8"
      value={formValue} 
      placeholder="Type your message here"
      onChange={(e) => setFormValue(e.target.value)}>
      </input>
      <button class="col-6 col-md-4"
      type="submit"></button>
      </form>

      </div>
    
      
    
  )


}

function ChatMessage(props) {
  const {text, uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved';
  return (
    <div className={`display-flex  ${messageClass}`}>
    <div>
    <img src = {photoURL} />
    <p>{text}</p>
    </div>
    
    </div>
  )
}

export default App;
