import { lastSpriteId, setLastSpriteId } from "./consts";
import { createEntity, Entity, holdEntity, KindOf, removeEntity } from "./entity";
import { current, entities, rooms, selectPerson, Templates } from "./main";


const savedEntityFieldNames = 'id,name,kind,pos,scale,right,shape,colors,aspects,type,material,explored,level,dream,combat'.split(',');

export function saveEntity(e) {
  return e && { ...savedFields(e, savedEntityFieldNames), chest: saveEntity(e.chest), held: e.held?.map(e => saveEntity(e)) }
}

function savedFields(e, savedFieldNames) {
  return Object.fromEntries(savedFieldNames.map(s => [s, e[s]]));
}

export function loadEntity(e?: Entity) {
  if (!e)
    return null as any as Entity;
  let r = createEntity({
    ...Templates[e.kind],
    ...savedFields(e, savedEntityFieldNames),
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
  setLastSpriteId(save.lid);
  save.rooms.forEach((v,i)=>Object.assign(rooms[i], v));
  for (let room of rooms) {
    if (room.dream) {
      room.toggleDream(true)
      room.continueCombat()
    }
  }
}

