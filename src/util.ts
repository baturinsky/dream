import { XYZ } from "./entity";

/**Sum of vectors a+b*m */
export function sum<T extends number[]>(a: T, b: T, m = 1) { return a.map((v, i) => v + b[i] * m) as T };

export function sub<T extends number[]>(a: T, b: T) { return sum(a, b, -1) }

/**length of vector */
export function vlen<T extends number[]>(a: T) { return a.reduce((p, c) => p + c * c, 0) ** .5 }

export function dist<T extends number[]>(a: T, b: T) { return vlen(sub(b, a)) }