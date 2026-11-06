# Matek8 — Értsd is!

## Anyaggyűjtés és részletes fejlesztési terv

**Verzió:** 1.0  
**Kutatási dátum:** 2026. november 6., Europe/Budapest  
**Műfaj:** forrásokra épülő termék-, tananyag- és megvalósítási terv  
**Jelen fázis:** anyaggyűjtés és tervezés; a webalkalmazás fejlesztése még nem indult el.  
**Célkörnyezet:** magyar nyelvű, 8. osztályosoknak szóló, helyben fejleszthető tanulówebhely; később GitHub-repozitóriumba rendezhető.  
**Költségkeret:** 0 Ft új külső költség.  
**Fázishatár:** a felhasználó „tovább” jelzése indítja a lokális fejlesztést. GitHub-feltöltés és nyilvános közzététel külön későbbi felhatalmazást igényel.

> A terv központi célja: a tanuló tudja, **mit csinál, miért jogos a lépés, mikor használható a módszer, és hogyan ellenőrzi az eredményt**. A „minden diák értse meg” fejlesztési cél; a kész rendszer eredményességét valódi tanulói kipróbálásnak kell majd igazolnia.

## Tartalom

1. [Vezetői döntés és hatókör](#fejezet-01)
2. [Mit sikerült forrásból ellenőrizni?](#fejezet-02)
3. [Tantervi lefedettség és az anyag rétegei](#fejezet-03)
4. [A teljes modulrendszer](#fejezet-04)
5. [A 137 tervezett tanulási egység jegyzéke](#fejezet-05)
6. [Hogyan tanítson egy lecke?](#fejezet-06)
7. [Eredeti mintaleckék és magyarázott feladatok](#fejezet-07)
8. [Tévképzetek és célzott visszajelzés](#fejezet-08)
9. [A gyakorlórendszer](#fejezet-09)
10. [Interaktív műhelyek katalógusa](#fejezet-10)
11. [Tanulási utak és alkalmazkodás](#fejezet-11)
12. [Képernyők, navigáció és vizuális világ](#fejezet-12)
13. [Hozzáférhetőség és eltérő támogatási igények](#fejezet-13)
14. [Technikai terv](#fejezet-14)
15. [Tartalommodell és matematikai ellenőrzés](#fejezet-15)
16. [Minőségbiztosítás és tanulói kipróbálás](#fejezet-16)
17. [Fokozatos lokális megvalósítás](#fejezet-17)
18. [Atomi munkacsomagok és kész feltételek](#fejezet-18)
19. [Kockázatok, nyitott kérdések és döntési napló](#fejezet-19)
20. [Forrásjegyzék és felhasználási térkép](#fejezet-20)
21. [Következő körre átadható indítóutasítás](#fejezet-21)

---

<a id="fejezet-01"></a>

## 1. Vezetői döntés és hatókör

### 1.1. Milyen projektet érdemes építeni?

Egy magyar nyelvű **interaktív matematikaműhelyt**, amely a tanulást, az értelmezhető gyakorlást és az előismeretek pótlását kapcsolja össze. A tervezett működéshez a tanulónak ne kelljen fiók, előfizetés vagy AI-szolgáltatás. A felület számítógépen és telefonon is használható legyen; az alapanyag előzetes letöltés után internet nélkül is elérhetővé váljon.

A GitHub a későbbi forráskód, az eredeti tananyag, a tesztek és a dokumentáció rendezett helye lesz. A diák számára a kész tanulóoldal a termék. A jelen fájl ennek a kettőnek a tervét készíti elő.

**Öt alapígéret a kész rendszerhez:**

1. Minden fontos eljárás mellett érthető indok és megfelelő szemléltetés található.
2. Ha egy előismeret hiányzik, a tanuló rövid segítséget és célzott gyakorlást kap.
3. A hibához használható visszajelzés tartozik: melyik elképzelést érdemes újragondolni, és hogyan.
4. A tanuló tudását többféle feladaton és későbbi visszatéréskor is ellenőrizzük.
5. A lényegi tanulás a látványos elemek egyszerű, hozzáférhető változatával is elvégezhető.

### 1.2. Elsődleges felhasználók

| Felhasználói helyzet | Mire van szüksége? | Tervezett út |
|---|---|---|
| A tanuló korábbi alapokon akad el | Rövid diagnosztika, biztonságos visszalépés, kis lépések | „Rakjuk helyre az alapot” |
| Az órán tanult témát szeretné megérteni | Ismerős jelölések, képi magyarázat, teljes mintamegoldás | „Értsük meg ezt a témát” |
| Érti, de pontatlanul számol | Változatos, célzott gyakorlás és ellenőrzési rutin | „Gyakoroljuk be” |
| Jó tanuló, mélyebb összefüggéseket keres | Indoklás, több módszer, ellenpélda, alkotás | „Mi történik, ha…?” |
| Középiskolai felvételire készül | Vegyes témák, stratégia, opcionális időkeret | „Felvételi műhely” |
| Szülő vagy pedagógus segít | Rövid pedagógiai magyarázat, nyomtatható feladat és értékelési szempont | „Segítő nézet” |

Az elágazások között bármikor lehet váltani. A rendszer ne címkézze a gyereket „gyengének”, és egy rövid felmérés ne zárjon el tananyagot.

### 1.3. Várható terjedelem — tervszámok

| Elem | Első teljes változathoz tervezett nagyságrend | Mit jelent a szám? |
|---|---:|---|
| Modul | 24 | M00–M23; tanulási bevezetővel és összefoglalóval együtt |
| Rövid tanulási egység | 137 | Stabil azonosítóval leírt tanulási cél; nem 137 kész lecke |
| Interaktív műhely | 48 | I01–I48; a közös komponens több tananyagnál újrahasznosítható |
| Szerkesztett alapfeladat | Egységenként legalább 6, ahol értelmezhető | Megoldott példa, támasztott feladat, önálló feladat és indoklás együtt |
| Paraméterezhető feladatcsalád | Kezdetben 120–180 | Minden család ellenőrzött tartománnyal és magyarázattal |
| Témakörzáró | Matematikai modulonként legalább 1 | Új számokkal és legalább egy más helyzetű alkalmazással |
| Késleltetett visszatérési csomag | Minden alapvető készséghez | Korábbi segítség nélkül is kipróbálható tudás |

Ezek **tervezési célok**, nem kész tartalomra vonatkozó állítások. A feladatbank minőségét a lefedett gondolkodási műveletek, a magyarázat és az ellenőrzés adják; a számok cserélgetése önmagában nem teremt új megértési feladatot.

### 1.4. A teljes körűség értelmezése

A teljes projekt lefedi az általános iskolai lezáráshoz szükséges matematikai alapokat, a 7–8. évfolyampár releváns anyagát, a 8.-os tanításban előforduló bővítéseket és a felvételi jellegű összetett problémákat. A tantervi státuszt külön jelöljük; az egyes iskolák helyi tanmenete eltérhet.

A későbbi 1.0 változat csak akkor nevezhető teljesnek, ha a jóváhagyott lefedettségi mátrix minden alapcéljához tartozik magyarázat, gyakorlás, visszajelzés és ellenőrzött működés. A későbbre ütemezett bővítéseket láthatóan jelöljük.

---

<a id="fejezet-02"></a>

## 2. Mit sikerült forrásból ellenőrizni?

### 2.1. A forráskezelés rendje

Három külön feladatot választunk szét: **mi a követelmény**, **hogyan érdemes tanítani**, és **miből építhető meg a rendszer**. Egy tankönyv nem pedagógiai hatásvizsgálat; egy jól kinéző alkalmazás nem bizonyítja saját tanulási eredményességét; egy szabadon olvasható oldal pedig önmagában nem ad újraközlési engedélyt.

| Jelölés | Jelentés |
|---|---|
| ELLENŐRZÖTT | A releváns szöveg vagy a hivatalos dokumentum tartalma megnyílt. |
| RÉSZLEGES | Metaadat, indexelt hivatalos kivonat vagy közvetett intézményi adat ellenőrzött; a teljes állítás nem. |
| FELLELT, NEM ELLENŐRZÖTT | Valós forráshely/link azonosítható, de a szükséges tartalom nem volt olvasható. |
| TERVEZŐI DÖNTÉS | A projekt számára javasolt megoldás; nem forrásból átvett tény vagy kipróbált eredmény. |

A forrásjegyzék minden tételéhez szerepel a hozzáférés állapota és a projektben tervezett szerepe. A műszaki és licencadatokat az implementációkor újra ellenőrizni kell a ténylegesen kiválasztott verzióra.

### 2.2. Tantervi megállapítás

A megnyitott NAT-szöveg és a 2020-as tantárgyi útmutató alapján az általános iskolai célok és a 7–8. évfolyampár témái egymásra épülnek. A témaköri jelenlétből nem következik, hogy egy témának minden lehetséges részlete országosan kötelező nyolcadikos követelmény. A tanterv és a tankönyvi bővítés közti különbség különösen a formális algebra, a hatvány- és gyökszabályok, egyes transzformációk és testképletek esetében fontos. [TAN-01] [TAN-03]

A projekt ezért a gyakorlati megértéstől indul, és külön jelöli az erősebb formalizálást. Például a négyzetszámhoz tartozó oldalhossz megértése és a Pitagorasz-tétel használata nem igényli a gyökkifejezésekkel végzett összes algebrai műveletet.

### 2.3. Jelenlegi korlát

A teljes OH-kerettanterv letöltésének, a tankönyvi tanmenetek és a felvételi dokumentumok elérésének eredményét a forrásjegyzék részletezi. Az elérhetetlen dokumentumot nem tekintjük átolvasottnak. A modulrendszer ezért egy **széles lefedettségű saját tananyagterv**, amelynek finom évfolyam- és vizsgamegfeleltetése csak a szükséges eredeti dokumentumok ellenőrzése után zárható le.

Ez a helyi tanulófelület alapjainak későbbi elkészítését nem akadályozza. Az „országos követelménynek teljesen megfelel” és az „aktuális felvételi pontos mása” minősítést viszont csak igazolt lefedettség után lehet használni.

---

<a id="fejezet-03"></a>

## 3. Tantervi lefedettség és az anyag rétegei

### 3.1. Öt tartalomcímke

| Címke | Szerep | Példa |
|---|---|---|
| **ALAP** | Korábbi évfolyamból szükséges előismeret | Tört jelentése; műveleti sorrend; mértékegységek |
| **TÖRZS** | A 7–8. évfolyampár tantervi témájához kapcsolódó cél | Egyszerű egyenletes modell; Pitagorasz alkalmazása; adatok értelmezése |
| **BŐVÍTÉS** | Tankönyvben/helyi tanításban előforduló mélyítés | Hatványazonosságok; formális egyenlőtlenség-megoldás; hengerképlet |
| **FELVÉTELI** | Több alapot összekapcsoló feladathelyzet | Táblázatból következtetés, esetek rendszerezése, összetett szöveges feladat |
| **KITEKINTÉS** | Érdeklődőknek ajánlott további gondolat | Nem egyértelmű sorozatfolytatás; más bizonyítás; matematikai modell korlátja |

Egy lecke több címkét kaphat. A címkék nem nehézségi rangsort jelentenek. Az elemi kombinatorikai feladat lehet gondolkodtató, egy formális bővítés pedig lehet rövid.

**Ellenőrzési szabály:** a TÖRZS címke mellé a tartalomszerkesztő rögzítse a konkrét tantervi kapcsolódást és annak ellenőrzési állapotát. A most javasolt címkékből még nem készül automatikus megfelelőségi tanúsítvány.

### 3.2. Előismereti kapcsolatok

| Cél | Szükséges előismeret | Rövid visszalépés |
|---|---|---|
| Törtes egyenlet | Törtműveletek, zárójel, egyenlőség | Az elakadt művelet egyetlen szemléltetett példája |
| Százalékos változás | Arány, tört/tizedes szám, az egész azonosítása | „Minek a 100%-a?” feladat |
| Pitagorasz | Derékszög, négyzet területe, négyzetgyök szemlélete | Oldalak és négyzetek párosítása |
| Hasáb térfogata | Alapterület, magasság, terület/térfogat-egység | Egységkockákból építés |
| Grafikon értelmezése | Koordináta, tengelyskála, mennyiség | Táblázat egy sorának ábrázolása |
| Valószínűség | Lehetséges esetek, törtek, arány | Teljes kimeneteltábla kis példán |
| Átlag | Összeg, darabszám, osztás | Kockák egyenletes szétosztása |
| Hasonlóság | Arány és hosszúság | Ugyanazon alakzat 1:2 nagyítása rácson |

A tanuló a visszalépés után az eredeti feladathoz tér vissza. A rendszer jegyezze meg, hol akadt el, de ne kényszerítsen végig egy teljes korábbi fejezetet.

### 3.3. A felvételi külön útvonal

A 8. tanév végi teljes anyag és a tanév közben esedékes felvételi felkészülés eltérő felhasználói cél. A felvételi útvonal ezért saját, a hivatalos követelményhez és feladatlapokhoz ellenőrzött témalistát kapjon. A teljes éves tananyag elsajátítása ne legyen feltétele a felvételi gyakorlás megnyitásának.

A hivatalos korábbi feladatlapok elsősorban **hivatkozott hiteles források és feladattípus-ellenőrzési pontok**. A saját gyakorlóbank eredeti feladatokat tartalmazzon. A vizsgabeállítások — idő, pontozás, segédeszközök — évhez kötött ellenőrzött konfigurációból származzanak. Amíg ez nincs kész, az üzemmód neve „vegyes időzített gyakorlás” legyen.

---

<a id="fejezet-04"></a>

## 4. A teljes modulrendszer

A következő bontás saját pedagógiai és fejlesztési szerkezet. A sorrend tanulási javaslat; a tanuló és a segítő témák szerint is navigálhat.

| ID | Modul | Egység | Központi „miért?” | Ellenőrizhető kimenet |
|---|---|---:|---|---|
| M00 | Hogyan tanuljunk és ellenőrizzünk? | 3 | Honnan tudom, hogy értem? | Becslés, megoldás és ellenőrzés megkülönböztetése |
| M01 | Számok jelentése és helye | 6 | Mit jelent egy szám, és mennyit ér? | Számegyenesen és több alakban azonosítja |
| M02 | Törtek érthetően | 8 | Miért ugyanaz a szám többféle tört? | Műveletet modellből magyaráz és önállóan számol |
| M03 | Biztos számolás, előjelek, becslés | 6 | Mit változtat a művelet és a zárójel? | Műveleti sorrenddel, előjellel és nagyságrenddel ellenőriz |
| M04 | Oszthatóság és számok szerkezete | 5 | Hogyan épül fel egy egész szám? | Tényezőket használ gyakorlati döntéshez |
| M05 | Arányok és arányosság | 7 | Mi marad változatlan két mennyiség között? | Megkülönbözteti az egyenes, fordított és nem arányos kapcsolatot |
| M06 | Százalék a hétköznapokban | 6 | Mindig minek a százalékáról beszélünk? | Részt, alapot és változást is meghatároz |
| M07 | Hatványok és nagyságrend | 5 | Miért rövidíti a hatvány az ismételt szorzást? | Jelölést értelmez, becsül, a bővítést felismeri |
| M08 | Négyzetgyök és számközelítés | 4 | Mekkora oldalhoz tartozik az adott négyzetterület? | Négyzetszámok és közelítő gyökértékek értelmezése |
| M09 | Betűs kifejezések | 7 | Mit őriz meg az átalakítás? | Azonos értékű kifejezéseket indokol és különböztet meg |
| M10 | Egyenletek és mérlegelv | 8 | Miért marad igaz az egyenlőség? | Megoldást vezet le és visszahelyettesítéssel ellenőriz |
| M11 | Relációk és egyenlőtlenségek | 3 | Egy számot vagy számok tartományát keresem? | Konkrét összehasonlítás és külön jelölt formális bővítés |
| M12 | Szövegből matematikai modell | 7 | Mit jelöl az ismeretlen, és mit állít a szöveg? | Rajzot, táblázatot vagy egyenletet választ és értelmez |
| M13 | Koordináták, összefüggések, grafikonok | 7 | Ugyanazt mondja-e a történet, a táblázat és a grafikon? | Átvált reprezentációk között, értelmezi a tengelyeket |
| M14 | Sorozatok és szabályok | 4 | Honnan tudom, hogy a szabályom megfelelő? | Szabályt fogalmaz, alkalmaz és megkülönböztet a puszta tippeléstől |
| M15 | Logika, halmazok, kombinatorika, gráfok | 6 | Biztosan minden esetet számba vettem? | Rendszerez, ellenpéldát keres, egyszerű hálózatot értelmez |
| M16 | Síkgeometria és terület | 8 | Mi változik és mi marad az alakzat átalakításakor? | Tulajdonságot, kerületet és területet külön kezel |
| M17 | Transzformációk és szerkesztések | 6 | Miért éppen ez a pont vagy alakzat a kép? | Követi és indokolja a transzformáció vagy szerkesztés lépéseit |
| M18 | Pitagorasz és térbeli alkalmazásai | 5 | Miért négyzetek területei szerepelnek? | Felismeri a derékszög feltételét és a keresett oldalt |
| M19 | Testek, nézetek, felszín és térfogat | 7 | Mit mér a burkolat és mit a belső tér? | Nézetet/hálót kapcsol testhez, számol megfelelő egységgel |
| M20 | Mérés és mértékegységek | 5 | Miért más a hossz-, terület- és térfogatváltás? | Mennyiséget és mértékegységet együtt ellenőriz |
| M21 | Statisztika és adatok | 5 | Mit mutat és mit rejt el egy összefoglaló szám? | Átlagot és diagramot értelmez; adatból óvatosan következtet |
| M22 | Véletlen és valószínűség | 5 | Mi várható sok kísérletben, és mit nem garantál? | Kimeneteket, gyakoriságot és esélyt megkülönböztet |
| M23 | Összekapcsolás és önálló problémák | 4 | Melyik eszköz illik ehhez a helyzethez? | Önállóan választ stratégiát és elmagyarázza a döntését |
| **Összesen** | **24 modul** | **137** | | |

Az ALAP/TÖRZS/BŐVÍTÉS jelölést egységszinten kell rögzíteni. Különösen M07–M11, M13, M16–M19 tartalmazhat egyszerre alapvető és bővítő elemeket. A címkézés nem egy teljes modul egyetlen címkével történő elintézése.

---

<a id="fejezet-05"></a>

## 5. A 137 tervezett tanulási egység jegyzéke

Az azonosítók később a leckék, feladatok, interakciók és tesztek közös kapcsolópontjai. Egy egység egyetlen fő tanulási célt kapjon. A zárójelben jelzett bővítések ne kerüljenek automatikusan a kötelező útvonalra.

### M00 — Tanulási és ellenőrzési rutin, 3 egység

- **M00.01:** Becslés, pontos eredmény és indoklás megkülönböztetése.
- **M00.02:** Előismeretek rövid feltérképezése és segítség választása.
- **M00.03:** Saját megoldás ellenőrzése: helyettesítés, másik módszer, nagyságrend.

### M01 — Számok jelentése, 6 egység

- **M01.01:** Természetes, egész és racionális számok konkrét példákon.
- **M01.02:** Pozitív és negatív számok helye a számegyenesen.
- **M01.03:** Ellentett és abszolút érték mint irány és távolság.
- **M01.04:** Tört, tizedes és százalékos alak összekapcsolása.
- **M01.05:** Összehasonlítás, közbeeső számok és sűrűség szemléletesen.
- **M01.06:** Véges és szakaszos tizedes alak; az irracionalitás előkészítése.

### M02 — Törtek, 8 egység

- **M02.01:** Az egész rögzítése, egyenlő részek, egységtört.
- **M02.02:** Tört mint szám, hányados és részmennyiség.
- **M02.03:** Bővítés és egyszerűsítés változatlan értékkel.
- **M02.04:** Törtek összehasonlítása közös egység segítségével.
- **M02.05:** Törtek összeadása és kivonása.
- **M02.06:** Törttel szorzás mint egy mennyiség részének vétele.
- **M02.07:** Törttel osztás mint annak kérdése, hány rész fér bele.
- **M02.08:** Vegyes törtes műveletek, becslés és értelmezett szöveges alkalmazás.

### M03 — Műveletek és becslés, 6 egység

- **M03.01:** Összeadás és kivonás előjeles számokkal.
- **M03.02:** Szorzás és osztás előjeles számokkal.
- **M03.03:** Zárójelek és műveleti sorrend követése.
- **M03.04:** Tizedes számok műveletei és helyi érték.
- **M03.05:** Kerekítés, közelítés és ésszerű pontosság.
- **M03.06:** Fejszámolási átalakítás, ellenőrzés és számológép-használat különbsége.

### M04 — Számelmélet, 5 egység

- **M04.01:** Osztó és többszörös gyakorlati értelmezése.
- **M04.02:** Oszthatósági szabályok mögötti helyiérték-gondolat.
- **M04.03:** Prím és összetett szám, prímtényezős felbontás.
- **M04.04:** Közös osztó és legnagyobb közös osztó felhasználása.
- **M04.05:** Közös többszörös és legkisebb közös többszörös felhasználása.

### M05 — Arányosság, 7 egység

- **M05.01:** Arány jelentése és az összehasonlított mennyiségek.
- **M05.02:** Egységre jutó mennyiség és aránytáblázat.
- **M05.03:** Egyenes arányosság felismerése és indoklása.
- **M05.04:** Fordított arányosság konkrét helyzetekben.
- **M05.05:** Arányosnak látszó, de nem arányos kapcsolat felismerése.
- **M05.06:** Arányos osztás és keverési arány.
- **M05.07:** Méretarány, térkép és tervrajz értelmezése.

### M06 — Százalék, 6 egység

- **M06.01:** Századrész, százalékláb, alap és érték kapcsolata.
- **M06.02:** Egy mennyiség adott százalékának meghatározása.
- **M06.03:** Az egész visszakeresése adott százalékos részből.
- **M06.04:** Annak meghatározása, hány százalékot képvisel egy rész.
- **M06.05:** Növekedés, csökkenés és megváltozott százalékalap.
- **M06.06:** Egyszerű pénzügyi összehasonlítás és százalékpont (utóbbi bővítés).

### M07 — Hatványok, 5 egység

- **M07.01:** Pozitív egész alap és kitevő mint ismételt szorzás.
- **M07.02:** Négyzetszámok, köbszámok és geometriai jelentés.
- **M07.03:** Tíz hatványai és helyi érték; normálalak külön jelölve.
- **M07.04:** Hatványazonosságok indoklása (bővítés).
- **M07.05:** Nulla/negatív kitevő és negatív alap (bővítés, külön feltételekkel).

### M08 — Négyzetgyök, 4 egység

- **M08.01:** Négyzetterületből oldalhossz visszakeresése.
- **M08.02:** Négyzetszámok gyöke; a gyökjel és négyzetes egyenlet összevetése külön bővítésként.
- **M08.03:** Nem négyzetszám gyökének becslése és közelítő értéke.
- **M08.04:** Irracionális szám szemlélete; a gyökműveletek határai (bővítés).

### M09 — Betűs kifejezések, 7 egység

- **M09.01:** Betű mint változó és mennyiség jelölése.
- **M09.02:** Helyettesítési érték és az értelmezett egység.
- **M09.03:** Együttható, tag és egynemű tagok összevonása.
- **M09.04:** Szorzás összeggel: területmodell és disztributivitás.
- **M09.05:** Mínuszjel a zárójel előtt.
- **M09.06:** Közös tényező kiemelése mint visszafelé bontás.
- **M09.07:** Két többtagú kifejezés szorzása, nevezetes minták (bővítés).

### M10 — Egyenletek, 8 egység

- **M10.01:** Egyenlőség mint két érték kapcsolata.
- **M10.02:** Megoldás jelentése és próbálgatás.
- **M10.03:** Mindkét oldalon végzett összeadás/kivonás.
- **M10.04:** Mindkét oldalon ugyanazzal a nem nulla számmal végzett szorzás/osztás és a visszafordíthatóság.
- **M10.05:** Többlépéses elsőfokú egyenlet.
- **M10.06:** Zárójeles és egyszerű törtes egyenlet.
- **M10.07:** Ismeretlen mindkét oldalon; ellentmondás vagy minden megengedett értékre igaz állítás felismerése külön mélyítésként.
- **M10.08:** Visszahelyettesítés, szövegbeli ellenőrzés, megoldási út összehasonlítása.

### M11 — Relációk, 3 egység

- **M11.01:** Nagyobb, kisebb, legfeljebb, legalább és megengedett értékek.
- **M11.02:** Egyszerű egyenlőtlenség és számegyenes (formális rész bővítés).
- **M11.03:** Negatív számmal szorzáskor megforduló reláció indoklása (bővítés).

### M12 — Szöveges feladatok, 7 egység

- **M12.01:** Adat, kérdés, feltétel és felesleges adat megkülönböztetése.
- **M12.02:** Ismeretlen és mértékegység megválasztása.
- **M12.03:** Szakaszábra, táblázat, próbálgatás vagy egyenlet választása.
- **M12.04:** Részek, összegek, különbségek és életkorhelyzetek modellezése.
- **M12.05:** Árak, kedvezmények és egyszerű költségtervek.
- **M12.06:** Út, idő, sebesség és más állandó ütemű folyamatok modellfeltételei.
- **M12.07:** Hiányos, ellentmondó vagy többféleképpen értelmezhető feladat.

### M13 — Grafikonok, 7 egység

- **M13.01:** Koordinátarendszer és rendezett koordinátapár.
- **M13.02:** Tengelyfelirat, egység, skála és leolvasás.
- **M13.03:** Hozzárendelés táblázata és egyszerű szabálya.
- **M13.04:** Egyenes arányosság grafikonja.
- **M13.05:** Növekedés, csökkenés és változás értelmezése.
- **M13.06:** Alapdíjas lineáris kapcsolat; meredekség/metszet fogalma külön jelölve.
- **M13.07:** Fordított arányosság, szakaszonkénti helyzet és grafikonból történet.

### M14 — Sorozatok, 4 egység

- **M14.01:** Számsorozat és alakzatminta felismerése.
- **M14.02:** Következő tag meghatározása megadott szabállyal.
- **M14.03:** Pozíció és érték kapcsolata egyszerű mintában.
- **M14.04:** Több lehetséges szabály; a véges adatsor nem mindig dönt egyértelműen.

### M15 — Logika és rendszerezés, 6 egység

- **M15.01:** Elem és részhalmaz; metszet, unió és komplementer értelmezett alaphalmazon.
- **M15.02:** Állítás, tagadás, „minden” és „van olyan”.
- **M15.03:** Ellenpélda és néhány példa bizonyító erejének különbsége.
- **M15.04:** Rendszerezett felsorolás és egyszerű faábra.
- **M15.05:** Számít-e a sorrend; ismétlés és esetek kihagyásának ellenőrzése.
- **M15.06:** Kapcsolati gráfok és utak; a skatulyaelv külön kitekintő feladat.

### M16 — Síkgeometria, 8 egység

- **M16.01:** Pont, egyenes, félegyenes, szakasz, távolság, szög és kör részei.
- **M16.02:** Szögek kapcsolatai és szögmérés.
- **M16.03:** Háromszög-egyenlőtlenség, szögösszeg, külső szög és szerkeszthetőség.
- **M16.04:** Négyszögek osztályozása; belső/külső szögek, konvex és konkáv alakzatok.
- **M16.05:** Kerület és terület különbsége.
- **M16.06:** Téglalap, háromszög és paralelogramma területe átdarabolással.
- **M16.07:** Trapéz, deltoid, rombusz és összetett síkidom területe felbontással és ismert részterületekkel.
- **M16.08:** Kör kerülete és területe szemléletesen (képletalkalmazás bővítésként).

### M17 — Transzformációk, 6 egység

- **M17.01:** Tengelyes tükrözés és megmaradó tulajdonságok.
- **M17.02:** Középpontos tükrözés konkrét pontokkal.
- **M17.03:** Eltolás és forgatás szemlélete, formális rész bővítésként.
- **M17.04:** Szimmetria és egybevágó alakzatok felismerése.
- **M17.05:** Kicsinyítés, nagyítás; hossz/terület/térfogat aránya külön mélységi címkével.
- **M17.06:** Szakaszfelező merőleges, szögfelező, merőleges/párhuzamos egyenes, szögmásolás és indoklás.

### M18 — Pitagorasz, 5 egység

- **M18.01:** Befogók, átfogó és a derékszög feltétele.
- **M18.02:** Négyzetterületek összeillesztése és a tétel gondolata.
- **M18.03:** Hiányzó átfogó vagy befogó kiszámítása.
- **M18.04:** Téglalap átlója, távolság és egyszerű térbeli alkalmazás.
- **M18.05:** A tétel alkalmazhatóságának ellenőrzése; megfordítás külön jelölve.

### M19 — Térgeometria, 7 egység

- **M19.01:** Testek, lapok, élek, csúcsok, lapátló és testátló.
- **M19.02:** Elöl-, oldal- és felülnézet; részleges információ.
- **M19.03:** Kocka, téglatest, hasáb és gúla hálója, térbeli összehajtás.
- **M19.04:** Felszín mint külső felületek összege.
- **M19.05:** Térfogat mint egységkockák száma és rétegek összege.
- **M19.06:** Hasábok és összetett testek alkalmazásai.
- **M19.07:** Gúla és gömb tulajdonságai; henger, kúp és további testképletek elkülönített bővítésként.

### M20 — Mérés, 5 egység

- **M20.01:** Mérőszám, egység és valóságos nagyság.
- **M20.02:** Hosszúság, tömeg és idő átváltása.
- **M20.03:** Terület- és térfogatváltás négyzetes/köbös oka.
- **M20.04:** Űrtartalom és térfogat kapcsolata.
- **M20.05:** Mérési pontosság, becslés és összetett egységek.

### M21 — Statisztika, 5 egység

- **M21.01:** Adatgyűjtés, rendezés és gyakorisági táblázat.
- **M21.02:** Oszlop-, vonal- és kördiagram olvasása a megfelelő helyzetben.
- **M21.03:** Átlag mint egyenletes szétosztás és egyensúly.
- **M21.04:** Medián és módusz meghatározása és összehasonlítása az átlaggal; terjedelem kiegészítésként.
- **M21.05:** Kiugró adat, megtévesztő tengely és a mintából való következtetés korlátja.

### M22 — Valószínűség, 5 egység

- **M22.01:** Biztos, lehetséges, lehetetlen és az esemény pontos leírása.
- **M22.02:** Kimenetek teljes felsorolása és azonos esély feltétele.
- **M22.03:** Kedvező/összes eset egyszerű egyenlő esélyű példában.
- **M22.04:** Kísérlet, relatív gyakoriság és ismétlés.
- **M22.05:** Független események szemlélete; az előző eredmények nem teremtenek kötelező kiegyenlítődést.

### M23 — Összekapcsolás, 4 egység

- **M23.01:** Vegyes feladatok és módszerválasztás fejezetcím nélkül.
- **M23.02:** Önálló mini projekt: tervrajz, költség, adat vagy játék.
- **M23.03:** Felvételi jellegű feladatsor és megoldási stratégia.
- **M23.04:** Év végi tudástérkép, késleltetett ismétlés és további célok.

---

<a id="fejezet-06"></a>

## 6. Hogyan tanítson egy lecke?

### 6.1. A lecke tanulási menete

| Lépés | Diákcselekvés | A rendszer feladata | Mi jelzi a megértést? |
|---|---|---|---|
| 1. Kérdés | Elolvas egy rövid, értelmes problémát | Egyetlen fő célt mutat, szakkifejezések nélkül is érthetően | A diák el tudja mondani, mit keres |
| 2. Előrejelzés | Becsül, választ vagy rajzol | Eltárolja a tippet, nem minősít képességet | Van kiinduló elképzelés |
| 3. Kipróbálás | Változtat egy modellen | A kapcsolódó mennyiségeket együtt frissíti | A diák észreveszi, mi marad változatlan |
| 4. Megfogalmazás | Kiválaszt vagy kiegészít egy magyarázatot | Rákérdez az összefüggésre | A látványt szavakkal össze tudja kötni |
| 5. Jelölés | Az ábrát képlethez kapcsolja | Megmutatja, melyik jel melyik elemnek felel meg | Nem csak lemásolja a képletet |
| 6. Megoldott példa | Lépésenként követ és előre tippel | Minden lépésnél indokot ad | A következő lépést meg tudja indokolni |
| 7. Fokozatos önállóság | Előbb hiányzó lépést, majd egész feladatot old | Csökkenti a támaszt a diák választása és teljesítménye szerint | Segítség nélkül is megfelelő lépést választ |
| 8. Új helyzet | Más szövegben/ábrán használja a módszert | Nem írja elő a fejezet nevével a stratégiát | Felismeri, mikor használható |
| 9. Visszatekintés | Megnevezi az ötletet és az ellenőrzést | Rövid összegzést és későbbi visszatérést kínál | Később is felidézi és alkalmazza |

A konkrét–képi–szimbolikus kapcsolatok, a reprezentációk célzott használata, a problémamegoldás és a megoldások magyarázata illeszkedik az EEF és IES/WWC útmutatókhoz. A fenti kilenclépéses felület és sorrend saját tervezői javaslat, amelyet a pilotban egyszerűsíteni kell, ha túl hosszúnak bizonyul. [PED-01] [PED-02] [PED-03]

### 6.2. Mi számít jó magyarázatnak?

A magyarázat nevezze meg a **mennyiséget**, a **kapcsolatot**, a **megengedett műveletet** és az **érvényességi feltételt**. A szöveg a tanuló előismeretéhez igazodjon, de a matematikai tartalom maradjon pontos.

| Rövid, de kevés magyarázat | A projektben elvárt értelmezés |
|---|---|
| „Átvisszük a másik oldalra.” | „Mindkét oldalból kivonunk ugyanannyit, ezért az egyenlőség megmarad.” |
| „Közös nevezőre hozzuk.” | „Azonos méretű részeket készítünk, hogy ugyanazt az egységet számoljuk.” |
| „A második törtet megfordítjuk.” | „Azt keressük, hány osztónyi rész fér a mennyiségbe; ebből következik a reciprokos szorzás.” |
| „Behelyettesítünk a képletbe.” | „Előbb azonosítjuk, melyik adat melyik mennyiség, és ellenőrizzük a feltételeket.” |
| „A százalékot kiszámoljuk.” | „Megjelöljük, mi a 100%, és ehhez viszonyítunk.” |
| „A grafikon emelkedik.” | „Az x növekedésével y nő; megvizsgáljuk az egységeket és a növekedés ütemét.” |

### 6.3. Rövidség és mélység együtt

Az alapnézetben egy lépéshez egy rövid magyarázat tartozzon. Három választható mélység segítse a tanulót: **„Mutasd egy példán”**, **„Mutasd ábrával”**, **„Miért igaz általában?”**. Ezek párhuzamos hozzáférési utak; nem tanulótípusokhoz rendelt kategóriák.

Egy képernyőnek egy fő feladata legyen. A definíció, az ábra és a hozzá tartozó művelet egymás közelében jelenjen meg. A tanuló szabályozhassa a tempót; a mozgás megállítható és kikapcsolható legyen.

### 6.4. A segítség lépcsői

1. **H1 — irány:** kérdés az alapötletről, a megoldás felfedése nélkül.
2. **H2 — reprezentáció:** ábra, táblázat vagy releváns egyszerű példa.
3. **H3 — következő lépés:** egy indokolt művelet, utána ismét a diák következik.
4. **H4 — teljes levezetés:** lépésenként nyitható megoldás és ellenőrzés.

A teljes megoldás megnézése után új, közeli feladat következzen. A segítséggel teljesített feladatot a rendszer külön kezelje az önálló teljesítéstől, miközben a segítségkérést ne büntesse.

### 6.5. Mit mondhat a visszajelzés?

„A választott művelet jó irány. A két tört nevezője eltér, ezért most még különböző méretű részeket adtál össze. Mutassuk mindkettőt tizenkettedekben.”

„Az eredményed megfelel az egyenletnek. Most nézd meg a szöveget is: a keresett mennyiség darabszám, így a negatív érték ebben a történetben nem lehet megoldás.”

„Ebből az egy válaszból még nem derül ki, hol akadtál el. Válassz: a szöveg értelmezéséhez, az első lépéshez vagy a számoláshoz kérsz segítséget?”

Az utolsó típus fontos: a rendszer csak akkor nevezzen meg konkrét tévképzetet, ha a feladatban megfigyelhető lépés azt alátámasztja. Ugyanaz a hibás végeredmény többféleképpen is létrejöhet.

### 6.6. A tartalomszerkesztés finom ellenőrzőpontjai

A 137 egység kibontásakor külön ellenőrizendő: elem és részhalmaz; állítás és megfordítás; két pont távolsága és pont–egyenes távolság; merőleges magasság; a négyszögek befoglalási kapcsolatai; gúlaháló; lapátló és testátló; páros elemszámú medián; több leggyakoribb érték; szerepek és sorrend a kombinatorikában. A négyszögek között a trapéz, paralelogramma, téglalap, deltoid, rombusz, húrtrapéz és négyzet is név szerint szerepeljen. A választott trapézdefiníció legyen következetes.

Az alapozó kitérők kiterjedhetnek a római számjelek hétköznapi olvasására és a tízes helyiérték-rendszer működésére. A más alapú számrendszer külön kitekintés. A törtekkel végzett fizikai kimérés kezdetben pozitív mennyiségekre vonatkozik; az előjeles általánosítást a szorzás–osztás kapcsolata alapozza meg.

---

<a id="fejezet-07"></a>

## 7. Eredeti mintaleckék és magyarázott feladatok

Az alábbi példák a projekthez most összeállított tanítási minták. Nem átvett tankönyvi feladatok, és nem már működő alkalmazásképernyők. A teljes feladatbank stílusát és ellenőrizhetőségét mutatják.

### 7.1. Miért kell közös nevező? — M02.05

**Kérdés:** Egy ugyanolyan méretű egészből előbb a kétharmadát, majd egy másik ugyanilyen egészből az egynegyedét vesszük. Összesen hány egésznyi mennyiséget kaptunk?

**Előrejelzés:** A válasz nagyobb legyen kétharmadnál, hiszen hozzáadunk egy pozitív részt. Kisebb legyen egynél, mert a hiányzó egyharmad nagyobb egynegyednél.

**Interakció:** Két azonos hosszúságú szalagot jelenítünk meg. Az egyik harmadokra, a másik negyedekre van osztva. A diák finomíthatja a felosztást, miközben a szalagok hossza és a kijelölt mennyiség változatlan marad. Mindkettő tizenkettedekre osztva összehasonlítható.

**Levezetés:**

\[
\frac{2}{3}+\frac{1}{4}=\frac{8}{12}+\frac{3}{12}=\frac{11}{12}.
\]

A nevező megmutatja, hány egyenlő részre osztottuk az egészet; ebből adódik egy részegység mérete. A számláló azt mutatja, hány ilyen részt veszünk. Nyolc tizenkettedhez három tizenkettedet adunk. Az összeadás közben a részek mérete nem változik meg.

**Hibaválaszra:** Ha a válasz `3/7`, a rendszer először ezt kérdezze: „Lehet-e az összeg kisebb a kétharmadnál, ha pozitív mennyiséget adtunk hozzá?” Ezután nyíljon meg a közös egységű ábra.

**Gyakorlás:** `1/2 + 1/3 = 5/6`; majd adott ábráról írjon a diák összeadást. A második feladatban már ne szerepeljen előre a „közös nevező” kifejezés.

**Kilépési feltétel:** a tanuló a számolás mellett meg tudja választani azt a magyarázatot, hogy azonos méretű részek darabszámait adjuk össze. A tanuló saját szavas indoklását önellenőrző szempontlista támogatja.

### 7.2. Miért lehet nagyobb az osztás eredménye? — M02.07

**Kérdés:** Egy háromnegyed méteres szalagból hány egynyolcad méteres darab vágható?

Háromnegyed méter hat nyolcad méter. Hat darab egynyolcad fér bele, így:

\[
\frac{3}{4}:\frac{1}{8}=6.
\]

A `6` a darabok száma; a kiinduló `3/4` egy méterben kifejezett hossz. A művelet értelmezése nélkül nem helyes pusztán azt mondani, hogy „az osztás nagyobbá tette a szalagot”.

**Interakció:** A diák gombnyomással vagy húzással egynyolcad hosszúságú darabokat helyez a szalag mellé. A modell rögzíti az egységet, és a hatodik darab után pontosan lefedi a kijelölt hosszt.

**Átvezetés a szabályhoz:** Az egész méterben nyolc ilyen darab van; ennek háromnegyede `8 · 3/4 = 6`. Innen érthető a reciprokos szorzás ebben a helyzetben. A tágabb szabályt több mintával és megfelelő feltételekkel építjük tovább.

**Új helyzet:** `3/4 : 1/2 = 3/2`. A háromnegyed méteres szalag másfélszer akkora, mint a félméteres mérőegység. Ha egész félméteres darabokat vágunk, egy teljes darabot kapunk, és egynegyed méter marad. A méretek hányadosa és az egész darabok száma eltérő kérdés.

### 7.3. Miért szabad mindkét oldalon ugyanazt tenni? — M10.05

**Feladat:** `3(x + 2) = 21`.

**Értelmezés:** Három egyforma csomag együtt 21 egységet ér; egy csomagban az ismeretlen mennyiség és még két egység található.

| Lépés | A út: először osztunk | B út: először felbontunk |
|---|---|---|
| Kiindulás | `3(x + 2) = 21` | `3(x + 2) = 21` |
| Első lépés | Mindkét oldalt 3-mal osztva: `x + 2 = 7` | Három csomag értéke: `3x + 6 = 21` |
| Második lépés | Mindkét oldalból 2-t kivonva: `x = 5` | Mindkét oldalból 6-ot kivonva: `3x = 15` |
| Harmadik lépés | Visszahelyettesítés | Mindkét oldalt 3-mal osztva: `x = 5` |
| Ellenőrzés | `3 · (5 + 2) = 21` | Ugyanaz az ellenőrzés |

Mindkét út jó. Az itt használt egyenletműveletek visszafordíthatók: ugyanannak a számnak a hozzáadása vagy kivonása, illetve nem nulla számmal szorzás vagy osztás. Ezért marad ugyanaz a megoldáshalmaz. A rendszer a választott út érvényességét ellenőrizze, és megmutathatja, melyik jár kevesebb lépéssel.

**Hibakeresés:** `3(x + 2) = 3x + 2` miért nem helyes? Három csomag mindegyikében van két plusz egység, tehát összesen hatot kapunk. A vizuális kiemelés ezt a megfelelést mutassa.

**Modellkorlát:** A valódi mérleg pozitív tömegeket szemléltet. Negatív értékeknél a rendszer áttér előjeles lapkákra és a szimbolikus egyenlőségre; ne találjon ki magyarázat nélkül „negatív súlyú tárgyat”.

**Új feladat:** `4(x − 1) = 20`; megoldás `x = 6`. A tanuló előbb válasszon stratégiát, majd ellenőrizzen.

### 7.4. Miért nem oltja ki egymást a −20% és a +20%? — M06.05

**Feladat:** Egy kitalált termék ára 10 000 Ft. Előbb 20%-kal csökken, majd az új árat 20%-kal megemelik. Mennyi lesz?

| Állapot | Mi a 100%? | Változás | Új ár |
|---|---:|---:|---:|
| Csökkentés | 10 000 Ft | −2 000 Ft | 8 000 Ft |
| Emelés | 8 000 Ft | +1 600 Ft | 9 600 Ft |

A két százalék eltérő alapra vonatkozik. Ugyanez szorzókkal: `10 000 · 0,8 · 1,2 = 9 600`. A végeredmény 400 Ft-tal, az eredeti ár 4%-ával alacsonyabb.

**Interakció:** A diák külön csúszkával módosítja a két százalékot. A felület minden lépésben kiírja az aktuális alapot és a változás forintértékét. A szöveg legyen szerkeszthető számmezőkkel is használható.

**Fordított kérdés:** A 8 000 Ft-os árat hány százalékkal kell emelni, hogy ismét 10 000 Ft legyen? A szükséges 2 000 Ft a 8 000 Ft negyede, tehát **25%**.

**Ellenőrzés:** Az új feladat már kedvezményes árból kéri az eredetit. Ez további információt ad arról, hogyan azonosítja a tanuló az alapot; a választ rövid indoklás egészítse ki.

### 7.5. Mit jelent a Pitagorasz-tétel? — M18.02–M18.03

**Feladat:** Egy derékszögű háromszög két befogója 6 cm és 8 cm. Mekkora az átfogó?

**Első kérdés:** Melyik oldal van a derékszöggel szemben? A rajz elforgatható, hogy az „átfogó” ne egy megszokott képi irányhoz kapcsolódjon.

**Interakció:** Az oldalakra emelt négyzetek területe külön megjelenik. Egy előre ellenőrzött átdarabolás azonos területű nagy keretekben ugyanazokat a háromszögeket rendezi át. A megmaradó részek területe egyszer `a² + b²`, másszor `c²`. A mozgatás után a diák a területmegmaradás indokát is megfogalmazza.

\[
c^2=6^2+8^2=36+64=100,\qquad c=10\text{ cm}.
\]

**Miért nem `6 + 8`?** Az összefüggés a négyzetek területét kapcsolja össze. Előbb a keresett négyzet területe adódik, majd ebből keressük az oldalhosszt.

**Új feladat:** Az átfogó 13 cm, az egyik befogó 5 cm. A másik befogó négyzete `169 − 25 = 144`, ezért a hossza 12 cm. A tanuló dönti el, hogy most összeadásra vagy kivonásra van szükség.

**Alkalmazhatóság:** Egy 6, 8, 9 oldalú háromszög nem derékszögű. Attól, hogy három oldal szerepel a feladatban, a tétel még nem használható derékszögű számításként. A bővítő útvonal a megfordítást is tárgyalja.

### 7.6. Mikor nem egyenes arányosság egy egyenes? — M13.06

**Kitalált modell:** Egy szolgáltatás díja 1 200 Ft alapdíj és kilométerenként 300 Ft: `y = 1200 + 300x`, ahol `x ≥ 0`. A díjszabás szemléltető példa, nem aktuális piaci ár.

| Megtett út | Teljes díj |
|---:|---:|
| 0 km | 1 200 Ft |
| 2 km | 1 800 Ft |
| 4 km | 2 400 Ft |

**Megfigyelés:** Kétszer akkora út nem ad kétszer akkora teljes díjat. Minden új kilométer ugyanannyi többletdíjat jelent, de a teljes díj és az út aránya nem állandó. Az `y/x` arányt csak pozitív úthossznál hasonlítjuk össze; 0 km-nél ez nem értelmezett.

**Interakció:** Az alapdíj külön kapcsolható nullára. A történet, a táblázat, a grafikon és a szabály ugyanabból az adatmodellből frissül. A diák előre jelzi, mi történik a grafikon kezdőértékével, illetve az emelkedésével.

**Tantervi címke:** A grafikonból olvasás és az arányosság felismerése alapcél. Az `y = ax + b` forma teljes, formális függvénytani tárgyalása külön bővítés. A kettőnek nem kell egyszerre megjelennie a tanuló előtt.

### 7.7. Miért nem egyformán valószínű a két dobás összege? — M22.02

**Feladat:** Két egymástól független, szabályos hatoldalú kockát dobunk. Az összeg 2 vagy 7 lesz nagyobb eséllyel?

A modellben 36 egyenlő esélyű rendezett dobáspár van. A 2-es összeghez az `(1;1)` pár tartozik. A 7-eshez hat pár: `(1;6)`, `(2;5)`, `(3;4)`, `(4;3)`, `(5;2)`, `(6;1)`.

Így a két esély `1/36`, illetve `6/36 = 1/6`. Az „összeg 2” és az „összeg 7” két megnevezhető esemény, de ettől még nem azonos az esélyük.

**Interakció:** Először a diák jelöli a dobáspárokat egy 6×6-os táblázatban. Csak ezután futtat 10, 100 vagy 1 000 szimulált dobást. Az elméleti esély és a megfigyelt relatív gyakoriság külön oszlopban szerepel.

**Korrekt visszajelzés:** Az újabb dobások nem garantálják, hogy a gyakoriság minden egyes lépésben közelebb kerül az elméleti értékhez. A rendszer nem manipulálhatja a sorozatot azért, hogy „szebb” eredményt adjon. Azonos újrajátszási azonosító ugyanazt a példasorozatot adhatja, de ezt jelezni kell.

### 7.8. Ugyanaz a doboz, kétféle mennyiség — M19.04–M19.05

**Feladat:** Egy zárt téglatest méretei 3 cm, 4 cm és 5 cm. Mennyi anyag kell a teljes külső burkolatához, és mekkora teret zár közre? A fedések és anyagvastagság a modellben elhanyagolhatók.

Két lap egyenként 12 cm², két lap egyenként 15 cm², két lap egyenként 20 cm² területű, ezért a felszín:

\[
2(12+15+20)=94\text{ cm}^2.
\]

A belsejében egy 3×4 egységkockás réteg 12 kockát tartalmaz; öt rétegben 60 fér el. A térfogat `60 cm³`.

**Interakció:** Ugyanaz a test váltható „burkolat” és „kitöltés” nézetre. A felszínnél lapokat, a térfogatnál rétegeket számolunk. A megoldás mellől nem hagyható el a megfelelő egység.

**További ellenőrzés:** Két egységkockát egy teljes lapjuknál összeragasztunk. Térfogatuk 2 egységkocka, külső felszínük 10 egységnégyzet. A két összeragasztott lap nem része a külső burkolatnak.

### 7.9. A feladatbank eredeti induló magjai

Ez a rövid jegyzék minden modulhoz megad egy ellenőrizhető mintafeladatot. A teljes változatban mindegyikből többféle gondolkodási feladat és magyarázat készül.

| Modul | Mintakérdés | Megoldás és fő indok |
|---|---|---|
| M00 | Körülbelül mennyi `198 · 5`? Ellenőrizd pontosan. | Körülbelül 1 000; pontosan 990. A becslés jelzi a megfelelő nagyságrendet. |
| M01 | Rendezd: `−3`, `3/4`, `0`, `−1/2`. | `−3 < −1/2 < 0 < 3/4`; a számegyenesen jobbra nő az érték. |
| M02 | `3/4 : 1/8`? | 6; háromnegyedben hat nyolcad van. |
| M03 | `−5 − (−8)`? | 3; a negatív nyolc kivonása nyolc hozzáadásának felel meg. |
| M04 | 12 és 18 legnagyobb közös osztója és legkisebb közös többszöröse? | 6 és 36; a prímtényezős szerkezet ellenőrizhető. |
| M05 | 25 tárgyat 2:3 arányban osztunk. | 10 és 15; öt arányegység egyenként öt tárgyat ér. |
| M06 | 10 000 Ft, majd −20%, majd +20%? | 9 600 Ft; a második változás alapja 8 000 Ft. |
| M07 | `3⁴` egyenlő-e `3 · 4`-gyel? | Nem; 81, illetve 12. A kitevő a tényezők számát jelöli. |
| M08 | Mely két szomszédos egész közé esik `√50`? | 7 és 8 közé, mert `49 < 50 < 64`. |
| M09 | Egyszerűsítsd: `4(x + 3) − x`. | `3x + 12`; a négyes minden zárójelen belüli tagot szoroz. |
| M10 | `4x + 3 = 19`. | `x = 4`; ellenőrzés: `16 + 3 = 19`. |
| M11 | `−2x < 6` a bővítő útvonalon. | `x > −3`; negatív osztó megfordítja a sorrendet. |
| M12 | Öt jegy összesen 1 700 Ft; felnőtt 400 Ft, gyermek 250 Ft. Hány felnőttjegy? | 3; `400a + 250(5−a) = 1700`, így `150a = 450`. |
| M13 | `y = 2x + 3`, `x = 4`; mit jelöl a kapott pont? | `y = 11`, a pont `(4;11)` a két mennyiség összetartozó értékeit jelöli. |
| M14 | A szabály `3n + 1`, az első hely sorszáma 1. Mi az ötödik tag? | 16; a sorszámot helyettesítjük be, nem az előző tagot. |
| M15 | Négy emberből két képviselőt, illetve két különböző személyt kapitánynak és helyettesnek választunk. | 6, illetve 12 lehetőség; a második esetben a szerepek számítanak. |
| M16 | Egy 6×4-es téglalap kerülete és területe? | 20 hosszegység, 24 területegység; másféle mennyiségek. |
| M17 | `(2;−1)` tükörképe az y tengelyre? | `(−2;−1)`; az x koordináta előjele változik. |
| M18 | Átfogó 10, egyik befogó 6. | Másik befogó 8; `100 − 36 = 64`. |
| M19 | Zárt 3×4×5-ös téglatest felszíne és térfogata? | 94 területegység és 60 térfogategység. |
| M20 | `0,03 m²` hány `cm²`? | 300 cm²; egy négyzetméter 10 000 négyzetcentiméter. |
| M21 | `2, 2, 2, 2, 12` átlaga és mediánja? | 4 és 2; a nagy adat az átlagot jobban elmozdítja. |
| M22 | Két független, szabályos hatoldalú kockán 7-es összeg esélye? | `6/36 = 1/6`; hat kedvező elemi pár a 36 közül. |
| M23 | 3×4 m padlóhoz 10% tartalékot számolunk; egy csomag 1,5 m². Hány egész csomag? | `12 · 1,1 = 13,2`, `13,2/1,5 = 8,8`, ezért 9 csomag. A tartalék itt előírt modellfeltétel. |

<a id="fejezet-08"></a>

## 8. Tévképzetek és célzott visszajelzés

Ez **tervezési hibakatalógus**, saját ellenőrző példákkal; nem a hibák empirikus gyakorisági rangsora. Egy hibás végértékből nem állapítható meg biztosan a gondolatmenet: lehet elírás, számolási hiba, félreolvasás vagy fogalmi akadály. A rendszer először megkülönböztető kérdést ad, és csak több válasz alapján választ magyarázó ágat. A gyerek nem kap képesség- vagy diagnóziscímkét.

A **BŐVÍTÉS** jelölésű sorok csak a megfelelően jelölt útvonalon jelennek meg; nem válnak automatikusan a közös törzsanyag részévé. Azonos hibatípus különböző reprezentációkban is ellenőrizendő.

| ID / modul | Vizsgált hibaminta | Megkülönböztető feladat | A célzott visszajelzés iránya |
|---|---|---|---|
| H01 · M03 | A kivonás mindig kisebb eredményt ad. | `5 − (−2)` és `5 − 2`. | „Melyik mennyiséget vesszük el?” Számegyenes és ellentett mennyiség. |
| H02 · M03 | Két mínuszjel mindig pluszt jelent. | `−3 − 2` és `−3 · (−2)`. | A szám előjele és a művelet jele külön szerep; előbb nevezze meg a műveletet. |
| H03 · M01 | A több tizedesjegy nagyobb értéket jelent. | `0,7` vagy `0,65` nagyobb? | „Írd mindkettőt századokban!” `70/100 > 65/100`. |
| H04 · M02 | Nagyobb nevezőhöz nagyobb tört tartozik. | `1/4` vagy `1/7` nagyobb? | Ugyanaz az egész, több vagy kevesebb egyenlő rész; a részek méretének összevetése. |
| H05 · M02 | Törtösszeadásnál a nevezőket is összeadjuk. | `1/3 + 1/4`. | „Milyen közös méretű darabokat számolhatunk össze?” Tizenkettedekkel `7/12`. |
| H06 · M02–M03 | Szorzás mindig nagyobbá tesz. | `8 · 1/2`. | „Nyolcnak mekkora részét vesszük?” A szorzó skálázó jelentése. |
| H07 · M02 | Osztás mindig kisebbé tesz. | `3/4 ÷ 1/2`. | „Hány fél egység fér háromnegyedbe?” Egy és fél mérőegység. |
| H08 · M02–M09 | Összegben tetszőlegesen lehet egyszerűsíteni. | `(6 + 3)/3`. | „A teljes számlálót osztjuk, vagy csak egy tagját?” Szorzattényező és összeadandó megkülönböztetése. |
| H09 · M03 | A szorzás mindig megelőzi az osztást. | `12 ÷ 3 · 2`. | Egyenrangú műveletek balról jobbra: az eredmény 8. A zárójel módosíthatná a feladatot. |
| H10 · M07 · **BŐVÍTÉS** | Negatív alap négyzete és a négyzet ellentettje azonos. | `(-3)^2` és `-3^2`. | „Pontosan mi a hatvány alapja?” Az értékek 9 és −9. |
| H11 · M07 · **BŐVÍTÉS** | Hatványok összeadásakor összeadjuk a kitevőket. | `2^2 + 2^3`, illetve `2^2 · 2^3`. | „Összeg vagy szorzat szerepel?” Az eredmények 12 és 32; a szabály feltételhez kötött. |
| H12 · M07 | A négyzet kétszerezést jelent. | `3^2` és `2 · 3`. | 3×3-as négyzet és két hármas csoport; 9 és 6. |
| H13 · M08 · **BŐVÍTÉS** | A gyökjel felbontható egy összeg tagjaira. | `√(9 + 16)` és `√9 + √16`. | „Számold ki külön a két oldalt!” `5 ≠ 7`; egy ellenpélda cáfolja az általános szabályt. |
| H14 · M08 | A gyökjel és a négyzetes egyenlet ugyanazt kérdezi. | Mi `√16`, és mely x-ekre `x² = 16`? | A gyökjel a nemnegatív értéket jelöli: 4. Az egyenlet megoldásai −4 és 4. |
| H15 · M05 | A `2:3` arány első része az egész `2/3`-a. | 20 tárgy felosztása `2:3` arányban. | „Hány arányegységből áll az egész?” Ötből; az első rész 8, az egész `2/5`-e. |
| H16 · M06 | Minden százalék ugyanarra az alapra vonatkozik. | 10000 Ft után −20%, majd +20%. | „Melyik ár a második százalékalap?” `10000 → 8000 → 9600`. |
| H17 · M06 | Kedvezmény után ugyanannyi százalék hozzáadása visszaadja az eredeti árat. | 20% kedvezmény után 8000 Ft; mennyi volt előtte? | „A 8000 Ft az eredeti ár hány százaléka?” `8000/0,8 = 10000`. |
| H18 · M06 · **BŐVÍTÉS** | Százalékpont és százalékos változás azonos. | Egy arány 20%-ról 30%-ra nő. | 10 százalékponttal nőtt; a kezdeti arányhoz viszonyított növekedés 50%. Mindig nevezzük meg az alapot. |
| H19 · M09 | Zárójelszorzásnál csak az első tagot szorozzuk. | `3(x + 2)`. | „Három csomagban összesen hány kettes rész van?” `3x + 6`. |
| H20 · M09 | A zárójel előtti mínusz csak az első tagot érinti. | `5 − (x + 2)`. | Az egész csomagot vesszük el: `5 − x − 2`. Behelyettesítéssel is ellenőrizhető. |
| H21 · M09 | Különnemű tagok összevonhatók. | `2x + 3 = 5x` minden x-re igaz? | „Próbáld x = 2-vel!” 7 és 10; az egység és az x-darab különböző tag. |
| H22 · M10 | Az egyenlet egyik oldala külön is megváltoztatható. | `3x + 6 = 21` után szabad-e `3x = 21`-et írni? | „Mit tettünk a másik oldallal?” Ugyanaz a változtatás őrzi meg az egyenlőséget. |
| H23 · M10 | Az „átvitel” indoklás nélküli előjelváltás. | Miért lesz `x + 5 = 12`-ből `x = 12 − 5`? | Előbb mindkét oldalból ötöt vonunk le; a rövid írásmód ezt rejti. |
| H24 · M10 | Minden egyenletnek pontosan egy megoldása van. | `x + 2 = x + 2`; `x + 2 = x + 3`. | „Találsz kivételt vagy egyetlen működő számot?” Az első minden valós x-re igaz, a másodikra nincs megoldás. |
| H25 · M11 · **BŐVÍTÉS** | Negatív számmal osztáskor az egyenlőtlenség iránya változatlan. | `−2x < 6`; ellenőrzés x = −4 és x = 0 esetén. | A reláció megfordul: `x > −3`. Számegyenes és behelyettesítés indokolja. |
| H26 · M05–M13 | Minden növekvő kapcsolat egyenes arányosság. | `y = 2x + 3`: kétszeres x kétszeres y-t ad? | „Hasonlítsd össze x = 1 és x = 2 esetét!” 5 és 7; az alapdíj megváltoztatja a kapcsolatot. |
| H27 · M05 | Fordított arányosságban a különbség állandó. | 120 km megtétele állandó 40, illetve 60 km/h sebességgel. | 3 és 2 óra; az állandó mennyiség a sebesség és idő szorzata, megállás nélküli modellben. |
| H28 · M13 | A koordináták sorrendje nem számít. | `(2; −3)` és `(−3; 2)` helye. | „Melyik tengelyen teszed meg az első lépést?” A két rendezett pár két különböző pont. |
| H29 · M15–M16 | Sok lemért ábra már általános bizonyítás. | Sok háromszög szögösszegét megmértük; ezzel minden háromszögre bizonyítottunk? | A mérés sejtést támogat; az általános indoklás külön lépés, például párhuzamos egyenessel. |
| H30 · M18 | Pitagorasz bármely háromszögre alkalmazható. | 4, 5, 6 oldalú háromszögben használható-e így a négyzetösszeg? | „Hol a tételhez szükséges derékszög?” A puszta háromszög nem elegendő feltétel. |
| H31 · M16 | Az alap mindig az alsó oldal, a magasság pedig egy oldal. | Ferde paralelogrammában válassz alapot és hozzá magasságot. | „Merőleges-e a magasság a választott alap egyenesére?” Átdarabolás kapcsolja a téglalaphoz. |
| H32 · M16 | Azonos kerülethez azonos terület tartozik. | 1×5 és 2×4 téglalap. | Mindkettő kerülete 12, területe 5 és 8. A két mérés más tulajdonságot fejez ki. |
| H33 · M20 | Hossz-, terület- és térfogatváltás azonos szorzóval történik. | `1 m²` hány `cm²`? | „Hány 1 cm-es sor és oszlop fér bele?” `100 · 100 = 10000`. |
| H34 · M17–M19 · **mélységi címke** | Kétszeres hossz kétszeres területet és térfogatot jelent. | Egy négyzet vagy kocka minden oldalát kétszerezzük. | 2×2-es lapfelosztás: négyszeres terület; 2×2×2 rétegezés: nyolcszoros térfogat. |
| H35 · M19–M20 | Felszín és térfogat ugyanazt méri. | Egy doboz becsomagolásához és megtöltéséhez mit mérünk? | Burkolat: egységnégyzetek, cm². Belső tér: egységkockák, cm³. |
| H36 · M21 | Az átlag mindig előforduló adat, és mindig a jellemző közép. | `2, 2, 2, 2, 12`. | Az átlag 4, a medián 2. „Melyiket változtatja jobban a kiugró adat?” |
| H37 · M21 | Mediánhoz nem kell rendezni. | `9, 1, 8, 2, 3`. | „Előbb rakd növekvő sorrendbe!” A rendezett lista középső eleme 3. |
| H38 · M22 | Sok fej után már kötelező az írás. | Független, szabályos pénzérmedobások után mennyi a következő fej esélye? | A modellben továbbra is `1/2`; a múltbeli sorozat nem tesz kötelezővé kiegyenlítődést. |
| H39 · M22 | A felsorolt eredmények automatikusan egyenlő esélyűek. | Két független, szabályos hatoldalú kocka összegénél 2 és 7 egyformán esélyes? | „Sorold fel a megfelelő dobáspárokat!” Egy, illetve hat azonos esélyű pár tartozik hozzájuk. |
| H40 · M15 | A sorrend mindig számít, vagy sosem számít. | Két csapattag kiválasztása; kapitány és helyettes kijelölése. | „Megváltozik a kimenet a két név felcserélésével?” A szerepek döntik el a helyes számlálást. |

### A visszajelzés döntési rendje

**Hibás válasz → rövid tisztázó kérdés → célzott modell vagy részlépés → új próbálkozás → eltérő, segítség nélküli feladat.** Nem minden hibánál kell végigjárni az összes lépcsőt: egy elíráshoz elég a megfelelő mező észrevehető megjelölése.

A visszajelzés külön kezelje az eredményt és az indokot. Például: „Az eredmény helyes. A leírt szabály azonban ennél a másik példánál nem működne; nézzük meg, miért.” Ismeretlen válasznál a rendszer ne találjon ki hozzá gondolatmenetet: kérdezze meg a következő lépést, vagy adjon megoldás-összehasonlítást. A teljes magyarázat minden tanulási feladatnál elérhető marad, segítségkérésért nem jár büntetés.

---

---


<a id="fejezet-09"></a>

## 9. A gyakorlórendszer

### 9.1. Gyakorlási módok

| Mód | Feladatválasztás | Visszajelzés | Mire használható? |
|---|---|---|---|
| Tanuló mód | Egy fogalom, emelkedő önállóság | Azonnali, lépésenként kérhető | Új gondolat megértése |
| Célzott gyakorlás | Egy készség több különböző megjelenése | Feladatonként indoklás és újrapróba | Bizonytalan rész javítása |
| Vegyes gyakorlás | Már tanult készségek keverve | Előbb a módszerválasztásra is visszajelzés | Annak felismerése, mikor melyik módszer kell |
| Visszatérő ismétlés | Korábbi témák új példákkal | Önálló próbálkozás után magyarázat | Tartósabb felidézés ellenőrzése |
| Hibanyomozó | Más megoldásának első hibás lépése | Az ok és egy javítás | Eljárások értelmének tisztázása |
| Indoklóműhely | Rövid állítás, kép, ellenpélda | Szempontrendszer és helyes indokok | Fogalmi megértés |
| Saját kihívás | Megadott célhoz feladat/ábra készítése | A megadott feltételek ellenőrzése | Alkotás és fordított gondolkodás |
| Vegyes időzített próba | Előre rögzített csomag | A végén részletes elemzés | Időbeosztás gyakorlása |
| Nyomtatható gyakorlás | Ugyanazon feladatmotor rögzített példányai | Külön nyitható/nyomtatható megoldókulcs | Képernyőn kívüli munka |

A kevert gyakorláshoz releváns hetedikes matematikai vizsgálat, az elosztott gyakorláshoz pedig osztálytermi kísérletek állnak rendelkezésre. Ez indokolja e módok beépítését. A konkrét feladatkiosztás, gyakoriság és küszöbérték a projekt saját, kipróbálandó döntése. [PED-05] [PED-06]

### 9.2. Egy fogalomhoz több feladatszerep

Egy alapfogalom induló feladatsora lehet: egy teljesen kidolgozott példa; egy hiányzó lépés; két önálló számolás; egy hibakeresés; egy más helyzetű alkalmazás. Ezt indoklás, ellenpélda és későbbi visszatérés egészítse ki, ha a fogalom ezt igényli. Ez szerkesztési minimumjavaslat, nem kutatással igazolt dózis.

| Feladattípus | Eredeti példa | Mit különít el? |
|---|---|---|
| Becslés | `√80` 8 és 9 vagy 9 és 10 között van? | Nagyságrend vs. mechanikus gombnyomás |
| Rövid bevitel | Egyenlet megoldása és visszahelyettesítés | Önálló előállítás vs. felismerés |
| Reprezentációváltás | Grafikonhoz táblázat és történet választása | Kép, szám és jelentés kapcsolata |
| Első hiba | Hibás zárójelbontás megjelölése | Egy hibát követő következetes számolás felismerése |
| Ellenpélda | „Kétszeres kerület kétszeres terület.” Cáfold. | Általános állítás és néhány példa különbsége |
| Több jó út | Egyenlet osztással vagy felbontással | Stratégiai rugalmasság |
| Hiányzó feltétel | Csak két oldal hossza ismert, más feltétel nincs. Elég ez a háromszög területéhez? | A feladat adatigényének megértése |
| Fordított feladat | Készíts egyenletet, amelynek egyetlen megoldása 5. | A megoldás és szerkezet kapcsolata |
| Mindig/néha/soha | „Két pozitív racionális szám szorzata mindkét tényezőnél nagyobb.” | Az érvényességi feltételek keresése |
| Több megoldás | Adott kerületű, pozitív egész egységű oldalhosszúságú téglalapok felsorolása | Egy helyes válasz és az összes megoldás különbsége |
| Modellkritika | Két munkás mindig feleannyi idő alatt végez? | Matematikai modell és valós feltételek |
| Magyarázd el | Miért oszthatjuk az egyenlet mindkét oldalát ugyanazzal a nem nulla számmal? | Az eljárás indoka |

### 9.3. A generálás követelményei

Egy feladatcsaládot előbb kézzel megtervezünk és ellenőrzünk, majd ehhez készül paraméterezés. A generátor a számokat, a kérdés irányát, a reprezentációt és az értelmezési helyzetet kontrolláltan változtathatja.

Minden generált feladathoz szükséges:

- a készség és a tantervi címke;
- a megengedett paramétertartomány és kizárások;
- a pontos megoldás és a külön számolt ellenőrzés;
- a levezetés a ténylegesen választott számokkal;
- három segítség és a teljes megoldás;
- felismerhető hibaminták, bizonytalan esetben általánosabb visszajelzés;
- nehézségi jellemzők: előjeles/törtes adatok, lépésszám, reprezentáció, nyelvi teher;
- újrajátszási azonosító, feladatcsalád-verzió és tartalomverzió.

Például az `ax + b = c` családban előbb választható a kívánt megoldás `x₀`, a nem nulla `a` és a `b`, majd `c = ax₀ + b`. Ez biztosítja a kívánt számtípust. Az ellenőrzés külön visszahelyettesítéssel történjen; ne ugyanaz a kódsor szolgáljon egyedüli bizonyítékként a kérdésre és a válaszra.

### 9.4. A hibából való továbblépés

Az első próbálkozás után a diák dönthessen az újrapróbálásról vagy a segítségről. Ugyanazt a számpéldát végig lehet tanulni, de az önálló teljesítményhez új példány szükséges. Ha a rendszer megmondta a helyes módszert, a későbbi számolás nem számít segítség nélküli stratégiaválasztásnak. A rendszer ne adjon magasabb tudásjelzést azért, mert a tanuló többször rákattintott az előzőleg megmutatott válaszra.

A fogalmi hiba, a számolási hiba, a beviteli formátum és a mértékegységhiba külön visszajelzést kapjon. Formátumhibánál a pontozás álljon meg: először azt kell tisztázni, mit szeretett volna beírni a tanuló.

### 9.5. Értékelés és magyarázat

A numerikus eredmény automatikusan ellenőrizhető. Egy szabad szöveges bizonyítás vagy indoklás minősége az első rendszerben nem tekinthető automatikusan megítéltnek. Használható rendezett indoklásválasztás, lépéskiegészítés, ellenpélda bekérése és önellenőrző rubrika. Saját megfogalmazás esetén a felület mondja meg, hogy a visszajelzés szempontlista, nem gépi szakértői minősítés.

Az értékelés mutassa meg azt is, mi sikerült: helyes modell hibás számolással, jó szám rossz indokkal, megfelelő egység, jó ellenőrzés. A gyakorlóeredmény ne jelenjen meg automatikusan iskolai osztályzatként.

<a id="fejezet-10"></a>

## 10. Interaktív műhelyek katalógusa

Az alábbi **48 tervezett műhely** saját fejlesztési javaslat. Mindegyik egy matematikai kapcsolat megfigyelésére, kipróbálására és ellenőrzésére szolgál. Nem kész alkalmazáselem, és a felsorolás önmagában nem tantervi megfelelőségi igazolás.

### 10.1. Hogyan olvassuk a katalógust?

- **M-kapcsolat:** a 4–5. fejezet moduljaihoz és tanulási egységeihez köt. Egy műhely több leckében is felhasználható; a 48 műhely nem 48 új tantárgyi fejezet.
- **Tartalomréteg:** a mostani besorolás **ideiglenes**. A „TÖRZS-jelölt” azt jelenti, hogy a műhely tantervi megfeleltetése és a konkrét feladatszint még ellenőrzendő. A BŐVÍTÉS-réteg nem előfeltétele az alaprész teljesítésének.
- **P1:** a teljes tanulóoldal első kiépítési hullámában fontos elem. **P2:** a következő hullámban hozzáadandó lefedés vagy mélyítés. **P3:** a már használható rendszer gazdagítása. Ez fejlesztési sorrend, nem fontossági ítélet a diákokról vagy tananyagkötelezőség.
- **Hozzáférhető változat:** ugyanazt a matematikai célt szolgálja más kezeléssel. Nem egy egyszerűsített, kevesebbet tanító mellékfeladat.

**Közös menet:** jóslat vagy becslés → tudatos változtatás → mi változott és mi maradt? → indoklás → új, önálló feladat. A bemutató végigkattintása nem igazolja a megértést. Egy képernyőn egyszerre csak a célhoz szükséges interakciók jelenjenek meg.

**Első helyi bemutató:** I02, I13, I19, I24, I31 és I41 egy-egy teljes leckével és önálló feladatsorral. I24 esetén elsőként a táblázat–grafikon kapcsolat készül el; a formális lineáris függvény bővítés. A P1-lista többi eleme később, az első hat egység tapasztalatai alapján következik.

### 10.2. Számfogalom és műveletek

| ID / prioritás | M-kapcsolat | Ideiglenes tartalomréteg | Műhely | Diákcselekvés | Fogalmi cél és ellenőrzés | Hozzáférhető változat |
|---|---|---|---|---|---|---|
| I01 / P1 | M01.02–M01.05 | ALAP; TÖRZS-jelölt | Nagyítható számegyenes | Számot helyez el, zoomol, két szám közé új számot keres | Nagyságrend, rendezés, távolság; a nagyítás az értéket nem változtatja meg. A rendszer az intervallumot és távolságot is visszajelzi | Számbevitellel választható pont; „balra/jobbra” gombok; rendezett számlista |
| I02 / P1 | M02.01–M02.05 | ALAP | Törtlabor közös egységgel | Ugyanakkora egészt feloszt, az osztásokat finomítja, törteket egymásra helyez | Miért egyenlő 1/2 és 3/6; összeadás előtt miért kell azonos egység. Visszajelzés a rész és az egész változásáról | Számláló/nevező mezők; felosztást és mennyiséget leíró szöveg |
| I03 / P2 | M02.06 | ALAP | Tört szorzása mint résznek a része | Téglalapon két irányban színez, majd leolvassa a közös részt | Például 2/3 · 3/4; a modell külön jelöli az egész területét. Ellenpélda arra, hogy szorzáskor mindig nő a szám | Kétdimenziós táblázat kiválasztással; számszerű területleírás |
| I04 / P1 | M02.07–M02.08 | ALAP | Törtosztás mint kimérés | Egy szalagot adott tört hosszúságú darabokkal fed le | A 3/4 : 1/8 kérdése: hány nyolcad fér bele? A reciprok szabály ebből a cselekvésből következik | „Tegyél mellé még egy darabot” gomb, darabszámláló, szöveges megoldási lépések |
| I05 / P2 | M01.04, M01.06; M02.02; M06.01 | ALAP; BŐVÍTÉS a tizedesalak formális elemzése | Tört–tizedes–százalék átjáró | Egy értéket három nézetben módosít és párosít | Ugyanaz a mennyiség több jelöléssel; véges és ismétlődő tizedesek megkülönböztetése. Pontos és közelítő egyenlőség eltérő jelzést kap | Egymás alatti mezők és felolvasható törtek; nem kizárólag animáció |
| I06 / P1 | M01.03; M03.01–M03.02 | ALAP | Előjeles számok és nullapárok | Pozitív és negatív lapkákat hozzáad vagy elvesz, a számegyenesre vált | A kivonás és az ellentett kapcsolata. A fizikai lapkakép nem terjed ki hamisan minden műveletre; a szorzás külön mintázattal és disztributivitással indokolt | Plusz/mínusz gombok, műveletsor és számlista |
| I07 / P1 | M03.03 | ALAP | Műveleti sorrend döntési fája | Kijelöli a következő kiszámítható részt; zárójeleket helyez el | Ugyanazon számok más szerkezete más értéket ad. A rendszer elmondja, miért az adott művelet következik | Választható műveletlista; a fa szöveges, behúzott felsorolása |
| I08 / P2 | M04.01–M04.05; M02.03 | ALAP; TÖRZS-jelölt | Prímtényező-építő | Számot tényezőkre bont, oszthatóságot vizsgál, közös tényezőcsoportokat keres | A helyi érték és a szám tényezőszerkezete magyarázza a kiválasztott oszthatósági szabályt, közös osztót és közös többszöröst; kapcsolat a törtegyszerűsítéssel. A rendszer az indokot is kéri | Számtényező-mezők és soronkénti lista |
| I09 / P1 | M07.01–M07.02, M07.04–M07.05 | ALAP/TÖRZS-jelölt: ismételt szorzás; **BŐVÍTÉS: azonosságok, nulla/negatív kitevő** | Hatványok ismétlődő szorzatokból | Ismételt szorzatot felépít és kinyit; a külön bővítő lépcsőben tényezőket csoportosít | Az alap a hatvány jelentése. A bővítésben azonos alapú szorzatból vezeti le a kitevők összeadását; összeadásra és eltérő alapra ellenpéldát keres. Nulla/negatív kitevő csak saját feltételes magyarázattal | Kinyitható szorzat szöveges alakban; lépésválasztó gombok |
| I10 / P2 | M07.03; M03.05 | ALAP/TÖRZS-jelölt: tízes hatvány; **BŐVÍTÉS: normálalak** | Tízes hatványok és nagyságrend | Tízes skálán léptet; a normálalakot csak a megjelölt bővítő lépcsőben állítja elő | A számjegyek helyiértéke és a tíz hatványai; egységgel együtt értelmezett nagy/kicsi számok | Kitevőmező, táblázat, nagyságrendi becslés |
| I11 / P1 | M08.01–M08.02; M07.02 | TÖRZS-jelölt: gyök mint oldalhossz; **BŐVÍTÉS: négyzetes egyenlet megoldáshalmaza** | Négyzetgyök mint oldalhossz | Négyzet területét állítja, oldalt becsül, rácson ellenőrzi | A nemnegatív négyzetgyök fogalma: sqrt(36)=6, sqrt(0)=0. A külön bővítés összeveti ezt az x²=36 két valós megoldásával; a két feladat kérdése nem azonos | Terület- és oldalmező; becslési alsó/felső határ megadása |
| I12 / P2 | M08.03–M08.04; M01.06 | TÖRZS-jelölt: becslés; BŐVÍTÉS/KITEKINTÉS: formális irracionalitás | Pontos érték és közelítés | sqrt(2)-t egymásba ágyazott intervallumokkal keresi | A rajzolt pont és a tizedes alak közelítő lehet, miközben a gyökjeles érték pontos. Az intervallumokkal való becslés az alap; az irracionalitás formális indoklása külön bővítés | Intervallumtáblázat; nincsen kényszerített pontos pixeltalálat |

### 10.3. Arányosság és százalék

| ID / prioritás | M-kapcsolat | Ideiglenes tartalomréteg | Műhely | Diákcselekvés | Fogalmi cél és ellenőrzés | Hozzáférhető változat |
|---|---|---|---|---|---|---|
| I13 / P1 | M06.01–M06.04 | ALAP; TÖRZS-jelölt | Százalékrács és egységre jutás | Rész, egész vagy százalékláb közül kettőt állít | A százalék mindig egy választott alaphoz viszonyít; ugyanannyi forint különböző százalék lehet | Három feliratozott mező, sáv szöveges értékei |
| I14 / P1 | M06.05–M06.06; M12.05 | TÖRZS-jelölt; BŐVÍTÉS: százalékpont | Ár változása oda-vissza | Kedvezményt, majd emelést állít; előre jósolja a végárat | A változó százalékalap miatt +20% és −20% nem oltja ki egymást. Minden lépésnél kiírja az aktuális alapot; a százalékpontot csak a külön bővítő példák használják | Lépéstáblázat, állítható százalékmezők |
| I15 / P1 | M05.01–M05.03, M05.06; M12.03 | ALAP; TÖRZS-jelölt | Receptarányosító | Adagok számát módosítja, összetevőket egészít ki | Egyenes arányosság és állandó hányados; az állandó szállítási díj ellenpélda lehet | Adattáblázat, hiányzó értékek, növelés/csökkentés gomb |
| I16 / P1 | M05.04–M05.05; M13.07 | TÖRZS-jelölt: konkrét kapcsolat; BŐVÍTÉS a formális függvényalak | Fordított arányosság műhely | Azonos munkához munkások számát és időt párosítja | Állandó szorzat csak rögzített modellfeltételekkel: azonos teljesítmény, osztható munka. Megmutatja, miért nem minden valós munka ilyen | Táblázat és feltételválasztás; grafikonhoz adatsor |
| I17 / P2 | M12.06; M13.02, M13.05, M13.07 | TÖRZS-jelölt; FELVÉTELI a megfelelő változatban | Út–idő–sebesség | Mozgást tervez, megállást illeszt be, grafikonhoz történetet párosít | Grafikon meredeksége és sebesség; a grafikon vonala nem az út térképe. Külön összút és átlagsebesség | Időszakaszonkénti adatbevitel; szöveges mozgásnapló |

### 10.4. Algebra és összefüggések

| ID / prioritás | M-kapcsolat | Ideiglenes tartalomréteg | Műhely | Diákcselekvés | Fogalmi cél és ellenőrzés | Hozzáférhető változat |
|---|---|---|---|---|---|---|
| I18 / P1 | M09.01–M09.06 | ALAP; TÖRZS-jelölt; a formális mélység ellenőrzendő | Algebrai lapkák | Hasonló tagokat rendez, zárójelet bont | Miért vonható össze 2x+3x, és miért nem 2x+3; a szorzás disztributivitása | Taglista és kiválasztható műveletek, területmodell nélkül is működik |
| I19 / P1 | M10.01–M10.08 | TÖRZS-jelölt; az összetett egyenletváltozat mélysége ellenőrzendő | Egyenletmérleg | Mindkét oldalon ugyanazt az engedélyezett műveletet végzi | Az egyenlőség megőrzése; az „átvitel” valójában mindkét oldali művelet. A megoldást visszahelyettesíti | Két oldalt leíró sor; művelet- és számmező; indoklásválasztás |
| I20 / P2 | M11.01–M11.03 | ALAP: összehasonlítás; **főleg BŐVÍTÉS: formális egyenlőtlenség-megoldás** | Egyenlőtlenség és irányváltás | Először konkrét számokat hasonlít össze; a bővítésben rendezett pontokat negatív számmal szoroz és egyszerű egyenlőtlenséget alakít | Miért fordul meg a rendezés negatív szorzáskor; a megoldás számok tartománya lehet. A visszajelzés külön ellenőrzi a relációjelet és a határpontot | Intervallum-/feltételbevitel és rendezett értékpárok |
| I21 / P1 | M12.01–M12.07; M23.01 | TÖRZS-jelölt; FELVÉTELI | Szövegből modell | Ismeretlent nevez meg, adatot és kapcsolatot választ, egyenletet épít | A szöveg és a matematikai állítás megfeleltetése; egység, irreleváns adat és eredmény értelmezése | Űrlapos adat–kapcsolat–egyenlet sor; szöveg bármikor visszanézhető |
| I22 / P1 | M00.03; M03.03; M09; M10 | ALAP; TÖRZS-jelölt; választható bővítő példák | Hibanyomozó megoldássor | Egy kész megoldás első hibás sorát és az okot jelöli | Helyes eredményből nem következik helyes gondolatmenet; műveletek és azonos átalakítások | Soronként számozott szöveg és válaszlista; javítás beírható |
| I23 / P1 | M13.01–M13.02 | ALAP; TÖRZS-jelölt | Koordinátafelderítő | Pontokat helyez el, majd a koordinátákat cseréli | Sorrend, előjel, tengely és koordinátarendszer szerepe | Külön x/y mező, pontlista és iránylépések |
| I24 / P1 | M13.03–M13.06 | TÖRZS-jelölt: táblázat és grafikon; **BŐVÍTÉS: y=ax+b, formális meredekség és metszet** | Grafikon vezérlőpult | Kezdőértéket és egy lépésre jutó változást állít, előre jósol; a bővítésben az y=ax+b paramétereit nevezi meg | Táblázat és grafikon összekapcsolása, növekedés/csökkenés és állandó érték. A formális meredekség, tengelymetszet és függvényjelölés külön bővítő réteg | Pontos értékmezők, hozzájuk tartozó táblázat és mondatos grafikonleírás; a grafikon húzása kihagyható |
| I25 / P1 | M05.03–M05.05; M13.02–M13.07 | TÖRZS-jelölt; FELVÉTELI; formális függvénynyelv külön bővítés | Történet–táblázat–grafikon–szabály | Azonos kapcsolat négy reprezentációját összepárosítja | Ugyanaz a kapcsolat történettel, adatsorral és rajzzal is leírható; nem minden kapcsolat egyenes arányosság. A visszajelzés a megfelelő értékpárral és egységgel igazolja a párosítást | Egymás alatti nézetek, billentyűvel működő párosítás |
| I26 / P2 | M14.01–M14.04 | TÖRZS-jelölt; KITEKINTÉS: több lehetséges szabály | Sorozatépítő | Mintázatot folytat, szabályt alkot, két szabályt összehasonlít | Az előző tagból és a sorszámból történő számítás különbözhet. Néhány kezdeti tag több szabályhoz is illhet; a rendszer a megadott feltételeket ellenőrzi, nem egyetlen kitalált folytatást | Tagtáblázat és mondatos szabály, nem kizárólag vizuális minta |

### 10.5. Sík- és térgeometria

| ID / prioritás | M-kapcsolat | Ideiglenes tartalomréteg | Műhely | Diákcselekvés | Fogalmi cél és ellenőrzés | Hozzáférhető változat |
|---|---|---|---|---|---|---|
| I27 / P1 | M16.02–M16.04 | ALAP; TÖRZS-jelölt | Háromszög szögműhely | Csúcsot mozgat, a szögeket egymás mellé rendezi | Szögösszeg, külső szög; a megfigyelést később indoklás egészíti ki. A lehetetlen háromszögadatokat megmagyarázza | Csúcskoordináta vagy szögbevitel; szögtáblázat |
| I28 / P2 | M16.04; M15.01 | TÖRZS-jelölt; definícióválasztás a tananyaghoz igazítva | Négyszög-családfa | Tulajdonság alapján osztályoz, alakot deformál | Négyzet egyben téglalap és rombusz; inkluzív fogalomrendszer. A trapézdefiníció a választott tananyaghoz kötött | Tulajdonságkártyák és hierarchikus lista; definíció gomb |
| I29 / P1 | M16.05–M16.07 | ALAP; TÖRZS-jelölt | Terület átdarabolással | Paralelogrammát, háromszöget, trapézt mozgatással átrendez | A képlet a megőrzött területből származik; alaphoz tartozó merőleges magasság | Számozott darabok, „következő átrendezés” gomb, területtáblázat |
| I30 / P2 | M16.01, M16.08; M17.05 | ALAP: kör részei; **főleg BŐVÍTÉS: kerület- és területképlet** | Kör kerülete és területe | A kör részeit azonosítja; a bővítésben sugarat változtat és körcikkeket sorba rendez | A kerület és terület különböző mennyiség. Kétszeres sugárnál a megfelelő arányokat vizsgálja; a képletek és a körcikkes közelítés külön bővítés, a véges átdarabolás nem pontos azonosság | Sugármező és összehasonlító táblázat; lépéses statikus ábrák |
| I31 / P1 | M18.01–M18.03; M08.01 | TÖRZS-jelölt; KITEKINTÉS: más bizonyítások | Pitagorasz átdarabolva | Derékszögű háromszög oldalait állítja, az oldalakra emelt négyzeteket rendezi | a²+b²=c² területi jelentése; az átfogó azonosítása; a tétel feltétele a derékszög | Befogómezők, négyzetterületek listája, gombos átrendezés |
| I32 / P2 | M16.03; M18.05 | TÖRZS-jelölt: létezés/feltétel; **BŐVÍTÉS: a Pitagorasz-tétel megfordítása** | Háromszögadatok ellenőre | Három oldalt ad meg, eldönti létezhet-e, majd derékszögű-e | Előbb a háromszög létezését ellenőrzi. A külön bővítésben a legnagyobb oldalt vizsgálja a Pitagorasz-megfordításhoz; egy helyes négyzetösszeg sem helyettesíti a feladat feltételeinek tisztázását | Értéklista és kétlépcsős indokláskártyák |
| I33 / P1 | M17.01–M17.04 | TÖRZS-jelölt: tükrözések; BŐVÍTÉS: formális eltolás/forgatás | Transzformációs tükörszoba | Tengelyes és középpontos tükrözést készít, invariánsokat keres; eltolást és forgatást külön jelölt lépcsőben próbál | A megfelelő pontok és a megmaradó távolság/szög felismerése. Az egyes transzformációk feltételei elkülönülnek; a formális szabály és az általános forgatás bővítés | Koordináták, transzformációs mezők, előtte/utána párok |
| I34 / P2 | M05.07; M17.05; M20.01–M20.03 | TÖRZS-jelölt: méretarány; BŐVÍTÉS: formális hasonlóság és területarány | Térképskála és nagyítás | Léptéket állít, valós/rajzi hosszakat és területeket párosít | A rajzi és valós hosszúság viszonya az alap. A bővítés megmutatja, hogy a hossz- és területarány különbözik; egységet és arányt együtt ellenőriz | Mértékegységes mezők, aránytáblázat |
| I35 / P2 | M17.06; M16.03 | TÖRZS-jelölt; szerkesztéstípusonként ellenőrzendő | Szerkesztési műhely | Körzőnyílást és pontokat választ, felezőt vagy háromszöget szerkeszt | A szerkesztés lépések és geometriai indokok rendszere; a rajz pontossága nem helyettesíti a feltételt | Pontlistából választás, numerikus koordináták, lépésnapló; papíros feladatlap |
| I36 / P1 | M19.01, M19.03 | TÖRZS-jelölt; FELVÉTELI | Testháló hajtogató | Síkbeli hálóról jósol, majd lépésekben felhajtja | Mely lapok találkoznak, mi fed át; test és háló megfeleltetése. A „szép animáció” után új, rejtett hálóról dönt | Előre definiált nézetek és lap-szomszédsági lista; nyomtatható háló |
| I37 / P1 | M19.04, M19.06; M16.05 | TÖRZS-jelölt; FELVÉTELI | Csomagolástervező | Doboz méretét módosítja, lapokat színez, felszínt számol | Felszín mint a lapok területösszege; az azonos térfogat nem azonos felszín | Laponkénti táblázat és méretmezők |
| I38 / P1 | M19.05–M19.07; M20.03–M20.04 | TÖRZS-jelölt: kocka/hasáb; **BŐVÍTÉS: henger és további testképletek** | Térfogat rétegekből | Egységkockákból rétegeket épít, hasábot változtat; hengerre és más testre csak a külön bővítő lépcsőben tér át | Az alapterület × magasság értelme a hasábnál. A hengerképlet bővítés; ott a kockás kép közelítés, az alapterület körterület. A térfogatot és a felszínt külön kérdezi | Rétegszám, alapterület, magasság és térfogat táblázatban |
| I39 / P1 | M20.01–M20.05 | ALAP; TÖRZS-jelölt; FELVÉTELI | Mértékegység-átváltó rács | Hossz-, terület- és térfogategységet vált és nagyít | Miért 10, 100, illetve 1000 a szomszédos tízes egységek szorzója; liter és köbdeciméter kapcsolata | Külön mennyiség- és egységmező; dimenziómagyarázat |

### 10.6. Adatok, véletlen és alkalmazás

| ID / prioritás | M-kapcsolat | Ideiglenes tartalomréteg | Műhely | Diákcselekvés | Fogalmi cél és ellenőrzés | Hozzáférhető változat |
|---|---|---|---|---|---|---|
| I40 / P1 | M15.04–M15.05; M22.02 | TÖRZS-jelölt; FELVÉTELI | Esetfa és kombinációs asztal | Lehetőségeket sorol, fát bővít, duplikátumot jelöl | Miért teljes a felsorolás; mikor számít a sorrend és az ismétlés. Az „összes eset” állítást szerkezettel igazolja | Fastruktúra listában, választható ágak és rendszerezett táblázat |
| I41 / P1 | M22.01–M22.05 | TÖRZS-jelölt; formális függetlenség csak külön mélységi címkével | Valószínűségi labor | Jósol, dobásokat futtat 10/100/1000 alkalommal, eredményt összehasonlít | Relatív gyakoriság és elméleti valószínűség különbsége; nem lesz minden tízes blokk „szabályos”. Az egyenlő esélyű kimeneteleket külön ellenőrzi | Dobásnapló, gyakorisági táblázat; animáció kikapcsolható |
| I42 / P1 | M21.01–M21.02, M21.05; M13.02 | TÖRZS-jelölt; FELVÉTELI | Diagramdetektív | Tengelykezdést, skálát vagy kategóriaelosztást változtat | Ugyanaz az adat más vizuális benyomást kelthet. Az ábra mellett az eredeti értékek mindig elérhetők | Adattáblázat, skálamezők és mondatos összehasonlítás |
| I43 / P1 | M21.01, M21.03–M21.05 | TÖRZS-jelölt: átlag, medián, módusz; BŐVÍTÉS: terjedelem | Élő adatsor és középértékek | Adatpontot mozgat, szélsőértéket ad hozzá, újraszámol | Az átlag egyenletes szétosztásként értelmezhető. A medián és módusz más jellemzőt emel ki; a terjedelem külön bővítés. A szélső adat hatása eltérhet; az egyedi módusz hiányát a rögzített definíció szerint jelzi | Rendezett számlista és szerkeszthető mezők; pontdiagram nélkül is elvégezhető |
| I44 / P2 | M15.01–M15.03 | TÖRZS-jelölt; a formális logikai jelölés külön bővítés | Halmaz- és állításlabor | Számokat feltételek szerint válogat, ellenpéldát keres | Metszet, unió és komplementer rögzített alaphalmazon; „minden” állítás cáfolatához ellenpéldát keres. Nem feltételezzük, hogy néhány találó példa bizonyít | Feltétellista és igaz/hamis táblázat; régiók számmal megnevezve |
| I45 / P3 | M23.01–M23.02; M05; M06; M12; M16; M21 | TÖRZS-alkalmazás; FELVÉTELI/KITEKINTÉS a változattól függően | Tervezd meg a mini rendezvényt | Költségkeretből választ, arányos receptet és területbeosztást alkot, adatot értelmez | Több témát összekötő alkalmazás, több helyes megoldás; a rendszer a feltételeket ellenőrzi, nem egyetlen titkos mintamegoldást kér | Lépéses adatlap és ellenőrző összesítő; teljesítést nem időmérő szabja meg |

### 10.7. Kapcsolatok, nézetek és indoklás

| ID / prioritás | M-kapcsolat | Ideiglenes tartalomréteg | Műhely | Diákcselekvés | Fogalmi cél és ellenőrzés | Hozzáférhető változat |
|---|---|---|---|---|---|---|
| I46 / P2 | M15.06; M23.01 | TÖRZS-jelölt: egyszerű kapcsolatok és utak; KITEKINTÉS: stratégiai feltétel | Kapcsolati gráf felfedező | Helyeket és kapcsolatokat ad meg, útvonalat jelöl, majd ugyanazt a hálózatot más elrendezésben rajzolja | A kapcsolatot az él, nem a pontok képernyőbeli közelsége határozza meg. A rendszer ellenőrzi az út lépéseit; a nyilak, ismételt látogatás és egyéb feltételek mindig láthatók | Csúcs- és él-lista, szomszédsági táblázat, útvonal megadása rendezett pontlistával |
| I47 / P1 | M19.01–M19.03, M19.05; M23.03 | TÖRZS-jelölt; FELVÉTELI | Nézetkocka építő | Egységkockákból testet épít elöl-, oldal- és felülnézet alapján, majd összehasonlít több lehetséges testet | A nézet részleges információ. Ugyanazon vetületekhez több test is tartozhat; a rendszer minden feltételeknek megfelelő megoldást elfogad, és külön kezeli a bizonyíthatóan egyértelmű feladatot | Rácscellánkénti hozzáadás/törlés gombok, koordináta- és rétegtáblázat; előre megadott nézetek szabad forgatás helyett |
| I48 / P1 | M00.01, M00.03; M15.02–M15.03; M23.01 | ALAP/TÖRZS-jelölt gondolkodási rutin; BŐVÍTÉS csak a választott állítás mélysége | Bizonyítás és ellenpélda műhely | Állításhoz példát vagy ellenpéldát keres, majd szerkesztett indokláskártyákból helyes gondolatmenetet állít össze | Elkülöníti a megfigyelést, sejtést és indoklást: például a „minden prímszám páratlan” állítást a 2 cáfolja. Csak előre ellenőrzött állításokat és következtetési lépéseket értékel automatikusan | Sorszámozott lépések; „előrébb/hátrébb” gombok; szöveges állítás–indok párok; szabad indoklásra önellenőrző szempontok |

### 10.8. A bővítő réteg pontos határai

| Műhely | Az alaprészben marad | Külön megnyitható bővítés |
|---|---|---|
| I09–I10 | Ismételt szorzás, négyzetszám, helyi érték és tízes hatvány szemlélete | Általános hatványazonosság, nulla/negatív kitevő, normálalak |
| I11–I12 | Négyzetgyök mint pozitív oldalhossz; négyzetszám és közeli négyzetszámokkal becslés | A négyzetes egyenlet teljes megoldáshalmaza, formális irracionalitás és gyökátalakítás. Gyököt tartalmazó egyenletek általános megoldókurzusa nincs az alapműhelyben |
| I20 | Konkrét számok rendezése, „legalább” és „legfeljebb” értelmezése | Egyenlőtlenségek formális átalakítása, negatív szorzás és intervallumos megoldás |
| I24–I25 | Tengelyek, értékpárok, táblázat–grafikon–történet kapcsolat | Formális y=ax+b, általános meredekség és tengelymetszet; a függvényfogalom további mélysége |
| I30 | Kör részei, kerület és terület mint különböző mennyiségek | Körképletek levezetési szemlélete és alkalmazása |
| I32–I34 | Háromszögfeltétel, tükrözések, konkrét térképi méretarány | Pitagorasz megfordítása; formális forgatás/eltolás; általános hasonlósági és területarányos állítások |
| I38 | Egységkockák, rétegek és hasábtérfogat | Henger és további testek képletei, csak ellenőrzött tantervi útvonalon |
| I43 | Adatsor, összeg, darabszám és átlag jelentése | Medián, módusz és terjedelem mélysége a kiválasztott tananyag ellenőrzött besorolását követi |

A négyzetgyök művelete és az `x²=a` egyenlet két külön tanulási kérdés. A tananyag ne nevezze általános gyökegyenlet-megoldásnak a négyzetterületből oldalhossz visszakeresését, és ne vezesse be észrevétlenül a későbbi évfolyamok algebrai követelményeit.

### 10.9. Közös elkészülési feltételek

1. **Egy világos kérdés:** például „Miért marad ugyanannyi a terület?” vagy „Miért nem tért vissza az eredeti ár?”.
2. **Válasz a mozgatás előtt:** a diák becsül vagy jósol; a kísérlethez utólag következtetést kapcsol.
3. **Matematikai állapot:** az ábra, a számok, a táblázat és a magyarázat mindig ugyanazt a modellt mutatja.
4. **Feltétel és ellenpélda:** a műhely jelzi, mikor alkalmazható az összefüggés; a mozgás nem hoz létre csendben érvénytelen alakzatot vagy tiltott számítást.
5. **Használható alternatíva:** minden húzás elvégezhető legyen pontos mezővel, gombbal vagy kijelölés–célválasztás művelettel; a billentyűzetes út is teljes.
6. **Megállíthatóság:** újrakezdés, visszalépés, léptetés és csökkentett mozgás. A magyarázat animáció nélkül is követhető.
7. **Érdemi visszajelzés:** a rendszer megnevezi a kapcsolatot vagy a hibás lépést; a puszta színezés, hang vagy pontszám nem elég.
8. **Átvitel ellenőrzése:** a bemutató után új paraméterű vagy új helyzetű önálló feladat következik, ahol a megoldás nem másolható a képről.
9. **Több helyes út:** ahol több megoldás lehetséges, a feltételeket ellenőrizzük. Nem egy rejtett „szép” megoldáshoz hasonlítunk minden választ.
10. **Ellenőrzött tartalom:** minden magyarázat és feladatcsalád matematikai átnézést kap; a mozgó ábra nem minősül önmagában bizonyításnak.

A feladatsor, nyomtatható magyarázat és egyszerű adatnézet minden műhely mellett megmarad. Az interaktív gazdagság a megértést segíti; a tanuló maga választhatja meg, hogy egy adott összefüggést mozgatással, számolással vagy lépésekre bontott magyarázattal dolgoz fel.

---


<a id="fejezet-11"></a>

## 11. Tanulási utak és alkalmazkodás

### 11.1. Négy belépési mód

**„Most ezt tanuljuk.”** Téma vagy tankönyvi fejezethez kapcsolt kereső. Az iskolai fejezetmegfeleltetés csak ellenőrzött adatokkal jelenik meg.

**„Itt szoktam elakadni.”** Konkrét jelenségre keresés: „mínusz a zárójel előtt”, „nem értem a törttel osztást”, „melyik oldal az átfogó”. A kereső saját szótárból, gyakori elírásokból és címkékből működhet, élő AI nélkül.

**„Segíts elindulni.”** Kihagyható előismereti felmérés, 3–4 feladatos részletekben. A teljes felmérés első javaslatként hat kis tématerületből 1–2 feladatot tartalmazhat; az elágazás szükség esetén további egy megkülönböztető kérdést tesz fel. A diák bármikor közvetlenül témát választhat. Ez nem standardizált teszt és nem diagnózis.

**„Gyakorolnék egy kicsit.”** Választható rövid blokk, például 5, 10 vagy 20 perc becsült munkával. Az idő csak tájékozódási segítség; a tanulási feladatok alapmódban nem járnak le.

### 11.2. Mit figyeljen a rendszer?

| Dimenzió | Bizonyíték | Amit önmagában nem bizonyít |
|---|---|---|
| Eljárás | Új példányon helyes lépések és eredmény | Általános fogalmi megértés |
| Indoklás | Megfelelő ok/ellenpélda kiválasztása vagy előállítása | Egy teljes szabad szöveges bizonyítás érvényessége |
| Reprezentáció | Ábra, szöveg, szám és szabály összekapcsolása | Minden más megjelenés megértése |
| Átvitel | Más helyzetű feladat megfelelő modellezése | Tartós megtartás |
| Megtartás | Későbbi új feladat önálló megoldása | Soha többé nem kell ismételni |

A tudástérkép ezekről adjon egyszerű, külön visszajelzést. Az „érted” címke ne egyetlen rövid feleletválasztós kvízből keletkezzen.

### 11.3. Kezdeti adaptív szabályok — tesztelendő termékhipotézis

| Megfigyelt helyzet | Javasolt következő lépés |
|---|---|
| Két új feladat önállóan helyes, az indoklás is megfelelő | Új reprezentáció vagy összetettebb helyzet |
| Helyes eredmény bizonytalan indokkal | Rövid hibakeresés vagy „miért?” kérdés |
| Azonosnak látszó hiba két külön feladatban | Megkülönböztető kérdés, majd célzott előismereti lecke |
| Több, egymástól eltérő hiba | Kisebb feladatlépés, egyszerűbb számok és választható segítség |
| Teljes megoldást megtekintette | Új közeli feladat; a megtekintés nem önálló siker |
| Rövid idő alatt sok próbálkozás | Semleges felajánlás: segítség, lassabb menet vagy szünet |
| Későbbi visszatéréskor siker | Következő ismétlés ritkítható |
| Későbbi visszatéréskor nehézség | Rövid újraépítés; korábbi tanulás nem törlődik |

A kezdeti ismétlési javaslat lehet például 1, 3, 7 és 14 nap, de ez **választható, módosítható heurisztika**. Nem állítjuk, hogy minden tanulónál és témánál ez az optimális. Külső értesítés vagy automatikusan létrehozott emlékeztető az alapváltozatban nem szükséges.

### 11.4. Motiváció

A haladás a megértési lépésekből épüljön: „Már meg tudom indokolni”, „Egy új helyzetben is sikerült”, „Később is emlékeztem rá”. A jelvények lehetnek könnyedek, de a tanuló elől semmilyen anyagot ne zárjon el egy megszakadt napi sorozat.

A menő elem az legyen, hogy a diák valóban irányít egy matematikai modellt: összehajt egy testhálót, átépít egy bizonyítást, megváltoztat egy grafikon jelentését, vagy megcáfol egy állítást. A jutalom vizuálisan rövid és kikapcsolható.

### 11.5. Három konkrét tanulói út

**Anna a százaléknál akad el.** Kiválasztja az aktuális témát. A belépőfeladat és egy tisztázó kérdés az alap megválasztásának nehézségére utal, ezért a rendszer százalékrácsot és két „minek a 100%-a?” példát kínál. Ezután visszatér az eredeti árproblémához. Az önálló feladat új számokkal és más kérdésiránnyal ellenőrzi a tanulást.

**Bence gyorsan számol, de összekeveri a képleteket.** A vegyes gyakorlóban a rendszer nem írja ki előre, hogy kerület vagy terület következik. Bencének ki kell választania, mit mér a helyzet, megadni az egységet, majd számolni. A javító feladat két azonos kerületű, eltérő területű téglalapot hasonlít össze.

**Csilla a nehezebb feladatokat keresi.** Kétféle érvényes egyenletmegoldást hasonlít össze, majd olyan feladatot készít, amelyben az egyik út rövidebb. A rendszer az általa készített egyenlet matematikai feltételét ellenőrzi, az általános magyarázathoz rubrikát ad. A további útvonalat Csilla választhatja.

---

<a id="fejezet-12"></a>

## 12. Képernyők, navigáció és vizuális világ

### 12.1. Az alapképernyők

| Képernyő | Elsődleges feladat | Kötelező elem | Kész feltétel |
|---|---|---|---|
| Kezdőlap | Elindulni vagy folytatni | Téma, elakadás és rövid gyakorlás választása | Belépés nélkül elérhető egy lecke |
| Tématérkép | Megtalálni az aktuális célt | Modul, előismeret, alap/bővítés címke | A tanuló tudja, hol tart és merre léphet |
| Lecke | Egy fogalom megértése | Kérdés, modell, magyarázat, kipróbálás | Nem kell a teljes tananyagot görgetni az első feladatig |
| Műhely | Egy változó és kapcsolat vizsgálata | Vezérlők, ábra, értékek, jóslat és következtetés | Ugyanaz a feladat húzás nélkül is elvégezhető |
| Gyakorló | Önálló megoldás | Egyértelmű kérdés, bevitel, segítség | A helyes alternatív választ is elfogadja |
| Magyarázó eredménylap | A saját megoldás megértése | Jó részek, első bizonyítható hiba, következő feladat | A visszajelzés után van érdemi újrapróba |
| Tudástérkép | Következő tanulási cél választása | Készségenként egyszerű bizonyíték és ajánlás | Nincs belőle képességdiagnózis vagy nyilvános rangsor |
| Szótár és eszköztár | Kifejezés vagy eszköz gyors megértése | Rövid definíció, kép/példa, kapcsolódó lecke | A tanuló az eredeti feladathoz vissza tud térni |
| Segítő nézet | Tanári/szülői támogatás | Tanulási cél, tipikus nehézség, megbeszélendő kérdés | Személyes adatok nélkül is hasznos |
| Beállítások | Használhatóság és saját adatok kezelése | Szövegméret, mozgás, kontraszt, export/import | Minden változtatás érthető, a törlés célzott |

### 12.2. Vizuális irány

A hangulat legyen egy korszerű, barátságos műhelyé: világos felületek, jól olvasható betűk, néhány következetes szín, pontos ábrák, nyugodt mozgás. A 13–14 éves célcsoportnak szánt megjelenés kerülje az óvodás díszítést. Az életkor itt a tervezett célcsoport jellemzője, nem regisztráció során bekérendő adat.

**Saját dizájndöntés:** az alapfelület világos, a matematikai kapcsolatokhoz négy jól elkülönülő szín tartozik. A sötét mód későbbi külön ellenőrzött téma lehet. A színek jelentése stabil: például az ismeretlen és az egység a mérleg mindkét oldalán ugyanúgy jelenik meg. A színen kívül felirat és minta is különböztessen.

**Látványos, de célt szolgáló megoldások:** átalakuló törtrács; lépésenként összehajtható háló; kiemelés a képlet és az ábra azonos részei között; a tanuló saját sejtésének összevetése a megfigyeléssel; paraméterváltozáskor együtt frissülő több reprezentáció.

Az animáció rövid legyen, és ne fusson a feladat elolvasása közben zavaró háttérként. A játékos kihívásoknak legyen világos matematikai céljuk. A sebesség jutalmazása csak az erre külön választott játékmódban jelenjen meg.

### 12.3. Mobilnézet

Telefonon a kérdés, a fő ábra és a válaszmező egymás alatt jelenik meg. A segédpanelek egyenként nyithatók. A képernyő-billentyűzet felnyitása ne takarja el a bevitt értéket vagy az ellenőrzés gombját. A koordinátarendszer és a térbeli nézet szükség esetén külön nagyítható felületet kapjon; a pontos számmezők mindig elérhetők maradjanak.

A tanuló töredékes időben is haladhasson: a már megválaszolt leckeállapotot megőrizzük, a következő megnyitáskor megmutatjuk a folytatás helyét. Közös eszközön vendégmód legyen a könnyen elérhető lehetőség.

### 12.4. Magyar matematikai nyelv

A megjelenítés magyar tizedesvesszőt és következetes egységjelölést használjon. A változó `x` és a szorzás jele ne legyen összetéveszthető. Koordinátapárnál például `(2; −3)` használható; a beviteli formátum mindig legyen látható.

A szótár egyszerű szavakkal magyarázza a pontos fogalmat: az „átfogó” a derékszöggel szemközti oldal; a „medián” a rendezett adatsor középső értéke, páros elemszámnál a két középső érték átlaga. A feladatban használt szakkifejezésre kattintás ne navigáljon el végleg a feladattól.

---

<a id="fejezet-13"></a>

## 13. Hozzáférhetőség és eltérő támogatási igények

### 13.1. Cél és bizonyítás

**Tervezési cél a WCAG 2.2 AA elveit követő, manuálisan is ellenőrzött működés.** Ez nem most megszerzett megfelelőségi minősítés. A W3C húzásra vonatkozó kritériuma külön indokolja az egyszerű mutatóval, húzás nélkül használható alternatívát. A billentyűzetes út emellett szintén szükséges. [TECH-05]

| Szükséglet | Kötelező tervezett megoldás | Ellenőrzés |
|---|---|---|
| Húzás nehéz vagy lehetetlen | Kijelölés és célérintés, ± gomb vagy pontos számmező | A teljes tanulási cél húzás nélkül elvégezhető |
| Billentyűzet használata | Szemantikus gombok, rendezett fókusz, látható aktív elem | Egér nélkül végigjárható lecke |
| Képernyőolvasó | Címsorok, mezőcímkék, állapotleírás, táblázatos ábraadat | Valós képernyőolvasós mintapróba |
| Gyengébb látás | Nagyítás, megfelelő kontraszt, rugalmas tördelés | 200%-os szövegnagyítás; a fő szöveg és vezérlők újratördelése 320 CSS-pixeles szélességnél |
| Színlátás eltérése | Szín mellé forma, minta, felirat | Színek nélkül is értelmezhető a feladat |
| Mozgásérzékenység vagy figyelem megőrzése | Mozgáscsökkentés, megállítás, kézi léptetés | A mozgás nem feltétele a válasznak |
| Szövegértési vagy munkamemória-terhelés | Egy lépés, rövid utasítás, visszanézhető feladat | A kezelést és a matematikát külön is el lehet magyarázni |
| Pontatlan érintés | Nagy kezelőszervek és megfelelő térköz | Telefonon nincs pixelpontos eltalálási kényszer |
| Gyenge internet vagy régebbi eszköz | Könnyű oldal, letölthető tananyag, egyszerű nézet | A fő tanulás 3D és videó nélkül is működik |

A WCAG célméret-kritériuma 24×24 CSS-pixeles minimumot és meghatározott kivételeket ír le. A projekt a fontos érintőgomboknál **44×44 CSS-pixeles saját célméretet** használjon. A két szám eltérő státuszú: az utóbbi termékdöntés. [TECH-06]

A szövegnagyítás és az újratördelés külön ellenőrzési szempont. A valóban kétdimenziós ábra külön görgethető régióba kerülhet, de ez nem mentesíti a kérdést és a kezelőszerveket a keskeny nézetben való használhatóság alól. [TECH-13] [TECH-14]

### 13.2. Képletek és ábrák

A képletek ne csak képként legyenek jelen. A KaTeX HTML+MathML kimenete hozzáférhetőbb alapot adhat, de a magyar szöveggel és célböngészőkkel történő tényleges használatot tesztelni kell. Ha a képleten belüli bejárás vagy matematikai felolvasás ezt indokolja, a MathJax alternatívát kínál. [TECH-03] [TECH-04]

A grafikon mellett elérhető legyen a tengelyek, a tartomány, az összetartozó értékek és a fő változás szöveges leírása. A testmodellnél laplista, nézetgomb és nyomtatható háló segít. Ezek lehetnek eltérő tanulási utak; azonos tanulási célt kell ellenőrizniük.

### 13.3. Egyéni támogatás diagnózis nélkül

A felület kérdezheti, hogy a diák kisebb lépéseket, több példát vagy nyugodtabb nézetet szeretne-e. Nem szükséges hozzá diagnózist, egészségügyi adatot vagy hivatalos besorolást bekérni. Az alkalmazás segítséget kínálhat, de sajátos nevelési igényhez igazolt speciális fejlesztőprogramként csak megfelelő szakmai ellenőrzés után írható le.

A lépésenkénti, közeli és világos utasításokra a W3C kognitív hozzáférhetőségi útmutatója ad további tervezési támpontot. Ez kiegészítő útmutató, nem önálló AA-megfelelőségi igazolás. [PED-09]

### 13.4. Nyomtatás és segítő használat

Minden alapleckéhez nyomtatható összefoglaló és azonosítható feladatcsomag tartozzon. A megoldókulcs külön jelenjen meg, hogy előbb önállóan lehessen dolgozni. A papíros változatban az interakció lépéseit kis ábrák, táblázat vagy kivágható modell helyettesítheti.

A segítő nézetben legfeljebb néhány fontos kérdés szerepeljen: „Mi volt most az egész?”, „Mit őrzött meg ez a lépés?”, „Milyen másik módszerrel ellenőriznéd?” A tanuló kész eredményének kikérdezése helyett a gondolatmenetet segítse elő.

---

<a id="fejezet-14"></a>

## 14. Technikai terv

### 14.1. Javasolt megoldás

**Vite + TypeScript + Preact; saját HTML/SVG interakciók; elkülönített matematikai motor; helyi haladásmentés; később verziózott offline csomag.** A Preact jelenleg elért v11 dokumentációja Vite-os indulást ismertet, a Vite pedig statikus buildet és helyi előnézetet dokumentál. A konkrét csomagverziók kiválasztása a fejlesztés elején, a tényleges környezet felmérése után történjen. [TECH-01] [TECH-02]

Ez saját architekturális döntés: a sok rokon tanulói vezérlő közös komponenseket indokol, a tananyag és a matematika külön modellje pedig csökkenti az ismétlődést. Ha a meglévő helyi környezet egy ellenőrzött React-alapot kínál, az elfogadható alternatíva; a diák számára ugyanazt a működést kell megvalósítania.

| Réteg | Feladat | Tervezett megoldás |
|---|---|---|
| Tartalom | Leckék, feladatcsaládok, magyarázatok | Verziózott Markdown és ellenőrzött strukturált adatok |
| Felület | Tanulási menet, vezérlők, visszajelzés | Preact-komponensek és szemantikus HTML |
| Matematikai mag | Pontos számolás, generálás, ellenőrzés | Szűk, típusos, determinisztikus függvények |
| Ábrák | Számegyenes, grafikon, geometria | Elsősorban SVG; közös koordináta- és címkerendszer |
| Képletek | Megjelenítés | KaTeX-jelölt helyi erőforrásokkal; hozzáférhetőségi próbával |
| 3D | Testhálók és térbeli nézetek | Külön betöltött modul; szükség esetén Three.js, egyszerű tartalékkal |
| Keresés | Téma, elakadás, szótár | Előállított kis helyi index, ékezet- és elírástűrés |
| Haladás | Tudásjelzések és folytatás | Egységes tárolófelület; kicsi adatokkal indulva |
| Offline | Tananyagcsomag és frissítés | Service worker és verziózott erőforrásjegyzék |
| Kiadás | Helyi ellenőrizhető build | Statikus fájlok; később GitHub Pagesre is illeszthető |

Élő LLM nélkül is elkészíthető az összes felsorolt alapfunkció. A magyarázatok szerkesztett mintákból és ellenőrzött feladatadatból állnak össze. A tanuló beírásának kiértékelése nem külső szolgáltatásba küldéssel történik.

### 14.2. A későbbi repozitórium szerkezete

Az alábbi útvonalak **tervezettek**, jelenleg nincsenek létrehozva alkalmazásfájlként.

| Tervezett hely | Tartalom és felelősség |
|---|---|
| `README.md` | Cél, helyi indítás, jelenlegi lefedettség, ismert korlátok |
| `docs/vision.md` | A jelen tervből származó döntések |
| `docs/curriculum-map.md` | Követelmény–egység–feladat–teszt kapcsolat |
| `docs/content-guide.md` | Magyar nyelvi és pedagógiai szerkesztési szabályok |
| `docs/accessibility.md` | Hozzáférhetőségi cél és tényleges ellenőrzési eredmények |
| `docs/validation.md` | Matematikai, technikai és tanulói ellenőrzés külön státusza |
| `docs/source-register.md` | Forrás, hozzáférési állapot, felhasználás és licenc |
| `content/modules/` | M00–M23 leckéi és tanulási céljai |
| `content/exercises/` | Eredeti szerkesztett feladatok és családleírások |
| `content/glossary/` | Magyar fogalomtár, szinonimák, kapcsolatok |
| `src/math/` | Számok, mértékegységek, kifejezések és ellenőrzők |
| `src/interactives/` | I01–I48 közös és témaspecifikus komponensei |
| `src/learning/` | Leckemenet, segítség és következő feladat |
| `src/progress/` | Helyi mentés, export/import, migráció |
| `src/ui/` | Vezérlők, navigáció, témák és hozzáférhető minták |
| `tests/math/` | Ismert eredmények, szélsőesetek és generátorinvariánsok |
| `tests/content/` | Azonosítók, hivatkozások, megoldásséma és lefedettség |
| `tests/e2e/` | Teljes tanulói utak és később offline/frissítési próbák |
| `public/` | Saját ábrák, helyi betűkészlet és ellenőrzött statikus erőforrások |
| `LICENSE`, `THIRD_PARTY_NOTICES` | A ténylegesen választott saját licenc és külső összetevők feltételei |

### 14.3. Mentés és adatkezelés

A kezdeti kis haladásadatot verziózott tárolómodul kezelje; nagyobb strukturált adattömeghez IndexedDB választható. Ne készüljön két, ugyanazt az adatot eltérően kezelő párhuzamos mentési rendszer. A böngésző tárolója törölhető, és a privát mód is korlátozhatja a megtartást, ezért a mentést exporttal is támogatni kell. [TECH-07] [TECH-08]

**Szükséges adatok:** véletlen helyi profilazonosító; készségazonosító; önálló vagy segített eredmény; ismétlési nap; tartalomverzió; megjelenítési beállítás. Név, e-mail, születési dátum, iskola vagy egészségügyi adat az alapműködéshez nem szükséges.

**A folytatáshoz szükséges munkamenet-állapot:** a lecke aktuális lépése, a feladat újrajátszási azonosítója, a feladatcsalád és a tananyagcsomag verziója, valamint az újraépítéshez szükséges válasz- és modellállapot. Ez a hosszabb távú készségjelzésektől elkülönülő adat. Szabad szöveges magyarázat tartós mentése külön, látható választás legyen; vendégmódban ne maradjon hátra a következő használónak.

Az exportált állapot legyen verziózott JSON. Import előtt a felület mutassa meg, melyik helyi állapotot fogja kiegészíteni vagy helyettesíteni. A hibás fájl ne törölje a meglévő adatot. A helyi törlés egyértelmű, külön művelet legyen. Egy gyakorlólink csak feladatazonosítót és újrajátszási paramétert hordozzon, személyes haladást ne.

Nyilvános tárhelyen a kiszolgáló saját hálózati naplózása külön kérdés. A projekt pontos állítása ezért az lehet, hogy **nem épít központi tanulói fiókot vagy tanulásiadat-gyűjtést**, és a saját előrehaladást helyben tárolja. A teljes internetforgalom hiányát csak a tényleges offline módnál lehet ellenőrizni.

### 14.4. Offline működés és frissítés

A service worker HTTPS-környezetben és helyi fejlesztésnél localhoston használható; egy letöltött HTML dupla kattintásos megnyitása nem ugyanaz a működési mód. Az offline funkciót a helyi vagy kiadott alkalmazás első teljes betöltése után lehet vizsgálni. [TECH-09]

**Tervezett működési rend:** a tanuló kiválaszt egy tananyagcsomagot; látja a méretét; a felület csak a teljes letöltés után jelzi, hogy a csomag kész. A feladatmotor, képletmegjelenítő, ábrák és magyarázatok is a csomag részei. Külső forrásokhoz internet szükséges; ezt külön jelöljük.

Új verzió előkészíthető a háttérben, de ne cserélje le a megoldásmotort egy aktív feladat közepén. A tartalom és az ellenőrző verziója maradjon összetartozó. Sikertelen frissítéskor az előző teljes csomag maradjon használható. A cache törlése ne törölje a haladást.

A mentésséma átalakítása másolaton történjen, és csak sikeres ellenőrzés után váltsa fel az eredetit. Egy korábbi tartalom- vagy motorverzióra visszaállás ne tegye olvashatatlanná a korábbi haladást: kompatibilis olvasó vagy változatlan adatexport mindig maradjon. Sikertelen migráció nem indokolhat automatikus adattörlést.

Minden tárolókulcs és cache a projekthez kötött névteret kapjon. Későbbi GitHub Pages-projekt esetén a service worker hatóköre az adott almappára korlátozódjon. Az összes böngészős helyi adat általános törlése nem része a projekt működésének.

### 14.5. GitHub és a 0 Ft-os cél

A GitHub Pages statikus kiadásra alkalmas, és a jelenlegi dokumentáció nyilvános repozitóriumnál Free-csomagos elérhetőséget ír le. A méret- és forgalomkorlátok miatt könnyű, saját tananyagot tervezünk. Későbbi projektoldalnál a Vite alapútvonalát, a mélylinkeket és a frissítést is a repó almappájával kell tesztelni. [TECH-10] [TECH-02]

A terv nem igényel fizetős API-t, saját domaint, felhős adatbázist, előfizetést vagy videótárat. A tényleges tárhelyfeltételeket majd a közzététel előtt újra ellenőrizzük. Jelenleg sem repozitórium-feltöltés, sem Pages-publikálás nem történik.

### 14.6. Külső anyagok és saját licencek

Saját magyar szöveg, saját feladat és matematikailag szerkesztett saját ábra készüljön. Az OH tankönyvi forrásai a megfeleltetést segítik; a megoldáskötet közzétételét a megnyitott kiadói oldal kifejezetten korlátozza. [TAN-04]

A GeoGebra kész termékének, anyagainak és forráskódjának feltételei eltérnek. A PhET jelenlegi hivatalos indexelt licencszövege a normál HTML-szimulációkhoz CC BY-NC 4.0-t jelöl; a konkrét fájl felhasználását ettől függetlenül is ellenőrizni kell. A Desmos API saját feltételrendszerrel működik. Ezeket ezért elsőként inspirációs és kiegészítő hivatkozásként kezeljük. [JOG-01] [JOG-02] [JOG-03]

A kiválasztott fejlesztői könyvtárak licenceit a tényleges verziókkal együtt leltározzuk. A Vite, Preact és KaTeX projektlicence MIT, a TypeScripté Apache-2.0; ez nem szünteti meg a terjesztéskor szükséges licencek és értesítések megőrzését. [LIC-01] [LIC-02] [LIC-03] [LIC-04]

A saját kód és saját oktatási tartalom közzétételi licence a nyilvános kiadás előtt tudatos tulajdonosi döntés legyen. A helyi megvalósítást ez nem akadályozza; a mostani terv nem tesz közzé és nem ruház át tartalmi jogokat.

---

<a id="fejezet-15"></a>

## 15. Tartalommodell és matematikai ellenőrzés

### 15.1. Egy tanulási egység adatlapja

| Mező | Elvárt tartalom |
|---|---|
| `id`, `version` | Stabil M-azonosító és verzió |
| `goal` | Egy ellenőrizhető „meg tudom…” cél |
| `curriculum` | Témakapcsolat, forrás, címke, ellenőrzési státusz |
| `prerequisites` | Rövid, célzott előismereti kapcsolatok |
| `openingProblem` | A fogalmat bevezető saját kérdés |
| `representation` | A kiválasztott modell és alkalmazási korlátja |
| `explanation` | Magyar magyarázat a szükséges mélységi szinteken |
| `workedExample` | Megoldási lépések és külön indokok |
| `practice` | Szerkesztett feladatok és generátorcsaládok |
| `misconceptions` | H-azonosítók és megkülönböztető kérdések |
| `interactives` | Kapcsolódó I-azonosítók és egyszerű alternatívák |
| `exitEvidence` | Milyen feladat igazolja a célt? |
| `review` | Matematikai, nyelvi, hozzáférhetőségi és forrásellenőrzés állapota |

### 15.2. Választípusok

Számérték, pontos tört, adott pontosságú közelítés, mértékegységes mennyiség, koordinátapár, több elemből álló halmaz, intervallum, korlátozott betűs kifejezés, rendezett megoldáslépés, választott indok, geometriai feltétel és szabad saját magyarázat külön választípus legyen.

A feladat előre mondja meg, mit vár. Ha pontos alak szükséges, ezt jelezze. Ha kerekített eredményt kér, legyen megadva a pontosság. Ha több megoldás lehetséges, a rendszer feltételeket ellenőrizzen egy titkos mintamondat helyett.

### 15.3. Matematikai szabályok a motorhoz

| Terület | Követelmény | Kötelező ellenpélda vagy szélsőeset |
|---|---|---|
| Tört | Pontos számláló/nevező; egységes előjel; nem nulla nevező; érték és kért alak külön ellenőrzése | `2/4 = 1/2`; ha egyszerűsített alakot kérünk: „helyes érték, még egyszerűsíthető” |
| Tizedes | Egyértelmű magyar vessző és elfogadott pont; normalizált előnézet | `0,75`; `0.75`; kétértelmű `1,2,3` visszakérdezése |
| Közelítés | Feladathoz kötött tűrés és kerekítési szabály | A pontos `1/3` és a `0,33` megkülönböztetése |
| Előjel és hatvány | Tanult műveleti elsőbbség | `−3² = −9`, `(−3)² = 9` a bővítő nyelvtanban |
| Szorzás/osztás | Osztó nem nulla; ekvivalens lépés visszafordítható | `x = 5` nem azonos információ a `0x = 0` állítással |
| Algebrai azonosság | Korlátozott polinomok pontos normalizálása | `2(x+3)` és `2x+6`; `2x+3` és `5x` |
| Értelmezési tartomány | Kifejezés értéke és megengedett helyettesítés együtt | `x/x` és `1` nem azonos tartományú |
| Egyenlet | Megoldás és visszahelyettesítés; tanított esetben megoldáshalmaz | Egy megoldás, ellentmondás, azonosság |
| Egyenlőtlenség és intervallum | A reláció és a teljes megoldáshalmaz ellenőrzése, nyitott/zárt végponttal | `−2x < 6` megoldása `x > −3`; a `−3` végpont nem része a halmaznak |
| Gyök | Nemnegatív főérték; a támogatott pontos alakok köre rögzített | `√16 = 4`; az `x² = 16` más kérdés |
| Mértékegység | Érték és dimenzió együttes ellenőrzése | `100 cm = 1 m`, de `1 m ≠ 1 m²` |
| Százalék | A viszonyítási alap a modell része | Két egymást követő változás |
| Geometria | Érvényes adatok és matematikai relációk | Háromszög-egyenlőtlenség; derékszög hiánya |
| Statisztika | Rendezés, elemszám, több módusz kezelése; a móduszkonvenció rögzítése | Páros elemszám; azonos gyakoriságoknál a feladat szerint több módusz vagy nincs egyedi módusz |
| Kombinatorika | Sorrend, szerep és ismétlés külön szabály | Két képviselő vs. kapitány/helyettes |
| Véletlen | Dokumentált mintatér és újrajátszható sorozat | Az összegek nem egyenlő esélyű elemi kimenetek |

### 15.4. Biztonságos és kiszámítható bevitel

A matematikai bevitelt engedélyezett műveletekből álló, korlátozott nyelvtan dolgozza fel. Nincs JavaScript-`eval` vagy tetszőleges kódfuttatás. Legyen hossz-, beágyazási mélység-, számméret- és kitevőkorlát. Az implicit szorzást, vegyes számot és tizedesvesszőt a kiválasztott nyelvtan szerint, előnézettel kell kezelni.

A Math.js saját dokumentációja is jelzi a kifejezéskiértékelés biztonsági és erőforrás-korlátait. Ha erre a könyvtárra később szükség lesz, korlátozott integráció készüljön; a teljes általános számítógépes algebrai rendszer nem előfeltétele az első kiadásnak. [TECH-11]

Az első helyi változatban a szám-, tört-, egyszerű egyenlet- és indoklásválasz elegendő. A tetszőleges gyökkifejezés és algebrai tört automatikus ekvivalenciája csak külön, igazolt bővítési feladatként kerüljön be.

### 15.5. Példa egy későbbi feladat-adatlapra

| Tulajdonság | Tervezett tartalom |
|---|---|
| Család | `eq-linear-group-v1` |
| Cél | Egyenlőség megőrzése és két út felismerése |
| Kapcsolat | M10.05, I19, H22–H23 |
| Modell | `a(x + b) = c`, nem nulla `a` |
| Paraméterezés | Előre választott megoldásból számított jobb oldal |
| Elfogadás | Helyes megoldás + opcionálisan ellenőrzött részlépések |
| Magyarázat | Osztásos és zárójelbontásos út, helyettesítési ellenőrzés |
| Hibakezelés | Hiányos disztributivitás; csak egyik oldal módosítása |
| Kilépő feladat | Új előjelű vagy új szövegkörnyezetű feladat |
| Minőség | Kézi referencia és a generátortól elkülönített visszahelyettesítés |

Ez adatmodell-javaslat, nem most létrehozott programfájl. A fejlesztéskor a ténylegesen támogatott eseteket egyértelműen korlátozni és tesztelni kell.

---

<a id="fejezet-16"></a>

## 16. Minőségbiztosítás és tanulói kipróbálás

### 16.1. Mit kell külön bizonyítani?

Egy matematikailag helyes program még lehet nehezen használható, és egy könnyen használható program mellett sem biztos, hogy a tanuló később önállóan tudja alkalmazni az anyagot. A projekt hat, egymást nem helyettesítő ellenőrzési eredményt tartson számon.

| Ellenőrzési szint | Döntő kérdés | Elfogadható bizonyíték |
|---|---|---|
| Tantervi lefedettség | A vállalt követelményhez tényleg tartozik tananyag? | Követelmény → egység → magyarázat → feladat → ellenőrzés mátrix, ellenőrzött forráshellyel |
| Matematikai helyesség | Minden támogatott esetben helyes a kérdés, a válasz és az indok? | Független referenciák, szélsőesetek, családonként vizsgált feltételek |
| Felületi működés | A tanuló végig tudja járni a választott utat? | Valós böngészőben megoldott teljes feladatsor, beleértve a hibát és újrapróbát |
| Hozzáférhetőség | A lényegi cél eltérő kezeléssel is elérhető? | Billentyűzetes, húzás nélküli, nagyított és képernyőolvasós mintapróba |
| Adat- és offline működés | A folytatás, frissítés és helyreállítás működik? | Megszakított munkamenet, offline újranyitás, sikertelen import/frissítés és export visszaellenőrzése |
| Tanulási használhatóság és eredmény | Érti a tanuló, miért működik, és át tudja vinni új helyzetre? | Saját magyarázat, korábban nem látott feladat, késleltetett feladat; valódi kipróbálásból származó megfigyelés |

Az automatikus teszt az első öt szint egy részéhez adhat bizonyítékot. A tényleges tanulási eredményt nem helyettesíti. A mostani dokumentumban leírt ellenőrzések jövőbeli elfogadási feltételek; nem már lefutott alkalmazástesztek.

### 16.2. Matematikai ellenőrzés

Minden feladatcsaládhoz legyen legalább egy kézzel megoldott referencia, egy jellegzetes hibás válasz, egy másik helyes megoldásalak, ha van ilyen, és a tartomány széléhez tartozó eset. A tesztmennyiség a kockázatot kövesse. Az osztás, a mértékegység, a véletlen és a generált geometria több szélsőesetet igényel, mint egy egyszerű szótári kártya.

**A generátor saját válasza nem lehet az egyetlen ellenőrzője.** Például az egyenlethez eltárolt megoldást visszahelyettesítéssel is ellenőrizzük; a törtműveletnél a pontos racionális eredményhez kézi esetek tartoznak; a kombinatorikai kis tartományt teljes felsorolás ellenőrzi. Két függvény ugyanazzal a téves képlettel nem ad független bizonyítást.

| Feladatcsalád | Fontos invariáns | Kötelező hibavédelem |
|---|---|---|
| Törtművelet | Összeadásnál és kivonásnál közös egész; minden műveletnél a mennyiségek és az eredmény egysége megfelel a feladat értelmezésének | Nulla nevező, hibás egyszerűsítés, pontatlan tizedes-elfogadás |
| Százalék | A szöveg, a viszonyítási alap és a művelet egyezik | Változó alap, 100% és 1% összekeverése |
| Lineáris egyenlet | Az eredeti egyenletben ellenőrizhető a megoldás | Nulla osztó, véletlen azonosság, indokolatlan megoldásvesztés |
| Grafikon | A pont, táblázat, mértékegység és képlet ugyanarra a modellre utal | Nem egységnyi skála, meg nem engedett tartomány |
| Geometria | A számadatokhoz létezik a leírt alakzat | Háromszög-egyenlőtlenség, téves átfogó, képernyőn mért érték összetévesztése a pontos adattal |
| Valószínűség | A felsorolt elemi kimenetek teljesek, a valószínűségek összege 1 | Eltérő esélyű események azonosként kezelése |
| Statisztika | Az adatlista, ábra és számítás ugyanazt az adathalmazt használja | Rendezés hiánya, páros elemszám, nem egyedi módusz |

### 16.3. Teljes tanulói utak ellenőrzése

Az első hat út mindegyikét a következő valós használati menettel kell végigpróbálni: megnyitás → jóslat → interakció → hibás válasz → célzott segítség → újrapróba → önálló kilépő feladat → bezárás és folytatás. Ezután ugyanaz a tanulási cél billentyűzettel és keskeny képernyőn is követhető legyen. A 3D vagy mozgás kikapcsolása ne tegye megoldhatatlanná a leckét.

A matematikai motor tesztje mellett kézzel ellenőrizni kell a megjelenő mondatokat és ábrákat is. Egy helyes belső eredmény hibás egységgel vagy rossz felirattal már rossz tananyag.

A későbbi offline próba kapcsolja le a hálózatot a teljesen letöltött csomag után, majd indítsa újra az oldalt. Külön eset a félbeszakadt csomagletöltés, a tárhely megtelése, a tartalomfrissítés és a sérült import. Siker esetén az eredmény konkrét verzióhoz és környezethez kötött jegyzőkönyv legyen.

### 16.4. Valódi tanulói kipróbálás

**Első kör: használhatósági próba.** Tervezési kiindulásként 6–10 önkéntes tanuló eltérő előismerettel és egy vagy két matematikatanár bevonása hasznos lehet; ez a létszám nem hatásossági bizonyítás. A későbbi szervezés és szükséges hozzájárulások külön valós lépést jelentenek. Jelen munkában senkit nem keresünk meg és tanulói adatot nem gyűjtünk.

A kipróbálás során néhány konkrét kérdésre keresünk választ: érthető-e az utasítás, tudja-e a tanuló, mit változtatott a modellen, meg tudja-e magyarázni az ábra és a művelet kapcsolatát, segít-e a visszajelzés a következő próbában. A megfigyeléshez elég lehet személyhez nem kötött hibajegyzék; nem szükséges képernyővideó vagy teljes beszélgetés mentése.

**Második kör: tanulási ellenőrzés.** Rövid előzetes feladat, új szövegű vagy más reprezentációjú utófeladat, majd késleltetett visszatérés mutassa meg, mi maradt meg. Az azonnali javulás lehet ismerősség vagy segítség eredménye is. A projekt csak olyan eredményességi állítást tegyen, amelyet az alkalmazott vizsgálat alátámaszt.

**Harmadik kör: javítás és ismételt próba.** A megakadás okát különítsük el: matematikai előismeret, nyelv, felület vagy hibás tartalom. A javított részt új feladattal ellenőrizzük. Általános „tetszett/nem tetszett” értékelés önmagában nem zárhat le egy feltárt megértési problémát.

### 16.5. Mikor kész egy egység, modul és kiadás?

| Szint | Kész feltétel |
|---|---|
| Egy tanulási egység | Világos cél; pontos előismeret; indokolt modell; legalább egy magyarázott példa; külön önálló feladat; célzott visszajelzés; matematikai és nyelvi ellenőrzés |
| Egy interaktív műhely | Előrejelzés és következtetés kapcsolódik hozzá; az értékek és ábra egyeznek; alaphelyzetbe állítható; húzás nélkül használható; van külön megértési feladat |
| Egy feladatcsalád | Leírt tartomány; ismételhető azonosító; függetlenül ellenőrzött eredmény; helyes alternatívák; hasznos hibaválasz; nincs hibás generált eset a célzott ellenőrzésben |
| Egy modul | Minden vállalt célhoz létezik a teljes tanulási lánc; a témakörzáró új feladatot is tartalmaz; az előismereti visszalépés visszavezet |
| Első helyi bemutatható változat | A hat kijelölt tanulási út teljesen végigjárható; a kész tartalom és a még tervezett rész világosan elválik |
| Teljes helyi 1.0 | A vállalt törzsanyag lefedett; a tervezett és elkészült bővítések tételesek; az integrált ellenőrzések eredménye és ismert korlátja dokumentált |
| Nyilvános kiadás | A helyi feltételek mellett lezárt forrás- és licencellenőrzés, ismét ellenőrzött tárhelyfeltételek és aktuális közzétételi felhatalmazás |

A forráshely hiánya, az alternatív helyes válasz elutasítása vagy az ismeretlenül hibás matematikai mag nyitott hibaként maradjon látható. Egy látványos képernyőkép nem zárja le ezeket.

---

<a id="fejezet-17"></a>

## 17. Fokozatos lokális megvalósítás

### 17.1. Négy fázis és egyértelmű átadás

| Fázis | Eredmény | Megnyitás feltétele | Lezárás bizonyítéka |
|---|---|---|---|
| **I. Anyaggyűjtés és terv** — most | Jelen egyetlen Markdown-dokumentum, forrásjegyzékkel és konkrét mintákkal | A jelen kérés | Ellenőrzött belső azonosítók, mintaszámítások, forrásstátuszok és teljes terv |
| **II. Első teljes helyi tanulási utak** | A közös keret és hat végigjárható, magyarázattal és gyakorlással kész út | A felhasználó „tovább” jelzése | Valós helyi böngészős használat, matematikai ellenőrzés, működő folytatás |
| **III. A tartalom fokozatos teljessé tétele** | A 24 modul vállalt egységei és a 48 műhely, indokolt ütemezésben | A helyi fejlesztés már engedélyezett, az első minták ellenőrzöttek | Modulonként lezárt lefedettségi és minőségi eredmény |
| **IV. Integrált helyi kiadásellenőrzés** | Mobilon is ellenőrzött, menthető, frissíthető, dokumentált helyi változat | A szükséges tartalom és technikai rétegek elkészültek | Kiadási jegyzőkönyv, tényleges korlátlista, forrás- és licencleltár |

A „tovább” a helyi megvalósításra ad következő felhatalmazást. A II–IV. fázis szokásos, visszafordítható helyi munkáihoz nem kell minden apró lépésnél új engedélyt kérni. GitHub-létrehozás, feltöltés és nyilvános kiadás a jelen fázistervben nincs engedélyezve. A tanulói kipróbálás megszervezése sem jelent automatikus kapcsolatfelvételt.

### 17.2. Az első hat teljes út

| Sorrend | Tanulási út | Első fogalmi cél | Műhely és gyakorlás | Miért ezzel próbáljuk ki a rendszert? |
|---|---|---|---|---|
| 1 | Törtek | Azonos egész, közös egység, összeadás jelentése | Törtsáv/rács, saját magyarázat, pontos törtválasz | Megmutatja, hogyan kapcsolódik a kép a jelöléshez és a számoláshoz |
| 2 | Százalék | A 100% megnevezése; változó viszonyítási alap | Csúszka, ár- és mennyiségmodell, fordított kérdés | A jó számolás és a helyes modell eltérését teszi láthatóvá |
| 3 | Egyenletek | Az egyenlőség megőrzése és ellenőrzés | Mérleg, visszafelé gondolkodás, két megoldási út | Kipróbálja a lépésekhez kapcsolt indoklást és a célzott segítséget |
| 4 | Grafikonok | Mennyiség, táblázat, pont és szabály összekapcsolása | Pontszerkesztés, változó skála, alapdíjas példa | Ellenőrzi a több reprezentáció közötti átjárást |
| 5 | Pitagorasz | A tétel feltétele és területi kapcsolata | Négyzetek, átdarabolás, új alkalmazási helyzet | Elválasztja a szemléltetést, az indoklást és az alkalmazást |
| 6 | Valószínűség | Teljes mintatér és egyenlő esélyű elemi kimenetek | Kétkockás tábla, kísérletsor, pontos arány | Megtanítja az elméleti számítás és a véletlen megfigyelés különbségét |

Egy teljes út több rövid egységből állhat. Az első kör célja nem mind a 137 egység látszólagos jelenléte. A kezdőfelületen csak a ténylegesen használható leckék jelölhetők késznek; a további témák a tantervben láthatók, egyértelmű státusszal.

### 17.3. A bővítés sorrendje

Először a matematikai alapmotor és az első törtes út készüljön el. Ezután a további öt út az új igények szerint bővítse a közös elemeket. A tananyag megírása és matematikai ellenőrzése megelőzi az adott műhely látványos megvalósítását: így a komponens valós feladatot szolgál.

A következő bővítési kör az előismereti hiányokat zárja: számolás, előjelek, arány, mértékegység, betűs kifejezések. Ezután a geometria, térszemlélet, szöveges problémák, statisztika és rendszerezett gondolkodás teljes moduljai következhetnek. A formális bővítések és a felvételi konfiguráció a forrásellenőrzésüknek megfelelő állapotban kapcsolódnak be.

Az offline csomagolást a stabil leckemenetre és mentési sémára építjük. A 3D nézet ott kerül előre, ahol a térbeli kapcsolat megértéséhez valódi többletet ad; a kétdimenziós magyarázat és a vezérlés már előtte működjön. A 48 műhely sorszáma azonosító, nem önmagában végrehajtási sorrend.

### 17.4. Idő és terjedelem kezelése

A teljes projekt számára a környezet és az első működő egység tapasztalata nélkül nem indokolt pontos napígéretet adni. A haladás mércéje az elfogadott teljes tanulási út, majd a lezárt modul legyen. A 120–180 feladatcsalád sem előzetesen késznek tekintett készlet: a valóban különböző tanulási célok és hibák alapján bontjuk fel.

Minden bővítési kör végén három dolgot rögzítünk: **mi készült el, mivel ellenőriztük, mi a következő konkrét hiány**. Ha egy ismert matematikai vagy tanulhatósági hiba marad, az adott rész visszakerül javításra. Nem szükséges emiatt az összes más, már bizonyított részt újraírni.

---

<a id="fejezet-18"></a>

## 18. Atomi munkacsomagok és kész feltételek

**Az alábbiak jövőbeli feladatok. Ebben a körben kizárólag a terv készül.** A „tovább” a helyi fejlesztést indítja; nem jelent GitHub-feltöltést, belépést, közzétételt vagy költségengedélyt.

### 18.1. A feladatok végrehajtási egysége

A táblázat **35 munkacsomagsablont** tartalmaz. Egy példány mindig egy lezárt tárgyra vonatkozik: egy lecke, feladatcsalád, vezérlő, matematikai művelet, hibajegy vagy ellenőrzési eset. A sablon ismétlése új példányazonosítót kap, például `A14-M02.05-v1`. Ezért a 35 sor nem a teljes projekt összes végrehajtandó lépésének száma.

Az előfeltétel hivatkozása a megfelelő konkrét példányt jelenti. Egy blokk több függő eredményét nem szabad egy „kész” címkével elfedni. Ha a végrehajtáskor egy csomag még túl nagy, tovább bontjuk; minden gyermeknek külön kimenete és ellenőrizhető kész feltétele lesz.

A szerzői tervezet, a matematikai átnézés, a működő program és a tanulói kipróbálás külön eredmény. A következő csomag csak a szükséges előfeltétel igazolt elkészülte után indul.

### 18.2. Közös helyi alap

| ID | Egy művelet | Előfeltétel | Kimenet és kész bizonyíték |
|---|---|---|---|
| A01 | A helyi futtatókörnyezet felmérése | „Tovább” jelzés | Tényleges runtime-, böngésző- és eszközleltár; a hiányok elkülönítve |
| A02 | A függőségi verzióterv rögzítése | A01 | Környezettel összeegyeztethető verziójegyzék; nincs fizetős szolgáltatás |
| A03 | Az elkülönített helyi projektváz létrehozása | A02 | Helyi fájlok és pontos munkamappa; nincs távoli repozitórium |
| A04 | A rögzített ingyenes függőségek telepítése | A03 | Visszaolvasott csomagzár és tényleges telepítési eredmény |
| A05 | A helyi alapoldal elindítása | A04 | Megnyitott helyi oldal és látható működő kezdőállapot |
| A06 | A tananyagegység sémájának elkészítése | A03; 15. fejezet | Egy verziózott séma; kötelező mezők és hivatkozási szabályok |
| A07 | A haladás- és munkamenetséma elkészítése | A06 | Külön haladás, folytatási állapot és sémaverzió; szükségtelen személyes adat nélkül |
| A08 | Egy matematikai alapművelet megvalósítása | A04; rögzített számtartomány | Egy pontosan körülhatárolt művelet, például racionális számok összeadása |
| A09 | Egy matematikai komponens független ellenőrzése | Az adott A08, A20 vagy A21 | Referenciaesetek és szélsőesetek eredménye; a referencia nem ugyanaz a számítás |
| A10 | Egy közös kezelőelem megvalósítása | A05 | Egy bevitel vagy vezérlő működő példánya, dokumentált állapottal |
| A11 | Egy kezelőelem hozzáférhetőségi ellenőrzése | Az adott A10 | Egy konkrét kezelési mód próbájának eredménye; eszköz és korlát rögzítve |
| A12 | Egy helyi mentési művelet megvalósítása | A07 | Egy olvasási, írási vagy migrációs művelet; célzott névtérrel |
| A13 | Egy mentési/visszaállítási eset ellenőrzése | A12 szükséges példányai | Újranyitás után egyező állapot, vagy helyesen kezelt hiba; ellenőrzési jegyzet |

### 18.3. Ismétlődő csomagok a hat teljes tanulási úthoz

Az A14–A24 sablonok ugyanabban a rendben alkalmazhatók a **tört, százalék, egyenlet, grafikon, Pitagorasz és valószínűség** útvonalára. A konkrét tanulási egységet és a kapcsolódó I-azonosítót minden példány elején rögzítjük. Egy teljes út több szerkesztett feladatot is tartalmazhat, ezért egyes sablonok ugyanazon útvonalon belül is ismétlődnek.

| ID | Egy művelet | Előfeltétel | Kimenet és kész bizonyíték |
|---|---|---|---|
| A14 | Egy lecke eredeti szövegének megírása | A06; kijelölt tanulási cél | Sémának megfelelő lecke: kérdés, magyarázat, példa és alkalmazási határ |
| A15 | Egy feladatcsalád szerzői adatlapjának megírása | A14; 9.3 | Paraméterek, kizárások, megoldás, segítségek és kilépő feladat egy adatlapban |
| A16 | Egy lecke matematikai átnézése | Az adott A14 | Állításonkénti ellenőrzési jegyzet; javítandó részek vagy indokolt elfogadás |
| A17 | Egy feladatcsalád matematikai átnézése | Az adott A15 | Független megoldások és érvényes tartomány; a bizonytalan esetek kizárva |
| A18 | Egy lecke nyelvi-pedagógiai szerkesztése | A16 után javított lecke | Követhető utasítások, következetes fogalmak és megőrzött matematikai jelentés |
| A19 | Egy interaktív műhely megvalósítása | A16–A18; szükséges A09–A11; műhelyadatlap | Működő modell, jóslat és visszajelzés; azonos célú egyszerű kezelés |
| A20 | Egy feladatgenerátor megvalósítása | A17; szükséges A09 | Újrajátszható példányok; a jóváhagyott paramétertartományon belül |
| A21 | Egy válaszellenőrző megvalósítása | A17; szükséges A09 | Megadott választípusra korlátozott ellenőrző; elfogadott alakok rögzítve |
| A22 | Egy teljes tanulási út összeillesztése | A18–A21; új komponensek A09-e; szükséges A13 | Lecke → kipróbálás → önálló feladat → magyarázat → folytatás helyben elérhető |
| A23 | Egy teljes tanulói út referenciaesetének lefuttatása | Az adott A22 | Tényleges bemenet, eredmény és visszajelzés; hibás és helyes válasz külön eset |
| A24 | Egy tanulási út hozzáférhetőségi esetének lefuttatása | Az adott A22 | Dokumentált mobilos, billentyűzetes vagy képernyőolvasós eset; nincs feltételezett siker |
| A25 | Egy önkéntes tanulói kipróbálás lebonyolítása | Kipróbálható A22; külön egyeztetett résztvevő | Név nélküli megfigyelési jegyzet az elakadásról és új feladat megoldásáról |
| A26 | Egy bizonyított hiba javítása | Konkrét hibajegy | Körülhatárolt javítás; az érintett A09/A13/A23/A24 eset újrafuttatandó |

A25 külön bizonyítási ág: **résztvevő nélkül nem történt tanulói kipróbálás**, és ezt sem szintetikus profil, sem másik AI visszajelzése nem helyettesíti. Hiánya nem akadályozza a helyi alkalmazás elkészítését, de az eredmény nem nevezhető tanulókkal igazoltan beváltnak. Külső személy megkeresése és szervezése nem következik automatikusan a fejlesztési engedélyből.

### 18.4. Bővítés és integrált ellenőrzés

| ID | Egy művelet | Előfeltétel | Kimenet és kész bizonyíték |
|---|---|---|---|
| A27 | Egy verziózott helyi build elkészítése | Az adott kiadás kötelező útjai ellenőrzöttek | Azonosítható statikus kiadás és buildnapló |
| A28 | Egy modulok közötti tanulási út ellenőrzése | A27 | Célzott visszalépés után az eredeti feladat folytatható; a haladás helyes |
| A29 | Egy verziózott offline csomag kialakítása | A27; 14.4 | Csomagjegyzék és együtt kezelt tartalom/motor; a letöltési készállapot ellenőrizhető |
| A30 | Egy offline használati eset lefuttatása | A29 | Hálózat nélkül újranyitott lecke és működő feladatmagyarázat |
| A31 | Egy frissítési/visszaállítási eset lefuttatása | Két releváns kiadás; A12 migráció | Az aktív feladat és a korábbi haladás a kijelölt forgatókönyv szerint megmarad |
| A32 | Egy adatátviteli művelet megvalósítása | A07; A12 | Export vagy import egy verziózott formátumra; importnál előnézet és érvényesítés |
| A33 | Egy export/import eset ellenőrzése | A32 szükséges példányai | Tiszta helyi profilra visszaolvasott, összehasonlított állapot; hibás fájl külön eset |
| A34 | Egy modul lefedettségének összevetése a tervvel | Modul A14–A24 példányai | Egységenként látszó kész/hiányzó állapot; nincs darabszámból feltételezett teljesség |
| A35 | Egy integrált kiadási kritérium független auditja | Ellenőrizhető A27 | Kritériumhoz kötött bizonyíték, eltérés és döntés; a kiadási státusz csak ezekből áll össze |

A hat kezdeti út után a **137 egységet és 48 műhelyt tartalmazó teljes rendszer további elemeire ugyanazok a szerzői, ellenőrzési és implementációs sablonok** alkalmazandók, az előismereti sorrendet követve. A két szám a teljes célterjedelem, nem a hat út után hozzáadandó új mennyiség. Nem minden egységhez kell új műhely: az ellenőrzött közös elemek újrahasználhatók.

Az ellenőrzési napló külön mutassa: szerzői tervezet; matematikailag átnézett; helyben működik; hozzáférhetőségét próbáltuk; tanulóval kipróbáltuk. Egy státusz nem helyettesíti a másikat. Az átnézésnél az is szerepeljen, emberi vagy géppel támogatott ellenőrzés történt-e.

<a id="fejezet-19"></a>

## 19. Kockázatok, nyitott kérdések és döntési napló

### 19.1. Konkrét kockázatok és korai jeleik

| Kockázat | Korai jel | Mérséklés |
|---|---|---|
| A terjedelem szétfeszíti a fejlesztést | Sok elkezdett műhely, egyetlen teljes leckeút sem | Előbb hat teljes út; további modul csak látható, ellenőrizhető egységekben |
| Bizonytalan tantervi címkézés | Egy bővítés forrás nélkül TÖRZS jelzést kap | Követelményenként forrás és ellenőrzési állapot; ideiglenes címke megőrzése |
| Generátor és megoldó ugyanazt a hibát ismétli | Minden automatikus teszt jó, a kézi példa hibás | Független referencia és visszahelyettesítés; hibás példány újrajátszási azonosítója |
| Helyes alternatív válasz elutasítása | Ekvivalens tört, egység vagy másik út hibásnak látszik | Érték, kért alak és megoldási módszer külön ellenőrzése |
| Látvány megértés nélkül | A diák mozgat, de új példát nem tud megoldani | Jóslat, indoklás és új helyzetű kilépő feladat |
| Hamis tudásjelzés | A megoldás megnyitása önálló sikernek számít | Segített és önálló teljesítmény külön adata; új példányon ellenőrzés |
| Mobilos vagy hozzáférhetőségi elakadás | Csak húzással működik; billentyűzet takarja a választ | Pontos mezők, alternatív kezelés és tényleges eszközpróba |
| Mentésvesztés vagy közös gépes keveredés | Újranyitáskor más állapot, privát mód után eltűnő haladás | Vendégmód, világos helyi státusz, célzott tárolás és export |
| Félbeszakadt frissítés | Régi lecke új ellenőrzővel, olvashatatlan mentés | Összetartozó verziók, másolaton migráció, megőrzött visszaállítási lehetőség |
| Külső erőforrásból működési/licencfüggés | Offline hiányzó képlet; beágyazás feltétele megváltozik | Saját tartalom, helyi erőforrás és tételes licencleltár |
| Túlzó pedagógiai állítás | „Mindenki megérti” technikai próba után | Célként fogalmazás; tényleges tanulói evidencia külön státuszban |
| Nem fenntartható tartalomjavítás | Ugyanaz a szabály több leckében eltérően változik | Stabil azonosítók, közös fogalomtár és érintett egységekre célzott újraellenőrzés |

### 19.2. Döntési napló

| Döntés | Állapot és indok |
|---|---|
| Most egyetlen részletes Markdown-terv készül | Kifejezett felhasználói keret; alkalmazásfejlesztés még nem indul |
| „Tovább” után helyi fejlesztés következik | Kifejezett munkasorrend; publikálási engedélyt nem jelent |
| Új külső költés 0 Ft | Alapkorlát; próbacsomag, kredites API és előfizetés nem szükséges |
| Magyar nyelv és magyar tantervi kapcsolatok | A jelen terv kiindulása; a konkrét iskolai sorrend később igazítható |
| Elsőként hat teljes tanulási út | Javasolt fejlesztési ütemezés; többféle matematikai és kezelési helyzetet vizsgál |
| Saját, szerkesztett magyarázat és feladat | A pontosság, egységes tanítás és karbantarthatóság alapja |
| Élő LLM nélkül működő ellenőrzés | Determinisztikus visszajelzés, offline lehetőség és költségmentes alapműködés |
| Preact/Vite/TypeScript a kezdő műszaki irány | Tervezői választás; tényleges verzió A01–A02 után rögzíthető |
| Helyi haladás és vendégmód | Fiók nélkül is használható; központi tanulói adatgyűjtés nem része az alapnak |
| Közzétételi licenc és GitHub-kiadás később | A kész helyi eredmény alapján eldönthető; a mostani munkát nem blokkolja |

### 19.3. Nyitott, jelenleg nem blokkoló kérdések

A konkrét iskolai tankönyv, a tanár éves sorrendje és a felvételi hangsúlya később pontosítható; addig a jelölt tantervi rétegek és több belépési út működik. A projekt munkacíme és alapvető vizuális iránya elegendő a helyi kezdéshez; végleges arculatot nem kell előre eldönteni.

A célböngészők listáját a rendelkezésre álló környezet alapján rögzítjük, a valódi mobilos és képernyőolvasós próbák hiányát pedig feltüntetjük. A KaTeX–MathJax választásnál a mintalecke hozzáférhetőségi eredménye dönthet, nem a mostani terv végleges ígérete.

Tanári és tanulói kipróbálás akkor kerül szervezésre, amikor van használható helyi változat és erre külön megállapodás. Addig a matematikai és technikai ellenőrzés elvégezhető. A lehetséges későbbi nyilvános cím, repónév és saját tartalmi licenc ráér a publikálásról szóló döntésig; most egyik sem indokol belépést vagy feltöltést.

---

<a id="fejezet-20"></a>

## 20. Forrásjegyzék és felhasználási térkép

### 20.1. Hogyan olvasható a jegyzék?

**Ellenőrzés dátuma: 2026. november 6.** A „megnyitott” az itt felhasznált releváns tartalom ellenőrzését jelenti, nem az egész webhely minden oldalának auditját. A nem hozzáférhető anyagok kutatási feladatként maradnak a jegyzékben. Az elérési hiba nem bizonyítja, hogy a dokumentum más böngészőből vagy később is elérhetetlen.

Az egyes források rövid értelmezése a tervezéshez készült. A tananyag-mondatok, a mintafeladatok, a műhelykatalógus, az adatmodell és a munkasorrend saját javaslatok. Az olvashatóság vagy az ingyenes használat nem azonos az anyag szabad újraközölhetőségével.

### 20.2. Tanterv, tankönyv és hivatalos felvételi forráshelyek

| ID | Forrás | Hozzáférés és státusz | Szerep a projektben |
|---|---|---|---|
| TAN-01 | [110/2012. (VI. 4.) Korm. rendelet; Nemzeti alaptanterv, egységes szöveg][TAN-01] | **ELLENŐRZÖTT:** a matematikai tanulási eredmények releváns részei megnyíltak. | A 3–5. fejezet tantervi kerete; évfolyamcsoportos célok, nem kész nyolcadikos leckesorrend. |
| TAN-02 | [OH: kerettantervek az általános iskola 5–8. évfolyamára][TAN-02]; [Matematika kerettanterv DOCX](https://www.oktatas.hu/pub_bin/dload/kozoktatas/kerettanterv/Matematika_F.docx) | **FELLELT, NEM ELLENŐRZÖTT:** közvetlen elérési hibák miatt a teljes dokumentum nem volt olvasható. | A konkrét törzscélok végső megfeleltetéséhez újra ellenőrizendő. |
| TAN-03 | [Útmutató a matematika tantárgy tanításához, Oktatás 2030, 2020][TAN-03] | **ELLENŐRZÖTT:** hivatalos módszertani PDF, a 7–8. évfolyam és a változások releváns részei. | A tantervi célok értelmezése és a korábbi követelményekhez képesti hangsúlyok. |
| TAN-04 | [Tankönyvkatalógus: OH-MAT08TB, Matematika 8.][TAN-04] | **ELLENŐRZÖTT:** katalógus, 2026/27-es jegyzékadat és NAT 2020 jelölés; a teljes könyv nem ebből olvasható. | Konkrét tankönyvi forrás és csatolmányok azonosítása; felhasználási korlátok. |
| TAN-05 | [Tankönyvkatalógus: OH-MAT08TA][TAN-05]; [teljes tankönyv PDF](https://www.tankonyvkatalogus.hu/storage/pdf/OH-MAT08TA__teljes.pdf) | **FELLELT, NEM ELLENŐRZÖTT:** a teljes szükséges tartalom nem nyílt meg. | Egy másik tankönyvi útvonal későbbi megfeleltetése. |
| TAN-06 | [OH-MAT08MA munkafüzet PDF][TAN-06] | **FELLELT, NEM ELLENŐRZÖTT:** teljes feladatelemzés nem történt. | Feladattípusok későbbi összevetése; nem másolási alap. |
| TAN-07 | [OH-MAT08TB teljes tankönyv PDF][TAN-07] | **RÉSZLEGES:** a kiadói hivatkozás megnyílt, de a nagy PDF tartalmát az elérés nem szolgáltatta olvashatóan. | A fejezet- és oldalszintű leképezés nyitott pontja. |
| TAN-08 | [OH-MAT08TB tanmenet, heti 3 óra][TAN-08] | **FELLELT, NEM ELLENŐRZÖTT:** a katalógus csatolmánya azonosított, a DOCX tartalma nem volt olvasható. | Helyi sorrend és óraterhelés későbbi összevetése. |
| TAN-09 | [OH-MAT08TB tanmenet, heti 4 óra][TAN-09] | **FELLELT, NEM ELLENŐRZÖTT:** ugyanilyen hozzáférési korlát. | Bővebb órakeret összevetése; nem kötelező országos sorrend. |
| TAN-10 | [Nemzeti Köznevelési Portál: Matematika 8., B változat][TAN-10] | **FELLELT, NEM ELLENŐRZÖTT:** a közvetlen oldal elérési hibát adott. | Későbbi, hivatalos digitális kapcsolódási pont. |
| TAN-11 | [Szli.hu: 8. osztályos matematika osztályozóvizsga-követelmény][TAN-11] | **ELLENŐRZÖTT, helyi forrás:** intézményi PDF, nem országos előírás. | Az OH-MAT08TA-ra támaszkodó helyi fejezetsorrend és bővítések ellenőrző példája. |
| TAN-12 | [OH: matematika témakörök a 9. évfolyamra jelentkezőknek][TAN-12] | **FELLELT, NEM ELLENŐRZÖTT:** a szükséges aktuális szöveg nem volt elérhető. | A nyolcadikos tanulók középiskolai belépéséhez tartozó felvételi út; nem a nyolcosztályos gimnázium felvételije. |
| TAN-13 | [OH: központi írásbeli feladatsorok archívuma][TAN-13] | **FELLELT, NEM ELLENŐRZÖTT:** az archívum tartalmi feldolgozása nyitott. | Hivatalos korábbi példák linkelése és vizsgatípusok ellenőrzése. |
| TAN-14 | [OH: 2026. évi M8 matematika feladatlap, első alkalom][TAN-14] | **FELLELT, NEM ELLENŐRZÖTT:** a PDF-et nem tekintjük átolvasottnak. | Később feladat–készség megfeleltetés; jelenleg nincs rá épített részletes vizsgaelemzés. |

**Következő tantervi kutatási művelet:** a TAN-02 eredeti dokumentum olvasható példányának ellenőrzése és a TÖRZS-célok tételes hozzárendelése. A felvételi mód pontosítása csak a TAN-12–14 ellenőrzése után következik. A tankönyvi összevetéshez a TA/TB közül a felhasználó számára releváns változatot előnyben lehet részesíteni; ennek hiányában a tananyag több sorrendben is bejárható marad.

### 20.3. Pedagógiai és tanulástudományi háttér

| ID | Forrás | Ellenőrzés és bizonyíték jellege | Felhasználás és korlát |
|---|---|---|---|
| PED-01 | [EEF: Improving Mathematics in Key Stages 2 and 3][PED-01]; [teljes útmutató PDF](https://d2tic4wvo1iusb.cloudfront.net/production/eef-guidance-reports/maths-ks-2-3/EEF-Improving-Mathematics-in-Key-Stages-2-and-3-2022-Update.pdf) | **ELLENŐRZÖTT:** 2017-es útmutató, 2022-es formai frissítésű PDF; ez nem új, 2022-es hatásvizsgálat. | Előismeret, reprezentáció, tudatos problémamegoldás, önállóság. A saját felület hatásosságát nem igazolja. |
| PED-02 | [IES/WWC: Developing Effective Fractions Instruction for Kindergarten Through 8th Grade, 2010][PED-02] | **ELLENŐRZÖTT:** ajánlások különböző bizonyítékerővel; a tört mint szám és az eljárások értelmezése közepes besorolást kap. | Törtek jelentése, számegyenes, fogalom és eljárás összekapcsolása. Nem minden ajánlás azonos erősségű. |
| PED-03 | [IES/WWC: Teaching Strategies for Improving Algebra Knowledge in Middle and High School Students, 2015/2019][PED-03] | **ELLENŐRZÖTT:** a kidolgozott példák elemzése és a szerkezet felismerése korlátozott, a tudatos stratégiaválasztás közepes bizonyítékbesorolással. | Két megoldási út, szerkezetre irányított kérdés, módszerválasztás. Nem tekintjük minden részletét erősen bizonyítottnak. |
| PED-04 | [IES/WWC: Improving Mathematical Problem Solving in Grades 4 Through 8, 2012/2018][PED-04] | **ELLENŐRZÖTT:** az önmegfigyelés és vizuális reprezentáció erős, több további ajánlás közepes bizonyítékbesorolással. | Rajz, táblázat, megoldási terv, visszaellenőrzés és kimondott indoklás. |
| PED-05 | [Rohrer és munkatársai: A Randomized Controlled Trial of Interleaved Mathematics Practice, 2020][PED-05]; [WWC-értékelés](https://ies.ed.gov/ncee/wwc/Study/88770) | **ELLENŐRZÖTT:** hetedikes osztályokkal végzett randomizált vizsgálat; DOI: [10.1037/edu0000367](https://doi.org/10.1037/edu0000367). | A már tanult feladattípusok keverésének releváns háttere. Nem indokolja minden előzetes magyarázat vagy célzott gyakorlás elhagyását. |
| PED-06 | [Emeny, Hartwig és Rohrer: Spaced mathematics practice improves test scores and reduces overconfidence, 2021][PED-06] | **ELLENŐRZÖTT:** két osztálytermi kísérlet brit Year 7, 11–12 éves résztvevőkkel; DOI: [10.1002/acp.3814](https://doi.org/10.1002/acp.3814). | Időben elosztott visszatérés. A brit Year 7 nem azonos a magyar hetedik évfolyammal; az 1–3–7–14 napos termékszabályt a vizsgálat nem validálja. |
| PED-07 | [Atkinson, Renkl és Merrill: Transitioning From Studying Examples to Solving Problems, 2003][PED-07] | **RÉSZLEGES:** intézményi bibliográfiai oldal és absztrakt; a teljes cikk részletes újraelemzése nem történt. DOI: [10.1037/0022-0663.95.4.774](https://doi.org/10.1037/0022-0663.95.4.774). | A támasz fokozatos csökkentésének és az önmagyarázatnak háttérforrása; a pontos megvalósítás saját terv. |
| PED-08 | [EEF: Teacher Feedback to Improve Pupil Learning, 2021][PED-08] | **ELLENŐRZÖTT:** tanári visszajelzésről szóló útmutató. | A visszajelzést követő konkrét tanulói cselekvés fontossága; nem automatikus szoftveres visszajelzés önálló hatásvizsgálata. |
| PED-09 | [W3C: Provide Step-by-step Instructions][PED-09] | **ELLENŐRZÖTT:** kiegészítő kognitív hozzáférhetőségi útmutató. | Rövid, közeli és lépésenként követhető utasítás; nem külön megfelelőségi tanúsítás. |
| PED-10 | [Karpicke és Blunt: Retrieval Practice Produces More Learning than Elaborative Studying with Concept Mapping, 2011][PED-10] | **ELLENŐRZÖTT, közvetett háttér:** egyetemisták és természettudományos szövegek; DOI: [10.1126/science.1199327](https://doi.org/10.1126/science.1199327). | Az emlékezetből felidézés általános indoka; nem nyolcadikos matematikaalkalmazás közvetlen bizonyítéka. |

**A projekt ebből levont következtetése:** a kidolgozott példa, a megértést kérő magyarázat, a fokozatos önállóság és a későbbi vegyes gyakorlás együtt kipróbálandó irány. A tanulási út hossza, a visszatérés időpontja és az ajánlási küszöb saját tervezési döntés, amelyet valódi használat alapján finomítunk.

### 20.4. Interaktív inspirációk

| ID | Forrás | Állapot | Mi hasznos belőle? |
|---|---|---|---|
| INSP-01 | [The Math Learning Center: Fractions][INSP-01] | **ELLENŐRZÖTT:** hivatalos alkalmazásleírás; nem saját böngészős akadálymentességi audit. | Az egész egység és a különböző felosztások összevetése sávval és körrel. Saját magyar feladatokkal és saját megvalósítással tervezzük. |
| INSP-02 | [The Math Learning Center: Number Line][INSP-02] | **ELLENŐRZÖTT:** hivatalos leírás. | A szám mint hely és a művelet mint elmozdulás; negatív szám, tört és tizedes összekapcsolása. |
| INSP-03 | [Polypad: Fraction Bars][INSP-03] | **ELLENŐRZÖTT:** megnyílt leírás, részben angol szöveggel; nem teljes magyar tananyag. | Mozgatható törtsávok, egységcsere és összehasonlítás. A feladatcélokat külön saját magyarázattal kell felépíteni. |
| INSP-04 | [PhET: Equality Explorer: Basics][INSP-04] | **RÉSZLEGES:** hivatalos forráshely, korlátozottan olvasható oldal; teljes interaktív használati próba nem történt. | Mérleg és egyenlőség kapcsolatának inspirációja. A külső csomag beépítése nincs elhatározva. |

Az inspiráció nem tartalomimport: a jelen terv sem szimulációs fájlt, sem tankönyvi ábrát, sem külső feladatbankot nem épít be. A saját műhelyekhez a magyar tanulási cél és a hozzáférhető alternatíva külön követelmény.

### 20.5. Műszaki és hozzáférhetőségi dokumentáció

| ID | Elsődleges dokumentáció | Ellenőrzött tartalom és felhasználás |
|---|---|---|
| TECH-01 | [Preact v11: Getting Started][TECH-01] | **ELLENŐRZÖTT:** a jelenlegi útmutató és Vite-kapcsolat. A konkrét verzió rögzítése a helyi fejlesztéskor történik. |
| TECH-02 | [Vite: Deploying a Static Site][TECH-02] | **ELLENŐRZÖTT:** statikus build, helyi előnézet, alapútvonal és GitHub Pages. A preview parancs nem nyilvános éles szerver. |
| TECH-03 | [KaTeX: Options][TECH-03] | **ELLENŐRZÖTT:** HTML/MathML kimenet és megjelenítési beállítások. A magyar használhatóság külön próba. |
| TECH-04 | [MathJax: Accessibility Features][TECH-04] | **ELLENŐRZÖTT:** matematikai hozzáférhetőségi lehetőségek; alternatíva a tényleges igény alapján. |
| TECH-05 | [W3C: Dragging Movements, WCAG 2.2, 2.5.7][TECH-05] | **ELLENŐRZÖTT:** húzás nélküli egyszerűmutatós alternatíva; a billentyűzetes kezelés külön is szükséges. |
| TECH-06 | [W3C: Target Size (Minimum), WCAG 2.2, 2.5.8][TECH-06] | **ELLENŐRZÖTT:** 24 CSS-pixeles minimum és kivételek; a projekt 44 pixeles célja saját tervezési választás. |
| TECH-07 | [MDN: IndexedDB API][TECH-07] | **ELLENŐRZÖTT:** strukturált böngészős helyi tárolás. |
| TECH-08 | [MDN: Storage quotas and eviction criteria][TECH-08] | **ELLENŐRZÖTT:** tárhelykorlátok, törölhetőség, megtartás; az export indoka. |
| TECH-09 | [MDN: Service Worker API][TECH-09] | **ELLENŐRZÖTT:** életciklus, cache és biztonságos környezet; az offline mód műszaki alapja. |
| TECH-10 | [GitHub Docs: GitHub Pages limits][TECH-10] | **ELLENŐRZÖTT:** elérhetőség és korlátok; közzététel előtt újra ellenőrizendő. |
| TECH-11 | [Math.js: Security][TECH-11] | **ELLENŐRZÖTT:** a kifejezéskiértékelés korlátai és erőforrás-kockázatai; a szűk bevitel indoka. |
| TECH-12 | [MDN: prefers-reduced-motion][TECH-12] | **ELLENŐRZÖTT:** a felhasználó mozgáscsökkentési beállításának figyelembevétele. |
| TECH-13 | [W3C: Reflow, WCAG 2.2, 1.4.10][TECH-13] | **ELLENŐRZÖTT:** 320 CSS-pixeles szélességre újratördelés, a valóban kétdimenziós tartalom külön kezelése. |
| TECH-14 | [W3C: Resize Text, WCAG 2.2, 1.4.4][TECH-14] | **ELLENŐRZÖTT:** szövegnagyítás 200%-ig, tartalom és működés megőrzésével. |

### 20.6. Külső feltételek és fejlesztői licencek

| ID | Forrás | Állapot és tervezési következmény |
|---|---|---|
| JOG-01 | [GeoGebra: License][JOG-01] | **ELLENŐRZÖTT:** a forráskód és a teljes termék/tartalom feltételei különböznek. Konkrét beépítés előtt összetevőnkénti ellenőrzés kell. |
| JOG-02 | [PhET: Licensing][JOG-02] | **RÉSZLEGES:** a hivatalos oldal indexelt szövege ellenőrzött; a közvetlen oldal korlátozottan olvasható. Normál HTML-szimulációknál jelenleg CC BY-NC 4.0 szerepel; a kiválasztott állományt külön vizsgálni kell. |
| JOG-03 | [Desmos: API Terms of Service][JOG-03] | **RÉSZLEGES:** hivatalos indexelt szöveg, Trial és Commercial feltételekkel. Nem tekintjük automatikusan ingyenes, korlátlan produkciós API-nak. |
| LIC-01 | [Vite LICENSE][LIC-01] | **ELLENŐRZÖTT:** MIT; a tényleges csomag és függőségek leltára későbbi feladat. |
| LIC-02 | [Preact LICENSE][LIC-02] | **ELLENŐRZÖTT:** MIT. |
| LIC-03 | [KaTeX LICENSE][LIC-03] | **ELLENŐRZÖTT:** MIT; a mellékelt erőforrásokat is figyelembe kell venni. |
| LIC-04 | [TypeScript LICENSE][LIC-04] | **ELLENŐRZÖTT:** Apache-2.0. |

### 20.7. Mi marad az anyaggyűjtés következő, célzott körére?

| Nyitott tétel | Szükséges eredmény | Mit nem tart fel? |
|---|---|---|
| OH-kerettanterv teljes szövege | Tételes tantervi mátrix, idézhető helyekkel | A már biztos alapfogalmak helyi leckéit |
| Kiválasztott tankönyv és tanmenet | Fejezetenkénti megfeleltetés, tudatos eltérések | A tanmenettől független keresést és előismereti pótlást |
| Aktuális felvételi témák és szabályok | Évhez kötött, ellenőrzött felvételi konfiguráció | Az eredeti vegyes problémák és stratégiák tanítását |
| Hat célzott út tanári szaklektorálása | Terminológiai és sorrendi javítások | A környezet és az első ellenőrizhető prototípus helyi előkészítését |
| Valós célkészülékek és támogatási igények | Konkrét böngésző- és használati próba | A szemantikus HTML, húzás nélküli út és könnyű alapfelület kialakítását |

---

<a id="fejezet-21"></a>

## 21. Következő körre átadható indítóutasítás

### 21.1. Átadható munkautasítás a „tovább” után

> A feladat a **Matek8 — Értsd is!** helyi megvalósítása a jelen terv alapján. Először olvasd el a teljes tervet és vizsgáld meg a tényleges helyi környezetet. A felhasználó „tovább” jelzése engedélyezi a lokális fejlesztést. Tartsd a 0 Ft új külső költséget; ne használj fizetős API-t vagy regisztrációt igénylő próbát. GitHub-feltöltést és nyilvános kiadást ne végezz külön aktuális felhatalmazás nélkül.
>
> Először a matematikai magot, a hozzáférhető leckemenetet és egy teljes törtes utat készíts el; utána a százalék, egyenlet, grafikon, Pitagorasz és valószínűség teljes útját. Egy út magyarázatból, célzott interakcióból, indokolt mintamegoldásból, önálló gyakorlásból és új helyzetű ellenőrzésből áll. A félkész témát ne jelöld késznek. A tananyag és az ellenőrző ugyanazt az értelmezést, mértékegységet és tartományt használja.
>
> Tartsd külön a korábbi alapot, a törzsanyagot, a bővítést és a felvételi útvonalat. A jelenleg el nem ért forrást ne állítsd ellenőrzöttnek. Szerezz tételes bizonyítékot a matematikai helyességre, és próbáld ki a tényleges böngészős használatot, a hibajavítást és a folytatást. A szokásos visszafordítható helyi részfeladatok között haladj önállóan. A beszámoló az elkészült működést, az ellenőrzését és a konkrét maradék hiányt mutassa.

### 21.2. A jelen dokumentum ellenőrzési nyilvántartása

| Tétel | Jelen eredmény |
|---|---|
| Hatókör | Anyaggyűjtés és Markdown-terv; alkalmazásfejlesztés nem indult |
| Tananyagterv | 24 modul, 137 egységazonosító; a matematikai és tantervi rétegek elkülönítve |
| Interaktív terv | 48 egyedileg azonosított műhely, célhoz és kezelési alternatívához kötve |
| Visszajelzés | 40 tipikus hibaminta és célzott tisztázó/javító irány |
| Konkrét tartalmi minta | 8 kidolgozott mintalecke és 24 rövid, megoldott modulminta |
| Matematikai ellenőrzés | A minták számeredménye és lényegi érvényességi feltétele külön átolvasva; a későbbi generátorok még nem léteznek |
| Forráskezelés | Olvasott, részlegesen elért és még nem ellenőrzött tételek megkülönböztetve |
| Műszaki állapot | Architektúra és elfogadási feltételek megtervezve; működő alkalmazásra vonatkozó teszteredmény nincs |
| Következő felhatalmazás | „Tovább”: helyi fejlesztés indul; publikálás továbbra is külön döntés |

### 21.3. A projekt legfontosabb szerkesztői kérdése

Minden új leckénél és műhelynél meg kell tudni válaszolni: **milyen gondolatot fog ettől megérteni a tanuló, miből látjuk ezt, és mit kap, ha elsőre nem sikerül?** Ha erre nincs konkrét válasz, a több animáció vagy a több azonos feladat még nem teszi kész tananyaggá.

---

<!-- Markdown-hivatkozások: a 20. fejezetben szereplő források célcímei. -->

[TAN-01]: https://njt.jog.gov.hu/jogszabaly/2012-110-20-22
[TAN-02]: https://www.oktatas.hu/kozneveles/kerettantervek/2020_nat/kerettanterv_alt_isk_5_8
[TAN-03]: https://www.oktatas2030.hu/wp-content/uploads/2020/10/utmutato-a-matematika-tantargy-tanitasahoz.pdf
[TAN-04]: https://www.tankonyvkatalogus.hu/tankonyv/OH-MAT08TB
[TAN-05]: https://www.tankonyvkatalogus.hu/tankonyv/OH-MAT08TA
[TAN-06]: https://www.tankonyvkatalogus.hu/storage/pdf/OH-MAT08MA__teljes.pdf
[TAN-07]: https://www.tankonyvkatalogus.hu/storage/pdf/OH-MAT08TB__teljes.pdf
[TAN-08]: https://www.tankonyvkatalogus.hu/storage//csatolmanyok/tanmenetek/OH-MAT08TB__tanmenet_heti_3_oras.docx
[TAN-09]: https://www.tankonyvkatalogus.hu/storage//csatolmanyok/tanmenetek/OH-MAT08TB__tanmenet_heti_4_oras.docx
[TAN-10]: https://www.nkp.hu/tankonyv/matematika_8_nat2020_b
[TAN-11]: https://szli.hu/osztalyozo/Fels%C5%91%20tagozat/8.a/8.a_matematika_oszt%C3%A1lyoz%C3%B3vizsga.pdf
[TAN-12]: https://www.oktatas.hu/kozneveles/kozepfoku_felveteli_eljaras/kozponti_feladatsorok/temakorok_matek_9
[TAN-13]: https://www.oktatas.hu/kozneveles/kozepfoku_felveteli_eljaras/kozponti_feladatsorok
[TAN-14]: https://www.oktatas.hu/pub_bin/dload/kozoktatas/beiskolazas/feladatsorok/2026/M8_2026_1_fl.pdf
[PED-01]: https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/maths-ks-2-3
[PED-02]: https://ies.ed.gov/ncee/wwc/practiceguide/15
[PED-03]: https://ies.ed.gov/ncee/wwc/practiceguide/20
[PED-04]: https://ies.ed.gov/ncee/WWC/PracticeGuide/16
[PED-05]: https://files.eric.ed.gov/fulltext/ED595322.pdf
[PED-06]: https://files.eric.ed.gov/fulltext/ED611846.pdf
[PED-07]: https://experts.azregents.edu/en/publications/transitioning-from-studying-examples-to-solving-problems-effects-/
[PED-08]: https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/feedback
[PED-09]: https://www.w3.org/WAI/WCAG2/supplemental/patterns/o4p07-step-instructions/
[PED-10]: https://learninglab.psych.purdue.edu/downloads/2011/2011_Karpicke_Blunt_Science.pdf
[INSP-01]: https://www.mathlearningcenter.org/apps/fractions
[INSP-02]: https://www.mathlearningcenter.org/apps/number-line
[INSP-03]: https://polypad.amplify.com/hu/lesson/fraction-bars
[INSP-04]: https://phet.colorado.edu/en/simulations/equality-explorer-basics
[TECH-01]: https://preactjs.com/guide/v11/getting-started/
[TECH-02]: https://vite.dev/guide/static-deploy.html
[TECH-03]: https://katex.org/docs/options.html
[TECH-04]: https://docs.mathjax.org/en/latest/basic/accessibility.html
[TECH-05]: https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements
[TECH-06]: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
[TECH-07]: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
[TECH-08]: https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
[TECH-09]: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
[TECH-10]: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
[TECH-11]: https://mathjs.org/docs/expressions/security.html
[TECH-12]: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
[TECH-13]: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
[TECH-14]: https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html
[JOG-01]: https://www.geogebra.org/license
[JOG-02]: https://phet.colorado.edu/en/licensing
[JOG-03]: https://www.desmos.com/api-terms
[LIC-01]: https://raw.githubusercontent.com/vitejs/vite/main/LICENSE
[LIC-02]: https://github.com/preactjs/preact/blob/main/LICENSE
[LIC-03]: https://github.com/KaTeX/KaTeX/blob/main/LICENSE
[LIC-04]: https://raw.githubusercontent.com/microsoft/TypeScript/main/LICENSE.txt
