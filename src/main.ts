import { initControls, rezoom } from "./controls";
import { showMenu } from "./debug";
import { loadTextures, prepareScene } from "./init";
import { convertPalette, parsePalette, pineapple32 } from "./palettes";
import { CharLayout, createEntity, updateEntity, SimpleLayout, Entity, simple, roomDoorPos } from "./entity";
import { numsToColors } from "./graphics";

declare var img: HTMLImageElement, FPS: HTMLDivElement;

export const roomDepth = 64, rows = 5, cols = 3, roomHeight = 100, roomWidth = 200, quadSize = 8, roomsNum = rows * cols;

export let
  //palette = generatePalette(),
  palette = parsePalette(convertPalette(pineapple32)),
  filters = new Set(),
  solid: HTMLCanvasElement[] = [],
  transp: HTMLCanvasElement[] = [],
  outl: HTMLCanvasElement[] = [];

export let catSprite: HTMLCanvasElement;

export let cat: Entity, phantom: Entity, pointer: Entity, current: Entity, entities: Entity[] = [];

onload = () => {
  img.onload = init;
  img.src = 'sprites1bit.gif';
}

function init() {
  prepareScene()
  loadTextures()
  showMenu()
  rezoom()
  initControls()

  for (let i = 0; i < roomsNum; i++) {
    createEntity({
      ...SimpleLayout,
      shape: 0x50,
      colors: "ef",
      scale: 2,
      pos: roomDoorPos(i)
    })
  }

  cat = createEntity(
    {
      ...CharLayout,
      shape: 0x12,
      noclick: true,
      colors: "nm",
      body: simple(0x2b, "lk"),
      pos: [20, 10, roomHeight]
    });


  current = cat;

  phantom = createEntity({ ...SimpleLayout, opacity:0.5, shape:1, colors:"ab", pos:[0,0,0], noclick:true });

  phantom.canvas.classList.add("phantom");

  for (let i = 0; i < 300; i++)
    createEntity({
      ...SimpleLayout,
      shape: 0x50 + ~~(Math.random() * 14),
      scale: Math.random() > .5 ? 2 : 1,
      colors: numsToColors(~~(Math.random() * 32), (~~(Math.random() * 32))),
      pos: [
        Math.random() * roomWidth * cols,
        Math.random() * roomDepth,
        ~~(Math.random() * rows + 1) * roomHeight]
    })


  /*pointer = createSprite({ ...SimpleLayout, bits: [[0x8, "50"]], pos: [20, 10, roomHeight - cat.size[1]], })
  repositionSprite(pointer);*/

}

let lastt = 0, fps = 0;
function loop(t) {
  let dt = t - lastt || 1;
  lastt = t;
  fps = fps * .9 + (1000 / dt) * .1;
  FPS.innerText = `FPS: ${~~fps}`;
  entities.forEach(s => (s.actionsQueue.length || s.animation) && updateEntity(s))
  requestAnimationFrame(loop)
}

loop(0)