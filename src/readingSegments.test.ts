import {describe,expect,it} from 'vitest';
import {createReadingSegments} from './readingSegments';
import type {Annotation} from './model';
const a=(id:string,start:number,end:number):Annotation=>({id,start,end,quote:'',color:'#ffffff',notes:{}});
describe('reading segments',()=>{
 it('reconstructs the source exactly across adjacent and overlapping highlights',()=>{
  const text='Hi 👋 there\nnext';const one=a('one',0,11),two=a('two',3,8),three=a('three',11,text.length);
  const segments=createReadingSegments(text,[one,two,three]);
  expect(segments.map(s=>text.slice(s.start,s.end)).join('')).toBe(text);
  expect(segments.map(s=>[s.start,s.end,s.annotation?.id])).toEqual([[0,3,'one'],[3,8,'two'],[8,11,'one'],[11,text.length,'three']]);
 });
 it('uses the last added highlight for an overlap without changing the text',()=>{
  const text='abcdef';const segments=createReadingSegments(text,[a('first',2,5),a('second',0,4),a('third',1,3)]);
  expect(segments.map(s=>s.annotation?.id)).toEqual(['second','third','third','second','first',undefined]);
  expect(segments.map(s=>text.slice(s.start,s.end)).join('')).toBe(text);
 });
 it('handles empty and unannotated text',()=>{expect(createReadingSegments('',[])).toEqual([]);expect(createReadingSegments('text',[])).toEqual([{start:0,end:4,annotation:undefined}]);});
});
