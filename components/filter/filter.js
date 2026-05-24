(function () {
  function closeFilter(filter) {
    filter.dataset.open = 'false';
    filter.querySelector('[data-filter-dropdown]').classList.add('hidden');
    filter.querySelector('[data-filter-trigger]').setAttribute('aria-expanded', 'false');
  }

  document.querySelectorAll('[data-sen-filter]').forEach(function (filter) {
    const trigger = filter.querySelector('[data-filter-trigger]');
    const dropdown = filter.querySelector('[data-filter-dropdown]');
    const hiddenInput = filter.querySelector('[data-filter-input]');
    const display = filter.querySelector('[data-filter-display]');

    if (!trigger || !dropdown) return;

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = filter.dataset.open === 'true';
      document.querySelectorAll('[data-sen-filter]').forEach(closeFilter);
      if (!isOpen) {
        filter.dataset.open = 'true';
        dropdown.classList.remove('hidden');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    dropdown.querySelectorAll('[data-filter-option]').forEach(function (option) {
      option.addEventListener('click', function () {
        const value = option.dataset.value;
        const label = option.textContent.trim();

        hiddenInput.value = value;
        display.textContent = value ? label : 'All';

        dropdown.querySelectorAll('[data-filter-option]').forEach(function (o) {
          o.classList.remove('bg-indigo-50', 'font-semibold', 'text-indigo-600');
          o.classList.add('text-slate-900');
        });
        option.classList.add('bg-indigo-50', 'font-semibold', 'text-indigo-600');
        option.classList.remove('text-slate-900');

        closeFilter(filter);
        filter.dispatchEvent(new CustomEvent('sen:filter-change', {
          bubbles: true,
          detail: { name: hiddenInput.name, value: value },
        }));
      });
    });
  });

  document.addEventListener('click', function () {
    document.querySelectorAll('[data-sen-filter]').forEach(closeFilter);
  });
})();
