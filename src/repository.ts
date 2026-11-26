import {collection,doc as documentRef,getDocs,runTransaction} from 'firebase/firestore';
import {auth,firestore} from './firebase';
import type {Doc} from './model';
function documents(){const uid=auth?.currentUser?.uid;if(!firestore||!uid)throw new Error('Hãy đăng nhập trước.');return collection(firestore,'users',uid,'documents');}
export async function list():Promise<Doc[]>{const result=await getDocs(documents());return result.docs.map(d=>d.data() as Doc).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));}
export async function save(doc:Doc):Promise<Doc>{if(!firestore)throw new Error('Chưa cấu hình Firebase.');const ref=documentRef(documents(),doc.id);return runTransaction(firestore,async transaction=>{const existing=await transaction.get(ref);if(existing.exists() ? existing.data().revision!==doc.revision : doc.revision!==0)throw new Error('conflict');const next={...doc,revision:doc.revision+1,updatedAt:new Date().toISOString()};transaction.set(ref,next);return next;});}
