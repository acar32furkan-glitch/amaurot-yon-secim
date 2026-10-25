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
    menuEtiket.textContent = "Menü";
    if (odakVer) menuDugme.focus();
  }

  function menuAc() {
    mobilMenu.hidden = false;
    menuDugme.setAttribute("aria-expanded", "true");
    menuEtiket.textContent = "Kapat";
    var ilk = mobilMenu.querySelector("a");
    if (ilk) ilk.focus();
  }

  if (menuDugme && mobilMenu) {
    menuDugme.addEventListener("click", function () {
      if (mobilMenu.hidden) menuAc(); else menuKapat(true);
    });
    Array.prototype.forEach.call(mobilMenu.querySelectorAll("a"), function (baglanti) {
      baglanti.addEventListener("click", function () { menuKapat(false); });
    });
    document.addEventListener("keydown", function (olay) {
      if (olay.key === "Escape" && !mobilMenu.hidden) {
        olay.preventDefault();
        menuKapat(true);
      }
    });
    document.addEventListener("click", function (olay) {
      if (mobilMenu.hidden) return;
      if (mobilMenu.contains(olay.target) || menuDugme.contains(olay.target)) return;
      menuKapat(false);
    });
    var genis = window.matchMedia("(min-width: 901px)");
    if (genis.addEventListener) {
      genis.addEventListener("change", function (olay) { if (olay.matches) menuKapat(false); });
    }
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
    dugme.addEventListener("click", function () {
      urunAc(dugme.getAttribute("data-urun"), dugme);
    });
  });

  if (diyalog && dKapat) {
    dKapat.addEventListener("click", function () { diyalog.close(); });
    diyalog.addEventListener("close", function () {
      if (diyalogTetik) diyalogTetik.focus();
    });
    diyalog.addEventListener("click", function (olay) {
      if (olay.target === diyalog) diyalog.close();
    });
  }

  /* ---------- açılış hareketi ----------
     MASAÜSTÜ: çanta hero'daki yerinden koleksiyondaki SOL büyük karta
     taşınır; tanım ve bölüm başlığı sağ sütunda olduğu için hareket yolu
     metinsizdir (metinleri z-index ile resmin önüne boyama yok).
     MOBİL: fiziksel taşıma YOK. Kısa, kendi çerçevesinde kalan kadraj
     ölçeği (en fazla 1.035) + koleksiyonun ilk kartında 12 px'lik yerel
     beliriş. JS kapalı / reduced-motion: her şey doğrudan görünür. */
  var html = document.documentElement;
  var genisEkran = window.matchMedia("(min-width: 901px)");
  var hareketVar = window.matchMedia("(prefers-reduced-motion: no-preference)");
  var sergi = document.getElementById("sergi");
  var kaynak = document.getElementById("merkezGorsel");
  var hedef = document.getElementById("koleksiyonGorsel");
  var ucan = null;
  var bas = null;
  var hedefKutu = null;
  var kaynakAlt = 0;
  var hazir = false;
  var bekliyor = false;

  function siniflar() {
    if (hareketVar.matches) html.classList.add("js-hareket");
    else html.classList.remove("js-hareket");
  }
  siniflar();
  if (hareketVar.addEventListener) {
    hareketVar.addEventListener("change", function () { siniflar(); olc(); uygula(); });
  }

  /* koleksiyonun ilk kartı: yerinde, kısa beliriş (mobil) */
  var ilkKart = document.querySelector("[data-ilk]");
  if (ilkKart) {
    if ("IntersectionObserver" in window && hareketVar.matches) {
      var gozcu = new IntersectionObserver(function (girisler) {
        girisler.forEach(function (giris) {
          if (!giris.isIntersecting) return;
          giris.target.classList.add("gorundu");
          gozcu.unobserve(giris.target);
        });
      }, { threshold: 0.12 });
      gozcu.observe(ilkKart);
    } else {
      ilkKart.classList.add("gorundu");
    }
  }

  function kis(sayi, alt, ust) { return Math.max(alt, Math.min(ust, sayi)); }
  function yumusak(p) { return p * p * (3 - 2 * p); }
  function karis(a, b, t) { return a + (b - a) * t; }

  function pencere() {
    if (window.innerWidth <= 900) return Math.min(240, window.innerHeight * 0.34);
    return Math.min(420, window.innerHeight * 0.5);
  }

  function klonOlustur() {
    if (ucan || !kaynak) return;
    ucan = document.createElement("img");
    ucan.className = "ucan";
    ucan.alt = "";
    ucan.setAttribute("aria-hidden", "true");
    ucan.src = kaynak.currentSrc || kaynak.getAttribute("src");
    ucan.width = 1200;
    ucan.height = 900;
    document.body.appendChild(ucan);
  }

  function olc() {
    if (!kaynak || !hedef || !genisEkran.matches) { hazir = false; return; }
    var a = kaynak.getBoundingClientRect();
    var b = hedef.getBoundingClientRect();
    bas = { x: a.left, y: a.top + window.scrollY, w: a.width, h: a.height };
    hedefKutu = { x: b.left, y: b.top + window.scrollY, w: b.width, h: b.height };
    kaynakAlt = bas.y + bas.h;
    hazir = bas.w > 0 && bas.h > 0 && hedefKutu.w > 0 && hedefKutu.h > 0;
  }

  function temizle() {
    html.classList.remove("ucus", "kaynak-yok");
    hazir = false;
  }

  function uygula() {
    if (!hareketVar.matches) {
      temizle();
      if (sergi) sergi.style.removeProperty("--mp");
      return;
    }
    if (!genisEkran.matches) {
      /* mobil: taşıma yok, yalnız kısa kadraj ölçeği */
      temizle();
      if (sergi) sergi.style.setProperty("--mp", Math.min(1, window.scrollY / 200).toFixed(3));
      return;
    }
    if (sergi) sergi.style.removeProperty("--mp");
    if (!kaynak || !hedef) { temizle(); return; }
    if (!hazir) olc();
    if (!hazir) return;
    klonOlustur();

    var y = window.scrollY;
    var p = kis(y / pencere(), 0, 1);
    var ucuyor = p > 0.002 && p < 0.995;

    html.classList.toggle("ucus", ucuyor);
    html.classList.toggle("kaynak-yok", y > 2 && y < kaynakAlt - 1);

    if (ucuyor) {
      var e = yumusak(p);
      ucan.style.left = karis(bas.x, hedefKutu.x, e).toFixed(1) + "px";
      ucan.style.top = (karis(bas.y, hedefKutu.y, e) - y).toFixed(1) + "px";
      ucan.style.width = karis(bas.w, hedefKutu.w, e).toFixed(1) + "px";
      ucan.style.height = karis(bas.h, hedefKutu.h, e).toFixed(1) + "px";
    }
  }

  function istek() {
    if (bekliyor) return;
    bekliyor = true;
    window.requestAnimationFrame(function () {
      bekliyor = false;
      uygula();
    });
  }

  if (kaynak && hedef) {
    window.addEventListener("scroll", istek, { passive: true });
    window.addEventListener("resize", function () { olc(); istek(); });
    window.addEventListener("orientationchange", function () { setTimeout(function () { olc(); istek(); }, 120); });
    window.addEventListener("load", function () { olc(); istek(); });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { olc(); istek(); });
    }
    if (genisEkran.addEventListener) {
      genisEkran.addEventListener("change", function () { olc(); istek(); });
    }
    olc();
    uygula();
  }
})();
