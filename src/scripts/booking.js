export function initBookingWidget(container) {
  const bookingDaysStr = container.dataset.bookingDays || '1,2,3,4,5';
  const bookingDays = bookingDaysStr.split(',').map(d => parseInt(d.trim(), 10));
  const bookingMaxDays = parseInt(container.dataset.bookingMaxDays || '30', 10);

  // Elements
  const calendarGrid = container.querySelector('.calendar-grid');
  const monthDisplay = container.querySelector('.month-display');
  const prevMonthBtn = container.querySelector('.prev-month');
  const nextMonthBtn = container.querySelector('.next-month');
  const slotsContainer = container.querySelector('.slots-container');
  const slotsList = container.querySelector('.slots-list');
  const bookingFormContainer = container.querySelector('.booking-form-container');
  const bookingForm = container.querySelector('.booking-form');
  const selectedDateDisplay = container.querySelector('.selected-date-display');
  const selectedTimeDisplay = container.querySelector('.selected-time-display');
  const statusMessage = container.querySelector('.status-message');

  const formInputDate = container.querySelector('input[name="date"]');
  const formInputTime = container.querySelector('input[name="time"]');
  const formInputDuration = container.querySelector('input[name="duration"]');

  let currentDate = new Date();
  let selectedDate = null;
  let selectedTime = null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + bookingMaxDays);

  function renderCalendar() {
    if (!calendarGrid) return;
    calendarGrid.innerHTML = '';

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (monthDisplay) {
        monthDisplay.textContent = `${monthNames[month]} ${year}`;
    }

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay(); // 0 is Sunday, 1 is Monday, etc.

    // Day headers
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    dayNames.forEach(day => {
      const dayHeader = document.createElement('div');
      dayHeader.className = 'text-center font-semibold text-text-dark text-sm py-2';
      dayHeader.textContent = day;
      calendarGrid.appendChild(dayHeader);
    });

    // Empty cells before first day
    for (let i = 0; i < startingDay; i++) {
      const emptyCell = document.createElement('div');
      calendarGrid.appendChild(emptyCell);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const cellDate = new Date(year, month, i);
      const cellDayOfWeek = cellDate.getDay();

      const dayBtn = document.createElement('button');
      dayBtn.type = 'button';
      dayBtn.textContent = i;
      dayBtn.className = 'w-10 h-10 mx-auto rounded-full flex items-center justify-center transition-colors text-text-dark focus:outline-none focus:ring-2 focus:ring-accent';

      const isPast = cellDate < today;
      const isBeyondMax = cellDate > maxDate;
      const isWorkingDay = bookingDays.includes(cellDayOfWeek);

      if (isPast || isBeyondMax || !isWorkingDay) {
        dayBtn.disabled = true;
        dayBtn.className += ' opacity-30 cursor-not-allowed';
      } else {
        dayBtn.className += ' hover:bg-gray-200';

        if (selectedDate && cellDate.getTime() === selectedDate.getTime()) {
          dayBtn.className += ' bg-primary text-white hover:bg-primary';
          dayBtn.classList.remove('text-text-dark', 'hover:bg-gray-200');
        }

        dayBtn.addEventListener('click', () => selectDate(cellDate));
      }

      calendarGrid.appendChild(dayBtn);
    }
  }

  async function selectDate(date) {
    selectedDate = date;
    selectedTime = null;

    // Update UI
    renderCalendar();
    bookingFormContainer.classList.add('hidden');

    const dateStr = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-');

    if (selectedDateDisplay) {
        selectedDateDisplay.textContent = date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    slotsContainer.classList.remove('hidden');
    slotsList.innerHTML = '<div class="text-gray-500 text-sm py-4 w-full text-center" aria-live="polite">Loading available slots...</div>';
    statusMessage.textContent = '';
    statusMessage.classList.add('hidden');

    try {
      const res = await fetch(`/api/availability?date=${dateStr}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch availability');
      }

      renderSlots(data.slots, dateStr);
    } catch (err) {
      slotsList.innerHTML = `<div class="text-red-500 text-sm py-4 w-full text-center" aria-live="polite">${err.message}</div>`;
    }
  }

  function renderSlots(slots, dateStr) {
    slotsList.innerHTML = '';

    if (!slots || slots.length === 0) {
      slotsList.innerHTML = '<div class="text-gray-500 text-sm py-4 w-full text-center" aria-live="polite">No available slots for this date.</div>';
      return;
    }

    slots.forEach(time => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = time;
      btn.className = 'py-2 px-4 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent text-sm font-medium';

      btn.addEventListener('click', () => {
        // Deselect others
        Array.from(slotsList.children).forEach(c => {
            if(c.tagName === 'BUTTON') {
                c.classList.remove('bg-primary', 'text-white');
                c.classList.add('text-primary');
            }
        });
        btn.classList.add('bg-primary', 'text-white');
        btn.classList.remove('text-primary');

        selectedTime = time;
        if (selectedTimeDisplay) {
            selectedTimeDisplay.textContent = time;
        }

        if (formInputDate) formInputDate.value = dateStr;
        if (formInputTime) formInputTime.value = time;
        // Default duration to 30 for now
        if (formInputDuration && !formInputDuration.value) formInputDuration.value = '30';

        bookingFormContainer.classList.remove('hidden');
        // Scroll to form smoothly
        bookingFormContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });

      slotsList.appendChild(btn);
    });
  }

  if (prevMonthBtn) {
      prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
      });
  }

  if (nextMonthBtn) {
      nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
      });
  }

  if (bookingForm) {
      // Pre-fill from URL
      const urlParams = new URLSearchParams(window.location.search);
      const nameInput = bookingForm.querySelector('input[name="name"]');
      const emailInput = bookingForm.querySelector('input[name="email"]');
      const topicInput = bookingForm.querySelector('textarea[name="topic"]');

      if (nameInput && urlParams.has('name')) nameInput.value = urlParams.get('name');
      if (emailInput && urlParams.has('email')) emailInput.value = urlParams.get('email');
      if (topicInput && urlParams.has('topic')) topicInput.value = urlParams.get('topic');

      bookingForm.addEventListener('submit', async (e) => {
          e.preventDefault();

          const submitBtn = bookingForm.querySelector('button[type="submit"]');
          if (submitBtn) {
              submitBtn.disabled = true;
              submitBtn.innerHTML = 'Booking...';
          }

          statusMessage.className = 'status-message mt-6 p-4 rounded-md hidden';
          statusMessage.innerHTML = '';

          const formData = new FormData(bookingForm);
          const data = Object.fromEntries(formData.entries());

          try {
              const res = await fetch('/api/book', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data)
              });

              const result = await res.json();

              if (res.ok && result.success) {
                  statusMessage.classList.remove('hidden');
                  statusMessage.classList.add('bg-green-50', 'text-green-800', 'border', 'border-green-200');
                  statusMessage.innerHTML = `Meeting booked! A calendar invite has been sent to your email. <a href="${result.eventLink}" target="_blank" class="underline font-semibold ml-1">View Event</a>`;
                  bookingForm.reset();
                  slotsContainer.classList.add('hidden');
                  bookingFormContainer.classList.add('hidden');
                  selectedDate = null;
                  renderCalendar();
              } else {
                  throw new Error(result.error || 'Failed to book meeting');
              }
          } catch (err) {
              statusMessage.classList.remove('hidden');
              statusMessage.classList.add('bg-red-50', 'text-red-800', 'border', 'border-red-200');
              statusMessage.textContent = err.message;

              // Refresh slots if it was taken
              if (err.message.includes('taken') && selectedDate) {
                  selectDate(selectedDate);
              }
          } finally {
              if (submitBtn) {
                  submitBtn.disabled = false;
                  submitBtn.innerHTML = 'Confirm Booking';
              }
          }
      });
  }

  renderCalendar();
}

// Auto-initialize if running directly on client
if (typeof window !== 'undefined') {
    const initAll = () => {
        document.querySelectorAll('[data-booking-widget]').forEach(widget => {
            if (!widget.dataset.initialized) {
                initBookingWidget(widget);
                widget.dataset.initialized = 'true';
            }
        });
    };

    document.addEventListener('DOMContentLoaded', initAll);
    document.addEventListener('astro:page-load', initAll); // For ViewTransitions
}
