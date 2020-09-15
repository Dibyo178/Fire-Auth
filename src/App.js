import React, { useState } from 'react';
// import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser,setNewUser]=useState(false);
  const [user,setUser]=useState({
    isSignedIn:false,
    name:'',
    email:'',
    password:'',
    photo:''
  })
     // Google provider.
const googleProvider = new firebase.auth.GoogleAuthProvider();


 // Facebook provider..

 const fbProvider = new firebase.auth.FacebookAuthProvider();

const handleSignIn=()=>{
  
firebase.auth().signInWithPopup(googleProvider)
.then(res=>{
  const {displayName,photoURL,email}=res.user;
  const signInUser={
    isSignedIn:true,
    name:displayName,
    email:email,
    photo:photoURL

  }

  setUser(signInUser);

  console.log(displayName,photoURL,email);
})

.catch(err=>{
  console.log(err);
  console.log(err.message);
})
}

const handleFbSignIn=()=>{
  firebase.auth().signInWithPopup(fbProvider).then(function(result) {
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    console.log(user);
    // ...
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    console.log(errorCode,errorMessage,email ,credential)
    // ...
  });
}
 
   
  
  



const handleSignOut=()=>{
 firebase.auth().signOut()
 .then(rse=>{
  const signOutUser={
    isSignedIn:false,
    name:'',
    email:'',
    password:'',
    photo:'',
    error:'',
    success:'',
    // newUser:false
  }
setUser(signOutUser);

 })
 .catch(err=>{

 })
}

const handleBlur=(event)=>{

  let isFieldValid=true;
  // debugger;
 console.log(event.target.name,event.target.value);
 if(event.target.name==='email'){
  isFieldValid= /\S+@\S+\.\S+/.test(event.target.value);
  }
  if(event.target.name==='Password'){
    const isPasswordValid=event.target.value>6;
    const isPasswordNumber=/\d{1}/.test(event.target.value);
    isFieldValid=isPasswordValid && isPasswordNumber;
  }

  if(isFieldValid){
    const newUserInfo={...user};
    newUserInfo[event.target.name]= event.target.value;
    setUser(newUserInfo);

  }
}
const handleSubmit=(e)=>{
  // console.log(user.email,user.password);
  if(newUser &&  user.email && user.password){
    firebase.auth().createUserWithEmailAndPassword(user.email,user.password)
    .then(res=>{
      const newUserInfo={...user};
      newUserInfo.error='';
      newUserInfo.success=true;
      setUser(newUserInfo);
      updateUserName(user.name);



    })
    
     .catch(function(error) {
      // Handle Errors here.
      // var errorCode = error.code;
      // var errorMessage = error.message;
      // // ...
      // console.log(errorCode,errorMessage)

      const newUserInfo={...user};
      newUserInfo.error=error.message;
      newUserInfo.success=false;
      setUser(newUserInfo);
    });
  }

  if(!newUser && user.email && user.password){
    firebase.auth().signInWithEmailAndPassword(user.email,user.password)
    .then(res=>{
      const newUserInfo={...user};
      newUserInfo.error='';
      newUserInfo.success=true;
      setUser(newUserInfo);
      console.log('sign in user info:',res.user);
    })
    
    .catch(function(error) {
      const newUserInfo={...user};
      newUserInfo.error=error.message;
      newUserInfo.success=false;
      setUser(newUserInfo);
    });
  }
 
e.preventDefault();
}
const updateUserName= name=>{
  var user = firebase.auth().currentUser;

user.updateProfile({
  displayName: name,
  
}).then(function() {
  // Update successful.
  console.log('user name Update successful.')
}).catch(function(error) {
  // An error happened.
  console.log(error);
});
}

  return (
    <div className="App">
      {
        user.isSignedIn?<button onClick={handleSignOut}>Sign Out</button>:


       <button onClick={handleSignIn}>Sign in</button>

      }
      <br/>

      <button onClick={handleFbSignIn}>Sign in using Facebook</button>

      
      {
        user.isSignedIn && <div>
          <p>Welcome{user.name}</p>
          <p>your email:{user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }
       <form onSubmit={handleSubmit}>
       <h1>Our own Authentication</h1>

            {/* toggle use */}

           <input type="checkbox" onChange={()=>setNewUser(!newUser)} name="newUser" id=""/> 
       <label htmlFor="newUser">New User Sign Up</label>
       <br/>




       {/* <p>Name:{user.name}</p>
       <p>Email:{user.email}</p>
       <p>Password:{user.password}</p> */}
         {newUser &&<input type="text" name='name' onBlur={handleBlur} placeholder='your name'/>
}       <br/>
       <input type="text" name="email" onBlur={handleBlur} placeholder='Your Email Addresses' required/>
       <br/>
       <input type="password" name="password" onBlur={handleBlur} id=""placeholder='Enter your Password' required />
       <br/>
       <input type="submit" value={newUser?'Sign Up':'Sign In'}/>

       </form>
       <p style={{color:"red"}}>{user.error}</p>
       {user.success && <p style={{color:"green"}}>User {newUser ?'created':"Logged in"} successfully</p>}

    </div>
  );
}

export default App;
