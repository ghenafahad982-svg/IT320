document.addEventListener('DOMContentLoaded', function () {

    /* =========================
       Admin dashboard logic
       ========================= */

    const busCardBtn = document.getElementById('bus-card-btn');
    const fleetList = document.getElementById('fleet-list');
    const addActionBtn = document.getElementById('add-action-btn');
    const toastMsg = document.getElementById('toast-msg');
    const fleetItems = document.getElementById('fleet-items');

    let busCount = 3;
    let nextBusNumber = 304;

    if (fleetList) {
        fleetList.style.display = 'none';
    }

    if (busCardBtn && fleetList) {
        busCardBtn.style.cursor = 'pointer';

        busCardBtn.addEventListener('click', function () {
            fleetList.style.display = 'block';

            window.scrollTo({
                top: fleetList.offsetTop - 20,
                behavior: 'smooth'
            });
        });
    }

    if (addActionBtn && toastMsg && fleetItems && busCardBtn) {
        addActionBtn.addEventListener('click', function () {
            const newBus = document.createElement('div');
            newBus.className = 'ad-bus-item';
            newBus.innerHTML = `
                <div class="ad-bus-info">
                    <h3>B-${nextBusNumber}</h3>
                    <p>Capacity: 30 passengers</p>
                </div>
                <div class="ad-status ad-status-active">Active</div>
            `;

            fleetItems.appendChild(newBus);

            busCount++;
            nextBusNumber++;

            const busCardText = busCardBtn.querySelector('p');
            if (busCardText) {
                busCardText.textContent = `${busCount} registered buses`;
            }

            toastMsg.classList.add('show');

            setTimeout(() => {
                toastMsg.classList.remove('show');
            }, 3000);
        });
    }
});



/* =========================
   Booking page logic
   ========================= */
const bkChecks = document.querySelectorAll('.bk-day-check');
const bkSaveBtn = document.getElementById('bk-save-btn');
const bkToast = document.getElementById('bk-toast');
const bkActiveList = document.getElementById('bk-active-list');
const bkRepeat = document.getElementById('bk-repeat');

if (bkChecks.length > 0) {
    bkChecks.forEach(check => {
        check.addEventListener('change', function () {
            const card = this.closest('.bk-day-card');
            if (!card) return;

            if (this.checked) {
                card.classList.add('bk-active');
            } else {
                card.classList.remove('bk-active');
            }
        });
    });
}

if (bkSaveBtn && bkToast && bkActiveList && bkRepeat) {
    bkSaveBtn.addEventListener('click', function () {
        const activeDays = document.querySelectorAll('.bk-day-card.bk-active');

        if (activeDays.length === 0) {
            alert('Please select at least one day.');
            return;
        }

        activeDays.forEach(dayCard => {
            const dayNameEl = dayCard.querySelector('.bk-day-name');
            const goTimeEl = dayCard.querySelector('.bk-go-time');
            const returnTimeEl = dayCard.querySelector('.bk-return-time');
            const tripTypeEl = document.querySelector('input[name="tripType"]:checked');

            if (!dayNameEl || !goTimeEl || !returnTimeEl || !tripTypeEl) return;

            const dayName = dayNameEl.textContent;
            const goTime = goTimeEl.value;
            const returnTime = returnTimeEl.value;
            const repeatText = bkRepeat.value;
            const tripType = tripTypeEl.value;

            let shownTime = goTime;

            if (tripType === 'Return' || tripType === 'Go and Return') {
                shownTime = returnTime;
            }

            const newCard = document.createElement('div');
            newCard.className = 'bk-active-card';
            newCard.innerHTML = `
                <button type="button" class="bk-delete-btn" onclick="bkDeleteSchedule(this)">🗑</button>
                <div class="bk-active-info">
                    <h3>Colleges ➜ Al Waha Station</h3>
                    <p>${dayName} (${shownTime}) - ${tripType}</p>
                    <span class="bk-status-pill">Active - ${repeatText}</span>
                </div>
            `;

            bkActiveList.prepend(newCard);
        });

        bkToast.classList.add('show');
        setTimeout(() => {
            bkToast.classList.remove('show');
        }, 3000);
    });
}
function bkDeleteSchedule(button) {
    const confirmDelete = confirm('Are you sure you want to delete this schedule?');

    if (!confirmDelete) return;

    const card = button.closest('.bk-active-card');
    if (card) {
        card.remove();
    }
}




/* =========================
 my reservation 
   ========================= */


document.addEventListener('DOMContentLoaded', function () {
    const rsEditOverlay = document.getElementById('rs-edit-overlay');
    const rsCancelOverlay = document.getElementById('rs-cancel-overlay');
    const rsToast = document.getElementById('rs-toast');
    const rsToastText = document.getElementById('rs-toast-text');
    const rsConfirmCancelBtn = document.getElementById('rs-confirm-cancel-btn');
    const rsTimeSelect = document.getElementById('rs-time-select');

    let currentReservationCard = null;

    /* ========= Open edit modal ========= */
    window.openEditModal = function (button) {
        currentReservationCard = button.closest('.rs-card');
        if (rsEditOverlay) {
            rsEditOverlay.classList.add('show');
        }
    };

    /* ========= Close edit modal ========= */
    window.closeEditModal = function () {
        if (rsEditOverlay) {
            rsEditOverlay.classList.remove('show');
        }
    };

    /* ========= Open cancel modal ========= */
    window.openCancelModal = function (button) {
        currentReservationCard = button.closest('.rs-card');
        if (rsCancelOverlay) {
            rsCancelOverlay.classList.add('show');
        }
    };

    /* ========= Close cancel modal ========= */
    window.closeCancelModal = function () {
        if (rsCancelOverlay) {
            rsCancelOverlay.classList.remove('show');
        }
    };

    /* ========= Toast ========= */
    function showReservationToast(message) {
        if (!rsToast || !rsToastText) return;

        rsToastText.textContent = message;
        rsToast.classList.add('show');

        setTimeout(() => {
            rsToast.classList.remove('show');
        }, 3000);
    }

    /* ========= Save edit ========= */
    window.saveReservationEdit = function () {
        if (!currentReservationCard || !rsTimeSelect) return;

        const reservationText = currentReservationCard.querySelector('.rs-info p');
        if (!reservationText) return;

        let busText = 'Bus B-101';
        if (reservationText.textContent.includes('B-205')) {
            busText = 'Bus B-205';
        }

        const selectedText = rsTimeSelect.value
            .replace('Next Trip: ', 'Time: ')
            .replace('Evening Trip: ', 'Time: ');

        reservationText.textContent = `${selectedText} - ${busText}`;

        closeEditModal();
        showReservationToast('Reservation updated successfully');
    };

    /* ========= Confirm delete ========= */
    if (rsConfirmCancelBtn) {
        rsConfirmCancelBtn.addEventListener('click', function () {
            if (currentReservationCard) {
                currentReservationCard.remove();
            }

            closeCancelModal();
            showReservationToast('Reservation cancelled successfully');
        });
    }

    /* ========= Close by clicking outside ========= */
    if (rsEditOverlay) {
        rsEditOverlay.addEventListener('click', function (e) {
            if (e.target === rsEditOverlay) {
                closeEditModal();
            }
        });
    }

    if (rsCancelOverlay) {
        rsCancelOverlay.addEventListener('click', function (e) {
            if (e.target === rsCancelOverlay) {
                closeCancelModal();
            }
        });
    }

    /* ========= Countdown ========= */
    function formatRsTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function startReservationTimers() {
        const timers = document.querySelectorAll('.rs-timer');

        timers.forEach(timer => {
            let seconds = parseInt(timer.dataset.seconds, 10);
            if (isNaN(seconds)) return;

            timer.textContent = `Time left to edit: ${formatRsTime(seconds)}`;

            const interval = setInterval(() => {
                seconds--;

                if (seconds <= 0) {
                    timer.textContent = 'Edit time expired';
                    clearInterval(interval);
                    return;
                }

                timer.textContent = `Time left to edit: ${formatRsTime(seconds)}`;
                timer.dataset.seconds = seconds;
            }, 1000);
        });
    }

    startReservationTimers();
});