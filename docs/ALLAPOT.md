# Megvalósítási állapot

**Dátum: 2026. november 6.**

## Kész működő kiadás

A v0.1.1 hat tanulási utat tartalmaz: törtek, százalék, egyenletek, grafikonok, Pitagorasz-tétel, valószínűség. A kiadás tananyagokat, feladatellenőrzést, segítséget, interaktív műhelyeket, mentést, vendégmódot és nyomtatást is tartalmaz.

Az első GitHubra feltöltött v0.1.0 `index.html` bájtra megegyezett a korábban ellenőrzött önálló HTML-lel:

- Méret: **310 311 bájt**.
- SHA-256: `96b78a9e5a4ccab45de34afc5193d3f051b28ebf1b05782476c01ae1938f6aff`.
- Első repócommit: `902b97ae2ccc4bc90037fd4dadc5a60bc87e4e24`.

A kiadásból a hat lecke teljes tananyagát és a tématérképet olvasható JSON-másolatként is visszanyertük a `content/v0.1.0/` könyvtárba. Az új tartalmi teszt ellenőrzi, hogy ezek megegyeznek a kiadásban használt adatokkal. Ez nem azonos a teljes moduláris fejlesztői forrás importjával.

## A v0.1.1 célzott javítása

A GitHubon futó böngészős vizsgálat 320 képpontos szélességnél, nagyobb betűkkel 354 képpontos oldalszélességet mért a valószínűségi leckében. A DOM-diagnózis a leckecímet tartalmazó fejléc túl nagy minimális szélességét mutatta. A `.lesson-heading h1 { overflow-wrap: anywhere; }` szabály kipróbálva 320 képpontra csökkentette az oldal szélességét, a tartalom elrejtése és a betűméret csökkentése nélkül.

A szabály bekerült az alkalmazásba. A kibővített vizsgálat a kezdőlap számokat és feliratokat tartalmazó összefoglalójánál is kimutatott egy kilógást: a kétoszlopos rács nagy betűkkel túl széles volt 320 képpontnál. Nagybetűs nézetben, 380 képpont alatt ez a rész egy oszlopra vált, a hivatkozás szövege pedig szükség esetén sort tör. A betűméret és a teljes tartalom megmarad.

A tananyag és a matematikai logika változatlan; az alkalmazás verziójelzése 0.1.1. A visszanyert `content/v0.1.0/` tartalmi másolat továbbra is megegyezik a kiadás leckeadataival.

- Aktuális méret: **310 491 bájt**.
- Aktuális SHA-256: `2858d9533e1bdbbd4a514c78b7bfdf14e50fc6f50e0be182bf649b3f601cc97b`.
- A regressziós vizsgálat most mind a hat műhelyt és a kezdőlapot is megnézi 320 és 390 képpont szélességnél, nagyobb betűkkel.

Az első két sikertelen CI-futás megőrzött naplója mutatja a hibát és a diagnózist. A javítás tényleges sikerét az új commit ellenőrzési futása igazolja; az alábbi korábbi tesztszámok a v0.1.0 előző helyi fejlesztési körére vonatkoznak.

## A korábbi helyi kiadás tényleges vizsgálatai

Ezek a v0.1.0 előző fejlesztési körének eredményei; nem a most hozzáadott GitHub-workflow futásainak számai.

| Vizsgálat | Eredmény |
|---|---|
| Matematikai, tartalmi és mentési tesztek | 59/59 sikeres |
| Generált feladatok külön számítással ellenőrzött mintája | 3600 feladat |
| Rögzített feladatok külön ellenőrzése | 41 számos és 25 választásos feladat |
| Valódi Playwright-forgatókönyvek | 18/18 sikeres, Chromium 153.0.8010.0 |
| Automatikus axe-vizsgálat | 13 állapotban 0 jelzett szabálysértés |
| Oldal- és konzolhibák | A vizsgált folyamatokban 0 |
| Hálózat nélküli önálló HTML | Megnyitás, megoldás, újratöltés és export működött; 0 HTTP(S)-kérés |
| Nyomtatható lap | 6 oldalas PDF, 10 feladat és 10 magyarázott megoldás; vizuálisan is ellenőrizve |

Az axe-eredmény nem hozzáférhetőségi tanúsítvány. A felület tényleges tanulási eredményességét nem vizsgálta még tanulói kutatás.

## A mostani GitHub-ellenőrzés

A `checks/release.test.mjs`, a `checks/content.test.mjs` és a `checks/browser.mjs` közvetlenül a feltöltött kiadást vizsgálja. A böngésző a `/8.os-matematika/` útvonalon tölti be, így a projektoldal almappája is része az ellenőrzésnek.

Az eredmény a konkrét commit [Actions-futásában](https://github.com/janszkyjozsef/8.os-matematika/actions) látható. Ez a dokumentum nem feltételezi a még le nem futott vizsgálatok sikerét.

## Új, beépítésre váró tartalom

Négy eredeti alapozó kézirat elkészült: számfogalom és előjelek; műveleti sorrend; arányosság; mértékegységek. A négy fejezet összesen 8 kidolgozott példát, 48 gyakorlófeladatot és 8 önálló próbafeladatot tartalmaz, mindet indoklással és megoldással. A kész kéziratok a `docs/tananyag/` könyvtárban olvashatók.

A hozzájuk tartozó műhelyleírások tervek. Ezekkel még nem bővült a webalkalmazás hat tanulási útja. A kéziratok matematikai ellenőrzése sem jelent tanulói hatásvizsgálatot. A módszer és az eredmények a [tananyag-ellenőrzési jegyzetben](TANANYAG_ELLENORZES.md) olvashatók.

## Ami még hátravan

| Következő lépés | Ellenőrizhető kész feltétel |
|---|---|
| A teljes helyi projekt forrásának importja | Az eredeti forrás, lockfájl és tesztek a repóban; friss telepítésből sikeres típusellenőrzés, teszt és build |
| GitHub Pages első bekapcsolása | A Source értéke GitHub Actions; sikeres telepítés és élő oldalon elvégzett feladat |
| A négy alapozó kézirat beépítése | Saját megnyitható út, teljes feladatmodell, célzott hibajavítás, billentyűzetes műhely, sikeres matematikai és böngészős tesztek |
| Tanári tartalmi ellenőrzés | Az állítások, feltételek, példák és félreértések szaktanárral átnézve; a hibák javítva |
| Tanulói kipróbálás | A tanuló elmondja a lépések indokát és új feladatra alkalmazza; elakadások rögzítve és javítva |
| További platformok | Safari, Firefox, valódi telefon és képernyőolvasó kipróbálva |
| Teljes tantervi bővítés | A terv minden készre jelölt egységéhez ténylegesen megnyitható, ellenőrzött tartalom tartozik |

## Forrásmegőrzés

A teljes lokális projekt `Matek8_Lokalis_v0_1_0.zip` néven megőrzött mentésben rendelkezésre áll. Mérete 510 194 bájt, SHA-256 értéke `46d0415bc015d5b893a18ea32e0fd1334f728adba0baf4610353b283a0e9e114`.

A korábbi végrehajtókörnyezet jelenleg nem érhető el, ezért a ZIP kicsomagolása és a moduláris forrás importja ebben a körben nem történt meg. A működő kiadást visszaolvastuk, integritását ellenőriztük és feltöltöttük. A két állapot külön kezelendő.

## A tervdokumentum értelmezése

A `Matek8_Anyaggyujtes_es_Fejlesztesi_Terv_v1.md` a kutatási fázis változatlan dokumentuma. A fejlécében szereplő „a fejlesztés még nem indult el” állítás a terv keletkezési állapotára vonatkozik. A jelenlegi állapotot ez a fájl, a README és a tényleges repótartalom mutatja.
