var step = 1; // Initialize the step variable in the global scope
var validationData = {}; // To store validation data

document.addEventListener('DOMContentLoaded', () => {
  console.log('Document loaded');
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

function loadValidationData() {
  fetch('/getValidationData')
    .then(response => response.json())
    .then(data => {
      validationData = data;
      console.log("Validation data loaded:", validationData); // Log validation data
      populateSelect('srbName', data.srbs.map(srb => srb.firstName + ' ' + srb.lastName));
      populateSelect('customerSelect', data.customers.map(customer => customer.name));
      populateSelect('contactSelect', data.contacts.map(contact => contact.firstName + ' ' + contact.lastName));
      document.querySelector('.productName').innerHTML = generateOptions(validationData.items.map(item => item.itemName)); // Initial population for the first product row
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
