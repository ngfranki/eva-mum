'use client';
import {useEffect,useRef,useState} from 'react';
/** One greeting per page visit. A tab remount does not restart the welcome. */
export default function WelcomeHero({reduced,seen,completed,onSeen,onComplete}:{reduced:boolean;seen:boolean;completed:boolean;onSeen:()=>void;onComplete:()=>void}){
 const video=useRef<HTMLVideoElement>(null),attempted=useRef(seen);
 const [playing,setPlaying]=useState(false),[failed,setFailed]=useState(false),[finished,setFinished]=useState(completed);
 useEffect(()=>{const hide=()=>{if(document.hidden)video.current?.pause();else auto()};document.addEventListener('visibilitychange',hide);return()=>document.removeEventListener('visibilitychange',hide)},[reduced]);
 useEffect(()=>{if(reduced)video.current?.pause()},[reduced]);
 function start(){const el=video.current;if(!el)return;if(el.ended||finished)el.currentTime=0;setFinished(false);void el.play().catch(()=>setPlaying(false))}
 function auto(){if(reduced||attempted.current||document.hidden)return;attempted.current=true;start()}
 return <button className="hero welcome-hero" aria-label={playing?'暫停 Boris、Miffy 和鸛鸛的歡迎短片':'播放 Boris、Miffy 和鸛鸛一起打招呼'} onClick={()=>{if(failed){setFailed(false);attempted.current=false;video.current?.load();start()}else if(playing)video.current?.pause();else start()}}>
 <div className="welcome-screen"><video ref={video} src="/eva-mum/films/welcome-outdoor-v1/welcome.mp4" poster={finished?"/eva-mum/films/welcome-outdoor-v1/last-frame.jpg":"/eva-mum/films/welcome-outdoor-v1/welcome.jpg"} muted playsInline preload="metadata" onCanPlay={auto} onPlay={()=>{setPlaying(true);onSeen()}} onPause={()=>setPlaying(false)} onEnded={()=>{setPlaying(false);setFinished(true);onComplete()}} onError={()=>setFailed(true)} aria-hidden="true"/>{finished&&<img className="welcome-final-frame" src="/eva-mum/films/welcome-outdoor-v1/last-frame.jpg" alt="Boris、Miffy 和鸛鸛在陽光下陪你看遠方"/>}</div>
 <span>{failed?'小片段暫時未能播放，輕碰再試':playing?'Boris、Miffy 和鸛鸛歡迎你 · 輕碰暫停':finished?'陽光和我們，都在這裏 · 輕碰重播':'我們都在這裏 · 輕碰打個招呼'}</span>
 </button>;
}
