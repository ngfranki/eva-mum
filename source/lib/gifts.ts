export const recipients=[{id:'bird',name:'鸛鸛',position:0},{id:'boris',name:'Boris',position:50},{id:'rabbit',name:'小兔',position:100}] as const;
export type Recipient=typeof recipients[number]['id'];
export type Reaction='jump'|'float'|'bounce'|'dance'|'snuggle'|'sparkle';
export const giftGroups=['小小心意','甜甜時光','一起玩','舒舒服服','花園奇遇'] as const;
export type Gift={id:string;name:string;icon:string;group:typeof giftGroups[number];color:string;reaction:Reaction;line:string};
export const gifts:Gift[]=[
 ['heart','愛心','Heart',0,'#e5a4a3','jump','一點心意，也能帶來大大的歡喜。'],
 ['flowers','小花束','Flower2',0,'#edb692','sparkle','把這份溫柔，也留一點給自己。'],
 ['balloon','心形氣球','Heart',0,'#e9b9cb','float','輕飄飄的快樂，今天也可以擁有。'],
 ['letter','小情書','Mail',0,'#f0d7b2','snuggle','有些心意，不用很多字。'],
 ['ribbon','蝴蝶結','Ribbon',0,'#dfa0b5','dance','平凡的日子，也可以打個漂亮的結。'],
 ['star','小星星','Star',0,'#efd189','sparkle','小小的光，已經很美。'],
 ['cake','小蛋糕','CakeSlice',1,'#edb6b1','jump','不用等特別的日子，才可以開心。'],
 ['cookie','曲奇','Cookie',1,'#d6b084','bounce','留一口甜，也留一刻輕鬆。'],
 ['berry','小莓果','Cherry',1,'#d99698','dance','小小的相聚，剛剛好。'],
 ['tea','暖暖茶','CupSoda',1,'#bfd1ad','snuggle','慢慢坐，茶還暖着。'],
 ['honey','蜂蜜罐','Amphora',1,'#e8bf70','jump','願今天有一點柔柔的甜。'],
 ['icecream','雪糕','IceCreamBowl',1,'#edc3c0','bounce','享受這一小刻，就很好。'],
 ['ball','彩色小球','Volleyball',2,'#ddad8a','bounce','一起彈幾下，沒有輸贏。'],
 ['kite','小風箏','Diamond',2,'#a9c9c2','float','讓小風箏，帶着心意兜個圈。'],
 ['bubbles','泡泡棒','Bubbles',2,'#b7d2db','float','一顆泡泡，就是一點小驚喜。'],
 ['music','小音樂盒','Music2',2,'#c5b3d3','dance','沒有聲音，也能一起跳一小段舞。'],
 ['boat','小紙船','Sailboat',2,'#d6c59e','bounce','慢慢玩，不需要趕到哪裏。'],
 ['pinwheel','小風車','Fan',2,'#e8ae96','dance','一點微風，就有一點歡喜。'],
 ['blanket','小毯子','Layers',3,'#b7c5a7','snuggle','休息，也是一份值得收下的禮物。'],
 ['pillow','軟枕頭','Cloud',3,'#d7c0d8','snuggle','今天累了，可以舒服地靠一會。'],
 ['book','繪本','BookOpen',3,'#b4c4a0','snuggle','不急着翻到下一頁。'],
 ['scarf','小頸巾','Waves',3,'#e3b19a','dance','把暖暖的心意，輕輕圍起來。'],
 ['moon','月亮燈','Moon',3,'#ead395','float','今天做到這裏，也可以休息。'],
 ['sock','暖襪子','Footprints',3,'#d7b7a3','bounce','暖暖的腳，慢慢走就好。'],
 ['sunflower','向日葵','Sun',4,'#ebc67f','jump','願你也遇見一點暖暖的光。'],
 ['clover','小葉子','Clover',4,'#abc2a0','dance','留意一點綠，也是一種小享受。'],
 ['mushroom','小蘑菇','Sprout',4,'#d5a78f','bounce','小小世界，藏着意想不到的可愛。'],
 ['rainbow','小彩虹','Rainbow',4,'#d3b6cc','float','把今天，添上一點柔和的顏色。'],
 ['shell','小貝殼','Shell',4,'#e5c6ba','snuggle','把海邊的寧靜，留在這一刻。'],
 ['snow','小雪花','Snowflake',4,'#bfd4dc','sparkle','每一份小心意，都有自己的樣子。'],
].map(([id,name,icon,group,color,reaction,line])=>({id,name,icon,group:giftGroups[Number(group)],color,reaction,line})) as Gift[];
export function reactionFor(gift:Gift,recipient:Recipient):Reaction{
 if(recipient==='bird'&&['jump','sparkle'].includes(gift.reaction))return 'float';
 if(recipient==='rabbit'&&gift.reaction==='jump')return 'bounce';
 return gift.reaction;
}
export const reactionNames:Record<Reaction,string>={jump:'開心得跳起來',float:'輕輕飛起，再慢慢落下',bounce:'開心地彈了幾下',dance:'搖搖擺擺跳了一段舞',snuggle:'把心意抱近，舒服地晃一晃',sparkle:'開心得伸展身子，亮起小星光'};
export function hitRecipient(x:number,y:number,boxes:{id:Recipient;left:number;right:number;top:number;bottom:number}[]):Recipient|null{
 return boxes.find(b=>x>=b.left&&x<=b.right&&y>=b.top&&y<=b.bottom)?.id??null;
}
