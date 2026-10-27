export const gameFilms = [
  {
    "id": "crush-start",
    "game": "crush",
    "title": "三個剛剛好",
    "line": "排歪了一點，也可以一起玩。"
  },
  {
    "id": "crush-surprise",
    "game": "crush",
    "title": "鸛鸛也想排進去",
    "line": "鸛鸛：這個位置，留給我嗎？"
  },
  {
    "id": "memory-start",
    "game": "memory",
    "title": "差一點就偷看到",
    "line": "不用急着記住，翻翻看就好。"
  },
  {
    "id": "memory-surprise",
    "game": "memory",
    "title": "原來在這裏",
    "line": "慢慢找，也會遇見小驚喜。"
  },
  {
    "id": "bubble-start",
    "game": "bubble",
    "title": "跟着小泡泡出發",
    "line": "一起走走，看看前面有甚麼。"
  },
  {
    "id": "bubble-surprise",
    "game": "bubble",
    "title": "小隊長慢半拍",
    "line": "走快走慢，都有朋友在。"
  },
  {
    "id": "shooter-start",
    "game": "shooter",
    "title": "這顆泡泡有點頑皮",
    "line": "瞄一瞄，輕輕送出去。"
  },
  {
    "id": "shooter-surprise",
    "game": "shooter",
    "title": "泡泡帽子",
    "line": "多看一眼，又有一點好心情。"
  }
] as const;
export function gameFilmAsset(id:string,ext:string){return `/eva-mum/films/games-v1/${id}.${ext}`}
