'use client';
import {useEffect,useRef,useState} from 'react';
import {Play,Pause,RotateCcw,X,Check,CookingPot,Armchair} from 'lucide-react';
import {cozyScenes,cozyPath,type DecorId} from '../lib/cozy-scenes';
type Scene=typeof cozyScenes[number];

export function CozyCinema({reduced,decor=[],corner,busy,preview,onOpen,onSave}:{reduced:boolean;decor:DecorId[];corner:DecorId|null;busy:boolean;preview:boolean;onOpen:()=>void;onSave:(items:DecorId[],corner:DecorId|null)=>Promise<boolean>}){
 const [selected,setSelected]=useState<Scene|null>(null),[expanded,setExpanded]=useState(false);
 const [notice,setNotice]=useState('');
 function open(scene:Scene){onOpen();setNotice('');setSelected(scene)}
 async function place(id:DecorId){const ok=await onSave(decor.includes(id)?decor:[...decor,id],id);if(!ok){setNotice('未能儲存這次布置。請收起短片，重新讀取小屋後再試。');return}setNotice(preview?'已放進預覽角落；正式資料不會改動。':'已放進你的角落，下次回來仍然在。')}
 async function remove(id:DecorId){const rest=decor.filter(x=>x!==id);const ok=await onSave(rest,corner===id?(rest.at(-1)||null):corner);if(!ok){setNotice('未能收起擺設。請收起短片，重新讀取小屋後再試。');return}setNotice('已收起擺設，隨時可以再放回來。')}
 const current=cozyScenes.find(s=>s.kind==='decor'&&s.id===corner&&decor.includes(s.id as DecorId));
 return <section className="cozy-cinema" aria-label="小廚房與布置角落">
  <div className="section-head"><h2><CookingPot size={20}/> 一起玩小廚房</h2></div>
  <p className="muted">Miffy、鸛鸛和 Boris 輪流當小幫手。選一幕，看看今天的小插曲。</p>
  <div className="cozy-film-grid">{cozyScenes.filter(s=>s.kind==='kitchen').slice(0,expanded?10:4).map(scene=><button key={scene.id} onClick={()=>open(scene)}><img src={cozyPath(scene.id,'jpg')} alt="" loading="lazy" width={640} height={360}/><span><Play size={14}/>{scene.title}</span></button>)}</div>
  <button className="text-button" onClick={()=>setExpanded(!expanded)}>{expanded?'收起更多片段':'看看其他六段小插曲'}</button>
  <div className="section-head"><h2><Armchair size={20}/> 我的布置角落</h2></div>
  <p className="muted">選一件擺設，先看朋友怎樣布置，再決定留下。喜歡的角落可以隨時換。</p>
  {current&&<button className="cozy-corner-view" onClick={()=>open(current)} aria-label={`再看${current.title}`}><img src={cozyPath(current.id,'last.jpg')} alt={`${current.title}，已留在你的角落`} loading="lazy" width={640} height={360}/><span>{current.title} · 輕碰重看</span></button>}
  {decor.length>0&&<div className="cozy-kept" aria-label="已留下的擺設">{decor.map(id=>{const scene=cozyScenes.find(s=>s.id===id)!;return <button key={id} aria-pressed={corner===id} disabled={busy} onClick={()=>void place(id)}><Check size={13}/>{scene.title}</button>})}</div>}
  <details className="cozy-decor-options"><summary>{decor.length?'換個布置 · 八件小擺設':'打開布置小箱子'}</summary><div className="cozy-film-grid">{cozyScenes.filter(s=>s.kind==='decor').map(scene=><button key={scene.id} onClick={()=>open(scene)}><img src={cozyPath(scene.id,'jpg')} alt="" loading="lazy" width={640} height={360}/><span>{decor.includes(scene.id as DecorId)?<Check size={14}/>:<Play size={14}/>} {scene.title}</span></button>)}</div></details>
  <p className="cozy-status" role="status">{notice}</p>
  {selected&&<CozyMovie key={selected.id} scene={selected} reduced={reduced} busy={busy} kept={decor.includes(selected.id as DecorId)} notice={notice} onClose={()=>setSelected(null)} onPlace={()=>void place(selected.id as DecorId)} onRemove={()=>void remove(selected.id as DecorId)}/>}
 </section>
}

function CozyMovie({scene,reduced,busy,kept,notice,onClose,onPlace,onRemove}:{scene:Scene;reduced:boolean;busy:boolean;kept:boolean;notice:string;onClose:()=>void;onPlace:()=>void;onRemove:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null),video=useRef<HTMLVideoElement>(null),attempted=useRef(false);
 const [ready,setReady]=useState(false),[playing,setPlaying]=useState(false),[ended,setEnded]=useState(false),[failed,setFailed]=useState(false);
 useEffect(()=>{const previous=document.activeElement as HTMLElement|null,el=dialog.current,overflow=document.body.style.overflow;el?.showModal();document.body.style.overflow='hidden';const hide=()=>{if(document.hidden)video.current?.pause()};document.addEventListener('visibilitychange',hide);return()=>{document.removeEventListener('visibilitychange',hide);el?.close();document.body.style.overflow=overflow;previous?.focus()}},[]);
 function play(){const el=video.current;if(!el)return;if(el.ended)el.currentTime=0;setEnded(false);void el.play().catch(()=>setPlaying(false))}
 return <dialog ref={dialog} className="pet-action-dialog" aria-labelledby="cozy-title" onCancel={e=>{e.preventDefault();onClose()}}>
  <header><div><small>{scene.kind==='kitchen'?'小廚房 · 朋友的小插曲':'布置角落 · 慢慢變成喜歡的樣子'}</small><h2 id="cozy-title">{scene.title}</h2></div><button aria-label="收起小屋短片" onClick={onClose}><X/></button></header>
  <div className="pet-action-screen gift-movie-screen cozy-movie-screen"><video ref={video} src={cozyPath(scene.id,'mp4')} poster={cozyPath(scene.id,'jpg')} muted playsInline autoPlay={!reduced} preload="metadata" disablePictureInPicture aria-label={`${scene.title}短片`} onCanPlay={()=>{setReady(true);if(!attempted.current&&!reduced&&!document.hidden){attempted.current=true;play()}}} onPlay={()=>{setPlaying(true);setEnded(false)}} onPause={()=>setPlaying(false)} onEnded={()=>setEnded(true)} onError={()=>setFailed(true)}/>{ended&&<img className="gift-movie-last" src={cozyPath(scene.id,'last.jpg')} alt={`${scene.title}的最後一幕`}/>}{!ready&&!failed&&<span className="pet-action-loading" role="status">朋友正在準備…</span>}</div>
  <p>{scene.kind==='kitchen'?'有朋友一起，小小的日常也有趣。':'舒服的角落，由你慢慢選。'}</p>
  {failed?<p role="alert">短片暫時未能載入。<button className="text-button" onClick={()=>{setFailed(false);setReady(false);attempted.current=false;video.current?.load()}}>重新載入</button></p>:<div className="pet-action-controls"><button disabled={!ready} onClick={()=>playing?video.current?.pause():play()}>{ended?<RotateCcw size={17}/>:playing?<Pause size={17}/>:<Play size={17}/>} {ended?'再看一次':playing?'暫停':'播放'}</button>{scene.kind==='decor'&&<button disabled={busy} onClick={onPlace}>{busy?'正在儲存…':kept?'設為現在的角落':'留在我的角落'}</button>}</div>}
  {notice&&<p role="status">{notice}</p>}
  <div className="pet-action-controls">{scene.kind==='decor'&&kept&&<button disabled={busy} onClick={onRemove}>收起這件擺設</button>}<button onClick={onClose}>回到小屋</button></div>
  {reduced&&<p className="muted">已開啟減少動態效果，按播放才會開始。</p>}
 </dialog>
}
