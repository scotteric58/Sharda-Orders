function toggleCustomerInput() {
    var type = document.querySelector('input[name="customerType"]:checked').value;
    document.getElementById('existingCustomer').style.display = type === 'existing' ? 'block' : 'none';
    document.getElementById('newCustomer').style.display = type === 'new' ? 'block' : 'none';
    toggleRequiredFields('customer', type === 'new');
  }
  
  function populateDefaultCustomerDetails() {
    var customerName = document.getElementById('customerSelect').value;
    var customer = validationData.customers.find(customer => customer.name === customerName);
    if (customer) {
      document.getElementById('shipToAddress').value = customer.address; // Assuming address is the second field
      document.getElementById('lll').value = customer.legalLandLocation; // Assuming LLL is the third field
      document.getElementById('paymentMethod').value = customer.defaultPaymentMethod; // Assuming payment method is the tenth field
    } else {
      document.getElementById('shipToAddress').value = document.getElementById('customerAddress').value; // For new customer
      document.getElementById('lll').value = document.getElementById('customerLLL').value; // For new customer
      document.getElementById('paymentMethod').value = document.getElementById('customerPaymentMethod').value; // For new customer
    }
  }
  