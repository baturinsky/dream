import { roomEntities, setActions, removeEntity, KindOf, Entity, roomChars, roomPos, updateAll, roomNumber, createEntity, PersonTemplate, sfx, roomDoorPos, XYZ, recoilAnimation, combatActionAnimation, aspect, writeHP, randomRace, dreaming, setTitle } from "./entity";
import { BodySprites, flyingText } from "./graphics";
import { Room } from "./main";
import { roomDepth, roomHeight, rooms, roomWidth } from "./state";
import { japaneseName, randomElement, rng, sum, weightedRandom, weightedRandomF, weightedRandomOKey } from "./util";

export function toggleDream(room: number, dream: boolean) {
  rooms[room].dream = dream;
  let entities = roomEntities(room);

  for (let e of entities) {
    setActions(e, [])
    e.combat = {} as any;
    setTitle(e, "")
    /**All dream items removed on wake*/
    if (e.dream && !dream) {
      removeEntity(e)
    }

    /**All nondream non-person items hidden on dream, revealed at day*/
    if (!e.dream && e.kind != KindOf.Person) {
      e.div.style.display = dream ? "none" : "block";
    }
  }
}

export function sleep(dreamer: Entity) {
  let rnum = roomNumber(dreamer.pos);
  toggleDream(rnum, true);
  let room = rooms[rnum];
  room.aspects = dreamer.aspects;
  room.level = dreamer.level;
  addEnemies(rnum);
  initCombatantStats(rnum)
  continueCombat(rnum);
}

export function wake(rnum: number) {
  toggleDream(rnum, false);
}

//for(let i=0;i<100;i++){  console.log(weightedRandomOKey(Races, undefined, a=>1/(10+a.ind)));}

export function addEnemies(rnum: number) {
  for (let i = 0; i < 3; i++) {
    createEntity(
      {
        ...PersonTemplate,
        level: 1,
        colors: "nm",
        type: randomRace(),
        name: japaneseName(),
        chest: sfx(BodySprites + 2, "lk"),
        pos: roomDoorPos(rnum),
        dream: true
      });
  }
}


export function initCombatantStats(rnum: number) {
  for (let dream of [true, false]) {
    let chars = roomChars(rnum, dream);
    let pos = roomPos(rnum);
    pos[0] += (dream ? 0.3 : 0.7) * roomWidth;
    chars.forEach((e, i) => {
      e.pos = sum(pos, [0, (i + .5) * roomDepth / chars.length, 0]);
      e.right = dream;
      e.combat = { pos: e.pos, hp: maxhp(e), delay: cooldown(e), aggro: 0 };
      writeHP(e);
      updateAll(e);
    })
  }
}


export type CombatStats = {
  pos: XYZ
  hp: number
  delay: number
  aggro: number
}

export function maxhp(e: Entity) {
  return ~~((1 + aspect(e, 'H') + e.level * .2) * 10);
}

export function cooldown(e: Entity) {
  return ~~(1000 / (1 + aspect(e, 'T') + e.level * .1 + rng()));
}

export function damage(attacker: Entity, target: Entity) {
  return ~~(
    3 + (aspect(attacker, 'S') + attacker.level * .1) * rng() * 5
    - aspect(target, 'R') * rng()
  );
}


export function dealDamage(attacker: Entity, target: Entity) {
  let heal = attacker.dream == target.dream;
  if (!heal)
    setActions(target, recoilAnimation(target));

  let hitRoll = true;
  if (!heal) {
    let a = rng() * (aspect(attacker, 'L') * 2 + attacker.level) * 2,
      d = rng() * (aspect(target, 'D') * 2 + target.level);
    hitRoll = a > d;
    if (hitRoll)
      console.log(a, d);
  }


  let dmg = ~~damage(attacker, target) * (heal ? -1 : 1);
  let admg = Math.abs(dmg);

  if (hitRoll) {
    target.combat.hp -= dmg;
    target.combat.hp = Math.min(Math.max(0, target.combat.hp), maxhp(target));
    attacker.combat.aggro += admg;
  }

  flyingText(
    hitRoll ? `${admg}` : `miss`,
    sum(target.pos, [-5 + rng(10), 0, -35]),
    hitRoll ? (dmg > 0 ? "red" : "grn") : ""
  );

  writeHP(target);
}

/**Returns false if combat is over */
export function continueCombat(rnum: number) {
  if (!rooms[rnum].dream)
    return;
  let chars = roomChars(rnum).filter(e => e.combat.hp > 0);
  let minDelay = Math.min(...chars.map(c => c.combat.delay));
  let attacker = chars.find(c => c.combat.delay == minDelay) as Entity;
  if (!attacker)
    return endCombat(rnum);

  let isHealing = weightedRandom([aspect(attacker, 'S'), aspect(attacker, 'M')]) == 1;

  let target: Entity | undefined;

  if (isHealing) {
    target = weightedRandomF(chars, t => allies(attacker, t) ? maxhp(t) / t.combat.hp : 0)
  }


  if (!target || unharmed(target)) {
    isHealing == false;
    target = weightedRandomF(chars, t => allies(attacker, t) ? 0 :
      (.1 * t.level +
        Math.max(0, aspect(t, 'C') - aspect(t, 'D') - aspect(attacker, 'L'))
        + aspect(attacker, 'A') * t.combat.aggro
      )
    );

  }

  if (!target/* || (!isHealing && allies(attacker, target))*/)
    return endCombat(rnum);

  setActions(attacker, combatActionAnimation(attacker, target, () => chars.forEach(c => c.combat.delay -= minDelay)));
}

export function unharmed(e: Entity) {
  return e.combat.hp == maxhp(e)
}

export function allies(a: Entity, b: Entity) {
  return a.dream == b.dream;
}

export function endCombat(rnum: number) {
  wake(rnum)
}