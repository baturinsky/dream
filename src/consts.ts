export const saveName = "ayhiadream"

export const roomDepth = 64, rows = 5, cols = 3, roomHeight = 128, roomWidth = 256, quadSize = 8, roomsNum = rows * cols;

export let lastSpriteId = 0;

export function setLastSpriteId(v: number) {
  lastSpriteId = v;
}

export function nextSpriteId() {
  return ++lastSpriteId
}

declare global {
    interface Window { 
      save 
      load
      selp
    }
}
