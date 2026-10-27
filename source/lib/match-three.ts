export const SIDE=6;
export const ROWS=9;
export const TYPES=5;
export type Tile={id:number;kind:number};
export type Board=Tile[];
export type Match={cells:number[];axis:'row'|'column'};
export type Random=()=>number;
let serial=0;
export function adoptBoard(board:Board){serial=Math.max(serial,...board.map(t=>t.id));return board}
const tile=(kind:number):Tile=>({id:++serial,kind});
export const neighbours=(a:number,b:number)=>Number.isInteger(a)&&Number.isInteger(b)&&a>=0&&b>=0&&a<SIDE*ROWS&&b<SIDE*ROWS&&Math.abs(Math.floor(a/SIDE)-Math.floor(b/SIDE))+Math.abs(a%SIDE-b%SIDE)===1;
export function swap(board:Board,a:number,b:number){const out=[...board];[out[a],out[b]]=[out[b],out[a]];return out}
export function matches(board:Board):Match[]{
 const groups:Match[]=[];
 for(const axis of ['row','column'] as const)for(let line=0;line<(axis==='row'?ROWS:SIDE);line++){
  let run:number[]=[];
  for(let p=0;p<=(axis==='row'?SIDE:ROWS);p++){const i=axis==='row'?line*SIDE+p:p*SIDE+line;if(p<(axis==='row'?SIDE:ROWS)&&(!run.length||board[i].kind===board[run[0]].kind))run.push(i);else{if(run.length>=3)groups.push({cells:run,axis});run=p<(axis==='row'?SIDE:ROWS)?[i]:[]}}
 }
 return groups;
}
export function findMove(board:Board):[number,number]|null{
 for(let a=0;a<board.length;a++)for(const b of [a+1,a+SIDE])if(neighbours(a,b)&&board[a].kind!==board[b].kind&&matches(swap(board,a,b)).length)return [a,b];return null;
}
/** Four clears its entire line; five clears all matching characters. Crosses are deduplicated. */
export function resolveMatches(board:Board){const groups=matches(board),clear=new Set<number>();let special:'five'|'four'|null=null;
 for(const {cells,axis} of groups){cells.forEach(i=>clear.add(i));if(cells.length>=5){special='five';board.forEach((t,i)=>{if(t.kind===board[cells[0]].kind)clear.add(i)})}else if(cells.length===4){if(!special)special='four';const anchor=cells[0];for(let p=0;p<(axis==='row'?SIDE:ROWS);p++)clear.add(axis==='row'?Math.floor(anchor/SIDE)*SIDE+p:p*SIDE+anchor%SIDE)}}
 return {clear:[...clear].sort((a,b)=>a-b),special};
}
export function refill(board:Board,clear:number[],random:Random=Math.random){const removed=new Set(clear),out:Board=Array(SIDE*ROWS),from:Record<number,number>={};
 for(let col=0;col<SIDE;col++){const keep=board.map((t,i)=>({t,i})).filter(({i})=>i%SIDE===col&&!removed.has(i));let dest=ROWS-1;
  for(let k=keep.length-1;k>=0;k--){const target=dest*SIDE+col;out[target]=keep[k].t;from[keep[k].t.id]=Math.floor(keep[k].i/SIDE)-dest;dest--}
  for(let row=dest;row>=0;row--){const t=tile(Math.floor(random()*TYPES));out[row*SIDE+col]=t;from[t.id]=-(dest+1)}
 }return {board:out,from};
}
export function newBoard(random:Random=Math.random):Board{
 for(let attempt=0;attempt<100;attempt++){const out:Board=[];for(let i=0;i<SIDE*ROWS;i++){const excluded=new Set<number>();if(i%SIDE>=2&&out[i-1].kind===out[i-2].kind)excluded.add(out[i-1].kind);if(i>=SIDE*2&&out[i-SIDE].kind===out[i-SIDE*2].kind)excluded.add(out[i-SIDE].kind);const candidates=Array.from({length:TYPES},(_,k)=>k).filter(k=>!excluded.has(k));out.push(tile(candidates[Math.floor(random()*candidates.length)]))}if(findMove(out))return out}
 // A deterministic, match-free playable fallback also bounds pathological random sources.
 const kinds=Array.from({length:SIDE*ROWS},(_,i)=>(Math.floor(i/SIDE)+i%SIDE)%TYPES);kinds[0]=0;kinds[1]=1;kinds[2]=0;kinds[7]=0;return kinds.map(tile);
}
