# Matek8 — Értsd is!

Magyar nyelvű matematikai tanulóoldal, elsősorban nyolcadikosoknak. A **0.3.0** kiadás tizennégy bejárható tanulási utat tartalmaz, magyarázatokkal, interaktív műhelyekkel, fokozatos segítséggel és helyi haladásmentéssel. Az új készségnapló a valódi ellenőrzésekből ad visszajelzést, a célzott gyakorlás pedig egy elakadás után új feladathoz vezet.

A leckemenet: **Jósolj → Próbáld ki → Értsd meg → Nézd a példát → Gyakorolj → Önálló próba.**

## Mi használható?

| Tanulási út | Műhely | Gyakorlás + önálló próba |
|---|---|---:|
| Számfogalom és előjelek | Számegyenes, sorrend, ellentett, abszolút érték, távolság és elmozdulás | 12 + 2 |
| Műveleti sorrend | Részszámítás választása, indoklás és a teljes kifejezés követése | 12 + 2 |
| Arányosság | Történet, több adatpár, táblázat és grafikon három modellel | 12 + 2 |
| Mértékegységek | Szakasz, egységnégyzet, kockarétegek és pontos egységváltás | 12 + 2 |
| Betűs kifejezések | Behelyettesítés, egynemű tagok és zárójelfelbontás | 12 + 2 |
| Szöveges feladatok modellezése | Szükséges adatok, ismeretlen, modell és visszaellenőrzés | 12 + 2 |
| Hatványok | Ismételt szorzás, a mínusz helye, négyzet, kocka és tíz hatványai | 12 + 2 |
| Négyzetgyök | Négyzetterületből oldal, nemnegatív főérték, pontos érték és becslés | 12 + 2 |
| Törtek | Törtsávok és közös felosztás | 8 + 2 |
| Százalékszámítás | Egymás utáni változások és változó alap | 8 + 2 |
| Egyenletek | Mérlegelv, megoldási utak és visszahelyettesítés | 8 + 2 |
| Grafikonok | Együtt változó történet, táblázat és grafikon | 8 + 2 |
| Pitagorasz-tétel | Négyzetterületek és a derékszög feltétele | 8 + 2 |
| Valószínűség | Két kocka 36 rendezett kimenetele és szimuláció | 8 + 2 |

Az aktuális adatmodellből számított összesítés: **144 rögzített gyakorlófeladat, 28 önálló próbafeladat, 14 jósló kérdés, 28 kidolgozott példa és 43 determinisztikus generátorcsalád**. Az utóbbi 42 általános és egy külön javító családot jelent. A 186 kérdésrekord 436 külön ellenőrzött válaszmezőt és 311 célzott hibavisszajelzési szabályt tartalmaz. A több részből álló feladat külön mezői nem külön feladatok. A pontos darabszámok és az ellenőrzőösszeg a [kiadási jegyzékben](release-manifest.json) szerepelnek.

A saját szavas indoklásnak helye van a felületen és a nyomtatható lapon. A program ehhez önellenőrzési szempontokat ad; a szöveg helyességét nem minősíti automatikusan. A segítséggel elért javítást és az első önálló megoldást külön tartja nyilván.

## Új: készségenkénti visszajelzés és javító gyakorlás

A **Haladásom** oldalon 41 konkrét készséghez látható, hogy az új ellenőrzések során mi sikerült önállóan, és mi segítséggel vagy javítás után. A megnyitás, gépelés és jóslás nem hoz létre tudásbizonyítékot; ugyanannak a megoldásnak az ismételt ellenőrzése sem növeli a számokat. A korábbi feladateredmények megmaradnak, de a rendszer nem talál ki hozzájuk visszamenőleges részletes eseményeket.

A kezdőlapról, a gyakorlóból és a hibás részválasz mellől elérhető **Célzott gyakorlás** rövid magyarázatot, kapcsolódó műhelyt, új javító feladatot és további alkalmazást kínál. A készséget a tanuló szabadon is kiválaszthatja. A feladat azonosítója a hivatkozásban marad, ezért újratöltéskor ugyanott folytatható. Ha csak ugyanaz a feladatszerkezet áll rendelkezésre új adatokkal, a felület ezt jelzi; nem állít bizonyított tudásátvitelt.

A részletes napló a legutóbbi legfeljebb 2000 eltérő ellenőrzést őrzi, helyben. Ez gyakorlási visszajelzés, nem százalékos tudásmérés. A működés és a megőrzés pontos leírása: [Készségnapló és célzott gyakorlás](docs/KESZSEG_ES_JAVITAS.md).

**A teljes évfolyam még nincs kész.** A tématérkép 24 modulja és 137 egysége fejlesztési térkép. Minden egységnél külön látható az elérhető tartalom, a részleges lefedettség vagy a tervezett állapot; egy modulhoz több lecke is kapcsolódhat.

## Használat és haladás

Az [index.html](index.html) az önálló, minden szükséges programot és stílust tartalmazó kiadás. Letöltve és böngészőben megnyitva internet nélkül működik. Nem kell fiók, külső betűkészlet, matematikai CDN vagy AI API. A beépített CSP a hálózati adatküldést is tiltja (`connect-src 'none'`).

A haladás az adott böngészőben tárolódik. Fájlba exportálható, importáláskor előnézet és külön megerősítés jelenik meg. A régi, hat- és tízleckés mentések megőrző migrációval használhatók: a régi eredmények megmaradnak, az új leckék üresen indulnak. Az alkalmazás verziója 0.3.0, az adatsémáé külön 3. Sérült mentést az oldal nem töröl automatikusan. A vendégmód, a nagyobb betűk és a nyugodt nézet továbbra is elérhető.

A tervezett [GitHub Pages-cím](https://janszkyjozsef.github.io/8.os-matematika/) állapotát a [kiadási állapotjelentés](docs/ALLAPOT.md) rögzíti. A sikeres kódfeltöltés és ellenőrzés önmagában nem bizonyít éles publikálást.

## Fejlesztés

A teljes moduláris forrás az **app/** könyvtárban van. Az `app/index.html` kicsi Vite-belépő; a gyökérbeli `index.html` a generált önálló kiadás. **A kettő nem cserélhető fel.**

Node.js legalább 22.18.0 szükséges; a CI Node 24-et használ. A rögzített függőségeket a lockfájlból telepítjük:

```sh
npm ci --prefix app --no-audit --no-fund
npm run dev
```

Fejlesztői cím: `http://127.0.0.1:4173/`. A reprodukálható kiadás és ellenőrzések:

```sh
npm run release
npm test
cd app
npx playwright install --with-deps chromium
cd ..
npm run test:browser
npm run test:foundations
npm run test:bridges
```

A `release` parancs típusellenőrzést, Vite-buildet és önálló HTML-t készít, majd együtt frissíti a gyökérbeli kiadást, a jegyzéket és a verziózott tananyagmásolatot. A CI ezt friss telepítésből újrafordítja, és bájtra összeveti a feltöltött változattal. A `MATEK8_CHROMIUM_PATH` opcionálisan egy már telepített Chromium végrehajtható fájlját jelölheti; a tesztek saját, izolált böngészőprofilt használnak.

## A repó felépítése

| Útvonal | Tartalom |
|---|---|
| `app/src/` | Preact/TypeScript alkalmazás, tananyag, pontos matematikai motor, műhelyek |
| `app/tests/` | Matematikai, tartalmi, mentési és tényleges böngészős tesztek |
| `app/scripts/portable.mjs` | Önálló offline HTML készítése a forrásból |
| `scripts/release.mjs` | Ellenőrzött build kiemelése a repó gyökerébe és tartalmi snapshot |
| `index.html`, `release-manifest.json` | Összetartozó publikálható kiadás és azonosítóadatok |
| `content/v0.3.0/` | Generált leckék, tématérkép, általános és javító generátorjegyzék, készségregiszter |
| `content/v0.2.0/` | Változatlan történeti referencia a korábbi tíz leckéhez |
| `content/v0.1.0/` | Változatlan történeti tananyag; az eredeti hat lecke megőrzésének referenciája |
| `checks/`, `.github/workflows/` | Kiadásegyezés, böngészős vizsgálatok és feltételes Pages-telepítés |
| `app/src/learning/` | Készségtérkép, ellenőrzési események, célzott feladatválasztó és felület |
| `docs/tananyag/` | A nyolc alapozó lecke kéziratai és visszakereshető feladatai |
| `docs/TANANYAG_AZONOSITOK.md` | Kézirat–alkalmazás megfeleltetés és a részfeladatok megőrzése |

Részletek: [állapot](docs/ALLAPOT.md) · [fejlesztői útmutató](docs/FEJLESZTES.md) · [mentésmigráció](docs/MENTES_MIGRACIO.md) · [tananyag-ellenőrzés](docs/TANANYAG_ELLENORZES.md) · [élesítés](docs/ELESITES.md) · [külső összetevők](THIRD_PARTY_NOTICES.md).

Az [eredeti részletes terv](docs/Matek8_Anyaggyujtes_es_Fejlesztesi_Terv_v1.md) történeti dokumentum. A fejlesztés megkezdéséről és a feltöltési engedélyről szóló korabeli mondatai nem a jelenlegi állapotot írják le.

A technikai ellenőrzés nem helyettesíti a szaktanári lektorálást és a tanulói kipróbálást. A „minden diák értse meg” fejlesztési cél, nem igazolt eredmény.
