import { aspectsMul, aspectsSum, inferLevel, levelTo, TAspects } from "./aspects";
import { roomWidth, roomHeight, roomDepth, cols, rows, roomsNum } from "./consts";
import { ArmorsStartAt, Aspects, Items, Materials } from "./data";
import { maxhp, cooldown, allies, unharmed, lootSuccess } from "./dream";
import {
  aspect, combatActionAnimation, createEntity, Entity, KindOf, parentPos,
  randomRace, removeEntity, setActions, setTitle, sfx, updateAll, writeHP, XYZ,
  walkAnimation,
  updateEntity,
  entities
} from "./entity";
import { createPattern, solid, fillWithPattern, element, setCanvasSize, gcx, BodySprites, posToStyle, d, h, w, scaleCanvas, transp, drawScaled, outl, TreeSprites } from "./graphics";
import { curtains, floors } from "./init";
import { current, entitiesById, ItemTemplate, PersonTemplate, rooms, SceneryTemplate, selectPerson } from "./main";
import { openRoom } from "./state";
import { array, delay, japaneseName, randomElement, RNG, rng, sum, weightedRandom, weightedRandomF, weightedRandomOKey } from "./util";

declare var Scene: HTMLDivElement, Back: HTMLCanvasElement, Front: HTMLCanvasElement,
  img: HTMLImageElement, div1: HTMLDivElement, DEFS: Element;


export class Room {
  col: number
  row: number
  l: number
  t: number
  dream: boolean;
  /**Current dream aspects */
  aspects: TAspects;
  /**Current dream clevel */
  level: number;
  pos: XYZ
  stage: number = 0
  drst = 0
  dur = 0

  constructor(public id: number) {
    this.col = id % cols;
    this.row = ~~(id / cols);
    this.l = roomWidth * this.col * 2;
    this.t = roomHeight * this.row * 2,
      this.pos = [(id % cols) * roomWidth, 0, roomHeight * ~~(id / cols + 1)] as XYZ;
  }

  /**make door */
  md() {
    createEntity({
      ...SceneryTemplate,
      shape: 0x50,
      material: "Obsidian",
      type: "Door",
      level: this.id,
      scale: 2,
      pos: this.doorPos()
    })
  }

  /**
   * Room types
   * 1 - grass+tree1
   * 2 - grass+tree2
   * 3 - grass+tree3
   * 4 - grass+huts
   * 5 - wastes+dead trees
   * 6 - desert+cactus
   * 7 - stone+rocks
   * 8 - stone+walls
   * 
   */

  drawTrees(rt) {
    let topTypes = [null,
      ['a9', 1],
      ['ba', 2],
      ['a9', 3],
      ['57', 16],
      0,
      ['a9', 7, 1], //cactus
      ['mn', 9],
      ['mn', 8, 1],
    ]

    let trunkTypes = [0, 4, 4, 4, 0, 4]

    let bc = gcx(Back);
    for (let i = 60; i > 4; i--) {
      let th = 2 * i ** .7, x = rng(w * .9) + .1;
      bc.save()
      bc.translate(x, h - th - 70);
      let scale = 30 / (3 + th * .6);
      bc.scale(scale, scale)
      if (trunkTypes[rt])
        drawScaled(Back, outl('57', TreeSprites + trunkTypes[rt]), 5, 6);
      if (topTypes[rt])
        drawScaled(Back, outl(topTypes[rt][0], TreeSprites + topTypes[rt][1]), 0, -8, topTypes[rt][2] ?? 2);
      bc.restore()
    }
  }

  draw() {
    let f = floors[this.row];

    let bc = gcx(Back);

    RNG(this.id * 99 + (this.dream ? (this.stage + this.drst % 1000) : 0));

    bc.save()
    bc.translate(this.l, this.t);
    let fc = gcx(f);
    fc.save()
    fc.translate(this.l, 0);


    if (this.dream) {
      if (this.stage % 2) {
        let bgm1 = randomElement(Object.values(Materials)).colors;
        let bgm2 = randomElement(Object.values(Materials)).colors;

        let backPattern = createPattern(solid(bgm1, rng(5) + 1));
        fillWithPattern(Back, backPattern, [0, 0, w, h])
        fillWithPattern(f, createPattern(solid(bgm2, rng(3) + 1)), [0, 0, w, d])

      } else {

        let rt = rng(8) + 1;

        let ground = [0,
          ['ba', 9], ['ba', 9], ['ba', 9], ['ba', 9], ['ij', 9], ['ij', 13],
          ['mn', 14], ['mn', 14]
        ][rt];

        let grass = createPattern(solid(ground[0], ground[1]))

        let stops = [["#00f", "#f80"], ["#88f", "#00f"], ["#008", "#00f"]][rng(3)]
        const gradient = bc.createLinearGradient(0, 0, 0, 100);
        stops.forEach((v, i) => gradient.addColorStop(i, v))
        bc.fillStyle = gradient;
        bc.fillRect(0, 0, w, h)

        bc.fillStyle = grass;
        bc.fillRect(0, 0 + h * .6, w, h * .4 + 3);

        this.drawTrees(rt);

        fillWithPattern(f, grass, [0, 0, w, d])
        let road = scaleCanvas(transp("45", 11), 16);
        fillWithPattern(f, createPattern(road), [0, 0, w, d], .5)
      }
      
    } else {

      fillWithPattern(Back, createPattern(solid("2f", rng(3) + 1)), [0, 0, w, h])
      fillWithPattern(f, createPattern(solid("rq", rng(3) + 1)), [0, 0, w, d])
    }

    fc.restore()
    bc.restore()

    //* Front */

    let fp = createPattern(solid("2g", 1))
    let cu = curtains[this.id];

    gcx(cu).clearRect(0, 0, w, h)

    //cu.style.pointerEvents = this.open && !this.dream ? "none" : "all";

    if (!this.open) {
      fillWithPattern(cu, fp, [0, 0, w, h])
    } else {
      fillWithPattern(cu, fp, [0, 0, 10, h])
      fillWithPattern(cu, fp, [0, h - 10, w, 10])
    }

    /*if(this.dream){
      gcx(cu).globalAlpha = 0.6
      fillWithPattern(cu, createPattern(solid("2g", 12)), [10, 0, w-10, h-10])
      gcx(cu).globalAlpha = 1
    }*/

  }

  get open() {
    return this.id ? this.id * 1 <= openRoom : openRoom >= 13
  }


  /**toggleDream */
  tdr(dream: boolean) {
    this.dream = dream;
    this.draw();

    for (let e of this.entities()) {
      e.log = []
      setActions(e, [])
      setTitle(e, "")
      /**All dream items removed on wake, combat data cleared*/
      if (!dream) {
        e.combat = {} as any;
        if (e.dream)
          removeEntity(e)
      }

      updateEntity(e);
      writeHP(e);
    }
  }

  entities(dream?: boolean) {
    return entities(dream).filter(e => roomAt(parentPos(e)) == this)
  }

  chars(dream?: boolean) {
    return this.entities(dream).filter(e => e.kind == KindOf.Person) as Entity[];
  }

  doorPos() {
    return sum(this.pos, [roomWidth / 2, 1, 0]) as XYZ;
  }


  async wake() {
    this.blind();
    await delay(400);
    this.tdr(false);
    this.stage = 0;
    window.save(0)
  }


  async sleep(dreamer: Entity, bed: Entity) {
    this.chars().forEach(c => c.sleeper = false);
    dreamer.sleeper = true;
    this.blind()
    await delay(400);
    this.dur = 0;
    this.drst = Date.now();
    this.tdr(true);
    let aspects = aspectsSum(dreamer.aspects, bed.aspects);
    let il = inferLevel(aspects);
    aspects = aspectsSum(aspectsMul(aspects, .9 / il), { [Object.keys(Aspects)[this.id]]: .9 })
    let level = (il + this.id) / 2;
    aspects = levelTo(aspects, level);
    this.level = level;
    this.next();
  }

  /**next Encounter */
  next() {

    /** new enemy */
    for (let i = 0; i < ~~(this.stage / 3) + 1; i++) {
      createEntity(
        {
          ...PersonTemplate,
          levelTo: this.level,
          type: randomRace(),
          name: japaneseName(),
          chest: createEntity(
            { ...ItemTemplate, levelTo: this.level, type: randomElement(Object.keys(Items).filter(it => Items[it].use == 'armor')) }),
          pos: this.doorPos(),
          dream: true
        });
    }


    for (let dream of [true, false]) {
      let cs = this.chars(dream);
      let pos: XYZ = sum(this.pos, [(dream ? 0.3 : 0.7) * roomWidth, 0, 0]);
      cs.forEach((e, i) => {
        e.pos = sum(pos, [0, ((i + .5) / cs.length * .7 + .3) * roomDepth, 0]);
        e.right = dream;
        e.combat = { pos: e.pos, hp: maxhp(e), delay: cooldown(e), aggro: 0, poison: 0 };
        writeHP(e);
        updateAll(e);
      })
    }

    if (this.stage % 2) {
      this.addItems(10, .2);
    }

    this.fight();
  }

  win() {
    this.stage++;
    this.entities(true).forEach(e => {
      if (e.kind == KindOf.Item && lootSuccess()) {
        e.dream = false;
        updateEntity(e);
      } else {
        removeEntity(e);
      }
    })
    this.chars(true).forEach(e => removeEntity(e));
    this.chars().forEach(e => {
      if (e.combat.hp > 0)
        setActions(e, walkAnimation(e, sum(e.combat.pos, [-100, 0, 0])))
    })
    this.blind();
    this.chars()[0].actionsQueue.push(() => this.next())
  }

  living() {
    return this.chars().filter(e => e.combat.hp > 0)
  }

  /**Do the next combat action*/
  fight() {
    if (!this.dream)
      return;
    let living = this.living();

    let livingEnemies = living.filter(e => e.dream).length;
    if (livingEnemies == 0) {
      return this.win()
    } else if (livingEnemies == living.length) {
      return this.wake()
    }

    let minDelay = Math.min(...living.map(c => c.combat.delay));
    let attacker = living.find(c => c.combat.delay == minDelay) as Entity;

    //if (!attacker)      return this.endCombat();

    let isHealing = weightedRandom([aspect(attacker, 'S') + attacker.level * .1, aspect(attacker, 'M') / 2]) == 1;

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

    //if (!target)     return this.endCombat();

    setActions(attacker, combatActionAnimation(attacker, target, () => living.forEach(c => c.combat.delay -= minDelay)));
  }

  blind() {
    let s = posToStyle(sum(this.pos, [0, roomDepth, -roomHeight]))
    let b = element('', 'blind', s)
    setCanvasSize(b, roomWidth, roomHeight, 8);
    fillWithPattern(b, createPattern(solid("on", 11)));
    setTimeout(() => this.draw(), 800);

    setTimeout(() => Scene.removeChild(b), 3900);
  }

  addItems(n: number, w: number = 1) {
    for (let i = 0; i < n; i++) {
      let type = weightedRandomOKey(Items, it => it.chance);

      let e = createEntity({
        ...ItemTemplate,
        type,
        levelTo: (this.level + this.stage) || 10,
        pos: [
          this.col * roomWidth + 10 + rng(roomWidth - 20),
          rng(roomDepth - 5) * w + 5,
          (this.row + 1) * roomHeight]
      })
      e.level = inferLevel(e.aspects);
      e.dream = this.dream;
      updateEntity(e);
    }
  }
}

export function redrawRooms() {
  rooms.forEach(r => r.draw())
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
  return roomAt(parentPos(e)) || rooms[0];
}

