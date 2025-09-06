import { XYZ } from "./entity";
import { filters, palette } from "./main";
import { quadSize, roomDepth, roomHeight, roomWidth } from "./consts";

declare var Scene: HTMLDivElement, Back: HTMLCanvasElement, Front: HTMLCanvasElement,
  img: HTMLImageElement, div1: HTMLDivElement, DEFS: Element;;

export const w = roomWidth * 2, h = roomHeight * 2, d = roomDepth * 2 - 1;

export let recolorFiltered = (initalFilter: string, filter: string, i: number) =>
  recolor(filtered(i, initalFilter), filter),
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
  FurnitureSprites = 0x50, TreeSprites = 0x70, BuildingSprites = 0x80, AspectSprites = 0x90;

export const LegShape = LegSprites, GloveShape = ToolSprites;

const atlasColumns = 16;

export function filtered(sprite: number, filter: string, margin = 0) {
  if (filter == 'O')
    margin = 1;
  let c = spriteCanvas(quadSize + margin * 2);
  c.id = filter + sprite;
  gcx(c).filter = `url(#_${filter})`
  gcx(c).drawImage(img, sprite % atlasColumns * quadSize, ~~(sprite / atlasColumns) * quadSize, quadSize, quadSize, margin, margin, quadSize, quadSize);
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
export function spriteCanvas(width: number, height = width) {
  let c = document.createElement("canvas")
  c.classList.add("sprite")
  c.width = width;
  c.height = height;
  return c;
}

export const createPattern = (original: HTMLCanvasElement) =>
  gcx(original).createPattern(original, "repeat") as CanvasPattern;

export function numsToColors(a: number, b: number) {
  return a.toString(36) + b.toString(36)
}

export function flyingText(text: string, pos: XYZ, className?: string) {
  //console.log(text,pos,className, text>0);
  let div = document.createElement("div");
  div.classList.add("ftext");
  className && div.classList.add(className as any);
  div.innerHTML = `<div>${text}</div>`;
  Scene.appendChild(div);
  setTimeout(() => Scene.removeChild(div), 3000);
  positionDiv(div, pos);
}

export function positionDiv(div: HTMLElement, p: XYZ, transform = '') {
  Object.assign(div.style, posToStyle(p, transform))
}

export function posToStyle(p: XYZ, transform = '') {
  return {
    left: `${p[0]}px`,
    top: `${p[2]}px`,
    transform: `translateZ(${p[1]}px) ` + transform
  }
}

export function fillWithPattern(canvas: HTMLCanvasElement, pattern: CanvasPattern, rect?: [number, number, number, number], alpha = 1) {
  let cb = gcx(canvas);
  if (alpha)
    cb.globalAlpha = alpha;
  cb.fillStyle = pattern;
  cb.fillRect(...(rect || [0, 0, canvas.width, canvas.height]));
  if (alpha)
    cb.globalAlpha = 1;
}

export function setCanvasSize(c: HTMLCanvasElement, width: number, height: number, internalScale = 1) {
  c.width = width * internalScale;
  c.height = height * internalScale;
  c.style.width = `${width}px`;
  c.style.height = `${height}px`;
  return c
}



export function element(id: string, className: string, style: Partial<CSSStyleDeclaration>, tag = "canvas") {
  let c = document.createElement(tag);
  c.id = id;
  c.classList.add(...className.split(','));
  Object.assign(c.style, style)
  Scene.appendChild(c);
  return c as HTMLCanvasElement;
}


export function scaleCanvas(orig: HTMLCanvasElement, n: number) {
  let c = orig.cloneNode() as HTMLCanvasElement;
  c.width *= n;
  c.height *= n;
  drawScaled(c, orig, 0, 0, n);
  return c
}

export function drawScaled(c: HTMLCanvasElement, img: HTMLCanvasElement, x: number, y: number, scale = 1) {
  gcx(c).imageSmoothingEnabled = false;
  gcx(c).drawImage(img, x, y, img.width * scale, img.height * scale)
}

