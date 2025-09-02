import { filtered, createPattern, recolor, gcx, outl, solid, transp, fillWithPattern, setCanvasSize, element, addCarpet, spriteCanvas, scaleCanvas } from "./graphics";
import { createEntity, ItemTemplate, KindOf, roomDoorPos, SceneryTemplate } from "./entity";
import { cols, roomWidth, rows, roomHeight, roomDepth, roomsNum } from "./state";

declare var Scene: HTMLDivElement, Back: HTMLCanvasElement, Front: HTMLCanvasElement;




export function prepareScene() {
  let s = ""

  Scene.innerHTML += s;
  for (let c of [Back, Front]) {
    setCanvasSize(c, roomWidth * cols, roomHeight * rows, 2)
  }

  Front.style.transform = `translateZ(${roomDepth}px)`

  fillWithPattern(Back, createPattern(solid("2f", 1)));

  let cb = gcx(Front);
  cb.fillStyle = createPattern(solid("2g", 1))
  for (let i = 0; i < cols; i++) cb.fillRect(i * roomWidth * 2 - 10, 0, 20, 1e4);
  for (let i = 0; i < rows; i++) cb.fillRect(0, i * roomHeight * 2 - 10, 1e4, 20)

  let wallPattern = createPattern(solid("gf", 2))
  let floorPattern = createPattern(solid("rq", 1))

  for (let i = 0; i <= cols; i++) {
    let c = element(`w${i}`, 'wall', { left: `${i * roomWidth}px` })
    setCanvasSize(c, roomDepth, roomHeight * rows, 2)
    fillWithPattern(c, wallPattern)
  }

  for (let i = 0; i <= rows; i++) {
    let c = element(`f${i}`, 'floor', { top: `${i * roomHeight}px` })
    setCanvasSize(c, roomWidth * cols, roomDepth, 2)
    fillWithPattern(c, floorPattern)
  }

  for (let i = 0; i < roomsNum; i++) {
    createEntity({
      ...SceneryTemplate,
      shape: 0x50,
      colors: "ef",
      type: "Door",
      level: i,
      scale: 2,
      pos: roomDoorPos(i)
    })
  }

  let ca = addCarpet(0);
  let f = spriteCanvas(roomWidth + roomDepth, roomDepth);
  fillWithPattern(ca, createPattern(solid("ba", 9)))
  let road = scaleCanvas(transp("45", 11), 16);
  gcx(ca).fillStyle = createPattern(road);
  gcx(ca).globalAlpha = 0.5;
  gcx(ca).fillRect(0, 0, ca.width, ca.height);

  ca.style.background = '#000'
}