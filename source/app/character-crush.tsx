'use client';
import {useEffect,useRef,useState,useId,type CSSProperties} from 'react';
import {Lightbulb,Shuffle,Star,Sparkles} from 'lucide-react';
import {readGame,writeGame,finite} from '../lib/game-save';
import {SIDE,ROWS,adoptBoard,newBoard,neighbours,swap,findMove,resolveMatches,refill,type Board} from '../lib/match-three';
const names=['Boris','Miffy','鸛鸛','小獅子','大笨象'];
const boxes=['0 190 520 415','490 85 380 515','875 130 395 495','1260 175 440 420','1695 210 477 390'];
export function CharacterHead({kind}:{kind:number}){const id=useId(),[x,y,w,h]=boxes[kind].split(' ').map(Number);if(kind===3)return <img src="/eva-mum/companions/miffy-lion-v1.png" alt="" className="crush-head" draggable={false} style={{objectFit:'contain'}}/>;if(kind===4)return <img src="/eva-mum/companions/miffy-elephant-v3.png" alt="" className="crush-head" draggable={false} style={{objectFit:'contain'}}/>;return <svg viewBox={boxes[kind]} aria-hidden="true" className="crush-head"><defs><clipPath id={id}><rect x={x} y={y} width={w} height={h}/></clipPath></defs><image href="/eva-mum/companions/match-heads-v1.png" width="2172" height="724" clipPath={`url(#${id})`}/></svg>}
export function CharacterCrush({reduced,done,memoryStatus,storageKey}:{storageKey?:string;reduced:boolean;done:()=>void;memoryStatus?:string}){
 const [saved]=useState(()=>readGame<any>(storageKey,(x:any):x is any=>x&&Array.isArray(x.board)&&x.board.length===SIDE*ROWS&&new Set(x.board.map((t:any)=>t.id)).size===SIDE*ROWS&&x.board.every((t:any)=>Number.isInteger(t.id)&&t.id>0&&Number.isInteger(t.kind)&&t.kind>=0&&t.kind<5)&&[x.score,x.best,x.total].every(finite)));
 const [board,setBoard]=useState<Board>(()=>saved?adoptBoard(saved.board):newBoard()),[selected,setSelected]=useState<number|null>(null),[hint,setHint]=useState<number[]>([]),[clearing,setClearing]=useState<number[]>([]),[fall,setFall]=useState<Record<number,number>>({}),[phase,setPhase]=useState('idle'),[score,setScore]=useState<number>(saved?.score||0),[chain,setChain]=useState(0),[best,setBest]=useState<number>(saved?.best||0),[line,setLine]=useState('選兩個相鄰的朋友，讓三個相同的頭像排成一直線。');
 const current=useRef(board),selection=useRef<number|null>(null),busy=useRef(false),alive=useRef(true),generation=useRef(0),total=useRef(saved?.total||0),remembered=useRef((saved?.total||0)>=30),gesture=useRef<{x:number;y:number;index:number}|null>(null),skipClick=useRef(false);
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;generation.current++}},[]);
 useEffect(()=>{if(phase==='idle')writeGame(storageKey,{board,score,best,total:total.current})},[board,score,best,phase,storageKey]);
 const apply=(b:Board)=>{current.current=b;setBoard(b)};
 const pick=(i:number|null)=>{selection.current=i;setSelected(i)};
 async function turn(a:number,b:number){if(busy.current||!neighbours(a,b))return;busy.current=true;const run=++generation.current;const valid=()=>alive.current&&generation.current===run;const wait=async(ms:number)=>{await new Promise(r=>setTimeout(r,reduced?0:ms));return valid()};
  pick(null);setHint([]);setFall({});setChain(0);let next=swap(current.current,a,b);apply(next);setPhase('swap');if(!await wait(220))return;
  if(!resolveMatches(next).clear.length){apply(swap(next,a,b));setLine('這兩位先回原位，試試另一個組合。');if(!await wait(220))return;setPhase('idle');busy.current=false;return}
  let count=0;
  while(valid()){
   const result=resolveMatches(next);if(!result.clear.length)break;count++;setChain(count);setBest(v=>Math.max(v,count));setClearing(result.clear);setPhase('clear');setLine(result.special==='five'?'五位朋友相遇！同款頭像一起亮起來。':result.special==='four'?'四連小驚喜！這一整排也加入了。':count>1?`${count} 次連鎖，驚喜接着來。`:'剛剛好，朋友們碰面了。');
   if(!await wait(280))return;total.current+=result.clear.length;setScore(v=>v+result.clear.length*10*count);setClearing([]);const dropped=refill(next,result.clear);const oldIds=new Set(next.map(t=>t.id));next=dropped.board;setFall(Object.fromEntries(Object.entries(dropped.from).filter(([id])=>!oldIds.has(Number(id)))));apply(next);setPhase('fall');if(!await wait(330))return;setFall({});
   if(total.current>=30&&!remembered.current){remembered.current=true;done()}
   // Bound the cascade to prevent an unlucky sequence from trapping the controls.
   if(count>=20){next=newBoard();apply(next);setLine('好多小驚喜！換個新排列繼續玩。');break}
  }
  if(!valid())return;
  if(!findMove(next)){apply(newBoard());setLine('朋友們換了位置，新的組合準備好了。')}
  setPhase('idle');busy.current=false;
 }
 function tap(i:number){if(busy.current)return;if(selection.current===null){pick(i);setHint([])}else if(selection.current===i)pick(null);else if(neighbours(selection.current,i))void turn(selection.current,i);else pick(i)}
 function shuffle(){if(busy.current)return;apply(newBoard());pick(null);setHint([]);setClearing([]);setFall({});setChain(0);setLine('換個排列，隨心繼續玩。本局星光會保留。')}
 function showHint(){if(busy.current)return;pick(null);const move=findMove(current.current);if(move){setHint(move);setLine('看看有金色邊框的兩位朋友，試着交換位置。')}else shuffle()}
 return <section className={`character-crush ${reduced?'crush-reduced':''}`} aria-label="公仔頭三消遊戲"><div className="crush-score"><div><Star size={16}/><span>本局星光<strong>{score.toLocaleString()}</strong></span></div><div><Sparkles size={16}/><span>最長連鎖<strong>{best}<small> 次</small></strong></span></div><span className="crush-mode">{memoryStatus?<span className="crush-memory-status" role="status">{memoryStatus}</span>:<>隨心玩<br/>不限時</>}</span></div>
 <div className="crush-board" role="group" aria-label={`${ROWS} 行 ${SIDE} 列棋盤`} aria-busy={busy.current}>
 {board.map((t,i)=><button key={t.id} className={`crush-tile colour-${t.kind} ${selected===i?'selected':''} ${hint.includes(i)?'hinted':''} ${clearing.includes(i)?'clearing':''} ${phase==='fall'&&fall[t.id]?'falling':''}`} style={{height:`calc(100% / ${ROWS})`,transform:`translate(${i%SIDE*100}%,${Math.floor(i/SIDE)*100}%)`,'--drop':`${(fall[t.id]||0)*100}%`} as CSSProperties} aria-label={`第 ${Math.floor(i/SIDE)+1} 行第 ${i%SIDE+1} 格：${names[t.kind]}`} aria-pressed={selected===i} onClick={e=>{if(skipClick.current&&e.detail!==0){skipClick.current=false;return}skipClick.current=false;tap(i)}}
 onPointerDown={e=>{if(busy.current)return;skipClick.current=false;gesture.current={x:e.clientX,y:e.clientY,index:i};e.currentTarget.setPointerCapture(e.pointerId)}}
 onPointerCancel={()=>{gesture.current=null}}
 onPointerUp={e=>{const g=gesture.current;gesture.current=null;if(!g)return;const dx=e.clientX-g.x,dy=e.clientY-g.y;if(Math.max(Math.abs(dx),Math.abs(dy))<18)return;skipClick.current=true;const target=g.index+(Math.abs(dx)>Math.abs(dy)?Math.sign(dx):Math.sign(dy)*SIDE);if(neighbours(g.index,target))void turn(g.index,target)}}>
 <span className="crush-piece"><CharacterHead kind={t.kind}/>{clearing.includes(i)&&<span className="crush-glint">✦</span>}</span></button>)}
 {chain>1&&phase==='clear'&&<div className="crush-combo" aria-hidden="true">{chain} 連鎖</div>}
 </div><p className="crush-response" role="status">{line}</p><div className="crush-tools"><button className="soft-button" disabled={phase!=='idle'} onClick={showHint}><Lightbulb size={17}/>給我提示</button><button className="soft-button" disabled={phase!=='idle'} onClick={shuffle}><Shuffle size={17}/>換個排列</button></div><details className="crush-rules"><summary>怎樣玩？</summary><p>輕掃一格，或先後輕碰兩個相鄰頭像。三個相同頭像橫排或直排便會消除；四連清除整行或整列，五連清除棋盤上同款頭像。新頭像落下時可以繼續連鎖。</p><p>不會扣分，也沒有步數限制。這一局會保留在這部裝置，回來可繼續。</p></details></section>
}
