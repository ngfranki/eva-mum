import {validateMutation} from './validation';
export class StoreError extends Error{constructor(public status:number,message:string){super(message)}}
export const unpack=(r:any)=>({kind:r.kind,key:r.key,value:JSON.parse(r.value),version:r.version,deleted:!!r.deleted,updatedAt:r.updated_at});
export async function readRecords(db:any,owner:string){if(db.backend==='supabase')return db.call('records');return (await db.prepare('SELECT * FROM records WHERE owner = ? ORDER BY updated_at DESC').bind(owner).all()).results.map(unpack)}
export async function writeRecord(db:any,owner:string,input:unknown){
 const m=validateMutation(input),fp=JSON.stringify(m);
 if(db.backend==='supabase'){const r=await db.call(['meal','mealTemplate','nutritionDay','measurement','nutritionGoals'].includes(m.kind)?'nutrition_write':'write',{...m,fingerprint:fp});if(r.error)throw new StoreError(409,'記錄已有更新，或經期日期有重疊。請先查看最新記錄再儲存。');return r}
 const old=await db.prepare('SELECT fingerprint,result FROM receipts WHERE owner=? AND op=?').bind(owner,m.operationId).first();
 if(old){if(old.fingerprint!==fp)throw new StoreError(409,'這次操作已改變，請重新開啟記錄。');return JSON.parse(old.result)}
 // A single SQL statement both checks revision and rejects overlapping periods.
 const overlap=m.kind==='period'&&!m.deleted?`AND NOT EXISTS (SELECT 1 FROM records p WHERE p.owner=? AND p.kind='period' AND p.key<>? AND p.deleted=0 AND json_extract(p.value,'$.start') <= ? AND COALESCE(json_extract(p.value,'$.end'),'9999-12-31') >= ?)` : '';
 const overlapArgs=overlap?[owner,m.key,m.value.end||'9999-12-31',m.value.start]:[];
 const now=new Date().toISOString();
 const noReplay="AND NOT EXISTS (SELECT 1 FROM receipts WHERE owner=? AND op=?)";
 const replayArgs=[owner,m.operationId];
 const write=db.prepare(`INSERT INTO records(owner,kind,key,value,version,deleted,last_op,updated_at) SELECT ?,?,?,?,1,?,?,? WHERE ?=0 ${overlap} ${noReplay} ON CONFLICT(owner,kind,key) DO UPDATE SET value=excluded.value,version=records.version+1,deleted=excluded.deleted,last_op=excluded.last_op,updated_at=excluded.updated_at WHERE records.version=? ${overlap} ${noReplay}`);
 // INSERT with expectedVersion > 0 needs an existing-row SELECT to reach the conflict branch.
 const sql=m.expectedVersion===0?write:db.prepare(`UPDATE records SET value=?,version=version+1,deleted=?,last_op=?,updated_at=? WHERE owner=? AND kind=? AND key=? AND version=? ${overlap} ${noReplay}`);
 const bound=m.expectedVersion===0?sql.bind(owner,m.kind,m.key,JSON.stringify(m.value),+m.deleted,m.operationId,now,0,...overlapArgs,...replayArgs,0,...overlapArgs,...replayArgs):sql.bind(JSON.stringify(m.value),+m.deleted,m.operationId,now,owner,m.kind,m.key,m.expectedVersion,...overlapArgs,...replayArgs);
 const receipt=db.prepare(`INSERT OR IGNORE INTO receipts(owner,op,fingerprint,result) SELECT owner,?,?,json_object('kind',kind,'key',key,'value',json(value),'version',version,'deleted',json(CASE deleted WHEN 1 THEN 'true' ELSE 'false' END),'updatedAt',updated_at) FROM records WHERE owner=? AND kind=? AND key=? AND last_op=?`).bind(m.operationId,fp,owner,m.kind,m.key,m.operationId);
 await db.batch([bound,receipt]);
 const done=await db.prepare('SELECT fingerprint,result FROM receipts WHERE owner=? AND op=?').bind(owner,m.operationId).first();
 if(!done)throw new StoreError(409,'記錄已有更新，或經期日期有重疊。你的輸入仍保留，請先查看最新記錄再儲存。');
 if(done.fingerprint!==fp)throw new StoreError(409,'操作識別碼重複。');
 return JSON.parse(done.result);
}
