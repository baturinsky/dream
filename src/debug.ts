import { mouseTarget } from "./controls";
import { palette, roomHeight, current } from "./main";
import { convertPalette, generatePalette, parsePalette, RGBA, sweetie16 } from "./palettes";
import { createEntity, updateEntity, SimpleLayout } from "./entity";
import { materials } from "./data";
import { outl } from "./graphics";

declare var Debug: HTMLDivElement, Preview: HTMLDivElement;

export let curFront = '1', curBack = '2', curSprite = 0;

export function toCSSColor([r, g, b, a]: RGBA) {
  return `rgba(${r * 255},${g * 255},${b * 255},${a})`
}

export function paletteLine(rgb: RGBA) {
  let bg = toCSSColor(rgb)
  console.log(`%c           ${bg}`, `color:#00; background:${bg}`, `background:#fff`)
}

export function printPalette(p: RGBA[]) {
  for (let i in p) {
    let bg = toCSSColor(p[i])
    console.log(`%c          %c ${Number(i).toString(36)} ${bg}`, `color:#00; background:${bg}`, `background:#fff`)
  }

  console.log(materials);
  for (let name in materials) {

    let [a, b] = [...materials[name].colors].map(c => palette[Number.parseInt(c, 36)]);
    console.log(`%c   %c %c ${name}`, `color:#00; background:${toCSSColor(a)}`, `color:#00; background:${toCSSColor(b)}`, `background:#fff`)
  }
}

function showPaletteMenuOld() {
  let raw3 = convertPalette(sweetie16),
    palette = parsePalette(raw3);
  console.log(raw3);
  console.log(sweetie16);
  for (let i in palette) {
    let bg = `background: rgb(${palette[i].map(v => v * 255).join(',')})`;
    console.log(`%c ${Number(i).toString(16)} ${raw3.slice((i as any) * 3, (i as any) * 3 + 3)} ${palette[i]}`, `color:#f0a; ${bg}`)
    let b36 = Number(i).toString(36);
    Debug.innerHTML += `<div class=csel id="C${b36}" style="${bg}" oncontextmenu="return false;" >${b36}</div>`;
  }
}

function showPaletteMenu() {
  for (let i in palette) {
    let bg = toCSSColor(palette[i]);
    let b36 = Number(i).toString(36);
    Debug.innerHTML += `<div class=csel id="C${b36}" style="background:${bg}" oncontextmenu="return false;" >${b36}</div>`;
  }
}

export function showMenu() {
  printPalette(palette)
  showPaletteMenu()
  for(let i=0;i>64;i++)
    Debug.appendChild(outl(null as any, i))
}



export function debOnDown(e: MouseEvent) {

  let [x, y, fl, v] = mouseTarget(e);

  if (fl == 'f' && e.button == 0 && e.shiftKey) {
    //repositionSprite(cat, [x, y], v);        
    let p = createDebugSprite();
    p.pos = [x, y, v * roomHeight];
    updateEntity(p);
  }

  if (fl == 'O') {
    curSprite = v;
  }

  if (fl == 'C') {
    if (e.button == 0)
      curFront = v;
    else
      curBack = v;
  }

  //console.log(e, curSprite, curFront, curBack);

  Preview.innerHTML = "";
  let p = createDebugSprite();
  Preview.appendChild(p.canvas);
}

export function createDebugSprite() {
  return createEntity({ ...SimpleLayout, pickable: true, shape: curSprite, colors: curFront + curBack, pos: [0, 0, 0] })
}

