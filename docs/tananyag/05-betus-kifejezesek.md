# Betűs kifejezések — teljes tananyag és alkalmazásbeli azonosítók

A Matek8 0.3.0 fejlesztési ciklusához tartozó, az alkalmazás adataival összehangolt kézirat. Témaazonosító: `betus-kifejezesek`. A fájl a teljes magyarázatot, példákat, feladatokat, segítségeket, megoldásokat és hibavisszajelzéseket tartalmazza.

A tanulói út: **Jósolj → Próbáld ki → Értsd meg → Nézd a példát → Gyakorolj → Önálló próba**. A becsült 50 perc tervezési támpont; az út több alkalomra osztható. Tanári és tanulói kipróbálás nélkül nem állítjuk, hogy minden tanulónál bizonyított megértést eredményez.

## 1. Cél, előismeret és hatókör

**Indító kérdés:** Miért helyettesíthet egy betű sok számot, és mikor vonhatunk össze két tagot?

A betű számot jelöl. Először konkrét értékeket helyettesítünk, majd megértjük, mely átalakítások működnek minden megengedett értéknél. Az előjelet a taggal együtt visszük tovább.

A betű jelentése, előjeles és törtes helyettesítés, egynemű tagok összevonása és egytényezős zárójelbontás alkotja az út törzsét. Az átalakítás értékőrzését konkrét helyettesítés és általános műveleti indok külön támasztja alá. Két betűs kifejezés szorzása és nevezetes azonosságok teljes rendszere nem tartozik ide.

**Tanulási célok**

- Megkülönbözteted a változót, az együtthatót, a tagot és az állandó tagot.
- Negatív számot és törtet is helyesen helyettesítesz a betű helyére.
- Csak az egynemű tagok együtthatóit adod össze.
- A teljes zárójelet szorzod meg; a zárójel előtti mínusz minden belső tagra hat.
- Behelyettesítéssel hibát keresel, és megkülönbözteted az ellenőrző példát az általános indoklástól.

**Előismeretek**

- Előjeles számok alapműveletei és műveleti sorrend.
- A szorzás és az összeadás különbsége; egyszerű törtek és tizedesek.

**Megnyitható előismereti témák:** `szamfogalom`, `muveleti-sorrend`, `tortek`.

**Továbblépés:** `egyenlet`.

## 2. Jósolj

### BK05-J01 — Jósló belépő

**Alkalmazásazonosító:** `betus-kifejezesek-prediction`.

Legyen a = 4. Ugyanazt jelenti-e a 3a + 2 és a 3(a + 2)? Számold ki mindkettőt, majd indokold az eltérést.

**Válaszmezők, helyes alakok és készségek**

| Mező     | Kérdés          | Helyes válasz / elfogadott kifejezésalakok | Készség                                   | Szükséges korábbi részek |
| -------- | --------------- | ------------------------------------------ | ----------------------------------------- | ------------------------ |
| `first`  | 3a + 2 értéke   | `14`                                       | `betu-helyettesites`                      | —                        |
| `second` | 3(a + 2) értéke | `18`                                       | `betu-helyettesites`, `zarojel-felbontas` | —                        |

**Két segítségi lépcső**

1. Írd a 4-et minden a helyére. Hol van a zárójel?
2. Az első kifejezés 3 × 4 + 2; a második 3 × (4 + 2).

**Részletes megoldás**

1. `3 × 4 + 2 = 14` — A szorzás csak a 4-re vonatkozik.

2. `3 × (4 + 2) = 3 × 6 = 18` — A teljes összeget szorozzuk hárommal.

**Megőrzendő gondolat:** A zárójel megmondja, mire vonatkozik a művelet.

**Saját indoklás:** Mondd el, hányszor szerepel a +2 a két kifejezésben.

**Önellenőrzési szempontok az indokláshoz**

- Az elsőben egyszer, a másodikban háromszor.
- A különbség nem a behelyettesítésből, hanem a kifejezés szerkezetéből ered.

**Célzott hibajavítás**

| Mező     | Jellemző hibás bevitel | Visszajelzés                                                              |
| -------- | ---------------------- | ------------------------------------------------------------------------- |
| `first`  | `18`                   | A +2 itt egyszer szerepel. Csak az a-t szorozzuk hárommal.                |
| `second` | `14`                   | A zárójel három teljes a + 2 csomagot jelent: a +2 is háromszor szerepel. |

## 3. Próbáld ki — az interaktív műhely matematikai menete

A műhely működő alkalmazásrésze az [interaktív forrásban](../../app/src/interactives/BridgeLabs.tsx), pontos számolási modellje a [műhelymodellben](../../app/src/math/bridge-models.ts) található. Az alábbi megfigyelések a lecke fogalmait kötik össze a kezelhető állapotokkal.

1. Válassz kifejezést: 3x + 2x − 4; 3x + 2y − 4; 2(x + 3) − x; −(x − 4) + 2x; x² + x. Mielőtt számot helyettesítesz, nevezd meg az azonos és különböző fajtájú tagokat.
2. A zárójeles példában válaszd ki az értéket megőrző felbontást. A külső szorzó vagy a mínusz minden belső tagot érint. A hibás előjelválasztás külön visszajelzést kap.
3. Jelöld ki az egynemű tagokat, majd add meg az új együtthatót. A 3x és 2y, illetve az x² és x nem vonható össze egyetlen egynemű taggá.
4. Állíts be x- és szükség esetén y-értéket, jósolj helyettesítési értéket, majd ellenőrizd. A műhely a megadott számokat pontos racionális aritmetikával számolja.
5. Hasonlítsd össze az eredeti és az összevont alakot. Mondd ki: egy eltérő érték ellenpélda, de néhány egyező érték önmagában nem általános bizonyítás. A jogos szabály adja az általános indokot.

A saját szavas magyarázatot a program nem osztályozza automatikusan. A tanuló a felsorolt szempontokhoz viszonyíthatja a saját gondolatát; az elmentés külön döntés. Az automatikusan ellenőrzött szám vagy kifejezés helyessége nem bizonyítja önmagában a magyarázat megértését.

## 4. Értsd meg — teljes magyarázat

### 4.1. A betű helye megmarad, az értéke változhat

A 4x − 3 kifejezésben az x egy szám helye. A 4x azt jelenti: 4 × x; nem a 4 és x számjegyeinek egymás mellé írását. Helyettesítéskor ugyanannak a betűnek minden előfordulása ugyanazt az értéket kapja. Egy másik betű más mennyiséget jelölhet.

`x = −2 esetén: 4x − 3 = 4 × (−2) − 3 = −11`

### 4.2. Az előjel a taghoz tartozik

Az összeadás vagy kivonás által elválasztott részeket tagoknak nevezzük. A 3x − 2y + 5 felírható 3x + (−2y) + 5 alakban. Az x-es tag együtthatója 3, az y-osé −2; az állandó tag 5. Az x együtthatója 1, a −x-é −1.

`3x − 2y + 5: három tag, köztük a −2y teljes egészében egy tag`

### 4.3. Azonos fajta tagokat lehet összevonni

A 3a + 2a öt darab ugyanabból az a mennyiségből: 5a. Az együtthatók adódnak össze, a betűs rész változatlan. A 3a és 2b általában nem egynemű; az a és a² sem az. Nem kell kitalálni a betű értékét ahhoz, hogy egynemű tagokat összevonjunk.

`3a + 2a = (3 + 2)a = 5a`

- 3a + 2b általában így marad.
- a + a = 2a, de a × a = a².
- 2x − 2x = 0, bármely x-nél.

### 4.4. A szorzás minden belső tagra hat

A 3(x + 4) három egyforma csomag összege. Mindegyikben van x és 4, ezért összesen 3x és 12. Területként is elképzelheted: egy 3 cm magas, (x + 4) cm széles téglalapot az x cm és 4 cm széles résznél kettévágva 3x cm² és 12 cm² területű részeket kapunk. Ez a rajz pozitív hosszakat feltételez; negatív számokra az előjeles műveletek szabálya adja az indoklást.

`k(a + b) = ka + kb; k(a − b) = ka − kb`

### 4.5. A mínusz a teljes zárójelet érinti

Az 5 − (2x − 3) azt jelenti, hogy a teljes 2x − 3 mennyiséget vonjuk ki. Ez ugyanaz, mint a zárójel minden tagját −1-gyel szorozni: −2x + 3. A +5 megmarad, ezért az összevont alak 8 − 2x.

`−(a − b) = −a + b`

- A −2(3x − 5) alakban a szorzó −2: az eredmény −6x + 10.
- A tagokat az előjelükkel együtt csoportosítsd.

### 4.6. Ellenőrző szám és általános indok

Két alakba ugyanazt az értéket helyettesítve könnyen találhatunk hibát. Ha az eredmények eltérnek, az alakok nem azonosak minden x-re. Egy-két egyező példa önmagában még nem bizonyít azonosságot; az általános indok az alkalmazott műveleti szabály, például a szorzás széttagolása.

`Egy ellenpélda cáfolhat; néhány egyező példa nem bizonyít minden esetet.`

## 5. Nézd a példát

### BK05-P01 — Negatív érték behelyettesítése

Mennyi 2a² − 3b, ha a = −2 és b = 3?

1. `2 × (−2)² − 3 × 3` — Az a és b minden helyére a megadott számot írjuk; a negatív számot zárójelezzük.

2. `(−2)² = (−2) × (−2) = 4` — A hatvány alapja itt a teljes −2.

3. `2 × 4 − 9 = 8 − 9 = −1` — A hatvány után végezzük a szorzásokat és a kivonást.

**Ellenőrzés:** A két tag értéke 8 és −9, összegük −1. Ha a négyzetet −4-nek vennénk, más eredményhez jutnánk; ezért az alap zárójele lényeges.

### BK05-P02 — Két zárójel, kétféle előjel

Vond össze: 3(x + 4) − (x − 2), majd ellenőrizd x = −3 esetén!

1. `3x + 12 − x + 2` — A 3 mindkét első tagot szorozza. A második zárójel előtt −1 áll.

2. `(3x − x) + (12 + 2) = 2x + 14` — Külön vonjuk össze az x-es és az állandó tagokat.

3. `x = −3: 2 × (−3) + 14 = 8` — Az összevont kifejezésbe behelyettesítünk.

**Ellenőrzés:** Az eredeti alakban 3 × (−3 + 4) − (−3 − 2) = 3 − (−5) = 8. Az általános azonosságot a helyes zárójelbontás indokolja.

**Másik megoldási út**

1. `3x − x + 3 × 4 + 2` — A tagok előjelét megtartva más csoportosítás is ugyanarra az alakra vezet.

## 6. Gyakorolj — tizenkét teljes feladat

A feladatszám a gondolkodási egységeket jelenti: egy feladathoz több külön ellenőrzött mező tartozhat. A saját indoklás ezek mellett külön, önellenőrzésre szolgál.

### BK05-G01 — 1. gyakorlófeladat

**Alkalmazásazonosító:** `betus-kifejezesek-practice-1`.

Számítsd ki a 4x − 3 értékét három különböző helyettesítéssel: x = 2, x = 0, x = −2.

**Válaszmezők, helyes alakok és készségek**

| Mező       | Kérdés        | Helyes válasz / elfogadott kifejezésalakok | Készség              | Szükséges korábbi részek |
| ---------- | ------------- | ------------------------------------------ | -------------------- | ------------------------ |
| `positive` | x = 2 esetén  | `5`                                        | `betu-helyettesites` | —                        |
| `zero`     | x = 0 esetén  | `-3`                                       | `betu-helyettesites` | —                        |
| `negative` | x = −2 esetén | `-11`                                      | `betu-helyettesites` | —                        |

**Két segítségi lépcső**

1. Mindháromszor ugyanazt a szerkezetet használd.
2. A 4x rendre 8, 0 és −8; mindegyikből még 3-at vonunk ki.

**Részletes megoldás**

1. `4 × 2 − 3 = 5` — A szorzás után vonunk ki.

2. `4 × 0 − 3 = −3` — A betűs tag nulla, az állandó nem.

3. `4 × (−2) − 3 = −11` — Negatívból pozitívat kivonva tovább csökken az érték.

**Megőrzendő gondolat:** Helyettesítéskor a kifejezés szerkezetét és a szám előjelét is megőrizzük.

**Saját indoklás:** Mi maradt ugyanaz a három számolásban?

**Önellenőrzési szempontok az indokláshoz**

- Mindig a megadott x-et szoroztuk néggyel, majd kivontunk hármat.
- Az állandó tag x = 0 esetén sem tűnik el.

**Célzott hibajavítás**

| Mező       | Jellemző hibás bevitel | Visszajelzés                                               |
| ---------- | ---------------------- | ---------------------------------------------------------- |
| `positive` | `3`                    | A 4x szorzás, nem 4 + x. Az első művelet 4 × 2, nem 4 + 2. |
| `zero`     | `0`                    | A 4x lesz nulla, a −3 állandó tag megmarad.                |
| `negative` | `5`                    | A behelyettesített −2 előjelét is őrizd meg: 4 × (−2).     |

### BK05-G02 — 2. gyakorlófeladat

**Alkalmazásazonosító:** `betus-kifejezesek-practice-2`.

Legyen a = −3 és b = 2. Add meg a 2a + b, az ab és az a² értékét.

**Válaszmezők, helyes alakok és készségek**

| Mező      | Kérdés | Helyes válasz / elfogadott kifejezésalakok | Készség              | Szükséges korábbi részek |
| --------- | ------ | ------------------------------------------ | -------------------- | ------------------------ |
| `sum`     | 2a + b | `-4`                                       | `betu-helyettesites` | —                        |
| `product` | ab     | `-6`                                       | `betu-helyettesites` | —                        |
| `square`  | a²     | `9`                                        | `betu-helyettesites` | —                        |

**Két segítségi lépcső**

1. Minden a helyére −3, minden b helyére 2 kerüljön.
2. A három szerkezet: 2 × (−3) + 2; (−3) × 2; (−3) × (−3).

**Részletes megoldás**

1. `−6 + 2 = −4` — Az első kifejezés összeg.

2. `(−3) × 2 = −6` — Az egymás mellé írt betűk szorzatot jelölnek.

3. `(−3)² = 9` — A negatív alapot kétszer szorozzuk össze.

**Megőrzendő gondolat:** A betű helyettesítése nem változtatja meg, milyen művelet szerepel.

**Saját indoklás:** Miért más az ab és az a², ha mindkettő szorzás?

**Önellenőrzési szempontok az indokláshoz**

- Az ab két külön megadott szám szorzata.
- Az a² ugyanazt az a számot használja két tényezőként.

**Célzott hibajavítás**

| Mező      | Jellemző hibás bevitel | Visszajelzés                                         |
| --------- | ---------------------- | ---------------------------------------------------- |
| `sum`     | `-8`                   | A b értéke +2, ezért a −6-hoz kettőt hozzáadunk.     |
| `product` | `-1`                   | Az ab az a × b szorzást jelöli, nem összeadást.      |
| `square`  | `-9`                   | Az a helyére a teljes −3 kerül: (−3)² = (−3) × (−3). |

### BK05-G03 — 3. gyakorlófeladat

**Alkalmazásazonosító:** `betus-kifejezesek-practice-3`.

Vond össze a 3a + 5a − 2a kifejezést egyetlen a-s taggá. Utána számítsd ki az értékét a = −2 esetén.

**Válaszmezők, helyes alakok és készségek**

| Mező       | Kérdés                                  | Helyes válasz / elfogadott kifejezésalakok | Készség              | Szükséges korábbi részek |
| ---------- | --------------------------------------- | ------------------------------------------ | -------------------- | ------------------------ |
| `combined` | Összevont alak: egy szám szorozva a-val | `6a`; `6*a`; `a*6`                         | `egynemu-tagok`      | —                        |
| `value`    | Érték a = −2 esetén                     | `-12`                                      | `betu-helyettesites` | —                        |

**Két segítségi lépcső**

1. Mindegyik tag ugyanolyan a-t tartalmaz.
2. Az együttható 3 + 5 − 2; ezt szorozd a megadott a-val.

**Részletes megoldás**

1. `3a + 5a − 2a = (3 + 5 − 2)a = 6a` — Az egynemű tagok együtthatóit vonjuk össze.

2. `6 × (−2) = −12` — Behelyettesítéssel számoljuk ki az új alak értékét.

**Megőrzendő gondolat:** Összevonáskor a betűs rész megmarad, az együttható változik.

**Saját indoklás:** Hogyan magyaráznád az összevonást az a értékének ismerete nélkül?

**Önellenőrzési szempontok az indokláshoz**

- Három a és öt a együtt nyolc a.
- Ebből két a-t elvéve hat a marad.

**Célzott hibajavítás**

| Mező       | Jellemző hibás bevitel | Visszajelzés                                                                            |
| ---------- | ---------------------- | --------------------------------------------------------------------------------------- |
| `combined` | `a^6`                  | Összeadunk azonos fajta tagokat, nem hatványozunk. A kitevő nem az együtthatók összege. |
| `value`    | `12`                   | A hat a értéke itt 6 × (−2), ezért negatív.                                             |

### BK05-G04 — 4. gyakorlófeladat

**Alkalmazásazonosító:** `betus-kifejezesek-practice-4`.

A 4x + 3y − x + 2y összevonásakor add meg az x és az y együtthatóját. Mennyi az érték x = 2, y = −1 esetén?

**Válaszmezők, helyes alakok és készségek**

| Mező    | Kérdés               | Helyes válasz / elfogadott kifejezésalakok | Készség              | Szükséges korábbi részek |
| ------- | -------------------- | ------------------------------------------ | -------------------- | ------------------------ |
| `x`     | Az x együtthatója    | `3`                                        | `egynemu-tagok`      | —                        |
| `y`     | Az y együtthatója    | `5`                                        | `egynemu-tagok`      | —                        |
| `value` | Helyettesítési érték | `1`                                        | `betu-helyettesites` | —                        |

**Két segítségi lépcső**

1. Külön jelöld az x-es és y-os tagokat.
2. Az új alak (4 − 1)x + (3 + 2)y.

**Részletes megoldás**

1. `4x − x = 3x; 3y + 2y = 5y` — Csak azonos betűs részű tagokat vonunk össze.

2. `3 × 2 + 5 × (−1) = 6 − 5 = 1` — Az új alakban is minden betű megkapja a saját értékét.

**Megőrzendő gondolat:** Kétféle mennyiség együtthatóját külön kezeljük.

**Saját indoklás:** Miért nem lesz az egész kifejezés 8xy?

**Önellenőrzési szempontok az indokláshoz**

- Az összeadás nem változik a változók szorzásává.
- Az x-es és y-os tagok külön csoportban maradnak.

**Célzott hibajavítás**

| Mező    | Jellemző hibás bevitel | Visszajelzés                                                  |
| ------- | ---------------------- | ------------------------------------------------------------- |
| `x`     | `7`                    | A 3y nem x-es tag. Csak a 4x és −x tartozik ebbe a csoportba. |
| `value` | `11`                   | Az y értéke −1; az 5y ezért −5.                               |

### BK05-G05 — 5. gyakorlófeladat

**Alkalmazásazonosító:** `betus-kifejezesek-practice-5`.

Vond össze: 7a − 3 + 2a + 8. Add meg az a együtthatóját, az állandó tagot és az értéket a = −1 esetén.

**Válaszmezők, helyes alakok és készségek**

| Mező          | Kérdés              | Helyes válasz / elfogadott kifejezésalakok | Készség              | Szükséges korábbi részek |
| ------------- | ------------------- | ------------------------------------------ | -------------------- | ------------------------ |
| `coefficient` | Az a együtthatója   | `9`                                        | `egynemu-tagok`      | —                        |
| `constant`    | Állandó tag         | `5`                                        | `egynemu-tagok`      | —                        |
| `value`       | Érték a = −1 esetén | `-4`                                       | `betu-helyettesites` | —                        |

**Két segítségi lépcső**

1. Válaszd külön a betűs és a betű nélküli tagokat.
2. 7a + 2a és −3 + 8 a két összevonható csoport.

**Részletes megoldás**

1. `7a + 2a = 9a; −3 + 8 = 5` — Az előjelek a tagokkal együtt mozognak.

2. `9a + 5 → 9 × (−1) + 5 = −4` — Az összevont alakban helyettesítünk.

**Megőrzendő gondolat:** Az állandó tagok egymással, a betűs tagok a megfelelő fajtájukkal vonhatók össze.

**Saját indoklás:** Miért nem módosítja az a együtthatóját a −3 és a +8?

**Önellenőrzési szempontok az indokláshoz**

- Nincs bennük a tényező.
- Külön állandó taggá adódnak össze.

**Célzott hibajavítás**

| Mező       | Jellemző hibás bevitel | Visszajelzés                                      |
| ---------- | ---------------------- | ------------------------------------------------- |
| `constant` | `11`                   | A −3 előjele a tag része. Az állandó rész −3 + 8. |
| `value`    | `14`                   | A 9a helyére −9 kerül, majd hozzáadjuk az 5-öt.   |

### BK05-G06 — 6. gyakorlófeladat

**Alkalmazásazonosító:** `betus-kifejezesek-practice-6`.

Bontsd fel a 3(x + 4) zárójelet. Add meg az x együtthatóját, az állandó tagot, majd az értéket x = 2 esetén.

**Válaszmezők, helyes alakok és készségek**

| Mező          | Kérdés             | Helyes válasz / elfogadott kifejezésalakok | Készség              | Szükséges korábbi részek |
| ------------- | ------------------ | ------------------------------------------ | -------------------- | ------------------------ |
| `coefficient` | Az x együtthatója  | `3`                                        | `zarojel-felbontas`  | —                        |
| `constant`    | Állandó tag        | `12`                                       | `zarojel-felbontas`  | —                        |
| `value`       | Érték x = 2 esetén | `18`                                       | `betu-helyettesites` | —                        |

**Két segítségi lépcső**

1. Képzelj el három egyforma x + 4 csomagot.
2. A felbontás 3 × x + 3 × 4.

**Részletes megoldás**

1. `3(x + 4) = 3x + 12` — A szorzást széttagoljuk a két összeadandóra.

2. `3 × 2 + 12 = 18` — Az eredeti alak is 3 × 6 = 18.

**Megőrzendő gondolat:** A külső szorzó minden belső tagra vonatkozik.

**Saját indoklás:** Hogyan látható a három csomagból a 12?

**Önellenőrzési szempontok az indokláshoz**

- Mindhárom csomagban van négy állandó elem.
- A csomagok együtt három x-et és tizenkét állandó elemet tartalmaznak.

**Célzott hibajavítás**

| Mező       | Jellemző hibás bevitel | Visszajelzés                                                      |
| ---------- | ---------------------- | ----------------------------------------------------------------- |
| `constant` | `4`                    | A 3 a zárójel minden tagját szorozza; háromszor van benne a 4 is. |

### BK05-G07 — 7. gyakorlófeladat

**Alkalmazásazonosító:** `betus-kifejezesek-practice-7`.

Bontsd fel és írd két összevont taggal: −2(3x − 5). Add meg az értékét x = −1 esetén is.

**Válaszmezők, helyes alakok és készségek**

| Mező       | Kérdés                               | Helyes válasz / elfogadott kifejezésalakok | Készség              | Szükséges korábbi részek |
| ---------- | ------------------------------------ | ------------------------------------------ | -------------------- | ------------------------ |
| `expanded` | Felbontott alak: x-es tag és állandó | `-6x+10`; `-6*x+10`; `10-6x`; `10-6*x`     | `zarojel-felbontas`  | —                        |
| `value`    | Érték x = −1 esetén                  | `16`                                       | `betu-helyettesites` | —                        |

**Két segítségi lépcső**

1. A szorzó −2, az előjele is részt vesz mindkét szorzásban.
2. Számold ki külön: (−2) × 3x és (−2) × (−5).

**Részletes megoldás**

1. `−2(3x − 5) = −6x + 10` — Két negatív tényező szorzata pozitív.

2. `−6 × (−1) + 10 = 16` — Az eredeti alakban −2 × (−8) is 16.

**Megőrzendő gondolat:** A negatív külső szorzó előjelét egyik tagon sem hagyhatjuk el.

**Saját indoklás:** Miért lesz az állandó tag pozitív?

**Önellenőrzési szempontok az indokláshoz**

- A belső állandó −5.
- Ezt −2-vel szorozzuk, így +10 lesz.

**Célzott hibajavítás**

| Mező       | Jellemző hibás bevitel | Visszajelzés                                      |
| ---------- | ---------------------- | ------------------------------------------------- |
| `expanded` | `-6x-10`               | A −2 és a −5 szorzata pozitív. A második tag +10. |
| `value`    | `4`                    | A −6x értéke x = −1 mellett +6, nem −6.           |

### BK05-G08 — 8. gyakorlófeladat

**Alkalmazásazonosító:** `betus-kifejezesek-practice-8`.

Vond össze az 5 − (2x − 3) kifejezést két taggá. Mennyi az értéke x = 4 esetén?

**Válaszmezők, helyes alakok és készségek**

| Mező       | Kérdés                              | Helyes válasz / elfogadott kifejezésalakok | Készség                              | Szükséges korábbi részek |
| ---------- | ----------------------------------- | ------------------------------------------ | ------------------------------------ | ------------------------ |
| `expanded` | Összevont alak: x-es tag és állandó | `-2x+8`; `-2*x+8`; `8-2x`; `8-2*x`         | `zarojel-felbontas`, `egynemu-tagok` | —                        |
| `value`    | Érték x = 4 esetén                  | `0`                                        | `betu-helyettesites`                 | —                        |

**Két segítségi lépcső**

1. A teljes 2x − 3 mennyiséget vonjuk ki.
2. Előbb írd: 5 − 2x + 3; csak ezután vond össze az állandókat.

**Részletes megoldás**

1. `5 − (2x − 3) = 5 − 2x + 3 = 8 − 2x` — A kivonás a zárójel mindkét tagját érinti.

2. `8 − 2 × 4 = 0` — Ellenőrzés az eredeti alakban: 5 − (8 − 3) = 0.

**Megőrzendő gondolat:** A zárójel előtti mínusz minden belső előjelet megváltoztat.

**Saját indoklás:** Miért különbözik az 5 − 2x − 3 az eredeti kifejezéstől?

**Önellenőrzési szempontok az indokláshoz**

- Az eredetiben a −3-at is kivonjuk.
- Negatív mennyiség kivonása a pozitív ellentett hozzáadása.

**Célzott hibajavítás**

| Mező       | Jellemző hibás bevitel | Visszajelzés                                                |
| ---------- | ---------------------- | ----------------------------------------------------------- |
| `expanded` | `2-2x`                 | A zárójel előtti mínusz miatt a belső −3-ból +3 lesz.       |
| `value`    | `-6`                   | Az 5 − 2x − 3 alakban a második tag előjelváltása hiányzik. |

### BK05-G09 — 9. gyakorlófeladat

**Alkalmazásazonosító:** `betus-kifejezesek-practice-9`.

Vond össze: 2(x + 3) + 3(x − 1). Add meg az x együtthatóját, az állandó tagot és az értéket x = 0,5 esetén.

**Válaszmezők, helyes alakok és készségek**

| Mező          | Kérdés               | Helyes válasz / elfogadott kifejezésalakok | Készség                              | Szükséges korábbi részek |
| ------------- | -------------------- | ------------------------------------------ | ------------------------------------ | ------------------------ |
| `coefficient` | Az x együtthatója    | `5`                                        | `zarojel-felbontas`, `egynemu-tagok` | —                        |
| `constant`    | Állandó tag          | `3`                                        | `zarojel-felbontas`, `egynemu-tagok` | —                        |
| `value`       | Érték x = 0,5 esetén | `11/2`                                     | `betu-helyettesites`                 | —                        |

**Két segítségi lépcső**

1. Mindkét zárójelet a saját külső szorzójával bontsd fel.
2. 2x + 6 + 3x − 3 keletkezik.

**Részletes megoldás**

1. `2x + 6 + 3x − 3 = 5x + 3` — Az x-es és állandó tagokat külön vonjuk össze.

2. `5 × 0,5 + 3 = 2,5 + 3 = 5,5` — A tizedes értéket is ugyanúgy helyettesítjük.

**Megőrzendő gondolat:** Több zárójel után a tagok előjeles csoportosítása segít.

**Saját indoklás:** Hogyan ellenőriznéd az 5,5-öt az eredeti alakban?

**Önellenőrzési szempontok az indokláshoz**

- 2 × 3,5 = 7.
- 3 × (−0,5) = −1,5; a két érték összege 5,5.

**Célzott hibajavítás**

| Mező       | Jellemző hibás bevitel | Visszajelzés                                             |
| ---------- | ---------------------- | -------------------------------------------------------- |
| `constant` | `9`                    | A második csomag állandója −3, ezért 6 − 3-at számolunk. |
| `value`    | `8`                    | Az 5x itt 5 × 0,5, azaz 2,5; ehhez adódik a 3.           |

### BK05-G10 — 10. gyakorlófeladat

**Alkalmazásazonosító:** `betus-kifejezesek-practice-10`.

Különítsd el az a + a és az a × a műveletet. Az elsőt egyetlen a-s taggal, a másodikat hatvánnyal írd fel; számítsd ki mindkettőt a = 3 esetén.

**Válaszmezők, helyes alakok és készségek**

| Mező           | Kérdés                 | Helyes válasz / elfogadott kifejezésalakok | Készség              | Szükséges korábbi részek |
| -------------- | ---------------------- | ------------------------------------------ | -------------------- | ------------------------ |
| `sumForm`      | a + a összevont alakja | `2a`; `2*a`; `a*2`                         | `egynemu-tagok`      | —                        |
| `productForm`  | a × a hatványalakja    | `a^2`; `(a)^2`                             | `egynemu-tagok`      | —                        |
| `sumValue`     | a + a értéke a = 3-nál | `6`                                        | `betu-helyettesites` | —                        |
| `productValue` | a × a értéke a = 3-nál | `9`                                        | `betu-helyettesites` | —                        |

**Két segítségi lépcső**

1. Azonos betűk között is számít a műveleti jel.
2. Az elsőben 3 + 3, a másodikban 3 × 3 szerepel.

**Részletes megoldás**

1. `a + a = 2a → 6` — Két egyforma összeadandó.

2. `a × a = a² → 9` — Két egyforma tényező.

**Megőrzendő gondolat:** Az egynemű tagok összevonása nem ugyanaz, mint a hatványozás.

**Saját indoklás:** Elég-e az a = 2 próba a különbség kimutatására?

**Önellenőrzési szempontok az indokláshoz**

- Ott véletlenül 2 + 2 = 2 × 2 = 4.
- Az a = 3 ellenpélda megmutatja, hogy az alakok nem általában azonosak.

**Célzott hibajavítás**

| Mező          | Jellemző hibás bevitel | Visszajelzés                                                     |
| ------------- | ---------------------- | ---------------------------------------------------------------- |
| `sumForm`     | `a^2`                  | Az összeadásból 2a lesz; a négyzet két tényező szorzatát jelöli. |
| `productForm` | `2a`                   | A két a most tényező, nem összeadandó.                           |

### BK05-G11 — 11. gyakorlófeladat

**Alkalmazásazonosító:** `betus-kifejezesek-practice-11`.

Egy téglalap oldalai 3 cm és (x + 2) cm, ahol x pozitív. Írd fel a kerületet és a területet két összevont taggal. Add meg mindkettőt x = 4 esetén.

**Válaszmezők, helyes alakok és készségek**

| Mező            | Kérdés                                | Helyes válasz / elfogadott kifejezésalakok | Készség                              | Szükséges korábbi részek |
| --------------- | ------------------------------------- | ------------------------------------------ | ------------------------------------ | ------------------------ |
| `perimeterForm` | Kerület mérőszámának összevont alakja | `2x+10`; `2*x+10`; `10+2x`; `10+2*x`       | `zarojel-felbontas`, `egynemu-tagok` | —                        |
| `areaForm`      | Terület mérőszámának összevont alakja | `3x+6`; `3*x+6`; `6+3x`; `6+3*x`           | `zarojel-felbontas`                  | —                        |
| `perimeter`     | Kerület x = 4 esetén                  | `18` cm                                    | `betu-helyettesites`                 | —                        |
| `area`          | Terület x = 4 esetén                  | `18` cm²                                   | `betu-helyettesites`                 | —                        |

**Két segítségi lépcső**

1. A kerület a négy oldal összege; a terület két szomszédos oldal szorzata.
2. K = 2 × [3 + (x + 2)]; T = 3(x + 2). Az alakok mezőibe az egység nélküli kifejezést írd.

**Részletes megoldás**

1. `K = 2x + 10; T = 3x + 6` — A két mennyiséget más művelet írja le.

2. `x = 4: oldalak 3 cm és 6 cm` — Konkrét téglalapot kapunk.

3. `K = 18 cm; T = 18 cm²` — Azonos mérőszám mellett is más mennyiségekről van szó.

**Megőrzendő gondolat:** A képlet mellett a mennyiség és az egység is a jelentés része.

**Saját indoklás:** Miért nem jelenti a két 18, hogy a kerület és a terület ugyanaz?

**Önellenőrzési szempontok az indokláshoz**

- Az egyik hosszt, a másik felületet mér.
- Az egységek cm és cm²; a mérőszámok egyezése itt véletlen.

**Célzott hibajavítás**

| Mező            | Jellemző hibás bevitel | Visszajelzés                                      |
| --------------- | ---------------------- | ------------------------------------------------- |
| `perimeterForm` | `2x+5`                 | Mindkét oldalhossz kétszer szerepel a kerületben. |
| `areaForm`      | `3x+2`                 | A 3 a teljes x + 2 oldalt szorozza.               |

### BK05-G12 — 12. gyakorlófeladat

**Alkalmazásazonosító:** `betus-kifejezesek-practice-12`.

Valaki ezt írja: 4(x + 1) = 4x + 1 minden x-re. Ellenőrizd x = 0-val, majd írd le a bal oldal helyes, felbontott alakját.

**Válaszmezők, helyes alakok és készségek**

| Mező          | Kérdés                               | Helyes válasz / elfogadott kifejezésalakok | Készség              | Szükséges korábbi részek |
| ------------- | ------------------------------------ | ------------------------------------------ | -------------------- | ------------------------ |
| `left`        | 4(x + 1) értéke x = 0-nál            | `4`                                        | `betu-helyettesites` | —                        |
| `right`       | 4x + 1 értéke x = 0-nál              | `1`                                        | `betu-helyettesites` | —                        |
| `correctForm` | A bal oldal helyes felbontott alakja | `4x+4`; `4*x+4`; `4+4x`; `4+4*x`           | `zarojel-felbontas`  | —                        |

**Két segítségi lépcső**

1. A két oldalba ugyanazt a nullát helyettesítsd.
2. A bal oldalon 4 × (0 + 1), a jobbon 4 × 0 + 1 áll.

**Részletes megoldás**

1. `Bal oldal 4, jobb oldal 1` — Egyetlen eltérés elég a minden x-re szóló állítás cáfolatához.

2. `4(x + 1) = 4x + 4` — A szorzás mindkét belső tagra hat.

**Megőrzendő gondolat:** Ellenpéldával hibát mutatunk ki; a helyes általános alakot a műveleti szabály adja.

**Saját indoklás:** Miért volt elég egyetlen helyettesítés az állítás megcáfolásához?

**Önellenőrzési szempontok az indokláshoz**

- Az állítás minden x-re szólt.
- Az x = 0 megengedett érték, és ott az oldalak eltérnek.

**Célzott hibajavítás**

| Mező          | Jellemző hibás bevitel | Visszajelzés                                             |
| ------------- | ---------------------- | -------------------------------------------------------- |
| `correctForm` | `4x+1`                 | A +1 minden csomagban szerepel, ezért összesen +4-et ad. |

## 7. Önálló próba

Először a segítségek és a megoldás megnyitása nélkül próbálkozz. Az alkalmazás külön kezeli az önállóan és segítséggel elért eredményt. A két feladat nem a teljes modul vagy a teljes évfolyam tudásának vizsgája.

### BK05-Z01 — 1. önálló próbafeladat

**Alkalmazásazonosító:** `betus-kifejezesek-exit-1`.

Vond össze két taggá: 4(2x − 3) − 3(x + 1). Számítsd ki az értékét x = −2 és x = 3 esetén.

**Válaszmezők, helyes alakok és készségek**

| Mező       | Kérdés                              | Helyes válasz / elfogadott kifejezésalakok | Készség                              | Szükséges korábbi részek |
| ---------- | ----------------------------------- | ------------------------------------------ | ------------------------------------ | ------------------------ |
| `form`     | Összevont alak: x-es tag és állandó | `5x-15`; `5*x-15`; `-15+5x`; `-15+5*x`     | `zarojel-felbontas`, `egynemu-tagok` | —                        |
| `negative` | Érték x = −2 esetén                 | `-25`                                      | `betu-helyettesites`                 | —                        |
| `positive` | Érték x = 3 esetén                  | `0`                                        | `betu-helyettesites`                 | —                        |

**Két segítségi lépcső**

1. Bontsd fel mindkét zárójelet az előjeles szorzóval.
2. 8x − 12 − 3x − 3 az első felbontott sor.

**Részletes megoldás**

1. `8x − 12 − 3x − 3 = 5x − 15` — Az x-es és állandó tagok külön csoportosulnak.

2. `x = −2: −10 − 15 = −25; x = 3: 15 − 15 = 0` — Mindkét megadott értéket behelyettesítjük.

**Megőrzendő gondolat:** A biztos zárójelbontás és a helyettesítés együtt ad ellenőrizhető megoldást.

**Saját indoklás:** Hogyan ellenőriznéd a nullát az eredeti alakban?

**Önellenőrzési szempontok az indokláshoz**

- x = 3 esetén az első tag 4 × 3 = 12.
- A második tag 3 × 4 = 12; különbségük nulla.

**Célzott hibajavítás**

| Mező   | Jellemző hibás bevitel | Visszajelzés                                          |
| ------ | ---------------------- | ----------------------------------------------------- |
| `form` | `5x-9`                 | A második zárójelet −3 szorozza: az állandó tagja −3. |

### BK05-Z02 — 2. önálló próbafeladat

**Alkalmazásazonosító:** `betus-kifejezesek-exit-2`.

Három belépő darabonként (p + 200) Ft, további két belépő darabonként p Ft. Nincs más költség. A teljes ár összevont alakjában mennyi p együtthatója és az állandó tag? Mennyi az ár p = 800 esetén?

**Válaszmezők, helyes alakok és készségek**

| Mező          | Kérdés                        | Helyes válasz / elfogadott kifejezésalakok | Készség                              | Szükséges korábbi részek |
| ------------- | ----------------------------- | ------------------------------------------ | ------------------------------------ | ------------------------ |
| `coefficient` | p együtthatója a teljes árban | `5`                                        | `zarojel-felbontas`, `egynemu-tagok` | —                        |
| `constant`    | Állandó tag (Ft)              | `600` Ft                                   | `zarojel-felbontas`                  | —                        |
| `price`       | Teljes ár p = 800 esetén      | `4600` Ft                                  | `betu-helyettesites`                 | —                        |

**Két segítségi lépcső**

1. Írd fel: 3(p + 200) + 2p.
2. Az összeg 3p + 600 + 2p; vond össze a p-s tagokat.

**Részletes megoldás**

1. `3(p + 200) + 2p = 5p + 600` — Öt alapár és három felár szerepel.

2. `5 × 800 + 600 = 4600 Ft` — Az összevont alakban egyszerű a helyettesítés.

3. `3 × 1000 + 2 × 800 = 4600 Ft` — Az eredeti történet külön tételei is ugyanezt adják.

**Megőrzendő gondolat:** A zárójel valódi csomagot is jelölhet; minden csomag állandó része számít.

**Saját indoklás:** Miért 600 Ft az állandó rész?

**Önellenőrzési szempontok az indokláshoz**

- Három drágább belépőnél van 200 Ft felár.
- A két p Ft-os belépőben nincs ilyen felár.

**Célzott hibajavítás**

| Mező       | Jellemző hibás bevitel | Visszajelzés                            |
| ---------- | ---------------------- | --------------------------------------- |
| `constant` | `200`                  | A 200 Ft három belépőnél is szerepel.   |
| `price`    | `4200`                 | A felár nem egyszeri: háromszor 200 Ft. |

## 8. Összefoglalás és fogalomtár

- Ugyanaz a betű egy helyettesítésen belül ugyanazt a számot jelöli.
- A tag előjelét együtt visszük a taggal.
- Egynemű tagoknál az együtthatókat vonjuk össze; az a és a² különböző fajta.
- A külső szorzó a zárójel minden tagjára hat.
- Egy ellenpélda cáfolhat; általános azonossághoz jogos átalakítás kell.

| Fogalom              | Jelentés                                                                   |
| -------------------- | -------------------------------------------------------------------------- |
| Változó              | Betűvel jelölt szám, amely különböző megengedett értékeket vehet fel.      |
| Helyettesítési érték | A kifejezés eredménye, amikor minden betűnek megadtuk az értékét.          |
| Tag                  | Egy összeg előjeles része; például a 3x − 2-ben 3x és −2.                  |
| Együttható           | A betűs részt szorzó szám; a −x együtthatója −1.                           |
| Egynemű tagok        | Azonos betűs részű tagok, például 2x és −5x. Az x és x² nem egynemű.       |
| Disztributivitás     | A szorzás széttagolhatósága összegre vagy különbségre: k(a + b) = ka + kb. |
| Azonosság            | Olyan egyenlőség, amely minden megengedett helyettesítésnél igaz.          |

## 9. Determinisztikus, változatos gyakorlás

A [generátorforrás](../../app/src/math/bridge-generators.ts) a családazonosító, seed és változat alapján ismételhető feladatot állít elő. Azonos bemenethez azonos kérdés, válasz, segítség és megoldás tartozik; a seed és a változat negatív biztonságos egész is lehet. A témán belüli sorrend a következő:

| Témán belüli index | Családazonosító         | Tartalom                             | Készségek                                                  |
| ------------------ | ----------------------- | ------------------------------------ | ---------------------------------------------------------- |
| 0                  | `algebra-substitute-v1` | Előjeles és törtes helyettesítés     | `betu-helyettesites`                                       |
| 1                  | `algebra-collect-v1`    | Kétféle egynemű tag és ellenőrzés    | `egynemu-tagok`, `betu-helyettesites`                      |
| 2                  | `algebra-packets-v1`    | Csomagok, kiadás és előjeles zárójel | `zarojel-felbontas`, `egynemu-tagok`, `betu-helyettesites` |

A függő ellenőrző rész mezői a generált feladatban is együtt maradnak a szükséges előzményekkel. A családok nem pusztán a rögzített feladatok végértékét cserélik: az adott témához illő paramétertartományokkal, több kapcsolódó részválasszal és feladattípusnak megfelelő feltételekkel dolgoznak.

A három családban nincs kötelező részfüggőség: az önálló helyettesítés és a történet közvetlen kiszámítása is érvényes megoldási út.

## 10. Azonosítók és válaszszerződés

A kézirat és az alkalmazás közötti megfeleltetés az [új lecketartalom](../../app/src/content/bridge-lessons.ts) `bridgeManuscriptMap` exportjában is szerepel. J = jóslás, P = kidolgozott példa, G = gyakorlás, Z = önálló próba. A példák sorrendjéhez tartozik a két P-azonosító; az alkalmazásban a példák nem válaszbekérő feladatrekordok.

| Kéziratazonosító | Alkalmazásbeli rekord           | Külön ellenőrzött mezők                              |
| ---------------- | ------------------------------- | ---------------------------------------------------- |
| `BK05-J01`       | `betus-kifejezesek-prediction`  | `first`, `second`                                    |
| `BK05-G01`       | `betus-kifejezesek-practice-1`  | `positive`, `zero`, `negative`                       |
| `BK05-G02`       | `betus-kifejezesek-practice-2`  | `sum`, `product`, `square`                           |
| `BK05-G03`       | `betus-kifejezesek-practice-3`  | `combined`, `value`                                  |
| `BK05-G04`       | `betus-kifejezesek-practice-4`  | `x`, `y`, `value`                                    |
| `BK05-G05`       | `betus-kifejezesek-practice-5`  | `coefficient`, `constant`, `value`                   |
| `BK05-G06`       | `betus-kifejezesek-practice-6`  | `coefficient`, `constant`, `value`                   |
| `BK05-G07`       | `betus-kifejezesek-practice-7`  | `expanded`, `value`                                  |
| `BK05-G08`       | `betus-kifejezesek-practice-8`  | `expanded`, `value`                                  |
| `BK05-G09`       | `betus-kifejezesek-practice-9`  | `coefficient`, `constant`, `value`                   |
| `BK05-G10`       | `betus-kifejezesek-practice-10` | `sumForm`, `productForm`, `sumValue`, `productValue` |
| `BK05-G11`       | `betus-kifejezesek-practice-11` | `perimeterForm`, `areaForm`, `perimeter`, `area`     |
| `BK05-G12`       | `betus-kifejezesek-practice-12` | `left`, `right`, `correctForm`                       |
| `BK05-Z01`       | `betus-kifejezesek-exit-1`      | `form`, `negative`, `positive`                       |
| `BK05-Z02`       | `betus-kifejezesek-exit-2`      | `coefficient`, `constant`, `price`                   |

A számmezők racionális értéket és szükség szerint egységet ellenőriznek; a magyar tizedesvessző használható. A kifejezésmező véges, szerző által megadott helyes alakokat fogad el, ezért a feladat pontosan kéri a választandó szerkezetet. Ez nem általános számítógépes algebrai rendszer, és nem futtatja a bevitt szöveget kódként. A gyökjeles alaknál a jelölés és az eredeti gyök alatti szám megőrzése a cél.

A táblázatok „Szükséges korábbi részek” oszlopa a `requiresParts` kapcsolatot mutatja. A függő részhez tartozó készségbizonyíték csak ugyanabban az ellenőrzésben helyes előzménylánc mellett számít. Így a közölt teljes összeg visszamásolása önmagában nem igazolja a modell visszaellenőrzését. A szükséges kapcsolat tranzitív: ha az egyezőséghez négyzet, a négyzethez kerekített oldal kell, mindkettő az ellenőrző csoport része. Az egymástól független helyettesítésekhez nem írunk elő mesterséges sorrendet.

## 11. Egységszintű lefedettség és korlátok

| Lefedett egység | Az aktuális tématérkép megnevezése                    |
| --------------- | ----------------------------------------------------- |
| `M09.01`        | Betű mint változó és mennyiség jelölése.              |
| `M09.02`        | Helyettesítési érték és az értelmezett egység.        |
| `M09.03`        | Együttható, tag és egynemű tagok összevonása.         |
| `M09.04`        | Szorzás összeggel: területmodell és disztributivitás. |
| `M09.05`        | Mínuszjel a zárójel előtt.                            |

Az M09 öt itt felsorolt egységéhez van teljes lecke–gyakorlat–ellenőrzés kapcsolat. Ez az M09 jelenlegi tématérképi terjedelmét jelenti; nem állítás a teljes algebra vagy a teljes nyolcadikos tananyag lefedéséről.

## 12. Ellenőrzési alap és tartalmi mérleg

Ebben az útban 15 kérdésrekord szerepel: 1 jósló belépő, 12 gyakorló és 2 önálló próbafeladat. Ehhez 43 külön ellenőrzött válaszmező, 29 szerzői célzott hibaszabály, 2 kidolgozott példa és 3 generátorcsalád tartozik. Ezek az aktuális adatmodellből számított darabszámok.

A [tartalmi tesztek](../../app/tests/bridge-content.test.ts) a szerzői válaszokat a feladatok adataiból felírt, külön racionális számításokkal vetik össze; a kifejezésváltozatokat külön matematikai értelmező ellenőrzi. Vizsgálják a célzott hibajavítás tényleges üzenetét, a részfüggőségek érvényességét, a fogalmi korlátokat és a kézirat–alkalmazás kapcsolatot. A [generátortesztek](../../app/tests/bridge-generators.test.ts) családonként 200 feladat látható szövegéből külön számolják újra az eredményeket; a teljes négy témában további 252 szélső/negatív seed–változat visszajátszás is szerepel.

Az automatikus matematikai és működési ellenőrzés a tartalom pontosságáról és a végrehajtásról ad bizonyítékot. A tanulási hatás, a nyelvezet életkori megfelelősége és a valódi tanórai időigény tanári–tanulói kipróbálással vizsgálandó.
