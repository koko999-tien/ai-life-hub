import path from 'path';
import fs from 'fs';
import { glob } from 'glob';

console.log('cwd:', process.cwd());
const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');
console.log('CONTENT_DIR:', CONTENT_DIR);
console.log('skills dir exists:', fs.existsSync(path.join(CONTENT_DIR, 'skills')));
const files = await glob(path.join(CONTENT_DIR, 'skills', '**', '*.mdx'), { absolute: true });
console.log('Files found:', files.length);
