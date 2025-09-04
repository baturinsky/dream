import { filtered, createPattern, recolor, gcx, outl, solid, transp, fillWithPattern, setCanvasSize, element, addCarpet, spriteCanvas, scaleCanvas, addWallpaper, TreeSprites, drawScaled, updateFront, drawRoom, redrawRooms } from "./graphics";
import { createEntity, ItemTemplate, KindOf, roomDoorPos, SceneryTemplate } from "./entity";
import { cols, roomWidth, rows, roomHeight, roomDepth, roomsNum } from "./state";
import { array, rng } from "./util";

declare var Scene: HTMLDivElement, Back: HTMLCanvasElement, Front: HTMLCanvasElement;
export let walls: HTMLCanvasElement[], floors: HTMLCanvasElement[];

export function prepareScene() {
  let s = ""

  Scene.innerHTML += s;
  for (let c of [Back, Front]) {
    setCanvasSize(c, roomWidth * cols, roomHeight * rows, 2)
  }

  Front.style.transform = `translateZ(${roomDepth}px)`

  let wallPattern = createPattern(solid("gf", 2))

  walls = array(cols + 1, i => {
    let c = element(`w${i}`, 'wall', { left: `${i * roomWidth}px` })
    setCanvasSize(c, roomDepth, roomHeight * rows, 2)
    fillWithPattern(c, wallPattern)
    return c
  })

  floors = array(rows + 1, i =>
    setCanvasSize(element(`f${i}`, 'floor', { top: `${i * roomHeight}px` }),
      roomWidth * cols, roomDepth, 2)
  )

  updateFront()

  array(roomsNum + cols, i => {
    createEntity({
      ...SceneryTemplate,
      shape: 0x50,
      colors: "ef",
      type: "Door",
      level: i,
      scale: 2,
      pos: roomDoorPos(i)
    })
  })

  redrawRooms();


  /*let f = addCarpet(0);
  let grass = createPattern(solid("ba", 9))
  fillWithPattern(f, grass)
  let road = scaleCanvas(transp("45", 11), 16);
  gcx(f).globalAlpha = 0.5;
  fillWithPattern(f, createPattern(road))

  f = addWallpaper(0);
  let trunk = outl('57', TreeSprites), top = outl('a9', TreeSprites + 2)
  gcx(f).fillStyle = grass;
  gcx(f).fillRect(0, f.height * .5, f.width, f.height * .5);
  for (let i = 110; i>4; i--) {
    let h = 2 * i**.7, x = rng(roomWidth * 2);
    gcx(f).save()
    gcx(f).translate(x, roomHeight * 2 - 90 - h);
    let scale = 60 / (3 + h*.6);
    gcx(f).scale(scale, scale)
    drawScaled(f, trunk, 0, 0);
    drawScaled(f, top, 0, -3);
    gcx(f).restore()
  }*/
}