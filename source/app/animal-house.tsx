'use client';
import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {showScene} from '../lib/show-scene';
import {GiftPlayground} from './gift-playground';
import type {GiftAccess} from '../lib/gift-access';
import {Heart,Hand,Flower,Stars,BookOpen,CloudRain,Armchair,Smile,Sun,Leaf,Play,Pause,RotateCcw,Lightbulb,Wind,Coffee,Sailboat,Sparkles} from 'lucide-react';
import {companionScenes,sceneGroups,type SceneId,type Scene} from '../lib/companions';

// Authored cels play once, with anticipation, gesture and settling holds.
// The welcome atlas has one malformed wing cel (11); deliberately never display it.
const quietFrames=[0,0,1,1,0];
export const filmFrames={bird:[0,0,1,2,3,4,5,6,7,8,7,8,9,10,11,11],rabbit:[0,0,1,2,3,4,5,6,7,8,8,9,10,11,11],welcome:[0,0,1,2,3,4,5,6,7,8,7,8,9,10,12,13,14,15,15,15],embrace:[0,0,1,2,3,5,6,7,8,9,10,10,11,12,13,14,15,15,15],garden:[0,0,1,2,3,4,5,6,7,8,9,10,10,11,12,13,14,15,15,15],night:[0,0,1,2,3,4,5,6,7,8,9,10,10,11,12,13,14,15,15,15]};
const icons:Record<string,any>={wave:Hand,hug:Heart,sit:Armchair,listen:Heart,blanket:Leaf,tea:Coffee,stretch:Sun,breathe:Wind,flower:Flower,garden:Leaf,stars:Stars,book:BookOpen,rain:CloudRain,boat:Sailboat,bubbles:Sparkles,celebrate:Smile,pet:Hand,visit:Hand,gratitude:Flower,lantern:Lightbulb};
const films={bird:'鸛鸛的招呼',rabbit:'小兔的回應',welcome:'陽光小屋',embrace:'柔軟的陪伴',garden:'花園午後',night:'星光窗邊'};
function CelFilm({scene,playKey,reduced,onTap,children}:{scene:Scene;playKey:number;reduced:boolean;onTap:(id:SceneId)=>void;children:React.ReactNode}){
 const sceneElement=useRef<HTMLDivElement>(null);
 const frames=['sit','listen'].includes(scene.id)?quietFrames:filmFrames[scene.film],url=`/eva-mum/companions/${scene.film}-v2.png`;
 const [index,setIndex]=useState(0),[paused,setPaused]=useState(false),[loaded,setLoaded]=useState(''),[failed,setFailed]=useState(''),[retry,setRetry]=useState(0),[replay,setReplay]=useState(0),[hidden,setHidden]=useState(false);
 useLayoutEffect(()=>showScene(sceneElement.current),[scene.id,playKey,replay]);
 useEffect(()=>{setIndex(0);setPaused(false)},[scene.id,playKey,replay]);
 useEffect(()=>{const read=()=>setHidden(document.hidden);document.addEventListener('visibilitychange',read);read();return()=>document.removeEventListener('visibilitychange',read)},[]);
 useEffect(()=>{if(reduced||paused||hidden||loaded!==url||index>=frames.length-1)return;const t=setTimeout(()=>setIndex(i=>Math.min(i+1,frames.length-1)),index<2||index>frames.length-4?300:125);return()=>clearTimeout(t)},[index,paused,hidden,reduced,loaded,url,frames,scene.id,playKey,replay]);
 const frame=reduced?frames[frames.length-1]:frames[index]??0;
 const done=index>=frames.length-1;
 const row=Math.floor(frame/4),bounds=scene.film==='bird'?[0,235,475,715]:scene.film==='rabbit'?[0,230,459,696]:[0,256,512,768,1024];
 const x=(frame%4)*384+1,y=bounds[row]+1,w=382,h=(bounds[row+1]-bounds[row])-2;
 const spriteStyle={backgroundImage:`url(${url})`,backgroundSize:`${1536/w*100}% ${1024/h*100}%`,backgroundPosition:`${x/(1536-w)*100}% ${y/(1024-h)*100}%`};
 return <><div className="cel-stage" ref={sceneElement} data-film={scene.film} data-frame={frame} data-playback={reduced?'still':paused?'paused':done?'finished':'playing'}>
 <img key={url+retry} className="cel-loader" src={url} alt="" onLoad={()=>{setLoaded(url);setFailed('')}} onError={()=>setFailed(url)}/>
 {loaded===url?<div className="cel-art" role="img" aria-label={`${films[scene.film]}：Boris、鸛鸛和小兔的逐格陪伴動畫`} style={spriteStyle}/>:<div className="cel-loading"><img src="/eva-mum/boris-cottage-with-doll-v2.png" alt="Boris 和朋友等你進入小屋"/><span>{failed===url?'小場景暫時未能載入':'正在打開這個小場景…'}</span>{failed===url&&<button onClick={()=>{setFailed('');setRetry(n=>n+1)}}>再試一次</button>}</div>}
 <div className="cel-character-taps"><button aria-label="和鸛鸛打招呼" onClick={()=>onTap('visit')} style={{left:'17%',width:'22%'}}/><button aria-label="和 Boris 打招呼" onClick={()=>onTap('wave')} style={{left:'39%',width:'24%'}}/><button aria-label="輕碰小兔" onClick={()=>onTap('pet')} style={{left:'63%',width:'20%'}}/></div>
 {children}
 </div><div className="cel-controls"><span>{films[scene.film]} · {reduced?'靜態陪伴':loaded!==url?'準備中':paused?'已暫停':done?'再看一次也可以':'輕輕陪你一會'}</span><div>{!reduced&&<button aria-label={paused?'繼續角色動畫':'暫停角色動畫'} disabled={done||loaded!==url} onClick={()=>setPaused(v=>!v)}>{paused?<Play size={17}/>:<Pause size={17}/>}</button>}<button aria-label="重播這個小場景" disabled={loaded!==url} onClick={()=>{setIndex(0);setPaused(false);setReplay(n=>n+1)}}><RotateCcw size={17}/></button></div></div></>
}
export function AnimalHouse({action,playKey,reduced,onAction,giftAccess,retryGifts}:{action:string;playKey:number;reduced:boolean;onAction:(id:string)=>void;giftAccess:GiftAccess;retryGifts:()=>void}){
 const scene=companionScenes.find(s=>s.id===action)||companionScenes[2];
 const [room,setRoom]=useState<'gifts'|'stories'>('gifts');
 useEffect(()=>{if(playKey)setRoom('stories')},[playKey]);
 const [group,setGroup]=useState('想被陪伴'),[reply,setReply]=useState<{turn:number;text:string}|null>(null),[choice,setChoice]=useState(-1),[touched,setTouched]=useState<number[]>([]),[flowerColor,setFlowerColor]=useState('#e8ad89'),[light,setLight]=useState(false),[effect,setEffect]=useState(0),[bookPage,setBookPage]=useState(0);
 const stage=useRef<HTMLDivElement>(null);
 useEffect(()=>{setGroup(scene.group);setChoice(-1);setTouched([]);setLight(false);setEffect(0);setBookPage(0)},[action,playKey]);
 useEffect(()=>{if(!stage.current||reduced||!effect)return;const animations:Animation[]=[];const animate=(selector:string,frames:Keyframe[],duration:number)=>stage.current?.querySelectorAll(selector).forEach(el=>animations.push(el.animate(frames,{duration,easing:'ease-in-out',fill:'both',iterations:1})));
 if(scene.mode==='breath')animate('.breathing-flower',[{transform:'scale(.8)'},{transform:'scale(1.12)',offset:.45},{transform:'scale(.8)'}],6000);
 if(scene.mode==='boat')animate('.little-boat',[{transform:'translateX(0) rotate(-3deg)'},{transform:'translateX(45px) rotate(3deg)',offset:.4},{transform:'translateX(85px) rotate(-2deg)',opacity:1}],3200);
 if(scene.mode==='garden')animate('.garden-flower',[{transform:'scale(.65) rotate(-10deg)'},{transform:'scale(1.05) rotate(3deg)',offset:.75},{transform:'scale(1) rotate(0)'}],1800);
 if(scene.id==='rain')animate('.rain-stroke',[{transform:'translateY(-12px)',opacity:0},{opacity:.6,offset:.15},{transform:'translateY(50px)',opacity:0}],4000);
 if(scene.id==='tea')animate('.tea-steam',[{transform:'translateY(5px)',opacity:0},{opacity:.75,offset:.4},{transform:'translateY(-15px)',opacity:0}],3000);
 return()=>animations.forEach(a=>a.cancel());
 },[effect,scene.mode,scene.id,reduced]);
 const say=(text:string)=>setReply({turn:playKey,text});
 const trigger=()=>{showScene(stage.current?.querySelector<HTMLElement>('.cel-stage')||null);setEffect(n=>n+1);setLight(v=>!v);if(scene.mode==='garden')say(scene.id==='flower'?'這一朵小花，留給今天的你。':'小花慢慢盛開。你不用趕着跟上任何人的節奏。');if(scene.mode==='boat')say('小船出發了。我們在岸邊，慢慢看它走。');if(scene.mode==='breath')say('不用跟得一樣，照自己的舒服節奏就好。')};
 function respond(i:number){showScene(stage.current?.querySelector<HTMLElement>('.cel-stage')||null);setChoice(i);if((scene.id==='hug'&&i===2)||(scene.id==='blanket'&&i===2)){onAction('sit');setReply({turn:playKey+1,text:scene.replies[i]});return}say(scene.replies[i]);if(scene.mode==='garden'){setFlowerColor(['#e8ad89','#dca3ae','#fff5d5'][i]);setEffect(n=>n+1)}if(scene.mode==='bubbles'&&i===0)setTouched([]);if(scene.mode==='boat'&&i<2)trigger();if(scene.mode==='breath'&&i<2)setEffect(n=>n+1);if(scene.id==='lantern')setLight(i!==2);if(scene.id==='tea'||scene.id==='rain')setEffect(n=>n+1);if(scene.id==='book'&&i===0)setBookPage(n=>n+1);}
 const tapItem=(i:number)=>{if(touched.includes(i))return;const next=[...touched,i];setTouched(next);say(scene.mode==='stars'?(next.length===3?'三顆星連在一起了。小小的光，也有自己的美。':'這顆星，留在你選的位置。'):['不用急着變得更好。','今天的你，也值得被溫柔對待。','玩到這裏，或再來一次，都很好。'][i])};
 const message=reply?.turn===playKey?reply.text:scene.line;
 return <div className={`animal-house ${reduced?'house-reduced':''}`}><div className="date-line">A LITTLE WORLD WITH YOU</div><h1>今天，想怎樣被陪伴？</h1><p className="intro">送一點心意，收下一點歡喜。</p><div className="house-mode" aria-label="小屋玩法"><button aria-pressed={room==='gifts'} onClick={()=>setRoom('gifts')}>送禮物給朋友</button><button aria-pressed={room==='stories'} onClick={()=>setRoom('stories')}>20 種陪伴選擇</button></div>{room==='gifts'?<GiftPlayground reduced={reduced} access={giftAccess} retryAccess={retryGifts}/>:<>
 <section className="storybook" ref={stage}><div className="story-title"><span>{scene.title}</span><small>聲音關閉</small></div><CelFilm scene={scene} playKey={playKey} reduced={reduced} onTap={onAction}>
 {scene.mode==='bubbles'&&<div className="play-layer bubbles-play" aria-label="泡泡小遊戲">{[0,1,2].map(i=><button key={i} className={`soap-bubble bubble-${i} ${touched.includes(i)?'popped':''}`} aria-label={`輕碰第 ${i+1} 個泡泡`} disabled={touched.includes(i)} onClick={()=>tapItem(i)}><span/></button>)}</div>}
 {scene.mode==='stars'&&<div className="play-layer constellation-play"><svg viewBox="0 0 300 80" aria-hidden="true"><path d={touched.length===3?'M55 45 150 15 245 45':''} fill="none" stroke="#ffecbc" strokeWidth="1.5"/></svg>{[0,1,2].map(i=><button key={i} aria-label={`點亮第 ${i+1} 顆星`} aria-pressed={touched.includes(i)} onClick={()=>tapItem(i)} style={{left:`${10+i*35}%`,top:i===1?'0%':'30%'}}><Stars fill={touched.includes(i)?'#fff0b7':'transparent'} color="#fff0b7" size={27}/></button>)}</div>}
 {scene.mode==='garden'&&<button className="play-prop garden-flower" aria-label="輕碰小花，讓它綻放" onClick={trigger}><svg viewBox="0 0 90 100" aria-hidden="true"><path d="M45 91V36m0 40-17-12m17 2 18-13" stroke="#6d895c" strokeWidth="4" fill="none"/><g fill={flowerColor} stroke="#9e795b" strokeWidth="1.5"><circle cx="45" cy="23" r="13"/><circle cx="60" cy="35" r="13"/><circle cx="53" cy="52" r="13"/><circle cx="33" cy="48" r="13"/><circle cx="29" cy="30" r="13"/><circle cx="44" cy="37" r="9" fill="#e9cb78"/></g></svg></button>}
 {scene.mode==='breath'&&<button className="play-prop breathing-flower" aria-label="播放一次花朵開合" onClick={trigger}><Flower size={64} strokeWidth={1.2}/></button>}
 {scene.mode==='boat'&&<button className="play-prop little-boat" aria-label="讓小紙船出發" onClick={trigger}><svg viewBox="0 0 100 65" aria-hidden="true"><path d="m6 40 41-35v35L79 21l-5 19h21L76 58H26Z" fill="#fff3d9" stroke="#a38660" strokeWidth="2"/><path d="m6 40 42 12 47-12M47 5v35" fill="none" stroke="#c7a97e" strokeWidth="2"/><path d="M8 63q19-7 40 0t43 0" stroke="#97b8b4" fill="none"/></svg></button>}
 {scene.id==='tea'&&<button className="play-prop tea-cup" aria-label="看一會茶杯的熱氣" onClick={trigger}><svg viewBox="0 0 90 85" aria-hidden="true"><g className="tea-steam" stroke="#fcf6e5" strokeWidth="3" fill="none"><path d="M30 30q-10-10 0-20m14 20q-10-10 0-20m14 20q-10-10 0-20"/></g><path d="M14 38h52v20q-2 20-26 20T14 58Zm52 6q30-5 10 22H65" fill="#e8d3b6" stroke="#866c50" strokeWidth="2"/><ellipse cx="40" cy="39" rx="25" ry="5" fill="#a68557"/></svg></button>}
 {scene.id==='book'&&<button className="play-prop tiny-book" aria-label="翻開下一句鼓勵" onClick={()=>{setBookPage(n=>n+1);say(['你不必把每一天，都過成值得炫耀的樣子。','留一點耐心給自己，慢慢來也可以。','今天做到這裏，先休息一下也很好。'][(bookPage+1)%3])}}><BookOpen size={61} strokeWidth={1.2}/></button>}
 {scene.id==='lantern'&&<button className={`play-prop little-lantern ${light?'lit':''}`} aria-label={light?'調暗小燈':'點亮小燈'} aria-pressed={light} onClick={trigger}><Lightbulb size={54} strokeWidth={1.3}/></button>}
 {scene.id==='rain'&&<button className="rain-window" aria-label="看一陣小雨" onClick={trigger}><svg viewBox="0 0 120 120" aria-hidden="true">{[0,1,2,3,4,5].map(i=><path className="rain-stroke" key={i} d={`M${14+i*18} ${10+(i%3)*15}l-8 30`} stroke="#d4e2e0" strokeWidth="2"/>)}</svg></button>}
 </CelFilm><div className="story-dialogue"><span className="speaker">小屋的好說話</span><p key={message} aria-live="polite">{message}</p></div><div className="reply-choices" aria-label="選一個想要的回應">{scene.choices.map((label,i)=><button key={label} aria-pressed={choice===i} onClick={()=>respond(i)}>{label}</button>)}</div><p className="scene-hint">{scene.hint}{scene.mode?' · 可直接碰畫面中的小物件':''}</p></section>
 <section className="scene-library"><div className="section-head"><h2>挑一份現在想要的陪伴</h2></div><div className="scene-categories" aria-label="陪伴分類">{sceneGroups.map(g=><button key={g} aria-pressed={group===g} onClick={()=>setGroup(g)}>{g}</button>)}</div><div className="scene-cards">{companionScenes.filter(s=>s.group===group).map(s=>{const Icon=icons[s.id];return <button key={s.id} aria-pressed={action===s.id} className={action===s.id?'selected':''} onClick={()=>{showScene(stage.current?.querySelector<HTMLElement>('.cel-stage')||null);onAction(s.id)}}><Icon size={23}/><span><b>{s.title}</b><small>{s.hint}</small></span></button>})}</div></section></>}<p className="house-footnote">不用達標，也沒有要完成的清單。離開多久，小動物都不會責怪你。{reduced&&' 已減少動態效果，仍可玩小互動和選擇回應。'}</p>
 </div>
}
