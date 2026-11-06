# Megvalósítási állapot — 0.3.0

**Dátum: 2026. november 6.**

## A mostani fejlesztési ciklus

A 0.3.0 kiadás négy új, teljes tanulási utat ad a korábbi tízhez: **betűs kifejezések, szöveges feladatok modellezése, hatványok és négyzetgyök**. Mindegyikhez a hat közös leckeszakasz, saját jóslás, teljes magyarázat, két kidolgozott példa, tizenkét gyakorló, két önálló próba, három determinisztikus generátorcsalád és működő interaktív műhely tartozik.

A másik új terület a **készségenkénti haladás és célzott javító gyakorlás**. A tanuló konkrét készséghez kap rövid magyarázatot, kapcsolódó műhelyt, új javító feladatot és egy további alkalmazást. Saját maga is választhat készséget. A 41 készséghez tartozó napló kizárólag a tényleges ellenőrzésekből épül; nem értékeli automatikusan a szabad szöveget, és nem minősíti a teljes tudást százalékkal.

A ciklus a frissen lekért `23ee76b0c6d1b1643345290b5a89e22ff45c4350` main commitra épült. Ez a 0.2.0 kiadás; a korábbi tíz lecke teljes tartalmi objektuma és azonosítói változatlanok maradtak. A történeti 0.1.0 és 0.2.0 tananyagmásolatok megőrzését külön tesztek ellenőrzik.

### A tényleges adatmodell számai

| Tartalom | Darab |
|---|---:|
| Bejárható tanulási út és műhely | 14 |
| Rögzített gyakorlófeladat | 144 |
| Önálló próbafeladat | 28 |
| Jósló kérdésrekord | 14 |
| Összes rögzített kérdésrekord | 186 |
| Külön ellenőrzött válaszmező | 436 |
| Kidolgozott példa | 28 |
| Általános determinisztikus generátorcsalád | 42 |
| Külön javító generátorcsalád | 1 |
| Összes generátorcsalád | 43 |
| Célzott hibavisszajelzési szabály a rögzített kérdésekben | 311 |
| Készségenkénti visszajelzéshez használt készség | 41 |

A `contentStats` a tényleges leckeadatokból és a két generátorjegyzékből számol; a kezdőlap és a `release-manifest.json` ugyanezt használja. Egy részmező nem új feladat; a generátorcsalád nem egyetlen feladat. A generált feladatok saját hibaszabályai nincsenek a rögzített 311 szabály közé számolva.

A tématérképen továbbra is **24 modul és 137 tervezett egység** van. A jelenlegi kapcsolatok: **61 egységnél tananyag és gyakorlás elérhető, 21 részben érintett, 55 tervezett**. Ez nem 61 külön lecke, nem a teljes modulok elkészülte, és nem tanulói eredményességi minősítés. A teljes évfolyam további ciklusokat igényel.

## A négy új műhely

| Út | A megértést szolgáló működés |
|---|---|
| Betűs kifejezések | Behelyettesítés előjeles és törtes értékkel; egynemű tagok kiválasztása; együttható és állandó tag; teljes zárójel szorzása; a külső mínusz hatása; ellenőrző szám és általános azonosságindok megkülönböztetése. |
| Szöveges modellek | Szükséges adatok kijelölése, az ismeretlen jelentése és egysége, modell és saját indok; alapdíjas, összeg–különbség, felesleges és hiányzó adatú történetek; táblázat, szakaszábra és visszaellenőrzés az eredeti helyzetben. |
| Hatványok | Azonos tényezőkre bontás; negatív alap és külső mínusz; négyzet- és kockaépítés sorokkal, rétegekkel; tíz hatványai és nagyságrend; külön kitekintés a feltételes nulladik hatványra és negatív tízkitevőre. |
| Négyzetgyök | Négyzetterületből nemnegatív oldal; pontos gyök és közelítés; egyre szűkebb korlátok és kerekítés; az x² = A egyenlet nulla, egy vagy két valós megoldása; √(a²) = abszolút érték; negatív gyök alatti szám magyarázata. |

A matematikai modellek pontos racionális vagy BigInt-aritmetikára épülnek; a rajzolási koordinátákhoz szükséges számkonverzió nem módosítja a matematikai értéket. Az ábrák szöveges megfelelői és billentyűzettel használható vezérlői megmaradnak. A gondolatmezők szövege csak külön választással mentődik.

## A készségnapló és a javító út szerződése

- A gépelés, megnyitás, műhelykezelés és jóslás nem készségesemény.
- A többmezős ellenőrzés csak az érvényesen ellenőrzött részválaszokat rögzíti. Az üres vagy értelmezhetetlen mező nem matematikai hiba.
- Az ismételt változatlan ellenőrzés, illetve az elfogadott helyes alakok közötti váltás nem hoz létre új sikert.
- Az első önálló részmegoldás és a segítséggel vagy javítás után elért megoldás külön jelenik meg. Azonos forrásfeladat másik útvonalon sem új tudásbizonyíték.
- A célzott választás a készséghez valóban tartozó új feladatot vagy részfeladatot ad. A másik feladatot kérő gomb az éppen nyitott, még üres feladat helyett is eltérő feladatot ad. A függő ellenőrző részhez szükséges előzmények együtt maradnak.
- A nyilvános locator megőrzi a választott feladatot újratöltéskor. Nem tartalmaz tanulói választ vagy naplót.
- Más szerkezet vagy alkalmazási helyzet elsőbbséget kap a továbblépésnél. Az egyszerű adatcsere külön jelzést kap, nem bizonyított tudásátviteli állítást.

A napló legfeljebb 2000 eltérő ellenőrzési eseményt őriz. A régebbi részletes bejegyzések kiesését jelzi, a feladatszintű eredmények megmaradnak. A felület visszajelzése megfigyelt gyakorlásról szól; nem diagnózis, osztályzat vagy teljes készségelsajátítás. Részletek: [Készségnapló és célzott javítás](KESZSEG_ES_JAVITAS.md).

## Forrás, kiadás és mentésmegőrzés

A teljes fejlesztőprojekt az `app/` alatt van. A gyökérbeli `index.html` az önálló, generált kiadás; az `app/index.html` kis Vite-belépő, a kettő nem cserélhető fel. A 0.1.1 mobiljavítások és a hálózat nélküli működés megmaradtak. A CSP továbbra is `connect-src 'none'`; nincs új API, CDN, előfizetés vagy költséges szolgáltatás.

A 0.3.0 kezdetén friss `npm ci` igazolta a lockfájlból telepítést. A függőségverziók nem változtak. Az alkalmazásverzióból származik a build és a portable fájlnév, a metaadat és a tesztelt fájl kiválasztása. A forrás, a beágyazott tartalmi snapshot, a verziózott JSON és a gyökérbeli kiadás egyezését a CI is ellenőrzi. Az aktuális snapshot a `content/v0.3.0/` alatt található; a Preact licence megmarad az önálló HTML-ben és a külső összetevők jegyzékében.

A tárolókulcs változatlan: `matek8:profile:v1`; az adatséma **3**. A séma 1 hat és a séma 2 tíz témáját külön, befagyasztott listából validáljuk. A régi eredmények, válaszok, segítségek, műhelyek és beállítások megmaradnak; a még nem létezett leckék üres állapottal indulnak. Az új részletes készségnapló üres, régi eredményből nem találunk ki eseményeket.

Az importkor nyitott régi vegyes feladat a megfelelő hatos vagy tízes sorrendben folytatható; új feladat kérésekor vált tizennégy témára. A validáció nem engedi át a hiányos régi vagy aktuális profilt. A sérült mentést nem törli automatikusan, az import továbbra is előnézetet és megerősítést igényel. A 10 000 feladatrekordos és 16 MB-os határ megmaradt. Részletek: [mentésmigráció](MENTES_MIGRACIO.md).

## Ellenőrzés és bizonyíték

A konkrétan vizsgált HTML hashét, a tényleges tesztszámokat, a böngészőverziót, a mobilállapotokat és a nyomtatási próbákat a [0.3.0 ellenőrzési jegyzőkönyv](ELLENORZES_0.3.0.md) rögzíti. A korábbi kiadás saját [0.2.0 jegyzőkönyve](ELLENORZES_0.2.0.md) történeti bizonyíték marad.

A kiadási kapuk: matematikai és tartalmi referenciák, megőrző migráció és szigorú naplóvalidáció; típusellenőrzött build és bájtpontos kiadásegyezés; tényleges böngészős feladatmegoldás a korábbi és új utakon; a valódi 0.1.1 és 0.2.0 UI-export importja; mobilnézet, billentyűzet, nyomtatás, offline megoldás és export.

A generátorteszt a látható kérdésadatokból számol külön referenciaeredményt, nem a generátor tárolt válaszát fogadja el bizonyítéknak. A böngészős kitöltés külön a tartalom, a vezérlők és az ellenőrző összekapcsolását vizsgálja. Az automatikus hozzáférhetőségi teszt nem tanúsítvány, a tananyag eredményességét tanulói vizsgálat még nem igazolta.

## GitHub és Pages

A CI az `app/` forrásából, friss telepítéssel épít, és csak az ellenőrzött gyökérbeli HTML kerülhet a Pages-csomagba. A távoli ellenőrzés eredménye mindig az adott commit [Actions-futásán](https://github.com/janszkyjozsef/8.os-matematika/actions/workflows/check-and-publish.yml) mérvadó.

A ciklus eleji és a feltöltés előtti friss GitHub-állapotban a Pages **nem volt engedélyezve** (`has_pages: false`). A rendelkezésre álló GitHub-kapcsolat kódfeltöltést támogat, a Pages első adminisztratív engedélyezésére nem kínál műveletet. Ha a Pages továbbra is ki van kapcsolva, a sikeres ellenőrzés után a telepítési job kifejezetten kimarad; ez nem éles publikálás. A távoli ellenőrzés és telepítés aktuális eredményét a konkrét commit Actions-futása mutatja.

Az egyszeri bekapcsolás és a megosztható link ellenőrzése az [élesítési útmutatóban](ELESITES.md) található. A tervezett cím: **https://janszkyjozsef.github.io/8.os-matematika/**. A letölthető önálló HTML a Pages állapotától függetlenül működik.

## A következő ciklusok

Az időben ütemezett ismétlés és a szabadon összeállítható feladatlap külön későbbi fejlesztés; a 0.3.0 nem jelenti ezeket késznek. A további tantervi egységek új, zárt ciklusokban készülhetnek el. A szaktanári lektorálás, tanulói kipróbálás, valódi telefonos és képernyőolvasós vizsgálat továbbra is szükséges visszajelzés a következő javításokhoz.
