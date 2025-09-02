import { initControls, rezoom, updateCam, updateInfo } from "./controls";
import { initDebug } from "./debug";
import { prepareScene } from "./init";
import { convertedPineapple32, convertPalette, parsePalette, pineapple32 } from "./palettes";
import { PersonTemplate, createEntity, updateEntity, ItemTemplate, Entity, sfx as sfx, 
  KindOf, SfxTemplate, removeEntity, updateAll, exploreItemsNearby, decayAspects, createDiv, dreaming } from "./entity";
import { AspectSprites, BodySprites } from "./graphics";
import { japaneseName, randomElement, rng, weightedRandomOKey } from "./util";
import { Aspects, Items, Materials } from "./data";
import { roomHeight, cols, roomWidth, roomDepth } from "./state";

declare var img: HTMLImageElement, FPS: HTMLDivElement, Scene: HTMLDivElement;


//console.log(convertPalette(pineapple32));

export let
  //palette = generatePalette(),
  palette = parsePalette(convertedPineapple32),
  filters = new Set();

export let catSprite: HTMLCanvasElement;

export let cat: Entity, dog: Entity, phantom: Entity, pointer: Entity, current: Entity, entities: {[id:number]:Entity} = {};

onload = () => {
  img.onload = init;
  img.src = '16cols.gif';
}

export function selectPerson(e?: Entity) {
  if (!e)
    return;
  let old = current;
  current = e;
  updateAll(old);
  updateAll(current);
  current.div.appendChild(pointer.div);
}

function init() {
  prepareScene()
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
      pos: [20, 10, roomHeight]
    });

  dog = createEntity(
    {
      ...PersonTemplate,
      level: 1,
      shape: 0x1a,
      colors: "qp",
      type: "Dog",
      name: japaneseName(),
      chest: sfx(BodySprites + 1, "ba"),
      pos: [40, 10, roomHeight]
    });


  phantom = createEntity({ ...SfxTemplate, opacity: 0.5, shape: 1, colors: "ab", pos: [0, 0, 0], noclick: true });

  phantom.canvas.classList.add("phantom");

  for (let i = 0; i < 30; i++) {
    let item = Items[weightedRandomOKey(Items, it => it.chance)];
    createEntity({
      ...ItemTemplate,
      kind: KindOf.Item,
      type: item.name,
      //shape: 0x50 + item.ind,
      //scale: item.scale,
      //colors: numsToColors(rng(32), rng(32)),
      material: rng(2) ? randomElement(Object.keys(Materials)) : item.material,
      pos: [
        rng(cols) * roomWidth + 10 + rng(roomWidth - 20),
        rng(roomDepth),
        roomHeight]
    })
  }


  pointer = createEntity({ ...SfxTemplate, shape: 0x8, colors: "ab", pos: [8, 0, 4], className: "pointer" })

  selectPerson(cat);

  loop(0)

  updateInfo()

  initDebug()

}

let lastt = 0, fps = 0;
function loop(t) {
  let dt = t - lastt || 1;
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
      if(dream){
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
  if (!current?.held.length)
    phantom.div.style.opacity = '0';
}

export type Room = Entity & {
  start: number
}


