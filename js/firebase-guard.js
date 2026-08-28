import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

const config = window.DAILYDROP_FIREBASE_CONFIG || {
  apiKey: "AIzaSyDZGGp20QIIh_U9eB0i7mLaYdZXVYk8T8E",
  authDomain: "dailydrop-f2eb2.firebaseapp.com",
  projectId: "dailydrop-f2eb2",
  storageBucket: "dailydrop-f2eb2.firebasestorage.app",
  messagingSenderId: "1090772190302",
  appId: "1:1090772190302:web:6c63b7ed32faf761eb60cf",
  measurementId: "G-209VY8S6SV"
};

const path = window.location.pathname.toLowerCase();
const sellerPage = path.includes('/sellerhub/');
const adminPage = path.includes('/admin web/');

// Check if current page is login/index page
const isSellerLoginPage = sellerPage && (path.endsWith('index.html') || path.endsWith('/sellerhub/'));
const isAdminLoginPage = adminPage && (path.endsWith('index.html') || path.endsWith('/admin web/'));

// Dashboard pages that strictly require Auth Guard
const isProtectedPage = (sellerPage || adminPage) && !isSellerLoginPage && !isAdminLoginPage;

if (isProtectedPage) {
  // Hide UI until auth is verified
  document.documentElement.style.visibility = 'hidden';

  const app = initializeApp(config);
  const auth = getAuth(app);

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      localStorage.clear();
      // Redirect to respective login page
      if (sellerPage) {
        window.location.replace('index.html');
      } else if (adminPage) {
        window.location.replace('index.html');
      }
    } else {
      // User authenticated: Show page UI
      document.documentElement.style.visibility = 'visible';
    }
  });
}