import { initializeApp, getApps } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { FirebaseStorage, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCtpYy2-h52yYVOMk9jPBCfhbPQBE_zzUc",
  authDomain: "fire-homes-course-521e5.firebaseapp.com",
  projectId: "fire-homes-course-521e5",
  storageBucket: "fire-homes-course-521e5.firebasestorage.app",
  messagingSenderId: "399632705941",
  appId: "1:399632705941:web:c098ee2022590850e0ee9c",
};

// Initialize Firebase
// すでに初期化されたアプリのリストを返すアプリを取得するように設定する。
const currentApps = getApps();
let auth: Auth;
let storage: FirebaseStorage;

if (!currentApps.length) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  storage = getStorage(app);
} else {
  const app = currentApps[0];
  auth = getAuth(app);
  storage = getStorage(app);
}

export { auth, storage };
