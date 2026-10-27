export type SceneId='wave'|'hug'|'sit'|'listen'|'blanket'|'tea'|'stretch'|'breathe'|'flower'|'garden'|'stars'|'book'|'rain'|'boat'|'bubbles'|'celebrate'|'pet'|'visit'|'gratitude'|'lantern';
export type Scene={id:SceneId;title:string;hint:string;group:string;film:'welcome'|'embrace'|'garden'|'night'|'bird'|'rabbit';line:string;choices:[string,string,string];replies:[string,string,string];mode?:'bubbles'|'stars'|'garden'|'boat'|'breath'|'light'};
export const companionScenes:Scene[]=[
{id:'wave',title:'和大家打招呼',hint:'Boris 揮手，鸛鸛也回應你',group:'想被陪伴',film:'welcome',line:'很高興你來了。今天的你，也有位置。',choices:['我來了','今天想慢一點','只想看看你們'],replies:['歡迎回來。先坐穩，不用急着說甚麼。','那就慢一點。我們不用趕着去下一站。','看看也很好。我們就待在這裏。']},
{id:'hug',title:'想要抱抱',hint:'三位朋友靠近，留一個溫暖的位置',group:'想被陪伴',film:'embrace',line:'送你一個輕輕的抱抱。不用先把自己整理好。',choices:['再抱一會','坐近一點就好','今天不想被碰'],replies:['好，這一刻不用趕着結束。','就留一點舒服的距離，安靜陪你。','好呀。你的距離，由你決定。']},
{id:'sit',title:'陪我坐一會',hint:'沒有倒數，沒有要完成的事',group:'想被陪伴',film:'embrace',line:'甚麼也不做，也可以在這裏坐一會。',choices:['一起安靜','想聽一句鼓勵','想自己待一會'],replies:['好，我們把聲音放輕一點。','今天不用表現得很好，也值得被愛。','可以的。想回來時，這個位置仍然在。']},
{id:'listen',title:'今天有點難',hint:'不用解釋，也不急着給建議',group:'想被陪伴',film:'embrace',line:'如果今天有點難，不用急着把它說成沒事。',choices:['不想說原因','想被肯定一下','陪我就好'],replies:['不用說原因。你可以保留自己的故事。','願意照顧自己的感受，已經值得被溫柔對待。','好。先不找答案，陪你待一會。']},
{id:'blanket',title:'拿一張小毯子',hint:'把柔軟的毯子放在身旁',group:'想放鬆',film:'night',line:'小毯子放在這裏。想用時再拿，不用客氣。',choices:['想暖一點','先放身旁','今天不需要'],replies:['讓肩膀找個舒服的位置，慢慢來。','好，就放在伸手可及的地方。','也很好。你最清楚現在想要甚麼。']},
{id:'tea',title:'窗邊茶時間',hint:'碰一碰杯子，看熱氣慢慢散開',group:'想放鬆',film:'night',line:'留一點不趕時間的空白，給現在的自己。',choices:['想看窗外','想聽好說話','一起坐着'],replies:['讓眼前的風景，陪你休息片刻。','你不需要用忙碌，證明自己的價值。','好。這段時間，不需要交代成果。'],mode:'light'},
{id:'stretch',title:'舒展一下',hint:'如果舒服，輕輕放鬆肩膀',group:'想放鬆',film:'welcome',line:'如果你想，可以換個舒服的姿勢；不想動也沒關係。',choices:['想放鬆肩膀','只看看就好','今天想休息'],replies:['只做自己覺得舒服的幅度，不用勉強。','看看角色的小動作，也是一種休息。','休息也很好，沒有欠下甚麼。']},
{id:'breathe',title:'跟花朵慢下來',hint:'碰花朵，跟着一次緩慢開合',group:'想放鬆',film:'garden',line:'可以看着花朵，讓呼吸照自己的節奏來。',choices:['跟着看一會','想再看一次','今天不想做'],replies:['不用深呼吸或屏息，只要舒服就好。','好，再看一次花朵慢慢開合。','當然可以。陪伴不需要先做練習。'],mode:'breath'},
{id:'flower',title:'送你一束花',hint:'自己選擇今天的小花顏色',group:'小小心意',film:'garden',line:'這一束花，送給平凡而珍貴的今天。',choices:['杏色小花','粉色小花','奶油白小花'],replies:['杏色像一點暖暖的陽光，輕輕陪着你。','把柔和的粉色，留在今天的小角落。','留一束安靜的小白花，甚麼也不用說。'],mode:'garden'},
{id:'garden',title:'一起照顧小花',hint:'碰花盆，小花便慢慢綻放',group:'一起玩',film:'garden',line:'小花有自己的節奏，你也一樣。',choices:['看看它開花','想再看一次','今天就到這裏'],replies:['慢慢盛開，也很美。','可以呀，喜歡的片刻可以再來一次。','好，小花會好好待着，不用擔心它。'],mode:'garden'},
{id:'stars',title:'連起三顆星',hint:'輕碰星星，留下一個小星座',group:'一起玩',film:'night',line:'今晚不需要找到方向，先看看眼前的小星光。',choices:['想看看星座','想聽一句鼓勵','先安靜看着'],replies:['隨意碰星星就好，沒有正確次序。','就算今天沒有很亮，也不代表你失去了光。','讓星星陪我們安靜一會。'],mode:'stars'},
{id:'book',title:'翻開一頁好說話',hint:'碰一碰小書，翻到下一句',group:'小小心意',film:'night',line:'你不必每天都前進。停下來，也仍然是你。',choices:['再讀一句','想把這句放在心裏','今天讀到這裏'],replies:['有些日子只要好好過完，就已經足夠。','願這句話，成為今天一點柔軟的空間。','好，把書輕輕合上。下次再讀。']},
{id:'rain',title:'聽雨的小窗',hint:'碰窗邊，讓一陣小雨慢慢落下',group:'想放鬆',film:'night',line:'外面有雨也沒關係。先在這個小角落歇歇。',choices:['想看雨滴','想要小毯子','想安靜一下'],replies:['看它們落下，不必急着把心情變晴。','柔軟的小毯子在這裏。','好，這段安靜留給你。'],mode:'light'},
{id:'boat',title:'放一隻紙船',hint:'輕碰紙船，看它慢慢向前',group:'一起玩',film:'garden',line:'讓小紙船先走一步。我們不用急着跟上。',choices:['讓它出發','再放一隻','今天停在岸邊'],replies:['一路慢慢走，也可以到達。','這一次，換一個喜歡的顏色。','停在岸邊看看風景，也很好。'],mode:'boat'},
{id:'bubbles',title:'輕碰小泡泡',hint:'三個泡泡，想碰哪個都可以',group:'一起玩',film:'garden',line:'留一個沒有目的的小小遊戲，給自己。',choices:['再來幾個','想慢慢看','今天玩夠了'],replies:['再來一次，沒有分數也沒有輸贏。','它們可以靜靜待着，毋須全部碰完。','好，喜歡的時候再來。'],mode:'bubbles'},
{id:'celebrate',title:'一件小小好事',hint:'不用是大事，也值得留意',group:'小小心意',film:'welcome',line:'如果今天有一件小小好事，我們陪你珍惜它。',choices:['好好休息過','有個舒服的片刻','今天未想到'],replies:['休息的片刻，也值得被好好記住。','那就讓這份舒服，在心裏多留一會。','沒關係，不用勉強找一件好事交功課。']},
{id:'pet',title:'摸摸小兔',hint:'小兔靠近，耳朵輕輕回應',group:'想被陪伴',film:'rabbit',line:'小兔靠近了一點。陪伴可以很安靜。',choices:['摸摸耳朵','讓牠坐近一點','留一點距離'],replies:['小兔輕輕歪頭，很喜歡這份溫柔。','好，就一起坐在柔軟的小地毯上。','沒問題。舒服的距離，也是一種親近。']},
{id:'visit',title:'鸛鸛來探望',hint:'你熟悉的公仔，也在小屋裏',group:'想被陪伴',film:'bird',line:'鸛鸛輕輕揮翼，把熟悉的陪伴帶來。',choices:['打個招呼','一起坐下','想要一朵花'],replies:['牠也向你揮揮翼。很高興見到你。','在 Boris 旁邊，留一個舒服的位置。','讓小花，陪你度過這個平凡的片刻。']},
{id:'gratitude',title:'留意一點溫柔',hint:'可以留意，也可以略過',group:'小小心意',film:'garden',line:'今天有沒有一點點，讓你感到舒服或被照顧？',choices:['陽光或微風','有人陪伴','今天想不到'],replies:['有些溫柔很小，但仍然值得停留。','願這份陪伴，讓你不用獨自撐着。','想不到也沒關係，不用勉強感恩。']},
{id:'lantern',title:'點亮一盞小燈',hint:'碰燈一下，留一點暖光',group:'想放鬆',film:'night',line:'不必照亮整條路。一點點暖光，也可以陪你。',choices:['想亮一點','柔和一點就好','想把燈關上'],replies:['留一盞暖燈，陪現在的你。','好，把光放輕，不用太耀眼。','可以呀。休息的時候，不需要繼續發光。'],mode:'light'},
];
export const sceneGroups=['想被陪伴','想放鬆','一起玩','小小心意'];
export const companionLabels=Object.fromEntries(companionScenes.map(s=>[s.id,s.line]));
