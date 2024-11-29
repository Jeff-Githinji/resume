document.addEventListener('DOMContentLoaded', function() {
    updateNavbar();
});

function updateNavbar() {
    const loginBtn = document.getElementById('loginBtn');
    const userDropdown = document.getElementById('userDropdown');
    const usernameSpan = document.getElementById('username');
    
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userEmail = localStorage.getItem('userEmail');
    
    if (isLoggedIn && userEmail) {
        const username = userEmail.split('@')[0];
        loginBtn.style.display = 'none';
        userDropdown.style.display = 'block';
        usernameSpan.textContent = username;
    } else {
        loginBtn.style.display = 'block';
        userDropdown.style.display = 'none';
    }
}

// Global logout function
window.logout = function() {
    const userEmail = localStorage.getItem('userEmail');
    
    // Store the calculations before logout
    const savedCalcs = localStorage.getItem(`calculationResults_${userEmail}`);
    
    // Clear login state
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    
    // Store the calculations under a temporary key
    if (savedCalcs) {
        localStorage.setItem(`temp_calculations_${userEmail}`, savedCalcs);
    }
    
    // Redirect to login page
    window.location.href = 'login.html';
}; 