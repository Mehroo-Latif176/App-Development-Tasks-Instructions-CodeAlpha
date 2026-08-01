// ============================
// 1. IMAGE DATA — 24 photos, 6 categories
// ============================
const images = [
  // Nature
  { id: 1015, category: "nature", title: "River Bend" },
  { id: 1018, category: "nature", title: "Mountain Mist" },
  { id: 1043, category: "nature", title: "Golden Field" },
  { id: 1036, category: "nature", title: "Forest Path" },
  // Architecture
  { id: 164, category: "architecture", title: "Glass Tower" },
  { id: 180, category: "architecture", title: "Old Facade" },
  { id: 1076, category: "architecture", title: "Modern Lines" },
  { id: 1067, category: "architecture", title: "Stone Archway" },
  // Travel
  { id: 1011, category: "travel", title: "Coastal Road" },
  { id: 1016, category: "travel", title: "Desert Trail" },
  { id: 1024, category: "travel", title: "Island Escape" },
  { id: 1005, category: "travel", title: "Mountain Pass" },
  // People
  { id: 64, category: "people", title: "Quiet Portrait" },
  { id: 91, category: "people", title: "City Walker" },
  { id: 177, category: "people", title: "Golden Hour" },
  { id: 1027, category: "people", title: "Candid Moment" },
  // Food
  { id: 292, category: "food", title: "Morning Brew" },
  { id: 326, category: "food", title: "Fresh Bake" },
  { id: 365, category: "food", title: "Farm Table" },
  { id: 431, category: "food", title: "Evening Plate" },
  // Animals
  { id: 237, category: "animals", title: "Loyal Companion" },
  { id: 1025, category: "animals", title: "Wild Watch" },
  { id: 219, category: "animals", title: "Feathered Friend" },
  { id: 659, category: "animals", title: "Ocean Life" },
];

// ============================
// 2. GRAB ELEMENTS
// ============================
const gallery = document.getElementById("gallery");
const filterBar = document.getElementById("filterBar");
const lightbox = document.getElementById("lightbox");
const lbImage = document.getElementById("lbImage");
const lbTitle = document.getElementById("lbTitle");
const lbCount = document.getElementById("lbCount");
const lbFrame = document.querySelector(".lb-frame");
const lbClose = document.getElementById("lbClose");
const lbPrev = document.getElementById("lbPrev");
const lbNext = document.getElementById("lbNext");
const lbBackdrop = document.getElementById("lightboxBackdrop");
const lbThumbs = document.getElementById("lbThumbs");
const backToTop = document.getElementById("backToTop");
const statCount = document.getElementById("statCount");

let currentIndex = 0;
let activeFilter = "all";

// ============================
// 3. BUILD THE GALLERY GRID
// ============================
function renderGallery() {
  gallery.innerHTML = "";
  statCount.textContent = images.length;

  images.forEach((img, index) => {
    const item = document.createElement("div");
    item.className = "gallery-item";
    item.dataset.category = img.category;
    item.dataset.index = index;

    item.innerHTML = `
      <img src="https://picsum.photos/id/${img.id}/600/800" alt="${img.title}" loading="lazy">
      <span class="frame-mark tl"></span>
      <span class="frame-mark br"></span>
      <div class="item-overlay">
        <span class="chip">${img.category}</span>
        <h3>${img.title}</h3>
      </div>
    `;

    item.addEventListener("click", () => openLightbox(index));
    gallery.appendChild(item);
  });

  observeItems();
}

// ============================
// 4. SCROLL-REVEAL ANIMATION
// (images fade/rise in as they enter the viewport)
// ============================
function observeItems() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  document
    .querySelectorAll(".gallery-item")
    .forEach((item) => observer.observe(item));
}

// ============================
// 5. FILTER LOGIC
// ============================
filterBar.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;

  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  activeFilter = btn.dataset.filter;
  applyFilter();
});

function applyFilter() {
  document.querySelectorAll(".gallery-item").forEach((item) => {
    const matches =
      activeFilter === "all" || item.dataset.category === activeFilter;
    item.classList.toggle("hidden", !matches);
    if (matches) item.classList.add("in-view");
  });
}

function getVisibleIndexes() {
  return images
    .map((img, i) => i)
    .filter(
      (i) => activeFilter === "all" || images[i].category === activeFilter,
    );
}

// ============================
// 6. LIGHTBOX LOGIC
// ============================
function openLightbox(index) {
  currentIndex = index;
  updateLightboxImage();
  renderThumbs();
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";

  lbFrame.style.animation = "none";
  void lbFrame.offsetWidth;
  lbFrame.style.animation = null;
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

function updateLightboxImage() {
  const img = images[currentIndex];
  lbImage.style.opacity = 0;

  setTimeout(() => {
    lbImage.src = `https://picsum.photos/id/${img.id}/1000/700`;
    lbImage.alt = img.title;
    lbImage.onload = () => {
      lbImage.style.opacity = 1;
    };
  }, 120);

  lbTitle.textContent = img.title;

  const visible = getVisibleIndexes();
  const position = visible.indexOf(currentIndex) + 1;
  lbCount.textContent = `${position} / ${visible.length}`;

  highlightActiveThumb();
}

function renderThumbs() {
  const visible = getVisibleIndexes();
  lbThumbs.innerHTML = "";

  visible.forEach((i) => {
    const thumb = document.createElement("img");
    thumb.src = `https://picsum.photos/id/${images[i].id}/100/100`;
    thumb.alt = images[i].title;
    thumb.dataset.index = i;
    if (i === currentIndex) thumb.classList.add("active");

    thumb.addEventListener("click", () => {
      currentIndex = i;
      updateLightboxImage();
    });

    lbThumbs.appendChild(thumb);
  });
}

function highlightActiveThumb() {
  document.querySelectorAll(".lb-thumbs img").forEach((t) => {
    t.classList.toggle("active", Number(t.dataset.index) === currentIndex);
  });
}

function showNext() {
  const visible = getVisibleIndexes();
  const pos = visible.indexOf(currentIndex);
  currentIndex = visible[(pos + 1) % visible.length];
  updateLightboxImage();
}

function showPrev() {
  const visible = getVisibleIndexes();
  const pos = visible.indexOf(currentIndex);
  currentIndex = visible[(pos - 1 + visible.length) % visible.length];
  updateLightboxImage();
}

// ============================
// 7. EVENT LISTENERS
// ============================
lbClose.addEventListener("click", closeLightbox);
lbBackdrop.addEventListener("click", closeLightbox);
lbNext.addEventListener("click", showNext);
lbPrev.addEventListener("click", showPrev);

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") showNext();
  if (e.key === "ArrowLeft") showPrev();
});

// back-to-top button show/hide + click
window.addEventListener("scroll", () => {
  backToTop.classList.toggle("show", window.scrollY > 500);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ============================
// 8. INIT
// ============================
renderGallery();
