/** CSSOM adapter for typed motion data. Never accepts element selectors or CSS text. */
export type MotionFrames = Record<string, Record<string, string | number>>;
export interface MotionProperty { name: string; syntax: '<number>' | '<angle>' | '<length>'; initialValue: string; inherits: boolean }
const registered = new Set<string>();

export function installMotionRules(style: HTMLStyleElement, motions: Record<string, MotionFrames>, properties: MotionProperty[] = []) {
  for (const property of properties) {
    if (registered.has(property.name)) continue;
    try { CSS.registerProperty(property); registered.add(property.name); }
    catch (error) { if ((error as DOMException).name === 'InvalidModificationError') registered.add(property.name); else throw error; }
  }
  const sheet = style.sheet;
  if (!sheet) return () => {};
  for (const [name, frames] of Object.entries(motions)) {
    if (!/^[\w-]+$/.test(name)) throw new Error('Motion name must be an identifier.');
    const index = sheet.insertRule(`@keyframes ${name} {}`, sheet.cssRules.length);
    const rule = sheet.cssRules[index] as CSSKeyframesRule;
    for (const [offset, values] of Object.entries(frames)) {
      if (!/^(?:from|to|\d+(?:\.\d+)?%)(?:\s*,\s*(?:from|to|\d+(?:\.\d+)?%))*$/.test(offset)) throw new Error('Motion offsets must be percentages, from, or to.');
      rule.appendRule(`${offset} {}`);
      const frame = rule.cssRules[rule.cssRules.length - 1] as CSSKeyframeRule;
      for (const [property, value] of Object.entries(values)) frame.style.setProperty(property, String(value));
    }
  }
  return () => { while (sheet.cssRules.length) sheet.deleteRule(sheet.cssRules.length - 1); };
}
