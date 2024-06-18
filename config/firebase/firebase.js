// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyCKwTCu5g-KwnrnQJln24ecryUXxzUOx7E',
    authDomain: 'sku-project-f16e6.firebaseapp.com',
    projectId: 'sku-project-f16e6',
    storageBucket: 'sku-project-f16e6.appspot.com',
    messagingSenderId: '160145127227',
    appId: '1:160145127227:web:477de64014be3400fe291e',
    measurementId: 'G-7TL5R18KPJ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
