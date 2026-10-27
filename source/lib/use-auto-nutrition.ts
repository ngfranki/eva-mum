'use client';
import {useEffect,useState,useRef} from 'react';
import {foodSchema,nutrients,type Food} from './nutrition';
import type {RecordRow} from './content';
const signature=(f:Food)=>JSON.stringify([f.name,f.portion,...nutrients.map(k=>f[k])]);
export function useAutoNutrition(rows:RecordRow[],accountId:string|undefined,online:boolean){
 const [cache,setCache]=useState<Record<string,Food>>({});const [status,setStatus]=useState('');const [retry,setRetry]=useState(0);
 const owner=useRef(accountId);const foods=rows.filter(r=>r.kind==='meal'&&!r.deleted).flatMap(r=>r.value.foods as Food[]);
 const requestKey=JSON.stringify(foods.filter(f=>nutrients.some(k=>f[k]===null)).map(f=>[f.id,signature(f)]));
 useEffect(()=>{let active=true;if(owner.current!==accountId){owner.current=accountId;setCache({});}
 if(!online)return;
 const missing=[...new Map(foods.filter(f=>nutrients.some(k=>f[k]===null)&&!cache[signature(f)]).map(f=>[signature(f),f])).values()];
 if(!missing.length){setStatus('');return}
 const run=async()=>{setStatus('正在自動估算營養…');for(const food of missing){if(!active)return;try{const res=await fetch('/api/nutrition-estimate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({foods:[food]})});const data:any=await res.json();if(!res.ok||data.accountId!==accountId)throw Error();const estimated=foodSchema.parse(data.foods?.[0]);if(active)setCache(c=>({...c,[signature(food)]:estimated}));}catch{if(active)setStatus('自動估算暫時未完成，按此重試。');return}}if(active)setStatus('')};void run();return()=>{active=false};
 // Cache changes do not restart a request. A changed portion or original value invalidates its signature.
 },[requestKey,accountId,online,retry]);
 const enriched=rows.map(r=>r.kind==='meal'&&!r.deleted?{...r,value:{...r.value,foods:r.value.foods.map((f:Food)=>{const v=owner.current===accountId?cache[signature(f)]:null;return v?{...f,...Object.fromEntries(nutrients.map(k=>[k,f[k]??v[k]])),source:'estimate'}:f})}}:r);
 return {rows:enriched,status,retry:()=>setRetry(n=>n+1),estimated:Object.keys(cache).length>0};
}
