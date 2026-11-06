# Szövegből modell — teljes tananyag és alkalmazásbeli azonosítók

A Matek8 0.3.0 fejlesztési ciklusához tartozó, az alkalmazás adataival összehangolt kézirat. Témaazonosító: `szoveges-modellek`. A fájl a teljes magyarázatot, példákat, feladatokat, segítségeket, megoldásokat és hibavisszajelzéseket tartalmazza.

A tanulói út: **Jósolj → Próbáld ki → Értsd meg → Nézd a példát → Gyakorolj → Önálló próba**. A becsült 60 perc tervezési támpont; az út több alkalomra osztható. Tanári és tanulói kipróbálás nélkül nem állítjuk, hogy minden tanulónál bizonyított megértést eredményez.

## 1. Cél, előismeret és hatókör

**Indító kérdés:** Mit keresünk, milyen feltételekkel, és melyik számolás mondja ugyanazt, mint a történet?

Szakaszábrával, táblázattal, próbálgatással vagy egyenlettel írunk le helyzeteket. A számolás előtt tisztázzuk a feltételeket; a végén azt is vizsgáljuk, hogy a kapott szám lehet-e válasz a kérdésre.

A szövegből megnevezett ismeretlenhez, feltételekhez és ellenőrizhető modellhez jutunk. A történetekben szerepel egyszeri díj, összeg és különbség, életkor, sebesség, munka, hiányzó vagy felesleges adat, ellentmondás és egész darabszám. A választott ábra vagy egyenlet használatát a tanuló saját szavaival is indokolja.

**Tanulási célok**

- Különválasztod az adatot, kérdést, feltételt és felesleges információt.
- Megnevezed, mit jelöl az ismeretlen, és milyen egységben mérjük.
- Szakaszábrát, táblázatot vagy egyenletet kapcsolsz a történethez.
- Felismered a hiányos vagy egymásnak ellentmondó adatokat.
- Ellenőrzöd az összeget, különbséget, egységet és a darabszámra vonatkozó feltételt.

**Előismeretek**

- Betűs kifejezés és egyszerű egyenlet jelentése.
- Arányok, mértékegységek és a tizedes vagy tört alakú válasz értelmezése.

**Megnyitható előismereti témák:** `betus-kifejezesek`, `egyenlet`, `aranyossag`, `mertekegysegek`.

**Továbblépés:** `grafikon`.

## 2. Jósolj

### SM06-J01 — Jósló belépő

**Alkalmazásazonosító:** `szoveges-modellek-prediction`.

Három egyforma árú jegy és egyszeri 300 Ft foglalási díj együtt 2700 Ft. Mennyi jut a három jegyre, és mennyi egy jegy ára?

**Válaszmezők, helyes alakok és készségek**

| Mező      | Kérdés                       | Helyes válasz / elfogadott kifejezésalakok | Készség                                   | Szükséges korábbi részek |
| --------- | ---------------------------- | ------------------------------------------ | ----------------------------------------- | ------------------------ |
| `tickets` | A három jegy ára együtt (Ft) | `2400` Ft                                  | `adatok-es-feltetelek`, `modellvalasztas` | —                        |
| `one`     | Egy jegy ára (Ft)            | `800` Ft                                   | `modellvalasztas`                         | —                        |

**Két segítségi lépcső**

1. A teljes összeg kétféle költségből áll.
2. A jegyekre 2700 − 300 Ft marad; ezt osztjuk három egyenlő részre.

**Részletes megoldás**

1. `2700 − 300 = 2400 Ft` — Az egyszeri költség nem egy jegy része.

2. `2400 : 3 = 800 Ft` — A jegyek egyforma árúak.

3. `3 × 800 + 300 = 2700 Ft` — A történet teljes összegét kaptuk vissza.

**Megőrzendő gondolat:** A műveletet a költségek kapcsolata, nem pusztán a szövegben szereplő számok választják ki.

**Saját indoklás:** Miért kell előbb kivonni és csak azután osztani?

**Önellenőrzési szempontok az indokláshoz**

- A 300 Ft az egész vásárláshoz egyszer tartozik.
- A megmaradt összeget viselik egyenlően a jegyek.

**Célzott hibajavítás**

| Mező      | Jellemző hibás bevitel | Visszajelzés                                                                              |
| --------- | ---------------------- | ----------------------------------------------------------------------------------------- |
| `tickets` | `2700`                 | A 2700 Ft-ban az egyszeri foglalási díj is benne van.                                     |
| `one`     | `900`                  | Így a foglalási díjat is három jegyárként osztanád szét. Előbb vond le az egyszeri díjat. |

## 3. Próbáld ki — az interaktív műhely matematikai menete

A műhely működő alkalmazásrésze az [interaktív forrásban](../../app/src/interactives/BridgeLabs.tsx), pontos számolási modellje a [műhelymodellben](../../app/src/math/bridge-models.ts) található. Az alábbi megfigyelések a lecke fogalmait kötik össze a kezelhető állapotokkal.

1. Válassz négy helyzet közül: 500 Ft alapdíj és 200 Ft/km mellett 1700 Ft teljes díj; két szalag 34 cm-es összege és 6 cm-es különbsége; három egyforma füzet 1500 Ft-ért, egy oda nem tartozó 7 tollas adattal; téglalap 12 cm-es oldallal és hiányzó másik oldallal.
2. Válogasd ki a szükséges adatokat, nevezd meg az ismeretlent és az egységét. A felesleges adat használata és a hiányzó adat kitalálása külön hiba.
3. Válassz a történetet megőrző modellt. Az alapdíjas helyzetben 500 + 200x = 1700; a szalagoknál x + (x + 6) = 34; a füzeteknél 3x = 1500. A téglalapnál A = 12b felírható, de számszerű terület még nem következik.
4. Számítsd ki a meghatározható ismeretlent, majd helyettesíts vissza: 6 km; 14 cm és 20 cm; 500 Ft. Vizsgáld az összeg és a különbség feltételét is.
5. A hiányos téglalapos helyzethez adj két megengedett másik oldalt és két különböző területet. Ez mutatja meg, miért nincs egyetlen helyes számérték. A műhely ábrája és táblázata ugyanazokat a kapcsolatokat szemlélteti.

A saját szavas magyarázatot a program nem osztályozza automatikusan. A tanuló a felsorolt szempontokhoz viszonyíthatja a saját gondolatát; az elmentés külön döntés. Az automatikusan ellenőrzött szám vagy kifejezés helyessége nem bizonyítja önmagában a magyarázat megértését.

## 4. Értsd meg — teljes magyarázat

### 4.1. A kérdés jelöli ki a célt

Előbb saját szavaiddal mondd el, mit keresel. Írd a mennyiség mellé az egységét. Az x = egy jegy ára forintban pontosabb megállapodás, mint az, hogy x az ismeretlen. Egy darabszám lehet, hogy csak nemnegatív egész; egy hossz viszont lehet tört is.

`x: egy jegy ára, Ft-ban; n: buszok száma, pozitív egész`

### 4.2. Az adatoknak szerepük van

Nem minden számot kell felhasználni. Egy tollakra vonatkozó adat nem módosítja a külön megadott füzetvásárlás árát. Máskor egyetlen adat hiányzik a megoldáshoz: a téglalap egyik oldala nem határozza meg a területét. Két különböző megengedett példa megmutathatja, hogy nincs egyértelmű válasz.

- Mit tudunk biztosan?
- Mi a kapcsolat az adatok között?
- Mit kellene még tudnunk?
- Lehet-e egyszerre igaz az összes közölt adat?

### 4.3. A szakaszábra az összeg és a különbség modellje

Ha két hossz összege 34 cm és különbsége 6 cm, a hosszabb két részből áll: egy a rövidebbel egyenlő részből és 6 cm többletből. A 6 cm elvétele után két egyenlő szakasz marad. Ugyanezt írja le az x + (x + 6) = 34 egyenlet.

`rövidebb: x; hosszabb: x + 6; együtt: 2x + 6`

### 4.4. A módszert a kapcsolathoz válaszd

Az egyenlet tömören őriz egy kapcsolatot. A táblázat több összetartozó érték vizsgálatát segíti. A szakaszábra láthatóvá teszi az egyenlő részeket. Rendszeres próbálgatás is lehet jó út, ha minden tippnél ugyanazokat a feltételeket ellenőrizzük. Több módszer is lehet jogos; indokold, miért használható a választottad.

- Egyenlő részek és többlet: szakaszábra vagy egyenlet.
- Idővel állandó ütemben változó mennyiség: táblázat és szabály.
- Kevés megengedett egész eset: rendezett próbálgatás.
- A rajz, a táblázat és az egyenlet ugyanazt a történetet kell hogy leírja.

### 4.5. Az állandó ütem feltétel

Az út = sebesség × idő kapcsolatban az adott sebesség csak akkor használható közvetlenül, ha arra az egész időre érvényes. A 60 km-t 45 perc alatt megtevő, végig egyenletesen haladó jármű sebességét azonos időegységgel számoljuk. A párhuzamos csapok munkamodellje azonos, állandó vízhozamot és közös szűk keresztmetszet hiányát feltételezi.

`45 perc = 3/4 óra; 60 : (3/4) = 80 km/h`

### 4.6. A számolás után térj vissza a történethez

A megoldásnak teljesítenie kell minden feltételt. Az összeg helyessége mellett a különbséget is ellenőrizd. Buszokból vagy bontatlan csomagokból nem vásárolhatunk tetszőleges törtrészt: itt a legkisebb megfelelő egész számot keressük. A feltételek döntik el, mikor kell felfelé egészre váltani; ez nem minden számolás általános kerekítési szabálya.

`113 tanuló, 48 férőhely/busz: 2 busz kevés, 3 elég`

### 4.7. Néha a helyes eredmény a hiány felismerése

Ha 3 termék darabonként 300 Ft, kedvezmény és egyéb költség nélkül, akkor az összeg nem lehet 850 Ft. Ilyenkor nem egy új művelettel kell mindenáron számot gyártani: jelezni kell az ellentmondást. Ha csak egy téglalap 12 cm-es oldalát ismerjük, több terület is lehetséges.

`A hiányzó vagy ellentmondó adat felismerése is matematikai megoldás.`

## 5. Nézd a példát

### SM06-P01 — Az egyszeri díjat különválasztjuk

Négy egyforma belépő és egyszeri 300 Ft kezelési díj együtt 3500 Ft. Mennyibe kerül egy belépő?

1. `x: egy belépő ára, Ft-ban` — Az ismeretlen jelentését és egységét rögzítjük.

2. `4x + 300 = 3500` — Négy azonos árhoz egyszer adjuk a kezelési díjat.

3. `4x = 3200; x = 800` — Előbb az egyszeri részt vesszük el, majd négy egyenlő részre osztunk.

**Ellenőrzés:** 4 × 800 Ft + 300 Ft = 3500 Ft. A 800 Ft pozitív ár, és az eredeti teljes költséget kapjuk vissza.

**Másik megoldási út**

1. `(3500 − 300) : 4 = 800` — Az egyenlet lépései egyetlen aritmetikai kifejezésbe is összefoglalhatók.

### SM06-P02 — Két szakasz összege és különbsége

Két szalag összesen 54 cm. Az egyik 10 cm-rel hosszabb a másiknál. Mekkora a két hossz?

1. `Rövidebb: x; hosszabb: x + 10` — A különbség ugyanahhoz a rövidebb hosszhoz képest adott.

2. `x + (x + 10) = 54` — A két szakasz összege az ismert teljes hossz.

3. `54 − 10 = 44; 44 : 2 = 22 cm` — A többletet levéve két egyenlő szakasz marad.

4. `Hosszabb: 22 + 10 = 32 cm` — Visszaadjuk a hosszabb szakasz többletét.

**Ellenőrzés:** 22 + 32 = 54 és 32 − 22 = 10. Mindkét feltétel teljesül; önmagában az összeg ellenőrzése kevés volna.

## 6. Gyakorolj — tizenkét teljes feladat

A feladatszám a gondolkodási egységeket jelenti: egy feladathoz több külön ellenőrzött mező tartozhat. A saját indoklás ezek mellett külön, önellenőrzésre szolgál.

### SM06-G01 — 1. gyakorlófeladat

**Alkalmazásazonosító:** `szoveges-modellek-practice-1`.

Négy egyforma füzet és egyszeri 500 Ft szállítás együtt 2300 Ft. x egy füzet ára Ft-ban. Írd fel az eredeti teljes költség egyenletét, majd számítsd ki x-et és ellenőrizd az összeget.

**Válaszmezők, helyes alakok és készségek**

| Mező       | Kérdés                            | Helyes válasz / elfogadott kifejezésalakok                                   | Készség                                   | Szükséges korábbi részek |
| ---------- | --------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------- | ------------------------ |
| `equation` | Teljes költség balra, 2300 jobbra | `4x+500=2300`; `4*x+500=2300`; `500+4x=2300`; `500+4*x=2300`; `x*4+500=2300` | `adatok-es-feltetelek`, `modellvalasztas` | —                        |
| `price`    | Egy füzet ára (Ft)                | `450` Ft (változó: `x`)                                                      | `modellvalasztas`                         | —                        |
| `total`    | Ellenőrzött teljes összeg (Ft)    | `2300` Ft                                                                    | `modell-ellenorzes`                       | `equation`, `price`      |

**Két segítségi lépcső**

1. Válaszd külön a füzetek árát az egyszeri költségtől.
2. 4x = 2300 − 500 = 1800. A modellmezőben az eredeti összefüggést kérjük, a megoldás előtti alakban.

**Részletes megoldás**

1. `4x + 500 = 2300` — Négy egyforma ár és egyetlen szállítás szerepel.

2. `x = 1800 : 4 = 450 Ft` — A füzetekre jutó összeget négy egyenlő részre osztjuk.

3. `4 × 450 + 500 = 2300 Ft` — A teljes összeget ellenőrizzük.

**Megőrzendő gondolat:** A modellben annak is látszania kell, melyik költség egyszeri.

**Saját indoklás:** Miben lenne más a 4(x + 500) története?

**Önellenőrzési szempontok az indokláshoz**

- Az 500 Ft mind a négy csomagban szerepelne.
- Ez összesen 2000 Ft kiegészítő díj lenne, nem 500.

**Célzott hibajavítás**

| Mező       | Jellemző hibás bevitel | Visszajelzés                                                           |
| ---------- | ---------------------- | ---------------------------------------------------------------------- |
| `equation` | `4*(x+500)=2300`       | A szállítás egyszeri költség, nem mind a négy füzethez külön tartozik. |

### SM06-G02 — 2. gyakorlófeladat

**Alkalmazásazonosító:** `szoveges-modellek-practice-2`.

Két zsinór összesen 34 cm. A hosszabb 6 cm-rel hosszabb a rövidebbnél. x a rövidebb hossza cm-ben. Írd fel az összeg egyenletét, majd add meg mindkét hosszt.

**Válaszmezők, helyes alakok és készségek**

| Mező       | Kérdés                               | Helyes válasz / elfogadott kifejezésalakok                                           | Készség                                   | Szükséges korábbi részek |
| ---------- | ------------------------------------ | ------------------------------------------------------------------------------------ | ----------------------------------------- | ------------------------ |
| `equation` | A két hossz összege balra, 34 jobbra | `x+(x+6)=34`; `x+x+6=34`; `(x+6)+x=34`; `2x+6=34`; `2*x+6=34`; `6+2x=34`; `6+2*x=34` | `modellvalasztas`                         | —                        |
| `short`    | Rövidebb (cm)                        | `14` cm (változó: `x`)                                                               | `adatok-es-feltetelek`, `modellvalasztas` | —                        |
| `long`     | Hosszabb (cm)                        | `20` cm                                                                              | `modellvalasztas`                         | —                        |

**Két segítségi lépcső**

1. Rajzolj két egyenlő részt, és a hosszabbhoz még 6 cm-t.
2. Ha a 34-ből elvesszük a 6 többletet, 28 cm marad két egyenlő részre.

**Részletes megoldás**

1. `2x + 6 = 34; 2x = 28; x = 14` — Az összegből levonjuk a többletet.

2. `14 + 6 = 20 cm` — A hosszabb a rövidebbnél hattal több.

3. `14 + 20 = 34; 20 − 14 = 6` — Az összeg és a különbség is teljesül.

**Megőrzendő gondolat:** Két feltételhez két ellenőrzés tartozik.

**Saját indoklás:** Magyarázd el szakaszábrával vagy egyenlettel, miért nem jó a 17 cm és 17 cm. Miért ezt a módszert választottad?

**Önellenőrzési szempontok az indokláshoz**

- Az összegük 34 cm, de a különbségük nulla.
- A szakaszábrán a 6 cm többlet látszik; az egyenlet ugyanezt x + (x + 6) alakban őrzi.
- A választott módszernek az összeg és a különbség feltételét is meg kell mutatnia.

**Célzott hibajavítás**

| Mező       | Jellemző hibás bevitel | Visszajelzés                                                   |
| ---------- | ---------------------- | -------------------------------------------------------------- |
| `equation` | `x+6=34`               | A 34 cm a két zsinór összege, nem a hosszabb hossza önmagában. |
| `long`     | `17`                   | A két hossz nem egyenlő: a különbségük 6 cm.                   |

### SM06-G03 — 3. gyakorlófeladat

**Alkalmazásazonosító:** `szoveges-modellek-practice-3`.

Egy gyerek és az apja most együtt 48 évesek. Az apa most háromszor annyi idős, mint a gyerek. Hány éves most a gyerek, hány az apa, és hányszor annyi idős lesz az apa négy év múlva?

**Válaszmezők, helyes alakok és készségek**

| Mező         | Kérdés                             | Helyes válasz / elfogadott kifejezésalakok | Készség                                   | Szükséges korábbi részek |
| ------------ | ---------------------------------- | ------------------------------------------ | ----------------------------------------- | ------------------------ |
| `child`      | Gyerek életkora most (év)          | `12` év                                    | `adatok-es-feltetelek`, `modellvalasztas` | —                        |
| `father`     | Apa életkora most (év)             | `36` év                                    | `modellvalasztas`                         | —                        |
| `laterRatio` | Apa / gyerek életkor négy év múlva | `5/2`                                      | `modell-ellenorzes`                       | `child`, `father`        |

**Két segítségi lépcső**

1. Jelöld a gyerek életkorát x-szel: az apáé 3x.
2. Most 4x = 48. Négy év múlva 12 + 4 és 36 + 4 lesz az életkoruk.

**Részletes megoldás**

1. `x = 48 : 4 = 12; 3x = 36` — A két életkor együtt négy egyenlő rész.

2. `Négy év múlva: 16 és 40 év` — Ugyanannyi idő telik el mindkettejüknél.

3. `40 : 16 = 5/2 = 2,5` — A háromszoros kapcsolat csak a megadott jelenre vonatkozott.

**Megőrzendő gondolat:** A szövegben szereplő időpont a feltétel része.

**Saját indoklás:** Mi marad állandó, ha mindkét életkorhoz négy évet adunk?

**Önellenőrzési szempontok az indokláshoz**

- A 24 éves korkülönbség.
- Az arány nem marad három, mert az összeadás más arányban változtatja az életkorokat.

**Célzott hibajavítás**

| Mező         | Jellemző hibás bevitel | Visszajelzés                                                              |
| ------------ | ---------------------- | ------------------------------------------------------------------------- |
| `child`      | `16`                   | A teljes összeg négy egyenlő rész: a gyerek egy, az apa három rész.       |
| `laterRatio` | `3`                    | Négy évet mindkettejükhöz hozzáadunk; az életkorok aránya ettől változik. |

### SM06-G04 — 4. gyakorlófeladat

**Alkalmazásazonosító:** `szoveges-modellek-practice-4`.

Egy elég nagy tartályban kezdetben 5 L víz van. Percenként állandóan 3 L érkezik, és semmi nem folyik ki. Add meg a 0 és 4 perchez tartozó mennyiséget, valamint azt, hány perc után lesz benne 20 L.

**Válaszmezők, helyes alakok és készségek**

| Mező    | Kérdés                                 | Helyes válasz / elfogadott kifejezésalakok | Készség                | Szükséges korábbi részek |
| ------- | -------------------------------------- | ------------------------------------------ | ---------------------- | ------------------------ |
| `start` | 0 percnél (L)                          | `5` L                                      | `adatok-es-feltetelek` | —                        |
| `four`  | 4 percnél (L)                          | `17` L                                     | `modellvalasztas`      | —                        |
| `time`  | A 20 L eléréséhez szükséges idő (perc) | `5` perc                                   | `modellvalasztas`      | —                        |

**Két segítségi lépcső**

1. A teljes víz az induló víz és a beérkező víz összege.
2. V = 5 + 3t. A 20 L-hez még 15 L-nek kell beérkeznie.

**Részletes megoldás**

1. `t = 0: 5 + 3 × 0 = 5 L` — A kezdőértéket is feltüntetjük a táblázatban.

2. `t = 4: 5 + 3 × 4 = 17 L` — Az állandó ütem négy percen át érvényes.

3. `(20 − 5) : 3 = 5 perc` — Öt perc alatt 15 L új víz érkezik.

**Megőrzendő gondolat:** A táblázatnak és a szabálynak a kezdőértéket is őriznie kell.

**Saját indoklás:** Mely feltételek mellett használhatjuk a V = 5 + 3t szabályt?

**Önellenőrzési szempontok az indokláshoz**

- A befolyás végig 3 L/perc és nincs kifolyás.
- A tartály elég nagy, így nem folyik túl a vizsgált időben.

**Célzott hibajavítás**

| Mező    | Jellemző hibás bevitel | Visszajelzés                                             |
| ------- | ---------------------- | -------------------------------------------------------- |
| `start` | `0`                    | A 0 perc az idő kezdete, nem üres tartályt jelent.       |
| `four`  | `12`                   | A 12 L csak a beérkező víz. Az induló 5 L is bent marad. |

### SM06-G05 — 5. gyakorlófeladat

**Alkalmazásazonosító:** `szoveges-modellek-practice-5`.

Egy jármű egyenes szakaszon, megállás nélkül, végig állandó sebességgel 60 km-t tesz meg 45 perc alatt. Hány óra a 45 perc, mennyi a sebesség km/h-ban, és mekkora utat tesz meg ugyanígy 20 perc alatt? Pontos értéket adj.

**Válaszmezők, helyes alakok és készségek**

| Mező       | Kérdés                 | Helyes válasz / elfogadott kifejezésalakok | Készség                | Szükséges korábbi részek |
| ---------- | ---------------------- | ------------------------------------------ | ---------------------- | ------------------------ |
| `hours`    | 45 perc órában         | `3/4` h                                    | `adatok-es-feltetelek` | —                        |
| `speed`    | Sebesség (km/h)        | `80` km/h                                  | `modellvalasztas`      | —                        |
| `distance` | 20 perc alatti út (km) | `80/3` km                                  | `modellvalasztas`      | —                        |

**Két segítségi lépcső**

1. A sebesség egységében óra szerepel, ezért az időket is órában add meg.
2. 45 perc = 3/4 h; 20 perc = 1/3 h. A sebesség út osztva idővel.

**Részletes megoldás**

1. `60 : (3/4) = 80 km/h` — Az azonos egységben megadott időre számolunk.

2. `80 × (1/3) = 80/3 km` — A 20 perc egyharmad óra.

3. `(80/3) × (45/20) = 60 km` — Az állandó sebesség modelljében az utak aránya az idők aránya.

**Megőrzendő gondolat:** A modellfeltétel és az egységváltás együtt teszi jogossá a számolást.

**Saját indoklás:** Miért nem írhatnánk le ugyanezt automatikusan egy megállásokat tartalmazó út minden részére?

**Önellenőrzési szempontok az indokláshoz**

- A feltételezett sebesség akkor nem lenne végig állandó.
- Az egész útra számolt átlagsebesség nem mondja meg minden részszakasz sebességét.

**Célzott hibajavítás**

| Mező       | Jellemző hibás bevitel | Visszajelzés                                       |
| ---------- | ---------------------- | -------------------------------------------------- |
| `hours`    | `0.45`                 | Az óra 60 perc, nem 100. A 45 perc 45/60 óra.      |
| `distance` | `1600`                 | A 20 percet a km/h sebességhez órára kell váltani. |

### SM06-G06 — 6. gyakorlófeladat

**Alkalmazásazonosító:** `szoveges-modellek-practice-6`.

Két teljes árú és három félárú jegy együtt 2800 Ft. Minden félárú jegy a teljes ár felébe kerül, más költség nincs. x a teljes jegyár Ft-ban. Írd fel a teljes költség egyenletét, majd add meg a kétféle jegyárat.

**Válaszmezők, helyes alakok és készségek**

| Mező       | Kérdés                            | Helyes válasz / elfogadott kifejezésalakok                                                                                                                       | Készség                                   | Szükséges korábbi részek |
| ---------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------ |
| `equation` | Teljes költség balra, 2800 jobbra | `2x+3*(x/2)=2800`; `2*x+3*(x/2)=2800`; `2x+3*x/2=2800`; `2*x+3*x/2=2800`; `2x+3x/2=2800`; `3.5x=2800`; `3.5*x=2800`; `(2+3/2)*x=2800`; `7x/2=2800`; `7*x/2=2800` | `adatok-es-feltetelek`, `modellvalasztas` | —                        |
| `full`     | Teljes árú jegy (Ft)              | `800` Ft (változó: `x`)                                                                                                                                          | `modellvalasztas`                         | —                        |
| `half`     | Félárú jegy (Ft)                  | `400` Ft                                                                                                                                                         | `modellvalasztas`                         | —                        |

**Két segítségi lépcső**

1. A három félárú jegy együtt másfél teljes jegy árának felel meg.
2. Összesen 2 + 3/2 = 7/2 teljes árnyi költség szerepel.

**Részletes megoldás**

1. `(7/2)x = 2800; x = 2800 × 2/7 = 800 Ft` — A teljes árat a teljesár-egységek számával visszakeressük.

2. `800 : 2 = 400 Ft` — A félárú jegy a teljes ár fele.

3. `2 × 800 + 3 × 400 = 2800 Ft` — Mindkét jegyfajtát a saját árával ellenőrizzük.

**Megőrzendő gondolat:** Különböző árú tételeket nem szabad azonos jegyárként összevonni.

**Saját indoklás:** Miért lehet mégis teljesár-egységekkel számolni?

**Önellenőrzési szempontok az indokláshoz**

- Minden félárú jegy pontosan fél teljes ár.
- A két teljes és három fél ár összesen három és fél teljes ár.

**Célzott hibajavítás**

| Mező       | Jellemző hibás bevitel | Visszajelzés                                                       |
| ---------- | ---------------------- | ------------------------------------------------------------------ |
| `equation` | `5x=2800`              | A három félárú jegy nem teljes x Ft-os; egyenként x/2 Ft-ba kerül. |

### SM06-G07 — 7. gyakorlófeladat

**Alkalmazásazonosító:** `szoveges-modellek-practice-7`.

Négy egyforma füzet 1800 Ft-ba kerül. A vásárló táskájában közben 7 toll van. Szükséges-e a 7-es adat a füzet egységárához? Mennyi egy füzet ára, és mennyi a négy füzet ellenőrzött összege?

**Válaszmezők, helyes alakok és készségek**

| Mező     | Kérdés                                  | Helyes válasz / elfogadott kifejezésalakok | Készség                | Szükséges korábbi részek |
| -------- | --------------------------------------- | ------------------------------------------ | ---------------------- | ------------------------ |
| `needed` | Szükséges a táskában lévő tollak száma? | Nem (azonosító: `no`)                      | `adatok-es-feltetelek` | —                        |
| `price`  | Egy füzet ára (Ft)                      | `450` Ft                                   | `modellvalasztas`      | —                        |
| `check`  | Négy füzet ára visszaszámolva (Ft)      | `1800` Ft                                  | `modell-ellenorzes`    | `price`                  |

A `needed` mező választásai: `yes` = Igen; `no` = Nem.

**Két segítségi lépcső**

1. A kérdés füzetárról szól; keresd az ahhoz tartozó mennyiséget és összeget.
2. 1800 Ft-ot négy egyenlő részre osztunk.

**Részletes megoldás**

1. `A 7 toll adata felesleges ehhez a kérdéshez` — Nem módosítja sem a füzetek számát, sem a vásárlás árát.

2. `1800 : 4 = 450 Ft; 4 × 450 = 1800 Ft` — Az egységárból visszakapjuk az ismert teljes árat.

**Megőrzendő gondolat:** Nem kötelező minden számot felhasználni.

**Saját indoklás:** Milyen új kérdésben lehetne mégis szerepe a 7 tollnak?

**Önellenőrzési szempontok az indokláshoz**

- Például a táskában lévő tárgyak számánál.
- Ehhez azonban külön meg kellene mondani, milyen tárgyakat számolunk együtt.

**Célzott hibajavítás**

| Mező     | Jellemző hibás bevitel | Visszajelzés                                                     |
| -------- | ---------------------- | ---------------------------------------------------------------- |
| `needed` | `yes`                  | A tollak mennyisége nem kapcsolódik a külön megadott füzetárhoz. |

### SM06-G08 — 8. gyakorlófeladat

**Alkalmazásazonosító:** `szoveges-modellek-practice-8`.

Egy téglalap egyik oldala 12 cm. A másik oldaláról nincs adat. Számítsd ki a területet két megengedett példában: b = 3 cm és b = 5 cm. Egyértelműen meghatározza-e az eredeti adat a területet?

**Válaszmezők, helyes alakok és készségek**

| Mező     | Kérdés                                          | Helyes válasz / elfogadott kifejezésalakok | Készség                                     | Szükséges korábbi részek |
| -------- | ----------------------------------------------- | ------------------------------------------ | ------------------------------------------- | ------------------------ |
| `first`  | Terület b = 3 cm mellett (cm²)                  | `36` cm²                                   | `modellvalasztas`                           | —                        |
| `second` | Terület b = 5 cm mellett (cm²)                  | `60` cm²                                   | `modellvalasztas`                           | —                        |
| `unique` | Egyetlen terület következik a 12 cm-es adatból? | Nem (azonosító: `no`)                      | `adatok-es-feltetelek`, `modell-ellenorzes` | `first`, `second`        |

A `unique` mező választásai: `yes` = Igen; `no` = Nem.

**Két segítségi lépcső**

1. A területhez két szomszédos oldal szorzata kell.
2. T = 12b. A b = 3 és b = 5 is megengedett, mert nincs más feltétel.

**Részletes megoldás**

1. `12 × 3 = 36 cm²; 12 × 5 = 60 cm²` — Két különböző téglalap is teljesíti a közölt adatot.

2. `A terület nem egyértelmű` — Eltérő eredményekhez vezető megengedett példákat találtunk.

**Megőrzendő gondolat:** A hiányzó adatot nem találjuk ki; megmutatjuk, miért van rá szükség.

**Saját indoklás:** Milyen plusz adat tenné kiszámíthatóvá a területet?

**Önellenőrzési szempontok az indokláshoz**

- Például a másik oldal hossza.
- Megfelelő kerületadat is elég lehetne a másik oldal meghatározásához.

**Célzott hibajavítás**

| Mező     | Jellemző hibás bevitel | Visszajelzés                                                                            |
| -------- | ---------------------- | --------------------------------------------------------------------------------------- |
| `unique` | `yes`                  | A 36 cm² és a 60 cm² is megfelel az egyetlen közölt oldalnak; nincs egyértelmű terület. |

### SM06-G09 — 9. gyakorlófeladat

**Alkalmazásazonosító:** `szoveges-modellek-practice-9`.

Egy feljegyzés szerint 3 egyforma termék darabonként 300 Ft, és a teljes ár 850 Ft. Kedvezmény és egyéb költség nincs. Mennyi lenne a számított összeg, mekkora az eltérés, és lehet-e egyszerre igaz minden adat?

**Válaszmezők, helyes alakok és készségek**

| Mező         | Kérdés                                       | Helyes válasz / elfogadott kifejezésalakok | Készség                                     | Szükséges korábbi részek |
| ------------ | -------------------------------------------- | ------------------------------------------ | ------------------------------------------- | ------------------------ |
| `total`      | Számított teljes ár (Ft)                     | `900` Ft                                   | `modellvalasztas`                           | —                        |
| `difference` | A számított ár ennyivel nagyobb 850-nél (Ft) | `50` Ft                                    | `modell-ellenorzes`                         | `total`                  |
| `consistent` | Összhangban vannak az adatok?                | Nem (azonosító: `no`)                      | `adatok-es-feltetelek`, `modell-ellenorzes` | `difference`             |

A `consistent` mező választásai: `yes` = Igen; `no` = Nem.

**Két segítségi lépcső**

1. A kedvezmény hiányát is feltételként kezeld.
2. Hasonlítsd össze a 3 × 300 Ft-ot az állított 850 Ft-tal.

**Részletes megoldás**

1. `3 × 300 = 900 Ft` — Azonos egységár és darabszám szorzatát vesszük.

2. `900 − 850 = 50 Ft` — Az eltérés nem nulla.

3. `Legalább egy adatot javítani vagy kiegészíteni kell` — Nem feltételezhetünk hallgatólagosan kedvezményt, amikor a szöveg kizárja.

**Megőrzendő gondolat:** Az adatok összhangja is ellenőrizendő feltétel.

**Saját indoklás:** Miért nem írhatunk be magunktól 50 Ft kedvezményt?

**Önellenőrzési szempontok az indokláshoz**

- A történet kifejezetten azt mondja, hogy nincs kedvezmény.
- Előbb tisztázni kell, mely adat vagy feltétel hibás.

**Célzott hibajavítás**

| Mező         | Jellemző hibás bevitel | Visszajelzés                                                                                           |
| ------------ | ---------------------- | ------------------------------------------------------------------------------------------------------ |
| `consistent` | `yes`                  | Háromszor 300 Ft pontosan 900 Ft. A megadott feltételek között az 850 Ft nem egyeztethető ezzel össze. |

### SM06-G10 — 10. gyakorlófeladat

**Alkalmazásazonosító:** `szoveges-modellek-practice-10`.

113 tanulónak szervezünk utazást. Egy buszon 48 tanulói ülőhely van; mindenki ül, más utas nincs. Add meg a 113 : 48 pontos hányadost, a szükséges buszok legkisebb egész számát és az üres tanulói helyek számát.

**Válaszmezők, helyes alakok és készségek**

| Mező       | Kérdés                | Helyes válasz / elfogadott kifejezésalakok | Készség                                   | Szükséges korábbi részek |
| ---------- | --------------------- | ------------------------------------------ | ----------------------------------------- | ------------------------ |
| `quotient` | 113 : 48 pontosan     | `113/48`                                   | `modellvalasztas`                         | —                        |
| `buses`    | Legkevesebb busz (db) | `3` db                                     | `adatok-es-feltetelek`, `modellvalasztas` | —                        |
| `empty`    | Üres helyek száma     | `31`                                       | `modell-ellenorzes`                       | `buses`                  |

**Két segítségi lépcső**

1. A hányados nem automatikusan megvásárolható buszszám.
2. Két busz 96, három busz 144 tanulói helyet ad.

**Részletes megoldás**

1. `113/48 = 2 + 17/48` — Két teljes busz után 17 tanuló marad.

2. `3 busz szükséges` — A legkisebb egész számot keressük, amely elegendő helyet ad.

3. `3 × 48 − 113 = 31` — A tényleges kapacitásból levonjuk a tanulók számát.

**Megőrzendő gondolat:** Az egész darabszámra és az elegendő kapacitásra vonatkozó feltétel határozza meg a választ.

**Saját indoklás:** Miért nem a szokásos legközelebbi egészre kerekítünk?

**Önellenőrzési szempontok az indokláshoz**

- Az lefelé 2-t adna, ami nem elég.
- Itt az összes tanuló elhelyezése a feltétel, ezért felfelé választunk egész buszszámot.

**Célzott hibajavítás**

| Mező    | Jellemző hibás bevitel | Visszajelzés                                                                        |
| ------- | ---------------------- | ----------------------------------------------------------------------------------- |
| `buses` | `2`                    | Két busz csak 96 tanulónak ad helyet, ami kevesebb 113-nál.                         |
| `empty` | `17`                   | A 17 a két busz után még el nem helyezett tanulók száma. Három buszon 144 hely van. |

### SM06-G11 — 11. gyakorlófeladat

**Alkalmazásazonosító:** `szoveges-modellek-practice-11`.

Egy medencébe 36 L vizet töltünk. Egy csap végig 2 L/perc vizet ad. Az azonos csapok egymást nem lassítják, egyszerre indulnak, nincs kifolyás. Mennyi idő kell 6 csappal, mennyi 3 csappal, és mennyi víz érkezik 3 csappal az utóbbi idő alatt?

**Válaszmezők, helyes alakok és készségek**

| Mező    | Kérdés                                       | Helyes válasz / elfogadott kifejezésalakok | Készség             | Szükséges korábbi részek |
| ------- | -------------------------------------------- | ------------------------------------------ | ------------------- | ------------------------ |
| `six`   | Idő 6 csappal (perc)                         | `3` perc                                   | `modellvalasztas`   | —                        |
| `three` | Idő 3 csappal (perc)                         | `6` perc                                   | `modellvalasztas`   | —                        |
| `check` | 3 csap összes vize a számított idő alatt (L) | `36` L                                     | `modell-ellenorzes` | `three`                  |

**Két segítségi lépcső**

1. Először az együtt működő csapok percenkénti összhozamát keresd.
2. Hat csap 12 L/percet, három csap 6 L/percet ad.

**Részletes megoldás**

1. `36 : (6 × 2) = 3 perc` — Hat csap együttes vízhozamával osztunk.

2. `36 : (3 × 2) = 6 perc` — A fele létszám kétszer annyi ideig dolgozik ebben a modellben.

3. `3 × 2 × 6 = 36 L` — A kapott idővel visszaszámoljuk a térfogatot.

**Megőrzendő gondolat:** A fordított arányosság a kimondott, azonos teljesítményű és egymást nem akadályozó működésből következik.

**Saját indoklás:** Miért szerepel a feltétel, hogy a csapok nem lassítják egymást?

**Önellenőrzési szempontok az indokláshoz**

- Közös szűk keresztmetszetnél a vízhozam nem feltétlenül a csapok számával szorzódna.
- A választott modell csak a megadott működésre érvényes.

**Célzott hibajavítás**

| Mező    | Jellemző hibás bevitel | Visszajelzés                                                          |
| ------- | ---------------------- | --------------------------------------------------------------------- |
| `three` | `1.5`                  | Kevesebb azonos csap kisebb összhozamot ad; a szükséges idő ezért nő. |

### SM06-G12 — 12. gyakorlófeladat

**Alkalmazásazonosító:** `szoveges-modellek-practice-12`.

Két kitalált díjszabás érvényes ugyanarra az útra: A = 500 + 200x Ft, B = 350x Ft, ahol x az út km-ben. Számítsd ki mindkét árat 4 km-re, és keresd meg azt a pontos úthosszt, ahol egyenlők. Nincs más költség.

**Válaszmezők, helyes alakok és készségek**

| Mező   | Kérdés                        | Helyes válasz / elfogadott kifejezésalakok | Készség           | Szükséges korábbi részek |
| ------ | ----------------------------- | ------------------------------------------ | ----------------- | ------------------------ |
| `a`    | A díj 4 km-re (Ft)            | `1300` Ft                                  | `modellvalasztas` | —                        |
| `b`    | B díj 4 km-re (Ft)            | `1400` Ft                                  | `modellvalasztas` | —                        |
| `same` | Azonos díjhoz tartozó út (km) | `10/3` km (változó: `x`)                   | `modellvalasztas` | —                        |

**Két segítségi lépcső**

1. A fix 500 Ft-ot a kilométerenkénti díjkülönbség egyenlíti ki.
2. 500 + 200x = 350x, tehát 500 = 150x.

**Részletes megoldás**

1. `A(4) = 500 + 800 = 1300 Ft; B(4) = 1400 Ft` — Mindkét szabályba ugyanazt az utat helyettesítjük.

2. `x = 500/150 = 10/3 km` — A díjegyenlőségből a pontos tört értéket kapjuk.

3. `Mindkét díj 3500/3 Ft az egyenlőségi pontban` — A tört úthosszal is ellenőrizhető az azonosság.

**Megőrzendő gondolat:** A modellalkotás nemcsak számolás, hanem összehasonlítás is lehet.

**Saját indoklás:** Miért nem egyenes arányosság az A teljes díja az úttal?

**Önellenőrzési szempontok az indokláshoz**

- A kezdőértéke 500 Ft.
- Az út duplázása nem duplázza meg az egyszeri alapdíjat.

**Célzott hibajavítás**

| Mező   | Jellemző hibás bevitel | Visszajelzés                                                     |
| ------ | ---------------------- | ---------------------------------------------------------------- |
| `same` | `2.5`                  | A két változó díj különbsége kilométerenként 150 Ft, nem 200 Ft. |

## 7. Önálló próba

Először a segítségek és a megoldás megnyitása nélkül próbálkozz. Az alkalmazás külön kezeli az önállóan és segítséggel elért eredményt. A két feladat nem a teljes modul vagy a teljes évfolyam tudásának vizsgája.

### SM06-Z01 — 1. önálló próbafeladat

**Alkalmazásazonosító:** `szoveges-modellek-exit-1`.

Három egyforma táska és egyszeri 700 Ft szállítás együtt 4300 Ft. x egy táska ára Ft-ban. Írd fel a teljes költség egyenletét, számítsd ki x-et, és add meg a visszaellenőrzött teljes összeget.

**Válaszmezők, helyes alakok és készségek**

| Mező       | Kérdés                            | Helyes válasz / elfogadott kifejezésalakok                                   | Készség                                   | Szükséges korábbi részek |
| ---------- | --------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------- | ------------------------ |
| `equation` | Teljes költség balra, 4300 jobbra | `3x+700=4300`; `3*x+700=4300`; `700+3x=4300`; `700+3*x=4300`; `x*3+700=4300` | `adatok-es-feltetelek`, `modellvalasztas` | —                        |
| `price`    | Egy táska ára (Ft)                | `1200` Ft (változó: `x`)                                                     | `modellvalasztas`                         | —                        |
| `check`    | Ellenőrzött teljes költség (Ft)   | `4300` Ft                                                                    | `modell-ellenorzes`                       | `equation`, `price`      |

**Két segítségi lépcső**

1. Az egyszeri szállítást külön tagként írd.
2. A táskákra 4300 − 700 Ft jut; ennek harmadát keresed.

**Részletes megoldás**

1. `3x + 700 = 4300; 3x = 3600; x = 1200 Ft` — A történet műveleteit visszafelé végezzük el.

2. `3 × 1200 + 700 = 4300 Ft` — Az eredeti összefüggés teljesül.

**Megőrzendő gondolat:** Az ismeretlen jelentése, az egyszeri tag és a visszaellenőrzés együtt ad teljes választ.

**Saját indoklás:** Melyik adat mondja meg, hogy a 700-at csak egyszer adjuk hozzá?

**Önellenőrzési szempontok az indokláshoz**

- Az egyszeri szállítás megfogalmazás.
- A három darab a táskák számára vonatkozik.

**Célzott hibajavítás**

| Mező       | Jellemző hibás bevitel | Visszajelzés                                 |
| ---------- | ---------------------- | -------------------------------------------- |
| `equation` | `3*(x+700)=4300`       | A szállítás egyszer szerepel, nem háromszor. |

### SM06-Z02 — 2. önálló próbafeladat

**Alkalmazásazonosító:** `szoveges-modellek-exit-2`.

Két rúd együtt 46 cm hosszú. A hosszabb 8 cm-rel hosszabb a rövidebbnél. x a rövidebb hossza cm-ben. Írd fel az összeg egyenletét és add meg a két hosszt.

**Válaszmezők, helyes alakok és készségek**

| Mező       | Kérdés                  | Helyes válasz / elfogadott kifejezésalakok                                           | Készség                                   | Szükséges korábbi részek |
| ---------- | ----------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------- | ------------------------ |
| `equation` | Összeg balra, 46 jobbra | `x+(x+8)=46`; `x+x+8=46`; `(x+8)+x=46`; `2x+8=46`; `2*x+8=46`; `8+2x=46`; `8+2*x=46` | `adatok-es-feltetelek`, `modellvalasztas` | —                        |
| `short`    | Rövidebb (cm)           | `19` cm (változó: `x`)                                                               | `modellvalasztas`                         | —                        |
| `long`     | Hosszabb (cm)           | `27` cm                                                                              | `modellvalasztas`                         | —                        |

**Két segítségi lépcső**

1. A hosszabb rúd x + 8, és mindkettőt beleszámítjuk az összegbe.
2. 46 − 8 = 38 cm marad két egyenlő alapdarabra.

**Részletes megoldás**

1. `2x + 8 = 46; x = 38 : 2 = 19 cm` — A többlet után megmaradt részt felezzük.

2. `19 + 8 = 27 cm` — Visszaállítjuk a hosszabb rudat.

3. `19 + 27 = 46; 27 − 19 = 8` — A két feltétel egyszerre teljesül.

**Megőrzendő gondolat:** A két hossz csak akkor jó, ha az összeg és a különbség is megfelelő.

**Saját indoklás:** Mely két egyenlőséggel ellenőriznéd a válaszodat?

**Önellenőrzési szempontok az indokláshoz**

- A két hossz összege 46 cm.
- A hosszabb és rövidebb különbsége 8 cm.

**Célzott hibajavítás**

| Mező    | Jellemző hibás bevitel | Visszajelzés                                                      |
| ------- | ---------------------- | ----------------------------------------------------------------- |
| `short` | `23`                   | A két rész nem egyenlő: előbb a 8 cm többletet kell elkülöníteni. |

## 8. Összefoglalás és fogalomtár

- Nevezd meg a keresett mennyiséget és az egységét.
- Az adatokat a szerepük szerint válogasd; hiányzó adatot ne találj ki.
- A rajz, táblázat és egyenlet ugyanazt a kapcsolatot őrizze.
- Mondd ki a munkamodell, sebesség vagy ár feltételeit.
- A megoldás minden feltételt teljesítsen, a szükséges egész darabszámot is.

| Fogalom            | Jelentés                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| Matematikai modell | A helyzet lényeges kapcsolatait leíró rajz, táblázat, kifejezés vagy egyenlet, megadott feltételekkel. |
| Ismeretlen         | A keresett mennyiség; jelölését, jelentését és egységét előre rögzítjük.                               |
| Feltétel           | Olyan kikötés, amely megszabja, milyen helyzetre és milyen válaszokra érvényes a feladat.              |
| Felesleges adat    | A kérdés megválaszolásához nem szükséges információ; más kérdésben még lehet szerepe.                  |
| Hiányos feladat    | A közölt adatokból nem állapítható meg egyértelműen a kért érték.                                      |
| Ellentmondó adatok | Olyan állítások, amelyek a megadott feltételekkel nem lehetnek egyszerre igazak.                       |
| Visszaellenőrzés   | A kapott eredmény vizsgálata az eredeti történet minden lényeges feltétele alapján.                    |

## 9. Determinisztikus, változatos gyakorlás

A [generátorforrás](../../app/src/math/bridge-generators.ts) a családazonosító, seed és változat alapján ismételhető feladatot állít elő. Azonos bemenethez azonos kérdés, válasz, segítség és megoldás tartozik; a seed és a változat negatív biztonságos egész is lehet. A témán belüli sorrend a következő:

| Témán belüli index | Családazonosító           | Tartalom                          | Készségek                                                      |
| ------------------ | ------------------------- | --------------------------------- | -------------------------------------------------------------- |
| 0                  | `model-fixed-fee-v1`      | Egységár és egyszeri díj modellje | `adatok-es-feltetelek`, `modellvalasztas`, `modell-ellenorzes` |
| 1                  | `model-sum-difference-v1` | Két hossz összege és különbsége   | `adatok-es-feltetelek`, `modellvalasztas`, `modell-ellenorzes` |
| 2                  | `model-whole-packs-v1`    | Egész csomag és megmaradó darabok | `adatok-es-feltetelek`, `modellvalasztas`, `modell-ellenorzes` |

A függő ellenőrző rész mezői a generált feladatban is együtt maradnak a szükséges előzményekkel. A családok nem pusztán a rögzített feladatok végértékét cserélik: az adott témához illő paramétertartományokkal, több kapcsolódó részválasszal és feladattípusnak megfelelő feltételekkel dolgoznak.

**A generált ellenőrző csoportok részfüggőségei**

- `model-fixed-fee-v1` / `check` → `equation`, `price`
- `model-sum-difference-v1` / `difference` → `equation`, `short`, `long`
- `model-whole-packs-v1` / `spare` → `packs`

## 10. Azonosítók és válaszszerződés

A kézirat és az alkalmazás közötti megfeleltetés az [új lecketartalom](../../app/src/content/bridge-lessons.ts) `bridgeManuscriptMap` exportjában is szerepel. J = jóslás, P = kidolgozott példa, G = gyakorlás, Z = önálló próba. A példák sorrendjéhez tartozik a két P-azonosító; az alkalmazásban a példák nem válaszbekérő feladatrekordok.

| Kéziratazonosító | Alkalmazásbeli rekord           | Külön ellenőrzött mezők             |
| ---------------- | ------------------------------- | ----------------------------------- |
| `SM06-J01`       | `szoveges-modellek-prediction`  | `tickets`, `one`                    |
| `SM06-G01`       | `szoveges-modellek-practice-1`  | `equation`, `price`, `total`        |
| `SM06-G02`       | `szoveges-modellek-practice-2`  | `equation`, `short`, `long`         |
| `SM06-G03`       | `szoveges-modellek-practice-3`  | `child`, `father`, `laterRatio`     |
| `SM06-G04`       | `szoveges-modellek-practice-4`  | `start`, `four`, `time`             |
| `SM06-G05`       | `szoveges-modellek-practice-5`  | `hours`, `speed`, `distance`        |
| `SM06-G06`       | `szoveges-modellek-practice-6`  | `equation`, `full`, `half`          |
| `SM06-G07`       | `szoveges-modellek-practice-7`  | `needed`, `price`, `check`          |
| `SM06-G08`       | `szoveges-modellek-practice-8`  | `first`, `second`, `unique`         |
| `SM06-G09`       | `szoveges-modellek-practice-9`  | `total`, `difference`, `consistent` |
| `SM06-G10`       | `szoveges-modellek-practice-10` | `quotient`, `buses`, `empty`        |
| `SM06-G11`       | `szoveges-modellek-practice-11` | `six`, `three`, `check`             |
| `SM06-G12`       | `szoveges-modellek-practice-12` | `a`, `b`, `same`                    |
| `SM06-Z01`       | `szoveges-modellek-exit-1`      | `equation`, `price`, `check`        |
| `SM06-Z02`       | `szoveges-modellek-exit-2`      | `equation`, `short`, `long`         |

A számmezők racionális értéket és szükség szerint egységet ellenőriznek; a magyar tizedesvessző használható. A kifejezésmező véges, szerző által megadott helyes alakokat fogad el, ezért a feladat pontosan kéri a választandó szerkezetet. Ez nem általános számítógépes algebrai rendszer, és nem futtatja a bevitt szöveget kódként. A gyökjeles alaknál a jelölés és az eredeti gyök alatti szám megőrzése a cél.

A táblázatok „Szükséges korábbi részek” oszlopa a `requiresParts` kapcsolatot mutatja. A függő részhez tartozó készségbizonyíték csak ugyanabban az ellenőrzésben helyes előzménylánc mellett számít. Így a közölt teljes összeg visszamásolása önmagában nem igazolja a modell visszaellenőrzését. A szükséges kapcsolat tranzitív: ha az egyezőséghez négyzet, a négyzethez kerekített oldal kell, mindkettő az ellenőrző csoport része. Az egymástól független helyettesítésekhez nem írunk elő mesterséges sorrendet.

## 11. Egységszintű lefedettség és korlátok

| Lefedett egység | Az aktuális tématérkép megnevezése                                  |
| --------------- | ------------------------------------------------------------------- |
| `M12.01`        | Adat, kérdés, feltétel és felesleges adat megkülönböztetése.        |
| `M12.02`        | Ismeretlen és mértékegység megválasztása.                           |
| `M12.03`        | Szakaszábra, táblázat, próbálgatás vagy egyenlet választása.        |
| `M12.04`        | Részek, összegek, különbségek és életkorhelyzetek modellezése.      |
| `M12.06`        | Út, idő, sebesség és más állandó ütemű folyamatok modellfeltételei. |
| `M12.07`        | Hiányos, ellentmondó vagy többféleképpen értelmezhető feladat.      |

Az M12.05 árak és költségtervezés egység részben kapcsolódik az ár- és díjösszehasonlító feladatokhoz, de önálló teljes költségterv és költségvetési döntéssor nincs kidolgozva; ezért nem jelöljük kész egységként. A másik hat felsorolt egységhez külön tartalom, gyakorlás és ellenőrzés tartozik.

## 12. Ellenőrzési alap és tartalmi mérleg

Ebben az útban 15 kérdésrekord szerepel: 1 jósló belépő, 12 gyakorló és 2 önálló próbafeladat. Ehhez 44 külön ellenőrzött válaszmező, 21 szerzői célzott hibaszabály, 2 kidolgozott példa és 3 generátorcsalád tartozik. Ezek az aktuális adatmodellből számított darabszámok.

A [tartalmi tesztek](../../app/tests/bridge-content.test.ts) a szerzői válaszokat a feladatok adataiból felírt, külön racionális számításokkal vetik össze; a kifejezésváltozatokat külön matematikai értelmező ellenőrzi. Vizsgálják a célzott hibajavítás tényleges üzenetét, a részfüggőségek érvényességét, a fogalmi korlátokat és a kézirat–alkalmazás kapcsolatot. A [generátortesztek](../../app/tests/bridge-generators.test.ts) családonként 200 feladat látható szövegéből külön számolják újra az eredményeket; a teljes négy témában további 252 szélső/negatív seed–változat visszajátszás is szerepel.

Az automatikus matematikai és működési ellenőrzés a tartalom pontosságáról és a végrehajtásról ad bizonyítékot. A tanulási hatás, a nyelvezet életkori megfelelősége és a valódi tanórai időigény tanári–tanulói kipróbálással vizsgálandó.
