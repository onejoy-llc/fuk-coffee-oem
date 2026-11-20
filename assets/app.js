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
const SHOP = PRODUCTS.filter(p => !p.hidden);               // 公開中の商品
const findP = id => SHOP.find(p => p.id === id);
const keyOf = i => i.id + '::' + (i.opt || '');
const cart = {
  items: () => store.get('fuk_cart', []).filter(i => findP(i.id)),
  save(items) { store.set('fuk_cart', items); updateCartCount(); },
  add(id, qty = 1, opt = '') {
    const items = cart.items();
    const hit = items.find(i => keyOf(i) === keyOf({ id, opt }));
    hit ? hit.qty = Math.min(99, hit.qty + qty) : items.push({ id, opt, qty });
    cart.save(items);
  },
  setQty(key, qty) { cart.save(cart.items().map(i => keyOf(i) === key ? { ...i, qty } : i).filter(i => i.qty > 0)); },
  count: () => cart.items().reduce((s, i) => s + i.qty, 0),
  totals() {
    const sub = cart.items().reduce((s, i) => s + findP(i.id).price * i.qty, 0);
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
  return `<img src="${esc(p.img)}" alt="${esc(p.jp)}" loading="lazy">`;
}
function cardHTML(p) {
  const hasOpt = (p.options || []).length > 0;
  const btn = p.soon ? '<button class="btn sm" disabled>準備中</button>'
    : hasOpt ? `<a class="btn sm ghost" href="product.html?id=${p.id}">種類を選ぶ</a>`
    : `<button class="btn sm ghost" data-add="${p.id}">カートに入れる</button>`;
  return `<article class="card rv">
    <a class="card-img" href="product.html?id=${p.id}">
      ${p.soon ? '<span class="badge">準備中</span>' : ''}
      ${visual(p)}
    </a>
    <div class="card-body">
      <h3><a href="product.html?id=${p.id}">${esc(p.jp)}</a></h3>
      <p class="jp">${esc(p.name)}</p>
      <p class="lead">${esc(p.lead)}</p>
      <div class="tags">${(p.tags || []).map(t => `<span>${esc(t)}</span>`).join('')}</div>
      <div class="card-foot">
        <span class="price">${yen(p.price)}<small>税込</small></span>
        ${btn}
      </div>
    </div>
  </article>`;
}
function lineupHTML(d) {
  return `<article class="card rv">
    <div class="card-img cut">
      <span class="gate">GATE ${d.gate}</span>
      ${d.soon ? '<span class="badge">準備中</span>' : ''}
      <img src="${d.img}" alt="${esc(d.name)}" loading="lazy">
    </div>
    <div class="card-body">
      <h3>${esc(d.name)}</h3>
      <p class="jp">${esc(d.roast)}</p>
      <p class="lead">${esc(d.desc)}</p>
      <div class="tags">${d.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
    </div>
  </article>`;
}

/* ---------- ヘッダー・フッター ---------- */
function chrome() {
  const on = k => page === k ? 'class="on"' : '';
  document.body.insertAdjacentHTML('afterbegin', `
  <header class="hd"><div class="hd-in">
    <a class="logo" href="index.html">FUK COFFEE<small>DRIP BAG OEM</small></a>
    <button class="menu-btn" aria-label="メニュー"><span></span><span></span></button>
    <nav class="nav">
      <a href="index.html#oem" ${on('home')}>OEM製造</a>
      <a href="index.html#choose">選べる内容</a>
      <a href="index.html#price">料金</a>
      <a href="index.html#flow">ご注文の流れ</a>
      <a href="shop.html" ${on('shop')}>オンラインショップ</a>
      <a class="cart-link" href="cart.html" aria-label="カート">カート <span class="cart-n" data-n="0">0</span></a>
      <a class="btn sm" href="oem-order.html">お見積り・ご注文</a>
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
        <li><a href="shop.html?cat=coffee">コーヒー豆</a></li>
        <li><a href="shop.html?cat=gift">ギフト</a></li>
        <li><a href="shop.html?cat=goods">グッズ・アパレル</a></li>
        <li><a href="cart.html">カート</a></li></ul></div>
      <div><h4>SHOPS</h4><ul>
        <li>FUK COFFEE／Parks／Seaside</li><li>FUK COFFEE BASE／ROASTERY</li>
        <li>NGS COFFEE</li><li>OSA COFFEE／Minami／Parks</li><li>CAFE HAPJE</li></ul></div>
    </div>
    <p class="ft-note">※ 掲載している写真は、すべて仮のイメージ画像です。実際の商品とは異なります。</p>
    <div class="ft-bottom"><span>© 3LETTER Co.,Ltd.</span><span>FUK ✈ NGS ✈ OSA　<a href="admin.html" style="text-decoration:underline">ADMIN</a></span></div>
  </div></footer>
  <div class="toast" role="status"><span></span><a href="cart.html">カートを見る</a></div>`);
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
  const p = findP(b.dataset.add);
  cart.add(p.id, Number(b.dataset.qty || 1), b.dataset.opt || '');
  toast('カートに入れました');
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
  const record = { ref, at: new Date().toISOString(), status: '新規', ...data };
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
      <div class="ref">${ref}</div><p style="margin-top:4px;font-size:12px;color:var(--mute)">受付番号（お問い合わせの際にお伝えください）</p>
      <a class="btn" href="${back}">${backLabel} <span class="arr">→</span></a>
      ${demo ? '<p class="demo-note">※ いまはデモモードです。内容はこのブラウザ内に保存されただけで、メール送信や決済は行われていません。</p>' : ''}
    </div></div></div>`;
}

/* =================== ページごとの処理 =================== */
chrome();

if (page === 'home') {
  // ヒーロー動画：読み込めたらふわっと表示し、ループの切れ目もフェードでつなぐ
  const hv = $('.hero-video');
  if (hv) {
    const show = () => hv.classList.add('on');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { hv.removeAttribute('autoplay'); hv.pause(); hv.addEventListener('loadeddata', show); }
    else { hv.addEventListener('playing', show, { once: true }); hv.play().catch(() => hv.addEventListener('loadeddata', show)); }
    hv.addEventListener('timeupdate', () => {
      if (!hv.duration) return;
      hv.classList.toggle('out', hv.currentTime > hv.duration - 0.7 || hv.currentTime < 0.08);
    });
    $('.hero').classList.add('ready');
    // 念のための保険：演出が進まない環境でも、文字と動画は必ず表示する
    setTimeout(() => $('.hero').classList.add('shown'), 2600);
    setTimeout(() => { if (hv.classList.contains('on') && getComputedStyle(hv).opacity < 0.5) hv.classList.add('instant'); }, 4200);
  }
  const sign = n => n === 0 ? '基本料金' : (n > 0 ? '+' : '−') + '¥' + Math.abs(n) + '／袋';
  const tones = ['#a58b6f', '#7a5b45', '#b0734a', '#4a3a31'];
  const short = { 'fuk-blend': 'FUKのブレンド', 'fuk-single': 'シングルオリジン', bring: '豆の持ち込み', original: 'オリジナル開発' };
  const swatch = { white: '#fafaf7', black: '#151514', kraft: '#c9a97c' };
  $('#pickBeans').innerHTML = OEM.beans.map((b, i) => `<div class="pick">
    <div class="tile" style="background:${tones[i % tones.length]}">${short[b.id] || esc(b.label)}</div>
    <h3>${esc(b.label)}</h3><p>${esc(b.note)}</p>
    <span class="p">${sign(b.add)}${b.setup ? '・初期費用 ' + yen(b.setup) : ''}</span></div>`).join('');
  $('#pickPacks').innerHTML = OEM.packs.map(k => `<div class="pick">
    <img src="assets/img/pack-${k.id}.jpg" alt="${esc(k.label)}" loading="lazy" onerror="this.remove()">
    <h3>${esc(k.label)}</h3><p>${esc(k.note)}</p>
    <span class="p">${sign(k.add)}${k.setup ? '・初期費用 ' + yen(k.setup) : ''}</span></div>`).join('');
  $('#pickColors').innerHTML = '<b>袋の色：</b>' + OEM.colors.map(c => `<span><i class="sw" style="background:${swatch[c.id] || '#ddd'}"></i>${esc(c.label)}</span>`).join('');
  $('#boardRows').innerHTML = OEM.lots.map((l, i) => `<tr>
    <td class="big">${l.qty.toLocaleString()}<small>袋</small></td>
    <td class="big">${yen(l.unit)}<small>〜</small></td>
    <td class="hide-sp">${yen(l.unit * l.qty)}〜</td>
    <td>${i === 0 ? '<span class="st">小ロット</span>' : i === OEM.lots.length - 1 ? '<span class="st">いちばんお得</span>' : ''}</td></tr>`).join('');
  $$('[data-min-lot]').forEach(e => e.textContent = OEM.lots[0].qty);
  $$('[data-min-unit]').forEach(e => e.textContent = OEM.lots.at(-1).unit);
  $$('[data-lead]').forEach(e => e.textContent = OEM.leadTime);
  $('#lineupGrid').innerHTML = DRIPBAGS.map(lineupHTML).join('');
  $('#sampleGrid').innerHTML = SHOP.filter(p => (p.tags || []).includes('ドリップバッグ')).map(cardHTML).join('');
}

if (page === 'shop') {
  let cat = new URLSearchParams(location.search).get('cat') || 'all';
  const draw = () => {
    $('#filters').innerHTML = CATEGORIES.map(c => `<button class="chip ${c.id === cat ? 'on' : ''}" data-cat="${c.id}">${c.jp}</button>`).join('');
    $('#shopGrid').innerHTML = SHOP.filter(p => cat === 'all' || p.cat === cat).map(cardHTML).join('') || '<p style="color:var(--mute)">このカテゴリの商品は準備中です。</p>';
    reveal();
  };
  $('#filters').onclick = e => { const b = e.target.closest('[data-cat]'); if (b) { cat = b.dataset.cat; history.replaceState(null, '', cat === 'all' ? 'shop.html' : '?cat=' + cat); draw(); } };
  draw();
}

if (page === 'product') {
  const p = findP(new URLSearchParams(location.search).get('id')) || SHOP[0];
  document.title = `${p.jp}｜FUK COFFEE オンラインショップ`;
  const opts = p.options || [];
  const catLabel = (CATEGORIES.find(c => c.id === p.cat) || {}).jp || '';
  let q = 1;
  $('#pd').innerHTML = `
    <div class="pd-img">${visual(p)}</div>
    <div>
      <p class="crumbs"><a href="shop.html">オンラインショップ</a> ／ <a href="shop.html?cat=${p.cat}">${catLabel}</a></p>
      <h1>${esc(p.jp)}</h1><p class="jp">${esc(p.name)}</p>
      <p class="lead">${esc(p.lead)}</p><p class="desc">${esc(p.desc)}</p>
      <div class="tags">${(p.tags || []).map(t => `<span>${esc(t)}</span>`).join('')}</div>
      <span class="price">${yen(p.price)}<small>税込｜${esc(p.unit)}</small></span>
      ${opts.length ? `<label class="fld" style="margin:0 0 14px"><span>種類を選ぶ</span><select id="opt">${opts.map(o => `<option>${esc(o)}</option>`).join('')}</select></label>` : ''}
      <div class="buy">
        <div class="qty"><button data-q="-1" aria-label="減らす">−</button><span id="q">1</span><button data-q="1" aria-label="増やす">＋</button></div>
        <button class="btn accent" id="addBtn" data-add="${p.id}" data-qty="1" data-opt="${esc(opts[0] || '')}" ${p.soon ? 'disabled' : ''}>${p.soon ? '準備中です' : 'カートに入れる'} <span class="arr">→</span></button>
      </div>
      ${(p.spec || []).length ? `<dl class="spec">${p.spec.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
      ${['coffee', 'gift'].includes(p.cat) ? `<div class="oem-hook"><div><b>このコーヒーを、あなたのお店の名前で。</b><span>ドリップバッグのOEM製造を${OEM.lots[0].qty}袋から承ります。</span></div><a class="btn light sm" href="oem-order.html">OEMの見積へ <span class="arr">→</span></a></div>` : ''}
    </div>`;
  $('#pd').addEventListener('click', e => {
    const b = e.target.closest('[data-q]'); if (!b) return;
    q = Math.max(1, Math.min(99, q + Number(b.dataset.q)));
    $('#q').textContent = q; $('#addBtn').dataset.qty = q;
  });
  $('#pd').addEventListener('change', e => { if (e.target.id === 'opt') $('#addBtn').dataset.opt = e.target.value; });
  $('#related').innerHTML = SHOP.filter(x => x.id !== p.id && !x.soon && x.cat === p.cat).concat(SHOP.filter(x => x.cat !== p.cat && !x.soon)).slice(0, 4).map(cardHTML).join('');
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
      const p = findP(i.id), k = esc(keyOf(i));
      return `<div class="ci"><a class="ci-img" href="product.html?id=${p.id}">${visual(p)}</a>
        <div><h3>${esc(p.jp)}</h3><p class="jp">${i.opt ? esc(i.opt) + '｜' : ''}${esc(p.unit)}｜${yen(p.price)}</p></div>
        <div class="ci-r"><div class="qty sm"><button data-id="${k}" data-d="-1" aria-label="減らす">−</button><span>${i.qty}</span><button data-id="${k}" data-d="1" aria-label="増やす">＋</button></div>
          <span class="price" style="font-size:22px">${yen(p.price * i.qty)}</span><button class="rm" data-id="${k}" data-d="x">削除</button></div></div>`;
    }).join('');
    $('#sumBox').innerHTML = `
      <div><dt>小計</dt><dd>${yen(t.sub)}</dd></div>
      <div><dt>送料${t.ship ? '' : '（無料）'}</dt><dd>${yen(t.ship)}</dd></div>
      <div class="total"><dt>合計（税込）</dt><dd>${yen(t.total)}</dd></div>`;
    $('#shipNote').textContent = t.ship ? `あと ${yen(SHIPPING.freeOver - t.sub)} で送料無料` : '送料無料でお届けします';
  };
  $('#cartList').addEventListener('click', e => {
    const b = e.target.closest('[data-d]'); if (!b) return;
    const cur = cart.items().find(i => keyOf(i) === b.dataset.id);
    cart.setQty(b.dataset.id, b.dataset.d === 'x' ? 0 : Math.min(99, cur.qty + Number(b.dataset.d)));
    draw();
  });
  $('#orderForm').addEventListener('submit', async e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    const btn = $('#orderBtn'); btn.disabled = true;
    try {
      const r = await submitData('order', { customer: f, items: cart.items().map(i => ({ ...i, name: findP(i.id).jp, price: findP(i.id).price })), totals: cart.totals() });
      cart.save([]);
      $('main').innerHTML = doneHTML({ ...r, title: 'ご注文ありがとうございます', msg: 'ご注文を受け付けました。確認のご連絡をお送りします。', back: 'shop.html', backLabel: 'ショップへ戻る' });
      scrollTo(0, 0);
    } catch (err) { btn.disabled = false; $('#orderErr').textContent = err.message; $('#orderErr').classList.add('on'); }
  });
  draw();
}

reveal();
