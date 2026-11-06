# Négyzetgyök — teljes tananyag és alkalmazásbeli azonosítók

A Matek8 0.3.0 fejlesztési ciklusához tartozó, az alkalmazás adataival összehangolt kézirat. Témaazonosító: `negyzetgyok`. A fájl a teljes magyarázatot, példákat, feladatokat, segítségeket, megoldásokat és hibavisszajelzéseket tartalmazza.

A tanulói út: **Jósolj → Próbáld ki → Értsd meg → Nézd a példát → Gyakorolj → Önálló próba**. A becsült 55 perc tervezési támpont; az út több alkalomra osztható. Tanári és tanulói kipróbálás nélkül nem állítjuk, hogy minden tanulónál bizonyított megértést eredményez.

## 1. Cél, előismeret és hatókör

**Indító kérdés:** Melyik nemnegatív szám négyzete az adott szám, és hogyan közelíthetjük, ha nem egész?

A gyökjel egyetlen nemnegatív számot jelöl. Elkülönítjük ezt a négyzetes egyenlet megoldásaitól, majd négyzetszámok és pontos összehasonlítások segítségével becslünk és kerekítünk.

A nemnegatív négyzetgyök jelentését megkülönböztetjük az x² = a egyenlet összes valós megoldásától. A √(a²) = |a| kapcsolat negatív és nulla értékkel is szerepel. A becslést pontos négyzet-összehasonlítás, a kerekítést a felezőpont vizsgálata indokolja. A pontos gyökjel és a közelített tizedes alak külön válaszforma.

**Tanulási célok**

- A nemnegatív négyzetgyök jelentését területből oldalhossz visszakeresésével magyarázod.
- Megkülönbözteted a √a értékét az x² = a egyenlet valós megoldásaitól.
- Felismered és értelmezed a √(a²) = |a| kapcsolatot.
- Négyzetre emeléssel ellenőrzöd a gyök egész vagy tizedes korlátait.
- A pontos gyökjeles alakot elkülöníted a megadott pontosságú közelítéstől.

**Előismeretek**

- Négyzetszámok, előjelek és abszolút érték.
- Tizedesek szorzása, területegység és oldalhossz megkülönböztetése.

**Megnyitható előismereti témák:** `hatvanyok`, `szamfogalom`, `mertekegysegek`.

**Továbblépés:** `pitagorasz`.

## 2. Jósolj

### GY08-J01 — Jósló belépő

**Alkalmazásazonosító:** `negyzetgyok-prediction`.

Mennyi √36? Melyik két valós szám teljesíti az x² = 36 egyenletet? A két megoldást növekvő sorrendben add meg.

**Válaszmezők, helyes alakok és készségek**

| Mező      | Kérdés                    | Helyes válasz / elfogadott kifejezésalakok | Készség                | Szükséges korábbi részek |
| --------- | ------------------------- | ------------------------------------------ | ---------------------- | ------------------------ |
| `root`    | √36 értéke                | `6`                                        | `negyzetgyok-jelentes` | —                        |
| `smaller` | x² = 36 kisebb megoldása  | `-6`                                       | `negyzetgyok-jelentes` | —                        |
| `larger`  | x² = 36 nagyobb megoldása | `6`                                        | `negyzetgyok-jelentes` | —                        |

**Két segítségi lépcső**

1. Két ellentett szám négyzete azonos lehet.
2. 6² = 36 és (−6)² = 36, de a gyökjelhez a nemnegatív értéket választjuk.

**Részletes megoldás**

1. `√36 = 6` — A négyzetgyök definíciója nemnegatív értéket jelöl ki.

2. `x = −6 vagy x = 6` — Az egyenlet mindkét előjelű számot megengedi.

3. `(−6)² = 6² = 36` — Mindkét megoldást behelyettesítéssel ellenőrizzük.

**Megőrzendő gondolat:** Egy gyökjel értéke és egy egyenlet összes megoldása két külön kérdés.

**Saját indoklás:** Miért nem írjuk, hogy √36 = ±6?

**Önellenőrzési szempontok az indokláshoz**

- A √ jel egyetlen nemnegatív számot jelöl.
- A ±6 a két egyenletmegoldás tömör felsorolása lehet, nem a gyökjel értéke.

**Célzott hibajavítás**

| Mező   | Jellemző hibás bevitel | Visszajelzés                                                                               |
| ------ | ---------------------- | ------------------------------------------------------------------------------------------ |
| `root` | `-6`                   | A gyökjel a nemnegatív négyzetgyököt jelöli. A −6 az egyenlet egyik megoldása, de nem √36. |

## 3. Próbáld ki — az interaktív műhely matematikai menete

A műhely működő alkalmazásrésze az [interaktív forrásban](../../app/src/interactives/BridgeLabs.tsx), pontos számolási modellje a [műhelymodellben](../../app/src/math/bridge-models.ts) található. Az alábbi megfigyelések a lecke fogalmait kötik össze a kezelhető állapotokkal.

1. Add meg egy négyzet területét, és először jósolj az oldalra. A gyökjel a nemnegatív oldalt nevezi meg. Negatív bemenetnél a valós számok között nincs értelmezett négyzetgyök; a felület ezt szöveggel jelzi.
2. Keresd meg a két határt, és négyzetre emeléssel ellenőrizd azokat. Például 1² < 2 < 2² miatt 1 < √2 < 2. Finomítsd a határokat a választott pontossághoz.
3. A kerekítést a két szomszédos lehetőség felezőpontjával vizsgáld. A közelítő oldal négyzete kis mértékben eltérhet a pontos területtől; a pontos gyökjeles alak viszont megőrzi azt.
4. Hasonlítsd össze √36 = 6 és x² = 36 két megoldását, −6-ot és 6-ot. Nulla jobb oldalnál egy megoldás van; negatív jobb oldalnál nincs valós megoldás.
5. Állíts be negatív a-t is a √(a²) kapcsolatban. Például a = −5 esetén az eredmény 5, ezért az általános alak |a|. A négyzet és gyök egymás utáni alkalmazása nem őrzi meg az eredeti negatív előjelet.

A saját szavas magyarázatot a program nem osztályozza automatikusan. A tanuló a felsorolt szempontokhoz viszonyíthatja a saját gondolatát; az elmentés külön döntés. Az automatikusan ellenőrzött szám vagy kifejezés helyessége nem bizonyítja önmagában a magyarázat megértését.

## 4. Értsd meg — teljes magyarázat

### 4.1. A gyökjel nemnegatív számot nevez meg

Ha egy négyzet területe 49 cm², az oldala 7 cm, mert 7 × 7 = 49. A √49 az a nemnegatív szám, amelynek a négyzete 49. Nulla gyöke nulla. Negatív számnak a valós számok között nincs négyzetgyöke, mert egy valós szám négyzete nem lehet negatív.

`√a = b azt jelenti: b ≥ 0 és b² = a; a ≥ 0`

### 4.2. A gyökjel és az egyenlet nem ugyanazt kéri

A √25 egyetlen érték: 5. Az x² = 25 egyenlet viszont azt kérdezi, mely valós számok négyzete 25, ezért −5 és 5 is megoldás. Az x² = 0 csak a 0-t engedi meg. Az x² = −4-nek nincs valós megoldása. Ez a különbség itt fogalmi kitekintés; nem általános másodfokúegyenlet-megoldó eljárás.

`a > 0 esetén x² = a → x = −√a vagy x = √a`

### 4.3. A négyzetből visszakeresve az abszolút értéket kapjuk

A négyzetre emelés elveszíti az eredeti előjel különbségét: 5 és −5 négyzete egyaránt 25. A gyökjel ezután a nemnegatív 5-öt adja vissza. Emiatt √(a²) = |a| minden valós a-ra; csak a ≥ 0 mellett írhatjuk egyszerűen a-t.

`√((−5)²) = √25 = 5 = |−5|`

- Ha a pozitív, |a| = a.
- Ha a negatív, |a| = −a, ami pozitív.
- a = 0 esetén a gyök és az abszolút érték is 0.

### 4.4. Két ismert négyzet közé szorítunk

Mivel 7² = 49 és 8² = 64, a √50 a 7 és 8 közé esik. A nemnegatív számok körében a nagyobb számnak nagyobb a négyzete, így a területek sorrendjéből az oldalak sorrendjére is következtethetünk. Tizedes végpontokkal tovább szűkíthető az intervallum.

`49 < 50 < 64 → 7 < √50 < 8`

### 4.5. A kerekítéshez a felezőpont is számít

Abból, hogy 4,4 < √20 < 4,5, még nem derül ki önmagában, melyik tizedhez van közelebb. A felezőpont 4,45, és 4,45² = 19,8025 < 20. Tehát √20 nagyobb 4,45-nél, ezért egy tizedesre kerekítve 4,5. A négyzetre emelt összehasonlítás pontos, nem találgatás.

`√20 ≈ 4,5 egy tizedesre kerekítve`

### 4.6. A pontos alak és a közelítés együtt hasznos

A √2 pontosan jelöli a keresett számot. Az 1,41 egy két tizedesre kerekített értéke, ezért √2 ≈ 1,41, nem egyenlő vele. Ha a közelítő számot négyzetre emeljük, általában nem kapjuk pontosan vissza a gyök alatti számot. Többlépéses feladatban érdemes a kerekítést a végére hagyni.

`1,41² = 1,9881 ≠ 2`

- A pontos gyökjeles alakot megőrizhetjük a számolásban.
- A végeredmény közelítésénél megmondjuk, hány tizedesre kerekítettünk.
- A mért terület és az oldalhossz egysége különbözik.

### 4.7. A gyököt nem osztjuk szét összeadásra

A √(9 + 16) a 25 gyöke, tehát 5. A √9 + √16 viszont 3 + 4 = 7. Az összeg gyöke általában nem a gyökök összege. Egyetlen ilyen ellenpélda elég az általános hibás szabály cáfolására.

`√(9 + 16) = 5, míg √9 + √16 = 7`

## 5. Nézd a példát

### GY08-P01 — Visszakapjuk-e a negatív előjelet?

Hasonlítsd össze: √((−5)²), √25 és az x² = 25 egyenlet megoldásai.

1. `(−5)² = 25` — Két negatív tényező szorzata pozitív.

2. `√((−5)²) = √25 = 5` — A gyökjel a nemnegatív négyzetgyököt jelöli.

3. `|−5| = 5` — Ezért az általános visszakereső kapcsolat az abszolút értéket adja.

4. `x² = 25 → x = −5 vagy x = 5` — Az egyenlet mindkét valós megoldást kéri, nem csak a nemnegatívat.

**Ellenőrzés:** 5² és (−5)² is 25. A √25 értéke mégis csak 5, mert ezt a gyökjel definíciója rögzíti.

### GY08-P02 — A √30 egy tizedesre

Szorítsd két egész és két szomszédos tized közé a √30-at, majd kerekítsd egy tizedesre.

1. `5² = 25 < 30 < 36 = 6²` — A gyök 5 és 6 közé esik.

2. `5,4² = 29,16; 5,5² = 30,25` — Ezek a szomszédos tizedek közrefogják a 30-hoz tartozó oldalt.

3. `5,45² = 29,7025 < 30` — A gyök a két tized felezőpontjánál nagyobb.

4. `√30 ≈ 5,5` — A nagyobbik szomszédos tizedhez van közelebb.

**Ellenőrzés:** A 5,5² = 30,25 nem pontosan 30, ezért a végeredmény mellé közelítő jelet és a kerekítés pontosságát tesszük.

## 6. Gyakorolj — tizenkét teljes feladat

A feladatszám a gondolkodási egységeket jelenti: egy feladathoz több külön ellenőrzött mező tartozhat. A saját indoklás ezek mellett külön, önellenőrzésre szolgál.

### GY08-G01 — 1. gyakorlófeladat

**Alkalmazásazonosító:** `negyzetgyok-practice-1`.

A nemnegatív négyzetgyök jelentését használva számítsd ki: √0, √1, √49 és √100.

**Válaszmezők, helyes alakok és készségek**

| Mező    | Kérdés | Helyes válasz / elfogadott kifejezésalakok | Készség                | Szükséges korábbi részek |
| ------- | ------ | ------------------------------------------ | ---------------------- | ------------------------ |
| `zero`  | √0     | `0`                                        | `negyzetgyok-jelentes` | —                        |
| `one`   | √1     | `1`                                        | `negyzetgyok-jelentes` | —                        |
| `seven` | √49    | `7`                                        | `negyzetgyok-jelentes` | —                        |
| `ten`   | √100   | `10`                                       | `negyzetgyok-jelentes` | —                        |

**Két segítségi lépcső**

1. Melyik nemnegatív szám négyzete a megadott érték?
2. 0² = 0; 1² = 1; 7² = 49; 10² = 100.

**Részletes megoldás**

1. `√0 = 0; √1 = 1` — A definíció a nullára és egyre is alkalmazható.

2. `√49 = 7; √100 = 10` — A négyzetre emeléssel visszakapjuk a gyök alatti számot.

**Megőrzendő gondolat:** A gyök nem felezést, hanem a négyzethez tartozó nemnegatív érték visszakeresését jelenti.

**Saját indoklás:** Hogyan ellenőriznéd egyetlen művelettel a √49 válaszát?

**Önellenőrzési szempontok az indokláshoz**

- A kapott 7-et négyzetre emelem.
- 7² = 49 és 7 nemnegatív.

**Célzott hibajavítás**

| Mező  | Jellemző hibás bevitel | Visszajelzés                                                                             |
| ----- | ---------------------- | ---------------------------------------------------------------------------------------- |
| `one` | `-1`                   | Bár (−1)² = 1, a gyökjel a nemnegatív értéket választja.                                 |
| `ten` | `50`                   | A gyökvonás nem felezés. Olyan nemnegatív számot keresünk, amely önmagával szorozva 100. |

### GY08-G02 — 2. gyakorlófeladat

**Alkalmazásazonosító:** `negyzetgyok-practice-2`.

Számítsd ki pontosan: √(9/16), √0,81 és √2,25. Minden válasz nemnegatív legyen.

**Válaszmezők, helyes alakok és készségek**

| Mező       | Kérdés  | Helyes válasz / elfogadott kifejezésalakok | Készség                | Szükséges korábbi részek |
| ---------- | ------- | ------------------------------------------ | ---------------------- | ------------------------ |
| `fraction` | √(9/16) | `3/4`                                      | `negyzetgyok-jelentes` | —                        |
| `decimal`  | √0,81   | `9/10`                                     | `negyzetgyok-jelentes` | —                        |
| `larger`   | √2,25   | `3/2`                                      | `negyzetgyok-jelentes` | —                        |

**Két segítségi lépcső**

1. Próbáld visszaemelni négyzetre a jelölt válaszodat.
2. A 9/16 = 3²/4²; 0,81 = 81/100; 2,25 = 225/100.

**Részletes megoldás**

1. `(3/4)² = 9/16` — A pozitív 3/4 ezért a gyök.

2. `0,9² = 0,81; 1,5² = 2,25` — Pontos tizedes szorzással ellenőrzünk.

**Megőrzendő gondolat:** Törteknek és tizedes számoknak is lehet pontos racionális négyzetgyökük.

**Saját indoklás:** Miért nem alkalmazható egy egyszerű 'felezd a számjegyeket' módszer?

**Önellenőrzési szempontok az indokláshoz**

- A gyök definíciója a négyzetre emeléssel kapcsolja össze a számokat.
- A helyes értéket szorzással kell tudni visszaellenőrizni.

**Célzott hibajavítás**

| Mező       | Jellemző hibás bevitel | Visszajelzés                                                   |
| ---------- | ---------------------- | -------------------------------------------------------------- |
| `fraction` | `9/4`                  | A számlálóban is olyan szám kell, amelynek a négyzete 9: ez 3. |
| `decimal`  | `0.09`                 | 0,09² = 0,0081, ami túl kicsi. 0,9² = 0,81.                    |

### GY08-G03 — 3. gyakorlófeladat

**Alkalmazásazonosító:** `negyzetgyok-practice-3`.

Számítsd ki: √((−5)²), √((−2,4)²) és √(0²). Fogalmazd meg, hogyan kapcsolódnak az eredmények az eredeti alap abszolút értékéhez.

**Válaszmezők, helyes alakok és készségek**

| Mező       | Kérdés     | Helyes válasz / elfogadott kifejezésalakok | Készség                | Szükséges korábbi részek |
| ---------- | ---------- | ------------------------------------------ | ---------------------- | ------------------------ |
| `negative` | √((−5)²)   | `5`                                        | `negyzetgyok-jelentes` | —                        |
| `decimal`  | √((−2,4)²) | `12/5`                                     | `negyzetgyok-jelentes` | —                        |
| `zero`     | √(0²)      | `0`                                        | `negyzetgyok-jelentes` | —                        |

**Két segítségi lépcső**

1. Először négyzetre emelünk, utána a nemnegatív gyököt keressük.
2. A köztes értékek: 25, 5,76 és 0.

**Részletes megoldás**

1. `√25 = 5; √5,76 = 2,4; √0 = 0` — Mindegyik gyök nemnegatív.

2. `√(a²) = |a|` — A kapott érték az eredeti szám nullától mért távolsága.

**Megőrzendő gondolat:** A gyökvonás a négyzet előtti szám abszolút értékét adja vissza.

**Saját indoklás:** Mikor írhatjuk a √(a²) helyére egyszerűen a-t?

**Önellenőrzési szempontok az indokláshoz**

- Ha a nemnegatív.
- Negatív a esetén −a a nemnegatív eredmény; általánosan |a| kell.

**Célzott hibajavítás**

| Mező       | Jellemző hibás bevitel | Visszajelzés                                                                          |
| ---------- | ---------------------- | ------------------------------------------------------------------------------------- |
| `negative` | `-5`                   | A négyzet elveszíti az előjel különbségét, a gyökjel pedig a nemnegatív értéket adja. |
| `decimal`  | `-2.4`                 | A √(a²) értéke \|a\|, nem minden a esetén maga a.                                     |

### GY08-G04 — 4. gyakorlófeladat

**Alkalmazásazonosító:** `negyzetgyok-practice-4`.

Oldd meg a valós számok között: x² = 81 és y² = 0. Az első két megoldását növekvő sorrendben írd. Döntsd el azt is, van-e valós megoldása a z² = −4 egyenletnek.

**Válaszmezők, helyes alakok és készségek**

| Mező       | Kérdés                            | Helyes válasz / elfogadott kifejezésalakok | Készség                | Szükséges korábbi részek |
| ---------- | --------------------------------- | ------------------------------------------ | ---------------------- | ------------------------ |
| `smaller`  | x² = 81 kisebb megoldása          | `-9`                                       | `negyzetgyok-jelentes` | —                        |
| `larger`   | x² = 81 nagyobb megoldása         | `9`                                        | `negyzetgyok-jelentes` | —                        |
| `zero`     | y² = 0 megoldása                  | `0`                                        | `negyzetgyok-jelentes` | —                        |
| `negative` | z² = −4 valós megoldásainak száma | Nincs valós megoldás (azonosító: `none`)   | `negyzetgyok-jelentes` | —                        |

A `negative` mező választásai: `none` = Nincs valós megoldás; `one` = Egy valós megoldás; `two` = Két valós megoldás.

**Két segítségi lépcső**

1. Pozitív négyzethez két ellentett alap tartozhat.
2. 9² = (−9)² = 81. Csak a 0 négyzete nulla, negatív négyzetérték pedig nem adódik valós alapból.

**Részletes megoldás**

1. `x = −9 vagy 9; y = 0` — Minden megadott értéket visszahelyettesíthetünk.

2. `z² = −4: nincs valós megoldás` — A valós számok négyzete mindig nemnegatív.

**Megőrzendő gondolat:** A pozitív, nulla és negatív jobb oldal különböző megoldásszámhoz vezet.

**Saját indoklás:** Miért nem két különböző megoldás a +0 és −0?

**Önellenőrzési szempontok az indokláshoz**

- Ugyanazt a számot jelölik.
- Az y² = 0 megoldása ezért egyetlen érték.

**Célzott hibajavítás**

| Mező       | Jellemző hibás bevitel | Visszajelzés                                                                   |
| ---------- | ---------------------- | ------------------------------------------------------------------------------ |
| `negative` | `two`                  | Valós szám négyzete nem lehet negatív, így a ±2 sem jó: mindkettő négyzete +4. |

### GY08-G05 — 5. gyakorlófeladat

**Alkalmazásazonosító:** `negyzetgyok-practice-5`.

Keresd meg azt a két szomszédos egész számot, amelyek közé √50 szigorúan esik. Add meg az alsó és felső határt.

**Válaszmezők, helyes alakok és készségek**

| Mező    | Kérdés            | Helyes válasz / elfogadott kifejezésalakok | Készség        | Szükséges korábbi részek |
| ------- | ----------------- | ------------------------------------------ | -------------- | ------------------------ |
| `lower` | Alsó egész határ  | `7`                                        | `gyok-becsles` | —                        |
| `upper` | Felső egész határ | `8`                                        | `gyok-becsles` | —                        |

**Két segítségi lépcső**

1. Melyik két szomszédos egész négyzete fogja közre az 50-et?
2. 7² = 49, 8² = 64.

**Részletes megoldás**

1. `49 < 50 < 64` — Az 50 két szomszédos négyzetszám közé esik.

2. `7 < √50 < 8` — Nemnegatív oldalaknál a négyzetek sorrendje követi az oldalakét.

**Megőrzendő gondolat:** Becsléshez nem kell előre ismerni a gyök tizedes jegyeit.

**Saját indoklás:** Miért szigorú mindkét egyenlőtlenség?

**Önellenőrzési szempontok az indokláshoz**

- Az 50 egyik határoló négyzetszámmal sem egyenlő.
- Ezért a gyök sem 7, sem 8.

**Célzott hibajavítás**

| Mező    | Jellemző hibás bevitel | Visszajelzés                                                      |
| ------- | ---------------------- | ----------------------------------------------------------------- |
| `lower` | `25`                   | A gyökvonás nem osztás kettővel. A közeli négyzetszámokat keresd. |

### GY08-G06 — 6. gyakorlófeladat

**Alkalmazásazonosító:** `negyzetgyok-practice-6`.

Szorítsd √20-at két szomszédos tized közé, majd kerekítsd egy tizedesre. A kerekítéshez a két tized közötti felezőpontot is vizsgáld.

**Válaszmezők, helyes alakok és készségek**

| Mező      | Kérdés                      | Helyes válasz / elfogadott kifejezésalakok | Készség                           | Szükséges korábbi részek |
| --------- | --------------------------- | ------------------------------------------ | --------------------------------- | ------------------------ |
| `lower`   | Alsó tizedes határ          | `22/5`                                     | `gyok-becsles`                    | —                        |
| `upper`   | Felső tizedes határ         | `9/2`                                      | `gyok-becsles`                    | —                        |
| `rounded` | √20 egy tizedesre kerekítve | `9/2`                                      | `gyok-becsles`, `pontos-kozelito` | —                        |

**Két segítségi lépcső**

1. Négyzetre emeléssel próbáld a 4,4 és 4,5 értékeket.
2. 4,4² = 19,36; 4,5² = 20,25. A felezőpont 4,45.

**Részletes megoldás**

1. `19,36 < 20 < 20,25 → 4,4 < √20 < 4,5` — A gyököt két szomszédos tized közé szorítottuk.

2. `4,45² = 19,8025 < 20` — A gyök a felezőpontnál nagyobb.

3. `√20 ≈ 4,5` — Ezért a nagyobb tizedhez kerekítünk.

**Megőrzendő gondolat:** A két határ mellett a felezőpont dönti el a kerekítés irányát.

**Saját indoklás:** Miért nem elég csak a 4,4 és 4,5 közötti helyet tudni?

**Önellenőrzési szempontok az indokláshoz**

- Az intervallum mindkét kerekítési tartományból tartalmaz pontokat.
- A 4,45 felezőpont választja el a két esetet.

**Célzott hibajavítás**

| Mező      | Jellemző hibás bevitel | Visszajelzés                                                                            |
| --------- | ---------------------- | --------------------------------------------------------------------------------------- |
| `rounded` | `4.4`                  | A felezőpont 4,45. Négyzete 19,8025, kisebb 20-nál, így a gyök a felezőpont fölött van. |

### GY08-G07 — 7. gyakorlófeladat

**Alkalmazásazonosító:** `negyzetgyok-practice-7`.

Szorítsd √2-t két szomszédos század közé, és kerekítsd két tizedesre. A felezőpont négyzetével indokold a kerekítést.

**Válaszmezők, helyes alakok és készségek**

| Mező      | Kérdés                     | Helyes válasz / elfogadott kifejezésalakok | Készség                           | Szükséges korábbi részek |
| --------- | -------------------------- | ------------------------------------------ | --------------------------------- | ------------------------ |
| `lower`   | Alsó százados határ        | `141/100`                                  | `gyok-becsles`                    | —                        |
| `upper`   | Felső százados határ       | `71/50`                                    | `gyok-becsles`                    | —                        |
| `rounded` | √2 két tizedesre kerekítve | `141/100`                                  | `gyok-becsles`, `pontos-kozelito` | —                        |

**Két segítségi lépcső**

1. Számold ki az 1,41 és 1,42 négyzetét.
2. 1,41² = 1,9881; 1,42² = 2,0164. A felezőpont 1,415.

**Részletes megoldás**

1. `1,9881 < 2 < 2,0164` — A gyök 1,41 és 1,42 között van.

2. `1,415² = 2,002225 > 2` — A gyök kisebb a felezőpontnál.

3. `√2 ≈ 1,41 két tizedesre` — A kisebb szomszédos századhoz kerekítünk.

**Megőrzendő gondolat:** A közelítés pontosságát mindig megadjuk.

**Saját indoklás:** Miért közelítő jel kell az 1,41 mellé?

**Önellenőrzési szempontok az indokláshoz**

- 1,41² nem pontosan 2.
- Az 1,41 a megadott pontosságú kerekítés, a √2 a pontos alak.

**Célzott hibajavítás**

| Mező      | Jellemző hibás bevitel | Visszajelzés                                                                   |
| --------- | ---------------------- | ------------------------------------------------------------------------------ |
| `rounded` | `1.42`                 | Az 1,415 felezőpont négyzete 2,002225, nagyobb 2-nél. A gyök ezért alatta van. |

### GY08-G08 — 8. gyakorlófeladat

**Alkalmazásazonosító:** `negyzetgyok-practice-8`.

A √10 két tizedesre kerekítve 3,16. Írd le a pontos értéket gyökjellel úgy, hogy 10 maradjon a gyök alatt. Számítsd ki a 3,16 négyzetét, majd döntsd el, pontosan egyenlő-e a 3,16 a √10-zel.

**Válaszmezők, helyes alakok és készségek**

| Mező     | Kérdés                        | Helyes válasz / elfogadott kifejezésalakok | Készség                                   | Szükséges korábbi részek |
| -------- | ----------------------------- | ------------------------------------------ | ----------------------------------------- | ------------------------ |
| `exact`  | Pontos gyökjeles alak         | `√10`; `√(10)`                             | `negyzetgyok-jelentes`, `pontos-kozelito` | —                        |
| `square` | 3,16²                         | `6241/625`                                 | `pontos-kozelito`                         | —                        |
| `equal`  | 3,16 = √10 pontos egyenlőség? | Nem (azonosító: `no`)                      | `pontos-kozelito`                         | `square`                 |

A `equal` mező választásai: `yes` = Igen; `no` = Nem.

**Két segítségi lépcső**

1. A pontos jelölést nem kell tizedesszámmá alakítani.
2. 316 × 316 = 99 856; a két tizedes szám szorzatában négy tizedesjegy lesz.

**Részletes megoldás**

1. `Pontos alak: √10` — A gyökjel egyértelműen megnevezi a számot.

2. `3,16² = 9,9856` — Pontos szorzással ellenőrizzük a közelítést.

3. `√10 ≈ 3,16, nem = 3,16` — A négyzetek eltérése kizárja a pontos egyenlőséget.

**Megőrzendő gondolat:** A jól kerekített érték is közelítés.

**Saját indoklás:** Mire jó, ha a pontos és közelítő alakot egyszerre tartjuk meg?

**Önellenőrzési szempontok az indokláshoz**

- A pontos alakot további számoláshoz őrizhetjük.
- A közelítő alak a szám nagyságának elképzelésében és a gyakorlati megadásban segít.

**Célzott hibajavítás**

| Mező     | Jellemző hibás bevitel | Visszajelzés                                                      |
| -------- | ---------------------- | ----------------------------------------------------------------- |
| `square` | `10`                   | A közelített érték négyzete közel van 10-hez, de nem pontosan 10. |
| `equal`  | `yes`                  | 3,16² = 9,9856, ezért nem lehet pontosan a 10 négyzetgyöke.       |

### GY08-G09 — 9. gyakorlófeladat

**Alkalmazásazonosító:** `negyzetgyok-practice-9`.

Számítsd ki külön: √(9 + 16) és √9 + √16. Mennyi a második értéknek az elsőhöz képesti többlete?

**Válaszmezők, helyes alakok és készségek**

| Mező         | Kérdés              | Helyes válasz / elfogadott kifejezésalakok | Készség                | Szükséges korábbi részek |
| ------------ | ------------------- | ------------------------------------------ | ---------------------- | ------------------------ |
| `together`   | √(9 + 16)           | `5`                                        | `negyzetgyok-jelentes` | —                        |
| `separate`   | √9 + √16            | `7`                                        | `negyzetgyok-jelentes` | —                        |
| `difference` | Második mínusz első | `2`                                        | `negyzetgyok-jelentes` | `together`, `separate`   |

**Két segítségi lépcső**

1. A gyökjel alatt előbb a teljes összeget számold ki.
2. √25 = 5, míg a második kifejezés 3 + 4.

**Részletes megoldás**

1. `√(9 + 16) = √25 = 5` — Az összeg gyöke.

2. `√9 + √16 = 3 + 4 = 7` — Két külön gyök összege.

3. `7 − 5 = 2` — A két szerkezet eltérő értéket ad.

**Megőrzendő gondolat:** A gyökvonás általában nem osztható szét összeadásra.

**Saját indoklás:** Mit cáfol ez az egyetlen példa?

**Önellenőrzési szempontok az indokláshoz**

- Azt az általános állítást, hogy √(a + b) mindig √a + √b.
- Nem azt állítja, hogy semmilyen különleges esetben nem lehetnek egyenlők.

**Célzott hibajavítás**

| Mező       | Jellemző hibás bevitel | Visszajelzés                                         |
| ---------- | ---------------------- | ---------------------------------------------------- |
| `together` | `7`                    | Az első alakban a teljes 25 összegből vonunk gyököt. |

### GY08-G10 — 10. gyakorlófeladat

**Alkalmazásazonosító:** `negyzetgyok-practice-10`.

Egy négyzet területe pontosan 18 cm². Írd fel az oldalhossz pontos mérőszámát egyetlen gyökjellel, a gyök alatt 18-cal. Add meg az oldalt két tizedesre kerekítve, és számítsd ki ennek a kerekített oldalnak a négyzetét.

**Válaszmezők, helyes alakok és készségek**

| Mező    | Kérdés                             | Helyes válasz / elfogadott kifejezésalakok | Készség                                   | Szükséges korábbi részek |
| ------- | ---------------------------------- | ------------------------------------------ | ----------------------------------------- | ------------------------ |
| `exact` | Pontos mérőszám, egység nélkül     | `√18`; `√(18)`                             | `negyzetgyok-jelentes`, `pontos-kozelito` | —                        |
| `side`  | Oldal két tizedesre kerekítve (cm) | `106/25` cm                                | `gyok-becsles`, `pontos-kozelito`         | —                        |
| `check` | A kerekített oldal négyzete (cm²)  | `11236/625` cm²                            | `pontos-kozelito`                         | `side`                   |

**Két segítségi lépcső**

1. 4,24² = 17,9776 és 4,25² = 18,0625.
2. A felezőpont 4,245; négyzete 18,020025, ami nagyobb 18-nál.

**Részletes megoldás**

1. `Pontos oldal: √18 cm` — Pozitív oldalhosszt keresünk a területből.

2. `4,24 < √18 < 4,245 → két tizedesre 4,24 cm` — A gyök az alsó századhoz van közelebb.

3. `4,24² = 17,9776 cm²` — A kerekítés miatt a visszaszámolt terület kicsit eltér az eredetitől.

**Megőrzendő gondolat:** A területből keresett oldalhossz és a közelítés hibája külön kérdés.

**Saját indoklás:** Miért nem hibás a 4,24 cm-es kerekített válasz attól, hogy a négyzete nem pontosan 18?

**Önellenőrzési szempontok az indokláshoz**

- A feladat itt két tizedesre kerekített értéket kért.
- A pontos eredményt külön a √18 cm jelölés őrzi.

**Célzott hibajavítás**

| Mező    | Jellemző hibás bevitel | Visszajelzés                                                            |
| ------- | ---------------------- | ----------------------------------------------------------------------- |
| `side`  | `9`                    | A 18 felezése nem adja a négyzet oldalát. A keresett oldal négyzete 18. |
| `check` | `18`                   | A 4,24 csak kerekített oldalhossz. Pontos négyzete 17,9776.             |

### GY08-G11 — 11. gyakorlófeladat

**Alkalmazásazonosító:** `negyzetgyok-practice-11`.

70 darab 1 cm × 1 cm-es négyzetlapból vágás nélkül, négyzetrácsban hézagmentes nagy négyzetet készítünk. A lehető legnagyobbat szeretnénk. Mekkora az oldala, hány kis lap kell hozzá, és hány marad ki?

**Válaszmezők, helyes alakok és készségek**

| Mező   | Kérdés                 | Helyes válasz / elfogadott kifejezésalakok | Készség                                | Szükséges korábbi részek |
| ------ | ---------------------- | ------------------------------------------ | -------------------------------------- | ------------------------ |
| `side` | Legnagyobb oldal (cm)  | `8` cm                                     | `gyok-becsles`                         | —                        |
| `used` | Felhasznált lapok (db) | `64` db                                    | `negyzetgyok-jelentes`, `gyok-becsles` | `side`                   |
| `left` | Kimaradó lapok (db)    | `6` db                                     | `pontos-kozelito`                      | `used`                   |

**Két segítségi lépcső**

1. Az oldal itt egész számú kis lapból áll.
2. 8² = 64 ≤ 70, de 9² = 81 > 70.

**Részletes megoldás**

1. `8 cm a legnagyobb megengedett oldal` — A következő egész oldalhoz már nincs elég lap.

2. `8 × 8 = 64 lap; 70 − 64 = 6 lap marad` — A felhasznált és megmaradt lapok száma együtt 70.

**Megőrzendő gondolat:** A gyök becslése mellett a helyzet egész darabszámra vonatkozó feltétele is számít.

**Saját indoklás:** Miért nem használunk egyszerűen √70 cm-es oldalt?

**Önellenőrzési szempontok az indokláshoz**

- Az adott, vágás nélküli négyzetrácsban csak egész számú lap kerülhet egy oldalra.
- A 70 nem négyzetszám, ezért valamennyi lap kimarad.

**Célzott hibajavítás**

| Mező   | Jellemző hibás bevitel | Visszajelzés                                       |
| ------ | ---------------------- | -------------------------------------------------- |
| `side` | `9`                    | A 9 × 9-es négyzethez 81 lap kellene; csak 70 van. |

### GY08-G12 — 12. gyakorlófeladat

**Alkalmazásazonosító:** `negyzetgyok-practice-12`.

A √3 két tizedesre kerekítve 1,73, és tudjuk, hogy 1,7320 < √3 < 1,7321. Mennyi lenne 10√3, ha túl korán az 1,73-mal számolnánk? Mennyi 10√3 valóban két tizedesre kerekítve a megadott szűk intervallum alapján, és mennyi a két kapott érték különbsége?

**Válaszmezők, helyes alakok és készségek**

| Mező         | Kérdés                                 | Helyes válasz / elfogadott kifejezésalakok | Készség                           | Szükséges korábbi részek |
| ------------ | -------------------------------------- | ------------------------------------------ | --------------------------------- | ------------------------ |
| `early`      | A korán kerekített 1,73 × 10           | `173/10`                                   | `pontos-kozelito`                 | —                        |
| `rounded`    | 10√3 két tizedesre kerekítve           | `433/25`                                   | `gyok-becsles`, `pontos-kozelito` | —                        |
| `difference` | Helyes kerekítés mínusz korai eredmény | `1/50`                                     | `pontos-kozelito`                 | `early`, `rounded`       |

**Két segítségi lépcső**

1. Szorozd meg a megadott szűk intervallum mindkét határát tízzel.
2. A valódi érték 17,320 és 17,321 közé esik; az 1,73 × 10 viszont 17,30.

**Részletes megoldás**

1. `1,73 × 10 = 17,30` — Ez a már kerekített bemenettel számolt érték.

2. `17,320 < 10√3 < 17,321 → 17,32` — Az egész intervallum ugyanarra a századra kerekedik.

3. `17,32 − 17,30 = 0,02` — A túl korai kerekítés a kért pontosságban már látható különbséget okoz.

**Megőrzendő gondolat:** Többlépéses számolásban a kerekítést lehetőleg a végére hagyjuk.

**Saját indoklás:** Miért segített a megadott szűk intervallum, pontos tizedes kifejtés nélkül is?

**Önellenőrzési szempontok az indokláshoz**

- Minden benne lévő szám tízszerese 17,32-re kerekedik két tizedesre.
- A kért pontosság eldöntéséhez elég ilyen biztos határokat ismernünk.

**Célzott hibajavítás**

| Mező      | Jellemző hibás bevitel | Visszajelzés                                                               |
| --------- | ---------------------- | -------------------------------------------------------------------------- |
| `rounded` | `17.3`                 | A szűk intervallum alapján 17,320 < 10√3 < 17,321. Két tizedesre ez 17,32. |

## 7. Önálló próba

Először a segítségek és a megoldás megnyitása nélkül próbálkozz. Az alkalmazás külön kezeli az önállóan és segítséggel elért eredményt. A két feladat nem a teljes modul vagy a teljes évfolyam tudásának vizsgája.

### GY08-Z01 — 1. önálló próbafeladat

**Alkalmazásazonosító:** `negyzetgyok-exit-1`.

Mennyi √((−7)²)? Melyik két valós szám oldja meg az x² = 49 egyenletet? A két megoldást növekvő sorrendben írd.

**Válaszmezők, helyes alakok és készségek**

| Mező      | Kérdés                    | Helyes válasz / elfogadott kifejezésalakok | Készség                | Szükséges korábbi részek |
| --------- | ------------------------- | ------------------------------------------ | ---------------------- | ------------------------ |
| `root`    | √((−7)²)                  | `7`                                        | `negyzetgyok-jelentes` | —                        |
| `smaller` | x² = 49 kisebb megoldása  | `-7`                                       | `negyzetgyok-jelentes` | —                        |
| `larger`  | x² = 49 nagyobb megoldása | `7`                                        | `negyzetgyok-jelentes` | —                        |

**Két segítségi lépcső**

1. Az első kérdés gyökjelértéket, a második minden egyenletmegoldást keres.
2. (−7)² = 49; a nemnegatív gyök 7, de az egyenletben −7 is működik.

**Részletes megoldás**

1. `√((−7)²) = √49 = 7` — A nemnegatív értéket választjuk.

2. `x = −7 vagy 7` — Mindkét szám négyzete 49.

**Megőrzendő gondolat:** A √(a²) = |a| szabály és az egyenlet két megoldása összefügg, de nem azonos állítás.

**Saját indoklás:** Melyik feltétel választja ki az első válaszban a pozitív értéket?

**Önellenőrzési szempontok az indokláshoz**

- A négyzetgyök nemnegatív voltának definíciója.
- Az x² = 49 egyenlet nem tartalmaz x ≥ 0 megkötést.

**Célzott hibajavítás**

| Mező   | Jellemző hibás bevitel | Visszajelzés                                           |
| ------ | ---------------------- | ------------------------------------------------------ |
| `root` | `-7`                   | A gyökjel az abszolút értéket adja vissza: \|−7\| = 7. |

### GY08-Z02 — 2. önálló próbafeladat

**Alkalmazásazonosító:** `negyzetgyok-exit-2`.

Egy négyzet területe pontosan 45 m². Az oldal mérőszámát írd fel egyetlen gyökjellel, a gyök alatt 45-tel. Add meg a két szomszédos egész határt, az oldalt egy tizedesre kerekítve, és a kerekített oldal négyzetét.

**Válaszmezők, helyes alakok és készségek**

| Mező      | Kérdés                           | Helyes válasz / elfogadott kifejezésalakok | Készség                                   | Szükséges korábbi részek |
| --------- | -------------------------------- | ------------------------------------------ | ----------------------------------------- | ------------------------ |
| `exact`   | Pontos mérőszám, egység nélkül   | `√45`; `√(45)`                             | `negyzetgyok-jelentes`, `pontos-kozelito` | —                        |
| `lower`   | Alsó egész határ (m)             | `6` m                                      | `gyok-becsles`                            | —                        |
| `upper`   | Felső egész határ (m)            | `7` m                                      | `gyok-becsles`                            | —                        |
| `rounded` | Oldal egy tizedesre (m)          | `67/10` m                                  | `gyok-becsles`, `pontos-kozelito`         | —                        |
| `square`  | A kerekített oldal négyzete (m²) | `4489/100` m²                              | `pontos-kozelito`                         | `rounded`                |

**Két segítségi lépcső**

1. 6² = 36 és 7² = 49. A gyök e két egész közé esik.
2. 6,7² = 44,89; a 6,7 és 6,8 közötti felezőpont 6,75, és 6,75² = 45,5625.

**Részletes megoldás**

1. `Pontos oldal: √45 m; 6 < √45 < 7` — A területből a nemnegatív gyököt keressük.

2. `44,89 < 45 < 45,5625 → 6,7 < √45 < 6,75` — A gyök a kerekítési felezőpont alatt van.

3. `√45 ≈ 6,7; 6,7² = 44,89` — A közelítő hossz négyzete már nem pontosan az eredeti terület.

**Megőrzendő gondolat:** A pontos alak, a biztos határ és a kerekített mérőszám mind más információt ad.

**Saját indoklás:** Mit jelentene a √45 = 6,7 hibás egyenlőség a területre nézve?

**Önellenőrzési szempontok az indokláshoz**

- Azt állítaná, hogy 6,7² pontosan 45.
- Ez ellentmond a pontos 44,89-es szorzatnak; közelítő jelet kell használni.

**Célzott hibajavítás**

| Mező      | Jellemző hibás bevitel | Visszajelzés                                            |
| --------- | ---------------------- | ------------------------------------------------------- |
| `rounded` | `6.8`                  | A gyök 6,7 és 6,75 között van, mert 6,7² < 45 < 6,75².  |
| `square`  | `45`                   | A 6,7 m kerekített hossz. A négyzete pontosan 44,89 m². |

## 8. Összefoglalás és fogalomtár

- A √a a nemnegatív négyzetgyököt jelöli, és a ≥ 0 esetén értelmezett a valós számok között.
- x² = a pozitív a mellett két ellentett valós megoldást ad.
- √(a²) = |a|, nem minden valós a esetén a.
- A gyök határait a végpontok négyzetével ellenőrizzük.
- A kerekítést és a pontosságot külön jelezzük; lehetőleg a számolás végén kerekítünk.

| Fogalom                | Jelentés                                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| Négyzetgyök            | Az a ≥ 0 számnak az a nemnegatív gyöke, amelynek négyzete a. Jele √a.                                  |
| Négyzetszám            | Egész szám négyzete; a nemnegatív példák 0, 1, 4, 9, 16, …                                             |
| Abszolút érték         | A szám nullától mért távolsága; mindig nemnegatív. Ezért √(a²) = \|a\|.                                |
| Pontos alak            | A számot változatlan értékkel megnevező jelölés, például √2.                                           |
| Közelítő érték         | Az eredeti szám helyett megadott közeli szám, választott pontossággal; a kapcsolat jele ≈.             |
| Intervallumba szorítás | Olyan alsó és felső határ megadása, amelyek között a keresett szám biztosan elhelyezkedik.             |
| Kerekítési felezőpont  | A két szomszédos választható kerekített érték közötti középső szám, amely eldönti a kerekítés irányát. |

## 9. Determinisztikus, változatos gyakorlás

A [generátorforrás](../../app/src/math/bridge-generators.ts) a családazonosító, seed és változat alapján ismételhető feladatot állít elő. Azonos bemenethez azonos kérdés, válasz, segítség és megoldás tartozik; a seed és a változat negatív biztonságos egész is lehet. A témán belüli sorrend a következő:

| Témán belüli index | Családazonosító           | Tartalom                             | Készségek                                                 |
| ------------------ | ------------------------- | ------------------------------------ | --------------------------------------------------------- |
| 0                  | `root-square-absolute-v1` | Abszolút érték és egyenletmegoldások | `negyzetgyok-jelentes`                                    |
| 1                  | `root-bracket-v1`         | Egész határok és tizedes kerekítés   | `gyok-becsles`, `pontos-kozelito`                         |
| 2                  | `root-area-precision-v1`  | Pontos terület, közelített oldal     | `negyzetgyok-jelentes`, `pontos-kozelito`, `gyok-becsles` |

A függő ellenőrző rész mezői a generált feladatban is együtt maradnak a szükséges előzményekkel. A családok nem pusztán a rögzített feladatok végértékét cserélik: az adott témához illő paramétertartományokkal, több kapcsolódó részválasszal és feladattípusnak megfelelő feltételekkel dolgoznak.

**A generált ellenőrző csoportok részfüggőségei**

- `root-area-precision-v1` / `square` → `rounded`
- `root-area-precision-v1` / `equal` → `square`

## 10. Azonosítók és válaszszerződés

A kézirat és az alkalmazás közötti megfeleltetés az [új lecketartalom](../../app/src/content/bridge-lessons.ts) `bridgeManuscriptMap` exportjában is szerepel. J = jóslás, P = kidolgozott példa, G = gyakorlás, Z = önálló próba. A példák sorrendjéhez tartozik a két P-azonosító; az alkalmazásban a példák nem válaszbekérő feladatrekordok.

| Kéziratazonosító | Alkalmazásbeli rekord     | Külön ellenőrzött mezők                        |
| ---------------- | ------------------------- | ---------------------------------------------- |
| `GY08-J01`       | `negyzetgyok-prediction`  | `root`, `smaller`, `larger`                    |
| `GY08-G01`       | `negyzetgyok-practice-1`  | `zero`, `one`, `seven`, `ten`                  |
| `GY08-G02`       | `negyzetgyok-practice-2`  | `fraction`, `decimal`, `larger`                |
| `GY08-G03`       | `negyzetgyok-practice-3`  | `negative`, `decimal`, `zero`                  |
| `GY08-G04`       | `negyzetgyok-practice-4`  | `smaller`, `larger`, `zero`, `negative`        |
| `GY08-G05`       | `negyzetgyok-practice-5`  | `lower`, `upper`                               |
| `GY08-G06`       | `negyzetgyok-practice-6`  | `lower`, `upper`, `rounded`                    |
| `GY08-G07`       | `negyzetgyok-practice-7`  | `lower`, `upper`, `rounded`                    |
| `GY08-G08`       | `negyzetgyok-practice-8`  | `exact`, `square`, `equal`                     |
| `GY08-G09`       | `negyzetgyok-practice-9`  | `together`, `separate`, `difference`           |
| `GY08-G10`       | `negyzetgyok-practice-10` | `exact`, `side`, `check`                       |
| `GY08-G11`       | `negyzetgyok-practice-11` | `side`, `used`, `left`                         |
| `GY08-G12`       | `negyzetgyok-practice-12` | `early`, `rounded`, `difference`               |
| `GY08-Z01`       | `negyzetgyok-exit-1`      | `root`, `smaller`, `larger`                    |
| `GY08-Z02`       | `negyzetgyok-exit-2`      | `exact`, `lower`, `upper`, `rounded`, `square` |

A számmezők racionális értéket és szükség szerint egységet ellenőriznek; a magyar tizedesvessző használható. A kifejezésmező véges, szerző által megadott helyes alakokat fogad el, ezért a feladat pontosan kéri a választandó szerkezetet. Ez nem általános számítógépes algebrai rendszer, és nem futtatja a bevitt szöveget kódként. A gyökjeles alaknál a jelölés és az eredeti gyök alatti szám megőrzése a cél.

A táblázatok „Szükséges korábbi részek” oszlopa a `requiresParts` kapcsolatot mutatja. A függő részhez tartozó készségbizonyíték csak ugyanabban az ellenőrzésben helyes előzménylánc mellett számít. Így a közölt teljes összeg visszamásolása önmagában nem igazolja a modell visszaellenőrzését. A szükséges kapcsolat tranzitív: ha az egyezőséghez négyzet, a négyzethez kerekített oldal kell, mindkettő az ellenőrző csoport része. Az egymástól független helyettesítésekhez nem írunk elő mesterséges sorrendet.

## 11. Egységszintű lefedettség és korlátok

| Lefedett egység | Az aktuális tématérkép megnevezése                                                  |
| --------------- | ----------------------------------------------------------------------------------- |
| `M08.01`        | Négyzetterületből oldalhossz visszakeresése.                                        |
| `M08.02`        | Négyzetszámok gyöke; a gyökjel és négyzetes egyenlet összevetése külön bővítésként. |
| `M08.03`        | Nem négyzetszám gyökének becslése és közelítő értéke.                               |

M08.01, M08.02 és M08.03 kapcsolódik teljes tanulási úthoz. M08.04-ből a pontos gyökjel és a közelítés megkülönböztetése elő van készítve, de az irracionalitás bizonyítása és az általános gyökazonosságok rendszere még nincs teljesen kidolgozva; az egységet ezért nem jelöljük késznek.

## 12. Ellenőrzési alap és tartalmi mérleg

Ebben az útban 15 kérdésrekord szerepel: 1 jósló belépő, 12 gyakorló és 2 önálló próbafeladat. Ehhez 48 külön ellenőrzött válaszmező, 21 szerzői célzott hibaszabály, 2 kidolgozott példa és 3 generátorcsalád tartozik. Ezek az aktuális adatmodellből számított darabszámok.

A [tartalmi tesztek](../../app/tests/bridge-content.test.ts) a szerzői válaszokat a feladatok adataiból felírt, külön racionális számításokkal vetik össze; a kifejezésváltozatokat külön matematikai értelmező ellenőrzi. Vizsgálják a célzott hibajavítás tényleges üzenetét, a részfüggőségek érvényességét, a fogalmi korlátokat és a kézirat–alkalmazás kapcsolatot. A [generátortesztek](../../app/tests/bridge-generators.test.ts) családonként 200 feladat látható szövegéből külön számolják újra az eredményeket; a teljes négy témában további 252 szélső/negatív seed–változat visszajátszás is szerepel.

Az automatikus matematikai és működési ellenőrzés a tartalom pontosságáról és a végrehajtásról ad bizonyítékot. A tanulási hatás, a nyelvezet életkori megfelelősége és a valódi tanórai időigény tanári–tanulói kipróbálással vizsgálandó.
