import {dayNumber,type RecordRow} from './content';
export const workoutTypes=['散步','跑步','伸展','瑜伽','力量訓練','踩單車','游泳','其他'] as const;
export const emptyActivity={steps:null,activeMinutes:null,activeCalories:null,totalCalories:null,note:''};
export const emptyWorkout=(date:string)=>({date,type:'散步',minutes:null,effort:null,note:''});
export type ActivityMetric='steps'|'activeMinutes'|'activeCalories'|'totalCalories'|'movement';
export const metricLabels:Record<ActivityMetric,string>={steps:'步數',activeMinutes:'活動時間',activeCalories:'活動消耗',totalCalories:'全日總消耗',movement:'活動指數'};
export function activityDay(date:string,ringRows:any[],records:RecordRow[]){
 const ring=ringRows.find(r=>r.date===date)||{};
 const manual=records.find(r=>r.kind==='activity'&&r.key===date&&!r.deleted)?.value||{};
 const diary=records.find(r=>r.kind==='manual'&&r.key===date&&!r.deleted)?.value||{};
 const read=(key:ActivityMetric)=>{
  // Calorie schema is not documented in the public API: do not guess field names.
  const auto=key==='activeCalories'||key==='totalCalories'?null:ring[key];
  const hand=manual[key]??(key==='steps'?diary.steps:null);
  return auto!=null?{value:auto,source:'ring' as const}:hand!=null?{value:hand,source:'manual' as const}:{value:null,source:null};
 };
 return {date,steps:read('steps'),activeMinutes:read('activeMinutes'),activeCalories:read('activeCalories'),totalCalories:read('totalCalories'),movement:read('movement'),worn:diary.worn||null};
}
export function activityWeek(date:string,ring:any[],rows:RecordRow[]){return Array.from({length:7},(_,i)=>activityDay(new Date((dayNumber(date)-6+i)*86400000).toISOString().slice(0,10),ring,rows));}
