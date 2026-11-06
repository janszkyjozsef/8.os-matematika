# A 0.2.0 kiadás ellenőrzési jegyzőkönyve

**Dátum:** 2026. november 6.

**Kiadás:** Matek8 — Értsd is! 0.2.0.

**Ténylegesen vizsgált önálló HTML:** 534 620 bájt.

**SHA-256:** `2d928d1c5adc23ba2888f5cbf0c3ed22479ea4b161f457927056995896aa9ed4`.

A gyökérbeli `index.html`, az `app/release/Matek8_Offline_v0_2_0.html`, a kiadási jegyzék és a tartalmi snapshot ugyanahhoz a kiadáshoz tartozik. A tartalmi és kiadási kapuk ezt fájlonként, illetve bájtra ellenőrizték. Nem egy korábbi offline fájlt vizsgáltunk.

## Összesített, tényleges eredmény

| Vizsgálat | Eredmény |
|---|---|
| Friss lockfájl-alapú telepítés | `npm ci --prefix app --no-audit --no-fund` sikeres; node_modules nem a régi projektből másolva |
| Típusellenőrzés és produkciós build | Sikeres, Node 24.22.1; a portable HTML a forrásból készült |
| Matematikai, tartalmi, modell- és mentéstesztek | **97/97 sikeres** |
| Kiadás-, verzió-, történeti tartalom- és bájtegyezési tesztek | **8/8 sikeres** |
| Régi utak forrásból futó Playwright-tesztjei | **18/18 sikeres** |
| A gyökérbeli kiadás almappás böngészős vizsgálatai | **12/12 sikeres** |
| A négy új út és a migráció böngészős kapui | **26/26 sikeres** |
| Automatikus axe-vizsgálatok | **13 + 9 + 8 = 30 futtatott ellenőrzés, 0 jelzett szabálysértés** |
| Az alapozó tesztsor mobilállapotai | **61 állapot**, 320/390 px, normál és nagybetűs nézet; nincs oldalszintű vízszintes túlcsordulás |
| Oldal- és konzolhibák | **0** a vizsgált folyamatokban |
| Offline új lecke | Megoldás, újratöltés és export sikeres; **0 HTTP(S)-kérés** |
| Nyomtatás | Négy új lap, egyenként 14 feladat és 14 magyarázott megoldás; minden részmező megmaradt |

Az összesített forrás/kiadás tesztszám **105**, a böngészős ellenőrzések száma **56**. Ezek különböző hatókörű kapuk; a darabszám nem állítás minden lehetséges használat teljes lefedéséről. A böngészős körök Chromium **153.0.8010.0** alatt futottak, saját izolált profilokkal.

## Matematikai bizonyítás

A rögzített régi kérdések 41 számos és 25 választásos referenciája, a 12 korábbi kidolgozott példa, továbbá a 60 új rekord **187 külön válaszmezője** és 8 új kidolgozott példája ellenőrzött. A régi és új célzott hibaválaszokat a tényleges ellenőrzőbe is beadtuk.

Az eredeti 18 generátorcsalád 3600 mintája és az új 12 család 2400 mintája összesen **6000 generált feladat**. A referenciák a látható feladatszöveg adataiból, külön számítással készülnek. A program által tárolt helyes válasz visszaolvasása nem helyettesíti ezt a réteget. A többmezős válaszok hiányos, hibás és formailag téves esetei is szerepelnek.

A műveleti sorrend kifejezésfája megtartja a zárójel és a negatív alap különbségét, többféle független kezdőlépést fogad el, és a nullával osztást nem alakítja 0-vá vagy Infinity-vé. A számegyenes, arányosság és egységváltás tiszta modelljeihez külön számszaki próbák tartoznak.

## Valódi tanulói folyamatok

A régi, hash-ellenőrzött v0.1.1 HTML saját felületén hoztunk létre exportot. Az új felületen az előnézet megszakítása, a megerősített import és az újratöltés is szerepelt. Megmaradt a hat régi lecke, a beállítások és próbálkozások, valamint az aktív generált témagyakorló és vegyes feladat azonosítója, szövege és válasza. A négy új téma üresen indult.

A böngésző kitöltötte és ellenőrizte mind a 60 új rekord minden válaszrészét, bejárta a hat szakaszt, használta a két segítségi lépcsőt, az önálló próba új körét és az összes új generátorcsaládot. A tíztémás vegyes kör mindegyik témát elérte. A saját szavas indoklás mentési választását, eltávolítását és a gépi minősítés hiányát is ellenőrizte.

A lezáró arányossági regresszióban **x = 1/3 → y = 400/3, y/x = 400** maradt a táblázatban újratöltés és tényleges felületi export/import után is. A minták pontosságát a grafikonhoz szükséges képernyő-koordináták nem módosítják.

## Vizuális és használhatósági ellenőrzés

Asztali és 320 px-es nagybetűs képeket is ténylegesen megnyitottunk. A számegyenes E pontját a nyílhoz vetítővonal köti; a munkagrafikon osztásai és feliratai azonos skálát használnak; az 500 Ft-os alapdíj a tengelyen leolvasható. A kocka 20 × 20-as rétege és 20 rétege 8000 cm³ = 8 L értéket ad.

A szűk nézetben a teljes, nem lekicsinyített ábra és táblázat saját görgethető régióban érhető el. Látható útmutató jelzi a görgetést. A teszt valódi fókuszt és ArrowRight billentyűt használva igazolta a belső görgetést, miközben az oldal szélessége 320 px maradt.

A tényleges kiadásból készült **13 oldalas Mértékegységek PDF** oldalait átnéztük. A cím és az első válaszmező együtt marad; a rövid feladatok egészben nyomtatódnak; a hosszú többmezős feladatok megfelelő részek között tördelhetők. A 14. feladat szövege, három részválasza, indoklása, változatlan íráshelye és azonosítója együtt került a 8. oldalra. A többi három új út külön PDF-próbája is megőrizte a feladatokat és a mezőket.

## A talált hibák lezárása

A kiadás előtt javítva és újraellenőrizve: a régi generált feladat változatindexe; az aktív régi vegyes feladat visszajátszása; független műveleti ágak megengedett sorrendje; előjelként álló pluszjel magyarázata; munkagrafikon tick/felirat eltérése; műveletgomb látható és hozzáférhető nevének eltérése; saját indoklások külön mentési választása; nyomtatási árva cím/íráshely; törtes arányossági minták Number-közbeiktatás miatti pontosságvesztése; korábbi workflow késői telepítésének versenyhelyzete.

A kijelölt helyi ellenőrzési hatókörben nincs ismert, nyitva hagyott hiba. A teljes évfolyam bővítése és a külső kipróbálások ettől külön feladatok.

## Megőrzött futási adatok és megismétlés

- [Forrástesztek naplója](ellenorzes/v0.2.0/core-tests.txt)
- [Eredeti utak böngészőjelentése](ellenorzes/v0.2.0/source-browser.json)
- [Önálló kiadás böngészőjelentése](ellenorzes/v0.2.0/release-browser.json)
- [Négy új út, migráció, mobilnézet és offline jelentés](ellenorzes/v0.2.0/foundations-browser.json)

A jelentésekben szereplő képek, tesztexportok és PDF-ek az újrafuttatáskor az `app/test-results/` alatt keletkeznek; nem tanulói személyes adatokat, hanem izolált tesztprofilokat használnak. A parancsok a [fejlesztői útmutatóban](FEJLESZTES.md) szerepelnek.

## Korlátok és távoli kiadás

Az axe nem hozzáférhetőségi tanúsítvány. Külső szaktanári lektorálás, tanulói kipróbálás, Firefox/Safari, valódi telefon és képernyőolvasó ebben a ciklusban nem történt. A sikeres technikai ellenőrzés nem bizonyítja, hogy minden tanuló megérti a tananyagot.

Ez a jegyzőkönyv a helyi, ténylegesen futtatott ellenőrzéseket rögzíti. A GitHub CI ugyanazokat a kapukat friss telepítésből futtatja; a távoli eredmény a konkrét commit [Actions-futásában](https://github.com/janszkyjozsef/8.os-matematika/actions/workflows/check-and-publish.yml) mérvadó. A Pages első engedélyezésének hiánya nem tekinthető sikeres élesítésnek; ennek feltételei az [élesítési útmutatóban](ELESITES.md) szerepelnek.
