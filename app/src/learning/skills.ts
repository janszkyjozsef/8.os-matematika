import type { AnswerSpec, Exercise, GradeResult, TopicId } from "../types.ts";
import type { Attempt, Profile } from "../progress.ts";
import { TOPICS } from "../topics.ts";
import { decodePartResponses } from "../math/engine.ts";

/** Small, authored learning goals. These labels are not a psychometric scale. */
const skillData = [
  ["szamok-helye", "szamfogalom", "Számok helye és sorrendje", "A számot az értéke alapján rendezd; negatív számoknál a nullától mért távolság önmagában nem mondja meg a sorrendet.", ["Melyik szám van jobbra a számegyenesen?", "A tört és tizedes alak ugyanazt az értéket jelöli?"]],
  ["ellentett", "szamfogalom", "Az ellentett felismerése", "Az ellentett az a szám, amelyet az eredetihez adva nullát kapsz. Ez különbözik az abszolút értéktől.", ["Az eredeti szám és válaszod összege nulla?", "A nulla ellentettjét is ellenőrizted?"]],
  ["abszolut-tavolsag", "szamfogalom", "Abszolút érték és távolság", "A távolság nemnegatív. Két szám távolságához a különbség abszolút értékét keresd.", ["Mely két pont távolságáról van szó?", "Lehet-e a kapott távolság negatív?"]],
  ["elojeles-muveletek", "szamfogalom", "Műveletek előjeles számokkal", "Kivonáskor a kivonandó ellentettjét add hozzá; a művelet jelét és a szám előjelét külön olvasd.", ["Melyik számot vonjuk ki?", "Visszahelyettesítéssel vagy ellentétes művelettel ellenőrizted?"]],
  ["muveleti-rang", "muveleti-sorrend", "Műveleti rang és jogos kezdőlépés", "Azonos szinten a szorzás és osztás, illetve az összeadás és kivonás balról jobbra kapcsolódik. A független ágak több sorrendben is számolhatók.", ["Mi számolható ki a többi rész eredménye nélkül?", "Az egész kifejezést írtad tovább?"]],
  ["zarojeles-szerkezet", "muveleti-sorrend", "A zárójel szerkezete", "A zárójel egyben tart egy részszámítást. Külön vizsgáld, mire vonatkozik egy szorzó vagy osztó.", ["A zárójel teljes tartalma egy tagként szerepel?", "Az osztó biztosan nem nulla?"]],
  ["negyzet-es-elojel", "muveleti-sorrend", "Négyzet és előtte álló mínusz", "A −a² és a (−a)² különböző szerkezet. Előbb nevezd meg a hatvány alapját.", ["Mi tartozik a hatvány alapjába?", "A négyzet kiszámítása után marad külső mínusz?"]],
  ["egyenes-aranyossag", "aranyossag", "Állandó arány és egységre jutó érték", "Egyenes arányosságnál az összetartozó nem nulla értékek hányadosa állandó, és nulla bemenethez nulla kimenet tartozik.", ["Ugyanaz marad az egységár vagy más egységre jutó mennyiség?", "Legalább több adatpárt és a történet feltételeit is vizsgáltad?"]],
  ["forditott-aranyossag", "aranyossag", "Állandó szorzat", "Rögzített teljes munkánál vagy útnál a megfelelő két mennyiség szorzata marad állandó, ha a modell feltételei teljesülnek.", ["Mi a rögzített teljes mennyiség?", "A létszám és a munka oszthatóságának feltételei teljesülnek?"]],
  ["aranyossag-feltetelei", "aranyossag", "Az arányosság feltételei és ellenpéldái", "A kétszeres bemenet nem mindig jelent kétszeres kimenetet. Alapdíj, előkészítési idő vagy két irányú nagyítás megváltoztatja az összefüggést.", ["Van állandó alapdíj vagy nem rövidíthető rész?", "Hányadossal vagy szorzattal is ellenőrizted a feltételezést?"]],
  ["mertek-egysegek", "mertekegysegek", "Mennyiség és megfelelő egység", "Előbb nevezd meg, mit mérsz, majd válassz közös egységet. Az egységváltás nem változtatja meg a mennyiséget; különböző mennyiségek között további adat kell.", ["Azonos mennyiséget fejezel ki más egységben?", "A mérőszám változásának iránya illik az egység méretéhez?"]],
  ["mertek-terulet-terfogat", "mertekegysegek", "Terület, térfogat és több irányú váltás", "Területnél két, térfogatnál három irányban érvényesül a hosszúság váltószáma. A liter térfogategység.", ["Két vagy három kiterjedési irányt számolsz?", "Az eredmény mértékegysége és nagysága is illik a helyzethez?"]],
  ["mertek-ido-sebesseg", "mertekegysegek", "Idő és összetett egységek", "Az órát 60 percre bontjuk, nem százra. Sebességváltásnál a számláló és a nevező egységét is váltsd át.", ["Tizedes órát vagy óra–perc alakot olvasol?", "Mindkét egységet átváltottad a hányadosban?"]],
  ["tort-egysege", "tortek", "A tört egésze és közös egysége", "A törtek összehasonlításához és összeadásához ugyanazt az egészet, majd azonos részegységet kell megnevezni.", ["Ugyanarra az egészre vonatkoznak a törtek?", "Bővítéskor a számlálót és nevezőt ugyanazzal szoroztad?"]],
  ["tort-osszeadas", "tortek", "Törtek összeadása és kivonása", "Közös nevező után az azonos méretű részek számát add össze vagy vond ki; a végén egyszerűsíts.", ["A részek mérete azonos lett?", "Becsléssel is hihető az összeg vagy különbség?"]],
  ["tort-szorzas-osztas", "tortek", "Törtrész és mérésosztás", "A rész egy részét szorzással, a két hossz arányát osztással keresd. Az arány és a levágható egész darabok száma külön kérdés.", ["Mit jelent a művelet a történetben?", "Arányt vagy egész darabszámot kérdez a feladat?"]],
  ["szazalek-resz", "szazalek", "Rész és százalék összekapcsolása", "Az alap az adott helyzet 100%-a. A rész és az alap hányadosából százalékot, a százalékból részt számolhatsz.", ["Megnevezted a 100%-ot?", "Az arányt százalékká alakítottad?"]],
  ["szazalek-alap", "szazalek", "Az eredeti alap visszakeresése", "Ha egy megváltozott vagy részérték adott, azt az eredeti alaphoz tartozó szorzótényezővel oszd.", ["Az ismert érték az alap hány százaléka?", "Visszaszorzással kijön az adott rész?"]],
  ["szazalek-valtozas", "szazalek", "Változó százalékalap", "Egymást követő változásoknál a második százalék már a megváltozott értékre vonatkozik.", ["Melyik az egyes lépések 100%-a?", "Azonos százalékos csökkentés és emelés valóban visszaadná az alapot?"]],
  ["egyenlet-megoldas", "egyenlet", "Egyenlet megoldása és ellenőrzése", "Visszafordítható lépésekkel keresd az ismeretlent; a végén az eredeti egyenletbe helyettesíts.", ["A zárójel minden tagjára érvényes a szorzó?", "Az eredeti két oldal értéke megegyezik a kapott számmal?"]],
  ["egyenlet-egyensuly", "egyenlet", "Jogos egyenletátalakítás", "Mindkét oldalon ugyanazt a megengedett műveletet végezd. Egy lépés akkor használható megoldáskeresésre, ha nem veszíted el a szükséges információt.", ["Mindkét oldalon megtörtént ugyanaz a művelet?", "Elveszítenél információt nullával szorozva vagy osztva?"]],
  ["grafikon-adatpar", "grafikon", "Történet, értékpár és koordináta", "Nevezd meg a két tengely mennyiségét és egységét, majd ugyanahhoz a helyzethez rendeld a koordinátákat.", ["Mit jelent az x és mit az y?", "Az alapdíj vagy kezdőérték is szerepel a szabályban?"]],
  ["grafikon-valtozas", "grafikon", "Kezdőérték és egyenletes változás", "Az egy lépéshez tartozó változást különítsd el a kezdőértéktől; két adatpár különbsége segít.", ["Mennyi változás jut egy egységnyi x-re?", "Mit ad a szabály x = 0 esetén?"]],
  ["grafikon-aranyossag", "grafikon", "Egyenes grafikon és arányosság", "Egy egyenes önmagában nem bizonyít egyenes arányosságot. Az origón való áthaladást és az állandó hányadost is vizsgáld.", ["A grafikon átmegy az origón?", "A teljes mennyiséget vagy csak a változó részt hasonlítod?"]],
  ["pitagorasz-feltetel", "pitagorasz", "Derékszög és átfogó felismerése", "A Pitagorasz-tétel alkalmazásához derékszögű háromszög kell. Az átfogó a derékszöggel szemközti oldal.", ["Biztosan ismert a derékszög?", "Az átfogót a derékszög alapján jelölted ki?"]],
  ["pitagorasz-atfogo", "pitagorasz", "Átfogó és négyzetterületek", "A befogókra épített négyzetek területét összeadva az átfogó négyzetét kapod; hosszkérésnél ezután gyököt kell vonni.", ["Hosszt vagy négyzetterületet kérdez a feladat?", "Az átfogó hosszabb mindkét befogónál?"]],
  ["pitagorasz-befogo", "pitagorasz", "Hiányzó befogó", "Az ismert átfogó négyzetéből a másik befogó négyzetét kivonva kapod a hiányzó befogó négyzetét.", ["Az átfogó négyzetéből vonsz ki?", "A három oldal visszahelyettesítve teljesíti a tételt?"]],
  ["esely-elemi-esemenyek", "valoszinuseg", "Elemi kimenetelek és esély", "Egyenlő esélyű elemi kimeneteleket számolj. A kedvező kimenetelek számát az összeshez viszonyítsd.", ["Az elemi kimenetelek valóban egyenlő esélyűek?", "Pontosan mely kimenetelek kedvezők?"]],
  ["esely-es-kiserlet", "valoszinuseg", "Elméleti esély és megfigyelt gyakoriság", "A feljegyzett gyakoriságot a tényleges kísérletszámból számoljuk; az elméleti esély nem ígér rögzített darabszámot egy rövid sorozatban.", ["Megfigyelést vagy modellbeli esélyt kérdezünk?", "A korábbi dobások megváltoztatják a független következő dobást?"]],
  ["betu-helyettesites", "betus-kifejezesek", "Helyettesítés betűs kifejezésbe", "A betű minden előfordulásába ugyanazt az adott értéket helyettesítsd; negatív értéket zárójellel írj.", ["Minden azonos betű ugyanazt az értéket kapta?", "A műveleti sorrendet az értékek beírása után is megtartottad?"]],
  ["egynemu-tagok", "betus-kifejezesek", "Egynemű tagok összevonása", "Csak azonos betűs részt tartalmazó tagok együtthatói vonhatók össze közvetlenül.", ["Pontosan azonos a betűs rész?", "Az összevonás után ugyanazt az értéket adja egy próbahelyettesítés?"]],
  ["zarojel-felbontas", "betus-kifejezesek", "Zárójel felbontása", "A zárójel előtti szorzó minden belső tagra vonatkozik; negatív szorzónál az előjelekre is figyelj.", ["Minden tag kapott szorzót?", "Visszacsoportosítással vagy helyettesítéssel ellenőrizted?"]],
  ["adatok-es-feltetelek", "szoveges-modellek", "Adatok és feltételek kiválasztása", "Előbb nevezd meg a kérdést, a szükséges adatokat és azt, amit a történet feltételez.", ["Melyik adat kapcsolódik közvetlenül a kérdéshez?", "Egész darabszámra vagy más értelmezési feltételre szükség van?"]],
  ["modellvalasztas", "szoveges-modellek", "Matematikai modell választása", "A történet kapcsolatait fejezd ki művelettel, kifejezéssel vagy egyenlettel; a választást indokold a helyzettel.", ["Mit jelent minden tag a történetben?", "Egyszeri és ismétlődő mennyiséget külön kezeltél?"]],
  ["modell-ellenorzes", "szoveges-modellek", "A modell és az eredmény ellenőrzése", "A kapott értéket tedd vissza az eredeti helyzetbe. Egy kiszámolt szám csak akkor válasz, ha a feltételeknek is megfelel.", ["A szám megfelel az eredeti kérdésnek és egységnek?", "Egész darabszám vagy becslés esetén az irány is megfelelő?"]],
  ["hatvany-jelentes", "hatvanyok", "A hatvány jelentése", "Pozitív egész kitevőnél a hatvány az azonos alap ismételt szorzata; az alap és a kitevő szerepe különbözik.", ["Hány tényezőt írtál fel?", "Szorzást és ismételt összeadást megkülönböztettél?"]],
  ["hatvany-elojel", "hatvanyok", "A hatvány előjele", "Negatív alapnál a kitevő párossága számít; a hatvány elé írt mínusz külön művelet.", ["A mínusz az alap része vagy kívül áll?", "Páros vagy páratlan számú negatív tényeződ van?"]],
  ["nagysagrend", "hatvanyok", "Tízhatvány és nagyságrend", "A tíz hatványai a mérőszám helyi értékét és nagyságrendjét fejezik ki. Az egységet mindig nevezd meg.", ["Melyik két tízhatvány között van az érték?", "A helyi értékek változása és az egység is következetes?"]],
  ["negyzetgyok-jelentes", "negyzetgyok", "A négyzetgyök jelentése", "A nemnegatív szám négyzetgyöke az a nemnegatív szám, amelynek a négyzete az eredeti érték.", ["Nemnegatív eredményt választottál?", "Négyzetre emelve visszakapod az eredeti értéket?"]],
  ["gyok-becsles", "negyzetgyok", "Négyzetgyök becslése", "Két ismert négyzetszám közé szorítva a számot a gyökét két ismert érték közé helyezheted.", ["Mely két négyzetszám közé esik a szám?", "A becsült értéket négyzetre emelve is megfelelő a sorrend?"]],
  ["pontos-kozelito", "negyzetgyok", "Pontos és közelítő érték", "A pontos gyökjel és a kerekített szám eltérő állítás. A közelítés jelét és a kért pontosságot tartsd meg.", ["Pontos értéket vagy közelítést kérnek?", "A kerekítés pontossága és a visszaellenőrzés összhangban van?"]],
] as const;

export type SkillId = (typeof skillData)[number][0];
export interface SkillDefinition {
  id: SkillId;
  topic: TopicId;
  title: string;
  explanation: string;
  checkpoints: readonly string[];
  lessonHref: string;
  labHref: string;
}
export const SKILLS: readonly SkillDefinition[] = Object.freeze(skillData.map(
  ([id, topic, title, explanation, checkpoints]) => ({
    id, topic, title, explanation, checkpoints,
    lessonHref: "#lecke/" + topic + "?lepes=2",
    labHref: "#lecke/" + topic + "?lepes=1",
  }),
));
const skillById = new Map(SKILLS.map((skill) => [skill.id, skill]));
export function getSkill(id: string): SkillDefinition | undefined {
  return skillById.get(id as SkillId);
}
export interface SkillTarget { skillId: SkillId; partId?: string }
interface SkillMapping {
  skillIds?: readonly SkillId[];
  parts?: Readonly<Record<string, readonly SkillId[]>>;
}
const all = (...skillIds: SkillId[]): SkillMapping => ({ skillIds });
const parts = (skillIds: readonly SkillId[], overrides: Record<string, readonly SkillId[]>): SkillMapping => ({ skillIds, parts: overrides });

/** External metadata: historical lesson objects and their released snapshots stay untouched. */
const authoredMap: Record<string, SkillMapping> = {};
function mapTopic(topic: TopicId, practice: SkillMapping[], exit: SkillMapping[]) {
  practice.forEach((mapping, i) => { authoredMap[topic + "-practice-" + (i + 1)] = mapping; });
  exit.forEach((mapping, i) => { authoredMap[topic + "-exit-" + (i + 1)] = mapping; });
}
mapTopic("szamfogalom", [
  all("szamok-helye"), all("szamok-helye"),
  parts(["abszolut-tavolsag"], { oppositeMinus7: ["ellentett"], oppositePositive: ["ellentett"], oppositeZero: ["ellentett"], outsideMinus: ["abszolut-tavolsag", "ellentett"] }),
  parts(["abszolut-tavolsag"], { midpoint: ["szamok-helye"] }),
  all("elojeles-muveletek"), all("elojeles-muveletek"), all("elojeles-muveletek"), all("elojeles-muveletek"), all("elojeles-muveletek"), all("elojeles-muveletek"),
  parts(["abszolut-tavolsag"], { order: ["szamok-helye"] }),
  all("elojeles-muveletek"),
], [
  all("elojeles-muveletek"),
  parts(["abszolut-tavolsag"], { largest: ["szamok-helye"] }),
]);
mapTopic("muveleti-sorrend", [
  all("muveleti-rang"), all("muveleti-rang"),
  parts(["zarojeles-szerkezet"], { a: ["muveleti-rang"] }),
  all("muveleti-rang"), all("zarojeles-szerkezet"),
  parts(["negyzet-es-elojel"], { sum: ["muveleti-rang"] }),
  parts(["zarojeles-szerkezet"], { a: ["muveleti-rang"] }),
  all("muveleti-rang"), all("muveleti-rang"), all("zarojeles-szerkezet"),
  parts(["zarojeles-szerkezet"], { defined: ["muveleti-rang"] }),
  parts(["zarojeles-szerkezet"], { cost: ["muveleti-rang"] }),
], [
  parts(["muveleti-rang"], { bracket: ["zarojeles-szerkezet"] }),
  parts(["negyzet-es-elojel"], { value: ["muveleti-rang"] }),
]);
mapTopic("aranyossag", [
  all("egyenes-aranyossag"), all("egyenes-aranyossag"), all("egyenes-aranyossag"), all("aranyossag-feltetelei"), all("forditott-aranyossag"), all("forditott-aranyossag"), all("forditott-aranyossag"), all("aranyossag-feltetelei"), all("egyenes-aranyossag"), all("egyenes-aranyossag"), all("aranyossag-feltetelei"),
  parts(["aranyossag-feltetelei"], { modelOne3: ["forditott-aranyossag"], modelOne6: ["forditott-aranyossag"] }),
], [
  all("egyenes-aranyossag"),
  parts(["forditott-aranyossag"], { wholeMinutes: ["mertek-ido-sebesseg"], seconds: ["mertek-ido-sebesseg"] }),
]);
mapTopic("mertekegysegek", [
  all("mertek-egysegek"), all("mertek-egysegek"), all("mertek-egysegek"), all("mertek-terulet-terfogat"),
  parts(["mertek-terulet-terfogat"], { perimeter: ["mertek-egysegek"] }),
  all("mertek-terulet-terfogat"), all("mertek-terulet-terfogat"), all("mertek-egysegek"), all("mertek-ido-sebesseg"), all("mertek-ido-sebesseg"),
  parts(["mertek-terulet-terfogat"], { edgeFactor: ["mertek-egysegek"] }),
  all("mertek-egysegek"),
], [
  parts(["mertek-terulet-terfogat"], { perimeter: ["mertek-egysegek"] }),
  all("mertek-terulet-terfogat"),
]);
mapTopic("tortek", [
  all("tort-osszeadas"), all("tort-osszeadas"), all("tort-egysege"), all("tort-szorzas-osztas"), all("tort-szorzas-osztas"), all("tort-egysege"), all("tort-osszeadas"), all("tort-szorzas-osztas"),
], [all("tort-osszeadas"), all("tort-osszeadas", "tort-egysege")]);
mapTopic("szazalek", [
  all("szazalek-resz"), all("szazalek-resz"), all("szazalek-alap"), all("szazalek-valtozas"), all("szazalek-resz"), all("szazalek-valtozas"), all("szazalek-valtozas"), all("szazalek-resz"),
], [all("szazalek-alap"), all("szazalek-resz")]);
mapTopic("egyenlet", [
  all("egyenlet-megoldas"), all("egyenlet-megoldas"), all("egyenlet-egyensuly"), all("egyenlet-megoldas"), all("egyenlet-megoldas"), all("egyenlet-megoldas"), all("egyenlet-megoldas"), all("egyenlet-megoldas"),
], [all("egyenlet-megoldas"), all("egyenlet-egyensuly")]);
mapTopic("grafikon", [
  all("grafikon-adatpar"), all("grafikon-adatpar"), all("grafikon-valtozas"), all("grafikon-adatpar"), all("grafikon-aranyossag"), all("grafikon-adatpar"), all("grafikon-valtozas"), all("grafikon-aranyossag"),
], [all("grafikon-adatpar"), all("grafikon-aranyossag")]);
mapTopic("pitagorasz", [
  all("pitagorasz-atfogo"), all("pitagorasz-befogo"), all("pitagorasz-feltetel"), all("pitagorasz-atfogo"), all("pitagorasz-befogo"), all("pitagorasz-feltetel"), all("pitagorasz-befogo"), all("pitagorasz-atfogo"),
], [all("pitagorasz-befogo"), all("pitagorasz-feltetel")]);
mapTopic("valoszinuseg", [
  all("esely-elemi-esemenyek"), all("esely-elemi-esemenyek"), all("esely-elemi-esemenyek"), all("esely-elemi-esemenyek"), all("esely-elemi-esemenyek"), all("esely-es-kiserlet"), all("esely-es-kiserlet"), all("esely-elemi-esemenyek"),
], [all("esely-elemi-esemenyek"), all("esely-es-kiserlet")]);

/** Public legacy family order also resolves old exit IDs whose original ID was replaced. */
export const FAMILY_ORDER: Readonly<Record<TopicId, readonly string[]>> = {
  szamfogalom: ["signed-position-v1", "signed-subtraction-v1", "signed-missing-v1"],
  "muveleti-sorrend": ["order-chain-v1", "order-independent-v1", "order-signed-square-v1"],
  aranyossag: ["ratio-unit-price-v1", "ratio-shared-work-v1", "ratio-fixed-fee-v1"],
  mertekegysegek: ["units-dimensions-v1", "units-clock-v1", "units-container-v1"],
  "betus-kifejezesek": ["algebra-substitute-v1", "algebra-collect-v1", "algebra-packets-v1"],
  "szoveges-modellek": ["model-fixed-fee-v1", "model-sum-difference-v1", "model-whole-packs-v1"],
  hatvanyok: ["power-expand-v1", "power-sign-v1", "power-ten-scale-v1"],
  negyzetgyok: ["root-square-absolute-v1", "root-bracket-v1", "root-area-precision-v1"],
  tortek: ["frac-common-unit-v1", "frac-sum-v1", "frac-measure-division-v1"],
  szazalek: ["percent-part-v1", "percent-base-v1", "percent-change-v1"],
  egyenlet: ["eq-linear-v1", "eq-group-v1", "eq-negative-v1"],
  grafikon: ["graph-value-v1", "graph-start-v1", "graph-fee-inverse-v1"],
  pitagorasz: ["pyth-hypotenuse-v1", "pyth-leg-v1", "pyth-context-v1"],
  valoszinuseg: ["prob-dice-sum-v1", "prob-favorable-v1", "prob-urn-v1"],
};
const familyMap: Record<string, SkillMapping> = {
  "frac-common-unit-v1": all("tort-egysege"), "frac-sum-v1": all("tort-osszeadas"), "frac-measure-division-v1": all("tort-szorzas-osztas"),
  "percent-part-v1": all("szazalek-resz"), "percent-base-v1": all("szazalek-alap"), "percent-change-v1": all("szazalek-valtozas"),
  "eq-linear-v1": all("egyenlet-megoldas", "egyenlet-egyensuly"), "eq-group-v1": all("egyenlet-megoldas"), "eq-negative-v1": all("egyenlet-megoldas", "egyenlet-egyensuly"),
  "graph-value-v1": all("grafikon-adatpar"), "graph-start-v1": all("grafikon-valtozas"), "graph-fee-inverse-v1": all("grafikon-adatpar"),
  "pyth-hypotenuse-v1": all("pitagorasz-atfogo"), "pyth-leg-v1": all("pitagorasz-befogo"), "pyth-context-v1": all("pitagorasz-atfogo", "pitagorasz-feltetel"),
  "prob-dice-sum-v1": all("esely-elemi-esemenyek"), "prob-favorable-v1": all("esely-elemi-esemenyek"), "prob-urn-v1": all("esely-elemi-esemenyek"),
  "signed-position-v1": parts(["abszolut-tavolsag"], { opposite: ["ellentett"], relation: ["szamok-helye"] }),
  "signed-subtraction-v1": parts(["elojeles-muveletek"], { opposite: ["ellentett"] }),
  "signed-missing-v1": all("elojeles-muveletek"),
  "order-chain-v1": all("muveleti-rang"),
  "order-independent-v1": parts(["muveleti-rang"], { bracket: ["zarojeles-szerkezet"] }),
  "order-signed-square-v1": parts(["negyzet-es-elojel"], { sum: ["muveleti-rang"] }),
  "ratio-unit-price-v1": all("egyenes-aranyossag"),
  "ratio-shared-work-v1": all("forditott-aranyossag"),
  "ratio-fixed-fee-v1": parts(["aranyossag-feltetelei"], { direct: ["aranyossag-feltetelei", "grafikon-aranyossag"] }),
  "units-clock-v1": all("mertek-ido-sebesseg"),
  "units-container-v1": all("mertek-terulet-terfogat"),
};

export function canonicalExerciseId(id: string): string {
  const targeted = /^targeted:(?:repair|transfer):(.+?)(?::part=[A-Za-z][A-Za-z0-9_-]{0,39})?$/.exec(id);
  if (targeted) return canonicalExerciseId(targeted[1]);
  const exit = /^exit:([a-z0-9-]+):(\d+):(\d+)$/.exec(id);
  if (!exit || !TOPICS.includes(exit[1] as TopicId)) return id;
  const round = Number(exit[2]), index = Number(exit[3]), topic = exit[1] as TopicId;
  if (!Number.isSafeInteger(round) || !Number.isSafeInteger(index) || index > 15) return id;
  if (round === 0) return topic + "-exit-" + (index + 1);
  const family = FAMILY_ORDER[topic][index % FAMILY_ORDER[topic].length];
  return "generated:" + family + ":seed=" + (10_000 + round * 13 + index) + ":variant=" + index;
}
export function sourceExerciseId(exercise: Exercise): string {
  return canonicalExerciseId(exercise.learningSource?.exerciseId ?? exercise.id);
}
function isPrediction(id: string): boolean {
  return /(?:^|[-:])(?:prediction|predict)$/.test(id);
}
function checkSkillIds(ids: readonly string[] | undefined): SkillId[] {
  if (!ids) return [];
  if (ids.length > 4 || ids.some((id) => !getSkill(id))) throw new Error("Ismeretlen vagy túl sok készségcímke.");
  return [...new Set(ids)] as SkillId[];
}
function mappingFor(exercise: Exercise): SkillMapping | undefined {
  const id = sourceExerciseId(exercise);
  if (authoredMap[id]) return authoredMap[id];
  const family = /^generated:([^:]+):/.exec(id)?.[1];
  if (family === "units-dimensions-v1") {
    const answer = exercise.answer.kind === "parts" ? exercise.answer.parts[0]?.answer : exercise.answer;
    const unit = answer?.kind === "number" ? answer.unit ?? "" : "";
    return all(/[²³]/.test(unit) ? "mertek-terulet-terfogat" : "mertek-egysegek");
  }
  return family ? familyMap[family] : undefined;
}
/** Exact part metadata overrides a whole-exercise fallback. Predictions never produce evidence. */
export function getSkillTargets(exercise: Exercise): SkillTarget[] {
  if (isPrediction(exercise.id) || isPrediction(sourceExerciseId(exercise))) return [];
  const mapping = mappingFor(exercise);
  if (exercise.answer.kind !== "parts") {
    const partId = exercise.learningSource?.partId;
    const ids = checkSkillIds(exercise.skillIds ?? (partId ? mapping?.parts?.[partId] : undefined) ?? mapping?.skillIds);
    return ids.map((skillId) => ({ skillId, ...(partId ? { partId } : {}) }));
  }
  return exercise.answer.parts.flatMap((part) => {
    const ids = checkSkillIds(part.skillIds ?? mapping?.parts?.[part.id] ?? mapping?.skillIds);
    return ids.map((skillId) => ({ skillId, partId: part.id }));
  });
}

/** Required earlier answers, including indirect dependencies, in authored order. */
export function getRequiredPartIds(exercise: Exercise, partId: string): string[] {
  if (exercise.answer.kind !== "parts") return [];
  const parts = exercise.answer.parts;
  const byId = new Map(parts.map((part) => [part.id, part]));
  if (byId.size !== parts.length || !byId.has(partId)) throw new Error("Hibás részfeladat-azonosító a függőségekben.");
  const complete = new Set<string>();
  const visiting = new Set<string>();
  const visit = (id: string) => {
    if (visiting.has(id)) throw new Error("Körkörös részfeladat-függőség.");
    if (complete.has(id)) return;
    const part = byId.get(id);
    if (!part) throw new Error("Ismeretlen részfeladat-előfeltétel: " + id);
    if (part.requiresParts !== undefined && (!Array.isArray(part.requiresParts) || part.requiresParts.length > parts.length || new Set(part.requiresParts).size !== part.requiresParts.length)) throw new Error("Hibás részfeladat-előfeltételek.");
    visiting.add(id);
    for (const required of part.requiresParts ?? []) visit(required);
    visiting.delete(id);
    complete.add(id);
  };
  visit(partId);
  return parts.filter((part) => part.id !== partId && complete.has(part.id)).map((part) => part.id);
}

export type LearningStatus = "correct" | "incorrect" | "form";
export interface LearningOutcome extends SkillTarget {
  status: LearningStatus;
  independent: boolean;
  assisted: boolean;
  /** Opaque, non-security fingerprint used only to suppress repeated unchanged checks. */
  responseKey: string;
}
export interface LearningEvent {
  id: number;
  at: string;
  exerciseId: string;
  sourceExerciseId: string;
  topic: TopicId;
  outcomes: LearningOutcome[];
}
export interface LearningLog {
  version: 1;
  nextId: number;
  droppedEvents: number;
  events: LearningEvent[];
}
export const MAX_LEARNING_EVENTS = 2000;
export const MAX_EVENT_OUTCOMES = 64;
export const LEARNING_RETENTION_NOTE = "A készségjelzések a legutóbbi legfeljebb 2000 eltérő ellenőrzésből származnak. A régebbi naplóbejegyzések kieshetnek; ez nem törli a korábbi feladatmegoldások mentését.";
export function emptyLearningLog(): LearningLog {
  return { version: 1, nextId: 1, droppedEvents: 0, events: [] };
}
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const safeId = (v: unknown): v is string => typeof v === "string" && /^[A-Za-z0-9][A-Za-z0-9_.:=\-]{0,159}$/.test(v) && !["constructor", "prototype"].includes(v);
const partIdValid = (v: unknown): v is string => typeof v === "string" && /^[A-Za-z][A-Za-z0-9_-]{0,39}$/.test(v) && !["constructor", "prototype", "__proto__"].includes(v);
const validDate = (v: unknown): v is string => typeof v === "string" && v.length <= 30 && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(v) && Number.isFinite(Date.parse(v)) && new Date(v).toISOString() === v;
function exactKeys(value: Record<string, unknown>, required: string[], optional: string[] = []): boolean {
  return required.every((key) => Object.hasOwn(value, key)) && Object.keys(value).every((key) => required.includes(key) || optional.includes(key));
}
/** Strict bounded event validation; old profiles receive an empty log elsewhere, never inferred events. */
export function validateLearningLog(value: unknown): LearningLog {
  const fail = (): never => { throw new Error("Hibás készségesemény-napló."); };
  if (!object(value) || !exactKeys(value, ["version", "nextId", "droppedEvents", "events"]) || value.version !== 1 || !Number.isSafeInteger(value.nextId) || Number(value.nextId) < 1 || !Number.isSafeInteger(value.droppedEvents) || Number(value.droppedEvents) < 0 || !Array.isArray(value.events) || value.events.length > MAX_LEARNING_EVENTS || value.nextId !== Number(value.droppedEvents) + value.events.length + 1) return fail();
  const earlierTargets = new Map<string, LearningOutcome>();
  const events: LearningEvent[] = value.events.map((entry: unknown, index: number) => {
    if (!object(entry) || !exactKeys(entry, ["id", "at", "exerciseId", "sourceExerciseId", "topic", "outcomes"]) || entry.id !== Number(value.droppedEvents) + index + 1 || !validDate(entry.at) || !safeId(entry.exerciseId) || !safeId(entry.sourceExerciseId) || isPrediction(entry.exerciseId) || isPrediction(entry.sourceExerciseId) || !TOPICS.includes(entry.topic as TopicId) || !Array.isArray(entry.outcomes) || entry.outcomes.length === 0 || entry.outcomes.length > MAX_EVENT_OUTCOMES) return fail();
    const seen = new Set<string>();
    const outcomes = entry.outcomes.map((raw: unknown): LearningOutcome => {
      if (!object(raw) || !exactKeys(raw, ["skillId", "status", "independent", "assisted", "responseKey"], ["partId"]) || typeof raw.skillId !== "string" || !getSkill(raw.skillId) || !["correct", "incorrect", "form"].includes(String(raw.status)) || typeof raw.independent !== "boolean" || typeof raw.assisted !== "boolean" || typeof raw.responseKey !== "string" || !/^[0-9a-f]{16}$/.test(raw.responseKey) || (raw.partId !== undefined && !partIdValid(raw.partId)) || (raw.independent && (raw.status !== "correct" || raw.assisted)) || (raw.status === "correct" && raw.independent === raw.assisted)) return fail();
      const key = raw.skillId + ":" + (raw.partId ?? "");
      if (seen.has(key)) return fail();
      seen.add(key);
      const earlierKey = entry.sourceExerciseId + "|" + key;
      const earlier = earlierTargets.get(earlierKey);
      if (earlier && (raw.independent || (earlier.status === "correct" && raw.status === "correct") || (earlier.status === raw.status && earlier.responseKey === raw.responseKey))) return fail();
      const outcome: LearningOutcome = {
        skillId: raw.skillId as SkillId, status: raw.status as LearningStatus,
        independent: raw.independent, assisted: raw.assisted, responseKey: raw.responseKey,
        ...(raw.partId !== undefined ? { partId: raw.partId as string } : {}),
      };
      earlierTargets.set(earlierKey, outcome);
      return outcome;
    });
    return { id: entry.id as number, at: entry.at, exerciseId: entry.exerciseId, sourceExerciseId: entry.sourceExerciseId, topic: entry.topic as TopicId, outcomes };
  });
  return { version: 1, nextId: value.nextId as number, droppedEvents: value.droppedEvents as number, events };
}
export function responseFingerprint(value: string): string {
  let hash = 14695981039346656037n;
  for (let i = 0; i < value.length; i++) hash = BigInt.asUintN(64, (hash ^ BigInt(value.charCodeAt(i))) * 1099511628211n);
  return hash.toString(16).padStart(16, "0");
}
function evidenceKey(source: string, target: SkillTarget): string {
  return source + "|" + (target.partId ?? "") + "|" + target.skillId;
}

/**
 * Called only from a real Check submission, with the BEFORE attempt.
 * It does not mutate attempts, store raw answers, grade reflections, or infer old events.
 */
export function recordLearningGrade(profile: Profile, exercise: Exercise, before: Attempt, result: GradeResult, at: string): Profile {
  const targets = getSkillTargets(exercise);
  if (!targets.length) return profile;
  if (!validDate(at)) throw new Error("Az ellenőrzési eseményhez pontos ISO-időpont kell.");
  const source = sourceExerciseId(exercise);
  const previous = new Map<string, LearningOutcome>();
  for (const event of profile.learning.events) for (const outcome of event.outcomes) previous.set(evidenceKey(event.sourceExerciseId, outcome), outcome);
  const responses = exercise.answer.kind === "parts" ? decodePartResponses(before.input) : null;
  const originalAttempt = profile.attempts[source];
  const outcomes: LearningOutcome[] = [];
  for (const target of targets) {
    const grade = exercise.answer.kind === "parts" ? result.parts?.find((part) => part.id === target.partId)?.result : result;
    if (!grade || grade.status === "invalid") continue;
    if (exercise.answer.kind === "parts" && getRequiredPartIds(exercise, target.partId!).some((required) => {
      const prerequisite = result.parts?.find((part) => part.id === required)?.result;
      return !prerequisite?.correct || prerequisite.status !== "correct";
    })) continue;
    if (grade.correct !== (grade.status === "correct")) throw new Error("Ellentmondó részválasz-ellenőrzés.");
    const raw = exercise.answer.kind === "parts" ? responses?.[target.partId!] ?? "" : before.input;
    const responseKey = responseFingerprint(grade.status + "|" + (grade.normalized ?? raw.trim()));
    const previousOutcome = previous.get(evidenceKey(source, target));
    // All accepted spellings of an already-correct answer are one observation.
    // A genuine intervening incorrect/form outcome is still followed by a new correction.
    if (grade.correct && previousOutcome?.status === "correct") continue;
    // An old successful task is already familiar. Rechecking it does not create
    // a fabricated new independent or helped success in the new learning log.
    if (grade.correct && !previousOutcome && (before.success || originalAttempt?.success)) continue;
    if (previousOutcome?.status === grade.status && previousOutcome.responseKey === responseKey) continue;
    const independent = grade.correct && before.tries === 0 && !before.assisted && !before.revealed && before.hintLevel === 0 && !previousOutcome && !(originalAttempt && originalAttempt.tries > 0);
    outcomes.push({ ...target, status: grade.status, independent, assisted: grade.correct ? !independent : before.assisted || before.revealed || before.hintLevel > 0, responseKey });
  }
  if (!outcomes.length) return profile;
  const event: LearningEvent = { id: profile.learning.nextId, at, exerciseId: exercise.id, sourceExerciseId: source, topic: exercise.topic, outcomes };
  const appended = [...profile.learning.events, event];
  const remove = Math.max(0, appended.length - MAX_LEARNING_EVENTS);
  return {
    ...profile,
    learning: {
      version: 1, nextId: profile.learning.nextId + 1,
      droppedEvents: profile.learning.droppedEvents + remove,
      events: appended.slice(remove),
    },
  };
}

export interface SkillSummary {
  skillId: SkillId;
  skill: SkillDefinition;
  status: "unseen" | "practice" | "observed";
  checkedCount: number;
  independentCount: number;
  assistedCount: number;
  incorrectCount: number;
  formCount: number;
  needsPractice: boolean;
  lastEvent?: LearningEvent;
  lastOutcome?: LearningOutcome;
  reason: string;
}
/** Counts distinct source-task/part evidence, never clicks or a claimed percentage of knowledge. */
export function skillSummary(profile: Profile): SkillSummary[] {
  return SKILLS.map((skill) => {
    const units = new Map<string, LearningOutcome>();
    const independent = new Set<string>(), assisted = new Set<string>();
    let lastEvent: LearningEvent | undefined;
    let lastOutcomes: LearningOutcome[] = [];
    for (const event of profile.learning.events) {
      const matches = event.outcomes.filter((outcome) => outcome.skillId === skill.id);
      if (matches.length) { lastEvent = event; lastOutcomes = matches; }
      for (const outcome of matches) {
        const key = evidenceKey(event.sourceExerciseId, outcome);
        units.set(key, outcome);
        if (outcome.independent) independent.add(key);
        else if (outcome.status === "correct") assisted.add(key);
      }
    }
    const lastOutcome = lastOutcomes.find((outcome) => outcome.status === "incorrect") ?? lastOutcomes.find((outcome) => outcome.status === "form") ?? lastOutcomes.find((outcome) => outcome.assisted) ?? lastOutcomes.at(-1);
    const needsPractice = !!lastOutcome && (lastOutcome.status !== "correct" || lastOutcome.assisted);
    const reason = !lastOutcome
      ? "Ehhez a készséghez még nincs külön rögzített részválasz."
      : lastOutcome.status === "incorrect"
        ? "A legutóbbi ellenőrzésnél ehhez a készséghez hibás részválasz tartozott; érdemes új példával visszatérni rá."
        : lastOutcome.status === "form"
          ? "A legutóbbi ellenőrzésnél az érték megfelelő volt, de a kért egyszerűsített alak még javítást kért."
          : lastOutcome.assisted
            ? "Legutóbb segítséggel vagy javítás után sikerült; egy új példán önállóan is kipróbálhatod."
            : "A legutóbbi ellenőrzésnél önálló részmegoldást rögzítettünk. Ez megfigyelt eredmény, nem teljes készségtudás igazolása.";
    return {
      skillId: skill.id, skill, status: !lastOutcome ? "unseen" : needsPractice ? "practice" : "observed",
      checkedCount: units.size, independentCount: independent.size,
      assistedCount: [...assisted].filter((key) => !independent.has(key)).length,
      incorrectCount: [...units.values()].filter((outcome) => outcome.status === "incorrect").length,
      formCount: [...units.values()].filter((outcome) => outcome.status === "form").length,
      needsPractice, lastEvent, lastOutcome, reason,
    };
  });
}
