import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFDocument } from 'pdf-lib';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'public', 'CVMiguelGisbert.pdf');

const meta = {
  title: 'Miguel Gisbert — Full-Stack Software Engineer CV',
  author: 'Miguel Gisbert',
  subject: 'Full-Stack Software Engineer (React, TypeScript, Node.js, Python, AI/LLM)',
  keywords:
    'Miguel Gisbert, full-stack software engineer, freelance developer, React, TypeScript, Node.js, Python, AI integration, CV',
};

const input = readFileSync(source);
const doc = await PDFDocument.load(input, { updateMetadata: false });

doc.setTitle(meta.title);
doc.setAuthor(meta.author);
doc.setSubject(meta.subject);
doc.setKeywords(meta.keywords.split(', '));

const output = await doc.save({ useObjectStreams: false });

if (doc.getPageCount() !== 3) {
  throw new Error(`Unexpected page count: ${doc.getPageCount()}`);
}

writeFileSync(source, output);
console.log(
  `CVMiguelGisbert.pdf: ${input.length} -> ${output.length} bytes, ${doc.getPageCount()} pages, title "${doc.getTitle()}"`,
);
