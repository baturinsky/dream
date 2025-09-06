import { initControls, rezoom, updateCam, updateInfo } from "./controls";
import { initDebug } from "./debug";
import { prepareScene } from "./init";
import { convertedPineapple32, convertPalette, parsePalette, pineapple32 } from "./palettes";
import {
  createEntity, updateEntity, Entity, sfx as sfx,
  KindOf, removeEntity, updateAll, exploreItemsNearby, decayAspects, createDiv, dreaming,
  shapeAndColor,
  XY
} from "./entity";
import { AspectSprites, BodySprites, GloveShape, LegShape } from "./graphics";
import { array, japaneseName, randomElement, rng, weightedRandomOKey } from "./util";
import { Aspects, Items, Materials } from "./data";
import { roomHeight, cols, roomWidth, roomDepth, roomsNum } from "./consts";
import { redrawRooms, Room } from "./room";

declare var img: HTMLImageElement, FPS: HTMLDivElement, Scene: HTMLDivElement;

export const
  PersonTemplate = {
    bitPos: [[3, 1], [2, 14], [2, 10], [2, 13]] as XY[],
    mountPoint: [0, 0, 16],
    size: [16, 24] as XY,
    origin: "75% 50%",
    kind: KindOf.Person,
    makeBits: (e: Entity) => [
      [e.shape, e.colors],
      [LegShape, e.colors],
      shapeAndColor(e.chest),
      [GloveShape, e.colors]
    ]
  } as Entity,
  SceneryTemplate = {
    bitPos: [[0, 0]] as XY[],
    size: [10, 10] as XY,
    kind: KindOf.Scenery,
    makeBits: (e: Entity) => e && [[e.shape, e.colors]]
  } as Entity,
  ItemTemplate = {
    ...SceneryTemplate,
    //mountPoint: [5, 0, 0],
    kind: KindOf.Item,
  } as Entity,
  SfxTemplate = { ...SceneryTemplate, kind: KindOf.SFX }
  ;

export const Templates = [,
  PersonTemplate, ItemTemplate, SceneryTemplate, SfxTemplate
] as Entity[];

//console.log(convertPalette(pineapple32));

export let
  //palette = generatePalette(),
  palette = parsePalette(convertedPineapple32),
  filters = new Set();

export let catSprite: HTMLCanvasElement;

export let cat: Entity, dog: Entity, phantom: Entity, pointer: Entity, current: Entity, entities: { [id: number]: Entity } = {};

onload = () => {
  DROP: console.log(123);
  img.onload = init;
  img.src = '16cols.gif';
}

export function selectPerson(e?: Entity) {
  let old = current;
  current = e as any;
  updateAll(old);
  if (current) {
    updateAll(current);
    current.div.appendChild(pointer.div);
  }
}

export let rooms: Room[] = []

function init() {
  rooms = array(roomsNum, id => new Room(id))
  prepareScene()
  rooms.forEach(m => m.md())
  rezoom()
  initControls()
  updateCam()

  cat = createEntity(
    {
      ...PersonTemplate,
      level: 1,
      shape: 0x12,
      colors: "nm",
      type: "Cat",
      name: japaneseName(),
      chest: sfx(BodySprites + 2, "lk"),
      pos: [320, 10, roomHeight]
    });


  dog = createEntity(
    {
      ...PersonTemplate,
      level: 1,
      shape: 0x1a,
      material: 'Plain',
      colors: "qp",
      type: "Dog",
      name: japaneseName(),
      chest: sfx(BodySprites + 1, "ba"),
      pos: [340, 10, roomHeight]
    });

  createEntity({ ...ItemTemplate, type: "Brush", pos: [50, 10, roomHeight] })
  createEntity({ ...ItemTemplate, type: "Brush", pos: [60, 10, roomHeight] })

  rooms[1].open = true;
 
  phantom = createEntity({ ...SfxTemplate, opacity: 0.5, shape: 1, colors: "ab", pos: [0, 0, 0], noclick: true });

  phantom.canvas.classList.add("phantom");

  for (let i = 0; i < 30; i++) {
    let type = weightedRandomOKey(Items, it => it.chance);

    createEntity({
      ...ItemTemplate,
      type,
      pos: [
        rng(cols) * roomWidth + 10 + rng(roomWidth - 20),
        rng(roomDepth),
        roomHeight]
    })
  }


  pointer = createEntity({ ...SfxTemplate, shape: 0x8, colors: "ab", pos: [8, 0, 4], className: "pointer" })

  selectPerson(cat);

  redrawRooms();

  loop(0)

  updateInfo()

  //@ts-ignore
  if (DEBUG)
    initDebug()

}

let lastt = 0, fps = 0, cumulative = 0;

function loop(t) {
  let dt = Math.min(1000, t - lastt || 1);

  if (~~((cumulative + dt) / 1000) > ~~((cumulative) / 1000)) {
    console.log("tic");
  };
  cumulative+=dt;

  lastt = t;
  let tn = Date.now();
  fps = fps * .9 + (1000 / dt) * .1;
  FPS.innerText = `FPS: ${~~fps}`;
  Object.values(entities).forEach(s => {
    if (s.actionsQueue.length || s.animation)
      updateEntity(s)
    if (s.deadAt && tn > s.deadAt) {
      removeEntity(s);
    }
    if (s.kind == KindOf.Person) {
      let dream = dreaming(s);
      if (dream) {
      } else if (dt > rng() * 3000) {
        decayAspects(s);
        exploreItemsNearby(s);
      }
    }

    document.querySelectorAll('.aspect').forEach(el => {
      let a = Aspects[(el as any)?.dataset?.aspect];
      if (!a)
        return;
      delete (el as any)?.dataset?.aspect;
      let c = createDiv({
        ...SfxTemplate,
        shape: AspectSprites + a.ind,
        colors: a.colors
      })
      el.prepend(c);
    })

  })
  requestAnimationFrame(loop)
  if (!current?.held)
    phantom.div.style.opacity = '0';
}