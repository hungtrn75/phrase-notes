import {describe,expect,it} from 'vitest';
import {visibleNotes} from './visibleNotes';
describe('visible note selection',()=>{
 const notes=[{key:'top',top:0},{key:'middle',top:1500},{key:'bottom',top:3000}];
 it('keeps nearby labels and omits those far from the viewport',()=>{expect(visibleNotes(notes,0,800).map(x=>x.key)).toEqual(['top']);expect(visibleNotes(notes,-1400,800).map(x=>x.key)).toEqual(['middle']);});
 it('uses an overscan margin and retains original objects',()=>{const visible=visibleNotes(notes,-600,300);expect(visible.map(x=>x.key)).toEqual(['top','middle']);expect(visible[0]).toBe(notes[0]);});
});
