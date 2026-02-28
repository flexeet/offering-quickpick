window.initAnimations = function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
};

window.initHeader = function () {
  const header = document.querySelector('header#main-header');
  if (!header) return;
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('glass-nav');
    else header.classList.remove('glass-nav');
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu toggle
  const burger = document.getElementById('burger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      mobileMenu.style.display = mobileMenu.style.display === 'none' ? 'block' : 'none';
    });
  }

  // Smooth scroll nav
  document.querySelectorAll('[data-scroll-to]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.scrollTo;
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      if (mobileMenu) mobileMenu.style.display = 'none';
    });
  });
};
