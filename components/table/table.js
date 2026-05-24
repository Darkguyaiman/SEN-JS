(function () {
  document.querySelectorAll('[data-sen-table]').forEach(function (tableWrapper) {
    const searchInput = document.querySelector('[data-table-search]');
    const filterEls = document.querySelectorAll('[data-table-filter]');

    if (!searchInput && !filterEls.length) return;

    function filterRows() {
      const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
      const filters = {};

      filterEls.forEach(function (el) {
        const input = el.querySelector('[data-filter-input]');
        if (input && input.value) filters[input.name] = input.value.toLowerCase();
      });

      tableWrapper.querySelectorAll('[data-row-index]').forEach(function (row) {
        const text = row.textContent.toLowerCase();
        const matchSearch = !query || text.includes(query);
        let matchFilters = true;

        Object.entries(filters).forEach(function ([, value]) {
          if (!text.includes(value)) matchFilters = false;
        });

        row.classList.toggle('hidden', !(matchSearch && matchFilters));
      });
    }

    if (searchInput) searchInput.addEventListener('input', filterRows);
    filterEls.forEach(function (el) {
      el.addEventListener('sen:filter-change', filterRows);
    });
  });
})();
