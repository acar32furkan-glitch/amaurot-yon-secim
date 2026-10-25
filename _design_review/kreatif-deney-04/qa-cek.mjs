import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.MASTER01_PW_MODULE ?? "playwright-core");
const CHROME = process.env.MASTER01_CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

const kok = path.resolve("_design_review/kreatif-deney-04");
const qa = path.join(kok, "qa");
fs.mkdirSync(qa, { recursive: true });

const sayfalar = [
  { ad: "a-fotograf", dosya: "a-fotograf.html" },
  { ad: "b-malzeme", dosya: "b-malzeme.html" },
  { ad: "c-studyo", dosya: "c-studyo.html" }
];

const rapor = { tarih: new Date().toISOString(), sayfalar: {}, hatalar: [] };

const tarayici = await chromium.launch({ executablePath: CHROME, headless: true });

async function olcum(page) {
  return page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    const rect = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1), bottom: +r.bottom.toFixed(1) };
    };
    const cs = (sel, prop) => {
      const el = document.querySelector(sel);
      return el ? getComputedStyle(el)[prop] : null;
    };
    const imgs = [...document.images].map((i) => ({ src: i.getAttribute("src"), ok: i.complete && i.naturalWidth > 0, nat: i.naturalWidth }));
    const h1 = document.querySelector("h1");
    let h1TextW = null;
    if (h1) {
      const rg = document.createRange();
      rg.selectNodeContents(h1);
      h1TextW = +rg.getBoundingClientRect().width.toFixed(1);
    }
    const git = document.querySelector(".git");
    return {
      yatayTasma: document.documentElement.scrollWidth - window.innerWidth,
      sayfaYuksekligi: document.documentElement.scrollHeight,
      ust: rect(".ust"),
      marka: rect(".marka"),
      menu: rect(".anaMenu"),
      menuMerkezSapma: (() => {
        const m = document.querySelector(".anaMenu");
        if (!m) return null;
        const r = m.getBoundingClientRect();
        return +(r.left + r.width / 2 - window.innerWidth / 2).toFixed(1);
      })(),
      h1: rect("h1"),
      h1Font: cs("h1", "fontSize"),
      h1TextW,
      gitRect: (() => {
        if (!git) return null;
        const r = git.getBoundingClientRect();
        return { y: +r.y.toFixed(1), bottom: +r.bottom.toFixed(1) };
      })(),
      ilkEkrandaGit: git ? git.getBoundingClientRect().top >= 0 && git.getBoundingClientRect().bottom <= window.innerHeight : null,
      fontlar: {
        ltc: document.fonts.check('16px "LTC Metropolitan Pro"'),
        sans: document.fonts.check('400 16px "Source Sans 3"'),
        sansUstAgirlik: document.fonts.check('600 16px "Source Sans 3"')
      },
      gorselSayisi: imgs.length,
      yuklenmeyenGorsel: imgs.filter((i) => !i.ok).map((i) => i.src)
    };
  });
}

async function menuTest(page) {
  const dugme = await page.$(".menuDugme");
  if (!dugme) return { atlandi: "mobil menü düğmesi yok" };
  const gorunur = await page.evaluate(() => {
    const d = document.querySelector(".menuDugme");
    return d ? getComputedStyle(d).display !== "none" : false;
  });
  if (!gorunur) return { atlandi: "menü düğmesi gizli" };
  await page.click(".menuDugme");
  await page.waitForTimeout(120);
  const acik = await page.evaluate(() => {
    const m = document.getElementById("mobilMenu");
    return { gizli: m.hidden, genislik: m.getBoundingClientRect().width, odak: document.activeElement.textContent.trim() };
  });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(120);
  const kapali = await page.evaluate(() => {
    const m = document.getElementById("mobilMenu");
    return { gizli: m.hidden, odak: document.activeElement.id, genislik: m.getBoundingClientRect().width };
  });
  return { acik, kapali };
}

async function diyalogTest(page) {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(100);
  const dugme = await page.$("[data-urun]");
  if (!dugme) return { atlandi: "ürün düğmesi yok" };
  await page.evaluate(() => {
    const d = document.querySelector("[data-urun]");
    d.scrollIntoView({ block: "center", behavior: "instant" });
  });
  await page.waitForTimeout(150);
  await page.click("[data-urun]");
  await page.waitForTimeout(200);
  const acik = await page.evaluate(() => {
    const d = document.getElementById("urunDiyalog");
    return { open: d.open, ad: document.getElementById("dUrunAd").textContent, gorsel: document.getElementById("dGorsel").getAttribute("src"), odak: document.activeElement.id };
  });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  const kapali = await page.evaluate(() => {
    const d = document.getElementById("urunDiyalog");
    return { open: d.open, odak: document.activeElement.tagName + ":" + (document.activeElement.textContent || "").trim().slice(0, 20) };
  });
  return { acik, kapali };
}

async function bGecis(page) {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(250);
  const vh = await page.evaluate(() => window.innerHeight);
  const olcumler = {};
  for (const [ad, oran] of [["p50", 0.25], ["p85", 0.425]]) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), Math.round(vh * oran));
    await page.waitForTimeout(260);
    olcumler[ad] = await page.evaluate(() => {
      const u = document.querySelector(".ucan");
      const bas = document.getElementById("bKolBaslik");
      const urun = document.getElementById("bUrunGorsel");
      const hedef = document.getElementById("bHedef");
      const hedefG = document.getElementById("bHedefGorsel");
      const k = (el) => (el ? el.getBoundingClientRect() : null);
      const uR = k(u), bR = k(bas);
      const kesisim = uR && bR
        ? !(uR.right <= bR.left || uR.left >= bR.right || uR.bottom <= bR.top || uR.top >= bR.bottom)
        : null;
      return {
        p: getComputedStyle(document.getElementById("bHero")).getPropertyValue("--p").trim(),
        ucanGorunur: u ? getComputedStyle(u).display !== "none" : false,
        ucanKutu: uR ? { x: +uR.x.toFixed(1), y: +uR.y.toFixed(1), w: +uR.width.toFixed(1), h: +uR.height.toFixed(1) } : null,
        urunOpaklik: urun ? getComputedStyle(urun).opacity : null,
        hedefGorselOpaklik: hedefG ? getComputedStyle(hedefG).opacity : null,
        hedefTamam: hedef ? hedef.classList.contains("tamam") : null,
        baslikKesisim: kesisim,
        baslikKutu: bR ? { x: +bR.x.toFixed(1), y: +bR.y.toFixed(1), w: +bR.width.toFixed(1), h: +bR.height.toFixed(1) } : null
      };
    });
  }
  // çapa: doğrudan kullanılabilir koleksiyon
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(150);
  await page.click(".bPanel .git");
  await page.waitForTimeout(1400);
  const capa = await page.evaluate(() => {
    const h = document.getElementById("bHedef");
    const g = document.getElementById("bHedefGorsel");
    const r = h.getBoundingClientRect();
    return {
      hash: location.hash,
      scrollY: Math.round(window.scrollY),
      hedefGorselOpaklik: getComputedStyle(g).opacity,
      hedefGorunur: r.top < window.innerHeight && r.bottom > 0,
      ucanVar: !!document.querySelector(".ucan") && getComputedStyle(document.querySelector(".ucan")).display !== "none"
    };
  });
  return { ekranlar: olcumler, capa };
}

async function gezdir(page) {
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    const adim = Math.round(window.innerHeight * 0.8);
    for (let y = 0; y < h; y += adim) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 70));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(500);
}

for (const s of sayfalar) {
  const url = pathToFileURL(path.join(kok, s.dosya)).href;
  const kayit = {};
  const konsol = [];
  const istekHatasi = [];

  const ctx = await tarayici.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") konsol.push(m.text()); });
  page.on("pageerror", (e) => konsol.push("pageerror: " + e.message));
  page.on("requestfailed", (r) => istekHatasi.push(r.url() + " :: " + (r.failure()?.errorText || "")));

  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(700);
  await gezdir(page);
  kayit.masaustu1440 = await olcum(page);
  await page.screenshot({ path: path.join(qa, `${s.ad}-1440-ilk.jpg`), type: "jpeg", quality: 80 });
  await page.screenshot({ path: path.join(qa, `${s.ad}-1440-tam.jpg`), type: "jpeg", quality: 80, fullPage: true });

  if (s.ad === "b-malzeme") {
    kayit.bGecis = await bGecis(page);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(200);
    const vh = await page.evaluate(() => window.innerHeight);
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), Math.round(vh * 0.25));
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(qa, "b-malzeme-gecis-orta.jpg"), type: "jpeg", quality: 80 });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(200);
  }

  kayit.diyalog = await diyalogTest(page);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(200);

  // 1280x720
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.waitForTimeout(300);
  kayit.masaustu1280 = await olcum(page);
  await page.screenshot({ path: path.join(qa, `${s.ad}-1280-ilk.jpg`), type: "jpeg", quality: 80 });

  // 390x844
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(350);
  kayit.mobil390 = await olcum(page);
  kayit.mobilMenu = await menuTest(page);
  await page.screenshot({ path: path.join(qa, `${s.ad}-390-ilk.jpg`), type: "jpeg", quality: 80 });
  await page.screenshot({ path: path.join(qa, `${s.ad}-390-tam.jpg`), type: "jpeg", quality: 80, fullPage: true });

  kayit.hatalar = { konsol, istekHatasi };
  await ctx.close();

  // reduced motion
  const ctx2 = await tarayici.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const p2 = await ctx2.newPage();
  await p2.goto(url, { waitUntil: "load" });
  await p2.waitForTimeout(600);
  kayit.azHareket = await p2.evaluate(() => {
    const u = document.querySelector(".ucan");
    const gorunmeyen = [...document.querySelectorAll("[data-reveal]")].map((el) => getComputedStyle(el).opacity);
    return { ucan: u ? getComputedStyle(u).display : "yok", revealOpaklik: gorunmeyen };
  });
  await ctx2.close();

  // JS kapalı
  const ctx3 = await tarayici.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const p3 = await ctx3.newPage();
  await p3.goto(url, { waitUntil: "load" });
  await p3.waitForTimeout(600);
  try {
    kayit.jsKapali = await p3.evaluate(() => {
      const imgs = [...document.images].filter((i) => i.getBoundingClientRect().width > 0);
      return {
        metinVar: document.body.innerText.length > 400,
        gorunenGorsel: imgs.length,
        yuklenmeyen: imgs.filter((i) => !i.complete || i.naturalWidth === 0).length,
        sayfaYuksekligi: document.documentElement.scrollHeight
      };
    });
  } catch (e) {
    kayit.jsKapali = { olculemedi: String(e).slice(0, 120) };
  }
  await p3.screenshot({ path: path.join(qa, `${s.ad}-390-jsyok.jpg`), type: "jpeg", quality: 80, fullPage: true });
  await ctx3.close();

  rapor.sayfalar[s.ad] = kayit;
}

await tarayici.close();
fs.writeFileSync(path.join(qa, "rapor.json"), JSON.stringify(rapor, null, 2), "utf8");

const ozet = {};
for (const [ad, k] of Object.entries(rapor.sayfalar)) {
  ozet[ad] = {
    "1440": {
      ustH: k.masaustu1440.ust?.h,
      markaW: k.masaustu1440.marka?.w,
      menuSapma: k.masaustu1440.menuMerkezSapma,
      h1Font: k.masaustu1440.h1Font,
      h1TextW: k.masaustu1440.h1TextW,
      cta: k.masaustu1440.ilkEkrandaGit,
      tason: k.masaustu1440.yatayTasma,
      boy: k.masaustu1440.sayfaYuksekligi,
      eksikGorsel: k.masaustu1440.yuklenmeyenGorsel.length,
      fontlar: k.masaustu1440.fontlar
    },
    "1280": { cta: k.masaustu1280.ilkEkrandaGit, tason: k.masaustu1280.yatayTasma, boy: k.masaustu1280.sayfaYuksekligi },
    "390": { cta: k.mobil390.ilkEkrandaGit, tason: k.mobil390.yatayTasma, boy: k.mobil390.sayfaYuksekligi, menu: k.mobil390.menu ? k.mobil390.menu.w : null },
    diyalog: k.diyalog,
    mobilMenu: k.mobilMenu,
    bGecis: k.bGecis,
    azHareket: k.azHareket,
    jsKapali: k.jsKapali,
    hatalar: k.hatalar
  };
}
console.log(JSON.stringify(ozet, null, 1));
