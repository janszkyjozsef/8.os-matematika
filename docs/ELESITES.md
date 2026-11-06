# GitHub Pages élesítés

## Mi van előkészítve?

A `.github/workflows/check-and-publish.yml` a `main` ágra érkező változtatásokat és a pull requesteket ellenőrzi. Az élesítés kizárólag a `main` ágról történhet, az ellenőrzések után. A megnyitott PR nem telepít.

Az ellenőrzési job összeveti az alkalmazás SHA-256 értékét a kiadási jegyzékkel, ellenőrzi a beágyazott JavaScriptet, majd valódi Chromium böngészőben vizsgálja a működést. A Pages beállításait csak olvassa. Az első engedélyezést nem próbálja elvégezni.

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

A moduláris forrás importja után a workflow kibővítendő a valódi `npm ci`, típusellenőrzés, eredeti matematikai tesztek és produkciós build lépéseivel. Az ellenőrzött, elkészült build kerülhet a Pages artifactba.

## Hiba esetén

A workflow lépésének naplóját kell nézni. Az ellenőrzőösszeg eltérése sérült vagy másik kiadást jelez. A böngészős teszt hibáját a konkrét hibás elvárás alapján kell javítani; a tesztet nem szabad csak azért kikapcsolni, hogy sikeres legyen a telepítés. A Pages lépés konfigurációs hibáját az alkalmazás kódjától külön kell kezelni.
