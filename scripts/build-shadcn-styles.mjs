import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { compile, optimize } from '@tailwindcss/node';
import { Scanner } from '@tailwindcss/oxide';

// Chromium does not currently register @property rules declared inside a
// ShadowRoot. Tailwind's own compatibility fallback is gated by document-level
// browser features, so its initial values are otherwise absent in this scope.
// Derive an unconditional, local fallback from every generated registration.
// Keep it in Tailwind's lowest layer so all utility and state declarations win.
export function addShadowPropertyFallback(css) {
  const registrations = [...css.matchAll(/@property\s+(--[\w-]+)\s*\{([^{}]*)\}/g)];
  if (registrations.length !== (css.match(/@property\b/g) || []).length) {
    throw new Error('Cannot initialize a generated @property in the shadcn ShadowRoot. Inspect the new Tailwind registration syntax.');
  }
  if (!registrations.length) return css;

  const values = new Map();
  for (const [, name, descriptors] of registrations) {
    // Quoted semicolons are valid CSS values; match those before a delimiter.
    const initialValue = descriptors.match(/\binitial-value\s*:\s*((?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[^;])+);/);
    const value = initialValue ? initialValue[1].trim() : 'initial';
    values.set(name, value);
  }
  const declarations = [...values].map(([name, value]) => `    ${name}: ${value};`).join('\n');
  // Pseudo-elements cannot be arguments to :where(); use Tailwind's standard
  // fallback selector, with the properties layer enforcing lower precedence.
  return `@layer properties {\n  *, ::before, ::after, ::backdrop {\n${declarations}\n  }\n}\n${css}`;
}

// The resulting sheet is injected into ShadcnScope's ShadowRoot, never the
// document. This keeps both Tailwind's preflight and Ant Design's reset local.
export async function buildShadcnStyles(root) {
  const input = resolve(root, 'preview/shadcn.css');
  const compiler = await compile(await readFile(input, 'utf8'), {
    base: resolve(root, 'preview'),
    from: input,
    onDependency() {},
  });
  const scanner = new Scanner({ sources: compiler.sources });
  const css = addShadowPropertyFallback(compiler.build(scanner.scan()));
  return optimize(css, { file: input, minify: true }).code;
}

export async function buildDocumentStyles(root) {
  const sheets = [];
  // Baseline element utilities stay unlayered and low-specificity, matching the
  // old browser foundation. Explicit component/layout utilities own overrides.
  for (const path of ['preview/foundation.tailwind.css', 'preview/tailwind.css']) {
    const input = resolve(root, path);
    const compiler = await compile(await readFile(input, 'utf8'), {
      base: resolve(root, 'preview'), from: input, onDependency() {},
    });
    const scanner = new Scanner({ sources: compiler.sources });
    sheets.push(optimize(compiler.build(scanner.scan()), { file: input, minify: true }).code);
  }
  return sheets.join('\n');
}
