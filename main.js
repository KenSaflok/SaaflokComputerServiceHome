document.addEventListener('DOMContentLoaded', function () {

  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
      const icon = themeToggle.querySelector('.theme-toggle-icon');
      const label = themeToggle.querySelector('.theme-toggle-label');
      if (icon) icon.textContent = theme === 'light' ? '🌙' : '☀️';
      if (label) label.textContent = theme === 'light' ? 'Dark' : 'Light';
    }
    localStorage.setItem('saaflok-theme', theme);
  }

  const savedTheme = localStorage.getItem('saaflok-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(savedTheme || (prefersLight ? 'light' : 'dark'));

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const nextTheme = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
    });
  }

  // ── Year
  document.getElementById('yr').textContent = new Date().getFullYear();

  // ── Contact email is shown directly in the page
  const emailLink = document.getElementById('email-link');
  if (emailLink) {
    emailLink.addEventListener('click', function (e) {
      e.preventDefault();
      const addr = 'Support@SaaflokMSP.onmicrosoft.com';
      this.href = 'mailto:' + addr;
      this.textContent = addr;
    });
  }

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

  // ── Enquiry number generation
  function generateEnquiryNumber() {
    var digits = Math.floor(1000 + Math.random() * 9000);
    return 'INQ' + digits;
  }

  // ── Assign enquiry number when the page loads
  var enquiryNum = generateEnquiryNumber();
  var enquiryDisplay = document.getElementById('enquiry-number-display');
  var enquiryField   = document.getElementById('enquiry-number-field');
  if (enquiryDisplay) enquiryDisplay.textContent = enquiryNum;
  if (enquiryField)   enquiryField.value = enquiryNum;

  // ── Form submit — sends via Web3Forms (no email client opened)
  var form = document.getElementById('inquiry-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = document.getElementById('submit-btn');
      var successEl = document.getElementById('form-success');
      var errorEl   = document.getElementById('form-error');

      // Stamp the current enquiry number into the subject line
      var subjectField = document.getElementById('form-subject');
      if (subjectField) {
        subjectField.value = 'New Inquiry ' + enquiryNum + ' \u2013 SAAFLOK Computers Service LLC';
      }

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending\u2026'; }
      if (successEl) successEl.style.display = 'none';
      if (errorEl)   errorEl.style.display   = 'none';

      var data = new FormData(form);

      fetch('https://api.web3forms.com/submit', { method: 'POST', body: data })
        .then(function (res) { return res.json(); })
        .then(function (result) {
          if (result.success) {
            if (successEl) {
              successEl.innerHTML = '\u2705 Inquiry <strong>' + enquiryNum + '</strong> submitted! We\u2019ll be in touch shortly.';
              successEl.style.display = 'block';
            }

            form.reset();
            // Generate a fresh number for any subsequent submission
            enquiryNum = generateEnquiryNumber();
            if (enquiryDisplay) enquiryDisplay.textContent = enquiryNum;
            if (enquiryField)   enquiryField.value = enquiryNum;
          } else {
            if (errorEl) errorEl.style.display = 'block';
          }
        })
        .catch(function () {
          if (errorEl) errorEl.style.display = 'block';
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send Inquiry \u2192'; }
        });
    });
  }

});
