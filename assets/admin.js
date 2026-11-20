/* FUK COFFEE — 管理画面（デモ版：データはこのブラウザ内に保存） */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const yen = n => '¥' + Math.round(n || 0).toLocaleString('ja-JP');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clone = o => JSON.parse(JSON.stringify(o));
  const day = iso => { const d = new Date(iso); return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
  const ls = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
  };

  /* ---------- データ ---------- */
  let data = clone({ products: PRODUCTS, oem: OEM, shipping: SHIPPING });
  const saveData = msg => { ls.set('fuk_admin_data', data); toast(msg || '保存しました'); };
  const orders = () => ls.get('fuk_orders', []);
  const oems = () => ls.get('fuk_oem_requests', []);
  const ORDER_ST = ['新規', '入金待ち', '発送準備中', '発送済み', 'キャンセル'];
  const OEM_ST = ['新規', '見積送付済み', 'サンプル確認中', '製造中', '納品済み', '見送り'];
  const CATS = CATEGORIES.filter(c => c.id !== 'all');

  let tT;
  function toast(m) { const t = $('.toast'); $('span', t).textContent = m; t.classList.add('on'); clearTimeout(tT); tT = setTimeout(() => t.classList.remove('on'), 2600); }

  /* ---------- 画面の切り替え ---------- */
  let tab = location.hash.slice(1) || 'dash';
  const open = {};   // 開いている詳細行
  $('#tabs').onclick = e => { const b = e.target.closest('[data-tab]'); if (b) go(b.dataset.tab); };
  function go(t) { tab = t; history.replaceState(null, '', '#' + t); render(); scrollTo(0, 0); }
  function render() {
    if (!views[tab]) tab = 'dash';
    $$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
    const nO = orders().filter(o => (o.status || '新規') === '新規').length, nE = oems().filter(o => (o.status || '新規') === '新規').length;
    $('#nOrders').textContent = nO || ''; $('#nOem').textContent = nE || '';
    $('#view').innerHTML = views[tab]();
  }
  const stSelect = (kind, ref, cur, list) =>
    `<select data-st="${kind}" data-ref="${ref}">${list.map(s => `<option ${s === (cur || '新規') ? 'selected' : ''}>${s}</option>`).join('')}</select>`;

  /* ---------- 各画面 ---------- */
  const oemSpec = s => {
    const b = data.oem.beans.find(x => x.id === s.bean), k = data.oem.packs.find(x => x.id === s.pack);
    const c = data.oem.colors.find(x => x.id === s.color), g = data.oem.grams.find(x => x.id === s.gram);
    return `${b ? b.label : s.bean}／${c ? c.label : ''}・${k ? k.label : s.pack}・${g ? g.label : ''}`;
  };
  const views = {
    dash() {
      const o = orders(), e = oems();
      const sales = o.filter(x => x.status !== 'キャンセル').reduce((s, x) => s + (x.totals?.total || 0), 0);
      const pipe = e.filter(x => x.status !== '見送り').reduce((s, x) => s + (x.estimate?.total || 0), 0);
      return `<h1>Dashboard</h1><p class="h-sub">いまの状況をまとめて確認できます。</p>
      <dl class="stats">
        <div class="stat"><dt>ショップの注文</dt><dd>${o.length}<small>件</small></dd></div>
        <div class="stat"><dt>ショップの売上</dt><dd>${yen(sales)}</dd></div>
        <div class="stat"><dt>OEMの依頼</dt><dd>${e.length}<small>件</small></dd></div>
        <div class="stat"><dt>OEMの概算合計</dt><dd>${yen(pipe)}</dd></div>
      </dl>
      ${!o.length && !e.length ? `<div class="none" style="margin-top:28px">まだ注文も依頼もありません。<br>画面の動きを確かめるために、サンプルのデータを入れることができます。<br><button class="btn sm" data-act="seed">サンプルデータを入れる</button></div>` : `
      <h2>最近のOEM依頼 <a class="lnk" data-go="oem">すべて見る</a></h2>
      ${e.length ? `<div class="scroll-x"><table class="tbl"><tbody>${e.slice(-4).reverse().map(x => `<tr><td class="ref">${x.ref}</td><td>${esc(x.customer.company)}<small>${esc(x.customer.biz || '')}</small></td><td>${(x.spec.lot || 0).toLocaleString()}袋</td><td class="num">${yen(x.estimate?.total)}</td><td><span class="pill ${(x.status || '新規') === '新規' ? 'soon' : ''}">${x.status || '新規'}</span></td></tr>`).join('')}</tbody></table></div>` : '<div class="none">まだありません。</div>'}
      <h2>最近の注文 <a class="lnk" data-go="orders">すべて見る</a></h2>
      ${o.length ? `<div class="scroll-x"><table class="tbl"><tbody>${o.slice(-4).reverse().map(x => `<tr><td class="ref">${x.ref}</td><td>${esc(x.customer.name)}<small>${day(x.at)}</small></td><td>${x.items.reduce((s, i) => s + i.qty, 0)}点</td><td class="num">${yen(x.totals?.total)}</td><td><span class="pill ${(x.status || '新規') === '新規' ? 'soon' : ''}">${x.status || '新規'}</span></td></tr>`).join('')}</tbody></table></div>` : '<div class="none">まだありません。</div>'}`}`;
    },

    orders() {
      const list = orders().slice().reverse();
      return `<h1>Orders</h1><p class="h-sub">オンラインショップの注文です。状況を選ぶとすぐ保存されます。</p>
      ${list.length ? `<div class="scroll-x"><table class="tbl"><thead><tr><th>受付番号</th><th>日時</th><th>お客様</th><th>点数</th><th>合計</th><th>支払い</th><th>状況</th><th></th></tr></thead><tbody>
      ${list.map(x => `<tr><td class="ref">${x.ref}</td><td>${day(x.at)}</td><td>${esc(x.customer.name)}<small>${esc(x.customer.pref || '')}</small></td>
        <td>${x.items.reduce((s, i) => s + i.qty, 0)}点</td><td class="num">${yen(x.totals?.total)}</td><td>${x.customer.pay === 'bank' ? '銀行振込' : 'カード'}</td>
        <td>${stSelect('fuk_orders', x.ref, x.status, ORDER_ST)}</td><td><a class="lnk" data-open="${x.ref}">${open[x.ref] ? '閉じる' : '詳細'}</a></td></tr>
        ${open[x.ref] ? `<tr class="detail"><td colspan="8"><dl>
          <dt>商品</dt><dd>${x.items.map(i => `${esc(i.name || i.id)}${i.opt ? '（' + esc(i.opt) + '）' : ''} × ${i.qty}`).join('<br>')}</dd>
          <dt>金額</dt><dd>小計 ${yen(x.totals.sub)}／送料 ${yen(x.totals.ship)}／合計 ${yen(x.totals.total)}</dd>
          <dt>お届け先</dt><dd>〒${esc(x.customer.zip)} ${esc(x.customer.pref)}${esc(x.customer.address)}</dd>
          <dt>連絡先</dt><dd>${esc(x.customer.email)}／${esc(x.customer.tel)}</dd>
          <dt>備考</dt><dd>${esc(x.customer.note) || '—'}</dd></dl>
          <p style="margin-top:8px"><a class="lnk del" data-del="fuk_orders" data-ref="${x.ref}">この注文を削除</a></p></td></tr>` : ''}`).join('')}
      </tbody></table></div>` : '<div class="none">まだ注文はありません。</div>'}`;
    },

    oem() {
      const list = oems().slice().reverse();
      return `<h1>OEM requests</h1><p class="h-sub">OEMの見積・注文の依頼です。</p>
      ${list.length ? `<div class="scroll-x"><table class="tbl"><thead><tr><th>受付番号</th><th>日時</th><th>会社・店舗</th><th>種類</th><th>ロット</th><th>概算</th><th>状況</th><th></th></tr></thead><tbody>
      ${list.map(x => `<tr><td class="ref">${x.ref}</td><td>${day(x.at)}</td><td>${esc(x.customer.company)}<small>${esc(x.customer.name)}</small></td>
        <td>${x.customer.kind === 'order' ? '注文' : '見積'}</td><td>${(x.spec.lot || 0).toLocaleString()}袋</td><td class="num">${yen(x.estimate?.total)}</td>
        <td>${stSelect('fuk_oem_requests', x.ref, x.status, OEM_ST)}</td><td><a class="lnk" data-open="${x.ref}">${open[x.ref] ? '閉じる' : '詳細'}</a></td></tr>
        ${open[x.ref] ? `<tr class="detail"><td colspan="8"><dl>
          <dt>内容</dt><dd>${esc(oemSpec(x.spec))}</dd>
          <dt>袋に入れる名前</dt><dd>${esc(x.spec.brand) || '—'}</dd>
          <dt>概算</dt><dd>単価 ${yen(x.estimate.unit)} × ${(x.spec.lot || 0).toLocaleString()}袋${x.estimate.setup ? ' ＋ 初期費用 ' + yen(x.estimate.setup) : ''} ＝ ${yen(x.estimate.total)}（税別）</dd>
          <dt>業種</dt><dd>${esc(x.customer.biz) || '—'}</dd>
          <dt>希望納期</dt><dd>${esc(x.customer.due) || '—'}</dd>
          <dt>連絡先</dt><dd>${esc(x.customer.email)}${x.customer.tel ? '／' + esc(x.customer.tel) : ''}</dd>
          <dt>備考</dt><dd>${esc(x.customer.note) || '—'}</dd></dl>
          <p style="margin-top:8px"><a class="lnk del" data-del="fuk_oem_requests" data-ref="${x.ref}">この依頼を削除</a></p></td></tr>` : ''}`).join('')}
      </tbody></table></div>` : '<div class="none">まだ依頼はありません。</div>'}`;
    },

    products() {
      return `<div class="h-row"><div><h1>Products</h1><p class="h-sub">オンラインショップの商品（${data.products.length}点）。↑↓で並び順を変えられます。</p></div>
        <button class="btn sm" data-edit="new">＋ 商品を追加</button></div>
      <div class="scroll-x"><table class="tbl"><thead><tr><th></th><th>商品名</th><th>カテゴリ</th><th>価格（税込）</th><th>状態</th><th>並び順</th><th></th></tr></thead><tbody>
      ${data.products.map((p, i) => `<tr><td><img class="thumb" src="${esc(p.img)}" alt=""></td>
        <td><b>${esc(p.name)}</b><small>${esc(p.jp)}</small></td>
        <td>${esc((CATS.find(c => c.id === p.cat) || {}).jp || p.cat)}</td>
        <td><input class="w-s" type="number" min="0" step="10" value="${p.price}" data-price="${p.id}" aria-label="価格"></td>
        <td>${p.hidden ? '<span class="pill off">非公開</span>' : p.soon ? '<span class="pill soon">準備中</span>' : '<span class="pill on">公開中</span>'}</td>
        <td><a class="lnk" data-move="${i}" data-dir="-1">↑</a>　<a class="lnk" data-move="${i}" data-dir="1">↓</a></td>
        <td><a class="lnk" data-edit="${p.id}">編集</a></td></tr>`).join('')}
      </tbody></table></div>`;
    },

    pricing() {
      const o = data.oem, num = (path, v, w = '') => `<input class="w-s" type="number" step="1" value="${v}" data-path="${path}" ${w}>`;
      return `<h1>Pricing</h1><p class="h-sub">OEMの料金表と、ショップの送料です。数字を変えて「保存する」を押すと、見積フォームと料金表に反映されます。</p>
      <h2>ロットごとの基本単価（税別）</h2>
      <table class="tbl"><thead><tr><th>ロット（袋）</th><th>1袋あたり（円）</th><th></th></tr></thead><tbody>
        ${o.lots.map((l, i) => `<tr><td>${num(`lots.${i}.qty`, l.qty)}</td><td>${num(`lots.${i}.unit`, l.unit)}</td><td>${o.lots.length > 1 ? `<a class="lnk del" data-lotdel="${i}">削除</a>` : ''}</td></tr>`).join('')}
      </tbody></table><div class="btn-row"><button class="btn sm ghost" data-act="lotadd">＋ ロットを追加</button></div>
      <h2>豆の選び方</h2>
      <table class="tbl"><thead><tr><th>項目</th><th>1袋あたりの加算（円）</th><th>初期費用（円）</th></tr></thead><tbody>
        ${o.beans.map((b, i) => `<tr><td>${esc(b.label)}<small>${esc(b.note)}</small></td><td>${num(`beans.${i}.add`, b.add)}</td><td>${num(`beans.${i}.setup`, b.setup)}</td></tr>`).join('')}
      </tbody></table>
      <h2>袋のデザイン</h2>
      <table class="tbl"><thead><tr><th>項目</th><th>1袋あたりの加算（円）</th><th>初期費用（円）</th><th>最小ロット（袋）</th></tr></thead><tbody>
        ${o.packs.map((k, i) => `<tr><td>${esc(k.label)}<small>${esc(k.note)}</small></td><td>${num(`packs.${i}.add`, k.add)}</td><td>${num(`packs.${i}.setup`, k.setup)}</td><td>${num(`packs.${i}.min`, k.min)}</td></tr>`).join('')}
      </tbody></table>
      <h2>内容量</h2>
      <table class="tbl"><thead><tr><th>項目</th><th>1袋あたりの加算（円）</th></tr></thead><tbody>
        ${o.grams.map((g, i) => `<tr><td>${esc(g.label)}<small>${esc(g.note)}</small></td><td>${num(`grams.${i}.add`, g.add)}</td></tr>`).join('')}
      </tbody></table>
      <h2>納期の目安・送料</h2>
      <table class="tbl"><tbody>
        <tr><td>OEMの納期の目安（文章）</td><td><input type="text" style="width:320px" value="${esc(o.leadTime)}" data-lead></td></tr>
        <tr><td>ショップの送料（円）</td><td><input class="w-s" type="number" value="${data.shipping.fee}" data-ship="fee"></td></tr>
        <tr><td>送料が無料になる金額（円以上）</td><td><input class="w-s" type="number" value="${data.shipping.freeOver}" data-ship="freeOver"></td></tr>
      </tbody></table>
      <div class="btn-row"><button class="btn" data-act="pricesave">保存する</button></div>`;
    },

    publish() {
      return `<h1>Publish</h1><p class="h-sub">管理画面で変えた内容を、みんなが見るサイトに反映する手順です。</p>
      <div class="card-box"><h3>公開用ファイルを書き出す</h3>
        <p>この管理画面での変更（商品・価格・OEM料金・送料）は、いまは<b>このブラウザの中だけ</b>に反映されています。全員に見えるようにするには、下の手順で反映します。</p>
        <ol class="steps"><li>下のボタンで <code>published.js</code> をダウンロードする</li><li>サイトの <code>assets/published.js</code> に上書きする</li><li>GitHubに push する（1〜2分で反映）</li></ol>
        <div class="btn-row"><button class="btn" data-act="export">published.js を書き出す</button></div></div>
      <div class="card-box"><h3>初期状態に戻す</h3>
        <p>このブラウザ内の編集内容を消して、公開中の内容に戻します。注文・依頼のデータは消えません。</p>
        <div class="btn-row"><button class="btn sm ghost" data-act="reset">編集内容を消して元に戻す</button></div></div>
      <div class="card-box"><h3>サンプルデータ</h3>
        <p>画面確認用に、架空の注文とOEM依頼を追加・削除できます。</p>
        <div class="btn-row"><button class="btn sm ghost" data-act="seed">サンプルデータを入れる</button><button class="btn sm ghost" data-act="wipe">注文・依頼をすべて削除</button></div></div>`;
    }
  };

  /* ---------- 商品の編集ダイアログ ---------- */
  let editing = null, editImg = '';
  function openEdit(id) {
    const isNew = id === 'new';
    editing = isNew ? null : id;
    const p = isNew ? { id: '', cat: 'coffee', name: '', jp: '', unit: '', price: 0, tags: [], options: [], lead: '', desc: '', img: '', spec: [] } : data.products.find(x => x.id === id);
    editImg = p.img;
    $('#dlgForm').innerHTML = `<h3>${isNew ? 'New product' : 'Edit product'}</h3>
      <div class="fr"><label class="fld"><span>英語の商品名（大きく表示）<i>必須</i></span><input name="name" required value="${esc(p.name)}"></label>
        <label class="fld"><span>カテゴリ</span><select name="cat">${CATS.map(c => `<option value="${c.id}" ${c.id === p.cat ? 'selected' : ''}>${c.jp}</option>`).join('')}</select></label></div>
      <label class="fld"><span>日本語の商品名<i>必須</i></span><input name="jp" required value="${esc(p.jp)}"></label>
      <div class="fr"><label class="fld"><span>価格（税込・円）<i>必須</i></span><input name="price" type="number" min="0" required value="${p.price}"></label>
        <label class="fld"><span>単位・内容量</span><input name="unit" value="${esc(p.unit)}" placeholder="例：コーヒー豆 250g"></label></div>
      <label class="fld"><span>ひとことコピー</span><input name="lead" value="${esc(p.lead)}"></label>
      <label class="fld"><span>説明文</span><textarea name="desc">${esc(p.desc)}</textarea></label>
      <div class="fr"><label class="fld"><span>タグ</span><input name="tags" value="${esc((p.tags || []).join('、'))}"><small class="hint">「、」で区切る。「ドリップバッグ」を入れるとトップページにも表示</small></label>
        <label class="fld"><span>選べる種類（色・サイズなど）</span><textarea name="options" style="height:44px" placeholder="1行に1つ。なければ空欄">${esc((p.options || []).join('\n'))}</textarea></label></div>
      <div class="fld"><span>商品画像</span><div class="img-row"><img id="imgPrev" src="${esc(p.img)}" alt="">
        <div><input type="file" id="imgFile" accept="image/*"><small class="hint">正方形の写真がおすすめ。自動で縮小して保存します。</small></div></div></div>
      <div class="chk"><label><input type="checkbox" name="soon" ${p.soon ? 'checked' : ''}>準備中（購入不可）</label><label><input type="checkbox" name="hidden" ${p.hidden ? 'checked' : ''}>非公開（サイトに出さない）</label></div>
      <div class="dlg-foot"><div>${isNew ? '' : '<button type="button" class="lnk del" data-pdel>この商品を削除</button>'}</div>
        <div style="display:flex;gap:10px"><button type="button" class="btn sm ghost" data-close>キャンセル</button><button class="btn sm" value="save">保存する</button></div></div>`;
    $('#dlg').showModal();
  }
  $('#dlgForm').addEventListener('change', e => {
    if (e.target.id !== 'imgFile' || !e.target.files[0]) return;
    const img = new Image();
    img.onload = () => {   // 中央を正方形に切り抜いて 800px に縮小
      const s = Math.min(img.width, img.height), c = document.createElement('canvas'); c.width = c.height = Math.min(800, s);
      c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, c.width, c.height);
      editImg = c.toDataURL('image/jpeg', .82); $('#imgPrev').src = editImg; URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(e.target.files[0]);
  });
  $('#dlgForm').addEventListener('click', e => {
    if (e.target.closest('[data-close]')) $('#dlg').close();
    if (e.target.closest('[data-pdel]') && confirm('この商品を削除しますか？')) {
      data.products = data.products.filter(p => p.id !== editing); $('#dlg').close(); saveData('商品を削除しました'); render();
    }
  });
  $('#dlgForm').addEventListener('submit', e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    const vals = {
      name: f.name.trim(), jp: f.jp.trim(), cat: f.cat, price: Math.max(0, Number(f.price) || 0), unit: f.unit.trim(), lead: f.lead.trim(), desc: f.desc.trim(),
      tags: f.tags.split(/[、,]/).map(s => s.trim()).filter(Boolean), options: f.options.split('\n').map(s => s.trim()).filter(Boolean),
      img: editImg, soon: !!f.soon, hidden: !!f.hidden
    };
    if (!vals.img) { toast('商品画像を選んでください'); return; }
    if (editing) Object.assign(data.products.find(p => p.id === editing), vals);
    else data.products.unshift({ id: 'p' + Date.now().toString(36), spec: [], ...vals });
    try { saveData('商品を保存しました'); } catch { toast('保存できませんでした（画像が大きすぎる可能性があります）'); return; }
    $('#dlg').close(); render();
  });

  /* ---------- 操作 ---------- */
  const setPath = (obj, path, v) => { const ks = path.split('.'); const last = ks.pop(); ks.reduce((o, k) => o[k], obj)[last] = v; };
  function readPricing() {
    $$('[data-path]').forEach(i => setPath(data.oem, i.dataset.path, Number(i.value) || 0));
    data.oem.lots = data.oem.lots.filter(l => l.qty > 0).sort((a, b) => a.qty - b.qty);
    const lead = $('[data-lead]'); if (lead) data.oem.leadTime = lead.value.trim();
    $$('[data-ship]').forEach(i => data.shipping[i.dataset.ship] = Math.max(0, Number(i.value) || 0));
  }
  const acts = {
    seed() {
      const now = Date.now(), ago = h => new Date(now - h * 36e5).toISOString(), P = id => data.products.find(p => p.id === id) || data.products[0];
      const mk = (ref, h, status, name, pref, pay, items) => {
        const its = items.map(([id, qty, opt]) => ({ id: P(id).id, qty, opt: opt || '', name: P(id).jp, price: P(id).price }));
        const sub = its.reduce((s, i) => s + i.price * i.qty, 0), ship = sub >= data.shipping.freeOver ? 0 : data.shipping.fee;
        return { ref, at: ago(h), status, customer: { name, tel: '000-0000-0000', email: 'sample@example.com', zip: '000-0000', pref, address: '（サンプル住所）', pay, note: '' }, items: its, totals: { sub, ship, total: sub + ship } };
      };
      ls.set('fuk_orders', [...orders(),
        mk('FUK-SAMPLE1', 50, '発送済み', 'サンプル 太郎', '福岡県', 'card', [['beans250', 2]]),
        mk('FUK-SAMPLE2', 20, '入金待ち', 'サンプル 花子', '東京都', 'bank', [['gift-mug-drip', 1, 'B. FUK COFFEE（福岡）'], ['kinchaku-drip', 2]]),
        mk('FUK-SAMPLE3', 2, '新規', 'サンプル 次郎', '大阪府', 'card', [['beans150', 1], ['canister', 1, 'A. マットブラック・スクエア型']])]);
      const o = data.oem, oe = (ref, h, status, company, biz, kind, spec, note) => {
        const l = o.lots.find(x => x.qty === spec.lot) || o.lots[0], b = o.beans.find(x => x.id === spec.bean), k = o.packs.find(x => x.id === spec.pack), g = o.grams.find(x => x.id === spec.gram);
        const unit = l.unit + b.add + k.add + g.add, setup = b.setup + k.setup;
        return { ref, at: ago(h), status, customer: { company, name: 'サンプル担当', email: 'sample@example.com', tel: '', biz, due: '', kind, note }, spec: { ...spec, lot: l.qty }, estimate: { unit, setup, total: unit * l.qty + setup } };
      };
      ls.set('fuk_oem_requests', [...oems(),
        oe('OEM-SAMPLE1', 70, '製造中', 'サンプル珈琲焙煎所', 'コーヒーショップ・ロースター', 'order', { bean: 'bring', gram: 'g10', color: 'kraft', pack: 'label', lot: 500, brand: 'SAMPLE ROASTERS' }, '自店のブレンドを持ち込みたいです。'),
        oe('OEM-SAMPLE2', 26, '見積送付済み', 'ホテルサンプル福岡', 'ホテル・旅館', 'estimate', { bean: 'fuk-blend', gram: 'g10', color: 'black', pack: 'print', lot: 3000, brand: 'HOTEL SAMPLE' }, '客室用に検討しています。'),
        oe('OEM-SAMPLE3', 3, '新規', '株式会社サンプル', '企業・オフィス', 'estimate', { bean: 'fuk-single', gram: 'g12', color: 'white', pack: 'label', lot: 300, brand: 'SAMPLE Inc.' }, '周年記念のノベルティ用です。')]);
      toast('サンプルデータを入れました'); render();
    },
    wipe() { if (confirm('注文とOEM依頼をすべて削除しますか？')) { ls.set('fuk_orders', []); ls.set('fuk_oem_requests', []); toast('削除しました'); render(); } },
    lotadd() { readPricing(); const last = data.oem.lots.at(-1); data.oem.lots.push({ qty: last.qty * 2, unit: Math.max(1, last.unit - 5) }); render(); },
    pricesave() { readPricing(); saveData('料金を保存しました'); render(); },
    export() {
      const body = '/* 管理画面から書き出した公開用の設定（' + new Date().toLocaleString('ja-JP') + '） */\nwindow.FUK_PUBLISHED = ' + JSON.stringify(data, null, 1) + ';\n';
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([body], { type: 'text/javascript' })); a.download = 'published.js'; a.click();
      toast('published.js を書き出しました');
    },
    reset() { if (confirm('このブラウザ内の編集内容を消して、元に戻しますか？')) { localStorage.removeItem('fuk_admin_data'); location.reload(); } }
  };

  $('#view').addEventListener('click', e => {
    const t = e.target, q = s => t.closest(s);
    let b;
    if ((b = q('[data-act]'))) acts[b.dataset.act]();
    else if ((b = q('[data-go]'))) go(b.dataset.go);
    else if ((b = q('[data-open]'))) { open[b.dataset.open] = !open[b.dataset.open]; render(); }
    else if ((b = q('[data-edit]'))) openEdit(b.dataset.edit);
    else if ((b = q('[data-del]'))) { if (confirm('削除しますか？')) { ls.set(b.dataset.del, ls.get(b.dataset.del, []).filter(x => x.ref !== b.dataset.ref)); toast('削除しました'); render(); } }
    else if ((b = q('[data-move]'))) {
      const i = Number(b.dataset.move), j = i + Number(b.dataset.dir);
      if (j >= 0 && j < data.products.length) { [data.products[i], data.products[j]] = [data.products[j], data.products[i]]; saveData('並び順を保存しました'); render(); }
    }
    else if ((b = q('[data-lotdel]'))) { readPricing(); data.oem.lots.splice(Number(b.dataset.lotdel), 1); render(); }
  });
  $('#view').addEventListener('change', e => {
    const t = e.target;
    if (t.dataset.st) { ls.set(t.dataset.st, ls.get(t.dataset.st, []).map(x => x.ref === t.dataset.ref ? { ...x, status: t.value } : x)); toast('状況を「' + t.value + '」にしました'); render(); }
    if (t.dataset.price) { data.products.find(p => p.id === t.dataset.price).price = Math.max(0, Number(t.value) || 0); saveData('価格を保存しました'); }
  });

  render();
})();
