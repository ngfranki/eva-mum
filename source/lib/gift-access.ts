// Stable IDs, deliberately spread across all five categories. Never reorder existing unlocks.
export const starterGifts=['heart','flowers','cake','cookie','ball','kite','blanket','pillow','sunflower','clover'];
export const discoveryGifts=['balloon','letter','bubbles','book','rainbow','tea','music','star','shell','scarf','berry','boat','mushroom','ribbon','moon','honey','pinwheel','snow','sock','icecream'];
export const giftOrder=[...starterGifts,...discoveryGifts];
export const unlockedGifts=(count:number)=>new Set(giftOrder.slice(0,Math.max(10,Math.min(30,Math.floor(count)))));
export type GiftAccess={state:'loading'|'ready'|'error'|'signedout'|'preview';count:number;newGiftId?:string|null};
