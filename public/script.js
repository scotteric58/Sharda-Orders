var step = 1;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Document loaded');
    var step = 1; // Initialize the step variable
    showStep(step); // Show the first step
    loadValidationData();
    document.getElementById('dateOfSale').value = new Date().toISOString().split('T')[0]; // Default to today
    document.querySelectorAll('input[name="contactType"]').forEach(el => el.onclick = toggleContactInput);
    document.querySelectorAll('input[name="customerType"]').forEach(el => el.onclick = toggleCustomerInput);
  });
  
  function showStep(stepNumber) {
    document.querySelectorAll('.step').forEach(step => step.style.display = 'none');
    document.getElementById('step' + stepNumber).style.display = 'block';
  }
  
  function nextStep() {
    step++;
    showStep(step);
    if (step === 3) {
      populateDefaultCustomerDetails();
    }
  }
  
  function prevStep() {
    step--;
    showStep(step);
  }
  
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
    }
  
    document.querySelectorAll('.product-row').forEach(row => {
      var product = {
        productName: row.querySelector('.productName').value,
        volume: row.querySelector('.volume').value,
        palletCount: row.querySelector('.palletCount').value,
        salePrice: parseFloat(row.querySelector('.salePrice').value).toFixed(2) // Format as dollars
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
  
  function addProductRow() {
    var row = document.createElement('tr');
    row.classList.add('product-row');
    row.innerHTML = `
      <td><select class="productName">${generateOptions(validationData.items)}</select></td>
      <td><input type="number" class="volume" required></td>
      <td><input type="number" class="palletCount" required></td>
      <td><input type="number" class="salePrice" step="0.01" required></td>
    `;
    document.getElementById('productsTableBody').appendChild(row);
  }
  
  function onSuccess(response) {
    console.log("Form submission successful:", response);
    alert('Order submitted successfully!\nOrder Number: ' + response.orderNumber + '\nLine ID: ' + response.lineId);
    document.getElementById('orderForm').reset();
    showStep(1);
  }
  
  function onFailure(error) {
    console.error("Form submission failed:", error);
    alert('Failed to submit order. Please try again.');
  }
  
  function loadValidationData() {
    fetch('/getValidationData')
      .then(response => response.json())
      .then(data => {
        validationData = data;
        populateSelect('srbName', data.srbs);
        populateSelect('customerSelect', data.customers.map(customer => customer[0]));
        populateSelect('contactSelect', data.contacts.map(contact => contact.join(' ')));
        document.querySelector('.productName').innerHTML = generateOptions(data.items); // Initial population for the first product row
      })
      .catch(error => console.error('Error loading validation data:', error));
  }
  
  function populateSelect(elementId, options) {
    var select = document.getElementById(elementId);
    select.innerHTML = '';
    options.forEach(option => {
      var opt = document.createElement('option');
      opt.value = opt.innerHTML = option;
      select.appendChild(opt);
    });
  }
  
  function generateOptions(options) {
    return options.map(option => `<option value="${option}">${option}</option>`).join('');
  }
  
  function toggleContactInput() {
    var type = document.querySelector('input[name="contactType"]:checked').value;
    document.getElementById('existingContact').style.display = type === 'existing' ? 'block' : 'none';
    document.getElementById('newContact').style.display = type === 'new' ? 'block' : 'none';
    toggleRequiredFields('contact', type === 'new');
  }
  
  function toggleCustomerInput() {
    var type = document.querySelector('input[name="customerType"]:checked').value;
    document.getElementById('existingCustomer').style.display = type === 'existing' ? 'block' : 'none';
    document.getElementById('newCustomer').style.display = type === 'new' ? 'block' : 'none';
    toggleRequiredFields('customer', type === 'new');
  }
  
  function toggleRequiredFields(prefix, isNew) {
    var fields = document.querySelectorAll(`[id^="${prefix}"]`);
    fields.forEach(field => {
      field.required = isNew && field.id !== 'customerFax'; // Make fax optional
    });
  }
  
  function populateDefaultCustomerDetails() {
    var customerName = document.getElementById('customerSelect').value;
    var customer = validationData.customers.find(customer => customer[0] === customerName);
    if (customer) {
      document.getElementById('shipToAddress').value = customer[1]; // Assuming address is the second field
      document.getElementById('lll').value = customer[2]; // Assuming LLL is the third field
      document.getElementById('paymentMethod').value = customer[9]; // Assuming payment method is the tenth field
    } else {
      document.getElementById('shipToAddress').value = document.getElementById('customerAddress').value; // For new customer
      document.getElementById('lll').value = document.getElementById('customerLLL').value; // For new customer
      document.getElementById('paymentMethod').value = document.getElementById('customerPaymentMethod').value; // For new customer
    }
  }
  