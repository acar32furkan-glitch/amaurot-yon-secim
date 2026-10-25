# 03E — kaynak seçimi ve inceleme
24 Ekim 2026. Ayrı HTML tasarım prototipi; canlı mağaza değildir. Uygulama/backend değiştirilmedi.

## İnceleme kapsamı
Bu çalışma sırasında kreatif-arsiv/temalar altındaki 29 temas panosu görsel olarak yeniden incelendi: belirsiz 11, ürün 11, marka-grafik 3, üretim/kullanım/deri/konsept 4. Manifestteki 470 kayıt, tekrarlar ve teknik materyaller içerir; 470 ayrı orijinal fotoğraf anlamına gelmez. Seçilen yeni kareler ayrıca büyük önizlemelerinde incelendi.
Kalan kaynaklar için kalan-kaynaklar/INCELEME.md ve mevcut önizlemeler dikkate alındı. Bu, bütün yerel dosyaların tam çözünürlük ve bütün katmanlarıyla açıldığı anlamına gelmez: iki INDD önizlemesi bozuk; IDML metin ve bağlantı düzeyinde; büyük TIFF tam çözülmedi; PSD/PSB kompozit önizlemeler üzerinden değerlendirildi.

## Kullanılan kaynaklar ve gerekçe
- Açılış: mevcut Seamless Pack fotoğrafı yalnız bir kez. Deri yüzeyleri yanında IMG-0306 (Story/_DSC0040-2.jpg) göl; sıcak deri ile daha serin ve açık atmosfer dengesi.
- Koleksiyon: mevcut Butterfly Flip ve Basic Card Wallet görselleri. Çanta koleksiyonda tekrar edilmedi.
- Malzeme: mevcut deri doku yakın planı; renk numunesi olarak sunulmaz.
- Hikâye: IMG-0274 (Story/_DSC0005.jpg) yol, mevcut iki ağaçlı arazi fotoğrafı, K005 deniz kıyısı. Yol / Arazi / Ufuk başlıkları editoryal; yer adı veya çekim hikâyesi uydurulmadı.
- Üretim: IMG-0206 (Story/_DSC0026.jpg), gerçek elde dikim görüntüsü. Karedeki ürün modeli kesin olmadığı için satış kartına veya belirli modele bağlanmadı. Tüm modellerin dikişli olduğu iddia edilmiyor.
- Hikâye metni: mevcut marka metni ve önceki atölye anlatısı korundu. Fiyat ve yeni tarihsel iddia eklenmedi.

## Dışarıda kalanlar
Reddedilen grafik denemeleri, motosiklet yönü ve eski logo alternatifleri geri getirilmedi. Kalıp PDF'leri ve başka üreticilerin teknik çizimleri marka görseli yapılmadı. Model eşlemesi belirsiz fotoğraflar satış görseli olarak kullanılmadı. IMG-0337 Wear Bag kullanım karesi incelendi; bu akışı uzatmamak için sonraki ürün/koleksiyon sayfasına aday olarak bırakıldı.

## Davranış ve kontrol
Çantanın sayfa boyunca taşınması ve kopyası kaldırıldı. Hareket yalnız ilk fotoğraf çerçevesinde küçük ölçek değişimi ve yan karelerde 10 px'i aşmayan hareket. Azaltılmış hareket tercihinde kapalı.
320, 390, 768, 1280 ve 1440 px genişliklerde Chromium kontrolü: yatay taşma yok, ana içerikte çanta fotoğrafı bir adet, tüm görseller yükleniyor, JS hatası yok, ürün diyaloğu açılıyor ve Escape sonrası odak dönüyor. Mobil menü ve koleksiyon bağlantısı denendi. 390 ve 1440 tam sayfa ekranları gözle incelendi. Sonuçlar qa/sonuc.json içinde.

## Yayına geçmeden önce
Yeni arşiv kareleri önizleme kopyalarıdır; nihai üretimde orijinal kaynaktan uygun çözünürlük/format türevleri hazırlanmalı. Fotoğraf yayın hakları ve iletişim adresi ayrıca doğrulanmalı. Bu prototip satış/ödeme entegrasyonu değildir. Tipografi LTC Metropolitan + Source Sans 3 olarak korunmuştur.
