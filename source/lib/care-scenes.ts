import type {PetAction} from './pet';
export type CareRoom='home'|'garden'|'night';
export const careRoomNames:Record<CareRoom,string>={home:'小客廳',garden:'花園',night:'晚上'};
export function careRoom(value:string):CareRoom{return value==='garden'||value==='night'?value:'home'}
// Only reviewed, installed files can play. A missing room never borrows another room's film.
export function careMedia(room:CareRoom,action:PetAction){
 if(room==='home') return {src:action==='play'?null:`/eva-mum/films/care-${action}-v1.mp4`,poster:'/eva-mum/films/care-cottage-v1.png'};
 const key=`/eva-mum/films/rooms-v1/${room}-${action==='play'?'pet':action}`;
 return {src:action==='play'?null:`${key}.mp4`,poster:`${key}.jpg`};
}
export const careSceneLines:Record<CareRoom,Partial<Record<PetAction,string>>>={
 home:{},
 garden:{feed:'Boris 和 Miffy 留了一個野餐的位置給你。',tea:'樹蔭下，和 Boris、Miffy 一起慢慢喝杯茶。',water:'一起照顧花草，也享受這一點綠。',rest:'在樹蔭下坐坐，慢慢來就好。',flowers:'花園裏的小心意，也有你的一份。',pet:'Boris 和 Miffy 都在這裏，陪你慢慢來。'},
 night:{feed:'小點心，陪你慢慢度過這一刻。',tea:'暖燈、暖飲，不用趕着做下一件事。',water:'替窗邊的小盆栽添一點水，慢慢享受這一刻。',rest:'一張薄毯，舒服地陪你坐一會。',flowers:'朋友送來一束花，為今晚添一點溫柔。',pet:'月光下的小屋，安安靜靜陪着你。'},
};
export const careLabels:Record<CareRoom,Record<PetAction,string>>={
 home:{feed:'小茶點',tea:'泡杯茶',water:'澆澆花',play:'一起玩',rest:'蓋張薄毯',flowers:'送束花',pet:'摸摸 Boris'},
 garden:{feed:'小野餐',tea:'樹下喝茶',water:'澆澆花',play:'一起玩',rest:'陪我坐坐',flowers:'送束花',pet:'摸摸 Boris'},
 night:{feed:'小點心',tea:'暖暖飲品',water:'照顧小花',play:'一起玩',rest:'蓋張薄毯',flowers:'送束花',pet:'摸摸 Boris'},
};
