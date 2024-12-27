
const {firestore}=require("./firestore")

const { doc,setDoc,updateDoc,addDoc ,collection, or} = require('@firebase/firestore');



let orders={}

function publishData(brand,data){

    return new Promise(async (resolve,reject)=>{
    // Publish to the brand's MQTT topic
   
    let externalOrderId=data.externalOrderId || data.orderId || "invalid_id_deafult_structure";
    
    const topic =data.externalOrderId;
    console.log("publishing topic",topic,data);
    try {
        const docId=externalOrderId|| "TRIAL"
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