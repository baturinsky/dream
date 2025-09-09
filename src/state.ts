import { lastSpriteId, setLastSpriteId } from "./consts";
import { createEntity, Entity, holdEntity, KindOf, removeEntity } from "./entity";
import { current, entitiesById, rooms, selectPerson, Templates } from "./main";
import { redrawRooms } from "./room";

const savedEntityFieldNames = 'id,name,kind,pos,scale,right,shape,colors,aspects,dream,type,material,recent,level,combat,hrz';

export let openRoom = 1;

export function unlockNextRoom(){
  openRoom++;  
}

export function saveEntity(e) {
  return e && { ...savedFields(e, savedEntityFieldNames), chest: saveEntity(e.chest), held: saveEntity(e.held) }
}

function savedFields(e, savedFieldNames) {
  return Object.fromEntries(savedFieldNames.split(',').map(s => [s, e[s]]));
}

export function loadEntity(e?: Entity) {
  if (!e)
    return null as any as Entity;
  let r = createEntity({
    ...Templates[e.kind],
    ...e,
    chest: loadEntity(e.chest)
  });
  //if(r.name)    debugger
  if(e.held)
    holdEntity(r, loadEntity(e.held), e.held.pos)
  return r;
}

export function saveAll() {
  return {
    cur: current.id,
    lid: lastSpriteId,
    openRoom,
    rooms: rooms.map(r=>savedFields(r,'start,dream,aspects,level,stage,dur,drst')),
    all: Object.values(entitiesById).filter(e => !e.parent && e.kind != KindOf.SFX).map(e => saveEntity(e))
  }
}

export function loadAll(save: { cur: number, lid: number, all: Entity[], rooms, openRoom:number }) {
  console.log(save);
  Object.values(entitiesById).forEach(e => removeEntity(e))
  save.all.forEach(e => loadEntity(e))
  selectPerson(entitiesById[save.cur]);
  setLastSpriteId(save.lid);
  openRoom = save.openRoom;
  save.rooms.forEach((v,i)=>{Object.assign(rooms[i], v)});
  redrawRooms()
  for (let room of rooms) {
    if (room.dream) {
      room.toggleDream(true)
      room.fight()
    }
  }
}

