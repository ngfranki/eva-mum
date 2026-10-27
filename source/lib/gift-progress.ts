import {hkDate} from './content';
import {giftOrder} from './gift-access';
// Only the route's server clock reaches this function. No date/count from the client.
// One atomic upsert: concurrent devices, refreshes and network retries cannot add days twice.
export async function visitGiftHouse(db:any,owner:string,now=new Date()){
 const day=hkDate(now);
 if(db.backend==='supabase'){const row=await db.call('gift_visit',{day});const count=Math.min(30,9+row.days);return {count,newGiftId:row.changed&&row.days>1?giftOrder[count-1]:null}}
 const changed=await db.prepare(`INSERT INTO gift_progress(owner,days,last_day) VALUES (?,1,?)
 ON CONFLICT(owner) DO UPDATE SET days=MIN(gift_progress.days+1,21),last_day=excluded.last_day
 WHERE gift_progress.last_day<excluded.last_day AND gift_progress.days<21 RETURNING days,last_day`).bind(owner,day).first();
 const row=changed||await db.prepare('SELECT days,last_day FROM gift_progress WHERE owner=?').bind(owner).first();
 if(!row)throw Error('未能讀取禮物進度');
 const count=Math.min(30,9+row.days);
 return {count,newGiftId:changed&&row.days>1?giftOrder[count-1]:null};
}
