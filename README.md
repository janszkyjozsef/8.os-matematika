# Matek8 — Értsd is!

Magyar nyelvű matematikaműhely nyolcadikosoknak: érthető indoklás, kipróbálható összefüggések, sok gyakorlás és magyarázott hibajavítás.

**Működő kiadás: v0.1.0, hat teljes tanulási úttal.** A teljes évfolyam tananyaga folyamatosan készül. A tématérkép 24 modult és 137 tervezett tanulási egységet mutat; ezek többsége még nincs megvalósítva.

[Automatikus ellenőrzések](https://github.com/janszkyjozsef/8.os-matematika/actions/workflows/check-and-publish.yml) · [Részletes terv](docs/Matek8_Anyaggyujtes_es_Fejlesztesi_Terv_v1.md) · [Megvalósítási állapot](docs/ALLAPOT.md) · [Élesítés](docs/ELESITES.md)

## Kipróbálás

Töltsd le az [index.html](https://raw.githubusercontent.com/janszkyjozsef/8.os-matematika/main/index.html) fájlt, majd nyisd meg böngészőben. A teljes alkalmazás egyetlen fájlban van: a leckék, az ábrák, a stílusok és a program is. A letöltött változat a benne található tananyaggal internet nélkül működik. A külső forráshivatkozások megnyitásához internet kell.

A haladás ugyanabban a böngészőben marad. A **Beállítások → Haladás letöltése** funkcióval fájlba menthető és később visszatölthető. A vendégmód külön állapotban indul, közös eszközön is használható. A helyi HTML-fájl és a későbbi webcím külön tárolóhely: a haladást az exportálással és importálással lehet átvinni.

A GitHub Pages első engedélyezése még külön beállítást igényel. A várható cím: `https://janszkyjozsef.github.io/8.os-matematika/`. Ez a cím csak sikeres Pages-telepítés után tekinthető működő oldalnak. A pontos lépések az [élesítési útmutatóban](docs/ELESITES.md) találhatók.

## Mi használható már?

| Tanulási út | Mit segít megérteni az interaktív műhely? |
|---|---|
| Törtek | Miért kell azonos méretű részekre bontani az egészeket az összeadáshoz? |
| Százalékszámítás | Miért változik az alap egymás utáni árváltozásoknál? |
| Egyenletek | Miért kell ugyanazt a műveletet mindkét oldalon elvégezni? |
| Grafikonok | Hogyan lesz egy történetből táblázat és grafikon; mit jelent az alapdíj és a változás üteme? |
| Pitagorasz-tétel | Hogyan kapcsolódnak a négyzetek területei a derékszögű háromszög oldalaihoz? |
| Valószínűség | Miért nem egyformán valószínű a két dobókockával kapott összes lehetséges összeg? |

Minden út hat lépésből áll:

1. **Jósolj!** Fogalmazz meg egy előzetes elképzelést.
2. **Próbáld ki!** Változtass egy modellen, és figyeld az összefüggést.
3. **Értsd meg!** Kapcsold össze a tapasztalatot a matematikai szabállyal.
4. **Nézd a példát!** Kövesd a megoldást lépésenként, az indoklással együtt.
5. **Gyakorolj!** Oldj meg feladatokat; szükség esetén kérj fokozatos segítséget.
6. **Önálló próba.** Ellenőrizd, mire jutottál segítség nélkül.

A kiadásban **48 rögzített gyakorlófeladat, 12 önálló próbafeladat, 12 kidolgozott példa és 18 feladatgenerátor-család** található. A generált feladatok új számpéldákat adnak; ezek nem új tantervi témák. Az ismert hibákhoz 132 célzott visszajelzési szabály tartozik. A rendszer külön kezeli az önálló és a segítséggel elért megoldást.

További funkciók: témakeresés, nyomtatható tízfeladatos lapok magyarázott megoldókulccsal, nagyobb betűk, nyugodt nézet, billentyűzetes kezelés, haladásmentés és vendégmód. A felület nem használ követőkódot, és nem küld tanulói válaszokat külső szolgáltatásnak.

## Új alapozó tananyagok

A következő négy fejezet **olvasható tananyagként és beépítésre váró kéziratként** elkészült. Az interaktív alkalmazásban még nem jelennek meg új tanulási útként.

- [Számfogalom és előjelek](docs/tananyag/01-szamfogalom-es-elojelek.md)
- [Műveleti sorrend](docs/tananyag/02-muveleti-sorrend.md)
- [Arányosság](docs/tananyag/03-aranyossag.md)
- [Mértékegységek](docs/tananyag/04-mertekegysegek.md)

Fejezetenként két kidolgozott példa, tizenkét gyakorlófeladat kétlépcsős segítséggel és részletes megoldással, két új önálló próbafeladat, öt gyakori félreértés javítása és egy interaktív műhely terve szerepel. A műhelyterv nem jelent elkészült programot.

## A repó felépítése

| Útvonal | Tartalom |
|---|---|
| `index.html` | Az előző fejlesztési körben ellenőrzött, önálló v0.1.0 kiadás |
| `content/v0.1.0/` | A hat működő lecke teljes, olvasható tananyaga és a tématérkép JSON-másolata |
| `release-manifest.json` | Verzió, bájtméret és SHA-256 ellenőrzőösszeg |
| `checks/` | A kiadás és a tényleges böngészős működés automatikus ellenőrzése |
| `.github/workflows/` | Ellenőrzés, majd az engedélyezett Pages-oldal telepítése |
| `docs/tananyag/` | Új, eredeti, magyarázott alapozó fejezetek |
| `docs/Matek8_Anyaggyujtes_es_Fejlesztesi_Terv_v1.md` | A kutatási fázis változatlan, történeti tervdokumentuma |
| `docs/ALLAPOT.md` | Mi készült el, mit igazoltak a vizsgálatok, mi következik? |

**A moduláris Preact/TypeScript fejlesztői forrás és az eredeti tesztek importja még hátravan.** A teljes helyi projekt `Matek8_Lokalis_v0_1_0.zip` mentése rendelkezésre áll, de a jelenlegi munkakörnyezet nem tudta kicsomagolni. Ez a repó most a működő kiadást, a belőle visszanyert olvasható tananyagadatokat, az új kéziratokat és a kiadásellenőrző eszközöket tartalmazza. A jelenlegi workflow nem állít elő új alkalmazásbuildet a TypeScript-forrásból.

## Ellenőrzés

Node 24 alatt, a repó gyökeréből:

```sh
node --test checks/release.test.mjs checks/content.test.mjs
npm install --no-save --no-package-lock --ignore-scripts --no-audit --no-fund playwright@1.62.1 @axe-core/playwright@4.14.0
npx playwright install --with-deps chromium
node checks/browser.mjs
```

A böngészős ellenőrzés a valódi kiadást a GitHub-projektoldalnak megfelelő `/8.os-matematika/` útvonal alatt nyitja meg. Ellenőrzi a műhelyeket, a segítségnyújtást, a válaszmentést, az exportot, a nyomtatási felületet, a keskeny mobilnézeteket és az offline HTML-t. Az aktuális eredményt mindig a konkrét commit [Actions-futása](https://github.com/janszkyjozsef/8.os-matematika/actions) igazolja.

A korábbi kiadási ellenőrzések és a még nem vizsgált területek az [állapotjelentésben](docs/ALLAPOT.md) szerepelnek. A sikeres technikai teszt nem bizonyítja, hogy minden tanuló megérti a tananyagot; ehhez tanári és tanulói kipróbálás is kell.

## Közreműködés

Először a tanulási célt, a magyarázatot, a lehetséges félreértéseket és az ellenőrizhető matematikai eredményeket tisztázzuk. Az új interaktív elem akkor kész, ha a megfigyelhető változás egy megfogalmazható összefüggést tanít, billentyűzettel is használható, és a megfelelő feladatokkal együtt kipróbáltuk.

A továbbfejlesztés sorrendjét és az elfogadási feltételeket a [megvalósítási állapot](docs/ALLAPOT.md) rögzíti. A Preact licencszövege az alkalmazásba és a [külső összetevők jegyzékébe](THIRD_PARTY_NOTICES.md) is bekerült.
