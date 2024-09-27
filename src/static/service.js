
const {firestore}=require("./firestore")

const { doc,setDoc,updateDoc,addDoc ,collection, or} = require('@firebase/firestore');

// Hashing function for topics
function getHashedTopic(brand, orderId) {
    // const hash = crypto.createHash('sha256');
    // hash.update(`${brand}-${orderId}`);
    // return hash.digest('hex');
    return orderId;
  }
 

let orders={}

function publishData(brand,data){

    return new Promise(async (resolve,reject)=>{
    // Publish to the brand's MQTT topic
   
    let orderId=data.orderId;
    if(data.orderId){
    
          if(!orders[orderId]){
              // TODO hashing 
              orders[orderId]=orderId;
              
          }
    } 
    const topic =getHashedTopic(brand, data.orderId);
    console.log("publishing topic",topic,data);
    try {
        const docId=orders[orderId] || "TRIAL"
        // const result = await addDoc(collection(firestore, brand), data);
        const docRef = doc(firestore, brand, docId);
        await setDoc(docRef, data);
        console.log("Document added with ID: ", docRef.id);
        resolve("Data added successfully with ID: " + docRef.id);
      } catch (err) {
        console.log("Error: " + err.message);
        reject("Error: " + err.message);
      }
      
    })
    
        
    
    }

module.exports=publishData