// Mutable PROTOTYPE parameters. These values do not amend the agreed GDD.
export const CONFIG = { phoneResearchMs:240000,
  bridge: { y:12,h:3,need:{wood:24,stone:16},stages:[
    {title:'Опоры моста',works:2,wood:0,stone:16},
    {title:'Настил переправы',works:3,wood:24,stone:0},
    {title:'Перила и открытие',works:2,wood:0,stone:0}
  ] },
  seedMarket: {need:{wood:8,stone:6},stages:[
    {title:'Площадка лавки',works:1,wood:2,stone:2},
    {title:'Коробка лавки',works:2,wood:3,stone:2},
    {title:'Отделка и открытие',works:1,wood:3,stone:2}
  ]},
  cityGarden: {need:{wood:6,stone:4},stages:[
    {title:'Разметка и площадка огорода',works:1,wood:2,stone:1},
    {title:'Короба и водосбор',works:2,wood:2,stone:1},
    {title:'Грядки и запуск',works:1,wood:2,stone:2}
  ]},
  toolMaking: { durability:48, recipe:{wood:2,stone:2} },
  toolShop: { durability:160, price:180 },
  warehouse: { capacity:80, pay:{wood:1,stone:1}, mayorNeed:{wood:12,stone:12}, courierBatch:6, courierPay:2, reservationMs:300000 },
  expedition: {gate:{id:'frontier-gate',type:'mission',x:31,y:35}},
  width: 160, height: 80, river: { x: 34, w: 4 },
  treasury: 1000, plotPrice: 120, capacity: 12,
  weights: { seed_tree_broadleaf:.1,seed_tree_round:.1,seed_tree_oak:.1,seed_tree_spruce:.1,seed_tree_small:.1,wood: 1, stone: 2, food: 1, seed_hemp:.1, seed_carrot:.1, hemp:1, carrot:1, water:1 },
  need: { wood: 40, stone: 40 }, pay: { wood: 2, stone: 3, work: 10 },
  stages: [
    { title: 'Подготовка', works: 2, wood: 0, stone: 0 },
    { title: 'Основание и покрытие', works: 4, wood: 0, stone: 40 },
    { title: 'Завершение', works: 2, wood: 40, stone: 0 }
  ],
  forge: { need: {wood:24,stone:24}, stages: [
    {title:'Фундамент кузницы',works:2,wood:0,stone:24},
    {title:'Стены и крыша',works:3,wood:24,stone:0},
    {title:'Обустройство горна',works:2,wood:0,stone:0}
  ] },
  toolDurability: 16, mineMs: 550, buildMs: 1100, gatherMs: 350,
  speed: 4, slowSpeed: 2.8, hungerPerSecond: 0.14, slowBelow: 25,
  foodRestore: 65, berryRegrowMs: 8000, foodStock: 6,
  actionRange: 2.25, chatRange: 18,
  staminaDrain: 18, staminaRegen: 15, sprintMultiplier: 1.5
};
