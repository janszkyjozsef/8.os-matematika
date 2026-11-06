# Tananyag-ellenőrzés — 0.3.0

**Dátum: 2026. november 6.** A jelenlegi kiadás a korábbi tíz utat négy további teljes leckével, készségnaplóval és célzott javító gyakorlással bővíti. A korábbi tíz lecke objektumai változatlanok; a 0.2.0 tartalmi vizsgálat részletei e dokumentum második felében történeti referencia maradnak.

## A 0.3.0 négy új útja

| Út | Kidolgozott példa | Gyakorló | Gyakorlóhoz tartozó segítség | Önálló próba | Jóslás |
|---|---:|---:|---:|---:|---:|
| Betűs kifejezések | 2 | 12 | 24 | 2 | 1 |
| Szöveges modellek | 2 | 12 | 24 | 2 | 1 |
| Hatványok | 2 | 12 | 24 | 2 | 1 |
| Négyzetgyök | 2 | 12 | 24 | 2 | 1 |
| **Összesen** | **8** | **48** | **96** | **8** | **4** |

A 60 új kérdésrekord **183 válaszmezőt** és **101 célzott hibaszabályt** tartalmaz. Minden feladathoz saját szavas indoklás és önellenőrzési szempont tartozik. A kéziratok a `docs/tananyag/05–08` fájlokban, a tényleges alkalmazásadatok a `bridge-lessons.ts` fájlban vannak; a stabil kézirat- és mezőazonosítók visszakereshetők. Ez nem 183 külön feladat.

Az új tartalmi referenciateszt (`app/tests/bridge-content.test.ts`) minden rögzített mezőt külön számszaki vagy szerkesztett fogalmi referenciához köt. A feladatszöveg megadott adatait is ellenőrzi, a véges kifejezéslista alakjait külön polinomértelmezővel vizsgálja. Ez a teszt nyelve; az alkalmazás továbbra sem általános szimbolikus algebrai rendszer. Az összes célzott hibát ténylegesen beadja az ellenőrzőnek, és a megfelelő részmező saját visszajelzését várja. A nyolc kidolgozott példa lényegi számításait is újraszámolja.

A tizenkét új általános generátorcsalád **12 × 200 = 2400** példájának referenciáját a `bridge-generators.test.ts` a látható feladatadatokból, saját racionális számolással adja. Nem használja a generátor véletlenállapotát vagy helyesválasz-mezőjét a referencia előállításához. A gyökbecslés egészszámos korlátozást és felezőpont-vizsgálatot használ; a modellkifejezések alakjai külön lineáris értelmezővel ellenőrzöttek.

A megfigyelt gyakoriság és az elméleti esély külön javító családja kockás és pénzérmés változatban **2 × 200 = 400** látható adatsorból újraszámolt példát kapott. A korábbi 6000 generátorpéldával együtt a reprodukálható matematikai mintavizsgálat **8800 példát** fed le. Ez mintavizsgálat a családokból, nem minden lehetséges feladat teljes felsorolása.

A négy új lecke 60 rekordját és 8 példáját a készítőjétől külön végzett szerkesztői átnézés is ellenőrizte. További 720 generált példát külön Python `Fraction` és nagy pontosságú `Decimal` számítás ellenőrzött; ezt a kiegészítő átnézést nem számoljuk hozzá a CI 8800-as mintaszámához. Külső szaktanári lektorálás és tanulói kipróbálás még nem történt.

## Függő részfeladatok és készségmegfigyelés

Az ellenőrző mezőt nem szabad úgy leválasztani, hogy a megadott teljes összeg puszta visszamásolása sikeres modellellenőrzés legyen. A `requiresParts` metaadat ezért megnevezi azokat az előzménymezőket, amelyekkel a rész együtt értelmezhető. A célzott nézet ezek tranzitív csoportját megtartja; a függő rész készségeseménye csak ugyanabban az ellenőrzésben helyes előzmények mellett rögzül. Egy korábbi helyes előzmény nem pótolja a most hiányzó választ.

A független helyettesítési és fogalmi részek továbbra is külön gyakorolhatók. Az egységár és a visszaellenőrzött összeg, a kiszámolt két hossz és különbségük, illetve a kerekített oldal és annak négyzete indokolt esetben összetartozik. A tesztek a függőségek létezését, egyértelműségét és körmentességét is ellenőrzik.

A készségnapló külön kezeli a matematikai hibát, a kért alak hibáját, az önálló eredményt és a segítséggel vagy javítással elért sikert. A gépelés, jóslás és ismételt változatlan ellenőrzés nem új megfigyelés. A „Másik alkalmazás” cím csak akkor jelenik meg, ha a választó ténylegesen eltérő alkalmazási helyzetet vagy szerkezetet választ; azonos szerkezetnél a felület „Új adatokkal” jelzést használ.

## Az új műhelyek és a teljes használat

A `bridge-labs.test.ts` 21 modelltesztje az egynemű tagokat és az előjeles behelyettesítést, a történetek feltételeit és hiányzó adatait, a hatványalapot és a külső mínuszt, a rétegmodelleket, a gyök pontos/közelítő értékét és a valós megoldások számát vizsgálja. A 0⁰ nem kap hamis numerikus eredményt; a negatív gyök alatti szám és a támogatott tartományon kívüli bevitel emberi magyarázatot kap.

A `bridges-browser.mjs` a konkrét, hash-azonosított önálló HTML-en kezeli a vezérlőket és megoldja a négy út összes rögzített mezőjét. A régi v0.2.0 felületén létrehozott valódi exportot importálja, újratöltés után is összeveti a korábbi adatokat, és kipróbálja a célzott javítást, a napló megőrzését, a hibás importot, a mobilnézetet, a billentyűzetet, a négy nyomtatható lapot és az offline működést. A régi v0.1.1 migrációja és a korábbi utak regressziója külön tesztsorban megmarad.

A végleges futások pontos száma és az azonos kiadáshash a [0.3.0 ellenőrzési jegyzőkönyvben](ELLENORZES_0.3.0.md) található. A böngészős válaszkitöltés az összekapcsolást igazolja; a matematikai referenciatesztek ettől függetlenül vizsgálják a helyességet.

---

## Történeti rész: a 0.2.0 négy alapozó kéziratának beépítése

Az alábbi darabszámok és az „új” szó a **0.2.0 ciklusra** vonatkoznak. A mostani teljes kiadás számai a fenti részben és a kiadási jegyzékben mérvadók.

**Dátum:** 2026. november 6.  
**Kiadás:** 0.2.0. Az eredeti kéziratok a `docs/tananyag/` alatt változatlanok; az alkalmazásba épített változat az `app/src/content/foundations.ts` fájlban található.

## A tartalom megőrzése

| Új tanulási út | Kidolgozott példa | Gyakorlófeladat | Gyakorlók segítségi lépcsői | Önálló próba | Eredeti hibaminta |
|---|---:|---:|---:|---:|---:|
| Számfogalom és előjelek | 2 | 12 | 24 | 2 | 5 |
| Műveleti sorrend | 2 | 12 | 24 | 2 | 5 |
| Arányosság | 2 | 12 | 24 | 2 | 5 |
| Mértékegységek | 2 | 12 | 24 | 2 | 5 |
| **Összesen** | **8** | **48** | **96** | **8** | **20** |

Az integráció négy jósló belépőt is ad. A 60 új kérdésrekordhoz 187 ellenőrzött válaszmező tartozik, 39 feladat saját szavas indoklási felhívást is tartalmaz. A 48 gyakorló feladatszám, nem a külön mezők száma. A több részből álló gondolkodtató kérdésekhez több külön mező, célzott részvisszajelzés és szükség szerint valódi kifejezésbevitel készült.

A teljes [azonosítótérkép](TANANYAG_AZONOSITOK.md) feladatonként összeköti a kéziratot az alkalmazásbeli rekorddal. A történeti hat lecke tartalmi adatai változatlanok, és továbbra is egyeznek a `content/v0.1.0/` másolatával. Az új kiadás saját `content/v0.2.0/` snapshotot kapott.

## Matematikai ellenőrzés az alkalmazás tényleges adataira

Az `app/tests/foundations.test.ts` hat tesztje az alkalmazásba beépített adatot vizsgálja. Az eredmények nem csupán a rekordban tárolt helyes válasz visszaolvasásából származnak:

- mind a **187 új fix válaszmező** külön számításból vagy szerkesztett jelentésreferenciából ellenőrzött;
- mind a **78 új célzott hibaválasz** ténylegesen beadva, a megfelelő részmező visszajelzésével vizsgálva;
- mind a **8 új kidolgozott példa** lényegi számeredménye újraszámolva;
- **12 új generátorcsalád × 200 seed = 2400 feladat** a látható feladatszövegből kiolvasott adatok alapján, külön racionális aritmetikával újraszámolva;
- a seed teljes értéke, a negatív változatok normalizálása, a visszajátszás és a hibás paraméterek visszautasítása ellenőrzött.

A régi tartalmi teszt továbbra is külön ellenőrzi a 41 számos és 25 választásos eredeti rekordot, a 12 régi kidolgozott példát és a 132 célzott hibaválaszt. Az eredeti 18 generátorcsalád 3600 mintája is megmaradt. Így az új és régi generált feladatok külön matematikai referencia alapján vizsgált mintája összesen **6000 feladat**.

## Műhelyek: a modell és a jelölés kapcsolata

A tiszta matematikai modelleket az `order.test.ts` és `foundation-labs.test.ts` vizsgálja. A valódi felület kezelését a külön böngészőteszt ellenőrzi.

| Műhely | Kiemelt ellenőrzési esetek |
|---|---|
| Számegyenes | −8 < −3, de abszolút értékük fordított sorrendű; −5 − (−3) = −2; 2,5 ellentettje; nulla; −6 és 4 távolsága; automatikusan táguló tengely |
| Műveleti sorrend | 24 : 6 × 2; a tiltott 6 × 2 kezdés; két független szorzás mindkét sorrendje; zárójel; −3² és (−3)²; nullával osztás; hibás bevitelt követő változatlan kifejezés |
| Arányosság | y = 400x; t = 24/n; y = 500 + 200x; több adatpár; hányados és szorzat; a nulla hányadosának kihagyása; pozitív egész segítőszám; a modellfeltételek láthatósága |
| Mértékegységek | Hossz-, terület- és térfogategységek; négyzetes és köbös váltó; liter–köbegység; 60-as időváltás; sebesség; egységváltás és valódi nagyítás; össze nem illő mennyiségfajták |

A műveleti sorrend elemzője kifejezésfát épít; tetszőleges kódot nem futtat. A különböző ágak egymástól független részszámításait akkor is engedi, ha eltérő rangú műveletet tartalmaznak. A függőségi szerkezet dönti el, mi számolható ki, ezért a tanuló nem egyetlen előre rögzített kattintássort követ.

## Teljes tanulói folyamat

Az `app/tests/foundations-browser.mjs` a gyökérbeli, SHA-256-tal azonosított önálló HTML-t nyitja meg izolált Chromium böngészőben. Valódi vezérlőket használ: kitölti és ellenőrzi a 60 új rekord minden válaszrészét, végiglép a hat szakaszon, kipróbálja a hibás választ, a két segítséget, az új generált köröket és az önálló próba újraindítását. A matematikai helyességhez ettől független referenciatesztek tartoznak; a böngészős kitöltés a felület és az ellenőrző összekapcsolását igazolja.

A régi v0.1.1 HTML saját felületén létrehozott exportot az új felületen importálja, és újratöltés után is összeveti az adatokat. A tíz műhely és a kezdőlap 320/390 px normál és nagybetűs nézetben szerepel. Nyomtatáskor a négy új lapon 14 feladat és 14 magyarázott megoldás, a több mező és az indoklás is megmarad. Az offline próba új leckét old meg, újratölt és exportál, HTTP(S)-kérés nélkül.

Az aktuális futási darabszámot, környezetet és kiadáshasht az [állapotjelentés](ALLAPOT.md) és a [kiadási ellenőrzési jegyzőkönyv](ELLENORZES_0.2.0.md) rögzíti. A GitHub-futás eredménye mindig az adott commit Actions-oldalán mérvadó.

## A saját szavas indoklás kezelése

A számválasz helyessége nem bizonyítja az indoklás minőségét. A felület ezt kifejezetten közli. A tanuló a saját szövegét összevetheti a megnyitható szempontokkal vagy megbeszélheti egy segítővel; ezek megnyitása segítségnek számít. A szabad szöveget csak külön választással mentjük. A segítség után javított választ a program nem írja át első önálló sikernek.

## A történeti kéziratvizsgálat helye

A kéziratok készítésekor korábban 55 számfogalmi, 50 műveleti sorrendi, 155 arányossági/egységváltási számszaki és 26 szerkezeti ellenőrzés futott. Ezek történeti munkajegyzetek, nem a 0.2.0 CI tesztszámai. A mostani kiadás eredményeit a repóban megőrzött, újrafuttatható tesztek adják.

## Ami még nem bizonyított

Az automatikus axe-vizsgálat nem hozzáférhetőségi tanúsítvány. A technikai és szerkesztői ellenőrzés nem külső szaktanári lektorálás, nem tanulói hatásvizsgálat, és nem helyettesíti a valódi telefonon, más böngészőkben vagy képernyőolvasóval végzett próbát.

A következő pedagógiai ellenőrzésben a tanuló új példán magyarázza el a lépés indokát, nevezze meg a modellfeltételeket, és ellenőrizze az eredményt. A visszajelzések véglegesítéséhez a tényleges gondolatmenetet kell vizsgálni; azonos hibás végérték mögött többféle elakadás lehet.
