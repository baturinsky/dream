import { mouseTarget, setActions } from "./controls";
import { palette, roomHeight, current } from "./main";
import { convertPalette, generatePalette, parsePalette, RGBA, sweetie16 } from "./palettes";
import { createEntity, updateEntity, ItemTemplate, KindOf, SfxTemplate, roomEntities, roomNumber, parentPos, roomWalkAnimation, sfx, showEmote } from "./entity";
import { Aspects, Items, Materials } from "./data";
import { AspectSprites, BodySprites, outl } from "./graphics";
import { loadAll, saveAll } from "./serial";
import { japaneseName, randomElement, RNG, sum, toCSSColor } from "./util";

declare var Debug: HTMLDivElement, Preview: HTMLDivElement;

export let curFront = '1', curBack = '2', curSprite = 0;


export function paletteLine(rgb: RGBA) {
  let bg = toCSSColor(rgb)
  console.log(`%c           ${bg}`, `color:#00; background:${bg}`, `background:#fff`)
}

export function printPalette(p: RGBA[]) {
  for (let i in p) {
    let bg = toCSSColor(p[i])
    console.log(`%c          %c ${Number(i).toString(36)} ${bg}`, `color:#00; background:${bg}`, `background:#fff`)
  }

  for (let name in Materials) {

    let [a, b] = [...Materials[name].colors].map(c => palette[Number.parseInt(c, 36)]);
    console.log(`%c   %c %c ${name}`, `color:#00; background:${toCSSColor(a)}`, `color:#00; background:${toCSSColor(b)}`, `background:#fff`)
  }

  for (let as of Object.values(Aspects)) {
    let [a, b] = [...as.colors].map(c => palette[Number.parseInt(c, 36)]);
    console.log(`%c   %c %c ${as.name}`, `color:#00; background:${toCSSColor(a)}`, `color:#00; background:${toCSSColor(b)}`, `background:#fff`)
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
  for (let i = 0; i < 256; i++) {
    Debug.appendChild(outl(0 as any, i))
  }
}


addEventListener("pointerdown", (e: MouseEvent) => {

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
})

const saveName = "ayhiadream"

let ai = 0;

addEventListener("keydown", e => {
  if (e.code == "KeyD") {
    Debug.classList.toggle("dn")
  }
  if (e.code == "KeyS") {
    let save = saveAll();
    localStorage.setItem(saveName, JSON.stringify(save))
  }

  if (e.code == "KeyL") {
    let data = localStorage.getItem(saveName)
    if (data)
      loadAll(JSON.parse(data));
  }

  if (e.code == "KeyT") {
    let neighbors = roomEntities(roomNumber(current.pos));
    let ne = randomElement(neighbors);
    setActions(current, roomWalkAnimation(current, parentPos(ne), 15));
  }

  if (e.code == "KeyE") {
    //let a = randomElement(Object.values(Aspects));
    let a = Object.keys(Aspects)[ai];
    showEmote(current, a);
    ai++
  }
})

export function createDebugSprite() {
  return createEntity({ ...SfxTemplate, shape: curSprite, colors: curFront + curBack, pos: [0, 0, 0] })
}

export function onInit() {
  //for (let i = 0; i < 100; i++) console.log(japaneseName(RNG(Math.random())));
  console.log(Aspects);
  console.log(Materials);
  console.log(Items);

}