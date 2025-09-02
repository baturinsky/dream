import { roomEntities, setActions, removeEntity, KindOf, Entity, roomChars, roomPos, updateAll, roomNumber, createEntity, PersonTemplate, sfx, roomDoorPos, XYZ, recoilAnimation, attackAnimation, aspect, writeHP, randomRace, dreaming, setTitle } from "./entity";
import { BodySprites,  flyingText } from "./graphics";
import { Room } from "./main";
import { roomDepth, roomHeight, rooms, roomWidth } from "./state";
import { japaneseName, randomElement, rng, sum, weightedRandomF, weightedRandomOKey } from "./util";

export function toggleDream(room: number, dream: boolean) {
  rooms[room].dream = dream;
  let entities = roomEntities(room);

  for (let e of entities) {
    setActions(e, [])
    setTitle(e,"")
    /**All dream items removed on wake*/
    if (e.dream && !dream) {      
      removeEntity(e)
    } 
    
    /**All nondream non-person items hidden on dream, revealed at day*/
    if(!e.dream && e.kind != KindOf.Person) {
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
  return ~~(3000 / (1 + aspect(e, 'T') + e.level * .1 + rng()));
}

export function damage(e: Entity) {
  return (1 + aspect(e, 'S') + e.level * .1) * 3;
}

export function dealDamage(attacker: Entity, defender: Entity) {
  setActions(defender, recoilAnimation(defender));
  let dmg = ~~damage(attacker);
  defender.combat.hp -= dmg;
  flyingText(`${dmg}`, sum(defender.pos, [-5 + rng(10), 0, -35]), "red")
  writeHP(defender);
}

/**Returns false if combat is over */
export function continueCombat(rnum: number) {
  if (!rooms[rnum].dream)
    return;
  let chars = roomChars(rnum).filter(e => e.combat.hp > 0);
  let minDelay = Math.min(...chars.map(c => c.combat.delay));
  let updateDelay = () => {
    for (let c of chars)
      c.combat.delay -= minDelay;
  };
  let nextChar = chars.find(c => c.combat.delay == minDelay) as Entity;
  if (!nextChar)
    return endCombat(rnum);
  let target = weightedRandomF(chars, t => t.dream == nextChar.dream ? 0 : (1 + aspect(t, 'C')));
  if (!target)
    return endCombat(rnum);
  setActions(nextChar, attackAnimation(nextChar, target, updateDelay));
}

export function endCombat(rnum: number) {
  wake(rnum)
}