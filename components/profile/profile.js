(function () {
  function closeAll() {
    document.querySelectorAll('[data-sen-profile]').forEach(function (profile) {
      profile.dataset.open = 'false';
      profile.querySelector('[data-profile-menu]').classList.add('hidden');
      profile.querySelector('[data-profile-trigger]').setAttribute('aria-expanded', 'false');
    });
  }

  document.querySelectorAll('[data-sen-profile]').forEach(function (profile) {
    const trigger = profile.querySelector('[data-profile-trigger]');
    const menu = profile.querySelector('[data-profile-menu');

    if (!trigger || !menu) return;

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = profile.dataset.open === 'true';
      closeAll();
      if (!isOpen) {
        profile.dataset.open = 'true';
        menu.classList.remove('hidden');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', closeAll);
})();
