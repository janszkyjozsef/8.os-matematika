# A 0.3.0 kiadás ellenőrzési jegyzőkönyve

**Dátum:** 2026. november 6.

**Kiadás:** Matek8 — Értsd is! 0.3.0; profilséma: 3.

**Ténylegesen vizsgált önálló HTML:** 796 036 bájt.

**SHA-256:** `32f73e067df963f6cd8f9e7435f802da3efbccb321d66efe0be4adae66ba8066`.

A gyökérbeli `index.html`, az `app/release/Matek8_Offline_v0_3_0.html`, a kiadási jegyzék és a `content/v0.3.0/` tartalmi másolatai ugyanahhoz a kiadáshoz tartoznak. A build és a kiadási kapuk bájtra ellenőrzik az egyezést. A négy böngészős tesztsor a végleges builden futott; a korábbi kiadások kizárólag a történeti migrációs próbák forrásai.

## Tényleges eredmények

| Vizsgálat | Eredmény |
|---|---|
| Friss telepítés a változatlan függőség-lockfájlból | Sikeres `npm ci --prefix app --no-audit --no-fund` |
| Típusellenőrzés, Vite és önálló HTML készítése | Sikeres; Node 24.22.1 |
| Matematikai, tartalmi, műhely-, tanulási és migrációs tesztek | **168/168 sikeres** |
| Forrás, snapshot, történeti tartalom, verzió és kiadás egyezése | **9/9 sikeres** |
| Eredeti hat út böngészős regressziós tesztjei | **18/18 sikeres** |
| Gyökérbeli kiadás almappás böngészős tesztjei | **12/12 sikeres** |
| A 0.2.0 alapozó utak, valódi v1-export és minden műhely mobilnézete | **26/26 sikeres** |
| A négy új út, valódi v2-export, készségnapló és célzott javítás | **22/22 sikeres** |
| Automatikus axe-vizsgálatok | **13 + 9 + 8 + 7 = 37 vizsgálat, 0 jelzett szabálysértés** |
| Offline használat | Tényleges feladatmegoldás, újratöltés és export; **0 HTTP(S)-kérés** |
| Futásidejű és konzolhibák | **0** a vizsgált folyamatokban |

Összesen **177 forrás- és kiadásteszt**, valamint **78 böngészős forgatókönyv** sikeres. A helyi böngésző Chromium **153.0.8010.0**, izolált profilokkal. A különböző hatókörű tesztek darabszáma nem jelenti minden lehetséges használat teljes lefedését.

Az alapozó böngészős kör egyik, más tesztsorokkal párhuzamos futása egy kattintás 10 másodperces időkorlátján megállt. A végleges soros újrafuttatás mind a 26 forgatókönyvet teljesítette; ehhez nem változott a program, az elvárás vagy az időkorlát. A CI a böngészős köröket sorosan futtatja.

## Matematikai és tartalmi ellenőrzés

A négy új út **60 kérdésrekordja, 183 válaszmezője, 101 célzott hibaszabálya és 8 kidolgozott példája** külön tartalmi ellenőrzést kapott. A kifejezésmezők 76 elfogadott szerzői alakját a tényleges ellenőrzővel is próbáltuk. A saját szavas indoklásnak önellenőrzési szempontjai vannak; a program nem minősíti automatikusan megértettnek.

A generátorteszt mintái:

| Családok | Ellenőrzött generálás |
|---|---:|
| Hat eredeti út 18 családja | 3600 |
| A 0.2.0 négy alapozó útjának 12 családja | 2400 |
| A 0.3.0 négy új útjának 12 családja | 2400 |
| Megfigyelt gyakoriság és elméleti esély javító család, két változat | 400 |
| **Összesen** | **8800** |

A referenciaeredmények a megjelenített történet és kifejezés adataiból, külön számítással készülnek. A mintaszám seedenkénti ellenőrzést jelent, nem 8800 különböző feladatszöveg ígéretét. Az új tizenkét családnál 7600 válaszmező, 3200 elfogadott kifejezésalak és 5315 tényleges hibás bevitel is szerepel a próbákban; további 252 szélső és negatív seedű visszajátszás külön regresszió.

A négy új műhely tiszta matematikai modelljeit 21 teszt ellenőrzi. Külön eset a negatív alap és a külső mínusz, a nulladik hatvány feltétele, a nemnegatív négyzetgyök és a négyzetes egyenlet megoldáshalmazának eltérése, a pontos érték és közelítés, valamint a hiányzó adatú történet. Az önkényes kódvégrehajtás és az `eval` nem része a működésnek.

## Készségnapló és valódi javító folyamat

A tanulási és migrációs tesztek közül 49 az eseménynapló, a megőrző migráció, a szigorú validáció és a célzott választó működését vizsgálja. A készségnapló tényleges ellenőrzéskor keletkezik; a jóslás, gépelés, megnyitás, üres vagy nem értelmezhető válasz nem tudásbizonyíték. Az ismételt helyes ellenőrzés, másik elfogadott írásmód és ugyanazon feladat más útvonala nem hoz létre új önálló sikert.

A böngészőben hibás válaszból nyitottuk meg a kapcsolódó készség javítását, kértünk segítséget, megoldottuk az új feladatot, majd a további próbát. Ellenőrzött az újratöltés, a profilfüggetlen feladathivatkozás, a valódi export/import, a magyarázatra és műhelyre vezető link, a másik feladat kérése és a sérült hivatkozás kezelése.

A lezárás előtt két pedagógiai hibát is javítottunk. A célzott feladat nem emelheti ki önmagában a közölt végösszeg visszamásolását: a függő ellenőrző részhez az egyenlet és a kiszámolt ismeretlen együtt marad. A **7450 Ft-os generált** és **4300 Ft-os szerzői** regresszióban az összeg egyedüli bemásolása nulla készségesemény; csak ugyanabban az ellenőrzésben helyes előzményekkel fogadható el. A további próba címe pedig különbséget tesz a **Másik alkalmazás** és az azonos szerkezetű **Új adatokkal** gyakorlás között.

Újratöltés után a megőrzött válaszokat ismét ellenőrizni kell a javító folyamat továbblépéséhez. Ez nem gyárt új sikert, és nem tekinti teljesen késznek azt a feladatcsoportot, amelyből csak egy rész volt helyes. A még kitöltetlen feladat cseréje is eltérő forrást ad, kitalált próbálkozás rögzítése nélkül.

## Megőrző migráció

A hash-ellenőrzött **0.1.1 és 0.2.0 HTML saját felületén** készült régi export. Az új alkalmazás felületén az import előnézete, megerősítése és az újratöltés is megtörtént. A régi eredmények, beállítások, műhelyállapotok és a nyitott generált feladat megmaradtak; az új készségnapló kitalált történeti esemény nélkül indul.

A korábbi hatos és tízes témasorrendű vegyes feladat folytatható; új feladat kérésekor a tizennégy témás sorrend lép életbe. A hiányos régi és sérült új mentés nem kap automatikus, adatvesztő javítást. A séma 3 eseményeire önálló, szigorú formai és tartalmi validáció vonatkozik.

## Mobil, billentyűzet, nyomtatás és offline működés

A 320 és 390 px-es nézetet normál és nagy betűkkel is vizsgáltuk. Az alapozó tesztsor a kezdőlapot és mind a tizennégy műhelyt is bejárja; az új tesztsor külön **48 állapotban** vizsgálja az új műhelyeket, többmezős feladatokat, javítást és készséghaladást. A vizsgált oldalaknak nincs oldalszintű vízszintes túlcsordulásuk. A nagy ábrák szükség szerint saját, billentyűzettel is görgethető régióban maradnak olvashatók.

A négy új nyomtatott lap egyenként **14 teljes feladatot és 14 magyarázott megoldást** tartalmaz. Minden részmező megmaradt. A tényleges PDF-ek rendre 13, 14, 14 és 14 oldalasak; az összes 55 oldalon nulla laphatáron túlnyúló szövegblokkot talált a geometriai ellenőrzés. Az első, középső és utolsó oldalak képeit, valamint a négy új műhely 320 px-es nagybetűs kivágatait vizuálisan is megnyitottuk.

A végleges, helyi fájlként megnyitott HTML hálózat nélkül is megoldást, készségeseményt, újratöltést, feladat-visszajátszást és exportot adott. Külső API, betűkészlet vagy matematikai CDN nem szükséges.

## Megőrzött futási adatok

- [Forrás- és kiadástesztek naplója](ellenorzes/v0.3.0/core-tests.txt)
- [Eredeti tanulói utak](ellenorzes/v0.3.0/source-browser.json)
- [Önálló kiadás és almappás használat](ellenorzes/v0.3.0/release-browser.json)
- [Alapozó utak, v1-migráció és minden műhely mobilnézete](ellenorzes/v0.3.0/foundations-browser.json)
- [Négy új út, v2-migráció és célzott javítás](ellenorzes/v0.3.0/bridges-browser.json)
- [PDF- és képméretek, vizuális ellenőrzési hatókör](ellenorzes/v0.3.0/visual-review.json)

A képek, tesztexportok és PDF-ek az újrafuttatáskor az `app/test-results/` alatt keletkeznek; izolált tesztadatokat használnak. A megismétlés parancsai a [fejlesztői útmutatóban](FEJLESZTES.md) szerepelnek.

## Távoli kiadás és korlátok

A feltöltés előtt frissen ellenőrzött main a `23ee76b0c6d1b1643345290b5a89e22ff45c4350` commit volt. A GitHub ekkor `has_pages: false` állapotot jelzett. A jelenlegi kapcsolat kódfeltöltést támogat, a Pages első adminisztratív engedélyezéséhez nem ad műveletet. Az egyszeri beállítás pontos lépései az [élesítési útmutatóban](ELESITES.md) vannak.

Ez a jegyzőkönyv a tényleges helyi eredményt rögzíti. A távoli CI az adott commit [Actions-futásában](https://github.com/janszkyjozsef/8.os-matematika/actions/workflows/check-and-publish.yml) mérvadó. A sikeres ellenőrzés mellett kihagyott telepítési job nem éles publikálás.

A kijelölt helyi hatókörben nincs ismert, nyitva hagyott alkalmazáshiba. A teljes évfolyam nem készült el. Az időben ütemezett ismétlés és az egyénileg összeállítható feladatlap későbbi ciklus. Külső tanári lektorálás, tanulói kipróbálás, Firefox/Safari, valódi telefon és képernyőolvasó vizsgálata ebben a ciklusban nem történt. Az axe-eredmény nem tanúsítvány; a technikai tesztek nem igazolják, hogy minden tanuló megérti a tananyagot.
