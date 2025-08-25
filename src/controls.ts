import { debOnDown } from "./debug";
import { cat, current, roomHeight, entities, phantom } from "./main";
import { ActionKind, dropEntity, removeEntity, roomDoorPos, roomNumber, walkTo, takeEntity, updateEntity, XY, XYZ, roomWalkAnimation, Entity, simpleCopy, updateCanvas } from "./entity";
import { sum } from "./util";

declare var Scene: HTMLDivElement, img: HTMLImageElement, div1: HTMLDivElement, Back: HTMLCanvasElement, DEFS: Element, Menu: HTMLDivElement;

export let mpress: boolean[] = [], sp = { x: 0, y: 0 }, zoom = 400;

export function setActions(e: Entity, a: Function[]) {
  if (!e)
    return;
  e.actionsQueue = a;
  delete e.animation;
}

export function groundPos(pos: XYZ) {
  return [pos[0], pos[1], Math.ceil(pos[2] / roomHeight) * roomHeight] as XYZ;
}

export function showPhantom(e: Entity, pos: XYZ) {
  simpleCopy(phantom, e);
  phantom.pos = pos;
  updateEntity(phantom);
}


export function initControls() {
  onpointerup = e => {
    mpress[e.button] = false;
  }

  onpointerdown = e => {
    mpress[e.button] = true;

    debOnDown(e);

    let [x, y, fl, v] = mouseTarget(e);
    let to = [x, y, v * roomHeight] as XYZ;

    let actions;

    if (current && fl == "f" && !e.shiftKey) {
      if (e.button == 0 || (e.button == 2 && !current.hand))
        actions = roomWalkAnimation(current, to);
      if (e.button == 2 && current.hand) {
        actions = [...roomWalkAnimation(current, to), () => dropEntity(current)];
      }

    }

    if (current && fl == "s" && !e.shiftKey) {
      let te = entities.find(s => s.id == v);
      if (te && te != current) {
        if (e.button == 0)
          actions = roomWalkAnimation(current, te.pos)
        if (e.button == 2 && te.pickable)
          actions = [
            ...roomWalkAnimation(current, groundPos(te.pos)),
            () => {
              if (current.hand) {
                let pos = sum(te.pos, [0, 0, -te.canvas.height]) as XYZ;
                dropEntity(current, pos);
              } else {
                takeEntity(te)
              }
            }
          ];
      }
    }

    if (actions)
      setActions(current, actions);

    oncontextmenu = e => {
      if (!e.shiftKey)
        e.preventDefault()
    }

    let t = e.target as HTMLElement;

    if (t.classList.contains("sprite")) {
      //debugger
    }
  }

  onmousemove = e => {
    if (mpress[1]) {
      let mul = 1;
      sp.x += e.movementX * mul;
      sp.y += e.movementY * mul;
      Scene.style.left = `${sp.x}px`;
      Scene.style.top = `${sp.y}px`;
    }

    let [x, y, fl, v] = mouseTarget(e);
    let to = [x, y, v * roomHeight] as XYZ;
    if (current && current.hand) {
      if (fl == "f")
        showPhantom(current.hand, to);
      if (fl == "s") {
        let te = entities.find(s => s.id == v);
        if (te) {
          let pos = sum(te.pos, [0, 0, -te.canvas.height]) as XYZ;
          showPhantom(current.hand, pos);
        }
      }
    }


    e.preventDefault()
  }

  onwheel = e => {
    zoom -= e.deltaY * .2;
    rezoom()
  }

}

export function rezoom() {
  Scene.style.transform = `translateZ(${zoom}px)`;
}

/** */
export function mouseTarget(e: MouseEvent) {
  let [id, x, y] = [(e.target as HTMLElement).id, e.offsetX, e.offsetY];
  /**First letter */
  let fl = id[0], v = id.substring(1) as any;
  return [x, y, fl, v]
}


