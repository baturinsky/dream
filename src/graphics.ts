import { quadSize, filters, palette, roomHeight } from "./main";
declare var Scene: HTMLDivElement, img: HTMLImageElement, div1: HTMLDivElement, DEFS: Element;


export let recolorFiltered = (initalFilter: string, filter: string, i: number) => recolor(filtered(i, initalFilter), filter),
  solid = (filter: string, i: number) => recolorFiltered('S', filter, i),
  transp = (filter: string, i: number) => recolorFiltered('T', filter, i),
  outl = (filter: string, i: number) => recolorFiltered('O', filter, i)

/**Generates a copy of red-green canvas with specified recolor */
export function recolor(s: HTMLCanvasElement, filter: string) {
  if (!s)
    debugger;
  if (!filter)
    return s;
  let t = s.cloneNode() as HTMLCanvasElement;
  gcx(t).filter = constructFilter(filter);
  gcx(t).drawImage(s, 0, 0);
  return t
}

export const FaceSprites = 0x10, BodySprites = 0x20, ToolSprites = 0x30, LegSprites = 0x40,
  FurnitureSprites = 0x50, TreeSprites = 0x60, BuildingSprites = 0x70;

export const LegShape = LegSprites, GloveShape = ToolSprites;

const atlasColumns = 16;

export function filtered(sprite: number, filter: string, margin = 0) {
  if(filter == 'O')
    margin = 1;
  let [c, ctx] = cc(quadSize + margin * 2);
  c.id = filter + sprite;
  ctx.filter = `url(#_${filter})`
  ctx.drawImage(img, sprite % atlasColumns * quadSize, ~~(sprite / atlasColumns) * quadSize, quadSize, quadSize, margin, margin, quadSize, quadSize);
  return c
}

export function gcx(c: HTMLCanvasElement) {
  return c.getContext("2d") as CanvasRenderingContext2D
}

export function constructFilter(cab: string) {
  if (!filters.has(cab)) {
    filters.add(cab);
    let [a, b] = [...cab].map(c => palette[Number.parseInt(c, 36)]);
    let f = `<filter id=f${cab}><feColorMatrix type=matrix values="${a[0]} ${b[0]} 0 0 0  ${a[1]} ${b[1]} 0 0 0  ${a[2]} ${b[2]} 0 0 0  0 0 0 1 0" /></filter>`
    DEFS.innerHTML += f;
  }
  return `url(#f${cab})`
}

/**Creates a size*size canvas and returns it with context */
export function cc(size: number, options?) {
  let c = document.createElement("canvas")
  c.classList.add("sprite")
  c.width = c.height = size;
  Object.assign(c, options);
  return [c, gcx(c)] as [HTMLCanvasElement, CanvasRenderingContext2D];
}

export const createPattern = (original: HTMLCanvasElement) => gcx(original).createPattern(original, "repeat") as CanvasPattern;

export function numsToColors(a: number, b: number) {
  return a.toString(36) + b.toString(36)
}