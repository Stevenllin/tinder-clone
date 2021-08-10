import firebase from 'firebase'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCVouR1ejGRUbTy2OU3xjYNC0KhhINBRRQ",
    authDomain: "tinder-clone-5b308.firebaseapp.com",
    projectId: "tinder-clone-5b308",
    storageBucket: "tinder-clone-5b308.appspot.com",
    messagingSenderId: "532064545267",
    appId: "1:532064545267:web:50c6d7d7c279d6d052ca86",
    measurementId: "G-T8WJ6BV12W"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)
const firestore = firebaseApp.firestore()

export const database = {
    people: firestore.collection('people'),
    profiles: firestore.collection('profiles'),
    individuals: firestore.collection('individuals'),
    rooms: firestore.collection('rooms')
}

export const auth = firebaseApp.auth()
export const storage = firebaseApp.storage()
export default firebaseApp

