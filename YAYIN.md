# Amaurot — müşteri seçim paketi

Bu klasör tek başına yayınlanabilir: kökteki `index.html` açılış sayfasıdır.

## Yayın adresi

GitHub Pages: https://acar32furkan-glitch.github.io/amaurot-yon-secim/
(depo: https://github.com/acar32furkan-glitch/amaurot-yon-secim — herkese açık)

## Yayınlama (yeniden gerekirse)

1. **GitHub Pages**: bu klasörü `main` dalına gönderin; Settings → Pages → branch `main`, klasör `/root`.
   Kökteki `.nojekyll` dosyası silinmemelidir; yoksa `_design_review` klasörü yayınlanmaz.
2. **Netlify Drop** (alternatif): https://app.netlify.com/drop adresine klasörü sürükleyin.
3. Kendi sunucunuz: klasörü statik kök olarak yayınlayın.

`file://` ile yerelde açarken Gemini taslağındaki kontak sayfası kırpması çalışmaz
(tarayıcı canvas güvenliği); o sayfa için yerel sunucu gerekir:

```
python -m http.server 4600
```

## Sınırlar

- Sayfalar tasarım önizlemesidir; sepet, ödeme ve gerçek sipariş yoktur.
- Gemini taslağı CDN'den (Tailwind + Google Fonts) yüklenir; internet gerekir.
- Gemini taslağındaki fiyatlar ve `20 yıl ömrü` ifadesi müşteriye gösterilmeden önce
  doğrulanmalıdır; bu iddialar proje kararlarında `onaylanmadı` olarak duruyor.
- Fotoğraflar arşiv önizlemeleridir; yayın onayı değildir.
