# A v0.1.0 tananyagának olvasható adatmásolata

A `v0.1.0/lessons.json` a hat működő lecke teljes tartalmát őrzi: célok, előismeretek, jóslatok, magyarázatok, kidolgozott példák, gyakorlófeladatok, önálló próba, fokozatos segítségek, megoldások és fogalomtár.

A `v0.1.0/curriculum.json` a 24 modulból és 137 tervezett egységből álló tématérképet tartalmazza. A tématérkép nem jelenti a benne felsorolt összes lecke megvalósítását.

**Származás:** ezeket az adatokat a bájtra ellenőrzött, önálló `index.html` kiadásból nyertük vissza; nem kézzel újraírt vagy újragenerált tananyagok. A `checks/content.test.mjs` a kiadásban ténylegesen szereplő objektumokkal hasonlítja össze őket.

**Szerkesztési állapot:** a JSON fájlok átnézhető adatmásolatok. A jelenlegi kiadás nem tölti be ezeket külső fájlként; a tartalom az `index.html` programjába van építve. A teljes moduláris forrás importja után az eredeti tartalommodellből kell új buildet készíteni, és frissíteni ezeket a másolatokat. Egy JSON-fájl módosítása önmagában nem változtatja meg a weboldalt.

A feladatgenerátorok programja és az interaktív műhelyek megvalósítása a kiadásban működik, de nem része ezeknek a tartalmi JSON-másolatoknak. Az új alapozó kéziratok a [docs/tananyag](../docs/tananyag/) könyvtárban találhatók.
