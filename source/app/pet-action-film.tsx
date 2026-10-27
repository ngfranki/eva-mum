'use client';
import {useEffect,useRef,useState} from 'react';
import {X,Play,Pause,RotateCcw,Gamepad2} from 'lucide-react';
import {readGame,writeGame} from '../lib/game-save';
import {careChoices,nextCareId,rememberCareId,validCareHistory} from '../lib/care-surprises';
import type {PetAction} from '../lib/pet';
import {careRoomNames,careSceneLines,careLabels,type CareRoom} from '../lib/care-scenes';
export const careFilms:Record<PetAction,{title:string;line:string}>={
 feed:{title:'一起吃小茶點',line:'Boris 把一份小點心留給你。'},
 tea:{title:'慢慢泡一杯茶',line:'茶香暖暖的，這一刻不用趕。'},
 water:{title:'陪小花喝點水',line:'一點水，一點陽光，慢慢長就好。'},
 play:{title:'一起玩個小遊戲',line:'有你一起，平凡也變得有趣。'},
 rest:{title:'把被子蓋好',line:'舒服地休息，也是一種照顧。'},
 flowers:{title:'這束花送給你',line:'不用特別的理由，也可以收下一點美好。'},
 pet:{title:'Boris 靠近一點',line:'你在這裏，就已經很好。'}
};
export function PetActionFilm({action,room,reduced,onClose,onGames,onComplete,owner,preview=false,historyCache,onHistory}:{owner:string;preview?:boolean;historyCache:Record<string,string[]>;onHistory:(key:string,history:string[])=>void;action:PetAction;room:CareRoom;reduced:boolean;onClose:()=>void;onGames:()=>void;onComplete?:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null),video=useRef<HTMLVideoElement>(null),autoAttempted=useRef(false),recorded=useRef(false);
 const [failed,setFailed]=useState(false),[ready,setReady]=useState(false),[playing,setPlaying]=useState(false),[ended,setEnded]=useState(false);
 const choices=careChoices(room,action),cacheKey=`${encodeURIComponent(owner)}:${room}:${action}`,storageKey=preview?undefined:`eva-mum-care-recent-v1:${cacheKey}`;
 const [history,setHistory]=useState(()=>historyCache[cacheKey]||readGame(storageKey,validCareHistory)||[]);
 const [selected,setSelected]=useState(()=>nextCareId(choices.map(c=>c.id),history));
 const media=choices.find(c=>c.id===selected)!;
 const details={title:media.title||careLabels[room][action],line:media.line||careSceneLines[room][action]||careFilms[action].line};
 function rememberPlayed(){const next=rememberCareId(history,selected);setHistory(next);onHistory(cacheKey,next);writeGame(storageKey,next)}
 function another(){video.current?.pause();setSelected(nextCareId(choices.map(c=>c.id),history,selected));autoAttempted.current=false;setReady(false);setPlaying(false);setEnded(false);setFailed(false)}
 function startAutomatically(){setReady(true);const el=video.current;if(!el||reduced||autoAttempted.current||document.hidden)return;autoAttempted.current=true;el.muted=true;el.defaultMuted=true;void el.play().catch(()=>setPlaying(false))}
 useEffect(()=>{const el=dialog.current;const previous=document.activeElement as HTMLElement|null;el?.showModal();const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{el?.close();document.body.style.overflow=old;previous?.focus()}},[]);
 useEffect(()=>{const hide=()=>{if(document.hidden)video.current?.pause()};document.addEventListener('visibilitychange',hide);return()=>document.removeEventListener('visibilitychange',hide)},[]);
 function replay(){const el=video.current;if(!el)return;el.currentTime=0;void el.play().catch(()=>setPlaying(false))}
 return <dialog ref={dialog} className="pet-action-dialog" aria-labelledby="care-film-title" onCancel={e=>{e.preventDefault();onClose()}}>
  <header><div><small>{careRoomNames[room]} · BORIS</small><h2 id="care-film-title">{details.title}</h2></div><button aria-label="收起陪伴動畫" onClick={onClose}><X/></button></header>
  <div className={`pet-action-screen${media.last?' care-variant-screen':''}`}>{media.src?<video key={selected} ref={video} src={media.src} poster={media.poster} muted playsInline autoPlay={!reduced} disablePictureInPicture preload="metadata" aria-label={`${details.title}動畫`} onCanPlay={startAutomatically} onPlay={()=>{setPlaying(true);setEnded(false);rememberPlayed()}} onPause={()=>setPlaying(false)} onEnded={()=>{setEnded(true);if(!recorded.current){recorded.current=true;onComplete?.()}}} onError={()=>setFailed(true)}/>:<img src={media.poster} alt={`${careRoomNames[room]}的靜態陪伴`} style={{width:"100%",display:"block"}}/>}
  {ended&&media.last&&<img className="gift-movie-last" src={media.last} alt={`${details.title}的最後一幕`}/>}
  {media.src&&!ready&&!failed&&<span className="pet-action-loading" role="status">正在打開小片段…</span>}
  </div><p>{details.line}</p>
  {!media.src&&<p role="status">這個場景的專屬動畫尚未完成，先讓這幅小風景陪你坐一會。</p>}
  {failed?<p role="alert">片段暫時未能載入。<button onClick={()=>{setFailed(false);setReady(false);autoAttempted.current=false;video.current?.load()}}>再試一次</button></p>:<div className="pet-action-controls">{media.src&&<button onClick={()=>playing?video.current?.pause():ended?replay():void video.current?.play().catch(()=>setPlaying(false))} disabled={!ready}>{ended?<RotateCcw size={17}/>:playing?<Pause size={17}/>:<Play size={17}/>} {ended?'再看一次':playing?'暫停':'播放動畫'}</button>}{choices.length>1&&<button onClick={another}>再來一個小插曲</button>}{action==='play'&&<button onClick={onGames}><Gamepad2 size={18}/>選一個遊戲</button>}<button onClick={onClose}>回到小屋</button></div>}
  {failed&&<div className="pet-action-controls">{choices.length>1&&<button onClick={another}>看看另一段</button>}<button onClick={onClose}>回到小屋</button></div>}
  {reduced&&media.src&&<small className="muted">已開啟減少動態效果；按播放才會開始。</small>}
 </dialog>
}
