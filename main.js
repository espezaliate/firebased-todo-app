import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js";

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
  const db = getFirestore();
  const auth = getAuth();

  const createToDoItemButton = document.querySelector("#add-new-item");
  const toDoItemInput = document.querySelector("#new-task-input");
  const toDoItemsNode = document.querySelector(".todo-items");
  const switchModeButton = document.querySelector("#show-button");
  const todoView = document.querySelector("#view-change");
  const signInButton = document.querySelector("#switch-signin");
  const signUpButton = document.querySelector("#switch-signup");

  // Get todo tasks

  const fetch = async () => {
    const querySnapshot = await getDocs(
      query(collection(db, "todo"), orderBy("timestamp"))
    );

    const ulNode = document.querySelector("ul");
    ulNode.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const docElement = doc.data();
      const docID =
        doc._document.key.path.segments[
          doc._document.key.path.segments.length - 1
        ];
      const liNode = document.createElement("li");
      ulNode.insertAdjacentElement("beforeend", liNode);
      liNode.innerHTML = `<div id=${docID}>${
        docElement.task
      }</div><div><label for="${
        docElement.task
      }">Done? </label><input type="checkbox" id="${docID}" name="${
        docElement.task
      }" ${
        docElement.done == true ? `checked` : ``
      }><div><button id=${docID}>Delete task</button><button id=${docID}>Edit task</button></div>`;
    });

    // Delete task

    const buttonListener = document.querySelectorAll("button");

    buttonListener.forEach((e) => {
      e.addEventListener("click", (e) => {
        if (e.target.outerText == "Delete task") {
          deleteDoc(doc(db, "todo", e.target.id));
          fetch();
        } else if (e.target.outerText === "Edit task") {
          const div = document.querySelectorAll("div");
          div.forEach((z) => {
            if (z.id == e.target.id) {
              z.innerHTML = `<input id=${z.id}0></input>`;
            }
          });
          e.target.outerHTML = `<button id=${e.target.id}>Save task</button>`;

          const saveListener = document.querySelectorAll("button");

          saveListener.forEach((e) => {
            e.addEventListener("click", (e) => {
              if (e.target.outerText == "Save task") {
                const input = document.querySelectorAll("input");
                input.forEach((x) => {
                  if (x.id == `${e.target.id}0`) {
                    updateDoc(doc(db, "todo", e.target.id), {
                      task: x.value,
                    });
                    x.outerHTML = `<div id=${e.target.id}>${x.value}</div>`;
                    e.target.outerHTML = ` <button id=${e.target.id}>Edit task</button>`;
                    fetch();
                  }
                });
              }
            });
          });
        }
      });
    });

    // Finished task toggle

    const checkboxListener = document.querySelectorAll("[type=checkbox]");

    checkboxListener.forEach((e) => {
      e.addEventListener("click", (e) => {
        e.target.checked
          ? updateDoc(doc(db, "todo", e.target.id), {
              done: true,
            })
          : updateDoc(doc(db, "todo", e.target.id), {
              done: false,
            });

        fetch();
      });
    });
  };

  fetch();

  // Adding new tasks to the list

  createToDoItemButton.addEventListener("click", (e) => {
    e.preventDefault();
    const addTask = async () => {
      await addDoc(collection(db, "todo"), {
        task: `${toDoItemInput.value}`,
        done: false,
        timestamp: +new Date(),
      });
      toDoItemInput.value = "";
    };
    addTask();
    fetch();
  });

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
