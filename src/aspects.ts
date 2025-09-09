import { Aspects } from "./data";
import { aspect, Entity } from "./entity";
import { array, colorsStyle, fixed, listSum, randomElement, rng, weightedRandomOKey } from "./util";

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

export function aspectsToString(a: TAspects, e?:Entity) {
  let s = "<div class=stats>";  
  for (let k of Object.keys(Aspects)) {
    let base = a[k]||0, final = e?aspect(e,k):base;
    if (final) {
      s += `<div class="aspect" data-aspect=${k}></div>
      <div class=num>${fixed(base)} ${final!=base?`<i>/${fixed(final)}</i>`:''}</div>
      <div> ${Aspects[k].name}</div><div> <i>${Aspects[k].tip}</i></div>`
    }
    //s += `<div style="${colorsStyle(Aspects[k].colors)}">${a[k].toFixed(2).replace(/(.00)/g,"")} ${Aspects[k].name}</div>`
  }
  return "</div>" + s
}

export function inferLevel(a: TAspects) {
  return listSum(Object.values(a))
}

export function improve(a: TAspects, name: string, value: number) {
  a[name] = (a[name] || 0) + value;
}

export function levelTo(aspects: TAspects, level: number, step=1) {
  let il = inferLevel(aspects);
  let b = {...aspects};
  array((level-il)/step).forEach(e=>{
    let c = rng(4)?weightedRandomOKey(b):randomElement(Object.keys(Aspects));
    improve(b, c, step)
  })
  return b;
}