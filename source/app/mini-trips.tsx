'use client';
import {useEffect,useRef,useState} from 'react';
import {Map,Play,Pause,RotateCcw,X,ArrowLeft,ArrowRight} from 'lucide-react';
import {miniTrips,tripAsset,tripChoices,type TripId} from '../lib/mini-trips';

export function MiniTrips({reduced,onOpen}:{reduced:boolean;onOpen:()=>void}){
 const [open,setOpen]=useState(false);
 return <>
  <button className="trips-launch" onClick={()=>{onOpen();setOpen(true)}}><Map size={24}/><span><strong>和朋友去小旅行</strong><small>海邊 · 森林 · 雪地，由你選下一幕</small></span><ArrowRight size={19}/></button>
  {open&&<TripDialog reduced={reduced} onClose={()=>setOpen(false)}/>}
 </>;
}

function TripDialog({reduced,onClose}:{reduced:boolean;onClose:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null),heading=useRef<HTMLHeadingElement>(null);
 const [routeId,setRouteId]=useState<TripId|null>(null),[history,setHistory]=useState<number[]>([0]);
 const route=miniTrips.find(r=>r.id===routeId),step=history[history.length-1],scene=route?.scenes[step];
 useEffect(()=>{const el=dialog.current,previous=document.activeElement as HTMLElement|null,overflow=document.body.style.overflow;el?.showModal();document.body.style.overflow='hidden';return()=>{el?.close();document.body.style.overflow=overflow;previous?.focus()}},[]);
 function chooseRoute(id:TripId){setRouteId(id);setHistory([0])}
 useEffect(()=>{dialog.current?.scrollTo({top:0});heading.current?.focus({preventScroll:true})},[routeId,step]);
 const next=tripChoices(step);
 return <dialog ref={dialog} className="pet-action-dialog trips-dialog" aria-labelledby="trip-title" onCancel={e=>{e.preventDefault();onClose()}}>
  <header><div><small>{route?'朋友的小旅行 · '+route.title:'BORIS · A LITTLE WANDER'}</small><h2 id="trip-title" ref={heading} tabIndex={-1}>{scene?.title||'今天想去哪裏？'}</h2></div><button aria-label="收起小旅行" onClick={onClose}><X/></button></header>
  {!route?<><p>每條路都有小插曲。沒有任務，想停就停。</p><div className="trip-destinations">{miniTrips.map(r=><button key={r.id} onClick={()=>chooseRoute(r.id)}><img src={tripAsset(r.scenes[0].id,'jpg')} alt="" width={640} height={360} loading="lazy"/><span><strong>{r.title}</strong><small>{r.description}</small></span><ArrowRight size={17}/></button>)}</div><p className="muted">這是朋友的想像小旅行，與 GPS 所在地無關。</p></>:scene&&<>
   <TripFilm key={scene.id} id={scene.id} title={scene.title} reduced={reduced}/>
   <p className="trip-line">{scene.line}</p>
   {next.length>0?<div className="trip-next" aria-label="選擇下一幕"><span>{next.length>1?'接下來想…':'想繼續的話…'}</span>{next.map(n=><button key={n} onClick={()=>setHistory(h=>[...h,n])}>{route.scenes[n].title}<ArrowRight size={16}/></button>)}</div>:<div className="trip-next"><span>這段小旅行，到這裏也很美好。</span><button onClick={()=>setHistory([0])}><RotateCcw size={16}/>再走一次，選另一個小發現</button></div>}
   <div className="pet-action-controls trip-navigation">{history.length>1&&<button onClick={()=>setHistory(h=>h.slice(0,-1))}><ArrowLeft size={16}/>上一幕</button>}<button onClick={()=>{setRouteId(null);setHistory([0])}}>選另一條路</button><button onClick={onClose}>回到小屋</button></div>
  </>}
 </dialog>;
}

export function TripFilm({id,title,reduced,asset=tripAsset}:{id:string;title:string;reduced:boolean;asset?:(id:string,ext:string)=>string}){
 const video=useRef<HTMLVideoElement>(null),attempted=useRef(false);
 const [ready,setReady]=useState(false),[playing,setPlaying]=useState(false),[ended,setEnded]=useState(false),[failed,setFailed]=useState(false);
 useEffect(()=>{const hide=()=>{if(document.hidden)video.current?.pause()};document.addEventListener('visibilitychange',hide);return()=>document.removeEventListener('visibilitychange',hide)},[]);
 function play(){const el=video.current;if(!el)return;if(el.ended)el.currentTime=0;setEnded(false);void el.play().catch(()=>setPlaying(false))}
 return <><div className="pet-action-screen gift-movie-screen cozy-movie-screen"><video ref={video} src={asset(id,'mp4')} poster={asset(id,'jpg')} aria-label={title+'短片'} muted playsInline autoPlay={!reduced} preload="metadata" disablePictureInPicture onCanPlay={()=>{setReady(true);if(!attempted.current&&!reduced&&!document.hidden){attempted.current=true;play()}}} onPlay={()=>{setPlaying(true);setEnded(false)}} onPause={()=>setPlaying(false)} onEnded={()=>setEnded(true)} onError={()=>setFailed(true)}/>{ended&&<img className="gift-movie-last" src={asset(id,'last.jpg')} alt={title+'的最後一幕'}/>} {!ready&&!failed&&<span className="pet-action-loading" role="status">朋友正在前面等你…</span>}</div>
  {failed?<p className="trip-film-note" role="alert">短片暫時未能載入。<button onClick={()=>{attempted.current=false;setFailed(false);setReady(false);video.current?.load()}}>重新載入</button></p>:<div className="pet-action-controls trip-playback"><button disabled={!ready} onClick={()=>playing?video.current?.pause():play()}>{ended?<RotateCcw size={16}/>:playing?<Pause size={16}/>:<Play size={16}/>} {ended?'重看這一幕':playing?'暫停':'播放'}</button>{reduced&&<small>減少動態效果已開啟，按播放才開始。</small>}</div>}
 </>;
}
