/* FUK COFFEE — 共通スクリプト（ヘッダー・カート・各ページの描画） */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const yen = n => '¥' + Math.round(n).toLocaleString('ja-JP');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const page = document.body.dataset.page;

/* ---------- 保存（ブラウザ内） ---------- */
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};

/* ---------- カート ---------- */
const cart = {
  items: () => store.get('fuk_cart', []).filter(i => PRODUCTS.some(p => p.id === i.id)),
  save(items) { store.set('fuk_cart', items); updateCartCount(); },
  add(id, qty = 1) {
    const items = cart.items();
    const hit = items.find(i => i.id === id);
    hit ? hit.qty = Math.min(99, hit.qty + qty) : items.push({ id, qty });
    cart.save(items);
  },
  setQty(id, qty) { cart.save(cart.items().map(i => i.id === id ? { ...i, qty } : i).filter(i => i.qty > 0)); },
  count: () => cart.items().reduce((s, i) => s + i.qty, 0),
  totals() {
    const sub = cart.items().reduce((s, i) => s + PRODUCTS.find(p => p.id === i.id).price * i.qty, 0);
    const ship = sub === 0 || sub >= SHIPPING.freeOver ? 0 : SHIPPING.fee;
    return { sub, ship, total: sub + ship };
  }
};
function updateCartCount() {
  $$('.cart-n').forEach(el => { const n = cart.count(); el.textContent = n; el.dataset.n = n; });
}

/* ---------- 見た目の部品 ---------- */
function bagHTML({ tone = 'white', gate = '01', name = 'FUK COFFEE', sub = 'DRIP BAG COFFEE' } = {}) {
  const len = [...name].length;
  const cls = len > 12 ? 'xlong' : len > 6 ? 'long' : '';
  return `<div class="bag ${tone}">
    <div class="bag-top"><span>FUK ✈<br>FUKUOKA<br>JAPAN</span><span style="text-align:right">GATE<br><b>${esc(gate)}</b></span></div>
    <div class="bag-name ${cls}">${esc(name)}</div>
    <div class="bag-sub">${esc(sub)}</div>
    <div class="bag-bar"></div>
    <div class="bag-foot"><span>HAVE A GOOD FLIGHT</span><span>10G</span></div>
  </div>`;
}
function visual(p) {
  if (p.img) return `<img src="${p.img}" alt="${esc(p.jp)}" loading="lazy">`;
  return `<div class="pv ${p.visual}"><div class="lbl"><b>FUK</b><i>COFFEE</i><u></u><s>${esc(p.code)}</s></div></div>`;
}
function cardHTML(p) {
  return `<article class="card rv">
    <a class="card-img" href="product.html?id=${p.id}">
      ${p.gate ? `<span class="gate">GATE ${p.gate}</span>` : ''}
      ${p.soon ? '<span class="badge">COMING SOON</span>' : ''}
      ${visual(p)}
    </a>
    <div class="card-body">
      <h3><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
      <p class="jp">${esc(p.jp)}</p>
      <p class="lead">${esc(p.lead)}</p>
      <div class="tags">${(p.tags || []).map(t => `<span>${esc(t)}</span>`).join('')}</div>
      <div class="card-foot">
        <span class="price">${yen(p.price)}<small>税込${p.provisional ? '・仮' : ''}</small></span>
        <button class="btn sm ${p.soon ? '' : 'ghost'}" data-add="${p.id}" ${p.soon ? 'disabled' : ''}>${p.soon ? '準備中' : 'カートに入れる'}</button>
      </div>
    </div>
  </article>`;
}

/* ---------- ヘッダー・フッター ---------- */
function chrome() {
  const on = k => page === k ? 'class="on"' : '';
  document.body.insertAdjacentHTML('afterbegin', `
  <header class="hd"><div class="hd-in">
    <a class="logo" href="index.html">FUK COFFEE<small>ROASTERY ✈ OEM</small></a>
    <button class="menu-btn" aria-label="メニュー"><span></span><span></span></button>
    <nav class="nav">
      <a href="index.html#oem" ${on('home')}>OEM</a>
      <a href="index.html#price">PRICE</a>
      <a href="index.html#flow">FLOW</a>
      <a href="shop.html" ${on('shop')}>ONLINE SHOP</a>
      <a class="cart-link" href="cart.html" aria-label="カート">CART <span class="cart-n" data-n="0">0</span></a>
      <a class="btn sm" href="oem-order.html">OEMの見積・注文</a>
    </nav>
  </div></header>`);
  document.body.insertAdjacentHTML('beforeend', `
  <footer class="ft"><div class="wrap">
    <div class="ft-in">
      <div><a class="logo" href="index.html">FUK COFFEE</a>
        <p>HAVE A GOOD FLIGHT<br>コーヒーの旅をあなたへ。</p>
        <p>運営会社　3レター株式会社<br>代表取締役社長　古館 伸二</p></div>
      <div><h4>OEM</h4><ul>
        <li><a href="index.html#oem">ドリップバッグOEM</a></li>
        <li><a href="index.html#price">料金の目安</a></li>
        <li><a href="index.html#flow">ご注文の流れ</a></li>
        <li><a href="oem-order.html">見積・注文フォーム</a></li></ul></div>
      <div><h4>ONLINE SHOP</h4><ul>
        <li><a href="shop.html?cat=dripbag">ドリップバッグ</a></li>
        <li><a href="shop.html?cat=beans">コーヒー豆</a></li>
        <li><a href="shop.html?cat=gift">ギフト</a></li>
        <li><a href="cart.html">カート</a></li></ul></div>
      <div><h4>SHOPS</h4><ul>
        <li>FUK COFFEE／Parks／Seaside</li><li>FUK COFFEE BASE／ROASTERY</li>
        <li>NGS COFFEE</li><li>OSA COFFEE／Minami／Parks</li><li>CAFE HAPJE</li></ul></div>
    </div>
    <p class="ft-note">※ 掲載している写真は、すべて仮のイメージ画像です。実際の商品とは異なります。</p>
    <div class="ft-bottom"><span>© 3LETTER Co.,Ltd.</span><span>FUK ✈ NGS ✈ OSA</span></div>
  </div></footer>
  <div class="toast" role="status"><span></span><a href="cart.html">CART →</a></div>`);
  $('.menu-btn').onclick = () => $('.nav').classList.toggle('open');
  updateCartCount();
}
let toastT;
function toast(msg) {
  const t = $('.toast'); $('span', t).textContent = msg; t.classList.add('on');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 3200);
}
function reveal() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.rv:not(.in)').forEach(el => io.observe(el));
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-add]');
  if (!b) return;
  const p = PRODUCTS.find(x => x.id === b.dataset.add);
  cart.add(p.id, Number(b.dataset.qty || 1));
  toast(`「${p.name}」をカートに入れました`);
});

/* ---------- OEMの金額計算（見積フォームとLPで共用） ---------- */
function oemCalc({ bean, gram, pack, lot }) {
  const b = OEM.beans.find(x => x.id === bean), g = OEM.grams.find(x => x.id === gram);
  const k = OEM.packs.find(x => x.id === pack), l = OEM.lots.find(x => x.qty === lot);
  const unit = l.unit + b.add + g.add + k.add;
  const setup = b.setup + k.setup;
  const goods = unit * lot;
  return { unit, setup, goods, total: goods + setup, b, g, k, l };
}

/* ---------- 送信（デモモード対応） ---------- */
async function submitData(kind, data) {
  const ref = (kind === 'oem' ? 'OEM' : 'FUK') + '-' + Date.now().toString(36).toUpperCase().slice(-6);
  const record = { ref, at: new Date().toISOString(), ...data };
  const url = ENDPOINT[kind];
  if (url) {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(record) });
    if (!res.ok) throw new Error('送信に失敗しました');
  } else {
    const key = kind === 'oem' ? 'fuk_oem_requests' : 'fuk_orders';
    store.set(key, [...store.get(key, []), record]);
  }
  return { ref, demo: !url };
}
function doneHTML({ ref, demo, title, msg, back = 'index.html', backLabel = 'トップへ戻る' }) {
  return `<div class="wrap"><div class="done">
    <div class="done-top"><span>BOARDING PASS</span><span>FUK ✈ YOU</span></div>
    <div class="done-body">
      <h1>${title}</h1><p>${msg}</p>
      <div class="ref">${ref}</div><p style="margin-top:0;font-size:12px;color:var(--mute)">受付番号（お問い合わせの際にお伝えください）</p>
      <a class="btn" href="${back}">${backLabel} <span class="arr">→</span></a>
      ${demo ? '<p class="demo-note">※ いまはデモモードです。内容はこのブラウザ内に保存されただけで、メール送信や決済は行われていません。</p>' : ''}
    </div></div></div>`;
}

/* =================== ページごとの処理 =================== */
chrome();

if (page === 'home') {
  // 料金ボード
  $('#boardRows').innerHTML = OEM.lots.map((l, i) => `<tr>
    <td class="big">${l.qty.toLocaleString()}<small>袋</small></td>
    <td class="big">${yen(l.unit)}<small>/袋〜</small></td>
    <td class="hide-sp">${yen(l.unit * l.qty)}〜</td>
    <td>${i === 0 ? '<span class="st">小ロット</span>' : i === OEM.lots.length - 1 ? '<span class="st">最安単価</span>' : 'ON TIME'}</td></tr>`).join('');
  $$('[data-min-lot]').forEach(e => e.textContent = OEM.lots[0].qty);
  $$('[data-min-unit]').forEach(e => e.textContent = OEM.lots.at(-1).unit);
  $$('[data-lead]').forEach(e => e.textContent = OEM.leadTime);
  $('#choiceBeans').innerHTML = OEM.beans.map(b => `<li><span>${b.label}</span><span>${b.code}</span></li>`).join('');
  $('#choicePack').innerHTML = OEM.packs.map(k => `<li><span>${k.label}</span><span>${k.min.toLocaleString()}袋〜</span></li>`).join('');
  $('#choiceLot').innerHTML = OEM.lots.map(l => `<li><span>${l.qty.toLocaleString()}袋</span><span>${yen(l.unit)}/袋〜</span></li>`).join('');
  $('#sampleGrid').innerHTML = PRODUCTS.filter(p => p.cat === 'dripbag' && !p.soon).map(cardHTML).join('');
}

if (page === 'shop') {
  let cat = new URLSearchParams(location.search).get('cat') || 'all';
  const draw = () => {
    $('#filters').innerHTML = CATEGORIES.map(c => `<button class="chip ${c.id === cat ? 'on' : ''}" data-cat="${c.id}">${c.label}<small>${c.jp}</small></button>`).join('');
    $('#shopGrid').innerHTML = PRODUCTS.filter(p => cat === 'all' || p.cat === cat).map(cardHTML).join('');
    reveal();
  };
  $('#filters').onclick = e => { const b = e.target.closest('[data-cat]'); if (b) { cat = b.dataset.cat; history.replaceState(null, '', cat === 'all' ? 'shop.html' : '?cat=' + cat); draw(); } };
  draw();
}

if (page === 'product') {
  const p = PRODUCTS.find(x => x.id === new URLSearchParams(location.search).get('id')) || PRODUCTS[0];
  document.title = `${p.name}｜FUK COFFEE ONLINE SHOP`;
  let q = 1;
  $('#pd').innerHTML = `
    <div class="pd-img">${visual(p)}</div>
    <div>
      <p class="mono" style="font-size:11px;color:var(--mute)"><a href="shop.html">ONLINE SHOP</a> / ${p.gate ? 'GATE ' + p.gate : esc(p.code)}</p>
      <h1>${esc(p.name)}</h1><p class="jp">${esc(p.jp)}｜${esc(p.unit)}</p>
      <p class="lead">${esc(p.lead)}</p><p class="desc">${esc(p.desc)}</p>
      <div class="tags">${(p.tags || []).map(t => `<span>${esc(t)}</span>`).join('')}</div>
      <span class="price">${yen(p.price)}<small>税込${p.provisional ? '（仮の価格）' : ''}</small></span>
      <div class="buy">
        <div class="qty"><button data-q="-1" aria-label="減らす">−</button><span id="q">1</span><button data-q="1" aria-label="増やす">＋</button></div>
        <button class="btn" id="addBtn" data-add="${p.id}" data-qty="1" ${p.soon ? 'disabled' : ''}>${p.soon ? '準備中です' : 'カートに入れる'} <span class="arr">→</span></button>
      </div>
      <dl class="spec">${p.spec.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
      ${p.cat === 'dripbag' ? `<div class="oem-hook"><div><b>この味を、あなたの店の名前で。</b><span>ドリップバッグのOEM製造を${OEM.lots[0].qty}袋から承ります。</span></div><a class="btn light sm" href="oem-order.html">OEMの見積へ <span class="arr">→</span></a></div>` : ''}
    </div>`;
  $('#pd').addEventListener('click', e => {
    const b = e.target.closest('[data-q]'); if (!b) return;
    q = Math.max(1, Math.min(99, q + Number(b.dataset.q)));
    $('#q').textContent = q; $('#addBtn').dataset.qty = q;
  });
  $('#related').innerHTML = PRODUCTS.filter(x => x.id !== p.id && !x.soon).slice(0, 4).map(cardHTML).join('');
}

if (page === 'cart') {
  const root = $('#cartRoot');
  const draw = () => {
    const items = cart.items();
    if (!items.length) {
      root.innerHTML = `<div class="empty"><p>カートは空です。</p><a class="btn" href="shop.html">商品を見る <span class="arr">→</span></a></div>`;
      return;
    }
    const t = cart.totals();
    $('#cartList').innerHTML = items.map(i => {
      const p = PRODUCTS.find(x => x.id === i.id);
      return `<div class="ci"><a class="ci-img" href="product.html?id=${p.id}">${visual(p)}</a>
        <div><h3>${esc(p.name)}</h3><p class="jp">${esc(p.unit)}｜${yen(p.price)}</p></div>
        <div class="ci-r"><div class="qty sm"><button data-id="${p.id}" data-d="-1" aria-label="減らす">−</button><span>${i.qty}</span><button data-id="${p.id}" data-d="1" aria-label="増やす">＋</button></div>
          <span class="price" style="font-size:22px">${yen(p.price * i.qty)}</span><button class="rm" data-id="${p.id}" data-d="x">削除</button></div></div>`;
    }).join('');
    $('#sumBox').innerHTML = `
      <div><dt>小計</dt><dd>${yen(t.sub)}</dd></div>
      <div><dt>送料${t.ship ? '' : '（無料）'}</dt><dd>${yen(t.ship)}</dd></div>
      <div class="total"><dt>合計（税込）</dt><dd>${yen(t.total)}</dd></div>`;
    $('#shipNote').textContent = t.ship ? `あと ${yen(SHIPPING.freeOver - t.sub)} で送料無料` : '送料無料でお届けします';
  };
  $('#cartList').addEventListener('click', e => {
    const b = e.target.closest('[data-d]'); if (!b) return;
    const cur = cart.items().find(i => i.id === b.dataset.id);
    cart.setQty(b.dataset.id, b.dataset.d === 'x' ? 0 : Math.min(99, cur.qty + Number(b.dataset.d)));
    draw();
  });
  $('#orderForm').addEventListener('submit', async e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    const btn = $('#orderBtn'); btn.disabled = true;
    try {
      const r = await submitData('order', { customer: f, items: cart.items(), totals: cart.totals() });
      cart.save([]);
      $('main').innerHTML = doneHTML({ ...r, title: 'Thank you', msg: 'ご注文を受け付けました。確認のご連絡をお送りします。<br>コーヒーの旅を、どうぞお楽しみください。', back: 'shop.html', backLabel: 'ショップへ戻る' });
      scrollTo(0, 0);
    } catch (err) { btn.disabled = false; $('#orderErr').textContent = err.message; $('#orderErr').classList.add('on'); }
  });
  draw();
}

reveal();
