const building = (id, name, category, plotSize, unlockCityLevel, className, unique = false) => ({
  id, name, category, plotSize, unlockCityLevel, maxLevel: 30, built: false, level: 0,
  unique, image: null, buildCost: { Ekmek: 100, Odun: 100, Taş: 0, Demir: 0 }, className,
  description: name + " krallığın gelişimine katkı sağlar.", feature: "Gelişim gücü", unit: "%", baseValue: 10,
});

export const buildingCatalog = [
  building("housing", "Konutlar", "civil", "small", 1, "housing"),
  building("mill", "Değirmen", "production", "small", 1, "mill"),
  building("sawmill", "Kerestehane", "production", "medium", 1, "sawmill"),
  building("quarry", "Taş Ocağı", "production", "medium", 2, "quarry"),
  building("granary", "Ambar", "production", "medium", 2, "granary"),
  building("mess-hall", "Yemekhane", "civil", "medium", 2, "messHall"),
  building("embassy", "Elçilik", "special", "large", 3, "embassy", true),
  building("academy", "Akademi", "special", "large", 3, "academy", true),
  building("barracks", "Piyade Kışlası", "military", "large", 3, "barracks", true),
  building("hospital", "Şifahane", "special", "large", 4, "hospital", true),
  building("archery", "Okçu Talimhanesi", "military", "large", 4, "archery", true),
  building("stable", "Süvari Ahırı", "military", "large", 5, "stable", true),
  building("iron-mine", "Demir Madeni", "production", "medium", 5, "ironMine"),
  building("market", "Pazar", "civil", "medium", 6, "market", true),
  building("smithy", "Demirhane", "production", "medium", 6, "smithy", true),
  building("command-center", "Komuta Merkezi", "military", "large", 7, "commandCenter", true),
  building("guard-post", "Muhafız İstasyonu", "defense", "medium", 7, "guardPost", true),
  building("court", "Adliye", "special", "large", 8, "court", true),
  building("defense-tower", "Savunma Kulesi", "defense", "small", 8, "defenseTower", true),
  building("animal-pen", "Hayvan Kafesi", "civil", "medium", 9, "animalPen"),
  { ...building("city-center", "Şehir Merkezi", "special", "large", 1, "cityCenter", true), isCityCenter: true, buildCost: { Ekmek: 0, Odun: 0, Taş: 0, Demir: 0 } },
];
