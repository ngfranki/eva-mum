import {z} from 'zod';
import {hkDate,dayNumber,type RecordRow} from './content';
import {activityDay} from './activity';
export const mealSlots=['早餐','午餐','下午茶','晚餐','宵夜'] as const;
export const nutrients=['kcal','protein','carbs','fat','fiber'] as const;
export const nutrientLabels={kcal:'熱量',protein:'蛋白質',carbs:'碳水化合物',fat:'脂肪',fiber:'纖維'};
const num=(max:number)=>z.number().finite().min(0).max(max).nullable();
export const foodSchema=z.object({id:z.string().uuid(),name:z.string().trim().min(1).max(100),portion:z.string().max(80),kcal:num(10000),protein:num(1000),carbs:num(2000),fat:num(1000),fiber:num(500),source:z.enum(['label','estimate','manual']),sodium:z.enum(['unknown','high','normal'])}).strict();
const recordedDate=z.string().refine(d=>/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(dayNumber(d))&&new Date(dayNumber(d)*86400000).toISOString().slice(0,10)===d&&d>='1900-01-01'&&d<=hkDate(),'請核對記錄日期。');
export const mealSchema=z.object({date:recordedDate,slot:z.enum(mealSlots),time:z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),foods:z.array(foodSchema).min(1).max(30),note:z.string().max(500)}).strict().refine(v=>new Set(v.foods.map(f=>f.id)).size===v.foods.length,'食物項目重複。');
export const templateSchema=z.object({name:z.string().trim().min(1).max(80),foods:z.array(foodSchema).min(1).max(30),note:z.string().max(500)}).strict();
export const nutritionDaySchema=z.object({date:recordedDate,complete:z.boolean(),mode:z.enum(['rest','active']),note:z.string().max(500)}).strict();
export const measurementSchema=z.object({date:recordedDate,weight:z.number().finite().min(20).max(400).nullable(),fatKg:num(200),waist:z.number().finite().min(30).max(250).nullable(),device:z.string().max(80),note:z.string().max(500)}).strict().refine(v=>[v.weight,v.fatKg,v.waist].some(x=>x!==null),'請填至少一項量度。').refine(v=>v.fatKg===null||v.weight===null||v.fatKg<=v.weight,'脂肪重量不能高於體重。');
const target=z.object({kcal:z.number().finite().min(1000).max(6000).nullable(),protein:num(500),carbs:num(1000),fat:num(500),fiber:num(100)}).strict();
export const goalSchema=z.object({rest:target,active:target,bmr:z.number().finite().min(500).max(4000).nullable(),tef:num(20),monthlyDeficit:num(30000),weight:z.number().finite().min(20).max(400).nullable(),waist:z.number().finite().min(30).max(250).nullable(),targetDate:z.string().refine(d=>d===''||(/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(dayNumber(d))&&new Date(dayNumber(d)*86400000).toISOString().slice(0,10)===d)),note:z.string().max(500)}).strict();
export type Food=z.infer<typeof foodSchema>;export type Meal=z.infer<typeof mealSchema>;export type Goals=z.infer<typeof goalSchema>;
export const blankTarget=()=>({kcal:null,protein:null,carbs:null,fat:null,fiber:null});
export const blankGoals=():Goals=>({rest:blankTarget(),active:blankTarget(),bmr:null,tef:null,monthlyDeficit:null,weight:null,waist:null,targetDate:'',note:''});
export const blankFood=():Food=>({id:crypto.randomUUID(),name:'',portion:'1 份',kcal:null,protein:null,carbs:null,fat:null,fiber:null,source:'manual',sodium:'unknown'});
export const shiftDate=(d:string,n:number)=>new Date((dayNumber(d)+n)*86400000).toISOString().slice(0,10);
export function sumFoods(foods:Food[],key:typeof nutrients[number]){return {value:foods.length?foods.reduce((s,f)=>s+(f[key]??0),0):null,known:foods.filter(f=>f[key]!==null).length,total:foods.length,complete:foods.length>0&&foods.every(f=>f[key]!==null)}}
export type EnergyProfile={age:number;height:number;weight:number;bmr:number;asOf:string};
export function nutritionDay(date:string,rows:RecordRow[],recent:any[],goals:Goals,profile?:EnergyProfile,now=new Date()){
 const meals=rows.filter(r=>r.kind==='meal'&&!r.deleted&&r.value.date===date);const foods=meals.flatMap(r=>r.value.foods) as Food[];
 const entry=rows.find(r=>r.kind==='nutritionDay'&&r.key===date&&!r.deleted)?.value;
 const totals=Object.fromEntries(nutrients.map(k=>[k,sumFoods(foods,k)])) as Record<typeof nutrients[number],ReturnType<typeof sumFoods>>;
 const activity=activityDay(date,recent,rows);const intake=totals.kcal.complete?totals.kcal.value:null;
 // Full-day calories already contain resting energy: never add BMR/activity/TEF again.
 const manualTotal=activity.totalCalories.value;
 const latestWeight=rows.filter(r=>r.kind==='measurement'&&!r.deleted&&r.value.date<=date&&r.value.date>= (profile?.asOf||'')&&r.value.weight!=null).sort((a,b)=>b.value.date.localeCompare(a.value.date))[0]?.value.weight;
 const weight=latestWeight??profile?.weight;
 const bmr=goals.bmr??(profile?profile.bmr+10*((weight??profile.weight)-profile.weight):null);
 const currentDay=hkDate(now)===date;
 // Reference ledger uses the full day's BMR, including while today is in progress.
 const walking=profile&&weight!=null&&activity.steps.value!=null?activity.steps.value*(profile.height/100*0.413)/1000*weight*0.5:null;
 const active=activity.activeCalories.value??walking;
 const tef=intake!==null?intake*0.1:null;
 const estimate=bmr!==null&&active!==null&&tef!==null?bmr+active+tef:null;
 const expenditure=manualTotal??estimate;
 const provisionalBalance=intake!==null&&expenditure!==null?expenditure-intake:null;
 const balance=entry?.complete&&intake!==null&&expenditure!==null?expenditure-intake:null;

 return {date,meals,foods,totals,entry,activity,expenditure,provisionalBalance,currentDay,bmr,tef,active,manualTotal,activeSource:activity.activeCalories.value!==null?'手動活動消耗':walking!==null?'按步數估算':'未有活動資料',autoEstimated:manualTotal===null,expenditureSource:manualTotal!==null?'手動填入全日總消耗':'全日基礎代謝＋攝入×10%＋活動消耗' ,balance,target:goals[entry?.mode==='active'?'active':'rest']};
}
export function measuredTrend(points:{date:string;value:number}[]){const p=[...points].sort((a,b)=>a.date.localeCompare(b.date));if(p.length<2)return {change:null,weekly:null};const days=dayNumber(p.at(-1)!.date)-dayNumber(p[0].date);const change=p.at(-1)!.value-p[0].value;return {change,weekly:days>=7?change/days*7:null}}
export function reportText(start:string,end:string,rows:RecordRow[],recent:any[],goals:Goals,profile?:EnergyProfile){const lines=['慢慢小屋 · 私人生活記錄',`${start} 至 ${end}`,'未記錄不等於零；熱量與身體量度只供參考。'];for(let d=start;d<=end;d=shiftDate(d,1)){const v=nutritionDay(d,rows,recent,goals,profile);lines.push(`${d}｜步數 ${v.activity.steps.value??'未記錄'}｜攝入 ${v.totals.kcal.complete?v.totals.kcal.value:'未完整記錄'} kcal｜能量差 ${v.balance===null?'未能計算':Math.round(v.balance)+' kcal（消耗減攝入）'}`);lines.push('  '+nutrients.slice(1).map(k=>nutrientLabels[k]+' '+(v.totals[k].complete?Math.round(v.totals[k].value!*10)/10+' g':'未完整記錄')).join('｜'));for(const m of v.meals)lines.push(`  ${m.value.slot} ${m.value.time}：${m.value.foods.map((f:Food)=>f.name+' '+f.portion).join('、')} ${m.value.note}`)}for(const r of rows.filter(r=>r.kind==='measurement'&&!r.deleted&&r.value.date>=start&&r.value.date<=end))lines.push(`${r.value.date} 量度｜體重 ${r.value.weight??'—'} kg｜BIA脂肪 ${r.value.fatKg??'—'} kg｜腰圍 ${r.value.waist??'—'} cm｜${r.value.device}`);return lines.join('\n')}
