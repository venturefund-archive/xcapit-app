importScripts('https://www.gstatic.com/firebasejs/7.21.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.21.0/firebase-analytics.js');

firebase.initializeApp({
  messagingSenderId: '840751586681'
});

const messaging = firebase.messaging();
