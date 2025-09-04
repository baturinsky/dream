import { Entity, XYZ } from "./entity";
import { createPattern, solid, fillWithPattern, element, setCanvasSize, gcx } from "./graphics";
import { floors } from "./init";
import { cols, roomWidth, roomHeight, roomDepth, roomsNum, rows } from "./state";
import { array, rng } from "./util";

declare var Scene: HTMLDivElement, Back: HTMLCanvasElement, Front: HTMLCanvasElement,
  img: HTMLImageElement, div1: HTMLDivElement, DEFS: Element;;


export type Room =  {
  start?: number
  draw(): void;
  pos: () => number[];
  addCarpet(rnum: number): HTMLCanvasElement;
  addWallpaper(rnum: number): HTMLCanvasElement;
}

export let rooms: Room[] = array(roomsNum, id => makeRoom(id))

export function makeRoom(id: number) {

  let [col, row] = [id % cols, ~~(id / cols)];
  let [l, t, w, h, d] = [roomWidth * col * 2, roomHeight * row * 2, roomWidth * 2, roomHeight * 2, roomDepth * 2 - 1]

  return {
    col, row, l, t, w, h, d, 
    draw() {
      let backPattern = createPattern(solid("2f", rng(3) + 1));
      fillWithPattern(Back, backPattern, [l, t, w, h])
      fillWithPattern(floors[col], createPattern(solid("rq", rng(3) + 1)), [l, 0, w, d])
    },

    pos: () => [(id % cols) * roomWidth, 0, roomHeight * ~~(id / cols + 1)],

    addCarpet(rnum: number) {
      let c = element(`ca${rnum}`, 'carpet', { top: `${++row * roomHeight}px`, left: `${col * roomWidth}px` }, "canvas")
      setCanvasSize(c, roomWidth, roomDepth, 2);
      return c
    },

    addWallpaper(rnum: number) {
      let c = element(`wp${rnum}`, 'wp', { top: `${row * roomHeight}px`, left: `${col * roomWidth}px` }, "canvas")
      setCanvasSize(c, roomWidth, roomHeight, 2);
      return c
    }
  } as Room

}

export function updateFront() {
  let cb = gcx(Front);
  cb.fillStyle = createPattern(solid("2g", 1))
  for (let i = 0; i < cols; i++) cb.fillRect(i * roomWidth * 2 - 10, 0, 20, 1e4);
  for (let i = 0; i < rows; i++) cb.fillRect(0, i * roomHeight * 2 - 10, 1e4, 20)
}

export function redrawRooms(){
  array(roomsNum + cols, i => rooms[i].draw())
}
