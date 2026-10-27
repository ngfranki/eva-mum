// No credentials or health data live on Netlify. Supabase verifies the app session.
const UPSTREAM='https://lvwspnjysfyomuszzjay.supabase.co/functions/v1/eva-mum-api/';
// Netlify's internal request URL may use a different scheme/host behind its proxy.
// Validate the browser against our fixed public origin, never forwarded host headers.
const PUBLIC_ORIGIN='https://eva-mum.netlify.app';
const paths=new Set(['nutrition-estimate','nutrition-assistant','meal-catalog','data','session','ring','gifts','ring-capabilities','devotional']);
export async function proxy(req:Request){
 const url=new URL(req.url),path=url.pathname.replace(/^\/api\//,'');
 if(!paths.has(path))return new Response(null,{status:404});
 if(!['GET','POST','DELETE'].includes(req.method))return new Response(null,{status:405});
 if(req.method!=='GET'&&(req.headers.get('origin')!==PUBLIC_ORIGIN||req.headers.get('sec-fetch-site')==='cross-site'))return Response.json({error:'請從小屋內操作。'},{status:403});
 const headers=new Headers();
 for(const name of ['cookie','origin','content-type','sec-fetch-site']){const v=req.headers.get(name);if(v)headers.set(name,v)}
 try{
  const body=req.method==='GET'?undefined:await req.text();if(body&&body.length>(path==='nutrition-assistant'?1450000:16000))return new Response(null,{status:413});
  const response=await fetch(UPSTREAM+path+url.search,{method:req.method,headers,body,cache:'no-store',redirect:'error',signal:AbortSignal.timeout(90000)});
  const out=new Headers({'Cache-Control':'private, no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff','Content-Type':'application/json; charset=utf-8'});
  const cookie=response.headers.get('set-cookie');if(cookie)out.set('Set-Cookie',cookie);
  return new Response(response.body,{status:response.status,headers:out});
 }catch{return Response.json({error:'暫時未能連接小屋，請稍後再試。'},{status:503,headers:{'Cache-Control':'no-store'}})}
}
