import {useEffect,useMemo,useState} from 'react';
import './listening.css';

type ListeningLine={en:string};
const isAnswer=(value:string)=>/[\p{L}\p{N}]/u.test(value);
function splitGraphemes(text:string):string[]{return Array.from(new Intl.Segmenter('en',{granularity:'grapheme'}).segment(text),part=>part.segment);}
export function Listening({lines,play,stop}:{lines:ListeningLine[];play:(index:number)=>void;stop:()=>void}){
 const [index,setIndex]=useState(0),[revealed,setRevealed]=useState(false),[input,setInput]=useState('');
 const chars=useMemo(()=>splitGraphemes(lines[index]?.en||''),[lines,index]),answer=useMemo(()=>chars.filter(isAnswer),[chars]);
 const {correct,wrong}=useMemo(()=>{const typed=splitGraphemes(input).filter(isAnswer);let matched=0;while(matched<typed.length&&matched<answer.length&&typed[matched].normalize('NFC').toLocaleLowerCase('en')===answer[matched].normalize('NFC').toLocaleLowerCase('en'))matched++;return {correct:matched,wrong:matched<typed.length};},[input,answer]);
 useEffect(()=>()=>stop(),[]);
 const changeSentence=(next:number)=>{stop();setIndex(next);setRevealed(false);setInput('');};

 let seen=0;const masked=chars.map((char,i)=>{if(!isAnswer(char))return <span key={i}>{char}</span>;const position=seen++;return <span key={i} className={position<correct?'listening-correct':''}>{position<correct||revealed?char:'*'}</span>});
 return <div className="listening"><div className="listening-heading"><div><span className="step">LUYỆN NGHE</span><h3>Nghe và điền từng chữ</h3><p>Nghe câu, rồi gõ các chữ bạn nghe được. Chữ đúng sẽ tự hiện ra; khoảng trắng và dấu câu được cho sẵn.</p></div><span className="listening-count">{index+1} / {lines.length}</span></div><div className="listening-actions"><button type="button" onClick={()=>play(index)}>▶ Nghe câu này</button><button type="button" onClick={stop}>■ Dừng</button><button type="button" onClick={()=>changeSentence(index)} >Làm lại</button></div><div className="listening-mask" aria-label="Câu cần điền, khoảng trắng và dấu câu được hiển thị">{masked}</div><label className="listening-input-label">GÕ CÂU BẠN NGHE ĐƯỢC<input type="text" inputMode="text" autoComplete="off" autoCapitalize="none" spellCheck={false} value={input} onChange={e=>setInput(e.target.value)} placeholder="Bắt đầu gõ tại đây…" disabled={revealed} aria-describedby="listening-feedback"/></label><div className="listening-feedback" id="listening-feedback" aria-live="polite">{revealed?'Đã hiện đáp án. Bấm Làm lại để luyện tiếp.':wrong?'Có ký tự chưa đúng; hãy sửa trong ô nhập để tiếp tục.':correct===answer.length&&answer.length&&!wrong?'Chính xác! Bạn đã hoàn thành câu này.':`Đã đúng ${correct} / ${answer.length} ký tự.`}</div><div className="listening-footer"><button type="button" disabled={index===0} onClick={()=>changeSentence(index-1)}>← Câu trước</button><button type="button" onClick={()=>{setRevealed(true)}} disabled={revealed||(correct===answer.length&&!wrong)}>Hiện đáp án</button><button type="button" disabled={index>=lines.length-1} onClick={()=>changeSentence(index+1)}>Câu tiếp →</button></div></div>;
}
