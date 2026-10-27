'use client';
import {useEffect,useState} from 'react';
import type {GiftAccess} from '../lib/gift-access';
export function useGiftAccess(accountId:string|undefined,today:string,preview:boolean){
 const [retry,setRetry]=useState(0),[saved,setSaved]=useState<{owner:string;day:string;access:GiftAccess}|null>(null);
 useEffect(()=>{if(!accountId||preview)return;let current=true;const controller=new AbortController();
 void (async()=>{try{const r=await fetch('/api/gifts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({accountId}),signal:controller.signal,cache:'no-store'});const d:any=await r.json();if(!r.ok||d.accountId!==accountId||!Number.isInteger(d.count)||d.count<10||d.count>30)throw Error();if(current)setSaved({owner:accountId,day:today,access:{state:'ready',count:d.count,newGiftId:d.newGiftId}})}catch{if(current)setSaved(previous=>({owner:accountId,day:today,access:{state:'error',count:previous?.owner===accountId?previous.access.count:10}}))}})();
 return()=>{current=false;controller.abort()};
 },[accountId,today,preview,retry]);
 const access:GiftAccess=preview?{state:'preview',count:10}:!accountId?{state:'signedout',count:10}:saved?.owner===accountId&&saved.day===today?saved.access:{state:'loading',count:saved?.owner===accountId?saved.access.count:10};
 return {access,retry:()=>setRetry(n=>n+1)};
}
