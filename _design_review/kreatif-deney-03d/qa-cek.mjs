import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.MASTER01_PW_MODULE ?? "playwright-core");
const CHROME = process.env.MASTER01_CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

const kok = path.resolve("_design_review", "kreatif-deney-03d");
const qa = path.join(kok, "qa");
fs.mkdirSync(qa, { recursive: true });
const adres = pathToFileURL(path.join(kok, "index.html")).href;
const rapor = { tarih: new Date().toISOString(), olcum: {}, gecis: {}, mobil: {}, masaustu: {}, diger: {}, konsol: [] };

const tarayici = await chromium.launch({ executablePath: CHROME, headless: true });

async function bekle(p) {
  await p.evaluate(async () => { if (document.fonts && document.fonts.ready) await document.fonts.ready; });
  await p.waitForTimeout(450);
}
async function cek(p, ad, tam) {
  await p.screenshot({ path: path.join(qa, ad), type: "jpeg", quality: 80, fullPage: Boolean(tam) });
}
async function gezdir(p) {
  await p.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    const adim = Math.round(window.innerHeight * 0.8);
    for (let y = 0; y < h; y += adim) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 70));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await p.waitForTimeout(500);
}

function olcumFonksiyonu() {
  return () => {
    const R = (s) => { const el = document.querySelector(s); if (!el) return null; const b = el.getBoundingClientRect(); return { x: +b.x.toFixed(1), y: +(b.y + scrollY).toFixed(1), vx: +b.x.toFixed(1), vy: +b.y.toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1), alt: +(b.bottom + scrollY).toFixed(1) }; };
    const git = document.getElementById("gitKoleksiyon").getBoundingClientRect();
    const imgs = [...document.images];
    const marka = document.querySelector(".marka").getBoundingClientRect();
    return {
      ustH: +document.querySelector(".ust").getBoundingClientRect().height.toFixed(1),
      markaW: +marka.width.toFixed(1),
      amblemW: +document.querySelector(".marka img").getBoundingClientRect().width.toFixed(1),
      markaAd: getComputedStyle(document.querySelector(".markaAd")).fontSize,
      menuSapma: (() => { const m = document.querySelector(".anaMenu"); if (!m) return null; const r = m.getBoundingClientRect(); return r.width ? +(r.left + r.width / 2 - innerWidth / 2).toFixed(1) : null; })(),
      h1Font: getComputedStyle(document.querySelector("h1")).fontSize,
      h1Metin: document.querySelector("h1").textContent.trim(),
      gorsel: R("#merkezGorsel"),
      rozet: R(".rozet"),
      rozetH: +document.querySelector(".rozet").getBoundingClientRect().height.toFixed(1),
      btn: R(".btn"),
      btnH: +document.querySelector(".btn").getBoundingClientRect().height.toFixed(1),
      deri: R(".p0301"),
      yamac: R(".p0285"),
      sergiSonu: R(".sergi").alt,
      kolBaslik: R("#koleksiyonBaslik"),
      kIlkKart: R(".kGrid article:first-child"),
      kGorsel: R("#koleksiyonGorsel"),
      ctaIlkEkranda: git.top >= 0 && git.bottom <= innerHeight,
      ctaAlt: +git.bottom.toFixed(1),
      yatayTasma: document.documentElement.scrollWidth - innerWidth,
      boy: document.documentElement.scrollHeight,
      eksikGorsel: imgs.filter((i) => !(i.complete && i.naturalWidth > 0)).map((i) => i.getAttribute("src")),
      fontlar: { ltc: document.fonts.check('16px "LTC Metropolitan Pro"'), sans: document.fonts.check('400 16px "Source Sans 3"'), sans600: document.fonts.check('600 16px "Source Sans 3"') },
      bosHedef: [...document.querySelectorAll('a[href="#"]')].length,
      kirikCapa: [...document.querySelectorAll('a[href^="#"]')].filter((a) => a.getAttribute("href") !== "#" && !document.getElementById(a.getAttribute("href").slice(1))).map((a) => a.getAttribute("href")),
      atolyeGorsel: R(".atolyeGorsel"),
      atolyeMetin: R(".atolyeMetin"),
      malzemeGorsel: R(".malzemeGorsel")
    };
  };
}

function gecisFonksiyonu() {
  return () => {
    const klon = document.querySelector(".ucan");
    const kr = klon ? klon.getBoundingClientRect() : null;
    const kes = (a, b) => a && b ? !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom) : null;
    const h1 = document.querySelector("h1").getBoundingClientRect();
    const btn = document.querySelector(".btn").getBoundingClientRect();
    const bas = document.getElementById("koleksiyonBaslik").getBoundingClientRect();
    return {
      scrollY: Math.round(scrollY),
      ucus: document.documentElement.classList.contains("ucus"),
      kaynakYok: document.documentElement.classList.contains("kaynak-yok"),
      kaynakOp: getComputedStyle(document.getElementById("merkezGorsel")).opacity,
      hedefOp: getComputedStyle(document.getElementById("koleksiyonGorsel")).opacity,
      klon: kr ? { x: +kr.x.toFixed(1), y: +kr.y.toFixed(1), w: +kr.width.toFixed(1), h: +kr.height.toFixed(1) } : null,
      klonGorunur: klon ? getComputedStyle(klon).display !== "none" : false,
      h1Kesisim: kes(kr, h1),
      btnKesisim: kes(kr, btn),
      baslikKesisim: kes(kr, bas),
      h1Duzey: getComputedStyle(document.querySelector("h1")).zIndex + "/" + getComputedStyle(document.querySelector(".sergiAlt")).zIndex,
      h1Gorunur: getComputedStyle(document.querySelector("h1")).visibility + ":" + getComputedStyle(document.querySelector("h1")).opacity
    };
  };
}

async function gecisSerisi(p, onEk, noktalar) {
  const cikti = {};
  for (const [ad, y] of noktalar) {
    await p.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y);
    await p.waitForTimeout(260);
    cikti[ad] = await p.evaluate(gecisFonksiyonu());
    await cek(p, `${onEk}-${ad}.jpg`);
  }
  await p.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await p.waitForTimeout(200);
  return cikti;
}

/* ================= 390x844 ================= */
const b390 = await tarayici.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
const p390 = await b390.newPage();
p390.on("console", (m) => { if (m.type() === "error") rapor.konsol.push("390 konsol: " + m.text()); });
p390.on("pageerror", (e) => rapor.konsol.push("390 pageerror: " + e.message));
p390.on("requestfailed", (r) => rapor.konsol.push("390 istek: " + r.url()));
await p390.goto(adres, { waitUntil: "load" });
await bekle(p390);
await gezdir(p390);
rapor.olcum["390"] = await p390.evaluate(olcumFonksiyonu());
await cek(p390, "390-ilk.jpg");
rapor.gecis["390"] = await gecisSerisi(p390, "390-g", [["g0", 0], ["g25", 60], ["g50", 120], ["g75", 180], ["g100", 240]]);
await cek(p390, "390-tam.jpg", true);

// menü
await p390.evaluate(() => window.scrollTo({ top: 300, behavior: "instant" }));
await p390.waitForTimeout(200);
const oncekiKaydirma = await p390.evaluate(() => Math.round(window.scrollY));
await p390.click("#menuDugme");
await p390.waitForTimeout(200);
const menuAcik = await p390.evaluate(() => ({ gizli: document.getElementById("mobilMenu").hidden, odak: document.activeElement.textContent.trim(), genislik: Math.round(document.getElementById("mobilMenu").getBoundingClientRect().width) }));
await cek(p390, "390-menu.jpg");
await p390.keyboard.press("Escape");
await p390.waitForTimeout(250);
const menuKapali = await p390.evaluate(() => ({ gizli: document.getElementById("mobilMenu").hidden, odak: document.activeElement.id, kaydirma: Math.round(window.scrollY) }));
rapor.mobil.menu = { oncekiKaydirma, menuAcik, menuKapali };

// anchor + sticky header
await p390.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await p390.waitForTimeout(150);
await p390.click("#gitKoleksiyon");
await p390.waitForTimeout(1200);
rapor.mobil.anchor = await p390.evaluate(() => {
  const b = document.getElementById("koleksiyonBaslik").getBoundingClientRect();
  const u = document.querySelector(".ust").getBoundingClientRect();
  return { hash: location.hash, baslikUst: Math.round(b.top), ustAlt: Math.round(u.bottom), gizliKaldi: b.top < u.bottom };
});

// diyalog (rozet)
await p390.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await p390.waitForTimeout(200);
await p390.click(".rozet");
await p390.waitForTimeout(250);
rapor.mobil.diyalogRozet = await p390.evaluate(() => ({
  open: document.getElementById("urunDiyalog").open,
  ad: document.getElementById("dUrunAd").textContent,
  odak: document.activeElement.id
}));
await cek(p390, "390-diyalog.jpg");
await p390.keyboard.press("Escape");
await p390.waitForTimeout(250);
rapor.mobil.diyalogKapali = await p390.evaluate(() => ({
  open: document.getElementById("urunDiyalog").open,
  odak: document.activeElement.className + ":" + (document.activeElement.textContent || "").trim().slice(0, 22)
}));

// deri alanı
await p390.evaluate(() => document.getElementById("malzeme").scrollIntoView({ block: "start", behavior: "instant" }));
await p390.waitForTimeout(300);
const deriKapali = await p390.evaluate(() => ({ open: document.getElementById("deriDetay").open, yukseklik: Math.round(document.getElementById("deriDetay").getBoundingClientRect().height), dokunma: Math.round(document.querySelector(".deriDetay summary").getBoundingClientRect().height) }));
await p390.click(".deriDetay summary");
await p390.waitForTimeout(250);
const deriAcik = await p390.evaluate(() => ({
  open: document.getElementById("deriDetay").open,
  odak: document.activeElement.tagName + ":" + (document.activeElement.textContent || "").trim().slice(0, 20),
  secenekler: [...document.querySelectorAll(".deriListe li")].map((li) => li.textContent.trim()),
  gorselY: Math.round(document.querySelector(".malzemeGorsel").getBoundingClientRect().top)
}));
await cek(p390, "390-deri.jpg");
rapor.mobil.deri = { deriKapali, deriAcik };
await b390.close();

/* ================= 360x800 ================= */
const b360 = await tarayici.newContext({ viewport: { width: 360, height: 800 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
const p360 = await b360.newPage();
await p360.goto(adres, { waitUntil: "load" });
await bekle(p360);
await gezdir(p360);
rapor.olcum["360"] = await p360.evaluate(olcumFonksiyonu());
await cek(p360, "360-ilk.jpg");
await cek(p360, "360-tam.jpg", true);
await b360.close();

/* ================= 320x568 ================= */
const b320 = await tarayici.newContext({ viewport: { width: 320, height: 568 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
const p320 = await b320.newPage();
await p320.goto(adres, { waitUntil: "load" });
await bekle(p320);
await gezdir(p320);
rapor.olcum["320"] = await p320.evaluate(olcumFonksiyonu());
await cek(p320, "320-ilk.jpg");
await b320.close();

/* ================= 768 ================= */
const b768 = await tarayici.newContext({ viewport: { width: 768, height: 1024 }, deviceScaleFactor: 1 });
const p768 = await b768.newPage();
await p768.goto(adres, { waitUntil: "load" });
await bekle(p768);
await gezdir(p768);
rapor.olcum["768"] = await p768.evaluate(olcumFonksiyonu());
await cek(p768, "768-ilk.jpg");
await cek(p768, "768-tam.jpg", true);
await b768.close();

/* ================= 1440x900 ================= */
const b1440 = await tarayici.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const p1440 = await b1440.newPage();
p1440.on("console", (m) => { if (m.type() === "error") rapor.konsol.push("1440 konsol: " + m.text()); });
p1440.on("pageerror", (e) => rapor.konsol.push("1440 pageerror: " + e.message));
await p1440.goto(adres, { waitUntil: "load" });
await bekle(p1440);
await gezdir(p1440);
rapor.olcum["1440"] = await p1440.evaluate(olcumFonksiyonu());
rapor.masaustu.hizalama = await p1440.evaluate(() => ({
  heroMerkez: Math.round(document.getElementById("merkezGorsel").getBoundingClientRect().left + document.getElementById("merkezGorsel").getBoundingClientRect().width / 2),
  hedefMerkez: Math.round(document.getElementById("koleksiyonGorsel").getBoundingClientRect().left + document.getElementById("koleksiyonGorsel").getBoundingClientRect().width / 2),
  heroW: Math.round(document.getElementById("merkezGorsel").getBoundingClientRect().width),
  hedefW: Math.round(document.getElementById("koleksiyonGorsel").getBoundingClientRect().width)
}));
await cek(p1440, "1440-ilk.jpg");
rapor.gecis["1440"] = await gecisSerisi(p1440, "1440-g", [["g0", 0], ["g50", 210], ["g100", 420]]);
await cek(p1440, "1440-tam.jpg", true);
await p1440.evaluate(() => document.getElementById("koleksiyon").scrollIntoView({ block: "start", behavior: "instant" }));
await p1440.waitForTimeout(300);
await cek(p1440, "1440-koleksiyon.jpg");
await p1440.evaluate(() => document.querySelector(".atolye").scrollIntoView({ block: "center", behavior: "instant" }));
await p1440.waitForTimeout(300);
await cek(p1440, "1440-atolye.jpg");

// rozet: her zaman görünür, odaklanabilir, 44px
await p1440.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await p1440.waitForTimeout(200);
rapor.masaustu.rozet = await p1440.evaluate(() => {
  const r = document.querySelector(".rozet");
  const c = getComputedStyle(r);
  const k = r.getBoundingClientRect();
  return { opaklik: c.opacity, yukseklik: Math.round(k.height), genislik: Math.round(k.width), odaklanabilir: r.tabIndex >= 0, tabStop: !r.disabled };
});
await cek(p1440, "1440-rozet.jpg");
await b1440.close();

/* ================= 1280x720 ================= */
const b1280 = await tarayici.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
const p1280 = await b1280.newPage();
await p1280.goto(adres, { waitUntil: "load" });
await bekle(p1280);
await gezdir(p1280);
rapor.olcum["1280"] = await p1280.evaluate(olcumFonksiyonu());
await cek(p1280, "1280-ilk.jpg");
await b1280.close();

/* ================= reduced motion ================= */
const br = await tarayici.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
const pr = await br.newPage();
await pr.goto(adres, { waitUntil: "load" });
await bekle(pr);
await pr.evaluate(() => window.scrollTo({ top: 240, behavior: "instant" }));
await pr.waitForTimeout(250);
rapor.diger.azHareket = await pr.evaluate(() => ({
  ucus: document.documentElement.classList.contains("ucus"),
  klon: !!document.querySelector(".ucan"),
  kaynakOp: getComputedStyle(document.getElementById("merkezGorsel")).opacity,
  hedefOp: getComputedStyle(document.getElementById("koleksiyonGorsel")).opacity,
  h1: getComputedStyle(document.querySelector("h1")).visibility
}));
await cek(pr, "390-azhareket.jpg");
await br.close();

/* ================= JS kapalı ================= */
const bj = await tarayici.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
const pj = await bj.newPage();
await pj.goto(adres, { waitUntil: "load" });
await pj.waitForTimeout(600);
try {
  rapor.diger.jsKapali = await pj.evaluate(() => {
    const imgs = [...document.images].filter((i) => i.getBoundingClientRect().width > 0);
    return {
      metinVar: document.body.innerText.length > 400,
      gorunenGorsel: imgs.length,
      yuklenmeyen: imgs.filter((i) => !i.complete || i.naturalWidth === 0).length,
      kaynakOp: getComputedStyle(document.getElementById("merkezGorsel")).opacity,
      hedefOp: getComputedStyle(document.getElementById("koleksiyonGorsel")).opacity,
      klon: !!document.querySelector(".ucan"),
      boy: document.documentElement.scrollHeight
    };
  });
} catch (e) {
  rapor.diger.jsKapali = { olculemedi: String(e).slice(0, 90) };
}
await pj.screenshot({ path: path.join(qa, "390-jsyok.jpg"), type: "jpeg", quality: 80, fullPage: true });
await bj.close();

await tarayici.close();
fs.writeFileSync(path.join(qa, "olcum.json"), JSON.stringify(rapor, null, 2), "utf8");
console.log(JSON.stringify(rapor, null, 1));
