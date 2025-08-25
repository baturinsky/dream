import { showPhantom } from "./controls";
import { cc, recolor, gcx } from "./graphics";
import { cols, outl, roomHeight, roomWidth, entities, current, phantom } from "./main";
import { dist, sub, sum } from "./util";

declare var Scene: HTMLDivElement, img: HTMLImageElement, div1: HTMLDivElement, DEFS: Element;

export type XY = [number, number];
export type XYZ = [number, number, number];
export let X = 0, Y = 1, Z = 2;

export enum EntityKind { CHAR = 1, FURNITURE = 2 };

export enum ActionKind { MOVE = 1, PICK = 2 };

export type Action = {
  kind: ActionKind
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
}

export type Gear = {
  hand?: Entity
  body?: Entity
}

export type Entity = SpriteLayout & Gear & {
  /**Canvas */
  canvas: HTMLCanvasElement,
  /**Position */
  pos: XYZ,
  /**Looking right */
  right?: boolean
  scale: number
  id?: number
  kind: EntityKind
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
  opacity: number
}


export const
  CharLayout = {
    bitPos: [[11, 0], [10, 14], [11, 10], [10, 13], [3, 6]] as XY[],
    size: [20, 24] as XY,
    origin: "75% 50%",
    makeBits: (e: Entity) => [
      [e.shape, e.colors],
      [LegShape, e.colors],
      shapeAndColor(e.body),
      [GloveShape, e.colors],
      shapeAndColor(e.hand)
    ],
  } as Entity,
  SimpleLayout = {
    bitPos: [[0, 0]] as XY[],
    size: [10, 10] as XY,
    pickable: true,
    makeBits: (e: Entity) => e && [[e.shape, e.colors]]
  } as Entity;

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
    if (nextAction)
      e.animation = nextAction();
  }

  if (e.animation && e.animation() == false) {
    delete e.animation;
  }

  let c = e.canvas, t = Date.now();

  let pos = parentPos ? sum(e.pos, parentPos) : e.pos;

  c.style.left = `${pos[0] - ss(e)[0] / 2}px`
  c.style.top = `${pos[2] - ss(e)[1]}px`
  c.style.opacity = e.opacity as any;

  let transform = `translateZ(${pos[1]}px)` + (e.right ? lookRight : "") + /*`scale(${e.scale})` +*/ (e.transform ?? '');

  c.style.transform = transform;
  return c;
}


export function createCanvas(s: Entity) {
  let [c] = cc(1);
  c.style.position = "absolute";
  c.id = "s" + s.id;
  s.canvas = c;
  updateCanvas(s)
  return c;
}

const LegShape = 0x20, GloveShape = 0x30;

export function shapeAndColor(e?: Entity) {
  return e && [e.shape, e.colors] as [number, string];
}


export function updateCanvas(e: Entity) {
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
      let rclr = recolor(outl[b[0]], b[1]);

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
  let e = { canvas: createCanvas(s), floor: 0, scale: 1, actionsQueue: [], ...s as any } as Entity;
  updateCanvas(e);
  if (e.pos) {
    entities.push(e)
    Scene.appendChild(e.canvas)
    updateEntity(e);
  }
  return e
}


export function removeEntity(e: Entity) {
  entities.splice(entities.indexOf(e), 1);
  e.canvas.parentElement?.removeChild(e.canvas);
}

export function takeEntity(e: Entity) {
  current.hand = e;
  updateCanvas(current);
  removeEntity(e);
}

export function dropEntity(e: Entity, pos?: XYZ) {
  if (e.hand) {
    pos ??= e.pos;
    e.hand.pickable = true;
    createEntity({ ...e.hand, pos });
    delete e.hand;
    updateCanvas(e);
    phantom.canvas.style.opacity = '0';
  }
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
  return [[e.shape, e.colors], [0x20, e.colors], entityLook(e.body), [0x30, e.colors], entityLook(e.hand)]
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