# A négy alapozó út — tananyag-azonosítók és lefedettség

**Kiadás:** 0.2.0 · **Dátum:** 2026. november 6.

A négy eredeti kézirat változatlanul megmarad a `docs/tananyag/` könyvtárban. Az alkalmazásbeli tartalom forrása `app/src/content/foundations.ts`; a generált feladatoké `app/src/math/foundation-generators.ts`. A kézirat egy számozott gyakorlója egy alkalmazásbeli feladatrekord marad, akkor is, ha több külön választ kér.

## Mit őriz meg az integráció?

A kéziratok 48 gyakorlófeladata, 8 önálló zárófeladata és 8 kidolgozott példája megmarad. Ehhez 4 jósló belépő tartozik: az arányosság és a mértékegységek négy-négy eredeti jóslatát egy-egy több részből álló belépő fogja össze. Így **60 új kérdésrekordhoz 187 külön ellenőrzött válaszmező** tartozik. Ez nem 187 új feladat vagy tanulási egység. Minden rögzített feladatnak két fokozatos segítsége, indokolt megoldása és tanulsága van. Az új tartalomban 78 célzott hibavisszajelzési szabály és 39 saját szavas indoklási felhívás szerepel.

A korábbi hat út feladat- és témaazonosítói változatlanok. A négy új út azonosítói: `szamfogalom`, `muveleti-sorrend`, `aranyossag`, `mertekegysegek`.

## A válaszszerződés

- A `parts` válasz egy feladaton belül külön mezőket tárol, stabil helyi `id` értékkel. Az egész feladat akkor számít számszakilag helyesnek, ha minden ellenőrzött mező helyes. A hibás részek saját visszajelzést kapnak.
- A `number` pontos számot vagy egyszerű törtet kér; a magyar tizedesvesszőt kezeli. A feliratban kért egységhez tartozó mérőszám adható meg; ha a tanuló egységet is ír, azt is ellenőrzi.
- A `choice` a fogalmi döntésekre és kategóriákra szolgál. A több jó választ igénylő gyöngyfeladat három külön igen/nem döntést kér, nem egyetlen kiválasztásra lapítja a kérdést.
- Az `expression` véges, szerkesztett kifejezésalakokat ismer fel. Nem futtat kódot, nem használ `eval`-t, és nem általános algebrai azonosságvizsgáló. A szóközök és a szokásos műveleti jelváltozatok normalizálhatók; a zárójelek szerkezete megmarad. A zárójelezési feladat teljes kifejezést kér, nem pusztán végértéket.
- A `reflection` saját szavas indoklást és külön önellenőrző szempontokat ad. A szöveg értelmét a program nem pontozza automatikusan. A számszaki siker ezért nem állítás a teljes megértésről. A személyes magyarázat megőrzése a felület külön, kifejezett helyi mentési műveletéhez tartozik.

Az MS02-G10 b) kérdésében mind az öt, az eredeti számsorrendet megtartó egy-zárójelpáros megoldás elfogadott, amelyek értéke 2: `8-(2*3)`, `(8-2*3)`, `(8)-2*3`, `8-(2)*3`, `8-2*(3)`. Az MS02-G12 a szöveg sorrendjét követő, ki nem számított modellalakot kéri; a program nem állítja, hogy minden lehetséges algebrai alakot felismer.

## Feladatonkénti megfeleltetés

A `J` jelű belépőazonosítók az integráció szerkesztői hivatkozásai a kéziratok 2. fejezetére: ezek nem az eredeti kéziratban már szereplő számozott feladatazonosítók. A `G` és `Z` jelölések az eredeti számozott gyakorlókat és zárófeladatokat követik.

### Számfogalom és előjelek

Kézirat: [01-szamfogalom-es-elojelek.md](tananyag/01-szamfogalom-es-elojelek.md).

| Kéziratbeli vagy szerkesztői hivatkozás | Alkalmazásbeli azonosító | Ellenőrzött válaszmező | Saját szavas indoklás |
|---|---|---:|---|
| SZ01-J01 | `szamfogalom-prediction` | 1 | Igen, önellenőrző szempontokkal |
| SZ01-G01 | `szamfogalom-practice-1` | 6 | Igen, önellenőrző szempontokkal |
| SZ01-G02 | `szamfogalom-practice-2` | 5 | A feladat levezetése és megoldása támogatja |
| SZ01-G03 | `szamfogalom-practice-3` | 7 | Igen, önellenőrző szempontokkal |
| SZ01-G04 | `szamfogalom-practice-4` | 2 | A feladat levezetése és megoldása támogatja |
| SZ01-G05 | `szamfogalom-practice-5` | 6 | A feladat levezetése és megoldása támogatja |
| SZ01-G06 | `szamfogalom-practice-6` | 3 | Igen, önellenőrző szempontokkal |
| SZ01-G07 | `szamfogalom-practice-7` | 4 | A feladat levezetése és megoldása támogatja |
| SZ01-G08 | `szamfogalom-practice-8` | 2 | A feladat levezetése és megoldása támogatja |
| SZ01-G09 | `szamfogalom-practice-9` | 3 | Igen, önellenőrző szempontokkal |
| SZ01-G10 | `szamfogalom-practice-10` | 2 | A feladat levezetése és megoldása támogatja |
| SZ01-G11 | `szamfogalom-practice-11` | 4 | Igen, önellenőrző szempontokkal |
| SZ01-G12 | `szamfogalom-practice-12` | 4 | Igen, önellenőrző szempontokkal |
| SZ01-Z01 | `szamfogalom-exit-1` | 3 | Igen, önellenőrző szempontokkal |
| SZ01-Z02 | `szamfogalom-exit-2` | 3 | Igen, önellenőrző szempontokkal |

### Műveleti sorrend: olvasd a szerkezetet!

Kézirat: [02-muveleti-sorrend.md](tananyag/02-muveleti-sorrend.md).

| Kéziratbeli vagy szerkesztői hivatkozás | Alkalmazásbeli azonosító | Ellenőrzött válaszmező | Saját szavas indoklás |
|---|---|---:|---|
| MS02-J01 | `muveleti-sorrend-prediction` | 1 | Igen, önellenőrző szempontokkal |
| MS02-G01 | `muveleti-sorrend-practice-1` | 2 | A feladat levezetése és megoldása támogatja |
| MS02-G02 | `muveleti-sorrend-practice-2` | 3 | A feladat levezetése és megoldása támogatja |
| MS02-G03 | `muveleti-sorrend-practice-3` | 3 | Igen, önellenőrző szempontokkal |
| MS02-G04 | `muveleti-sorrend-practice-4` | 3 | Igen, önellenőrző szempontokkal |
| MS02-G05 | `muveleti-sorrend-practice-5` | 1 | A feladat levezetése és megoldása támogatja |
| MS02-G06 | `muveleti-sorrend-practice-6` | 3 | A feladat levezetése és megoldása támogatja |
| MS02-G07 | `muveleti-sorrend-practice-7` | 3 | Igen, önellenőrző szempontokkal |
| MS02-G08 | `muveleti-sorrend-practice-8` | 1 | A feladat levezetése és megoldása támogatja |
| MS02-G09 | `muveleti-sorrend-practice-9` | 3 | Igen, önellenőrző szempontokkal |
| MS02-G10 | `muveleti-sorrend-practice-10` | 2 | Igen, önellenőrző szempontokkal |
| MS02-G11 | `muveleti-sorrend-practice-11` | 3 | Igen, önellenőrző szempontokkal |
| MS02-G12 | `muveleti-sorrend-practice-12` | 2 | Igen, önellenőrző szempontokkal |
| MS02-Z01 | `muveleti-sorrend-exit-1` | 3 | Igen, önellenőrző szempontokkal |
| MS02-Z02 | `muveleti-sorrend-exit-2` | 3 | Igen, önellenőrző szempontokkal |

### Arányosság: mi marad ugyanaz?

Kézirat: [03-aranyossag.md](tananyag/03-aranyossag.md).

| Kéziratbeli vagy szerkesztői hivatkozás | Alkalmazásbeli azonosító | Ellenőrzött válaszmező | Saját szavas indoklás |
|---|---|---:|---|
| A–J01–04 | `aranyossag-prediction` | 4 | Igen, önellenőrző szempontokkal |
| A–G01 | `aranyossag-practice-1` | 3 | Igen, önellenőrző szempontokkal |
| A–G02 | `aranyossag-practice-2` | 2 | A feladat levezetése és megoldása támogatja |
| A–G03 | `aranyossag-practice-3` | 3 | A feladat levezetése és megoldása támogatja |
| A–G04 | `aranyossag-practice-4` | 4 | Igen, önellenőrző szempontokkal |
| A–G05 | `aranyossag-practice-5` | 1 | A feladat levezetése és megoldása támogatja |
| A–G06 | `aranyossag-practice-6` | 2 | Igen, önellenőrző szempontokkal |
| A–G07 | `aranyossag-practice-7` | 3 | Igen, önellenőrző szempontokkal |
| A–G08 | `aranyossag-practice-8` | 7 | Igen, önellenőrző szempontokkal |
| A–G09 | `aranyossag-practice-9` | 2 | Igen, önellenőrző szempontokkal |
| A–G10 | `aranyossag-practice-10` | 2 | A feladat levezetése és megoldása támogatja |
| A–G11 | `aranyossag-practice-11` | 6 | Igen, önellenőrző szempontokkal |
| A–G12 | `aranyossag-practice-12` | 5 | Igen, önellenőrző szempontokkal |
| A–Z01 | `aranyossag-exit-1` | 2 | Igen, önellenőrző szempontokkal |
| A–Z02 | `aranyossag-exit-2` | 4 | Igen, önellenőrző szempontokkal |

### Mértékegységek: ugyanaz a mennyiség

Kézirat: [04-mertekegysegek.md](tananyag/04-mertekegysegek.md).

| Kéziratbeli vagy szerkesztői hivatkozás | Alkalmazásbeli azonosító | Ellenőrzött válaszmező | Saját szavas indoklás |
|---|---|---:|---|
| M–J01–04 | `mertekegysegek-prediction` | 5 | Igen, önellenőrző szempontokkal |
| M–G01 | `mertekegysegek-practice-1` | 3 | Igen, önellenőrző szempontokkal |
| M–G02 | `mertekegysegek-practice-2` | 1 | A feladat levezetése és megoldása támogatja |
| M–G03 | `mertekegysegek-practice-3` | 4 | Igen, önellenőrző szempontokkal |
| M–G04 | `mertekegysegek-practice-4` | 2 | Igen, önellenőrző szempontokkal |
| M–G05 | `mertekegysegek-practice-5` | 2 | A feladat levezetése és megoldása támogatja |
| M–G06 | `mertekegysegek-practice-6` | 6 | A feladat levezetése és megoldása támogatja |
| M–G07 | `mertekegysegek-practice-7` | 1 | A feladat levezetése és megoldása támogatja |
| M–G08 | `mertekegysegek-practice-8` | 2 | Igen, önellenőrző szempontokkal |
| M–G09 | `mertekegysegek-practice-9` | 4 | A feladat levezetése és megoldása támogatja |
| M–G10 | `mertekegysegek-practice-10` | 2 | A feladat levezetése és megoldása támogatja |
| M–G11 | `mertekegysegek-practice-11` | 7 | Igen, önellenőrző szempontokkal |
| M–G12 | `mertekegysegek-practice-12` | 2 | Igen, önellenőrző szempontokkal |
| M–Z01 | `mertekegysegek-exit-1` | 2 | Igen, önellenőrző szempontokkal |
| M–Z02 | `mertekegysegek-exit-2` | 3 | Igen, önellenőrző szempontokkal |

## Kidolgozott példák

| Kézirat | Az alkalmazásbeli példa |
|---|---|
| SZ01-P01 — Negatív szám kivonása | `szamfogalom` út, `examples[0]` |
| SZ01-P02 — Hőmérséklet-változás | `szamfogalom` út, `examples[1]` |
| MS02-P01 — Két magasabb szintű művelet | `muveleti-sorrend` út, `examples[0]` |
| MS02-P02 — Zárójel, negatív alap, hatvány | `muveleti-sorrend` út, `examples[1]` |
| A–P1 — Egy méterből gondolkodva | `aranyossag` út, `examples[0]` |
| A–P2 — Több gép, ugyanaz a munka | `aranyossag` út, `examples[1]` |
| M–P1 — Burkolás: közös egység és egész csomag | `mertekegysegek` út, `examples[0]` |
| M–P2 — Dobozból liter | `mertekegysegek` út, `examples[1]` |

A példák megtartják az indokolt lépéseket, a visszaellenőrzést és az eredeti alternatív utakat. A burkolási példa az egész csomagok mellett a geometriai kirakhatóságot is ellenőrzi; a dobozpélda a teljes edénymagasságot és a vízmagasságot külön használja.

## Egységszintű lefedettség

A jelölés az itt megvalósított, konkrét egységcélhoz tartozó magyarázatot és gyakorlást mutatja. Nem bizonyítja a teljes modul vagy évfolyam elkészültét, és nem tanulói eredményességi minősítés.

| Út | A `coveredUnits` mezőben szereplő egységek | Konkrét tartalmi bizonyíték |
|---|---|---|
| Számfogalom | M01.01; M01.02; M01.03; M03.01; M03.02 | Számhalmazok besorolása; rendezés; ellentett és abszolút érték; előjeles összeadás/kivonás; szorzás/osztás és nulla. SZ01-G01–G12, Z01–Z02. |
| Műveleti sorrend | M03.03 | Csoportosítás, azonos rang, független kezdőlépések, hatványalap, igaz egyenlőséglánc, zárójelalkotás és nullával osztás. MS02-G01–G12, Z01–Z02. |
| Arányosság | M05.01; M05.02; M05.03; M05.04; M05.05; M05.06 | Arány és különbség; egységár és táblázat; egyenes/fordított modell; alapdíjas és csökkenő ellenpélda; modellfeltételek; keverési arány és arányos osztás. A–G01–G09, G12, Z01–Z02. |
| Mértékegységek | M20.01; M20.02; M20.03; M20.04 | Mérőszám és egység; hossz/tömeg/idő; négyzetes/köbös váltás; liter és köbegységek. M–G01–G09, G11, Z01–Z02. |

**Részleges kapcsolódások, amelyek nincsenek késznek jelölve:**

- M01.04: tört–tizedes alak szerepel, de a teljes tört–tizedes–százalék kapcsolatot ez az út nem dolgozza fel.
- M01.05: számsorrend és összehasonlítás szerepel, a közbeeső számok és sűrűség teljes célja még hiányzik.
- M03.04–M03.06: tizedesekkel számolunk és ellenőrzünk, de helyiérték-, kerekítés-, pontosság- és számológép-egységet ez a ciklus nem állít késznek.
- M07: a négyzet/köb és negatív alap csak a műveleti sorrendhez szükséges mélységben szerepel; nem teljes hatványozási modul.
- M05.07: A–G10 térképi méretarányt gyakorol, és a magyarázat tervrajzi példát is ad; a teljes egységet nem jelöljük elkészültnek.
- M20.05: M–G10 sebessége összetett egységet gyakorol; a mérési pontosság teljes egysége még nem készült el.
- A terület-, felszín- és térfogatalkalmazások nem jelölik késznek a teljes M16 vagy M19 geometriai modult.

Az előismereti kapcsolatok megnyitható utakra mutatnak, de nem kötelező sorrendek. Például a számfogalom törtes részeihez a törtek út nyújt támaszt; az egész számos belépéshez nem szükséges előbb végigjárni a törtek teljes útját.

## Az új generátorcsaládok

| Stabil, verziózott családazonosító | Út | Tartalmi mechanizmus |
|---|---|---|
| `signed-position-v1` | `szamfogalom` | Hely, ellentett és távolság |
| `signed-subtraction-v1` | `szamfogalom` | Kivonás az ellentett hozzáadásával |
| `signed-missing-v1` | `szamfogalom` | Hiányzó kivonandó és visszahelyettesítés |
| `order-chain-v1` | `muveleti-sorrend` | Azonos rangú osztás és szorzás |
| `order-independent-v1` | `muveleti-sorrend` | Független részek és zárójel |
| `order-signed-square-v1` | `muveleti-sorrend` | Négyzet vagy a négyzet ellentettje? |
| `ratio-unit-price-v1` | `aranyossag` | Változatlan egységár és új mennyiség |
| `ratio-shared-work-v1` | `aranyossag` | Állandó teljes munka, más létszám |
| `ratio-fixed-fee-v1` | `aranyossag` | Alapdíjas ellenpélda két adatpárral |
| `units-dimensions-v1` | `mertekegysegek` | Egy, két vagy három irányú egységváltás |
| `units-clock-v1` | `mertekegysegek` | Tizedes óra és óra–perc különbsége |
| `units-container-v1` | `mertekegysegek` | Rétegek, térfogat és szabad hely |

A családlisták tényleges hossza alapján választunk, nem egy általános, minden témára ráerőltetett feltételezésből. Ugyanaz a család, teljes biztonságos egész seed és változat ugyanazt a feladatot adja. A seed és a változat a `generated:…` azonosító része; negatív változatnál normalizált családindexet használunk. A család azonosítójának `v1` vége tartalomverzió, nem profiladat-séma.

## A tartalomhoz ténylegesen lefuttatott ellenőrzés

Az `app/tests/foundations.test.ts` hat tesztje sikeresen lefutott. A vizsgálat:

1. A 60 új kérdésrekord, az eredeti 48 gyakorló/8 zárófeladat/8 példa és a 187 válaszmező szerkezetét és azonosítóit ellenőrzi.
2. Minden fix numerikus mezőt külön, egész számlálós–nevezős aritmetikával újraszámol; a helyes választásokat szerkesztett jelentésreferenciákhoz köti. A számadatok jelenlétét a tényleges feladatszövegben is ellenőrzi.
3. A 78 célzott téves választ valóban beadja, és ellenőrzi a megfelelő részmező hibajelzését.
4. A 12 új család mindegyikéből 200, összesen 2400 generált feladatot vizsgál; a referenciát a látható feladatszövegből kiolvasott adatokból számolja, a generátor belső véletlenállapotának és tárolt helyes válaszainak felhasználása nélkül.
5. Megvizsgálja a determinisztikus újrajátszást, a nagy és negatív biztonságos egész seedeket, a negatív változatokat és az érvénytelen paraméterek visszautasítását.
6. Újraszámolja a nyolc kidolgozott példa lényegi eredményét és ellenőrzi a megjelenő feltételeket.

Ez a matematikai és tartalmi ellenőrzés. A műhelyek böngészős működését, a megjelenítést, a mentési migrációt és a teljes kiadást a projekt külön integrált ellenőrzése vizsgálja. A tanári lektorálás és tanulói kipróbálás továbbra is külön feladat.
