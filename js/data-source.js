/* ============================================================
   ELYSIAN FINDS — Catalogue data source
   ------------------------------------------------------------
   HOW THIS WORKS FOR WHOEVER MANAGES THE CATALOGUE:
   Paste the CSV link of a published Google Sheet into
   SHEET_CSV_URL below. From then on, every page loads its
   product list live from that sheet — add a row to add a
   product, delete a row to remove one, edit a cell to update
   it. No code changes needed after this one-time setup.

   See ADMIN-GUIDE.md in this folder for full step-by-step
   instructions and the ready-made spreadsheet template
   (products-template.csv).

   If SHEET_CSV_URL is left blank, or the sheet can't be
   reached, the site automatically uses the built-in sample
   catalogue in products.js instead — so it never breaks.
   ============================================================ */

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTH9yeSK8afSLLvgPWbqvJQvNKaQ3o0rj_fbWQ5HtvnrjehCpeQmtTVYkondxh9mnPcLFooGQcJ9Hat/pub?output=csv"; // TODO: paste your published Google Sheet CSV link here

// Default placeholder art per category, used whenever a row has no image_url.
const CATEGORY_ICON_DEFAULTS = {
  Rings: ["ring_round", "ring_oval"],
  Necklaces: ["necklace_pendant", "necklace_layered"],
  Earrings: ["earring_drop", "earring_stud"],
  Bangles: ["bangle_single", "bangle_stack"],
  Mangalsutra: ["mangalsutra"],
  Accessories: ["brooch", "anklet"],
};
function defaultGalleryFor(category){
  return CATEGORY_ICON_DEFAULTS[category] || ["ring_round"];
}

function slugify(str){
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Minimal RFC4180-ish CSV parser: handles quoted fields, escaped quotes, commas/newlines inside quotes. */
function parseCSV(text){
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for(let i = 0; i < text.length; i++){
    const c = text[i], next = text[i+1];
    if(inQuotes){
      if(c === '"' && next === '"'){ field += '"'; i++; }
      else if(c === '"'){ inQuotes = false; }
      else field += c;
    } else {
      if(c === '"'){ inQuotes = true; }
      else if(c === ','){ row.push(field); field = ""; }
      else if(c === '\r'){ /* skip, \n handles the break */ }
      else if(c === '\n'){ row.push(field); rows.push(row); row = []; field = ""; }
      else field += c;
    }
  }
  if(field.length || row.length){ row.push(field); rows.push(row); }
  if(!rows.length) return [];
  const headers = rows[0].map(h => h.trim().toLowerCase().replace(/\s+/g, "_"));
  return rows.slice(1)
    .filter(r => r.some(v => v && v.trim()))
    .map(r => {
      const obj = {};
      headers.forEach((h, idx) => obj[h] = r[idx] !== undefined ? r[idx].trim() : "");
      return obj;
    });
}

function normalizeRow(row, i){
  const name = row.name || "";
  const category = row.category || "Accessories";
  const images = (row.image_url || "").split("|").map(s => s.trim()).filter(Boolean);
  const gallery = images.length ? images : defaultGalleryFor(category);
  const price = parseFloat(String(row.price || "0").replace(/[^0-9.]/g, "")) || 0;

  return {
    id: row.id || slugify(name) || ("item-" + i),
    name: name || "Untitled piece",
    category,
    occasion: row.occasion || "Everyday",
    price,
    tag: row.tag || "",
    icon: gallery[0],
    gallery,
    material: row.material || "",
    stone: row.stone || "",
    weight: row.weight || "",
    plating: row.plating || "",
    description: row.description || "",
    meeshoUrl: row.meesho_url || MEESHO_STORE_URL,
  };
}

/** Populated as soon as SOME data is ready (cache, then live sheet, or the fallback). */
let PRODUCTS = PRODUCTS_FALLBACK.slice();
let PRODUCTS_SOURCE = "fallback"; // 'fallback' | 'cache' | 'live'

const CACHE_KEY = "ef_products_cache_v1";
const CACHE_MAX_AGE_MS = 15 * 60 * 1000;   // treat cache as "fresh enough" for 15 min
const FETCH_TIMEOUT_MS = 7000;             // never let a slow sheet hang the page

function readCache(){
  try{
    const raw = localStorage.getItem(CACHE_KEY);
    if(!raw) return null;
    const parsed = JSON.parse(raw);
    if(!parsed || !Array.isArray(parsed.products) || !parsed.products.length) return null;
    return parsed; // { products, savedAt }
  } catch(err){
    return null; // localStorage unavailable (private mode, storage full, etc.) — just skip caching
  }
}
function writeCache(products){
  try{
    localStorage.setItem(CACHE_KEY, JSON.stringify({ products, savedAt: Date.now() }));
  } catch(err){ /* non-fatal — site still works without caching */ }
}

async function fetchProductsFromSheet(){
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try{
    const res = await fetch(SHEET_CSV_URL, { cache: "no-store", signal: controller.signal });
    if(!res.ok) throw new Error("Sheet responded with " + res.status);
    const text = await res.text();
    const rows = parseCSV(text);
    if(!rows.length) throw new Error("Sheet returned no rows");
    return rows.map(normalizeRow);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Resolves as soon as something is ready to render — which is instant if a
 * cached copy exists, so the page is never left staring at a blank loading
 * state while Google Sheets responds.
 *
 * If a sheet is configured, a fresh fetch also always runs (in the background
 * when cache already resolved this call). When it finishes, PRODUCTS updates
 * and a "products:updated" event fires on window so open pages can silently
 * refresh — add a listener if a page should reflect live edits without a
 * reload.
 */
async function loadProducts(){
  if(!SHEET_CSV_URL){
    PRODUCTS = PRODUCTS_FALLBACK.slice();
    PRODUCTS_SOURCE = "fallback";
    return PRODUCTS;
  }

  const cached = readCache();
  if(cached){
    PRODUCTS = cached.products;
    PRODUCTS_SOURCE = "cache";
  }

  const refreshPromise = fetchProductsFromSheet()
    .then(list => {
      PRODUCTS = list;
      PRODUCTS_SOURCE = "live";
      writeCache(list);
      window.dispatchEvent(new CustomEvent("products:updated", { detail: { source: "live" } }));
      return PRODUCTS;
    })
    .catch(err => {
      console.warn("Elysian Finds: could not load the live sheet.", err);
      if(!cached){
        PRODUCTS = PRODUCTS_FALLBACK.slice();
        PRODUCTS_SOURCE = "fallback";
        window.dispatchEvent(new CustomEvent("products:updated", { detail: { source: "fallback" } }));
      }
      return PRODUCTS;
    });

  // Cache already gave us something to show — let the refresh continue quietly.
  if(cached) return PRODUCTS;
  // First-ever visit with no cache: this IS the real load, so wait for it.
  return refreshPromise;
}

function computeCategories(list){
  return ["All", ...Array.from(new Set(list.map(p => p.category)))];
}