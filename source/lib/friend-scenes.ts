export const friendGroups = [
  {
    "id": "visit-umbrella",
    "title": "Miffy 帶着雨傘來",
    "kind": "visit",
    "scenes": [
      {
        "id": "visit-umbrella-1",
        "title": "門口的小雨傘"
      },
      {
        "id": "visit-umbrella-2",
        "title": "傘尖的小水珠"
      },
      {
        "id": "visit-umbrella-3",
        "title": "留個暖暖的位置"
      }
    ]
  },
  {
    "id": "visit-cushion",
    "title": "鸛鸛帶來大咕𠱸",
    "kind": "visit",
    "scenes": [
      {
        "id": "visit-cushion-1",
        "title": "大咕𠱸來了"
      },
      {
        "id": "visit-cushion-2",
        "title": "咕𠱸坐錯位"
      },
      {
        "id": "visit-cushion-3",
        "title": "剛剛好的一排"
      }
    ]
  },
  {
    "id": "visit-boat",
    "title": "Miffy 的小紙船",
    "kind": "visit",
    "scenes": [
      {
        "id": "visit-boat-1",
        "title": "先摺一艘小船"
      },
      {
        "id": "visit-boat-2",
        "title": "船頭轉過來了"
      },
      {
        "id": "visit-boat-3",
        "title": "一起看它慢慢走"
      }
    ]
  },
  {
    "id": "visit-picnic",
    "title": "鸛鸛約你野餐",
    "kind": "visit",
    "scenes": [
      {
        "id": "visit-picnic-1",
        "title": "帶齊小東西"
      },
      {
        "id": "visit-picnic-2",
        "title": "毯子還差一角"
      },
      {
        "id": "visit-picnic-3",
        "title": "分你一點陽光"
      }
    ]
  },
  {
    "id": "laugh",
    "title": "想笑一下",
    "kind": "companion",
    "scenes": [
      {
        "id": "laugh-1",
        "title": "這片葉子有點大"
      },
      {
        "id": "laugh-2",
        "title": "帽子有自己的想法"
      },
      {
        "id": "laugh-3",
        "title": "誰多了一朵花"
      }
    ]
  },
  {
    "id": "sit",
    "title": "陪我坐坐",
    "kind": "companion",
    "scenes": [
      {
        "id": "sit-1",
        "title": "海風留個位置"
      },
      {
        "id": "sit-2",
        "title": "樹蔭裏不用趕"
      },
      {
        "id": "sit-3",
        "title": "窗邊一點午後"
      }
    ]
  },
  {
    "id": "hug",
    "title": "想要抱抱",
    "kind": "companion",
    "scenes": [
      {
        "id": "hug-1",
        "title": "靠近一點點"
      },
      {
        "id": "hug-2",
        "title": "把柔軟分給你"
      },
      {
        "id": "hug-3",
        "title": "一起蓋張薄毯"
      }
    ]
  },
  {
    "id": "quiet",
    "title": "安靜一會",
    "kind": "companion",
    "scenes": [
      {
        "id": "quiet-1",
        "title": "聽雨慢慢落"
      },
      {
        "id": "quiet-2",
        "title": "留一點星光"
      },
      {
        "id": "quiet-3",
        "title": "翻過一頁就好"
      }
    ]
  }
] as const;
export const friendAsset=(id:string,ext:string)=>`/eva-mum/films/friends-v1/${id}.${ext}`;
