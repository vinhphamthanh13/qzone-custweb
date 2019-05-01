import firebase from 'firebase';

export const initializeFirebase = () => {
  firebase.initializeApp({
    apiKey: 'AIzaSyBRlHtcbfDUaTokAzoitEe8lP2xpFvPvBo',
    authDomain: 'fir-bce15.firebaseapp.com',
    databaseURL: 'https://fir-bce15.firebaseio.com',
    projectId: 'fir-bce15',
    storageBucket: 'fir-bce15.appspot.com',
    messagingSenderId: '988018388150', // troque pelo seu sender id
  });

  console.log('init FIREBASE', Date.now());
  // use other service worker
  // navigator.serviceWorker
  //   .register('/my-sw.js')
  //   .then((registration) => {
  //     firebase.messaging().useServiceWorker(registration);
  //   });
};

export const askForPermissioToReceiveNotifications = async () => {
  try {
    const messaging = firebase.messaging();
    await messaging.requestPermission();
    const token = await messaging.getToken();
    console.log('user token: ', token);

    return token;
  } catch (error) {
    console.error(error);
  }
  return null;
};
