export const buildingUnlockLevels = {
  housing: 1,
  mill: 1,
  sawmill: 1,
  quarry: 2,
  granary: 2,
  "mess-hall": 2,
  embassy: 3,
  academy: 3,
  barracks: 3,
  hospital: 4,
  archery: 4,
  stable: 5,
  "iron-mine": 5,
  market: 6,
  smithy: 6,
  "command-center": 7,
  "guard-post": 7,
  court: 8,
  "defense-tower": 8,
  "animal-pen": 9,
};

export const cityExpansionStages = [
  { minLevel: 1, stage: 1, name: "Küçük Yerleşim" },
  { minLevel: 6, stage: 2, name: "Kasaba" },
  { minLevel: 11, stage: 3, name: "Surlu Şehir" },
  { minLevel: 16, stage: 4, name: "Büyük Şehir" },
  { minLevel: 21, stage: 5, name: "Başkent" },
  { minLevel: 26, stage: 6, name: "Kraliyet Başkenti" },
];

export const getCityExpansionStage = (cityLevel) =>
  [...cityExpansionStages].reverse().find((stage) => cityLevel >= stage.minLevel) || cityExpansionStages[0];
