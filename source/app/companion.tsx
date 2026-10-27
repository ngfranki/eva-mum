'use client';
import {useEffect,useRef} from 'react';

type Props={action?:string;playKey?:number;reduced?:boolean;onTap?:(action:string)=>void};
/** Each moving joint has its own SVG group; coordinates are in the fixed viewBox.
 * Cancelling on unmount prevents rapid taps from leaving overlapping animations. */
export function Companion({action='sit',playKey=0,reduced=false,onTap}:Props){
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const animations:Animation[]=[];
  if(reduced)return;
  const move=(part:string,frames:Keyframe[],duration=1800,delay=0)=>{
   root.current?.querySelectorAll(`[data-part="${part}"]`).forEach(el=>animations.push(el.animate(frames,{duration,delay,easing:'ease-in-out',fill:'both',iterations:1})));
  };
  const turn=(angles:number[])=>angles.map(a=>({transform:`rotate(${a}deg)`}));
  move('eyes',[{transform:'scaleY(1)'},{transform:'scaleY(1)',offset:.35},{transform:'scaleY(.08)',offset:.43},{transform:'scaleY(1)',offset:.51},{transform:'scaleY(1)'}],1600);
  if(action==='wave') {move('right-arm',turn([0,-115,-90,-118,-90,0]),2400);move('head',turn([0,-4,-4,0]),2400);}
  if(action==='sit'){move('chest',[{transform:'scale(1)'},{transform:'scale(1.018,1.025)'},{transform:'scale(1)'}],3200);move('bird-head',turn([0,5,0]),2200,300);}
  if(action==='hug'){move('left-arm',turn([0,42,42,12]),2500);move('right-arm',turn([0,-42,-42,-12]),2500);move('rabbit',[{transform:'translateX(0)'},{transform:'translateX(-21px)',offset:.55},{transform:'translateX(-21px)'}],2000);move('bird',[{transform:'translateX(0)'},{transform:'translateX(15px)',offset:.55},{transform:'translateX(15px)'}],2000);move('heart',[{opacity:0,transform:'translateY(8px) scale(.8)'},{opacity:1,transform:'translateY(0) scale(1)'}],1100,900);}
  if(action==='pet'){move('rabbit',turn([0,-5,-3,0]),2100);move('rabbit-ear',turn([0,8,-5,0]),1600);move('rabbit-cheeks',[{opacity:0},{opacity:1}],600,300);}
  if(action==='visit'){move('bird-head',turn([0,-9,4,0]),2200);move('bird-wing',turn([0,-32,-16,-32,0]),2200);}
  if(action==='flower'){move('left-arm',turn([0,25,25]),1400);move('bouquet',[{opacity:0,transform:'translate(0,28px) rotate(-12deg)'},{opacity:1,transform:'translate(0,0) rotate(0)'}],1400);move('bird-head',turn([0,7,0]),2200);}
  if(action==='blanket'){move('blanket',[{opacity:0,transform:'translateY(35px)'},{opacity:1,transform:'translateY(0)'}],1700);move('head',turn([0,4,0]),1800);}
  if(action==='stars'){move('sky',[{opacity:0},{opacity:1}],1800);move('head',turn([0,-6,-6]),1900);move('bird-head',turn([0,-8,-8]),1900);move('stars',[{opacity:.2},{opacity:1},{opacity:.75}],2600);}
  return()=>animations.forEach(a=>a.cancel());
 },[action,playKey,reduced]);
 return <div ref={root} className={`companion-scene scene-${action} ${reduced?'scene-still':''}`}>
 <svg viewBox="0 0 520 390" role="img" aria-label="Boris、大嘴鳥公仔和小兔在繪本小屋裏陪伴你">
 <defs><linearGradient id="room-paper" x2="0" y2="1"><stop stopColor="#fffaf0"/><stop offset="1" stopColor="#f1e3cf"/></linearGradient><linearGradient id="bear-fur" x2=".8" y2="1"><stop stopColor="#b58049"/><stop offset="1" stopColor="#9c6635"/></linearGradient><linearGradient id="bird-fur" x2="1" y2="1"><stop stopColor="#838777"/><stop offset="1" stopColor="#646e64"/></linearGradient></defs>
 <rect width="520" height="390" fill="url(#room-paper)"/><path d="M0 283H520M0 335H520" stroke="#dfccb0" strokeWidth="2"/>
 <g stroke="#dcc6a7" strokeWidth="7"><path d="M330 181V76a65 65 0 0 1 130 0v105Z" fill="#e0e8d5"/><path d="M331 140q35-75 62-24 39-69 64-14v79H330" fill="#aebb99" stroke="none"/><path d="M395 13v168M330 103h130"/></g>
 {action==='stars'&&<g data-part="sky"><path d="M334 99V76a61 61 0 0 1 57-60v83Zm65 0V16a61 61 0 0 1 57 60v23Z M334 107h57v70h-57Zm65 0h57v70h-57Z" fill="#647681"/><g data-part="stars" fill="#fff0bd"><path d="M356 54q15 10 22-5a15 15 0 1 1-22 5"/><path d="m424 48 2 6 6 2-6 2-2 6-2-6-6-2 6-2Zm-71 83 2 5 5 2-5 2-2 5-2-5-5-2 5-2Zm79-6 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z"/><circle cx="412" cy="82" r="2"/><circle cx="373" cy="160" r="2"/></g></g>}
 <g fill="none" stroke="#d2b48e" strokeWidth="3"><rect x="54" y="39" width="69" height="87" rx="3"/><path d="M86 104V62" stroke="#83936e"/><path d="M86 83q-25-2-16-16 16 2 16 16m0 11q26-3 19-19-18 2-19 19" fill="#91a17d" stroke="none"/></g>
 <path d="M449 240q17-12 44-3l27 51h-74Z" fill="#e9b8a3" stroke="#d3a18d" strokeWidth="2"/><ellipse cx="261" cy="329" rx="233" ry="44" fill="#fff5df"/><ellipse cx="267" cy="330" rx="185" ry="18" fill="#dcc5a4" opacity=".3"/>
 <g stroke="#3f3026" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
 {/* Husband's plush bird: unique bill, tuft, wings, embroidered feathers. */}
 <g data-part="bird" style={{transformOrigin:'129px 329px'}}>
 <path d="M83 254q-12 27-10 50 4 27 54 28 51 0 52-29 1-28-15-49Z" fill="url(#bird-fur)"/>
 <g data-part="bird-head" style={{transformOrigin:'129px 244px'}}><path d="M117 166q-3-24 13-33 16 7 15 31" fill="#717b6c"/><path d="M76 218q-3-57 54-57 60 0 58 55 0 48-58 49-54 0-54-47Z" fill="url(#bird-fur)"/><ellipse cx="99" cy="213" rx="6" ry="7" fill="#231e19" stroke="#b69b71" strokeWidth="2"/><ellipse cx="163" cy="213" rx="6" ry="7" fill="#231e19" stroke="#b69b71" strokeWidth="2"/><path d="M107 222q24-12 47 0 13 12 7 37-9 29-30 34-24-4-34-35-6-23 10-36Z" fill="#cba34e" stroke="#65543c" strokeWidth="2"/><path d="m119 231 3 7m19-7-3 7M105 229q-5 26 13 52M154 229q6 26-13 52" stroke="#6a5036" strokeWidth="2.5" fill="none"/><circle cx="98" cy="211" r="1.5" fill="#fff9e9" stroke="none"/><circle cx="162" cy="211" r="1.5" fill="#fff9e9" stroke="none"/></g>
 <g data-part="bird-wing" style={{transformOrigin:'88px 264px'}}><path d="M88 255q-28 15-29 51 1 16 14 11 23-18 27-44Z" fill="#747f70"/><path d="m75 281 3 7 5-4m-15 13 3 7 5-4" fill="none" stroke="#c4c6ae" strokeWidth="2"/></g><path d="M168 260q18 11 21 41 1 15-10 14l-15-29" fill="#747f70"/><path d="m174 285 3 6 4-3" stroke="#c4c6ae" strokeWidth="2" fill="none"/>
 <path d="M87 316q-11 10 5 22 22 7 27-10l-5-14q-8-8-14 0-8-6-13 2Zm53 9q5 21 25 10 14-9 4-20-6-6-12 0-9-6-14 2Z" fill="#827d70"/><path d="M166 246q16-12 28 2-11 13-28 3Z" fill="#87935d" strokeWidth="1.5"/>
 </g>
 {/* Boris: round ears, soft square head, orange top and the characteristic mouth. */}
 <g data-part="chest" style={{transformOrigin:'271px 324px'}}><path d="M215 240q-21 28-18 65 18 25 71 27 52-1 70-24 4-43-26-71Z" fill="#eda052"/>
 <g data-part="head" style={{transformOrigin:'269px 235px'}}><circle cx="203" cy="159" r="27" fill="url(#bear-fur)"/><circle cx="335" cy="159" r="27" fill="url(#bear-fur)"/><path d="M195 187q0-59 73-61 77 0 78 61 0 59-76 62-75 0-75-62Z" fill="url(#bear-fur)"/>
 <g data-part="eyes" style={{transformOrigin:'269px 190px'}} fill="#382719" stroke="none"><ellipse cx="239" cy="190" rx="4.5" ry="5"/><ellipse cx="299" cy="190" rx="4.5" ry="5"/></g><path d="M262 207q-6-9 0-9 4 0 7 5 5-6 9-4 5 5-9 12m0-6-10 10m10-10 11 10" fill="#382719" stroke="#382719" strokeWidth="3"/></g>
 <g data-part="left-arm" style={{transformOrigin:'222px 251px'}}><path d="M217 246q-21 12-17 33 2 13 17 10 14-9 14-29" fill="#ad783f"/></g><g data-part="right-arm" style={{transformOrigin:'316px 251px'}}><path d="M321 246q21 12 17 33-2 13-17 10-14-9-14-29" fill="#ad783f"/></g>
 <ellipse cx="225" cy="314" rx="28" ry="31" fill="url(#bear-fur)" transform="rotate(-17 225 314)"/><ellipse cx="311" cy="314" rx="28" ry="31" fill="url(#bear-fur)" transform="rotate(17 311 314)"/></g>
 <g data-part="rabbit" style={{transformOrigin:'394px 331px'}} fill="#fffdf5"><path d="M369 282q-17 25-8 42 32 15 63-1 8-23-12-44Z"/><g data-part="rabbit-ear" style={{transformOrigin:'378px 242px'}}><path d="M366 244q-21-62-3-66 18-4 22 64Z"/></g><path d="M389 243q-1-65 18-62 20 5 0 65Z"/><path d="M354 263q0-31 38-32 39 1 39 32 0 31-39 32-38-1-38-32Z"/><g fill="#382719" stroke="none"><ellipse cx="377" cy="264" rx="3" ry="3.5"/><ellipse cx="410" cy="264" rx="3" ry="3.5"/></g><path d="m389 276 8 6m0-6-8 6" fill="none" strokeWidth="2.5"/><ellipse cx="374" cy="326" rx="16" ry="14"/><ellipse cx="410" cy="326" rx="16" ry="14"/>{action==='pet'&&<g data-part="rabbit-cheeks" fill="#e9bea9" stroke="none"><ellipse cx="367" cy="276" rx="6" ry="3"/><ellipse cx="420" cy="276" rx="6" ry="3"/></g>}</g>
 {action==='hug'&&<g data-part="heart" style={{transformOrigin:'270px 100px'}}><path d="M270 106s-23-13-19-24q7-13 19 0 13-13 20 0 4 11-20 24Z" fill="#d9a28e" stroke="none"/></g>}
 {action==='flower'&&<g data-part="bouquet" style={{transformOrigin:'209px 288px'}}><path d="M213 289 198 244m15 45 14-48m-14 48 0-54" stroke="#7c8c64"/><path d="m212 282-14-12 10-2m7 12 17-13-10-1" fill="#9aa87c" stroke="none"/><g fill="#e4ae91" stroke="#ab7d59" strokeWidth="1.5"><path d="M205 228q-8-16 2-16 7 0 8 6 12-6 13 3 1 8-7 9 3 10-6 10-9 0-10-12Z"/><circle cx="215" cy="225" r="4" fill="#e9ce7d"/><path d="M190 242q-9-10-1-14 7-4 10 4 9-3 11 3 2 8-8 9 0 9-7 8-6-1-5-10Z" fill="#fff5db"/></g></g>}
 {action==='blanket'&&<g data-part="blanket"><path d="M188 291q26-14 51-2 33 10 52-1 23-6 55 9l13 45H179Z" fill="#aebd9f" stroke="#7e906f" strokeWidth="2"/><path d="M186 331q25-7 48 0t52 0 64 0M216 300l-3 26m94-27 7 27" fill="none" stroke="#d5dec6" strokeWidth="3"/><path d="m189 342-1 7m14-7v7m15-7v7m15-7v7m15-7v7m15-7v7m15-7v7m15-7v7m15-7v7m15-7v7m15-7v7m15-7 2 7" stroke="#7e906f" strokeWidth="2"/></g>}
 </g></svg>
 <div className="character-targets"><button className="target-bird" onClick={()=>onTap?.('visit')} aria-label="輕碰大嘴鳥公仔，讓牠揮翼"/><button className="target-boris" onClick={()=>onTap?.('wave')} aria-label="輕碰 Boris，讓他揮手"/><button className="target-rabbit" onClick={()=>onTap?.('pet')} aria-label="摸摸小兔，看看牠的回應"/></div>
 </div>
}
