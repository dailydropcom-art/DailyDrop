import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';

const config = window.DAILYDROP_FIREBASE_CONFIG;
const form = document.querySelector('[data-login-target]');

if (!config || Object.values(config).some((value) => value.startsWith('REPLACE_WITH_'))) {
    showError('Firebase is not configured. Add your Firebase web app settings in js/firebase-config.js.');
} else if (form) {
    const app = initializeApp(config);
    const auth = getAuth(app);

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const button = form.querySelector('button[type="submit"]');
        const email = form.elements.email.value.trim().toLowerCase();
        const password = form.elements.password.value;
        button.disabled = true;
        button.textContent = 'Signing in...';
        clearError();

        try {
            const credential = await signInWithEmailAndPassword(auth, email, password);
            if (form.dataset.role === 'admin') {
                if (email !== window.DAILYDROP_ADMIN_EMAIL) {
                    await auth.signOut();
                    throw new Error('This account is not authorized for admin access.');
                }
                localStorage.setItem('adminSession', JSON.stringify(true));
            } else {
                const sellers = read('sellers', []);
                const seller = sellers.find((entry) => entry.email.toLowerCase() === email);
                if (!seller) {
                    await auth.signOut();
                    throw new Error('No seller profile is linked to this Firebase account.');
                }
                localStorage.setItem('activeSeller', JSON.stringify(seller.id));
            }
            localStorage.setItem('firebaseUser', JSON.stringify({ uid: credential.user.uid, email }));
            window.location.href = form.dataset.loginTarget;
        } catch (error) {
            showError(firebaseMessage(error));
            button.disabled = false;
            button.textContent = 'Login';
        }
    });
}

function read(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch (error) {
        return fallback;
    }
}

function showError(message) {
    let error = document.getElementById('loginError');
    if (!error) {
        error = document.createElement('p');
        error.id = 'loginError';
        error.setAttribute('role', 'alert');
        error.className = 'mt-3 text-sm text-red-600';
        form?.append(error);
    }
    error.textContent = message;
}

function clearError() {
    document.getElementById('loginError')?.remove();
}

function firebaseMessage(error) {
    const messages = {
        'auth/invalid-credential': 'Incorrect email or password.',
        'auth/invalid-email': 'Enter a valid email address.',
        'auth/too-many-requests': 'Too many attempts. Try again later.'
    };
    return messages[error.code] || error.message || 'Unable to sign in.';
}
