import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore.js";

function init() {
  const firebaseConfig = {
    apiKey: "AIzaSyCpVT6YJMyGxnKrhDFB6957kUI_wbtAF_4",
    authDomain: "todo-app-homework.firebaseapp.com",
    projectId: "todo-app-homework",
    storageBucket: "todo-app-homework.appspot.com",
    messagingSenderId: "169828689109",
    appId: "1:169828689109:web:4bf81e1a19b2a44d562e5c",
  };

  const app = initializeApp(firebaseConfig);

  const auth = getAuth();

  const createToDoItemButton = document.querySelector("#add-new-item");
  const toDoItemInput = document.querySelector("#new-task-input");
  const toDoItemsNode = document.querySelector(".todo-items");
  const switchModeButton = document.querySelector("#show-button");
  const todoView = document.querySelector("#view-change");
  const signInButton = document.querySelector("#switch-signin");
  const signUpButton = document.querySelector("#switch-signup");

  const toDoItems = [];
  const toDoItemsWork = [];
  const toDoItemsHome = [];
  const toDoItemsElse = [];

  const db = getFirestore();

  const fetch = async () => {
    const querySnapshot = await getDocs(collection(db, "todo"));

    const ulNode = document.querySelector("ul");
    ulNode.innerHTML = "";

    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  };

  fetch();

  // User Authentication handling

  const showSection = (sectionName) => {
    document.querySelectorAll("section").forEach((section) => {
      section.style.display = "none";
    });
    document.querySelector(`#${sectionName}`).style.display = "block";
  };

  showSection("loading");

  document.querySelector("#signup form").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = e.target.querySelector('[type="email"]').value;
    const password = e.target.querySelector('[type="password"]').value;
    createUserWithEmailAndPassword(auth, email, password).catch(console.error);
  });

  document.querySelector("#signin form").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = e.target.querySelector('[type="email"]').value;
    const password = e.target.querySelector('[type="password"]').value;
    signInWithEmailAndPassword(auth, email, password).catch(console.error);
  });

  document.querySelector("#signout").addEventListener("click", () => {
    signOut(auth).catch(console.error);
  });

  signInButton.addEventListener("click", () => {
    showSection("signin");
  });

  signUpButton.addEventListener("click", () => {
    showSection("signup");
  });

  let userPrevState;
  onAuthStateChanged(auth, (user) => {
    console.log(user);
    if (user) {
      showSection("signin-success");
    } else {
      if (userPrevState) {
        showSection("signin");
      } else {
        showSection("signup");
      }
    }
    userPrevState = user;
  });
}

window.onload = init();
