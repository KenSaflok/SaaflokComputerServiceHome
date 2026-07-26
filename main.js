document.addEventListener('DOMContentLoaded', function () {

  // ── Year
  document.getElementById('yr').textContent = new Date().getFullYear();

  // ── Masked email reveal (anti-scrape)
  document.getElementById('email-link').addEventListener('click', function (e) {
    e.preventDefault();
    const u = 'saaflokcomputers', d = 'gmail', t = 'com';
    const addr = u + '@' + d + '.' + t;
    this.href = 'mailto:' + addr;
    this.textContent = addr;
  });

  // ── Pricing tabs (uses data-tab attribute instead of inline onclick)
  document.querySelectorAll('.ptab').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const tab = this.dataset.tab;
      if (!tab) return;
      document.querySelectorAll('.ptab').forEach(function (b) { b.classList.remove('active'); });
      document.querySelectorAll('.ptab-panel').forEach(function (p) { p.classList.remove('active'); });
      const panel = document.getElementById('tab-' + tab);
      if (panel) panel.classList.add('active');
      this.classList.add('active');
    });
  });

  // ── Form submit — Formspree fallback (mailto when placeholder ID is still set)
  const form = document.getElementById('inquiry-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      const isPlaceholder = form.action === 'https://formspree.io/f/YOUR_FORM_ID';
      if (isPlaceholder) {
        e.preventDefault();
        const fn  = document.getElementById('fname').value;
        const ln  = document.getElementById('lname').value;
        const em  = document.getElementById('femail').value;
        const ph  = document.getElementById('fphone').value;
        const ct  = document.getElementById('client-type').value;
        const sv  = document.getElementById('service').value;
        const dev = document.getElementById('devices').value;
        const msg = document.getElementById('message').value;
        const body = encodeURIComponent(
          'Name: '        + fn  + ' ' + ln  + '\n' +
          'Email: '       + em  + '\n' +
          'Phone: '       + ph  + '\n' +
          'Client Type: ' + ct  + '\n' +
          'Service: '     + sv  + '\n' +
          'Devices: '     + dev + '\n\n' +
          'Message:\n'    + msg
        );
        // Subject and body are both properly encoded
        window.location.href =
          'mailto:saaflokcomputers@gmail.com?subject=' +
          encodeURIComponent('New Inquiry \u2013 SAAFLOK Computers Service LLC') +
          '&body=' + body;
        const successEl = document.getElementById('form-success');
        if (successEl) successEl.style.display = 'block';
      }
    });
  }

});
