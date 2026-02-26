const API_BASE = "https://pokeapi.co/api/v2/pokemon/";

const memoryCache = new Map();
const LS_CACHE_KEY = "poke_cache_v1";
const LS_TEAM_KEY = "poke_team_v1";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7; 

function loadLocalCache() {
  try { return JSON.parse(localStorage.getItem(LS_CACHE_KEY) || "{}"); }
  catch { return {}; }
}
function saveLocalCache(obj) {
  try { localStorage.setItem(LS_CACHE_KEY, JSON.stringify(obj)); }
  catch {}
}

function getCached(key) {
  const k = key.toLowerCase().trim();
  if (memoryCache.has(k)) return memoryCache.get(k);

  const store = loadLocalCache();
  const entry = store[k];
  if (!entry) return null;

  if ((Date.now() - entry.savedAt) > CACHE_TTL_MS) return null;

  memoryCache.set(k, entry.data);
  return entry.data;
}

function setCached(key, data) {
  const k = key.toLowerCase().trim();
  memoryCache.set(k, data);

  const store = loadLocalCache();
  store[k] = { savedAt: Date.now(), data };
  saveLocalCache(store);
}

const searchForm = document.getElementById("searchForm");
const pokemonInput = document.getElementById("pokemonInput");
const statusEl = document.getElementById("status");

const pokemonImg = document.getElementById("pokemonImg");
const pokemonAudio = document.getElementById("pokemonAudio");

const move1 = document.getElementById("move1");
const move2 = document.getElementById("move2");
const move3 = document.getElementById("move3");
const move4 = document.getElementById("move4");
const moveSelects = [move1, move2, move3, move4];

const addBtn = document.getElementById("addBtn");
const teamWrap = document.getElementById("teamWrap");
const teamTable = document.getElementById("teamTable");

let currentPokemon = null;

function setStatus(msg) {
  statusEl.textContent = msg || "";
}

function normalizeQuery(q) {
  return q.toLowerCase().trim();
}

function bestSprite(data) {
  const official = data?.sprites?.other?.["official-artwork"]?.front_default;
  return official || data?.sprites?.front_default || "";
}

function bestCry(data) {
  return data?.cries?.latest || data?.cries?.legacy || "";
}

function setMoveDropdowns(moves) {
  const names = (moves || [])
    .map(m => m?.move?.name)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  const options = [
    `<option value=""> </option>`,
    ...names.map(n => `<option value="${n}">${n}</option>`)
  ].join("");

  moveSelects.forEach(sel => {
    sel.innerHTML = options;
    sel.disabled = false;
  });
}

function clearMoveDropdowns() {
  const options = `<option value=""> </option>`;
  moveSelects.forEach(sel => {
    sel.innerHTML = options;
    sel.disabled = true;
  });
}

function selectedMoves() {
  const chosen = moveSelects.map(s => s.value).filter(Boolean);

  const unique = [];
  for (const m of chosen) if (!unique.includes(m)) unique.push(m);

  return unique;
}

function loadTeam() {
  try {
    const raw = localStorage.getItem(LS_TEAM_KEY);
    const team = raw ? JSON.parse(raw) : [];
    return Array.isArray(team) ? team : [];
  } catch {
    return [];
  }
}

function saveTeam(team) {
  try { localStorage.setItem(LS_TEAM_KEY, JSON.stringify(team)); }
  catch {}
}

function renderTeam() {
  const team = loadTeam();

  if (team.length === 0) {
    teamWrap.classList.add("hidden");
    teamTable.innerHTML = "";
    return;
  }

  teamWrap.classList.remove("hidden");

  teamTable.innerHTML = team.map(member => {
    const moves = (member.moves || []).map(m => `<li>${m}</li>`).join("");
    const movesHtml = moves ? `<ul>${moves}</ul>` : `<ul><li> </li></ul>`;

    return `
      <tr>
        <td class="teamSpriteCell">
          <img src="${member.sprite}" alt="${member.name} sprite" />
        </td>
        <td class="teamMovesCell">
          ${movesHtml}
        </td>
      </tr>
    `;
  }).join("");
}

async function fetchPokemon(query) {
  const key = normalizeQuery(query);

  const cached = getCached(key);
  if (cached) return cached;

  const res = await fetch(API_BASE + encodeURIComponent(key));
  if (!res.ok) throw new Error("Pokemon not found");

  const data = await res.json();

  if (data?.id) setCached(String(data.id), data);
  if (data?.name) setCached(String(data.name), data);

  return data;
}

function loadPokemonUI(data) {
  currentPokemon = data;

  const sprite = bestSprite(data);
  pokemonImg.src = sprite || "";
  pokemonImg.alt = data?.name ? data.name : "";

  const cry = bestCry(data);
  if (cry) {
    pokemonAudio.src = cry;
    pokemonAudio.load();
  } else {
    pokemonAudio.removeAttribute("src");
    pokemonAudio.load();
  }

  setMoveDropdowns(data.moves);

  addBtn.disabled = false;
}

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const q = pokemonInput.value.trim();
  if (!q) return;

  setStatus("Loading...");
  addBtn.disabled = true;

  try {
    const data = await fetchPokemon(q);
    loadPokemonUI(data);
    setStatus("");
  } catch (err) {
    currentPokemon = null;
    pokemonImg.removeAttribute("src");
    pokemonAudio.removeAttribute("src");
    pokemonAudio.load();
    clearMoveDropdowns();
    addBtn.disabled = true;
    setStatus("Could not find that Pokemon.");
  }
});

addBtn.addEventListener("click", () => {
  if (!currentPokemon) return;

  const team = loadTeam();
  if (team.length >= 6) {
    setStatus("Team is full (6).");
    return;
  }

  team.push({
    id: currentPokemon.id,
    name: currentPokemon.name,
    sprite: bestSprite(currentPokemon),
    moves: selectedMoves()
  });

  saveTeam(team);
  renderTeam();
  setStatus("");
});

clearMoveDropdowns();
renderTeam();
