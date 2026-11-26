import {copyFileSync} from 'node:fs';
copyFileSync(new URL('./gemini.js',import.meta.url),new URL('../functions/gemini.js',import.meta.url));
