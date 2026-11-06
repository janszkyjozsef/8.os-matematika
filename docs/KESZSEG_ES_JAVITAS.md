# Készségenkénti haladás és javító gyakorlás — 0.3.0

## Mit lát a tanuló?

A kezdőlapon és a Gyakorlóban a **Célzott gyakorlás** nyitja meg a készségek listáját. A tanuló választhat a legutóbbi ellenőrzéseiből származó javaslatok közül, vagy önállóan kijelölhet egy készséget. Egy hibás, értelmezhető részválasz után közvetlen hivatkozás is megjelenik a kapcsolódó javító útra.

A folyamat három része:

1. **Értsd meg:** rövid fogalmi magyarázat, ellenőrzési szempontok, a megfelelő leckemagyarázat és műhely közvetlen hivatkozása.
2. **Próbáld újra:** egy új, az adott készséget ténylegesen kérő feladat vagy részfeladat. A tanuló továbbra is kérhet segítséget és teljes magyarázatot.
3. **További próba:** elsőbbséget kap egy más feladatszerkezet vagy alkalmazási helyzet. Ilyenkor a cím **Másik alkalmazás**; ha ugyanannak a szerkezetnek új adatú változata érhető el, a cím **Új adatokkal**, és a felület megnevezi ezt a korlátot.

A javító út ajánlás, szabadon elhagyható. Egyetlen hibás válasz nem bizonyít meghatározott tévképzetet. A saját szavas magyarázatok tartalmát nem minősíti automatikusan a program. Nincs automatikus tudásszázalék, osztályzat, időnyomás vagy kötelező tanulási sorrend.

## Mi számít megfigyelésnek?

A részletes napló kizárólag az **Ellenőrzöm** műveletkor keletkezik. A gépelés, a lecke megnyitása, a műhely mozgatása, a jósló belépő és a saját indoklás szerkesztése nem készségtudás bizonyítéka.

A többmezős feladat érvényesen ellenőrzött részválaszai külön készségcímkét kapnak. Az üres vagy nem értelmezhető mező nem válik matematikai hibává. Egy függő ellenőrző rész csak akkor ad készségeredményt, ha ugyanabban az ellenőrzésben minden szükséges előzménye is helyes. Egy történet közölt végösszegének bemásolása a modell és a kiszámolt ismeretlen nélkül nem bizonyít sikeres visszaellenőrzést. A régi tíz lecke tartalmi adatai változatlanok: a hozzájuk tartozó készségtérkép külön fájlban található. A négy új útban a készségcímkék közvetlenül a feladatokhoz és részválaszokhoz tartoznak.

A számlálók különböző forrásfeladat–részválasz párokat követnek. Ugyanannak a válasznak az ismételt ellenőrzése nem új önálló megoldás. Az elfogadott egyenértékű helyes írásmódok közötti váltás sem jelent segítséggel elért új sikert. A segítség és egy korábbi hibás ellenőrzés után elért javítás elkülönül az első önálló megoldástól.

A **Haladás** oldalon a régi feladatszintű eredmények mellett külön látható a készségenkénti visszajelzés: önálló részmegoldások, segítséggel vagy javítva elért eredmények, a legutóbbi ellenőrzés és a javaslat indoka. Ezek megfigyelések, nem a teljes készség elsajátításának igazolásai.

## A következő feladat kiválasztása

Az `app/src/learning/practice.ts` a szerzői feladatok és a determinisztikus generátorok készségcímkéiből választ. A választás nem a feladatszöveg kulcsszavainak találgatására épül. A teljes többmezős feladatból a kapcsolódó részválasz emelhető ki, miközben az eredeti történet és a megoldás háttere megmarad. A `requiresParts` kapcsolat közvetlen és közvetett előzményei is együtt maradnak, eredeti sorrendjükben. Így például az egyenlet, az egységár és a visszaellenőrzött összeg egy feladatcsoport, nem puszta adatmásolási kérdés.

A kiválasztás kizárja a már megkezdett forrásfeladatokat, valamint a rekonstruálható, tartalmilag azonos generált példákat. A másik feladatot kérő gomb az éppen nyitott, még kitöltetlen feladatot is kizárja; ehhez nem hoz létre kitalált próbálkozást. A választó nem csak az azonosítót változtatja meg, hogy egy régi kérdést újnak nevezhessen. Ha egy készség véges szerzői feladatkészlete elfogy, ezt kezeli; nem állít korlátlanul új alkalmazást.

A megfigyelt gyakoriság és az elméleti esély különbségéhez önálló javító generátorcsalád is készült. Szabályos kocka és pénzérme független próbáiban elkülöníti a feljegyzett arányt, a modell szerinti esélyt és a következő próba esélyét. Ez a család nem módosítja a korábbi általános generátorok sorrendjét, ezért a régi vegyes feladatok visszajátszása megmarad.

A feladathivatkozás tartalmazza a nyilvános, kötött formátumú feladatazonosítót. A visszajátszás nem függ a közben megváltozott haladástól: válaszadás és újratöltés után ugyanaz a kiválasztott feladat látható. A hivatkozás nem tartalmaz tanulói választ, saját indoklást vagy haladásnaplót. Ismeretlen vagy sérült hivatkozás emberi hibaüzenetet ad, a mentést nem módosítja.

Újratöltéskor a beírt válaszok visszaállnak, a javító út továbblépő gombjához azonban a most látható teljes választ ismét ellenőrizni kell. A felület ezt jelzi. Az ismételt ellenőrzés a már rögzített sikert nem számolja új eseménynek, és egy korábban sikeres részválasz nem oldja fel a hiányos feladatcsoportot.

A műhely és a magyarázat linkje a lecke megfelelő szakaszára vezet; onnan vissza lehet térni a javító útra. A kért szakasz egyszeri megnyitás után nem írja felül a később választott leckelépést újratöltéskor.

## Adatséma és megőrzés

Az alkalmazás verziója **0.3.0**, a profilséma verziója **3**. A tárolókulcs változatlan: `matek8:profile:v1`. A kulcs neve nem a jelenlegi adatséma verzióját jelöli.

- A séma 1 hat eredeti témáját és a séma 2 tíz témáját külön, befagyasztott listából validáljuk.
- Mindkét régi séma megőrző migrációval olvasható. A hiányzó régi témát vagy sérült adatot nem javítjuk ki észrevétlenül üres értékkel.
- A régi eredmények, beállítások, műhelyállapotok és aktív generált feladatok megmaradnak. A négy új téma üresen indul.
- Régi eredményből nem készül kitalált készségesemény. Az új `learning` napló üresen indul.
- A megnyitott régi vegyes feladat a korábbi hat- vagy tíztémás sorrend szerint folytatódik. Csak új feladat kérésekor lép át a tizennégy témás sorrendre.
- A séma 3 kötelező készségnaplójának hiánya vagy sérülése hibának számít. A korábbi mentés automatikus törlése továbbra sem megengedett.

A `learning` objektum saját, 1-es naplóverziót, monoton eseményazonosítót, a korábban elhagyott események számát és legfeljebb **2000** eseményt őriz. Egy esemény a tényleges ellenőrzés ISO-időpontját, megjelenített és eredeti feladatazonosítóját, témáját és részválaszonkénti eredményeit tartalmazza. A részletes napló nem tárol újabb másolatot a nyers válaszból vagy visszajelzési szövegből.

Az ismételt ellenőrzést rövid válaszlenyomat segít felismerni. Ez technikai deduplikálás; nem titkosítás és nem anonimizálási ígéret. Az eredeti haladásrekord továbbra is tartalmazza a tanuló által beírt választ.

A 2000 eseményes határ elérésekor a régebbi részletes események kerülnek ki a naplóból, a feladatszintű eredmények megmaradnak. A Haladás oldal jelzi, ha történt ilyen elhagyás. A készségösszesítések ezért a megőrzött részletes adatokra vonatkoznak. A korábbi 10 000 feladatrekordos és 16 MB-os export/import határ is megmarad.

## Fejlesztői felületek

| Fájl | Feladat |
|---|---|
| `app/src/learning/skills.ts` | Készségjegyzék, régi feladatok kézi megfeleltetése, részválaszok készségei, eseményrögzítés, szigorú validáció és összesítés |
| `app/src/learning/practice.ts` | Javaslatok, új feladat kiválasztása, készséghez kötött és profilfüggetlen visszajátszás |
| `app/src/learning/repair-generators.ts` | A korábbi generátorsorrendet megőrző, külön verziózott javító feladatcsalád |
| `app/src/learning/LearningUI.tsx` | Javaslatok, készségenkénti haladás és a háromrészes javító felület |
| `app/src/progress.ts` | Régi és új profilsémák megőrző validációja, import/export és helyi tárolás |
| `app/tests/learning.test.ts` | Események, készségmegfeleltetés, deduplikálás, javító választás és visszajátszás tesztjei |
| `app/tests/bridges-browser.mjs` | Tényleges v0.2.0 UI-export migrációja, új utak, javító folyamat, újratöltés és offline használat |

## A ciklus határa

A 0.3.0 célzott javító gyakorlást és az ehhez szükséges készségnaplót vezet be. Az időben ütemezett ismétlési lista és a szabadon összeállítható feladatlap külön későbbi ciklus. Nincs fiók, felhőszinkron, külső AI API vagy automatikus adatküldés. A technikai működés igazolása mellett a pedagógiai eredményességhez tanári és tanulói kipróbálás szükséges.
