// Deterministic hex-grid physics shared by the aiming guide and actual shot.
export type Bubble={row:number;col:number;kind:number};
export type Point={x:number;y:number};
export const WIDTH=320,R=18,STEP=Math.sqrt(3)*R,LAUNCH={x:160,y:405},MAX_ROW=10;
export const center=(b:Pick<Bubble,'row'|'col'>):Point=>({x:25+b.col*36+(b.row%2)*18,y:24+b.row*STEP});
export const valid=(row:number,col:number)=>row>=0&&row<=MAX_ROW&&col>=0&&col<(row%2?7:8);
export const key=(b:Pick<Bubble,'row'|'col'>)=>`${b.row}:${b.col}`;
export function neighbors(b:Pick<Bubble,'row'|'col'>){const out:{row:number;col:number}[]=[];for(let row=b.row-1;row<=b.row+1;row++)for(let col=b.col-1;col<=b.col+1;col++)if(valid(row,col)&&(row!==b.row||col!==b.col)&&Math.hypot(center({row,col}).x-center(b).x,center({row,col}).y-center(b).y)<37)out.push({row,col});return out;}
export const BUBBLE_LEVELS=[{name:"輕鬆",rows:3,colours:3},{name:"標準",rows:5,colours:4},{name:"進階",rows:7,colours:5},{name:"挑戰",rows:8,colours:5}] as const;
export function makeGarden(random= Math.random,level=1):Bubble[]{const config=BUBBLE_LEVELS[level];if(!config)throw new Error("Invalid bubble difficulty");const out:Bubble[]=[];for(let row=0;row<config.rows;row++)for(let col=0;col<(row%2?7:8);col++)out.push({row,col,kind:Math.min(config.colours-1,Math.floor(random()*config.colours))});return out;}
export function pickKind(board:Bubble[],random=Math.random){const kinds=[...new Set(board.map(b=>b.kind))];return kinds[Math.min(kinds.length-1,Math.floor(random()*kinds.length))]??0;}
export function aimAngle(p:Point){return Math.max(-1.23,Math.min(1.23,Math.atan2(p.x-LAUNCH.x,LAUNCH.y-p.y)));}
export function traceShot(board:Bubble[],angle:number){
 let {x,y}=LAUNCH;let dx=Math.sin(Math.max(-1.23,Math.min(1.23,angle))),dy=-Math.cos(Math.max(-1.23,Math.min(1.23,angle)));
 const path:Point[]=[{x,y}];let hit:Bubble|undefined;
 for(let i=0;i<900;i++){
  x+=dx*3;y+=dy*3;
  if(x<R){x=2*R-x;dx=-dx;}if(x>WIDTH-R){x=2*(WIDTH-R)-x;dx=-dx;}
  path.push({x,y});hit=board.find(b=>Math.hypot(center(b).x-x,center(b).y-y)<=R*2-.5);
  if(hit||y<=24)break;
 }
 const occupied=new Set(board.map(key));
 const candidates=hit?neighbors(hit):Array.from({length:8},(_,col)=>({row:0,col}));
 // Restrict to the collision neighbourhood: never teleport through occupied rows.
 const target=candidates.filter(b=>!occupied.has(key(b))).sort((a,b)=>Math.hypot(center(a).x-x,center(a).y-y)-Math.hypot(center(b).x-x,center(b).y-y))[0]??null;
 return {path,target};
}
export function settle(board:Bubble[],target:Pick<Bubble,'row'|'col'>,kind:number){
 if(!valid(target.row,target.col)||board.some(b=>key(b)===key(target)))throw new Error('Invalid bubble placement');
 const placed={...target,kind},all=[...board,placed],byKey=new Map(all.map(b=>[key(b),b]));
 function flood(seeds:Bubble[],same?:number){const seen=new Set<string>(),queue=[...seeds];while(queue.length){const b=queue.pop()!;if(seen.has(key(b)))continue;seen.add(key(b));for(const n of neighbors(b)){const next=byKey.get(key(n));if(next&&!seen.has(key(next))&&(same===undefined||next.kind===same))queue.push(next);}}return seen;}
 const cluster=flood([placed],kind);
 if(cluster.size<3)return {board:all,popped:[] as Bubble[],fallen:[] as Bubble[]};
 const popped=all.filter(b=>cluster.has(key(b)));for(const k of cluster)byKey.delete(k);
 const attached=flood([...byKey.values()].filter(b=>b.row===0));
 const fallen=[...byKey.values()].filter(b=>!attached.has(key(b)));
 return {board:[...byKey.values()].filter(b=>attached.has(key(b))),popped,fallen};
}
