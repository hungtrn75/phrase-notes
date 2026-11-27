export type PositionedNote={key:string;top:number};
/** Keep a margin so labels are present before they enter the viewport. */
export function visibleNotes<T extends PositionedNote>(notes:T[],surfaceTop:number,viewportHeight:number,margin=600):T[]{
 const first=-surfaceTop-margin,last=viewportHeight-surfaceTop+margin;
 return notes.filter(note=>note.top>=first&&note.top<=last);
}
