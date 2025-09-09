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
Knowledge:Writing and Reading:mn
Light:Strike True:je
Dark:Evade:o8
Time:Action Rate:lm
Purity:Resist Poison:rq
Venom:Poison:ba`.split("\n").map((line, ind) => {
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
Iron:32:S:10
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
Silver:lx:P:3
Asbestos:kb:V:1
Abstract:::1`.split("\n").map(line => {
    let [name, colors, aspects, chance] = line.split(":")
    return [name, { colors, aspects: aspectsFromString(aspects), chance }]
  }))) as {[id:string]:TMaterial}


export type TItem = {
  scale: number,
  aspects: TAspects,
  material: string,
  chance: number,
  ind: number,
  type: string,
  placeh: number,
  hrz: boolean
  armor: boolean
};

export const ArmorsStartAt = 23

export const Items = numberValues(Object.fromEntries(
  `Door:2:10:Wooden:0:1:
Bed:2:H:Wooden:10:.5:
Column:3:R:Stone:0:1:
Apple:1:B:Plant:10:1:
Chair:1.5:H:Wooden:10:1:
Chest:1:G:Wooden:10:1:
Shelf:2:G:Wooden:0:1:
Stand:2::Stone:0:1:
Display:2::Glass:0:1:
Plaque:2::Iron:0:1:
Big Table:2:R:Stone:0:1:
Display:2::Glass:0:1:
Dial:2::Glass:0:1:
Table:2::Wooden:10:.5:
Clock:1:T:Golden:1:1:
Pedestal:1::Wooden::1:
Mirror:2::Glass:5:1:
Angel:2:P:Silver:3:1:
Press:2::Iron:0:1:
Brush:1:::0:1:
Wine:1:A:Plant:5:1:


Shirt:1:T::1
Robe:1:M::1
Chain:1:S::1
Plate:1:R::1`.split("\n").map((line, ind) => {
    let [type, scale, aspects, material, chance, placeh] = line.split(":");
    return [type, { armor:ind>=ArmorsStartAt, type, scale, aspects: aspectsFromString(aspects), material, chance: chance ?? 0, ind, placeh }]
  }))) as { [id: string]: TItem };

console.log(Items);

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
  Bed: "RMB to sleep. You can increase your level and find some items in dreams. What you find in the dream is affected by the room number and the aspects of the bed and the dreamer.",
  Brush: "Can recolor items"
}