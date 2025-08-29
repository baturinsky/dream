import { createEntity, Entity, holdEntity, KindOf, lastSpriteId, removeEntity, setLastSpriteId, Templates } from "./entity";
import { current, entities, selectPerson } from "./main";

export function saveEntity(e?: Entity) {
  return e && { ...savedFields(e), chest: saveEntity(e.chest), held: e.held?.map(e => saveEntity(e)) }
}

const savedFieldNames = 'id,name,kind,pos,scale,right,shape,colors,aspects,type,material,explored,level,day'.split(',');

function savedFields(e: Entity) {
  return Object.fromEntries(savedFieldNames.map(s => [s, e[s]]));
}

export function loadEntity(e?: Entity) {
  if (!e)
    return null as any as Entity;
  let r = createEntity({
    ...Templates[e.kind],
    ...savedFields(e),
    chest: loadEntity(e.chest)
  });
  e.held?.forEach(h => {
    holdEntity(r, loadEntity(h), h.pos)
  })
  return r;
}

export function saveAll() {
  return { cur: current.id, lid: lastSpriteId, all: entities.filter(e => !e.parent && e.kind != KindOf.SFX).map(e => saveEntity(e)) }
}

export function loadAll(save: { cur: number, lid: number, all: Entity[] }) {
  [...entities].forEach(e => removeEntity(e))
  save.all.forEach(e => loadEntity(e))
  selectPerson(entities.find(e => e.id == save.cur));
  setLastSpriteId(save.lid)
}