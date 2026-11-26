import type {Doc} from './model';
const db = new Promise<IDBDatabase>((resolve,reject)=>{const req=indexedDB.open('phrase-notes',1); req.onupgradeneeded=()=>req.result.createObjectStore('documents',{keyPath:'id'}); req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error);});
export async function listLegacy():Promise<Doc[]> {const d=await db; return new Promise((resolve,reject)=>{const r=d.transaction('documents').objectStore('documents').getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
