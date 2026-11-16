import path from 'path';
import fs from 'fs';
import { glob } from 'glob';

async function main() {
  console.log('cwd:', process.cwd());
  const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');
  console.log('CONTENT_DIR:', CONTENT_DIR);
  const SKILLS_DIR = path.join(CONTENT_DIR, 'skills');
  console.log('SKILLS_DIR:', SKILLS_DIR);
  console.log('exists:', fs.existsSync(SKILLS_DIR));
  const pattern = path.join(SKILLS_DIR, '**', '*.mdx');
  console.log('pattern:', pattern);
  const files = await glob(pattern, { absolute: true });
  console.log('files found:', files.length);
  console.log('first:', files.slice(0, 3));
}

main();