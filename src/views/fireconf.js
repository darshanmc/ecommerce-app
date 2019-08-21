import firebase from 'firebase'
import 'firebase/firestore'

// web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAdswEAFaI1BtTYzAQO1_2fWRgVmF_xfWA",
    authDomain: "ecommerce-61d0d.firebaseapp.com",
    databaseURL: "https://ecommerce-61d0d.firebaseio.com",
    projectId: "ecommerce-61d0d",
    storageBucket: "ecommerce-61d0d.appspot.com",
    messagingSenderId: "593612175780",
    appId: "1:593612175780:web:73cdce06f6b9f393"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
export default firebase.firestore()