(function () {
  const sidebar = document.getElementById('sen-sidebar');
  const main = document.getElementById('sen-main');
  const overlay = document.getElementById('sen-overlay');
  const toggle = document.getElementById('sen-sidebar-toggle');
  const close = document.getElementById('sen-sidebar-close');

  if (!sidebar) return;

  function isMobile() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  function openMobile() {
    sidebar.classList.remove('-translate-x-full');
    sidebar.classList.add('translate-x-0');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMobile() {
    sidebar.classList.add('-translate-x-full');
    sidebar.classList.remove('translate-x-0');
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function toggleDesktop() {
    const collapsed = sidebar.dataset.collapsed === 'true';
    sidebar.dataset.collapsed = collapsed ? 'false' : 'true';
    main.classList.toggle('md:ml-64', collapsed);
    main.classList.toggle('md:ml-[72px]', !collapsed);
  }

  toggle?.addEventListener('click', function () {
    if (isMobile()) openMobile();
    else toggleDesktop();
  });

  close?.addEventListener('click', closeMobile);
  overlay?.addEventListener('click', closeMobile);

  window.addEventListener('resize', function () {
    if (!isMobile()) closeMobile();
  });
})();
