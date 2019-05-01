import firebase from 'firebase';

export const initializeFirebase = () => {
  firebase.initializeApp({
    apiKey: 'AIzaSyBRlHtcbfDUaTokAzoitEe8lP2xpFvPvBo',
    authDomain: 'fir-bce15.firebaseapp.com',
    databaseURL: 'https://fir-bce15.firebaseio.com',
    projectId: 'fir-bce15',
    storageBucket: 'fir-bce15.appspot.com',
    messagingSenderId: '988018388150',
  });

  // use other service worker
  // navigator.serviceWorker
  //   .register('/my-sw.js')
  //   .then((registration) => {
  //     firebase.messaging().useServiceWorker(registration);
  //   });
};

export const askForPermissionToReceiveNotifications = async () => {
  try {
    const messaging = firebase.messaging();
    await messaging.requestPermission();

    return await messaging.getToken();
  } catch (error) {
    console.error(error);
  }
  return null;
};
