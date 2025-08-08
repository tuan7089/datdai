import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCLukb1jU6Dkrh23tzJyKY0QklC4dIXNLg",
  authDomain: "dat-realtime.firebaseapp.com",
  databaseURL: "https://dat-realtime-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dat-realtime",
  storageBucket: "dat-realtime.firebasestorage.app",
  messagingSenderId: "730851235390",
  appId: "1:730851235390:web:e84402e039c8db7a24636f",
  measurementId: "G-4ZX0GY5D3L"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);