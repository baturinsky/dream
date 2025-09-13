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

export function aspectsMulEach(a: TAspects, b: TAspects) {
  let r = {};
  a ??= {};
  b ??= {};
  for (let k in { ...a, ...b }) {
    r[k] = (a[k] || 0) * (b[k] || 0)
  }
  return r as TAspects
}


export function aspectsToString(a: TAspects, e?: Entity) {
  let s = '';
  for (let k of Object.keys(Aspects)) {
    let base = a[k] || 0, final = e ? aspect(e, k) : base;
    if (final) {
      s += `<div class="aspect" data-aspect=${k}></div>
      <div class=num>${fixed(base)} ${final != base ? `<i>/${fixed(final)}</i>` : ''}</div>
      <div> ${Aspects[k].name}</div><div> <i>${Aspects[k].tip}</i></div>`
    }
    //s += `<div style="${colorsStyle(Aspects[k].colors)}">${a[k].toFixed(2).replace(/(.00)/g,"")} ${Aspects[k].name}</div>`
  }
  return `<p><div class=stats>${s}</div></p>`
}

export function inferLevel(a: TAspects) {
  return listSum(Object.values(a)) as number
}

export function improve(a: TAspects, name: string, value: number) {
  a[name] = (a[name] || 0) + value;
}

export function levelTo(aspects: TAspects, level: number, step = 1) {
  let il = inferLevel(aspects);
  let b = { ...aspects };

  for (let i = il; i < level; i += step) {
    if (rng(Object.keys(aspects).length + 1)) {
      improve(b, weightedRandomOKey(b), step)
    } else {
      improve(b, weightedRandomOKey(b), 1)
      i += 1;
    }
  }
  return b;
}

export function levelEntityTo(e: Entity, level: number, step = 1) {
  levelTo(e.aspects, level, step);
  return e;
}

export function aspectShard(a: TAspects, m: number) {
  let s = { [weightedRandomOKey(a)]: m * inferLevel(a) }
  return s;
}