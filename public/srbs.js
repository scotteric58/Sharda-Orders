function populateSRBs() {
    fetch('/getValidationData')
      .then(response => response.json())
      .then(data => {
        validationData = data;
        console.log("Validation data loaded:", validationData); // Log validation data
        populateSelect('srbName', data.srbs.map(srb => srb.firstName + ' ' + srb.lastName));
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
  