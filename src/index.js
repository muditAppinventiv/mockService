const express = require('express');
const bodyParser = require('body-parser');
const { firestore } = require('./static/firestore');
const publishData=require("./static/service")

const { doc,setDoc,updateDoc,addDoc ,collection, or} = require('@firebase/firestore');
const simulateOrders = require('./generator');
const serversimulateOrders = require('./servergenerator');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());



// Webhook to handle incoming brand updates
app.post('/webhook/:brand', async (req, res) => {
  const { brand } = req.params;
  const data = req.body;
   
   publishData(brand,data).then(msg=>res.status(200).send(msg)) .catch(err=>res.status(400).send(err))


  
});

// Endpoint for clients to get an order by its ID
app.get('/order/:brand/:orderId', async (req, res) => {
  const { brand, orderId } = req.params;

  try {
    const doc = orders[orderId]
    if (!doc) {
      return res.status(404).send("Order not found");
    }
    res.status(200).send(doc);
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
});


app.get('/generate', async (req, res) => {
  // const { brand, orderId } = req.params;
  let orderId="kfc_official_structure_default"
  simulateOrders(orderId);
  res.send("Generated")
});

app.get('/generate/:orderId', async (req, res) => {
  const { brand, orderId } = req.params;
  if(orderId){
    simulateOrders(orderId);
  }
  else{
    simulateOrders("kfc_official_structure_dynamic");
  }
  
  res.send(" Dynamic Generated")
});


app.get('/servergenerate', async (req, res) => {
  // const { brand, orderId } = req.params;
  let orderId="kfc_official_structure_default"
  serversimulateOrders(orderId);
  res.send("Generated")
});

app.get('/servergenerate/:orderId', async (req, res) => {
  const { brand, orderId } = req.params;
  if(orderId){
    serversimulateOrders(orderId);
  }
  else{
    serversimulateOrders("kfc_official_structure_dynamic");
  }
  
  res.send(" Dynamic Generated")
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Service running on port ${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception:', err);
  process.exit(1);
});
