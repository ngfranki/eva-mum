'use client';
import {useEffect,useRef,useState} from 'react';
import {PetActionFilm} from './pet-action-film';
import {CozyCinema} from './cozy-cinema';
import {MiniTrips} from './mini-trips';
import {FriendsCinema} from './friends-cinema';
import {GiftCinema} from './gift-cinema';
import {careRoom,careLabels,careRoomNames} from '../lib/care-scenes';
import dynamic from 'next/dynamic';
const HouseGames=dynamic(()=>import('./house-games').then(m=>m.HouseGames),{ssr:false,loading:()=> <p role="status">正在打開遊戲…</p>});
import {Heart,Flower2,Leaf,Sun,Moon,Coffee,Apple,Cookie,Gamepad2,Home,RotateCcw,Play,Pause,Star} from 'lucide-react';
import {WellnessArt} from './diary';
import {careForPet,initialPet,petLines,type PetAction} from '../lib/pet';
import type {RecordRow} from '../lib/content';
const gameNames={crush:'三消小片刻',memory:'翻牌配對完成',bubble:'泡泡冒險關卡完成',shooter:'泡泡球場完成'};
const labels:Record<PetAction,string>={feed:'小茶點',tea:'泡杯茶',water:'澆澆花',play:'一起玩',rest:'蓋好被子',flowers:'送束花',pet:'摸摸 Boris'};
const films={miffy:{name:'Miffy',poster:'/eva-mum/films/miffy-flowers.png',line:'小小一束花，陪你享受這一刻。'},bird:{name:'鸛鸛',poster:'/eva-mum/films/bird-flowers.png',line:'有朋友在身邊，慢慢坐一會。'},boris:{name:'Boris',poster:'/eva-mum/films/care-cottage-v1.png',line:'把一點美好，留給今天的你。'}};
type FilmId=keyof typeof films;
export function BorisPet({record,today,reduced,onSave,onReload,preview=false,owner,onArchive}:{owner:string;onArchive:()=>void;record?:RecordRow;today:string;reduced:boolean;preview?:boolean;onSave:(value:any,version:number)=>Promise<any>;onReload:()=>void}){
 const state:ReturnType<typeof initialPet>={...initialPet(),...(record?.deleted?{}:record?.value||{})},[busy,setBusy]=useState(false),[error,setError]=useState(''),[message,setMessage]=useState('你來了，小屋就熱鬧了一點。'),[filmId,setFilmId]=useState<FilmId|null>(null),[filmKey,setFilmKey]=useState(0),[playing,setPlaying]=useState(false),[filmFailed,setFilmFailed]=useState(false);
 const [gamesOpen,setGamesOpen]=useState(false),[room,setRoom]=useState(()=>careRoom(record?.value?.room));
 const [careHistory,setCareHistory]=useState<Record<string,string[]>>({});
 const [careFilm,setCareFilm]=useState<PetAction|null>(null),[careKey,setCareKey]=useState(0);
 function showCare(action:PetAction){video.current?.pause();setCareFilm(action);setCareKey(n=>n+1)}
 const lock=useRef(false),video=useRef<HTMLVideoElement>(null),stage=useRef<HTMLDivElement>(null);
 useEffect(()=>{const pause=()=>{if(document.hidden)video.current?.pause()};document.addEventListener('visibilitychange',pause);return()=>document.removeEventListener('visibilitychange',pause)},[]);
 async function commit(value:any,line:string){if(lock.current)return false;lock.current=true;setBusy(true);setError('');try{await onSave(value,record?.version||0);setMessage(line);return true}catch(e:any){setError(e.message||'這次未儲存，請重新讀取後再試。');return false}finally{lock.current=false;setBusy(false)}}
 function care(action:PetAction){showCare(action)}
 async function remember(action:PetAction){return commit(careForPet({...state,room},action,today,{room,event:'film'}),'已留下這段一起看的小回憶。')}
 function startGame(){setGamesOpen(true)}
 function openFilm(id:FilmId){if(id==='boris'){setRoom('home');showCare('flowers');return}video.current?.pause();setFilmId(id);setFilmKey(n=>n+1);setFilmFailed(false);setPlaying(false);setMessage(films[id].line);stage.current?.scrollIntoView({block:'nearest',behavior:'auto'})}
 const roomArt=room==='garden'?'walk':room==='night'?'sleep':'rest';
 return <section className="boris-pet"><div className="date-line">BORIS · OUR LITTLE HOME</div><div className="section-head"><h1>和 Boris 過日子</h1><span className="pet-welcome"><Heart size={15}/>一直在這裏</span></div>
 <button className="games-launch" onClick={startGame}><Gamepad2 size={25}/><span><strong>和 Boris 玩一會</strong><small>三個朋友尋寶記 · 公仔三消 · 繪本翻牌 · 泡泡</small></span><Play size={18}/></button>
 {careFilm&&<PetActionFilm owner={owner} preview={preview} historyCache={careHistory} onHistory={(key,history)=>setCareHistory(prev=>({...prev,[key]:history}))} key={careKey} room={room} onComplete={()=>void remember(careFilm)} action={careFilm} reduced={reduced} onClose={()=>setCareFilm(null)} onGames={()=>{setCareFilm(null);startGame()}}/>}
 {gamesOpen&&<HouseGames owner={owner} preview={preview} open={gamesOpen} onClose={()=>setGamesOpen(false)} reduced={reduced} onRemember={game=>commit(careForPet({...state,room},'play',today,{room,event:'game',game}),'謝謝你陪我玩，這一刻很美好。')}/>}

 <div className="pet-room-tabs" aria-label="Boris 的房間">{[['home','小客廳',Home],['garden','花園',Leaf],['night','晚上',Moon]].map(([key,label,Icon]:any)=><button key={key} aria-pressed={room===key} onClick={()=>{video.current?.pause();setFilmId(null);setCareFilm(null);setRoom(careRoom(key));setMessage(`一起在${label==='晚上'?'房間裏':label}坐坐。`)}}><Icon size={16}/>{label}</button>)}</div>
 <div className="pet-stage" ref={stage}>{filmId&&!filmFailed?<video key={`${filmId}-${filmKey}`} ref={video} src={`/eva-mum/films/${filmId}-flowers.mp4`} poster={films[filmId].poster} disablePictureInPicture onCanPlay={e=>{if(!reduced&&!document.hidden){e.currentTarget.muted=true;void e.currentTarget.play().catch(()=>setPlaying(false))}}} aria-label={`${films[filmId].name} 送花電影`} muted playsInline autoPlay={!reduced} preload="metadata" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)} onError={()=>{setFilmFailed(true);setPlaying(false)}}/>:room!=='home'?<img src={`/eva-mum/films/rooms-v1/${room}-pet.jpg`} alt={room==='garden'?'Boris、Miffy 和鸛鸛在花園陪你':'Boris、Miffy 和鸛鸛在大睡房過晚上'} width={1280} height={720}/>:<WellnessArt scene={roomArt} label="Boris 在小客廳陪你坐一會"/>}
 {!filmId&&<button className="pet-touch" aria-label="摸摸 Boris" onClick={()=>void care('pet')}/>}

 </div>
 <div className="pet-reply" role="status"><span>{filmId?films[filmId].name:'Boris'}</span><p>{message}</p>{filmId&&!filmFailed&&<button className="text-button" aria-label={playing?'暫停送花短片':'播放送花短片'} onClick={()=>{if(!video.current)return;if(playing)video.current.pause();else{if(video.current.ended)video.current.currentTime=0;void video.current.play().catch(()=>setFilmFailed(true))}}}>{playing?<Pause size={17}/>:<Play size={17}/>} {playing?'暫停':'播放'}</button>}</div>
 {filmId==='boris'&&<p className="muted">這是之前製作的 Boris 影片；片內嘴形尚待修正，封面已更新。</p>}
 {filmId&&<button className="text-button" onClick={()=>{video.current?.pause();setFilmId(null);setPlaying(false)}}>回到 Boris 的小屋</button>}
 {filmFailed&&filmId&&<p role="alert" className="muted">短片暫時未能載入。<button className="text-button" onClick={()=>openFilm(filmId)}>重新載入短片</button></p>}
 <div className="pet-care-grid">{([['feed',Apple],['tea',Coffee],['water',Leaf],['play',Gamepad2],['rest',Moon],['flowers',Flower2]] as const).map(([a,Icon])=><button key={a} onClick={()=>a==='play'?startGame():void care(a)}><Icon size={23}/><span>{careLabels[room][a]}</span></button>)}</div>
 {error&&<div className="error" role="alert">{error}<button onClick={onReload}>重新讀取小屋</button></div>}
 <details className="pet-cinema pet-extra"><summary>朋友送來的小電影</summary><div className="section-head"><h2>送花小電影</h2></div><p className="muted">選一位朋友，即可播放。隨時看，不需要完成任何事情。</p><div className="pet-film-options">{(Object.keys(films) as FilmId[]).map(id=><button key={id} aria-label={`播放 ${films[id].name} 送花電影`} aria-pressed={filmId===id} onClick={()=>openFilm(id)}><img src={films[id].poster} alt=""/><span><Play size={15}/>{films[id].name}</span></button>)}</div></details>
 <MiniTrips reduced={reduced} onOpen={()=>video.current?.pause()}/>
 <FriendsCinema reduced={reduced} onOpen={()=>video.current?.pause()}/>
 <CozyCinema reduced={reduced} decor={state.decor} corner={state.corner} busy={busy} preview={preview} onOpen={()=>video.current?.pause()} onSave={(decor,corner)=>commit({...state,decor,corner},'布置已留下來，下次回來仍然在。')}/>
 <GiftCinema reduced={reduced} onOpen={()=>video.current?.pause()}/>
 <button className="soft-button full" onClick={onArchive}>小屋相簿 · 禮物與舊日小場景</button>
 <details className="pet-keepsakes pet-extra"><summary>一起留下的小回憶</summary>{state.memories.length?<ol>{state.memories.slice().reverse().map((m,i)=><li key={i}><small>{m.date} · {m.room?careRoomNames[m.room]:'以往片刻（場景未記錄）'}</small><p>{m.game?gameNames[m.game]:m.room?careLabels[m.room][m.action]:labels[m.action]}{m.event==='film'?' · 已看完':''}</p></li>)}</ol>:<p className="muted">喜歡的片刻，會慢慢留在這裏。</p>}<p className="muted">保留最近二十段已看完的影片或遊戲小片刻；舊記錄不會推測當時場景。</p></details>
 </section>
}
