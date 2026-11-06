# Haladásmentés és migráció

## Két külön verzió

Az alkalmazás kiadása **0.3.0**, a mentési adatséma **3**. A böngésző tárolókulcsa változatlan: `matek8:profile:v1`. A kulcsot nem nevezzük át, mert így a meglévő helyi mentés felfedezhető marad. A kulcsban szereplő `v1` nem a mindenkori adatséma verzióját jelöli.

A `topics.ts` három külön listát tartalmaz:

- `LEGACY_TOPICS`: a séma 1 eredeti hat témája; ez a lista befagyasztott.
- `V2_TOPICS`: a séma 2 tíz témája, a korábbi vegyes gyakorlási sorrendben; ez is befagyasztott.
- `TOPICS`: a jelenlegi tizennégy témát tartalmazó regiszterből képzett lista.

Az `appVersion` az adat utolsó rögzített alkalmazásverzióját jelöli. Importáláskor megmarad; a következő tanulói módosítás az aktuális kiadás verzióját rögzíti. A sémaverzió ettől függetlenül már a migrált szerkezetet írja le.

## A régi mentés útja

1. A `parseImport` ellenőrzi a bájtméretet és a JSON-t.
2. A `validateProfile` először a bejelentett sémának megfelelő teljes szerkezetet vizsgálja. Séma 1-nél mind a hat, séma 2-nél mind a tíz korábbi lecke szükséges. Hiányzó vagy sérült régi lecke nem kap hallgatólagosan alapértéket.
3. Az eredeti beállítások, leckeállapotok, műhelyadatok, válaszok, próbálkozások, segítségszintek, sikerjelzések, legutóbbi téma és seedek megmaradnak. Csak az adott régi sémában még nem létező témák kapnak üres kezdőállapotot.
4. Az új objektum séma 3 alakú, kötelező, üres `learning` készségnaplóval. A régi eredményekből nem következtetünk ki meg nem figyelt részválasz-eseményeket. A forrásobjektum nem módosul, és a puszta betöltés nem írja át a régi böngészőadatot. Sikeres mentéskor vagy megerősített importáláskor kerül tárolásba az új szerkezet.

Az importfelület előnézetet mutat. A csere csak az erre szolgáló megerősítő gomb után történik meg. Hiba esetén a korábbi helyi adat érintetlen marad; a sérült adat letöltésére a felület külön lehetőséget ad.

## A korábbi feladat folytatása

A korábbi tíz téma és összes feladatazonosító változatlan. A témánkénti generált gyakorlás az eredeti seedet és a tényleges családszámmal képzett változatindexet használja. A korábbi témák általános generátorcsaládjainak száma és sorrendje megmarad. Így például a 14. generált törtfeladat nem cserélődik le az import miatt.

A vegyes gyakorlásba négy új téma került. Az importált régi profil `legacyReviewSeed` és `legacyReviewSchema` jelzőpárja az éppen megnyitott régi vegyes feladatot a megfelelő hatos vagy tízes sorrend szerint játssza vissza, ugyanazzal a seeddel és változattal. Egy séma 2 mentésben megőrzött korábbi hatos feladat a séma 3-ba importálva is hatos marad. A „Jöhet egy másik téma” gomb törli a két egyszeri jelzőt, és onnantól a tizennégy téma váltakozik. A jelzők újraexportálás és újratöltés után is megmaradnak a következő feladat kéréséig; csak a `reviewSeed`-del azonos, érvényes egész érték és 1 vagy 2 sémajelző fogadható el. Aktuális profilban a pár egyik fele önmagában érvénytelen.

## Készségesemények

A séma 3 `learning` objektuma kötelező. Saját naplóverziója 1; `events` listája legfeljebb 2000 ellenőrzést, `nextId` mezője a következő azonosítót, `droppedEvents` mezője az elhagyott régebbi események számát tartalmazza. Az azonosítósor, a pontos ISO-időpontok, a mezők, a regisztrált készségek és a részválaszonkénti eredmények külön, szigorúan ellenőrzöttek. Egy esemény legfeljebb 64 készség–részválasz eredményt tartalmazhat.

A napló csak ténylegesen ellenőrzött részválaszokból bővül. Ismételt változatlan ellenőrzés, jóslás vagy gépelés nem hoz létre eseményt. Egy már korábban sikeres régi feladat puszta újraellenőrzése sem válik kitalált új önálló vagy segített sikerré. A különböző felületeken megjelenő azonos forrásfeladat ugyanannak a megfigyelésnek számít.

A napló a nyers választ nem másolja le újra; rövid válaszlenyomatot használ az ismétlések felismeréséhez. Ez nem titkosítás. A feladatszintű `Attempt.input` továbbra is tartalmazza a tanulói választ. A régi részletes események a korlát elérésekor kieshetnek, a feladatállapotok ettől megmaradnak; a felület jelzi az elhagyást. A készségösszesítések a megőrzött eseményekre vonatkoznak. Részletek: [készségnapló és javítás](KESZSEG_ES_JAVITAS.md).

## Több válaszmező és saját indoklás

A több részből álló feladat válaszai az `Attempt.input` karakterláncában tárolt, validált JSON-objektumba kerülnek. Legfeljebb 16 rész, részenként legfeljebb 180 karakter fogadható el. A kulcsok szabályozottak; objektum-prototípust érintő kulcs, beágyazott objektum és nem szöveges érték nem engedélyezett. A régi skalár bemenet 200 karakteres validációs korlátja nem lett általánosan feloldva.

A feladat melletti szabad indoklás legfeljebb 2000 karakter, és csak külön mentési választással lesz az `Attempt.reflection` része. A műhelyek gondolatmezője ugyanezt a választási elvet követi, 600 karakteres beviteli korláttal; a mentési séma a műhelyek szöveges mezőire külön 1000 karakteres felső határt tart fenn. A megnyitott indoklási szempontok segítségnek számítanak, a szöveget nem értékeli automatikusan a program.

A mentett visszajelzésszöveg (`result`) nem megbízható bemeneti adat: importáláskor és újratöltéskor nem használjuk fel. A válasz és a sikerjelzések megmaradnak; az „Ellenőrzöm” gomb újra a jelenlegi matematikai motorral ad visszajelzést. Ez a korábbi alkalmazásban is érvényes bizalmi határ volt.

## Pontos arányossági adatpárok

Az arányosság műhely az új minták x-értékeit elfogadott szám- vagy törtszövegként, az `exactSamples` legfeljebb 1000 karakteres JSON-mezőjében őrzi meg. Így például az x = 1/3 adatpár újratöltés, export és import után is pontosan y = 400/3 értékű marad a 400x modellben. A korábbi numerikus `samples` mező olvasható marad; új pont hozzáadásakor a pontos formátumot használjuk. A grafikon kirajzolási koordinátáihoz végzett számkonverzió nem módosítja a táblázat és a mentés matematikai adatait.

## Korlátok és hibakezelés

A közös import/export határ 16 000 000 UTF-8 bájt és legfeljebb 10 000 feladatrekord. A korlát feletti, hibás vagy ellentmondó profil nem írhat felül korábbi mentést. Minden sémánál annak teljes, rögzített témakészlete kötelező: 6, 10 vagy 14 téma. Ismeretlen témát, hiányos aktuális profilt és sérült eseménynaplót a validáció elutasít. Helyi tárolási hiba esetén a felület ezt jelzi és fájlba mentést kínál.

A vendégmód külön, átmeneti profilt használ. A rendes profilba visszatérve annak korábbi állapota marad meg. A helyi törlés továbbra is külön megerősítést kér.

## Tényleges ellenőrzés

Az `app/tests/progress.test.ts` sémánkénti, méretkorlátos, sérültadat-, újratöltési és visszajátszási eseteket tartalmaz. Az `app/tests/learning.test.ts` a részletes eseményeket, az ismétlések kiszűrését, a korlátokat és az újraválasztható javító feladatokat vizsgálja.

Az `app/tests/foundations-browser.mjs` a Gitben megőrzött valódi v0.1.1, az `app/tests/bridges-browser.mjs` a valódi v0.2.0 HTML felületén készít régi exportot. Az új felületen előnézik és importálják, majd újratöltés után is összevetik a megmaradt adatokat, az aktív régi vegyes feladatot is beleértve. A régi HTML-ek hashét a tesztek külön ellenőrzik, ezért kézzel összeállított új profil nem helyettesítheti ezt a vizsgálatot. Az új készségnapló tényleges UI-exportja és újraimportálása külön próba.
