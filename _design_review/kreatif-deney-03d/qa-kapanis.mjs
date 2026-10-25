import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.MASTER01_PW_MODULE ?? "playwright-core");
const CHROME = process.env.MASTER01_CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

const kok = path.resolve("_design_review", "kreatif-deney-03d");
const qa = path.join(kok, "qa");
const adres = pathToFileURL(path.join(kok, "index.html")).href;
const rapor = { tarih: new Date().toISOString(), mobil: {}, masaustu: {}, diger: {}, konsol: [] };

const tarayici = await chromium.launch({ executablePath: CHROME, headless: true });

async function cek(p, ad, tam) {
  await p.screenshot({ path: path.join(qa, ad), type: "jpeg", quality: 80, fullPage: Boolean(tam) });
}
async function bekle(p) {
  await p.evaluate(async () => { if (document.fonts && document.fonts.ready) await document.fonts.ready; });
  await p.waitForTimeout(400);
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

function durumFonksiyonu() {
  return () => {
    const img = document.getElementById("merkezGorsel");
    const kart = document.querySelector("[data-ilk]");
    const cs = getComputedStyle(img);
    const kcs = kart ? getComputedStyle(kart) : null;
    const r = img.getBoundingClientRect();
    return {
      scrollY: Math.round(scrollY),
      gorselTransform: cs.transform,
      gorselKutu: { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) },
      cerceveTasma: (() => {
        const c = document.querySelector(".p0106 .cerceve");
        if (!c) return null;
        const cr = c.getBoundingClientRect();
        return { cerceve: { x: +cr.x.toFixed(1), y: +cr.y.toFixed(1), w: +cr.width.toFixed(1), h: +cr.height.toFixed(1) }, tasma: !!(r.left < cr.left - 0.5 || r.right > cr.right + 0.5) };
      })(),
      kartOpaklik: kcs ? kcs.opacity : null,
      kartTransform: kcs ? kcs.transform : null,
      kartSinif: kart ? kart.className : null,
      ucanVar: !!document.querySelector(".ucan") && getComputedStyle(document.querySelector(".ucan")).display !== "none",
      yatayTasma: document.documentElement.scrollWidth - innerWidth
    };
  };
}

/* ---------- 390x844 ---------- */
const b390 = await tarayici.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const p390 = await b390.newPage();
p390.on("console", (m) => { if (m.type() === "error") rapor.konsol.push("390: " + m.text()); });
p390.on("pageerror", (e) => rapor.konsol.push("390 pageerror: " + e.message));
await p390.goto(adres, { waitUntil: "load" });
await bekle(p390);
rapor.mobil["390"] = {};
for (const [ad, y] of [["bas", 0], ["orta", 100], ["son", 200]]) {
  await p390.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y);
  await p390.waitForTimeout(300);
  rapor.mobil["390"][ad] = await p390.evaluate(durumFonksiyonu());
  await cek(p390, `kapanis-390-${ad}.jpg`);
}
await p390.evaluate(() => document.getElementById("koleksiyon").scrollIntoView({ block: "start", behavior: "instant" }));
await p390.waitForTimeout(700);
rapor.mobil.kartBeliris = await p390.evaluate(() => {
  const k = document.querySelector("[data-ilk]");
  const c = getComputedStyle(k);
  return { sinif: k.className, opaklik: c.opacity, transform: c.transform };
});
await cek(p390, "kapanis-390-kart.jpg");
await gezdir(p390);
await cek(p390, "390-tam.jpg", true);
await b390.close();

/* ---------- 360x800 ---------- */
const b360 = await tarayici.newContext({ viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true });
const p360 = await b360.newPage();
await p360.goto(adres, { waitUntil: "load" });
await bekle(p360);
rapor.mobil["360"] = {};
for (const [ad, y] of [["bas", 0], ["orta", 100], ["son", 200]]) {
  await p360.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y);
  await p360.waitForTimeout(300);
  rapor.mobil["360"][ad] = await p360.evaluate(durumFonksiyonu());
  await cek(p360, `kapanis-360-${ad}.jpg`);
}
await b360.close();

/* ---------- 1440x900 ---------- */
const b1440 = await tarayici.newContext({ viewport: { width: 1440, height: 900 } });
const p1440 = await b1440.newPage();
p1440.on("console", (m) => { if (m.type() === "error") rapor.konsol.push("1440: " + m.text()); });
p1440.on("pageerror", (e) => rapor.konsol.push("1440 pageerror: " + e.message));
await p1440.goto(adres, { waitUntil: "load" });
await bekle(p1440);
rapor.masaustu.hizalama = await p1440.evaluate(() => {
  const a = document.getElementById("merkezGorsel").getBoundingClientRect();
  const b = document.getElementById("koleksiyonGorsel").getBoundingClientRect();
  return { hero: { x: +a.x.toFixed(1), w: +a.width.toFixed(1) }, hedef: { x: +b.x.toFixed(1), w: +b.width.toFixed(1) } };
});
rapor.masaustu.gecis = {};
for (const [ad, y] of [["bas", 0], ["orta", 210], ["son", 420]]) {
  await p1440.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y);
  await p1440.waitForTimeout(320);
  rapor.masaustu.gecis[ad] = await p1440.evaluate(() => {
    const k = document.querySelector(".ucan");
    const kr = k ? k.getBoundingClientRect() : null;
    const kes = (a, b) => a && b ? !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom) : null;
    const h1 = document.querySelector("h1").getBoundingClientRect();
    const btn = document.querySelector(".btn").getBoundingClientRect();
    const bas = document.getElementById("koleksiyonBaslik").getBoundingClientRect();
    return {
      ucus: document.documentElement.classList.contains("ucus"),
      klon: kr ? { x: +kr.x.toFixed(1), y: +kr.y.toFixed(1), w: +kr.width.toFixed(1), h: +kr.height.toFixed(1) } : null,
      h1Kesisim: kes(kr, h1), btnKesisim: kes(kr, btn), baslikKesisim: kes(kr, bas),
      kaynakOp: getComputedStyle(document.getElementById("merkezGorsel")).opacity,
      hedefOp: getComputedStyle(document.getElementById("koleksiyonGorsel")).opacity
    };
  });
  await cek(p1440, `kapanis-1440-${ad}.jpg`);
}
await gezdir(p1440);
await cek(p1440, "1440-tam.jpg", true);

/* klavye: bölüm başlığından itibaren üç ürün düğmesi soldan sağa */
rapor.masaustu.klavye = await p1440.evaluate(async () => {
  const h = document.getElementById("koleksiyonBaslik");
  h.focus();
  return { baslangic: document.activeElement.id };
});
const sira = [];
for (let i = 0; i < 3; i++) {
  await p1440.keyboard.press("Tab");
  await p1440.waitForTimeout(80);
  sira.push(await p1440.evaluate(() => {
    const a = document.activeElement;
    const r = a.getBoundingClientRect();
    const kart = a.closest("article");
    return { urun: kart ? kart.querySelector("h3").textContent.trim() : a.textContent.trim().slice(0, 18), x: Math.round(r.x), y: Math.round(r.y + scrollY) };
  }));
}
rapor.masaustu.klavye.sira = sira;
await p1440.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await b1440.close();

/* ---------- reduced motion (390) ---------- */
const br = await tarayici.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce", isMobile: true, hasTouch: true });
const pr = await br.newPage();
await pr.goto(adres, { waitUntil: "load" });
await bekle(pr);
await pr.evaluate(() => window.scrollTo({ top: 200, behavior: "instant" }));
await pr.waitForTimeout(300);
rapor.diger.azHareket = await pr.evaluate(() => {
  const img = document.getElementById("merkezGorsel");
  const kart = document.querySelector("[data-ilk]");
  return {
    transform: getComputedStyle(img).transform,
    jsHareket: document.documentElement.classList.contains("js-hareket"),
    kartOpaklik: getComputedStyle(kart).opacity,
    kartTransform: getComputedStyle(kart).transform
  };
});
await cek(pr, "kapanis-390-azhareket.jpg");
await br.close();

await tarayici.close();
fs.writeFileSync(path.join(qa, "kapanis.json"), JSON.stringify(rapor, null, 2), "utf8");
console.log(JSON.stringify(rapor, null, 1));
