import { materials } from "./data";
import { cc, recolor, gcx, GloveShape, LegShape, outl } from "./graphics";
import { cols, roomHeight, roomWidth, entities, current, pointer } from "./main";
import { dist, mul, sub, sum } from "./util";

declare var Scene: HTMLDivElement, img: HTMLImageElement, div1: HTMLDivElement, DEFS: Element;

export type XY = [number, number];
export type XYZ = [number, number, number];
export let X = 0, Y = 1, Z = 2;

export const
  CharLayout = {
    bitPos: [[3, 1], [2, 14], [2, 10], [2, 13]] as XY[],
    mountPoint: [0, 0, 16],
    size: [16, 24] as XY,
    origin: "75% 50%",
    makeBits: (e: Entity) => [
      [e.shape, e.colors],
      [LegShape, e.colors],
      shapeAndColor(e.body),
      [GloveShape, e.colors]
    ],
  } as Entity,
  SimpleLayout = {
    mountPoint: [5, 0, 0],
    bitPos: [[0, 0]] as XY[],
    size: [10, 10] as XY,
    pickable: true,
    makeBits: (e: Entity) => e && [[e.shape, e.colors]]
  } as Entity;


export type Action = {
  start: (e: Entity) => boolean
  update: (e: Entity) => boolean
}

export function walkTo(e: Entity, to: XYZ, duration?: number) {
  let from = e.pos, start = Date.now();
  duration ??= dist(e.pos, to) * 10;
  let dx = to[0] - e.pos[0];
  if (dx != 0)
    e.right = dx > 0;
  let posDelta = sub(to, from);
  return () => {
    let t = Date.now();
    let timeFromStart = Math.min(t - start, duration);
    e.pos = sum(from, posDelta, duration ? timeFromStart / duration : 1) as XYZ;
    let finished = timeFromStart >= duration;
    e.transform = finished ? `` : `rotateZ(${Math.sin(t / 1e2) * 5}deg)`;
    return !finished;
  }
}


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
  body?: Entity
}

export type Entity = SpriteLayout & Gear & {
  /**Canvas */
  canvas: HTMLCanvasElement,
  div: HTMLDivElement;
  /**Position */
  pos: XYZ,
  /**Looking right */
  right?: boolean
  scale: number
  id?: number
  children: Entity[]
  actionsQueue: Function[]
  animation?: Function
  /**Main colors */
  colors: string
  /**Main shape */
  shape: number
  transform: string
  pickable: boolean
  noclick: boolean
  person: boolean
  opacity: number
  held: Entity[]
  owner?: Entity
  material: string
  /**Horisontal */
  hor?: boolean
}



export const lookRight = "scaleX(-1)";

export function roomWalkAnimation(e: Entity, to: XYZ) {
  let fromRoom = roomNumber(e.pos), toRoom = roomNumber(to);
  if (toRoom == fromRoom)
    return [() => walkTo(current, to)]
  else
    return [
      () => walkTo(e, roomDoorPos(fromRoom)),
      () => walkTo(e, roomDoorPos(toRoom), 0),
      () => walkTo(e, to),
    ]
}

export function ss(e: Entity) {
  return [e.size[0] * e.scale, e.size[1] * e.scale]
}

export function updateEntity(e: Entity, parentPos?: XYZ) {
  if (!e.animation) {
    let nextAction = e.actionsQueue.shift()
    if (nextAction) {
      let ar = nextAction();
      if(ar instanceof Function)
        e.animation = ar;
    }
  }

  if (e.animation && e.animation() == false) {
    delete e.animation;
  }

  let d = e.div;

  let pos = parentPos ? sum(e.pos, parentPos) : e.pos;

  let p = sub(pos, topLeftShift(e));

  d.style.left = `${p[0]}px`
  d.style.top = `${p[2]}px`
  d.style.opacity = e.opacity as any;

  let transform = `translateZ(${pos[1]}px)` + (e.right ? lookRight : "") + /*`scale(${e.scale})` +*/ (e.transform ?? '');

  d.style.transform = transform;
}

export function topLeftShift(e:Entity){
  return [ss(e)[0] / 2, 0, ss(e)[1]] as XYZ;
}


export function createCanvas(s: Entity) {
  let [c] = cc(1);
  let div = document.createElement("div")
  div.classList.add("scont")
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
  if(e.material){
    e.colors = materials[e.material].colors;
  }
  if (e.makeBits) {
    e.bits = e.makeBits(e);
  }
  let c = e.canvas;
  let scale = e.scale;
  c.width = e.size[0] * scale;
  c.height = e.size[1] * scale;
  c.style.transformOrigin = e.origin;

  gcx(c).imageSmoothingEnabled = false;

  c.style.pointerEvents = e.noclick ? "none" : "all";
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

let lastSpriteId = 0;

export function createEntity(s: Entity) {
  s.id ??= ++lastSpriteId;
  s.held = []
  let e = { canvas: createCanvas(s), floor: 0, scale: 1, actionsQueue: [], ...s as any } as Entity;
  updateCanvas(e);
  if (e.pos) {
    entities.push(e)
    Scene.appendChild(e.div)
    updateEntity(e);
  }
  return e
}


export function removeEntity(e: Entity) {
  entities.splice(entities.indexOf(e), 1);
  e.canvas.parentElement?.removeChild(e.canvas);
}

export function holdEntity(owner: Entity, item: Entity, mountPoint?: XYZ) {

  if (!item.pickable)
    return;
  owner.div.appendChild(item.div);
  owner.held.unshift(item);
  item.owner = owner;
  item.pos = mountPoint ?? mul(owner.mountPoint, owner.scale);
  updateEntity(item);
}

export function dropHeldEntity(owner: Entity, pos?: XYZ) {
  let item = owner.held.shift()
  if (item) {
    item.pos = pos ?? owner.pos;
    Scene.appendChild(item.div);
    delete item.owner;
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
  return [[e.shape, e.colors], [0x20, e.colors], entityLook(e.body), [0x30, e.colors]]
}

export function simple(shape, colors) {
  return { ...SimpleLayout, shape, colors } as Entity;
}

export function simpleCopy(to: Entity, from: Entity) {
  if (from) {
    to.colors = from.colors;
    to.shape = from.shape
    to.scale = from.scale
  }
  updateCanvas(to);
}

export function ownerPos(e: Entity) {
  return finalOwner(e).pos;
}

export function finalOwner(e: Entity){
  return (e.owner ? finalOwner(e.owner) : e) as Entity;
}

export function absolutePos(e: Entity){
  let pos = e.pos;
  while(e.owner){
    pos = sum(pos, e.owner.pos);
    pos = sub(pos, topLeftShift(e.owner))
    e = e.owner;
  }
  return pos;
}