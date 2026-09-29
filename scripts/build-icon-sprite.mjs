import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const icons = {
  react: 'react.svg',
  javascript: 'Unofficial_JavaScript_logo_2.svg',
  typescript: 'Typescript_logo_2020.svg',
  css: 'Official_CSS_Logo.svg',
  node: 'nodedotjs.svg',
  postgres: 'postgresql.svg',
  git: 'git.svg',
  github: 'github.svg',
  gitlab: 'gitlab.svg',
  npm: 'npm.svg',
  nextjs: 'nextdotjs.svg',
  docker: 'docker.svg',
  githubactions: 'githubactions.svg',
  figma: 'figma.svg',
};

const strip = (svg) =>
  svg
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<!DOCTYPE[\s\S]*?>/g, '')
    .replace(/<title[\s\S]*?<\/title>/g, '')
    .replace(/<desc[\s\S]*?<\/desc>/g, '')
    .trim();

const CARRIED_ATTRS =
  /(?:^|\s)(fill|stroke|color|fill-rule|clip-rule|fill-opacity|stroke-opacity|stroke-width|stroke-linecap|stroke-linejoin|opacity|style)="[^"]*"/g;

const symbols = Object.entries(icons).map(([id, file]) => {
  const raw = strip(readFileSync(join(root, 'public/images', file), 'utf8'));
  const rootTag = raw.match(/^<svg([^>]*)>/);
  if (!rootTag) throw new Error(`Missing <svg> root in ${file}`);

  const viewBox = rootTag[1].match(/viewBox="([^"]+)"/)?.[1];
  if (!viewBox) throw new Error(`Missing viewBox in ${file}`);

  const carried = Array.from(rootTag[1].matchAll(CARRIED_ATTRS), (m) => m[0].trim()).join(' ');
  const inner = raw.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

  return `<symbol id="icon-${id}" viewBox="${viewBox}"${carried ? ` ${carried}` : ''}>${inner}</symbol>`;
});

const sprite =
  '<svg xmlns="http://www.w3.org/2000/svg">' + symbols.join('') + '</svg>\n';

writeFileSync(join(root, 'public/images/icons.svg'), sprite);
console.log(`icons.svg written with ${symbols.length} symbols (${sprite.length} bytes)`);
