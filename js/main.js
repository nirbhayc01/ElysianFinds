/* ============================================================
   ELYSIAN FINDS — Shared front-end behaviour
   ============================================================ */

function formatPrice(n){
  return "₹" + n.toLocaleString("en-IN");
}

function whatsappLink(product){
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  const text = product
    ? `Hi! I'm interested in the ${product.name} (${formatPrice(product.price)}). Is it available?`
    : `Hi! I'd like to know more about Elysian Finds jewelry.`;
  return `${base}?text=${encodeURIComponent(text)}`;
}

function initNav(){
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if(!toggle || !links) return;

  if(!links.id) links.id = "site-menu";
  toggle.setAttribute("aria-controls", links.id);

  function setMenuOpen(isOpen){
    links.classList.toggle("open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  }

  setMenuOpen(false);

  toggle.addEventListener("click", () => {
    setMenuOpen(!links.classList.contains("open"));
  });

  links.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", e => {
    if(e.key === "Escape" && links.classList.contains("open")){
      setMenuOpen(false);
      toggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if(window.innerWidth > 860) setMenuOpen(false);
  });
}

function closeCustomSelects(except){
  document.querySelectorAll(".custom-select.open").forEach(picker => {
    if(picker === except) return;
    picker.classList.remove("open");
    const trigger = picker.querySelector(".custom-select-trigger");
    if(trigger) trigger.setAttribute("aria-expanded", "false");
  });
}

function initCustomSelects(){
  let selectCount = 0;

  document.querySelectorAll("select").forEach(select => {
    if(select.dataset.customSelectReady === "true") return;
    select.dataset.customSelectReady = "true";

    const picker = document.createElement("div");
    const trigger = document.createElement("button");
    const value = document.createElement("span");
    const list = document.createElement("div");
    const idBase = select.id || `custom-select-${++selectCount}`;
    let activeIndex = -1;

    picker.className = "custom-select";
    trigger.type = "button";
    trigger.className = "custom-select-trigger";
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    value.className = "custom-select-value";
    value.id = `${idBase}-value`;
    list.className = "custom-select-options";
    list.id = `${idBase}-listbox`;
    list.setAttribute("role", "listbox");
    trigger.setAttribute("aria-controls", list.id);

    const label = select.id ? document.querySelector(`label[for="${select.id}"]`) : null;
    if(label){
      if(!label.id) label.id = `${idBase}-label`;
      trigger.setAttribute("aria-labelledby", `${label.id} ${value.id}`);
      label.addEventListener("click", e => {
        e.preventDefault();
        trigger.focus();
      });
    }

    trigger.appendChild(value);
    picker.append(trigger, list);
    select.classList.add("custom-select-native");
    select.insertAdjacentElement("afterend", picker);

    function selectOptions(){
      return Array.from(select.options);
    }

    function enabledIndex(start, direction){
      const options = selectOptions();
      if(!options.length) return -1;
      let index = (start + options.length) % options.length;
      for(let i = 0; i < options.length; i++){
        if(!options[index].disabled) return index;
        index = (index + direction + options.length) % options.length;
      }
      return -1;
    }

    function setActive(index, direction = 1){
      const nextIndex = enabledIndex(index, direction);
      const items = Array.from(list.querySelectorAll(".custom-select-option"));
      items.forEach(item => item.classList.remove("active"));
      if(nextIndex === -1){
        activeIndex = -1;
        trigger.removeAttribute("aria-activedescendant");
        return;
      }

      activeIndex = nextIndex;
      const activeItem = items[activeIndex];
      if(activeItem){
        activeItem.classList.add("active");
        trigger.setAttribute("aria-activedescendant", activeItem.id);
        if(picker.classList.contains("open")) activeItem.scrollIntoView({ block: "nearest" });
      }
    }

    function setOpen(isOpen){
      if(isOpen && trigger.disabled) return;
      if(isOpen) closeCustomSelects(picker);
      picker.classList.toggle("open", isOpen);
      trigger.setAttribute("aria-expanded", String(isOpen));
      if(isOpen) setActive(activeIndex > -1 ? activeIndex : select.selectedIndex);
    }

    function chooseOption(index){
      const option = selectOptions()[index];
      if(!option || option.disabled) return;
      select.selectedIndex = index;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      syncPicker();
      setOpen(false);
      trigger.focus();
    }

    function syncPicker(){
      const options = selectOptions();
      const selected = select.selectedOptions[0] || options[0];

      value.textContent = selected ? selected.textContent : "Select";
      trigger.disabled = select.disabled || !options.length;
      list.innerHTML = "";
      activeIndex = selected ? selected.index : -1;

      options.forEach((option, index) => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "custom-select-option";
        item.id = `${list.id}-option-${index}`;
        item.textContent = option.textContent;
        item.disabled = option.disabled;
        item.setAttribute("role", "option");
        item.setAttribute("aria-selected", String(option.selected));
        if(option.selected) item.classList.add("selected");
        item.addEventListener("click", () => chooseOption(index));
        list.appendChild(item);
      });

      setActive(activeIndex);
    }

    trigger.addEventListener("click", () => {
      setOpen(!picker.classList.contains("open"));
    });

    trigger.addEventListener("keydown", e => {
      if(e.key === "ArrowDown" || e.key === "ArrowUp"){
        e.preventDefault();
        if(!picker.classList.contains("open")) setOpen(true);
        setActive(activeIndex + (e.key === "ArrowDown" ? 1 : -1), e.key === "ArrowDown" ? 1 : -1);
      }
      if(e.key === "Enter" || e.key === " "){
        e.preventDefault();
        if(picker.classList.contains("open")) chooseOption(activeIndex);
        else setOpen(true);
      }
      if(e.key === "Escape") setOpen(false);
      if(e.key === "Tab") setOpen(false);
    });

    select.addEventListener("change", syncPicker);
    new MutationObserver(syncPicker).observe(select, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["disabled", "selected"]
    });

    syncPicker();
  });

  if(initCustomSelects.bound) return;
  initCustomSelects.bound = true;
  document.addEventListener("click", e => {
    if(!e.target.closest(".custom-select")) closeCustomSelects();
  });
  document.addEventListener("keydown", e => {
    if(e.key === "Escape") closeCustomSelects();
  });
}
function isImageURL(s){
  return typeof s === "string" && /^https?:\/\//i.test(s);
}

/** Renders either a real photo (image_url from the sheet) or a placeholder icon — same call site either way. */
function mediaMarkup(source, alt){
  if(isImageURL(source)){
    return `<img src="${source}" alt="${alt || ''}" loading="lazy">`;
  }
  const icon = ICONS[source] ? source : "ring_round";
  return ICONS[icon]();
}

/** Shimmer placeholder cards shown instantly while the real catalogue is still loading. */
function skeletonCardsHTML(count){
  const card = `
    <article class="card skel-card">
      <div class="card-media skel skel-media"></div>
      <div class="skel-body">
        <div class="skel-line skel w40"></div>
        <div class="skel-line skel w85"></div>
        <div class="skel-line skel w60"></div>
        <div class="skel-actions">
          <div class="skel-line skel"></div>
          <div class="skel-line skel"></div>
        </div>
      </div>
    </article>`;
  return card.repeat(count);
}

/** Shimmer placeholder for the product detail page's media + info column. */
function skeletonProductDetailHTML(){
  return `
    <div>
      <div class="pd-media skel skel-pd-media"></div>
    </div>
    <div class="pd-info">
      <div class="skel-pd-line skel" style="width:30%;"></div>
      <div class="skel-pd-line skel" style="width:70%; height:32px;"></div>
      <div class="skel-pd-line skel" style="width:25%;"></div>
      <div class="skel-pd-line skel" style="width:95%;"></div>
      <div class="skel-pd-line skel" style="width:85%;"></div>
    </div>`;
}

function productCardHTML(p){
  const tagHTML = p.tag ? `<span class="card-tag">${p.tag}</span>` : "";
  const wished = isWished(p.id);
  return `
  <article class="card" data-id="${p.id}">
    <div class="card-media">
      <a href="product.html?id=${p.id}" class="card-media-link" aria-label="View ${p.name}">
        ${tagHTML}
        ${mediaMarkup(p.icon, p.name)}
      </a>
      <button class="card-wish ${wished ? 'active' : ''}" data-id="${p.id}" aria-label="${wished ? 'Remove from' : 'Save to'} wishlist" aria-pressed="${wished}">
        <svg viewBox="0 0 24 24"><path d="M12 20.5s-7.6-4.6-10.2-9C.2 8 2.2 4.3 6 4.3c2.1 0 3.6 1.1 6 3.4 2.4-2.3 3.9-3.4 6-3.4 3.8 0 5.8 3.7 4.2 7.2-2.6 4.4-10.2 9-10.2 9z"/></svg>
      </button>
    </div>
    <div class="card-body">
      <span class="card-cat">${p.category} · ${p.occasion}</span>
      <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
      <p class="card-price">${formatPrice(p.price)}</p>
      <div class="card-actions">
        <a class="btn btn-gold" href="${p.meeshoUrl}" target="_blank" rel="noopener">Buy on Meesho</a>
        <a class="btn btn-outline" href="${whatsappLink(p)}" target="_blank" rel="noopener">Enquire</a>
      </div>
    </div>
  </article>`;
}

/* ============================================================
   PAGE LOADER
   ============================================================ */
const PAGE_LOAD_START = Date.now();
const PAGE_LOADER_MIN_MS = 550;   // avoid an unpleasant flash when data resolves instantly from cache
const PAGE_LOADER_MAX_MS = 6000;  // safety net — never let a stuck script leave the loader up forever

function hidePageLoader(){
  const loader = document.getElementById("page-loader");
  if(!loader || loader.classList.contains("hide")) return;
  loader.classList.add("hide");
  setTimeout(() => loader.remove(), 650);
}
function hidePageLoaderWhenReady(){
  const elapsed = Date.now() - PAGE_LOAD_START;
  setTimeout(hidePageLoader, Math.max(0, PAGE_LOADER_MIN_MS - elapsed));
}
setTimeout(hidePageLoader, PAGE_LOADER_MAX_MS);

/* ============================================================
   WISHLIST (saved locally in this browser)
   ============================================================ */
const WISHLIST_KEY = "ef_wishlist_v1";

function getWishlist(){
  try{ return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]"); }
  catch(err){ return []; }
}
function isWished(id){
  return getWishlist().includes(id);
}
function toggleWishlist(id){
  const list = getWishlist();
  const has = list.includes(id);
  const next = has ? list.filter(x => x !== id) : [...list, id];
  try{ localStorage.setItem(WISHLIST_KEY, JSON.stringify(next)); } catch(err){ /* storage unavailable — non-fatal */ }
  return !has;
}
function updateWishlistBadges(){
  const count = getWishlist().length;
  document.querySelectorAll(".wishlist-badge").forEach(el => {
    el.textContent = String(count);
    el.style.display = count ? "inline-flex" : "none";
  });
}

/* ============================================================
   RECENTLY VIEWED (saved locally in this browser)
   ============================================================ */
const RECENT_KEY = "ef_recent_v1";

function addRecentlyViewed(id){
  try{
    const list = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    const next = [id, ...list.filter(x => x !== id)].slice(0, 10);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch(err){ /* non-fatal */ }
}
function getRecentlyViewedIds(excludeId, limit){
  try{
    const list = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    return list.filter(x => x !== excludeId).slice(0, limit || 4);
  } catch(err){ return []; }
}

/* ============================================================
   TOAST notifications
   ============================================================ */
function showToast(message){
  let host = document.getElementById("toast-host");
  if(!host){
    host = document.createElement("div");
    host.id = "toast-host";
    host.className = "toast-host";
    document.body.appendChild(host);
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  host.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}

/* ============================================================
   Delegated wishlist heart clicks — works for any card/detail
   heart rendered now or added later, without rebinding listeners.
   ============================================================ */
function initWishlistDelegation(){
  document.addEventListener("click", e => {
    const btn = e.target.closest(".card-wish, .pd-wish");
    if(!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const id = btn.dataset.id;
    if(!id) return;
    const nowWished = toggleWishlist(id);
    document.querySelectorAll(`.card-wish[data-id="${CSS.escape(id)}"], .pd-wish[data-id="${CSS.escape(id)}"]`).forEach(el => {
      el.classList.toggle("active", nowWished);
      el.setAttribute("aria-pressed", String(nowWished));
    });
    updateWishlistBadges();
    showToast(nowWished ? "Saved to your wishlist" : "Removed from wishlist");
  });
}

/* ============================================================
   BACK TO TOP
   ============================================================ */
function initBackToTop(){
  if(document.querySelector(".back-to-top")) return;
  const btn = document.createElement("button");
  btn.className = "back-to-top";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`;
  document.body.appendChild(btn);
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 500);
  }, { passive: true });
}

/* ============================================================
   CAROUSEL ENGINE — generic swipeable slider used by the product
   gallery and the lightbox. Supports touch drag, mouse drag, and
   click arrows; snaps back on a partial swipe.
   ============================================================ */
function createCarousel(root, options){
  options = options || {};
  const track = root.querySelector(".carousel-track");
  const slides = Array.from(track.children);
  let index = 0, startX = 0, deltaX = 0, dragging = false, boxWidth = root.clientWidth || 1, lastDragEnd = 0;

  function measure(){ boxWidth = root.clientWidth || 1; }
  function apply(animate){
    track.style.transition = animate ? "transform .38s cubic-bezier(.4,0,.2,1)" : "none";
    track.style.transform = `translateX(${-index * boxWidth}px)`;
  }
  function goTo(i, animate){
    index = Math.max(0, Math.min(slides.length - 1, i));
    measure();
    apply(animate !== false);
    if(options.onChange) options.onChange(index);
  }

  if(slides.length > 1){
    track.addEventListener("pointerdown", e => {
      dragging = true; startX = e.clientX; deltaX = 0; measure();
      track.style.transition = "none";
      try{ track.setPointerCapture(e.pointerId); } catch(err){}
    });
    track.addEventListener("pointermove", e => {
      if(!dragging) return;
      deltaX = e.clientX - startX;
      track.style.transform = `translateX(${-index * boxWidth + deltaX}px)`;
    });
    function endDrag(){
      if(!dragging) return;
      dragging = false;
      const moved = Math.abs(deltaX) > 4;
      const threshold = boxWidth * 0.15;
      if(deltaX < -threshold && index < slides.length - 1) index++;
      else if(deltaX > threshold && index > 0) index--;
      deltaX = 0;
      apply(true);
      if(options.onChange) options.onChange(index);
      if(moved) lastDragEnd = Date.now();
    }
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    window.addEventListener("resize", () => apply(false));
  }

  goTo(0, false);
  return {
    goTo,
    next: () => goTo(index + 1),
    prev: () => goTo(index - 1),
    get index(){ return index; },
    get length(){ return slides.length; },
    wasRecentlyDragged: () => Date.now() - lastDragEnd < 300,
  };
}

/* ============================================================
   LIGHTBOX — full-screen zoom for product photos, built on the
   same carousel engine so swipe/arrow navigation carries over.
   ============================================================ */
function ensureLightboxHost(){
  let host = document.getElementById("lightbox-host");
  if(host) return host;

  host = document.createElement("div");
  host.id = "lightbox-host";
  host.className = "lightbox";
  host.innerHTML = `
    <div class="lightbox-stage">
      <div class="carousel-track" id="lightbox-track"></div>
      <button class="pd-nav prev" id="lightbox-prev" aria-label="Previous image">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <button class="pd-nav next" id="lightbox-next" aria-label="Next image">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>
    <button class="lightbox-close" aria-label="Close">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
    </button>`;
  document.body.appendChild(host);

  host.addEventListener("click", e => { if(e.target === host) closeLightbox(); });
  host.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  document.addEventListener("keydown", e => {
    if(e.key === "Escape") closeLightbox();
  });
  return host;
}

function openLightbox(product, startIndex){
  const host = ensureLightboxHost();
  const track = host.querySelector("#lightbox-track");
  track.innerHTML = product.gallery.map(source => `
    <div class="carousel-slide ${isImageURL(source) ? 'has-photo' : ''}">${mediaMarkup(source, product.name)}</div>
  `).join("");

  host.classList.add("open");
  document.body.classList.add("lightbox-open");

  const carousel = createCarousel(host.querySelector(".lightbox-stage"));
  carousel.goTo(startIndex || 0, false);

  const prevBtn = host.querySelector("#lightbox-prev");
  const nextBtn = host.querySelector("#lightbox-next");
  const multi = product.gallery.length > 1;
  prevBtn.style.display = multi ? "flex" : "none";
  nextBtn.style.display = multi ? "flex" : "none";
  prevBtn.onclick = () => carousel.prev();
  nextBtn.onclick = () => carousel.next();
}

function closeLightbox(){
  const host = document.getElementById("lightbox-host");
  if(host) host.classList.remove("open");
  document.body.classList.remove("lightbox-open");
}

function initAccordion(){
  document.querySelectorAll(".accordion-item").forEach(item => {
    const q = item.querySelector(".accordion-q");
    const a = item.querySelector(".accordion-a");
    q.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".accordion-item.open").forEach(other => {
        if(other !== item){
          other.classList.remove("open");
          other.querySelector(".accordion-a").style.maxHeight = null;
        }
      });
      if(isOpen){
        item.classList.remove("open");
        a.style.maxHeight = null;
      } else {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initCustomSelects();
  initWishlistDelegation();
  initBackToTop();
  updateWishlistBadges();
  const year = document.querySelector("#year");
  if(year) year.textContent = new Date().getFullYear();
});