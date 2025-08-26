import { XYZ } from "./entity";

/**Sum of vectors a+b*m */
export function sum<T extends number[]>(a: T, b: T, m = 1) { return a.map((v, i) => v + b[i] * m) as T };

export function mul<T extends number[]>(a: T,m = 1) { return a.map((v, i) => v * m) as T };

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

export function randomElement(list: any[], gen = rng) {
  if (!list)
    return null;
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