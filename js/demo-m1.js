window.initDemoM1 = function () {
  const INIT = [
    { id:'cair-a',  name:'Cairan Aktif A',  unit:'liter', qty:18,  min:10 },
    { id:'cair-b',  name:'Cairan Aktif B',  unit:'liter', qty:6,   min:8  },
    { id:'botol-s', name:'Botol 250ml',     unit:'pcs',   qty:340, min:200 },
    { id:'botol-l', name:'Botol 500ml',     unit:'pcs',   qty:190, min:150 },
    { id:'stiker',  name:'Stiker Brand A',  unit:'lembar',qty:280, min:200 },
    { id:'sprayer', name:'Tutup Sprayer',   unit:'pcs',   qty:420, min:300 },
  ];
  const BOM = {
    'QP-250': { 'cair-a':0.22, 'cair-b':0.03, 'botol-s':1, 'stiker':1, 'sprayer':1 },
    'QP-500': { 'cair-a':0.45, 'cair-b':0.05, 'botol-l':1, 'stiker':1, 'sprayer':1 },
  };

  let stock = INIT.map(i => ({ ...i }));
  let finishedGoods = { 'QP-250': 0, 'QP-500': 0 };
  let prodQty = 10;
  let running = false;
  let log = [];

  function renderStock() {
    const tbody = document.getElementById('m1-tbody');
    if (!tbody) return;
    tbody.innerHTML = stock.map(s => {
      const low = s.qty <= s.min;
      const pct = Math.min(100, (s.qty / (s.min * 2)) * 100);
      return `<tr>
        <td style="padding:10px 12px;font-size:13px;font-weight:500">${s.name}</td>
        <td style="padding:10px 12px;font-size:13px;text-align:center">${s.qty} ${s.unit}</td>
        <td style="padding:10px 12px;font-size:13px;text-align:center;color:var(--muted,#7A6A5A)">${s.min}</td>
        <td style="padding:10px 12px">
          <div style="background:#F1F5F9;border-radius:100px;height:6px;overflow:hidden">
            <div style="width:${pct}%;height:100%;border-radius:100px;background:${low?'#DC2626':'#1E6B3C'};transition:width .4s"></div>
          </div>
        </td>
        <td style="padding:10px 12px;text-align:center">
          <span style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:100px;background:${low?'#FEE2E2':'#E8F5EE'};color:${low?'#DC2626':'#1E6B3C'}">
            ${low ? '⚠ Rendah' : '✓ Aman'}
          </span>
        </td>
      </tr>`;
    }).join('');
  }

  function renderFG() {
    const el250 = document.getElementById('m1-qp250');
    const el500 = document.getElementById('m1-qp500');
    if (el250) el250.textContent = finishedGoods['QP-250'];
    if (el500) el500.textContent = finishedGoods['QP-500'];
  }

  function renderLog() {
    const el = document.getElementById('m1-log');
    if (!el) return;
    el.innerHTML = log.slice(-5).reverse().map(l =>
      `<div style="display:flex;gap:8px;align-items:flex-start;font-size:12px;padding:6px 0;border-bottom:1px solid #F1F5F9">
        <span style="color:${l.ok?'#1E6B3C':'#DC2626'};font-size:10px;margin-top:2px">${l.ok?'✓':'✗'}</span>
        <div><span style="color:#7A6A5A">${l.time}</span> — ${l.msg}</div>
      </div>`
    ).join('') || '<div style="color:#7A6A5A;font-size:12px;text-align:center;padding:16px">Log aktivitas akan muncul di sini</div>';
  }

  function renderQty() {
    const el = document.getElementById('m1-qty');
    if (el) el.textContent = prodQty;
  }

  function now() {
    return new Date().toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' });
  }

  window.m1RunProduksi = function () {
    if (running) return;
    const sku = document.getElementById('m1-sku')?.value || 'QP-250';
    const bom = BOM[sku];
    // Check stock
    for (const [id, need] of Object.entries(bom)) {
      const item = stock.find(s => s.id === id);
      if (!item || item.qty < need * prodQty) {
        log.push({ ok:false, time:now(), msg:`Stok ${item?.name||id} tidak cukup untuk ${prodQty} unit ${sku}` });
        renderLog();
        return;
      }
    }
    running = true;
    document.getElementById('m1-run-btn').disabled = true;
    setTimeout(() => {
      for (const [id, need] of Object.entries(bom)) {
        const item = stock.find(s => s.id === id);
        if (item) item.qty = Math.round((item.qty - need * prodQty) * 100) / 100;
      }
      finishedGoods[sku] += prodQty;
      log.push({ ok:true, time:now(), msg:`Produksi ${prodQty} unit ${sku} selesai — stok bahan otomatis terpotong` });
      running = false;
      document.getElementById('m1-run-btn').disabled = false;
      renderStock(); renderFG(); renderLog();
    }, 900);
  };

  window.m1Reset = function () {
    stock = INIT.map(i => ({ ...i }));
    finishedGoods = { 'QP-250': 0, 'QP-500': 0 };
    log = [];
    renderStock(); renderFG(); renderLog();
  };

  window.m1QtyChange = function (delta) {
    prodQty = Math.max(5, Math.min(100, prodQty + delta));
    renderQty();
  };

  renderStock(); renderFG(); renderLog(); renderQty();
};
