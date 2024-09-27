// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const {getFirestore,collection,getDocs} =require("firebase/firestore");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6J-lPmtiFT1IpfCqrv7FY_wZKdWHsCHE",
  authDomain: "almp-poc-firestore-v1.firebaseapp.com",
  projectId: "almp-poc-firestore-v1",
  storageBucket: "almp-poc-firestore-v1.appspot.com",
  messagingSenderId: "731495409052",
  appId: "1:731495409052:web:c097f46a89ca0e07e21459",
  measurementId: "G-HVY0V4RTDY"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
// console.log(app,firestore)


let connectionStatus = false;

const checkConnection = () => {
    if (connectionStatus) {
        console.log('Firestore connection is live');
    } else {
        console.log('Firestore connection is not live');
    }
};
  // Example: Read data from Firestore
const snapshot =  collection(firestore,'pocv1');

// const st=async ()=>{
// const res=await getDocs(snapshot);
// res.forEach(doc => {
//         console.log(doc.id, '=>', doc.data());
//  });
// }
// st()


// Export the Firestore client and reconnect function
module.exports = { firestore };

// Call the start function to check the connection when the module is loaded
// start();


