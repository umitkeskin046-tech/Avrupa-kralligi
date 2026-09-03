export const resourceKeys = ["Ekmek", "Odun", "Taş", "Demir", "Elmas"];

export const initialResources = {
  Ekmek: 1250000,
  Odun: 860000,
  Taş: 415000,
  Demir: 182000,
  Elmas: 12450,
};

export const constructionConfig = {
  defaultQueues: 2,
  starterWorkers: 2,
  speedMultiplier: 1,
};

export const troopCatalog = [
  { id: "infantry", name: "Piyade", unlockBuilding: "barracks", powerByTier: 10 },
  { id: "cavalry", name: "Süvari", unlockBuilding: "stable", powerByTier: 12 },
  { id: "archer", name: "Okçu", unlockBuilding: "archery", powerByTier: 11 },
];

export const troopTiers = Array.from({ length: 10 }, (_, index) => ({
  tier: index + 1,
  unlockCityLevel: index + 1,
  cost: { Ekmek: 20 + index * 12, Odun: 12 + index * 8, Demir: index * 5 },
  seconds: 8 + index * 7,
}));

export const researchCatalog = [
  { id: "food-production", name: "Yiyecek üretimi", branch: "EKONOMİ", unlockBuilding: "academy", level: 1, cost: { Ekmek: 150, Odun: 100 }, seconds: 30 },
  { id: "construction-speed", name: "İnşaat hızı", branch: "GELİŞİM", unlockBuilding: "academy", level: 1, cost: { Ekmek: 200, Odun: 150 }, seconds: 35 },
  { id: "infantry-attack", name: "Piyade saldırısı", branch: "SAVAŞ", unlockBuilding: "academy", level: 1, cost: { Ekmek: 250, Demir: 100 }, seconds: 40 },
];

export const heroCatalog = [
  { id: "aldric", name: "Sir Aldric", className: "Piyade", level: 1, exp: 0, stars: 1, tier: 1, attack: 24, defense: 28, health: 120, skills: ["Çelik Duvar"] },
  { id: "maelis", name: "Maelis de Veyne", className: "Süvari", level: 1, exp: 0, stars: 1, tier: 1, attack: 31, defense: 20, health: 105, skills: ["Kış Hücumu"] },
  { id: "rowan", name: "Rowan Hart", className: "Okçu", level: 1, exp: 0, stars: 1, tier: 1, attack: 29, defense: 18, health: 95, skills: ["Uzak Menzil"] },
  { id: "elis", name: "Elis von Arne", className: "Destek", level: 1, exp: 0, stars: 1, tier: 1, attack: 16, defense: 24, health: 110, skills: ["Şifa İlmeği"] },
];

export const initialTroops = {
  infantry: { 1: 100 },
  cavalry: { 1: 0 },
  archer: { 1: 0 },
};

export const initialPlayer = {
  id: "local-player",
  name: "Lord Ümit",
  chief: { level: 1, exp: 0, power: 0, equipment: {} },
  vip: { level: 0, points: 0 },
};
