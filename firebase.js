// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDO0NMjGfOtY28A1omgtRf-OGHODTIXuE4",
  authDomain: "di-muro.firebaseapp.com",
  projectId: "di-muro",
  storageBucket: "di-muro.appspot.com",
  messagingSenderId: "23088781035",
  appId: "1:23088781035:web:23715e143d836737a750ae"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore();

/**
 * Save a New Task in Firestore
 * @param {string} title the title of the Task
 * @param {string} description the description of the Task
 */
export const saveTask = (title, precio, imagen) =>
  addDoc(collection(db, "productos"), { title, precio, imagen});

export const onGetTasks = (callback) =>
  onSnapshot(collection(db, "productos"), callback);

/**
 *
 * @param {string} id Task ID
 */
export const deleteTask = (id) => deleteDoc(doc(db, "productos", id));

export const getTask = (id) => getDoc(doc(db, "productos", id));

export const updateTask = (id, newFields) =>
  updateDoc(doc(db, "productos", id), newFields);

export const getTasks = () => getDocs(collection(db, "productos"));
