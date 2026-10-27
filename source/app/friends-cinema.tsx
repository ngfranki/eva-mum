'use client';
import {useEffect,useRef,useState} from 'react';
import {Heart,ArrowLeft,ArrowRight,X,RotateCcw} from 'lucide-react';
import {friendGroups,friendAsset} from '../lib/friend-scenes';
import {TripFilm} from './mini-trips';
type Group=typeof friendGroups[number];

export function FriendsCinema({reduced,onOpen}:{reduced:boolean;onOpen:()=>void}){
 const [open,setOpen]=useState(false);
 return <><button className="trips-launch friends-launch" onClick={()=>{onOpen();setOpen(true)}}><Heart size={24}/><span><strong>朋友來探訪 · 陪我一陣</strong><small>想笑、想抱抱，或只是一起坐坐</small></span><ArrowRight size={19}/></button>{open&&<FriendsDialog reduced={reduced} onClose={()=>setOpen(false)}/>}</>;
}
function FriendsDialog({reduced,onClose}:{reduced:boolean;onClose:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null),heading=useRef<HTMLHeadingElement>(null);
 const [group,setGroup]=useState<Group|null>(null),[step,setStep]=useState(0);
 const scene=group?.scenes[step];
 useEffect(()=>{const el=dialog.current,previous=document.activeElement as HTMLElement|null,overflow=document.body.style.overflow;el?.showModal();document.body.style.overflow='hidden';return()=>{el?.close();document.body.style.overflow=overflow;previous?.focus()}},[]);
 useEffect(()=>{dialog.current?.scrollTo({top:0});heading.current?.focus({preventScroll:true})},[group,step]);
 return <dialog ref={dialog} className="pet-action-dialog trips-dialog friends-dialog" aria-labelledby="friend-title" onCancel={e=>{e.preventDefault();onClose()}}>
  <header><div><small>{group?`${group.title} · ${step+1} / 3`:'BORIS · FRIENDS ARE HERE'}</small><h2 id="friend-title" ref={heading} tabIndex={-1}>{scene?.title||'這一刻，想怎樣一起過？'}</h2></div><button aria-label="收起朋友小電影" onClick={onClose}><X/></button></header>
  {!group?<><p>不用說明原因，選現在喜歡的就好。</p>{(['companion','visit'] as const).map(kind=><section className="friend-choices" key={kind}><h3>{kind==='companion'?'陪我一陣':'朋友的小探訪'}</h3><div>{friendGroups.filter(g=>g.kind===kind).map(g=><button key={g.id} onClick={()=>{setGroup(g);setStep(0)}}><img src={friendAsset(g.scenes[0].id,'jpg')} alt="" width={640} height={360} loading="lazy"/><span>{g.title}</span></button>)}</div></section>)}</>:scene&&<>
   <TripFilm key={scene.id} id={scene.id} title={scene.title} reduced={reduced} asset={friendAsset}/>
   <p>{group.kind==='visit'?'朋友帶來的小插曲，慢慢看就好。':'不用做甚麼，我們就在這裏陪你。'}</p>
   <div className="trip-next">{group.kind==='companion'?<button onClick={()=>setStep((step+1)%group.scenes.length)}>看看另一款陪伴 <ArrowRight size={17}/></button>:step<group.scenes.length-1?<button onClick={()=>setStep(step+1)}>下一幕：{group.scenes[step+1].title}<ArrowRight size={17}/></button>:<><span>朋友的小探訪，到這裏先歇一歇。</span><button onClick={()=>setStep(0)}><RotateCcw size={17}/>從第一幕再看</button></>}</div>
   <div className="pet-action-controls trip-navigation">{step>0&&<button onClick={()=>setStep(step-1)}><ArrowLeft size={16}/>上一幕</button>}<button onClick={()=>{setGroup(null);setStep(0)}}>換一種陪伴</button><button onClick={onClose}>回到小屋</button></div>
  </>}
 </dialog>;
}
