
const orders = require("./static/orders");
const publishData=require("./static/service")
const locations= require('./static/locations');
const { makePostRequest } = require("./static/azureservie");
// Mock Webhook URLs for each brand
const webhookUrls = {
  kfc: 'http://localhost:3000/webhook/kfc',
  pizzahut: 'http://localhost:3000/webhook/pizzahut',
  hardees: 'http://localhost:3000/webhook/hardees'
};

// Helper function to generate random ETA (between 15-45 minutes)
function getRandomETA() {
  return Math.floor(Math.random() * 30) + 15;  // ETA between 15 to 45 minutes
}
function getRandomTimeout() {
  return Math.floor(Math.random() * 5) + 5;  // ETA between 5 to 10 seconds
}

// Helper function to generate random rider details
function getRiderDetails() {
  const riders = [
    { name: 'John Doe', phone: '555-1234' },
    { name: 'Jane Smith', phone: '555-5678' },
    { name: 'Rick Johnson', phone: '555-9012' }
  ];
  return riders[Math.floor(Math.random() * riders.length)];
}


//updated new payload
async function simulateOrderJourney2(brand, orderId, items) {
  const eta = getRandomETA();
  const rider = getRiderDetails();

  const orderEvents = [
    
    { status: 'Unassigned', code: 11, eta: 30, location: locations[0] },
    { status: 'Assigned', code: 2, eta: 20, location: locations[0] },
    { status: 'Seen', code: 3, eta: 20, location: locations[0] },
    { status: 'Scanned', code: 4, eta: 20, location: locations[0] },
    { status: 'OrderPicked', code: 7, eta: 20, location: locations[0] },
    { status: 'OrderPicked', code: 12, eta: 14, location: locations[1] },
    { status: 'OrderPicked', code: 7, eta: 11, location: locations[2] },
    { status: 'OrderPicked', code: 7, eta: 8, location: locations[3] },
    { status: 'OrderPicked', code: 7, eta: 6, location: locations[4] },
    { status: 'OrderPicked', code: 7, eta: 4, location: locations[5] },
    { status: 'OrderPicked', code: 13, eta: 2, location: locations[6] },
    { status: 'Delivered', code: 8, eta: 0, location: locations[7] },
  ];
  
  let isStoreGeoFenceIn=true;


  for (let i = 0; i < orderEvents.length; i++) {
    try {
      console.log(`Sending "${orderEvents[i].status}" update for ${brand}, Order ID: ${orderId}`);

      if(orderEvents[i].code===12){
        isStoreGeoFenceIn=false;
      }
      
      // Firestore payload structure
      let firestorePayload = {
        countryId: 1,
        brandId: 1,
        storeId: "115",
        customerPhone: "388296",
        customerName: "Ali Almos",
        storeBSPNumber: "7f98005bdd224e6f9f7207bc43a4",
        storeLocationLat: "26.1826617",
        storeLocationLng: "50.4661924",
        orderId: orderId,
        externalOrderId: "18867396",
        almpOrderId: "4c292782f0c7232c3b0fc0e8e2bbc013447ae",
        createdAtTimezone: "2024-12-12T23:42:56Z",
        plannedDeliveryTimezone: "2024-12-13T00:16:47Z",
        orderSourceId: 2,
        almpStatusId: orderEvents[i].code,
        deliveryLocationLat: "26.187386",
        deliveryLocationLng: "50.48678",
        posCreatedAtTimezone: "2024-12-12T23:41:47Z",
        riderLatitude: rider.latitude || "",
        riderLongitude: rider.longitude || "",
        eta: orderEvents[i].eta,
        riderId: rider.id || "",
        riderName: rider.name || "",
        riderPhone: rider.phone || "",
        accuracy: "",
        speed: "",
        heading: "0",
        URL: "",
        orderPosId: "63102",
        orderSourceName: "Call Center",
        orderStatusName: orderEvents[i].status,
        isIntegratedPartner: false,
        isOrderOnHold: true,
        isClubbedOrder: true,
        inTransit: false,
        isStoreGeoFenceIn,
        tmpKey1: "",
        tmpKey2: "",
        tmpKey3: "",
        tmpKey4: "",
        tmpKey5: "",
      };

     firestorePayload= Object.assign({},firestorePayload,orderEvents[i].location);
     console.log(firestorePayload)

     let response=await makePostRequest(firestorePayload);
     console.log("response",response)
    
      await new Promise((resolve) => setTimeout(resolve, getRandomTimeout() * 1000));

      
      
    } catch (error) {
      console.log(`Error sending ${orderEvents[i].status} for ${brand}, Order ID: ${orderId}`, error);
    }
  }

  console.log(`Order journey for ${brand}, Order ID: ${orderId} completed.`);
}

// Simulate orders for all brands
async function serversimulateOrders(orderId) {
 
  // Simulate order journeys for each brand
  var order=orders[0];
  await simulateOrderJourney2(order.brand, orderId, order.items);


}

// Start the order simulation
// simulateOrders();
module.exports=serversimulateOrders;
