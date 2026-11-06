# GitHub Pages élesítés

## Mi van előkészítve?

A `.github/workflows/check-and-publish.yml` a `main` ágra érkező változtatásokat és a pull requesteket ellenőrzi. Az élesítés kizárólag a `main` ágról történhet, az ellenőrzések után. A megnyitott PR nem telepít. A workflow ághoz kötött concurrency beállítása megszakítja a korábbi azonos ági futást, ha újabb változat érkezik; így egy lassú régi build nem kerülhet az újabb után élesítésre.

Az ellenőrzési job friss `npm ci` telepítést végez az `app/` lockfájljából, lefuttatja a matematikai, tartalmi és migrációs teszteket, típusellenőriz és valódi forrásbuildet készít. A generált önálló HTML-nek bájtra egyeznie kell a gyökérbeli, commitolt `index.html`-lel; a SHA-256, a verzió és a tartalmi snapshot egyezése is kötelező. Ezután négy valódi Chromium-tesztsor vizsgálja a korábbi és új utakat, a két régi mentésséma migrációját, a készségnaplót, a javító folyamatot és a publikálandó HTML-t. A Pages beállításait csak olvassa. Az első engedélyezést nem próbálja elvégezni.

## Egyszeri beállítás a repó tulajdonosának

1. Nyisd meg: **[Settings → Pages](https://github.com/janszkyjozsef/8.os-matematika/settings/pages)**.
2. A **Build and deployment → Source** mezőben válaszd a **GitHub Actions** lehetőséget.
3. Nyisd meg a [Matek8 ellenőrzés és közzététel](https://github.com/janszkyjozsef/8.os-matematika/actions/workflows/check-and-publish.yml) workflow-t, és indítsd a **Run workflow** művelettel a `main` ágon. Egy következő rendes commit is elindítja.

A GitHub hivatalos útmutatója ezt a forrásbeállítást írja elő saját Actions-workflow használatához. [Forrás](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

Ha a Pages még nincs engedélyezve, a sikeres ellenőrzés után a telepítés kimarad, és a futás összefoglalója jelzi az elvégzendő beállítást. Ez nem sikeres publikáció. Ha hozzáférési vagy szolgáltatási hiba történik az állapot lekérésekor, a workflow hibával megáll; nem rejti el konfigurációhiányként.

## Mi bizonyítja a kész élesítést?

Mindhárom feltétel szükséges:

- az adott commit ellenőrzési jobja sikeres;
- a telepítési job is sikeres, nem `skipped`;
- a visszakapott webcímen az alkalmazás ténylegesen betöltődik, és legalább egy gyakorlófeladat megoldható.

Várható projektcím: **https://janszkyjozsef.github.io/8.os-matematika/**. Amíg nincs sikeres telepítés és tényleges betöltési ellenőrzés, ez csak a tervezett cím.

## Költség és jogosultság

A repó publikus. A GitHub Pages publikus repóval GitHub Free mellett is elérhető; a standard GitHub-hosted futtatók publikus repóban ingyenesek. A workflow `ubuntu-latest` standard futtatót használ, nem választ fizetős nagy futtatót, és nem állít be függőségcache-t. A telepítési artifact megőrzése egy nap. [Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) · [Actions díjszabási feltételek](https://docs.github.com/en/billing/concepts/product-billing/github-actions)

Az ellenőrzési job csak `contents: read` és `pages: read` jogot kap. A külön telepítési job `pages: write` és `id-token: write` jogot kap. Nem kell jelszó, saját API-kulcs vagy személyes hozzáférési token a rendes telepítéshez.

Az `actions/configure-pages` szerint az első automatikus engedélyezéshez a szokásos `GITHUB_TOKEN`-től eltérő token kellene. A mostani munkafolyamat ezt nem kéri; az első beállítás a GitHub felületén végezhető el. [Az action hivatalos konfigurációja](https://github.com/actions/configure-pages/blob/main/action.yml)

## A kiadás cseréje

Az `index.html` és a `release-manifest.json` együtt változik. A fájl méretének és ellenőrzőösszegének egyezése csak azonosítja a kiadást. Az új változatnak a böngészős ellenőrzésen is át kell mennie.

A moduláris forrás importja a 0.2.0 kiadásban megtörtént. A következő kiadás parancsa a repó gyökeréből:

```sh
npm ci --prefix app --no-audit --no-fund
npm run release
npm test
npm run test:browser
npm run test:foundations
npm run test:bridges
```

A `release` frissíti a gyökérbeli HTML-t, a `release-manifest.json` fájlt és az új verziójú tartalmi másolatot. Ezeket a forrásváltozásokkal együtt kell commitolni. Az `app/index.html` csak Vite-belépő, nem önálló kiadás; sem a gyökérbe, sem a Pages-csomagba nem másolható.

A CI teljes Git-előzményt kér le, mert a migrációs böngészőtesztek az eredeti, hash-ellenőrzött v0.1.1 és v0.2.0 HTML felületén állítanak elő valódi régi exportot. A publikációs artifact kizárólag a vizsgált gyökérbeli `index.html` és a `.nojekyll` fájl; fejlesztői forrás, tesztexport vagy csomagfüggőség nem kerül bele.

A helyi böngészőtesztek localhost-korlátozása megmaradt. Az élő Pages-oldalt külön kell ellenőrizni: az új verzió betöltése, a közzétett HTML hashének összevetése és legalább egy feladat tényleges megoldása szükséges.

## Hiba esetén

A workflow lépésének naplóját kell nézni. Az ellenőrzőösszeg eltérése sérült vagy másik kiadást jelez. A böngészős teszt hibáját a konkrét hibás elvárás alapján kell javítani; a tesztet nem szabad csak azért kikapcsolni, hogy sikeres legyen a telepítés. A Pages lépés konfigurációs hibáját az alkalmazás kódjától külön kell kezelni.
