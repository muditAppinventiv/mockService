const { initializeApp } =require( "firebase/app")
const { getFirestore, doc, onSnapshot } =require( "firebase/firestore");
const { firestore } =require( "../static/firestore");
// Your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
};

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
const db=firestore;
// Assume the user is authenticated and has access to their order document
const orderId = 'kfc123';  // Dynamic order ID
const brand="kfc"
const docRef = doc(db, brand, orderId);

// Real-time listener for order updates
onSnapshot(docRef, (docSnapshot) => {
  if (docSnapshot.exists()) {
    console.log('Order data:', docSnapshot.data());
  } else {
    console.log('No such order!');
  }
});
