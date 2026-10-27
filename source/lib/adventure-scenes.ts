export const ADVENTURE_SCENES=[
 {name:'月光小花園',image:'/eva-mum/games/moon-garden-anime-v1.webp',difficulty:'1 · 輕鬆起步',detail:'2 隻慢步小怪、寬平台，熟習拖曳與跳躍。',count:2,speed:32,hop:0,escape:22,drift:4,moss:'#a4b87f'},
 {name:'晨光風車草原',image:'/eva-mum/games/sunrise-meadow-anime-v1.webp',difficulty:'2 · 悠閒散步',detail:'3 隻小怪、左右階梯，練習換邊。',count:3,speed:40,hop:0,escape:20,drift:5,moss:'#bdc68a'},
 {name:'湖畔繡球花園',image:'/eva-mum/games/lakeside-anime-v1.webp',difficulty:'3 · 小小挑戰',detail:'4 隻小怪、交錯平台，需要多走幾步。',count:4,speed:48,hop:0,escape:18,drift:7,moss:'#83b3a0'},
 {name:'秋日楓葉山谷',image:'/eva-mum/games/maple-valley-anime-v1.webp',difficulty:'4 · 山谷躍步',detail:'5 隻小怪開始跳躍，留意上下層。',count:5,speed:56,hop:5.5,escape:16,drift:8,moss:'#cbb28a'},
 {name:'河畔燈籠夜',image:'/eva-mum/games/river-anime-v1.webp',difficulty:'5 · 靈巧穿梭',detail:'6 隻小怪、窄一點的平台，泡泡飄移更明顯。',count:6,speed:65,hop:4.5,escape:14,drift:11,moss:'#86a6a4'},
 {name:'雪夜小庭院',image:'/eva-mum/games/snow-anime-v1.webp',difficulty:'6 · 進階跳躍',detail:'7 隻活潑小怪、錯層平台，練習連續走跳。',count:7,speed:76,hop:3.8,escape:12,drift:13,moss:'#d6e3e6'},
 {name:'星海觀測花園',image:'/eva-mum/games/stars-anime-v1.webp',difficulty:'7 · 星夜挑戰',detail:'8 隻小怪、分散平台，泡泡要更快接住。',count:8,speed:88,hop:3,escape:10,drift:16,moss:'#b5add1'},
] as const;
export function sceneFor(level:number){return ADVENTURE_SCENES[Math.max(0,Math.min(ADVENTURE_SCENES.length-1,Math.trunc(level)-1))]??ADVENTURE_SCENES[0];}
