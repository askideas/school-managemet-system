import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCivm3uoYsHrkOdKTnd94DIig6RepvkJtg",
  authDomain: "school-management-system-7fe4e.firebaseapp.com",
  projectId: "school-management-system-7fe4e",
  storageBucket: "school-management-system-7fe4e.appspot.com",
  messagingSenderId: "841425938779",
  appId: "1:841425938779:web:f21b847d8c66fee736527e",
  measurementId: "G-95R4259KK1"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)

export default app
