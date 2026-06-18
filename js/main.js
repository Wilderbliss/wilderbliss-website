// WilderBliss — Main JS

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
}
