import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"


const firebaseConfig = {
  apiKey: "AIzaSyDB_C9OROh8t9MlqV5LVkDvAKxjgC-SChI",
  authDomain: "scss-clone.firebaseapp.com",
  projectId: "scss-clone",
  storageBucket: "scss-clone.firebasestorage.app",
  messagingSenderId: "781544823433",
  appId: "1:781544823433:web:425d2ebee65ca664200458"
};

export const app = initializeApp(firebaseConfig)
export const auth=getAuth(app)