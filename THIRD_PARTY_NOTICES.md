# Külső összetevők

## Preact

A 0.2.0 index.html a Preact 11.2.0 futtatókódját tartalmazza. Hivatalos projekt: https://github.com/preactjs/preact

The MIT License (MIT)

Copyright (c) 2015-present Jason Miller

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Ellenőrzési eszközök

A Playwright és az axe-core fejlesztői ellenőrzéshez települnek a CI-futtatóra. Nem kerülnek a tanulóknak átadott HTML-be. Saját csomagjaik tartalmazzák a rájuk vonatkozó licencet.

## Rögzített fejlesztői összetevők a 0.2.0 kiadásban

A következő verziókat az `app/package-lock.json` rögzíti. A licencmegjelölések a ténylegesen telepített csomagok metaadataiból származnak. A fordító, formázó és tesztelő eszközök futtatókódja nem része az offline tanulóoldalnak.

| Csomag | Verzió | Licenc | Szerep |
|---|---|---|---|
| Preact | 11.2.0 | MIT | Az alkalmazásba csomagolt felületi futtatókód |
| Vite | 8.3.6 | MIT | Fejlesztői kiszolgáló és build |
| TypeScript | 7.0.2 | Apache-2.0 | Típusellenőrzés |
| esbuild | 0.28.2 | MIT | Önálló HTML programcsomagjának előállítása |
| Playwright | 1.62.1 | Apache-2.0 | Izolált böngészős ellenőrzés |
| @axe-core/playwright | 4.14.0 | MPL-2.0 | Automatikus hozzáférhetőségi vizsgálat |
| Prettier | 3.9.10 | MIT | Forrásformázás |

A tranzitív függőségek pontos listáját és integritásértékeit a lockfájl őrzi; saját licencük a csomagjukban található. A tanulóoldal ábrái saját SVG-rajzok, nem külső képszolgáltatásból töltődnek.

A portable build a telepített Preact teljes licencszövegét beágyazza a HTML-be, és ellenőrzi, hogy ez a jegyzék is hiánytalanul tartalmazza. A jegyzéket nem generálja felül, így az újabb összetevőinformációk megmaradnak.
