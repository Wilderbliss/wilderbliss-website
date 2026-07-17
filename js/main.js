// WilderBliss — Main JS

// ── Early Access Popup ────────────────────────────────────────
(function () {
  const STORAGE_KEY = 'wb_popup_dismissed';
  const DISMISS_DAYS = 7;

  function shouldShow() {
    const val = localStorage.getItem(STORAGE_KEY);
    if (!val) return true;
    const dismissed = parseInt(val, 10);
    return Date.now() - dismissed > DISMISS_DAYS * 864e5;
  }

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  }

  function openPopup(popup) {
    popup.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closePopup(popup) {
    popup.classList.remove('is-open');
    document.body.style.overflow = '';
    dismiss();
  }

  document.addEventListener('DOMContentLoaded', function () {
    const popup = document.getElementById('wb-popup');
    if (!popup) return;
    if (!shouldShow()) return;

    // Show after 4 seconds
    const timer = setTimeout(() => openPopup(popup), 4000);

    // Close button
    const closeBtn = document.getElementById('wb-popup-close');
    if (closeBtn) closeBtn.addEventListener('click', () => { clearTimeout(timer); closePopup(popup); });

    // No thanks button
    const noThanks = document.getElementById('wb-popup-no-thanks');
    if (noThanks) noThanks.addEventListener('click', () => closePopup(popup));

    // Overlay click
    const overlay = document.getElementById('wb-popup-overlay');
    if (overlay) overlay.addEventListener('click', () => closePopup(popup));

    // Esc key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && popup.classList.contains('is-open')) closePopup(popup);
    });

    // Close + dismiss on successful email submit
    const popupForm = popup.querySelector('.email-form');
    if (popupForm) {
      popupForm.addEventListener('wb:submitted', () => {
        setTimeout(() => closePopup(popup), 2500);
      });
    }
  });
})();

// Nav: scroll state
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// Nav: mobile menu toggle
const toggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');
if (toggle && navLinks) {
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navLinks.classList.toggle('open');
    nav.classList.toggle('menu-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      nav.classList.remove('menu-open');
      document.body.style.overflow = '';
    });
  });
  // Close on outside tap
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') && !nav.contains(e.target)) {
      navLinks.classList.remove('open');
      nav.classList.remove('menu-open');
      document.body.style.overflow = '';
    }
  });
}

// Email form: submit to Netlify Forms
document.querySelectorAll('.email-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const original = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    })
    .then(() => {
      const input = form.querySelector('input[type="email"]');
      if (input) input.value = '';
      btn.textContent = "You're on the list";
      form.dispatchEvent(new CustomEvent('wb:submitted', { bubbles: true }));
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
      }, 4000);
    })
    .catch(() => {
      btn.textContent = 'Try again';
      btn.disabled = false;
    });
  });
});
