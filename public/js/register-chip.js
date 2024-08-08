const apiUrl = 'http://localhost:3000/api';
let token = localStorage.getItem('token');
let currentUserId = '';

async function registerChip() {
  const chipId = document.getElementById('chip-id').value;
  const ownerName = document.getElementById('owner-name').value;
  const contactInfo = document.getElementById('contact-info').value;

  try {
    const response = await fetch(`${apiUrl}/chips/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ chipId, ownerName, contactInfo })
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      document.getElementById('registration-form').style.display = 'none';
      location.reload();  // Recargar la página para mostrar la información del chip registrado
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

window.onload = function() {
  const chipId = window.location.pathname.split('/')[2];
  document.getElementById('chip-id').value = chipId;
}
