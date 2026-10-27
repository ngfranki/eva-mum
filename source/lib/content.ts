// Chinese Union Version (Traditional), 1919/public domain. Checked 2026-10-01.
// Chapter headings are not verse text. Quotations and companion copy stay separate.
export const verses = [
{id:'mt11-28',ref:'馬太福音 11:28',query:'Matthew 11:28',text:'凡勞苦擔重擔的人可以到我這裏來，我就使你們得安息。',context:'耶穌邀請勞苦的人到祂那裏，並在下文談到學習祂的柔和謙卑。',note:'忙碌以外，也可以留一點空間給自己。'},
{id:'ps23-1',ref:'詩篇 23:1',query:'Psalm 23:1',text:'耶和華是我的牧者，我必不致缺乏。',context:'大衛以牧者的照顧，表達對神的信靠。',note:'這一刻，不用急着把所有事情做好。'},
{id:'ps23-2',ref:'詩篇 23:2',query:'Psalm 23:2',text:'他使我躺臥在青草地上，領我在可安歇的水邊。',context:'這是詩篇 23 篇牧者引導與照顧的圖像。',note:'如果願意，我們一起安靜坐一會。'},
{id:'ps46-1',ref:'詩篇 46:1',query:'Psalm 46:1',text:'神是我們的避難所，是我們的力量，是我們在患難中隨時的幫助。',context:'這首詩在動盪與患難中，宣認神是祂子民的避難所。',note:'今天有點累，也可以照自己的步伐走。'},
{id:'1pe5-7',ref:'彼得前書 5:7',query:'1 Peter 5:7',text:'你們要將一切的憂慮卸給神，因為他顧念你們。',context:'彼得勉勵處於患難的信徒，在謙卑信靠中將憂慮交託神。',note:'心裏的事情，可以慢慢說，不必急着整理好。'},
{id:'is40-29',ref:'以賽亞書 40:29',query:'Isaiah 40:29',text:'疲乏的，他賜能力；軟弱的，他加力量。',context:'先知向疲乏的百姓宣告神不疲倦，鼓勵他們等候祂。',note:'休息不是落後，是給自己一點溫柔。'},
{id:'ps118-24',ref:'詩篇 118:24',query:'Psalm 118:24',text:'這是耶和華所定的日子，我們在其中要高興歡喜！',context:'這首感恩詩回應神的拯救；並非要求人在難過時強裝開心。',note:'若今天有一件小事值得珍惜，我們可以一起記住。'},
];
export const verseUrl=(v:typeof verses[number])=>`https://www.biblegateway.com/passage/?search=${encodeURIComponent(v.query)}&version=CUV`;
export function hkDate(now:Date=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Hong_Kong',year:'numeric',month:'2-digit',day:'2-digit'}).format(now)}
export function dayNumber(d:string){return Date.parse(d+'T00:00:00Z')/86400000}
export function dailyVerse(d:string){return verses[((dayNumber(d)%verses.length)+verses.length)%verses.length]}
export const symptoms=['腹痛','腰痠','頭痛','疲倦','腹脹'] as const;
export const moods=['平靜','開心','低落','煩躁','說不上來'] as const;
export type RecordRow={kind:string;key:string;value:any;version:number;deleted:boolean;updatedAt:string};
export function periodsSummary(rows:RecordRow[]){const p=rows.filter(r=>r.kind==='period'&&!r.deleted).sort((a,b)=>a.value.start.localeCompare(b.value.start));return p.map((r,i)=>({...r,days:r.value.end?dayNumber(r.value.end)-dayNumber(r.value.start)+1:null,interval:i?dayNumber(r.value.start)-dayNumber(p[i-1].value.start):null}))}
