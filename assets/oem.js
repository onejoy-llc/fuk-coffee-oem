/* OEM 見積・注文フォーム */
(() => {
  const state = { bean: OEM.beans[0].id, gram: OEM.grams[0].id, color: 'white', pack: 'label', lot: 300, brand: '' };
  const sign = n => n === 0 ? '基本料金' : (n > 0 ? '+' : '−') + '¥' + Math.abs(n) + '／袋';
  const setup = n => n ? `　初期費用 ${yen(n)}` : '';
  const swatch = { white: '#fafaf7', black: '#151514', kraft: '#c9a97c' };

  const radio = (name, value, inner, cls = '') =>
    `<label class="opt ${cls}"><input type="radio" name="${name}" value="${value}"><div>${inner}</div></label>`;

  $('#optBeans').innerHTML = OEM.beans.map(b => radio('bean', b.id,
    `<span class="c">${b.code}</span><b>${b.label}</b><small>${b.note}</small><span class="p">${sign(b.add)}${setup(b.setup)}</span>`)).join('');
  $('#optColors').innerHTML = OEM.colors.map(c => radio('color', c.id,
    `<b><i class="sw" style="background:${swatch[c.id]}"></i>${c.label}</b>`)).join('');
  $('#optPacks').innerHTML = OEM.packs.map(k => radio('pack', k.id,
    `<b>${k.label}</b><small>${k.note}</small><span class="p">${sign(k.add)}${setup(k.setup)}</span>`)).join('');
  $('#optGrams').innerHTML = OEM.grams.map(g => radio('gram', g.id,
    `<b>${g.label}</b><small>${g.note}${g.add ? `（+¥${g.add}/袋）` : ''}</small>`)).join('');
  $('#optLots').innerHTML = OEM.lots.map(l => radio('lot', l.qty,
    `<b>${l.qty.toLocaleString()}</b><small>袋</small>`, 'lot')).join('');

  function draw() {
    // 印刷袋は最小ロットあり → 足りなければロットを引き上げる
    const minLot = OEM.packs.find(k => k.id === state.pack).min;
    if (state.lot < minLot) state.lot = minLot;
    $$('#optLots input').forEach(i => i.disabled = Number(i.value) < minLot);
    ['bean', 'color', 'pack', 'gram', 'lot'].forEach(n =>
      $$(`#oemForm input[name=${n}]`).forEach(i => i.checked = i.value === String(state[n])));

    const c = oemCalc(state);
    $('#prev').innerHTML = bagHTML({
      tone: state.color, gate: '01',
      name: state.pack === 'plain' ? '' : (state.brand || 'YOUR SHOP'),
      sub: state.pack === 'plain' ? '' : 'DRIP BAG COFFEE'
    });
    if (state.pack === 'plain') $$('#prev .bag-top, #prev .bag-bar, #prev .bag-foot').forEach(e => e.style.visibility = 'hidden');
    $('#passList').innerHTML = `
      <div><dt>コーヒー豆</dt><dd>${c.b.label}</dd></div>
      <div><dt>パッケージ</dt><dd>${OEM.colors.find(x => x.id === state.color).label}・${c.k.label}・${c.g.label}</dd></div>
      <div><dt>数量</dt><dd>${state.lot.toLocaleString()}袋</dd></div>
      <div><dt>納期の目安</dt><dd>${OEM.leadTime}</dd></div>
      <div class="unit"><dt>商品代</dt><dd>${yen(c.unit)} × ${state.lot.toLocaleString()}袋 ＝ ${yen(c.goods)}</dd></div>
      ${c.setup ? `<div><dt>初期費用</dt><dd>${yen(c.setup)}</dd></div>` : ''}
      <div class="total"><dt>概算の合計</dt><dd>${yen(c.total)}<small>税別・送料別</small></dd></div>`;
  }

  $('#oemForm').addEventListener('change', e => {
    const t = e.target;
    if (t.name in state) { state[t.name] = t.name === 'lot' ? Number(t.value) : t.value; draw(); }
  });
  $('#brand').addEventListener('input', e => { state.brand = e.target.value.trim(); draw(); });

  $('#oemForm').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target, err = $('#oemErr');
    if (!form.checkValidity()) {
      err.textContent = '「必須」の項目をご記入ください。'; err.classList.add('on');
      form.querySelector(':invalid').focus();
      return;
    }
    err.classList.remove('on');
    const f = Object.fromEntries(new FormData(form));
    const c = oemCalc(state);
    $('#oemBtn').disabled = true;
    try {
      const r = await submitData('oem', {
        customer: { company: f.company, name: f.name, email: f.email, tel: f.tel, biz: f.biz, due: f.due, kind: f.kind, note: f.note },
        spec: { ...state }, estimate: { unit: c.unit, setup: c.setup, total: c.total }
      });
      $('main').innerHTML = doneHTML({
        ...r, title: '受け付けました',
        msg: `${f.kind === 'order' ? 'ご注文の依頼' : '見積の依頼'}を受け付けました。内容を確認のうえ、担当者よりメールでご連絡します。`
      });
      scrollTo(0, 0);
    } catch (ex) { $('#oemBtn').disabled = false; err.textContent = ex.message; err.classList.add('on'); }
  });

  draw();
})();
