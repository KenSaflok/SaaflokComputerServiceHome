document.addEventListener('DOMContentLoaded', function () {

  // ── EmailJS auto-response setup
  // Setup steps (one-time):
  //   1. Sign up at https://www.emailjs.com (free — 200 emails/month)
  //   2. Add Email Service → connect your Microsoft 365 account → note the Service ID
  //   3. Create Email Template with the content below → note the Template ID
  //   4. Go to Account → API Keys → copy your Public Key
  //   5. Replace the three placeholder strings below with your actual values
  //
  // ── EmailJS template content (paste this into the EmailJS template editor) ──
  //
  //   To:       {{to_email}}
  //   From:     SAAFLOK Computer Services <noreply@SaaflokMSP.onmicrosoft.com>
  //   Reply-To: Support@SaaflokMSP.onmicrosoft.com
  //   Subject:  Enquiry {{enquiry_number}} Received – SAAFLOK Computer Services
  //
  //   Hi {{to_name}},
  //
  //   Thank you for reaching out to SAAFLOK Computer Services! We truly appreciate
  //   you taking the time to contact us, and we're glad you chose SAAFLOK for your
  //   technology needs.
  //
  //   This email confirms that we have successfully received your service request
  //   and it is now being reviewed by our team. You don't need to do anything else
  //   right now — we've got it from here!
  //
  //   ────────────────────────────────────
  //   ✓  What Happens Next
  //
  //   A member of the SAAFLOK team will reach out to you within 1 business day
  //   (Monday – Friday) to:
  //
  //   • Confirm the details of your service request
  //   • Discuss appointment scheduling or drop-off options
  //   • Provide an initial estimate or pricing information
  //   • Answer any questions you may have before we get started
  //
  //   Your reference number: {{enquiry_number}}
  //
  //   Warm regards,
  //   SAAFLOK Computer Services Team
  //   Support@SaaflokMSP.onmicrosoft.com | (636) 253-9905
  // ─────────────────────────────────────────────────────────────────────────────
  var EMAILJS_PUBLIC_KEY  = 'YOUR_EMAILJS_PUBLIC_KEY';
  var EMAILJS_SERVICE_ID  = 'YOUR_EMAILJS_SERVICE_ID';
  var EMAILJS_TEMPLATE_ID = 'YOUR_EMAILJS_TEMPLATE_ID';

  if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  function sendAutoResponse(firstName, clientEmail, inqNum) {
    if (typeof emailjs === 'undefined' || EMAILJS_PUBLIC_KEY === 'YOUR_EMAILJS_PUBLIC_KEY') return;
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_name:        firstName,
      to_email:       clientEmail,
      enquiry_number: inqNum,
      reply_to:       'Support@SaaflokMSP.onmicrosoft.com'
    });
  }

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

      // Capture client details before FormData clears on reset
      var firstName   = (document.getElementById('fname')   || {}).value || '';
      var clientEmail = (document.getElementById('femail')  || {}).value || '';
      var capturedInq = enquiryNum;

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
            sendAutoResponse(firstName, clientEmail, capturedInq);
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
