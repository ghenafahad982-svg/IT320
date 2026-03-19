// --- 1. Tab Switching Logic ---
function switchTab(role) {
    // Remove 'active' class from both tab buttons
    document.getElementById('tab-student').classList.remove('active');
    document.getElementById('tab-admin').classList.remove('active');
    // Add 'active' class to the clicked tab button
    document.getElementById(`tab-${role}`).classList.add('active');

    // Remove 'active' class from both form sections to hide them
    document.getElementById('student-section').classList.remove('active');
    document.getElementById('admin-section').classList.remove('active');
    // Add 'active' class to the selected form section to show it
    document.getElementById(`${role}-section`).classList.add('active');
}

// --- 2. Student Login Logic ---
document.getElementById('student-login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('student-email').value.trim();
    const password = document.getElementById('student-password').value;
    const errorMsg = document.getElementById('student-error');

    // Reset error message
    errorMsg.style.display = 'none'; 

    // Check for empty fields
    if (!email || !password) {
        errorMsg.innerText = "Please fill in all fields.";
        errorMsg.style.display = 'block';
        return;
    }

    // Mock successful login for frontend phase
    alert("Student login successful!");
    window.location.href = "student-home.html"; // Redirect to student home
});

// --- 3. Administrator Login Logic ---
document.getElementById('admin-login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value;
    const loginBtn = document.getElementById('admin-btn');
    const errorMsg = document.getElementById('admin-error');

    // Reset UI State
    errorMsg.style.display = 'none';
    loginBtn.innerText = "Authenticating...";
    loginBtn.classList.add('disabled');

    // Mock Admin Database
    const adminDB = {
        "admin@ksu.edu.sa": "Admin123"
    };

    // Simulate Network Delay
    setTimeout(() => {
        // AC: Unregistered email
        if (!adminDB.hasOwnProperty(email)) {
            showAdminError("Login failed: Unregistered email address.");
        } 
        // AC: Incorrect password
        else if (adminDB[email] !== password) {
            showAdminError("Login failed: Incorrect email or password.");
        } 
      
       // AC: Successful login
        else {
            loginBtn.classList.remove('disabled'); 
            loginBtn.innerText = "Success!";
            loginBtn.style.backgroundColor = "#28A745";
            loginBtn.style.color = "#ffffff";
            window.location.href = "admin-dashboard.html";
          
        }
    }, 1500);

    // Helper for Admin Errors
    function showAdminError(message) {
        errorMsg.innerText = message;
        errorMsg.style.display = 'block';
        loginBtn.innerText = "Admin Log In";
        loginBtn.classList.remove('disabled');
    }
});
