import { XYZ } from "./entity";
import { palette } from "./main";
import { RGBA } from "./palettes";

export function toCSSColor([r, g, b, a]: RGBA) {
  return `rgba(${r * 255},${g * 255},${b * 255},${a})`
}

/**Sum of vectors a+b*m */
export function sum<T extends number[]>(a: T, b: T, m = 1) { return a.map((v, i) => v + b[i] * m) as T };

export function mul<T extends number[]>(a: T, m = 1) { return a.map((v, i) => v * m) as T };

export function sub<T extends number[]>(a: T, b: T) { return sum(a, b, -1) }

/**length of vector */
export function vlen<T extends number[]>(a: T) { return a.reduce((p, c) => p + c * c, 0) ** .5 }

export function dist<T extends number[]>(a: T, b: T) { return vlen(sub(b, a)) }

const maxN = 2 ** 31;
export let rng: (n?: number) => number = RNG(123);

export function RNG(seed = 0): (n?: number) => number {
  if (0 < seed && seed < 1)
    seed = ~~(seed * maxN);

  let rngi = (n) => {
    return (seed = (seed * 16807) % 2147483647) % n;
  };

  rng = (n) => {
    return n == -1 ? seed : n == null ? rngi(maxN) / maxN : rngi(n)
  }
  return rng;
}

export function randomElement<T>(list: T[], gen = rng) {
  if (!list)
    return null as T;
  let n = gen(list.length);
  return list[n];
}

export function shuffle(arr: any[], rng) {

  arr = [...arr];
  let l = arr.length;
  for (let i = 1; i < l; i++) {
    let r = rng(l);
    if (r != i) {
      [arr[i], arr[r]] = [
        arr[r], arr[i]];
    }
  }

  return arr;
}

export function weightedRandom(list: number[], gen = rng) {
  let sum = listSum(list);
  let roll = gen() * sum - list[0];
  let i = 0;
  while (roll >= 0) roll -= list[++i];
  return i;
}

export function weightedRandomF<T>(list: T[], F:Function, gen = rng) {
  let foo = list.map(F as any);
  let ind = weightedRandom(foo as any);
  return list[ind] as T;
}

export function weightedRandomOKey<T>(obj: { [id: string]: T }, f = (v: T) => v as number, gen = rng) {
  let ind = weightedRandom(Object.values(obj).map(f) as number[], gen);
  return Object.keys(obj)[ind];
}


export function listSum(list: any[]) {
  return list.reduce((x, y) => x - -y, 0);
}

export function japaneseName(gen = rng) {
  let s = ''
  for (let i = 0; i < gen(3) + 2; i++)
    s += randomElement([..."kstnhmyrw", ''], gen) + randomElement([..."aiueo", ''], gen)
  return cap1(s)
}

export function cap1(s: string) {
  return s ? (s[0].toUpperCase() + s.substring(1)) : "";
}

export function numberValues(oo: { [id: string]: any }) {
  for (let o of Object.values(oo)) {
    for (let k in o) {
      let n = Number(o[k]);
      if (!isNaN(n) && k != 'colors') o[k] = n;
    }
  }
  return oo
}

export function rngRounded(v: number, gen = rng) {
  v = v * 100;
  v = (v % 1 > gen() ? 1 : 0) + ~~v;
  return v /= 100;
}

/*for (let i = 0; i < 30; i++) {
  let v = rng() * 10;
  console.log(v, rngRounded(v), rngRounded(v), rngRounded(v), rngRounded(v), rngRounded(v));
}*/

export function colorsStyle(colors: string) {
  let [a, b] = [...colors].map(c => palette[Number.parseInt(c, 36)]);
  let bg = `background:${toCSSColor(a)};border:solid 2px ${toCSSColor(b)}`;
  return bg
}