const SAVE_KEY = "trolledAgainSaveV2";
const DEV_LOCK_KEY = "trolledAgainDevLock";
const DEV_ATTEMPT_KEY = "trolledAgainDevAttempts";
const DEV_LOCK_MS = 24 * 60;
const EQUIPPED_CHARACTER_KEY = "trolledAgainEquippedCharacter";
const EQUIPPED_CLOTH_KEY = "trolledAgainEquippedCloth";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;

const ui = {
  screens: {
    home: document.getElementById("homeScreen"),
    profile: document.getElementById("profileScreen"),
    levels: document.getElementById("levelsScreen"),
    shop: document.getElementById("shopScreen"),
    settings: document.getElementById("settingsScreen"),
    game: document.getElementById("gameScreen"),
  },
  brandTitle: document.getElementById("brandTitle"),
  homeSubtitle: document.getElementById("homeSubtitle"),
  profileBtn: document.getElementById("profileBtn"),
  homeSettingsBtn: document.getElementById("homeSettingsBtn"),
  startGameBtn: document.getElementById("startGameBtn"),
  homeLevelTitle: document.getElementById("homeLevelTitle"),
  homeCoins: document.getElementById("homeCoins"),
  levelsNavBtn: document.getElementById("levelsNavBtn"),
  shopNavBtn: document.getElementById("shopNavBtn"),
  settingsNavBtn: document.getElementById("settingsNavBtn"),
  profileTitle: document.getElementById("profileTitle"),
  nicknameTitle: document.getElementById("nicknameTitle"),
  avatarTitle: document.getElementById("avatarTitle"),
  nicknameInput: document.getElementById("nicknameInput"),
  avatarGrid: document.getElementById("avatarGrid"),
  saveProfileBtn: document.getElementById("saveProfileBtn"),
  levelsTitle: document.getElementById("levelsTitle"),
  levelsStatus: document.getElementById("levelsStatus"),
  levelsHelp: document.getElementById("levelsHelp"),
  createLevelBtn: document.getElementById("createLevelBtn"),
  levelsGrid: document.getElementById("levelsGrid"),
  shopTitle: document.getElementById("shopTitle"),
  shopCoins: document.getElementById("shopCoins"),
  charactersTitle: document.getElementById("charactersTitle"),
  clothesTitle: document.getElementById("clothesTitle"),
  characterShop: document.getElementById("characterShop"),
  clothesShop: document.getElementById("clothesShop"),
  settingsTitle: document.getElementById("settingsTitle"),
  soundTitle: document.getElementById("soundTitle"),
  soundDesc: document.getElementById("soundDesc"),
  soundToggle: document.getElementById("soundToggle"),
  musicTitle: document.getElementById("musicTitle"),
  musicDesc: document.getElementById("musicDesc"),
  musicToggle: document.getElementById("musicToggle"),
  gameHomeBtn: document.getElementById("gameHomeBtn"),
  gameEyebrow: document.getElementById("gameEyebrow"),
  levelTitle: document.getElementById("levelTitle"),
  coinsLabel: document.getElementById("coinsLabel"),
  deathsLabel: document.getElementById("deathsLabel"),
  gameCoins: document.getElementById("gameCoins"),
  gameDeaths: document.getElementById("gameDeaths"),
  livesRow: document.getElementById("livesRow"),
  overlay: document.getElementById("overlay"),
  overlayTitle: document.getElementById("overlayTitle"),
  overlayText: document.getElementById("overlayText"),
  primaryButton: document.getElementById("primaryButton"),
  secondaryButton: document.getElementById("secondaryButton"),
  retryBtn: document.getElementById("retryBtn"),
  editorScrollWrapper: document.getElementById("editorScrollWrapper"),
  editorScroll: document.getElementById("editorScroll"),
  editorScrollLabel: document.getElementById("editorScrollLabel"),
};

const WORLD = {
  widthPx: 5000,
  heightPx: canvas ? canvas.height : 540,
  tile: 30,
  gravity: 0.34,
  jumpVelocity: -10,
  terminalVelocity: 13,
  stepDistance: 24,
  stepSpeed: 2.5,
  airStepMultiplier: 2,
  holdDelayFrames: 12,
  holdRepeatFrames: 8,
  get widthTiles() {
    return Math.ceil(this.widthPx / this.tile);
  },
  get heightTiles() {
    return Math.ceil(this.heightPx / this.tile);
  },
};

const DEFAULT_CHARACTERS = [
  { id: "prisoner", name: "Prisoner", price: 0, kind: "character", shape: "humanoid", bodyColor: "#d7d7d7", eyeColor: "#111111", accentColor: "#d66a6a" },
  { id: "ninja", name: "Ninja", price: 85, kind: "character", shape: "humanoid", bodyColor: "#2c2c2c", eyeColor: "#ffffff", accentColor: "#d94f4f" },
  { id: "robot", name: "Robot", price: 90, kind: "character", shape: "robot", bodyColor: "#d8e3ea", eyeColor: "#3fb5ff", accentColor: "#92a8b5" },
  { id: "cat", name: "Cat", price: 55, kind: "character", shape: "animal", bodyColor: "#e5d2a8", eyeColor: "#111111", accentColor: "#c47a33" },
  { id: "hacker", name: "Hacker", price: 95, kind: "character", shape: "humanoid", bodyColor: "#70d28f", eyeColor: "#ffffff", accentColor: "#203a2c" },
];

const DEFAULT_CLOTHES = [
  { id: "none", name: "No Cloth", price: 0, kind: "clothes", type: "none", overlay: "none", color: "#ffffff" },
  { id: "hoodie", name: "Hoodie", price: 25, kind: "clothes", type: "body", overlay: "hoodie", color: "#5036a7" },
  { id: "crown", name: "Crown", price: 35, kind: "clothes", type: "accessory", overlay: "crown", color: "#ffcd38" },
  { id: "ninja-mask", name: "Ninja Mask", price: 45, kind: "clothes", type: "mask", overlay: "ninja-mask", color: "#181818" },
  { id: "armor", name: "Armor", price: 60, kind: "clothes", type: "body", overlay: "armor", color: "#7a8791" },
  { id: "glasses", name: "Glasses", price: 30, kind: "clothes", type: "accessory", overlay: "glasses", color: "#1d1d1d" },
];

const PROFILE_AVATARS = [
  { id: "ember", label: "Ember", colors: ["#f9cb76", "#df6c27"] },
  { id: "sky", label: "Sky", colors: ["#b4ebff", "#4f88c6"] },
  { id: "mint", label: "Mint", colors: ["#d8ffd1", "#59aa69"] },
  { id: "rose", label: "Rose", colors: ["#ffd3e4", "#c86b95"] },
  { id: "coal", label: "Coal", colors: ["#d9d9d9", "#4d4d4d"] },
  { id: "gold", label: "Gold", colors: ["#ffe9a6", "#c68a19"] },
];

const DEFAULT_ASSETS = [
  { id: "asset-block", name: "Pixel Block", kind: "image", category: "object", color: "#d36c18" },
  { id: "asset-spike", name: "Spike Strip", kind: "image", category: "object", color: "#161616" },
  { id: "asset-platform", name: "Moving Platform", kind: "image", category: "object", color: "#c5801d" },
  { id: "asset-bomb", name: "Bomb", kind: "image", category: "object", color: "#2f2f2f" },
];

const DEFAULT_EVENT_SOUNDS = { jump: "", death: "", trap: "" };
const TAUNTS = ["DIE AGAIN", "U MAD?", "TRAP WON", "ALMOST", "NICE TRY", "MEMORIZE THAT"];
const OBJECT_TYPES = ["block", "spike", "movingPlatform", "bomb", "exit"];
const FUNCTION_FLAGS = ["invisible", "fakeBlock", "killObject", "moving", "spawnTrigger", "disappearTrigger", "trapTrigger"];

const input = { left: false, right: false, jumpQueued: false, leftHoldFrames: 0, rightHoldFrames: 0 };
let audioContext = null;
let musicTimer = null;
const assetImageCache = {};
let cameraX = 0;
let cameraY = 0;

const state = {
  screen: "home",
  mode: "menu",
  baseLevels: [],
  customLevels: [],
  publishedLevelIds: [],
  deletedLevelIds: [],
  levelCatalog: [],
  levelIndex: 0,
  level: null,
  player: null,
  totalDeaths: 0,
  perLevelDeaths: [],
  levelDeaths: 0,
  coins: 0,
  soundOn: true,
  musicOn: true,
  ownedCharacters: ["prisoner"],
  ownedClothes: ["none"],
  ownedItems: [],
  equippedCharacter: "prisoner",
  equippedClothes: "none",
  highestUnlockedLevel: 1,
  nickname: "",
  avatarId: "smile",
  lives: 2,
  extraLivesUsed: false,
  checkpointIndex: 0,
  overlayAction: "start",
  trollText: "",
  trollTimer: 0,
  trapMessage: "",
  trapTimer: 0,
  shopItems: [],
  customAssets: [],
  eventSounds: { ...DEFAULT_EVENT_SOUNDS },
  backendReady: { provider: "local-json", publishQueue: [] },
  dev: {
    enabled: false,
    panel: null,
    activeTab: "editor",
    draft: null,
    selectedObjectId: "",
    selectedTriggerId: "",
    selectedShopItemId: "",
    tool: "select",
    snap: true,
    preview: false,
    status: "Developer panel locked.",
    drag: null,
    resize: null,
    hoverObjectId: "",
    pointerTile: { x: 0, y: 0 },
    playerAssetId: "prisoner",
    longPressTimer: null,
    tapTimes: [],
    authUnlocked: false,
    scrollX: 0,
  },
  debugSpawn: null,
};

function setText(node, value) {
  if (node) {
    node.textContent = value;
  }
}

function on(node, eventName, handler, options) {
  if (!node) {
    console.error(`Missing element for ${eventName}`);
    return;
  }
  node.addEventListener(eventName, handler, options);
}

function validateUi() {
  const missing = [];
  if (!canvas) {
    missing.push("gameCanvas");
  }
  if (!ctx) {
    missing.push("gameCanvasContext");
  }
  Object.entries(ui).forEach(([key, value]) => {
    if (key === "screens") {
      Object.entries(value).forEach(([screenKey, node]) => {
        if (!node) {
          missing.push(`screens.${screenKey}`);
        }
      });
      return;
    }
    if (!value) {
      missing.push(key);
    }
  });
  if (missing.length) {
    console.error("Missing UI references:", missing);
  }
}

function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function displayName() {
  const name = (state.nickname || "").trim();
  return name ? `'${name}'` : "Dear";
}

function selectedAvatar() {
  return PROFILE_AVATARS.find((avatar) => avatar.id === state.avatarId) || PROFILE_AVATARS[0];
}

function avatarMarkup(avatar, compact = false) {
  const label = compact ? avatar.label.slice(0, 1) : avatar.label.slice(0, 2);
  const sizeClass = compact ? "avatar-swatch compact" : "avatar-swatch";
  return `<span class="${sizeClass}" style="background: linear-gradient(135deg, ${avatar.colors[0]}, ${avatar.colors[1]});">${label}</span>`;
}

function createDefaultObject(type, x, y) {
  const size = {
    block: { width: 3, height: 1 },
    spike: { width: 2, height: 1 },
    movingPlatform: { width: 3, height: 1 },
    bomb: { width: 1.3, height: 1.3 },
  }[type] || { width: 2, height: 1 };

  return {
    id: uid("obj"),
    type,
    name: `${type}-${Math.floor(x)}-${Math.floor(y)}`,
    trackName: `${type} track`,
    x,
    y,
    width: size.width,
    height: size.height,
    assetId: {
      block: "asset-block",
      spike: "asset-spike",
      movingPlatform: "asset-platform",
      bomb: "asset-bomb",
    }[type] || "asset-block",
    soundId: "",
    functions: {
      invisible: false,
      fakeBlock: false,
      killObject: type === "spike" || type === "bomb",
      moving: type === "movingPlatform",
      spawnTrigger: false,
      disappearTrigger: false,
      trapTrigger: false,
    },
    motion: { axis: "x", distance: 2, speed: 1 },
    spawnAt: { axis: "m", comparator: ">=", value: 0 },
    disappearAt: { axis: "m", comparator: ">=", value: 0 },
    trap: { axis: "m", comparator: ">=", value: 0, actions: [] },
    keyframes: [],
    runtime: null,
  };
}

function createLevelSkeleton(name = "Custom Level", order = 1) {
  return {
    id: uid("lvl"),
    name,
    source: "custom",
    order,
    published: false,
    playerSpawn: { x: 2, y: 11, m: 2, n: 11 },
    exit: { x: 27.5, y: 10.5, width: 1.4, height: 1.8 },
    playZone: { startX: 0, endX: canvas ? canvas.width : 960 },
    checkpoints: [],
    objects: [],
    triggers: [],
  };
}

function normalizeObject(raw) {
  const object = deepClone(raw);
  object.id = object.id || uid("obj");
  object.name = object.name || object.type || "object";
  object.trackName = object.trackName || `${object.name} track`;
  object.width = Number(object.width ?? object.w ?? 2);
  object.height = Number(object.height ?? object.h ?? 1);
  object.x = Number(object.x ?? 0);
  object.y = Number(object.y ?? 0);
  object.assetId = object.assetId || {
    block: "asset-block",
    spike: "asset-spike",
    movingPlatform: "asset-platform",
    bomb: "asset-bomb",
  }[object.type] || "asset-block";
  object.soundId = object.soundId || "";
  object.functions = {
    invisible: false,
    fakeBlock: false,
    killObject: object.type === "spike" || object.type === "bomb",
    moving: object.type === "movingPlatform",
    spawnTrigger: false,
    disappearTrigger: false,
    trapTrigger: false,
    ...(object.functions || {}),
  };
  object.motion = { axis: "x", distance: 2, speed: 1, ...(object.motion || {}) };
  object.spawnAt = { axis: "m", comparator: ">=", value: 0, ...(object.spawnAt || {}) };
  object.disappearAt = { axis: "m", comparator: ">=", value: 0, ...(object.disappearAt || {}) };
  object.trap = { axis: "m", comparator: ">=", value: 0, actions: [], ...(object.trap || {}) };
  object.keyframes = Array.isArray(object.keyframes) ? object.keyframes : [];
  object.runtime = null;
  return object;
}

function normalizeTrigger(raw) {
  return {
    id: raw.id || uid("trg"),
    name: raw.name || "Trigger",
    condition: { axis: "m", comparator: ">=", value: 10, ...(raw.condition || {}) },
    actions: Array.isArray(raw.actions) ? raw.actions : [],
    fired: false,
  };
}

function normalizeLevel(raw, index = 0) {
  const level = deepClone(raw);
  level.id = level.id || uid("lvl");
  level.name = level.name || `Level ${index + 1}`;
  level.source = level.source || "base";
  level.order = Number(level.order ?? index + 1);
  level.published = Boolean(level.published);
  const spawnX = Number(level.playerSpawn?.x ?? level.playerSpawn?.m ?? 2);
  const spawnY = Number(level.playerSpawn?.y ?? level.playerSpawn?.n ?? 11);
  level.playerSpawn = { x: spawnX, y: spawnY, m: spawnX, n: spawnY };
  level.exit = { x: 27.5, y: 10.5, width: 1.4, height: 1.8, ...(level.exit || {}) };
  level.playZone = {
    startX: Number(level.playZone?.startX ?? 0),
    endX: Number(level.playZone?.endX ?? (canvas ? canvas.width : 960)),
  };
  if (level.playZone.endX <= level.playZone.startX) {
    level.playZone.endX = level.playZone.startX + (canvas ? canvas.width : 960);
  }
  level.checkpoints = Array.isArray(level.checkpoints) && level.checkpoints.length
    ? level.checkpoints.map((checkpoint) => ({ x: Number(checkpoint.x), y: Number(checkpoint.y) }))
    : [{ x: 2, y: 11 }, { x: 10, y: 11 }, { x: 18, y: 11 }, { x: 26, y: 11 }];
  level.objects = Array.isArray(level.objects) ? level.objects.map(normalizeObject) : [];
  level.triggers = Array.isArray(level.triggers) ? level.triggers.map(normalizeTrigger) : [];
  return level;
}

function buildBaseLevels() {
  const levels = [];
  for (let i = 0; i < 25; i += 1) {
    const variant = i % 5;
    const level = createLevelSkeleton(`Level ${i + 1}`, i + 1);
    level.id = `base-${i + 1}`;
    level.source = "base";
    level.published = true;
    level.objects = level.objects.filter((object) => object.name === "ground");
    level.objects.push(
      normalizeObject({ ...createDefaultObject("block", 0.8, 12), width: 5.4 }),
      normalizeObject({ ...createDefaultObject("block", 26, 11), width: 3.5 }),
    );

    if (variant === 0) {
      level.objects.push(
        normalizeObject({ ...createDefaultObject("block", 7, 11), width: 2.5, name: "frag-a", functions: { fakeBlock: true } }),
        normalizeObject({ ...createDefaultObject("block", 12, 11), width: 2.5 }),
        normalizeObject({ ...createDefaultObject("block", 17, 11), width: 2.5 }),
        normalizeObject({ ...createDefaultObject("block", 21.5, 11), width: 2.5 }),
        normalizeObject({ ...createDefaultObject("spike", 17.1, 10), width: 1.4, functions: { invisible: true, spawnTrigger: true } })
      );
      level.objects[level.objects.length - 1].spawnAt = { axis: "m", comparator: ">=", value: 17.1 };
      level.triggers.push(normalizeTrigger({ name: "Spike burst", condition: { axis: "m", comparator: ">=", value: 17.1 }, actions: [{ type: "spawnObject", objectId: level.objects[level.objects.length - 1].id }, { type: "message", text: "Adrishya kaante!" }] }));
    }

    if (variant === 1) {
      level.objects.push(
        normalizeObject({ ...createDefaultObject("block", 8, 11), width: 3 }),
        normalizeObject({ ...createDefaultObject("block", 14, 8), width: 3 }),
        normalizeObject({ ...createDefaultObject("block", 20, 11), width: 3 }),
        normalizeObject({ ...createDefaultObject("spike", 11.6, 14), width: 2.2 }),
        normalizeObject({ ...createDefaultObject("spike", 18.2, 14), width: 2.2 }),
        normalizeObject({ ...createDefaultObject("block", 17.2, 9), width: 1, height: 3, functions: { invisible: true, spawnTrigger: true } })
      );
      level.objects[level.objects.length - 1].spawnAt = { axis: "m", comparator: ">=", value: 12.7 };
      level.triggers.push(normalizeTrigger({ name: "Invisible hurdle", condition: { axis: "m", comparator: ">=", value: 12.7 }, actions: [{ type: "spawnObject", objectId: level.objects[level.objects.length - 1].id }, { type: "message", text: "Invisible hurdle aa gaya." }] }));
      level.checkpoints = [{ x: 2, y: 11 }, { x: 8, y: 10 }, { x: 14, y: 7 }, { x: 20, y: 10 }, { x: 27, y: 10 }];
    }

    if (variant === 2) {
      const fake = normalizeObject({ ...createDefaultObject("block", 13, 9), width: 3, name: "fake-block" });
      fake.functions.fakeBlock = true;
      level.objects.push(
        normalizeObject({ ...createDefaultObject("block", 7, 12), width: 3 }),
        fake,
        normalizeObject({ ...createDefaultObject("block", 19, 6), width: 3 }),
        normalizeObject({ ...createDefaultObject("spike", 10.2, 14), width: 2.2 }),
        normalizeObject({ ...createDefaultObject("spike", 16.2, 14), width: 2.2 }),
        normalizeObject({ ...createDefaultObject("block", 22.2, 6), width: 2.4, functions: { invisible: true, spawnTrigger: true } })
      );
      level.objects[level.objects.length - 1].spawnAt = { axis: "m", comparator: ">=", value: 19.2 };
      level.triggers.push(normalizeTrigger({ name: "Invisible block", condition: { axis: "m", comparator: ">=", value: 19.2 }, actions: [{ type: "spawnObject", objectId: level.objects[level.objects.length - 1].id }, { type: "message", text: "Invisible block spawn." }] }));
      level.checkpoints = [{ x: 2, y: 11 }, { x: 7, y: 11 }, { x: 13, y: 8 }, { x: 19, y: 5 }, { x: 27, y: 10 }];
    }

    if (variant === 3) {
      level.objects.push(
        normalizeObject({ ...createDefaultObject("block", 6, 11), width: 2.8 }),
        normalizeObject({ ...createDefaultObject("block", 11.5, 9), width: 2.8 }),
        normalizeObject({ ...createDefaultObject("block", 17, 7), width: 2.8 }),
        normalizeObject({ ...createDefaultObject("block", 22.5, 5), width: 2.8 }),
        normalizeObject({ ...createDefaultObject("spike", 9.2, 14), width: 1.5 }),
        normalizeObject({ ...createDefaultObject("spike", 15.1, 14), width: 1.5 }),
        normalizeObject({ ...createDefaultObject("spike", 21.1, 14), width: 1.5 }),
        normalizeObject({ ...createDefaultObject("block", 24.5, 5), width: 1, height: 2.2, functions: { invisible: true, spawnTrigger: true } })
      );
      level.objects[level.objects.length - 1].spawnAt = { axis: "m", comparator: ">=", value: 17.1 };
      level.triggers.push(normalizeTrigger({ name: "Exit hurdle", condition: { axis: "m", comparator: ">=", value: 17.1 }, actions: [{ type: "spawnObject", objectId: level.objects[level.objects.length - 1].id }, { type: "message", text: "Exit ke paas hurdle." }] }));
      level.exit.y = 4.2;
      level.checkpoints = [{ x: 2, y: 11 }, { x: 6, y: 10 }, { x: 11.5, y: 8 }, { x: 17, y: 6 }, { x: 22.5, y: 4 }];
    }

    if (variant === 4) {
      const fake = normalizeObject({ ...createDefaultObject("block", 7.5, 11), width: 2.5, functions: { fakeBlock: true } });
      level.objects.push(
        fake,
        normalizeObject({ ...createDefaultObject("block", 12, 11), width: 2.5 }),
        normalizeObject({ ...createDefaultObject("block", 16.5, 11), width: 2.5 }),
        normalizeObject({ ...createDefaultObject("block", 21, 11), width: 2.5 }),
        normalizeObject({ ...createDefaultObject("spike", 18, 10), width: 1.4, functions: { invisible: true, spawnTrigger: true } }),
      );
      level.objects[level.objects.length - 1].spawnAt = { axis: "m", comparator: ">=", value: 18 };
    }

    levels.push(normalizeLevel(level, i));
  }
  return levels;
}

function getCharacterCatalog() {
  const catalog = new Map(DEFAULT_CHARACTERS.map((item) => [item.id, item]));
  state.shopItems.filter((item) => item.kind === "character").forEach((item) => catalog.set(item.id, item));
  return [...catalog.values()];
}

function getClothesCatalog() {
  const catalog = new Map(DEFAULT_CLOTHES.map((item) => [item.id, item]));
  state.shopItems.filter((item) => item.kind === "clothes").forEach((item) => catalog.set(item.id, item));
  return [...catalog.values()];
}

function getGenericItemCatalog() {
  return state.shopItems.filter((item) => item.kind === "item");
}

function isAdminMode() {
  return state.dev.enabled === true;
}

function ensureAdminCoins() {
  if (isAdminMode() && state.coins < 999999) {
    state.coins = 999999;
  }
}

function getEditableShopItem(itemId) {
  return state.shopItems.find((item) => item.id === itemId) || null;
}

function getShopManagerCatalog() {
  return [...getCharacterCatalog(), ...getClothesCatalog(), ...getGenericItemCatalog()];
}

function ensureEditableShopItem(itemId) {
  const existing = getEditableShopItem(itemId);
  if (existing) {
    return existing;
  }
  const source = getShopManagerCatalog().find((item) => item.id === itemId);
  if (!source) {
    return null;
  }
  const copy = deepClone(source);
  state.shopItems = state.shopItems.filter((item) => item.id !== copy.id);
  state.shopItems.push(copy);
  return copy;
}

function getAssetCatalog(category = "") {
  const list = [...DEFAULT_ASSETS, ...state.customAssets];
  return category ? list.filter((asset) => asset.category === category || asset.kind === category) : list;
}

function rebuildLevelCatalog() {
  const publishedCustom = state.customLevels.filter((level) => level.published || state.publishedLevelIds.includes(level.id));
  const merged = new Map();
  state.baseLevels.forEach((level) => {
    if (!state.deletedLevelIds.includes(level.id)) {
      merged.set(level.id, normalizeLevel(level, level.order - 1));
    }
  });
  publishedCustom.forEach((level) => {
    if (!state.deletedLevelIds.includes(level.id)) {
      merged.set(level.id, normalizeLevel(level, level.order - 1));
    }
  });
  state.levelCatalog = [...merged.values()].sort((a, b) => a.order - b.order);
  if (!state.perLevelDeaths.length || state.perLevelDeaths.length < state.levelCatalog.length) {
    const existing = state.perLevelDeaths.slice();
    while (existing.length < state.levelCatalog.length) {
      existing.push(0);
    }
    state.perLevelDeaths = existing;
  }
  state.highestUnlockedLevel = clamp(state.highestUnlockedLevel || 1, 1, Math.max(1, state.levelCatalog.length));
}

function saveEquippedState() {
  localStorage.setItem(EQUIPPED_CHARACTER_KEY, state.equippedCharacter || "prisoner");
  localStorage.setItem(EQUIPPED_CLOTH_KEY, state.equippedClothes || "none");
}

function normalizeCharacterItem(item) {
  if (!item) {
    return { ...DEFAULT_CHARACTERS[0] };
  }
  const bodyColor = item.bodyColor || item.body || "#d7d7d7";
  const eyeColor = item.eyeColor || "#ffffff";
  const accentColor = item.accentColor || item.accent || "#d66a6a";
  return {
    ...DEFAULT_CHARACTERS[0],
    ...item,
    shape: item.shape || item.style || "humanoid",
    bodyColor,
    eyeColor,
    accentColor,
    body: bodyColor,
    shade: item.shade || accentColor,
    accent: accentColor,
    assetId: item.assetId || "",
  };
}

function normalizeClothItem(item) {
  if (!item) {
    return { ...DEFAULT_CLOTHES[0] };
  }
  return {
    ...DEFAULT_CLOTHES[0],
    ...item,
    type: item.type || "body",
    overlay: item.overlay || (item.type === "accessory" ? "glasses" : "hoodie"),
    color: item.color || "#5036a7",
    assetId: item.assetId || "",
  };
}

function applyPlayerAppearance() {
  const character = normalizeCharacterItem(getCharacterCatalog().find((item) => item.id === state.equippedCharacter));
  const clothes = normalizeClothItem(getClothesCatalog().find((item) => item.id === state.equippedClothes));
  console.log("Equipped Character:", character.id);
  console.log("Equipped Cloth:", clothes.id);
  if (state.player) {
    state.player.characterId = character.id;
    state.player.characterConfig = character;
    state.player.clothId = clothes.id;
    state.player.clothConfig = clothes;
    state.player.sprite = character.assetId || character.style;
    state.player.clothSprite = clothes.assetId || clothes.overlay;
  }
}

function restoreEquippedState() {
  const storedCharacter = localStorage.getItem(EQUIPPED_CHARACTER_KEY);
  const storedCloth = localStorage.getItem(EQUIPPED_CLOTH_KEY);
  if (storedCharacter) {
    state.equippedCharacter = storedCharacter;
  }
  if (storedCloth) {
    state.equippedClothes = storedCloth;
  }
  if (!getCharacterCatalog().some((item) => item.id === state.equippedCharacter)) {
    state.equippedCharacter = "prisoner";
  }
  if (!getClothesCatalog().some((item) => item.id === state.equippedClothes)) {
    state.equippedClothes = "none";
  }
}

function equipCharacter(characterId) {
  state.equippedCharacter = getCharacterCatalog().some((item) => item.id === characterId) ? characterId : "prisoner";
  saveEquippedState();
  applyPlayerAppearance();
  saveGame();
  updateUi();
}

function equipClothes(clothId) {
  state.equippedClothes = getClothesCatalog().some((item) => item.id === clothId) ? clothId : "none";
  saveEquippedState();
  applyPlayerAppearance();
  saveGame();
  updateUi();
}

function saveGame() {
  saveEquippedState();
  localStorage.setItem(SAVE_KEY, JSON.stringify({
    totalDeaths: state.totalDeaths,
    perLevelDeaths: state.perLevelDeaths,
    coins: state.coins,
    soundOn: state.soundOn,
    musicOn: state.musicOn,
    ownedCharacters: state.ownedCharacters,
    ownedClothes: state.ownedClothes,
    ownedItems: state.ownedItems,
    equippedCharacter: state.equippedCharacter,
    equippedClothes: state.equippedClothes,
    highestUnlockedLevel: state.highestUnlockedLevel,
    nickname: state.nickname,
    avatarId: state.avatarId,
    customLevels: state.customLevels.map((level) => ({
      ...level,
      objects: level.objects.map((object) => {
        const copy = deepClone(object);
        delete copy.runtime;
        return copy;
      }),
    })),
    publishedLevelIds: state.publishedLevelIds,
    deletedLevelIds: state.deletedLevelIds,
    customAssets: state.customAssets,
    shopItems: state.shopItems,
    eventSounds: state.eventSounds,
    backendReady: state.backendReady,
  }));
}

function loadSave() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) {
    return;
  }
  try {
    const saved = JSON.parse(raw);
    state.totalDeaths = Number(saved.totalDeaths || 0);
    state.perLevelDeaths = Array.isArray(saved.perLevelDeaths) ? saved.perLevelDeaths.map((value) => Number(value || 0)) : [];
    state.coins = Number(saved.coins || 0);
    state.soundOn = saved.soundOn !== false;
    state.musicOn = saved.musicOn !== false;
    state.ownedCharacters = Array.isArray(saved.ownedCharacters) ? saved.ownedCharacters : ["prisoner"];
    state.ownedClothes = Array.isArray(saved.ownedClothes) ? saved.ownedClothes : ["none"];
    state.ownedItems = Array.isArray(saved.ownedItems) ? saved.ownedItems : [];
    state.equippedCharacter = saved.equippedCharacter || "prisoner";
    state.equippedClothes = saved.equippedClothes || "none";
    state.highestUnlockedLevel = Number(saved.highestUnlockedLevel || 1);
    state.nickname = saved.nickname || "";
    state.avatarId = saved.avatarId || "smile";
    state.customLevels = Array.isArray(saved.customLevels) ? saved.customLevels.map((level, index) => normalizeLevel(level, index + 100)) : [];
    state.publishedLevelIds = Array.isArray(saved.publishedLevelIds) ? saved.publishedLevelIds : [];
    state.deletedLevelIds = Array.isArray(saved.deletedLevelIds) ? saved.deletedLevelIds : [];
    state.customAssets = Array.isArray(saved.customAssets) ? saved.customAssets : [];
    state.shopItems = Array.isArray(saved.shopItems) ? saved.shopItems : [];
    state.eventSounds = { ...DEFAULT_EVENT_SOUNDS, ...(saved.eventSounds || {}) };
    state.backendReady = { provider: "local-json", publishQueue: [], ...(saved.backendReady || {}) };
    restoreEquippedState();
  } catch (error) {
    console.error("Failed to parse save:", error);
  }
}

function showScreen(screenName) {
  Object.entries(ui.screens).forEach(([key, node]) => {
    if (node) {
      node.classList.toggle("active", key === screenName);
    }
  });
  state.screen = screenName;
  syncEditorScrollUi();
  if (state.dev.panel && screenName === "game") {
    renderDevPanel();
  }
}

function showOverlay(title, text, primaryText, primaryAction, secondaryText = "Home") {
  setText(ui.overlayTitle, title);
  setText(ui.overlayText, text);
  setText(ui.primaryButton, primaryText);
  setText(ui.secondaryButton, secondaryText);
  state.overlayAction = primaryAction;
  if (ui.overlay) {
    ui.overlay.classList.remove("hidden");
  }
}

function hideOverlay() {
  if (ui.overlay) {
    ui.overlay.classList.add("hidden");
  }
}

function makeShopCard(item, owned, equipped, onBuy, onEquip) {
  const card = document.createElement("article");
  card.className = "shop-card";
  const preview = createShopPreview(item);
  const title = document.createElement("h4");
  title.textContent = item.name;
  const price = document.createElement("div");
  price.className = "price";
  price.textContent = `${item.price} Coins`;
  const desc = document.createElement("p");
  desc.textContent = item.description || "Unlock and use this item.";
  const button = document.createElement("button");
  button.type = "button";
  if (equipped) {
    button.textContent = "Equipped";
    button.className = "alt";
  } else if (owned) {
    button.textContent = "Equip";
    button.className = "alt";
    on(button, "click", onEquip);
  } else {
    button.textContent = "Buy";
    on(button, "click", onBuy);
  }
  if (equipped) {
    card.classList.add("equipped");
  }
  card.append(preview, title, price, desc, button);
  return card;
}

function getAssetById(assetId) {
  return getAssetCatalog().find((asset) => asset.id === assetId) || null;
}

function createGeneratedPreview(item) {
  const preview = document.createElement("div");
  preview.className = "shop-preview generated";
  if (item.kind === "character") {
    const character = normalizeCharacterItem(item);
    preview.innerHTML = `
      <div class="shop-avatar">
        <span class="shop-avatar-head" style="background:${character.bodyColor}; border-color:${character.accentColor};"></span>
        <span class="shop-avatar-body" style="background:${character.bodyColor};"></span>
        <span class="shop-avatar-accent" style="background:${character.accentColor};"></span>
      </div>
    `;
    return preview;
  }
  if (item.kind === "clothes") {
    const cloth = normalizeClothItem(item);
    preview.innerHTML = `
      <div class="shop-cloth">
        <span class="shop-cloth-base"></span>
        <span class="shop-cloth-overlay ${cloth.overlay}" style="background:${cloth.color};"></span>
      </div>
    `;
    return preview;
  }
  preview.innerHTML = `<div class="shop-generic-chip" style="background:${item.color || "#d36c18"};"></div>`;
  return preview;
}

function createShopPreview(item) {
  const asset = item.assetId ? getAssetById(item.assetId) : null;
  if (asset && asset.dataUrl && asset.kind === "image") {
    const wrap = document.createElement("div");
    wrap.className = "shop-preview image";
    const image = document.createElement("img");
    image.src = asset.dataUrl;
    image.alt = item.name;
    wrap.append(image);
    return wrap;
  }
  return createGeneratedPreview(item);
}

function ensureShopItemPanel() {
  const shopScreen = ui.screens.shop;
  if (!shopScreen || document.getElementById("itemsPanel")) {
    return;
  }
  const panel = document.createElement("section");
  panel.className = "panel";
  panel.id = "itemsPanel";
  panel.innerHTML = `<h3 id="itemsTitle">Items</h3><div class="shop-grid" id="itemShop"></div>`;
  shopScreen.append(panel);
}

function renderShop() {
  ensureAdminCoins();
  ensureShopItemPanel();
  if (ui.characterShop) ui.characterShop.innerHTML = "";
  if (ui.clothesShop) ui.clothesShop.innerHTML = "";
  const itemShop = document.getElementById("itemShop");
  if (itemShop) itemShop.innerHTML = "";

  getCharacterCatalog().forEach((item) => {
    ui.characterShop.append(makeShopCard(item, state.ownedCharacters.includes(item.id), state.equippedCharacter === item.id, () => buyCatalogItem(item), () => equipCharacter(item.id)));
  });

  getClothesCatalog().forEach((item) => {
    ui.clothesShop.append(makeShopCard(item, state.ownedClothes.includes(item.id), state.equippedClothes === item.id, () => buyCatalogItem(item), () => equipClothes(item.id)));
  });

  getGenericItemCatalog().forEach((item) => {
    if (itemShop) {
      itemShop.append(makeShopCard(item, state.ownedItems.includes(item.id), false, () => buyCatalogItem(item), () => {}));
    }
  });
}

function renderAvatarGrid() {
  if (!ui.avatarGrid) {
    return;
  }
  ui.avatarGrid.innerHTML = "";
  PROFILE_AVATARS.forEach((avatar) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `avatar-btn${state.avatarId === avatar.id ? " active" : ""}`;
    button.innerHTML = `${avatarMarkup(avatar)}<span>${avatar.label}</span>`;
    on(button, "click", () => {
      state.avatarId = avatar.id;
      updateUi();
    });
    ui.avatarGrid.append(button);
  });
}

function renderLevelsGrid() {
  if (!ui.levelsGrid) {
    return;
  }
  ui.levelsGrid.innerHTML = "";
  state.levelCatalog.forEach((level, index) => {
    const levelNumber = index + 1;
    const unlocked = levelNumber <= state.highestUnlockedLevel;
    const card = document.createElement("div");
    card.className = "level-card";
    const button = document.createElement("button");
    button.className = `level-chip${unlocked ? "" : " locked"}`;
    button.type = "button";
    button.innerHTML = `${levelNumber}<span>${unlocked ? level.name : "->"}</span>`;
    on(button, "click", () => {
      if (!unlocked) {
        setText(ui.levelsHelp, "Complete the previous level first.");
        return;
      }
      setText(ui.levelsHelp, "Complete the previous level to unlock the next one.");
      loadLevel(index);
    });
    card.append(button);
    if (isAdminMode()) {
      const actions = document.createElement("div");
      actions.className = "level-admin-actions";
      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "level-admin-btn";
      editBtn.textContent = "Edit";
      on(editBtn, "click", () => editLevelAsAdmin(level, index));
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "level-admin-btn danger";
      deleteBtn.textContent = "Delete";
      on(deleteBtn, "click", () => deleteLevelAsAdmin(level));
      actions.append(editBtn, deleteBtn);
      card.append(actions);
    }
    ui.levelsGrid.append(card);
  });
  setText(ui.levelsStatus, `${state.highestUnlockedLevel}/${state.levelCatalog.length} Open`);
}

function currentCharacter() {
  return normalizeCharacterItem(getCharacterCatalog().find((item) => item.id === state.equippedCharacter));
}

function currentClothes() {
  return normalizeClothItem(getClothesCatalog().find((item) => item.id === state.equippedClothes));
}

function buyCatalogItem(item) {
  if (!isAdminMode() && state.coins < item.price) {
    return;
  }
  if (!isAdminMode()) {
    state.coins -= item.price;
  } else {
    ensureAdminCoins();
  }
  if (item.kind === "character" && !state.ownedCharacters.includes(item.id)) {
    state.ownedCharacters.push(item.id);
    state.equippedCharacter = item.id;
  }
  if (item.kind === "clothes" && !state.ownedClothes.includes(item.id)) {
    state.ownedClothes.push(item.id);
    state.equippedClothes = item.id;
  }
  if (item.kind === "item" && !state.ownedItems.includes(item.id)) {
    state.ownedItems.push(item.id);
  }
  saveEquippedState();
  applyPlayerAppearance();
  saveGame();
  updateUi();
}

function editLevelAsAdmin(level, index) {
  if (!isAdminMode()) {
    return;
  }
  state.levelIndex = index;
  state.dev.draft = normalizeLevel(deepClone(level), index);
  state.dev.selectedObjectId = "";
  state.dev.selectedTriggerId = "";
  state.dev.status = `${level.name} loaded for editing.`;
  openEditorStage();
}

function deleteLevelAsAdmin(level) {
  if (!isAdminMode()) {
    return;
  }
  const okay = window.confirm(`Delete ${level.name}?`);
  if (!okay) {
    return;
  }
  state.customLevels = state.customLevels.filter((item) => item.id !== level.id);
  state.publishedLevelIds = state.publishedLevelIds.filter((id) => id !== level.id);
  if (!state.deletedLevelIds.includes(level.id)) {
    state.deletedLevelIds.push(level.id);
  }
  if (state.dev.draft?.id === level.id) {
    state.dev.draft = null;
  }
  rebuildLevelCatalog();
  saveGame();
  updateUi();
  setText(ui.levelsHelp, `${level.name} deleted from level list.`);
}

function renderLives() {
  if (!ui.livesRow) {
    return;
  }
  ui.livesRow.innerHTML = "";
  for (let i = 0; i < 2; i += 1) {
    const heart = document.createElement("div");
    heart.className = `life-heart${i < state.lives ? " active" : ""}`;
    ui.livesRow.append(heart);
  }
}

function updateUi() {
  ensureAdminCoins();
  setText(ui.brandTitle, "Trolled Again");
  setText(ui.profileTitle, "Profile");
  setText(ui.nicknameTitle, "Nickname");
  setText(ui.avatarTitle, "Choose Avatar");
  setText(ui.saveProfileBtn, "Save Profile");
  setText(document.getElementById("homeNavBtn"), "Home");
  setText(ui.levelsNavBtn, "Levels");
  setText(ui.shopNavBtn, "Shop");
  setText(ui.settingsNavBtn, "Settings");
  document.querySelectorAll("[data-back='home']").forEach((button) => {
    button.textContent = "Home";
  });
  if (ui.profileBtn) {
    ui.profileBtn.innerHTML = avatarMarkup(selectedAvatar(), true);
  }
  setText(ui.homeSubtitle, `${displayName()}, are you ready to get trolled ?`);
  setText(ui.homeLevelTitle, `Next Level ${state.highestUnlockedLevel}`);
  setText(ui.homeCoins, `${state.coins} Coins`);
  setText(ui.levelsTitle, "Levels");
  setText(ui.levelsHelp, "Complete the previous level to unlock the next one.");
  setText(ui.createLevelBtn, "Create Level");
  if (ui.createLevelBtn) {
    ui.createLevelBtn.classList.toggle("hidden", !state.dev.enabled);
  }
  setText(ui.shopTitle, "Shop");
  setText(ui.shopCoins, `${state.coins} Coins`);
  setText(ui.charactersTitle, "Characters");
  setText(ui.clothesTitle, "Clothes");
  setText(document.getElementById("itemsTitle"), "Items");
  setText(ui.settingsTitle, "Settings");
  setText(ui.soundTitle, "Sound");
  setText(ui.soundDesc, "Funny death sound on/off");
  setText(ui.musicTitle, "Music");
  setText(ui.musicDesc, "Retro background music on/off");
  setText(ui.soundToggle, state.soundOn ? "On" : "Off");
  setText(ui.musicToggle, state.musicOn ? "On" : "Off");
  setText(ui.startGameBtn, "Play");
  setText(ui.gameEyebrow, state.dev.preview ? "Editor Preview" : "Invisible Trap Pack");
  setText(ui.levelTitle, state.level ? state.level.name : "Level");
  setText(ui.coinsLabel, "Coins");
  setText(ui.deathsLabel, "Deaths");
  setText(ui.gameCoins, state.coins);
  setText(ui.gameDeaths, state.levelDeaths);
  setText(ui.retryBtn, "Retry");
  if (ui.nicknameInput) {
    ui.nicknameInput.value = state.nickname;
  }
  renderLives();
  renderShop();
  renderAvatarGrid();
  renderLevelsGrid();
  renderDevPanel();
}

function createRuntimeLevel(level) {
  const runtime = normalizeLevel(level);
  runtime.objects.forEach((object) => {
    object.runtime = {
      x: object.x,
      y: object.y,
      width: object.width,
      height: object.height,
      visible: !(object.functions.invisible || object.functions.spawnTrigger),
      removed: false,
      trapFired: false,
      spawnFired: false,
      disappearFired: false,
    };
  });
  runtime.triggers.forEach((trigger) => {
    trigger.fired = false;
  });
  return runtime;
}

function normalizeSpawnPoint(spawn) {
  const x = Math.floor(Number(spawn?.x ?? spawn?.m ?? 2));
  const y = Math.floor(Number(spawn?.y ?? spawn?.n ?? 11));
  return { x, y, m: x, n: y };
}

function syncSpawnPoint(level, spawn) {
  const normalized = normalizeSpawnPoint(spawn);
  level.playerSpawn = normalized;
  return normalized;
}

function syncCameraToPlayer() {
  if (!state.player || !canvas) {
    cameraX = 0;
    cameraY = 0;
    return;
  }
  const playZone = currentPlayZone();
  cameraX = clamp(state.player.x - canvas.width / 2, playZone.startX, Math.max(playZone.startX, playZone.endX - canvas.width));
  cameraY = clamp(state.player.y - canvas.height / 2, 0, Math.max(0, WORLD.heightPx - canvas.height));
}

function currentCameraX() {
  return state.mode === "editor" && !state.dev.preview ? state.dev.scrollX : cameraX;
}

function worldToScreenRect(rect) {
  return {
    x: rect.x - currentCameraX(),
    y: rect.y - cameraY,
    w: rect.w,
    h: rect.h,
  };
}

function canvasPointToWorld(point) {
  return {
    x: point.x + currentCameraX(),
    y: point.y + cameraY,
  };
}

function syncEditorScrollUi() {
  if (!ui.editorScroll || !ui.editorScrollWrapper || !ui.editorScrollLabel || !canvas) {
    return;
  }
  const shouldShow = state.dev.enabled && state.screen === "game" && state.mode === "editor" && !state.dev.preview;
  ui.editorScrollWrapper.classList.toggle("hidden", !shouldShow);
  ui.editorScroll.max = String(Math.max(0, WORLD.widthPx - canvas.width));
  ui.editorScroll.value = String(clamp(state.dev.scrollX, 0, Math.max(0, WORLD.widthPx - canvas.width)));
  setText(ui.editorScrollLabel, `View: ${Math.round(state.dev.scrollX)}px / ${WORLD.widthPx}px`);
}

function syncPlayZoneToEditorView() {
  if (!state.level) {
    return;
  }
  const startX = clamp(currentCameraX(), 0, WORLD.widthPx);
  const endX = clamp(startX + canvas.width, startX + 1, WORLD.widthPx);
  state.level.playZone = { startX, endX };
  if (state.dev.draft) {
    state.dev.draft.playZone = deepClone(state.level.playZone);
  }
}

function currentPlayZone() {
  if (!state.level) {
    return { startX: 0, endX: WORLD.widthPx };
  }
  const startX = Number(state.level.playZone?.startX ?? 0);
  const endX = Number(state.level.playZone?.endX ?? canvas.width);
  return {
    startX: clamp(startX, 0, WORLD.widthPx),
    endX: clamp(Math.max(endX, startX + 1), startX + 1, WORLD.widthPx),
  };
}

function exitObjectProxy() {
  if (!state.level?.exit) {
    return null;
  }
  return {
    id: "exit",
    type: "exit",
    name: "exit",
    x: state.level.exit.x,
    y: state.level.exit.y,
    width: state.level.exit.width,
    height: state.level.exit.height,
  };
}

function setExitFromProxy(proxy) {
  if (!state.level || !proxy) {
    return;
  }
  state.level.exit = {
    x: proxy.x,
    y: proxy.y,
    width: proxy.width,
    height: proxy.height,
  };
  if (state.dev.draft) {
    state.dev.draft.exit = deepClone(state.level.exit);
  }
}

function selectedEditorTarget() {
  return state.dev.selectedObjectId === "exit" ? exitObjectProxy() : getSelectedObject();
}

function supportProbe(rect) {
  return {
    x: rect.x + 4,
    y: rect.y + rect.h,
    w: Math.max(6, rect.w - 8),
    h: 6,
  };
}

function playerRectAt(tileX, pixelY) {
  return {
    x: Math.floor(tileX) * WORLD.tile,
    y: pixelY,
    w: WORLD.tile * 0.7,
    h: WORLD.tile * 1.3,
  };
}

function isSafeSpawnRect(rect) {
  const maxX = WORLD.widthPx;
  const maxY = WORLD.heightPx;
  if (rect.x < 0 || rect.y < 0 || rect.x + rect.w > maxX || rect.y + rect.h > maxY) {
    return false;
  }
  if (solidObjects().some((object) => rectsOverlap(rect, objectPixelRect(object)))) {
    return false;
  }
  if (lethalObjects().some((object) => rectsOverlap(rect, objectPixelRect(object)))) {
    return false;
  }
  return solidObjects().some((object) => rectsOverlap(supportProbe(rect), objectPixelRect(object)));
}

function candidateSpawnRects(tileX, tileY) {
  const candidates = [];
  const snappedX = clamp(Math.floor(tileX), 0, WORLD.widthTiles - 1);
  const directRect = playerRectAt(snappedX, Math.floor(tileY) * WORLD.tile);
  candidates.push(directRect);

  solidObjects().forEach((object) => {
    const platform = objectPixelRect(object);
    if (directRect.x + directRect.w <= platform.x + 2 || directRect.x >= platform.x + platform.w - 2) {
      return;
    }
    candidates.push(playerRectAt(snappedX, platform.y - directRect.h));
  });

  return candidates.sort((a, b) => Math.abs(a.y - directRect.y) - Math.abs(b.y - directRect.y));
}

function fallbackSpawnRect() {
  for (let tileX = 0; tileX < WORLD.widthTiles; tileX += 1) {
    const candidates = candidateSpawnRects(tileX, 0);
    const safe = candidates.find(isSafeSpawnRect);
    if (safe) {
      return safe;
    }
  }
  return playerRectAt(2, 9 * WORLD.tile);
}

function findSafeSpawn(spawnX, spawnY) {
  const baseSpawn = normalizeSpawnPoint({ x: spawnX, y: spawnY });
  const visited = new Set();
  const maxRadius = Math.max(WORLD.widthTiles, WORLD.heightTiles);

  for (let radius = 0; radius <= maxRadius; radius += 1) {
    for (let dx = -radius; dx <= radius; dx += 1) {
      const xTile = clamp(baseSpawn.x + dx, 0, WORLD.widthTiles - 1);
      const key = `${xTile}`;
      if (visited.has(key)) {
        continue;
      }
      visited.add(key);
      const candidates = candidateSpawnRects(xTile, baseSpawn.y);
      const safe = candidates.find(isSafeSpawnRect);
      if (safe) {
        return {
          x: safe.x,
          y: safe.y,
          tileX: Math.floor(safe.x / WORLD.tile),
          tileY: Number((safe.y / WORLD.tile).toFixed(2)),
        };
      }
    }
  }

  const fallback = fallbackSpawnRect();
  return {
    x: fallback.x,
    y: fallback.y,
    tileX: Math.floor(fallback.x / WORLD.tile),
    tileY: Number((fallback.y / WORLD.tile).toFixed(2)),
  };
}

function applySafeSpawn(spawn, persistToLevel = true) {
  if (!state.level || !state.player) {
    return;
  }
  const requested = normalizeSpawnPoint(spawn || state.level.playerSpawn);
  const resolved = findSafeSpawn(requested.x, requested.y);
  if (persistToLevel) {
    syncSpawnPoint(state.level, { x: resolved.tileX, y: resolved.tileY });
  }
  state.player.x = resolved.x;
  state.player.y = resolved.y;
  state.player.vx = 0;
  state.player.vy = 0;
  state.player.grounded = false;
  state.player.facing = 1;
  state.player.stepDirection = 0;
  state.player.stepPixelsRemaining = 0;
  state.debugSpawn = { x: resolved.x, y: resolved.y, safe: true };
  syncCameraToPlayer();
}

function loadLevel(index, levelOverride = null) {
  const sourceLevel = levelOverride || state.levelCatalog[index];
  if (!sourceLevel) {
    return;
  }
  state.levelIndex = index;
  state.level = createRuntimeLevel(sourceLevel);
  state.levelDeaths = state.perLevelDeaths[index] || 0;
  state.lives = 2;
  state.extraLivesUsed = false;
  state.checkpointIndex = 0;
  state.player = {
    x: 0,
    y: 0,
    w: WORLD.tile * 0.7,
    h: WORLD.tile * 1.3,
    vx: 0,
    vy: 0,
    grounded: false,
    facing: 1,
    stepDirection: 0,
    stepPixelsRemaining: 0,
    characterId: state.equippedCharacter,
    characterConfig: null,
    clothId: state.equippedClothes,
    clothConfig: null,
    sprite: "",
    clothSprite: "",
  };
  state.mode = state.dev.preview ? "playing" : "intro";
  state.trapMessage = "";
  state.trapTimer = 0;
  state.trollText = "";
  state.trollTimer = 0;
  input.left = false;
  input.right = false;
  input.jumpQueued = false;
  input.leftHoldFrames = 0;
  input.rightHoldFrames = 0;
  applySafeSpawn(state.level.playerSpawn);
  applyPlayerAppearance();
  updateUi();
  showScreen("game");
  if (state.dev.preview) {
    hideOverlay();
  } else {
    showOverlay(state.level.name, `${displayName()}, are you ready to get trolled ?`, "Play", "start");
  }
}

function resetPlayerToSpawn() {
  if (!state.level || !state.player) {
    return;
  }
  applySafeSpawn(state.level.playerSpawn);
  state.checkpointIndex = 0;
}

function coinRewardForDeaths(deaths) {
  if (deaths <= 10) {
    return 10;
  }
  if (deaths <= 20) {
    return 20;
  }
  if (deaths <= 30) {
    return 30;
  }
  return 50;
}

function ensureAudio() {
  if (!audioContext) {
    const AudioRef = window.AudioContext || window.webkitAudioContext;
    if (!AudioRef) {
      return null;
    }
    audioContext = new AudioRef();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }
  return audioContext;
}

function playTone(freq, duration, type = "square", volume = 0.03, delay = 0, bypass = false) {
  if (!bypass && !state.soundOn) {
    return;
  }
  const audio = ensureAudio();
  if (!audio) {
    return;
  }
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;
  osc.connect(gain);
  gain.connect(audio.destination);
  const now = audio.currentTime + delay;
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.start(now);
  osc.stop(now + duration);
}

function playUploadedSound(soundId) {
  const asset = state.customAssets.find((item) => item.id === soundId && item.kind === "sound");
  if (!asset || !state.soundOn) {
    return;
  }
  const audio = new Audio(asset.dataUrl);
  audio.volume = 0.7;
  audio.play().catch(() => {});
}

function playGameSound(eventName) {
  const soundId = state.eventSounds[eventName];
  if (soundId) {
    playUploadedSound(soundId);
    return;
  }
  if (eventName === "death") {
    playTone(500, 0.08, "triangle", 0.05);
    playTone(320, 0.12, "sine", 0.035, 0.08);
    playTone(180, 0.18, "square", 0.03, 0.16);
  }
  if (eventName === "jump") {
    playTone(460, 0.08, "square", 0.03);
  }
  if (eventName === "trap") {
    playTone(300, 0.12, "sawtooth", 0.035);
  }
}

function playWinSound() {
  [392, 523.25, 659.25, 783.99].forEach((note, index) => {
    playTone(note, 0.16, "square", 0.03, index * 0.11);
  });
}

function startMusic() {
  stopMusic();
  if (!state.musicOn) {
    return;
  }
  ensureAudio();
  const notes = [261.63, 329.63, 392, 329.63];
  let cursor = 0;
  const loop = () => {
    if (!state.musicOn) {
      return;
    }
    playTone(notes[cursor % notes.length], 0.16, "square", 0.015, 0, true);
    cursor += 1;
    musicTimer = setTimeout(loop, 320);
  };
  loop();
}

function stopMusic() {
  if (musicTimer) {
    clearTimeout(musicTimer);
    musicTimer = null;
  }
}

function compareCoordinate(value, comparator, target) {
  if (comparator === ">=") {
    return value >= target;
  }
  if (comparator === "<=") {
    return value <= target;
  }
  return Math.abs(value - target) < 0.5;
}

function objectPixelRect(object) {
  const runtime = object.runtime || object;
  return {
    x: runtime.x * WORLD.tile,
    y: runtime.y * WORLD.tile,
    w: runtime.width * WORLD.tile,
    h: runtime.height * WORLD.tile,
  };
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function solidObjects() {
  if (!state.level) {
    return [];
  }
  return state.level.objects.filter((object) => {
    const runtime = object.runtime;
    if (!runtime || runtime.removed || !runtime.visible) {
      return false;
    }
    if (object.functions.fakeBlock) {
      return false;
    }
    return object.type === "block" || object.type === "movingPlatform";
  });
}

function lethalObjects() {
  if (!state.level) {
    return [];
  }
  return state.level.objects.filter((object) => {
    const runtime = object.runtime;
    return runtime && !runtime.removed && runtime.visible && (object.functions.killObject || object.type === "spike" || object.type === "bomb");
  });
}

function updateCheckpoint() {
  if (!state.level || !state.player) {
    return;
  }
  state.level.checkpoints.forEach((checkpoint, index) => {
    if (state.player.x >= checkpoint.x * WORLD.tile - 10) {
      state.checkpointIndex = index;
    }
  });
}

function respawnAtCheckpoint(stepBack = 1) {
  if (!state.level || !state.player) {
    return;
  }
  const checkpoint = state.level.checkpoints[Math.max(0, state.checkpointIndex - stepBack)] || state.level.checkpoints[0];
  applySafeSpawn(checkpoint, false);
  state.mode = "playing";
}

function loseLife(reason) {
  state.totalDeaths += 1;
  state.levelDeaths += 1;
  state.perLevelDeaths[state.levelIndex] = state.levelDeaths;
  state.lives -= 1;
  state.trollText = TAUNTS[Math.floor(Math.random() * TAUNTS.length)];
  state.trollTimer = 90;
  playGameSound("death");
  updateUi();
  saveGame();

  if (state.dev.preview) {
    if (state.lives <= 0) {
      state.lives = 2;
      loadLevel(state.levelIndex, state.dev.draft);
      state.dev.preview = false;
      state.mode = "editor";
      hideOverlay();
      renderDevPanel();
      return;
    }
    respawnAtCheckpoint(1);
    return;
  }

  if (state.lives > 0) {
    respawnAtCheckpoint(1);
    return;
  }

  if (!state.extraLivesUsed) {
    state.mode = "paused";
    showOverlay("Out of lives", "Watch ad to continue from here and get 2 more lives.", "Watch Ad", "ad");
    return;
  }

  state.mode = "paused";
  showOverlay("Die Again", reason, "Restart Level", "restart");
}

function executeTriggerAction(action) {
  if (!state.level) {
    return;
  }
  if (action.type === "spawnObject") {
    const object = state.level.objects.find((item) => item.id === action.objectId);
    if (object && object.runtime) {
      object.runtime.visible = true;
      object.runtime.removed = false;
    }
  }
  if (action.type === "removeObject") {
    const object = state.level.objects.find((item) => item.id === action.objectId);
    if (object && object.runtime) {
      object.runtime.removed = true;
    }
  }
  if (action.type === "moveObject") {
    const object = state.level.objects.find((item) => item.id === action.objectId);
    if (object && object.runtime) {
      object.runtime.x = Number(action.x ?? object.runtime.x);
      object.runtime.y = Number(action.y ?? object.runtime.y);
    }
  }
  if (action.type === "message") {
    state.trapMessage = action.text || "Trap fired.";
    state.trapTimer = 120;
    playGameSound("trap");
  }
}

function playerCoordinates() {
  return {
    m: state.player ? (state.player.x + state.player.w / 2) / WORLD.tile : 0,
    n: state.player ? (state.player.y + state.player.h / 2) / WORLD.tile : 0,
  };
}

function updateObjectRuntime(object, elapsedSeconds) {
  const runtime = object.runtime;
  if (!runtime || runtime.removed) {
    return;
  }
  const { m, n } = playerCoordinates();
  if (object.functions.spawnTrigger && !runtime.spawnFired) {
    if (compareCoordinate(object.spawnAt.axis === "n" ? n : m, object.spawnAt.comparator, Number(object.spawnAt.value))) {
      runtime.visible = true;
      runtime.spawnFired = true;
    }
  }
  if (object.functions.disappearTrigger && !runtime.disappearFired) {
    if (compareCoordinate(object.disappearAt.axis === "n" ? n : m, object.disappearAt.comparator, Number(object.disappearAt.value))) {
      runtime.visible = false;
      runtime.removed = true;
      runtime.disappearFired = true;
    }
  }
  if (object.functions.trapTrigger && !runtime.trapFired) {
    if (compareCoordinate(object.trap.axis === "n" ? n : m, object.trap.comparator, Number(object.trap.value))) {
      object.trap.actions.forEach(executeTriggerAction);
      runtime.trapFired = true;
    }
  }
  if (object.functions.moving) {
    const motion = object.motion || { axis: "x", distance: 0, speed: 1 };
    const wave = Math.sin(elapsedSeconds * motion.speed);
    if (motion.axis === "y") {
      runtime.y = object.y + wave * motion.distance;
    } else {
      runtime.x = object.x + wave * motion.distance;
    }
  }
  if (object.keyframes && object.keyframes.length >= 2) {
    const frames = [...object.keyframes].sort((a, b) => a.t - b.t);
    const maxTime = frames[frames.length - 1].t || 1;
    const time = elapsedSeconds % maxTime;
    for (let index = 0; index < frames.length - 1; index += 1) {
      const current = frames[index];
      const next = frames[index + 1];
      if (time >= current.t && time <= next.t) {
        const span = next.t - current.t || 1;
        const progress = (time - current.t) / span;
        runtime.x = current.x + (next.x - current.x) * progress;
        runtime.y = current.y + (next.y - current.y) * progress;
        break;
      }
    }
  }
}

function handleLevelTriggers() {
  if (!state.level || !state.player) {
    return;
  }
  const { m, n } = playerCoordinates();
  state.level.triggers.forEach((trigger) => {
    if (trigger.fired) {
      return;
    }
    const coord = trigger.condition.axis === "n" ? n : m;
    if (compareCoordinate(coord, trigger.condition.comparator, Number(trigger.condition.value))) {
      trigger.fired = true;
      trigger.actions.forEach(executeTriggerAction);
    }
  });
}

function queueStep(direction) {
  if (!state.player) {
    return;
  }
  const multiplier = !state.player.grounded && (input.left || input.right) ? WORLD.airStepMultiplier : 1;
  if (state.player.stepPixelsRemaining > 0 && state.player.stepDirection !== direction) {
    return;
  }
  state.player.stepDirection = direction;
  state.player.stepPixelsRemaining += WORLD.stepDistance * multiplier;
}

function updateHeldMovement() {
  if (!state.player) {
    return;
  }
  if (input.left) {
    input.leftHoldFrames += 1;
    if (input.leftHoldFrames === 1 || (input.leftHoldFrames > WORLD.holdDelayFrames && (input.leftHoldFrames - WORLD.holdDelayFrames) % WORLD.holdRepeatFrames === 0)) {
      queueStep(-1);
    }
  } else {
    input.leftHoldFrames = 0;
  }

  if (input.right) {
    input.rightHoldFrames += 1;
    if (input.rightHoldFrames === 1 || (input.rightHoldFrames > WORLD.holdDelayFrames && (input.rightHoldFrames - WORLD.holdDelayFrames) % WORLD.holdRepeatFrames === 0)) {
      queueStep(1);
    }
  } else {
    input.rightHoldFrames = 0;
  }
}

function resolveCollisions(axis) {
  if (!state.player) {
    return;
  }
  if (axis === "y") {
    state.player.grounded = false;
  }
  solidObjects().forEach((object) => {
    const rect = objectPixelRect(object);
    if (!rectsOverlap(state.player, rect)) {
      return;
    }
    if (axis === "x") {
      state.player.x = state.player.vx > 0 ? rect.x - state.player.w : rect.x + rect.w;
      state.player.vx = 0;
      return;
    }
    if (state.player.vy > 0) {
      state.player.y = rect.y - state.player.h;
      state.player.grounded = true;
    } else if (state.player.vy < 0) {
      state.player.y = rect.y + rect.h;
    }
    state.player.vy = 0;
  });

  if (state.player.x < 0) {
    state.player.x = 0;
  }
  if (state.player.x + state.player.w > WORLD.widthPx) {
    state.player.x = WORLD.widthPx - state.player.w;
  }
  if (state.player.y > WORLD.heightPx + state.player.h) {
    loseLife("Neeche sirf maut thi.");
  }
}

function applyMovement() {
  if (!state.player) {
    return;
  }
  if (state.player.stepPixelsRemaining > 0 && state.player.stepDirection !== 0) {
    const step = Math.min(WORLD.stepSpeed, state.player.stepPixelsRemaining);
    state.player.vx = step * state.player.stepDirection;
    state.player.stepPixelsRemaining -= step;
    state.player.facing = state.player.vx >= 0 ? 1 : -1;
  } else {
    state.player.vx = 0;
    state.player.stepPixelsRemaining = 0;
    state.player.stepDirection = 0;
  }

  if (input.jumpQueued && state.player.grounded) {
    state.player.vy = WORLD.jumpVelocity;
    state.player.grounded = false;
    playGameSound("jump");
  }
  input.jumpQueued = false;

  state.player.vy += WORLD.gravity;
  state.player.vy = clamp(state.player.vy, -WORLD.terminalVelocity, WORLD.terminalVelocity);
  state.player.x += state.player.vx;
  resolveCollisions("x");
  state.player.y += state.player.vy;
  resolveCollisions("y");
  const playZone = currentPlayZone();
  state.player.x = clamp(state.player.x, playZone.startX, Math.max(playZone.startX, playZone.endX - state.player.w));
}

function updateGame() {
  if (!state.level || !state.player) {
    return;
  }
  if (state.mode !== "playing") {
    if (state.trapTimer > 0) {
      state.trapTimer -= 1;
    }
    if (state.trollTimer > 0) {
      state.trollTimer -= 1;
    }
    return;
  }

  if (state.trapTimer > 0) {
    state.trapTimer -= 1;
  }
  if (state.trollTimer > 0) {
    state.trollTimer -= 1;
  }

  const elapsedSeconds = performance.now() / 1000;
  state.level.objects.forEach((object) => updateObjectRuntime(object, elapsedSeconds));
  handleLevelTriggers();
  updateHeldMovement();
  applyMovement();
  updateCheckpoint();
  syncCameraToPlayer();

  for (const object of lethalObjects()) {
    if (rectsOverlap(state.player, objectPixelRect(object))) {
      loseLife("Trap ne pakad liya.");
      return;
    }
  }

  const exitRect = {
    x: state.level.exit.x * WORLD.tile,
    y: state.level.exit.y * WORLD.tile,
    w: state.level.exit.width * WORLD.tile,
    h: state.level.exit.height * WORLD.tile,
  };
  if (rectsOverlap(state.player, exitRect)) {
    if (state.dev.preview) {
      state.mode = "paused";
      showOverlay("Preview Clear", "Draft works. Keep editing or publish it.", "Stay in Editor", "editor-home", "Close");
      return;
    }
    const reward = coinRewardForDeaths(state.levelDeaths);
    state.coins += reward;
    state.highestUnlockedLevel = Math.max(state.highestUnlockedLevel, Math.min(state.levelIndex + 2, state.levelCatalog.length));
    state.mode = "paused";
    playWinSound();
    saveGame();
    updateUi();
    showOverlay("Level Clear", `You earned ${reward} coins.`, "Next Level", "next");
  }
}

function drawBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ef7d18";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f5ca74";
  ctx.fillRect(60, 60, canvas.width - 120, canvas.height - 120);
}

function drawGrid() {
  ctx.save();
  ctx.strokeStyle = "rgba(90, 47, 18, 0.16)";
  ctx.lineWidth = 1;
  const startX = -((currentCameraX()) % WORLD.tile);
  for (let x = startX; x <= canvas.width; x += WORLD.tile) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += WORLD.tile) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawAssetObject(object) {
  const rect = worldToScreenRect(objectPixelRect(object));
  const asset = getAssetCatalog().find((item) => item.id === object.assetId);
  const color = asset && asset.color ? asset.color : "#d36c18";
  const runtime = object.runtime || { visible: true };
  if (!runtime.visible || runtime.removed) {
    return;
  }
  if (rect.x + rect.w < 0 || rect.x > canvas.width) {
    return;
  }
  if (asset && asset.dataUrl && asset.kind === "image") {
    if (!assetImageCache[asset.id]) {
      const image = new Image();
      image.src = asset.dataUrl;
      assetImageCache[asset.id] = image;
    }
    const image = assetImageCache[asset.id];
    if (image.complete) {
      ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h);
      return;
    }
  }
  if (object.type === "spike") {
    ctx.fillStyle = color;
    const teeth = Math.max(2, Math.floor(rect.w / 8));
    const tooth = rect.w / teeth;
    for (let i = 0; i < teeth; i += 1) {
      const x = rect.x + i * tooth;
      ctx.beginPath();
      ctx.moveTo(x, rect.y + rect.h);
      ctx.lineTo(x + tooth / 2, rect.y);
      ctx.lineTo(x + tooth, rect.y + rect.h);
      ctx.closePath();
      ctx.fill();
    }
    return;
  }
  if (object.type === "bomb") {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(rect.x + rect.w / 2, rect.y + rect.h / 2, Math.min(rect.w, rect.h) / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffcf56";
    ctx.fillRect(rect.x + rect.w * 0.48, rect.y - 6, 4, 8);
    return;
  }
  ctx.fillStyle = color;
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  if (object.type === "movingPlatform") {
    ctx.fillStyle = "#8a4e13";
    ctx.fillRect(rect.x + 6, rect.y + 6, rect.w - 12, rect.h - 12);
  }
}

function drawExit() {
  if (!state.level) {
    return;
  }
  const exitRect = worldToScreenRect({
    x: state.level.exit.x * WORLD.tile,
    y: state.level.exit.y * WORLD.tile,
    w: state.level.exit.width * WORLD.tile,
    h: state.level.exit.height * WORLD.tile,
  });
  ctx.fillStyle = "#111111";
  ctx.fillRect(exitRect.x, exitRect.y, exitRect.w, exitRect.h);
  ctx.fillStyle = "#b8b0ac";
  ctx.fillRect(exitRect.x + 4, exitRect.y + 4, exitRect.w - 8, exitRect.h - 4);
}

function drawSprite(pattern, px, py, colors, facing) {
  ctx.save();
  if (facing < 0) {
    ctx.translate(px + pattern[0].length * 3, 0);
    ctx.scale(-1, 1);
    ctx.translate(-px, 0);
  }
  const palette = { "1": "#111111", "2": colors.body, "3": colors.accent };
  pattern.forEach((row, rowIndex) => {
    [...row].forEach((pixel, colIndex) => {
      if (pixel === ".") {
        return;
      }
      ctx.fillStyle = palette[pixel];
      ctx.fillRect(px + colIndex * 3, py + rowIndex * 3, 3, 3);
    });
  });
  ctx.fillStyle = colors.shade;
  ctx.fillRect(px + 9, py + 12, 12, 8);
  ctx.restore();
}

function withPlayerMirror(px, facing, width, drawFn) {
  ctx.save();
  if (facing < 0) {
    ctx.translate(px + width, 0);
    ctx.scale(-1, 1);
    ctx.translate(-px, 0);
  }
  drawFn();
  ctx.restore();
}

function drawPlayerBody(player, character, px, py) {
  withPlayerMirror(px, player.facing, player.w, () => {
    ctx.fillStyle = character.bodyColor;
    if (character.shape === "robot") {
      ctx.fillRect(px + 7, py + 2, 16, 13);
      ctx.fillRect(px + 5, py + 16, 20, 16);
      ctx.fillRect(px + 8, py + 32, 5, 9);
      ctx.fillRect(px + 18, py + 32, 5, 9);
      ctx.fillRect(px + 3, py + 17, 4, 11);
      ctx.fillRect(px + 23, py + 17, 4, 11);
      return;
    }
    if (character.shape === "animal") {
      ctx.fillRect(px + 8, py + 5, 14, 11);
      ctx.fillRect(px + 5, py + 8, 20, 14);
      ctx.fillRect(px + 7, py + 22, 5, 15);
      ctx.fillRect(px + 18, py + 22, 5, 15);
      ctx.fillRect(px + 6, py + 2, 5, 7);
      ctx.fillRect(px + 19, py + 2, 5, 7);
      return;
    }
    ctx.fillRect(px + 8, py + 3, 14, 12);
    ctx.fillRect(px + 6, py + 16, 18, 16);
    ctx.fillRect(px + 8, py + 32, 5, 10);
    ctx.fillRect(px + 17, py + 32, 5, 10);
    ctx.fillRect(px + 2, py + 17, 4, 11);
    ctx.fillRect(px + 24, py + 17, 4, 11);
  });
}

function drawPlayerEyes(player, character, px, py) {
  withPlayerMirror(px, player.facing, player.w, () => {
    ctx.fillStyle = character.eyeColor;
    if (character.shape === "animal") {
      ctx.fillRect(px + 11, py + 8, 2, 2);
      ctx.fillRect(px + 17, py + 8, 2, 2);
      return;
    }
    ctx.fillRect(px + 10, py + 8, 3, 3);
    ctx.fillRect(px + 17, py + 8, 3, 3);
  });
}

function drawPlayerCloth(player, cloth, px, py) {
  if (!cloth || cloth.overlay === "none") {
    return;
  }
  withPlayerMirror(px, player.facing, player.w, () => {
    ctx.fillStyle = cloth.color;
    if (cloth.overlay === "hoodie") {
      ctx.fillRect(px + 6, py + 13, 18, 18);
      ctx.fillRect(px + 8, py + 9, 14, 7);
      return;
    }
    if (cloth.overlay === "ninja-mask") {
      ctx.fillRect(px + 8, py + 6, 14, 7);
      ctx.clearRect(px + 11, py + 8, 2, 2);
      ctx.clearRect(px + 17, py + 8, 2, 2);
      return;
    }
    if (cloth.overlay === "armor") {
      ctx.fillRect(px + 5, py + 15, 20, 14);
      ctx.fillRect(px + 8, py + 18, 3, 10);
      ctx.fillRect(px + 19, py + 18, 3, 10);
    }
  });
}

function drawPlayerAccessory(player, cloth, character, px, py) {
  withPlayerMirror(px, player.facing, player.w, () => {
    if (character.shape === "robot") {
      ctx.fillStyle = character.accentColor;
      ctx.fillRect(px + 13, py - 1, 4, 4);
      return;
    }
    if (!cloth || cloth.overlay === "none") {
      return;
    }
    ctx.fillStyle = cloth.color;
    if (cloth.overlay === "crown") {
      ctx.fillRect(px + 8, py - 1, 14, 3);
      ctx.fillRect(px + 9, py - 4, 2, 3);
      ctx.fillRect(px + 14, py - 6, 2, 5);
      ctx.fillRect(px + 19, py - 4, 2, 3);
      return;
    }
    if (cloth.overlay === "glasses") {
      ctx.fillStyle = "#111111";
      ctx.fillRect(px + 8, py + 7, 6, 4);
      ctx.fillRect(px + 16, py + 7, 6, 4);
      ctx.fillRect(px + 14, py + 8, 2, 1);
    }
  });
}

function drawPlayer() {
  if (!state.player) {
    return;
  }
  if (state.mode === "editor" && !state.dev.preview) {
    return;
  }
  const player = state.player;
  const px = Math.round(player.x - currentCameraX());
  const py = Math.round(player.y - cameraY);
  const character = player.characterConfig || currentCharacter();
  const characterAsset = character.assetId ? getAssetCatalog().find((item) => item.id === character.assetId) : null;
  if (characterAsset && characterAsset.dataUrl && characterAsset.kind === "image") {
    if (!assetImageCache[characterAsset.id]) {
      const image = new Image();
      image.src = characterAsset.dataUrl;
      assetImageCache[characterAsset.id] = image;
    }
    const image = assetImageCache[characterAsset.id];
    if (image.complete) {
      ctx.drawImage(image, px, py, player.w, player.h);
    } else {
      drawPlayerBody(player, character, px, py);
      drawPlayerEyes(player, character, px, py);
    }
  } else {
    drawPlayerBody(player, character, px, py);
    drawPlayerEyes(player, character, px, py);
  }
  const clothes = player.clothConfig || currentClothes();
  const clothAsset = clothes.assetId ? getAssetCatalog().find((item) => item.id === clothes.assetId) : null;
  if (clothAsset && clothAsset.dataUrl && clothAsset.kind === "image" && clothes.id !== "none") {
    if (!assetImageCache[clothAsset.id]) {
      const image = new Image();
      image.src = clothAsset.dataUrl;
      assetImageCache[clothAsset.id] = image;
    }
    const image = assetImageCache[clothAsset.id];
    if (image.complete) {
      ctx.drawImage(image, px, py, player.w, player.h);
    } else {
      drawPlayerCloth(player, clothes, px, py);
      drawPlayerAccessory(player, clothes, character, px, py);
    }
  } else {
    drawPlayerCloth(player, clothes, px, py);
    drawPlayerAccessory(player, clothes, character, px, py);
  }
}

function drawSpawnMarker() {
  if (!state.level || !state.debugSpawn || state.mode !== "editor" || state.dev.preview) {
    return;
  }
  const x = state.debugSpawn.x - currentCameraX();
  const y = state.debugSpawn.y - cameraY;
  ctx.save();
  ctx.strokeStyle = "#2fd06b";
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.fillStyle = "rgba(47, 208, 107, 0.18)";
  ctx.fillRect(x, y, WORLD.tile * 0.7, WORLD.tile * 1.3);
  ctx.strokeRect(x, y, WORLD.tile * 0.7, WORLD.tile * 1.3);
  ctx.setLineDash([]);
  ctx.fillStyle = "#1f7f43";
  ctx.font = "12px monospace";
  ctx.fillText("SPAWN", x - 4, y - 8);
  ctx.restore();
}

function getSelectedObject() {
  if (!state.level) {
    return null;
  }
  return state.level.objects.find((object) => object.id === state.dev.selectedObjectId) || null;
}

function drawEditorSelection() {
  if (!state.dev.enabled || state.screen !== "game" || state.dev.preview || !state.level) {
    return;
  }
  drawGrid();
  const playZone = currentPlayZone();
  ctx.save();
  ctx.strokeStyle = "#2fd06b";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(playZone.startX - currentCameraX(), 0);
  ctx.lineTo(playZone.startX - currentCameraX(), canvas.height);
  ctx.stroke();
  ctx.strokeStyle = "#e56d57";
  ctx.beginPath();
  ctx.moveTo(playZone.endX - currentCameraX(), 0);
  ctx.lineTo(playZone.endX - currentCameraX(), canvas.height);
  ctx.stroke();
  ctx.restore();
  state.level.objects.forEach((object) => {
    const rect = worldToScreenRect(objectPixelRect(object));
    ctx.save();
    ctx.strokeStyle = object.id === state.dev.hoverObjectId ? "rgba(255, 241, 200, 0.9)" : "rgba(90, 47, 18, 0.55)";
    ctx.lineWidth = object.id === state.dev.hoverObjectId ? 2.5 : 1;
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    ctx.restore();
  });
  const exitProxy = exitObjectProxy();
  if (exitProxy) {
    const exitRect = worldToScreenRect(objectPixelRect(exitProxy));
    ctx.save();
    ctx.strokeStyle = state.dev.hoverObjectId === "exit" ? "rgba(255, 241, 200, 0.95)" : "rgba(20, 20, 20, 0.75)";
    ctx.lineWidth = state.dev.hoverObjectId === "exit" ? 3 : 2;
    ctx.strokeRect(exitRect.x, exitRect.y, exitRect.w, exitRect.h);
    ctx.restore();
  }
  const selected = selectedEditorTarget();
  if (selected) {
    const rect = worldToScreenRect(objectPixelRect(selected));
    const handles = resizeHandlesForObject(selected);
    ctx.save();
    ctx.strokeStyle = "#fff1c8";
    ctx.lineWidth = 3;
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    ctx.shadowColor = "rgba(255, 241, 200, 0.8)";
    ctx.shadowBlur = 10;
    ctx.strokeRect(rect.x - 1, rect.y - 1, rect.w + 2, rect.h + 2);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#fff1c8";
    Object.values(handles).forEach((handle) => {
      ctx.fillRect(handle.x, handle.y, handle.w, handle.h);
    });
    ctx.restore();
  }
  ctx.save();
  ctx.fillStyle = "#5a2f12";
  ctx.fillRect(16, canvas.height - 78, 380, 62);
  ctx.fillStyle = "#fff1c8";
  ctx.font = "14px monospace";
  const pointerCoords = `Cursor (x,y): ${state.dev.pointerTile.x.toFixed(1)}, ${state.dev.pointerTile.y.toFixed(1)}`;
  const selectedCoords = selected ? `Selected ${selected.type}: ${selected.x.toFixed(1)}, ${selected.y.toFixed(1)} | ${selected.width.toFixed(1)} x ${selected.height.toFixed(1)}` : "Selected: none";
  ctx.fillText(pointerCoords, 28, canvas.height - 52);
  ctx.fillText(selectedCoords, 28, canvas.height - 34);
  ctx.fillText(`Editor: ${state.dev.tool} | Snap ${state.dev.snap ? "On" : "Off"} | View ${Math.round(currentCameraX())} / ${WORLD.widthPx}px`, 28, canvas.height - 16);
  ctx.restore();
}

function drawHudText() {
  if (!state.level) {
    return;
  }
  ctx.fillStyle = "#5c2f12";
  ctx.fillRect(12, 10, 300, 82);
  ctx.fillStyle = "#f4ce79";
  ctx.font = "bold 18px monospace";
  ctx.fillText(state.level.name, 24, 34);
  ctx.font = "14px monospace";
  ctx.fillText(`Deaths ${state.levelDeaths}`, 24, 55);
  ctx.fillText(`Lives ${state.lives}`, 24, 74);

  if (state.trapTimer > 0 && state.trapMessage) {
    ctx.fillStyle = "#43200c";
    ctx.fillRect(canvas.width / 2 - 170, 16, 340, 36);
    ctx.fillStyle = "#f8dfaa";
    ctx.textAlign = "center";
    ctx.fillText(state.trapMessage, canvas.width / 2, 39);
    ctx.textAlign = "left";
  }

  if (state.trollTimer > 0 && state.trollText) {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2 - 70);
    ctx.rotate(-0.1);
    ctx.fillStyle = "rgba(67, 26, 11, 0.92)";
    ctx.fillRect(-180, -24, 360, 48);
    ctx.fillStyle = "#db6551";
    ctx.font = "bold 30px monospace";
    ctx.textAlign = "center";
    ctx.fillText(state.trollText, 0, 10);
    ctx.restore();
    ctx.textAlign = "left";
  }
}

function render() {
  if (!ctx || !canvas || !state.level) {
    return;
  }
  syncEditorScrollUi();
  drawBackground();
  state.level.objects.forEach(drawAssetObject);
  drawExit();
  drawPlayer();
  drawSpawnMarker();
  drawHudText();
  drawEditorSelection();
}

function gameLoop() {
  updateGame();
  render();
  requestAnimationFrame(gameLoop);
}

function setAction(action, pressed) {
  ensureAudio();
  if (state.mode === "editor" && !state.dev.preview) {
    return;
  }
  if (action === "left" || action === "right") {
    input[action] = pressed;
    if (!pressed) {
      input[`${action}HoldFrames`] = 0;
    }
    return;
  }
  if (action === "jump" && pressed) {
    input.jumpQueued = true;
  }
}

function bindControlButtons() {
  document.querySelectorAll("[data-action]").forEach((button) => {
    const action = button.dataset.action;
    const down = (event) => {
      event.preventDefault();
      button.classList.add("active");
      setAction(action, true);
    };
    const up = (event) => {
      event.preventDefault();
      button.classList.remove("active");
      if (action === "left" || action === "right") {
        setAction(action, false);
      }
    };
    on(button, "pointerdown", down);
    on(button, "pointerup", up);
    on(button, "pointerleave", up);
    on(button, "pointercancel", up);
  });
}

function bindKeyboard() {
  on(window, "keydown", (event) => {
    if (event.repeat) {
      return;
    }
    if (event.code === "ArrowLeft" || event.code === "KeyA") setAction("left", true);
    if (event.code === "ArrowRight" || event.code === "KeyD") setAction("right", true);
    if (event.code === "ArrowUp" || event.code === "Space" || event.code === "KeyW") setAction("jump", true);
    if (state.dev.enabled && !state.dev.preview && event.code === "Delete") deleteSelectedObject();
  });
  on(window, "keyup", (event) => {
    if (event.code === "ArrowLeft" || event.code === "KeyA") setAction("left", false);
    if (event.code === "ArrowRight" || event.code === "KeyD") setAction("right", false);
  });
}

function getCanvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (canvas.width / rect.width),
    y: (event.clientY - rect.top) * (canvas.height / rect.height),
  };
}

function snapValue(value) {
  return state.dev.snap ? Math.round(value) : Math.round(value * 10) / 10;
}

function resizeHandlesForObject(object) {
  const rect = worldToScreenRect(objectPixelRect(object));
  const size = 14;
  return {
    nw: { x: rect.x - size / 2, y: rect.y - size / 2, w: size, h: size },
    ne: { x: rect.x + rect.w - size / 2, y: rect.y - size / 2, w: size, h: size },
    sw: { x: rect.x - size / 2, y: rect.y + rect.h - size / 2, w: size, h: size },
    se: { x: rect.x + rect.w - size / 2, y: rect.y + rect.h - size / 2, w: size, h: size },
  };
}

function pointInRect(point, rect) {
  return point.x >= rect.x && point.x <= rect.x + rect.w && point.y >= rect.y && point.y <= rect.y + rect.h;
}

function hitTestObject(point) {
  if (!state.level) {
    return null;
  }
  const exit = exitObjectProxy();
  if (exit && pointInRect(point, worldToScreenRect(objectPixelRect(exit)))) {
    return exit;
  }
  return [...state.level.objects].reverse().find((object) => pointInRect(point, worldToScreenRect(objectPixelRect(object)))) || null;
}

function setSelectedObject(objectId) {
  state.dev.selectedObjectId = objectId;
  renderDevPanel();
}

function deleteSelectedObject() {
  if (!state.dev.draft || !state.dev.selectedObjectId) {
    return;
  }
  if (state.dev.selectedObjectId === "exit") {
    state.level.exit = { x: -100, y: -100, width: 1.4, height: 1.8 };
    state.dev.draft.exit = deepClone(state.level.exit);
    state.dev.selectedObjectId = "";
    state.dev.status = "Exit removed. Use Exit tool to re-add it.";
    renderDevPanel();
    return;
  }
  state.dev.draft.objects = state.dev.draft.objects.filter((object) => object.id !== state.dev.selectedObjectId);
  if (state.level) {
    state.level.objects = state.level.objects.filter((object) => object.id !== state.dev.selectedObjectId);
  }
  state.dev.selectedObjectId = "";
  state.dev.status = "Selected object deleted.";
  renderDevPanel();
}

function syncDraftFromRuntime() {
  if (!state.level || !state.dev.draft) {
    return;
  }
  state.dev.draft.objects = state.level.objects.map((object) => {
    const copy = deepClone(object);
    delete copy.runtime;
    return normalizeObject(copy);
  });
  state.dev.draft.exit = deepClone(state.level.exit);
  state.dev.draft.playZone = deepClone(state.level.playZone);
  state.dev.draft.playerSpawn = deepClone(state.level.playerSpawn);
  state.dev.draft.checkpoints = deepClone(state.level.checkpoints);
  state.dev.draft.triggers = state.level.triggers.map((trigger) => {
    const copy = deepClone(trigger);
    delete copy.fired;
    return normalizeTrigger(copy);
  });
}


function handleCanvasPointerDown(event) {
  if (!state.dev.enabled || state.screen !== "game" || state.dev.preview || !state.level) {
    return;
  }
  const point = getCanvasPoint(event);
  const worldPoint = canvasPointToWorld(point);
  const tileX = worldPoint.x / WORLD.tile;
  const tileY = worldPoint.y / WORLD.tile;
  state.dev.pointerTile = { x: tileX, y: tileY };
  if (state.dev.tool !== "select") {
    if (state.dev.tool === "exit") {
      const proxy = { id: "exit", type: "exit", x: snapValue(tileX), y: snapValue(tileY), width: 1.4, height: 1.8 };
      setExitFromProxy(proxy);
      syncDraftFromRuntime();
      setSelectedObject("exit");
      state.dev.status = `exit placed at (${proxy.x}, ${proxy.y}).`;
      renderDevPanel();
      return;
    }
    const created = normalizeObject(createDefaultObject(state.dev.tool, snapValue(tileX), snapValue(tileY)));
    state.level.objects.push(created);
    syncDraftFromRuntime();
    setSelectedObject(created.id);
    state.dev.status = `${created.type} placed at (${created.x}, ${created.y}).`;
    renderDevPanel();
    return;
  }

  const hit = hitTestObject(point);
  if (!hit) {
    setSelectedObject("");
    state.dev.hoverObjectId = "";
    return;
  }
  setSelectedObject(hit.id);
  state.dev.hoverObjectId = hit.id;
  const handles = resizeHandlesForObject(hit);
  const activeHandle = Object.entries(handles).find(([, rect]) => pointInRect(point, rect));
  if (activeHandle) {
    state.dev.resize = {
      id: hit.id,
      handle: activeHandle[0],
      startX: hit.x,
      startY: hit.y,
      startWidth: hit.width,
      startHeight: hit.height,
    };
    return;
  }
  state.dev.drag = { id: hit.id, offsetX: tileX - hit.x, offsetY: tileY - hit.y };
}

function handleCanvasPointerMove(event) {
  if (!state.dev.enabled || state.screen !== "game" || state.dev.preview || !state.level) {
    return;
  }
  const point = getCanvasPoint(event);
  const worldPoint = canvasPointToWorld(point);
  const tileX = worldPoint.x / WORLD.tile;
  const tileY = worldPoint.y / WORLD.tile;
  state.dev.pointerTile = { x: tileX, y: tileY };
  const hovered = hitTestObject(point);
  state.dev.hoverObjectId = hovered ? hovered.id : "";
  if (state.dev.drag) {
    const object = state.dev.drag.id === "exit" ? exitObjectProxy() : state.level.objects.find((item) => item.id === state.dev.drag.id);
    if (object) {
      object.x = clamp(snapValue(tileX - state.dev.drag.offsetX), 0, WORLD.widthTiles - object.width);
      object.y = clamp(snapValue(tileY - state.dev.drag.offsetY), 0, WORLD.heightTiles - object.height);
      if (state.dev.drag.id === "exit") {
        setExitFromProxy(object);
      } else if (object.runtime) {
        object.runtime.x = object.x;
        object.runtime.y = object.y;
      }
      syncDraftFromRuntime();
      renderDevPanel();
    }
  }
  if (state.dev.resize) {
    const object = state.dev.resize.id === "exit" ? exitObjectProxy() : state.level.objects.find((item) => item.id === state.dev.resize.id);
    if (object) {
      const nextX = snapValue(tileX);
      const nextY = snapValue(tileY);
      if (state.dev.resize.handle.includes("w")) {
        const right = state.dev.resize.startX + state.dev.resize.startWidth;
        object.x = clamp(nextX, 0, right - 0.5);
        object.width = clamp(right - object.x, 0.5, WORLD.widthTiles - object.x);
      } else {
        object.width = clamp(nextX - object.x, 0.5, WORLD.widthTiles - object.x);
      }
      if (state.dev.resize.handle.includes("n")) {
        const bottom = state.dev.resize.startY + state.dev.resize.startHeight;
        object.y = clamp(nextY, 0, bottom - 0.5);
        object.height = clamp(bottom - object.y, 0.5, WORLD.heightTiles - object.y);
      } else {
        object.height = clamp(nextY - object.y, 0.5, WORLD.heightTiles - object.y);
      }
      if (state.dev.resize.id === "exit") {
        setExitFromProxy(object);
      } else if (object.runtime) {
        object.runtime.x = object.x;
        object.runtime.y = object.y;
        object.runtime.width = object.width;
        object.runtime.height = object.height;
      }
      syncDraftFromRuntime();
      renderDevPanel();
    }
  }
}

function handleCanvasPointerUp() {
  state.dev.drag = null;
  state.dev.resize = null;
}

function bindCanvasEditor() {
  on(canvas, "pointerdown", handleCanvasPointerDown);
  on(window, "pointermove", handleCanvasPointerMove);
  on(window, "pointerup", handleCanvasPointerUp);
}

function encodeValue(value) {
  return btoa(unescape(encodeURIComponent(value)));
}

function decodeValue(value) {
  return decodeURIComponent(escape(atob(value)));
}

const DEV_SECRET = encodeValue("Mohit#777#");
const DEV_QUESTION = "hii";
const DEV_ANSWER = encodeValue("sachin");

function renderDevPanel() {
  if (!state.dev.panel) {
    return;
  }
  const shouldShow = state.dev.enabled && state.screen === "game" && state.mode === "editor";
  state.dev.panel.classList.toggle("hidden", !shouldShow);
  document.body.classList.toggle("editor-open", shouldShow);
  syncEditorScrollUi();
  if (!shouldShow) {
    return;
  }
  const content = state.dev.panel.querySelector(".dev-content");
  const selected = selectedEditorTarget();
  const trigger = state.dev.draft ? state.dev.draft.triggers.find((item) => item.id === state.dev.selectedTriggerId) : null;
  const selectedShopItem = getShopManagerCatalog().find((item) => item.id === state.dev.selectedShopItemId) || null;
  state.dev.panel.querySelectorAll("[data-dev-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.devTab === state.dev.activeTab);
  });
  setText(state.dev.panel.querySelector(".dev-status"), state.dev.status);
  const base = {
    editor: `
      <div class="dev-tool-row">
        ${["select", "block", "spike", "movingPlatform", "bomb", "exit"].map((tool) => `<button type="button" data-tool="${tool}" class="${state.dev.tool === tool ? "active" : ""}">${tool}</button>`).join("")}
      </div>
      <div class="dev-subtitle">Ready Assets</div>
      <div class="dev-asset-strip">
        ${DEFAULT_ASSETS.map((asset) => `<button type="button" class="dev-asset-card" data-asset-tool="${asset.id}"><span class="dev-asset-chip" style="background:${asset.color};"></span><strong>${asset.name}</strong><small>${asset.id.replace("asset-", "")}</small></button>`).join("")}
      </div>
      <div class="dev-grid-two">
        <label class="dev-toggle"><input id="snapToggle" type="checkbox" ${state.dev.snap ? "checked" : ""}><span>Snap To Grid</span></label>
        <button type="button" data-dev-action="set-spawn">Set Spawn</button>
        <button type="button" data-dev-action="set-exit">Set Exit</button>
        <button type="button" data-dev-action="add-checkpoint">Add Checkpoint</button>
      </div>
      <div class="dev-list">
        <div class="dev-list-row">Player (m,n): ${state.dev.draft ? `${Number(state.dev.draft.playerSpawn.x ?? state.dev.draft.playerSpawn.m).toFixed(1)}, ${Number(state.dev.draft.playerSpawn.y ?? state.dev.draft.playerSpawn.n).toFixed(1)}` : "-"}</div>
        <div class="dev-list-row">Exit (x,y): ${state.dev.draft ? `${state.dev.draft.exit.x}, ${state.dev.draft.exit.y}` : "-"}</div>
        <div class="dev-list-row">Play Zone: ${state.dev.draft ? `${Math.round(state.dev.draft.playZone?.startX ?? 0)}px -> ${Math.round(state.dev.draft.playZone?.endX ?? canvas.width)}px` : "-"}</div>
        <div class="dev-list-row">Objects: ${state.dev.draft ? state.dev.draft.objects.length : 0}</div>
        <div class="dev-list-row">Triggers: ${state.dev.draft ? state.dev.draft.triggers.length : 0}</div>
      </div>
    `,
    properties: selected && selected.type === "exit" ? `
      <div class="dev-grid-two">
        <label>Name<input id="propName" value="${selected.name || "exit"}"></label>
        <label>Type<input value="exit" disabled></label>
        <label>X<input id="propX" type="number" step="0.1" value="${selected.x}"></label>
        <label>Y<input id="propY" type="number" step="0.1" value="${selected.y}"></label>
        <label>Width<input id="propW" type="number" step="0.1" value="${selected.width}"></label>
        <label>Height<input id="propH" type="number" step="0.1" value="${selected.height}"></label>
        <button type="button" data-dev-action="delete-selected">Delete Exit</button>
      </div>
    ` : selected ? `
      <div class="dev-grid-two">
        <label>Name<input id="propName" value="${selected.name}"></label>
        <label>Type<select id="propType">${OBJECT_TYPES.map((type) => `<option value="${type}" ${selected.type === type ? "selected" : ""}>${type}</option>`).join("")}</select></label>
        <label>X<input id="propX" type="number" step="0.1" value="${selected.x}"></label>
        <label>Y<input id="propY" type="number" step="0.1" value="${selected.y}"></label>
        <label>Width<input id="propW" type="number" step="0.1" value="${selected.width}"></label>
        <label>Height<input id="propH" type="number" step="0.1" value="${selected.height}"></label>
        <label>Asset<select id="propAsset">${getAssetCatalog().filter((asset) => asset.kind === "image").map((asset) => `<option value="${asset.id}" ${selected.assetId === asset.id ? "selected" : ""}>${asset.name}</option>`).join("")}</select></label>
        <label>Sound<select id="propSound"><option value="">None</option>${getAssetCatalog("sound").map((asset) => `<option value="${asset.id}" ${selected.soundId === asset.id ? "selected" : ""}>${asset.name}</option>`).join("")}</select></label>
      </div>
      <div class="dev-toggle-grid">${FUNCTION_FLAGS.map((flag) => `<label class="dev-toggle"><input type="checkbox" data-func="${flag}" ${selected.functions[flag] ? "checked" : ""}><span>${flag}</span></label>`).join("")}</div>
      <div class="dev-grid-two">
        <label>Move Axis<select id="motionAxis"><option value="x" ${selected.motion.axis === "x" ? "selected" : ""}>Horizontal</option><option value="y" ${selected.motion.axis === "y" ? "selected" : ""}>Vertical</option></select></label>
        <label>Move Speed<input id="motionSpeed" type="number" step="0.1" value="${selected.motion.speed}"></label>
        <label>Move Distance<input id="motionDistance" type="number" step="0.1" value="${selected.motion.distance}"></label>
        <label>Spawn At<input id="spawnAtValue" type="number" step="0.1" value="${selected.spawnAt.value}"></label>
      </div>
      <div class="dev-grid-two">
        <label>Keyframe t<input id="keyT" type="number" step="0.1" value="1"></label>
        <label>Keyframe x<input id="keyX" type="number" step="0.1" value="${selected.x}"></label>
        <label>Keyframe y<input id="keyY" type="number" step="0.1" value="${selected.y}"></label>
        <button type="button" data-dev-action="add-keyframe">Add Keyframe</button>
        <button type="button" data-dev-action="delete-selected">Delete Object</button>
      </div>
      <div class="dev-list">${selected.keyframes.map((frame, index) => `<div class="dev-list-row">t=${frame.t} x=${frame.x} y=${frame.y} <button type="button" data-remove-key="${index}">Remove</button></div>`).join("") || `<p class="dev-empty">No keyframes yet.</p>`}</div>
    ` : `<p class="dev-empty">Select an object on the canvas.</p>`,
    triggers: `
      <div class="dev-list">${state.dev.draft ? state.dev.draft.triggers.map((item) => `<button type="button" class="dev-list-row${state.dev.selectedTriggerId === item.id ? " active" : ""}" data-trigger="${item.id}">${item.name} | ${item.condition.axis} ${item.condition.comparator} ${item.condition.value}</button>`).join("") : ""}</div>
      <div class="dev-grid-two">
        <label>Name<input id="triggerName" value="${trigger ? trigger.name : "Trigger"}"></label>
        <label>Axis<select id="triggerAxis"><option value="m">m</option><option value="n">n</option></select></label>
        <label>Value<input id="triggerValue" type="number" step="0.1" value="${trigger ? trigger.condition.value : 10}"></label>
        <label>Action<select id="triggerAction"><option value="spawnObject">Spawn</option><option value="removeObject">Remove</option><option value="moveObject">Move</option><option value="message">Message</option></select></label>
        <label>Target<select id="triggerTarget">${state.dev.draft ? state.dev.draft.objects.map((object) => `<option value="${object.id}">${object.name}</option>`).join("") : ""}</select></label>
        <label>Message<input id="triggerMessage" value="Trap fired"></label>
        <button type="button" data-dev-action="add-trigger">Add Trigger</button>
        <button type="button" data-dev-action="add-trigger-action">Add Action</button>
      </div>
    `,
    assets: `
      <div class="dev-list">${getAssetCatalog().map((asset) => `<div class="dev-list-row">${asset.name} | ${asset.kind}</div>`).join("")}</div>
      <div class="dev-subtitle">Player Characters</div>
      <div class="dev-asset-strip">
        ${DEFAULT_CHARACTERS.filter((item) => ["prisoner", "ninja", "robot", "cat", "hacker"].includes(item.id)).map((item) => `<button type="button" class="dev-asset-card${state.equippedCharacter === item.id ? " active" : ""}" data-player-asset="${item.id}"><span class="dev-asset-chip" style="background:${item.bodyColor};"></span><strong>${item.name}</strong><small>${item.shape}</small></button>`).join("")}
      </div>
      <div class="dev-grid-two">
        <label>Name<input id="assetName" value=""></label>
        <label>Kind<select id="assetKind"><option value="image">Image</option><option value="sound">Sound</option><option value="character">Character</option><option value="clothes">Clothes</option></select></label>
        <label class="dev-wide">File<input id="assetFile" type="file" accept="image/*,audio/*"></label>
        <button type="button" data-dev-action="upload-asset">Upload</button>
      </div>
    `,
    shop: `
      <div class="dev-list">${getShopManagerCatalog().map((item) => `<button type="button" class="dev-list-row${state.dev.selectedShopItemId === item.id ? " active" : ""}" data-shop-item="${item.id}">${item.name} | ${item.kind} | ${item.price}</button>`).join("")}</div>
      <div class="dev-grid-two">
        <label>Name<input id="shopName" value="${selectedShopItem?.name || ""}"></label>
        <label>Kind<select id="shopKind"><option value="character">Character</option><option value="clothes">Clothes</option><option value="item">Item</option></select></label>
        <label>Price<input id="shopPrice" type="number" value="${selectedShopItem?.price ?? 50}"></label>
        <label>Asset<select id="shopAsset">${getAssetCatalog().map((asset) => `<option value="${asset.id}">${asset.name}</option>`).join("")}</select></label>
        <label>Body Color<input id="shopBodyColor" type="color" value="${selectedShopItem?.bodyColor || "#9ed1ff"}"></label>
        <label>Accent Color<input id="shopAccentColor" type="color" value="${selectedShopItem?.accentColor || "#232323"}"></label>
        <label>Style<select id="shopStyle"><option value="humanoid">Humanoid</option><option value="robot">Robot</option><option value="animal">Animal</option></select></label>
        <label>Cloth Type<select id="shopOverlay"><option value="hoodie">Hoodie</option><option value="crown">Crown</option><option value="ninja-mask">Ninja Mask</option><option value="armor">Armor</option><option value="glasses">Glasses</option></select></label>
        <label>Color<input id="shopColor" type="color" value="${selectedShopItem?.color || "#5a3ec8"}"></label>
        <button type="button" data-dev-action="add-shop-item">Add Item</button>
        <button type="button" data-dev-action="update-shop-item">Update Item</button>
        <button type="button" data-dev-action="delete-shop-item">Delete Item</button>
      </div>
    `,
    save: `
      <div class="dev-grid-two">
        <label>Name<input id="draftName" value="${state.dev.draft ? state.dev.draft.name : ""}"></label>
        <label>Order<input id="draftOrder" type="number" value="${state.dev.draft ? state.dev.draft.order : state.levelCatalog.length + 1}"></label>
        <button type="button" data-dev-action="new-draft">New Draft</button>
        <button type="button" data-dev-action="save-draft">Save Draft</button>
        <button type="button" data-dev-action="publish-draft">Publish Level</button>
        <button type="button" data-dev-action="reload-published">Refresh Levels</button>
      </div>
      <textarea class="dev-json">${state.dev.draft ? JSON.stringify(state.dev.draft, null, 2) : "{}"}</textarea>
    `,
  };
  content.innerHTML = base[state.dev.activeTab] || "";

  content.querySelectorAll("[data-tool]").forEach((button) => on(button, "click", () => {
    state.dev.tool = button.dataset.tool;
    renderDevPanel();
  }));
  content.querySelectorAll("[data-asset-tool]").forEach((button) => on(button, "click", () => {
    const map = {
      "asset-block": "block",
      "asset-spike": "spike",
      "asset-platform": "movingPlatform",
      "asset-bomb": "bomb",
    };
    state.dev.tool = map[button.dataset.assetTool] || "select";
    state.dev.status = `${button.dataset.assetTool} ready. Canvas par click karke place karo.`;
    renderDevPanel();
  }));
  content.querySelectorAll("[data-shop-item]").forEach((button) => on(button, "click", () => {
    state.dev.selectedShopItemId = button.dataset.shopItem;
    renderDevPanel();
  }));
  content.querySelectorAll("[data-player-asset]").forEach((button) => on(button, "click", () => {
    equipCharacter(button.dataset.playerAsset);
    state.dev.playerAssetId = button.dataset.playerAsset;
    state.dev.status = `${button.dataset.playerAsset} selected as player asset.`;
    renderDevPanel();
  }));
  if (selectedShopItem) {
    const kindField = content.querySelector("#shopKind");
    const assetField = content.querySelector("#shopAsset");
    const styleField = content.querySelector("#shopStyle");
    const overlayField = content.querySelector("#shopOverlay");
    if (kindField) kindField.value = selectedShopItem.kind;
    if (assetField) assetField.value = selectedShopItem.assetId || "";
    if (styleField) styleField.value = selectedShopItem.shape || "humanoid";
    if (overlayField) overlayField.value = selectedShopItem.overlay || "hoodie";
  }
  const snapToggle = content.querySelector("#snapToggle");
  if (snapToggle) {
    on(snapToggle, "change", (event) => {
      state.dev.snap = event.target.checked;
      renderDevPanel();
    });
  }
  ["propName", "propType", "propX", "propY", "propW", "propH", "propAsset", "propSound", "motionAxis", "motionSpeed", "motionDistance", "spawnAtValue"].forEach((id) => {
    const field = content.querySelector(`#${id}`);
    on(field, "change", () => {
      if (!selected) {
        return;
      }
      if (selected.type === "exit") {
        const nextExit = {
          id: "exit",
          type: "exit",
          name: content.querySelector("#propName")?.value || "exit",
          x: Number(content.querySelector("#propX")?.value || selected.x),
          y: Number(content.querySelector("#propY")?.value || selected.y),
          width: Number(content.querySelector("#propW")?.value || selected.width),
          height: Number(content.querySelector("#propH")?.value || selected.height),
        };
        setExitFromProxy(nextExit);
        syncDraftFromRuntime();
        renderDevPanel();
        return;
      }
      selected.name = content.querySelector("#propName")?.value || selected.name;
      selected.type = content.querySelector("#propType")?.value || selected.type;
      selected.x = Number(content.querySelector("#propX")?.value || selected.x);
      selected.y = Number(content.querySelector("#propY")?.value || selected.y);
      selected.width = Number(content.querySelector("#propW")?.value || selected.width);
      selected.height = Number(content.querySelector("#propH")?.value || selected.height);
      selected.assetId = content.querySelector("#propAsset")?.value || selected.assetId;
      selected.soundId = content.querySelector("#propSound")?.value || selected.soundId;
      selected.motion.axis = content.querySelector("#motionAxis")?.value || selected.motion.axis;
      selected.motion.speed = Number(content.querySelector("#motionSpeed")?.value || selected.motion.speed);
      selected.motion.distance = Number(content.querySelector("#motionDistance")?.value || selected.motion.distance);
      selected.spawnAt.value = Number(content.querySelector("#spawnAtValue")?.value || selected.spawnAt.value);
      const runtime = state.level.objects.find((object) => object.id === selected.id);
      if (runtime) {
        Object.assign(runtime, deepClone(selected));
        runtime.runtime = runtime.runtime || {};
        runtime.runtime.x = selected.x;
        runtime.runtime.y = selected.y;
        runtime.runtime.width = selected.width;
        runtime.runtime.height = selected.height;
        runtime.runtime.visible = runtime.runtime.visible !== false;
      }
      syncDraftFromRuntime();
      renderDevPanel();
    });
  });
  content.querySelectorAll("[data-trigger]").forEach((button) => on(button, "click", () => {
    state.dev.selectedTriggerId = button.dataset.trigger;
    renderDevPanel();
  }));
  content.querySelectorAll("[data-func]").forEach((toggle) => on(toggle, "change", () => {
    if (!selected || selected.type === "exit") return;
    const enabledCount = FUNCTION_FLAGS.filter((flag) => selected.functions[flag]).length;
    const target = toggle.dataset.func;
    if (!selected.functions[target] && enabledCount >= 3) {
      toggle.checked = false;
      state.dev.status = "Max 3 functions per object.";
      renderDevPanel();
      return;
    }
    selected.functions[target] = toggle.checked;
    syncDraftFromRuntime();
  }));
  content.querySelectorAll("[data-remove-key]").forEach((button) => on(button, "click", () => {
    if (!selected) return;
    selected.keyframes.splice(Number(button.dataset.removeKey), 1);
    syncDraftFromRuntime();
    renderDevPanel();
  }));
  content.querySelectorAll("[data-dev-action]").forEach((button) => on(button, "click", () => handleDevAction(button.dataset.devAction)));
}

function handleDevAction(action) {
  if (!state.dev.draft && !["new-draft", "add-shop-item", "update-shop-item", "delete-shop-item", "upload-asset"].includes(action)) {
    return;
  }
  if (action === "new-draft") {
    state.dev.draft = createLevelSkeleton(`Custom Level ${state.customLevels.length + 1}`, state.levelCatalog.length + 1);
    state.dev.selectedObjectId = "";
    state.dev.selectedTriggerId = "";
    state.dev.status = "Fresh draft created.";
    openEditorStage();
    saveGame();
    return;
  }
  if (action === "set-spawn") {
    const selected = getSelectedObject();
    if (selected) {
      state.dev.draft.playerSpawn = normalizeSpawnPoint({ x: selected.x, y: selected.y - 1.3 });
      state.level.playerSpawn = deepClone(state.dev.draft.playerSpawn);
      resetPlayerToSpawn();
      state.dev.status = "Spawn updated.";
      renderDevPanel();
    }
  }
  if (action === "set-exit") {
    const selected = getSelectedObject();
    if (selected) {
      state.dev.draft.exit = { x: selected.x, y: selected.y - 0.8, width: 1.4, height: 1.8 };
      state.level.exit = deepClone(state.dev.draft.exit);
      state.dev.status = "Exit updated.";
      renderDevPanel();
    }
  }
  if (action === "add-checkpoint") {
    const selected = getSelectedObject();
    if (selected) {
      state.dev.draft.checkpoints.push({ x: selected.x, y: selected.y - 1 });
      state.level.checkpoints = deepClone(state.dev.draft.checkpoints);
      state.dev.status = "Checkpoint added.";
      renderDevPanel();
    }
  }
  if (action === "delete-selected") {
    deleteSelectedObject();
  }
  if (action === "add-keyframe") {
    const selected = getSelectedObject();
    if (!selected) return;
    selected.keyframes.push({ t: Number(document.getElementById("keyT")?.value || 1), x: Number(document.getElementById("keyX")?.value || selected.x), y: Number(document.getElementById("keyY")?.value || selected.y) });
    selected.keyframes.sort((a, b) => a.t - b.t);
    syncDraftFromRuntime();
    renderDevPanel();
  }
  if (action === "add-trigger") {
    const trigger = normalizeTrigger({
      name: document.getElementById("triggerName")?.value || "Trigger",
      condition: { axis: document.getElementById("triggerAxis")?.value || "m", comparator: ">=", value: Number(document.getElementById("triggerValue")?.value || 10) },
      actions: [],
    });
    state.dev.draft.triggers.push(trigger);
    state.level.triggers = state.dev.draft.triggers.map(normalizeTrigger);
    state.dev.selectedTriggerId = trigger.id;
    state.dev.status = "Trigger created.";
    renderDevPanel();
  }
  if (action === "add-trigger-action") {
    const trigger = state.dev.draft.triggers.find((item) => item.id === state.dev.selectedTriggerId);
    if (!trigger) return;
    const type = document.getElementById("triggerAction")?.value || "spawnObject";
    const payload = { type };
    if (type === "message") {
      payload.text = document.getElementById("triggerMessage")?.value || "Trap fired";
    } else {
      payload.objectId = document.getElementById("triggerTarget")?.value || "";
    }
    trigger.actions.push(payload);
    state.level.triggers = state.dev.draft.triggers.map(normalizeTrigger);
    renderDevPanel();
  }
  if (action === "upload-asset") {
    const file = document.getElementById("assetFile")?.files?.[0];
    const name = document.getElementById("assetName")?.value || file?.name || "";
    const kind = document.getElementById("assetKind")?.value || "image";
    if (!file) {
      state.dev.status = "Choose a file first.";
      renderDevPanel();
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      state.customAssets.push({ id: uid("asset"), name, kind: kind === "sound" ? "sound" : "image", category: kind === "character" ? "character" : kind === "clothes" ? "clothes" : "object", dataUrl: reader.result });
      state.dev.status = "Asset uploaded.";
      saveGame();
      updateUi();
    };
    reader.readAsDataURL(file);
  }
  if (action === "add-shop-item") {
    if (!isAdminMode()) {
      return;
    }
    const kind = document.getElementById("shopKind")?.value || "item";
    const assetId = document.getElementById("shopAsset")?.value || "";
    const item = { id: uid("shop"), name: document.getElementById("shopName")?.value || "New Item", kind, price: Number(document.getElementById("shopPrice")?.value || 0), assetId, description: "Added from shop manager." };
    if (kind === "character") {
      Object.assign(item, {
        shape: document.getElementById("shopStyle")?.value || "humanoid",
        bodyColor: document.getElementById("shopBodyColor")?.value || "#9ed1ff",
        eyeColor: "#ffffff",
        accentColor: document.getElementById("shopAccentColor")?.value || "#232323",
      });
    }
    if (kind === "clothes") {
      Object.assign(item, {
        type: ["crown", "glasses"].includes(document.getElementById("shopOverlay")?.value || "hoodie") ? "accessory" : "body",
        overlay: document.getElementById("shopOverlay")?.value || "hoodie",
        color: document.getElementById("shopColor")?.value || "#5a3ec8",
      });
    }
    state.shopItems.push(item);
    state.dev.selectedShopItemId = item.id;
    state.dev.status = "Shop item added.";
    saveGame();
    updateUi();
    renderDevPanel();
  }
  if (action === "update-shop-item") {
    if (!isAdminMode() || !state.dev.selectedShopItemId) {
      return;
    }
    const item = ensureEditableShopItem(state.dev.selectedShopItemId);
    if (!item) {
      return;
    }
    item.name = document.getElementById("shopName")?.value || item.name;
    item.price = Number(document.getElementById("shopPrice")?.value || item.price || 0);
    item.assetId = document.getElementById("shopAsset")?.value || item.assetId || "";
    if (item.kind === "character") {
      item.shape = document.getElementById("shopStyle")?.value || item.shape || "humanoid";
      item.bodyColor = document.getElementById("shopBodyColor")?.value || item.bodyColor || "#9ed1ff";
      item.accentColor = document.getElementById("shopAccentColor")?.value || item.accentColor || "#232323";
      item.eyeColor = item.eyeColor || "#ffffff";
    }
    if (item.kind === "clothes") {
      item.overlay = document.getElementById("shopOverlay")?.value || item.overlay || "hoodie";
      item.color = document.getElementById("shopColor")?.value || item.color || "#5a3ec8";
      item.type = ["crown", "glasses"].includes(item.overlay) ? "accessory" : item.overlay === "ninja-mask" ? "mask" : "body";
    }
    applyPlayerAppearance();
    state.dev.status = "Shop item updated.";
    saveGame();
    updateUi();
    renderDevPanel();
  }
  if (action === "delete-shop-item") {
    if (!isAdminMode() || !state.dev.selectedShopItemId) {
      return;
    }
    state.shopItems = state.shopItems.filter((item) => item.id !== state.dev.selectedShopItemId);
    if (!getCharacterCatalog().some((item) => item.id === state.equippedCharacter)) {
      state.equippedCharacter = "prisoner";
    }
    if (!getClothesCatalog().some((item) => item.id === state.equippedClothes)) {
      state.equippedClothes = "none";
    }
    state.dev.selectedShopItemId = "";
    applyPlayerAppearance();
    state.dev.status = "Shop item deleted.";
    saveGame();
    updateUi();
    renderDevPanel();
  }
  if (action === "save-draft" || action === "publish-draft") {
    syncDraftFromRuntime();
    state.dev.draft.name = document.getElementById("draftName")?.value || state.dev.draft.name;
    state.dev.draft.order = Number(document.getElementById("draftOrder")?.value || state.dev.draft.order);
    state.deletedLevelIds = state.deletedLevelIds.filter((id) => id !== state.dev.draft.id);
    const existing = state.customLevels.findIndex((level) => level.id === state.dev.draft.id);
    if (existing >= 0) {
      state.customLevels[existing] = normalizeLevel(state.dev.draft, state.dev.draft.order);
    } else {
      state.customLevels.push(normalizeLevel(state.dev.draft, state.dev.draft.order));
    }
    if (action === "publish-draft") {
      const level = state.customLevels.find((item) => item.id === state.dev.draft.id);
      if (level) {
        level.published = true;
        if (!state.publishedLevelIds.includes(level.id)) state.publishedLevelIds.push(level.id);
      }
      state.dev.status = "Level published.";
    } else {
      state.dev.status = "Draft saved.";
    }
    saveGame();
    rebuildLevelCatalog();
    updateUi();
  }
  if (action === "reload-published") {
    rebuildLevelCatalog();
    updateUi();
  }
}

function createDevPanel() {
  if (state.dev.panel) {
    return;
  }
  const panel = document.createElement("aside");
  panel.className = "dev-panel hidden";
  panel.innerHTML = `
    <div class="dev-shell">
      <div class="dev-header">
        <div>
          <p class="dev-kicker">Developer Mode</p>
          <h2>Trolled Again Studio</h2>
        </div>
        <div class="dev-header-actions">
          <button type="button" data-dev-top="open-stage">Open Stage</button>
          <button type="button" data-dev-top="toggle-preview">Preview</button>
          <button type="button" data-dev-top="close-panel">Close</button>
        </div>
      </div>
      <div class="dev-tabs">
        <button type="button" data-dev-tab="editor">Level Editor</button>
        <button type="button" data-dev-tab="properties">Object Properties</button>
        <button type="button" data-dev-tab="triggers">Trigger System</button>
        <button type="button" data-dev-tab="assets">Assets Manager</button>
        <button type="button" data-dev-tab="shop">Shop Manager</button>
        <button type="button" data-dev-tab="save">Save / Publish</button>
      </div>
      <div class="dev-status"></div>
      <div class="dev-content"></div>
    </div>
  `;
  document.body.append(panel);
  state.dev.panel = panel;
  panel.querySelectorAll("[data-dev-tab]").forEach((button) => on(button, "click", () => {
    state.dev.activeTab = button.dataset.devTab;
    renderDevPanel();
  }));
  panel.querySelectorAll("[data-dev-top]").forEach((button) => on(button, "click", () => {
    if (button.dataset.devTop === "close-panel") panel.classList.add("hidden");
    if (button.dataset.devTop === "open-stage") openEditorStage();
    if (button.dataset.devTop === "toggle-preview") toggleEditorPreview();
  }));
}

function openEditorStage() {
  if (!state.dev.draft) {
    state.dev.draft = createLevelSkeleton(`Custom Level ${state.customLevels.length + 1}`, state.levelCatalog.length + 1);
  }
  state.dev.preview = false;
  loadLevel(state.levelIndex, state.dev.draft);
  state.mode = "editor";
  resetPlayerToSpawn();
  state.dev.scrollX = clamp((state.debugSpawn ? state.debugSpawn.x : 0) - canvas.width * 0.25, 0, Math.max(0, WORLD.widthPx - canvas.width));
  hideOverlay();
  showScreen("game");
  state.dev.panel.classList.remove("hidden");
  renderDevPanel();
}

function toggleEditorPreview() {
  if (!state.dev.draft) {
    return;
  }
  state.dev.preview = !state.dev.preview;
  loadLevel(state.levelIndex, state.dev.draft);
  state.mode = state.dev.preview ? "playing" : "editor";
  if (!state.dev.preview) {
    state.dev.scrollX = clamp((state.debugSpawn ? state.debugSpawn.x : 0) - canvas.width * 0.25, 0, Math.max(0, WORLD.widthPx - canvas.width));
  }
  hideOverlay();
  state.dev.status = state.dev.preview ? "Preview mode active." : "Back to edit mode.";
  renderDevPanel();
}

function beginDevAccess() {
  const lockUntil = Number(localStorage.getItem(DEV_LOCK_KEY) || 0);
  if (lockUntil > Date.now()) {
    const hours = Math.ceil((lockUntil - Date.now()) / (1 * 5));
    alert(`Developer mode locked. Try again in about ${hours} hour(s).`);
    return;
  }
  const password = window.prompt("Developer password");
  if (password === null) return;
  const answer = window.prompt(`Security question: ${DEV_QUESTION}`);
  if (answer === null) return;
  const okay = password === decodeValue(DEV_SECRET) && answer.trim().toLowerCase() === decodeValue(DEV_ANSWER);
  if (!okay) {
    const attempts = Number(localStorage.getItem(DEV_ATTEMPT_KEY) || 0) + 1;
    localStorage.setItem(DEV_ATTEMPT_KEY, String(attempts));
    if (attempts >= 3) {
      localStorage.setItem(DEV_LOCK_KEY, String(Date.now() + DEV_LOCK_MS));
      localStorage.setItem(DEV_ATTEMPT_KEY, "0");4
      alert("Developer mode locked for 24 hours.");
      return;
    }
    alert(`Wrong credentials. ${3 - attempts} attempt(s) left.`);
    return;
  }
  localStorage.setItem(DEV_ATTEMPT_KEY, "0");
  state.dev.enabled = true;
  state.dev.status = "Developer mode unlocked. Open Levels > Create Level.";
  createDevPanel();
  updateUi();
  showScreen("levels");
}

function bindHiddenDevTrigger() {
  const start = () => {
    clearTimeout(state.dev.longPressTimer);
    state.dev.longPressTimer = window.setTimeout(beginDevAccess, 2200);
  };
  const cancel = () => {
    clearTimeout(state.dev.longPressTimer);
  };
  on(ui.brandTitle, "pointerdown", start);
  on(ui.brandTitle, "pointerup", cancel);
  on(ui.brandTitle, "pointerleave", cancel);
  on(ui.homeSettingsBtn, "pointerdown", start);
  on(ui.homeSettingsBtn, "pointerup", cancel);
  on(ui.homeSettingsBtn, "pointerleave", cancel);
  const tapTrigger = () => {
    const now = Date.now();
    state.dev.tapTimes = [...state.dev.tapTimes.filter((time) => now - time < 2500), now];
    if (state.dev.tapTimes.length >= 5) {
      state.dev.tapTimes = [];
      beginDevAccess();
    }
  };
  on(ui.homeCoins, "click", tapTrigger);
  on(ui.homeSettingsBtn, "click", tapTrigger);
}

function bindUi() {
  on(ui.startGameBtn, "click", () => showScreen("levels"));
  on(ui.profileBtn, "click", () => showScreen("profile"));
  on(ui.levelsNavBtn, "click", () => showScreen("levels"));
  on(ui.createLevelBtn, "click", () => {
    if (!state.dev.enabled) {
      setText(ui.levelsHelp, "Developer mode unlock karo, phir Create Level khulega.");
      return;
    }
    const requested = window.prompt("Kaunsi level create karni hai? Number ya name likho.", `Custom Level ${state.customLevels.length + 1}`);
    if (requested === null) {
      return;
    }
    const trimmed = requested.trim();
    const numeric = Number(trimmed);
    const levelName = trimmed
      ? (Number.isFinite(numeric) && trimmed !== "" ? `Custom Level ${numeric}` : trimmed)
      : `Custom Level ${state.customLevels.length + 1}`;
    const order = Number.isFinite(numeric) && trimmed !== "" ? numeric : state.levelCatalog.length + 1;
    state.dev.draft = createLevelSkeleton(levelName, order);
    state.dev.selectedObjectId = "";
    state.dev.selectedTriggerId = "";
    state.dev.status = `${levelName} blank canvas ke saath ready hai.`;
    openEditorStage();
  });
  on(ui.shopNavBtn, "click", () => showScreen("shop"));
  on(ui.settingsNavBtn, "click", () => showScreen("settings"));
  on(ui.homeSettingsBtn, "click", () => showScreen("settings"));
  on(ui.gameHomeBtn, "click", () => {
    showScreen("home");
    hideOverlay();
    state.mode = "menu";
    state.dev.preview = false;
    document.body.classList.remove("editor-open");
    renderDevPanel();
  });
  document.querySelectorAll("[data-back='home']").forEach((button) => on(button, "click", () => showScreen("home")));
  on(ui.saveProfileBtn, "click", () => {
    state.nickname = ui.nicknameInput.value.trim();
    saveGame();
    updateUi();
    showScreen("home");
  });
  on(ui.retryBtn, "click", () => {
    if (state.dev.preview && state.dev.draft) {
      loadLevel(state.levelIndex, state.dev.draft);
      state.mode = "playing";
      hideOverlay();
      return;
    }
    loadLevel(state.levelIndex);
  });
  on(ui.soundToggle, "click", () => {
    state.soundOn = !state.soundOn;
    saveGame();
    updateUi();
  });
  on(ui.musicToggle, "click", () => {
    state.musicOn = !state.musicOn;
    if (state.musicOn) startMusic(); else stopMusic();
    saveGame();
    updateUi();
  });
  on(ui.editorScroll, "input", (event) => {
    state.dev.scrollX = clamp(Number(event.target.value || 0), 0, Math.max(0, WORLD.widthPx - canvas.width));
    if (state.mode === "editor" && !state.dev.preview) {
      syncPlayZoneToEditorView();
      renderDevPanel();
    }
    syncEditorScrollUi();
  });
  on(ui.primaryButton, "click", () => {
    if (state.overlayAction === "start") {
      state.mode = "playing";
      hideOverlay();
      return;
    }
    if (state.overlayAction === "restart") {
      loadLevel(state.levelIndex);
      return;
    }
    if (state.overlayAction === "ad") {
      state.extraLivesUsed = true;
      state.lives = 2;
      updateUi();
      hideOverlay();
      respawnAtCheckpoint(1);
      return;
    }
    if (state.overlayAction === "next") {
      loadLevel(Math.min(state.levelIndex + 1, state.levelCatalog.length - 1));
      return;
    }
    if (state.overlayAction === "editor-home") {
      state.dev.preview = false;
      loadLevel(state.levelIndex, state.dev.draft);
      state.mode = "editor";
      hideOverlay();
      renderDevPanel();
      return;
    }
    showScreen("home");
    hideOverlay();
  });
  on(ui.secondaryButton, "click", () => {
    showScreen("home");
    hideOverlay();
    state.mode = "menu";
    document.body.classList.remove("editor-open");
    if (state.dev.preview) {
      state.dev.preview = false;
      renderDevPanel();
    }
  });
}

function initApp() {
  try {
    validateUi();
    ensureShopItemPanel();
    state.baseLevels = buildBaseLevels();
    loadSave();
    restoreEquippedState();
    rebuildLevelCatalog();
    bindControlButtons();
    bindKeyboard();
    bindCanvasEditor();
    bindUi();
    bindHiddenDevTrigger();
    updateUi();
    showScreen("home");
    gameLoop();
  } catch (error) {
    document.title = "Trolled Again Error";
    console.error("App initialization failed:", error);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp, { once: true });
} else {
  initApp();
}
function checkOrientation() {
  const warning = document.getElementById("rotateWarning");
  const canvas = document.getElementById("gameCanvas");

  if (window.innerHeight > window.innerWidth) {
    warning.style.display = "flex";
    canvas.style.display = "none";
  } else {
    warning.style.display = "none";
    canvas.style.display = "block";
  }
}

window.addEventListener("resize", checkOrientation);
window.addEventListener("load", checkOrientation);
