export const cozyScenes = [
  {
    "index": 0,
    "kind": "kitchen",
    "id": "apron",
    "title": "Miffy 的小廚師"
  },
  {
    "index": 1,
    "kind": "kitchen",
    "id": "berries",
    "title": "鸛鸛的莓果"
  },
  {
    "index": 2,
    "kind": "kitchen",
    "id": "dough",
    "title": "軟綿綿的小麵團"
  },
  {
    "index": 3,
    "kind": "kitchen",
    "id": "flour",
    "title": "一點點麵粉"
  },
  {
    "index": 4,
    "kind": "kitchen",
    "id": "cookies",
    "title": "餅乾小高塔"
  },
  {
    "index": 5,
    "kind": "kitchen",
    "id": "tea",
    "title": "一起倒杯茶"
  },
  {
    "index": 6,
    "kind": "kitchen",
    "id": "napkin",
    "title": "餐巾飛起來"
  },
  {
    "index": 7,
    "kind": "kitchen",
    "id": "plate",
    "title": "Miffy 的擺盤"
  },
  {
    "index": 8,
    "kind": "kitchen",
    "id": "tray",
    "title": "一起托住"
  },
  {
    "index": 9,
    "kind": "kitchen",
    "id": "share",
    "title": "留了一份給你"
  },
  {
    "index": 10,
    "kind": "decor",
    "id": "cushion",
    "title": "軟軟靠墊"
  },
  {
    "index": 11,
    "kind": "decor",
    "id": "blanket",
    "title": "一起鋪小毯"
  },
  {
    "index": 12,
    "kind": "decor",
    "id": "lamp",
    "title": "暖暖的小燈"
  },
  {
    "index": 13,
    "kind": "decor",
    "id": "vase",
    "title": "花枝也探頭"
  },
  {
    "index": 14,
    "kind": "decor",
    "id": "books",
    "title": "書本小靠山"
  },
  {
    "index": 15,
    "kind": "decor",
    "id": "frame",
    "title": "我們的小相架"
  },
  {
    "index": 16,
    "kind": "decor",
    "id": "rug",
    "title": "小地氈的位置"
  },
  {
    "index": 17,
    "kind": "decor",
    "id": "plant",
    "title": "綠葉小鄰居"
  }
] as const;
export const decorIds = ['cushion','blanket','lamp','vase','books','frame','rug','plant'] as const;
export type DecorId = typeof decorIds[number];
export const cozyPath = (id:string, extension:string) => `/eva-mum/films/cozy-v1/${id}.${extension}`;
