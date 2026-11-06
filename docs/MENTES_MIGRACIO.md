# Haladásmentés és migráció

## Két külön verzió

Az alkalmazás kiadása **0.2.0**, a mentési adatséma **2**. A böngésző tárolókulcsa változatlan: `matek8:profile:v1`. A kulcsot nem nevezzük át, mert így a meglévő helyi mentés felfedezhető marad.

A `topics.ts` két külön listát tartalmaz:

- `LEGACY_TOPICS`: a séma 1 eredeti hat témája; ez a lista befagyasztott.
- `TOPICS`: a jelenlegi tíz témát tartalmazó regiszterből képzett lista.

Az `appVersion` az adat utolsó rögzített alkalmazásverzióját jelöli. Importáláskor megmarad; a következő tanulói módosítás az aktuális kiadás verzióját rögzíti. A sémaverzió ettől függetlenül már a migrált szerkezetet írja le.

## A régi mentés útja

1. A `parseImport` ellenőrzi a bájtméretet és a JSON-t.
2. A `validateProfile` először a bejelentett sémának megfelelő teljes szerkezetet vizsgálja. Séma 1-nél mind a hat eredeti lecke szükséges. Hiányzó vagy sérült régi lecke nem kap hallgatólagosan alapértéket.
3. Az eredeti beállítások, leckeállapotok, műhelyadatok, válaszok, próbálkozások, segítségszintek, sikerjelzések, legutóbbi téma és seedek megmaradnak. Csak a négy új téma kap üres kezdőállapotot.
4. Az új objektum séma 2 alakú. A forrásobjektum nem módosul, és a puszta betöltés nem írja át a régi böngészőadatot. Sikeres mentéskor vagy megerősített importáláskor kerül tárolásba az új szerkezet.

Az importfelület előnézetet mutat. A csere csak az erre szolgáló megerősítő gomb után történik meg. Hiba esetén a korábbi helyi adat érintetlen marad; a sérült adat letöltésére a felület külön lehetőséget ad.

## A korábbi feladat folytatása

A régi hat téma és összes feladatazonosító változatlan. A témánkénti generált gyakorlás az eredeti seedet és a tényleges családszámmal képzett változatindexet használja. Így például a 14. generált törtfeladat nem cserélődik le az import miatt.

A vegyes gyakorlásba négy új téma került. Az importált régi profil `legacyReviewSeed` jelzője az éppen megnyitott régi vegyes feladatot az eredeti hatos sorrend szerint játssza vissza, ugyanazzal a seeddel és változattal. A „Jöhet egy másik téma” gomb törli ezt az egyszeri jelzőt, és onnantól a tíz téma váltakozik. A jelző újraexportálás és újratöltés után is megmarad a következő feladat kéréséig; csak a `reviewSeed`-del azonos, érvényes egész érték fogadható el.

## Több válaszmező és saját indoklás

A több részből álló feladat válaszai az `Attempt.input` karakterláncában tárolt, validált JSON-objektumba kerülnek. Legfeljebb 16 rész, részenként legfeljebb 180 karakter fogadható el. A kulcsok szabályozottak; objektum-prototípust érintő kulcs, beágyazott objektum és nem szöveges érték nem engedélyezett. A régi skalár bemenet 200 karakteres validációs korlátja nem lett általánosan feloldva.

A feladat melletti szabad indoklás legfeljebb 2000 karakter, és csak külön mentési választással lesz az `Attempt.reflection` része. A műhelyek gondolatmezője ugyanezt a választási elvet követi, 600 karakteres beviteli korláttal; a mentési séma a műhelyek szöveges mezőire külön 1000 karakteres felső határt tart fenn. A megnyitott indoklási szempontok segítségnek számítanak, a szöveget nem értékeli automatikusan a program.

A mentett visszajelzésszöveg (`result`) nem megbízható bemeneti adat: importáláskor és újratöltéskor nem használjuk fel. A válasz és a sikerjelzések megmaradnak; az „Ellenőrzöm” gomb újra a jelenlegi matematikai motorral ad visszajelzést. Ez a korábbi alkalmazásban is érvényes bizalmi határ volt.

## Pontos arányossági adatpárok

Az arányosság műhely az új minták x-értékeit elfogadott szám- vagy törtszövegként, az `exactSamples` legfeljebb 1000 karakteres JSON-mezőjében őrzi meg. Így például az x = 1/3 adatpár újratöltés, export és import után is pontosan y = 400/3 értékű marad a 400x modellben. A korábbi numerikus `samples` mező olvasható marad; új pont hozzáadásakor a pontos formátumot használjuk. A grafikon kirajzolási koordinátáihoz végzett számkonverzió nem módosítja a táblázat és a mentés matematikai adatait.

## Korlátok és hibakezelés

A közös import/export határ 16 000 000 UTF-8 bájt és legfeljebb 10 000 feladatrekord. A korlát feletti, hibás vagy ellentmondó profil nem írhat felül korábbi mentést. Séma 2-nél mind a tíz téma kötelező; ismeretlen témát és hiányos aktuális profilt a validáció elutasít. Helyi tárolási hiba esetén a felület ezt jelzi és fájlba mentést kínál.

A vendégmód külön, átmeneti profilt használ. A rendes profilba visszatérve annak korábbi állapota marad meg. A helyi törlés továbbra is külön megerősítést kér.

## Tényleges ellenőrzés

Az `app/tests/progress.test.ts` sémánkénti, méretkorlátos, sérültadat-, újratöltési és visszajátszási eseteket tartalmaz. Az `app/tests/foundations-browser.mjs` a Gitben megőrzött valódi v0.1.1 HTML felületén készít régi exportot, azt az új felületen előnézi és importálja, majd újratöltés után is összeveti a megmaradt adatokat. A régi HTML hashét a teszt külön ellenőrzi, ezért egy kézzel összeállított új profil nem helyettesítheti ezt a vizsgálatot.
