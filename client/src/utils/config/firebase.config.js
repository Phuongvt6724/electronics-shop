import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // apiKey: "AIzaSyC6BSgwHtkzQ01S7lii7T36Nc26kRzc08s",
  // authDomain: "otp-project-9ebd9.firebaseapp.com",
  // projectId: "otp-project-9ebd9",
  // storageBucket: "otp-project-9ebd9.appspot.com",
  // messagingSenderId: "1012571624249",
  // appId: "1:1012571624249:web:41e04095b05dd5aea7cee8",
  // measurementId: "G-7FCY281J4C",

  // apiKey: "AIzaSyAWuSsUw-vHA8HhcMOjhXbjNKiHvUq2ixQ",
  // authDomain: "opt-project-6c2db.firebaseapp.com",
  // projectId: "opt-project-6c2db",
  // storageBucket: "opt-project-6c2db.appspot.com",
  // messagingSenderId: "253682854785",
  // appId: "1:253682854785:web:c8fc36c7e997eb3d241680",
  // measurementId: "G-WDR097W88G",

  apiKey: "AIzaSyBsYNqDtq_lVqh7gBMbBKntb5dNrQB8OCA",
  authDomain: "phonetechnology-c985e.firebaseapp.com",
  projectId: "phonetechnology-c985e",
  storageBucket: "phonetechnology-c985e.appspot.com",
  messagingSenderId: "687556923052",
  appId: "1:687556923052:web:ead49948b1c1eb26591909",
  measurementId: "G-BTFXW7X6W7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
