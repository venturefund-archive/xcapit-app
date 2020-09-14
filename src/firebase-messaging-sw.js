importScripts('https://www.gstatic.com/firebasejs/5.7.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.7.3/firebase-messaging.js');

firebase.initializeApp({
  messagingSenderId: '753598433776'
});

const messaging = firebase.messaging();
