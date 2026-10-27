'use client';
import {useEffect,useRef,useState} from 'react';
import {Gift,Play,Pause,RotateCcw,X} from 'lucide-react';

const gifts=[
 {name:'小花束',ids:['flowers-petal','flowers-share','flowers-butterfly'],titles:['花瓣小插曲','一起聞聞花香','蝴蝶也來收花']},
 {name:'心形氣球',ids:['balloon-boop','balloon-bird','balloon-hide'],titles:['氣球輕輕碰','跟着氣球看','氣球躲貓貓']},
 {name:'小音樂盒',ids:['music-late','music-conductor','music-star'],titles:['慢半拍也可愛','鸛鸛小指揮','小星星轉個圈']},
 {name:'泡泡棒',ids:['bubbles-hat','bubbles-chase','bubbles-ring'],titles:['透明小帽子','泡泡躲貓貓','泡泡不肯走']},
 {name:'小頸巾',ids:['scarf-peek','scarf-share','scarf-bird'],titles:['咦，朋友在哪裏？','長一點，暖多一位','鸛鸛的小毯子']},
 {name:'小風車',ids:['pinwheel-spin','pinwheel-bow','pinwheel-leaf'],titles:['風車突然加速了','Miffy 的小發現','小葉子來湊熱鬧']}
];
const path=(id:string,extension:string)=>`/eva-mum/films/gifts-v1/${id}.${extension}`;

export function GiftCinema({reduced,onOpen}:{reduced:boolean;onOpen:()=>void}){
 const [choice,setChoice]=useState<{gift:number;variant:number}|null>(null);
 const next=useRef(gifts.map(()=>0));
 function choose(gift:number){onOpen();const variant=next.current[gift];next.current[gift]=(variant+1)%gifts[gift].ids.length;setChoice({gift,variant})}
 return <section className="pet-cinema gift-cinema" aria-label="送一點小驚喜">
  <div className="section-head"><h2><Gift size={20}/> 送一點小驚喜</h2></div>
  <p className="muted">三位朋友在花園等你。每份心意，都有三段小插曲。</p>
  <div className="pet-film-options">{gifts.map((gift,i)=><button key={gift.name} onClick={()=>choose(i)} aria-label={`送${gift.name}，看朋友的反應`}><img loading="lazy" src={path(gift.ids[0],'jpg')} alt=""/><span><Gift size={15}/>{gift.name}</span></button>)}</div>
  {choice&&<GiftMovie key={`${choice.gift}-${choice.variant}`} gift={choice.gift} variant={choice.variant} reduced={reduced} onClose={()=>setChoice(null)} onAnother={()=>choose(choice.gift)}/>}
 </section>
}

function GiftMovie({gift,variant,reduced,onClose,onAnother}:{gift:number;variant:number;reduced:boolean;onClose:()=>void;onAnother:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null),video=useRef<HTMLVideoElement>(null),attempted=useRef(false);
 const [ready,setReady]=useState(false),[playing,setPlaying]=useState(false),[ended,setEnded]=useState(false),[failed,setFailed]=useState(false);
 const id=gifts[gift].ids[variant],title=gifts[gift].titles[variant];
 useEffect(()=>{const previous=document.activeElement as HTMLElement|null;const el=dialog.current;el?.showModal();const overflow=document.body.style.overflow;document.body.style.overflow='hidden';const hide=()=>{if(document.hidden)video.current?.pause()};document.addEventListener('visibilitychange',hide);return()=>{document.removeEventListener('visibilitychange',hide);el?.close();document.body.style.overflow=overflow;previous?.focus()}},[]);
 function play(){const el=video.current;if(!el)return;if(el.ended)el.currentTime=0;setEnded(false);void el.play().catch(()=>setPlaying(false))}
 return <dialog ref={dialog} className="pet-action-dialog" aria-labelledby="gift-movie-title" onCancel={e=>{e.preventDefault();onClose()}}>
  <header><div><small>花園 · 一份小心意</small><h2 id="gift-movie-title">{title}</h2></div><button aria-label="收起禮物短片" onClick={onClose}><X/></button></header>
  <div className="pet-action-screen gift-movie-screen"><video ref={video} src={path(id,'mp4')} poster={path(id,'jpg')} muted playsInline autoPlay={!reduced} preload="metadata" disablePictureInPicture aria-label={`${title}短片`} onCanPlay={()=>{setReady(true);if(!attempted.current&&!reduced&&!document.hidden){attempted.current=true;play()}}} onPlay={()=>{setPlaying(true);setEnded(false)}} onPause={()=>setPlaying(false)} onEnded={()=>setEnded(true)} onError={()=>setFailed(true)}/>{ended&&<img className="gift-movie-last" src={path(id,'last.jpg')} alt="三位朋友一起留下的快樂片刻"/>}{!ready&&!failed&&<span className="pet-action-loading" role="status">小驚喜正在來…</span>}</div>
  <p>一點小心意，就可以一起開心一會。</p>
  {failed?<p role="alert">片段暫時未能載入。<button onClick={()=>{setFailed(false);setReady(false);attempted.current=false;video.current?.load()}}>重新載入</button></p>:<div className="pet-action-controls"><button disabled={!ready} onClick={()=>playing?video.current?.pause():play()}>{ended?<RotateCcw size={17}/>:playing?<Pause size={17}/>:<Play size={17}/>} {ended?'再看一次':playing?'暫停':'播放'}</button><button onClick={onAnother}>另一個小驚喜</button></div>}
  <div className="pet-action-controls"><button onClick={onClose}>回到小屋</button></div>
  {reduced&&<p className="muted">已開啟減少動態效果，按播放才會開始。</p>}
 </dialog>
}
