export const RING_SYNC_INTERVAL = 5 * 60_000;
export const RING_RETRY_INTERVAL = 15 * 60_000;
export function ringSyncDue({now,lastAttempt,localAttempt=0,failed=false,eligible,inFlight}:{now:number;lastAttempt?:string;localAttempt?:number;failed?:boolean;eligible:boolean;inFlight:boolean}) {
 if(!eligible||inFlight)return false;
 const parsed=lastAttempt?Date.parse(lastAttempt):0;
 const latest=Math.max(Number.isFinite(parsed)?parsed:0,localAttempt);
 return !latest||now-latest>=(failed?RING_RETRY_INTERVAL:RING_SYNC_INTERVAL);
}
