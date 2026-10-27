import type {DecorId} from './cozy-scenes';
export const petActions=['feed','tea','water','play','rest','flowers','pet'] as const;
export type PetAction=typeof petActions[number];
export const petRooms=['home','garden','night'] as const;
export const petLines:Record<PetAction,string[]>={feed:['Boris 把小點心收下，留了一個位置給你。','今天的小茶會，因為有你而暖了一點。'],tea:['茶已泡好。我們坐一會，不用趕。','把杯子捧暖，也把這一刻留給自己。'],water:['小花喝到水了，慢慢長就很好。','今天留下一點綠，窗邊又柔和了一點。'],play:['謝謝你陪我玩。開心不用有理由。','剛剛那一小段歡樂，也值得收藏。'],rest:['一張薄毯，陪你歇一會。','休息不是中斷，是我們的日常。'],flowers:['這一束花，讓我們的小屋亮起來了。','這一束小心意，想再看時隨時回來。'],pet:['你來了。這裏一直有你的位置。','不用帶任何成績來，我很高興見到你。']};
export type PetMemory={action:PetAction;date:string;room?:typeof petRooms[number];event?:'film'|'game';game?:'crush'|'memory'|'bubble'|'shooter'};
export const initialPet=()=>({decor:[] as DecorId[],corner:null as DecorId|null,room:'home',food:'berries',plant:0,discovered:[] as string[],memories:[] as PetMemory[],lastAction:null as PetAction|null});
export function careForPet(state:ReturnType<typeof initialPet>,action:PetAction,date:string,detail:Omit<PetMemory,'action'|'date'>={}){return {...state,plant:action==='water'?Math.min(3,state.plant+1):state.plant,discovered:Array.from(new Set([...state.discovered,action])),lastAction:action,memories:[...state.memories,{action,date,...detail}].slice(-20)}}
