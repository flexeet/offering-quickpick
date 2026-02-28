window.initDemoM4 = function () {
  const KB = {
    harga:     'Harga produk Quick Pick:\n• QP-250 (250ml): Rp 28.000\n• QP-500 (500ml): Rp 48.000\n• Bundle 2×250ml: Rp 52.000 (hemat Rp 4.000!)',
    caraPakai: 'Cara pakai Quick Pick:\n1. Kocok botol terlebih dahulu\n2. Semprotkan ke area yang ingin dibersihkan\n3. Diamkan 30 detik\n4. Lap dengan kain bersih\n\nAman untuk semua permukaan keras 💪',
    beda:      'Perbedaan QP-250 vs QP-500:\n• QP-250: Ukuran praktis, cocok untuk sehari-hari\n• QP-500: Lebih hemat, untuk rumah tangga rutin\n\nRekomendasi: QP-500 lebih worth it untuk pemakaian reguler!',
    pengiriman:'Info pengiriman:\n• Order via WhatsApp langsung ke tim kami\n• Pengiriman via ekspedisi pilihan customer\n• Proses setiap hari kerja pukul 08.00–16.00 WIB',
    aman:      'Quick Pick aman untuk:\n✅ Lantai keramik & granit\n✅ Meja kayu & melamin\n✅ Kaca & cermin\n✅ Peralatan dapur\n\n❌ Hindari bahan kain & kulit',
    stok:      'Stok produk Quick Pick tersedia. Untuk pemesanan, silakan hubungi kami via WhatsApp ini ya! Tim kami akan bantu proses ordernya 😊',
  };

  const SUGGESTIONS = {
    customer: ['Berapa harganya?', 'Cara pakainya gimana?', 'Bedanya QP-250 vs QP-500?', 'Info pengiriman'],
    cs:       ['Cek template jawaban stok', 'Eskalasi ke tim', 'Cek SOP retur', 'Lihat FAQ produk'],
  };

  let messages = [{ from:'bot', text:'Halo! Saya asisten Quick Pick 👋 Ada yang bisa saya bantu? Mau tanya soal produk, cara pakai, atau info pengiriman?' }];
  let mode = 'customer';
  let typing = false;

  function getReply(msg) {
    const m = msg.toLowerCase();
    if (m.includes('harga') || m.includes('berapa'))                           return KB.harga;
    if (m.includes('cara') || m.includes('pakai') || m.includes('penggunaan')) return KB.caraPakai;
    if (m.includes('beda') || m.includes('250') || m.includes('500') || m.includes('mana')) return KB.beda;
    if (m.includes('kirim') || m.includes('ongkir') || m.includes('pengiriman')) return KB.pengiriman;
    if (m.includes('aman') || m.includes('bahan') || m.includes('efek'))        return KB.aman;
    if (m.includes('stok') || m.includes('tersedia') || m.includes('ada'))      return KB.stok;
    if (m.includes('komplain') || m.includes('rusak') || m.includes('retur'))   return 'Mohon maaf atas ketidaknyamanannya! Saya akan eskalasikan ke tim CS kami segera. Bisa minta nomor pesanannya? 🙏';
    if (mode === 'cs') return 'Template & SOP tersedia di knowledge base. Pilih topik spesifik untuk saya bantu susunkan jawabannya.';
    return 'Makasih sudah tanya! Untuk pertanyaan ini saya perlu eskalasikan ke tim CS kami. Mereka akan balas dalam 1–2 jam kerja. Ada yang lain? 😊';
  }

  function renderMessages() {
    const el = document.getElementById('chat-messages');
    if (!el) return;
    el.innerHTML = messages.map(m => `
      <div style="display:flex;justify-content:${m.from==='user'?'flex-end':'flex-start'};gap:8px;align-items:flex-end">
        ${m.from==='bot' ? `<div style="width:28px;height:28px;border-radius:50%;background:#312e81;display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <i data-lucide="bot" style="width:14px;height:14px;color:#fff"></i>
        </div>` : ''}
        <div style="max-width:75%;padding:10px 14px;border-radius:${m.from==='user'?'16px 4px 16px 16px':'4px 16px 16px 16px'};background:${m.from==='user'?'#312e81':'#fff'};color:${m.from==='user'?'#fff':'#2D1E0F'};font-size:13px;line-height:1.6;box-shadow:0 1px 4px rgba(0,0,0,.08);white-space:pre-line">${m.text}</div>
      </div>`).join('');

    if (typing) {
      el.innerHTML += `<div style="display:flex;align-items:center;gap:8px">
        <div style="width:28px;height:28px;border-radius:50%;background:#312e81;display:flex;align-items:center;justify-content:center">
          <i data-lucide="bot" style="width:14px;height:14px;color:#fff"></i>
        </div>
        <div style="background:#fff;padding:10px 14px;border-radius:4px 16px 16px 16px;box-shadow:0 1px 4px rgba(0,0,0,.08)">
          <div style="display:flex;gap:4px"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
        </div>
      </div>`;
    }
    el.scrollTop = el.scrollHeight;
    if (window.lucide) lucide.createIcons();
  }

  function renderSuggestions() {
    const el = document.getElementById('m4-suggestions');
    if (!el) return;
    el.innerHTML = SUGGESTIONS[mode].map(s =>
      `<button onclick="m4Send('${s}')" style="font-size:12px;padding:5px 12px;border-radius:100px;border:1px solid #C7D2FE;background:#EEF2FF;color:#4338CA;cursor:pointer;font-family:'DM Sans',sans-serif;white-space:nowrap">${s}</button>`
    ).join('');
  }

  window.m4Send = function (text) {
    const input = document.getElementById('m4-input');
    const msg = text || (input ? input.value.trim() : '');
    if (!msg || typing) return;
    if (input) input.value = '';
    messages.push({ from:'user', text:msg });
    typing = true;
    renderMessages();
    setTimeout(() => {
      messages.push({ from:'bot', text: getReply(msg) });
      typing = false;
      renderMessages();
    }, 900 + Math.random() * 600);
  };

  window.m4SetMode = function (m) {
    mode = m;
    const welcome = m === 'customer'
      ? 'Halo! Saya asisten Quick Pick 👋 Ada yang bisa saya bantu?'
      : 'Halo tim CS! Saya siap bantu dengan template jawaban dan SOP. Butuh apa?';
    messages = [{ from:'bot', text: welcome }];
    ['customer','cs'].forEach(k => {
      const btn = document.getElementById(`m4-mode-${k}`);
      if (btn) {
        btn.style.background = k === m ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.15)';
        btn.style.color      = k === m ? '#312e81' : 'rgba(255,255,255,.8)';
      }
    });
    renderMessages(); renderSuggestions();
  };

  // Enter key on input
  const input = document.getElementById('m4-input');
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') m4Send(); });

  renderMessages(); renderSuggestions();
};

window.initDemo = function () {
  const tabs = document.querySelectorAll('.demo-tab');
  const panels = document.querySelectorAll('.demo-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => {
        t.classList.remove('active');
        t.style.background = 'transparent';
        t.style.color = '#7A6A5A';
      });
      tab.classList.add('active');
      tab.style.background = tab.dataset.color;
      tab.style.color = '#fff';
      panels.forEach(p => p.style.display = p.id === `panel-${target}` ? 'block' : 'none');
    });
  });
  if (tabs[0]) tabs[0].click();
};
