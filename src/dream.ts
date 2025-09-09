import { setActions, Entity, XYZ, recoilAnimation, aspect, writeHP, chars, flyingTextPos, entities, KindOf } from "./entity";
import { flyingText } from "./graphics";
import { roomOf } from "./room";
import { openRoom } from "./state";
import { rng, rngRounded, sum } from "./util";


export type CombatStats = {
  pos: XYZ
  hp: number
  delay: number
  aggro: number
}

export function maxhp(e: Entity) {
  return ~~((1 + aspect(e, 'H') + e.level * .5) * 10);
}

export function cooldown(e: Entity) {
  return ~~(1000 / (1 + aspect(e, 'T') + e.level * .1 + rng()));
}


export function combatDurationBonus(e: Entity) {
  let r = roomOf(e);
  let mult = 1 + r.dur / 60000;
  return e.dream ? 0.7 * mult : 1.3 / mult
}

export function averageDamage(attacker: Entity, target: Entity) {
  return (3 + (aspect(attacker, 'S') + attacker.level * .5) * 3
    - aspect(target, 'R') / 2)
    * combatDurationBonus(attacker)
}

export function damageOrHeal(attacker: Entity, target: Entity) {
  let heal = attacker.dream == target.dream;
  if (!heal)
    setActions(target, recoilAnimation(target));

  let avgDamage = averageDamage(attacker, target);

  let hitRoll = true;
  if (!heal) {
    let a = rng() * (aspect(attacker, 'L') * 2 + attacker.level) * 2,
      d = rng() * (aspect(target, 'D') * 2 + target.level);
    hitRoll = a > d;
  }

  let dmg = heal ? - ~~(1 + aspect(attacker, 'M')) : ~~((rng() + .5) * avgDamage);

  let admg = Math.abs(dmg);

  if (hitRoll) {
    target.combat.hp -= dmg;
    target.combat.hp = Math.min(Math.max(0, target.combat.hp), maxhp(target));
    attacker.combat.aggro += admg;
  }

  flyingText(
    hitRoll ? `${admg}` : `miss`,
    flyingTextPos(target),
    hitRoll ? (dmg > 0 ? "red" : "grn") : ""
  );

  writeHP(target);

  let room = roomOf(target);

  if (target.combat.hp == 0 && target.dream) {
    room.chars(false).forEach(c => giveXp(c, xpFor(c, target)))

    if (captureSuccess()) {
      target.dream = false;
      target.level = rngRounded(target.level * .7);
      room.wake();
    }
  }
}


function giveXp(e: Entity, v: number) {
  if (v) {
    e.level += v;
    flyingText(`${v}xp`, flyingTextPos(e), '#80f')
  }
}

function captureSuccess() {
  return rng() < .5 / (chars().length ** 2) * openRoom;
}

export function lootSuccess() {
  return rng() < 1 / (entities().filter(e => e.kind == KindOf.Item && !e.dream).length ** 2) * openRoom;
}


function xpFor(char: Entity, target: Entity) {
  return Math.max(0, rngRounded(
    (5 + target.level - char.level) /
    (1 + char.level) /
    (roomOf(char).chars(false).length) * .05
  ));
}


export function unharmed(e: Entity) {
  return e.combat.hp == maxhp(e)
}

export function allies(a: Entity, b: Entity) {
  return a.dream == b.dream;
}

