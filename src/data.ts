export const aspects = Object.fromEntries(
  `Health:So called Hit Points:31
Strength:Dealing Damage:fg
Resilience:Damage reduction:qp
Greed:Find More:c4
Bloom:Regeneration:tu
Courage:Cover your allies:a9
Anger:Avenge Damage:cd
Mercy:Heal Friends:23
Knowledge:Writing and Reading:mn
Light:Strike True:lk
Dark:Avoid Damage:no
Time:Attack Rate:rq
Purity:Resist Poison:4u
Venom:Poison:ba`.split("\n").map((line, i)=>{
  let [name,tip,colors]=line.split(":");
  let l = name[0];
  return [l, {name, tip, colors}]
}))

export const materials = Object.fromEntries(
`Wood:67:H
Iron:32:S
Stone:mn:R
Gold:c4:G
Leaf:ba:B
Leather:56:C
Bone:ji:A
Cloth:tv:M
Paper:kl:K
Glass:wr:L
Obsidian:no:D
Copper:ef:T
Silver:lx:P
Asbestos:kb:V`.split("\n").map(line=>{
  let [name, colors, aspect] = line.split(":")
  return [name, {colors, aspect}]
}));


console.log(materials);

export const furniture = 
`Door
Bed
Chair
Chest
Shelf
Stand
Display
Plaque
Table
Display2
Dial
Bench
Clock
Pedestal
Grave
Angel
Press
Brush
`

export const races = 
`Human:G
Elf:B
Cat:D
Ogre:M
Fairy
Bird
Rat
Raven
Skel
Imp
Dog
Hippo
Lizard
Drago
Alien
Hare`

export const suit = 
`Shirt
Robe
Chain
Plate`