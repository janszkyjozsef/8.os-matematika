# 03. Arányosság — mi marad ugyanaz?

> **Státusz:** beépíthető, számszakilag ellenőrzött új tananyagkézirat. A leírt interaktív modell megvalósítási specifikáció; ez még nem új, kész interaktív tanulási útvonal.
>
> **Szint:** 8. osztályos alapozás és ismétlés. A feladatok, a történetek és a magyarázatok saját készítésűek. A pénzösszegek kitalált feladatadatok.

## 1. Mit fogsz tudni megmagyarázni?

A lecke végén ezekre a kérdésekre keress választ:

- Miért őrzi meg az arányt, ha mindkét mennyiséget ugyanazzal a pozitív számmal szorozzuk?
- Miben különbözik az állandó hányados az állandó különbségtől?
- Milyen feltételekkel egyenesen, illetve fordítottan arányos két mennyiség?
- Hogyan segít az egységre jutó mennyiség, a táblázat és a visszaellenőrzés?
- Mikor nem elég a szövegben szereplő néhány szám a modell kiválasztásához?

**Amire építünk:** szorzás és osztás, egyszerű törtek, tizedes számok, a hossz és az idő alapegységei. Ha egy számolás megakaszt, a kapcsolatot akkor is előbb fogalmazd meg: mi változik, és minek kell változatlannak maradnia?

Ebben a leckében nemnegatív mennyiségekkel, a fordított arányosságnál pozitív mennyiségekkel dolgozunk. A darabszámot egész számmal adjuk meg. Egy számítás csak a feladatban megadott feltételek mellett írja le a helyzetet.

## 2. Előbb jósolj, utána számolj

Írd le a jóslatodat egy mondattal. Még ne keresd a pontos eredményt.

1. Ugyanabból a zsinórból kétszer akkora hosszúságot veszünk. Nincs alapdíj vagy kedvezmény. Mi történik az árral?
2. Ugyanazt a munkát kétszer annyi, azonos ütemben dolgozó segítő végzi. A munka szabadon felosztható, nincs közös várakozás. Mi történik az idővel?
3. Egy díj 500 Ft alapdíjból és kilométerenként 200 Ft-ból áll. Kétszer akkora távolság kétszer akkora teljes díjat jelent?
4. Egy négyszög alakú képet minden irányban kétszeresére nagyítunk. A területe kétszeresére nő?

<details>
<summary>A jóslatok ellenőrzése</summary>

1. Az ár kétszeres: ugyanannyi pénz jut minden méterre, és nincs hozzáadott fix költség.
2. Az idő a felére csökken **a felsorolt feltételek mellett**. Ugyanaz a munka több, azonos teljesítményű részre oszlik.
3. Nem. Az alapdíjat nem kell kétszer megfizetni ugyanannál az útnál. Például 2 km 900 Ft, 4 km 1300 Ft, nem 1800 Ft.
4. A terület négyszeres. Kétszer annyi egység fér el az egyik, és kétszer annyi a másik irányban: $2\cdot2=4$.

Ha eltért a jóslatod, ne töröld ki. A lecke végén írd mellé, melyik feltétel vagy összefüggés változtatta meg a gondolatodat.

</details>

## 3. Az arány nem ugyanaz, mint a különbség

Három gyöngykeveréket készítünk:

| Keverék | Kék gyöngy | Fehér gyöngy | Kék : fehér | Fehér mínusz kék |
|---|---:|---:|---|---:|
| A | 2 | 6 | $2:6=1:3$ | 4 |
| B | 4 | 12 | $4:12=1:3$ | 8 |
| C | 3 | 7 | $3:7$ | 4 |

Az A és B keverékben minden kék gyöngyre 3 fehér jut. Az arányuk azonos, bár a darabszámok különbsége megváltozott.

Az A és C keverékben a fehér és kék gyöngyök számának különbsége ugyanannyi. Ettől a keverési arány még nem azonos: $2/6=1/3$, míg $3/7\ne1/3$.

**Az arányt a közös szorzás őrzi meg.** Ha egy adaghoz 2 kék és 6 fehér gyöngy tartozik, akkor két ugyanilyen adaghoz 4 kék és 12 fehér kell. A számlálót és a nevezőt ugyanazzal a pozitív számmal szoroztuk:

$$
\frac{2\cdot2}{6\cdot2}=\frac{2}{6}.
$$

**Az azonos hozzáadás általában nem őrzi meg az arányt.** Egy-egy gyöngy hozzáadása 3 kéket és 7 fehéret ad. Ez más összetétel.

### A sorrend és az egység is számít

A „kék : fehér = 1 : 3” nem ugyanaz, mint a „fehér : kék = 1 : 3”. Előbb mondd meg, melyik mennyiséget melyikhez viszonyítod.

Azonos fajtájú mennyiségek arányához azonos egységet használunk. A 2 m és az 50 cm hossz aránya:

$$
200\text{ cm}:50\text{ cm}=4:1.
$$

A 2 : 50 itt félrevezető lenne, mert a két szám más egységhez tartozik.

Különböző fajtájú mennyiségek hányadosának egysége is van. A 900 Ft / 2,5 m például **360 Ft/m**: ennyi pénz jut egy méterre.

## 4. Egyenes és fordított arányosság

### 4.1. Egyenes arányosság: ugyanannyi jut egy egységre

Legyen $x$ a zsinór hossza méterben, $y$ pedig az ára forintban. Ha minden méter 400 Ft, nincs alapdíj és nincs mennyiségi kedvezmény, akkor:

| Hossz, $x$ | Ár, $y$ | Egy méterre jutó ár, $y/x$ |
|---:|---:|---:|
| 1 m | 400 Ft | 400 Ft/m |
| 1,5 m | 600 Ft | 400 Ft/m |
| 3 m | 1200 Ft | 400 Ft/m |

Az összetartozó értékek hányadosa állandó:

$$
\frac{y}{x}=k,\qquad y=kx.
$$

Ebben a modellben $k=400$ Ft/m. Ha a hosszt egy pozitív számmal szorozzuk, az ár is ugyanennyiszeresére változik.

A nulla hosszhoz itt nulla ár tartozik. A $0/0$ hányadost azonban **nem számítjuk ki**. Az állandó hányadost pozitív hosszúságoknál vizsgáljuk.

**A „mindkettő nő” megfigyelés nem elég.** Az 500 Ft alapdíj + 200 Ft/km modellben a távolság és a teljes díj is nő, de a teljes díj és a távolság hányadosa nem állandó. Az alapdíj levonása után maradó díjrész viszont egyenesen arányos a távolsággal.

### 4.2. Fordított arányosság: ugyanaz oszlik szét több részre

Egy munkához összesen 24 segítőóra szükséges. Ez például azt jelenti, hogy 1 segítő 24 órát, vagy 3 segítő fejenként 8 órát dolgozik.

A modell feltételei:

- ugyanazt a teljes munkát kell elvégezni;
- a segítők egyforma, állandó ütemben dolgoznak;
- a munkát fel lehet osztani közöttük;
- egymást nem akadályozzák, és nincs a létszámtól független közös várakozás vagy előkészítési idő.

| Segítők száma, $n$ | Idő, $t$ | Szorzat, $n\cdot t$ |
|---:|---:|---:|
| 1 | 24 óra | 24 segítőóra |
| 3 | 8 óra | 24 segítőóra |
| 6 | 4 óra | 24 segítőóra |
| 8 | 3 óra | 24 segítőóra |

Most a szorzat állandó:

$$
n\cdot t=W,\qquad t=\frac{W}{n}.
$$

Ha a létszám kétszeres, az idő feleakkora. Ha a létszám a korábbi érték másfélszerese, az időt 1,5-del osztjuk.

A nulla segítőhöz nem rendelünk véges elkészülési időt: nullával nem osztunk. A létszám itt egész szám, így például 2,5 segítőt nem választunk a táblázatban.

**Az „az egyik nő, a másik csökken” megfigyelés sem elég.** Ha 60 oldalból óránként 10 oldalt olvasol el, 1 óra után 50, 2 óra után 40 oldal marad. A szorzatok $1\cdot50=50$ és $2\cdot40=80$. Nem állandók, ezért ez nem fordított arányosság.

### 4.3. Hogyan válassz modellt?

1. Nevezd meg a két mennyiséget és az egységüket.
2. Mondd ki, mit tartunk változatlannak: az egységárat, az összes munkát, a teljes utat vagy valami mást.
3. Jósolj: több, kevesebb vagy ugyanannyi lesz a keresett érték?
4. Vizsgáld a hányadost vagy a szorzatot.
5. Ellenőrizd az eredményt az eredeti helyzetben.

Két táblázatsor egyező hányadosa vagy szorzata ellenőrzésre jó, de önmagában nem bizonyítja, hogy minden további helyzetben is ugyanaz a szabály működik. Ehhez a megadott modell vagy a helyzet feltételei is kellenek.

## 5. Tervezett interaktív modell: Arányosság-vizsgáló

**Ez specifikáció, még nincs megvalósított felület.**

### Tanulói feladat

Válassz helyzetet, jósolj egy új értéket, majd változtasd meg az egyik mennyiséget. Gyűjts legalább három adatpárt. Magyarázd meg, melyik vizsgált mennyiség marad állandó.

| Modell | Állítható adat | Rögzített feltétel | Megjelenő összefüggés |
|---|---|---|---|
| Zsinór ára | 0–5 m, negyedméteres lépések | 400 Ft/m, nincs alapdíj | $y=400x$ |
| Közös munka | 1–12 segítő, egész létszám | 24 segítőóra, azonos ütem és szabad feloszthatóság | $t=24/n$ |
| Alapdíjas út | 0–10 km, fél kilométeres lépések | 500 Ft alapdíj + 200 Ft/km | $y=500+200x$ |

### Viselkedés és visszajelzés

- Először a jóslatot és az indokot kérjük; a pontos eredményt külön ellenőrzéssel mutatjuk.
- A mennyiségek változását ábra, adatpártáblázat és szöveges összefoglaló együtt jeleníti meg.
- A hányados és a szorzat oszlopa külön bekapcsolható. Nem írunk „állandó” jelzést egyetlen adatpár alapján.
- A munkamodellben csak egész létszámhoz tartozó pontokat rajzolunk. Nem sugalljuk, hogy egy fél ember a feladat megengedett beállítása.
- A nulla bemenetnél a zsinór ára 0 Ft, az alapdíjas út díja 500 Ft. A hányados helyén „0-val itt nem osztunk” jelenik meg.
- A munkamodellben 0 segítő nem választható.
- Nem egész eredménynél pontos törtet is mutatunk. Például 5 segítőnél az idő $24/5$ óra = 4,8 óra.
- Téves választásnál ellenpéldával kérdezünk vissza: „2 km 900 Ft, 4 km 1300 Ft. Megkétszereződött a teljes díj?”
- Az állítás megértését külön indoklás ellenőrzi. Egy csúszka elmozdítása önmagában nem bizonyít tanulást.

### Hozzáférhetőség és elfogadási feltételek

Minden vezérlő kapjon szöveges címkét, billentyűzetes állítást és látható számértéket. Az ábra helyett önmagában is használható legyen a táblázat. A visszajelzés ne csak színre épüljön; az animáció kikapcsolható legyen.

Ellenőrizendő konkrét állapotok:

- 1,5 m zsinór ára 600 Ft; 3 m ára 1200 Ft.
- 3 segítő ideje 8 óra; 6 segítőé 4 óra.
- 2 km alapdíjas út 900 Ft; 4 km 1300 Ft.
- 0 m esetén nincs nullával osztás.
- Ugyanaz a beállítás ugyanazt a pontos eredményt adja.

## 6. Két kidolgozott példa

### A–P1. Egy méterből gondolkodva

**Feladat.** 2,5 m dekorzsinór 900 Ft. Ugyanabból a zsinórból 7 m-t veszünk, változatlan egységárral, alapdíj és kedvezmény nélkül. Mennyit fizetünk?

**Jóslat.** 5 m ára 1800 Ft, 7,5 m ára 2700 Ft lenne. A 7 m ára ezek közé esik.

1. **Keressük meg egy méter árát.**
   $900:2{,}5=360$ Ft/m.
   Azért osztunk a hosszal, mert az összes árat az egy méterre jutó árra bontjuk.
2. **Vegyük az egységár hétszeresét.**
   $7\cdot360=2520$ Ft.
   Minden méter ugyanannyiba kerül, ezért a teljes ár a méterek számával együtt változik.
3. **Ellenőrizzünk.**
   $2520:7=360$ Ft/m, ugyanannyi, mint az eredeti adatpárnál. Az eredmény 1800 és 2700 Ft között van.

**Válasz:** 2520 Ft-ot fizetünk.

**Amit érdemes megőrizni:** az „egységre visszavezetés” azt teszi láthatóvá, mi marad állandó. Nem kötelező mindig egy egységig menni: más, könnyen áttekinthető közös lépés is használható.

### A–P2. Több gép, ugyanaz a munka

**Feladat.** Négy azonos nyomtató 12 perc alatt készít el egy meghatározott mennyiségű kártyát. Mennyi idő kell hat ilyen nyomtatónak?

Feltesszük, hogy a gépek azonos, állandó ütemben működnek, a nyomtatás szabadon felosztható, minden gép egyszerre indul, és nincs közös szűk keresztmetszet vagy külön előkészítési idő.

**Jóslat.** Hat gépnek 12 percnél kevesebb idő kell. A gépek száma nem kétszereződött meg, ezért az időt nem felezzük.

1. **Ugyanahhoz a munkához ugyanannyi gépperc tartozik.**
   $4\cdot12=48$ gépperc.
2. **Ezt a munkát hat gép között osztjuk el.**
   $48:6=8$ perc.
3. **Ellenőrzés az eredeti feltétellel.**
   $6\cdot8=48$ gépperc. A teljes munkamennyiség egyezik.

Másik út: a gépek száma $6/4=1{,}5$-szeresére nőtt, ezért az idő $12:1{,}5=8$ perc.

**Válasz:** a modell feltételei mellett 8 perc.

**Amit érdemes megőrizni:** a szorzat állandósága a teljes munkából következik. A gépek számából önmagában nem lehet ezt a kapcsolatot kitalálni.

## 7. Tizenkét gyakorlófeladat

Először segítség nélkül próbálkozz. Ha elakadsz, előbb az első kapaszkodót nyisd meg. A megoldás megtekintése után fogalmazd meg saját szavaiddal, miért azt a műveletet használtuk.

### A–G01. Ugyanaz a keverék? — összehasonlítás

**Feladat.** Egy díszben 3 piros és 9 fehér gyöngy van. Melyik új összeállítás őrzi meg a piros : fehér arányt?

- A: 6 piros, 18 fehér.
- B: 5 piros, 11 fehér.
- C: 4 piros, 12 fehér.

Indokold azt is, miért nem elég a fehér és piros gyöngyök számának különbségét nézni.

<details>
<summary>1. kapaszkodó</summary>

Az eredeti díszben egy piros gyöngyre hány fehér jut? Ugyanezt kérdezd meg minden új összeállításnál.

</details>

<details>
<summary>2. kapaszkodó</summary>

Az eredeti arány $3:9=1:3$. Egyszerűsítsd a $6/18$, $5/11$ és $4/12$ törteket, vagy ellenőrizd, hogy a fehérek száma a pirosak háromszorosa-e.

</details>

<details>
<summary>Teljes megoldás</summary>

Az eredeti hányados $3/9=1/3$.

- A: $6/18=1/3$, tehát megfelelő.
- B: $5/11\ne1/3$, tehát nem megfelelő. Öt piros mellé 15 fehér kellene.
- C: $4/12=1/3$, tehát megfelelő.

Az eredeti különbség $9-3=6$, és B-nél is $11-5=6$. A különbség egyezése mégsem tartotta meg az arányt.

**Válasz:** A és C.

</details>

### A–G02. Mennyibe kerül a kisebb adag? — egyenes arányosság

**Feladat.** 4,5 kg alma 1800 Ft. Ugyanazzal a kilogrammonkénti árral, kedvezmény és egyéb díj nélkül mennyibe kerül 1,75 kg?

<details>
<summary>1. kapaszkodó</summary>

A kisebb tömeghez kisebb ár tartozik. 1,75 kg a 4,5 kg felénél is kevesebb, ezért az árnak 900 Ft alatt kell lennie.

</details>

<details>
<summary>2. kapaszkodó</summary>

Előbb számold ki az egy kilogrammra jutó árat: $1800:4{,}5$. Ezt szorozd 1,75-tel.

</details>

<details>
<summary>Teljes megoldás</summary>

Az egységár $1800:4{,}5=400$ Ft/kg.

Az 1,75 kg ára $1{,}75\cdot400=700$ Ft.

Ellenőrzés: $700:1{,}75=400$ Ft/kg. A 700 Ft valóban kisebb 900 Ft-nál.

**Válasz:** 700 Ft.

</details>

### A–G03. Hiányzó táblázatadatok — egységnyi idő

**Feladat.** Egy nyomtató állandó ütemben működik, a megfigyelés elején nincs kész oldal, és nincs indulási késleltetés.

| Idő | 0 perc | 3 perc | 5 perc | 8 perc |
|---|---:|---:|---:|---:|
| Elkészült oldalak száma | ? | 72 | ? | 192 |

Töltsd ki a táblázatot, és add meg a nyomtató percenkénti teljesítményét.

<details>
<summary>1. kapaszkodó</summary>

Oszd el az elkészült oldalak számát az eltelt percek számával. A nulla perces adatpárnál ne képezz $0/0$ hányadost.

</details>

<details>
<summary>2. kapaszkodó</summary>

$72:3=24$ oldal/perc. Öt perc alatt ennek az ötszöröse készül el.

</details>

<details>
<summary>Teljes megoldás</summary>

A teljesítmény 24 oldal/perc. Ez a másik megadott párnál is stimmel: $192:8=24$.

- 0 perc alatt 0 oldal készült el.
- 5 perc alatt $5\cdot24=120$ oldal.

A kész táblázat oldalszámai: **0, 72, 120, 192**.

Az egyenes arányosságot itt az állandó ütem és a nulla kezdeti mennyiség együtt alapozza meg.

</details>

### A–G04. Az alapdíj csapdája — ellenpélda

**Feladat.** Egy kitalált szállítási díj 500 Ft alapdíjból és kilométerenként 200 Ft-ból áll. Lili szerint kétszer olyan messzire kétszer annyiba kerül a szállítás. Vizsgáld meg a 2 km-es és a 4 km-es utat. Mi arányos egyenesen a távolsággal: a teljes díj vagy valamelyik díjrész?

<details>
<summary>1. kapaszkodó</summary>

Az alapdíjat mindkét útnál egyszer számítjuk fel. Előbb külön számold ki a két teljes díjat.

</details>

<details>
<summary>2. kapaszkodó</summary>

2 km-nél $500+2\cdot200$, 4 km-nél $500+4\cdot200$ Ft a díj. Hasonlítsd össze a második összeget az első kétszeresével.

</details>

<details>
<summary>Teljes megoldás</summary>

2 km ára $500+400=900$ Ft.  
4 km ára $500+800=1300$ Ft.

A 900 Ft kétszerese 1800 Ft, nem 1300 Ft. A teljes díj tehát nem egyenesen arányos a távolsággal. A hányadosok is eltérnek: $900:2=450$, illetve $1300:4=325$ Ft/km.

Az alapdíjon felüli díjrész 400 és 800 Ft. Ez a rész egyenesen arányos a távolsággal: minden kilométerre 200 Ft jut.

</details>

### A–G05. Kevesebb segítő — fordított arányosság

**Feladat.** Hat egyforma ütemben dolgozó segítő 10 óra alatt végez egy munkával. Mennyi idő kell négy ilyen segítőnek? Ugyanaz a munka szabadon felosztható, nincs közös várakozás, és a munkaütem nem változik.

<details>
<summary>1. kapaszkodó</summary>

Kevesebb segítőnek több idő kell. A 10 óránál kisebb eredmény ellentmondana a feltételeknek.

</details>

<details>
<summary>2. kapaszkodó</summary>

A teljes munka $6\cdot10=60$ segítőóra. Ezt oszd el négy segítő között.

</details>

<details>
<summary>Teljes megoldás</summary>

$6\cdot10=60$ segítőóra szükséges.

Négy segítő ideje $60:4=15$ óra.

Ellenőrzés: $4\cdot15=60$ segítőóra, ugyanannyi, mint eredetileg.

**Válasz:** 15 óra. A létszám $4/6=2/3$-szorosára csökkent, az idő ezért $3/2$-szeresére nőtt.

</details>

### A–G06. Hány egész gép kell? — határfeltétel

**Feladat.** Négy azonos gép 15 óra alatt végez el egy szabadon felosztható munkát. Legalább hány ilyen gép kell, hogy a munka legfeljebb 8 óráig tartson? Minden gép azonos ütemben, egyszerre dolgozik; nincs külön előkészítési idő.

<details>
<summary>1. kapaszkodó</summary>

Először állapítsd meg a teljes munka gépórában mért mennyiségét. A szükséges gépek száma egész szám lesz.

</details>

<details>
<summary>2. kapaszkodó</summary>

A munka $4\cdot15=60$ gépóra. Nyolcórás határidőhöz $60:8=7{,}5$ gépnyi teljesítmény kellene. Ellenőrizd külön a 7 és a 8 gépet.

</details>

<details>
<summary>Teljes megoldás</summary>

A teljes munka 60 gépóra.

- 7 gép 8 óra alatt $7\cdot8=56$ gépóra munkát végez, ez kevés.
- 8 gép 8 óra alatt 64 gépórára lenne képes, tehát elég.
- A tényleges elkészülési idő 8 géppel $60:8=7{,}5$ óra.

**Válasz:** legalább 8 gép kell.

Nem tetszőleges kerekítési szabályt alkalmazunk: a legkisebb olyan egész létszámot keressük, amely még teljesíti a határidőt.

</details>

### A–G07. Ugyanaz az út — sebesség és idő

**Feladat.** Egy matematikai útmodellben a megtett távolság mindig 90 km, a sebesség állandó, megállás nincs. Mennyi az utazási idő 45 km/h, illetve 60 km/h sebességnél? Milyen kapcsolatban van ebben a modellben a sebesség és az idő?

<details>
<summary>1. kapaszkodó</summary>

A sebesség azt mondja meg, hány kilométert teszünk meg egy óra alatt. A teljes út most mindkét esetben ugyanannyi.

</details>

<details>
<summary>2. kapaszkodó</summary>

Használd a „sebesség × idő = út” kapcsolatot: $45\cdot t=90$, illetve $60\cdot t=90$.

</details>

<details>
<summary>Teljes megoldás</summary>

45 km/h-nál $90:45=2$ óra.

60 km/h-nál $90:60=1{,}5$ óra, vagyis 1 óra 30 perc.

A szorzatok megegyeznek: $45\cdot2=90$, $60\cdot1{,}5=90$ km. A rögzített út és a megadott feltételek miatt a sebesség és az idő fordítottan arányos.

Ez nem állítás egy tetszőleges valós utazásról: a várakozás vagy változó sebesség más modellt igényelne.

</details>

### A–G08. Csökken, de hogyan? — téves szabály javítása

**Feladat.** Egy 60 oldalas szövegből óránként 10 oldalt olvasunk el, állandó ütemben. Marci szerint az eltelt idő és a hátralévő oldalak száma fordítottan arányos, mert az egyik nő, a másik csökken. Vizsgáld meg az 1, 2 és 3 órás állapotot.

<details>
<summary>1. kapaszkodó</summary>

Először a hátralévő oldalakat számold ki. Fordított arányosságnál az eltelt idő és a hátralévő oldalszám szorzatának kellene ugyanannyinak lennie.

</details>

<details>
<summary>2. kapaszkodó</summary>

A hátralévő oldalszámok: $60-10$, $60-20$, $60-30$. Szorozd meg ezeket rendre 1-gyel, 2-vel és 3-mal.

</details>

<details>
<summary>Teljes megoldás</summary>

| Eltelt idő | Hátralévő oldal | A két szám szorzata |
|---:|---:|---:|
| 1 óra | 50 | 50 |
| 2 óra | 40 | 80 |
| 3 óra | 30 | 90 |

A szorzat nem állandó, ezért nincs fordított arányosság.

A helyes szabály: minden eltelt órával 10-zel csökken a hátralévő oldalak száma. Ez állandó különbségű csökkenés. Ebben a modellben 0–6 óra között értelmezzük a helyzetet; a szöveg elfogyása után nem keletkezik negatív oldalszám.

</details>

### A–G09. Arány szerinti felosztás

**Feladat.** Egy alkotóműhely 7200 Ft-ját papírra és festékre fordítja. A papírra és a festékre költött összeg aránya 3 : 5. Mennyi jut a két célra?

<details>
<summary>1. kapaszkodó</summary>

A 3 és az 5 az egymáshoz viszonyított részek számát jelenti. Hány ilyen egyenlő rész alkotja a teljes összeget?

</details>

<details>
<summary>2. kapaszkodó</summary>

Összesen $3+5=8$ rész van. Egy rész értéke $7200:8$. A papírra 3, a festékre 5 rész jut.

</details>

<details>
<summary>Teljes megoldás</summary>

Egy rész $7200:8=900$ Ft.

Papír: $3\cdot900=2700$ Ft.  
Festék: $5\cdot900=4500$ Ft.

Ellenőrzés: $2700+4500=7200$ Ft, és $2700:4500=3:5$.

A papírra a teljes pénz $3/8$ része jut, nem $3/5$ része. A $3/5$ a papír és a festék összegének egymáshoz viszonyított aránya.

</details>

### A–G10. Térképről a valóságba

**Feladat.** Egy térkép méretaránya 1 : 25 000. Egy egyenes szakasz a térképen 3,6 cm hosszú. Mekkora ennek megfelelő egyenes távolság a valóságban méterben és kilométerben?

<details>
<summary>1. kapaszkodó</summary>

A méretarány azonos egységben értendő: a térképi 1 cm a valóságban 25 000 cm-nek felel meg.

</details>

<details>
<summary>2. kapaszkodó</summary>

Előbb számold ki $3{,}6\cdot25\,000$ értékét centiméterben. Centiméterről méterre 100-zal, méterről kilométerre 1000-rel osztunk.

</details>

<details>
<summary>Teljes megoldás</summary>

$3{,}6\cdot25\,000=90\,000$ cm.

$90\,000$ cm = 900 m = 0,9 km.

Ellenőrzés: 1 cm a térképen 250 m, így 3,6 cm $3{,}6\cdot250=900$ m.

**Válasz:** 900 m, azaz 0,9 km. Ez a megadott egyenes szakasz hossza; nem feltétlenül egy kanyargó útvonal hossza.

</details>

### A–G11. Nagyítás két irányban

**Feladat.** Egy téglalap oldalai 4 cm és 6 cm. Mindkét oldalt kétszeresére nagyítjuk. Hányszorosára változik a kerület és a terület? Miért nem jó az a szabály, hogy „kétszeres nagyítás, kétszeres terület”?

<details>
<summary>1. kapaszkodó</summary>

Az új oldalak 8 cm és 12 cm. A kerületet oldalak összeadásával, a területet két oldal szorzatával kapjuk.

</details>

<details>
<summary>2. kapaszkodó</summary>

Eredetileg $K=2(4+6)$ és $T=4\cdot6$. Újra számold ki ugyanezeket a 8 cm-es és 12 cm-es oldalakkal.

</details>

<details>
<summary>Teljes megoldás</summary>

Eredeti kerület: $2(4+6)=20$ cm.  
Új kerület: $2(8+12)=40$ cm, tehát kétszeres.

Eredeti terület: $4\cdot6=24$ cm².  
Új terület: $8\cdot12=96$ cm², tehát négyszeres.

Mindkét irányban kétszer annyi egységnégyzet fér el: $2\cdot2=4$. A kerület a nagyítási tényezővel egyenesen arányosan változik; a terület ebben a minden irányú nagyításban nem.

</details>

### A–G12. Elég az adat? — modellkritika

**Feladat.** „Három diák két óra alatt elkészít egy dekorációt. Hat diák biztosan egy óra alatt végez.” Következik-e a második mondat önmagában az elsőből? Adj olyan feltételeket, amelyek mellett igaz lenne, és olyan példát, amelyben nem igaz.

<details>
<summary>1. kapaszkodó</summary>

Lehet-e a munkában olyan rész, amelyet több emberrel sem lehet gyorsabban elvégezni? Minden diák ugyanolyan ütemben dolgozik?

</details>

<details>
<summary>2. kapaszkodó</summary>

Hasonlíts össze két modellt:

- a teljes munka 6 diákóra, szabadon elosztható;
- van 1 óra közös, nem rövidíthető előkészítés, utána még 3 diákóra felosztható munka.

Mindkettő megfelel-e a három diákról szóló adatnak?

</details>

<details>
<summary>Teljes megoldás</summary>

A kétórás adat önmagában nem elég a biztos állításhoz.

**Első modell:** az egész munka 6 diákóra, mindenki azonos ütemben dolgozik, és minden munkarész felosztható. Három diáknál $6:3=2$ óra, hatnál $6:6=1$ óra. Itt igaz az állítás.

**Második modell:** előbb 1 óra közös, nem rövidíthető előkészítés szükséges, majd 3 diákóra felosztható munka. Három diáknál $1+3:3=2$ óra. Hat diáknál $1+3:6=1{,}5$ óra, nem 1 óra.

Ugyanaz az első adat két eltérő folytatással is összeegyeztethető. Ezért a feltételeket is tisztázni kell.

</details>

## 8. Két új önálló zárófeladat

Ezekhez először ne nyisd meg a megoldást. Írd le a választ, az egységet, a választott kapcsolatot és legalább egy ellenőrzést. Ha később megtekinted a magyarázatot, az aznapi önálló próbát különítsd el a segítséggel végzett javítástól.

### A–Z01. A füzetcsomag

**Feladat.** Hat azonos füzet összesen 1740 Ft. Az egységár változatlan, nincs csomagkedvezmény vagy külön díj. Mennyibe kerül tizenegy füzet? Indokold, milyen arányosságot használtál.

<details>
<summary>Teljes megoldás és ellenőrzés</summary>

Egy füzet ára $1740:6=290$ Ft/db.

Tizenegy füzet ára $11\cdot290=3190$ Ft.

Az ár és a darabszám egyenesen arányos, mert az egy füzetre jutó ár végig azonos, és nincs hozzáadott díj.

Ellenőrzés: $3190:11=290$ Ft/db. A 11 füzet ára kisebb 12 füzet áránál, amely $2\cdot1740=3480$ Ft lenne.

**Válasz:** 3190 Ft.

</details>

### A–Z02. Több szivattyú

**Feladat.** Öt azonos szivattyú 20 perc alatt emel át egy meghatározott vízmennyiséget. Mennyi idő kell nyolc ilyen szivattyúnak? Azonos vízmennyiséggel, állandó és egymástól független teljesítménnyel számolunk; nincs előkészítési vagy várakozási idő. Add meg az időt percben, majd perc és másodperc alakban.

<details>
<summary>Teljes megoldás és ellenőrzés</summary>

A szükséges munka $5\cdot20=100$ szivattyúperc.

Nyolc szivattyú ideje $100:8=12{,}5$ perc.

A fél perc $0{,}5\cdot60=30$ másodperc, ezért ez 12 perc 30 másodperc.

Ellenőrzés: $8\cdot12{,}5=100$ szivattyúperc. A nagyobb gépszámhoz kisebb idő tartozik.

A szivattyúk száma és az idő a felsorolt feltételekkel fordítottan arányos.

**Válasz:** 12,5 perc, azaz 12 perc 30 másodperc.

</details>

## 9. Öt hibaminta és a javításuk

Ezek megbeszélésre szánt hibamondatok, nem gyakorisági rangsor. Egyetlen rossz végértékből nem tudjuk biztosan, mi okozta a hibát; a gondolatmenetre is rákérdezünk.

| Hibamondat | Vizsgáló kérdés | Javító gondolat |
|---|---|---|
| „Mindkét számhoz ugyanannyit adtam, tehát az arány megmaradt.” | A $2:6$ és a $3:7$ arányban ugyanannyi fehér jut egy kékre? | Az arányt közös szorzás őrzi meg. Azonos hozzáadás általában csak a különbséget hagyja változatlanul. |
| „Ha mindkét mennyiség nő, egyenes arányosság van.” | Az 500 Ft alapdíj + 200 Ft/km esetén 2 km és 4 km teljes díjának hányadosa is 2? | Egyenes arányossághoz állandó egységre jutó mennyiség kell. A fix hozzáadott tag ezt a teljes mennyiségnél megszünteti. |
| „Ha az egyik nő, a másik csökken, fordított arányosság van.” | A hátralévő oldalaknál $1\cdot50$ és $2\cdot40$ megegyezik? | Fordított arányosságnál a szorzat állandó. A csökkenés ténye önmagában kevés. |
| „Több emberrel mindig ugyanannyiszorosára rövidül az idő.” | Van közös várakozás, nem felosztható munkarész vagy eltérő munkaütem? | Csak a rögzített teljes munka és a megfelelő munkaszervezési feltételek teszik indokolttá a fordított arányosságot. |
| „A 3 : 5 aránynál az első rész az egész $3/5$ része.” | Hány egyenlő arányrészből áll együtt a két rész? | Összesen 8 rész van: az egészből $3/8$ és $5/8$ jut a két célra. A $3/5$ a két rész egymáshoz viszonyított aránya. |

**Rövid önellenőrzés:** 1600 Ft-ot 3 : 5 arányban osztunk fel. Egy rész 200 Ft, ezért a két összeg 600 és 1000 Ft. Az összegük 1600, az arányuk 3 : 5.

## 10. Visszatérés a logikához

Válassz egy mai feladatot, és fejezd be ezeket a mondatokat:

- „A két vizsgált mennyiség…”
- „Ami változatlan marad…”
- „Ezért a hányadost / szorzatot / más szabályt használom…”
- „A modell akkor nem lenne megfelelő, ha…”
- „Az eredményt így ellenőriztem…”

Később egy más számokkal és más helyzettel megfogalmazott feladaton érdemes visszatérni a kapcsolatra. A mostani jó válasz önmagában nem bizonyítja, hogy minden új helyzetben felismered a modellt.

### Szerkesztői ellenőrzési jegyzet

A kézirat két kidolgozott példát, 12 gyakorlófeladatot két-két fokozatos segítséggel, két új zárófeladatot és öt célzott hibamintát tartalmaz. A számszaki eredmények külön, tiszta JavaScript-ellenőrzéssel, a feltételek és az egységek kézi átnézéssel lettek ellenőrizve. A tanulói indoklások automatikus értékelése és az interaktív modell még nincs megvalósítva. Tanulói kipróbálás nem történt.
