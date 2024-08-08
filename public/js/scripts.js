const apiUrl = 'http://localhost:3000/api';
let token = '';
let currentUserId = '';

// Función para registrar un chip
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

// Funciones para registro de usuario y login
async function register() {
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;

  try {
    const response = await fetch(`${apiUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      document.getElementById('next-section').style.display = 'block';
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function login() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
      token = data.token;
      const payload = JSON.parse(atob(token.split('.')[1]));
      currentUserId = payload.userId;

      const authSection = document.getElementById('auth-section');
      const nextSection = document.getElementById('next-section');
      const registerButton = document.getElementById('register-button');

      if (authSection) authSection.style.display = 'none';
      if (nextSection) {
        nextSection.style.display = 'block';
        registerButton.disabled = false;
      }
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function showRegisterForm() {
  const registerSection = document.getElementById('register-section');
  if (registerSection) {
    registerSection.style.display = 'block';
  }
}

function logout() {
  token = '';
  currentUserId = '';

  const authSection = document.getElementById('auth-section');
  const registerSection = document.getElementById('register-section');
  const registerButton = document.getElementById('register-button');

  if (authSection) authSection.style.display = 'block';
  if (registerSection) {
    registerSection.style.display = 'none';
    registerButton.disabled = true;
  }
}

// Función para inicializar la página y verificar el estado del chip
function initializePage() {
  const chipId = window.location.pathname.split('/')[1];
  const chipIdInput = document.getElementById('chip-id');

  if (chipIdInput) {
    chipIdInput.value = chipId;
  }

  fetch(`${apiUrl}/chips/${chipId}`)
    .then(response => response.json())
    .then(data => {
      const authSection = document.getElementById('auth-section');
      const registerSection = document.getElementById('register-section');
      const chipInfoSection = document.getElementById('chip-info-section');
      const chipInfo = document.getElementById('chip-info');

      if (data.error === 'Chip not registered') {
        console.log('Chip not registered, showing auth section.');
        if (authSection) authSection.style.display = 'block';
        if (registerSection) registerSection.style.display = 'none';
      } else {
        console.log('Chip registered, showing chip info.');
        if (authSection) authSection.style.display = 'none';
        if (registerSection) registerSection.style.display = 'none';
        if (chipInfoSection) chipInfoSection.style.display = 'block';
        if (chipInfo) {
          chipInfo.innerHTML = `
            <p>Owner: ${data.ownerName}</p>
            <p>Contact Info: ${data.contactInfo}</p>
            <p>Registered by: ${data.owner.username}</p>
          `;
        }
      }
    })
    .catch(error => console.error('Error:', error));
}

function goToRegister() {
  window.location.href = window.location.pathname + '/register';
}

window.onload = function() {
  initializePage();
}
