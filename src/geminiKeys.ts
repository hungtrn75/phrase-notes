export type GeminiKey={id:string;name:string;key:string};
export type KeySettings={keys:GeminiKey[];activeId:string};
export function loadKeys(uid:string):KeySettings{
 try{const saved=localStorage.getItem('phrase-notes-gemini-keys-'+uid);if(saved){const value=JSON.parse(saved);if(Array.isArray(value.keys)){const keys=value.keys.filter((x:GeminiKey)=>x&&typeof x.id==='string'&&typeof x.name==='string'&&typeof x.key==='string'&&x.key);return {keys,activeId:keys.some((x:GeminiKey)=>x.id===value.activeId)?value.activeId:keys[0]?.id||''};}}const old=localStorage.getItem('phrase-notes-gemini-'+uid);if(old){const key={id:'legacy',name:'Key hiện tại',key:old};return {keys:[key],activeId:key.id};}}catch{}return {keys:[],activeId:''};
}
export function saveKeys(uid:string,settings:KeySettings){localStorage.setItem('phrase-notes-gemini-keys-'+uid,JSON.stringify(settings));localStorage.removeItem('phrase-notes-gemini-'+uid);}
