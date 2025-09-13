import { aspectsToString, aspectsSum, inferLevel, aspectsMul, improve, levelTo, aspectsMulEach } from "./aspects";
import { nextSpriteId } from "./consts";
import { details, groundPos, infoShownFor, itemOrPerson, updateInfo } from "./controls";
import { Aspects, Items, Materials, Races, tips, TItem, TRace, TRaceOrItem, Types } from "./data";
import { addLog, applyHpEffect, CombatStats, cooldown, damageOrHeal, maxhp } from "./dream";
import { spriteCanvas, recolor, gcx, GloveShape, LegShape, outl, AspectSprites, positionDiv, ItemSprites, FaceSprites } from "./graphics";
import { entitiesById, current, SfxTemplate, totalAspects, selectPerson, ItemTemplate } from "./main";
import { redrawRooms, roomAt, roomOf } from "./room";
import { unlockNextRoom } from "./state";
import { array, dist, fixed, mul, myAlert, randomElement, rng, rngRounded, sub, sum, weightedRandom, weightedRandomF, weightedRandomOKey } from "./util";

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

export enum KindOf {
  Person = 1,
  Item = 2,
  Scenery = 3,
  SFX = 4
}

export type Entity = SpriteLayout & {
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
  tip: string

  held?: Entity
  heldMore: boolean

  /** DO SAVE */

  chest: Entity
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
  sleeper: number

  /**Item type or person species */
  type: string
  use?: 'armor' | 'base'

  material: string

  /**ids of the recently explored entities */
  recent: number[]

  level: number

  combat: CombatStats
  log: string[]

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

export function combatActionAnimation(actor: Entity, defender: Entity, onAction = () => { }) {
  return [
    () => walkTo(actor, actor == defender ? sum(defender.combat.pos, [0, 0, -10]) : defender.combat.pos, { mode: ATTACK }),
    () => { damageOrHeal(actor, defender); onAction() },
    () => walkTo(actor, actor.combat.pos, { mode: ATTACK }),
    () => {
      actor.combat.delay = cooldown(actor);
      roomOf(actor).fight();
    },
  ]
}

export function effectOverTime(e: Entity) {
  return aspect(e, 'B') - e.combat.poison
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

  delete e.aspects?.undefined;

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

  d.style.display = !e.dream && roomOf(e).dream && e.kind != KindOf.Person && !e.parent ? "none" : "block";

  let t =
    (e.right ? lookRight : "") +
    (e.transform ?? '') +
    //(e.hrz && e.div.parentNode == Scene ? 'rotateX(89deg)translateZ(-8px)':'') + 
    (e.combat?.hp == 0 ? "rotateZ(90deg)translateX(8px)" : '');

  //if (e.combat?.hp == 0)    debugger

  positionDiv(d, p, t)

  if (e.type == "Door")
    setTitle(e, `<div class='roomn'>Room ${roomOf(e).id}</div>`)

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
  if (e.kind == KindOf.Person || e.type == "Door") {
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


export function setMaterial(e: Entity, m: string) {
  e.material = m;
  e.colors = Materials[e.material]?.colors;
}

export function createEntity(s: Entity & { levelTo?: number }) {
  s.id ??= nextSpriteId();
  let e = {
    canvas: createDiv(s), floor: 0, actionsQueue: [],
    ...s as any
  } as Entity;
  let proto: TItem = Types[e.type] as any;

  if (proto) {
    e.type ??= proto.type;
    if (proto.placeh) {
      e.mountPoint ??= [5, 0, 9 - proto.placeh * 8];
      //console.log(proto.placeh, e.mountPoint);
    }
    e.shape ??= [0, FaceSprites, ItemSprites, 0, 0][e.kind] + proto.ind;
    e.scale ??= proto.scale;
    e.use ??= proto.use;
    e.material ??= rng(2) || !proto.material ? randomMaterial() : proto.material;
  }

  e.colors = e.colors || Materials[e.material]?.colors;

  e.scale ??= 1;
  e.log = []

  updateCanvas(e);

  if (e.pos) {
    if (s.className)
      e.div.classList.add(s.className)
    registerEntity(e)
  }

  if (!e.aspects)
    for (let meat of [Materials[e.material], Races[e.type], Items[e.type]]) {
      e.aspects = aspectsSum(e.aspects, meat?.aspects)
    }

  if (s.levelTo) {
    e.aspects = levelTo(e.aspects, s.levelTo)
  }

  e.level ??= inferLevel(e.aspects);

  //console.log(e.aspects);


  return e
}

export function registerEntity(e: Entity) {
  if (!entitiesById[e.id]) {
    entitiesById[e.id] = e;
    Scene.appendChild(e.div)
    updateAll(e);
  }
}


export function removeEntity(e: Entity) {
  e.div.parentElement?.removeChild(e.div);
  delete entitiesById[e.id];
}

export function holdEntity(parent: Entity, item: Entity, mountPoint?: XYZ) {

  if (item.kind != KindOf.Item)
    return;
  if (item.parent)
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


export function showEmote(e: Entity, aspect: string, dir = '') {
  if (!aspect)
    return;
  //if (e.kind != KindOf.Person)    debugger
  //console.log("thought" + dir);
  let a = Aspects[aspect];
  return createEntity({
    ...SfxTemplate,
    shape: AspectSprites + a.ind,
    colors: a.colors,
    pos: sum(e.pos, [0, 0, -20]),
    className: "thought" + dir,
    deadAt: Date.now() + 3000
  })

}

export function entityLevel(e: Entity) {
  return e.level ?? inferLevel(e.aspects)
}

export function title(e: Entity) {
  if (e.kind == KindOf.Person) {
    return `${e.name} the ${(e.type || 'X')}`
  } else {
    return `${(e.material || '')} ${e.type}`
  }
}

export function info(e?: Entity) {
  if (e == "l" as any)
    e = infoShownFor;
  if (!e || e.kind == KindOf.SFX)
    return;
  let t = '';
  t += `<h1>${title(e)}</h1>`
  t += `<h4>Level ${fixed(entityLevel(e))}</h4>`;

  if (details)
    t += `<p>${(e.tip || "")} ${tips[e.type] ?? tips[e.use as any] ?? ''} <i>${!tips[e.type] ? tips[e.kind] ?? '' : ''}</i></p>`;

  if (e.type == "Door") {
    let s = "";
    if (e.material == "Obsidian")
      s = `This door lets one person escape (use RMB). But they need to have level >= ${roomOf(e).id}. Doing it also unlocks new room. You first character can only use the door in room 0.`
    t += `<p>${s}</p>`
  }

  if (e.aspects) {
    t += `Aspects. `;
    if (e.kind == KindOf.Person) {
      t +=
        `<i>This person's memories, personality and knowledge. Affects their performance while dreaming. 
Value after "/" is with equipment bonuses/penalties.</i>`
    }
    if (e.kind == KindOf.Item) {
      t += `<i>Characters automatically improve their aspects by looking at this item. 
The chance of learning something scales with the person's level and item's level.
The chance goes down, if many people have high value in this aspect.</i>`
    }
    t += `${aspectsToString(e.aspects, e)}`
  }

  let room = roomOf(e);
  if (room.dream) {
    t += `<div class=grid3>` +
      room.chars().map(c => `<div>${fixed(c.level)}</div><div>${unitLink(c)}</div><div>${hpText(c)} ${c.combat.poison ? c.combat.poison + " poison" : ''}</div>`).join('')
      + '</div>'
      ;
  }

  if (e.log?.length)
    t += "<hr/>" + e.log.join('');


  return t
}

export function unitLink(c: Entity) {
  return `<u style='color:${c.dream ? '#f88' : '#8f8'}' onclick="selp(${c.id})">${title(c)}</u>`
}

window.selp = (id) => selectPerson(entitiesById[id])

export function findNextThingToExplore(char: Entity) {
  let es = roomOf(char).entities().filter(e => e.use != 'base');
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

export function finalAspects(e: Entity) {
  return Object.fromEntries(Object.keys(Aspects).map(k => [k, aspect(e, k)]).filter(v => v[1]))
}

export function examine(pupil: Entity, target: Entity, multiplier?: number) {

  let fa = finalAspects(target);
  let name = weightedRandomOKey(fa);
  multiplier ??= recencyMultiplier(pupil, target);
  let learnedAmount = aspect(target, name) * multiplier * .01;
  learnedAmount = rngRounded(learnedAmount);
  if (!learnedAmount)
    return;
  if (target.type == "Tome") {
    learnedAmount *= (1 + aspect(pupil, "K") * .1)
  }
  improve(pupil.aspects, name, learnedAmount);
  if (pupil.recent) {
    pupil.recent.unshift(target.id);
    pupil.recent.length = 20;
  }
  if (pupil == infoShownFor)
    updateInfo(pupil)
  showEmote(target, name, 'd');
  addLog(pupil, `Learned ${fixed(learnedAmount)} of ${Aspects[name].name} from ${title(target)} `)
  addLog(target, `Taught ${fixed(learnedAmount)} of ${Aspects[name].name} to ${title(pupil)} `)

  if (target.type == "Clock" && target.parent?.type == "Bed") {
    let sleeper = roomOf(pupil).chars().find(e => e.sleeper) || pupil;
    if (sleeper.sleeper == 0 || sleeper.sleeper > 60)
      roomOf(pupil).sleep(sleeper, target.parent);
  }
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

  if (char.held?.type == "Tome") {
    let tome = char.held;
    examine(tome, char,
      (tome.level + aspect(char, "K") - inferLevel(tome.aspects)) * 0.05
    );
    return
  }

  let target = findNextThingToExplore(char)
  if (!target)
    return;

  setActions(char, [...walkAnimation(char, parentPos(target), 10),
  () => examine(char, target), () => waitAnimation(1000)]);
}

export function idle(char: Entity) {
  return !char.actionsQueue?.length && !char.animation
}

export function decayAspectsMaybe(char: Entity) {
  let il = inferLevel(char.aspects);
  let aspect = weightedRandomOKey(totalAspects);
  let probability = (chars().length + 3) * inferLevel(char.aspects) / (char.level + 3);
  if (probability > rng(100)) {
    let loss = 0.01 * ~~(il - char.level + 1)
    char.aspects[aspect] = Math.max(0, char.aspects[aspect] - loss);
    addLog(char, `forgot ${fixed(loss)} of ${Aspects[aspect].name} `)
    showEmote(char, aspect);
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
  let v = e.aspects[letter] || 0;

  if (e.parent && e.parent.use == 'base') {
    v = Math.min(v * 2, v + (e.parent.aspects[letter] || 0))
  }

  if (e.kind == KindOf.Person) {
    if (!e.held)
      v *= 1.3

    v += (e.held?.aspects[letter] || 0) * .5;

    v += (e.chest?.aspects[letter] || 0) * .5;
  }

  return v ?? 0;
}

export function setTitle(e: Entity, text: string) {
  if (e.title)
    e.title.innerHTML = text
}

export function hpText(e: Entity) {
  return e.combat?.hp >= 0 ? `${fixed(e.combat?.hp)}/${maxhp(e)} hp` : ''
}

export function writeHP(e: Entity) {
  setTitle(e, hpText(e));
}

export function randomRace() {
  return weightedRandomOKey(Races, a => a.chance)
}

export function randomMaterial() {
  return weightedRandomOKey(Materials, a => a.chance)
}


export function useItem(user: Entity, item: Entity) {
  let held = user.held;
  if (held?.type == "Shrinker") {
    item.scale *= .9;
    updateAll(item);
    return
  }
  if (held?.type == "Magnifier") {
    item.scale /= .9;
    updateAll(item);
    return
  }
  if (held?.type == "Hammer" && item.kind == KindOf.Item) {
    examine(user, item, 10)
    removeEntity(item);
    return
  }
  if (held?.type == "Essense") {
    item.aspects = aspectsSum(item.aspects, held.aspects)
    item.level = inferLevel(item.aspects);
    dropHeldEntity(user);
    removeEntity(held);
    updateAll(user);
    return
  }

  if (held?.type == "Extractor") {
    let a = weightedRandomOKey(aspectsMulEach(user.aspects, held.aspects));
    let v = Math.min(aspect(user, a) + held.aspects[a], item.aspects[a])
    if (v > 0) {
      createEntity({ ...ItemTemplate, type: "Essense", material: item.material, aspects: { [a]: v }, pos: item.pos });
      removeEntity(item)
    } else {
      addLog(user, "Extract fail.")
      createEntity({
        ...SfxTemplate,
        shape: 0x3a,
        colors: '32',
        pos: sum(user.pos, [0, 0, -20]),
        className: "thought",
        deadAt: Date.now() + 3000
      })
      if (!rng(10))
        removeEntity(item)
    }
  }
  if (item.use == 'armor') {

    user.chest.pos = item.pos;
    registerEntity(user.chest)

    if (item.parent)
      holdEntity(item.parent, user.chest);

    removeEntity(item)
    updateAll(user.chest);

    user.chest = item;
    updateAll(user);
    return
  }
  if (held?.type == "Brush") {
    item.colors = held.colors;
    updateAll(item)
    return
  }

  if (item.type == "Bed") {
    roomOf(user).sleep(user, item);
    return
  }

  if (item.type == "Door") {
    let ln = item.level;
    if (item.material == "Obsidian") {
      if (user.level < ln) {
        myAlert(`Need level ${ln} to use`);
        return;
      }
      if (user.name == "Мiu") {
        if(ln==0)
          myAlert(`You win. Pretend there is an epic ending sequence here.`)
        else
          myAlert(`You can't use this door. Maybe you can find someone else who can?`)
        return
      }
      setMaterial(item, "Wooden");
      updateAll(item);
      removeEntity(user);
      selectPerson(chars()[0])
      unlockNextRoom();
      redrawRooms();
      myAlert(
        `Walking through this door, they have left these rooms for good. 
Also, new room has opened.`)
    }
    return
  }
}


export function chars() {
  return entities(false).filter(e => e.kind == KindOf.Person)
}

export function entities(dream?: boolean) {
  return Object.values(entitiesById).filter(e => dream === undefined || !e.dream == !dream)
}

export function flyingTextPos(e: Entity) {
  return sum(e.pos, [-5 + rng(10), 0, -35]) as XYZ;
}