export function devotionalSource(date:string){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date))throw Error('invalid_date');
 const d=new Date(date+'T00:00:00Z');
 if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==date)throw Error('invalid_date');
 const month=Number(date.slice(5,7)),day=Number(date.slice(8,10));
 return {date,month,day,url:`https://www.fhl.net/stream/${month}/${date.slice(5,7)}${date.slice(8,10)}.htm`};
}
function decode(text:string){return text.replace(/&(#x[\da-f]+|#\d+|nbsp|amp|lt|gt|quot|apos);/gi,(_,v:string)=>{const names:Record<string,string>={nbsp:' ',amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"};if(v[0]!=='#')return names[v.toLowerCase()]||'';const n=v[1].toLowerCase()==='x'?parseInt(v.slice(2),16):parseInt(v.slice(1),10);return n>0&&n<=0x10ffff?String.fromCodePoint(n):''})}
export function parseDevotional(html:string,date:string){
 const source=devotionalSource(date);
 if(!new RegExp(`荒漠甘泉[∕／/]\\s*${source.month}\\s*月\\s*${source.day}\\s*日`).test(html))throw Error('date_mismatch');
 const body=html.match(/<table\b[^>]*\bwidth\s*=\s*["']?95%["']?[^>]*>([\s\S]*?)<\/table\s*>/i)?.[1];
 if(!body)throw Error('article_missing');
 const paragraphs=decode(body.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,'').replace(/<\/?p\b[^>]*>|<br\s*\/?\s*>/gi,'\n\n').replace(/<[^>]*>/g,'')).split(/\n\s*\n/).map(p=>p.replace(/[\t\r\n ]+/g,' ').trim()).filter(Boolean);
 const length=paragraphs.join('').length;
 if(length<40||length>25000)throw Error('article_invalid');
 return {...source,title:`荒漠甘泉 · ${source.month} 月 ${source.day} 日`,author:'Mrs. Charles E. Cowman',sourceName:'信望愛資訊中心',paragraphs};
}
