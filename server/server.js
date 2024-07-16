const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Helper function to read JSON files
const readJSON = (filePath) => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

// Helper function to write JSON files
const writeJSON = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// Load data from JSON files
const validationData = {
  srbs: readJSON(path.join(__dirname, '../data/srbs.json')),
  items: readJSON(path.join(__dirname, '../data/items.json')),
  customers: readJSON(path.join(__dirname, '../data/customers.json')),
  contacts: readJSON(path.join(__dirname, '../data/contacts.json'))
};

const ordersFilePath = path.join(__dirname, '../data/orders.json');

// Endpoint to get validation data
app.get('/getValidationData', (req, res) => {
  res.json(validationData);
});

// Endpoint to handle form submission
app.post('/submitOrder', (req, res) => {
  const formData = req.body;

  // Load existing orders
  let orders = readJSON(ordersFilePath);

  // Generate a new order number and line ID
  const orderNumber = `EST-${(orders.length + 1).toString().padStart(7, '0')}`;
  const lineId = orders.length + 1;

  // Store the order data
  orders.push({ orderNumber, lineId, ...formData });

  // Write orders back to the file
  writeJSON(ordersFilePath, orders);

  // Respond with the order number and line ID
  res.json({ orderNumber, lineId });
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
