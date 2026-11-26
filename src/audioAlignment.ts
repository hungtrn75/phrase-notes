export type Timing={start:number;end:number};
// These boundaries are estimates based on relative text length and nearby quiet audio.
export async function estimateTimings(bytes:Uint8Array,lines:string[]):Promise<Timing[]>{
 const context=new AudioContext();try{
  const copy=new Uint8Array(bytes.length);copy.set(bytes);const audio=await context.decodeAudioData(copy.buffer);const duration=audio.duration;
  if(!Number.isFinite(duration)||duration<=0||!lines.length||duration<lines.length*0.05)throw new Error('Không thể ước lượng mốc câu cho âm thanh này.');
  const samples=audio.getChannelData(0),step=Math.max(1,Math.floor(audio.sampleRate*0.02)),windows:number[]=[];
  for(let i=0;i<samples.length;i+=step){let sum=0;const end=Math.min(samples.length,i+step);for(let j=i;j<end;j++)sum+=samples[j]*samples[j];windows.push(Math.sqrt(sum/(end-i)));}
  const weights=lines.map(s=>Math.max(1,Array.from(s).length)),total=weights.reduce((a,b)=>a+b,0),boundaries=[0];let accumulated=0;
  for(let i=0;i<lines.length-1;i++){
   accumulated+=weights[i];const ideal=duration*accumulated/total,low=boundaries[i]+0.05,high=duration-(lines.length-i-1)*0.05;
   const lo=Math.max(low,ideal-1.5),hi=Math.min(high,ideal+1.5);let best=Math.min(high,Math.max(low,ideal)),score=Infinity;
   for(let w=Math.ceil(lo*audio.sampleRate/step);w<=Math.floor(hi*audio.sampleRate/step)&&w<windows.length;w++){const t=w*step/audio.sampleRate,level=windows[w],candidate=level+Math.abs(t-ideal)*0.008;if(candidate<score){score=candidate;best=t;}}
   boundaries.push(best);
  }
  boundaries.push(duration);return lines.map((_,i)=>({start:Number(boundaries[i].toFixed(3)),end:Number(boundaries[i+1].toFixed(3))}));
 }finally{await context.close();}
}
