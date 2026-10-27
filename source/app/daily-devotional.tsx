'use client';
import {useEffect,useRef,useState} from 'react';
import {BookHeart,ChevronDown,ChevronUp} from 'lucide-react';
import {devotionalSource,type parseDevotional} from '../lib/devotional';
type Article=ReturnType<typeof parseDevotional>;
export function DailyDevotional({date}:{date:string}){
 const [open,setOpen]=useState(false),[article,setArticle]=useState<Article|null>(null),[error,setError]=useState(''),[retry,setRetry]=useState(0);
 const trigger=useRef<HTMLButtonElement>(null),source=devotionalSource(date);
 useEffect(()=>{if(!open||article)return;const controller=new AbortController();let active=true;setError('');
 void fetch(`/api/devotional?date=${encodeURIComponent(date)}`,{signal:controller.signal}).then(async r=>{const d=await r.json() as Article & {error?:string};if(!r.ok)throw Error(d.error||'文章暫時未能載入。');if(d.date!==date||!Array.isArray(d.paragraphs))throw Error('文章日期未能核對。');if(active)setArticle(d)}).catch(e=>{if(active)setError(e.message||'文章暫時未能載入。')});
 return()=>{active=false;controller.abort()};
 },[open,date,retry,article]);
 function close(){setOpen(false);trigger.current?.focus({preventScroll:true});trigger.current?.scrollIntoView({block:'nearest',behavior:'auto'})}
 return <section className="daily-devotional"><button ref={trigger} className="devotional-link" aria-expanded={open} aria-controls="daily-devotional-article" onClick={()=>setOpen(v=>!v)}><BookHeart size={20}/><span>{open?'收起《荒漠甘泉》':'讀今天的《荒漠甘泉》'}<small>{source.month} 月 {source.day} 日 · 香港日期</small></span>{open?<ChevronUp size={18}/>:<ChevronDown size={18}/>}</button>
 {open&&<div id="daily-devotional-article" className="devotional-article" aria-busy={!article&&!error}>
 <p className="devotional-credit">每日靈修文章 · 原作 Mrs. Charles E. Cowman<br/>來源：<a href={source.url} target="_blank" rel="noopener noreferrer">信望愛資訊中心 ↗</a></p>
 {!article&&!error&&<p role="status">正在打開今天的文章…</p>}
 {error&&<div role="alert"><p>{error}</p><button className="soft-button" onClick={()=>setRetry(n=>n+1)}>重新載入</button><a className="text-button" href={source.url} target="_blank" rel="noopener noreferrer">到原站閱讀</a></div>}
 {article&&<article aria-label={article.title}>{article.paragraphs.map((p,i)=><p key={i}>{p}</p>)}</article>}
 <button className="soft-button full devotional-close" onClick={close}><ChevronUp size={17}/>收起文章</button>
 </div>}
 </section>
}
