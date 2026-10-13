document.addEventListener('DOMContentLoaded', function () {
    const passwordInput = document.getElementById('password');
    const iconToggle = document.getElementById('iconToggle');

    if (passwordInput && iconToggle) {
        iconToggle.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
});
