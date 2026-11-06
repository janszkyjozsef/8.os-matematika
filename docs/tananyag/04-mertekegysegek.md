# 04. Mértékegységek — ugyanaz a mennyiség, más mérőszám

> **Státusz:** beépíthető, számszakilag ellenőrzött új tananyagkézirat. A leírt interaktív modell megvalósítási specifikáció; ez még nem új, kész interaktív tanulási útvonal.
>
> **Szint:** 8. osztályos alapozás és ismétlés. A feladatok, a történetek és a magyarázatok saját készítésűek.

## 1. Miért váltunk mértékegységet?

Egy asztal hossza lehet 1,2 m vagy 120 cm. Az asztal nem változott meg. Más méretű egységgel mértük meg ugyanazt a hosszúságot.

A mérési adatban **a szám és a mértékegység együtt** mondja meg a mennyiséget. A 120 önmagában nem árulja el, hogy milliméterről, centiméterről vagy méterről van szó.

A lecke végén ezeket tudd megmagyarázni:

- Miért lesz nagyobb a mérőszám, ha kisebb egységre váltunk?
- Miért különbözik a hossz, a terület és a térfogat váltószáma?
- Hogyan kapcsolódik a liter a köbdeciméterhez és a köbcentiméterhez?
- Miért nem tízes váltószámú az óra és a perc kapcsolata?
- Mikor nem lehet két egység között átváltani további adat nélkül?

**Amire építünk:** tizedes számok, szorzás és osztás, a téglalap kerülete és területe, a téglatest térfogata. A szükséges képleteket a feladatokban is megmagyarázzuk.

## 2. Jósolj a számolás előtt

1. Egy 2,4 m-es szalagot centiméterben írunk le. A mérőszám nagyobb vagy kisebb lesz? Maga a szalag változik?
2. Egy 1 dm oldalú négyzetet 1 cm oldalú négyzetekkel fedünk le. 10, 100 vagy 1000 kis négyzet kell?
3. Egy 1 dm élű kockát 1 cm élű kockákból rakunk össze. Hány darab kell?
4. A 0,5 óra 50 perc vagy 30 perc?

<details>
<summary>A jóslatok ellenőrzése</summary>

1. A centiméter kisebb egység, ezért több kell belőle: 2,4 m = 240 cm. A szalag hosszúsága változatlan.
2. Egy sorban 10 kis négyzet fér el, és 10 sor van: $10\cdot10=100$ darab.
3. Egy rétegben 100 kis kocka van, és 10 réteg kell: $10\cdot10\cdot10=1000$ darab.
4. Egy óra 60 perc, ennek a fele 30 perc.

Az első jóslatod mellé írd oda, melyik ábra vagy kapcsolat indokolja az eredményt. A helyes szám mellett a magyarázat is számít.

</details>

## 3. A váltás logikája

### 3.1. Hossz: egymás mögé tesszük az egységeket

$$
1\text{ m}=10\text{ dm}=100\text{ cm}=1000\text{ mm}.
$$

Egy méter hosszan 100 darab egycentiméteres szakasz fér el. Ezért:

$$
2{,}4\text{ m}=2{,}4\cdot100\text{ cm}=240\text{ cm}.
$$

Fordítva: 240 cm-ben 2,4 darab egyméteres hossz van, ezért 100-zal osztunk.

**Irányellenőrzés:** ugyanazt a pozitív hosszúságot kisebb egységben nagyobb, nagyobb egységben kisebb számmal fejezzük ki.

Nem minden, táblázatban egymás mellé írt egység között 10 a váltószám. Például 1 km = 1000 m. A konkrét egységkapcsolatot kell ismerni.

### 3.2. Terület: két irányban számolunk

Az 1 dm² egy 1 dm oldalú négyzet területe. Mindkét oldala 10 cm:

$$
1\text{ dm}^2=(10\text{ cm})\cdot(10\text{ cm})
=100\text{ cm}^2.
$$

Az 1 m² oldalai 100 cm hosszúak:

$$
1\text{ m}^2=(100\text{ cm})\cdot(100\text{ cm})
=10\,000\text{ cm}^2.
$$

A négyzetes mértékegységben a négyzetre emelés **az egységváltási tényezőre is vonatkozik**. Ha a hosszúságegységek között 100 a váltószám, a megfelelő területegységek között $100^2=10\,000$.

A 3 m² nem egy 3 m oldalú négyzet területe. Három darab egy négyzetméternyi területet jelent; a 3 m oldalú négyzet területe 9 m².

### 3.3. Térfogat: három irányban számolunk

Az 1 dm³ egy 1 dm élű kocka térfogata. Egy élen 10 darab 1 cm-es szakasz fér el. Egy rétegben $10\cdot10=100$ kis kocka van, és 10 réteg kell:

$$
1\text{ dm}^3=(10\text{ cm})^3=1000\text{ cm}^3.
$$

Hasonlóan:

$$
1\text{ m}^3=(10\text{ dm})^3=1000\text{ dm}^3.
$$

Méter és centiméter között a hosszváltás 100-szoros, ezért:

$$
1\text{ m}^3=100^3\text{ cm}^3=1\,000\,000\text{ cm}^3.
$$

A három kitevő három külön irányt képvisel. Nem dísz a mértékegység végén.

### 3.4. Ugyanazt váltjuk át, vagy megnöveljük a tárgyat?

Két külön műveletet kell megkülönböztetni.

- **Egységváltás:** ugyanaz a négyzet 1 dm² vagy 100 cm². A négyzet mérete nem változik.
- **Nagyítás:** egy négyzet oldalát megkétszerezzük. A tárgy megváltozik, a területe négyszeres lesz.

Hasonló testek minden hosszméretének kétszerezése a felszínt négyszerezi, a térfogatot nyolcszorozza. A térfogatnál három irányban változik a méret: $2\cdot2\cdot2=8$.

## 4. Kapcsolatok, amelyekre támaszkodhatunk

### Hossz, terület és térfogat

| Mennyiség | Közvetlen kapcsolat | Mi indokolja? |
|---|---|---|
| Hossz | 1 km = 1000 m | A kilométer ezerszer akkora egység. |
| Hossz | 1 m = 10 dm; 1 dm = 10 cm; 1 cm = 10 mm | Minden felsorolt lépésben tízszer kisebb egységre váltunk. |
| Terület | 1 m² = 100 dm² | $10\cdot10$ kis egységnégyzet. |
| Terület | 1 dm² = 100 cm² | $10\cdot10$ kis egységnégyzet. |
| Terület | 1 m² = 10 000 cm² | $100\cdot100$ kis egységnégyzet. |
| Térfogat | 1 m³ = 1000 dm³ | $10\cdot10\cdot10$ kis egységkocka. |
| Térfogat | 1 dm³ = 1000 cm³ | $10\cdot10\cdot10$ kis egységkocka. |

### Liter és köbegységek

A liter szintén térfogatot fejez ki:

$$
1\text{ L}=1\text{ dm}^3=1000\text{ cm}^3=1000\text{ mL}.
$$

Ebből:

$$
1\text{ mL}=1\text{ cm}^3,\qquad 1\text{ m}^3=1000\text{ L}.
$$

További gyakori kapcsolatok: 1 L = 10 dL = 100 cL = 1000 mL.

Egy 750 mL-es palack névleges térfogata 750 cm³, azaz 0,75 L. A liter és a köbegységek összekapcsolása azért hasznos, mert a doboz méreteiből először köbcentimétert vagy köbdecimétert számolunk.

### Tömeg

$$
1\text{ t}=1000\text{ kg},\quad
1\text{ kg}=1000\text{ g},\quad
1\text{ g}=1000\text{ mg}.
$$

A kilogramm tömeget, a liter térfogatot mér. **Egy literből nem lesz egységváltással egy kilogramm.** A kettő kapcsolatának kiszámításához tudnunk kell például, mekkora az adott anyag egy literének tömege.

### Idő

$$
1\text{ óra}=60\text{ perc},\qquad
1\text{ perc}=60\text{ másodperc}.
$$

A tizedes szám a megadott egység törtrészét jelenti:

$$
1{,}25\text{ óra}
=1\text{ óra}+0{,}25\cdot60\text{ perc}
=1\text{ óra }15\text{ perc}.
$$

A tizedesvessző utáni 25 itt nem 25 perc.

### Összetett egység: a sebesség

A km/h azt jelenti, hány kilométert teszünk meg egy óra alatt. Ha m/s-ban szeretnénk megadni, a távolság **és az idő** egységét is át kell váltani:

$$
1\text{ km/h}
=\frac{1000\text{ m}}{3600\text{ s}}
=\frac{5}{18}\text{ m/s}.
$$

Ezért km/h-ról m/s-ra 3,6-del osztunk; fordítva 3,6-del szorzunk. A 3,6 nem megmagyarázatlan trükk: az 1000 méter és a 3600 másodperc arányából ered.

### Mielőtt összeadsz vagy összehasonlítasz

Előbb ellenőrizd, azonos fajtájú mennyiségekről van-e szó. A 2 m és a 30 cm összeadható közös hosszegységben: 2,3 m. A 2 m és a 30 cm² nem adható össze egyetlen hosszúságként vagy területként.

## 5. Tervezett interaktív modell: Egységépítő

**Ez megvalósítási terv, nem kész felület.**

### A modell célja

A tanuló lássa, hogy ugyanaz a kiterjedés hány kisebb egységből áll. Ne a tizedesvessző mozgatása legyen az első magyarázat.

Három nézet készülne:

| Nézet | Kiinduló objektum | Felbontás | Számolási kapcsolat |
|---|---|---|---|
| Hossz | 1 dm-es szakasz | Tíz darab 1 cm-es szakasz | 10 |
| Terület | 1 dm oldalú négyzet | Tíz sor, soronként tíz 1 cm²-es négyzet | $10\cdot10=100$ |
| Térfogat | 1 dm élű kocka | Tíz réteg, rétegenként száz 1 cm³-es kocka | $10\cdot10\cdot10=1000$ |

### Tanulói műveletek és visszajelzés

1. A tanuló előre megadja a kisebb egységek becsült számát.
2. Bekapcsolhatja az egységekre bontást. A térfogatnál rétegenként lépkedhet; nem kell egyszerre minden kockát átlátnia.
3. Egységet válthat úgy, hogy a megjelenített tárgy tényleges mérete változatlan maradjon.
4. A képi felbontás mellett ugyanaz az adat táblázatban és szöveggel is megjelenik: „10 sor × 10 oszlop”.
5. Külön nagyítási kapcsoló mutathatja meg a fizikai méret változását. Ezt egyértelműen el kell különíteni az egységváltástól.
6. Területből hosszúságra történő közvetlen váltásnál a modell kérdezzen vissza: „Területet mérünk. Melyik négyzetes egységet választod?” Nem talál ki hiányzó oldalhosszat.
7. Térfogatnál a literjelölés az 1 dm³-hez kapcsolódik. Liter–kilogramm váltást anyagadat nélkül nem ajánl fel.
8. A megoldásnál pontos érték jelenjen meg, magyar tizedesvesszővel. Kerekítést csak kifejezetten kért közelítő feladatban alkalmazunk.

### Hozzáférhetőség és működési határok

Minden funkcióhoz kell gomb vagy billentyűzettel kezelhető mező; a húzás nem lehet az egyetlen művelet. A háromdimenziós nézet mellett legyen rétegtáblázat és szöveges leírás. A szín ne hordozzon egyedül jelentést. A nézet legyen használható animáció nélkül is.

Nagy felbontásnál csoportokat és darabszámot mutassunk, ne több millió külön rajzolt kockát. A modell matematikai egységeket szemléltet, nem valós folyadékmozgást szimulál.

**Ellenőrizendő állapotok:**

- 2,5 m = 250 cm; az ábrázolt szakasz nem nyúlik meg.
- 1 dm² = 100 cm².
- 0,4 m² = 4000 cm².
- 1 dm³ = 1000 cm³ = 1 L.
- 750 cm³ = 0,75 L.
- A kétszeres élű kocka térfogata nyolcszoros.
- Az időváltásnál, ha később külön mód készül hozzá, 1 óra 60 perc. Nem használjuk rá automatikusan a tízes felosztást.

## 6. Két kidolgozott példa

### M–P1. Burkolás: előbb azonos egység, utána darabszám

**Feladat.** Egy 3,2 m hosszú és 2,4 m széles téglalap alakú felületet 40 cm oldalú négyzetlapokkal fedünk le. Egy csomagban 10 lap van. Hány lap és hány teljes csomag szükséges?

Az iskolai modellben a lapokat hézagmentesen rakjuk le, nincs anyagveszteség vagy tartalék. Az oldalméretekhez egész számú lap illeszkedik.

**Jóslat.** A teljes felület több négyzetméter, egy lap pedig egy négyzetméternél kisebb. Sok lapra lesz szükség. A csomagok száma egész szám.

1. **Közös egységet választunk.**  
   40 cm = 0,4 m. Mindkét oldalméretet méterben használjuk.
2. **Kiszámítjuk a területeket.**  
   Teljes felület: $3{,}2\cdot2{,}4=7{,}68$ m².  
   Egy lap: $0{,}4\cdot0{,}4=0{,}16$ m².
3. **Megkeressük, hány lapterület fér a teljes felületbe.**  
   $7{,}68:0{,}16=48$ lap.
4. **A tényleges elrendezést is ellenőrizzük.**  
   Hosszában $3{,}2:0{,}4=8$, széltében $2{,}4:0{,}4=6$ lap fér el.  
   $8\cdot6=48$ lap, tehát a területek alapján kapott darabszám itt valóban kirakható.
5. **Csomagokra váltunk.**  
   Négy csomagban 40 lap van, ez kevés. Öt csomagban 50 lap van, ez elég, és 2 lap megmarad.

**Válasz:** 48 lapra, vagyis 5 teljes csomagra van szükség.

**Miért nem osztjuk el a 7,68-at 1600-zal?** Egy lap területe valóban $40\cdot40=1600$ cm², de a 7,68 m² más egységben van. Átváltva $7{,}68$ m² = $76\,800$ cm², és $76\,800:1600=48$ ugyanazt adja.

Ez a darabszám a feladat modelljére vonatkozik. A valós rendelésnél előforduló vágási veszteséget, hézagot vagy tartalékot nem számoltuk hozzá.

### M–P2. Dobozból liter

**Feladat.** Egy téglatest alakú tároló belső alapélei 30 cm és 20 cm, belső magassága 25 cm. Mekkora a teljes befogadóképessége literben? Mennyi víz van benne, ha a víz magassága 18 cm?

**Jóslat.** A víz nem tölti ki a teljes magasságot, ezért térfogata kisebb a teljes befogadóképességnél.

1. **Az alap területét számoljuk ki.**  
   $30\cdot20=600$ cm².
2. **A teljes térfogatot rétegekből építjük fel.**  
   Egy 1 cm magas réteg térfogata $600\cdot1=600$ cm³.  
   Huszonöt ilyen réteg: $600\cdot25=15\,000$ cm³.
3. **Köbcentiméterről literre váltunk.**  
   $1000$ cm³ = 1 L, ezért $15\,000$ cm³ = 15 L.
4. **A víznél a víz magasságát használjuk.**  
   $600\cdot18=10\,800$ cm³ = 10,8 L.
5. **Ellenőrzés aránnyal.**  
   A vízmagasság a teljes magasság $18/25$ része.  
   $15\cdot18/25=10{,}8$ L, tehát ugyanazt kaptuk.

**Válasz:** a tároló befogadóképessége 15 L; 18 cm-es vízmagasságnál 10,8 L víz van benne.

A belső méretek azért fontosak, mert a folyadék számára rendelkezésre álló helyet keressük. A fal vastagságát így nem kell a számításban külön kezelni.

## 7. Tizenkét gyakorlófeladat

Minden feladatnál nevezd meg a mennyiséget, jósolj az eredmény nagyságára, és a szám mellett tartsd meg az egységet. Ha segítség kell, először az első kapaszkodót nyisd meg.

### M–G01. Három hosszúság

**Feladat.** Váltsd át:

1. 3,7 m = … cm
2. 45 mm = … cm
3. 0,08 km = … m

Mindegyiknél mondd meg, miért nő vagy csökken a mérőszám.

<details>
<summary>1. kapaszkodó</summary>

Kisebb egységből több kell ugyanahhoz a hosszhoz. A centiméter a méternél kisebb, de a milliméternél nagyobb.

</details>

<details>
<summary>2. kapaszkodó</summary>

Használd ezeket: 1 m = 100 cm; 1 cm = 10 mm; 1 km = 1000 m.

</details>

<details>
<summary>Teljes megoldás</summary>

1. $3{,}7\cdot100=370$ cm. Kisebb egységre váltottunk, a mérőszám nőtt.
2. $45:10=4{,}5$ cm. Nagyobb egységre váltottunk, a mérőszám csökkent.
3. $0{,}08\cdot1000=80$ m. A méter kisebb a kilométernél, ezért a mérőszám nőtt.

Ellenőrzésként a fordított műveletek rendre 3,7 m-t, 45 mm-t és 0,08 km-t adnak.

</details>

### M–G02. Mennyi zsinór marad?

**Feladat.** Egy 5 m-es zsinórból levágunk 2 m 35 cm-t, majd 1 m 80 cm-t. Mennyi marad? Vágási veszteséggel nem számolunk.

<details>
<summary>1. kapaszkodó</summary>

Előbb írd fel mindhárom hosszúságot ugyanabban az egységben. A centiméterrel egész számokat kapsz.

</details>

<details>
<summary>2. kapaszkodó</summary>

A teljes hossz 500 cm, a levágott darabok 235 cm és 180 cm. Előbb összeadhatod a két levágott darabot.

</details>

<details>
<summary>Teljes megoldás</summary>

A levágott hossz $235+180=415$ cm.

A maradék $500-415=85$ cm, vagyis 0,85 m.

Ellenőrzés: $235+180+85=500$ cm, tehát visszakaptuk az eredeti 5 m-t.

**Válasz:** 85 cm marad.

</details>

### M–G03. A számok önmagukban becsapnak

**Feladat.** Állítsd növekvő sorrendbe a hosszúságokat: 0,7 m; 65 cm; 720 mm. A 720-as szám miatt biztosan a harmadik hosszúság a legnagyobb?

<details>
<summary>1. kapaszkodó</summary>

A mérőszámokat csak az egységgel együtt hasonlíthatjuk össze. Írj mindent milliméterben vagy centiméterben.

</details>

<details>
<summary>2. kapaszkodó</summary>

0,7 m = 700 mm, 65 cm = 650 mm. Most már a 700, 650 és 720 ugyanazt az egységet használja.

</details>

<details>
<summary>Teljes megoldás</summary>

$650<700<720$, ezért:

**65 cm < 0,7 m < 720 mm.**

A harmadik mennyiség valóban a legnagyobb, de ezt az átváltás igazolja, nem pusztán a 720-as mérőszám. Például 720 mm kisebb 2 m-nél, pedig 720 nagyobb 2-nél.

</details>

### M–G04. Mi a hiba a területváltásban?

**Feladat.** Réka ezt írta: „1,8 m² = 180 cm², mert egy méter száz centiméter.” Javítsd ki az eredményt, és magyarázd meg a hiányzó lépést.

<details>
<summary>1. kapaszkodó</summary>

Egy négyzetnek két kiterjedési iránya van. Hány 1 cm²-es négyzet fér el egy 1 m oldalú négyzet egy sorában, és hány ilyen sor van?

</details>

<details>
<summary>2. kapaszkodó</summary>

$1$ m² = $100\cdot100=10\,000$ cm². Ezzel a váltószámmal számolj, ne 100-zal.

</details>

<details>
<summary>Teljes megoldás</summary>

$1{,}8$ m² = $1{,}8\cdot10\,000=18\,000$ cm².

A 100-as hosszváltást mindkét irányban alkalmazzuk, ezért területnél a váltószám $100^2$.

Külön ellenőrzés: egy 3 m × 0,6 m-es téglalap területe 1,8 m². Centiméterben ugyanaz a téglalap 300 cm × 60 cm, területe $300\cdot60=18\,000$ cm².

**Javított állítás:** 1,8 m² = 18 000 cm².

</details>

### M–G05. Szegély vagy felület?

**Feladat.** Egy téglalap alakú asztallap méretei 180 cm és 1,2 m.

1. Hány méter hosszú szegély kell az egész kerületére?
2. Mekkora az asztallap területe m²-ben?

Átfedéssel, hulladékkal és vastagsággal nem számolunk.

<details>
<summary>1. kapaszkodó</summary>

A szegély hossza kerület, a lefedendő rész terület. Először váltsd a 180 cm-t méterre.

</details>

<details>
<summary>2. kapaszkodó</summary>

Az oldalak 1,8 m és 1,2 m. A kerület $2(1{,}8+1{,}2)$, a terület $1{,}8\cdot1{,}2$.

</details>

<details>
<summary>Teljes megoldás</summary>

180 cm = 1,8 m.

Kerület: $2(1{,}8+1{,}2)=2\cdot3=6$ m.

Terület: $1{,}8\cdot1{,}2=2{,}16$ m².

Ellenőrzés centiméterben: a másik oldal 120 cm. A kerület $2(180+120)=600$ cm = 6 m. A terület $180\cdot120=21\,600$ cm² = 2,16 m².

**Válasz:** 6 m szegély kell; a felület területe 2,16 m².

</details>

### M–G06. Térfogat és űrtartalom

**Feladat.** Váltsd át:

1. 0,006 m³ = … L
2. 2400 cm³ = … L
3. 0,75 L = … cm³

Előbb becsüld meg, melyik mennyiség nagyobb egy liternél.

<details>
<summary>1. kapaszkodó</summary>

A liter és a köbegységek ugyanahhoz a mennyiséghez, a térfogathoz tartoznak. 1 L = 1 dm³.

</details>

<details>
<summary>2. kapaszkodó</summary>

1 m³ = 1000 L, és 1 L = 1000 cm³. Az irány dönti el, hogy 1000-rel szorzol vagy osztasz.

</details>

<details>
<summary>Teljes megoldás</summary>

1. $0{,}006\cdot1000=6$ L.
2. $2400:1000=2{,}4$ L.
3. $0{,}75\cdot1000=750$ cm³.

Az első két mennyiség nagyobb, a harmadik kisebb egy liternél.

Ellenőrzés: 6 L = 6 dm³ = 0,006 m³; 2,4 L = 2400 cm³; 750 cm³ = 750 mL = 0,75 L.

</details>

### M–G07. Meddig ér a víz?

**Feladat.** Egy téglatest alakú tároló belső alapélei 40 cm és 25 cm. A víz 12 cm magasan áll benne. Hány liter víz van a tárolóban? A tároló elég magas, a vízszint vízszintes.

<details>
<summary>1. kapaszkodó</summary>

A víz egy téglatestet tölt ki. A víz magasságával számolj, ne egy ismeretlen teljes tárolómagassággal.

</details>

<details>
<summary>2. kapaszkodó</summary>

Előbb számold ki a $40\cdot25\cdot12$ térfogatot cm³-ben. Ezer köbcentiméter egy liter.

</details>

<details>
<summary>Teljes megoldás</summary>

Az alap területe $40\cdot25=1000$ cm².

A víz térfogata $1000\cdot12=12\,000$ cm³ = 12 L.

Ellenőrzés rétegekkel: ennél az alapnál minden 1 cm magas vízréteg 1000 cm³, azaz 1 L. Tizenkét ilyen réteg 12 L.

**Válasz:** 12 liter víz van benne.

</details>

### M–G08. Teljes csomagok és maradék

**Feladat.** 1,5 kg gyöngyből 120 g-os csomagokat készítünk. Legfeljebb hány teljes csomag készülhet, és hány gramm marad? A csomagolóanyag tömegét nem számítjuk bele.

<details>
<summary>1. kapaszkodó</summary>

Előbb váltsd az 1,5 kg-ot grammra. A teljes csomagok száma egész szám, és nem használhatsz több anyagot, mint amennyi van.

</details>

<details>
<summary>2. kapaszkodó</summary>

1,5 kg = 1500 g. Vizsgáld meg a $1500:120$ hányadost, majd ellenőrizd, mennyit használna fel 12, illetve 13 csomag.

</details>

<details>
<summary>Teljes megoldás</summary>

$1500:120=12{,}5$.

Ez 12 teljes csomagot és egy fél csomagra elegendő maradékot jelent.

A 12 csomag tömege $12\cdot120=1440$ g.  
A maradék $1500-1440=60$ g.

13 csomaghoz $13\cdot120=1560$ g kellene, ezért 13 nem készülhet.

**Válasz:** 12 teljes csomag, 60 g maradékkal.

Itt lefelé választunk egész darabszámot, mert teljes csomagokat tudunk megtölteni. A megvásárolandó csomagok számánál más lehet a kérdés iránya.

</details>

### M–G09. A tizedesvessző nem órakijelző

**Feladat.** Egy feladat elvégzésére két időadatot látunk: 1,35 óra és 1 óra 35 perc. Ugyanannyi időt jelentenek? Ha nem, mennyi a különbség?

<details>
<summary>1. kapaszkodó</summary>

Az 1,35 órában a 0,35 egy óra törtrésze. Egy órában 60 perc van, nem 100.

</details>

<details>
<summary>2. kapaszkodó</summary>

Számold ki a $0{,}35\cdot60$ értékét. A másik adat percben $60+35$.

</details>

<details>
<summary>Teljes megoldás</summary>

$0{,}35\cdot60=21$ perc, ezért 1,35 óra = 1 óra 21 perc = 81 perc.

1 óra 35 perc = 95 perc.

A különbség $95-81=14$ perc.

**Válasz:** nem egyenlők; az 1 óra 35 perc 14 perccel hosszabb.

Visszaellenőrzés: $81:60=1{,}35$ óra.

</details>

### M–G10. Kilométer óránként, méter másodpercenként

**Feladat.** Egy matematikai mozgásmodellben a sebesség állandó, 72 km/h. Hány m/s ez? Mennyi idő alatt tesz meg a modellbeli jármű 250 métert?

<details>
<summary>1. kapaszkodó</summary>

A 72 km/h azt mondja: 1 óra alatt 72 km. Írd át a 72 km-t méterre, az 1 órát másodpercre.

</details>

<details>
<summary>2. kapaszkodó</summary>

Egy óra 3600 s, 72 km pedig 72 000 m. Másodpercenként $72\,000:3600$ métert teszünk meg. A keresett idő a 250 m osztva ezzel a sebességgel.

</details>

<details>
<summary>Teljes megoldás</summary>

$72\,000:3600=20$ m/s.

250 méter ideje $250:20=12{,}5$ s.

Ellenőrzés: $20\cdot12{,}5=250$ m. A sebesség másik ellenőrzése: $20\cdot3{,}6=72$ km/h.

**Válasz:** 20 m/s; az út ideje 12,5 másodperc.

Az eredmény az állandó sebességű modellre vonatkozik, gyorsítással vagy megállással nem számolunk.

</details>

### M–G11. Egységváltás vagy valódi nagyítás?

**Feladat.** Egy kocka éle 2 cm, egy másiké 4 cm.

1. Mekkora a két kocka felszíne?
2. Mekkora a két kocka térfogata?
3. Hányszorosára változott az él, a felszín és a térfogat?

Egy kocka felszíne hat azonos négyzetlap területének összege.

<details>
<summary>1. kapaszkodó</summary>

Egy lap területe él × él. A felszín ennek hatszorosa. A térfogatnál három élhosszt szorzunk össze.

</details>

<details>
<summary>2. kapaszkodó</summary>

Az első kockánál $6\cdot2^2$ cm² és $2^3$ cm³ kell. A másodiknál a 2 helyére 4 kerül. Ezután a második eredményt oszd az elsővel.

</details>

<details>
<summary>Teljes megoldás</summary>

2 cm-es kocka:

- felszín: $6\cdot2^2=6\cdot4=24$ cm²;
- térfogat: $2^3=8$ cm³.

4 cm-es kocka:

- felszín: $6\cdot4^2=6\cdot16=96$ cm²;
- térfogat: $4^3=64$ cm³.

Az él kétszeres, a felszín $96:24=4$-szeres, a térfogat $64:8=8$-szoros.

Itt két különböző méretű tárgyat hasonlítottunk össze. Egységváltásnál ugyanannak a tárgynak a mennyisége maradna változatlan.

</details>

### M–G12. Két liter hány kilogramm?

**Feladat.** Valaki azt állítja, hogy „2 L folyadék tömege biztosan 2 kg”.

1. Következik ez a mértékegységekből?
2. Egy feladatban azt az anyagadatot kapjuk, hogy az adott folyadék minden literének tömege 0,8 kg. Mennyi ekkor 2 L folyadék tömege?

Az edény tömegét nem számítjuk bele, az anyagadatot a teljes vizsgált mennyiségnél változatlannak vesszük.

<details>
<summary>1. kapaszkodó</summary>

A liter térfogatot, a kilogramm tömeget mér. Az átváltási táblázatok nem kapcsolják össze automatikusan a két mennyiséget.

</details>

<details>
<summary>2. kapaszkodó</summary>

A megadott anyagadat szerint minden literhez 0,8 kg tartozik. Két ilyen liter tömege ennek a kétszerese.

</details>

<details>
<summary>Teljes megoldás</summary>

1. Nem. A 2 L térfogatból önmagában nem következik a tömeg. Az anyagra vonatkozó adat is szükséges.
2. A megadott adat alapján $2\cdot0{,}8=1{,}6$ kg.

Ellenőrzés: $1{,}6:2=0{,}8$ kg/L, ami egyezik a feladat adatával.

**Válasz:** az általános állítás nem igazolható; ebben a konkrét feladatban a folyadék tömege 1,6 kg.

Ez két mennyiség közötti számítás anyagadat alapján, nem puszta mértékegységváltás.

</details>

## 8. Két új önálló zárófeladat

Először segítség és megoldás nélkül dolgozz. Írd le a közös egység megválasztását, a műveleteket és egy ellenőrzést. A megoldás megtekintése utáni javítást külön kezeld az első önálló próbától.

### M–Z01. Szalag a szélére, fedés a tetejére

**Feladat.** Egy téglalap alakú lap 1,4 m hosszú és 90 cm széles.

- Hány méter szalag kell a teljes kerületére?
- Mekkora a lefedendő terület cm²-ben?

Átfedéssel, hulladékkal és vastagsággal nem számolunk.

<details>
<summary>Teljes megoldás és ellenőrzés</summary>

A kerülethez métert használva 90 cm = 0,9 m:

$$
K=2(1{,}4+0{,}9)=2\cdot2{,}3=4{,}6\text{ m}.
$$

A területhez centimétert használva 1,4 m = 140 cm:

$$
T=140\cdot90=12\,600\text{ cm}^2.
$$

Ellenőrzés másik egységben:

- kerület: $2(140+90)=460$ cm = 4,6 m;
- terület: $1{,}4\cdot0{,}9=1{,}26$ m² = 12 600 cm².

**Válasz:** 4,6 m szalag; 12 600 cm² terület.

A szegély hosszúság, a fedés terület. Ezért a két válasz egysége sem lehet azonos.

</details>

### M–Z02. Elég az öt palack?

**Feladat.** Egy üres téglatest alakú edény belső méretei 20 cm × 15 cm × 30 cm. Öt darab, egyenként 1,5 L vizet tartalmazó palack teljes tartalmát beletöltjük.

- Mennyi az edény teljes befogadóképessége literben?
- Megtelik-e? Ha nem, még hány liter fér bele?

A palackokban a megadott vízmennyiség van, áttöltési veszteséggel nem számolunk.

<details>
<summary>Teljes megoldás és ellenőrzés</summary>

Az edény térfogata:

$$
20\cdot15\cdot30=9000\text{ cm}^3=9\text{ L}.
$$

A betöltött víz mennyisége:

$$
5\cdot1{,}5=7{,}5\text{ L}.
$$

A szabadon maradó térfogat:

$$
9-7{,}5=1{,}5\text{ L}.
$$

Ellenőrzés: hat ilyen palack összesen $6\cdot1{,}5=9$ L vizet tartalmazna. Öt palack után még egy palacknyi hely maradt.

**Válasz:** az edény 9 L-es; nem telik meg, még 1,5 L fér bele.

</details>

## 9. Öt hibaminta és a javításuk

Az alábbi példák a gondolatmenet tisztázását szolgálják. Nem gyakorisági rangsorok, és egyetlen hibás szám nem bizonyítja, melyik gondolat okozta az eltérést.

| Hibamondat | Vizsgáló kérdés | Javító gondolat |
|---|---|---|
| „Kisebb egységre váltottam, ezért a számot is kisebbé teszem.” | Egy méterhez több centiméteres vagy méteres szakasz kell? | Ugyanahhoz a pozitív mennyiséghez a kisebb egységből több kell. Például 2,4 m = 240 cm. |
| „1 m² = 100 cm², mert 1 m = 100 cm.” | Hány 1 cm²-es négyzet van egy sorban, és hány sor van? | Két irány számít: $100\cdot100=10\,000$. |
| „1 L = 100 cm³, mert a négyzetnél is 100 volt a váltószám.” | Egy 1 dm élű kockában hány réteg van, és egy réteg hány kis kockából áll? | $1$ L = $1$ dm³ = $10\cdot10\cdot10=1000$ cm³. |
| „1,35 óra ugyanaz, mint 1 óra 35 perc.” | Mennyi az egy óra 0,35 része, ha 60 perc az egész? | $0{,}35\cdot60=21$ perc. A tizedes törtrész az órára vonatkozik. |
| „A liter és a kilogramm ugyanannak a táblázatnak két egysége.” | Kaptunk adatot arról, mekkora az adott anyag egy literének tömege? | A térfogat és a tömeg külön mennyiség. Az összekapcsolásukhoz további anyagadat kell. |

**Rövid önellenőrzés:** 0,2 dm³ hány cm³ és hány mL?  
Mivel 1 dm³ = 1000 cm³, az eredmény 200 cm³ = 200 mL. A kockaegység kisebb, ezért a mérőszám nagyobb lett; a térfogat nem változott.

## 10. Ellenőrző gondolatmenet bármely új feladathoz

1. **Mit mérünk?** Hosszúságot, területet, térfogatot, tömeget, időt vagy összetett mennyiséget?
2. **Mi marad változatlan?** Egységváltáskor maga a mennyiség. Nagyításkor ez nem feltétlenül igaz.
3. **Milyen egység kell a válaszhoz?** A szegély méter, a lefedendő felület négyzetméter, az edény befogadóképessége liter is lehet.
4. **Mekkora a váltószám, és miért?** Egy, két vagy három irányban számolunk? Időről van szó, ahol 60 a kapcsolat?
5. **Ésszerű az eredmény?** Kisebb egységhez nagyobb mérőszám tartozik? A víz térfogata elfér az edényben?
6. **Vissza tudom ellenőrizni?** A fordított váltás, az eredeti adatok összege vagy egy másik közös egység ugyanazt adja?

Ha a számod eltér, először az egységeidet nézd meg. A jó szám rossz egységgel más mennyiséget jelenthet.

### Szerkesztői ellenőrzési jegyzet

A kézirat két kidolgozott példát, 12 gyakorlófeladatot két-két fokozatos segítséggel, két új zárófeladatot és öt célzott hibamintát tartalmaz. A számszaki eredmények külön, tiszta JavaScript-ellenőrzéssel, a dimenziók, a csomagszámok és a geometriai feltételek kézi átnézéssel lettek ellenőrizve. A tanulói indoklások automatikus értékelése és az interaktív modell még nincs megvalósítva. Tanulói kipróbálás nem történt.
