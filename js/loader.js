window.loadSections = async function () {
  const sections = [
    'header','hero','pain','approach','modules',
    'demo','pricing','timeline','terms','cta','footer'
  ];
  const app = document.getElementById('app');

  for (const s of sections) {
    try {
      const html = await fetch(`sections/${s}.html`).then(r => r.text());
      app.insertAdjacentHTML('beforeend', html);
    } catch (e) {
      console.error('Failed to load section:', s, e);
    }
  }

  // Render lucide icons
  if (window.lucide) lucide.createIcons();

  // Init all interactive modules
  if (window.initAnimations)  initAnimations();
  if (window.initHeader)      initHeader();
  if (window.initApproach)    initApproach();
  if (window.initTimeline)    initTimeline();
  if (window.initDemoM1)      initDemoM1();
  if (window.initDemoM2)      initDemoM2();
  if (window.initDemoM3)      initDemoM3();
  if (window.initDemoM4)      initDemoM4();
  if (window.initDemo)        initDemo(); // must run after all demo inits
};
