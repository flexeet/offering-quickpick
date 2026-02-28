window.initDemoM2 = function () {
  let stock = { 'cair-b': 6, 'stiker': 280, 'botol-l': 190 };
  const mins  = { 'cair-b': 8,  'stiker': 200, 'botol-l': 150 };
  const names = { 'cair-b': 'Cairan Aktif B', 'stiker': 'Stiker Brand A', 'botol-l': 'Botol 500ml' };
  const maxs  = { 'cair-b': 30, 'stiker': 400, 'botol-l': 300 };
  const suppliers = {
    'cair-b':  [{ name:'PT Kimia',    time:'1 hari' }, { name:'CV Maju', time:'2 hari' }, { name:'UD Sejuk', time:'3 hari' }],
    'stiker':  [{ name:'Print Jaya',  time:'2 hari' }, { name:'Kreatif Print', time:'3 hari' }],
    'botol-l': [{ name:'UD Plastik',  time:'1 hari' }, { name:'CV Pack',      time:'2 hari' }],
  };

  let notifications = [];
  let poSent = {};
  let simulating = false;
  let notifId = 0;

  function renderBars() {
    Object.entries(stock).forEach(([id, qty]) => {
      const bar = document.getElementById(`m2-bar-${id}`);
      const label = document.getElementById(`m2-qty-${id}`);
      const pct = Math.min(100, (qty / maxs[id]) * 100);
      const low = qty <= mins[id];
      if (bar) { bar.style.width = pct + '%'; bar.style.background = low ? '#DC2626' : '#1E6B3C'; }
      if (label) label.textContent = `${qty} / min ${mins[id]}`;
    });
  }

  function renderNotifs() {
    const el = document.getElementById('m2-notifs');
    if (!el) return;
    if (!notifications.length) {
      el.innerHTML = `<div style="color:#7A6A5A;font-size:12px;text-align:center;padding:20px">Belum ada notifikasi — tekan "Simulasi Drain Stok"</div>`;
      return;
    }
    el.innerHTML = notifications.map(n => `
      <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:10px;padding:12px 14px;margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
          <div>
            <div style="font-size:13px;font-weight:700;color:#92400E">⚠ ${n.name} — Stok Rendah</div>
            <div style="font-size:12px;color:#7A6A5A">${n.qty} tersisa · Min ${n.min}</div>
          </div>
          <span style="font-size:11px;color:#7A6A5A">${n.time}</span>
        </div>
        <div style="font-size:12px;font-weight:600;color:#92400E;margin-bottom:6px">Pilih Supplier:</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${suppliers[n.id].map((s, i) => {
            const sent = poSent[`${n.id}-${i}`];
            return `<button onclick="m2SendPO('${n.id}',${i})"
              style="font-size:12px;padding:5px 12px;border-radius:8px;border:1px solid ${sent?'#1E6B3C':'#D4621A'};background:${sent?'#E8F5EE':'#FEF3E8'};color:${sent?'#1E6B3C':'#D4621A'};cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:600;transition:all .2s">
              ${sent ? '✓ Terkirim' : `Kirim ke ${s.name}`}
            </button>`;
          }).join('')}
        </div>
      </div>`
    ).join('');
  }

  window.m2SimulateDrain = function () {
    if (simulating) return;
    simulating = true;
    document.getElementById('m2-drain-btn').disabled = true;
    const drains = [
      { id:'cair-b', by:4 },
      { id:'stiker', by:90 },
      { id:'botol-l', by:50 },
    ];
    drains.forEach(({ id, by }, idx) => {
      setTimeout(() => {
        stock[id] = Math.max(0, stock[id] - by);
        renderBars();
        if (stock[id] <= mins[id]) {
          const t = new Date().toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' });
          notifications.unshift({ id, name: names[id], qty: stock[id], min: mins[id], time: t, nid: notifId++ });
          renderNotifs();
        }
        if (idx === drains.length - 1) {
          simulating = false;
          document.getElementById('m2-drain-btn').disabled = false;
        }
      }, (idx + 1) * 500);
    });
  };

  window.m2SendPO = function (itemId, supplierIdx) {
    poSent[`${itemId}-${supplierIdx}`] = true;
    renderNotifs();
  };

  window.m2Reset = function () {
    stock = { 'cair-b': 6, 'stiker': 280, 'botol-l': 190 };
    notifications = []; poSent = {}; simulating = false;
    renderBars(); renderNotifs();
    document.getElementById('m2-drain-btn').disabled = false;
  };

  renderBars(); renderNotifs();
};
