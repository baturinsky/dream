import { lastSpriteId, saveName, setLastSpriteId } from "./consts";
import { updateCam } from "./controls";
import { createEntity, Entity, holdEntity, KindOf, removeEntity, updateAll } from "./entity";
import { current, entitiesById, rooms, selectPerson, Templates } from "./main";
import { redrawRooms } from "./room";
import { array } from "./util";

declare var Saves: HTMLDivElement;
const savedEntityFieldNames = 'id,name,kind,pos,scale,right,shape,colors,aspects,dream,type,material,recent,level,combat,hrz,sleeper,log';

export let openRoom = 1, sp = [-380, 20];

export function unlockNextRoom() {
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
  if (e.held)
    holdEntity(r, loadEntity(e.held), e.held.pos)
  return r;
}

export function saveAll() {
  return {
    cur: current.id,
    lid: lastSpriteId,
    sp,
    openRoom,
    date: Date.now(),
    rooms: rooms.map(r => savedFields(r, 'start,dream,aspects,level,stage,dur,drst')),
    all: Object.values(entitiesById).filter(e => !e.parent && e.kind != KindOf.SFX).map(e => saveEntity(e))
  }
}

export function loadAll(save: { cur: number, lid: number, all: Entity[], rooms, openRoom: number, sp }) {
  Object.values(entitiesById).forEach(e => removeEntity(e))
  save.all.forEach(e => loadEntity(e))
  selectPerson(entitiesById[save.cur]);
  setLastSpriteId(save.lid);
  if(save.sp)
    sp = save.sp;
  openRoom = save.openRoom;
  save.rooms.forEach((v, i) => { Object.assign(rooms[i], v) });
  redrawRooms()
  for (let room of rooms) {
    if (room.dream) {
      room.tdr(true)
      room.fight()
    }
  }
  updateCam();
}

let menu = true;

export function toggleSavesMenu(on?:boolean) {
  menu = on===undefined?!menu:on;
  Saves.innerHTML = 'Press ESC to toggle menu'
  if (!menu) {
    return
  }
  let data = JSON.parse(localStorage.getItem(saveName) || '[]');
  Saves.innerHTML += `<div class=saves>${array(10, i => {
    return `<div>
    ${i ? i : 'auto'}</div><button onclick="save(${i})">Save</button>
 ${data[i] ? `<button onclick="load(${i})">Load</button><div>${new Date(data[i].date).toUTCString()}</div>` :
        `<div></div><div></div>`}`
  }).join('')} 
 </div>`
}

toggleSavesMenu(localStorage[saveName])

window.save=(i:number)=>{
  let data = JSON.parse(localStorage[saveName] || '[]');
  data[i] = saveAll();
  localStorage[saveName] = JSON.stringify(data);
  toggleSavesMenu(false)
}

window.load=(i)=>{
  let data = JSON.parse(localStorage[saveName] || '[]');
  loadAll(data[i])
  toggleSavesMenu(false)
}