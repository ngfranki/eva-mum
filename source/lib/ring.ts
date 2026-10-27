export function parseRing(raw:any,date:string){const list=raw?.data?.metrics?.[date];if(!Array.isArray(list))throw Error('schema');const m:any=Object.fromEntries(list.filter((x:any)=>x&&typeof x.type==='string'&&x.object).map((x:any)=>[x.type,x.object]));const sl=m.sleep||{};const n=(v:any,min:number,max:number)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max?v:null;
return {date,sleepMinutes:n(sl.total_sleep?.minutes,0,1440),sleepScore:n(sl.sleep_score?.score,0,100),recovery:n(m.recovery_index?.value,0,100),steps:n(m.steps?.total,0,200000),movement:n(m.movement_index?.value,0,100),activeMinutes:n(m.active_minutes?.value,0,1440),rhr:n(m.night_rhr?.avg,20,250),hrv:n(m.avg_sleep_hrv?.value,0,500)};}
export function ringStatus(rows:any[],lastSuccess:string|null,failed:boolean,now=new Date(),sourceLastSyncedAt?:string|null){if(failed)return 'error';if(!lastSuccess)return 'unconnected';if(+now-Date.parse(lastSuccess)>36*3600000||(sourceLastSyncedAt&&+now-Date.parse(sourceLastSyncedAt)>36*3600000))return 'stale';if(!rows.some(r=>r.sleepMinutes!=null||r.recovery!=null||r.steps!=null||r.activeMinutes!=null||r.movement!=null))return 'empty';return 'ok'}

// Official last_synced_at is Unix seconds; never confuse a fresh HTTP request with fresh ring readings.
export function sourceSyncTime(raw:any,now=Date.now()){const v=raw?.data?.last_synced_at;return typeof v==='number'&&Number.isFinite(v)&&v>946684800&&v*1000<=now+300000?new Date(v*1000).toISOString():null}

// Merge only successful dates. Failed dates keep their previous reading and freshness.
export function mergeRingRows(previous:any[],incoming:any[]){
 const dates=new Map(previous.map(r=>[r.date,r]));for(const r of incoming)dates.set(r.date,r);
 return [...dates.values()].sort((a,b)=>b.date.localeCompare(a.date));
}
