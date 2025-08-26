import { initControls, rezoom } from "./controls";
import { showMenu } from "./debug";
import { prepareScene } from "./init";
import { convertPalette, parsePalette, pineapple32 } from "./palettes";
import { CharLayout, createEntity, updateEntity, SimpleLayout, Entity, simple, roomDoorPos, updateCanvas } from "./entity";
import { BodySprites, filtered, numsToColors, recolor } from "./graphics";
import { randomElement, rng } from "./util";
import { materials } from "./data";

declare var img: HTMLImageElement, FPS: HTMLDivElement;

export const roomDepth = 64, rows = 5, cols = 3, roomHeight = 100, roomWidth = 200, quadSize = 8, roomsNum = rows * cols;

export let
  //palette = generatePalette(),
  palette = parsePalette(convertPalette(pineapple32)),
  filters = new Set();

export let catSprite: HTMLCanvasElement;

export let cat: Entity, dog: Entity, phantom: Entity, pointer: Entity, current: Entity, entities: Entity[] = [];

onload = () => {
  img.onload = init;
  img.src = '16cols.gif';
}

export function selectPerson(e: Entity) {
  if (current) {
    current.noclick = false;
    updateCanvas(current)
  }
  current = e;
  current.noclick = true;
  updateCanvas(current)
  current.div.appendChild(pointer.div);
}

function init() {
  prepareScene()
  showMenu()
  rezoom()
  initControls()


  for (let i = 0; i < roomsNum; i++) {
    createEntity({
      ...SimpleLayout,
      shape: 0x50,
      colors: "ef",
      pickable: false,
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
      person: true,
      body: simple(BodySprites + 2, "lk"),
      pos: [20, 10, roomHeight]
    });

  dog = createEntity(
    {
      ...CharLayout,
      shape: 0x1a,
      colors: "qp",
      person: true,
      body: simple(BodySprites + 1, "ba"),
      pos: [40, 10, roomHeight]
    });


  phantom = createEntity({ ...SimpleLayout, opacity: 0.5, shape: 1, colors: "ab", pos: [0, 0, 0], noclick: true });

  phantom.canvas.classList.add("phantom");

  for (let i = 0; i < 300; i++)
    createEntity({
      ...SimpleLayout,
      shape: 0x50 + rng(20),
      scale: rng() > .5 ? 2 : 1,
      material: randomElement(Object.keys(materials)),
      //colors: numsToColors(rng(32), rng(32)),
      pickable: true,
      pos: [
        rng(roomWidth * cols),
        rng(roomDepth),
        (rng(rows) + 1) * roomHeight]
    })


  pointer = createEntity({ ...SimpleLayout, shape: 0x8, colors: "ab", pos: [8, 0, 0] })
  pointer.div.classList.add("pointer")

  selectPerson(cat);

  loop(0)
}

let lastt = 0, fps = 0;
function loop(t) {
  let dt = t - lastt || 1;
  lastt = t;
  fps = fps * .9 + (1000 / dt) * .1;
  FPS.innerText = `FPS: ${~~fps}`;
  entities.forEach(s => (s.actionsQueue.length || s.animation) && updateEntity(s))
  requestAnimationFrame(loop)
  if (!current?.held.length)
    phantom.div.style.opacity = '0';
}

