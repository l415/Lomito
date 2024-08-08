const apiUrl = 'http://localhost:3000/api';
let token = '';
let currentUserId = '';

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

      // Guardar el token en localStorage para usarlo en la página de registro del chip
      localStorage.setItem('token', token);

      // Redirigir a la página de registro del chip
      const chipId = window.location.pathname.split('/')[1];
      window.location.href = `/register-chip/${chipId}`;
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
