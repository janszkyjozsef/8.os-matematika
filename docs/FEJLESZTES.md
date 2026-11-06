# Fejlesztői útmutató — 0.3.1

## Forrás és kiadás

A fejlesztőprojekt az `app/` alatt található. A gyökérben marad a publikálható `index.html`, a dokumentáció, a `checks/` és a verziózott tananyagmásolat. Az eredeti 0.1.0 forrásból visszavezetett 0.1.1 mobiljavítások a `styles.css` részei: a hosszú leckecím törhet, 380 px alatt a nagybetűs kezdőlapi összefoglaló egy oszlopra vált. A tartalmat nem vágjuk le.

Az import a ténylegesen elérhető korábbi helyi forrásból történt. A 0.1.1 működő HTML-je, a frissebb dokumentáció és a négy kézirat külön kiindulópont maradt. A régi helyi README nem írta felül a repó dokumentációját. A függőségek friss `npm ci` telepítéssel kerültek be; `node_modules` nem lett átmásolva.

### Parancsok a repó gyökeréből

```sh
npm ci --prefix app --no-audit --no-fund
npm run dev
npm run build
npm run release
npm test
npm run test:browser
npm run test:foundations
npm run test:bridges
```

A böngészőtesztek előtt az `app/` könyvtárban `npx playwright install --with-deps chromium` szükséges, kivéve ha a `MATEK8_CHROMIUM_PATH` már elérhető Chromiumot jelöl. Ez nem használja a felhasználó saját böngészőprofilját. A helyi `MATEK8_TEST_URL` csak localhostot fogad el; távoli oldal vizsgálatához ezt a korlátot nem szabad fellazítani.

A `build` a fejlesztői forrásból Vite-disztribúciót és verziózott önálló HTML-t készít. A `release` ezt követően a ténylegesen elkészült HTML-t másolja a gyökérbe, és újragenerálja a jegyzéket és a `content/v<verzió>/` adatokat. A gyökérbeli kiadást kézzel ne szerkeszd. Az `app/index.html` Vite-belépő soha nem publikálható helyette.

## Verziózás és reprodukálhatóság

Az alkalmazás verziójának forrása az `app/package.json`; a lockfájl csomagverziójával együtt frissítendő. A `version.ts`, a portable fájlnév, a böngészőteszt offline fájlválasztása, a tartalmi snapshot és a release-manifest innen származik. A mentési séma külön érték: jelenleg 3. A 0.3.0 ciklusban a függőségverziók nem változtak; a friss `npm ci` ugyanazt a lockfájlt használja.

A portable script `Matek8.contentSnapshot` néven stabil adat-exportot ad a beágyazott programból. A kiadásteszt ezt elkülönített, DOM és hálózat nélküli környezetben olvassa vissza, majd összeveti a TypeScript-forrás és a verziózott JSON adataival. Nem támaszkodik tömörítéskor véletlenszerűen létrejövő változónevekre. A `content/v0.1.0/` és `content/v0.2.0/` változatlan történeti referencia: az eredeti hat és a korábbi tíz lecke egyezését külön teszt őrzi. Az aktuális `content/v0.3.1/` a készségregisztert és a külön javító generátorok jegyzékét is tartalmazza.

A CI friss `npm ci` után matematikai és migrációs teszteket futtat, újrafordítja a forrást, majd **bájtra összeveti** a generált HTML-t a commitban szereplő gyökérbeli `index.html`-lel. Eltéréskor hibával megáll. A build és a teszt nem írhatja át észrevétlenül a vizsgált, commitolt kiadást.

## Egy új tanulási út integrációja

1. **Tanulási cél és egységszintű lefedettség.** A kézirat céljait, feltételeit, példáit és hibamintáit rendeld konkrét tartalomhoz. A tématérkép `Mxx.yy` azonosítói egyenként kapnak állapotot.
2. **Közös regiszter és séma.** A `topics.ts` adja a futásidejű témalistát és a `TopicId` típust. A régi séma témalistáját nem bővítjük. Új témáknál megőrző, szigorúan validált migráció kell.
3. **Lecke, műhely és gyakorlás.** Teljes hatlépéses út, legalább megfelelő jóslás, magyarázat, kidolgozott példák, fokozatos segítség, célzott visszajelzés, generált családok és önálló próba szükséges. Az üres műhelyspecifikáció nem működő műhely.
4. **Valódi integráció.** Kezdőkártya, témakép, útvonal, műhely-kezdőállapot, haladás, export/import, vegyes gyakorlás, nyomtatás és előismereti hivatkozás is része az új útnak. A generátorválasztó a témához tartozó tényleges családszámmal számol.
5. **Ellenőrzés és kiadás.** Külön matematikai referenciák, valódi böngészős megoldások, 320/390 px normál és nagybetűs nézet, billentyűzet, nyomtatás és hálózat nélküli kiadás. A hibát javítani és újraellenőrizni kell.

Az új leckék és részválaszok `skillIds` mezője konkrét, regisztrált készségekre mutat. A korábbi tartalom változatlan objektumait a `learning/skills.ts` külön megfeleltetése kapcsolja készségekhez. A jóslás nem készségesemény. Az `ExerciseCard` egyetlen valódi ellenőrzéskor, a korábbi próbálkozás alapján rögzíti az eredményt; megnyitásból vagy gépelésből nem keletkezik naplóbejegyzés.

A `learning/practice.ts` választja és stabil locator alapján visszajátssza a célzott részfeladatokat. A felület a locatort nem értelmezi és nem építi újra profilváltozáskor. A kanonikus forrás- és részazonosító megakadályozza, hogy ugyanaz a kérdés másik útvonalon új önálló sikernek számítson. A külön `learning/repair-generators.ts` bővíti a javító kínálatot, a régi általános generátorok változatsorrendjének módosítása nélkül. Lásd: [készségnapló és javítás](KESZSEG_ES_JAVITAS.md).

A `lessonsForModule` több leckét is visszaadhat egy modulhoz. A `coveredUnits` kész tartalmi kapcsolatot jelöl; a `coverage.ts` külön kezeli a részben érintett célokat. A „tananyag és gyakorlás elérhető” nem a teljes modul készültsége, nem a tanuló tudásának mérése és nem pedagógiai hatásvizsgálat.

## Válaszok és indoklások

A skalár válasz lehet pontos szám, választás vagy szűken felsorolt elfogadott kifejezés. A `parts` több külön ellenőrzött mezőből áll; a teljes feladat csak minden rész helyes válaszával sikeres. Hibás és hiányzó részek egyszerre is megjelennek. A számítás BigInt-alapú racionális aritmetikát használ, magyar tizedesvesszővel és a feladathoz rendelt egység/formakövetelménnyel.

A kifejezéses feladat engedélyezett alakokat hasonlít össze; nem általános szimbolikus algebra. A műveleti sorrend műhely külön, korlátozott aritmetikai nyelvtant és kifejezésfát használ. Nem futtat kódot, nem használ `eval`-t. A függő műveletek nem vonhatók össze korán, a független ágak megengedett sorrendjei viszont választhatók. A nullával osztás matematikai magyarázatot kap, számértéket nem.

A saját szöveghez önellenőrzési szempontok tartoznak. A gép nem jelöl indoklást bizonyítottan helyesnek. Az indoklás mentéséről a tanuló külön dönt; a mentési választás kikapcsolása eltávolítja a mentett szöveget. A segítség megnyitása segített próbálkozásnak számít; egy korábbi valódi önálló siker jelzését ez nem törli.

## Függőségek és hálózat

A meglévő lockfájl csomagverziói megmaradtak. Az önálló HTML Preactot, saját programot, stílusokat és SVG-ábrákat tartalmaz. A Preact pontos licence a HTML-be és a `THIRD_PARTY_NOTICES.md` fájlba is bekerül; a build ellenőrzi, hogy a jegyzék tartalmazza a telepített licencszöveget. A jegyzéket nem írja felül egy korábbi sablonnal.

A CI publikus repóban standard `ubuntu-latest` futtatót használ. Nem igényel új előfizetést, felhasználói API-kulcsot vagy külső AI-szolgáltatást. A Pages első engedélyezése külön jogosultsági kérdés; lásd az [élesítési útmutatót](ELESITES.md).

A 0.3.1-től a `.gitattributes` az LF-sortörést a Windows checkoutban is megőrzi. Kiadás-ellenőrzőösszeg eltérésekor ne lazítsd a tesztet: ellenőrizd a tényleges fájlbájtokat és a Git-attribútumokat.
