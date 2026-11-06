# Matek8 — Értsd is!

Magyar nyelvű matematikai tanulóoldal, elsősorban nyolcadikosoknak. A **0.2.0** kiadás tíz bejárható tanulási utat tartalmaz, magyarázatokkal, interaktív műhelyekkel, fokozatos segítséggel és helyi haladásmentéssel.

A leckemenet: **Jósolj → Próbáld ki → Értsd meg → Nézd a példát → Gyakorolj → Önálló próba.**

## Mi használható?

| Tanulási út | Műhely | Gyakorlás + önálló próba |
|---|---|---:|
| Számfogalom és előjelek | Számegyenes, sorrend, ellentett, abszolút érték, távolság és elmozdulás | 12 + 2 |
| Műveleti sorrend | Részszámítás választása, indoklás és a teljes kifejezés követése | 12 + 2 |
| Arányosság | Történet, több adatpár, táblázat és grafikon három modellel | 12 + 2 |
| Mértékegységek | Szakasz, egységnégyzet, kockarétegek és pontos egységváltás | 12 + 2 |
| Törtek | Törtsávok és közös felosztás | 8 + 2 |
| Százalékszámítás | Egymás utáni változások és változó alap | 8 + 2 |
| Egyenletek | Mérlegelv, megoldási utak és visszahelyettesítés | 8 + 2 |
| Grafikonok | Együtt változó történet, táblázat és grafikon | 8 + 2 |
| Pitagorasz-tétel | Négyzetterületek és a derékszög feltétele | 8 + 2 |
| Valószínűség | Két kocka 36 rendezett kimenetele és szimuláció | 8 + 2 |

Az aktuális adatmodellből számított összesítés: **96 rögzített gyakorlófeladat, 20 önálló próbafeladat, 10 jósló kérdés, 20 kidolgozott példa és 30 determinisztikus generátorcsalád**. A több részből álló feladatok külön válaszmezőket és részletenkénti visszajelzést kaptak. A pontos darabszámok és az ellenőrzőösszeg a [kiadási jegyzékben](release-manifest.json) szerepelnek.

A saját szavas indoklásnak helye van a felületen és a nyomtatható lapon. A program ehhez önellenőrzési szempontokat ad; a szöveg helyességét nem minősíti automatikusan. A segítséggel elért javítást és az első önálló megoldást külön tartja nyilván.

**A teljes évfolyam még nincs kész.** A tématérkép 24 modulja és 137 egysége fejlesztési térkép. Minden egységnél külön látható az elérhető tartalom, a részleges lefedettség vagy a tervezett állapot; egy modulhoz több lecke is kapcsolódhat.

## Használat és haladás

Az [index.html](index.html) az önálló, minden szükséges programot és stílust tartalmazó kiadás. Letöltve és böngészőben megnyitva internet nélkül működik. Nem kell fiók, külső betűkészlet, matematikai CDN vagy AI API. A beépített CSP a hálózati adatküldést is tiltja (`connect-src 'none'`).

A haladás az adott böngészőben tárolódik. Fájlba exportálható, importáláskor előnézet és külön megerősítés jelenik meg. A régi, hatleckés mentések megőrző migrációval használhatók: a régi eredmények megmaradnak, az új leckék üresen indulnak. Sérült mentést az oldal nem töröl automatikusan. A vendégmód, a nagyobb betűk és a nyugodt nézet továbbra is elérhető.

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
| `content/v0.2.0/` | Generált, olvasható leckék, tématérkép és generátorjegyzék |
| `content/v0.1.0/` | Változatlan történeti tananyag; az eredeti hat lecke megőrzésének referenciája |
| `checks/`, `.github/workflows/` | Kiadásegyezés, böngészős vizsgálatok és feltételes Pages-telepítés |
| `docs/tananyag/` | A négy eredeti alapozó kézirat |
| `docs/TANANYAG_AZONOSITOK.md` | Kézirat–alkalmazás megfeleltetés és a részfeladatok megőrzése |

Részletek: [állapot](docs/ALLAPOT.md) · [fejlesztői útmutató](docs/FEJLESZTES.md) · [mentésmigráció](docs/MENTES_MIGRACIO.md) · [tananyag-ellenőrzés](docs/TANANYAG_ELLENORZES.md) · [élesítés](docs/ELESITES.md) · [külső összetevők](THIRD_PARTY_NOTICES.md).

Az [eredeti részletes terv](docs/Matek8_Anyaggyujtes_es_Fejlesztesi_Terv_v1.md) történeti dokumentum. A fejlesztés megkezdéséről és a feltöltési engedélyről szóló korabeli mondatai nem a jelenlegi állapotot írják le.

A technikai ellenőrzés nem helyettesíti a szaktanári lektorálást és a tanulói kipróbálást. A „minden diák értse meg” fejlesztési cél, nem igazolt eredmény.
