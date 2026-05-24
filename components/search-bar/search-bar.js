(function () {
  document.querySelectorAll('[data-sen-search]').forEach(function (wrapper) {
    const input = wrapper.querySelector('input');
    const clearBtn = wrapper.querySelector('[data-search-clear]');

    if (!input || !clearBtn) return;

    function updateClear() {
      clearBtn.classList.toggle('hidden', !input.value.length);
    }

    input.addEventListener('input', updateClear);
    clearBtn.addEventListener('click', function () {
      input.value = '';
      input.focus();
      updateClear();
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    updateClear();
  });
})();
