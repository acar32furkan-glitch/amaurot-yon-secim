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
      gorsel: "../kreatif-deney-03d/gorseller/seamless-pack.jpg",
      alt: "Seamless Pack postacı çantası, deri zemin üzerinde",
      aciklama: "Dikiş kullanılmadan üretilen tek gözlü postacı çantası. Bilgisayar, evrak ve günlük taşınanlar için tek bölmeli bir iç hacim sunar."
    },
    butterfly: {
      ad: "Butterfly Flip",
      tur: "Klipsli Cüzdan",
      gorsel: "../kreatif-deney-03d/gorseller/butterfly-flip.jpg",
      alt: "Butterfly Flip klipsli cüzdan, deri zemin üzerinde",
      aciklama: "Altı açık ve iki gizli kart bölmesi, ortada metal para klipsi. Kartlık ve cüzdan işlevini tek parçada birleştiren kompakt bir form."
    },
    basic: {
      ad: "Basic Card Wallet",
      tur: "Katlanır Kartlık",
      gorsel: "../kreatif-deney-03d/gorseller/basic-card-wallet.jpg",
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

  // Only a bounded movement inside the original photo frame; no duplicate image.
  const scene = document.querySelector('.sergi');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let pending = false;
  function paint() {
    pending = false;
    const p = reduced.matches ? 0 : Math.max(0, Math.min(1, -scene.getBoundingClientRect().top / 320));
    scene.style.setProperty('--drift', String(p));
  }
  window.addEventListener('scroll', () => { if (!pending) {pending=true; requestAnimationFrame(paint);} }, {passive:true});
  window.addEventListener('resize', paint);
  reduced.addEventListener('change', paint);
  paint();
})();
