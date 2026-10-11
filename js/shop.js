/* ============================================================
   js/shop.js — shared logic for category pages (shirts, shoes…)
   Each page defines window.SHOP_CONFIG BEFORE loading this file.
   ============================================================ */
(function () {
  "use strict";
  const C = window.SHOP_CONFIG;
  if (!C) {
    console.error("shop.js: window.SHOP_CONFIG is missing.");
    return;
  }
  const $ = (id) => document.getElementById(id);

  // ───────── CONFIG ─────────
  const STORAGE_KEY = C.storageKey;
  const IMAGES_PATH = C.imagesPath;
  const PER_PAGE = C.perPage || 12;
  const SIZE_UNIT = C.sizeUnit || "";
  const NOUN = (C.singular || "item").toLowerCase();
  const NOUNS = (C.plural || "items").toLowerCase();
  const BADGES = {
    NEW: ["new", "New"],
    SALE: ["sale", "Sale"],
    BESTSELLER: ["best", "Best seller"],
  };

  // row = [id, name, brand, price, origPrice, sizes, badge, image, type]
  const DEFAULTS = (C.defaults || []).map((r) => ({
    id: String(r[0]),
    name: r[1],
    brand: r[2],
    price: r[3],
    origPrice: r[4],
    sizes: r[5],
    badge: r[6],
    image: r[7],
    type: r[8] || "",
  }));

  // ───────── HELPERS ─────────
  const read = (k, fb) => {
    try {
      const v = JSON.parse(localStorage.getItem(k));
      return v == null ? fb : v;
    } catch (e) {
      return fb;
    }
  };
  const write = (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  };
  const esc = (s) =>
    String(s == null ? "" : s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const peso = (n) => "₱" + Number(n).toLocaleString("en-PH");
  const sizesOf = (p) =>
    String(p.sizes || "")
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);

  // Long size lists → a short range (EU 38–44); letter sizes stay as a list
  function sizeText(p) {
    const s = sizesOf(p);
    if (!s.length) return "";
    const nums = s.map(Number);
    if (nums.every((n) => !isNaN(n))) {
      nums.sort((a, b) => a - b);
      const range =
        nums.length > 1
          ? nums[0] + "–" + nums[nums.length - 1]
          : String(nums[0]);
      return (SIZE_UNIT ? SIZE_UNIT + " " : "") + range;
    }
    return s.join(" · ");
  }

  window.showToast =
    window.showToast ||
    function (msg) {
      const t = $("toast");
      t.textContent = msg;
      t.classList.add("show");
      clearTimeout(t._h);
      t._h = setTimeout(() => t.classList.remove("show"), 2500);
    };

  // ───────── STATE ─────────
  let products = read(STORAGE_KEY, null);
  if (!Array.isArray(products)) products = DEFAULTS.slice();
  let cart = read("auringph_cart", []);
  let wishlist = read("auringph_wishlist", []);
  let filtered = [];
  const state = {
    brands: new Set(),
    types: new Set(),
    size: "",
    min: null,
    max: null,
    q: "",
    sort: "default",
    page: 1,
  };

  // Admin tools are hidden from customers.
  // Prototype switch: add ?admin=1 to the URL to show them.
  const isAdmin =
    new URLSearchParams(location.search).get("admin") === "1" ||
    (typeof ADMIN_AUTH_KEY !== "undefined" &&
      localStorage.getItem(ADMIN_AUTH_KEY) === "true");
  document.body.classList.toggle("is-admin", isAdmin);
  $("shopMain").classList.toggle("is-contain", !!C.contain);

  // ───────── NAV BADGES + AVATAR ─────────
  const badges = document.querySelectorAll(".badge-count");
  function refreshBadges() {
    badges.forEach((b) => {
      b.hidden = !(parseInt(b.textContent, 10) > 0);
    });
  }
  function updateCounts() {
    $("cartCount").textContent = cart.reduce((a, b) => a + (b.qty || 0), 0);
    $("favCount").textContent = wishlist.length;
    refreshBadges();
  }
  const mo = new MutationObserver(refreshBadges);
  badges.forEach((b) =>
    mo.observe(b, { childList: true, characterData: true, subtree: true }),
  );

  try {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    if (u) {
      const full =
        ((u.firstName || "") + " " + (u.lastName || "")).trim() ||
        u.name ||
        u.fullName ||
        "";
      const parts = full.split(/\s+/).filter(Boolean);
      if (parts.length)
        $("navAvatar").textContent = (
          parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")
        ).toUpperCase();
    }
  } catch (e) {}

  // ───────── FILTER UI ─────────
  function checkRow(kind, value, label, count, checked) {
    return (
      `<label class="check-row"><input type="checkbox" data-${kind}="${esc(value)}" ${checked ? "checked" : ""}>` +
      `<span class="check-box" aria-hidden="true"></span><span>${esc(label)}</span><span class="count">${count}</span></label>`
    );
  }

  function renderBrands() {
    const counts = {};
    products.forEach((p) => {
      const b = p.brand || "Other";
      counts[b] = (counts[b] || 0) + 1;
    });
    state.brands.forEach((b) => {
      if (!counts[b]) state.brands.delete(b);
    });
    $("brandList").innerHTML =
      checkRow(
        "brand",
        "",
        "All brands",
        products.length,
        state.brands.size === 0,
      ) +
      Object.keys(counts)
        .sort((a, b) => a.localeCompare(b))
        .map((b) => checkRow("brand", b, b, counts[b], state.brands.has(b)))
        .join("");
  }

  function renderTypes() {
    const list = $("typeList");
    if (!list) return;
    const counts = {};
    products.forEach((p) => {
      if (p.type) counts[p.type] = (counts[p.type] || 0) + 1;
    });
    state.types.forEach((t) => {
      if (!counts[t]) state.types.delete(t);
    });
    const cfg = C.types || [];
    const order = cfg
      .filter((t) => counts[t])
      .concat(Object.keys(counts).filter((t) => !cfg.includes(t)));
    list.innerHTML =
      checkRow(
        "type",
        "",
        "All types",
        products.length,
        state.types.size === 0,
      ) +
      order
        .map((t) => checkRow("type", t, t, counts[t], state.types.has(t)))
        .join("");
  }

  function syncChecks() {
    [
      ["brandList", "brand", state.brands],
      ["typeList", "type", state.types],
    ].forEach(function (g) {
      const el = $(g[0]);
      if (!el) return;
      el.querySelectorAll("input[data-" + g[1] + "]").forEach((i) => {
        const v = i.dataset[g[1]];
        i.checked = v ? g[2].has(v) : g[2].size === 0;
      });
    });
  }

  function bindChecks(id, kind, set) {
    const el = $(id);
    if (!el) return;
    el.addEventListener("change", function (e) {
      const cb = e.target;
      if (!cb.matches("input[data-" + kind + "]")) return;
      const v = cb.dataset[kind];
      if (!v) set.clear();
      else if (cb.checked) set.add(v);
      else set.delete(v);
      syncChecks();
      state.page = 1;
      apply();
    });
  }
  bindChecks("brandList", "brand", state.brands);
  bindChecks("typeList", "type", state.types);

  // Size chips (generated from config when provided; otherwise the page's own chips are used)
  if (C.sizes && $("sizeGrid")) {
    $("sizeGrid").innerHTML = C.sizes
      .map(
        (s) =>
          `<button type="button" class="size-chip" data-size="${esc(s)}" aria-pressed="false">${esc(s)}</button>`,
      )
      .join("");
  }
  function syncSizeChips() {
    document
      .querySelectorAll(".size-chip")
      .forEach((c) =>
        c.setAttribute("aria-pressed", String(c.dataset.size === state.size)),
      );
  }
  $("sizeGrid").addEventListener("click", function (e) {
    const chip = e.target.closest(".size-chip");
    if (!chip) return;
    state.size = state.size === chip.dataset.size ? "" : chip.dataset.size;
    syncSizeChips();
    state.page = 1;
    apply();
  });

  function applyPrice() {
    let min = parseFloat($("minPrice").value),
      max = parseFloat($("maxPrice").value);
    min = isNaN(min) ? null : min;
    max = isNaN(max) ? null : max;
    if (min !== null && max !== null && min > max) {
      const t = min;
      min = max;
      max = t;
      $("minPrice").value = min;
      $("maxPrice").value = max;
    }
    state.min = min;
    state.max = max;
    state.page = 1;
    apply();
    closeFilters();
  }
  $("applyPriceBtn").addEventListener("click", applyPrice);
  ["minPrice", "maxPrice"].forEach((id) =>
    $(id).addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        applyPrice();
      }
    }),
  );

  $("searchInput").addEventListener("input", function () {
    state.q = this.value.trim().toLowerCase();
    state.page = 1;
    apply();
  });
  $("sortSelect").addEventListener("change", function () {
    state.sort = this.value;
    state.page = 1;
    apply();
  });

  function resetFilters() {
    state.brands.clear();
    state.types.clear();
    state.size = "";
    state.min = null;
    state.max = null;
    state.q = "";
    state.page = 1;
    $("minPrice").value = "";
    $("maxPrice").value = "";
    $("searchInput").value = "";
    syncChecks();
    syncSizeChips();
    apply();
  }
  $("resetFilters").addEventListener("click", resetFilters);

  $("activeFilters").addEventListener("click", function (e) {
    const b = e.target.closest("[data-remove]");
    if (!b) return;
    const k = b.dataset.remove;
    if (k === "all") return resetFilters();
    if (k === "brand") state.brands.delete(b.dataset.value);
    if (k === "type") state.types.delete(b.dataset.value);
    if (k === "size") state.size = "";
    if (k === "price") {
      state.min = null;
      state.max = null;
      $("minPrice").value = "";
      $("maxPrice").value = "";
    }
    if (k === "q") {
      state.q = "";
      $("searchInput").value = "";
    }
    syncChecks();
    syncSizeChips();
    state.page = 1;
    apply();
  });

  // Mobile filter drawer
  function openFilters() {
    $("filters").classList.add("open");
    $("filterBackdrop").classList.add("open");
    document.body.classList.add("no-scroll");
    $("filtersClose").focus();
  }
  function closeFilters() {
    $("filters").classList.remove("open");
    $("filterBackdrop").classList.remove("open");
    document.body.classList.remove("no-scroll");
  }
  $("openFilters").addEventListener("click", openFilters);
  $("filtersClose").addEventListener("click", closeFilters);
  $("filterBackdrop").addEventListener("click", closeFilters);
  $("showResults").addEventListener("click", closeFilters);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeFilters();
  });

  if ($("promoBtn"))
    $("promoBtn").addEventListener("click", () =>
      showToast("Promo applied at checkout!"),
    );

  // ───────── FILTER + SORT ─────────
  function apply() {
    const q = state.q;
    filtered = products.filter((p) => {
      if (state.brands.size && !state.brands.has(p.brand || "Other"))
        return false;
      if (state.types.size && !state.types.has(p.type)) return false;
      if (state.size && !sizesOf(p).includes(state.size)) return false;
      if (state.min !== null && p.price < state.min) return false;
      if (state.max !== null && p.price > state.max) return false;
      if (
        q &&
        !(
          String(p.name).toLowerCase().includes(q) ||
          String(p.brand || "")
            .toLowerCase()
            .includes(q)
        )
      )
        return false;
      return true;
    });
    if (state.sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
    else if (state.sort === "price-desc")
      filtered.sort((a, b) => b.price - a.price);
    else if (state.sort === "name-asc")
      filtered.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    render();
  }

  // ───────── RENDER ─────────
  function card(p) {
    const fav = wishlist.some((x) => x.id === p.id);
    const off =
      p.origPrice && p.origPrice > p.price
        ? Math.round((1 - p.price / p.origPrice) * 100)
        : 0;
    const badge = BADGES[p.badge];
    const name = esc(p.name);
    const st = sizeText(p);
    return `
      <article class="product-card" data-id="${esc(p.id)}">
        <div class="product-img">
          <img src="${esc(IMAGES_PATH + encodeURI(p.image || ""))}" alt="${name}" loading="lazy" width="400" height="${C.contain ? 400 : 500}">
          ${badge ? `<span class="product-badge ${badge[0]}">${badge[1]}</span>` : ""}
          <button type="button" class="heart-btn${fav ? " is-fav" : ""}" data-action="wish" aria-pressed="${fav}" aria-label="Favorite ${name}">
            <svg class="ico"><use href="#i-heart"/></svg>
          </button>
        </div>
        <div class="product-info">
          <div class="product-sub">${esc(p.brand || "")}</div>
          <h3 class="product-name">${name}</h3>
          ${st ? `<div class="product-sizes">${esc(st)}</div>` : ""}
          <div class="product-bottom">
            <span class="product-price">${peso(p.price)}</span>
            ${off ? `<span class="product-price-original">${peso(p.origPrice)}</span><span class="product-off">−${off}%</span>` : ""}
          </div>
          <div class="card-actions">
            <button type="button" class="btn-cart" data-action="cart"><svg class="ico"><use href="#i-cart"/></svg><span>Add to cart</span></button>
            <button type="button" class="btn-edit admin-only" data-action="edit">Edit</button>
          </div>
        </div>
      </article>`;
  }

  function renderTags() {
    const tags = [];
    state.brands.forEach((b) => tags.push(["brand", b, b]));
    state.types.forEach((t) => tags.push(["type", t, t]));
    if (state.size)
      tags.push([
        "size",
        "",
        (SIZE_UNIT ? SIZE_UNIT + " " : "Size ") + state.size,
      ]);
    if (state.min !== null || state.max !== null) {
      tags.push([
        "price",
        "",
        state.min !== null && state.max !== null
          ? `${peso(state.min)} – ${peso(state.max)}`
          : state.min !== null
            ? `${peso(state.min)}+`
            : `Up to ${peso(state.max)}`,
      ]);
    }
    if (state.q) tags.push(["q", "", "“" + state.q + "”"]);
    const bar = $("activeFilters");
    bar.hidden = tags.length === 0;
    bar.innerHTML =
      tags
        .map(
          (t) =>
            `<span class="tag">${esc(t[2])}<button type="button" data-remove="${t[0]}" data-value="${esc(t[1])}" aria-label="Remove filter ${esc(t[2])}"><svg class="ico"><use href="#i-x"/></svg></button></span>`,
        )
        .join("") +
      (tags.length
        ? '<button type="button" class="clear-all" data-remove="all">Clear all</button>'
        : "");
  }

  function renderPager(pages, start, shown, total) {
    let html = "";
    if (pages > 1) {
      const btn = (n, label, extra) =>
        `<button type="button" class="page-btn${extra || ""}" data-page="${n}" aria-label="${label}"`;
      html +=
        btn(state.page - 1, "Previous page") +
        `${state.page === 1 ? " disabled" : ""}><svg class="ico"><use href="#i-left"/></svg></button>`;
      const nums = [
        ...new Set([1, pages, state.page - 1, state.page, state.page + 1]),
      ]
        .filter((n) => n >= 1 && n <= pages)
        .sort((a, b) => a - b);
      let prev = 0;
      nums.forEach((n) => {
        if (n - prev > 1)
          html += '<span class="page-gap" aria-hidden="true">…</span>';
        html +=
          btn(n, "Page " + n, n === state.page ? " active" : "") +
          `${n === state.page ? ' aria-current="page"' : ""}>${n}</button>`;
        prev = n;
      });
      html +=
        btn(state.page + 1, "Next page") +
        `${state.page === pages ? " disabled" : ""}><svg class="ico"><use href="#i-right"/></svg></button>`;
    }
    $("pagination").innerHTML = html;
    $("pageInfo").textContent = total
      ? `Showing ${start + 1}–${start + shown} of ${total}`
      : "";
  }

  function render() {
    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / PER_PAGE));
    if (state.page > pages) state.page = pages;
    const start = (state.page - 1) * PER_PAGE;
    const items = filtered.slice(start, start + PER_PAGE);

    $("itemCount").textContent = `${total} product${total !== 1 ? "s" : ""}`;
    $("showResults").textContent = total
      ? `Show ${total} result${total !== 1 ? "s" : ""}`
      : "No results";

    $("productGrid").innerHTML = items.length
      ? items.map(card).join("")
      : `<div class="empty"><svg class="ico"><use href="#i-search"/></svg><h3>No ${esc(NOUNS)} found</h3><p>Try changing or clearing your filters.</p><button type="button" class="btn btn-primary btn-sm" data-action="reset">Clear all filters</button></div>`;

    renderTags();
    renderPager(pages, start, items.length, total);
  }

  // Missing image → neutral placeholder (no extra file needed, no error loop)
  $("productGrid").addEventListener(
    "error",
    function (e) {
      if (e.target.tagName === "IMG") {
        e.target.parentElement.classList.add("no-img");
        e.target.remove();
      }
    },
    true,
  );

  $("pagination").addEventListener("click", function (e) {
    const b = e.target.closest("[data-page]");
    if (!b || b.disabled) return;
    state.page = Number(b.dataset.page);
    render();
    $("shopMain").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // ───────── CART + WISHLIST ─────────
  function addToCart(id, btn) {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    const ex = cart.find((x) => x.id === p.id);
    if (ex) ex.qty = (ex.qty || 1) + 1;
    else
      cart.push({
        id: p.id,
        name: p.name,
        price: p.price,
        image: IMAGES_PATH + p.image,
        qty: 1,
      });
    write("auringph_cart", cart);
    updateCounts();
    showToast("Added to cart!");
    if (btn) {
      const label = btn.querySelector("span");
      btn.classList.add("is-done");
      label.textContent = "Added";
      setTimeout(() => {
        btn.classList.remove("is-done");
        label.textContent = "Add to cart";
      }, 1200);
    }
  }

  function toggleWish(id, btn) {
    const i = wishlist.findIndex((x) => x.id === id);
    const p = products.find((x) => x.id === id);
    const on = i === -1;
    if (on) {
      wishlist.push({ id, name: p ? p.name : "" });
      showToast("Added to favorites!");
    } else {
      wishlist.splice(i, 1);
      showToast("Removed from favorites");
    }
    write("auringph_wishlist", wishlist);
    btn.classList.toggle("is-fav", on); // update only this button (no grid re-render)
    btn.setAttribute("aria-pressed", String(on));
    updateCounts();
  }

  $("productGrid").addEventListener("click", function (e) {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const cardEl = btn.closest(".product-card");
    const id = cardEl ? cardEl.dataset.id : null;
    const act = btn.dataset.action;
    if (act === "wish") toggleWish(id, btn);
    else if (act === "cart") addToCart(id, btn);
    else if (act === "edit") openModal(id);
    else if (act === "reset") resetFilters();
  });

  // ───────── ADMIN MODAL ─────────
  const modal = $("productModal");
  const FIELDS = {
    name: ["fName", "eName"],
    brand: ["fBrand", "eBrand"],
    price: ["fPrice", "ePrice"],
    orig: ["fOrigPrice", "eOrig"],
    image: ["fImage", "eImage"],
  };

  function fillSelect(id, values, placeholder) {
    const el = $(id);
    if (!el || !values) return;
    el.innerHTML =
      `<option value="">${placeholder}</option>` +
      values.map((v) => `<option>${esc(v)}</option>`).join("");
  }
  fillSelect("fBrand", C.brandOptions, "Select brand");
  fillSelect("fType", C.types, "Select type");

  function setErrors(errs) {
    let first = null;
    Object.keys(FIELDS).forEach((k) => {
      const f = FIELDS[k];
      $(f[1]).textContent = errs[k] || "";
      $(f[0]).classList.toggle("is-invalid", !!errs[k]);
      if (errs[k] && !first) first = $(f[0]);
    });
    if (first) first.focus();
    return !first;
  }

  function openModal(id) {
    const p = id ? products.find((x) => x.id === id) : null;
    $("editDocId").value = p ? p.id : "";
    $("modalTitle").textContent = (p ? "Edit " : "Add ") + NOUN;
    $("fName").value = p ? p.name : "";
    $("fBrand").value = p ? p.brand || "" : "";
    $("fPrice").value = p ? p.price : "";
    $("fOrigPrice").value = p && p.origPrice ? p.origPrice : "";
    $("fSize").value = p ? p.sizes || "" : "";
    if ($("fType")) $("fType").value = p ? p.type || "" : "";
    $("fBadge").value = p ? p.badge || "" : "";
    $("fImage").value = p ? p.image || "" : "";
    $("modalDeleteBtn").hidden = !p;
    setErrors({});
    modal.showModal();
    $("fName").focus();
  }

  $("addProductBtn").addEventListener("click", () => openModal(null));
  $("modalCancelBtn").addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
  }); // click on backdrop

  $("productForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const data = {
      name: $("fName").value.trim(),
      brand: $("fBrand").value,
      price: Number($("fPrice").value),
      origPrice: Number($("fOrigPrice").value) || null,
      sizes: $("fSize")
        .value.split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean)
        .join(","),
      badge: $("fBadge").value,
      image: $("fImage").value.trim(),
    };
    if ($("fType")) data.type = $("fType").value;

    const errs = {};
    if (!data.name) errs.name = "Product name is required.";
    if (!data.brand) errs.brand = "Please select a brand.";
    if (!(data.price > 0)) errs.price = "Enter a valid price.";
    if (data.origPrice && data.origPrice <= data.price)
      errs.orig = "Must be higher than the price.";
    if (!data.image) errs.image = "Image filename is required.";
    if (!setErrors(errs)) return;

    const id = $("editDocId").value;
    if (id) {
      const idx = products.findIndex((x) => x.id === id);
      if (idx > -1) products[idx] = Object.assign({}, products[idx], data);
    } else {
      products.push(Object.assign({ id: Date.now().toString() }, data));
    }
    write(STORAGE_KEY, products);
    renderBrands();
    renderTypes();
    apply();
    modal.close();
    showToast("Saved successfully!");
  });

  $("modalDeleteBtn").addEventListener("click", function () {
    const id = $("editDocId").value;
    if (!id || !confirm("Are you sure you want to delete this product?"))
      return;
    products = products.filter((x) => x.id !== id);
    write(STORAGE_KEY, products);
    renderBrands();
    renderTypes();
    apply();
    modal.close();
    showToast("Product deleted");
  });

  // ───────── INIT ─────────
  renderBrands();
  renderTypes();
  syncSizeChips();
  apply();
  updateCounts();
  if (typeof syncNavBadges === "function") syncNavBadges();
})();
