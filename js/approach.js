window.initApproach = function () {
  const cards = document.querySelectorAll('.approach-card');
  if (!cards.length) return;

  let current = 0;
  const colors = ['#2D1E0F', '#D4621A', '#1E6B3C'];

  function activate(idx) {
    cards.forEach((c, i) => {
      c.style.borderColor = i === idx ? colors[i] : '#E0D8CE';
      c.style.boxShadow   = i === idx ? `0 0 0 2px ${colors[i]}22` : 'none';
      const arrow = c.querySelector('.approach-arrow');
      if (arrow) arrow.style.color = i === idx ? colors[i] : '#CBD5E1';
    });
    current = idx;
  }

  activate(0);
  setInterval(() => activate((current + 1) % cards.length), 2200);

  cards.forEach((c, i) => c.addEventListener('click', () => activate(i)));
};
