/** Position the illustration before playback, never race a smooth scroll with a short animation. */
export function showScene(element:HTMLElement|null){
 if(!element)return;
 const box=element.getBoundingClientRect(),viewport=window.visualViewport;
 const top=(viewport?.offsetTop||0)+12;
 const bottom=(viewport?.offsetTop||0)+(viewport?.height||window.innerHeight)-(document.querySelector('nav[aria-label="主要分頁"]')?.getBoundingClientRect().height||90)-12;
 if(box.top<top||box.bottom>bottom)window.scrollTo({top:Math.max(0,window.scrollY+box.top-top),behavior:'instant'});
}
