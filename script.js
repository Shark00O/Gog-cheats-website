const games = [
  {
    name: "Cyberpunk 2077",
    category: "open-world",
    tag: "mission boost",
    rating: "4.8",
    description:
      "Focus on early-game gear loops and side missions that improve growth without wasting time.",
    traits: ["XP route", "Gear loop", "Fast leveling"],
    code: "XP+GEAR",
    details: {
      summary: "Use early-game side quests and stealth routes to build better gear without burning time.",
      tips: [
        "Complete side missions before major story pushes to unlock better gear and cash flow.",
        "Rotate between combat and stealth loops to manage resource drains and keep your build efficient.",
        "Use short exploration loops to grab crafting materials and upgrade key gear pieces early."
      ]
    }
  },
  {
    name: "Elden Ring",
    category: "rpg",
    tag: "progression",
    rating: "4.9",
    description:
      "Prioritize stat-friendly weapons and resource farming loops to keep build progression smoother.",
    traits: ["Build plan", "RNG relief", "Mob farming"],
    code: "STATS+RUNES",
    details: {
      summary: "A stable progression route is better than random power spikes.",
      tips: [
        "Prioritize a weapon type that matches your current build and stat distribution.",
        "Farm small enemy groups repeatedly to keep healing and upgrade materials steady.",
        "Build around one strong spell or weapon skill before branching into broader upgrades."
      ]
    }
  },
  {
    name: "Valorant",
    category: "fps",
    tag: "tactical",
    rating: "4.7",
    description:
      "Study utility timing, crosshair placement, and map control to sharpen decision-making under pressure.",
    traits: ["Utility timing", "Crosshair", "Map control"],
    code: "SMOKE+LINE",
    details: {
      summary: "Good utility timing wins more rounds than random aggression.",
      tips: [
        "Use utility to cut off sightlines instead of rushing without a plan.",
        "Keep crosshair placement at head-level when peeking and holding angles.",
        "Trust a simple map rotation plan before trying aggressive flanks with less information."
      ]
    }
  },
  {
    name: "Hades",
    category: "action",
    tag: "runs",
    rating: "4.9",
    description:
      "Learn build consistency and room progression to turn chaotic runs into dependable cycles.",
    traits: ["Build balance", "Run flow", "Enemy reads"],
    code: "RUSH+FLOW",
    details: {
      summary: "A balanced build with steady room control makes each run far easier to finish.",
      tips: [
        "Choose a reliable weapon and support boon combination before trying risky hybrids.",
        "Prioritize movement and dodging in cramped rooms to avoid getting stuck in desperate patterns.",
        "Create a simple loop: clear room, manage resources, then adjust the next build decision."
      ]
    }
  },
  {
    name: "Red Dead Redemption 2",
    category: "open-world",
    tag: "exploration",
    rating: "4.8",
    description:
      "Use weather, camp routines, and hunting loops to improve resource gathering and world travel efficiency.",
    traits: ["Camp loop", "Hunting", "Travel route"],
    code: "TRAIL+LOOT",
    details: {
      summary: "Good travel planning and resource loops make the world feel far more coherent.",
      tips: [
        "Plan hunting routes around weather and animal movement to reduce wasted travel time.",
        "Use camp routines to restore supplies and keep your inventory balanced for longer trips.",
        "Avoid overloading on one resource type; spread out your collection priorities for smoother progression."
      ]
    }
  },
  {
    name: "Borderlands 3",
    category: "action",
    tag: "loadouts",
    rating: "4.6",
    description:
      "Keep power scaling steady by rotating weapons, class mods, and challenge loops based on enemy type.",
    traits: ["Loadout swap", "Class mod", "Boss prep"],
    code: "GUN+GEAR",
    details: {
      summary: "Switching loadouts at the right time is more important than chasing every rare drop.",
      tips: [
        "Match your weapon type and class mod to the enemy pattern in each zone.",
        "Keep boss prep simple and reliable instead of loading up on flashy but inconsistent choices.",
        "Use challenge loops to build consistency while preserving enough gear freedom for later fights."
      ]
    }
  }
];

const cardGrid = document.getElementById("cardGrid");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter");
const modal = document.getElementById("detailsModal");
const modalContent = document.getElementById("modalContent");
const themeToggle = document.getElementById("themeToggle");

let activeFilter = "all";

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("light-theme", !isDark);
  themeToggle.textContent = isDark ? "🌙 Dark" : "☀️ Light";
  localStorage.setItem("gog-cheats-theme", theme);
}

function openModal(game) {
  modalContent.innerHTML = `
    <span class="modal-tag">${game.tag}</span>
    <h2 id="modalTitle" class="modal-title">${game.name}</h2>
    <div class="modal-meta">
      <span>${game.category}</span>
      <span>★ ${game.rating}</span>
      <span>${game.code}</span>
    </div>
    <div class="modal-body">
      <p>${game.details.summary}</p>
      <ul>
        ${game.details.tips.map((tip) => `<li>${tip}</li>`).join("")}
      </ul>
    </div>
  `;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

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

  card.querySelector(".card-button").addEventListener("click", () => openModal(game));

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

modal.addEventListener("click", (event) => {
  if (event.target.matches("[data-close='true']") || event.target.closest(".modal-close")) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) {
    closeModal();
  }
});

themeToggle.addEventListener("click", () => {
  const currentTheme = localStorage.getItem("gog-cheats-theme") || "dark";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
});

const savedTheme = localStorage.getItem("gog-cheats-theme") || "dark";
applyTheme(savedTheme);
renderCards();
