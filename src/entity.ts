import { aspectsToString, aspectsSum, inferLevel, aspectsMul } from "./aspects";
import { groundPos, infoShownFor, itemOrPerson, setActions, updateInfo } from "./controls";
import { Aspects, Items, Materials, Races } from "./data";
import { cc, recolor, gcx, GloveShape, LegShape, outl, AspectSprites } from "./graphics";
import { cols, roomHeight, roomWidth, entities, current, pointer } from "./main";
import { dist, mul, randomElement, rng, rngRounded, sub, sum, weightedRandom, weightedRandomOKey } from "./util";

declare var Scene: HTMLDivElement, img: HTMLImageElement, div1: HTMLDivElement, DEFS: Element;

export type XY = [number, number];
export type XYZ = [number, number, number];
export let X = 0, Y = 1, Z = 2;


export type SpriteLayout = {
  /**Bits ids and colors */
  bits?: ([number, string] | null | undefined)[],
  /**Bits positions */
  bitPos: XY[]
  /**Function which creates bitPos from Entity data */
  makeBits: (e: Entity) => any[],
  /**Size of the grid*/
  size: XY
  /**transform-origin */
  origin: string
  mountPoint: XYZ
}

export type Gear = {
  chest?: Entity
}

export enum KindOf {
  Person = 1,
  Item = 2,
  Scenery = 3,
  SFX = 4
}

export type Entity = SpriteLayout & Gear & {
  /** DO NOT SAVE */

  /**Canvas */
  canvas: HTMLCanvasElement,
  div: HTMLDivElement;
  actionsQueue: Function[]
  animation?: Function
  className: string
  noclick: boolean
  opacity: number
  parent?: Entity
  /**Horisontal */
  hor?: boolean
  /**Death time stamp */
  deadAt: number
  transform: string

  /** DO SAVE */

  id: number
  name: string,
  kind: KindOf
  /**Position */
  pos: XYZ,
  scale: number
  /**Looking right */
  right?: boolean
  /**Main shape */
  shape: number
  /**Main colors */
  colors: string
  aspects: { [kind: string]: number }
  day:boolean

  /**Item type or person species */
  type: string

  material: string

  /**ids of the recently explored entities */
  recent: number[]

  level: number

  held: Entity[]

}

export type CombatStats = {
  hp: number
  delay: number
  cdown: number
  aggro: number
}

export function maxhp(e: Entity) {
  return (e.aspects.H + e.level) * 10;
}

export function cooldown(e: Entity) {
  return ~~(3000 / (1 + e.aspects.T));
}

export function damage(e: Entity) {
  return (e.aspects.S + e.level) * 3;
}

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
    mountPoint: [5, 0, 0],
    kind: KindOf.Item,
  } as Entity,
  SfxTemplate = { ...SceneryTemplate, kind: KindOf.SFX }
  ;

export const Templates = [,
  PersonTemplate, ItemTemplate, SceneryTemplate, SfxTemplate
] as Entity[];


export type Action = {
  start: (e: Entity) => boolean
  update: (e: Entity) => boolean
}

export function walkTo(e: Entity, to: XYZ, stopDistance = 0) {
  let from = e.pos, start = Date.now();
  let duration = dist(e.pos, to) * 10;
  let dx = to[0] - e.pos[0];
  if (dx != 0)
    e.right = dx > 0;
  let posDelta = sub(to, from);
  return () => {
    let t = Date.now();
    let timeFromStart = Math.min(t - start, duration);
    e.pos = sum(from, posDelta, duration ? timeFromStart / duration : 1) as XYZ;
    let finished = timeFromStart >= duration || dist(e.pos, to) < stopDistance;
    e.transform = finished ? `` : `rotateZ(${Math.sin(t / 1e2) * 5}deg)`;
    return !finished;
  }
}




export const lookRight = "scaleX(-1)";

export function roomWalkAnimation(e: Entity, to: XYZ, stopDistance = 0) {
  let fromRoom = roomNumber(e.pos), toRoom = roomNumber(to);
  if (toRoom == fromRoom)
    return [() => walkTo(e, to, stopDistance)]
  else
    return [
      () => walkTo(e, roomDoorPos(fromRoom)),
      //() => walkTo(e, roomDoorPos(toRoom), 0),
      () => e.pos = roomDoorPos(toRoom),
      () => walkTo(e, to, stopDistance),
    ]
}

export function screenSize(e: Entity) {
  return [e.size[0] * e.scale, e.size[1] * e.scale]
}

export function updateAll(e: Entity) {
  if (!e)
    return;
  updateCanvas(e);
  updateEntity(e);
}

export function updateEntity(e: Entity, parentPos?: XYZ) {
  if (!e)
    return;
  if (!e.animation && e.actionsQueue) {
    let nextAction = e.actionsQueue.shift()
    if (nextAction) {
      let ar = nextAction();
      if (ar instanceof Function)
        e.animation = ar;
    }
  }

  if (e.animation && e.animation() == false) {
    delete e.animation;
  }

  let d = e.div;

  let pos = parentPos ? sum(e.pos, parentPos) : e.pos;

  let p = sub(pos, topLeftShift(e));

  //d.style.pointerEvents = finalParent(e) != current && e.kind != KindOf.SFX ? "all" : "none";

  d.style.left = `${p[0]}px`
  d.style.top = `${p[2]}px`
  d.style.opacity = e.opacity as any;
  d.classList.toggle('current', e == current)
  d.classList.add("k" + e.kind)

  let transform = `translateZ(${pos[1]}px)` + (e.right ? lookRight : "") + (e.transform ?? '');

  d.style.transform = transform;
}

/**Coordinates of the top left corner compared to bottom center */
export function topLeftShift(e: Entity) {
  return [screenSize(e)[0] / 2, 0, screenSize(e)[1]] as XYZ;
}


export function createCanvas(s: Entity) {
  let [c] = cc(1);
  let div = document.createElement("div")
  div.classList.add("entity")
  div.appendChild(c);
  div.style.position = "absolute";
  c.id = "s" + s.id;
  s.canvas = c;
  s.div = div;
  updateCanvas(s)
  return c;
}

export function shapeAndColor(e?: Entity) {
  return e && [e.shape, e.colors] as [number, string];
}


export function updateCanvas(e: Entity) {
  if (e.material) {
    e.colors = Materials[e.material].colors;
  }
  if (e.makeBits) {
    e.bits = e.makeBits(e);
  }
  let c = e.canvas;
  //let scale = e.scale;
  const scale = 1;
  c.width = e.size[0] * scale;
  c.height = e.size[1] * scale;
  c.style.transformOrigin = e.origin;
  c.style.transform = `scale(${e.scale})`
  //e.ssize = mul(e.size, e.scale)

  gcx(c).imageSmoothingEnabled = false;

  if (e.bits)
    for (let i = 0; e.bits[i]; i++) {
      let b = e.bits[i];
      if (!b || !b[0])
        continue;
      let rclr = outl(b[1], b[0]);

      gcx(c).drawImage(
        rclr,
        e.bitPos[i][0] * scale,
        e.bitPos[i][1] * scale,
        rclr.width * scale,
        rclr.height * scale
      );
    }
}

export let lastSpriteId = 0;

export function setLastSpriteId(v: number) {
  lastSpriteId = v;
}

export function createEntity(s: Entity) {
  s.id ??= ++lastSpriteId;
  s.held = []
  let e = { canvas: createCanvas(s), floor: 0, scale: 1, actionsQueue: [], ...s as any } as Entity;
  updateCanvas(e);

  if (s.kind == KindOf.Item) {
    let item = Items[s.type];
    e.mountPoint = [5, 0, 9 - item.placeh * 8];
  }

  if (e.pos) {
    entities.push(e)
    Scene.appendChild(e.div)
    if (s.className)
      e.div.classList.add(s.className)
    updateEntity(e);
  }

  if (!e.aspects)
    for (let meat of [Materials[e.material], Races[e.type], Items[e.type]]) {
      e.aspects = aspectsSum(e.aspects, meat?.aspects)
    }

  //console.log(e.aspects);

  return e
}


export function createPerson(params) {
  return
}


export function removeEntity(e: Entity) {
  e.div.parentElement?.removeChild(e.div);
  entities.splice(entities.indexOf(e), 1);
}

export function holdEntity(parent: Entity, item: Entity, mountPoint?: XYZ) {

  if (item.kind != KindOf.Item)
    return;
  //item.div.parentNode?.removeChild(item.div);
  parent.div.appendChild(item.div);
  parent.held.unshift(item);
  item.parent = parent;
  item.pos = mountPoint ?? mul(parent.mountPoint, parent.scale);
  updateEntity(item);
}

export function dropHeldEntity(parent: Entity, pos?: XYZ) {
  let item = parent.held.shift()
  if (item) {
    item.pos = pos ?? parent.pos;
    Scene.appendChild(item.div);
    delete item.parent;
    updateEntity(item);
  }
  return item
}

export function roomNumber(pos: XYZ) {
  return ~~(pos[0] / roomWidth) + cols * ~~(pos[2] / roomHeight - 1)
}

export function roomDoorPos(n: number) {
  return [(n % cols + .5) * roomWidth, 0, roomHeight * ~~(n / cols + 1)] as XYZ
}

export function entityLook(e?: Entity) {
  return e && [e.shape, e.colors] as [number, string]
}

export function charBits(e: Entity) {
  return [[e.shape, e.colors], [0x20, e.colors], entityLook(e.chest), [0x30, e.colors]]
}

export function sfx(shape, colors) {
  return { ...SfxTemplate, shape, colors } as Entity;
}

export function simpleCopy(to: Entity, from: Entity) {
  if (from) {
    to.colors = from.colors;
    to.shape = from.shape
    to.scale = from.scale
  }
  updateCanvas(to);
}

export function parentPos(e: Entity, grounded = true) {
  return grounded ? groundPos(finalParent(e).pos) : finalParent(e).pos;
}

export function finalParent(e: Entity) {
  return (e.parent ? finalParent(e.parent) : e) as Entity;
}

export function absolutePos(e: Entity) {
  let pos = e.pos;
  while (e.parent) {
    pos = sum(pos, e.parent.pos);
    pos = sub(pos, topLeftShift(e.parent))
    e = e.parent;
  }
  return pos;
}

export function roomEntities(n: number) {
  return entities.filter(e => roomNumber(parentPos(e)) == n)
}

export function showEmote(e: Entity, aspect: string) {
  if (!aspect)
    return;
  if (e.kind != KindOf.Person)
    debugger
  let a = Aspects[aspect];
  return createEntity({
    ...SfxTemplate,
    shape: AspectSprites + a.ind,
    colors: a.colors,
    pos: sum(e.pos, [0, 0, -30]),
    className: "thought",
    deadAt: Date.now() + 3000
  })

}

export function entityLevel(e: Entity) {
  return e.level ?? inferLevel(e.aspects)
}

export function info(e?: Entity) {
  if (!e || !itemOrPerson(e))
    return;
  let h = '', t = '';
  if (e.kind == KindOf.Person) {
    h = `${e.name} the ${(e.type || 'X')}`
  } else {
    h = `${(e.material || '')} ${e.type}`
  }
  t += `Level ${entityLevel(e)}<br/><br/>`
  if (e.aspects)
    t += aspectsToString(e.aspects)
  return [h, t]
}

export function findNextThingToExplore(char: Entity) {
  let es = roomEntities(roomNumber(char.pos))
  let bestInd = weightedRandom(es.map(e => {
    if (e == char)
      return 0;

    if (!itemOrPerson(e)) {
      return 0;
    }

    let d = dist(char.pos, parentPos(e));

    let level = entityLevel(e);
    let desire = level / (10 + d) * recencyMultiplier(char, e);
    return desire;
  }));
  return es[bestInd];
}

export function examine(char: Entity, target: Entity) {
  let aspect = weightedRandomOKey(target.aspects);
  let learnedAmount = entityLevel(target) * recencyMultiplier(char, target) * .01;
  learnedAmount = rngRounded(learnedAmount);
  if (!learnedAmount)
    return;
  char.aspects = aspectsSum({ [aspect]: learnedAmount }, char.aspects)
  char.recent.unshift(target.id);
  char.recent.length = 20;
  if (char == infoShownFor)
    updateInfo(char)
  showEmote(char, aspect);
}

export function recencyMultiplier(char: Entity, item: Entity) {
  char.recent ??= [];
  let recent = char.recent.indexOf(item.id);
  if (recent == -1)
    recent = 1e6;
  return 1 - 1 / (1 + recent);
}

export function exploreItemsNearby(char: Entity) {
  if (!idle(char))
    return;
  let target = findNextThingToExplore(char)
  if (!target)
    return;

  console.log("exploring", target);
  setActions(char, [...roomWalkAnimation(char, parentPos(target), 5), () => examine(char, target)]);
}

export function idle(char: Entity) {
  return !char.actionsQueue?.length && !char.animation
}

export function decayAspects(char: Entity) {
  let il = inferLevel(char.aspects);
  if (char.level < il) {
    let aspect = weightedRandomOKey(char.aspects);
    char.aspects[aspect] = Math.max(0, char.aspects[aspect] - 0.01 * ~~(il - char.level + 1));
  }
}