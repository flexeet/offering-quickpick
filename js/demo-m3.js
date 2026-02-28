window.initDemoM3 = function () {
  const INIT_ORDERS = [
    { id:'ORD-001', channel:'Shopee',  sku:'QP-250', qty:12, buyer:'Budi S.',  time:'2 mnt lalu',  status:'pending' },
    { id:'ORD-002', channel:'TikTok',  sku:'QP-500', qty:6,  buyer:'Siti R.',  time:'5 mnt lalu',  status:'pending' },
    { id:'ORD-003', channel:'Shopee',  sku:'QP-250', qty:8,  buyer:'Andi K.',  time:'12 mnt lalu', status:'pending' },
    { id:'ORD-004', channel:'TikTok',  sku:'QP-250', qty:20, buyer:'Dewi M.',  time:'18 mnt lalu', status:'pending' },
    { id:'ORD-005', channel:'Shopee',  sku:'QP-500', qty:4,  buyer:'Reza F.',  time:'25 mnt lalu', status:'pending' },
  ];

  let orders = INIT_ORDERS.map(o => ({ ...o }));
  let centralStock = { 'QP-250': 500, 'QP-500': 300 };
  let processing = null;
  let synced = false;

  function renderOrders() {
    const tbody = document.getElementById('m3-tbody');
    if (!tbody) return;
    tbody.innerHTML = orders.map(o => {
      const statusColor = o.status === 'shipped' ? '#1E6B3C' : o.status === 'failed' ? '#DC2626' : '#D4621A';
      const statusBg    = o.status === 'shipped' ? '#E8F5EE'  : o.status === 'failed' ? '#FEE2E2'  : '#FEF3E8';
      const statusLabel = o.status === 'shipped' ? '✓ Terkirim' : o.status === 'failed' ? '✗ Gagal' : '● Pending';
      return `<tr>
        <td style="padding:10px 12px;font-size:12px;font-weight:700;color:#2D1E0F">${o.id}</td>
        <td style="padding:10px 12px"><span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:100px;background:${o.channel==='Shopee'?'#FFF0F0':'#F0FFF4'};color:${o.channel==='Shopee'?'#EE4D2D':'#166534'}">${o.channel}</span></td>
        <td style="padding:10px 12px;font-size:12px">${o.sku} × ${o.qty}</td>
        <td style="padding:10px 12px;font-size:12px;color:#7A6A5A">${o.buyer}</td>
        <td style="padding:10px 12px">
          <span style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:100px;background:${statusBg};color:${statusColor}">${statusLabel}</span>
        </td>
        <td style="padding:10px 12px">
          ${o.status === 'pending' ? `<button onclick="m3ProcessOrder('${o.id}')"
            style="font-size:12px;padding:5px 12px;border-radius:8px;background:#2D1E0F;color:#fff;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:600">
            Proses
          </button>` : ''}
        </td>
      </tr>`;
    }).join('');
  }

  function renderStock() {
    ['QP-250','QP-500'].forEach(sku => {
      const el = document.getElementById(`m3-central-${sku.replace('-','')}`);
      if (el) el.textContent = centralStock[sku];
    });
  }

  window.m3ProcessOrder = function (id) {
    if (processing) return;
    const order = orders.find(o => o.id === id);
    if (!order || order.status !== 'pending') return;
    processing = id;
    setTimeout(() => {
      if (centralStock[order.sku] >= order.qty) {
        centralStock[order.sku] -= order.qty;
        order.status = 'shipped';
      } else {
        order.status = 'failed';
      }
      processing = null;
      renderOrders(); renderStock();
    }, 700);
  };

  window.m3ProcessAll = function () {
    const pending = orders.filter(o => o.status === 'pending');
    pending.forEach((o, i) => {
      setTimeout(() => m3ProcessOrder(o.id), i * 600);
    });
  };

  window.m3Sync = function () {
    const btn = document.getElementById('m3-sync-btn');
    if (btn) { btn.textContent = '✓ Tersinkronisasi!'; btn.disabled = true; }
    synced = true;
    setTimeout(() => {
      if (btn) { btn.textContent = 'Sync ke Marketplace'; btn.disabled = false; }
      synced = false;
    }, 2000);
  };

  window.m3Reset = function () {
    orders = INIT_ORDERS.map(o => ({ ...o }));
    centralStock = { 'QP-250': 500, 'QP-500': 300 };
    processing = null; synced = false;
    renderOrders(); renderStock();
  };

  renderOrders(); renderStock();
};
