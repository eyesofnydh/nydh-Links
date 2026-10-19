(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById('theme-toggle');
  const themeSymbol = document.getElementById('theme-symbol');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('theme'); } catch { /* Storage can be disabled. */ }

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    root.dataset.theme = isDark ? 'dark' : 'light';
    themeButton.setAttribute('aria-pressed', String(isDark));
    themeButton.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
    themeSymbol.setAttribute('href', isDark ? '#sun' : '#moon');
    document.querySelector('meta[name="theme-color"]').content = isDark ? '#1b201b' : '#f5f3ed';
  }
  applyTheme(savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : systemTheme.matches ? 'dark' : 'light');
  themeButton.addEventListener('click', () => {
    savedTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(savedTheme);
    try { localStorage.setItem('theme', savedTheme); } catch { /* Keep the session choice. */ }
  });
  systemTheme.addEventListener('change', (event) => {
    if (!savedTheme) applyTheme(event.matches ? 'dark' : 'light');
  });

  document.getElementById('year').textContent = new Date().getFullYear();
  const dialog = document.getElementById('share-dialog');
  const shareInput = document.getElementById('share-url');
  const copyButton = document.getElementById('copy-link');
  const copyStatus = document.getElementById('copy-status');
  // Share the deployed page address, including its path, without tracking parameters.
  const pageUrl = new URL(window.location.href);
  pageUrl.search = '';
  pageUrl.hash = '';
  const shareUrl = pageUrl.href;
  shareInput.value = shareUrl;
  document.getElementById('share-email').href = `mailto:?subject=${encodeURIComponent('Nidhin Narayanan | All my links')}&body=${encodeURIComponent(shareUrl)}`;

  function openShareDialog() {
    copyStatus.textContent = '';
    copyButton.textContent = 'Copy link';
    if (!dialog.open) dialog.showModal();
  }
  document.getElementById('shareBtn').addEventListener('click', openShareDialog);
  document.getElementById('close-share').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  copyButton.addEventListener('click', async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(shareUrl);
      copyButton.textContent = 'Copied!';
      copyStatus.textContent = 'Link copied. Ready to share.';
    } catch {
      shareInput.focus();
      shareInput.select();
      copyStatus.textContent = 'Select and copy the link above to share it.';
    }
  });
})();
