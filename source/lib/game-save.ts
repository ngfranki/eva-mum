// Only game state, never health data or credentials. Scoped to the signed-in owner.
export function readGame<T>(key:string|undefined,valid:(x:unknown)=>x is T):T|null{
 if(!key||typeof window==='undefined')return null;
 try{const raw=localStorage.getItem(key);if(!raw||raw.length>250000)return null;const data=JSON.parse(raw);return data.version===1&&valid(data.value)?data.value:null}catch{return null}
}
export function writeGame(key:string|undefined,value:unknown){if(!key||typeof window==='undefined')return;try{localStorage.setItem(key,JSON.stringify({version:1,value}))}catch{/* Playing remains available when private browsing denies storage. */}}
export function removeGame(key:string|undefined){if(key)try{localStorage.removeItem(key)}catch{}}
export const finite=(x:unknown):x is number=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
