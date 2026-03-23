/* ==========================================================
   Gharsah's Logic (Student UI: Home, Search, Profile)
   Dynamic Data Approach for Easy Firebase Integration Later
   ========================================================== */

// 1. Mock Data (To be replaced by Firebase data in Phase 4)
const mockBuses = [
    { id: 101, number: "B-101", capacity: 30, reserved: 15, eta: "08:00 AM", status: "Active" },
    { id: 102, number: "B-102", capacity: 30, reserved: 30, eta: "08:15 AM", status: "Active" }, // Full bus (PBI 8 testing)
    { id: 103, number: "B-103", capacity: 30, reserved: 29, eta: "08:30 AM", status: "Active" }, // 1 seat left (PBI 10 testing)
    { id: 104, number: "B-104", capacity: 30, reserved: 5, eta: "09:00 AM", status: "Inactive" } // Inactive bus (Should not be displayed to student)
];

const mockStudentProfile = {
    fullName: "Gharsah Almusaeed",
    studentId: "445200356",
    email: "gharsah@student.ksu.edu.sa"
};

// State Variables
let studentHasReservation = false; // Constraint: Prevent multiple bookings (PBI 9)
let selectedBusId = null;

// ==========================================================
// 2. Profile Page Logic (Dynamic Rendering)
// ==========================================================
const profileDataContainer = document.getElementById('profileDataContainer');
if (profileDataContainer) {
    // Render profile data dynamically
    profileDataContainer.innerHTML = `
        <div class="form-group">
            <label>Full Name</label>
            <input type="text" value="${mockStudentProfile.fullName}" disabled>
        </div>
        <div class="form-group">
            <label>Student ID</label>
            <input type="text" value="${mockStudentProfile.studentId}" disabled>
        </div>
        <div class="form-group">
            <label>Email Address</label>
            <input type="email" value="${mockStudentProfile.email}" disabled>
        </div>
        <button class="btn btn-primary mt-3">Edit Profile</button>
    `;
}

// ==========================================================
// 3. Home / Search Page Logic (PBI 8, PBI 9, PBI 10)
// ==========================================================
const searchBtn = document.getElementById('searchBtn');
const destinationSelect = document.getElementById('destinationSelect'); // التعديل: استخدام قائمة الاختيار
const resultsSection = document.getElementById('resultsSection');
const busListContainer = document.getElementById('busList');

// التعديل: تفعيل زر البحث فقط إذا تم اختيار وجهة من المنيو
if (destinationSelect && searchBtn) {
    destinationSelect.addEventListener('change', () => {
        if (destinationSelect.value !== "") {
            searchBtn.disabled = false;
            searchBtn.classList.remove('disabled');
        } else {
            searchBtn.disabled = true;
            searchBtn.classList.add('disabled');
        }
    });
}

// Search and Render Buses (PBI 8)
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        busListContainer.innerHTML = ''; // Clear previous results
        
        // Filter out "Inactive" buses
        const activeBuses = mockBuses.filter(bus => bus.status === "Active");

        if(activeBuses.length === 0) {
            busListContainer.innerHTML = '<p style="color: var(--text-muted);">No active trips found.</p>';
        } else {
            activeBuses.forEach(bus => {
                const availableSeats = bus.capacity - bus.reserved;
                const isFull = availableSeats <= 0;
                
                // Using Leader's .trip-card class
                const card = document.createElement('div');
                card.className = 'trip-card'; 
                
                card.innerHTML = `
                    <div class="bus-card-flex">
                        <div class="bus-details">
                            <h3>Bus: ${bus.number}</h3>
                            <p><strong>ETA:</strong> ${bus.eta}</p>
                            <p><strong>Capacity:</strong> ${isFull ? '<span class="full-badge">Full</span>' : `${availableSeats}/${bus.capacity} seats available`}</p>
                        </div>
                        <button class="btn btn-primary ${isFull ? 'disabled' : ''}" onclick="openReservationModal(${bus.id})">
                            ${isFull ? 'Full' : 'Reserve'}
                        </button>
                    </div>
                `;
                busListContainer.appendChild(card);
            });
        }
        resultsSection.classList.remove('hidden');
    });
}

// ==========================================================
// 4. Modal & Reservation Logic (PBI 9 & PBI 10)
// ==========================================================
const reservationModal = document.getElementById('reservationModal');
const tripDetailsBox = document.getElementById('tripDetails');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');

// Global function to open modal from dynamically generated buttons
window.openReservationModal = function(busId) {
    if(studentHasReservation) {
        alert("You have already reserved a seat for a trip. You cannot reserve multiple seats at the same time.");
        return;
    }
    
    selectedBusId = busId;
    const bus = mockBuses.find(b => b.id === busId);
    
    // Inject trip details (Dynamic Data)
    tripDetailsBox.innerHTML = `
        <p><strong>Bus Number:</strong> ${bus.number}</p>
        <p><strong>Departure Time:</strong> ${bus.eta}</p>
    `;
    
    reservationModal.style.display = 'flex'; // Leader's CSS uses display: none/flex for modals
};

// Close Modal
if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        reservationModal.style.display = 'none';
        selectedBusId = null;
    });
}

// Confirm Reservation (PBI 10 Concurrency Check)
if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
        const busIndex = mockBuses.findIndex(b => b.id === selectedBusId);
        const bus = mockBuses[busIndex];

        // Concurrency Check (PBI 10)
        if (bus.capacity - bus.reserved <= 0) {
            alert("Seat no longer available. Please choose another bus/time."); // Exact Error Message required
            reservationModal.style.display = 'none';
            searchBtn.click(); // Refresh list to show it's full
            return;
        }

        // Process Booking
        bus.reserved += 1;
        studentHasReservation = true;
        
        const reservationId = "RES-" + Math.floor(Math.random() * 100000);
        console.log(`[DB Mock] Reservation Saved. ID: ${reservationId}, Time: ${new Date().toLocaleString()}`);
        
        alert(`Reservation Confirmed successfully!\nID: ${reservationId}`);
        reservationModal.style.display = 'none';
        
        // Update UI immediately
        searchBtn.click();
        
        // PBI 9 Redirection (Commented out for testing purposes)
        // window.location.href = "my_reservations.html"; 
    });
}

// ==========================================================
// 5. Logout Logic (PBI 17)
// ==========================================================
const logoutBtns = document.querySelectorAll('.logout-btn');
logoutBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        alert("You have been logged out securely.");
        // Redirect to Leader's Login page
        window.location.href = "login.html"; 
    });
});