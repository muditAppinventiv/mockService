
const orders = require("./static/orders");
const publishData=require("./static/service")
const locations= require('./static/locations')
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

// Helper function to simulate an order journey
async function simulateOrderJourney(brand, orderId, items) {
  const eta = getRandomETA();
  const rider = getRiderDetails();

  // const orderEvents = [
  //   { status: 'Order Placed', eta: eta, rider: rider, items: items },
  //   { status: 'Order Prepared', eta: eta - 10, rider: rider, items: items },
  //   { status: 'Out for Delivery', eta: eta - 5, rider: rider, items: items },
  //   { status: 'Order Delivered', eta: 0, rider: rider, items: items }
  // ];
  const orderEvents = [
    { status: 'Order Placed', code: 100, eta: 30, rider: rider, items: items ,location:locations[0]},
    { status: 'Order Prepared', code: 101, eta: 20, rider: rider, items: items ,location:locations[0]},
    { status: 'Order Picked', code: 7, eta: 20, rider: rider, items: items ,location:locations[0]},
    { status: 'Out of Store Geo Fence (100 meters)', code: 12, eta: 12, rider: rider, items: items,location:locations[1] },
    { status: 'Out for Delivery', code: 7, eta: 10, rider: rider, items: items ,location:locations[2]},
    { status: 'Out for Delivery', code: 7, eta: 8, rider: rider, items: items ,location:locations[3]},
    { status: 'Out for Delivery (2x)', code: 7, eta: 6, rider: rider, items: items,location:locations[4] },
    { status: 'Out for Delivery (2x)', code: 7, eta: 4, rider: rider, items: items,location:locations[5] },
    { status: 'Rider Reached Customer Geo Fence(100 meters)', code: 13, eta: 2, rider: rider, items: items,location:locations[6] },
    { status: 'Order Delivered', code: 111, eta: 0, rider: rider, items: items ,location:locations[7]}
];

let additiona_payload={
  "clubbed_order": "NO",
  "clubbed_intransit": "YES",
  "non_integrated_dod_rider": "No",
  "integrated_dod_rider": "Yes",
  "order_on_hold": "Yes/No",
  "speed": 0.72037643,
  "accuracy": 22.084,
  "heading": 101,
  "poscreatedattimezone": "2024-09-11T12:08:58Z",
  "createdattimezone": "2024-09-11T12:10:12Z",
  "planneddeliverytimezone": "2024-09-11T12:53:58Z",
  "ordersourceid": 4,
  "storebspnumber": "155c63dc78df480da008a76fde914d35",
  "countryid": 1,
  "brandid": 3,
  "storeid": "671",
  "almporderid": "ca76858a2eb1144b265df5c4a45146a2f5b67eca"
};

  for (let i = 0; i < orderEvents.length; i++) {
    try {
      console.log(" ------Generated------ ");

      console.log(`Sending "${orderEvents[i].status}" update for ${brand}, Order ID: ${orderId}`);

      // Send event to the brand's webhook
      publishData(brand,Object.assign({}, {
        orderId: orderId,
        riderId: "13475",
        riderName: orderEvents[i].rider.name,
        riderPhone: orderEvents[i].rider.phone,
        customerName: "dima 1987",
        customerPhone: "566628897",
        order_status: orderEvents[i].status,
        almpStatusId:orderEvents[i].code,
        eta: orderEvents[i].eta,
      },orderEvents[i].location,additiona_payload)).then(msg=> console.log("----Generated----",msg)).catch(err=>console.log("----ErrorGenerated----",err))
  
      // Delay between each event to simulate a real journey (2 seconds for demo purposes)
      await new Promise(resolve => setTimeout(resolve, getRandomTimeout()*1000));

    } catch (error) {
      console.log(`Error sending ${orderEvents[i].status} for ${brand}, Order ID: ${orderId}`, error);
    }
  }

  console.log(`Order journey for ${brand}, Order ID: ${orderId} completed.`);
}

// Simulate orders for all brands
async function simulateOrders() {
 
  // Simulate order journeys for each brand
  var order=orders[0];
  await simulateOrderJourney(order.brand, order.orderId, order.items);


}

// Start the order simulation
// simulateOrders();
module.exports=simulateOrders;
