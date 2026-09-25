/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   Kısa, tek fikir, 5. sınıf dili. start/end saniye cinsinden.
   note: öğretmen için önerilen seslendirme cümlesi.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 3.4, end: 7.6, tr: 'Doğrularla bir şekil kuralım', en: 'Let’s build a shape with lines',
      note: 'Nokta bir doğru çiziyor. Birkaç doğruyla bir şekil kurmayı deneyeceğiz.' },
    { scene: 2, start: 11.6, end: 15.8, tr: 'Son doğru ilk doğruyu kesmedi: şekil açık', en: 'The last line missed the first: the shape is open',
      note: 'İkinci doğru birinciyi, üçüncü doğru ikinciyi kesti. Ama üçüncü doğru birinciyi kesmedi. Şekil kapanmadı, açık kaldı.' },
    { scene: 2, start: 18.4, end: 23.6, tr: 'Son doğru ilk doğruyu kesti: kapalı şekil, üçgen', en: 'The last line meets the first: a closed shape, a triangle',
      note: 'Üçüncü doğruyu çevirdik; artık birinci doğruyu da kesiyor. Doğrular art arda kesişti, son doğru ilk doğruyla buluştu: kapalı bir şekil oluştu. Bu bir üçgen.' },
    { scene: 3, start: 24.6, end: 28.6, tr: 'Kenarları sayalım: 3 kenar', en: 'Count the sides: 3 sides',
      note: 'Şekli çevreleyen doğru parçaları çokgenin kenarlarıdır. Üçgenin 3 kenarı var.' },
    { scene: 3, start: 29.0, end: 32.8, tr: 'Köşeleri: 3 köşe (A, B, C)', en: 'The corners: 3 vertices (A, B, C)',
      note: 'İki kenarın buluştuğu noktalar köşelerdir. Köşeleri büyük harflerle adlandırırız: A, B, C.' },
    { scene: 3, start: 33.2, end: 36.6, tr: 'İç açıları: 3 iç açı', en: 'The inside angles: 3 angles',
      note: 'Her köşede, iki kenarın arasında, şeklin içinde kalan bir açı var. Bunlar iç açılardır.' },
    { scene: 4, start: 41.6, end: 46.4, tr: 'Bir doğru daha: 4 kenar, dörtgen', en: 'One more line: 4 sides, a quadrilateral',
      note: 'Bir doğru daha ekleyelim. Yeni doğru bir köşeyi kesip attı; bir kenar daha oluştu. 4 kenarlı çokgen dörtgendir.' },
    { scene: 4, start: 46.6, end: 51.4, tr: 'Bir doğru daha: 5 kenar, beşgen', en: 'One more line: 5 sides, a pentagon',
      note: 'Beşinci doğru ile 5 kenarlı bir çokgen oluştu: beşgen.' },
    { scene: 4, start: 51.6, end: 57.6, tr: 'Bir doğru daha: 6 kenar, altıgen', en: 'One more line: 6 sides, a hexagon',
      note: 'Altıncı doğru ile 6 kenarlı bir çokgen oluştu: altıgen. Kaç doğru kullandıysak o kadar kenar oluştu.' },
    { scene: 5, start: 59.6, end: 65.4, tr: 'Adını kenar sayısı verir', en: 'The number of sides gives the name',
      note: 'Çokgenlere kenar sayılarına göre ad veririz: üçgen, dörtgen, beşgen, altıgen.' },
    { scene: 5, start: 66.0, end: 73.4, tr: 'Kenar, köşe ve iç açı sayısı hep aynı', en: 'Sides, corners and inside angles: always the same number',
      note: 'Bir çokgende kenar sayısı, köşe sayısı ve iç açı sayısı birbirine eşittir.' },
    { scene: 6, start: 74.6, end: 78.8, tr: 'Kapalı değil: çokgen değil', en: 'Not closed: not a polygon',
      note: 'Bu şeklin uçları birleşmiyor, şekil kapalı değil. O yüzden çokgen değil.' },
    { scene: 6, start: 79.2, end: 83.6, tr: 'Kenarı eğri: çokgen değil', en: 'A curved side: not a polygon',
      note: 'Bu şekil kapalı ama bir kenarı eğri. Çokgenin bütün kenarları doğru parçasıdır, bu yüzden bu şekil de çokgen değil.' },
    { scene: 7, start: 84.6, end: 90.6, tr: 'Çokgen: art arda kesişen doğruların kapattığı şekil', en: 'A polygon: a shape closed off by lines that cross one after another',
      note: 'Unutma: en az üç doğru art arda kesişir ve son doğru ilk doğruyu keserse kapalı bir şekil oluşur. Bu şekle çokgen denir.' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
