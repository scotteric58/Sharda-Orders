const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

function readJSON(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (parseErr) {
          reject(parseErr);
        }
      }
    });
  });
}

app.get('/getValidationData', async (req, res) => {
  try {
    const srbs = await readJSON(path.join(__dirname, '../Data/srbs.json'));
    const items = await readJSON(path.join(__dirname, '../Data/items.json'));
    const customers = await readJSON(path.join(__dirname, '../Data/customers.json'));
    const contacts = await readJSON(path.join(__dirname, '../Data/contacts.json'));
    res.json({ srbs, items, customers, contacts });
  } catch (error) {
    console.error('Error loading validation data:', error);
    res.status(500).json({ error: 'Failed to load validation data' });
  }
});

app.post('/submitOrder', async (req, res) => {
  try {
    const orders = await readJSON(path.join(__dirname, '../Data/orders.json'));
    const newOrder = req.body;
    const orderNumber = 'ORD-' + (orders.length + 1).toString().padStart(5, '0');
    newOrder.orderNumber = orderNumber;
    newOrder.lineId = orders.length + 1;
    orders.push(newOrder);
    fs.writeFileSync(path.join(__dirname, '../Data/orders.json'), JSON.stringify(orders, null, 2));
    console.log('Order successfully written:', newOrder);
    res.json({ orderNumber: orderNumber, lineId: orders.length });
  } catch (error) {
    console.error('Error submitting order:', error);
    res.status(500).json({ error: 'Failed to submit order' });
  }
});

app.post('/addContact', async (req, res) => {
  try {
    const contacts = await readJSON(path.join(__dirname, '../Data/contacts.json'));
    const newContact = req.body;
    contacts.push(newContact);
    fs.writeFileSync(path.join(__dirname, '../Data/contacts.json'), JSON.stringify(contacts, null, 2));
    console.log('Contact successfully added:', newContact);
    res.json({ message: 'Contact added successfully' });
  } catch (error) {
    console.error('Error adding contact:', error);
    res.status(500).json({ error: 'Failed to add contact' });
  }
});

app.post('/addCustomer', async (req, res) => {
  try {
    const customers = await readJSON(path.join(__dirname, '../Data/customers.json'));
    const newCustomer = req.body;
    customers.push(newCustomer);
    fs.writeFileSync(path.join(__dirname, '../Data/customers.json'), JSON.stringify(customers, null, 2));
    console.log('Customer successfully added:', newCustomer);
    res.json({ message: 'Customer added successfully' });
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).json({ error: 'Failed to add customer' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
