export const miniTrips = [
  {
    "id": "coast",
    "title": "海邊小旅行",
    "description": "聽海、放風箏，留一點日落的光。",
    "scenes": [
      {
        "id": "coast-arrival",
        "title": "海風帶路",
        "line": "不用趕路，選一樣現在想做的事。"
      },
      {
        "id": "coast-shells",
        "title": "貝殼的小聲音",
        "line": "這個小發現，剛剛好。"
      },
      {
        "id": "coast-kite",
        "title": "風箏的小尾巴",
        "line": "多一點小插曲，也很有趣。"
      },
      {
        "id": "coast-rest",
        "title": "傘下坐一會",
        "line": "先坐一會，再選想去的地方。"
      },
      {
        "id": "coast-castle",
        "title": "小城堡的旗子",
        "line": "這一程，謝謝有你一起。"
      },
      {
        "id": "coast-sunset",
        "title": "把夕陽留一會",
        "line": "風景和朋友，都慢慢留在心裏。"
      }
    ]
  },
  {
    "id": "forest",
    "title": "森林小旅行",
    "description": "跟着樹影走，遇見小花和小亮光。",
    "scenes": [
      {
        "id": "forest-arrival",
        "title": "走進樹影裏",
        "line": "不用趕路，選一樣現在想做的事。"
      },
      {
        "id": "forest-acorn",
        "title": "滾過來的小果子",
        "line": "這個小發現，剛剛好。"
      },
      {
        "id": "forest-flower",
        "title": "頭頂的小花",
        "line": "多一點小插曲，也很有趣。"
      },
      {
        "id": "forest-rest",
        "title": "樹下的小空位",
        "line": "先坐一會，再選想去的地方。"
      },
      {
        "id": "forest-leaves",
        "title": "葉子小雨傘",
        "line": "這一程，謝謝有你一起。"
      },
      {
        "id": "forest-lights",
        "title": "等一點小亮光",
        "line": "風景和朋友，都慢慢留在心裏。"
      }
    ]
  },
  {
    "id": "snow",
    "title": "雪地小旅行",
    "description": "看看腳印、堆個雪人，再暖暖手。",
    "scenes": [
      {
        "id": "snow-arrival",
        "title": "軟綿綿的雪地",
        "line": "不用趕路，選一樣現在想做的事。"
      },
      {
        "id": "snow-prints",
        "title": "原來是我們的腳印",
        "line": "這個小發現，剛剛好。"
      },
      {
        "id": "snow-snowball",
        "title": "小雪球坐哪裏",
        "line": "多一點小插曲，也很有趣。"
      },
      {
        "id": "snow-rest",
        "title": "暖杯在手心",
        "line": "先坐一會，再選想去的地方。"
      },
      {
        "id": "snow-snowman",
        "title": "帽子有點大",
        "line": "這一程，謝謝有你一起。"
      },
      {
        "id": "snow-sky",
        "title": "一起看遠方",
        "line": "風景和朋友，都慢慢留在心裏。"
      }
    ]
  }
] as const;
export type TripId = typeof miniTrips[number]['id'];
export const tripAsset = (id:string, extension:string) => `/eva-mum/films/trips-v1/${id}.${extension}`;
// Six unique films form four optional paths: arrival, discovery, rest, ending.
export function tripChoices(step:number):number[]{
 if(step===0)return [1,2];
 if(step===1||step===2)return [3];
 if(step===3)return [4,5];
 return [];
}
