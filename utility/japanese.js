/*****************************************************************************

  日本語処理

  convertKana(string src,string options = 'Krn')

  options: デフォルトは Krn: 半角カナは全角に、全角英数は半角英数
   k,K : 半角カナ <=> 全角カナ
   n,N : 半角数字 <=> 全角数字
   r,R : 半角英字 <=> 全角英字
   s,S : 半角記号 <=> 全角記号

*****************************************************************************/
import  * as Type  from './type.js';

export function isHirakana(str)
{
  return !!str.match(reHirakana);
}

export function convertKana(s,options = 'Krn')
{
  if(!s || !Type.isString(s))
    return;

  if(Type.isString(options))
    options = options.replace(/[^krns]/ig,'');

  return options.split('').reduce((rv,option) => converts.get(option).call(null,rv),s);
}

////////////////////////////////////////////////////////////////////////////////////

// ひらがな？
const reHirakana = /[\u3040-\u309Fー－～―]/;

// 英数字
const reZenkakuWord = /[Ａ-Ｚａ-ｚ]/g;
const reHankakuWord = /[A-Za-z]/g;
const reZenkakuNumber = /[０-９]/g;
const reHankakuNumber = /[0-9]/g;

const convert = (c,v) =>  String.fromCharCode(c.charCodeAt(0) + v);


// カタカナ
// ------------------------------------------------------------------
const zenkanaMap = new Map([
  ['ガ', 'ｶﾞ'],['ギ','ｷﾞ'],['グ','ｸﾞ'],['ゲ','ｹﾞ'], ['ゴ','ｺﾞ'],
  ['ザ', 'ｻﾞ'],['ジ','ｼﾞ'],['ズ','ｽﾞ'],['ゼ','ｾﾞ'], ['ゾ','ｿﾞ'],
  ['ダ', 'ﾀﾞ'],['ヂ','ﾁﾞ'],['ヅ','ﾂﾞ'],['デ','ﾃﾞ'], ['ド','ﾄﾞ'],
  ['バ', 'ﾊﾞ'],['ビ','ﾋﾞ'],['ブ','ﾌﾞ'],['ベ','ﾍﾞ'], ['ボ','ﾎﾞ'],
  ['パ', 'ﾊﾟ'],['ピ','ﾋﾟ'],['プ','ﾌﾟ'],['ペ','ﾍﾟ'], ['ポ','ﾎﾟ'],
  ['ヴ', 'ｳﾞ'],['ヷ','ﾜﾞ'],['ヺ','ｦﾞ'],
  ['ア', 'ｱ',],['イ','ｲ'],['ウ','ｳ'],['エ','ｴ'],['オ','ｵ'],
  ['カ', 'ｶ',],['キ','ｷ'],['ク','ｸ'],['ケ','ｹ'],['コ','ｺ'],
  ['サ', 'ｻ',],['シ','ｼ'],['ス','ｽ'],['セ','ｾ'],['ソ','ｿ'],
  ['タ', 'ﾀ',],['チ','ﾁ'],['ツ','ﾂ'],['テ','ﾃ'],['ト','ﾄ'],
  ['ナ', 'ﾅ',],['ニ','ﾆ'],['ヌ','ﾇ'],['ネ','ﾈ'],['ノ','ﾉ'],
  ['ハ', 'ﾊ',],['ヒ','ﾋ'],['フ','ﾌ'],['ヘ','ﾍ'],['ホ','ﾎ'],
  ['マ', 'ﾏ',],['ミ','ﾐ'],['ム','ﾑ'],['メ','ﾒ'],['モ','ﾓ'],
  ['ヤ', 'ﾔ',],['ユ','ﾕ'],['ヨ','ﾖ'],
  ['ラ', 'ﾗ',],['リ','ﾘ'],['ル','ﾙ'],['レ','ﾚ'],['ロ','ﾛ'],
  ['ワ', 'ﾜ',],['ヲ','ｦ'],['ン','ﾝ'],
  ['ァ', 'ｧ',],['ィ','ｨ'],['ゥ','ｩ'],['ェ','ｪ'],['ォ','ｫ'],
  ['ッ', 'ｯ',],['ャ','ｬ'],['ュ','ｭ'],['ョ','ｮ'],
  ['。', '｡',],['、','､'],['ー','ｰ'],['「','｢'],['」','｣'],['・','･']
]);

const hankanaMap = new Map;
for(const [z,h] of zenkanaMap.entries())
  hankanaMap.set(h,z);

const reZenkakuKana = new RegExp(`[${Array.from(zenkanaMap.keys()).join('')}]`,'g');
const reHankakuKana = new RegExp(`[${Array.from(zenkanaMap.values()).join('')}]`,'g');


// 記号
// ------------------------------------------------------------------
const hanSymMap = new Map([
  ['`','‘'],['~','～'],['!','！'],['#','＃'],['$','＄'],['%','％'],['^','＾'],['&','＆'],
  ['*','＊'],['(','（'],[')','）'],['+','＋'],['-','‐'],['=','＝'],['_','＿'],['|','｜'],
  ['\\','￥'],['}','｝'],['{','｛'],['[','［'],[']','］'],[',','，'],['.','．'],['/','／'],
  ['?','？'],['>','＞'],['<','＜'],['\'','’'],['"','”'],[':','：'],[';','；'],[' ','　']
]);

const zenSymMap = new Map;
for(const [h,z] of hanSymMap.entries())
  zenSymMap.set(z,h);

const reHankakuSymbol = new RegExp(`[${Array.from(hanSymMap.keys()).map(k => '\\'+k).join('')}]`,'g');
const reZenkakuSymbol = new RegExp(`[${Array.from(hanSymMap.values()).join('')}]`,'g');


// 関数
// ------------------------------------------------------------------
const converts = new Map([
  ['r',str => str.replace(reZenkakuWord,m => convert(m,-0xFEE0))],
  ['R',str => str.replace(reHankakuWord,m => convert(m,+0xFEE0))],
  ['n',str => str.replace(reZenkakuNumber,m => convert(m,-0xFEE0))],
  ['N',str => str.replace(reHankakuNumber,m => convert(m,+0xFEE0))],
  ['k',str => str.replace(reZenkakuKana,m => zenkanaMap.get(m.charAt(0)))],
  ['K',str => str.replace(reHankakuKana,m => hankanaMap.get(m.charAt(0)))],
  ['s',str => str.replace(reZenkakuSymbol,m => zenSymMap.get(m.charAt(0)))],
  ['S',str => str.replace(reHankakuSymbol,m => hanSymMap.get(m.charAt(0)))]
]);
