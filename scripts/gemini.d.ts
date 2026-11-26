export function reviewWithGemini(payload: unknown, key: string | undefined): Promise<unknown>;
export function generateDialogue(payload: unknown, key: string | undefined, onProgress?: (message:string)=>void): Promise<unknown>;

export function checkGemini(key: string | undefined): Promise<{ok:boolean;model:string}>;
export function generateShadowAudio(payload: unknown, key: string | undefined): Promise<{audio:string;model:string;voice:string}>;

export function generateIpa(payload: unknown, key: string | undefined): Promise<{ipas:string[]}>;
