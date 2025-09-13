import { levelTo } from "./aspects";
import { infoShownFor, updateInfo } from "./controls";
import { setActions, Entity, XYZ, recoilAnimation, aspect, writeHP, chars, flyingTextPos, entities, KindOf, title, unitLink } from "./entity";
import { flyingText } from "./graphics";
import { Room, roomOf } from "./room";
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
  let bonus = e.dream ? 0.5 * mult : 1.5 / mult
  return bonus
}

export function averageDamage(attacker: Entity, target: Entity) {
  return Math.max(0, 3 + (aspect(attacker, 'S') + attacker.level * .5) * 3
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

  let dhp = heal ? ~~(1 + aspect(attacker, 'M')) : - ~~((rng() + .5) * avgDamage);


  applyHpEffect(target, dhp, success, attacker, heal || !success ? 0 :
    rngRounded(aspect(attacker, 'V') / (1 + aspect(target, 'P')) * .3, 1))
}

export function applyHpEffect(target: Entity, dhp: number, success: boolean = true, source?: Entity, poison = 0) {

  dhp = rngRounded(dhp, 1)

  if (!dhp && !poison)
    return;

  let absDhp = Math.abs(dhp);

  if (success) {
    target.combat.hp += dhp;
    target.combat.hp = Math.min(Math.max(0, target.combat.hp), maxhp(target));
    if (source)
      source.combat.aggro += absDhp;
  }

  if (dhp > 0 && source && source.dream != target.dream)
    debugger

  if (dhp < 0 && source && source?.dream == target.dream)
    debugger

  let txt = success ? `${(dhp > 0 ? '+' : '') + fixed(dhp)}` : `miss`, cls = success ? (dhp < 0 ? "red" : "grn") : "";
  flyingText(txt, flyingTextPos(target), cls);

  let log = `<div>${source ? unitLink(source) : dhp < 0 ? 'poison' : 'regen'} 
  <span class=${cls}>${txt}</span> ${poison ? fixed(poison) + ' poison' : ''} ${unitLink(target)}</div>`
  target.combat.poison += poison;

  source && addLog(source, log)
  addLog(target, log)
  writeHP(target);

  let room = roomOf(target);

  if (target.combat.hp == 0 && target.dream) {
    room.chars(false).forEach(c => giveXp(c, xpFor(c, target)))

    if (captureSuccess(room)) {
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

function captureSuccess(room:Room) {
  let cl = chars().length;
  return cl == 1 || rng() < .3 / cl * room.greed();
}


export function lootSuccess(room:Room) {
  let chance = 7 / (10 + entities().filter(e => e.kind == KindOf.Item && !e.dream).length) * 
  room.greed()
  //console.log("ls", chance);
  return rng() < chance;
}


function xpFor(char: Entity, target: Entity) {
  return Math.max(0, rngRounded(
    (5 + target.level - char.level) /
    (1 + char.level) /
    (roomOf(char).chars(false).length) * .1
  ));
}


export function unharmed(e: Entity) {
  return e.combat.hp == maxhp(e)
}

export function allies(a: Entity, b: Entity) {
  return a.dream == b.dream;
}

