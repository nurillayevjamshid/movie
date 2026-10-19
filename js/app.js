// Movie Web App - Core Logic
(function () {
  "use strict";

  // State
  let currentGenre = "Barchasi";
  let searchQuery = "";
  let currentSort = "featured";
  let favorites = [];

  // DOM Elements
  const heroSection = document.getElementById("heroSection");
  const genreChipsContainer = document.getElementById("genreChips");
  const sortSelect = document.getElementById("sortSelect");
  const searchInput = document.getElementById("searchInput");
  const moviesGrid = document.getElementById("moviesGrid");
  const moviesCount = document.getElementById("moviesCount");
  const favBadge = document.getElementById("favBadge");
  const favToggleBtn = document.getElementById("favToggleBtn");

  // Modals
  const detailModal = document.getElementById("detailModal");
  const detailCloseBtn = document.getElementById("detailCloseBtn");
  const detailBanner = document.getElementById("detailBanner");
  const detailTitle = document.getElementById("detailTitle");
  const detailMeta = document.getElementById("detailMeta");
  const detailDesc = document.getElementById("detailDesc");
  const detailDirector = document.getElementById("detailDirector");
  const detailCast = document.getElementById("detailCast");
  const detailPlayBtn = document.getElementById("detailPlayBtn");
  const detailShareBtn = document.getElementById("detailShareBtn");

  const playerModal = document.getElementById("playerModal");
  const playerCloseBtn = document.getElementById("playerCloseBtn");
  const videoWrapper = document.getElementById("videoWrapper");

  let showingOnlyFavorites = false;

  // Initialize Telegram WebApp if present
  function initTelegram() {
    if (window.Telegram && window.Telegram.WebApp) {
      try {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        tg.headerColor = "#0a0d14";
        tg.backgroundColor = "#0a0d14";
      } catch (err) {
        console.warn("Telegram WebApp init warning:", err);
      }
    }
  }

  // Load favorites from localStorage
  function loadFavorites() {
    try {
      const stored = localStorage.getItem("movie_app_favorites");
      favorites = stored ? JSON.parse(stored) : [];
    } catch (_) {
      favorites = [];
    }
    updateFavoritesBadge();
  }

  function saveFavorites() {
    try {
      localStorage.setItem("movie_app_favorites", JSON.stringify(favorites));
    } catch (_) {}
    updateFavoritesBadge();
  }

  function updateFavoritesBadge() {
    if (favBadge) {
      favBadge.textContent = favorites.length;
      favBadge.style.display = favorites.length > 0 ? "flex" : "none";
    }
  }

  function toggleFavorite(id) {
    const idx = favorites.indexOf(id);
    if (idx > -1) {
      favorites.splice(idx, 1);
    } else {
      favorites.push(id);
    }
    saveFavorites();
    renderMovies();
  }

  // Render Genre Chips
  function renderGenreChips() {
    if (!genreChipsContainer || typeof GENRES_LIST === "undefined") return;

    genreChipsContainer.innerHTML = "";
    GENRES_LIST.forEach((genre) => {
      const chip = document.createElement("button");
      chip.className = `genre-chip ${genre === currentGenre ? "active" : ""}`;
      chip.textContent = genre;
      chip.onclick = () => {
        showingOnlyFavorites = false;
        currentGenre = genre;
        document.querySelectorAll(".genre-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        renderMovies();
      };
      genreChipsContainer.appendChild(chip);
    });
  }

  // Render Hero Showcase
  function renderHero() {
    if (!heroSection || typeof MOVIES_DATA === "undefined" || MOVIES_DATA.length === 0) return;
    const featured = MOVIES_DATA.find((m) => m.featured) || MOVIES_DATA[0];

    heroSection.innerHTML = `
      <div class="hero-banner" style="background-image: url('${featured.banner || featured.poster}');">
        <div class="hero-gradient"></div>
        <div class="hero-content">
          <div class="hero-meta">
            <span class="hero-badge">${featured.badge || "Trend"}</span>
            <div class="rating-badge">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
              <span>${featured.rating}</span>
            </div>
            <span class="meta-item">• ${featured.year}</span>
            <span class="meta-item">• ${featured.duration}</span>
            <span class="meta-item">• ${featured.genre.slice(0, 2).join(", ")}</span>
          </div>
          <h1 class="hero-title">${featured.title}</h1>
          <p class="hero-desc">${featured.description}</p>
          <div class="hero-buttons">
            <button class="btn-primary" id="heroPlayBtn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Tomosha qilish
            </button>
            <button class="btn-secondary" id="heroDetailBtn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
              Batafsil
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("heroPlayBtn").onclick = () => openPlayer(featured);
    document.getElementById("heroDetailBtn").onclick = () => openDetails(featured);
  }

  // Filter & Sort
  function getFilteredMovies() {
    if (typeof MOVIES_DATA === "undefined") return [];

    let list = [...MOVIES_DATA];

    if (showingOnlyFavorites) {
      list = list.filter((m) => favorites.includes(m.id));
    } else if (currentGenre !== "Barchasi") {
      list = list.filter((m) => m.genre.includes(currentGenre));
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.originalTitle.toLowerCase().includes(q) ||
          m.genre.some((g) => g.toLowerCase().includes(q)) ||
          m.director.toLowerCase().includes(q)
      );
    }

    if (currentSort === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (currentSort === "year") {
      list.sort((a, b) => b.year - a.year);
    } else if (currentSort === "title") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }

  // Render Movies Grid
  function renderMovies() {
    if (!moviesGrid) return;

    const list = getFilteredMovies();
    if (moviesCount) {
      moviesCount.textContent = `${list.length} ta kino`;
    }

    if (list.length === 0) {
      moviesGrid.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <h3>Hech narsa topilmadi</h3>
          <p>${showingOnlyFavorites ? "Saqlangan kinolar ro'yxati hozircha bo'sh." : "Qidiruv yoki janr bo'yicha mos kinolar mavjud emas."}</p>
        </div>
      `;
      return;
    }

    moviesGrid.innerHTML = list
      .map((movie) => {
        const isFav = favorites.includes(movie.id);
        return `
        <div class="movie-card" data-id="${movie.id}">
          <div class="card-poster-wrap">
            <img class="card-poster" src="${movie.poster}" alt="${movie.title}" loading="lazy" />
            <div class="card-overlay">
              <div class="card-play-btn">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
            ${movie.badge ? `<span class="card-badge">${movie.badge}</span>` : ""}
            <button class="card-bookmark-btn ${isFav ? "active" : ""}" data-fav="${movie.id}" title="${isFav ? "Saqlanganlardan o'chirish" : "Saqlash"}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="${isFav ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
          </div>
          <div class="card-body">
            <h4 class="card-title" title="${movie.title}">${movie.title}</h4>
            <div class="card-meta">
              <span class="rating-badge">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                ${movie.rating}
              </span>
              <span>${movie.year} • ${movie.duration}</span>
            </div>
            <div class="card-genres">${movie.genre.join(", ")}</div>
          </div>
        </div>
      `;
      })
      .join("");

    // Attach card click handlers
    document.querySelectorAll(".movie-card").forEach((card) => {
      const id = parseInt(card.getAttribute("data-id"), 10);
      const movie = MOVIES_DATA.find((m) => m.id === id);

      card.addEventListener("click", (e) => {
        if (e.target.closest(".card-bookmark-btn")) return;
        if (movie) openDetails(movie);
      });
    });

    // Attach bookmark handlers
    document.querySelectorAll(".card-bookmark-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute("data-fav"), 10);
        toggleFavorite(id);
      });
    });
  }

  // Modals Management
  function openDetails(movie) {
    if (!detailModal) return;

    detailBanner.style.backgroundImage = `url('${movie.banner || movie.poster}')`;
    detailTitle.textContent = movie.title;
    detailMeta.innerHTML = `
      <span class="hero-badge">${movie.badge || "HD"}</span>
      <span class="rating-badge">★ ${movie.rating}</span>
      <span>${movie.year}</span>
      <span>${movie.duration}</span>
      <span>${movie.age || "16+"}</span>
      <span>• ${movie.genre.join(", ")}</span>
    `;
    detailDesc.textContent = movie.description;
    detailDirector.textContent = movie.director || "Noma'lum";
    detailCast.textContent = movie.cast ? movie.cast.join(", ") : "Noma'lum";

    detailPlayBtn.onclick = () => {
      closeDetails();
      openPlayer(movie);
    };

    detailShareBtn.onclick = () => {
      shareMovie(movie);
    };

    detailModal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeDetails() {
    if (!detailModal) return;
    detailModal.classList.remove("open");
    document.body.style.overflow = "";
  }

  function openPlayer(movie) {
    if (!playerModal || !videoWrapper) return;

    if (movie.trailerUrl && movie.trailerUrl.includes("youtube")) {
      videoWrapper.innerHTML = `
        <iframe 
          src="${movie.trailerUrl}?autoplay=1&rel=0&modestbranding=1" 
          title="${movie.title}" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen>
        </iframe>
      `;
    } else {
      videoWrapper.innerHTML = `
        <video controls autoplay playsinline src="${movie.streamUrl || ''}">
          Brauzeringiz video formatini qo'llab-quvvatlamaydi.
        </video>
      `;
    }

    playerModal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closePlayer() {
    if (!playerModal || !videoWrapper) return;
    videoWrapper.innerHTML = "";
    playerModal.classList.remove("open");
    document.body.style.overflow = "";
  }

  function shareMovie(movie) {
    const text = `${movie.title} (${movie.year}) kinoni tomosha qiling!`;
    const url = window.location.href;

    if (navigator.share) {
      navigator.share({ title: movie.title, text, url }).catch(() => {});
    } else {
      const tgShareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
      window.open(tgShareUrl, "_blank");
    }
  }

  // Event Listeners
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderMovies();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      renderMovies();
    });
  }

  if (favToggleBtn) {
    favToggleBtn.addEventListener("click", () => {
      showingOnlyFavorites = !showingOnlyFavorites;
      favToggleBtn.classList.toggle("active", showingOnlyFavorites);
      document.querySelectorAll(".genre-chip").forEach((c) => c.classList.remove("active"));
      renderMovies();
    });
  }

  if (detailCloseBtn) detailCloseBtn.addEventListener("click", closeDetails);
  if (detailModal) {
    detailModal.addEventListener("click", (e) => {
      if (e.target === detailModal) closeDetails();
    });
  }

  if (playerCloseBtn) playerCloseBtn.addEventListener("click", closePlayer);
  if (playerModal) {
    playerModal.addEventListener("click", (e) => {
      if (e.target === playerModal) closePlayer();
    });
  }

  // Escape key closes modals
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDetails();
      closePlayer();
    }
  });

  // Start app
  initTelegram();
  loadFavorites();
  renderGenreChips();
  renderHero();
  renderMovies();
})();
