document.getElementById('login-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email && password) {
        localStorage.setItem('user', email);
        window.location.href = 'home.html';
    } else {
        alert('Please enter valid credentials');
    }
});

// Adding hover animation to buttons
document.querySelectorAll('.btn-primary').forEach(button => {
    button.addEventListener('mouseover', function() {
        this.classList.add('scale-105', 'transition', 'duration-300');
    });
    button.addEventListener('mouseleave', function() {
        this.classList.remove('scale-105');
    });
});
