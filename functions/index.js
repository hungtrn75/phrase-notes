import {onRequest} from 'firebase-functions/v2/https';
import {initializeApp} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import {reviewWithGemini,generateDialogue,checkGemini,generateShadowAudio,generateIpa} from './gemini.js';
initializeApp();
export const api=onRequest({region:'us-central1',timeoutSeconds:60,memory:'512MiB'},async(req,res)=>{
 res.set('Cache-Control','no-store');
 if(req.method!=='POST'){res.status(405).json({error:'Phương thức không được hỗ trợ.'});return;}
 const match=/^Bearer (.+)$/.exec(req.get('authorization')||'');
 try{if(!match)throw new Error('missing');await getAuth().verifyIdToken(match[1]);}catch{res.status(401).json({error:'Phiên đăng nhập không hợp lệ. Hãy đăng nhập lại.'});return;}
 const key=req.get('x-gemini-api-key');const path=req.path.replace(/^\/api(?=\/)/,'');const payload=req.body;
 try{
  if(path==='/shadowing'){
   res.status(200).set({'Content-Type':'application/x-ndjson; charset=utf-8','Cache-Control':'no-cache, no-transform'});res.flushHeaders();
   const send=value=>res.write(JSON.stringify(value)+'\n');
   try{send({type:'progress',message:'Máy chủ đã nhận yêu cầu. Đang chuẩn bị gửi tới Gemini…'});const result=await generateDialogue(payload,key,message=>send({type:'progress',message}));send({type:'result',result});}catch(e){send({type:'error',message:e instanceof Error?e.message:'Không thể tạo bài.'});}res.end();return;
  }
  let result;if(path==='/gemini-check')result=await checkGemini(key);else if(path==='/review')result=await reviewWithGemini(payload,key);else if(path==='/shadowing-audio')result=await generateShadowAudio(payload,key);else if(path==='/shadowing-ipa')result=await generateIpa(payload,key);else{res.status(404).json({error:'Không tìm thấy API.'});return;}res.json(result);
 }catch(e){res.status(400).json({error:e instanceof Error?e.message:'Không thể xử lý yêu cầu.'});}
});
