import {auth} from './firebase';
export async function apiFetch(path:string,options:RequestInit):Promise<Response>{
 const user=auth?.currentUser;if(!user)throw new Error('Hãy đăng nhập lại trước khi sử dụng Gemini.');
 const headers=new Headers(options.headers);headers.set('Authorization',`Bearer ${await user.getIdToken()}`);
 return fetch(path,{...options,headers});
}
