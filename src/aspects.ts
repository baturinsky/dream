import { Aspects } from "./data";
import { createCanvas, SfxTemplate } from "./entity";
import { AspectSprites } from "./graphics";
import { colorsStyle, listSum } from "./util";

export type TAspects = { [id: string]: number }

export function aspectsFromString(s = "") {
  let r = {};
  [...s].forEach(l => r[l] = (r[l] || 0) + 1)
  return r as TAspects
}

export function aspectsSum(a: TAspects, b: TAspects, m = 1) {
  let r = {};
  a ??= {};
  b ??= {};
  for (let k in { ...a, ...b }) {
    r[k] = (a[k] || 0) + (b[k] || 0) * m;
  }
  return r as TAspects
}

export function aspectsMul(a: TAspects, m: number) {
  return aspectsSum({}, a, m);
}

export function aspectsToString(a: TAspects) {
  let s = "";
  for (let k of Object.keys(Aspects).sort((x, y) => a[x] - a[y])) {
    if (a[k] > 0) {
      s += `<div class="aspect" data-aspect=${k}><span class=num>${a[k].toFixed(2).replace(/(.00)/g, "")}<span> ${Aspects[k].name}</div>`
    }
    //s += `<div style="${colorsStyle(Aspects[k].colors)}">${a[k].toFixed(2).replace(/(.00)/g,"")} ${Aspects[k].name}</div>`
  }
  return s
}

export function inferLevel(a: TAspects) {
  return listSum(Object.values(a))
}