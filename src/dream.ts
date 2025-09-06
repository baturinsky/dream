import { setActions, Entity, XYZ, recoilAnimation, aspect, writeHP } from "./entity";
import { flyingText } from "./graphics";
import { rng, sum } from "./util";


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

export function damage(attacker: Entity, target: Entity) {
  return ~~(
    3 + (aspect(attacker, 'S') + attacker.level * .5) * rng() * 5
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


export function unharmed(e: Entity) {
  return e.combat.hp == maxhp(e)
}

export function allies(a: Entity, b: Entity) {
  return a.dream == b.dream;
}

