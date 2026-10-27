'use client';
import {readGame,writeGame,finite} from '../lib/game-save';
import {useEffect,useRef,useState,useId} from 'react';
import {ArrowLeftRight,Undo2,Send} from 'lucide-react';
import {BUBBLE_LEVELS,type Bubble,type Point,center,key,makeGarden,pickKind,traceShot,settle,aimAngle,LAUNCH} from '../lib/bubble-garden';
const colours=['#d98b74','#8b9b73','#aa97c8','#e5bb62','#76b5ce'];
const names=['杏桃愛心','綠葉','紫色星星','金色月亮','藍色水滴'];
type State={board:Bubble[];current:number;next:number;score:number;shots:number};
export function BubbleGarden({reduced,done,onRestart,storageKey}:{storageKey?:string;reduced:boolean;done:()=>void;onRestart?:()=>void}){
 const [saved]=useState(()=>readGame<any>(storageKey,(x:any):x is any=>x&&Number.isInteger(x.difficulty)&&x.difficulty>=0&&x.difficulty<4&&x.state&&Array.isArray(x.state.board)&&x.state.board.length<=88&&x.state.board.every((b:any)=>Number.isInteger(b.row)&&b.row>=0&&b.row<=10&&Number.isInteger(b.col)&&b.col>=0&&b.col<(b.row%2?7:8)&&Number.isInteger(b.kind)&&b.kind>=0&&b.kind<5)&&[x.state.score,x.state.shots,x.state.current,x.state.next].every(finite)&&Number.isInteger(x.state.current)&&Number.isInteger(x.state.next)&&x.state.current<5&&x.state.next<5&&new Set(x.state.board.map((b:any)=>`${b.row}:${b.col}`)).size===x.state.board.length));
 const [difficulty,setDifficulty]=useState(saved?.difficulty??1),[revision,setRevision]=useState(0);
 return <section className="bubble-mode"><label className="bubble-difficulty">難度<select aria-label="泡泡難度" value={difficulty} onChange={e=>{if(!window.confirm("切換難度會重新開局，確定嗎？"))return;onRestart?.();setDifficulty(Number(e.target.value));setRevision(v=>v+1)}}>{BUBBLE_LEVELS.map((d,i)=><option value={i} key={d.name}>{d.name} · {d.rows} 行 · {d.colours} 色</option>)}</select></label><p className="bubble-help">切換難度會重新開局；沒有倒數，可以隨時退一步。</p><BubbleRound storageKey={storageKey} saved={revision===0?saved?.state:undefined} key={`${difficulty}-${revision}`} difficulty={difficulty} reduced={reduced} done={done}/><button className="soft-button full" onClick={()=>{if(!window.confirm("要重新開始這個難度嗎？"))return;onRestart?.();setRevision(v=>v+1)}}>重新開始這個難度</button></section>
}
function BubbleRound({difficulty,reduced,done,storageKey,saved}:{difficulty:number;reduced:boolean;done:()=>void;storageKey?:string;saved?:State}){
 const [state,setState]=useState<State>(()=>{if(saved)return saved;const board=makeGarden(Math.random,difficulty);return {board,current:pickKind(board),next:pickKind(board),score:0,shots:0}});
 const [angle,setAngle]=useState(0),[flight,setFlight]=useState<Point|null>(null),[burst,setBurst]=useState<Bubble[]>([]),[line,setLine]=useState('連起三顆同色泡泡，讓小花園透透氣。');
 const [undo,setUndo]=useState<State[]>([]),[busy,setBusy]=useState(false);
 const lock=useRef(false),raf=useRef(0),timer=useRef<ReturnType<typeof setTimeout>|null>(null),svg=useRef<SVGSVGElement>(null),pointer=useRef<number|null>(null),angleRef=useRef(0),notified=useRef(false);
 const uid=useId().replace(/:/g,'');
 useEffect(()=>()=>{cancelAnimationFrame(raf.current);if(timer.current)clearTimeout(timer.current)},[]);
 useEffect(()=>{if(!busy)writeGame(storageKey,{difficulty,state})},[state,busy,difficulty,storageKey]);
 const trace=traceShot(state.board,angle),finished=state.board.length===0;
 function aim(value:number){angleRef.current=value;setAngle(value)}
 function point(e:React.PointerEvent<SVGSVGElement>){const matrix=e.currentTarget.getScreenCTM();if(!matrix)return;const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());aim(aimAngle(p));}
 function shoot(){
  if(lock.current||finished)return;const route=traceShot(state.board,angleRef.current);
  if(!route.target){setLine('這個位置有點擠，試試另一個角度，或退回上一步。');return;}
  lock.current=true;setBusy(true);setBurst([]);
  const result=settle(state.board,route.target,state.current);
  const end=()=>{setFlight(null);setUndo(a=>[...a.slice(-19),state]);setState({board:result.board,current:result.board.some(b=>b.kind===state.next)?state.next:pickKind(result.board),next:pickKind(result.board),score:state.score+result.popped.length+result.fallen.length,shots:state.shots+1});setBurst([...result.popped,...result.fallen]);
   setLine(!result.board.length?'整片天空都亮了。Boris 很喜歡和你一起玩。':result.fallen.length?`漂亮！連同懸空泡泡，一起消除了 ${result.popped.length+result.fallen.length} 顆。`:result.popped.length?`接得很好，${result.popped.length} 顆泡泡化成小星光。`:'泡泡留下了，下一顆可以接在旁邊。');
   if(!result.board.length&&!notified.current){notified.current=true;done();}
   timer.current=setTimeout(()=>{setBurst([]);setBusy(false);lock.current=false},reduced?0:320);
  };
  if(reduced){end();return;}
  let start:number|undefined;const tick=(now:number)=>{start??=now;const i=Math.floor((now-start)*.32);if(i>=route.path.length){end();return;}setFlight(route.path[i]);raf.current=requestAnimationFrame(tick)};raf.current=requestAnimationFrame(tick);
 }
 function restore(){if(lock.current||!undo.length||finished)return;setState(undo[undo.length-1]);setUndo(a=>a.slice(0,-1));setBurst([]);setLine('退回一步，換個角度也很好。')}
 function ball(kind:number,x:number,y:number,k:string,ghost=false){return <g key={k} transform={`translate(${x} ${y})`} opacity={ghost?.45:1}><circle r="17" fill={`url(#${uid}-${kind})`} stroke="#fff9e7" strokeWidth="1.5"/><path d="M-10 -6Q-6 -13 1 -12" fill="none" stroke="#ffffffa6" strokeWidth="2.5" strokeLinecap="round"/>{kind===0?<path d="M0 6C-16-2-5-12 0-5C5-12 16-2 0 6" fill="#724133"/>:kind===1?<path d="M-5 7Q-12-7 8-8Q11 8-5 7M-5 7L5-5" fill="#40543b" stroke="#ecf1d5" strokeWidth="1"/>:kind===2?<path d="m0-9 3 6 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1Z" fill="#57426f"/>:kind===3?<path d="M4-9A9 9 0 1 0 8 6A9 9 0 0 1 4-9" fill="#755527"/>:<path d="M0-10C-4-3-9 1-7 6C-5 12 5 12 7 6C9 1 4-3 0-10Z" fill="#25566d"/>}</g>}
 return <section className="bubble-game" aria-label="Boris 泡泡花園"><div className="bubble-stats"><span>泡泡花園 <small>慢慢瞄準，沒有倒數</small></span><strong aria-label={`已消除 ${state.score} 顆`}>{state.score}<small>顆小星光</small></strong></div>
 <svg ref={svg} className="bubble-board" viewBox="0 -85 320 650" preserveAspectRatio="none" role="img" aria-label={`泡泡球場，剩下 ${state.board.length} 顆；已發射 ${state.shots} 次。按住瞄準，放手發射。`} onPointerDown={e=>{if(e.button!==0||busy||finished||pointer.current!==null)return;pointer.current=e.pointerId;e.currentTarget.setPointerCapture(e.pointerId);point(e)}} onPointerMove={e=>{if(pointer.current===e.pointerId)point(e)}} onPointerUp={e=>{if(pointer.current!==e.pointerId)return;point(e);pointer.current=null;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);shoot()}} onPointerCancel={()=>{pointer.current=null}}>
 <defs><linearGradient id={`${uid}-sky`} x2="0" y2="1"><stop stopColor="#233c46"/><stop offset="1" stopColor="#789083"/></linearGradient>{colours.map((c,i)=><radialGradient id={`${uid}-${i}`} key={c} cx="32%" cy="25%" r="75%"><stop stopColor="#fff6df"/><stop offset=".38" stopColor={c}/><stop offset="1" stopColor={c}/></radialGradient>)}<clipPath id={`${uid}-boris`}><circle cx="160" cy="444" r="30"/></clipPath><clipPath id={`${uid}-round`}><rect y="-85" width="320" height="650"/></clipPath></defs>
 <g clipPath={`url(#${uid}-round)`}><rect y="-85" width="320" height="650" fill={`url(#${uid}-sky)`}/><image href="/eva-mum/games/lakeside-anime-v1.webp" y="-85" width="320" height="650" preserveAspectRatio="xMidYMid slice" opacity=".38"/><circle cx="270" cy="280" r="70" fill="#e8ddb60b"/>{[[25,240],[283,210],[260,355],[53,336],[154,248],[228,294]].map(([x,y])=><path key={x} d={`M${x-3} ${y}h6m-3-3v6`} stroke="#ffedc8" opacity=".5"/>)}<path d="M0 440Q80 390 160 440T320 431V475H0" fill="#536951"/><path d="M0 462Q65 428 158 458T320 449V475H0" fill="#3b5144"/>
 {!busy&&!finished&&<polyline points={trace.path.filter((_,i)=>i%8===0).map(p=>`${p.x},${p.y}`).join(' ')} stroke="#fff5cd" strokeOpacity=".65" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" fill="none"/>}
 {state.board.map(b=>{const p=center(b);return ball(b.kind,p.x,p.y,key(b))})}
 {!busy&&!finished&&trace.target&&ball(state.current,center(trace.target).x,center(trace.target).y,'target',true)}
 {burst.map(b=>{const p=center(b);return <g key={key(b)} className={reduced?'':'bubble-spark'} transform={`translate(${p.x} ${p.y})`}><circle r="20" fill="none" stroke={colours[b.kind]} strokeWidth="3"/><path d="M-6 0H6M0-6V6" stroke="#ffedbd" strokeWidth="2"/></g>})}
 <image href="/eva-mum/boris-icon-v3-180.png" x="130" y="414" width="60" height="60" clipPath={`url(#${uid}-boris)`} preserveAspectRatio="xMidYMid slice"/>
 <path d={`M160 427L${160+Math.sin(angle)*35} ${427-Math.cos(angle)*35}`} stroke="#ebc59b" strokeWidth="18" strokeLinecap="round"/>
 {!finished&&ball(state.current,flight?.x??LAUNCH.x,flight?.y??LAUNCH.y,'shot')}
 <text x="48" y="419" fill="#fff4db" textAnchor="middle" fontSize="10">下一顆</text>{!finished&&ball(state.next,48,444,'next')}
 </g></svg>
 <p className="bubble-line" role="status">{line}</p>
 <div className="bubble-controls"><button disabled={busy||finished} onClick={()=>setState(s=>({...s,current:s.next,next:s.current}))} aria-label="交換下一顆泡泡"><ArrowLeftRight size={19}/>換一顆</button><button disabled={busy||finished||!undo.length} onClick={restore}><Undo2 size={19}/>退一步</button><button className="bubble-fire" disabled={busy||finished} onClick={shoot}><Send size={18}/>發射</button></div>
 <label className="bubble-aim">瞄準方向<input type="range" min="-70" max="70" value={Math.round(angle*180/Math.PI)} disabled={busy||finished} onChange={e=>aim(Number(e.target.value)*Math.PI/180)} aria-label="瞄準方向"/></label><p className="bubble-help">按住球場瞄準，放手發射。同色三顆相連就消除；可借牆壁反彈。<span className="sr-only">目前泡泡：{names[state.current]}；下一顆：{names[state.next]}。</span></p>
 </section>
}
