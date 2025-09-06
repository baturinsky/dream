import { aspectsToString, aspectsSum, inferLevel, aspectsMul, improve } from "./aspects";
import { nextSpriteId } from "./consts";
import { groundPos, infoShownFor, itemOrPerson, updateInfo } from "./controls";
import { Aspects, Items, Materials, Races, TItem, TRace, TRaceOrItem, Types } from "./data";
import { CombatStats, cooldown, dealDamage as doCombatAction, maxhp } from "./dream";
import { spriteCanvas, recolor, gcx, GloveShape, LegShape, outl, AspectSprites, positionDiv } from "./graphics";
import { entities, current, SfxTemplate } from "./main";
import { roomAt, roomOf } from "./room";
import { dist, mul, randomElement, rng, rngRounded, sub, sum, weightedRandom, weightedRandomF, weightedRandomOKey } from "./util";

declare var Scene: HTMLDivElement, img: HTMLImageElement, div1: HTMLDivElement, DEFS: Element;

export type XY = [number, number];
export type XYZ = [number, number, number];
export let X = 0, Y = 1, Z = 2;
export const lookRight = "scaleX(-1) translateX(-100%)";

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
  title: HTMLDivElement;
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

  held?: Entity
  heldMore: boolean

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

  /**Dream items -  */
  dream: boolean

  /**Item type or person species */
  type: string

  material: string

  /**ids of the recently explored entities */
  recent: number[]

  level: number

  combat: CombatStats

  hrz: boolean

}



export type Action = {
  start: (e: Entity) => boolean
  update: (e: Entity) => boolean
}

const WALK = 1, ATTACK = 2, RECOIL = 3;

export function walkTo(e: Entity, to: XYZ, options?: { stopDistance?: number, mode?: 1 | 2 | 3 }) {
  let from = e.pos, start = Date.now();
  let { stopDistance, mode } = options || {};
  mode ??= WALK
  let speed = mode == ATTACK ? .3 : .1;
  let duration = dist(e.pos, to) / speed;
  let dx = to[0] - e.pos[0];
  if (dx != 0 && mode == WALK) {
    e.right = dx > 0;
  }
  let posDelta = sub(to, from);
  return () => {
    let t = Date.now();
    let timeFromStart = Math.min(t - start, duration);
    e.pos = sum(from, posDelta, duration ? timeFromStart / duration : 1) as XYZ;
    let finished = timeFromStart >= duration || dist(e.pos, to) < (stopDistance ?? 0);
    e.transform = finished ? `` :
      `rotateZ(${mode == ATTACK ? -10 :
        mode == RECOIL ? 10 :
          Math.sin(t / 1e2) * 5
      }deg)`;
    return !finished;
  }
}

export function facingX(e: Entity) {
  return e.right ? 1 : -1;
}

export function walkAnimation(e: Entity, to: XYZ, stopDistance = 0) {
  let fromRoom = roomOf(e), toRoom = roomAt(to);
  if (toRoom == undefined)
    debugger

  if (toRoom == fromRoom)
    return [() => walkTo(e, to, { stopDistance })]
  else {
    let a = [
      () => walkTo(e, fromRoom.doorPos()),
      () => e.pos = sum(toRoom.doorPos(), [5, 0, 0]),
      () => walkTo(e, to, { stopDistance })
    ]
    return a
  }
}

export function waitAnimation(duration: number) {
  let start = Date.now();
  return () => {
    return Date.now() < start + duration;
  }
}

export function recoilAnimation(defender: Entity) {
  return [() => walkTo(defender, sum(defender.combat.pos, [facingX(defender) * -20, 0, 0]), { mode: RECOIL }),
  () => defender.combat.hp ? walkTo(defender, defender.combat.pos, { mode: RECOIL }) : null,
  ]
}

export function combatActionAnimation(attacker: Entity, defender: Entity, onAction = () => { }) {
  return [
    () => walkTo(attacker, defender.combat.pos, { mode: ATTACK }),
    () => { doCombatAction(attacker, defender); onAction() },
    () => walkTo(attacker, attacker.combat.pos, { mode: ATTACK }),
    () => { attacker.combat.delay = cooldown(attacker); roomOf(attacker).continueCombat() },
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


  d.style.opacity = e.opacity as any;
  d.classList.toggle('current', e == current)
  d.classList.add("k" + e.kind)
  d.classList.toggle("right", !!e.right)

  let t =
    (e.right ? lookRight : "") +
    (e.transform ?? '') +
    //(e.hrz && e.div.parentNode == Scene ? 'rotateX(89deg)translateZ(-8px)':'') + 
    (e.combat?.hp == 0 ? "rotateZ(90deg)translateX(8px)" : '');

  //if (e.combat?.hp == 0)    debugger

  positionDiv(d, p, t)

  //let transform = `translateZ(${pos[1]}px)` + (e.right ? lookRight : "") + (e.transform ?? '');
  /*d.style.left = `${p[0]}px`
  d.style.top = `${p[2]}px`
  d.style.transform = transform;*/
}


/**Coordinates of the top left corner compared to bottom center */
export function topLeftShift(e: Entity) {
  return [screenSize(e)[0] / 2, 0, screenSize(e)[1]] as XYZ;
}


export function createDiv(e: Entity) {
  let c = spriteCanvas(1);
  let div = document.createElement("div")
  div.classList.add("entity")
  div.appendChild(c);
  div.style.position = "absolute";
  c.id = "s" + e.id;
  e.canvas = c;
  e.div = div;
  if (e.kind == KindOf.Person) {
    e.title = document.createElement("div");
    e.title.classList.add("etitle");
    div.appendChild(e.title)
  }
  updateCanvas(e)
  return c;
}

export function shapeAndColor(e?: Entity) {
  return e && [e.shape, e.colors] as [number, string];
}


export function updateCanvas(e: Entity) {
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


export function createEntity(s: Entity) {
  //if(s.type == "Dog")    debugger
  s.id ??= nextSpriteId();
  let e = {
    canvas: createDiv(s), floor: 0, actionsQueue: [],
    ...s as any
  } as Entity;
  let proto: TItem = Types[e.type] as any;

  //if(e.kind == KindOf.SFX) debugger

  if (proto) {
    e.type ??= proto.name;
    if (proto.placeh) {
      e.mountPoint ??= [5, 0, 9 - proto.placeh * 8];
      //console.log(proto.placeh, e.mountPoint);
    }
    e.shape ??= [0, 0x10, 0x50, 0, 0][e.kind] + proto.ind;
    e.scale ??= proto.scale;
    e.material ??= rng(2) || !proto.material ? randomElement(Object.keys(Materials)) : proto.material;

    //e.hrz ??= proto.hrz;
    //console.log(s.type, e.material, proto.material);
  }

  e.colors = e.colors || Materials[e.material]?.colors;

  e.scale ??= 1;

  updateCanvas(e);

  if (e.pos) {
    entities[s.id] = e;
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


export function removeEntity(e: Entity) {
  e.div.parentElement?.removeChild(e.div);
  delete entities[e.id];
}

export function holdEntity(parent: Entity, item: Entity, mountPoint?: XYZ) {

  if (item.kind != KindOf.Item)
    return;
  if(item.parent)
    dropHeldEntity(item.parent)
  //item.div.parentNode?.removeChild(item.div);
  parent.div.appendChild(item.div);
  parent.held = item;
  item.parent = parent;
  item.pos = mountPoint ?? mul(parent.mountPoint, parent.scale);
  updateEntity(item);
}

export function dropHeldEntity(parent: Entity, pos?: XYZ) {
  let item = parent.held
  delete parent.held
  if (item) {
    item.pos = pos ?? parent.pos;
    //if (parent.right && parent == current) item.right = !item.right;
    Scene.appendChild(item.div);
    delete item.parent;
    updateAll(item);
    updateAll(parent);
  }
  return item
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

export function inDream(e: Entity) {
  let room = roomAt(parentPos(e))
  return room.dream
}


export function showEmote(e: Entity, aspect: string) {
  if (!aspect)
    return;
  //if (e.kind != KindOf.Person)    debugger
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
  let es = roomOf(char).entries()
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
  improve(char.aspects, aspect, learnedAmount);
  char.recent.unshift(target.id);
  char.recent.length = 20;
  if (char == infoShownFor)
    updateInfo(char)
  showEmote(target, aspect);
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

  setActions(char, [...walkAnimation(char, parentPos(target), 10), () => examine(char, target), () => waitAnimation(1000)]);
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

export function dreaming(e: Entity) {
  return roomOf(e).dream
}


export function setActions(e: Entity, a: Function[]) {
  if (!e)
    return;
  e.actionsQueue = a;
  delete e.animation;
}


export function aspect(e: Entity, letter: string) {
  return e.aspects[letter] ?? 0;
}

export function setTitle(e: Entity, text: string) {
  if (e.title)
    e.title.innerHTML = text
}

export function writeHP(e: Entity) {
  setTitle(e, e.combat?.hp >= 0 ? `${e.combat?.hp}/${maxhp(e)} hp` : '');
}

export function randomRace() {
  return weightedRandomOKey(Races, a => a.chance)
}

export function useItem(user: Entity, item: Entity) {
  let tool = user.held;
  if (tool?.type == "Brush") {
    item.colors = tool.colors;
    updateAll(item)
    return
  }

  if (item.type == "Bed") {
    roomOf(user).sleep(user);
  }
}
