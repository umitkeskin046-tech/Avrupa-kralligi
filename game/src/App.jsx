import { useEffect, useState } from "react";
import "./App.css";
import { buildingCatalog } from "./data/cityBuildings";
import { cityPlots } from "./data/cityPlots";
import { cityTutorial } from "./data/cityTutorial";
import { getCityExpansionStage } from "./data/cityProgression";
import {
  heroCatalog,
  initialPlayer,
  initialResources,
  initialTroops,
  resourceKeys,
  researchCatalog,
  troopCatalog,
} from "./data/gameConfig";
import { loadGame, saveGame } from "./systems/persistence";
import cityBackgroundImage from "./assets/sehir-zemin.jpg";

const resourceNames = resourceKeys.filter((name) => name !== "Elmas");

const cityBuildings = buildingCatalog;
// AVRUPA KRALLIĞI GÖRSEL KİLİDİ: gerçekçi kış orta çağ PNG'leri; karton, emoji ve SVG bina yok.
const buildingAssetFiles = import.meta.glob("./assets/buildings/*.png", {
  eager: true,
  import: "default",
  query: "?url",
});
const buildingAssetById = Object.fromEntries(
  Object.entries(buildingAssetFiles).map(([path, image]) => [path.split("/").pop().replace(".png", ""), image])
);

const defaultGameState = {
  player: initialPlayer,
  resources: initialResources,
  buildings: cityBuildings.map((building) => ({
    id: building.id,
    built: building.built,
    level: building.level,
  })),
  plots: cityPlots,
  constructionQueues: [],
  troops: initialTroops,
  troopDefinitions: troopCatalog,
  trainingQueues: [],
  heroes: heroCatalog,
  research: researchCatalog.map((research) => ({ id: research.id, level: 0, researching: false })),
  hospital: { wounded: { infantry: 0, cavalry: 0, archer: 0 }, capacity: 0 },
  marches: 0,
  quests: cityTutorial,
};

const savedGame = loadGame(defaultGameState);
function BuildingSprite({ variant }) {
  const isCenter = variant === "cityCenter";
  const isProduction = ["mill", "sawmill", "quarry", "ironMine", "granary", "smithy"].includes(variant);
  const isMilitary = ["commandCenter", "barracks", "stable", "archery"].includes(variant);
  const isDefense = ["guardPost", "defenseTower"].includes(variant);
  const isMarket = variant === "market";
  const isHousing = variant === "housing";
  const isCourt = variant === "court";
  const isHospital = variant === "hospital";
  const isMessHall = variant === "messHall";
  const isAnimalPen = variant === "animalPen";

  return (
    <svg className={"buildingSprite" + (isCenter ? " cityCenterSprite" : "")} viewBox="0 0 180 140" aria-hidden="true">
      <ellipse cx="90" cy="130" rx={isCenter ? "70" : "54"} ry="8" fill="#17252b" opacity=".5" />
      <path d={isDefense ? "M57 124 61 40h58l4 84Z" : isAnimalPen ? "M24 112h132M34 112V62h112v50Z" : "M28 119V58h124v61Z"} fill={isDefense ? "#777873" : isMilitary || isCourt || isHospital ? "#686c69" : "#765541"} stroke="#2d302e" strokeWidth={isCenter ? "5" : "4"} />
      <path d={isDefense ? "M55 42h70v17H55Z" : isAnimalPen ? "m28 63 62-39 62 39-8 8-54-30-54 30Z" : "m20 60 70-44 70 44-9 10-61-36-61 36Z"} fill={isDefense ? "#60625d" : "#54302c"} stroke="#282321" strokeWidth={isCenter ? "5" : "4"} />
      <path d="M44 48h92" stroke="#edf0eb" strokeWidth={isCenter ? "6" : "5"} opacity=".85" />
      {isCenter && <><path d="M90 18V5M90 7h30L90 23Z" fill="#82443b" stroke="#614132" strokeWidth="3" /><path d="M90 5c-9-13 13-14 4-26" fill="none" stroke="#c1cbc8" strokeWidth="4" opacity=".45" /><path d="M61 58V31h18v19M101 58V31h18v19" fill="#74756f" stroke="#2d302e" strokeWidth="4" /></>}
      {!isCenter && <><path d="M68 119V78h24v41" fill="#2b2521" stroke="#b58b50" strokeWidth="3" /><path d="M47 68h18v15H47m68 0H97V68h18" fill="#f0c15f" stroke="#493126" strokeWidth="3" /></>}
      {isProduction && <><path d="M38 87h27M115 87h27" stroke="#b98b4d" strokeWidth="7" /><circle cx="39" cy="99" r="9" fill="#8b5d38" stroke="#3b2922" strokeWidth="3" /><circle cx="57" cy="103" r="7" fill="#9b6a3f" stroke="#3b2922" strokeWidth="3" /><path d="M76 42h34" stroke="#d9c296" strokeWidth="4" /></>}
      {variant === "mill" && <><circle cx="35" cy="78" r="20" fill="#68452f" stroke="#bd9255" strokeWidth="4" /><path d="M35 58v40M15 78h40M21 64l28 28M49 64 21 92" stroke="#c09a5d" strokeWidth="3" /></>}
      {variant === "ironMine" && <path d="m54 119 5-28 21-15 21 15 5 28Z" fill="#242522" stroke="#785535" strokeWidth="5" />}
      {isMilitary && <><path d="M30 42v-18h12v14M138 42V24h12v14" fill="#73746e" stroke="#302a25" strokeWidth="3" /><path d="M30 25V8M30 10h22L30 21M150 25V8M150 10h-22l22 11" stroke="#8f6339" strokeWidth="3" /></>}
      {variant === "stable" && <path d="M45 91h26v18H45m64-18h26v18h-26" fill="#30251f" stroke="#b98b4d" strokeWidth="3" />}
      {variant === "archery" && <><circle cx="45" cy="88" r="15" fill="#9d4b38" stroke="#e0bf76" strokeWidth="3" /><circle cx="45" cy="88" r="6" fill="#5d322b" /><path d="M113 72v35M102 83h22M106 77l14 22M120 77l-14 22" stroke="#b98b4d" strokeWidth="3" /></>}
      {isMarket && <><path d="M25 72h45L47 47Z" fill="#824238" stroke="#30251f" strokeWidth="3" /><path d="M91 72h55l-27-25Z" fill="#526b65" stroke="#30251f" strokeWidth="3" /><path d="M31 88h18v12H31m62 0h22V87H93" fill="#d0a15c" stroke="#533725" strokeWidth="3" /></>}
      {isHousing && <><path d="M22 65 52 38l30 27M75 57l30-27 30 27" fill="none" stroke="#eef0ea" strokeWidth="5" /><path d="M34 76h12v12H34m65-12h12v12H99" fill="#f3c86b" stroke="#4b3225" strokeWidth="2" /></>}
      {isCourt && <path d="M40 119V77h18v42M81 119V77h18v42M122 119V77h18v42" fill="#e6ddd0" stroke="#4e4740" strokeWidth="3" />}
      {isHospital && <path d="M72 78h36v13H72m11-18v23" stroke="#eee6d6" strokeWidth="5" />}
      {isMessHall && <path d="M111 48V15h13v35M115 12c-8-12 12-14 4-24" fill="none" stroke="#aeb9b5" strokeWidth="4" opacity=".65" />}
      {isAnimalPen && <path d="M34 112V70M58 70v42M82 70v42M106 70v42M130 70v42M146 112V70" stroke="#a57443" strokeWidth="4" />}
      {isCenter && <path d="M39 60h102" stroke="#eef0ea" strokeWidth="6" opacity=".8" />}
    </svg>
  );
}

/* SVG city artwork removed: the background image remains the only building visual.
function BuildingSprite({ variant }) {
  const isHousing = variant === "housing";
  const isMill = variant === "mill";
  const isSawmill = variant === "sawmill";
  const isQuarry = variant === "quarry";
  const isMine = variant === "ironMine";
  const isMessHall = variant === "messHall";
  const isGranary = variant === "granary";
  const isMarket = variant === "market";
  const isSmithy = variant === "smithy";
  const isCommand = variant === "commandCenter";
  const isGuard = variant === "guardPost";
  const isCourt = variant === "court";
  const isAnimalPen = variant === "animalPen";
  const isTower = variant === "defenseTower";

  return (
    <span />
    {
      <ellipse cx="80" cy="108" rx="55" ry="7" fill="#1e211e" opacity=".45" />
      {isHousing && (
        <>
          <path d="M18 96V58l25-21 25 21v38Z" fill="#796653" stroke="#30251f" strokeWidth="3" />
          <path d="m13 59 30-29 30 29-7 6-23-22-23 22Z" fill="#59342d" stroke="#30251f" strokeWidth="3" />
          <path d="M78 96V50l28-24 28 24v46Z" fill="#84725f" stroke="#30251f" strokeWidth="3" />
          <path d="m72 51 34-30 34 30-7 7-27-23-27 23Z" fill="#673a30" stroke="#30251f" strokeWidth="3" />
          <path d="M39 42v-12h7v8M110 33V19h7v10" stroke="#3b2b25" strokeWidth="4" />
          <path d="M29 68h10v10H29zm34 0h10v10H63zm37-2h11v11h-11z" fill="#f3c86b" stroke="#4b3225" strokeWidth="2" />
          <path d="M47 96V75h13v21M118 96V72h13v24" fill="#30251f" stroke="#b3874c" strokeWidth="2" />
          <path d="M13 59h60M72 51h68" stroke="#eef0e8" strokeWidth="5" opacity=".9" />
        </>
      )}
      {isMill && (
        <>
          <path d="M38 101V52l43-25 43 25v49Z" fill="#735442" stroke="#30251f" strokeWidth="4" />
          <path d="m31 55 50-34 50 34-8 7-42-27-42 27Z" fill="#5d352e" stroke="#30251f" strokeWidth="4" />
          <circle cx="38" cy="77" r="22" fill="#68452f" stroke="#b3884d" strokeWidth="4" />
          <path d="M38 55v44M16 77h44M23 62l30 30M53 62 23 92" stroke="#c09a5d" strokeWidth="4" />
          <path d="M68 78h22v23H68zM96 81h16v20H96z" fill="#ad8251" stroke="#493126" strokeWidth="3" />
          <path d="M48 40h65" stroke="#eef0e8" strokeWidth="6" opacity=".9" />
        </>
      )}
      {isSawmill && (
        <>
          <path d="M26 98V55h108v43Z" fill="#704b35" stroke="#30251f" strokeWidth="4" />
          <path d="m20 57 60-30 60 30-7 8-53-25-53 25Z" fill="#5d352e" stroke="#30251f" strokeWidth="4" />
          <path d="M38 61v37M58 61v37M78 61v37M98 61v37M118 61v37" stroke="#b88b56" strokeWidth="3" opacity=".7" />
          <path d="M25 104h43M79 104h49" stroke="#9a6a40" strokeWidth="8" />
          <circle cx="30" cy="102" r="8" fill="#8b5d38" stroke="#38261f" strokeWidth="3" /><circle cx="48" cy="105" r="7" fill="#9b6a3f" stroke="#38261f" strokeWidth="3" />
          <path d="M42 42h77" stroke="#eef0e8" strokeWidth="6" opacity=".9" />
        </>
      )}
      {isQuarry && (
        <>
          <path d="m24 98 18-43 30 12 25-29 39 60Z" fill="#716e67" stroke="#302c29" strokeWidth="4" />
          <path d="m42 54 30 13 25-29 39 60H24Z" fill="#8b8981" opacity=".5" />
          <path d="M92 31v48M82 40h22M92 31l-14 13M92 31l14 13" stroke="#795535" strokeWidth="4" />
          <path d="M31 97h21v-16H31zm94 0h18v-13h-18zM60 99h18v-12H60z" fill="#a69e8e" stroke="#45413b" strokeWidth="3" />
          <path d="M50 53 70 62M107 39l18 10" stroke="#edf0e9" strokeWidth="5" />
        </>
      )}
      {isMine && (
        <>
          <path d="m18 99 17-42 34-25 42 17 31 50Z" fill="#555550" stroke="#292c29" strokeWidth="4" />
          <path d="m44 98 5-28 19-13 19 13 5 28Z" fill="#242522" stroke="#785535" strokeWidth="5" />
          <path d="M49 71 68 58l19 13M54 68v30M82 68v30" stroke="#9a7245" strokeWidth="5" />
          <path d="M31 101h22M112 101h25" stroke="#a78a5f" strokeWidth="7" />
          <path d="M72 90h21v12H72z" fill="#8e8068" stroke="#332b25" strokeWidth="3" />
          <path d="M30 56 68 32M104 49l31 12" stroke="#eef0e8" strokeWidth="5" opacity=".8" />
        </>
      )}
      {isMessHall && (
        <>
          <path d="M27 101V48h106v53Z" fill="#7d5a40" stroke="#30251f" strokeWidth="4" />
          <path d="m20 51 60-35 60 35-8 8-52-27-52 27Z" fill="#63382e" stroke="#30251f" strokeWidth="4" />
          <path d="M105 35V12h13v29" fill="#55504a" stroke="#2c2927" strokeWidth="4" />
          <path d="M111 10c-9-13 13-13 4-25" fill="none" stroke="#b9c2bf" strokeWidth="4" opacity=".5" />
          <path d="M67 101V76h25v25M36 64h15v12H36m58 0h15V64H94" fill="#2c211c" stroke="#b98b4d" strokeWidth="3" />
          <path d="M35 45h89" stroke="#eef0e8" strokeWidth="6" opacity=".9" />
        </>
      )}
      {isGranary && (
        <>
          <path d="M25 101V48h110v53Z" fill="#79543a" stroke="#30251f" strokeWidth="4" />
          <path d="m18 51 62-36 62 36-8 8-54-28-54 28Z" fill="#60362e" stroke="#30251f" strokeWidth="4" />
          <path d="M42 61v40M118 61v40M42 61h76" stroke="#b88a52" strokeWidth="3" />
          <path d="M54 69h25v32H54zm27 0h25v32H81" fill="#36271f" stroke="#c09250" strokeWidth="3" />
          <path d="M30 83h15v15H30m84-15h15v15h-15" fill="#c29151" stroke="#4a3225" strokeWidth="3" />
          <path d="M35 45h90" stroke="#eef0e8" strokeWidth="7" opacity=".9" />
        </>
      )}
      {isMarket && (
        <>
          <path d="M20 96h120M28 96V58h34v38M86 96V58h46v38" fill="#8b6848" stroke="#30251f" strokeWidth="4" />
          <path d="M22 57h46L45 36Z" fill="#7c4032" stroke="#30251f" strokeWidth="3" /><path d="M82 57h54l-27-22Z" fill="#526b65" stroke="#30251f" strokeWidth="3" />
          <path d="M36 72h17v12H36m59-2h20V69H95" fill="#d0a15c" stroke="#533725" strokeWidth="3" />
          <path d="M28 96V58M62 58v38M86 58v38M132 58v38" stroke="#bd8d50" strokeWidth="3" />
        </>
      )}
      {isSmithy && (
        <>
          <path d="M30 101V52h100v49Z" fill="#68645b" stroke="#2f2b27" strokeWidth="4" />
          <path d="m22 54 58-35 58 35-8 8-50-28-50 28Z" fill="#5a332b" stroke="#30251f" strokeWidth="4" />
          <path d="M104 35V11h13v31" fill="#55504a" stroke="#292624" strokeWidth="4" /><path d="M111 10c-8-11 12-14 4-24" fill="none" stroke="#c0c7c1" strokeWidth="4" opacity=".5" />
          <path d="M42 91h32l-7-8H51zM77 91h25" fill="#32251e" stroke="#c09250" strokeWidth="3" /><path d="M61 91v-18" stroke="#d8a84f" strokeWidth="4" />
          <path d="M38 45h84" stroke="#eef0e8" strokeWidth="6" opacity=".9" /><path d="M111 65c-8-9 9-13 0-21" fill="none" stroke="#ffca58" strokeWidth="4" />
        </>
      )}
      {isCommand && (
        <>
          <path d="M30 101V43h100v58Z" fill="#68655c" stroke="#30251f" strokeWidth="5" /><path d="M24 44 80 12l56 32-8 8-48-26-48 26Z" fill="#59332c" stroke="#30251f" strokeWidth="5" />
          <path d="M36 43V25h12v12M112 43V25h12v12" fill="#75736b" stroke="#30251f" strokeWidth="4" /><path d="M80 101V70h24v31" fill="#2b211d" stroke="#c09250" strokeWidth="3" /><path d="M54 59h18v15H54m35-15h18v15H89" fill="#e8b95c" stroke="#453126" strokeWidth="3" />
          <path d="M16 37V82M144 37v45M10 38h12M138 38h12" stroke="#8f6339" strokeWidth="4" /><path d="M16 38h17l-17 12zM144 38h-17l17 12z" fill="#824036" />
          <path d="M30 39h100" stroke="#eef0e8" strokeWidth="6" />
        </>
      )}
      {isGuard && (
        <>
          <path d="M47 101V43h66v58Z" fill="#6f6d65" stroke="#30251f" strokeWidth="4" /><path d="m40 45 40-30 40 30-7 7-33-24-33 24Z" fill="#59332c" stroke="#30251f" strokeWidth="4" />
          <path d="M64 101V75h32v26M56 59h15v13H56m33-13h15v13H89" fill="#2c211c" stroke="#b98a4c" strokeWidth="3" /><path d="M80 15V2M80 5h21l-21 10z" stroke="#805039" strokeWidth="3" fill="#804036" /><path d="M44 40h72" stroke="#eef0e8" strokeWidth="6" />
        </>
      )}
      {isCourt && (
        <>
          <path d="M25 101V47h110v54Z" fill="#888277" stroke="#302c28" strokeWidth="4" /><path d="m18 49 62-35 62 35-8 8-54-27-54 27Z" fill="#63382e" stroke="#30251f" strokeWidth="4" />
          <path d="M39 101V76h14v25M73 101V76h14v25M107 101V76h14v25" fill="#e6ddd0" stroke="#4e4740" strokeWidth="3" /><path d="M64 55h32v21H64z" fill="#2d2621" stroke="#bd9152" strokeWidth="3" /><path d="M80 14v-10" stroke="#4b4037" strokeWidth="4" /><path d="M25 43h110" stroke="#eef0e8" strokeWidth="6" />
        </>
      )}
      {isAnimalPen && (
        <>
          <path d="M23 92 43 64h73l21 28" fill="none" stroke="#9d7042" strokeWidth="5" /><path d="M28 92v13M48 72v33M69 67v38M91 67v38M113 72v33M133 92v13" stroke="#8b5f38" strokeWidth="5" />
          <path d="M55 100V57l26-20 26 20v43Z" fill="#79543a" stroke="#30251f" strokeWidth="4" /><path d="m49 58 32-27 32 27-7 7-25-20-25 20Z" fill="#60362e" stroke="#30251f" strokeWidth="4" /><path d="M68 75h26v16H68z" fill="#30231e" stroke="#bd9152" strokeWidth="3" /><path d="M75 36h47" stroke="#eef0e8" strokeWidth="5" />
        </>
      )}
      {isTower && (
        <>
          <path d="M48 106 54 29h52l6 77Z" fill="#77766f" stroke="#2f2d29" strokeWidth="5" /><path d="M45 31h70v16H45z" fill="#66655f" stroke="#302c28" strokeWidth="4" /><path d="M53 29 64 16h32l11 13Z" fill="#eef0e8" stroke="#55524c" strokeWidth="3" /><path d="M61 25h10v7H61m18-7h10v7H79m18-7h10v7H97" fill="#4d4a44" /><path d="M67 55h24v17H67z" fill="#2d2621" stroke="#b98a4c" strokeWidth="3" /><path d="M80 16V2M80 4h24l-24 13z" stroke="#805039" strokeWidth="3" fill="#804036" /><path d="M40 104h80" stroke="#eef0e8" strokeWidth="5" />
        </>
      )}
      {!isHousing && !isMill && !isSawmill && !isQuarry && !isMine && !isMessHall && !isGranary && !isMarket && !isSmithy && !isCommand && !isGuard && !isCourt && !isAnimalPen && !isTower && (
        <>
          <path d="M32 101V48h96v53Z" fill="#77736a" stroke="#30251f" strokeWidth="4" /><path d="m24 50 56-34 56 34-8 8-48-27-48 27Z" fill="#59332c" stroke="#30251f" strokeWidth="4" /><path d="M70 101V76h20v25M45 62h17v13H45m53-13h17v13H98" fill="#f0c15f" stroke="#443027" strokeWidth="3" /><path d="M32 43h96" stroke="#eef0e8" strokeWidth="6" />
        </>
      )}
    }
  );
}
*/

const formatResource = (value) =>
  value >= 1000000
    ? (value / 1000000).toFixed(2).replace(/\.00$/, "") + "M"
    : value >= 1000
    ? Math.round(value / 1000) + "K"
    : String(value);

const getUpgradeCost = (building, buildingIndex) => {
  const nextLevel = building.level + 1;
  const step = Math.max(1, nextLevel - 1);
  const scale = 1 + buildingIndex * 0.045;
  return {
    Ekmek: Math.round(500 * step ** 1.25 * scale),
    Odun: Math.round(400 * step ** 1.25 * scale),
    Taş: nextLevel >= 3 ? Math.round(200 * (step - 1) ** 1.3 * scale) : 0,
    Demir: nextLevel >= 5 ? Math.round(100 * (step - 3) ** 1.35 * scale) : 0,
  };
};

const plotSizeRank = { small: 1, medium: 2, large: 3 };

const isPlotUnlocked = (plot, cityLevel) => plot.unlockCityLevel <= cityLevel;

const canBuildOnPlot = (building, plot) =>
  plotSizeRank[building.plotSize] <= plotSizeRank[plot.size];

const worldObjects = [
  {
    id: "my-city",
    type: "myCity",
    name: "Avrupa Krallığı",
    info: "Lord Ümit • Sv.15",
    x: 50,
    y: 48,
  },
  {
    id: "enemy-1",
    type: "enemy",
    name: "Kuzey Hisarı",
    info: "Güç: 2.1M",
    x: 23,
    y: 28,
  },
  {
    id: "enemy-2",
    type: "enemy",
    name: "Demir Taç",
    info: "Güç: 3.4M",
    x: 78,
    y: 31,
  },
  {
    id: "ally-1",
    type: "ally",
    name: "Valeron",
    info: "[AK] Müttefik",
    x: 74,
    y: 72,
  },

  {
    id: "food-1",
    type: "resource",
    resourceType: "Ekmek",
    name: "Buğday Ovası",
    info: "Seviye 5",
    x: 36,
    y: 70,
  },
  {
    id: "wood-1",
    type: "resource",
    resourceType: "Odun",
    name: "Çam Ormanı",
    info: "Seviye 6",
    x: 18,
    y: 62,
  },
  {
    id: "stone-1",
    type: "resource",
    resourceType: "Taş",
    name: "Taş Ocağı",
    info: "Seviye 4",
    x: 65,
    y: 18,
  },
  {
    id: "iron-1",
    type: "resource",
    resourceType: "Demir",
    name: "Demir Madeni",
    info: "Seviye 5",
    x: 84,
    y: 57,
  },

  {
    id: "wolf-1",
    type: "animal",
    name: "Kurt Sürüsü",
    info: "Seviye 8",
    x: 31,
    y: 42,
  },
  {
    id: "boar-1",
    type: "animal",
    name: "Yaban Domuzu",
    info: "Seviye 12",
    x: 62,
    y: 67,
  },
];

function App() {
  const [activeView, setActiveView] = useState("city");
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [worldMessage, setWorldMessage] = useState("");
  const [marches, setMarches] = useState(savedGame.marches ?? 0);
  const [playerResources, setPlayerResources] = useState(savedGame.resources ?? initialResources);
  const [troops, _setTroops] = useState(savedGame.troops ?? initialTroops);
  const [heroes, _setHeroes] = useState(savedGame.heroes ?? heroCatalog);
  const [research, _setResearch] = useState(savedGame.research ?? defaultGameState.research);
  const [buildingLevels, setBuildingLevels] = useState(() =>
    cityBuildings.map((building) => savedGame.buildings?.find((saved) => saved.id === building.id)?.level ?? building.level)
  );
  const [builtBuildings, setBuiltBuildings] = useState(() =>
    cityBuildings.map((building) => savedGame.buildings?.find((saved) => saved.id === building.id)?.built ?? building.built)
  );
  const [selectedBuildingIndex, setSelectedBuildingIndex] = useState(null);
  const [buildingMessage, setBuildingMessage] = useState("");
  const [buildMode, setBuildMode] = useState(false);
  const [plotOccupants, setPlotOccupants] = useState(() =>
    Object.fromEntries((savedGame.plots ?? cityPlots).map((plot) => [plot.id, plot.occupiedBy]))
  );
  const [selectedPlotId, setSelectedPlotId] = useState(null);
  const [selectedBuildId, setSelectedBuildId] = useState(null);
  const [constructionQueues, setConstructionQueues] = useState(savedGame.constructionQueues ?? []);

  const cityCenterIndex = cityBuildings.findIndex((building) => building.isCityCenter);
  const cityCenterLevel = builtBuildings[cityCenterIndex] ? buildingLevels[cityCenterIndex] : 0;
  const cityExpansionStage = getCityExpansionStage(cityCenterLevel);
  const currentTutorial = cityTutorial.find((step) => {
    const stepBuildingIndex = cityBuildings.findIndex((building) => building.id === step.buildingId);
    return stepBuildingIndex >= 0 && (!builtBuildings[stepBuildingIndex] || (step.buildingId === "city-center" && buildingLevels[stepBuildingIndex] < Number(step.text.slice(-1))));
  });

  useEffect(() => {
    const timer = window.setInterval(() => {
      const now = Date.now();
      setConstructionQueues((queues) => {
        const completed = queues.filter((queue) => queue.endsAt <= now);
        if (completed.length) {
          completed.forEach((queue) => {
            const buildingIndex = cityBuildings.findIndex((building) => building.id === queue.buildingId);
            setBuiltBuildings((built) => built.map((value, index) => index === buildingIndex ? true : value));
            setBuildingLevels((levels) => levels.map((level, index) => index === buildingIndex ? 1 : level));
            setPlotOccupants((occupants) => ({ ...occupants, [queue.plotId]: queue.buildingId }));
            if (queue.buildingId === "city-center") {
              setBuildMode(false);
              setSelectedPlotId(null);
              setSelectedBuildId(null);
              setSelectedBuildingIndex(null);
            }
          });
          return queues.filter((queue) => queue.endsAt > now);
        }
        return queues;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const productionByBuilding = {
      mill: "Ekmek",
      sawmill: "Odun",
      quarry: "Taş",
      "iron-mine": "Demir",
    };
    const timer = window.setInterval(() => {
      setPlayerResources((resources) => {
        const nextResources = { ...resources };
        cityBuildings.forEach((building, index) => {
          const resourceName = productionByBuilding[building.id];
          if (resourceName && builtBuildings[index] && buildingLevels[index] > 0) {
            nextResources[resourceName] += buildingLevels[index] * 5;
          }
        });
        return nextResources;
      });
    }, 10000);
    return () => window.clearInterval(timer);
  }, [builtBuildings, buildingLevels]);

  useEffect(() => {
    saveGame({
      ...savedGame,
      resources: playerResources,
      buildings: cityBuildings.map((building, index) => ({
        id: building.id,
        built: builtBuildings[index],
        level: buildingLevels[index],
      })),
      plots: cityPlots.map((plot) => ({ ...plot, occupiedBy: plotOccupants[plot.id] ?? null })),
      marches,
      troops,
      heroes,
      research,
      constructionQueues,
    });
  }, [playerResources, buildingLevels, builtBuildings, plotOccupants, marches, troops, heroes, research, constructionQueues]);

  const selectWorldObject = (item) => {
    setSelectedTarget(item);
    setWorldMessage("");
  };

  const closeTarget = () => {
    setSelectedTarget(null);
    setWorldMessage("");
  };

  const selectBuilding = (buildingIndex) => {
    setSelectedBuildingIndex(buildingIndex);
    setBuildingMessage("");
  };

  const closeBuilding = () => {
    setSelectedBuildingIndex(null);
    setBuildingMessage("");
  };

  const toggleBuildMode = () => {
    setBuildMode((isBuilding) => !isBuilding);
    setSelectedPlotId(null);
    setSelectedBuildId(null);
  };

  const selectPlot = (plotId) => {
    setSelectedPlotId(plotId);
    setSelectedBuildId(null);
  };

  const focusCityCenterTask = () => {
    const cityCenterPlot = cityPlots.find((plot) => plot.isSpecial);
    if (!cityCenterPlot) return;
    setBuildMode(true);
    selectPlot(cityCenterPlot.id);
  };

  const buildOnSelectedPlot = () => {
    if (!selectedPlotId || !selectedBuildId) return;
    const plot = cityPlots.find((item) => item.id === selectedPlotId);
    const buildingIndex = cityBuildings.findIndex((item) => item.id === selectedBuildId);
    const building = cityBuildings[buildingIndex];
    const centerTutorialBuild = plot.isSpecial && building.isCityCenter && cityCenterLevel === 0;
    if (!plot || !building || (!centerTutorialBuild && !isPlotUnlocked(plot, cityCenterLevel)) || !canBuildOnPlot(building, plot)) return;
    const cost = building.buildCost;
    if (constructionQueues.length >= 2) {
      setBuildingMessage("Tüm inşaat kuyrukları kullanımda.");
      return;
    }
    if (!resourceNames.every((resourceName) => playerResources[resourceName] >= cost[resourceName])) {
      setBuildingMessage("Yetersiz Kaynak");
      return;
    }
    setPlayerResources((resources) => {
      const remaining = { ...resources };
      resourceNames.forEach((resourceName) => { remaining[resourceName] -= cost[resourceName]; });
      return remaining;
    });
    setConstructionQueues((queues) => [...queues, {
      plotId: selectedPlotId,
      buildingId: selectedBuildId,
      startedAt: Date.now(),
      endsAt: Date.now() + (building.isCityCenter ? 5000 : 10000),
    }]);
    setSelectedPlotId(null);
    setSelectedBuildId(null);
  };

  const upgradeBuilding = () => {
    if (selectedBuildingIndex === null) return;

    const building = cityBuildings[selectedBuildingIndex];
    const currentLevel = buildingLevels[selectedBuildingIndex];
    if (!builtBuildings[selectedBuildingIndex]) {
      setBuildingMessage("Önce binayı inşa et.");
      return;
    }
    if (currentLevel >= building.maxLevel) {
      setBuildingMessage("Bu bina en yüksek seviyede.");
      return;
    }
    if (!building.isCityCenter && currentLevel >= cityCenterLevel) {
      setBuildingMessage("Önce Şehir Merkezi'ni yükselt.");
      return;
    }
    const cost = getUpgradeCost({ ...building, level: currentLevel }, selectedBuildingIndex);
    const canUpgrade = resourceNames.every(
      (resourceName) => playerResources[resourceName] >= cost[resourceName]
    );

    if (!canUpgrade) {
      setBuildingMessage("Yeterli kaynak yok.");
      return;
    }

    setPlayerResources((currentResources) => {
      const remaining = { ...currentResources };
      resourceNames.forEach((resourceName) => {
        remaining[resourceName] -= cost[resourceName];
      });
      return remaining;
    });
    setBuildingLevels((currentLevels) =>
      currentLevels.map((level, index) =>
        index === selectedBuildingIndex ? level + 1 : level
      )
    );
    setBuildingMessage("Bina başarıyla yükseltildi.");
  };

  const showBuildingInfo = () => {
    setBuildingMessage("Bu bina seviyeye bağlı özelliklerini güçlendirir.");
  };

  const performWorldAction = () => {
    if (!selectedTarget) return;

    if (selectedTarget.type === "myCity") {
      setActiveView("city");
      setSelectedTarget(null);
      return;
    }

    if (selectedTarget.type === "ally") {
      setWorldMessage("Müttefik şehir seçildi.");
      return;
    }

    if (marches >= 5) {
      setWorldMessage("Tüm yürüyüşler kullanımda.");
      return;
    }

    if (selectedTarget.type === "resource") {
      setMarches((value) => value + 1);
      setWorldMessage(
        selectedTarget.name + " için kaynak toplama yürüyüşü başlatıldı."
      );
      return;
    }

    if (
      selectedTarget.type === "animal" ||
      selectedTarget.type === "enemy"
    ) {
      setMarches((value) => value + 1);
      setWorldMessage(
        selectedTarget.name + " hedefi için saldırı yürüyüşü başlatıldı."
      );
    }
  };

  const getActionText = () => {
    if (!selectedTarget) return "";

    if (selectedTarget.type === "myCity") return "Şehrine Dön";
    if (selectedTarget.type === "resource") return "Topla";
    if (selectedTarget.type === "ally") return "Bilgi";
    return "Saldır";
  };

  const getNodeStyle = (item) => {
    let border = "#c7a66a";
    let background = "rgba(35, 27, 21, 0.92)";

    if (item.type === "myCity") {
      border = "#e2bc72";
      background = "rgba(64, 43, 26, 0.96)";
    }

    if (item.type === "enemy") {
      border = "#a85b50";
      background = "rgba(70, 31, 27, 0.94)";
    }

    if (item.type === "ally") {
      border = "#769687";
      background = "rgba(31, 55, 47, 0.94)";
    }

    if (item.type === "resource") {
      border = "#a9a06c";
      background = "rgba(51, 57, 37, 0.94)";
    }

    if (item.type === "animal") {
      border = "#9a826b";
      background = "rgba(54, 45, 37, 0.94)";
    }

    return {
      position: "absolute",
      left: item.x + "%",
      top: item.y + "%",
      transform: "translate(-50%, -50%)",
      minWidth: item.type === "myCity" ? "132px" : "105px",
      padding: item.type === "myCity" ? "10px 12px" : "7px 9px",
      background,
      border: "2px solid " + border,
      borderRadius: item.type === "myCity" ? "12px" : "9px",
      color: "#fff3d4",
      boxShadow: "0 4px 12px rgba(0,0,0,0.48)",
      cursor: "pointer",
      zIndex: item.type === "myCity" ? 8 : 6,
      textAlign: "center",
    };
  };

  return (
    <div className="game">
      <div className="snow"></div>

      <header className="topBar">
        <div className="profile">
          <div className="avatar">UK</div>

          <div>
            <strong>Lord Ümit</strong>
            <span>Güç: 2.845.600</span>
          </div>
        </div>

        <div className="resources">
          {[...resourceNames, "Elmas"].map((name) => (
            <div className="resource" key={name}>
              <span>{name}</span>
              <strong>{name === "Elmas" ? "12.450" : formatResource(playerResources[name])}</strong>
            </div>
          ))}
        </div>
      </header>

      {activeView === "city" ? (
        <section
          className="city"
          data-expansion-stage={cityExpansionStage.stage}
          style={{
            backgroundImage: "url(" + cityBackgroundImage + ")",
            backgroundSize: "contain",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="cityActionGroup">
            <button type="button" className={"buildModeButton" + (buildMode ? " active" : "")} onClick={toggleBuildMode}>
              {buildMode ? "İnşayı Kapat" : "İnşa Et"}
            </button>
          </div>

          <div className="eventCornerStack">
            <button type="button" className="event eventLeft">
              Kuzey Akınları
              <small>02:18:42</small>
            </button>

            <button type="button" className="event eventRight">
              Ejderha Avı
              <small>Hazır</small>
            </button>

          </div>

          {currentTutorial?.text === "Şehir Merkezi'ni Kur" && (
            <button type="button" className="city-main-task" onClick={focusCityCenterTask}>
              Görev: {currentTutorial.text}
            </button>
          )}

          {cityPlots.map((plot) => {
            const occupantId = plotOccupants[plot.id];
            const building = cityBuildings.find((item) => item.id === occupantId);
            const queuedConstruction = constructionQueues.find((queue) => queue.plotId === plot.id);
            if (!building) {
              if (queuedConstruction) {
                const queuedBuilding = cityBuildings.find((item) => item.id === queuedConstruction.buildingId);
                return (
                  <div
                    key={plot.id}
                    className="constructionMarker"
                    style={{ left: plot.x + "%", top: plot.y + "%" }}
                  >
                    {queuedBuilding?.name}<small>İnşa ediliyor</small>
                  </div>
                );
              }
              const canShowPlot = plot.isSpecial
                ? cityCenterLevel === 0
                : cityCenterLevel > 0 && isPlotUnlocked(plot, cityCenterLevel);
              if (!buildMode || !canShowPlot) return null;
              return (
                <button
                  key={plot.id}
                  className={"emptyPlot" + (plot.isSpecial ? " emptyPlot--center" : "")}
                  style={{
                    "--plot-x": plot.x + "%",
                    "--plot-y": plot.y + "%",
                  }}
                  onClick={() => selectPlot(plot.id)}
                  aria-label={plot.size + " boş parsel"}
                >
                  <span>Boş parsel</span>
                  <small>{plot.size}</small>
                </button>
              );
            }

            const buildingIndex = cityBuildings.indexOf(building);
            if (!builtBuildings[buildingIndex] || buildingLevels[buildingIndex] < 1) return null;
            const buildingAsset = buildingAssetById[building.id];
            if (!buildingAsset) return null;
            return (
              <button
                key={plot.id}
                className={
                  "cityBuilding cityBuilding--" + building.category + " " + building.className
                }
                style={{
                  "--building-x": plot.x + "%",
                  "--building-y": plot.y + "%",
                }}
                onClick={() => selectBuilding(buildingIndex)}
              >
                <span className="buildingLabel">
                  <span className="buildingName">{building.name}</span>
                  <small>Sv. {buildingLevels[buildingIndex]}</small>
                </span>
                <img className="buildingAsset" src={buildingAsset} alt={building.name} />
                <span className="buildingHotspotArea" aria-hidden="true" />
              </button>
            );
          })}

          {selectedBuildingIndex !== null && (() => {
            const building = cityBuildings[selectedBuildingIndex];
            const currentLevel = buildingLevels[selectedBuildingIndex];
            const cost = getUpgradeCost({ ...building, level: currentLevel }, selectedBuildingIndex);
            const nextValue = building.baseValue + currentLevel + 1;
            return (
              <div className="buildingPanel">
                <div className="buildingPanelHeader">
                  <div>
                    <strong>{building.name}</strong>
                    <small>{building.description}</small>
                  </div>
                  <button className="panelClose" onClick={closeBuilding}>Kapat</button>
                </div>
                <div className="buildingStats">
                  <span>Mevcut seviye <b>{currentLevel}</b></span>
                  <span>Sonraki seviye <b>{currentLevel + 1}</b></span>
                  <span>{building.feature} <b>{building.baseValue + currentLevel}{building.unit}</b> → <b>{nextValue}{building.unit}</b></span>
                </div>
                <div className="buildingCosts">
                  <strong>Gerekli kaynaklar</strong>
                  <div>{resourceNames.map((resourceName) => (
                    <span key={resourceName} className={playerResources[resourceName] < cost[resourceName] ? "shortage" : ""}>
                      {resourceName}: {formatResource(cost[resourceName])}
                    </span>
                  ))}</div>
                </div>
                <div className="buildingPanelActions">
                  <button onClick={upgradeBuilding}>Yükselt</button>
                  <button onClick={showBuildingInfo}>Bilgi</button>
                </div>
                {buildingMessage && <div className="buildingMessage">{buildingMessage}</div>}
              </div>
            );
          })()}

          {selectedPlotId && (() => {
            const plot = cityPlots.find((item) => item.id === selectedPlotId);
            const availableBuildings = cityBuildings.filter(
              (building) =>
                (plot.isSpecial ? building.isCityCenter : !building.isCityCenter) &&
                !Object.values(plotOccupants).includes(building.id) &&
                (building.isCityCenter || building.unlockCityLevel <= cityCenterLevel) &&
                canBuildOnPlot(building, plot)
            );
            return (
              <div className="plotBuildPanel">
                <strong>{plot.isSpecial ? "Şehir Merkezi'ni İnşa Et" : "Bu Parsele Kurulabilecek Binalar"}</strong>
                <div className="plotBuildingOptions">
                  {availableBuildings.map((building) => (
                    <button
                      key={building.id}
                      className={selectedBuildId === building.id ? "selected" : ""}
                      onClick={() => setSelectedBuildId(building.id)}
                    >
                      {building.name}
                    </button>
                  ))}
                </div>
                <div className="plotBuildActions">
                  <button onClick={buildOnSelectedPlot} disabled={!selectedBuildId}>İnşa Et</button>
                  <button onClick={() => setSelectedPlotId(null)}>Kapat</button>
                </div>
              </div>
            );
          })()}
        </section>
      ) : (
        <section
          style={{
            position: "relative",
            width: "100%",
            height: "calc(100vh - 145px)",
            overflow: "hidden",
            background:
              "radial-gradient(circle at 50% 50%, rgba(103,125,115,0.94) 0%, rgba(65,86,77,0.97) 37%, rgba(31,48,43,1) 100%)",
          }}
        >
          {/* Kış haritası dekor katmanları */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.45,
              backgroundImage:
                "radial-gradient(circle at 15% 22%, rgba(255,255,255,.22) 0 2px, transparent 3px)," +
                "radial-gradient(circle at 72% 38%, rgba(255,255,255,.16) 0 2px, transparent 3px)," +
                "radial-gradient(circle at 43% 78%, rgba(255,255,255,.14) 0 2px, transparent 3px)",
              backgroundSize: "75px 75px, 95px 95px, 120px 120px",
              pointerEvents: "none",
            }}
          />

          {/* Dağ gölgeleri */}
          <div
            style={{
              position: "absolute",
              left: "-5%",
              top: "-15%",
              width: "42%",
              height: "52%",
              background:
                "linear-gradient(135deg, rgba(210,220,218,.22), rgba(17,32,28,.75))",
              clipPath: "polygon(0 100%, 28% 38%, 45% 70%, 64% 12%, 100% 100%)",
              opacity: 0.75,
            }}
          />

          <div
            style={{
              position: "absolute",
              right: "-8%",
              top: "-8%",
              width: "38%",
              height: "48%",
              background:
                "linear-gradient(225deg, rgba(220,228,226,.18), rgba(17,32,28,.8))",
              clipPath: "polygon(0 100%, 24% 35%, 48% 72%, 68% 8%, 100% 100%)",
              opacity: 0.7,
            }}
          />

          {/* Donmuş nehir */}
          <div
            style={{
              position: "absolute",
              left: "38%",
              top: "-15%",
              width: "11%",
              height: "135%",
              background:
                "linear-gradient(90deg, rgba(156,186,184,.16), rgba(207,225,222,.42), rgba(139,176,174,.16))",
              transform: "rotate(17deg)",
              borderLeft: "1px solid rgba(210,230,228,.18)",
              borderRight: "1px solid rgba(210,230,228,.18)",
            }}
          />

          {/* Üst bilgi */}
          <div
            style={{
              position: "absolute",
              top: "3%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "7px 14px",
              background: "rgba(25,22,18,.9)",
              border: "1px solid #c7a66a",
              borderRadius: "8px",
              color: "#fff3d4",
              zIndex: 15,
            }}
          >
            <strong>Dünya Haritası</strong>

            <span
              style={{
                fontSize: "10px",
                opacity: 0.9,
              }}
            >
              Yürüyüş: {marches}/5
            </span>
          </div>

          {/* Koordinatlar */}
          <div
            style={{
              position: "absolute",
              left: "2%",
              bottom: "3%",
              padding: "5px 9px",
              background: "rgba(20,24,22,.75)",
              border: "1px solid rgba(199,166,106,.55)",
              borderRadius: "6px",
              color: "#e8e1d1",
              fontSize: "10px",
              zIndex: 12,
            }}
          >
            Krallık #01 &nbsp; X:512 &nbsp; Y:488
          </div>

          {/* Dünya üzerindeki hedefler */}
          {worldObjects.map((item) => (
            <button
              key={item.id}
              onClick={() => selectWorldObject(item)}
              style={getNodeStyle(item)}
            >
              <span
                style={{
                  display: "block",
                  width: item.type === "myCity" ? "20px" : "13px",
                  height: item.type === "myCity" ? "20px" : "13px",
                  margin: "0 auto 4px",
                  borderRadius:
                    item.type === "resource" ? "2px" : "50%",
                  transform:
                    item.type === "resource"
                      ? "rotate(45deg)"
                      : "none",
                  border: "1px solid rgba(255,243,212,.75)",
                  background:
                    item.type === "enemy"
                      ? "#7d3d34"
                      : item.type === "ally"
                      ? "#527466"
                      : item.type === "resource"
                      ? "#8a8150"
                      : item.type === "animal"
                      ? "#6f5d4d"
                      : "#a8763e",
                }}
              />

              <strong
                style={{
                  display: "block",
                  fontSize: item.type === "myCity" ? "12px" : "10px",
                  lineHeight: 1.15,
                }}
              >
                {item.name}
              </strong>

              <small
                style={{
                  display: "block",
                  marginTop: "3px",
                  fontSize: "8px",
                  opacity: 0.88,
                }}
              >
                {item.resourceType
                  ? item.resourceType + " • " + item.info
                  : item.info}
              </small>
            </button>
          ))}

          {/* Hedef seçildiğinde alt panel */}
          {selectedTarget && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: "4%",
                transform: "translateX(-50%)",
                width: "min(430px, 88%)",
                padding: "11px 13px",
                background: "rgba(24,21,18,.96)",
                border: "1px solid #c7a66a",
                borderRadius: "10px",
                boxShadow: "0 7px 18px rgba(0,0,0,.55)",
                color: "#fff3d4",
                zIndex: 30,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div>
                  <strong
                    style={{
                      display: "block",
                      fontSize: "13px",
                    }}
                  >
                    {selectedTarget.name}
                  </strong>

                  <small
                    style={{
                      display: "block",
                      marginTop: "2px",
                      opacity: 0.85,
                    }}
                  >
                    {selectedTarget.resourceType
                      ? selectedTarget.resourceType +
                        " • " +
                        selectedTarget.info
                      : selectedTarget.info}
                  </small>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                  }}
                >
                  <button
                    onClick={performWorldAction}
                    style={{
                      padding: "7px 14px",
                      background: "#744b2c",
                      color: "#fff3d4",
                      border: "1px solid #d0ab68",
                      borderRadius: "7px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    {getActionText()}
                  </button>

                  <button
                    onClick={closeTarget}
                    style={{
                      padding: "7px 10px",
                      background: "#302a25",
                      color: "#eee5d4",
                      border: "1px solid #81715f",
                      borderRadius: "7px",
                      cursor: "pointer",
                    }}
                  >
                    Kapat
                  </button>
                </div>
              </div>

              {worldMessage && (
                <div
                  style={{
                    marginTop: "8px",
                    paddingTop: "7px",
                    borderTop: '1px solid rgba(199, 166, 106, 0.45)',
                  }}
                >
                  {worldMessage}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      <nav className="bottomBar">
        <button
          type="button"
          className={activeView === "city" ? "active" : ""}
          onClick={() => setActiveView("city")}
        >
          Şehir
        </button>
        <button
          type="button"
          className={activeView === "world" ? "active" : ""}
          onClick={() => setActiveView("world")}
        >
          Dünya
        </button>
      </nav>
    </div>
  );
}

export default App;
