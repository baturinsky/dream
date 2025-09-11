import { levelTo } from "./aspects";
import { infoShownFor, updateInfo } from "./controls";
import { setActions, Entity, XYZ, recoilAnimation, aspect, writeHP, chars, flyingTextPos, entities, KindOf, title } from "./entity";
import { flyingText } from "./graphics";
import { roomOf } from "./room";
import { openRoom } from "./state";
import { fixed, rng, rngRounded, sum } from "./util";


export type CombatStats = {
  pos: XYZ
  hp: number
  delay: number
  aggro: number
  poison: number
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
  return e.dream ? 0.5 * mult : 1.5 / mult
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

  let success = true;
  if (!heal) {
    let a = rng() * (aspect(attacker, 'L') * 2 + attacker.level) * 2,
      d = rng() * (aspect(target, 'D') * 2 + target.level);
    success = a > d;
  }

  let dhp = heal ? ~~(2 + aspect(attacker, 'M')) : - ~~((rng() + .5) * avgDamage);

  if (dhp < 0 && target.dream == attacker.dream)
    debugger

  if (dhp > 0 && target.dream != attacker.dream)
    debugger

  applyHpEffect(target, dhp, success, attacker, heal || !success ? 0 :
    rngRounded(aspect(attacker, 'V') / (1 + aspect(target, 'P')) * .1, 1))
}

export function applyHpEffect(target: Entity, dhp: number, success: boolean = true, source?: Entity, poison = 0) {
  dhp = rngRounded(dhp, 1)
  let absDhp = Math.abs(dhp);

  if (success) {
    target.combat.hp += dhp;
    target.combat.hp = Math.min(Math.max(0, target.combat.hp), maxhp(target));
    if(source)
      source.combat.aggro += absDhp;
  }

  let txt = success ? `${(dhp > 0 ? '+' : '') + fixed(dhp)}` : `miss`, cls = success ? (dhp < 0 ? "red" : "grn") : "";
  flyingText(txt, flyingTextPos(target), cls);

  let log = `<div class=${cls}>${source ? title(source) : dhp<0?'poison':'regen'} ${txt} ${poison ? fixed(poison) + ' poison' : ''} ${title(target)}</div>`
  target.combat.poison += poison;

  source && addLog(source, log)
  addLog(target, log)
  writeHP(target);

  let room = roomOf(target);

  if (target.combat.hp == 0 && target.dream) {
    room.chars(false).forEach(c => giveXp(c, xpFor(c, target)))

    if (captureSuccess()) {
      target.dream = false;
      target.level = rngRounded(target.level * .7);
      target.aspects = levelTo(target.aspects, target.level);
      room.wake();
    }
  }
}

export function addLog(e: Entity, t: string) {
  e.log = e.log.slice(0).slice(-5) ?? [];
  e.log.push(`<div>${t}</div>`);
  if (infoShownFor == e) {
    updateInfo(e);
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
  let chance = 10 / (10 + entities().filter(e => e.kind == KindOf.Item && !e.dream).length) * openRoom
  return rng() < chance;
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

