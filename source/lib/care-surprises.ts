import {careMedia,type CareRoom} from './care-scenes';
import type {PetAction} from './pet';
export const careSurprises = [
  {
    "id": "tea-big-cup",
    "room": "home",
    "action": "tea",
    "title": "這杯有點大",
    "line": "小杯大杯，都可以慢慢喝。"
  },
  {
    "id": "tea-slide",
    "room": "garden",
    "action": "tea",
    "title": "鸛鸛的杯子",
    "line": "這裏，也留了一個位置給你。"
  },
  {
    "id": "tea-coaster",
    "room": "home",
    "action": "tea",
    "title": "杯墊也想一起來",
    "line": "慢一點，小插曲也很可愛。"
  },
  {
    "id": "tea-late",
    "room": "night",
    "action": "tea",
    "title": "慢半拍的碰杯",
    "line": "等一等，還有鸛鸛。"
  },
  {
    "id": "feed-roll",
    "room": "home",
    "action": "feed",
    "title": "差一點就滾走",
    "line": "接住了，繼續慢慢享受。"
  },
  {
    "id": "feed-small",
    "room": "night",
    "action": "feed",
    "title": "小小一塊也可愛",
    "line": "一起分享，就是好時光。"
  },
  {
    "id": "feed-napkin",
    "room": "garden",
    "action": "feed",
    "title": "先護住餐巾",
    "line": "有一點風，也有朋友幫忙。"
  },
  {
    "id": "feed-polite",
    "room": "night",
    "action": "feed",
    "title": "你先，還是我先？",
    "line": "不用急，我們一起分享。"
  },
  {
    "id": "flowers-ears",
    "room": "garden",
    "action": "flowers",
    "title": "花束後面是誰？",
    "line": "兔耳朵已經出賣你了。"
  },
  {
    "id": "flowers-butterfly",
    "room": "garden",
    "action": "flowers",
    "title": "花園的小訪客",
    "line": "小小的驚喜，剛好停在身邊。"
  },
  {
    "id": "flowers-turn",
    "room": "home",
    "action": "flowers",
    "title": "送花送過頭了",
    "line": "回頭一看，你就在這裏。"
  },
  {
    "id": "flowers-photo",
    "room": "night",
    "action": "flowers",
    "title": "終於排好了",
    "line": "一起留下這一刻。"
  }
] as const;
export function careChoices(room:CareRoom,action:PetAction){
 const fresh=careSurprises.filter(s=>s.room===room&&s.action===action).map(s=>({...s,src:`/eva-mum/films/surprises-v1/${s.id}.mp4`,poster:`/eva-mum/films/surprises-v1/${s.id}.jpg`,last:`/eva-mum/films/surprises-v1/${s.id}.last.jpg`}));
 return [...fresh,{id:`original-${room}-${action}`,room,action,title:'',line:'',...careMedia(room,action),last:undefined}];
}
// New/unseen first, then least recently played. History is only film IDs, newest first.
export function nextCareId(ids:readonly string[],history:readonly string[],current?:string){
 const candidates=ids.filter(id=>ids.length===1||id!==current);
 return candidates.find(id=>!history.includes(id)) ?? candidates.reduce((a,b)=>history.indexOf(a)>history.indexOf(b)?a:b);
}
export function rememberCareId(history:readonly string[],id:string){return [id,...history.filter(x=>x!==id)].slice(0,8)}
export function validCareHistory(x:unknown):x is string[]{return Array.isArray(x)&&x.length<=8&&x.every(v=>typeof v==='string'&&v.length<100)}
