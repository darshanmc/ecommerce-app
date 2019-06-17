import firebase from 'firebase'
import 'firebase/firestore'

// web app's Firebase configuration
var firebaseConfig = {
    apiKey: <app-key>,
    authDomain: <auth-domain>,
    databaseURL: <database-url>,
    projectId: <project-id>,
    storageBucket: <storage-bucket>,
    messagingSenderId: <messaging-sender-id>,
    appId: <app-id>
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
export default firebase.firestore()
