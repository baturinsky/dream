import { continueCombat, toggleDream } from "./dream";
import { createEntity, Entity, holdEntity, KindOf, removeEntity, Templates } from "./entity";
import { current, entities, selectPerson } from "./main";
import { rooms } from "./room";

export const roomDepth = 64, rows = 5, cols = 3, roomHeight = 128, roomWidth = 256, quadSize = 8, roomsNum = rows * cols;


export let lastSpriteId = 0;

export function setLastSpriteId(v: number, r) {
  lastSpriteId = v;
}

const savedEntityFieldNames = 'id,name,kind,pos,scale,right,shape,colors,aspects,type,material,explored,level,dream,combat'.split(',');

export function saveEntity(e?: Entity) {
  return e && { ...savedFields(e, savedEntityFieldNames), chest: saveEntity(e.chest), held: e.held?.map(e => saveEntity(e)) }
}


function savedFields(e: Entity, savedFieldNames) {
  return Object.fromEntries(savedFieldNames.map(s => [s, e[s]]));
}

export function loadEntity(e?: Entity) {
  if (!e)
    return null as any as Entity;
  let r = createEntity({
    ...Templates[e.kind],
    ...e,
    chest: loadEntity(e.chest)
  });
  e.held?.forEach(h => {
    holdEntity(r, loadEntity(h), h.pos)
  })
  return r;
}

export function saveAll() {
  return {
    cur: current.id,
    lid: lastSpriteId,
    rooms: rooms.map(r=>savedFields(r,'start')),
    all: Object.values(entities).filter(e => !e.parent && e.kind != KindOf.SFX).map(e => saveEntity(e))
  }
}

export function loadAll(save: { cur: number, lid: number, all: Entity[], rooms }) {
  Object.values(entities).forEach(e => removeEntity(e))
  save.all.forEach(e => loadEntity(e))
  selectPerson(entities[save.cur]);
  lastSpriteId = save.lid;
  save.rooms.forEach((v,i)=>Object.assign(rooms[i], v));
  for (let room of rooms) {
    if (room.dream) {
      toggleDream(room.id, true)
      continueCombat(room.id)
    }
  }
}

export function nextSpriteId() {
  return ++lastSpriteId;
}