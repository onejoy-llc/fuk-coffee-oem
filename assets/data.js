/* =========================================================
   FUK COFFEE — 商品・OEM料金の設定ファイル
   金額や文言を変えるときは、このファイルだけ直せばOKです。
   「仮」と書いてある数字は、正式な金額に差し替えてください。
   ========================================================= */

/* 画像はすべて assets/img/ に入っている仮（ダミー）のAI生成画像です。本番では撮影写真に差し替えてください。 */
const IMG = 'assets/img/';

/* ---------- オンラインショップの商品 ---------- */
const PRODUCTS = [
  {
    id: 'gate01', cat: 'dripbag', gate: '01', tone: 'white',
    name: 'TRANSIT BLEND', jp: 'トランジット ブレンド',
    unit: 'ドリップバッグ 5袋入', price: 1200, provisional: true,
    roast: 'City Roast', tags: ['ナッツ', '柑橘', 'ブドウの甘み'],
    img: IMG + 'gate01.jpg',
    lead: 'いちばん店で飲まれている、FUK COFFEEの定番。',
    desc: 'エルサルバドルとコスタリカの豆を使ったオリジナルブレンド。ナッツのような香ばしさと柑橘の爽やかさを持つエルサルバドルを中深煎りに仕上げ、ブドウのような甘みと華やかさのコスタリカをアクセントに。バランスの取れた味わいと、心地よい余韻が続きます。',
    spec: [['焙煎度', 'City Roast（中深煎り）'], ['使用豆', 'エルサルバドル／コスタリカ']]
  },
  {
    id: 'gate02', cat: 'dripbag', gate: '02', tone: 'black',
    name: '3 LETTER BLEND', jp: 'スリーレター ブレンド',
    unit: 'ドリップバッグ 5袋入', price: 1200, provisional: true, soon: true,
    roast: 'Fullcity Roast', tags: ['深煎り'],
    img: IMG + 'gate02.jpg',
    lead: '現在準備中。出発までしばらくお待ちください。',
    desc: 'フルシティローストの新しいブレンド。現在準備中です。',
    spec: [['焙煎度', 'Fullcity Roast（深煎り）']]
  },
  {
    id: 'gate03', cat: 'dripbag', gate: '03', tone: 'white',
    name: 'EL SALVADOR', jp: 'エルサルバドル',
    unit: 'ドリップバッグ 5袋入', price: 1300, provisional: true,
    roast: 'City Roast', tags: ['アーモンド', '柑橘', 'やわらかな余韻'],
    img: IMG + 'gate03.jpg',
    lead: '4世代続く農園の豆を、香ばしく。',
    desc: 'エルサルバドルで4世代続くカフェノルのコーヒー豆を使用。中深煎りに焙煎することで、香ばしいアーモンドの風味と、やわらかく広がる柑橘の香りが調和します。',
    spec: [['生産国', 'エルサルバドル'], ['生産地域', 'ラ・パルマ'], ['生産者', 'ディアス ファミリー'], ['標高', '1600m'], ['品種', 'パーカス'], ['精製方法', 'セミウォッシュド'], ['焙煎度', 'City Roast']]
  },
  {
    id: 'gate04', cat: 'dripbag', gate: '04', tone: 'white',
    name: 'COSTA RICA', jp: 'コスタリカ',
    unit: 'ドリップバッグ 5袋入', price: 1300, provisional: true,
    roast: 'Cinnamon Roast', tags: ['ブドウ', 'マカダミアナッツ', '華やか'],
    img: IMG + 'gate04.jpg',
    lead: 'フレッシュな果実感を、浅煎りで。',
    desc: 'コスタリカ、ヴォルカン・アズールのコーヒー豆を使用。フレッシュなブドウのような香りと、ほんのりマカダミアナッツのような香りを感じられます。',
    spec: [['生産国', 'コスタリカ'], ['生産地域', 'ウエストバレー'], ['生産者', 'アレホ・カストロ・カール'], ['標高', '1700m'], ['品種', 'ビジャサルチ'], ['精製方法', 'ナチュラル'], ['焙煎度', 'Cinnamon Roast']]
  },
  {
    id: 'beans250', img: IMG + 'beans250.jpg', cat: 'beans', visual: 'pouch', code: '250G',
    name: 'ORIGINAL BLEND 250g', jp: '【中深煎り】オリジナルブレンド豆 250g',
    unit: 'コーヒー豆 250g', price: 2050,
    roast: 'City Roast', tags: ['中深煎り', '定番'],
    lead: '毎日飲める、店の味をそのまま。',
    desc: 'FUK COFFEEの店頭で使用しているオリジナルブレンドのコーヒー豆です。',
    spec: [['内容量', '250g'], ['焙煎度', '中深煎り']]
  },
  {
    id: 'beans150', img: IMG + 'beans150.jpg', cat: 'beans', visual: 'pouch', code: '150G',
    name: 'ORIGINAL BLEND 150g', jp: '【中深煎り】オリジナルブレンド豆 150g',
    unit: 'コーヒー豆 150g', price: 1300,
    roast: 'City Roast', tags: ['中深煎り', 'お試し'],
    lead: 'はじめての方に、ちょうどいい量。',
    desc: 'FUK COFFEEの店頭で使用しているオリジナルブレンドのコーヒー豆です。',
    spec: [['内容量', '150g'], ['焙煎度', '中深煎り']]
  },
  {
    id: 'gift-canister', img: IMG + 'gift-canister.jpg', cat: 'gift', visual: 'gift', code: 'GIFT',
    name: 'CANISTER & DRIP BAG GIFT', jp: 'キャニスター & ドリップバッグ ギフト',
    unit: 'ギフトセット', price: 4100,
    tags: ['ギフト', 'キャニスター'],
    lead: '贈りものに、旅するコーヒーを。',
    desc: 'FUK COFFEE オリジナルキャニスターとドリップバッグを、ギフトボックスに詰め合わせました。',
    spec: [['内容', 'キャニスター／ドリップバッグ']]
  },
  {
    id: 'gift-mug', img: IMG + 'gift-mug.jpg', cat: 'gift', visual: 'gift', code: 'GIFT',
    name: 'MUG & DRIP BAG GIFT', jp: '3レター マグカップ & ドリップバッグ ギフトセット',
    unit: 'ギフトセット', price: 4100,
    tags: ['ギフト', 'マグカップ'],
    lead: 'マグとコーヒーを、ひとつの箱に。',
    desc: 'ニシクボサユリさんデザインの3レター マグカップと、ドリップバッグのギフトセットです。',
    spec: [['内容', 'マグカップ／ドリップバッグ']]
  },
  {
    id: 'kinchaku', img: IMG + 'kinchaku.jpg', cat: 'gift', visual: 'gift', code: 'SET',
    name: 'KINCHAKU & DRIP BAG SET', jp: 'コットン巾着 & ドリップバッグ セット',
    unit: 'セット', price: 1400,
    tags: ['プチギフト'],
    lead: '手みやげに、ちょうどいい。',
    desc: 'ニシクボサユリさんデザインのコットン巾着に、ドリップバッグを入れたセットです。',
    spec: [['内容', 'コットン巾着／ドリップバッグ']]
  }
];

const CATEGORIES = [
  { id: 'all', label: 'ALL', jp: 'すべて' },
  { id: 'dripbag', label: 'DRIP BAG', jp: 'ドリップバッグ' },
  { id: 'beans', label: 'BEANS', jp: 'コーヒー豆' },
  { id: 'gift', label: 'GIFT', jp: 'ギフト' }
];

/* ---------- 送料（仮） ---------- */
const SHIPPING = { fee: 600, freeOver: 8000 };

/* ---------- OEMの料金設定（すべて仮の金額・税別） ---------- */
const OEM = {
  // ロットごとの基本単価（1袋あたり・円）
  lots: [
    { qty: 100, unit: 140 },
    { qty: 300, unit: 120 },
    { qty: 500, unit: 105 },
    { qty: 1000, unit: 92 },
    { qty: 3000, unit: 82 }
  ],
  // 豆の選び方（add = 1袋あたりの加算額、setup = 初回だけかかる費用）
  beans: [
    { id: 'fuk-blend', code: 'FUK', label: 'FUKのブレンドを使う', note: '店で出している TRANSIT BLEND などから選ぶ', add: 0, setup: 0 },
    { id: 'fuk-single', code: 'SGL', label: 'FUKのシングルオリジンを使う', note: 'エルサルバドル／コスタリカなど', add: 10, setup: 0 },
    { id: 'bring', code: 'BYO', label: '自店の焙煎豆を持ち込む', note: 'ロースター様向け。充填と包装だけお任せ', add: -25, setup: 0 },
    { id: 'original', code: 'NEW', label: 'オリジナルブレンドを開発する', note: '味の方向を伺い、試作して決める', add: 15, setup: 30000 }
  ],
  // 1袋あたりの内容量
  grams: [
    { id: 'g10', label: '10g', note: '標準', add: 0 },
    { id: 'g12', label: '12g', note: 'しっかり濃いめ', add: 8 }
  ],
  // 外袋の色
  colors: [
    { id: 'white', label: 'ホワイト' },
    { id: 'black', label: 'ブラック' },
    { id: 'kraft', label: 'クラフト' }
  ],
  // デザインの入れ方
  packs: [
    { id: 'plain', label: '無地の袋', note: 'そのまま、または自店でシール貼り', add: 0, setup: 0, min: 100 },
    { id: 'label', label: 'ラベルシール貼り', note: 'データ入稿でOK。小ロット向き', add: 12, setup: 0, min: 100 },
    { id: 'print', label: 'オリジナル印刷の袋', note: '袋そのものに印刷。1,000袋から', add: 18, setup: 30000, min: 1000 }
  ],
  leadTime: 'デザイン確定から約3〜4週間'
};

/* ---------- 注文・見積の送信先 ----------
   空のままだと「デモモード」（送信内容をブラウザ内に保存するだけ）で動きます。
   本番では、受注を受け取るAPIやフォームサービスのURLを入れてください。 */
const ENDPOINT = { order: '', oem: '' };
