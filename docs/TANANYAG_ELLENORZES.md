# Tananyag-ellenőrzés — a négy alapozó út beépítése

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
