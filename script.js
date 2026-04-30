const STORAGE_KEY = "exchange4students.marketplace.v1";


// const seedListings = [
//   {
//     id: crypto.randomUUID(),
//     title: "Calculus I Textbook Bundle",
//     category: "Textbooks",
//     price: 55,
//     condition: "Good",
//     seller: "Jacky Lei",
//     email: "jlei@stevens.edu",
//     pickup: "Science Hall entrance",
//     description: "Includes textbook, formula sheet packet, and lightly used notebook from last semester.",
//     status: "available",
//     createdAt: "2026-03-24T15:00:00.000Z",
//     isUserListing: false
//   },
//   {
//     id: crypto.randomUUID(),
//     title: "Mini Fridge 3.2 cu ft",
//     category: "Dorm Essentials",
//     price: 85,
//     condition: "Like New",
//     seller: "Kayla Holmes",
//     email: "kholmes@stevens.edu",
//     pickup: "Oak Residence Hall",
//     description: "Perfect for dorm rooms, very clean, and keeps drinks cold fast. Pickup only.",
//     status: "available",
//     createdAt: "2026-03-26T18:30:00.000Z",
//     isUserListing: false
//   },
//   {
//     id: crypto.randomUUID(),
//     title: "Desk Lamp with USB Charging Port",
//     category: "Furniture",
//     price: 22,
//     condition: "Good",
//     seller: "Robert Galletta",
//     email: "rgalletta@stevens.edu",
//     pickup: "Student Union",
//     description: "LED desk lamp with brightness settings and built-in charging port for phone or earbuds.",
//     status: "available",
//     createdAt: "2026-03-28T12:15:00.000Z",
//     isUserListing: false
//   },
//   {
//     id: crypto.randomUUID(),
//     title: "TI-84 Plus Graphing Calculator",
//     category: "School Supplies",
//     price: 48,
//     condition: "Fair",
//     seller: "Ying Wang",
//     email: "ywang@stevens.edu",
//     pickup: "Library front desk",
//     description: "Works well, slight scratches on the cover, batteries included.",
//     status: "available",
//     createdAt: "2026-03-29T10:20:00.000Z",
//     isUserListing: false
//   },
//   {
//     id: crypto.randomUUID(),
//     title: "Noise-Canceling Headphones",
//     category: "Electronics",
//     price: 95,
//     condition: "Like New",
//     seller: "Nica Saoi",
//     email: "nsaoi@stevens.edu",
//     pickup: "Engineering building lobby",
//     description: "Used for one semester, includes charger case and original box.",
//     status: "sold",
//     createdAt: "2026-03-20T09:00:00.000Z",
//     isUserListing: false
//   }
// ];


const listingGrid = document.getElementById("listingGrid");
const listingTemplate = document.getElementById("listingCardTemplate");
const listingForm = document.getElementById("listingForm");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const conditionFilter = document.getElementById("conditionFilter");
const priceFilter = document.getElementById("priceFilter");
const priceFilterValue = document.getElementById("priceFilterValue");
const availabilityFilter = document.getElementById("availabilityFilter");
const favoritesOnlyBtn = document.getElementById("favoritesOnlyBtn");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");
const resetDataBtn = document.getElementById("resetDataBtn");
const resultsLabel = document.getElementById("resultsLabel");
const favoritesList = document.getElementById("favoritesList");
const interestList = document.getElementById("interestList");
const listingCount = document.getElementById("listingCount");
const favoriteCount = document.getElementById("favoriteCount");
const interestCount = document.getElementById("interestCount");
const heroStats = document.getElementById("heroStats");

var state = null;

function initialize() {
  populateCategoryOptions();
  bindEvents();
  updatePriceLabel();
  render();
}

async function loadState() {
  return {
    listings: await getAllListings(),
    favorites: [],
    interests: [],
    favoritesOnly: false
  };
}

// function saveState() {
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
// }

function bindEvents() {
  listingForm.addEventListener("submit", handleListingSubmit);
  searchInput.addEventListener("input", render);
  categoryFilter.addEventListener("change", render);
  conditionFilter.addEventListener("change", render);
  priceFilter.addEventListener("input", () => {
    updatePriceLabel();
    render();
  });
  availabilityFilter.addEventListener("change", render);
  favoritesOnlyBtn.addEventListener("click", () => {
    state.favoritesOnly = !state.favoritesOnly;
    favoritesOnlyBtn.textContent = state.favoritesOnly ? "Showing Favorites" : "Show Favorites";
    render();
  });
  clearFiltersBtn.addEventListener("click", clearFilters);
  resetDataBtn.addEventListener("click", resetDemoData);

  document.querySelectorAll("[data-scroll-target]").forEach((button) => {
    button.addEventListener("click", () => {
      document.getElementById(button.dataset.scrollTarget)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function populateCategoryOptions() {
  console.log(state.listing);
  const categories = [...new Set(state.listings.map((listing) => listing.category))];

  for (const category of categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.append(option);
  }
}

async function addListing(dataJson)
{
  const request = new Request("http://localhost:3000/api/make_listing", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dataJson),
  });
  const response = await fetch(request);
  console.log("Sent request");
  console.log(request);
  console.log(response.status);
}

function handleListingSubmit() {
  event.preventDefault();

  const formData = new FormData(listingForm);
  const newListingObject = {
    id: state.listings.length + 1,
    title: formData.get("title").trim(),
    category: formData.get("category"),
    price: Number(formData.get("price")),
    condition: formData.get("condition"),
    seller: formData.get("seller").trim(),
    email: formData.get("email").trim(),
    pickup: formData.get("pickup").trim(),
    description: formData.get("description").trim(),
    status: "available",
    createdAt: new Date().toISOString(),
    isUserListing: true
  };

  const newListing = [
    newListingObject.id,
    newListingObject.title,
    newListingObject.category,
    newListingObject.price,
    newListingObject.condition,
    newListingObject.seller,
    newListingObject.email,
    newListingObject.pickup,
    newListingObject.description,
    newListingObject.status,
    newListingObject.createdAt,
    newListingObject.isUserListing
  ]

  state.listings.unshift(newListing);
  addListing(newListingObject);
  // saveState();
  listingForm.reset();
  populateMissingCategory(newListing.category);
  render();
}

function populateMissingCategory(category) {
  const exists = Array.from(categoryFilter.options).some((option) => option.value === category);
  if (!exists) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.append(option);
  }
}

function clearFilters() {
  searchInput.value = "";
  categoryFilter.value = "all";
  conditionFilter.value = "all";
  priceFilter.value = "500";
  availabilityFilter.value = "all";
  state.favoritesOnly = false;
  favoritesOnlyBtn.textContent = "Show Favorites";
  updatePriceLabel();
  render();
}

async function resetDemoData() {
  await resetTable();
  state.listings = [...seedListings];
  state.favorites = [];
  state.interests = [];
  state.favoritesOnly = false;
  clearFilters();
  // saveState();
}

function render() {
  const filteredListings = getFilteredListings();
  renderListings(filteredListings);
  renderCompactList(favoritesList, state.favorites, "favorites");
  renderCompactList(interestList, state.interests, "interests");
  renderDashboard(filteredListings);
  // saveState();
}

function getFilteredListings() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const condition = conditionFilter.value;
  const maxPrice = Number(priceFilter.value);
  const status = availabilityFilter.value;

  return [...state.listings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter((listing) => {
      const matchesQuery =
        !query ||
        [listing.title, listing.description, listing.category, listing.seller]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesCategory = category === "all" || listing.category === category;
      const matchesCondition = condition === "all" || listing.condition === condition;
      const matchesPrice = listing.price <= maxPrice;
      const matchesStatus = status === "all" || listing.status === status;
      const matchesFavorite = !state.favoritesOnly || state.favorites.includes(listing.id);

      return matchesQuery && matchesCategory && matchesCondition && matchesPrice && matchesStatus && matchesFavorite;
    });
}

function renderListings(listings) {
  listingGrid.innerHTML = "";
  resultsLabel.textContent = `${listings.length} result${listings.length === 1 ? "" : "s"}`;

  for (const listing of listings) {
    const fragment = listingTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".listing-card");
    const favoriteButton = fragment.querySelector(".favorite-button");
    const interestButton = fragment.querySelector(".interest-button");
    const soldButton = fragment.querySelector(".sold-button");
    const statusPill = fragment.querySelector(".status-pill");

    fragment.querySelector(".item-category").textContent = listing.category;
    fragment.querySelector(".item-title").textContent = listing.title;
    fragment.querySelector(".item-description").textContent = listing.description;
    fragment.querySelector(".item-condition").textContent = listing.condition;
    fragment.querySelector(".item-pickup").textContent = listing.pickup;
    fragment.querySelector(".item-seller").textContent = listing.seller;
    fragment.querySelector(".item-email").textContent = listing.email;
    fragment.querySelector(".item-price").textContent = formatCurrency(listing.price);

    statusPill.textContent = listing.status === "available" ? "Available" : "Sold";
    statusPill.classList.add(listing.status);

    favoriteButton.textContent = state.favorites.includes(listing.id) ? "Unsave" : "Save";
    favoriteButton.addEventListener("click", () => toggleCollection("favorites", listing.id));

    const inInterestCart = state.interests.includes(listing.id);
    interestButton.textContent = inInterestCart ? "Remove Interest" : "I'm Interested";
    interestButton.disabled = listing.status === "sold";
    interestButton.style.opacity = listing.status === "sold" ? "0.55" : "1";
    interestButton.addEventListener("click", () => toggleCollection("interests", listing.id));

    if (listing.isUserListing) {
      soldButton.textContent = listing.status === "available" ? "Mark Sold" : "Reopen";
      soldButton.addEventListener("click", () => toggleSoldStatus(listing.id));
    } else {
      soldButton.textContent = "Student Seller";
      soldButton.disabled = true;
      soldButton.style.opacity = "0.6";
    }

    if (listing.status === "sold") {
      card.style.opacity = "0.82";
    }

    listingGrid.append(card);
  }
}

function renderCompactList(container, ids, type) {
  container.innerHTML = "";

  const items = ids
    .map((id) => state.listings.find((listing) => listing.id === id))
    .filter(Boolean);

  for (const item of items) {
    const wrapper = document.createElement("article");
    const actionLabel = type === "favorites" ? "Remove" : "Clear";
    wrapper.className = "compact-item";
    wrapper.innerHTML = `
      <strong>${item.title}</strong>
      <p>${formatCurrency(item.price)} | ${item.pickup}</p>
      <p>${item.status === "available" ? item.email : "Item is no longer available"}</p>
    `;

    const button = document.createElement("button");
    button.className = "ghost-button";
    button.type = "button";
    button.textContent = actionLabel;
    button.addEventListener("click", () => toggleCollection(type, item.id));
    wrapper.append(button);
    container.append(wrapper);
  }
}

function renderDashboard(filteredListings) {
  const availableListings = state.listings.filter((listing) => listing.status === "available");
  listingCount.textContent = availableListings.length;
  favoriteCount.textContent = state.favorites.length;
  interestCount.textContent = state.interests.length;

  heroStats.innerHTML = `
    <article>
      <strong>${formatCurrency(getAveragePrice(availableListings))}</strong>
      <p>Average asking price across active items</p>
    </article>
    <article>
      <strong>${availableListings.filter((listing) => listing.category === "Textbooks").length}</strong>
      <p>Textbook listings currently available</p>
    </article>
    <article>
      <strong>${filteredListings.length}</strong>
      <p>Items match your current filters</p>
    </article>
  `;
}

function toggleCollection(collectionName, listingId) {
  const collection = state[collectionName];
  const index = collection.indexOf(listingId);

  if (index >= 0) {
    collection.splice(index, 1);
  } else {
    collection.push(listingId);
  }

  render();
}

function toggleSoldStatus(listingId) {
  const listing = state.listings.find((item) => item.id === listingId);

  if (!listing) {
    return;
  }

  listing.status = listing.status === "available" ? "sold" : "available";

  if (listing.status === "sold") {
    state.interests = state.interests.filter((id) => id !== listingId);
  }

  render();
}

function updatePriceLabel() {
  priceFilterValue.textContent = formatCurrency(Number(priceFilter.value));
}

function getAveragePrice(listings) {
  if (!listings.length) {
    return 0;
  }

  const total = listings.reduce((sum, listing) => sum + listing.price, 0);
  return Math.round(total / listings.length);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);
}

async function getAllListings() 
{
  console.log('getAllListings called');
  const response = await fetch("http://localhost:3000/api/listings");
  return await response.json();
}

async function main()
{
  try {
    const seedListings = await getAllListings();
    // console.log(seedListings);
  } catch (err) {
    console.log(err);
  }
  state = await loadState();
  console.log("moo");
  console.log(state.listings);
  console.log(state);
  setTimeout(() => {
    console.log("Waited 1 second!");
  }, 1000); 
  initialize();
}
main();