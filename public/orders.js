function onFormSubmit(e) {
  e.preventDefault();
  console.log("Form submission started.");

  var formData = {
    dateOfSale: document.getElementById('dateOfSale').value,
    srbName: document.getElementById('srbName').value,
    shipToAddress: document.getElementById('shipToAddress').value,
    lll: document.getElementById('lll').value,
    paymentMethod: document.getElementById('paymentMethod').value,
    products: []
  };

  // Check if new or existing contact and customer
  if (document.querySelector('input[name="contactType"]:checked').value === 'existing') {
    formData.contact = document.getElementById('contactSelect').value;
  } else {
    formData.contact = {
      firstName: document.getElementById('contactFirstName').value,
      lastName: document.getElementById('contactLastName').value,
      phone: document.getElementById('contactPhone').value,
      role: document.getElementById('contactRole').value
    };
    // Add new contact
    addNewContact(formData.contact);
  }

  if (document.querySelector('input[name="customerType"]:checked').value === 'existing') {
    formData.customerName = document.getElementById('customerSelect').value;
  } else {
    formData.customerName = {
      name: document.getElementById('customerName').value,
      address: document.getElementById('customerAddress').value,
      lll: document.getElementById('customerLLL').value,
      country: document.getElementById('customerCountry').value,
      gstNumber: document.getElementById('customerGST').value,
      phone: document.getElementById('customerPhone').value,
      fax: document.getElementById('customerFax').value,
      mobile: document.getElementById('customerMobile').value,
      email: document.getElementById('customerEmail').value,
      paymentMethod: document.getElementById('customerPaymentMethod').value,
      primaryContact: document.getElementById('customerPrimaryContact').value
    };
    // Add new customer
    addNewCustomer(formData.customerName);
  }

  document.querySelectorAll('.product-row').forEach(row => {
    var product = {
      productName: row.querySelector('.productName').value,
      volume: row.querySelector('.volume').value,
      palletCount: row.querySelector('.palletCount').value,
      salePrice: parseFloat(row.querySelector('.salePrice').value).toFixed(2), // Format as dollars
      lineId: generateUniqueLineID() // Generate a unique line ID for each product
    };
    formData.products.push(product);
  });

  console.log("Form data prepared:", formData);

  fetch('/submitOrder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => onSuccess(data))
  .catch(error => onFailure(error));
}

function addNewContact(contact) {
  fetch('/addContact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contact)
  })
  .then(response => response.json())
  .then(data => console.log("Contact added:", data))
  .catch(error => console.error("Failed to add contact:", error));
}

function addNewCustomer(customer) {
  fetch('/addCustomer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(customer)
  })
  .then(response => response.json())
  .then(data => console.log("Customer added:", data))
  .catch(error => console.error("Failed to add customer:", error));
}

function addProductRow() {
  var row = document.createElement('tr');
  row.classList.add('product-row');
  row.innerHTML = `
    <td><select class="productName">${generateOptions(validationData.items.map(item => item.itemName))}</select></td>
    <td><input type="number" class="volume" required></td>
    <td><input type="number" class="palletCount" required></td>
    <td><input type="number" class="salePrice" step="0.01" required></td>
  `;
  document.getElementById('productsTableBody').appendChild(row);
}

function onSuccess(response) {
  console.log("Form submission successful:", response);
  alert('Order submitted successfully!\nOrder Number: ' + response.orderNumber + '\nLine IDs: ' + response.lineIds.join(', '));
  document.getElementById('orderForm').reset();
  showStep(1);
}

function onFailure(error) {
  console.error("Form submission failed:", error);
  alert('Failed to submit order. Please try again.');
}

function toggleRequiredFields(prefix, isNew) {
  var fields = document.querySelectorAll(`[id^="${prefix}"]`);
  fields.forEach(field => {
    field.required = isNew && field.id !== 'customerFax'; // Make fax optional
  });
}

function populateDefaultCustomerDetails() {
  if (document.querySelector('input[name="customerType"]:checked').value === 'existing') {
    const customerName = document.getElementById('customerSelect').value;
    const customer = validationData.customers.find(cust => cust.name === customerName);
    document.getElementById('shipToAddress').value = customer.address;
    document.getElementById('lll').value = customer.legalLandLocation;
    document.getElementById('paymentMethod').value = customer.defaultPaymentMethod;
  } else {
    document.getElementById('shipToAddress').value = document.getElementById('customerAddress').value;
    document.getElementById('lll').value = document.getElementById('customerLLL').value;
    document.getElementById('paymentMethod').value = document.getElementById('customerPaymentMethod').value;
  }
}

function generateUniqueLineID() {
  const timestamp = Date.now().toString().slice(-5); // Last 5 digits of current timestamp
  const randomNum = Math.floor(10000 + Math.random() * 90000).toString(); // Random 5 digit number
  return `${timestamp}${randomNum}`;
}
