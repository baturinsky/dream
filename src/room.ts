import { TAspects } from "./aspects";
import { roomWidth, roomHeight, roomDepth, cols, rows, roomsNum } from "./consts";
import { maxhp, cooldown, allies, unharmed } from "./dream";
import {
  aspect, combatActionAnimation, createEntity, Entity, KindOf, parentPos,
  randomRace, removeEntity, setActions, setTitle, sfx, updateAll, writeHP, XYZ
} from "./entity";
import { createPattern, solid, fillWithPattern, element, setCanvasSize, gcx, BodySprites, posToStyle } from "./graphics";
import { floors } from "./init";
import { current, entities, PersonTemplate, rooms, SceneryTemplate, selectPerson } from "./main";
import { array, delay, japaneseName, rng, sum, weightedRandom, weightedRandomF } from "./util";

declare var Scene: HTMLDivElement, Back: HTMLCanvasElement, Front: HTMLCanvasElement,
  img: HTMLImageElement, div1: HTMLDivElement, DEFS: Element;;

const w = roomWidth * 2, h = roomHeight * 2, d = roomDepth * 2 - 1;

export class Room {
  col: number
  row: number
  l: number
  t: number
  dream: boolean;
  aspects: TAspects;
  level: number;
  pos: XYZ

  constructor(public id: number) {
    this.col = id % cols;
    this.row = ~~(id / cols);
    this.l = roomWidth * this.col * 2;
    this.t = roomHeight * this.row * 2,
      this.pos = [(id % cols) * roomWidth, 0, roomHeight * ~~(id / cols + 1)] as XYZ;
  }

  md() {
    createEntity({
      ...SceneryTemplate,
      shape: 0x50,
      colors: "ef",
      type: "Door",
      level: this.id,
      scale: 2,
      pos: this.doorPos()
    })
  }

  draw() {
    let backPattern = createPattern(solid("2f", rng(3) + 1));
    fillWithPattern(Back, backPattern, [this.l, this.t, w, h])
    fillWithPattern(floors[this.row], createPattern(solid("rq", rng(3) + 1)), [this.l, 0, w, d])
  }

  addCarpet() {
    let c = element(`ca${this.id}`, 'carpet', { top: `${++this.row * roomHeight}px`, left: `${this.col * roomWidth}px` }, "canvas")
    setCanvasSize(c, roomWidth, roomDepth, 2);
    return c
  }

  addWallpaper() {
    let c = element(`wp${this.id}`, 'wp', { top: `${this.row * roomHeight} px`, left: `${this.col * roomWidth} px` }, "canvas")
    setCanvasSize(c, roomWidth, roomHeight, 2);
    return c
  }

  toggleDream(_dream: boolean) {
    this.dream = _dream;

    for (let e of this.entries()) {
      setActions(e, [])
      e.combat = {} as any;
      setTitle(e, "")
      /**All dream items removed on wake*/
      if (e.dream && !this.dream) {
        removeEntity(e)
      }

      /**All nondream non-person items hidden on dream, revealed at day*/
      if (!e.dream && e.kind != KindOf.Person) {
        e.div.style.display = this.dream ? "none" : "block";
      }
    }
  }

  entries() {
    return Object.values(entities).filter(e => roomAt(parentPos(e)) == this)
  }

  doorPos() {
    return sum(this.pos, [roomWidth / 2, 1, 0]) as XYZ;
  }

  chars(dream: boolean | undefined = undefined) {
    return this.entries().filter(e => e.kind == KindOf.Person && (dream === undefined || !e.dream == !dream));
  }

  async wake() {
    this.blind();
    await delay(400);
    this.toggleDream(false);
  }

  async sleep(dreamer: Entity) {
    this.blind()
    await delay(400);
    this.toggleDream(true);
    this.aspects = dreamer.aspects;
    this.level = dreamer.level;
    this.addEnemies();
    this.initCombatantStats()
    this.continueCombat();
  }

  endCombat() {
    this.wake()
  }

  addEnemies() {
    for (let i = 0; i < 1; i++) {
      createEntity(
        {
          ...PersonTemplate,
          level: 1,
          colors: "nm",
          type: randomRace(),
          name: japaneseName(),
          chest: sfx(BodySprites + 2, "lk"),
          pos: this.doorPos(),
          dream: true
        });
    }
  }

  initCombatantStats() {
    for (let dream of [true, false]) {
      let cs = this.chars(dream);
      let pos: XYZ = sum(this.pos, [(dream ? 0.3 : 0.7) * roomWidth, 0, 0]);
      cs.forEach((e, i) => {
        e.pos = sum(pos, [0, (i + .5) * roomDepth / cs.length, 0]);
        e.right = dream;
        //console.log("ep", e.pos, roomAt(e.pos).id);
        e.combat = { pos: e.pos, hp: maxhp(e), delay: cooldown(e), aggro: 0 };
        writeHP(e);
        updateAll(e);
      })
    }
  }

  /**Returns false if combat is over */
  continueCombat() {
    if (!this.dream)
      return;
    let living = this.chars().filter(e => e.combat.hp > 0);
    let minDelay = Math.min(...living.map(c => c.combat.delay));
    let attacker = living.find(c => c.combat.delay == minDelay) as Entity;
    if (!attacker)
      return this.endCombat();

    let isHealing = weightedRandom([aspect(attacker, 'S'), aspect(attacker, 'M')]) == 1;

    let target: Entity | undefined;

    if (isHealing) {
      target = weightedRandomF(living, t => allies(attacker, t) ? maxhp(t) / t.combat.hp : 0)
    }

    if (!target || unharmed(target)) {
      isHealing == false;
      target = weightedRandomF(living, t => allies(attacker, t) ? 0 :
        (.1 * t.level +
          Math.max(0, aspect(t, 'C') - aspect(t, 'D') - aspect(attacker, 'L'))
          + aspect(attacker, 'A') * t.combat.aggro
        )
      );

    }

    if (!target)
      return this.endCombat();

    setActions(attacker, combatActionAnimation(attacker, target, () => living.forEach(c => c.combat.delay -= minDelay)));
  }

  blind() {
    let b = element('', 'blind', posToStyle(sum(this.pos, [0, roomDepth, -roomHeight])))
    setCanvasSize(b, roomWidth, roomHeight, 8);
    fillWithPattern(b, createPattern(solid("on", 11)));
    setTimeout(() => Scene.removeChild(b), 1900);
  }

}

export function updateFront() {
  let cb = gcx(Front);
  cb.fillStyle = createPattern(solid("2g", 1))
  for (let i = 0; i < cols; i++) cb.fillRect(i * roomWidth * 2 - 10, 0, 20, 1e4);
  for (let i = 0; i < rows; i++) cb.fillRect(0, i * roomHeight * 2 - 10, 1e4, 20)
}

export function roomAt(pos: XYZ) {
  return rooms[~~(pos[0] / roomWidth) + cols * ~~(pos[2] / roomHeight - 1)]
}

export function roomOf(e: Entity) {
  return roomAt(parentPos(e));
}

