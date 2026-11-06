# Hatványok — teljes tananyag és alkalmazásbeli azonosítók

A Matek8 0.3.0 fejlesztési ciklusához tartozó, az alkalmazás adataival összehangolt kézirat. Témaazonosító: `hatvanyok`. A fájl a teljes magyarázatot, példákat, feladatokat, segítségeket, megoldásokat és hibavisszajelzéseket tartalmazza.

A tanulói út: **Jósolj → Próbáld ki → Értsd meg → Nézd a példát → Gyakorolj → Önálló próba**. A becsült 50 perc tervezési támpont; az út több alkalomra osztható. Tanári és tanulói kipróbálás nélkül nem állítjuk, hogy minden tanulónál bizonyított megértést eredményez.

## 1. Cél, előismeret és hatókör

**Indító kérdés:** Mit számol a kitevő, és miért számít, hol van a mínuszjel?

Pozitív egész kitevőkkel dolgozunk. A négyzet és köb jelentését területtel és térfogattal kötjük össze, majd tíz hatványaival és becsléssel ellenőrizzük a nagyobb számokat.

A törzs a pozitív egész kitevő jelentése, az alap és a kitevő különbsége, az előjel és a zárójel szerepe, a négyzet és köb geometriai kapcsolata, valamint a tíz hatványaira épülő nagyságrendi ellenőrzés. Nagy pozitív számok normálalakjára alapozó példák szerepelnek. A műhely rövid kitekintése a nem nulla alap nulladik hatványát és a tíz negatív egész kitevőjét feltételekkel mutatja meg; ettől ezek teljes tananyagegysége még nem kész.

**Tanulási célok**

- Az alapot és a pozitív egész kitevőt ismételt szorzáshoz kapcsolod.
- Megkülönbözteted a negatív alapot a hatvány elé írt mínusztól.
- Értelmezed a négyzetet és köböt mennyiségek és egységek mellett.
- Tíz hatványaival írsz fel helyi értékeket és ellenőrzöd a nagyságrendet.
- A pontos számolást elkülöníted a közelítő becsléstől.

**Előismeretek**

- Szorzás előjeles számokkal; műveleti sorrend és zárójelek.
- Törtek, tizedesek, valamint a terület- és térfogategységek alapjai.

**Megnyitható előismereti témák:** `szamfogalom`, `muveleti-sorrend`, `mertekegysegek`.

**Továbblépés:** `negyzetgyok`.

## 2. Jósolj

### H07-J01 — Jósló belépő

**Alkalmazásazonosító:** `hatvanyok-prediction`.

Melyik a nagyobb: 3² vagy 2³? Előbb képzeld el az ismételt szorzást, majd add meg külön a két értéket.

**Válaszmezők, helyes alakok és készségek**

| Mező     | Kérdés    | Helyes válasz / elfogadott kifejezésalakok | Készség            | Szükséges korábbi részek |
| -------- | --------- | ------------------------------------------ | ------------------ | ------------------------ |
| `square` | 3² értéke | `9`                                        | `hatvany-jelentes` | —                        |
| `cube`   | 2³ értéke | `8`                                        | `hatvany-jelentes` | —                        |

**Két segítségi lépcső**

1. A kitevő a tényezők számát jelöli.
2. 3² = 3 × 3; 2³ = 2 × 2 × 2.

**Részletes megoldás**

1. `3 × 3 = 9` — Két darab 3-at szorzunk össze.

2. `2 × 2 × 2 = 8` — Három darab 2-t szorzunk össze.

3. `9 > 8` — A nagyobb kitevő önmagában nem dönti el két különböző alapú hatvány sorrendjét.

**Megőrzendő gondolat:** Az alap és a kitevő együtt határozza meg a hatványt.

**Saját indoklás:** Miért nem elég csak a 2-es és 3-as kitevőt összehasonlítani?

**Önellenőrzési szempontok az indokláshoz**

- Az alapok is eltérnek.
- A tényleges szorzatokat kell vizsgálni.

**Célzott hibajavítás**

| Mező     | Jellemző hibás bevitel | Visszajelzés                                   |
| -------- | ---------------------- | ---------------------------------------------- |
| `square` | `6`                    | A 3² két darab 3 tényezőt jelent, nem 3 × 2-t. |
| `cube`   | `6`                    | A 2³ három darab 2 tényező: 2 × 2 × 2.         |

## 3. Próbáld ki — az interaktív műhely matematikai menete

A műhely működő alkalmazásrésze az [interaktív forrásban](../../app/src/interactives/BridgeLabs.tsx), pontos számolási modellje a [műhelymodellben](../../app/src/math/bridge-models.ts) található. Az alábbi megfigyelések a lecke fogalmait kötik össze a kezelhető állapotokkal.

1. A hatvány szerkezetében válaszd szét az alapot, a kitevőt és a hatvány elé írt mínuszt. Hasonlítsd össze a −3² és (−3)² alakot, majd páratlan kitevővel is próbálj ki hasonló párt.
2. Jósolj előjelet és értéket, majd írd vagy olvasd ki az ismételt szorzást. Páros számú negatív tényező pozitív, páratlan számú negatív tényező negatív szorzatot ad.
3. A négyzet- és kockamodellben változtasd az oldal vagy él hosszát. A cellák és rétegek száma a második és harmadik hatványt mutatja; az egység cm², illetve cm³.
4. A tízhatvány-vizsgálatban figyeld meg az egymást követő kitevők tízszeres kapcsolatát. A −6 és 6 közötti tízkitevők kitekintésében 10⁰ = 1 és 10⁻ⁿ = 1/10ⁿ. Ez nem a negatív kitevőjű hatványok teljes általános tanítása.
5. A nulladik hatvány rövid kitekintése nem nulla alapra érvényes: a⁰ = 1, ha a ≠ 0. A 0⁰ alakot a műhely nem értelmezi. Az ellenőrzést mindig a választott szerkezet és feltétel indokolja.

A saját szavas magyarázatot a program nem osztályozza automatikusan. A tanuló a felsorolt szempontokhoz viszonyíthatja a saját gondolatát; az elmentés külön döntés. Az automatikusan ellenőrzött szám vagy kifejezés helyessége nem bizonyítja önmagában a magyarázat megértését.

## 4. Értsd meg — teljes magyarázat

### 4.1. A kitevő a tényezőket számolja

A 4³ röviden azt jelenti: 4 × 4 × 4. A 4 az alap, a 3 a kitevő. Pozitív egész kitevőnél ennyi darab alapot szorzunk össze. Az a¹ egyszerűen a. Ez az út törzsanyaga. A műhely külön kitekintésében a nem nulla alap nulladik hatványa 1, a negatív tízkitevő pedig reciprokot jelöl: például 10⁻² = 1/100. Ezek feltételes kiterjesztések; a 0⁰ nem része ennek a szabálynak.

`4³ = 4 × 4 × 4 = 64`

- 4³ nem 4 × 3.
- Az alap és a kitevő felcserélése általában más eredményt ad.
- Az 1 minden pozitív egész hatványa 1; a 0-é 0.

### 4.2. A zárójel kijelöli az alapot

A (−3)² alapja a teljes −3: (−3) × (−3) = 9. A −3² viszont a 3² ellentettje, ezért −9. A hatványozást a kifejezés elé írt mínusz előtt végezzük. Ha bizonytalan vagy, írd ki a tényezőket a zárójelekkel együtt.

`(−3)² = 9, de −3² = −9`

### 4.3. Páros és páratlan számú negatív tényező

Két negatív tényező pozitív szorzatot ad. Páros számú negatív tényezőt párokba rendezve a hatvány pozitív. Páratlan számúnál marad egy negatív tényező, így az eredmény negatív. Ez a megállapítás nem nulla, negatív alapra és pozitív egész kitevőre szól.

`(−2)⁴ = 16; (−2)⁵ = −32`

### 4.4. Négyzet és köb: valódi geometriai jelentés

Egy a oldalú négyzet területe a × a = a². Egy a élű kocka térfogata a × a × a = a³. Hosszúság esetén cm, területnél cm², térfogatnál cm³ az egység. Ha minden hossz kétszeresére változik, a négyzet területe négyszeres, a kocka térfogata nyolcszoros lesz.

`(2a)² = 4a²; (2a)³ = 8a³`

- A geometriai hossz itt pozitív.
- A felületet két, a térfogatot három független irányban növeljük.

### 4.5. Tíz hatványai helyi értéket neveznek meg

10¹ = 10, 10² = 100, 10³ = 1000. Minden újabb tízes tényező tízszeres értéket ad. A 52 074 felbontható 5 × 10⁴ + 2 × 10³ + 7 × 10 + 4 alakban. A tizedesvessző helyiérték-váltást követ; nem számjegyeket tüntetünk el indok nélkül.

`0,047 × 1000 = 47; 62 000 : 100 = 620`

### 4.6. A becslés hibát jelezhet, de nem pontos egyenlőség

A 198 × 51 közel van a 200 × 50 = 10 000-hez. Ez segít észrevenni a tízszeres hibát. A pontos érték 10 098, ezért a 198 × 51 ≈ 10 000 jelölés helyes, az egyenlőségjel nem. A becsléshez meg kell mondanunk, mely számokat milyen módon közelítettük.

`198 × 51 ≈ 200 × 50 = 10 000`

### 4.7. Kitekintés: nagy számok normálalakja

Nagy pozitív számot a × 10ⁿ alakban is írhatunk, ahol 1 ≤ a < 10. A rögzített gyakorlók itt pozitív egész n-es példákat használnak: 4 700 000 = 4,7 × 10⁶. A műhely a nulla és negatív tízkitevők helyi értékeit is megmutatja. A normálalak teljes témáját és minden kitevőesetét ez az út még nem gyakoroltatja végig.

`3,2 × 10⁵ = 320 000`

- A szorzó 1 és 10 közé esik, a 10-et már nem érheti el.
- A 47 × 10⁵ ugyanaz az érték, de nem a kért normálalak.

## 5. Nézd a példát

### H07-P01 — Negatív alap, majd összeadás

Számítsd ki: (−2)³ + 4².

1. `(−2)³ = (−2) × (−2) × (−2)` — A teljes −2 az alap, háromszor szerepel tényezőként.

2. `(−2) × (−2) = 4; 4 × (−2) = −8` — A harmadik negatív tényező miatt negatív a köb.

3. `4² = 4 × 4 = 16` — A másik hatvány két 4-es tényező szorzata.

4. `−8 + 16 = 8` — A két hatvány kiszámítása után adjuk össze az értékeket.

**Ellenőrzés:** Az egyik tag −8, a másik +16; a pozitív tag abszolút értéke nagyobb, így a pozitív 8 ésszerű.

### H07-P02 — Előbb nagyságrend, utána pontos eredmény

Becsüld meg, majd számítsd ki pontosan: 498 × 201.

1. `498 ≈ 500; 201 ≈ 200` — Közeli, könnyen szorozható számokat választunk.

2. `500 × 200 = 100 000 = 10⁵` — A pontos eredményt ennek közelében várjuk.

3. `498 × (200 + 1) = 99 600 + 498 = 100 098` — A szorzás széttagolásával pontosan számolunk.

4. `100 098 − 100 000 = 98` — A becsléstől való eltérés kicsi a teljes eredményhez képest.

**Ellenőrzés:** A 10 009,8 vagy az 1 000 980 tízszeres eltérést jelentene a várt mérettől. A becslés nem bizonyítja minden számjegy helyességét, de feltűnő hibákat jelez.

## 6. Gyakorolj — tizenkét teljes feladat

A feladatszám a gondolkodási egységeket jelenti: egy feladathoz több külön ellenőrzött mező tartozhat. A saját indoklás ezek mellett külön, önellenőrzésre szolgál.

### H07-G01 — 1. gyakorlófeladat

**Alkalmazásazonosító:** `hatvanyok-practice-1`.

A 4³ alakban nevezd meg az alapot és a kitevőt. Írd ki szorzásjelekkel az ismételt szorzást, majd számítsd ki.

**Válaszmezők, helyes alakok és készségek**

| Mező       | Kérdés                              | Helyes válasz / elfogadott kifejezésalakok | Készség            | Szükséges korábbi részek |
| ---------- | ----------------------------------- | ------------------------------------------ | ------------------ | ------------------------ |
| `base`     | Alap                                | `4`                                        | `hatvany-jelentes` | —                        |
| `exponent` | Kitevő                              | `3`                                        | `hatvany-jelentes` | —                        |
| `expanded` | Ismételt szorzás, hatványjel nélkül | `4*4*4`; `(4*4)*4`; `4*(4*4)`; `(4*4*4)`   | `hatvany-jelentes` | —                        |
| `value`    | Érték                               | `64`                                       | `hatvany-jelentes` | —                        |

**Két segítségi lépcső**

1. Számold meg, hány darab 4 szerepel tényezőként.
2. Előbb 4 × 4 = 16, majd ezt is szorozd 4-gyel.

**Részletes megoldás**

1. `4³ = 4 × 4 × 4` — Az alap 4, a tényezők száma 3.

2. `16 × 4 = 64` — Egymás után végezzük a szorzásokat.

**Megőrzendő gondolat:** A kitevő a tényezők számát írja le.

**Saját indoklás:** Mi a különbség a 4³ és a 4 × 3 között?

**Önellenőrzési szempontok az indokláshoz**

- A hatványban három 4-es tényező van.
- A 4 × 3 szorzatnak két tényezője van: 4 és 3.

**Célzott hibajavítás**

| Mező       | Jellemző hibás bevitel | Visszajelzés                                   |
| ---------- | ---------------------- | ---------------------------------------------- |
| `expanded` | `4*3`                  | A 3 a 4-es tényezők száma, nem egy új tényező. |
| `value`    | `12`                   | A 4³ nem 4 × 3; három darab 4 szorzata.        |

### H07-G02 — 2. gyakorlófeladat

**Alkalmazásazonosító:** `hatvanyok-practice-2`.

Számítsd ki külön a 2⁵ és 5² értékét. Mennyivel nagyobb az első a másodiknál?

**Válaszmezők, helyes alakok és készségek**

| Mező         | Kérdés  | Helyes válasz / elfogadott kifejezésalakok | Készség            | Szükséges korábbi részek |
| ------------ | ------- | ------------------------------------------ | ------------------ | ------------------------ |
| `first`      | 2⁵      | `32`                                       | `hatvany-jelentes` | —                        |
| `second`     | 5²      | `25`                                       | `hatvany-jelentes` | —                        |
| `difference` | 2⁵ − 5² | `7`                                        | `hatvany-jelentes` | `first`, `second`        |

**Két segítségi lépcső**

1. A két hatványban az alap és a tényezők száma is különbözik.
2. 2 × 2 × 2 × 2 × 2 = 32; 5 × 5 = 25.

**Részletes megoldás**

1. `2⁵ = 32; 5² = 25` — Az ismételt szorzások két külön értéket adnak.

2. `32 − 25 = 7` — Az elsőből vonjuk ki a másodikat.

**Megőrzendő gondolat:** Az alap és a kitevő szerepe nem felcserélhető.

**Saját indoklás:** Miért nem általános szabály az aⁿ = nᵃ?

**Önellenőrzési szempontok az indokláshoz**

- Az ismételt szorzásban más tényezőből más darabszám szerepel.
- A 2⁵ és 5² konkrét ellenpélda.

**Célzott hibajavítás**

| Mező    | Jellemző hibás bevitel | Visszajelzés                                            |
| ------- | ---------------------- | ------------------------------------------------------- |
| `first` | `10`                   | Öt darab 2-t szorzunk össze, nem a 2-t szorozzuk 5-tel. |

### H07-G03 — 3. gyakorlófeladat

**Alkalmazásazonosító:** `hatvanyok-practice-3`.

A zárójelekre figyelve számítsd ki: (−3)², −3², −(−3)² és (−3)³.

**Válaszmezők, helyes alakok és készségek**

| Mező             | Kérdés | Helyes válasz / elfogadott kifejezésalakok | Készség                              | Szükséges korábbi részek |
| ---------------- | ------ | ------------------------------------------ | ------------------------------------ | ------------------------ |
| `negativeSquare` | (−3)²  | `9`                                        | `hatvany-elojel`, `hatvany-jelentes` | —                        |
| `oppositeSquare` | −3²    | `-9`                                       | `hatvany-elojel`                     | —                        |
| `outside`        | −(−3)² | `-9`                                       | `hatvany-elojel`                     | —                        |
| `cube`           | (−3)³  | `-27`                                      | `hatvany-elojel`, `hatvany-jelentes` | —                        |

**Két segítségi lépcső**

1. Előbb minden esetben nevezd meg a hatvány alapját.
2. A zárójel nélküli kezdő mínusz a hatvány értékének ellentettjét jelöli.

**Részletes megoldás**

1. `(−3)² = 9; −3² = −9` — Az elsőben negatív az alap, a másodikban a hatvány elé kerül a mínusz.

2. `−(−3)² = −9` — A belső négyzet pozitív, ennek vesszük az ellentettjét.

3. `(−3)³ = −27` — Páratlan számú negatív tényező szorzata negatív.

**Megőrzendő gondolat:** A mínusz helye a műveleti szerkezet része.

**Saját indoklás:** Melyik két alakban vesszük egy már kiszámított négyzet ellentettjét?

**Önellenőrzési szempontok az indokláshoz**

- A −3² és a −(−3)² alakban.
- Mindkét négyzet 9, ezért az ellentett −9.

**Célzott hibajavítás**

| Mező             | Jellemző hibás bevitel | Visszajelzés                                                          |
| ---------------- | ---------------------- | --------------------------------------------------------------------- |
| `negativeSquare` | `-9`                   | A teljes −3-at szorozzuk önmagával: két negatív tényező pozitívat ad. |
| `oppositeSquare` | `9`                    | Itt a hatvány alapja 3, és az elkészült 9 ellentettjét vesszük.       |
| `cube`           | `27`                   | Három negatív tényezőnél egy negatív előjel pár nélkül marad.         |

### H07-G04 — 4. gyakorlófeladat

**Alkalmazásazonosító:** `hatvanyok-practice-4`.

Számítsd ki: (−2)⁴, (−2)⁵, 0³ és 1⁸. A kitevők mind pozitív egészek.

**Válaszmezők, helyes alakok és készségek**

| Mező   | Kérdés | Helyes válasz / elfogadott kifejezésalakok | Készség                              | Szükséges korábbi részek |
| ------ | ------ | ------------------------------------------ | ------------------------------------ | ------------------------ |
| `even` | (−2)⁴  | `16`                                       | `hatvany-elojel`, `hatvany-jelentes` | —                        |
| `odd`  | (−2)⁵  | `-32`                                      | `hatvany-elojel`, `hatvany-jelentes` | —                        |
| `zero` | 0³     | `0`                                        | `hatvany-jelentes`                   | —                        |
| `one`  | 1⁸     | `1`                                        | `hatvany-jelentes`                   | —                        |

**Két segítségi lépcső**

1. A két első alakban számold a negatív tényezők párait.
2. 0 × 0 × 0 = 0; akármennyi 1-es tényező szorzata 1.

**Részletes megoldás**

1. `(−2)⁴ = 16; (−2)⁵ = 16 × (−2) = −32` — A következő kitevő egy újabb alapnyi szorzást jelent.

2. `0³ = 0; 1⁸ = 1` — A nulla és az egy szorzási tulajdonságai érvényesülnek.

**Megőrzendő gondolat:** A kitevő növelése egy újabb alapnyi szorzás; az eredmény nem feltétlenül lesz nagyobb.

**Saját indoklás:** Miért nem állítjuk, hogy minden hatványozás növeli a számot?

**Önellenőrzési szempontok az indokláshoz**

- Az 1 értéke változatlan marad.
- A nulla is nulla marad, a negatív alapnál pedig az előjel is váltakozik.

**Célzott hibajavítás**

| Mező   | Jellemző hibás bevitel | Visszajelzés                                                  |
| ------ | ---------------------- | ------------------------------------------------------------- |
| `even` | `-16`                  | Négy negatív tényező két párt alkot, ezért pozitív a szorzat. |
| `odd`  | `32`                   | Az ötödik negatív tényező negatívvá teszi az előző 16-ot.     |
| `one`  | `8`                    | Nyolc darab 1-et szorzunk, nem összeadunk.                    |

### H07-G05 — 5. gyakorlófeladat

**Alkalmazásazonosító:** `hatvanyok-practice-5`.

Számítsd ki pontosan: (1/2)³, (3/2)² és 0,2². A törteket vagy a pontos tizedes alakot is használhatod.

**Válaszmezők, helyes alakok és készségek**

| Mező          | Kérdés | Helyes válasz / elfogadott kifejezésalakok | Készség                           | Szükséges korábbi részek |
| ------------- | ------ | ------------------------------------------ | --------------------------------- | ------------------------ |
| `half`        | (1/2)³ | `1/8`                                      | `hatvany-jelentes`                | —                        |
| `threeHalves` | (3/2)² | `9/4`                                      | `hatvany-jelentes`                | —                        |
| `decimal`     | 0,2²   | `1/25`                                     | `hatvany-jelentes`, `nagysagrend` | —                        |

**Két segítségi lépcső**

1. Tört szorzásánál a számlálókat és nevezőket külön szorozzuk.
2. A 0,2 alak 2/10. A négyzetben a nevező is kétszer tényező.

**Részletes megoldás**

1. `(1/2)³ = 1/8` — Három fél tényező összeszorzása.

2. `(3/2)² = 9/4 = 2,25` — Mind a 3-at, mind a 2-t négyzetre emeljük a szorzásban.

3. `0,2² = 4/100 = 0,04` — Két tizednyi tényező századnyi részeket ad.

**Megőrzendő gondolat:** A 0 és 1 közötti pozitív szám ismételt önmagával szorzásakor kisebb értéket kapunk.

**Saját indoklás:** Miért ésszerű, hogy 0,2² kisebb 0,2-nél?

**Önellenőrzési szempontok az indokláshoz**

- A 0,2-nek a 0,2-szeresét, azaz egyötödét vesszük.
- Nem egy teljes 0,2-t adunk hozzá, hanem annak részét keressük.

**Célzott hibajavítás**

| Mező      | Jellemző hibás bevitel | Visszajelzés                                                           |
| --------- | ---------------------- | ---------------------------------------------------------------------- |
| `half`    | `3/2`                  | A fél háromszori összeadása más művelet. Itt 1/2 × 1/2 × 1/2 szerepel. |
| `decimal` | `0.4`                  | A 0,2 + 0,2 összeadás 0,4. A szorzat 2/10 × 2/10 = 4/100.              |

### H07-G06 — 6. gyakorlófeladat

**Alkalmazásazonosító:** `hatvanyok-practice-6`.

Egy négyzet oldala 7 cm, egy másik test, egy kocka éle 3 cm. Add meg a négyzet területét és a kocka térfogatát. Hányszorosra változna a terület, illetve a térfogat, ha az adott alakzat minden hosszát megdupláznánk?

**Válaszmezők, helyes alakok és készségek**

| Mező           | Kérdés                                | Helyes válasz / elfogadott kifejezésalakok | Készség            | Szükséges korábbi részek |
| -------------- | ------------------------------------- | ------------------------------------------ | ------------------ | ------------------------ |
| `area`         | A négyzet területe (cm²)              | `49` cm²                                   | `hatvany-jelentes` | —                        |
| `volume`       | A kocka térfogata (cm³)               | `27` cm³                                   | `hatvany-jelentes` | —                        |
| `areaFactor`   | Terület szorzója kétszeres oldalaknál | `4`                                        | `hatvany-jelentes` | —                        |
| `volumeFactor` | Térfogat szorzója kétszeres éleknél   | `8`                                        | `hatvany-jelentes` | —                        |

**Két segítségi lépcső**

1. A négyzethez két, a kockához három egyenlő hossz tényező tartozik.
2. A nagyítás szorzója területnél 2², térfogatnál 2³.

**Részletes megoldás**

1. `7² = 49 cm²; 3³ = 27 cm³` — A mérőszám mellett az egység is négyzetre vagy köbre kerül.

2. `2² = 4; 2³ = 8` — Két vagy három irányban duplázunk.

3. `14² = 196 = 4 × 49; 6³ = 216 = 8 × 27` — Konkrét értékekkel is ellenőrizhető a szorzó.

**Megőrzendő gondolat:** A hossz, terület és térfogat más hatvány szerint változik.

**Saját indoklás:** Miért nem egyszerűen kétszeres a megduplázott élű kocka térfogata?

**Önellenőrzési szempontok az indokláshoz**

- A kockába két irányban és magasságban is kétszer annyi egység fér.
- Ez nyolc eredeti kocka térfogatát jelenti.

**Célzott hibajavítás**

| Mező           | Jellemző hibás bevitel | Visszajelzés                                                      |
| -------------- | ---------------------- | ----------------------------------------------------------------- |
| `area`         | `14`                   | A négyzet területe két oldalhossz szorzata, nem kétszer az oldal. |
| `areaFactor`   | `2`                    | A hossz két irányban is kétszeres: 2 × 2 a terület szorzója.      |
| `volumeFactor` | `6`                    | A három kétszerezést összeszorozzuk: 2 × 2 × 2, nem összeadjuk.   |

### H07-G07 — 7. gyakorlófeladat

**Alkalmazásazonosító:** `hatvanyok-practice-7`.

Írd számként: 10³ és 10⁶. Hányszorosa a 10⁶ a 10³-nak?

**Válaszmezők, helyes alakok és készségek**

| Mező       | Kérdés    | Helyes válasz / elfogadott kifejezésalakok | Készség                           | Szükséges korábbi részek |
| ---------- | --------- | ------------------------------------------ | --------------------------------- | ------------------------ |
| `thousand` | 10³       | `1000`                                     | `hatvany-jelentes`, `nagysagrend` | —                        |
| `million`  | 10⁶       | `1000000`                                  | `hatvany-jelentes`, `nagysagrend` | —                        |
| `ratio`    | 10⁶ : 10³ | `1000`                                     | `nagysagrend`                     | —                        |

**Két segítségi lépcső**

1. Minden új tízes tényező tízszeres értéket ad.
2. 1 000 000 : 1 000-et számolj; három tízes tényező marad.

**Részletes megoldás**

1. `10³ = 1000; 10⁶ = 1 000 000` — A tízes helyiérték-rendszer hatványai.

2. `1 000 000 : 1000 = 1000` — Az osztó ezerszer fér az osztandóba.

**Megőrzendő gondolat:** Három helyiértéknyi különbség itt ezerszeres szorzót jelent.

**Saját indoklás:** Hogyan ellenőrizhető a kapott 1000?

**Önellenőrzési szempontok az indokláshoz**

- 1000 × 1000 = 1 000 000.
- A visszaszorzás visszaadja az osztandót.

**Célzott hibajavítás**

| Mező       | Jellemző hibás bevitel | Visszajelzés                                                                  |
| ---------- | ---------------------- | ----------------------------------------------------------------------------- |
| `thousand` | `30`                   | Három tízes tényezőt szorzunk össze.                                          |
| `ratio`    | `2`                    | A kitevők hányadosa nem a számok hányadosa. Egymillióban ezer darab ezer van. |

### H07-G08 — 8. gyakorlófeladat

**Alkalmazásazonosító:** `hatvanyok-practice-8`.

Számítsd ki: 5 × 10⁴ + 2 × 10³ + 7 × 10 + 4. Az 503 000 felbontásában mennyi a 10⁵ és a 10³ együtthatója?

**Válaszmezők, helyes alakok és készségek**

| Mező               | Kérdés                          | Helyes válasz / elfogadott kifejezésalakok | Készség       | Szükséges korábbi részek |
| ------------------ | ------------------------------- | ------------------------------------------ | ------------- | ------------------------ |
| `value`            | A megadott összeg               | `52074`                                    | `nagysagrend` | —                        |
| `hundredThousands` | 10⁵ együtthatója az 503 000-ben | `5`                                        | `nagysagrend` | —                        |
| `thousands`        | 10³ együtthatója az 503 000-ben | `3`                                        | `nagysagrend` | —                        |

**Két segítségi lépcső**

1. Előbb számold ki külön a helyiértéknyi részeket.
2. 50 000 + 2000 + 70 + 4 az első összeg. Az 503 000 = 500 000 + 3000.

**Részletes megoldás**

1. `50 000 + 2000 + 70 + 4 = 52 074` — A hiányzó százas hely értéke nulla.

2. `503 000 = 5 × 10⁵ + 3 × 10³` — A számjegyek a megadott helyi értékek darabszámát mondják meg.

**Megőrzendő gondolat:** A tíz hatványa az egységet, az együttható az egységek számát mutatja.

**Saját indoklás:** Mit jelez a nulla az 503 000 tízezres helyén?

**Önellenőrzési szempontok az indokláshoz**

- Nincs külön tízezres tag a felbontásban.
- A helyét mégis meg kell őrizni, különben más számot írnánk.

**Célzott hibajavítás**

| Mező        | Jellemző hibás bevitel | Visszajelzés                                                                 |
| ----------- | ---------------------- | ---------------------------------------------------------------------------- |
| `value`     | `5274`                 | 10⁴ tízezer, 10³ ezer. A százezer alatti, ötvenezer körüli értéket keressük. |
| `thousands` | `30`                   | A 10³ már ezret jelent. Három ilyen helyiértéknyi egység ad 3000-et.         |

### H07-G09 — 9. gyakorlófeladat

**Alkalmazásazonosító:** `hatvanyok-practice-9`.

Számítsd ki pontosan: 0,047 × 10³, 62 000 : 10² és 1,2 × 10⁴.

**Válaszmezők, helyes alakok és készségek**

| Mező     | Kérdés       | Helyes válasz / elfogadott kifejezésalakok | Készség       | Szükséges korábbi részek |
| -------- | ------------ | ------------------------------------------ | ------------- | ------------------------ |
| `first`  | 0,047 × 10³  | `47`                                       | `nagysagrend` | —                        |
| `second` | 62 000 : 10² | `620`                                      | `nagysagrend` | —                        |
| `third`  | 1,2 × 10⁴    | `12000`                                    | `nagysagrend` | —                        |

**Két segítségi lépcső**

1. A tíz hatványát előbb nevezd meg számként.
2. Ezerszeres, századrész és tízezerszeres változtatás történik.

**Részletes megoldás**

1. `0,047 × 1000 = 47` — Három helyiértékkel nagyobb értéket kapunk.

2. `62 000 : 100 = 620` — Száz egyenlő rész egyikét keressük.

3. `1,2 × 10 000 = 12 000` — A tizedes mérőszám is pontosan skálázható.

**Megőrzendő gondolat:** A helyiérték-váltás a szorzó vagy osztó nagyságából következik.

**Saját indoklás:** Melyik eredményt ellenőriznéd visszaosztással?

**Önellenőrzési szempontok az indokláshoz**

- Például 47 : 1000 = 0,047.
- A szorzás és osztás egymás visszafelé végzett művelete lehet.

**Célzott hibajavítás**

| Mező     | Jellemző hibás bevitel | Visszajelzés                                 |
| -------- | ---------------------- | -------------------------------------------- |
| `first`  | `4.7`                  | Ez csak százas szorzó lenne; 10³ = 1000.     |
| `second` | `6200`                 | Ez tízzel osztás eredménye volna. 10² = 100. |

### H07-G10 — 10. gyakorlófeladat

**Alkalmazásazonosító:** `hatvanyok-practice-10`.

A 198 × 51-et előbb a 200 × 50-nel becsüljük. Add meg ezt a becslést, a pontos szorzatot és a pontos értéknek a becsléshez képesti többletét.

**Válaszmezők, helyes alakok és készségek**

| Mező         | Kérdés                              | Helyes válasz / elfogadott kifejezésalakok | Készség                           | Szükséges korábbi részek |
| ------------ | ----------------------------------- | ------------------------------------------ | --------------------------------- | ------------------------ |
| `estimate`   | Becslés a megadott 200 × 50 alapján | `10000`                                    | `nagysagrend`                     | —                        |
| `exact`      | 198 × 51 pontosan                   | `10098`                                    | `hatvany-jelentes`, `nagysagrend` | —                        |
| `difference` | Pontos érték mínusz becslés         | `98`                                       | `nagysagrend`                     | `estimate`, `exact`      |

**Két segítségi lépcső**

1. A becslésnél a feladat által megadott közeli számokat használd.
2. Pontosan: 198 × (50 + 1) = 9900 + 198.

**Részletes megoldás**

1. `200 × 50 = 10 000` — Ez a kijelölt becslés.

2. `198 × 51 = 10 098` — A pontos szorzást széttagolva végezzük.

3. `10 098 − 10 000 = 98` — A közelítés és pontos érték eltérését mérjük.

**Megőrzendő gondolat:** A becslést közelítő jel, a pontos számolást egyenlőségjel fejezi ki.

**Saját indoklás:** Bizonyítja-e a jó nagyságrend az összes számjegy helyességét?

**Önellenőrzési szempontok az indokláshoz**

- Nem; több közeli, de hibás szám is hasonló nagyságú.
- A becslés egy ellenőrzési eszköz a pontos számolás mellett.

**Célzott hibajavítás**

| Mező    | Jellemző hibás bevitel | Visszajelzés                                                              |
| ------- | ---------------------- | ------------------------------------------------------------------------- |
| `exact` | `100980`               | Ez tízszer akkora, mint a becslés környéke. Ellenőrizd a helyi értékeket. |

### H07-G11 — 11. gyakorlófeladat

**Alkalmazásazonosító:** `hatvanyok-practice-11`.

Hasonlítsd össze: (2 + 3)² és 2² + 3². Számítsd ki mindkettőt és az elsőnek a másodikhoz képesti többletét.

**Válaszmezők, helyes alakok és készségek**

| Mező         | Kérdés                 | Helyes válasz / elfogadott kifejezésalakok | Készség            | Szükséges korábbi részek |
| ------------ | ---------------------- | ------------------------------------------ | ------------------ | ------------------------ |
| `whole`      | (2 + 3)²               | `25`                                       | `hatvany-jelentes` | —                        |
| `separate`   | 2² + 3²                | `13`                                       | `hatvany-jelentes` | —                        |
| `difference` | A két érték különbsége | `12`                                       | `hatvany-jelentes` | `whole`, `separate`      |

**Két segítségi lépcső**

1. Keresd meg, pontosan melyik részre vonatkozik a négyzet.
2. Az első 5 × 5; a második 4 + 9.

**Részletes megoldás**

1. `(2 + 3)² = 25` — A teljes összeg négyzete.

2. `2² + 3² = 4 + 9 = 13` — A tagok négyzeteinek összege más szerkezet.

3. `25 − 13 = 12` — Konkrét ellenpélda a négyzet összegre való hibás szétosztására.

**Megőrzendő gondolat:** A szorzás széttagolhatóságából nem következik, hogy a négyzet összeadásra is szétosztható.

**Saját indoklás:** Mit mutatna egy 5 × 5-ös négyzet 2 és 3 hosszú részekre osztása?

**Önellenőrzési szempontok az indokláshoz**

- A 2 × 2 és 3 × 3 négyzet mellett két 2 × 3 téglalap is megjelenik.
- Ezek területe együtt 12, ami hiányzik a 4 + 9 összegből.

**Célzott hibajavítás**

| Mező       | Jellemző hibás bevitel | Visszajelzés                                           |
| ---------- | ---------------------- | ------------------------------------------------------ |
| `whole`    | `13`                   | Itt az egész összeg az alap: előbb 2 + 3 = 5, majd 5². |
| `separate` | `25`                   | Ebben az alakban két külön négyzetet adunk össze.      |

### H07-G12 — 12. gyakorlófeladat

**Alkalmazásazonosító:** `hatvanyok-practice-12`.

Kitekintés: nagy pozitív számok normálalakja. Írd számként a 3,2 × 10⁵ értékét. A 4 700 000 = a × 10ⁿ alakban keresd a-t és a pozitív egész n-et úgy, hogy 1 ≤ a < 10.

**Válaszmezők, helyes alakok és készségek**

| Mező          | Kérdés           | Helyes válasz / elfogadott kifejezésalakok | Készség                           | Szükséges korábbi részek |
| ------------- | ---------------- | ------------------------------------------ | --------------------------------- | ------------------------ |
| `value`       | 3,2 × 10⁵ értéke | `320000`                                   | `nagysagrend`                     | —                        |
| `coefficient` | a értéke         | `47/10`                                    | `nagysagrend`                     | —                        |
| `exponent`    | n értéke         | `6`                                        | `nagysagrend`, `hatvany-jelentes` | —                        |

**Két segítségi lépcső**

1. A 10⁵ százezer; a 3,2 ennek a szorzója.
2. A 4,7-et egymillióval kell szorozni, hogy 4 700 000 legyen.

**Részletes megoldás**

1. `3,2 × 100 000 = 320 000` — A hatványt számként is felírjuk.

2. `4 700 000 = 4,7 × 10⁶` — A szorzó a kívánt 1 és 10 közötti tartományba kerül.

3. `1 ≤ 4,7 < 10` — Az érték mellett a kért alak feltétele is teljesül.

**Megőrzendő gondolat:** Egy értéknek több hatványos alakja lehet; a normálalak külön formai feltételt is ad.

**Saját indoklás:** Miért értékben helyes, de nem a kért normálalak a 47 × 10⁵?

**Önellenőrzési szempontok az indokláshoz**

- A szorzata ugyanúgy 4 700 000.
- A 47 azonban nem kisebb 10-nél.

**Célzott hibajavítás**

| Mező          | Jellemző hibás bevitel | Visszajelzés                                                                          |
| ------------- | ---------------------- | ------------------------------------------------------------------------------------- |
| `coefficient` | `47`                   | A kért normálalakban a szorzó kisebb 10-nél; 47 nem teljesíti ezt a formai feltételt. |
| `exponent`    | `5`                    | 4,7 × 10⁵ csak 470 000; itt tízszer akkora számot kell visszakapni.                   |

## 7. Önálló próba

Először a segítségek és a megoldás megnyitása nélkül próbálkozz. Az alkalmazás külön kezeli az önállóan és segítséggel elért eredményt. A két feladat nem a teljes modul vagy a teljes évfolyam tudásának vizsgája.

### H07-Z01 — 1. önálló próbafeladat

**Alkalmazásazonosító:** `hatvanyok-exit-1`.

Számítsd ki a −4² + (−2)³ kifejezést. Add meg külön a két tagot, majd az összeget.

**Válaszmezők, helyes alakok és készségek**

| Mező     | Kérdés             | Helyes válasz / elfogadott kifejezésalakok | Készség                              | Szükséges korábbi részek |
| -------- | ------------------ | ------------------------------------------ | ------------------------------------ | ------------------------ |
| `first`  | Első tag: −4²      | `-16`                                      | `hatvany-elojel`                     | —                        |
| `second` | Második tag: (−2)³ | `-8`                                       | `hatvany-elojel`, `hatvany-jelentes` | —                        |
| `sum`    | Teljes összeg      | `-24`                                      | `hatvany-elojel`, `hatvany-jelentes` | `first`, `second`        |

**Két segítségi lépcső**

1. Az elsőben a 4-et négyzetre emeljük, majd az ellentettjét vesszük.
2. A másodikban három darab −2-t szorzunk össze.

**Részletes megoldás**

1. `−4² = −16; (−2)³ = −8` — A hatványalap és a külső előjel külön kérdés.

2. `−16 + (−8) = −24` — Két negatív tag összege negatív.

**Megőrzendő gondolat:** Előbb a hatványok jelentését tisztázd, utána végezd az összegzést.

**Saját indoklás:** Hogyan változna az eredmény, ha az első tag (−4)² lenne?

**Önellenőrzési szempontok az indokláshoz**

- Az első tag +16-ra változna.
- A teljes összeg akkor 16 − 8 = 8 lenne.

**Célzott hibajavítás**

| Mező    | Jellemző hibás bevitel | Visszajelzés                                               |
| ------- | ---------------------- | ---------------------------------------------------------- |
| `first` | `16`                   | A mínusz a 4² elé kerül; nem a (−4)² alak szerepel.        |
| `sum`   | `8`                    | Az első tag is negatív, ezért −16 és −8 összegét keressük. |

### H07-Z02 — 2. önálló próbafeladat

**Alkalmazásazonosító:** `hatvanyok-exit-2`.

Egy egyszerű adatmodellben egy csomag pontosan 2⁸ bájtot foglal. Ezer egyforma csomagot tárolunk, további helyigény nincs. Mennyi egy csomag és az ezer csomag mérete? Becsüld a teljes méretet csomagonként 250 bájttal is.

**Válaszmezők, helyes alakok és készségek**

| Mező       | Kérdés                                  | Helyes válasz / elfogadott kifejezésalakok | Készség                           | Szükséges korábbi részek |
| ---------- | --------------------------------------- | ------------------------------------------ | --------------------------------- | ------------------------ |
| `one`      | Egy csomag mérete (bájt)                | `256` bájt                                 | `hatvany-jelentes`                | —                        |
| `total`    | Ezer csomag pontos mérete (bájt)        | `256000` bájt                              | `nagysagrend`, `hatvany-jelentes` | —                        |
| `estimate` | Becslés csomagonként 250 bájttal (bájt) | `250000` bájt                              | `nagysagrend`                     | —                        |

**Két segítségi lépcső**

1. A 2 hatványain haladva minden lépésben kétszerezünk.
2. 2⁸ = 256. Az ezer darabhoz ezerszeres méret tartozik.

**Részletes megoldás**

1. `2⁸ = 256 bájt` — A hatvány tényezőit összeszorozzuk.

2. `1000 × 256 = 256 000 bájt` — Az azonos csomagok mérete összeadódik.

3. `1000 × 250 = 250 000 bájt` — A megadott becslőértékkel közelítő teljes méretet kapunk.

**Megőrzendő gondolat:** A hatvány jelentése és a nagyságrend valószerű adatmennyiségek értelmezésében is használható.

**Saját indoklás:** Miért kell kimondani, hogy nincs további helyigény?

**Önellenőrzési szempontok az indokláshoz**

- Csak így elég az egy csomagra megadott méretet a csomagszámmal szorozni.
- A számolás a megadott egyszerű modellre vonatkozik.

**Célzott hibajavítás**

| Mező  | Jellemző hibás bevitel | Visszajelzés                            |
| ----- | ---------------------- | --------------------------------------- |
| `one` | `16`                   | A 2⁸ nyolc darab 2 szorzata, nem 2 × 8. |

## 8. Összefoglalás és fogalomtár

- Pozitív egész kitevőnél az alap ismétlődik tényezőként.
- A kitevő nem szorzója az alapnak.
- A (−a)² és −a² más szerkezet; a zárójel számít.
- A négyzet területet, a köb térfogatot is leírhat, megfelelő egységgel.
- Becsléskor ≈, pontos egyenlőségnél = jel használható.

| Fogalom                 | Jelentés                                                                                                                                                 |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hatvány                 | Pozitív egész kitevőnél ismételt szorzás; az ettől eltérő kitevőkhöz külön szabály és feltétel tartozik, amelyet a műhely rövid kitekintésben mutat meg. |
| Alap                    | A hatványban ismétlődő tényező.                                                                                                                          |
| Kitevő                  | Pozitív egész esetben megmondja, hány darab alapot szorzunk össze.                                                                                       |
| Négyzet                 | Egy szám második hatványa; pozitív hossz mellett a négyzet területének mérőszáma is lehet.                                                               |
| Köb                     | Egy szám harmadik hatványa; pozitív hossz mellett a kocka térfogatának mérőszáma is lehet.                                                               |
| Nagyságrendi ellenőrzés | Annak vizsgálata, hogy az eredmény a várható méret környékén van-e; például nem lett-e tízszeres a helyiérték-hiba miatt.                                |
| Normálalak              | a × 10ⁿ alak, ahol 1 ≤ \|a\| < 10; itt pozitív a-val és pozitív egész n-nel csak a nagy számok alapozó példáit tárgyaljuk.                               |

## 9. Determinisztikus, változatos gyakorlás

A [generátorforrás](../../app/src/math/bridge-generators.ts) a családazonosító, seed és változat alapján ismételhető feladatot állít elő. Azonos bemenethez azonos kérdés, válasz, segítség és megoldás tartozik; a seed és a változat negatív biztonságos egész is lehet. A témán belüli sorrend a következő:

| Témán belüli index | Családazonosító      | Tartalom                               | Készségek                            |
| ------------------ | -------------------- | -------------------------------------- | ------------------------------------ |
| 0                  | `power-expand-v1`    | A hatványból ismételt szorzás          | `hatvany-jelentes`                   |
| 1                  | `power-sign-v1`      | Negatív alap vagy külső mínusz         | `hatvany-elojel`, `hatvany-jelentes` |
| 2                  | `power-ten-scale-v1` | Adatméret és két szomszédos tízhatvány | `nagysagrend`, `hatvany-jelentes`    |

A függő ellenőrző rész mezői a generált feladatban is együtt maradnak a szükséges előzményekkel. A családok nem pusztán a rögzített feladatok végértékét cserélik: az adott témához illő paramétertartományokkal, több kapcsolódó részválasszal és feladattípusnak megfelelő feltételekkel dolgoznak.

**A generált ellenőrző csoportok részfüggőségei**

- `power-sign-v1` / `equal` → `negativeBase`, `outsideMinus`

## 10. Azonosítók és válaszszerződés

A kézirat és az alkalmazás közötti megfeleltetés az [új lecketartalom](../../app/src/content/bridge-lessons.ts) `bridgeManuscriptMap` exportjában is szerepel. J = jóslás, P = kidolgozott példa, G = gyakorlás, Z = önálló próba. A példák sorrendjéhez tartozik a két P-azonosító; az alkalmazásban a példák nem válaszbekérő feladatrekordok.

| Kéziratazonosító | Alkalmazásbeli rekord   | Külön ellenőrzött mezők                               |
| ---------------- | ----------------------- | ----------------------------------------------------- |
| `H07-J01`        | `hatvanyok-prediction`  | `square`, `cube`                                      |
| `H07-G01`        | `hatvanyok-practice-1`  | `base`, `exponent`, `expanded`, `value`               |
| `H07-G02`        | `hatvanyok-practice-2`  | `first`, `second`, `difference`                       |
| `H07-G03`        | `hatvanyok-practice-3`  | `negativeSquare`, `oppositeSquare`, `outside`, `cube` |
| `H07-G04`        | `hatvanyok-practice-4`  | `even`, `odd`, `zero`, `one`                          |
| `H07-G05`        | `hatvanyok-practice-5`  | `half`, `threeHalves`, `decimal`                      |
| `H07-G06`        | `hatvanyok-practice-6`  | `area`, `volume`, `areaFactor`, `volumeFactor`        |
| `H07-G07`        | `hatvanyok-practice-7`  | `thousand`, `million`, `ratio`                        |
| `H07-G08`        | `hatvanyok-practice-8`  | `value`, `hundredThousands`, `thousands`              |
| `H07-G09`        | `hatvanyok-practice-9`  | `first`, `second`, `third`                            |
| `H07-G10`        | `hatvanyok-practice-10` | `estimate`, `exact`, `difference`                     |
| `H07-G11`        | `hatvanyok-practice-11` | `whole`, `separate`, `difference`                     |
| `H07-G12`        | `hatvanyok-practice-12` | `value`, `coefficient`, `exponent`                    |
| `H07-Z01`        | `hatvanyok-exit-1`      | `first`, `second`, `sum`                              |
| `H07-Z02`        | `hatvanyok-exit-2`      | `one`, `total`, `estimate`                            |

A számmezők racionális értéket és szükség szerint egységet ellenőriznek; a magyar tizedesvessző használható. A kifejezésmező véges, szerző által megadott helyes alakokat fogad el, ezért a feladat pontosan kéri a választandó szerkezetet. Ez nem általános számítógépes algebrai rendszer, és nem futtatja a bevitt szöveget kódként. A gyökjeles alaknál a jelölés és az eredeti gyök alatti szám megőrzése a cél.

A táblázatok „Szükséges korábbi részek” oszlopa a `requiresParts` kapcsolatot mutatja. A függő részhez tartozó készségbizonyíték csak ugyanabban az ellenőrzésben helyes előzménylánc mellett számít. Így a közölt teljes összeg visszamásolása önmagában nem igazolja a modell visszaellenőrzését. A szükséges kapcsolat tranzitív: ha az egyezőséghez négyzet, a négyzethez kerekített oldal kell, mindkettő az ellenőrző csoport része. Az egymástól független helyettesítésekhez nem írunk elő mesterséges sorrendet.

## 11. Egységszintű lefedettség és korlátok

| Lefedett egység | Az aktuális tématérkép megnevezése                  |
| --------------- | --------------------------------------------------- |
| `M07.01`        | Pozitív egész alap és kitevő mint ismételt szorzás. |
| `M07.02`        | Négyzetszámok, köbszámok és geometriai jelentés.    |

Teljesnek csak az M07.01 és M07.02 egységet jelöljük. M07.03: a normálalaknak csak a nagy pozitív számokhoz tartozó alapozása van jelen. M07.04: az általános hatványazonosságok teljes levezetése és gyakorlása még hiányzik. M07.05: a nulla és negatív kitevő a műhelyben rövid kitekintés, nem önálló, teljesen ellenőrzött egység.

## 12. Ellenőrzési alap és tartalmi mérleg

Ebben az útban 15 kérdésrekord szerepel: 1 jósló belépő, 12 gyakorló és 2 önálló próbafeladat. Ehhez 48 külön ellenőrzött válaszmező, 30 szerzői célzott hibaszabály, 2 kidolgozott példa és 3 generátorcsalád tartozik. Ezek az aktuális adatmodellből számított darabszámok.

A [tartalmi tesztek](../../app/tests/bridge-content.test.ts) a szerzői válaszokat a feladatok adataiból felírt, külön racionális számításokkal vetik össze; a kifejezésváltozatokat külön matematikai értelmező ellenőrzi. Vizsgálják a célzott hibajavítás tényleges üzenetét, a részfüggőségek érvényességét, a fogalmi korlátokat és a kézirat–alkalmazás kapcsolatot. A [generátortesztek](../../app/tests/bridge-generators.test.ts) családonként 200 feladat látható szövegéből külön számolják újra az eredményeket; a teljes négy témában további 252 szélső/negatív seed–változat visszajátszás is szerepel.

Az automatikus matematikai és működési ellenőrzés a tartalom pontosságáról és a végrehajtásról ad bizonyítékot. A tanulási hatás, a nyelvezet életkori megfelelősége és a valódi tanórai időigény tanári–tanulói kipróbálással vizsgálandó.
