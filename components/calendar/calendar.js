(() => {
  const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const MONTH_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
  const DISPLAY_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const DAY_KEY_FORMATTER = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const clampToMidday = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  const today = () => clampToMidday(new Date());

  const parseIsoDate = (value) => {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return null;
    }

    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day, 12);
  };

  const formatIsoDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const sameDay = (a, b) => !!a && !!b && formatIsoDate(a) === formatIsoDate(b);

  const isBefore = (a, b) => a.getTime() < b.getTime();
  const isAfter = (a, b) => a.getTime() > b.getTime();

  let activePicker = null;

  class DatePicker {
    constructor(root) {
      this.root = root;
      this.hiddenInput = root.querySelector('[data-date-value]');
      this.trigger = root.querySelector('[data-date-trigger]');
      this.display = root.querySelector('[data-date-display]');
      this.popover = root.querySelector('[data-date-popover]');
      this.title = root.querySelector('[data-date-title]');
      this.weekdays = root.querySelector('[data-date-weekdays]');
      this.grid = root.querySelector('[data-date-grid]');
      this.prevButton = root.querySelector('[data-date-prev]');
      this.nextButton = root.querySelector('[data-date-next]');

      this.placeholder = root.dataset.placeholder || 'Pick a date';
      this.minDate = parseIsoDate(root.dataset.minDate || '');
      this.maxDate = parseIsoDate(root.dataset.maxDate || '');
      this.selectedDate = parseIsoDate(this.hiddenInput.value);
      this.viewDate = this.selectedDate || this.minDate || today();
      this.onSelectCallbacks = [];

      this.renderWeekdays();
      this.bindEvents();
      this.syncDisplay();
      this.render();
    }

    emitSelection() {
      this.onSelectCallbacks.forEach((callback) => callback(this.selectedDate));
    }

    bindEvents() {
      this.trigger.addEventListener('click', () => {
        if (activePicker && activePicker !== this) {
          activePicker.close();
        }

        this.isOpen() ? this.close() : this.open();
      });

      this.prevButton.addEventListener('click', () => {
        this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1, 12);
        this.render();
      });

      this.nextButton.addEventListener('click', () => {
        this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1, 12);
        this.render();
      });
    }

    renderWeekdays() {
      this.weekdays.innerHTML = WEEKDAYS.map((day) => `<span class="sen-date-weekday">${day}</span>`).join('');
    }

    syncDisplay() {
      this.hiddenInput.value = this.selectedDate ? formatIsoDate(this.selectedDate) : '';
      this.display.textContent = this.selectedDate ? DISPLAY_FORMATTER.format(this.selectedDate) : this.placeholder;
      this.display.classList.toggle('text-slate-500', !this.selectedDate);
      this.display.classList.toggle('text-slate-950', !!this.selectedDate);
    }

    setMinDate(value) {
      this.minDate = parseIsoDate(value || '');

      if (this.selectedDate && this.minDate && isBefore(this.selectedDate, this.minDate)) {
        this.clear(true);
      }

      this.render();
    }

    setMaxDate(value) {
      this.maxDate = parseIsoDate(value || '');

      if (this.selectedDate && this.maxDate && isAfter(this.selectedDate, this.maxDate)) {
        this.clear(true);
      }

      this.render();
    }

    clear(shouldNotify = false) {
      this.selectedDate = null;
      this.syncDisplay();
      this.render();

      if (shouldNotify) {
        this.emitSelection();
      }
    }

    isDisabled(date) {
      if (this.minDate && isBefore(date, this.minDate)) {
        return true;
      }

      if (this.maxDate && isAfter(date, this.maxDate)) {
        return true;
      }

      return false;
    }

    select(date) {
      if (this.isDisabled(date)) {
        return;
      }

      this.selectedDate = clampToMidday(date);
      this.viewDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1, 12);
      this.syncDisplay();
      this.render();
      this.close();
      this.emitSelection();
    }

    render() {
      const year = this.viewDate.getFullYear();
      const month = this.viewDate.getMonth();
      const monthStart = new Date(year, month, 1, 12);
      const gridStart = new Date(year, month, 1 - monthStart.getDay(), 12);

      this.title.textContent = MONTH_FORMATTER.format(monthStart);
      this.grid.innerHTML = '';

      for (let index = 0; index < 42; index += 1) {
        const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index, 12);
        const outsideMonth = date.getMonth() !== month;
        const disabled = this.isDisabled(date);
        const selected = sameDay(date, this.selectedDate);
        const isToday = sameDay(date, today());

        const dayButton = document.createElement('button');
        dayButton.type = 'button';
        dayButton.className = [
          'sen-date-day',
          outsideMonth ? 'is-outside' : '',
          disabled ? 'is-disabled' : '',
          selected ? 'is-selected' : '',
          isToday ? 'is-today' : '',
        ].filter(Boolean).join(' ');
        dayButton.textContent = String(date.getDate());
        dayButton.dataset.dateValue = formatIsoDate(date);
        dayButton.setAttribute('aria-pressed', selected ? 'true' : 'false');

        if (disabled) {
          dayButton.disabled = true;
        } else {
          dayButton.addEventListener('click', () => this.select(date));
        }

        this.grid.appendChild(dayButton);
      }
    }

    isOpen() {
      return !this.popover.classList.contains('hidden');
    }

    open() {
      activePicker = this;
      this.popover.classList.remove('hidden');
      this.trigger.setAttribute('aria-expanded', 'true');
    }

    close() {
      if (activePicker === this) {
        activePicker = null;
      }

      this.popover.classList.add('hidden');
      this.trigger.setAttribute('aria-expanded', 'false');
    }
  }

  const initRange = (rangeRoot) => {
    const startRoot = rangeRoot.querySelector('[data-range-part="start"]');
    const endRoot = rangeRoot.querySelector('[data-range-part="end"]');

    if (!startRoot || !endRoot) {
      return;
    }

    const startPicker = startRoot._senDatePicker;
    const endPicker = endRoot._senDatePicker;

    if (!startPicker || !endPicker) {
      return;
    }

    if (startPicker.selectedDate) {
      endPicker.setMinDate(formatIsoDate(startPicker.selectedDate));
    }

    if (endPicker.selectedDate) {
      startPicker.setMaxDate(formatIsoDate(endPicker.selectedDate));
    }

    startPicker.onSelectCallbacks.push((selectedDate) => {
      endPicker.setMinDate(selectedDate ? formatIsoDate(selectedDate) : '');
    });

    endPicker.onSelectCallbacks.push((selectedDate) => {
      startPicker.setMaxDate(selectedDate ? formatIsoDate(selectedDate) : '');
    });
  };

  const initDatePickers = () => {
    document.querySelectorAll('[data-date-picker]').forEach((root) => {
      if (!root._senDatePicker) {
        root._senDatePicker = new DatePicker(root);
      }
    });

    document.querySelectorAll('[data-sen-calendar-range]').forEach(initRange);
  };

  document.addEventListener('click', (event) => {
    if (!activePicker) {
      return;
    }

    if (!activePicker.root.contains(event.target)) {
      activePicker.close();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && activePicker) {
      activePicker.close();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDatePickers, { once: true });
  } else {
    initDatePickers();
  }
})();
