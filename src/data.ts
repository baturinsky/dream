import { aspectsFromString, TAspects } from "./aspects";
import { numberValues } from "./util";

export const Aspects = numberValues(Object.fromEntries(
  `Health:So called Hit Points:31
Strength:Dealing Damage:fg
Resilience:Damage reduction:qp
Greed:Find More:c4
Bloom:Regeneration:ba
Courage:Cover your allies:21
Anger:Avenge Damage:uv
Mercy:Heal Friends:lx
Knowledge:Reading and writing Tomes:mn
Light:Strike True:je
Dark:Evade:o8
Time:Action Rate:lm
Purity:Resist Poison:rq
Venom:Poison foe:ba`.split("\n").map((line, ind) => {
    let [name, tip, colors] = line.split(":");
    let l = name[0];
    return [l, { l, name, tip, colors, ind }]
  })))


export type TMaterial = {
  name
  colors
  aspects
  chance
  room
}


export const Materials = numberValues(Object.fromEntries(
  `Wooden:67:H:10
Iron:lm:S:10
Stone:mn:R:10
Golden:c4:G:2
Plant:ba:B:5
Leather:56:C:5
Bone:ji:A:5
Cloth:tv:M:10
Paper:kl:K:5
Glass:wr:L:5
Obsidian:no:D:2
Copper:ef:T:5
Silver:lx:PM:3
Asbestos:kb:V:1
Abstract:::1`.split("\n").map(line => {
    let [name, colors, aspects, chance] = line.split(":")
    return [name, { colors, aspects: aspectsFromString(aspects), chance }]
  }))) as { [id: string]: TMaterial }


export type TItem = {
  scale: number,
  aspects: TAspects,
  material: string,
  chance: number,
  ind: number,
  type: string,
  placeh: number,
  hrz: boolean
  use?: 'armor'
};

export const ArmorsStartAt = 23

export const Items = numberValues(Object.fromEntries(
  `Door:2::Wooden:0:1:
Bed:2:H:Wooden:20:.5:
Column:3:R:Stone:0:1:
Apple:1:B:Plant:10:1:
Chair:1.5:H:Wooden:10:1:
Chest:1:G:Wooden:10:1:
Shelf:2:G:Wooden:3:1:
Stand:2:S:Stone:3:1:base
Display:2::Glass:3:1:
Plaque:2:R:Iron:3:1:base
Big Table:2:R:Stone:3:1:base
Display:2::Glass:3:1:base
Trinket:1::Glass:5:1:
Table:2::Wooden:3:.5:base
Clock:1:T:Golden:10:1:
Pedestal:1.5::Wooden:3:1:base
Mirror:2::Glass:5:1:
Angel:2:P:Silver:10:1:
Press:2::Iron:0:1:
Brush:1:::5:1:
Wine:1:A:Plant:5:1:
Extractor:1:::5:1:
Essense:1:::5:1:
Shirt:1:T:Cloth:5:1:armor
Robe:1:M:Paper:5:1:armor
Chain:1:S:Iron:5:1:armor
Plate:1:R:Iron:5:1:armor
Sword:1:S:Iron:10:1:
Axe:1:T:Iron:10:1:
Hammer:1:S:Stone:2:1:
Spear:1:R:Wooden:10:1:
Wand:1:M:Silver:10:1:
Shrinker:1:D::2:1:
Magnifier:1:L::2:1:
Tome:1:::5:1:
Cactus:1:V::5:1:
`.split("\n").map((line, ind) => {
    let [type, scale, aspects, material, chance, placeh, use] = line.split(":");
    return [type, {
      use, type, scale, aspects: aspectsFromString(aspects), material,
      chance: chance ?? 0, ind, placeh
    }]
  }))) as { [id: string]: TItem };


//Items.Brush.hrz = true;

export type TRace = { ind: number, name: string, aspects: TAspects, chance: number };

export const Races = numberValues(Object.fromEntries(
  `Human:G
Elf:B
Cat:D
Ogre:H
Fairy:M
Bird:L
Rat:D
Raven:A
Skel:C
Imp:V
Dog:S
Hippo:H
Lizard:B
Drago:P
Alien:K
Hare:T`.split("\n").map((line, ind) => {
    let [name, aspects] = line.split(":");
    return [name, { name, aspects: aspectsFromString(aspects), ind, chance: 1 / (10 + ind) }
    ]
  }))) as { [id: string]: TRace };


export type TRaceOrItem = TRace | TItem

export const Types = { ...Races, ...Items } as { [id: string]: TRaceOrItem }


export const tips = {
  1: `LMB to switch current character, walk around and pick/place items. RMB to use items (such as Bed).`,
  2: "An item that you have found in the dream. Looking at it (happens automatically when awake) can help to remember something about reality (i.e. raise aspects).",
  Bed: "RMB to sleep. Level up and find items in dreams. What you find in the dream is affected by the room number and the aspects of the bed and the dreamer. RMB to wake.",
  Brush: "Can recolor items.",
  Clock: "Put on the bed to sleep automatically.",
  Hammer: "For the deep analysis (RMB with it in hand on some disposable item).",
  Extractor: "Extract essense from the item. User's, extractor's and item's aspects should match for best results.",
  Tome: "Hold to write in",
  armor: "RMB to wear",
  base: "Can't be examined by itself, gives bonuses to items on it."
}

export const skyStops = [["#00f", "#f80"], ["#88f", "#00f"], ["#008", "#00f"]]