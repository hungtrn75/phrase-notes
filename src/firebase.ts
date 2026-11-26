import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, type User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
const config={apiKey:import.meta.env.VITE_FIREBASE_API_KEY,authDomain:import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,projectId:import.meta.env.VITE_FIREBASE_PROJECT_ID,appId:import.meta.env.VITE_FIREBASE_APP_ID};
export const configured=Object.values(config).every(Boolean);
const app=configured?initializeApp({...config,storageBucket:import.meta.env.VITE_FIREBASE_STORAGE_BUCKET||undefined}):null;
export const auth=app?getAuth(app):null;
export const firestore=app?getFirestore(app):null;
export const storage=app&&import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?getStorage(app):null;
export function observeAuth(callback:(user:User|null)=>void){if(!auth){callback(null);return ()=>{}}return onAuthStateChanged(auth,callback);}
export async function login(){if(!auth)throw new Error('Chưa cấu hình Firebase.');await signInWithPopup(auth,new GoogleAuthProvider());}
export async function logout(){if(auth)await signOut(auth);}

export function loginError(error:unknown):string {
 const code=typeof error==='object' && error!==null && 'code' in error && typeof error.code==='string'?error.code:'unknown';
 const messages:Record<string,string>={
  'auth/unauthorized-domain':`Tên miền ${window.location.hostname} chưa được cho phép trong Firebase Authentication → Settings → Authorized domains.`,
  'auth/popup-blocked':'Trình duyệt đã chặn cửa sổ đăng nhập. Hãy cho phép cửa sổ bật lên cho trang này và thử lại.',
  'auth/popup-closed-by-user':'Cửa sổ đăng nhập đã đóng trước khi hoàn tất. Hãy thử lại.',
  'auth/cancelled-popup-request':'Yêu cầu đăng nhập đã bị hủy. Hãy thử lại một lần.',
  'auth/operation-not-allowed':'Google Sign-In chưa được bật cho Firebase project đang cấu hình.',
  'auth/invalid-api-key':'Firebase API key không hợp lệ. Hãy kiểm tra cấu hình Web của Firebase project.',
  'auth/api-key-not-valid.-please-pass-a-valid-api-key.':'Firebase API key không hợp lệ. Hãy kiểm tra cấu hình Web của Firebase project.',
  'auth/network-request-failed':'Không kết nối được Firebase. Hãy kiểm tra mạng, trình chặn nội dung hoặc VPN.',
  'auth/operation-not-supported-in-this-environment':'Trình duyệt không hỗ trợ cách đăng nhập này. Hãy mở trang bằng Chrome hoặc Safari thông thường.',
  'auth/internal-error':'Firebase trả về lỗi nội bộ. Hãy kiểm tra cấu hình ứng dụng và thử lại.'
 };
 return `${messages[code]||'Không thể đăng nhập. Hãy thử lại và cung cấp mã lỗi bên dưới.'} (${code})`;
}
