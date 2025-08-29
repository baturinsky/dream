import { roomWidth, roomDepth, rows, roomHeight, cols, roomsNum } from "./main";
import { filtered, createPattern, recolor, gcx, outl, solid, transp } from "./graphics";
import { createEntity, ItemTemplate, KindOf, roomDoorPos, SceneryTemplate } from "./entity";

declare var Scene: HTMLDivElement, Back: HTMLCanvasElement, Front: HTMLCanvasElement;


export function prepareScene() {
  let s = ""
  for (let i = 0; i <= cols; i++) {
    s += `<canvas class=wall  id=w${i} style="left:${i * roomWidth}px;height:${rows * roomHeight}px;width:${roomDepth}px" 
    width=${roomDepth * 2} height=${rows * roomHeight * 2} /></canvas>`
  }
  for (let i = 0; i <= rows; i++) {
    s += `<canvas class=floor id=f${i} style="top:${i * roomHeight}px;height:${roomDepth}px;width:${cols * roomWidth}px" 
    width=${cols * roomWidth * 2} height=${roomDepth * 2}></canvas>`
  }

  Scene.innerHTML += s;
  for (let d of [Back, Front]) {
    d.width = roomWidth * cols * 2;
    d.height = roomHeight * rows * 2;
    d.style.width = `${roomWidth * cols}px`;
    d.style.height = `${roomHeight * rows}px`;
  }
  Front.style.transform = `translateZ(${roomDepth}px)`

  let brickPattern = createPattern(solid("2f", 1))

  let cb = gcx(Back);
  cb.fillStyle = brickPattern;
  cb.fillRect(0, 0, 1e4, 1e4);

  cb = gcx(Front);
  cb.fillStyle = createPattern(solid("2g", 1))
  for (let i = 0; i < cols; i++) cb.fillRect(i * roomWidth * 2 - 10, 0, 20, 1e4);
  for (let i = 0; i < rows; i++) cb.fillRect(0, i * roomHeight * 2 - 10, 1e4, 20)


  let wallPattern = createPattern(solid("gf", 2))
  document.querySelectorAll(".wall").forEach((div) => {
    let cb = gcx(div as HTMLCanvasElement);
    cb.fillStyle = wallPattern;
    cb.fillRect(0, 0, 1e4, 1e4);
  })

  let floorPattern = createPattern(solid("rq", 1))

  document.querySelectorAll(".floor").forEach((div) => {
    let cb = gcx(div as HTMLCanvasElement);
    cb.fillStyle = floorPattern;
    cb.fillRect(0, 0, 1e4, 1e4);
  })

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

}


