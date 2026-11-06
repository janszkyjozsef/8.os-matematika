# Megvalósítási állapot — 0.2.0

**Dátum: 2026. november 6.**

## Elkészült fejlesztési ciklus

A 0.2.0 kiadásban a teljes moduláris forrás a repóba került, és a négy alapozó kézirat működő tanulási úttá vált. A tíz megnyitható út: **számfogalom és előjelek, műveleti sorrend, arányosság, mértékegységek, törtek, százalékszámítás, egyenletek, grafikonok, Pitagorasz-tétel és valószínűség**.

Minden új út végigjárható a hat közös szakaszon. Saját jóslás, teljes magyarázat, két kidolgozott példa, tizenkét gyakorló, két önálló próba, három determinisztikus generátorcsalád, célzott hibajavítás és valódi interaktív műhely tartozik hozzá. A több részből álló kérdéseket külön válaszmezők őrzik meg; a szöveges indoklás önellenőrzést kap.

### Az aktuális adatmodell számai

| Tartalom | Darab |
|---|---:|
| Bejárható tanulási út és műhely | 10 |
| Rögzített gyakorlófeladat | 96 |
| Önálló próbafeladat | 20 |
| Jósló kérdésrekord | 10 |
| Összes rögzített kérdésrekord | 126 |
| Külön ellenőrzött válaszmező | 253 |
| Kidolgozott példa | 20 |
| Determinisztikus generátorcsalád | 30 |
| Célzott hibavisszajelzési szabály | 210 |

A számokat a `contentStats` a tényleges leckeadatokból számolja; a `release-manifest.json` és a kezdőlapi összesítések ugyanezt a modellt használják. A részmező nem új feladat, a generátorcsalád pedig nem egyetlen feladat.

A tématérkép **24 modult és 137 tervezett egységet** tartalmaz. Jelenleg 45 egységhez kapcsolódik kifejtett tananyag és ellenőrizhető gyakorlás, 25 egységet részben érintenek a leckék, 67 egység tervezett. Ezek egységszintű kapcsolatok, nem 45 külön lecke, és nem a teljes évfolyam elkészülte. Például a sűrűség teljes fogalma, a teljes méretarány-egység és a mérési pontosság további fejlesztést igényel. A modulkártyák több kapcsolódó leckét is megjelenítenek.

## A négy műhely tartalma

| Út | Megvalósított matematikai kapcsolat |
|---|---|
| Számfogalom és előjelek | A pont helye és sorrendje; nullától és másik ponttól mért távolság; külön ellentett és abszolút érték; összeadás/kivonás mint elmozdulás; a − b = a + (−b). A nézet kitágul a látható tartományon túli eredményhez. |
| Műveleti sorrend | A tanuló részszámítást választ, eredményt ír be és indokolt lépésenként követi a teljes kifejezést. A zárójel, azonos rangú lánc, független ágak, negatív alap, külső mínusz és nullával osztás külön kezelést kap. Nincs kódfuttatás vagy eval. |
| Arányosság | Három történet: y = 400x, t = 24/n és y = 500 + 200x. Legalább három adatpár, táblázat és grafikon kapcsolódik össze. Állandó hányados/szorzat, alapdíjas ellenpélda, értelmezési tartomány és munkamodell-feltételek szerepelnek. |
| Mértékegységek | Egységépítés egy, két és három irányban; négyzetrács és valódi kockarétegek; egységváltás és élméret-nagyítás megkülönböztetése. Pontos hossz-, terület-, térfogat-, űrtartalom-, tömeg-, idő- és sebességváltás, össze nem illő dimenziók magyarázata. |

A műhelyek billentyűzettel kezelhetők, az ábrák adatai szövegesen is megjelennek. A saját indoklás mentése külön választható; a gép a szöveg értelmét nem minősíti.

## Forrásrendezés és megőrzés

A munkakezdéskor frissen ellenőrzött `main` commit `69d58b46a2b8162e60a8a28197ad0ed6b7fd1e82` volt. A korábbi helyi moduláris forrás ténylegesen elérhetőnek bizonyult, ezért abból állítottuk helyre az `app/` fejlesztőprojektet. A korábbi „nem érhető el a végrehajtókörnyezet” dokumentációs mondatok történeti állapotot írtak le; a forrásimport most megtörtént.

- Az `app/index.html` a Vite-belépő; a gyökérbeli `index.html` a generált, önálló kiadás. A működő 0.1.1-et nem írtuk felül a kis belépőfájllal.
- A 0.1.1 két bizonyított mobiljavítása bekerült a CSS-forrásba.
- Friss lockfájl-alapú `npm ci` telepítés igazolja a függőségek helyreállíthatóságát. Nem másolt `node_modules` lett a build alapja.
- Az alkalmazásverzióból származik a portable fájlnév, a metaadat és a böngészőteszt fájlválasztása. A forrás, az önálló HTML, a tartalmi JSON és a jegyzék egyezését a CI ellenőrzi.
- A `content/v0.1.0/` változatlan történeti referencia. Az új tartalom saját `content/v0.2.0/` másolatot kapott, amelyet a tényleges forrásból generálunk.
- A Preact licence megmarad a HTML-ben és a külső összetevők jegyzékében. A portable script az újabb jegyzéket nem írja felül régi sablonnal.

A teljes eredeti ZIP-mentés történeti ellenőrzőösszege továbbra is `46d0415bc015d5b893a18ea32e0fd1334f728adba0baf4610353b283a0e9e114` (510 194 bájt). A mostani fejlesztés elsődleges, tartós forrása a repó `app/` könyvtára.

## Megőrző mentésmigráció

A tárolókulcs `matek8:profile:v1` maradt, az adatséma 2-re váltott. A séma 1 hat témája külön, befagyasztott listából validálódik. Az eredeti eredmények, válaszok, segítségek, műhelyállapotok és beállítások megmaradnak; az új négy lecke üres kezdőállapotot kap. Hiányzó régi témát vagy hiányos séma 2 profilt a migráció nem „javít ki” alapértékekkel.

A régi generált témagyakorló és az import pillanatában nyitott vegyes feladat azonosan visszajátszható. Új vegyes feladat kérésétől a tíz téma váltakozik. Sérült mentést és érvénytelen importot a program nem ír felül csendben. A [migrációs leírás](MENTES_MIGRACIO.md) rögzíti a pontos szerződést és korlátokat.

## Ellenőrzés és bizonyíték

A konkrét, ténylegesen vizsgált HTML SHA-256 értéke, a tesztek darabszáma, a böngészőverzió, a mobilállapotok és a nyomtatási próba a [0.2.0 ellenőrzési jegyzőkönyvben](ELLENORZES_0.2.0.md) szerepel. A kiadás azonosítóadatait a [release-manifest.json](../release-manifest.json) tartalmazza.

A vizsgálat külön rétegei:

1. Pontos matematikai motor, tartalom, 6000 generált példa független újraszámolása, szigorú mentésvalidáció és migráció.
2. Forrásból típusellenőrzött build, bájtpontos önálló kiadásegyezés, történeti és új tartalmi másolatok vizsgálata.
3. A hat régi út tényleges böngészős regressziója, az almappában megnyitott kiadás és a négy új út teljes használata.
4. Valódi v0.1.1 UI-export importja, újratöltés, billentyűzet, 320/390 px normál és nagybetűs nézet, nyomtatás és offline megoldás/export.

Az automatikus hozzáférhetőségi teszt nem tanúsítvány. A tananyag eredményességét tanulói vizsgálat még nem igazolta.

## GitHub és Pages

A `.github/workflows/check-and-publish.yml` most ténylegesen az `app/` forrását telepíti és fordítja. A telepítés az ellenőrzésektől függ. Újabb azonos ági futás megszakítja a régebbit, így egy lassabban elkészülő régi változat nem írhatja vissza az újabb oldalt.

A 2026. november 6-i friss repólekérdezésben `has_pages: false` szerepelt, a projektcím pedig HTTP 404-et adott. A korábbi ellenőrző CI sikeres volt, de a telepítési job kimaradt. Ez nem kész éles oldal. Az elérhető GitHub-kapcsolat kódfeltöltést támogat, a Pages első adminisztratív engedélyezéséhez nem kínál műveletet.

A konkrét következő kiadás távoli ellenőrzését az adott commit [Actions-futása](https://github.com/janszkyjozsef/8.os-matematika/actions/workflows/check-and-publish.yml) mutatja. Ha a Pages továbbra sincs bekapcsolva, a workflow ezt kifejezetten jelzi és kihagyja a telepítést. Az egyszeri beállítás és a sikeres élesítés bizonyításának feltételei az [élesítési útmutatóban](ELESITES.md) olvashatók. A helyi működő kiadás ettől függetlenül használható.

## Következő fejlesztési és pedagógiai lépések

| Terület | Ellenőrizhető kész feltétel |
|---|---|
| Pages első engedélyezése, ha még hiányzik | Source: GitHub Actions; sikeres deploy; a közzétett, megfelelő verziójú oldalon tényleges feladatmegoldás |
| Külső szaktanári lektorálás | Állítások, módszerek, feltételek, feladatok és visszajelzések szakmai átnézése; a talált hibák javítása |
| Tanulói kipróbálás | Új feladaton indoklás és átvitel; elakadások dokumentálása és újrapróbált javítása |
| További platformok | Firefox, Safari, valódi telefon és képernyőolvasó kipróbálva |
| Következő tantervi ciklus | A tématérkép egy új, zárt egységcsoportjához teljes tartalom, műhely, gyakorlás és bizonyított működés |

A teljes évfolyam további ciklusokban készülhet el. A tanuló saját gondolatmenete és a tanári visszajelzés irányítja a következő tartalmi javításokat.
