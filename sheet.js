document.addEventListener('DOMContentLoaded', function () {
    /* =========================
       Admin dashboard logic
       ========================= */
    const busCardBtn = document.getElementById('bus-card-btn');
    const fleetList = document.getElementById('fleet-list');
    const addActionBtn = document.getElementById('add-action-btn');
    const toastMsg = document.getElementById('toast-msg');

    if (busCardBtn && fleetList) {
        busCardBtn.addEventListener('click', function () {
            fleetList.style.display = 'block';
            window.scrollTo({
                top: fleetList.offsetTop - 20,
                behavior: 'smooth'
            });
        });
    }

    if (addActionBtn && toastMsg) {
        addActionBtn.addEventListener('click', function () {
            toastMsg.classList.add('show');

            setTimeout(() => {
                toastMsg.classList.remove('show');
            }, 3000);
        });
    }

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
                alert('اختاري يوماً واحداً على الأقل');
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

                if (tripType === 'عودة' || tripType === 'ذهاب وعودة') {
                    shownTime = returnTime;
                }

                const newCard = document.createElement('div');
                newCard.className = 'bk-active-card';
                newCard.innerHTML = `
                    <button type="button" class="bk-delete-btn" onclick="bkDeleteSchedule(this)">🗑</button>
                    <div class="bk-active-info">
                        <h3>الكليات ➜ محطة الواحة</h3>
                        <p>${dayName} (${shownTime})</p>
                        <span class="bk-status-pill">مفعل - ${repeatText}</span>
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

    /* =========================
       Reservations page logic
       ========================= */
    const rsEditOverlay = document.getElementById('rs-edit-overlay');
    const rsCancelOverlay = document.getElementById('rs-cancel-overlay');
    const rsToast = document.getElementById('rs-toast');
    const rsToastText = document.getElementById('rs-toast-text');
    const rsConfirmCancelBtn = document.getElementById('rs-confirm-cancel-btn');

    if (rsConfirmCancelBtn) {
        rsConfirmCancelBtn.addEventListener('click', function () {
            if (window.currentReservationCard) {
                window.currentReservationCard.remove();
            }

            closeCancelModal();
            showReservationToast('تم إلغاء الحجز بنجاح');
        });
    }

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

    startReservationTimers();
});

/* =========================
   Global booking function
   ========================= */
function bkDeleteSchedule(button) {
    const card = button.closest('.bk-active-card');
    if (card) {
        card.remove();
    }
}

/* =========================
   Global reservations functions
   ========================= */
window.currentReservationCard = null;

function openEditModal(button) {
    window.currentReservationCard = button.closest('.rs-card');
    const overlay = document.getElementById('rs-edit-overlay');
    if (overlay) {
        overlay.classList.add('show');
    }
}

function closeEditModal() {
    const overlay = document.getElementById('rs-edit-overlay');
    if (overlay) {
        overlay.classList.remove('show');
    }
}

function openCancelModal(button) {
    window.currentReservationCard = button.closest('.rs-card');
    const overlay = document.getElementById('rs-cancel-overlay');
    if (overlay) {
        overlay.classList.add('show');
    }
}

function closeCancelModal() {
    const overlay = document.getElementById('rs-cancel-overlay');
    if (overlay) {
        overlay.classList.remove('show');
    }
}

function showReservationToast(message) {
    const rsToast = document.getElementById('rs-toast');
    const rsToastText = document.getElementById('rs-toast-text');

    if (!rsToast || !rsToastText) return;

    rsToastText.textContent = message;
    rsToast.classList.add('show');

    setTimeout(() => {
        rsToast.classList.remove('show');
    }, 3000);
}

function saveReservationEdit() {
    if (!window.currentReservationCard) return;

    const select = document.getElementById('rs-time-select');
    const reservationText = window.currentReservationCard.querySelector('.rs-info p');

    if (!select || !reservationText) return;

    let busText = 'حافلة B-101';
    if (reservationText.textContent.includes('B-205')) {
        busText = 'حافلة B-205';
    }

    const selectedText = select.value
        .replace('الرحلة القادمة: ', 'الساعة ')
        .replace('الرحلة المسائية: ', 'الساعة ');

    reservationText.textContent = `${selectedText} - ${busText}`;

    closeEditModal();
    showReservationToast('تم تحديث الموعد بنجاح');
}

function formatRsTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function startReservationTimers() {
    const timers = document.querySelectorAll('.rs-timer');

    if (timers.length === 0) return;

    timers.forEach(timer => {
        let seconds = parseInt(timer.dataset.seconds, 10);

        if (isNaN(seconds)) return;

        timer.textContent = `متبقي للتعديل: ${formatRsTime(seconds)}`;

        const interval = setInterval(() => {
            seconds--;

            if (seconds <= 0) {
                timer.textContent = 'انتهى وقت التعديل';

                const box = timer.closest('.rs-edit-time');
                if (box) {
                    box.style.background = '#f3f4f6';
                    box.style.color = '#6b7280';
                }

                clearInterval(interval);
                return;
            }

            timer.textContent = `متبقي للتعديل: ${formatRsTime(seconds)}`;
            timer.dataset.seconds = seconds;
        }, 1000);
    });
}