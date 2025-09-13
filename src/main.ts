import { initControls, rezoom, updateCam, updateInfo } from "./controls";
import { initDebug } from "./debug";
import { prepareScene } from "./init";
import { convertedPineapple32, parsePalette } from "./palettes";
import {
  createEntity, updateEntity, Entity,
  KindOf, removeEntity, updateAll, exploreItemsNearby, decayAspectsMaybe, createDiv, dreaming,
  shapeAndColor,
  XY,
  chars,
  holdEntity,
  setMaterial
} from "./entity";
import { AspectSprites, GloveShape, LegShape } from "./graphics";
import { array, myAlert, rng } from "./util";
import { Aspects, tips } from "./data";
import { roomHeight, roomsNum, saveName } from "./consts";
import { redrawRooms, Room } from "./room";
import { aspectsSum, levelEntityTo, levelTo, TAspects } from "./aspects";
import { toggleSavesMenu } from "./state";

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

export let
  palette = parsePalette(convertedPineapple32),
  filters = new Set();

export let catSprite: HTMLCanvasElement;

export let cat: Entity, dog: Entity, phantom: Entity, pointer: Entity, current: Entity, entitiesById: { [id: number]: Entity } = {};

onload = () => {
  img.onload = init;
  img.src = 'i.webp';
}

export function selectPerson(e?: Entity) {
  let old = current;
  current = e as any;
  updateAll(old);
  if (current) {
    updateAll(current);
    current.div.appendChild(pointer.div);
  }
  updateInfo(e)
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
      shape: 0x12,
      colors: "nm",
      type: "Cat",
      name: "Мiu",
      chest: createEntity({ ...ItemTemplate, type: "Chain", material: "Plant" }),
      pos: [320, 10, roomHeight],
      addAspects:{S:1}
    });




  //holdEntity(cat, createEntity({ ...ItemTemplate, type: "Cactus", pos:[0,0,0] }))


  /*dog = createEntity(
    {
      ...PersonTemplate,
      level: 1,
      shape: 0x1a,
      material: 'Plain',
      colors: "qp",
      type: "Dog",
      name: japaneseName(),
      chest: sfx(BodySprites + 1, "ba"),
      pos: [340, 10, roomHeight],
      tip: "A person, that you have pulled out of the dream."
    });*/

  //createEntity({ ...ItemTemplate, type: "Brush", pos: [360, 10, roomHeight] })

  phantom = createEntity({ ...SfxTemplate, opacity: 0.5, shape: 1, colors: "ab", pos: [0, 0, 0], noclick: true });

  let items = 
  ["Bed", "Bed", "Hammer", "Brush", "Shrinker", "Magnifier", "Tome", "Extractor"].map((type,i)=>
    createEntity({ ...ItemTemplate, type, pos: rooms[i+1].center() })
  )
  holdEntity(items[1], createEntity({ ...ItemTemplate, type: "Clock", pos: [0, 0, 0] }))

  //createEntity({ ...ItemTemplate, type:"Robe", pos: rooms[1].center() })

  phantom.canvas.classList.add("phantom");

  //rooms[1].addItems(30);

  pointer = createEntity({ ...SfxTemplate, shape: 0x8, colors: "ab", pos: [8, 0, 4], className: "pointer" })

  selectPerson(cat);

  redrawRooms();

  setInterval(loop, 15);

  updateInfo()

  myAlert(`LMB to switch current character, walk around and pick/place items. RMB to use items (such as Bed). Middle buton and wheel to control the camera.`)
  
  toggleSavesMenu(localStorage[saveName])


  //@ts-ignore
  //if (DEBUG)    initDebug()

  //rooms[1].addItems(30);
}

let lastt = 0, fps = 0, cumulative = 0;

export let totalAspects: TAspects


function loop() {
  let t = Date.now();
  let dt = Math.min(1000, t - lastt || 1);
  totalAspects = chars().reduce((p, c) => aspectsSum(p, c.aspects), {} as TAspects);

  if (~~((cumulative + dt) / 1000) > ~~((cumulative) / 1000)) {
    chars().forEach(c => {
      decayAspectsMaybe(c);
      if (c.sleeper)
        c.sleeper++;
    });
  };

  cumulative += dt;

  lastt = t;
  let tn = Date.now();
  fps = fps * .9 + (1000 / dt) * .1;
  FPS.innerText = `FPS: ${~~fps}`;
  Object.values(entitiesById).forEach(s => {
    if (s.actionsQueue.length || s.animation)
      updateEntity(s)
    if (s.deadAt && tn > s.deadAt) {
      removeEntity(s);
    }
    if (s.kind == KindOf.Person) {
      if (!dreaming(s) && dt > rng() * 3000) {
        exploreItemsNearby(s);
      }
    }

  })

  rooms.forEach(r => {
    if(r.dream)
      r.dur += dt
  })

  if (!current?.held)
    phantom.div.style.opacity = '0';
}