# Matek8 0.3.1 — javítás és kiadási ellenőrzés

2026. november 6. Kiindulópont: `bbf3cb671148d9294a6b1440e5de4cf3e31aa078`.

## Javítások

- A célzott Pitagorasz-gyakorlás helyesen az átfogó **négyzetéből** vonja ki az ismert befogó négyzetét.
- Oldalváltáskor a billentyűzetes fókusz a főtartalomra kerül; a böngészőlap címe követi a megnyitott leckét vagy oldalt. Első megnyitáskor és válaszgépeléskor nem veszi el a fókuszt.
- A gyakorlómódok `aria-pressed`, az aktív témalink `aria-current` állapotot kapott. A választómező és a többsoros válasz fókuszjelzése egységes.
- Az LF-sortörési szabály megőrzi a HTML bájtjait Windows checkoutban is. A korábbi friss checkout 29 hozzáadott bájttal eltért a jegyzéktől; a javított kiadás `core.autocrlf=true` mellett is bájtra azonos.
- A fejlesztői belépő beágyazott ikont kapott. A telepített Chrome az ikon nélküli oldalon 404-es favicon-kérést jelzett; a javítás után a konzolhibákra vonatkozó eredeti elvárás is sikeres.
- A régi tartalmi másolatok megmaradtak; a jelenlegi snapshot `content/v0.3.1/`. A profilséma változatlanul 3.

## Végleges helyi bizonyíték

HTML: **796 746 bájt**, SHA-256: `839c787ef8187dcd447e6389f2ba0c1784678f32ed8b8dd2929baaa35d3ae494`.

| Ellenőrzés | Eredmény |
|---|---:|
| Matematikai, tartalmi, modell- és mentésteszt | 168/168 |
| Kiadás és tartalmi egyezés | 9/9 |
| Eredeti utak böngészős próbái | 18/18 |
| Publikálható kiadás, új navigációs regresszióval | 13/13 |
| Alapozó utak és valódi v1-mentés migrációja | 26/26 |
| Új utak, valódi v2-mentés és célzott javítás | 22/22 |
| Automatikus hozzáférhetőségi állapotok | 37, jelzett szabálysértés nélkül |

Összesen **177 forrás- és kiadásteszt, 79 böngészős forgatókönyv**. A végleges soros futás Chrome/Chromium 147.0.7727.139 alatt, külön tesztprofilokkal történt. Az önálló kiadás offline megoldása és exportja hálózati kérés nélkül sikeres. A korábbi mentések megőrzése és a 320/390 px-es elrendezések a tesztcsomag részei. A kezdőlapot asztali nézetben, a betűs kifejezések leckéjét és műhelyét asztali és 390 px-es nézetben külön is megnyitottuk, képi ellenőrzéssel.

Egy köztes tartalomteszt a 3 másodperces virtuálisgép-időkorláton megállt. Ugyanazt a végleges fájlt változatlan elvárással és időkorláttal újrafuttattuk: minden teszt sikeres. Az ellenőrzést nem lazítottuk.

A [gépi összefoglaló](ellenorzes/v0.3.1/summary.json) rögzíti a kiadáshasht, tesztszámokat és helyi jelentések hashét. A teljes helyi naplók és generált próbafájlok a figyelmen kívül hagyott `test-results/` és `app/test-results/` mappában vannak. A megismétlés parancsai a [fejlesztői útmutatóban](FEJLESZTES.md) találhatók.

## Közzététel és korlátok

A GitHub Pages Source beállítása GitHub Actions lett, és újratöltés után is megmaradt. A közzétételhez az adott commit ellenőrzési és telepítési jobjának sikere, majd a nyilvános HTML hashének és egy élő feladatmegoldásnak az ellenőrzése szükséges. A helyi tesztek ezt önmagukban nem helyettesítik.

Ez a kiadás a meglévő tizennégy tanulási út javítása. Nem jelenti a teljes évfolyam elkészültét, fizikai telefonos vagy képernyőolvasós tanúsítást, illetve tanári és tanulói eredményességvizsgálatot.
