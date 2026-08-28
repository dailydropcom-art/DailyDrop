import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';

const config = window.DAILYDROP_FIREBASE_CONFIG;
const path = window.location.pathname.toLowerCase();
const sellerPage = path.includes('/sellerhub/');
const adminPage = path.includes('/admin web/');
const loginPage = /\/(index|login|register)\.html$/.test(path);
const protectedPage = (sellerPage || adminPage) && !loginPage;

if (protectedPage) {
    document.documentElement.style.visibility = 'hidden';

    if (!config || Object.values(config).some((value) => value.startsWith('REPLACE_WITH_'))) {
        redirectToLogin();
    } else {
        const auth = getAuth(initializeApp(config));
        onAuthStateChanged(auth, (user) => {
            const validAdmin = adminPage && user && user.email.toLowerCase() === window.DAILYDROP_ADMIN_EMAIL;
            const sellers = JSON.parse(localStorage.getItem('sellers') || '[]');
            const activeSellerId = JSON.parse(localStorage.getItem('activeSeller') || 'null');
            const validSeller = sellerPage && user && sellers.some((seller) => seller.id === activeSellerId && seller.email.toLowerCase() === user.email.toLowerCase());

            if (!user || (!validAdmin && !validSeller)) {
                localStorage.removeItem('adminSession');
                localStorage.removeItem('activeSeller');
                localStorage.removeItem('firebaseUser');
                redirectToLogin();
                return;
            }

            document.documentElement.style.visibility = 'visible';
        });
    }
}

function redirectToLogin() {
    window.location.replace(sellerPage ? 'index.html' : 'index.html');
}
