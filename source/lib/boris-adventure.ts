import {sceneFor,ADVENTURE_SCENES} from './adventure-scenes';
export const AW=480,AH=480,FLOOR=454;
export type Platform={x:number;y:number;w:number};
export type Actor={x:number;y:number;vx:number;vy:number;ground:boolean};
export type Foe=Actor&{id:number;dir:number;mode:'walk'|'trapped'|'gone';clock:number;boss?:boolean;hp?:number;maxHp?:number;hitUntil?:number};
export type Orb={id:number;x:number;y:number;vx:number;age:number;foe:number|null};
export type Treat={id:number;x:number;y:number;vy:number;age:number};
export type Input={left:boolean;right:boolean;jump:boolean;blow:boolean;fire:boolean;targetX?:number};
export type World={level:number;time:number;hero:Actor;face:number;shield:number;cooldown:number;platforms:Platform[];foes:Foe[];orbs:Orb[];treats:Treat[];score:number;popped:number;clear:boolean;message:string;serial:number};
export const emptyInput=():Input=>({left:false,right:false,jump:false,blow:false,fire:false});
const layouts:Platform[][]=[
 [{x:20,y:356,w:170},{x:285,y:356,w:175},{x:140,y:258,w:200},{x:30,y:160,w:150},{x:300,y:160,w:150}],
 [{x:120,y:356,w:240},{x:15,y:260,w:150},{x:315,y:260,w:150},{x:150,y:160,w:180}],
 [{x:20,y:360,w:135},{x:190,y:330,w:115},{x:340,y:360,w:120},{x:75,y:235,w:155},{x:285,y:235,w:165},{x:175,y:140,w:140}],
 [{x:15,y:357,w:195},{x:275,y:357,w:190},{x:110,y:260,w:260},{x:10,y:160,w:140},{x:325,y:160,w:145}],
 [{x:150,y:355,w:180},{x:10,y:260,w:145},{x:320,y:260,w:150},{x:145,y:160,w:180}],
 [{x:10,y:355,w:150},{x:300,y:355,w:165},{x:150,y:255,w:180},{x:15,y:155,w:130},{x:335,y:155,w:130}],
 [{x:15,y:358,w:125},{x:335,y:358,w:130},{x:165,y:267,w:130},{x:20,y:168,w:115},{x:340,y:168,w:125},{x:172,y:75,w:130}],
];
export function createWorld(level=1,score=0):World{
 if(!Number.isInteger(level)||level<1||level>ADVENTURE_SCENES.length)throw new Error('Invalid scene');
 const scene=sceneFor(level);
 const platforms=[...layouts[level-1],{x:0,y:FLOOR,w:AW}];
 const spots=Array.from({length:scene.count},(_,i)=>platforms[i%(platforms.length-1)]);
 return {level,time:0,hero:{x:55,y:FLOOR,vx:0,vy:0,ground:true},face:1,shield:1.5,cooldown:0,platforms,foes:spots.map((p,i)=>({id:i,x:p.x+p.w*(i>=platforms.length-1?.28:.65),y:p.y,vx:0,vy:0,ground:true,dir:i%2?-1:1,mode:'walk',clock:i*.7,boss:i===0,hp:i===0?2+Math.ceil(level/2):1,maxHp:i===0?2+Math.ceil(level/2):1,hitUntil:0})),orbs:[],treats:[],score,popped:0,clear:false,message:'左右拖曳移動；跳躍和吹泡泡請按右邊按鈕。',serial:0};
}
function move(a:Actor,dt:number,platforms:Platform[],half:number){const old=a.y;a.vy+=830*dt;a.x=Math.max(half,Math.min(AW-half,a.x+a.vx*dt));a.y+=a.vy*dt;a.ground=false;if(a.vy>=0){for(const p of [...platforms].sort((a,b)=>a.y-b.y))if(old<=p.y+.1&&a.y>=p.y&&a.x+half>p.x&&a.x-half<p.x+p.w){a.y=p.y;a.vy=0;a.ground=true;break;}}}
export function popOrb(w:World,orb:Orb){if(orb.foe===null)return false;const foe=w.foes.find(f=>f.id===orb.foe);if(!foe||foe.mode!=='trapped')return false;foe.mode='gone';w.popped++;w.score+=100;w.treats.push({id:++w.serial,x:orb.x,y:orb.y,vy:-85,age:0});w.orbs=w.orbs.filter(b=>b.id!==orb.id);w.message=w.popped===w.foes.length?'小怪都化成星光了！可以繼續收集花朵，再去下一關。':'啪！泡泡變成一朵小花，過去收下吧。';return true;}
// Fixed small steps prevent tunnelling and keep phone refresh rates equivalent.
export function stepWorld(w:World,input:Input,dt:number){
 const scene=sceneFor(w.level);
 dt=Math.max(0,Math.min(dt,1/30));w.time+=dt;w.shield=Math.max(0,w.shield-dt);w.cooldown=Math.max(0,w.cooldown-dt);
 const h=w.hero;h.vx=typeof input.targetX==='number'?(Math.abs(input.targetX-h.x)<3?0:Math.sign(input.targetX-h.x)*Math.min(190,Math.abs(input.targetX-h.x)/dt)):(Number(input.right)-Number(input.left))*160;if(h.vx)w.face=Math.sign(h.vx);
 if(input.jump&&h.ground){h.vy=-430;h.ground=false;}input.jump=false;
 move(h,dt,w.platforms,15);
 if((input.blow||input.fire)&&w.cooldown===0){
  const close=w.orbs.find(b=>b.foe!==null&&Math.hypot(b.x-h.x,b.y-(h.y-25))<82);
  if(close)popOrb(w,close);else if(w.orbs.length<14)w.orbs.push({id:++w.serial,x:h.x+w.face*25,y:h.y-25,vx:w.face*225,age:0,foe:null});
  w.cooldown=.3;
 }
 input.fire=false;
 for(const f of w.foes){if(f.mode!=='walk')continue;f.clock+=dt;
  const p=w.platforms.find(p=>Math.abs(p.y-f.y)<1&&f.x>=p.x&&f.x<=p.x+p.w);
  if(f.x<=16||f.x>=AW-16||(p&&(f.x+f.dir*17<p.x||f.x+f.dir*17>p.x+p.w)))f.dir*=-1;
  f.vx=f.dir*scene.speed;
  if(scene.hop>0&&f.ground&&f.clock>scene.hop){f.clock=0;f.vy=-305;}
  move(f,dt,w.platforms,13);
  if(!w.shield&&Math.abs(f.x-h.x)<25&&Math.abs(f.y-h.y)<32){h.x=55;h.y=FLOOR;h.vy=0;h.ground=true;w.shield=2;w.message='Boris 站穩了，再試一次。已收集的星光會保留。';}
 }
 for(const b of [...w.orbs]){
  b.age+=dt;
  if(b.foe===null){b.x+=b.vx*dt;b.vx*=Math.pow(.42,dt);if(b.age>.6)b.y-=34*dt;if(b.x<15||b.x>AW-15){b.x=Math.max(15,Math.min(AW-15,b.x));b.vx*=-.5;}
   const f=w.foes.find(f=>f.mode==='walk'&&Math.hypot(f.x-b.x,f.y-16-b.y)<30);
   if(f&&(f.hitUntil||0)<=w.time){if((f.hp||1)>1){f.hp!--;f.hitUntil=w.time+.45;w.orbs=w.orbs.filter(x=>x.id!==b.id);w.message=`大泡泡朋友還需要 ${f.hp} 次命中，慢慢瞄準。`;continue;}f.mode='trapped';b.foe=f.id;b.age=0;b.vx=0;w.message='困住了！靠近碰破，或再按吹泡泡。';}
  }else{
   b.y=Math.max(64,b.y-25*dt);b.x=Math.max(22,Math.min(AW-22,b.x+Math.sin(w.time*1.6+b.id)*scene.drift*dt));
   if(Math.hypot(b.x-h.x,b.y-(h.y-25))<40){popOrb(w,b);continue;}
   if(b.age>scene.escape){const f=w.foes.find(f=>f.id===b.foe);if(f){f.mode='walk';f.x=b.x;f.y=b.y+15;f.vy=0;}w.orbs=w.orbs.filter(x=>x.id!==b.id);w.message='小怪溜出來了，再吹一個泡泡就好。';}
  }
 }
 w.orbs=w.orbs.filter(b=>b.foe!==null||b.age<3.5);
 for(const t of w.treats){t.age+=dt;t.vy+=390*dt;t.y=Math.min(FLOOR-12,t.y+t.vy*dt);if(Math.hypot(t.x-h.x,t.y-(h.y-20))<36){w.score+=50;t.age=99;}}
 w.treats=w.treats.filter(t=>t.age<12);
 w.clear=w.foes.every(f=>f.mode==='gone');
 return w;
}
