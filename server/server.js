const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Helper function to read JSON file
function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Helper function to write JSON file
function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Helper function to generate unique Line ID
function generateUniqueLineID() {
  const timestamp = Date.now().toString().slice(-5); // Last 5 digits of current timestamp
  const randomNum = Math.floor(10000 + Math.random() * 90000).toString(); // Random 5 digit number
  return `${timestamp}${randomNum}`;
}

// Endpoint to handle form submission
app.post('/submitOrder', (req, res) => {
  try {
    const ordersFilePath = path.join(__dirname, '..', 'Data', 'orders.json');
    const orders = readJSON(ordersFilePath);
    const orderNumber = (orders.length + 1).toString().padStart(7, '0');

    const newOrder = {
      dateOfSale: req.body.dateOfSale,
      orderNumber: orderNumber,
      srbName: req.body.srbName,
      customerName: req.body.customerName,
      contact: req.body.contact,
      shipToAddress: req.body.shipToAddress,
      lll: req.body.lll,
      paymentMethod: req.body.paymentMethod,
      products: req.body.products.map(product => ({
        ...product,
        lineId: generateUniqueLineID()
      }))
    };

    orders.push(newOrder);

    writeJSON(ordersFilePath, orders);

    res.json({ success: true, orderNumber, lineIds: newOrder.products.map(p => p.lineId) });
  } catch (error) {
    console.error('Error submitting order:', error);
    res.status(500).json({ error: 'Failed to submit order' });
  }
});

// Endpoint to add new contact
app.post('/addContact', (req, res) => {
  try {
    const contactsFilePath = path.join(__dirname, '..', 'Data', 'contacts.json');
    const contacts = readJSON(contactsFilePath);
    contacts.push(req.body);
    writeJSON(contactsFilePath, contacts);
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding contact:', error);
    res.status(500).json({ error: 'Failed to add contact' });
  }
});

// Endpoint to add new customer
app.post('/addCustomer', (req, res) => {
  try {
    const customersFilePath = path.join(__dirname, '..', 'Data', 'customers.json');
    const customers = readJSON(customersFilePath);
    customers.push(req.body);
    writeJSON(customersFilePath, customers);
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).json({ error: 'Failed to add customer' });
  }
});

// Endpoint to get validation data
app.get('/getValidationData', (req, res) => {
  try {
    const contacts = readJSON(path.join(__dirname, '..', 'Data', 'contacts.json'));
    const customers = readJSON(path.join(__dirname, '..', 'Data', 'customers.json'));
    const items = readJSON(path.join(__dirname, '..', 'Data', 'items.json'));
    const srbs = readJSON(path.join(__dirname, '..', 'Data', 'srbs.json'));

    res.json({
      contacts,
      customers,
      items,
      srbs,
    });
  } catch (error) {
    console.error('Error getting validation data:', error);
    res.status(500).json({ error: 'Failed to get validation data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
