const loginForm = document.getElementById('login-form');
const message   = document.getElementById('mensaje-error');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  fetch('/login', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
        if (data != false) {
            views.loadRole(data)
            loginForm.reset();
        } else {
            message.innerHTML = '<div class="alert alert-danger" role="alert">Usuario o contraseña incorrectos</div>';
            loginForm.reset(); 
        }
    })    
  .catch(error => { console.error(error);});
});

