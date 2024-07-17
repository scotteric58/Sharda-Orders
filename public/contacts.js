function toggleContactInput() {
    var type = document.querySelector('input[name="contactType"]:checked').value;
    document.getElementById('existingContact').style.display = type === 'existing' ? 'block' : 'none';
    document.getElementById('newContact').style.display = type === 'new' ? 'block' : 'none';
    toggleRequiredFields('contact', type === 'new');
  }
  