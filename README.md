const games = [
  {
    name: "Cyberpunk 2077",
    category: "open-world",
    tag: "mission boost",
    rating: "4.8",
    description:
      "Focus on early-game gear loops and side missions that improve growth without wasting time.",
    traits: ["XP route", "Gear loop", "Fast leveling"],
    code: "XP+GEAR"
  },
  {
    name: "Elden Ring",
    category: "rpg",
    tag: "progression",
    rating: "4.9",
    description:
      "Prioritize stat-friendly weapons and resource farming loops to keep build progression smoother.",
    traits: ["Build plan", "RNG relief", "Mob farming"],
    code: "STATS+RUNES"
  },
  {
    name: "Valorant",
    category: "fps",
    tag: "tactical",
    rating: "4.7",
    description:
      "Study utility timing, crosshair placement, and map control to sharpen decision-making under pressure.",
    traits: ["Utility timing", "Crosshair", "Map control"],
    code: "SMOKE+LINE"
  },
  {
    name: "Hades",
    category: "action",
    tag: "runs",
    rating: "4.9",
    description:
      "Learn build consistency and room progression to turn chaotic runs into dependable cycles.",
    traits: ["Build balance", "Run flow", "Enemy reads"],
    code: "RUSH+FLOW"
  },
  {
    name: "Red Dead Redemption 2",
    category: "open-world",
    tag: "exploration",
    rating: "4.8",
    description:
      "Use weather, camp routines, and hunting loops to improve resource gathering and world travel efficiency.",
    traits: ["Camp loop", "Hunting", "Travel route"],
    code: "TRAIL+LOOT"
  },
  {
    name: "Borderlands 3",
    category: "action",
    tag: "loadouts",
    rating: "4.6",
    description:
      "Keep power scaling steady by rotating weapons, class mods, and challenge loops based on enemy type.",
    traits: ["Loadout swap", "Class mod", "Boss prep"],
    code: "GUN+GEAR"
  }
];

const cardGrid = document.getElementById("cardGrid");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter");

let activeFilter = "all";

function createCard(game) {
  const card = document.createElement("article");
  card.className = "card";

  const meta = game.traits
    .map((trait) => `<span class="meta-pill">${trait}</span>`)
    .join("");

  card.innerHTML = `
    <div class="card-top">
      <span class="game-tag">${game.tag}</span>
      <span class="rating">★ ${game.rating}</span>
    </div>
    <h3>${game.name}</h3>
    <p>${game.description}</p>
    <div class="card-meta">${meta}</div>
    <div class="card-actions">
      <button class="card-button" type="button">View tips</button>
      <span class="code">${game.code}</span>
    </div>
  `;

  return card;
}

function renderCards() {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = games.filter((game) => {
    const matchesFilter = activeFilter === "all" || game.category === activeFilter;
    const matchesSearch =
      !query ||
      game.name.toLowerCase().includes(query) ||
      game.description.toLowerCase().includes(query) ||
      game.traits.some((trait) => trait.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  cardGrid.innerHTML = "";

  if (!filtered.length) {
    cardGrid.innerHTML = `
      <div class="empty-state">
        <h3>No matches found</h3>
        <p>Try another keyword or switch back to the full catalog.</p>
      </div>
    `;
    return;
  }

  filtered.forEach((game) => {
    cardGrid.appendChild(createCard(game));
  });
}

searchInput.addEventListener("input", renderCards);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;

    filterButtons.forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    renderCards();
  });
});

renderCards();
