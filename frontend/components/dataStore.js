import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnkFBcSYUeTxLc-DS09SYmTgifhtRwIM8",
  authDomain: "gosda-df486.firebaseapp.com",
  projectId: "gosda-df486",
  storageBucket: "gosda-df486.appspot.com",
  messagingSenderId: "447732893727",
  appId: "1:447732893727:web:0ad0e679be3fe38fbfad2a",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const getCid = async () => {
  try {
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.log(error);
  }
};

export { db };
