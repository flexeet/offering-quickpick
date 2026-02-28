window.initTimeline = function () {
  const phases = document.querySelectorAll('.timeline-phase');
  if (!phases.length) return;

  let current = 0;

  function activate(idx) {
    phases.forEach((p, i) => {
      const dot  = p.querySelector('.tl-dot');
      const card = p.querySelector('.tl-card');
      const active = i === idx;
      if (dot)  {
        dot.style.background   = active ? '#D4621A' : '#E0D8CE';
        dot.style.borderColor  = active ? '#D4621A' : '#E0D8CE';
        dot.style.transform    = active ? 'scale(1.25)' : 'scale(1)';
      }
      if (card) {
        card.style.borderColor   = active ? '#D4621A' : '#E0D8CE';
        card.style.background    = active ? '#FEF9F5' : '#fff';
      }
    });

    // connectors
    document.querySelectorAll('.tl-connector').forEach((c, i) => {
      c.style.background = i < idx ? '#D4621A' : '#E0D8CE';
    });

    current = idx;
  }

  activate(0);
  setInterval(() => activate((current + 1) % phases.length), 1800);
  phases.forEach((p, i) => p.addEventListener('click', () => activate(i)));
};
