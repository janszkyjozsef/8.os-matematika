# Az új alapozó kéziratok ellenőrzése

**Dátum:** 2026. november 6.  
**Tárgy:** a `docs/tananyag/` könyvtár négy új kézirata.

## Elkészült tartalom

| Fejezet | Kidolgozott példa | Gyakorlófeladat | Fokozatos segítség | Önálló próba | Tévképzet javítása |
|---|---:|---:|---:|---:|---:|
| Számfogalom és előjelek | 2 | 12 | 24 | 2 | 5 |
| Műveleti sorrend | 2 | 12 | 24 | 2 | 5 |
| Arányosság | 2 | 12 | 24 | 2 | 5 |
| Mértékegységek | 2 | 12 | 24 | 2 | 5 |
| **Összesen** | **8** | **48** | **96** | **8** | **20** |

Minden gyakorlóhoz és önálló próbához teljes megoldás is tartozik. A 48 gyakorlófeladat egy része több részfeladatból áll; az összesítés feladatszintű, nem számlálja külön a részfeladatokat.

## Tényleges ellenőrzési módszer

A számpéldákat a szövegben közölt értékektől külön, tiszta JavaScript-számításokkal is újraszámoltuk. A számfogalom és a műveleti sorrend esetében pontos egész számlálós, egész nevezős, `bigint`-alapú törtaritmetika is szerepelt az ellenőrzésben. Az arányosságnál és egységváltásnál többek között visszahelyettesítés, hányados- és szorzatellenőrzés, közös egységre váltás, valamint egész darabszámhoz tartozó határvizsgálat történt.

| Vizsgálat | Tényleges eredmény |
|---|---|
| Számfogalom és előjelek: számszaki és fogalmi referenciák | 55/55 sikeres |
| Műveleti sorrend: számszaki és fogalmi referenciák | 50/50 sikeres |
| Arányosság és mértékegységek: számszaki ellenőrzések | 155/155 sikeres |
| Arányosság és mértékegységek: szerkezeti ellenőrzések | 26/26 sikeres |

A számfogalom és a műveleti sorrend szerkezetét is ellenőriztük: mindegyikben megvan a tizenkét gyakorló, a két-két segítség, a teljes megoldás, a két külön zárófeladat és a két kidolgozott példa.

A négy teljes szöveget szerkesztői átnézés is követte. Ennek során a fogalmakat, a modellfeltételeket, az egységeket, az alternatív megoldásokat és a hibajavítások értelmét vizsgáltuk. Az egyik abszolútérték-jeleket tartalmazó táblázatsor Markdown-formázását javítottuk.

## A bizonyíték határai

Ezek a számítások a kéziratok készítésekor a JavaScript-végrehajtóban futottak. Nem a GitHub Actions böngészős tesztjének eredményei. A jelenlegi CI az alkalmazás kiadását és annak visszanyert adatmásolatát vizsgálja; a kéziratok prózájának és minden matematikai állításának automatikus értékelése nincs megvalósítva.

A szerkesztői ellenőrzés nem külső matematikatanári lektorálás, és nem tanulói kipróbálás. A kéziratokban szereplő interaktív műhelyek fejlesztési tervek. Új, kész alkalmazásbeli tanulási útként akkor jelölhetők, ha a tartalom és a műhely megvalósult, a feladatok ellenőrzése működik, és a megfelelő tesztek is sikeresek.

## Következő tartalmi ellenőrzés

A tanuló új számpéldán magyarázza el a választott művelet indokát. A téves választ ne kizárólag végérték alapján soroljuk hibakategóriába: kérdezzünk rá a gondolatmenetre. Az első önálló próbát és a megoldás megtekintése utáni javítást külön kell rögzíteni.
