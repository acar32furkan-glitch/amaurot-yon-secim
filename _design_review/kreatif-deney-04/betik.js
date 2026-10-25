(function () {
  "use strict";

  /* ---------- mobil menü ---------- */
  var menuDugme = document.getElementById("menuDugme");
  var menuEtiket = document.getElementById("menuEtiket");
  var mobilMenu = document.getElementById("mobilMenu");

  function menuKapat(odakVer) {
    if (!mobilMenu || mobilMenu.hidden) return;
    mobilMenu.hidden = true;
    menuDugme.setAttribute("aria-expanded", "false");
    if (menuEtiket) menuEtiket.textContent = "Menü";
    if (odakVer) menuDugme.focus();
  }
  function menuAc() {
    mobilMenu.hidden = false;
    menuDugme.setAttribute("aria-expanded", "true");
    if (menuEtiket) menuEtiket.textContent = "Kapat";
    var ilk = mobilMenu.querySelector("a");
    if (ilk) ilk.focus();
  }
  if (menuDugme && mobilMenu) {
    menuDugme.addEventListener("click", function () {
      if (mobilMenu.hidden) menuAc(); else menuKapat(true);
    });
    Array.prototype.forEach.call(mobilMenu.querySelectorAll("a"), function (a) {
      a.addEventListener("click", function () { menuKapat(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !mobilMenu.hidden) { e.preventDefault(); menuKapat(true); }
    });
    document.addEventListener("click", function (e) {
      if (mobilMenu.hidden) return;
      if (mobilMenu.contains(e.target) || menuDugme.contains(e.target)) return;
      menuKapat(false);
    });
    var genis = window.matchMedia("(min-width: 901px)");
    if (genis.addEventListener) genis.addEventListener("change", function (e) { if (e.matches) menuKapat(false); });
  }

  /* ---------- ürün diyaloğu ---------- */
  var urunler = {
    seamless: {
      ad: "Seamless Pack",
      tur: "Postacı Çantası",
      gorsel: "gorseller/seamless-pack.jpg",
      alt: "Seamless Pack postacı çantası, deri zemin üzerinde",
      aciklama: "Dikiş kullanılmadan üretilen tek gözlü postacı çantası. Bilgisayar, evrak ve günlük taşınanlar için tek bölmeli bir iç hacim sunar."
    },
    butterfly: {
      ad: "Butterfly Flip",
      tur: "Klipsli Cüzdan",
      gorsel: "gorseller/butterfly-flip.jpg",
      alt: "Butterfly Flip klipsli cüzdan, deri zemin üzerinde",
      aciklama: "Altı açık ve iki gizli kart bölmesi, ortada metal para klipsi. Kartlık ve cüzdan işlevini tek parçada birleştiren kompakt bir form."
    },
    basic: {
      ad: "Basic Card Wallet",
      tur: "Katlanır Kartlık",
      gorsel: "gorseller/basic-card-wallet.jpg",
      alt: "Basic Card Wallet kapalı hâlde, deri zemin üzerinde",
      aciklama: "Dört bölmeli, sade kapanışlı avuç içi kartlık. Kartları ve küçük notları birlikte taşımak için tasarlandı."
    }
  };

  var diyalog = document.getElementById("urunDiyalog");
  var dGorsel = document.getElementById("dGorsel");
  var dUrunAd = document.getElementById("dUrunAd");
  var dTur = document.getElementById("dTur");
  var dAciklama = document.getElementById("dAciklama");
  var dKapat = document.getElementById("dKapat");
  var diyalogTetik = null;

  function urunAc(anahtar, dugme) {
    var urun = urunler[anahtar];
    if (!urun || !diyalog) return;
    diyalogTetik = dugme;
    dUrunAd.textContent = urun.ad;
    dTur.textContent = urun.tur;
    dAciklama.textContent = urun.aciklama;
    dGorsel.src = urun.gorsel;
    dGorsel.alt = urun.alt;
    if (typeof diyalog.showModal === "function") diyalog.showModal();
    else diyalog.setAttribute("open", "");
    dKapat.focus();
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-urun]"), function (dugme) {
    dugme.addEventListener("click", function () { urunAc(dugme.getAttribute("data-urun"), dugme); });
  });

  if (diyalog && dKapat) {
    dKapat.addEventListener("click", function () { diyalog.close(); });
    diyalog.addEventListener("close", function () { if (diyalogTetik) diyalogTetik.focus(); });
    diyalog.addEventListener("click", function (e) { if (e.target === diyalog) diyalog.close(); });
  }

  /* ---------- C: tek küçük görüntü reveal ---------- */
  var reveal = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (reveal.length) {
    var azHareket = window.matchMedia("(prefers-reduced-motion: reduce)");
    if ("IntersectionObserver" in window && !azHareket.matches) {
      var gozcu = new IntersectionObserver(function (girisler) {
        girisler.forEach(function (giris) {
          if (!giris.isIntersecting) return;
          giris.target.classList.add("gorundu");
          gozcu.unobserve(giris.target);
        });
      }, { threshold: 0.16 });
      reveal.forEach(function (el) { gozcu.observe(el); });
    } else {
      reveal.forEach(function (el) { el.classList.add("gorundu"); });
    }
  }

  /* ---------- B: malzemeden ürüne, yarım ekran geçiş ---------- */
  var html = document.documentElement;
  var bHero = document.getElementById("bHero");
  var bUrun = document.getElementById("bUrunGorsel");
  var bHedef = document.getElementById("bHedef");
  var bHedefGorsel = document.getElementById("bHedefGorsel");
  var mqB = window.matchMedia("(min-width: 1000px) and (prefers-reduced-motion: no-preference)");
  var bClone = null;
  var bBaslangic = null;
  var bHedefKutu = null;
  var bHazir = false;
  var bBekliyor = false;

  function bKis(sayi, alt, ust) { return Math.max(alt, Math.min(ust, sayi)); }
  function bYumusak(p) { return p * p * (3 - 2 * p); }
  function bKaris(a, b, t) { return a + (b - a) * t; }

  function bCloneOlustur() {
    if (bClone) return;
    bClone = document.createElement("img");
    bClone.className = "ucan";
    bClone.alt = "";
    bClone.setAttribute("aria-hidden", "true");
    bClone.src = "gorseller/seamless-pack.jpg";
    bClone.width = 1200;
    bClone.height = 900;
    document.body.appendChild(bClone);
  }

  function bOlc() {
    if (!mqB.matches || !bUrun || !bHedef) { bHazir = false; return; }
    var a = bUrun.getBoundingClientRect();
    var b = bHedef.getBoundingClientRect();
    bBaslangic = { x: a.left, y: a.top + window.scrollY, w: a.width, h: a.height };
    bHedefKutu = { x: b.left, y: b.top + window.scrollY, w: b.width, h: b.height };
    bHazir = bBaslangic.w > 0 && bHedefKutu.w > 0;
  }

  function bTemizle() {
    html.classList.remove("gecis-b");
    html.classList.remove("b-ucus");
    if (bClone) bClone.classList.remove("acik");
    if (bUrun) bUrun.classList.remove("gizli");
    if (bHedef) bHedef.classList.remove("tamam");
    if (bHero) bHero.style.removeProperty("--p");
    bHazir = false;
  }

  function bUygula() {
    if (!mqB.matches) { bTemizle(); return; }
    if (!bUrun || !bHedef || !bHedefGorsel) return;
    html.classList.add("gecis-b");
    if (!bHazir) bOlc();
    if (!bHazir) return;
    bCloneOlustur();

    var vh = window.innerHeight;
    var p = bKis(window.scrollY / (vh * 0.5), 0, 1);
    if (bHero) bHero.style.setProperty("--p", p.toFixed(4));

    var gorunur = p > 0.002 && p < 0.995;
    html.classList.toggle("b-ucus", gorunur);
    if (gorunur) {
      var e = bYumusak(p);
      bClone.style.left = bKaris(bBaslangic.x, bHedefKutu.x, e).toFixed(1) + "px";
      bClone.style.top = (bKaris(bBaslangic.y, bHedefKutu.y, e) - window.scrollY).toFixed(1) + "px";
      bClone.style.width = bKaris(bBaslangic.w, bHedefKutu.w, e).toFixed(1) + "px";
      bClone.style.height = bKaris(bBaslangic.h, bHedefKutu.h, e).toFixed(1) + "px";
      bClone.classList.add("acik");
      bUrun.classList.add("gizli");
    } else {
      if (bClone) bClone.classList.remove("acik");
      bUrun.classList.remove("gizli");
    }
    bHedef.classList.toggle("tamam", p >= 0.995);
  }

  function bIstek() {
    if (bBekliyor) return;
    bBekliyor = true;
    window.requestAnimationFrame(function () { bBekliyor = false; bUygula(); });
  }

  if (bUrun && bHedef && bHedefGorsel) {
    window.addEventListener("scroll", bIstek, { passive: true });
    window.addEventListener("resize", function () { bOlc(); bIstek(); });
    window.addEventListener("load", function () { bOlc(); bIstek(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { bOlc(); bIstek(); });
    if (mqB.addEventListener) mqB.addEventListener("change", function () { if (mqB.matches) { bOlc(); bIstek(); } else { bTemizle(); } });
    bOlc();
    bIstek();
  }
})();
