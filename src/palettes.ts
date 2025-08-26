export type RGBA = [number, number, number, number]

export function convertPalette(raw: string) {
  return [...raw.matchAll(/(\w\w)(\w\w)(\w\w)/g)].map(v => v.slice(1, 4).map(v => Math.round(Number.parseInt(v, 16) / 255 * 35).toString(36)).join('')).join('')
}

export function parsePalette(raw: string) {
  return [...raw.matchAll(/(\w)(\w)(\w)/g)].map(v => [...v.slice(1, 4).map(v => ~~(Number.parseInt(v, 36) / 36 * 100) / 100),1]) as RGBA[]
}

export const generatePalette = () => [...new Array(36)].map((_, i) =>
  i < 6 ? [i / 6, i / 6, i / 6, 1] :
    i < 10 ? [0, 0, 0, i / 4 - 1] :
      [i % 3 *.45, ~~(i / 9) / 2 - .5, ~~(i / 3) % 3 * .45, 1]
) as RGBA[];

export const sweetie16 = `1a1c2c
257179
38b764
a7f070

5d275d
b13e53
ef7d57
ffcd75


29366f
3b5dc9
41a6f6
73eff7

333c57
566c86
94b0c2
f4f4f4
`

export const dawnbringer =
  `140c1c
4e4a4e
757161
8595a1
deeed6
442434
30346d
597dce
6dc2ca
854c30
d27d2c
d2aa99
dad45e
346524
6daa2c
d04648
`
export const endesga32 = `be4a2f
d77643
ead4aa
e4a672
b86f50
733e39
3e2731
a22633
e43b44
f77622
feae34
fee761
63c74d
3e8948
265c42
193c3e
124e89
0099db
2ce8f5
ffffff
c0cbdc
8b9bb4
5a6988
3a4466
262b44
181425
ff0044
68386c
b55088
f6757a
e8b796
c28569
`
export const pineapple32 =
`43002a
890027
d9243c
ff6157
ffb762
c76e46
73392e
34111f
030710
273b2d
458239
9cb93b
ffd832
ff823b
d1401f
7c191a
310c1b
833f34
eb9c6e
ffdaac
ffffe4
bfc3c6
6d8a8d
293b49
041528
033e5e
1c92a7
77d6c1
ffe0dc
ff88a9
c03b94
601761
ddffff
eeeeee
`