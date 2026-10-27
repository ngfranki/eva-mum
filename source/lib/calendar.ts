export function calendarReminder(date:string,hideSensitive=true){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||new Date(date+'T00:00:00Z').toISOString().slice(0,10)!==date)throw Error('請選擇有效的提醒日期。');
 const stamp=(d:Date)=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
 const start=new Date(date+'T09:00:00+08:00'),end=new Date(+start+15*60000);
 const summary=hideSensitive?'小屋的一點時間':'溫柔記下自己的經期';
 return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//eva-mum//Private reminder//ZH','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:eva-mum-${date}@private.local`,`DTSTAMP:${stamp(new Date())}`,`DTSTART:${stamp(start)}`,`DTEND:${stamp(end)}`,`SUMMARY:${summary}`,'DESCRIPTION:按自己的步伐打開小屋。','BEGIN:VALARM','TRIGGER:PT0M','ACTION:DISPLAY',`DESCRIPTION:${summary}`,'END:VALARM','END:VEVENT','END:VCALENDAR',''].join('\r\n');
}
