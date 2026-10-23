import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { compile, optimize } from '@tailwindcss/node';
import { Scanner } from '@tailwindcss/oxide';
import { referenceRootClasses } from '../reference/transitions/classes.mjs';

async function compileSheet(root, path, extra = []) {
  const input = resolve(root, path);
  const compiler = await compile(await readFile(input, 'utf8'), {
    base: dirname(input), from: input, onDependency() {},
  });
  const scanner = new Scanner({ sources: compiler.sources });
  return optimize(compiler.build([...scanner.scan(), ...extra]), { file: input, minify: true }).code;
}

export function buildMotionReferenceStyles(root) {
  return compileSheet(root, 'reference/motion-reference.css', referenceRootClasses.split(' '));
}

export function buildBorderBeamStyles(root) {
  return compileSheet(root, 'reference/border-beam/tailwind.css');
}
