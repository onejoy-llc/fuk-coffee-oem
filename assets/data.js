/* =========================================================
   FUK COFFEE — 商品・OEM料金の設定ファイル（初期値）
   ふだんの変更は「管理画面（admin.html）」から行えます。
   管理画面で書き出した published.js を assets/ に置くと、
   そちらの内容がこの初期値より優先されます。
   ========================================================= */

const P_IMG = 'assets/img/products/';
const D_IMG = 'assets/img/dripbag/';

/* ---------- オンラインショップの商品（既存ショップ fuk-coffee.net の商品・価格） ---------- */
const DEFAULT_PRODUCTS = [
  {
    id: 'beans250', cat: 'coffee', img: P_IMG + 'beans250.jpg',
    name: 'ORIGINAL BLEND 250g', jp: '【中深煎り】FUK COFFEE オリジナルブレンド豆 250g',
    unit: 'コーヒー豆 250g', price: 2050, tags: ['中深煎り', 'エルサルバドル中心'],
    lead: '店で使っているブレンドを、そのままご自宅へ。',
    desc: 'FUK COFFEEグループで使用しているオリジナルブレンド。スペシャルティコーヒー特有の上質な酸味、甘味、香りをお楽しみいただけます。エルサルバドルを中心としたブレンドで、中深煎りに焙煎しています。',
    spec: [['内容量', '250g'], ['焙煎度', '中深煎り']]
  },
  {
    id: 'beans150', cat: 'coffee', img: P_IMG + 'beans150.jpg',
    name: 'ORIGINAL BLEND 150g', jp: '【中深煎り】FUK COFFEE オリジナルブレンド豆 150g',
    unit: 'コーヒー豆 150g', price: 1300, tags: ['中深煎り', 'エルサルバドル中心'],
    lead: 'はじめての方に、ちょうどいい量。',
    desc: 'FUK COFFEEグループで使用しているオリジナルブレンド。スペシャルティコーヒー特有の上質な酸味、甘味、香りをお楽しみいただけます。エルサルバドルを中心としたブレンドで、中深煎りに焙煎しています。',
    spec: [['内容量', '150g'], ['焙煎度', '中深煎り']]
  },
  {
    id: 'gift-canister-drip', cat: 'gift', img: P_IMG + 'gift-canister-drip.jpg',
    name: 'CANISTER & DRIP BAG GIFT', jp: 'FUK COFFEE キャニスター & ドリップバッグ ギフト',
    unit: 'ギフトセット', price: 4100, tags: ['ドリップバッグ', 'ギフトボックス'],
    options: ['A. マットブラック・スクエア型', 'B. マットホワイト・スクエア型', 'C. マットブラック・丸型', 'D. マットホワイト・丸型'],
    lead: 'キャニスターとドリップバッグを、ひとつの箱に。',
    desc: 'ギフトボックスに、選べるFUK COFFEE キャニスターと、巾着＋ドリップバッグ4個を詰め合わせました。ドリップバッグはスペシャルティコーヒーのみを使用し、誰にでも飲みやすいようブレンドしています。',
    spec: [['内容', 'ギフトボックス／キャニスター／巾着＋ドリップバッグ4個']]
  },
  {
    id: 'gift-mug-drip', cat: 'gift', img: P_IMG + 'gift-mug-drip.jpg',
    name: 'MUG & DRIP BAG GIFT', jp: '＜ニシクボサユリデザイン＞3レター マグカップ & ドリップバッグ ギフトセット',
    unit: 'ギフトセット', price: 4100, tags: ['ドリップバッグ', 'ギフトボックス'],
    options: ['A. HIJ COFFEE（広島）', 'B. FUK COFFEE（福岡）', 'C. OSA COFFEE（大阪）', 'D. NGS COFFEE（長崎）'],
    lead: 'マグとコーヒーを、そのまま贈りものに。',
    desc: 'ギフトボックスに、ニシクボサユリさんデザインの3レター マグカップと、巾着＋ドリップバッグ4個を詰め合わせました。マグカップは店舗ごとに、キャリーケースのステッカーロゴと裏印のデザインが異なります。',
    spec: [['内容', 'ギフトボックス／マグカップ／巾着＋ドリップバッグ4個']]
  },
  {
    id: 'kinchaku-drip', cat: 'gift', img: P_IMG + 'kinchaku-drip.jpg',
    name: 'KINCHAKU & DRIP BAG SET', jp: '＜ニシクボサユリデザイン＞コットン巾着 & ドリップバッグ セット',
    unit: 'セット', price: 1400, tags: ['ドリップバッグ', 'プチギフト'],
    lead: '手みやげに、ちょうどいい。',
    desc: 'ニシクボサユリさんデザインのコットン巾着に、ドリップバッグを入れたセットです。巾着はポーチや小物入れとしてもお使いいただけます。',
    spec: [['内容', 'コットン巾着／ドリップバッグ']]
  },
  {
    id: 'gift-canister-beans250', cat: 'gift', img: P_IMG + 'gift-canister-beans250.jpg',
    name: 'CANISTER & BEANS 250g GIFT', jp: 'FUK COFFEE キャニスター & オリジナルブレンド豆 250g ギフト',
    unit: 'ギフトセット', price: 4900, tags: ['コーヒー豆', 'ギフトボックス'],
    options: ['A. マットブラック・スクエア型', 'B. マットホワイト・スクエア型', 'C. マットブラック・丸型', 'D. マットホワイト・丸型'],
    lead: '豆と、豆をおいしく保つ缶のセット。',
    desc: 'ギフトボックスに、FUK COFFEE キャニスターとオリジナルブレンド豆 250gを詰め合わせました。キャニスターは防湿リングでしっかり閉まり、コーヒー豆を湿気から守ります。',
    spec: [['内容', 'ギフトボックス／キャニスター／オリジナルブレンド豆 250g']]
  },
  {
    id: 'gift-mug-beans250', cat: 'gift', img: P_IMG + 'gift-mug-beans250.jpg',
    name: 'MUG & BEANS 250g GIFT', jp: '＜ニシクボサユリデザイン＞3レター マグカップ & オリジナルブレンド豆 250g ギフト',
    unit: 'ギフトセット', price: 4900, tags: ['コーヒー豆', 'ギフトボックス'],
    options: ['A. HIJ COFFEE（広島）', 'B. FUK COFFEE（福岡）', 'C. OSA COFFEE（大阪）', 'D. NGS COFFEE（長崎）'],
    lead: '毎朝の一杯が、楽しみになるセット。',
    desc: 'ギフトボックスに、ニシクボサユリさんデザインの3レター マグカップとオリジナルブレンド豆 250gを詰め合わせました。',
    spec: [['内容', 'ギフトボックス／マグカップ／オリジナルブレンド豆 250g']]
  },
  {
    id: 'gift-canister-beans150', cat: 'gift', img: P_IMG + 'gift-canister-beans150.jpg',
    name: 'CANISTER & BEANS 150g GIFT', jp: 'FUK COFFEE キャニスター & オリジナルブレンド豆 150g ギフト',
    unit: 'ギフトセット', price: 4000, tags: ['コーヒー豆', 'ギフトボックス'],
    options: ['A. マットブラック・スクエア型', 'B. マットホワイト・スクエア型', 'C. マットブラック・丸型', 'D. マットホワイト・丸型'],
    lead: '豆と缶の、コンパクトなギフト。',
    desc: 'ギフトボックスに、選べるFUK COFFEE キャニスターとオリジナルブレンド豆 150gを詰め合わせました。',
    spec: [['内容', 'ギフトボックス／キャニスター／オリジナルブレンド豆 150g']]
  },
  {
    id: 'gift-mug-beans150', cat: 'gift', img: P_IMG + 'gift-mug-beans150.jpg',
    name: 'MUG & BEANS 150g GIFT', jp: '＜ニシクボサユリデザイン＞3レター マグカップ & オリジナルブレンド豆 150g ギフト',
    unit: 'ギフトセット', price: 4000, tags: ['コーヒー豆', 'ギフトボックス'],
    options: ['A. HIJ COFFEE（広島）', 'B. FUK COFFEE（福岡）', 'C. OSA COFFEE（大阪）', 'D. NGS COFFEE（長崎）'],
    lead: 'マグと豆の、コンパクトなギフト。',
    desc: 'ギフトボックスに、ニシクボサユリさんデザインの3レター マグカップとオリジナルブレンド豆 150gを詰め合わせました。',
    spec: [['内容', 'ギフトボックス／マグカップ／オリジナルブレンド豆 150g']]
  },
  {
    id: 'canister', cat: 'goods', img: P_IMG + 'canister.jpg',
    name: 'CANISTER', jp: 'FUK COFFEE キャニスター',
    unit: '1個', price: 2500, tags: ['保存缶'],
    options: ['A. マットブラック・スクエア型', 'B. マットホワイト・スクエア型', 'C. マットブラック・丸型', 'D. マットホワイト・丸型'],
    lead: '豆のおいしさを、長く保つために。',
    desc: 'FUK COFFEEオリジナルのキャニスター缶。直射日光や湿気・移り香を嫌うコーヒー豆の品質管理に最適です。防湿リングでしっかり閉まります。コーヒー豆が約200g入るサイズ。※コーヒースプーンは付属しません。',
    spec: [['容量', 'コーヒー豆 約200g']]
  },
  {
    id: 'mug', cat: 'goods', img: P_IMG + 'mug.jpg',
    name: '3 LETTER MUG', jp: '＜ニシクボサユリデザイン＞3レター マグカップ',
    unit: '1個', price: 2500, tags: ['マグカップ'],
    options: ['A. HIJ COFFEE（広島）', 'B. FUK COFFEE（福岡）', 'C. OSA COFFEE（大阪）', 'D. NGS COFFEE（長崎）'],
    lead: '店のオブジェを描いた、旅するマグ。',
    desc: '本店のオブジェであるキャリーケースを、ニシクボサユリさんにドローイングしてもらいプリントしたマグカップです。丸みのある飲み口がフィットするデザイン。店舗ごとにステッカーロゴと裏印のデザインが異なります。',
    spec: []
  },
  {
    id: 'kinchaku', cat: 'goods', img: P_IMG + 'kinchaku.jpg',
    name: 'COTTON KINCHAKU', jp: 'デザイン コットン巾着（缶バッジ付）',
    unit: '1個', price: 600, tags: ['巾着', '缶バッジ付'],
    options: ['キャリーケース柄 × 缶バッジ白', 'キャリーケース柄 × 缶バッジ黒', 'ステッカー柄 × 缶バッジ白', 'ステッカー柄 × 缶バッジ黒'],
    lead: 'ポーチにも、小物入れにも。',
    desc: 'FUK COFFEEの缶バッジ付き、オーガニックコットンの巾着です。ポーチや小物入れとしてお使いいただけます。プレゼントにもおすすめです。',
    spec: [['巾着サイズ', '横 約14cm × 縦 約19cm'], ['缶バッジ', '約3cm']]
  },
  {
    id: 'tote', cat: 'goods', img: P_IMG + 'tote.jpg',
    name: 'TOTE BAG', jp: '＜ニシクボサユリデザイン＞トートバッグ（マチ付き）',
    unit: '1個', price: 3800, tags: ['トートバッグ'],
    lead: 'マチ付きで、毎日使える。',
    desc: 'ニシクボサユリさんデザインの、マチ付きトートバッグです。',
    spec: []
  },
  {
    id: 'keyholder', cat: 'goods', img: P_IMG + 'keyholder.jpg',
    name: 'TAG KEY HOLDER', jp: 'FUK COFFEE タグキーホルダー',
    unit: '1個', price: 980, tags: ['キーホルダー'],
    lead: '手荷物タグのような、キーホルダー。',
    desc: 'FUK COFFEEオリジナルのタグキーホルダーです。',
    spec: []
  },
  {
    id: 'hoodie', cat: 'apparel', img: P_IMG + 'hoodie.jpg',
    name: 'TAKE OFF HOODIE', jp: '＜OSAMUデザイン＞TAKE OFF パーカー',
    unit: '1着', price: 9500, tags: ['パーカー'],
    lead: 'TAKE OFF シリーズのパーカー。',
    desc: 'OSAMUさんデザインの TAKE OFF パーカーです。',
    spec: []
  },
  {
    id: 'longsleeve', cat: 'apparel', img: P_IMG + 'longsleeve.jpg',
    name: 'TAKE OFF LONG SLEEVE TEE', jp: '＜OSAMUデザイン＞TAKE OFF ロングスリーブTシャツ',
    unit: '1着', price: 7500, tags: ['ロングスリーブ'],
    lead: 'TAKE OFF シリーズのロングスリーブ。',
    desc: 'OSAMUさんデザインの TAKE OFF ロングスリーブTシャツです。',
    spec: []
  },
  {
    id: 'tee-takeoff', cat: 'apparel', img: P_IMG + 'tee-takeoff.jpg',
    name: 'TAKE OFF TEE', jp: '＜OSAMUデザイン＞TAKE OFF Tシャツ',
    unit: '1着', price: 6000, tags: ['Tシャツ'],
    lead: 'TAKE OFF シリーズのTシャツ。',
    desc: 'OSAMUさんデザインの TAKE OFF Tシャツです。',
    spec: []
  },
  {
    id: 'tee-original', cat: 'apparel', img: P_IMG + 'tee-original.jpg',
    name: 'ORIGINAL TEE', jp: 'FUK COFFEE オリジナル Tシャツ',
    unit: '1着', price: 5500, tags: ['Tシャツ'],
    lead: 'FUK COFFEE の定番Tシャツ。',
    desc: 'FUK COFFEE オリジナルのTシャツです。',
    spec: []
  }
];

const CATEGORIES = [
  { id: 'all', label: 'ALL', jp: 'すべて' },
  { id: 'coffee', label: 'COFFEE', jp: 'コーヒー豆' },
  { id: 'gift', label: 'GIFT', jp: 'ギフト' },
  { id: 'goods', label: 'GOODS', jp: 'グッズ' },
  { id: 'apparel', label: 'APPAREL', jp: 'アパレル' }
];

/* ---------- ドリップバッグのラインナップ（現行サイト fuk-coffee.com/dripbag の内容） ---------- */
const DRIPBAGS = [
  { gate: '01', name: 'TRANSIT BLEND', roast: 'City Roast', img: D_IMG + 'gate01.png', tags: ['ナッツ', '柑橘', 'ブドウの甘み'],
    desc: 'エルサルバドルとコスタリカの豆を使ったオリジナルブレンド。バランスの取れた味わいと、心地よい余韻。' },
  { gate: '02', name: '3 LETTER BLEND', roast: 'Fullcity Roast', img: D_IMG + 'gate02.png', tags: ['深煎り'], soon: true,
    desc: '現在準備中です。' },
  { gate: '03', name: 'EL SALVADOR', roast: 'City Roast', img: D_IMG + 'gate03.png', tags: ['アーモンド', '柑橘'],
    desc: '4世代続くカフェノルの豆。香ばしいアーモンドの風味と、やわらかく広がる柑橘の香り。' },
  { gate: '04', name: 'COSTA RICA', roast: 'Cinnamon Roast', img: D_IMG + 'gate04.png', tags: ['ブドウ', 'マカダミアナッツ'],
    desc: 'ヴォルカン・アズールの豆。フレッシュなブドウのような香りと、ほんのりマカダミアナッツ。' }
];

/* ---------- 送料（仮） ---------- */
const DEFAULT_SHIPPING = { fee: 600, freeOver: 8000 };

/* ---------- OEMの料金設定（すべて仮の金額・税別） ---------- */
const DEFAULT_OEM = {
  lots: [
    { qty: 100, unit: 140 },
    { qty: 300, unit: 120 },
    { qty: 500, unit: 105 },
    { qty: 1000, unit: 92 },
    { qty: 3000, unit: 82 }
  ],
  beans: [
    { id: 'fuk-blend', code: 'FUK', label: 'FUKのブレンドを使う', note: '店で出している TRANSIT BLEND などから選ぶ', add: 0, setup: 0 },
    { id: 'fuk-single', code: 'SGL', label: 'FUKのシングルオリジンを使う', note: 'エルサルバドル／コスタリカなど', add: 10, setup: 0 },
    { id: 'bring', code: 'BYO', label: '自店の焙煎豆を持ち込む', note: 'ロースター様向け。充填と包装だけお任せ', add: -25, setup: 0 },
    { id: 'original', code: 'NEW', label: 'オリジナルブレンドを開発する', note: '味の方向を伺い、試作して決める', add: 15, setup: 30000 }
  ],
  grams: [
    { id: 'g10', label: '10g', note: '標準', add: 0 },
    { id: 'g12', label: '12g', note: 'しっかり濃いめ', add: 8 }
  ],
  colors: [
    { id: 'white', label: 'ホワイト' },
    { id: 'black', label: 'ブラック' },
    { id: 'kraft', label: 'クラフト' }
  ],
  packs: [
    { id: 'plain', label: '無地の袋', note: 'そのまま、または自店でシール貼り', add: 0, setup: 0, min: 100 },
    { id: 'label', label: 'ラベルシール貼り', note: 'データ入稿でOK。小ロット向き', add: 12, setup: 0, min: 100 },
    { id: 'print', label: 'オリジナル印刷の袋', note: '袋そのものに印刷。1,000袋から', add: 18, setup: 30000, min: 1000 }
  ],
  leadTime: 'デザイン確定から約3〜4週間'
};

/* ---------- 実際に使う値を決める ----------
   優先順位： ①管理画面で編集中の内容（このブラウザ内） → ②published.js → ③上の初期値 */
const FUK_DEFAULTS = { products: DEFAULT_PRODUCTS, oem: DEFAULT_OEM, shipping: DEFAULT_SHIPPING };
const FUK_SAVED = (() => { try { return JSON.parse(localStorage.getItem('fuk_admin_data')); } catch { return null; } })();
const FUK_ACTIVE = FUK_SAVED || window.FUK_PUBLISHED || FUK_DEFAULTS;
const PRODUCTS = FUK_ACTIVE.products || DEFAULT_PRODUCTS;
const OEM = FUK_ACTIVE.oem || DEFAULT_OEM;
const SHIPPING = FUK_ACTIVE.shipping || DEFAULT_SHIPPING;

/* ---------- 注文・見積の送信先 ----------
   空のままだと「デモモード」（送信内容をブラウザ内に保存するだけ）で動きます。
   本番では、受注を受け取るAPIやフォームサービスのURLを入れてください。 */
const ENDPOINT = { order: '', oem: '' };
