// Esperamos a que cargue todo el DOM
document.addEventListener('DOMContentLoaded', function () {
    const passwordInput = document.getElementById('password');
    const iconToggle = document.getElementById('iconToggle');

    if (passwordInput && iconToggle) {
        iconToggle.addEventListener('click', function () {
            // Alternamos el tipo de input (password <-> text)
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Cambiamos el ícono del ojito (abierto / cerrado)
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
});
