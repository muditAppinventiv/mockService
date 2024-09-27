const express = require('express');
const bodyParser = require('body-parser');
const { firestore } = require('./static/firestore');
const publishData=require("./static/service")

const { doc,setDoc,updateDoc,addDoc ,collection, or} = require('@firebase/firestore');
const simulateOrders = require('./generator');

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
    const { brand, orderId } = req.params;
    simulateOrders();
    res.send("Generated")
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
