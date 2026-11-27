import type {Annotation} from './model';
export type ReadingSegment={start:number;end:number;annotation?:Annotation};
/** Keep the original annotation order as the priority for overlapping ranges. */
export function createReadingSegments(text:string,annotations:Annotation[]):ReadingSegment[]{
 const points=Array.from(new Set([0,text.length,...annotations.flatMap(a=>[a.start,a.end])])).sort((a,b)=>a-b);
 return points.slice(0,-1).map((start,i)=>{const end=points[i+1];let annotation:Annotation|undefined;for(const item of annotations)if(item.start<=start&&item.end>=end)annotation=item;return {start,end,annotation};});
}
