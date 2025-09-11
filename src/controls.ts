import { current, entitiesById, phantom, selectPerson, SfxTemplate } from "./main";
import { dropHeldEntity, holdEntity, updateEntity, XY, XYZ, walkAnimation, Entity, simpleCopy, updateCanvas, parentPos, absolutePos, finalParent, KindOf, screenSize, info, setActions, waitAnimation, inDream, useItem, createDiv } from "./entity";
import { sum } from "./util";
import { roomHeight, roomsNum } from "./consts";
import { roomAt, roomOf } from "./room";
import { toggleSavesMenu as toggleSavesMenu } from "./state";
import { Aspects } from "./data";
import { AspectSprites } from "./graphics";

declare var Saves: HTMLDivElement, Scene: HTMLDivElement, img: HTMLImageElement, div1: HTMLDivElement, Back: HTMLCanvasElement, DEFS: Element, Menu: HTMLDivElement, Info: HTMLDivElement;

export let mpress: boolean[] = [], sp = [-380, 20], zoom = 600;


export function groundPos(pos: XYZ) {
  return [pos[0], pos[1], Math.ceil(pos[2] / roomHeight) * roomHeight] as XYZ;
}

export function showPhantom(e: Entity, pos: XYZ) {
  simpleCopy(phantom, e);
  phantom.pos = pos;
  Scene.appendChild(phantom.div)
  updateEntity(phantom);
}

export function updateCam() {
  Scene.style.left = `${sp[0]}px`;
  Scene.style.top = `${sp[1]}px`;
}

export function initControls() {

  onkeydown = e => {
    if (e.key == "Escape") {
      toggleSavesMenu();
    }
  }

  onpointerup = e => {
    mpress[e.button] = false;
  }

  onpointerdown = e => {
    mpress[e.button] = true;


    let [x, y, fl, v] = mouseTarget(e);
    let to = [x, y, (v + 1) * roomHeight] as XYZ;

    let actions;

    if (roomAt(to)?.dream && e.button == 2) {
       roomAt(to).wake()    
    }

    if (current && !current.dream && fl == "f" && !e.shiftKey) {
      if (e.button == 2 || (e.button == 0 && !current.held))
        actions = walkAnimation(current, to);
      if (e.button == 0 && current.held) {
        actions = [...walkAnimation(current, to), () => dropHeldEntity(current)];
      }
    }

    if (fl == "s" && !e.shiftKey) {
      let te = entitiesById[v];
      if(te.kind == KindOf.Person)
        selectPerson(te);
    }

    if (current && !current.dream && fl == "s" && !e.shiftKey) {
      let te = entitiesById[v];
      if (te && te != current) {
        if (inDream(te)) {
          roomOf(te).wake();
          return
        }
        if (e.button == 2) {
          actions = [...walkAnimation(current, parentPos(te), 15), () => useItem(current, te)]
        }
        if (e.button == 0) {
          if (te.kind == KindOf.Person) {
            selectPerson(finalParent(te));
          } else {
            actions = [
              ...walkAnimation(current, parentPos(te)),
              () => {
                if (current.held) {
                  if (!te.held) {
                    holdEntity(te, current.held);
                  }
                } else {
                  holdEntity(current, te)
                }
              }
            ];
          }
        }
      }
    }

    if (actions && !inDream(current)) {
      setActions(current, [...actions, () => waitAnimation(5000)]);
    }

  }

  oncontextmenu = e => {
    if (!e.shiftKey)
      e.preventDefault()
  }

  onpointermove = e => {
    if (mpress[1]) {
      let mul = .5;
      sp = sum(sp, [e.movementX, e.movementY], mul);
      updateCam()
    }

    let [x, y, fl, v] = mouseTarget(e);
    let to = [x, y, (v + 1) * roomHeight] as XYZ;
    let te = entitiesById[v];

    if (fl == "s") {
      updateInfo(te)
    } else {
      updateInfo(current)
    }

    //Scene.style.setProperty("--hl", `s${te?.id}`)

    let heldByCurrent = current?.held;
    if (heldByCurrent) {
      if (fl == "f")
        showPhantom(heldByCurrent, to);
      if (fl == "s") {
        if (te && te.kind == KindOf.Item) {
          let pos = sum(te.pos, [0, 0, -screenSize(te)[1] * .7]) as XYZ;
          showPhantom(heldByCurrent, pos);
          te.div.parentElement?.appendChild(phantom.div);
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

export let infoShownFor: Entity;

export function itemOrPerson(e: Entity) {
  return e.kind == KindOf.Item || e.kind == KindOf.Person
}

export let details = true;

//Info.onmouseover = () => {details = true; updateInfo(infoShownFor)}
//Info.onmouseleave = () => {details = false; updateInfo(infoShownFor)}


export function updateInfo(e?: Entity) {

  let inf = info(e) || info(current);

  infoShownFor = e || current;

  Info.innerHTML = inf ?? ''

  requestAnimationFrame(() =>
    document.querySelectorAll('.aspect').forEach(el => {
      let a = Aspects[(el as any)?.dataset?.aspect];
      if (!a)
        return;
      delete (el as any)?.dataset?.aspect;
      let c = createDiv({
        ...SfxTemplate,
        shape: AspectSprites + a.ind,
        colors: a.colors
      })
      el.prepend(c);
    }))
}

export function rezoom() {
  Scene.style.transform = `translateZ(${zoom}px)`;
}

/** */
export function mouseTarget(e: MouseEvent) {
  let [id, x, y] = [(e.target as HTMLElement).id, e.offsetX, e.offsetY];
  /**First letter */
  let fl = id[0], v = 1 * (id.substring(1) as any);
  return [x, y, fl, v] as [number, number, string, number]
}