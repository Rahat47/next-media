import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyCEfbIP0xKd2VrFRErgFHLecBaftGr3sEk',
    authDomain: 'next-media-ff9c9.firebaseapp.com',
    projectId: 'next-media-ff9c9',
    storageBucket: 'next-media-ff9c9.appspot.com',
    messagingSenderId: '1039943656978',
    appId: '1:1039943656978:web:2209e44f02280d2df15acb',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();

const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
export const storage = firebase.storage();
