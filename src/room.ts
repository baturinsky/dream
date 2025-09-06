import { TAspects } from "./aspects";
import { roomWidth, roomHeight, roomDepth, cols, rows, roomsNum } from "./consts";
import { maxhp, cooldown, allies, unharmed } from "./dream";
import {
  aspect, combatActionAnimation, createEntity, Entity, KindOf, parentPos,
  randomRace, removeEntity, setActions, setTitle, sfx, updateAll, writeHP, XYZ,
  walkAnimation
} from "./entity";
import { createPattern, solid, fillWithPattern, element, setCanvasSize, gcx, BodySprites, posToStyle, d, h, w, scaleCanvas, transp, drawScaled, outl, TreeSprites } from "./graphics";
import { curtains, floors } from "./init";
import { current, entities, PersonTemplate, rooms, SceneryTemplate, selectPerson } from "./main";
import { array, delay, japaneseName, RNG, rng, sum, weightedRandom, weightedRandomF } from "./util";

declare var Scene: HTMLDivElement, Back: HTMLCanvasElement, Front: HTMLCanvasElement,
  img: HTMLImageElement, div1: HTMLDivElement, DEFS: Element;

export class Room {
  col: number
  row: number
  l: number
  t: number
  open: boolean
  dream: boolean;
  /**Current dream aspects */
  aspects: TAspects;
  /**Current dream clevel */
  level: number;
  pos: XYZ
  stage: number = 0
  dreamStart: number = 0

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
      colors: "ef",
      type: "Door",
      level: this.id,
      scale: 2,
      pos: this.doorPos()
    })
  }



  draw() {
    RNG(this.id*99 + (this.dream?this.stage +  this.dreamStart:0));

    let f = floors[this.row];
    let grass = createPattern(solid("ba", 9))

    if (this.dream) {
      let bc = gcx(Back);
      bc.save()
      bc.translate(this.l, this.t);

      let trunk = outl('57', TreeSprites), top = outl('a9', TreeSprites + 2)
      bc.fillStyle = "#008";
      bc.fillRect(0, 0, w, h)

      bc.fillStyle = grass;
      bc.fillRect(0, 0 + h*.6, w, h*.4+3);

      for (let i = 60; i > 4; i--) {
        let th = 2 * i ** .7, x = rng(w);
        bc.save()
        bc.translate(x, h - th - 90);
        let scale = 60 / (3 + th * .6);
        bc.scale(scale, scale)
        drawScaled(Back, trunk, 0, 0);
        drawScaled(Back, top, 0, -3);
        bc.restore()
      }
      
      bc.restore()

      fillWithPattern(f, grass)
      let road = scaleCanvas(transp("45", 11), 16);
      fillWithPattern(f, createPattern(road), undefined, .5)
      
    } else {

      let backPattern = createPattern(solid("2f", rng(3) + 1));
      fillWithPattern(Back, backPattern, [this.l, this.t, w, h])

      fillWithPattern(f, createPattern(solid("rq", rng(3) + 1)))
    }

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

  removeEnemies() {
    this.chars(true).forEach(e => removeEntity(e));
  }

  toggleDream(dream: boolean) {
    this.dream = dream;
    this.draw();

    for (let e of this.entries()) {
      setActions(e, [])
      setTitle(e, "")
      /**All dream items removed on wake, combat data cleared*/
      if (!dream) {
        e.combat = {} as any;
        if (e.dream)
          removeEntity(e)
      }

      /**All nondream non-person items hidden on dream, revealed at day*/
      if (!e.dream && e.kind != KindOf.Person) {
        e.div.style.display = dream ? "none" : "block";
      }

      writeHP(e);
    }
  }

  entries(dream?: boolean) {
    return Object.values(entities).filter(e => roomAt(parentPos(e)) == this && (dream === undefined || !e.dream == !dream))
  }

  chars(dream?: boolean) {
    return this.entries(dream).filter(e => e.kind == KindOf.Person);
  }

  doorPos() {
    return sum(this.pos, [roomWidth / 2, 1, 0]) as XYZ;
  }


  async wake() {
    this.blind();
    await delay(400);
    this.toggleDream(false);
    this.stage = 0;
  }

  async sleep(dreamer: Entity) {
    this.blind()
    await delay(400);
    this.toggleDream(true);
    this.aspects = dreamer.aspects;
    this.level = dreamer.level;
    this.dreamStart = Date.now();
    this.nextEncounter();
  }

  nextEncounter() {
    for (let i = 0; i < this.stage+1; i++) {
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

    for (let dream of [true, false]) {
      let cs = this.chars(dream);
      let pos: XYZ = sum(this.pos, [(dream ? 0.3 : 0.7) * roomWidth, 0, 0]);
      cs.forEach((e, i) => {
        e.pos = sum(pos, [0, ((i + .5) / cs.length * .7 + .3) *  roomDepth, 0]);
        e.right = dream;
        //console.log("ep", e.pos, roomAt(e.pos).id);
        e.combat = { pos: e.pos, hp: maxhp(e), delay: cooldown(e), aggro: 0 };
        writeHP(e);
        updateAll(e);
      })
    }
    this.continueCombat();
  }

  endCombat() {
    if (this.living().filter(e => !e.dream).length == 0)
      this.wake()
    else {
      this.stage ++;
      this.removeEnemies()
      this.chars().forEach(e => setActions(e, walkAnimation(e, sum(e.combat.pos, [-100, 0, 0]))))
      this.blind();
      this.chars()[0].actionsQueue.push(() => this.nextEncounter())
      //this.nextEncounter()
    }
  }



  living() {
    return this.chars().filter(e => e.combat.hp > 0)
  }

  /**Returns false if combat is over */
  continueCombat() {
    if (!this.dream)
      return;
    let living = this.living();
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
    let s = posToStyle(sum(this.pos, [0, roomDepth, -roomHeight]))
    let b = element('', 'blind', s)
    setCanvasSize(b, roomWidth, roomHeight, 8);
    fillWithPattern(b, createPattern(solid("on", 11)));
    setTimeout(() => Scene.removeChild(b), 3900);
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
  return roomAt(parentPos(e));
}