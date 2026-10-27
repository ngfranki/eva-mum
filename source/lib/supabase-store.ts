// Server-only transport: callers cannot choose an account or submit SQL.
export class SupabaseStore {
 readonly backend='supabase';
 constructor(private url:string,private key:string,private secret:string){}
 async call(command:string,payload:unknown={}){
  const nutrition=command==='nutrition_write';
  const r=await fetch(`${this.url}/rest/v1/rpc/${nutrition?'eva_mum_nutrition_write':'eva_mum_rpc'}`,{method:'POST',headers:{'Content-Type':'application/json',apikey:this.key},body:JSON.stringify(nutrition?{app_secret:this.secret,payload}:{app_secret:this.secret,command,payload}),cache:'no-store',signal:AbortSignal.timeout(15000)});
  if(!r.ok)throw new Error('Private storage unavailable');return r.json();
 }
}
