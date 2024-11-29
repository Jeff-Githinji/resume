document.addEventListener('DOMContentLoaded', function() {
    // Only run this code if we're on the login page
    const signinForm = document.getElementById('signinForm');
    if (!signinForm) return; // Exit if not on login page
    
    const errorDiv = document.getElementById('loginError');
    
    // Demo users
    const demoUsers = [
        { email: 'demo@example.com', password: 'password123' },
        { email: 'test@example.com', password: 'test123' }
    ];

    signinForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Check credentials
        const user = demoUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Clear any existing data first
            const oldEmail = localStorage.getItem('userEmail');
            if (oldEmail) {
                localStorage.removeItem(`calculationResults_${oldEmail}`);
            }

            // Set new login state
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            }

            // Show success message
            showSuccess('Login successful! Redirecting...');
            
            // Check for saved calculations
            const savedCalcs = localStorage.getItem(`calculationResults_${email}`);
            console.log('Saved calculations found:', savedCalcs); // Debug log
            
            setTimeout(() => {
                if (savedCalcs && savedCalcs !== 'null') {
                    window.location.href = 'calc.html';
                } else {
                    window.location.href = 'index.html';
                }
            }, 1500);
        } else {
            showError('Invalid email or password');
        }
    });

    function showError(message) {
        errorDiv.className = 'login-error show error';
        errorDiv.querySelector('span').textContent = message;
        setTimeout(() => {
            errorDiv.classList.remove('show');
        }, 5000);
    }

    function showSuccess(message) {
        errorDiv.className = 'login-error show success';
        errorDiv.querySelector('span').textContent = message;
    }

    // Check for remembered email
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('rememberMe').checked = true;
    }
});

// Add logout functionality
window.logout = function() {
    const userEmail = localStorage.getItem('userEmail');
    
    // Clear user-specific data
    localStorage.removeItem(`calculationResults_${userEmail}`);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    
    window.location.href = 'login.html';
}

document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error('Error:', error);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.querySelector('#password');

    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle eye icon
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
});




