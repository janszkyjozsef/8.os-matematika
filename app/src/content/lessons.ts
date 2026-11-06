import type { Lesson, TopicId } from '../types.ts';
import { foundationLessons } from './foundations.ts';
import { bridgeLessons } from './bridge-lessons.ts';
import { TOPICS } from '../topics.ts';

// Eredeti, fix tanulási tartalom. A számeredményeket külön számítás ellenőrzi.
export const legacyLessons: Lesson[] = [
  {
    "id": "tortek",
    "moduleId": "M02",
    "title": "Törtek: ugyanaz az egész, közös darabok",
    "shortTitle": "Törtek",
    "question": "Miért kell közös nevező az összeadáshoz?",
    "teaser": "Oszd fel újra a szalagot, és figyeld meg, mi marad ugyanannyi.",
    "description": "A törtsávon látható darabokat összekapcsoljuk a számokkal. Összeadunk, kivonunk, majd azt is megnézzük, mit jelent egy törtrész szorzása vagy osztása.",
    "goals": [
      "Megnevezed, mit tekintünk egy egésznek.",
      "Elmagyarázod, miért nem változik a tört értéke bővítéskor.",
      "Közös egységgel számolsz, és becsléssel ellenőrzöd az eredményt."
    ],
    "prerequisites": [
      "Az összeadás, kivonás, szorzás és osztás alapjai.",
      "Egy egész egyenlő részekre osztása."
    ],
    "estimateMinutes": 30,
    "color": "#bde765",
    "layer": "ALAP",
    "prediction": {
      "id": "tortek-prediction",
      "topic": "tortek",
      "kind": "reason",
      "difficulty": 1,
      "prompt": "Ugyanahhoz az egészhez tartozó 2/3-ot és 1/4-et adunk össze. Hová várod az eredményt pontos számolás előtt?",
      "answer": {
        "kind": "choice",
        "correct": "between",
        "options": [
          {
            "id": "smaller",
            "text": "Kisebb lesz 2/3-nál."
          },
          {
            "id": "between",
            "text": "Nagyobb lesz 2/3-nál, de kisebb 1-nél."
          },
          {
            "id": "larger",
            "text": "Nagyobb lesz 1-nél."
          }
        ]
      },
      "hints": [
        "Pozitív mennyiséget adunk a 2/3-hoz. Ettől melyik irányba változhat az értéke?",
        "Az egy egészhez 1/3 hiányzik. A hozzáadott 1/4 ennél kisebb vagy nagyobb?"
      ],
      "solution": [
        {
          "expression": "2/3 + 1/4 > 2/3",
          "why": "Pozitív negyedet adtunk hozzá, ezért az összeg nagyobb az első tagnál."
        },
        {
          "expression": "1/4 < 1/3",
          "why": "Ugyanazt az egészet négy részre osztva kisebb darabokat kapunk, mint három részre osztva."
        },
        {
          "expression": "2/3 < 2/3 + 1/4 < 1",
          "why": "A negyed nem tölti ki a hiányzó harmadot. A pontos eredmény 11/12."
        }
      ],
      "takeaway": "A becslés már a számolás előtt megmutathatja, mely eredmények lehetetlenek.",
      "mistakes": [
        {
          "input": "smaller",
          "feedback": "A hozzáadott 1/4 pozitív. Nézd meg a szalagon, nőhet-e vagy csökkenhet ettől a kijelölt rész."
        },
        {
          "input": "larger",
          "feedback": "Az egészhez még 1/3 kellene. Hasonlítsd össze ezt a hozzáadott 1/4-del."
        }
      ]
    },
    "explanation": [
      {
        "heading": "Először rögzítsd az egészet",
        "body": "Az 1/2 mindig valaminek a fele. Egy egyméteres szalag fele fél méter; egy kétméteres szalag fele egy méter. A törtsávok összehasonlításakor ugyanakkora teljes szalagot használunk. Ez a közös egység.",
        "formula": "Az egész = 1 rögzített egység"
      },
      {
        "heading": "Más felosztás, ugyanannyi anyag",
        "body": "Ha minden harmadot négy egyenlő részre bontasz, az egészben tizenkét rész lesz. A kijelölt kétharmad nyolc ilyen részt tartalmaz. Nem tettél hozzá semmit: csak más méretű darabokkal írtad le ugyanazt a mennyiséget.",
        "formula": "2/3 = 8/12"
      },
      {
        "heading": "Azonos méretű darabokat számolunk össze",
        "body": "Harmad és negyed különböző méretű darab. Ha mindkettőt tizenkettedekben írjuk, már ugyanazt az egységet számoljuk. A nyolc és a három összeadódik; a darabok mérete tizenketted marad.",
        "formula": "2/3 + 1/4 = 8/12 + 3/12 = 11/12"
      },
      {
        "heading": "A műveletnek jelentése van",
        "body": "Törttel szorzáskor egy mennyiség adott részét vesszük. Osztáskor például azt kérdezhetjük, hányszor fér bele egy mérőegység a mennyiségbe. Háromnegyed méterben hat egynyolcad méteres darab van. A szalag nem lett hosszabb: a válasz most a darabok száma.",
        "formula": "3/4 : 1/8 = 6",
        "bullets": [
          "A darabolós modellben most pozitív mennyiségekkel dolgozunk.",
          "A méretek hányadosa lehet tört; az egészben levágható darabok száma más kérdés."
        ]
      },
      {
        "heading": "Ellenőrizd az egységet és a nagyságot",
        "body": "Pozitív rész hozzáadásakor az összeg nő. Kivonáskor figyeld, mennyit veszel el. A végeredmény többféle törtalakban is ugyanaz lehet: 6/12 és 1/2 ugyanott van a számegyenesen. Egyszerűsítéskor a kijelölt mennyiség változatlan.",
        "formula": "6/12 = 1/2"
      }
    ],
    "examples": [
      {
        "title": "Kétféle darabból közös egység",
        "prompt": "Mennyi 2/3 + 1/4, ha ugyanaz az egész a két tört egysége?",
        "steps": [
          {
            "expression": "2/3 = 8/12; 1/4 = 3/12",
            "why": "A harmadokat négyfelé, a negyedeket háromfelé bontjuk. Mindkét mennyiséget tizenkettedekben írjuk."
          },
          {
            "expression": "8/12 + 3/12 = 11/12",
            "why": "Nyolc és három azonos méretű darab együtt tizenegy ilyen darab."
          }
        ],
        "check": "11/12 nagyobb 2/3-nál, és kisebb 1-nél, ahogy a becslésből vártuk.",
        "alternative": [
          {
            "expression": "2/3 = 1 − 1/3",
            "why": "Megnézhetjük, mi hiányzik az egészből."
          },
          {
            "expression": "1/3 − 1/4 = 4/12 − 3/12 = 1/12",
            "why": "A hozzáadott negyed után már csak egy tizenketted hiányzik."
          },
          {
            "expression": "1 − 1/12 = 11/12",
            "why": "Ugyanarra az eredményre jutottunk a hiányzó rész felől."
          }
        ]
      },
      {
        "title": "Hány kis darab fér bele?",
        "prompt": "Egy 3/4 méteres szalagból hány 1/8 méteres darab vágható le maradék nélkül?",
        "steps": [
          {
            "expression": "3/4 m = 6/8 m",
            "why": "A teljes hosszt nyolcadméteres egységekben írjuk."
          },
          {
            "expression": "(6/8 m) : (1/8 m) = 6",
            "why": "Hat egynyolcad méteres darab pontosan kitölti a szalagot."
          }
        ],
        "check": "6 · 1/8 m = 6/8 m = 3/4 m. A válasz 6 darab, nem 6 méter."
      }
    ],
    "practice": [
      {
        "id": "tortek-practice-1",
        "topic": "tortek",
        "kind": "compute",
        "difficulty": 1,
        "prompt": "Add össze: 1/2 + 1/3. Mindkét tört ugyanarra az egészre vonatkozik.",
        "answer": {
          "kind": "number",
          "expected": "5/6"
        },
        "hints": [
          "Keress olyan felosztást, amelyben fél és harmad is egész számú darab.",
          "Írd mindkét törtet hatodokban."
        ],
        "solution": [
          {
            "expression": "1/2 = 3/6; 1/3 = 2/6",
            "why": "A fél három hatod, a harmad két hatod."
          },
          {
            "expression": "3/6 + 2/6 = 5/6",
            "why": "Öt azonos méretű darabunk lett."
          }
        ],
        "takeaway": "Összeadáskor a közös nevező a darabok közös méretét jelöli.",
        "mistakes": [
          {
            "input": "2/5",
            "feedback": "A nevezők összeadása más méretű darabokat hozna létre. Előbb keress közös felosztást."
          },
          {
            "input": "2/6",
            "feedback": "Ha hatodokra váltasz, a számlálók is megváltoznak. Hány hatod egy fél?"
          }
        ]
      },
      {
        "id": "tortek-practice-2",
        "topic": "tortek",
        "kind": "compute",
        "difficulty": 2,
        "prompt": "Mennyi 3/4 − 1/6? A két tört egysége ugyanaz.",
        "answer": {
          "kind": "number",
          "expected": "7/12"
        },
        "hints": [
          "A kivonáshoz is azonos méretű részeket kell számolni.",
          "A 12 mind a 4-nek, mind a 6-nak többszöröse.",
          "Hány tizenketted a 3/4, és hány az 1/6?"
        ],
        "solution": [
          {
            "expression": "3/4 = 9/12; 1/6 = 2/12",
            "why": "Ugyanazokat a mennyiségeket közös egységben fejezzük ki."
          },
          {
            "expression": "9/12 − 2/12 = 7/12",
            "why": "Kilenc darabból kettőt elvéve hét marad."
          }
        ],
        "takeaway": "A közös egység a kivonás jelentését is megőrzi.",
        "mistakes": [
          {
            "input": "-1",
            "feedback": "Próbáld közös nevezővel: itt pozitív, 3/4-nél kisebb résznek kell maradnia."
          },
          {
            "input": "2/12",
            "feedback": "A 3/4 nem három tizenketted. A számlálót és a nevezőt ugyanannyiszorosára kell változtatni."
          }
        ]
      },
      {
        "id": "tortek-practice-3",
        "topic": "tortek",
        "kind": "reason",
        "difficulty": 1,
        "prompt": "Miért ugyanakkora a 2/3 és a 8/12, ha az egész változatlan?",
        "answer": {
          "kind": "choice",
          "correct": "sameamount",
          "options": [
            {
              "id": "more",
              "text": "Mert a 8 nagyobb a 2-nél."
            },
            {
              "id": "sameamount",
              "text": "Minden harmadot négyfelé osztunk, így a kijelölt mennyiség ugyanaz marad."
            },
            {
              "id": "denominator",
              "text": "Elég csak a nevezőt négyszerezni."
            }
          ]
        },
        "hints": [
          "Képzeld el a kétharmadáig beszínezett szalagot.",
          "Ha sűrűbb osztásvonalakat rajzolsz, változik a beszínezett szalag hossza?"
        ],
        "solution": [
          {
            "expression": "3 · 4 = 12",
            "why": "Az egészben négyszer annyi, négyszer kisebb részegység lesz."
          },
          {
            "expression": "2 · 4 = 8",
            "why": "A két kijelölt harmad nyolc új darabra bomlik."
          },
          {
            "expression": "2/3 = 8/12",
            "why": "A felosztás változott, a mennyiség nem."
          }
        ],
        "takeaway": "Bővítéskor a számlálót és a nevezőt ugyanazzal a nem nulla számmal szorozzuk.",
        "mistakes": [
          {
            "input": "more",
            "feedback": "A számláló önmagában nem mondja meg a mennyiséget: a darabok mérete is számít."
          },
          {
            "input": "denominator",
            "feedback": "Ha csak a nevezőt változtatnád, ugyanannyi, de kisebb darabot vennél. Az érték megváltozna."
          }
        ]
      },
      {
        "id": "tortek-practice-4",
        "topic": "tortek",
        "kind": "transfer",
        "difficulty": 2,
        "prompt": "Egy 5/6 méteres szalagból hány 1/12 méteres darab vágható le maradék nélkül?",
        "answer": {
          "kind": "number",
          "expected": "10",
          "unit": "darab"
        },
        "hints": [
          "Azt számoljuk, hány tizenketted méter van a teljes hosszban.",
          "Írd át az 5/6 métert tizenketted méterekre."
        ],
        "solution": [
          {
            "expression": "5/6 m = 10/12 m",
            "why": "A hossz ugyanaz, csak tizenkettedekben írjuk."
          },
          {
            "expression": "(10/12 m) : (1/12 m) = 10",
            "why": "Tíz kért méretű darab fér bele."
          },
          {
            "expression": "10 · 1/12 m = 5/6 m",
            "why": "A darabok összege visszaadja a kiinduló hosszt."
          }
        ],
        "takeaway": "Az osztás eredménye itt darabszám; mindig nevezd meg, mit számolsz.",
        "mistakes": [
          {
            "input": "5/72",
            "feedback": "Ez a két törtszám szorzata. Most azt kérdezzük, hány kis darab fér bele."
          },
          {
            "input": "5/2",
            "feedback": "Előbb nézd meg: hány tizenkettednek felel meg az öt hatod?"
          }
        ]
      },
      {
        "id": "tortek-practice-5",
        "topic": "tortek",
        "kind": "transfer",
        "difficulty": 2,
        "prompt": "Egy kancsóban 3/4 liter limonádé van. Ennek a 2/3 részét kitöltjük. Hány litert töltünk ki?",
        "answer": {
          "kind": "number",
          "expected": "1/2",
          "unit": "l"
        },
        "hints": [
          "Most a 3/4 liter az a mennyiség, amelynek a kétharmadát keressük.",
          "Oszd három egyenlő részre a 3/4 litert, majd vegyél kettőt."
        ],
        "solution": [
          {
            "expression": "(3/4 l) : 3 = 1/4 l",
            "why": "Egy harmadrész egynegyed liter."
          },
          {
            "expression": "2 · 1/4 l = 1/2 l",
            "why": "Két ilyen részt töltünk ki."
          }
        ],
        "takeaway": "Törttel szorzáskor egy meglévő mennyiség részét is kereshetjük.",
        "mistakes": [
          {
            "input": "17/12",
            "feedback": "Ez a két törtszám összege. A kiöntött résznek a teljes 3/4 liternél kisebbnek kell lennie."
          },
          {
            "input": "3/8",
            "feedback": "Előbb három egyenlő részt készítünk, és ezekből kettőt veszünk."
          }
        ]
      },
      {
        "id": "tortek-practice-6",
        "topic": "tortek",
        "kind": "reason",
        "difficulty": 2,
        "prompt": "Egy 1 méteres és egy 2 méteres szalag felét összetesszük. Egy méter az egységünk. Melyik leírás helyes?",
        "answer": {
          "kind": "choice",
          "correct": "oneandhalf",
          "options": [
            {
              "id": "one",
              "text": "1/2 + 1/2 = 1 méter, mert mindkettőnek a felét vettük."
            },
            {
              "id": "oneandhalf",
              "text": "1/2 méter + 1 méter = 3/2 méter, mert más hosszúságú volt a két egész."
            },
            {
              "id": "three",
              "text": "1 + 2 = 3 méter, mert a teljes szalagokat kell összeadni."
            }
          ]
        },
        "hints": [
          "Számold ki külön az első és a második szalag felének hosszát.",
          "Ugyanannyi métert jelent-e itt a két fél?"
        ],
        "solution": [
          {
            "expression": "1 m fele = 1/2 m",
            "why": "Az első szalag fele félméteres."
          },
          {
            "expression": "2 m fele = 1 m",
            "why": "A második szalag fele egyméteres."
          },
          {
            "expression": "1/2 m + 1 m = 3/2 m",
            "why": "Most már azonos egységben, méterben adunk össze."
          }
        ],
        "takeaway": "Különböző egészek azonos törtrésze nem feltétlenül ugyanakkora mennyiség.",
        "mistakes": [
          {
            "input": "one",
            "feedback": "A két fél eltérő méretű egészhez tartozik. Írd le a hosszukat méterben."
          },
          {
            "input": "three",
            "feedback": "A teljes szalagok hossza 3 méter, de most mindkettőnek csak a felét használjuk."
          }
        ]
      },
      {
        "id": "tortek-practice-7",
        "topic": "tortek",
        "kind": "compute",
        "difficulty": 2,
        "prompt": "Melyik szám kerül a hiányzó helyre: 2/5 + □ = 7/10?",
        "answer": {
          "kind": "number",
          "expected": "3/10"
        },
        "hints": [
          "A hiányzó rész a teljes összeg és az ismert rész különbsége.",
          "A 2/5 hány tized?"
        ],
        "solution": [
          {
            "expression": "2/5 = 4/10",
            "why": "Az ismert részt tizedekben írjuk."
          },
          {
            "expression": "7/10 − 4/10 = 3/10",
            "why": "Ennyi kell a négy tized mellé, hogy hét tized legyen."
          },
          {
            "expression": "4/10 + 3/10 = 7/10",
            "why": "Visszahelyettesítve ellenőrizzük a hiányzó részt."
          }
        ],
        "takeaway": "Hiányzó összeadandót kivonással kereshetsz, majd összeadással ellenőrizhetsz.",
        "mistakes": [
          {
            "input": "9/15",
            "feedback": "A hiányzó számot keressük, ezért az ismert rész mennyiségét az összegből kell visszavenni."
          },
          {
            "input": "5/10",
            "feedback": "A 2/5 tizedekben 4/10, nem 2/10."
          }
        ]
      },
      {
        "id": "tortek-practice-8",
        "topic": "tortek",
        "kind": "transfer",
        "difficulty": 3,
        "prompt": "Egy 1/2 méteres szalag hányszor olyan hosszú, mint egy 3/4 méteres szalag? A hosszak arányát kérjük, nem levágható egész darabok számát.",
        "answer": {
          "kind": "number",
          "expected": "2/3"
        },
        "hints": [
          "A fél méter rövidebb a háromnegyed méternél, ezért az arány kisebb 1-nél.",
          "Írd mindkét hosszt negyed méterekben: hány darabot hasonlítasz hányhoz?"
        ],
        "solution": [
          {
            "expression": "1/2 m = 2/4 m",
            "why": "A rövidebb szalag két negyed méter."
          },
          {
            "expression": "(2/4 m) : (3/4 m) = 2 : 3 = 2/3",
            "why": "Két azonos darabot hasonlítunk három ilyen darabhoz."
          },
          {
            "expression": "2/3 · 3/4 m = 1/2 m",
            "why": "Az aránnyal visszaszorozva megkapjuk a rövidebb hosszt."
          }
        ],
        "takeaway": "A hosszak hányadosa törtszám is lehet; ez nem ugyanaz, mint az egészben levágható darabok száma.",
        "mistakes": [
          {
            "input": "3/2",
            "feedback": "Ez a hosszabb és a rövidebb aránya lenne. Most a fél métert viszonyítjuk a háromnegyed méterhez."
          },
          {
            "input": "3/8",
            "feedback": "A két hossz szorzata helyett az arányukat keressük."
          }
        ]
      }
    ],
    "exit": [
      {
        "id": "tortek-exit-1",
        "topic": "tortek",
        "kind": "compute",
        "difficulty": 2,
        "prompt": "Új példa, közös egység: mennyi 5/8 + 1/6?",
        "answer": {
          "kind": "number",
          "expected": "19/24"
        },
        "hints": [
          "Válassz közös nevezőt a 8-hoz és a 6-hoz.",
          "A 24 megfelelő. Hány huszonnegyedet jelent a két tört?"
        ],
        "solution": [
          {
            "expression": "5/8 = 15/24; 1/6 = 4/24",
            "why": "Az egész felosztását közös egységre finomítjuk."
          },
          {
            "expression": "15/24 + 4/24 = 19/24",
            "why": "Azonos méretű részek darabszámait adjuk össze."
          }
        ],
        "takeaway": "A közös nevező megőrzi az összeadás értelmét új számok mellett is.",
        "mistakes": [
          {
            "input": "6/14",
            "feedback": "A nevezők összege nem ad közös részegységet. Próbálj közös többszöröst."
          },
          {
            "input": "6/24",
            "feedback": "A közös nevezőre váltáskor mindkét számlálót is át kell alakítani."
          }
        ]
      },
      {
        "id": "tortek-exit-2",
        "topic": "tortek",
        "kind": "reason",
        "difficulty": 2,
        "prompt": "Valaki szerint 1/5 + 1/2 = 2/7. Melyik észrevétel mutatja meg rögtön, hogy ez nem lehet jó?",
        "answer": {
          "kind": "choice",
          "correct": "estimate",
          "options": [
            {
              "id": "estimate",
              "text": "A 2/7 kisebb 1/2-nél, pedig pozitív ötödöt adtunk a félhez."
            },
            {
              "id": "denominator",
              "text": "A válasz nevezője mindig csak 5 lehet."
            },
            {
              "id": "bigger",
              "text": "Bármely két pozitív tört összege nagyobb 1-nél."
            }
          ]
        },
        "hints": [
          "Az összeget hasonlítsd az egyik összeadandóhoz.",
          "Ha a 2/7-et megkétszerezed, eléred az egy egészet? Mit mond ez a 2/7 és az 1/2 viszonyáról?"
        ],
        "solution": [
          {
            "expression": "1/5 + 1/2 > 1/2",
            "why": "Pozitív mennyiséget adtunk a félhez."
          },
          {
            "expression": "2/7 < 1/2",
            "why": "Keresztszorzással is ellenőrizhető: 2 · 2 < 7."
          },
          {
            "expression": "1/5 + 1/2 = 2/10 + 5/10 = 7/10",
            "why": "A közös egységgel számolt eredmény megfelel a becslésnek."
          }
        ],
        "takeaway": "Egy rossz eredményt néha már a nagyságából felismerhetsz.",
        "mistakes": [
          {
            "input": "denominator",
            "feedback": "A nevező nincs előre rögzítve az első törtéhez. Közös felosztást keresünk."
          },
          {
            "input": "bigger",
            "feedback": "Például 1/10 + 1/10 még kisebb 1-nél. A pozitív jel önmagában ezt nem dönti el."
          }
        ]
      }
    ],
    "recap": [
      "Összehasonlítás és összeadás előtt ugyanazt az egészet használjuk.",
      "Bővítéskor a mennyiség változatlan; csak a felosztás finomabb.",
      "Összeadásnál és kivonásnál azonos méretű részeket számolunk.",
      "A művelet jelentése és a becslés együtt segít ellenőrizni az eredményt."
    ],
    "glossary": [
      {
        "term": "Nevező",
        "definition": "Azt jelzi, hány egyenlő részre osztjuk az egészet."
      },
      {
        "term": "Számláló",
        "definition": "Azt jelzi, hány nevező szerinti részt veszünk."
      },
      {
        "term": "Bővítés",
        "definition": "A számláló és nevező szorzása ugyanazzal a nem nulla számmal; a tört értéke változatlan."
      },
      {
        "term": "Közös nevező",
        "definition": "Olyan felosztás, amelyben mindkét tört azonos méretű részekkel írható le."
      }
    ],
    "nextTopic": "szazalek"
  },
  {
    "id": "szazalek",
    "moduleId": "M06",
    "title": "Százalék: először keresd meg a 100%-ot",
    "shortTitle": "Százalék",
    "question": "Miért számít, hogy minek a százalékát vesszük?",
    "teaser": "Változtasd meg az árat, és figyeld, hogyan változik a következő százalék alapja.",
    "description": "Részt, egészet és változást keresünk. Az árak kitalált tanulópéldák; minden lépésben megnevezzük, mi számít 100%-nak.",
    "goals": [
      "Kijelölöd a százalékszámítás alapját.",
      "Adott részből az egészet is visszakeresed.",
      "Megmagyarázod, mi történik egymás utáni százalékos változásoknál."
    ],
    "prerequisites": [
      "Tört és tizedes tört jelentése.",
      "Egyszerű arányok, szorzás és osztás."
    ],
    "estimateMinutes": 30,
    "color": "#ffbd84",
    "layer": "TÖRZS",
    "prediction": {
      "id": "szazalek-prediction",
      "topic": "szazalek",
      "kind": "reason",
      "difficulty": 2,
      "prompt": "Egy termék ára 10 000 Ft. Előbb 20%-kal csökkentik, majd az új árat 20%-kal emelik. Mi lesz a végső ár?",
      "answer": {
        "kind": "choice",
        "correct": "lower",
        "options": [
          {
            "id": "same",
            "text": "10 000 Ft, mert a két 20% kiegyenlíti egymást."
          },
          {
            "id": "lower",
            "text": "9 600 Ft, mert a második 20% kisebb alapra vonatkozik."
          },
          {
            "id": "higher",
            "text": "10 400 Ft, mert az emelés később történt."
          }
        ]
      },
      "hints": [
        "Az első változás után mennyi az aktuális ár?",
        "A második 20%-ot az eredeti vagy az új árból számoljuk?"
      ],
      "solution": [
        {
          "expression": "10 000 · 0,8 = 8 000 Ft",
          "why": "20% csökkenés után az eredeti ár 80%-a marad."
        },
        {
          "expression": "8 000 · 0,2 = 1 600 Ft",
          "why": "Az emelés alapja most már 8 000 Ft."
        },
        {
          "expression": "8 000 + 1 600 = 9 600 Ft",
          "why": "Eltérő alapokhoz eltérő összegű 20% tartozik."
        }
      ],
      "takeaway": "Ugyanaz a százalékláb eltérő alapból eltérő összeget jelent.",
      "mistakes": [
        {
          "input": "same",
          "feedback": "Az első 20% 2 000 Ft. A második 20%-ot már 8 000 Ft-ból számoljuk."
        },
        {
          "input": "higher",
          "feedback": "Az időbeli sorrend önmagában nem indok. Írd ki külön a két változás forintértékét."
        }
      ]
    },
    "explanation": [
      {
        "heading": "A százalék egy viszonyítás",
        "body": "A 15% tizenöt századrészt jelent. De a századrészek mérete attól függ, mekkora az egész. Százalékos feladatnál először mondd ki: ebben a lépésben ez a mennyiség a 100%.",
        "formula": "15% = 15/100 = 0,15"
      },
      {
        "heading": "Ismert egészből részt keresünk",
        "body": "Ha egy mennyiség 15%-át keressük, a teljes mennyiséget 0,15-tel szorozzuk. Fejben is felbonthatjuk: 10% és 5% összege. A két út ugyanazt a kapcsolatot használja.",
        "formula": "százalékos rész = alap · százalékláb / 100"
      },
      {
        "heading": "Ismert részből visszakereshető az egész",
        "body": "Ha 8 000 Ft a 20%-kal csökkentett ár, akkor ez az eredeti ár 80%-a. Nem a 8 000 Ft-hoz kell 20%-ot hozzáadni. Azt az egészet keressük, amelynek a 0,8-szerese 8 000.",
        "formula": "eredeti ár = 8 000 : 0,8 = 10 000 Ft"
      },
      {
        "heading": "Változásnál a maradó részt is látjuk",
        "body": "25% kedvezmény után 75% marad: az új ár az eredeti 0,75-szorosa. 25% emelés után 125% lesz: az új ár az eredeti 1,25-szorosa. Mindkettőnél ugyanahhoz a kiinduló árhoz viszonyítunk.",
        "formula": "−25% → szorzás 0,75-tel; +25% → szorzás 1,25-tel"
      },
      {
        "heading": "Új lépéshez új alap tartozhat",
        "body": "Két egymás utáni árváltozásnál a második százalék általában az első változás utáni árra vonatkozik. Ezért a változások százalékait nem lehet egyszerűen összeadni. Írd ki minden lépésnél az aktuális 100%-ot.",
        "formula": "10 000 · 0,8 · 1,2 = 9 600 Ft"
      }
    ],
    "examples": [
      {
        "title": "Vissza az eredeti árhoz",
        "prompt": "Egy hátizsák 20% kedvezmény után 8 000 Ft. Mennyi volt az eredeti ára?",
        "steps": [
          {
            "expression": "100% − 20% = 80%",
            "why": "A kedvezmény után az eredeti ár nyolctizedét fizetjük."
          },
          {
            "expression": "8 000 : 0,8 = 10 000 Ft",
            "why": "Az ismert részhez megkeressük a teljes alapot."
          }
        ],
        "check": "10 000 Ft 20%-a 2 000 Ft; 10 000 − 2 000 = 8 000 Ft.",
        "alternative": [
          {
            "expression": "80% = 8 000 Ft, ezért 1% = 100 Ft",
            "why": "A 80 egyforma századrészt 80-nal osztjuk."
          },
          {
            "expression": "100% = 100 · 100 Ft = 10 000 Ft",
            "why": "A teljes ár száz ilyen részből áll."
          }
        ]
      },
      {
        "title": "Mekkora rész kerékpározik?",
        "prompt": "Egy 24 fős csoportból 6-an kerékpárral érkeznek. A csoport hány százaléka ez?",
        "steps": [
          {
            "expression": "A 100% = 24 fő",
            "why": "A teljes csoporthoz viszonyítunk."
          },
          {
            "expression": "6 : 24 = 1/4 = 0,25",
            "why": "A kerékpárral érkezők a teljes csoport negyedét adják."
          },
          {
            "expression": "0,25 · 100 = 25%",
            "why": "A negyedet századrészekben fejezzük ki."
          }
        ],
        "check": "24 fő 25%-a 24 · 0,25 = 6 fő."
      }
    ],
    "practice": [
      {
        "id": "szazalek-practice-1",
        "topic": "szazalek",
        "kind": "compute",
        "difficulty": 1,
        "prompt": "Mennyi 2 400 Ft 15%-a?",
        "answer": {
          "kind": "number",
          "expected": "360",
          "unit": "Ft"
        },
        "hints": [
          "A 2 400 Ft a 100%.",
          "Kiszámolhatod a 10%-ot és az 5%-ot, majd összeadhatod őket."
        ],
        "solution": [
          {
            "expression": "2 400 · 0,1 = 240 Ft",
            "why": "Ez az alap 10%-a."
          },
          {
            "expression": "240 : 2 = 120 Ft",
            "why": "Az 5% fele akkora rész, mint a 10%."
          },
          {
            "expression": "240 + 120 = 360 Ft",
            "why": "A 10% és az 5% együtt 15%."
          }
        ],
        "takeaway": "Egy százalékos részt több egyszerűbb részből is felépíthetsz.",
        "mistakes": [
          {
            "input": "160",
            "feedback": "A 15% nem a 15 egyenlő rész egyikét jelenti. Száz egyenlő részből tizenötöt keresünk."
          },
          {
            "input": "36000",
            "feedback": "A 15%-os szorzó 15/100 = 0,15, ezért az eredmény kisebb az alapnál."
          }
        ]
      },
      {
        "id": "szazalek-practice-2",
        "topic": "szazalek",
        "kind": "compute",
        "difficulty": 1,
        "prompt": "Egy könyv eredetileg 6 000 Ft. 25% kedvezményt kapunk. Mennyit fizetünk?",
        "answer": {
          "kind": "number",
          "expected": "4500",
          "unit": "Ft"
        },
        "hints": [
          "A 25% az eredeti ár negyede.",
          "A kérdés a kedvezmény utáni árat kéri, nem a megtakarítást."
        ],
        "solution": [
          {
            "expression": "6 000 · 0,25 = 1 500 Ft",
            "why": "Ennyi a kedvezmény."
          },
          {
            "expression": "6 000 − 1 500 = 4 500 Ft",
            "why": "A kedvezményt az eredeti árból levonjuk."
          }
        ],
        "takeaway": "Különítsd el a változás összegét és a változás utáni teljes mennyiséget.",
        "mistakes": [
          {
            "input": "1500",
            "feedback": "Ez a kedvezmény összege. A kérdés azt kéri, mennyit fizetünk utána."
          },
          {
            "input": "7500",
            "feedback": "A kedvezmény csökkenti az árat. Az 1 500 Ft-ot most levonjuk."
          }
        ]
      },
      {
        "id": "szazalek-practice-3",
        "topic": "szazalek",
        "kind": "compute",
        "difficulty": 2,
        "prompt": "Egy pulóver 15% kedvezmény után 6 800 Ft. Mennyi volt az eredeti ára?",
        "answer": {
          "kind": "number",
          "expected": "8000",
          "unit": "Ft"
        },
        "hints": [
          "A kedvezményes 6 800 Ft az eredeti ár hány százaléka?",
          "A 6 800 Ft 85%-ot jelent. Mivel kell osztani, hogy a 100%-ot kapd?"
        ],
        "solution": [
          {
            "expression": "100% − 15% = 85%",
            "why": "A leárazás után az eredeti ár 85%-a maradt."
          },
          {
            "expression": "6 800 : 0,85 = 8 000 Ft",
            "why": "A részhez visszakeressük az eredeti egészet."
          },
          {
            "expression": "8 000 · 0,85 = 6 800 Ft",
            "why": "A visszaszorzás ellenőrzi az eredményt."
          }
        ],
        "takeaway": "Kedvezményes árból az eredetit a maradó százalék segítségével keresd.",
        "mistakes": [
          {
            "input": "7820",
            "feedback": "A kedvezményes ár 15%-ának hozzáadása már más alapot használna."
          },
          {
            "input": "5780",
            "feedback": "Ez még tovább csökkentené a kedvezményes árat. Most a korábbi nagyobb egészet keressük."
          }
        ]
      },
      {
        "id": "szazalek-practice-4",
        "topic": "szazalek",
        "kind": "reason",
        "difficulty": 2,
        "prompt": "Egy cipő árát 15 000 Ft-ról 12 000 Ft-ra csökkentették. Másnap az akkori árat 10%-kal megemelik. Mi a második változás 100%-a?",
        "answer": {
          "kind": "choice",
          "correct": "current",
          "options": [
            {
              "id": "original",
              "text": "15 000 Ft, mert egyszer az volt az eredeti ár."
            },
            {
              "id": "current",
              "text": "12 000 Ft, mert a második változás az aktuális árra vonatkozik."
            },
            {
              "id": "difference",
              "text": "3 000 Ft, mert ennyi volt az előző kedvezmény."
            }
          ]
        },
        "hints": [
          "Melyik árcédula van a cipőn közvetlenül a második változás előtt?",
          "A szöveg az „akkori ár” emeléséről beszél."
        ],
        "solution": [
          {
            "expression": "A második alap = 12 000 Ft",
            "why": "Ezt az aktuális mennyiséget emeljük."
          },
          {
            "expression": "12 000 · 0,1 = 1 200 Ft",
            "why": "Ennyi a második változás összege."
          },
          {
            "expression": "12 000 + 1 200 = 13 200 Ft",
            "why": "Az új ár az aktuális alap 110%-a."
          }
        ],
        "takeaway": "A 100%-ot mindig az adott lépéshez keresd meg.",
        "mistakes": [
          {
            "input": "original",
            "feedback": "Az eredeti ár az első változáshoz tartozott. A második lépés új alapot nevez meg."
          },
          {
            "input": "difference",
            "feedback": "A 3 000 Ft egy korábbi különbség. A következő emelés a teljes aktuális árra vonatkozik."
          }
        ]
      },
      {
        "id": "szazalek-practice-5",
        "topic": "szazalek",
        "kind": "transfer",
        "difficulty": 2,
        "prompt": "Egy 30 fős csoportból 18-an választanak túrázást. A csoport hány százaléka ez?",
        "answer": {
          "kind": "number",
          "expected": "60",
          "unit": "%"
        },
        "hints": [
          "A teljes 30 fős csoport legyen a 100%.",
          "Előbb számold ki a 18/30 arányt, majd fejezd ki századrészekben."
        ],
        "solution": [
          {
            "expression": "18/30 = 3/5 = 0,6",
            "why": "Ez a kiválasztott rész és a teljes csoport aránya."
          },
          {
            "expression": "0,6 · 100 = 60%",
            "why": "A hattized hatvan századrész."
          }
        ],
        "takeaway": "A százalékos arányhoz a részt a megfelelő egészhez viszonyítjuk.",
        "mistakes": [
          {
            "input": "0.6",
            "feedback": "A 0,6 az arány tizedes alakja. A mező százalékot kér: hány századrész ez?"
          },
          {
            "input": "40",
            "feedback": "A 40% a többiek aránya lenne. Most a 18 fő részesedését kérdezzük."
          }
        ]
      },
      {
        "id": "szazalek-practice-6",
        "topic": "szazalek",
        "kind": "reason",
        "difficulty": 2,
        "prompt": "Egy ár 10 000 Ft-ról 8 000 Ft-ra csökkent. Melyik indoklás adja meg, hány százalékos emelés kell a 10 000 Ft-hoz való visszatéréshez?",
        "answer": {
          "kind": "choice",
          "correct": "quarter",
          "options": [
            {
              "id": "twenty",
              "text": "20%, mert az előző csökkenés is 20% volt."
            },
            {
              "id": "quarter",
              "text": "25%, mert a szükséges 2 000 Ft a mostani 8 000 Ft negyede."
            },
            {
              "id": "two",
              "text": "2%, mert 2 000 Ft a különbség."
            }
          ]
        },
        "hints": [
          "Mennyi forintot kell hozzáadni a mostani árhoz?",
          "Ezt a különbséget a mostani 8 000 Ft-hoz viszonyítsd."
        ],
        "solution": [
          {
            "expression": "10 000 − 8 000 = 2 000 Ft",
            "why": "Ennyivel kell növelni az árat."
          },
          {
            "expression": "2 000 : 8 000 = 1/4 = 25%",
            "why": "A növekedés alapja az emelés előtti 8 000 Ft."
          },
          {
            "expression": "8 000 · 1,25 = 10 000 Ft",
            "why": "A kapott százalékkal valóban visszatérünk."
          }
        ],
        "takeaway": "Egy csökkenés visszafordításához általában más százalékláb szükséges.",
        "mistakes": [
          {
            "input": "twenty",
            "feedback": "A csökkenés és a visszaemelés nem ugyanabból az árból indul."
          },
          {
            "input": "two",
            "feedback": "A forintban megadott különbségből csak az alap ismeretében lesz százalék."
          }
        ]
      },
      {
        "id": "szazalek-practice-7",
        "topic": "szazalek",
        "kind": "compute",
        "difficulty": 3,
        "prompt": "Egy 12 000 Ft-os árra előbb 10%, majd az új árra további 10% kedvezményt adnak. Mennyi a végső ár?",
        "answer": {
          "kind": "number",
          "expected": "9720",
          "unit": "Ft"
        },
        "hints": [
          "Az első kedvezmény után az ár 90%-a marad.",
          "A második 10%-ot már az első kedvezmény utáni árból számold."
        ],
        "solution": [
          {
            "expression": "12 000 · 0,9 = 10 800 Ft",
            "why": "Az első 10% kedvezmény után ezt fizetnénk."
          },
          {
            "expression": "10 800 · 0,9 = 9 720 Ft",
            "why": "A második kedvezmény alapja 10 800 Ft."
          },
          {
            "expression": "12 000 · 0,81 = 9 720 Ft",
            "why": "A két lépés együtt az eredeti ár 81%-át hagyja meg."
          }
        ],
        "takeaway": "Két egymás utáni 10% kedvezmény együtt 19% csökkenés, nem 20%.",
        "mistakes": [
          {
            "input": "9600",
            "feedback": "Ez egyetlen 20%-os kedvezmény eredménye. Itt a második 10% kisebb alapra vonatkozik."
          },
          {
            "input": "10800",
            "feedback": "Ez az első kedvezmény utáni ár. Még egy 10%-os csökkentés következik."
          }
        ]
      },
      {
        "id": "szazalek-practice-8",
        "topic": "szazalek",
        "kind": "transfer",
        "difficulty": 2,
        "prompt": "Egy belépő ára 2 000 Ft-ról 2 500 Ft-ra nő. Hány százalékos az emelés az eredeti árhoz képest?",
        "answer": {
          "kind": "number",
          "expected": "25",
          "unit": "%"
        },
        "hints": [
          "Először keresd meg az emelést forintban.",
          "Az emelés összegét a korábbi, 2 000 Ft-os árhoz viszonyítsd."
        ],
        "solution": [
          {
            "expression": "2 500 − 2 000 = 500 Ft",
            "why": "Ennyi a változás."
          },
          {
            "expression": "500 : 2 000 = 0,25",
            "why": "A változás az eredeti ár negyede."
          },
          {
            "expression": "0,25 · 100 = 25%",
            "why": "Az eredeti árhoz viszonyított növekedést százalékban adjuk meg."
          }
        ],
        "takeaway": "A százalékos változás alapja az a mennyiség, amelyhez a változást viszonyítjuk.",
        "mistakes": [
          {
            "input": "20",
            "feedback": "Ez az 500 Ft-ot az új árhoz viszonyítaná. A kérdés az eredeti árat nevezi meg alapnak."
          },
          {
            "input": "500",
            "feedback": "Az 500 Ft a pénzbeli változás. Ezt még az eredeti árhoz kell viszonyítani."
          }
        ]
      }
    ],
    "exit": [
      {
        "id": "szazalek-exit-1",
        "topic": "szazalek",
        "kind": "compute",
        "difficulty": 2,
        "prompt": "Egy termék 10% kedvezmény után 5 400 Ft. Mennyi az eredeti ára?",
        "answer": {
          "kind": "number",
          "expected": "6000",
          "unit": "Ft"
        },
        "hints": [
          "A kedvezményes ár az eredeti ár 90%-a.",
          "Keresd azt a számot, amelynek a 0,9-szerese 5 400."
        ],
        "solution": [
          {
            "expression": "100% − 10% = 90%",
            "why": "Ez maradt az eredeti árból."
          },
          {
            "expression": "5 400 : 0,9 = 6 000 Ft",
            "why": "A maradó részből visszakeressük a teljes árat."
          },
          {
            "expression": "6 000 − 600 = 5 400 Ft",
            "why": "Az eredeti ár 10%-át levonva ellenőrzünk."
          }
        ],
        "takeaway": "Fordított kérdésnél is először a 100%-ot és az ismert részt azonosítsd.",
        "mistakes": [
          {
            "input": "5940",
            "feedback": "Az 5 400 Ft 10%-ának hozzáadása az új árból számolna. Az eredeti alapot keressük."
          },
          {
            "input": "4860",
            "feedback": "Ez egy újabb csökkentés lenne. Az eredeti ár nagyobb a kedvezményesnél."
          }
        ]
      },
      {
        "id": "szazalek-exit-2",
        "topic": "szazalek",
        "kind": "reason",
        "difficulty": 3,
        "prompt": "Az egyik szakkör létszáma 20-ról 25 főre, a másiké 40-ről 45 főre nő. Melyiknek nagyobb a százalékos növekedése?",
        "answer": {
          "kind": "choice",
          "correct": "first",
          "options": [
            {
              "id": "same",
              "text": "Ugyanakkora, mert mindkettő 5 fővel nőtt."
            },
            {
              "id": "first",
              "text": "Az elsőé: 5 fő a 20 főnek nagyobb része, mint a 40 főnek."
            },
            {
              "id": "second",
              "text": "A másodiké, mert végül többen vannak."
            }
          ]
        },
        "hints": [
          "Mindkét növekedés 5 fő, de az alapok eltérnek.",
          "Hasonlítsd össze az 5/20 és az 5/40 arányt."
        ],
        "solution": [
          {
            "expression": "5/20 = 1/4 = 25%",
            "why": "Az első szakkörnél az eredeti 20 főhöz viszonyítunk."
          },
          {
            "expression": "5/40 = 1/8 = 12,5%",
            "why": "A másodiknál nagyobb az alap, ezért ugyanaz a növekedés kisebb arány."
          },
          {
            "expression": "25% > 12,5%",
            "why": "Az első szakkör százalékos növekedése nagyobb."
          }
        ],
        "takeaway": "Azonos darabszámú növekedés különböző alapok mellett eltérő százalék.",
        "mistakes": [
          {
            "input": "same",
            "feedback": "Az 5 fő mindkét esetben ugyanannyi, a viszonyítási alap azonban nem."
          },
          {
            "input": "second",
            "feedback": "A végső létszám nem dönti el a növekedés arányát. Az induló létszámhoz viszonyíts."
          }
        ]
      }
    ],
    "recap": [
      "Minden lépésben nevezd meg, mi a 100%.",
      "A százalékos rész és a teljes új mennyiség különböző lehet.",
      "Kedvezményes árból az eredetit a maradó százalék segítségével keresheted.",
      "Egymás utáni változásoknál változhat az alap."
    ],
    "glossary": [
      {
        "term": "Százalékalap",
        "definition": "Az a mennyiség, amelyet az adott lépésben 100%-nak tekintünk."
      },
      {
        "term": "Százalékláb",
        "definition": "Azt mondja meg, az alap hány századrészét vesszük; például 15%."
      },
      {
        "term": "Százalékérték",
        "definition": "Az alap megadott százaléka, az adott mennyiség saját egységében."
      },
      {
        "term": "Változási szorzó",
        "definition": "A régi mennyiséget ezzel megszorozva kapjuk az újat; például 20% csökkenésnél 0,8."
      }
    ],
    "nextTopic": "egyenlet"
  },
  {
    "id": "egyenlet",
    "moduleId": "M10",
    "title": "Egyenletek: őrizd meg az egyensúlyt",
    "shortTitle": "Egyenletek",
    "question": "Miért szabad ugyanazt a műveletet mindkét oldalon elvégezni?",
    "teaser": "A mérleg minden lépésedre válaszol. Találd meg az ismeretlent, és ellenőrizd is.",
    "description": "Megkeressük azt az értéket, amelynél a két oldal egyenlő. Minden átalakítás mellé indokot teszünk, és több megoldási utat is összehasonlítunk.",
    "goals": [
      "Elmondod, mit jelent egy egyenlet megoldása.",
      "Visszafordítható műveletekkel mindkét oldalt együtt alakítod.",
      "A kapott számot az eredeti egyenletben is ellenőrzöd."
    ],
    "prerequisites": [
      "Műveleti sorrend és zárójelek.",
      "Egyszerű betűs kifejezés értéke adott szám behelyettesítésekor."
    ],
    "estimateMinutes": 35,
    "color": "#a9c9ff",
    "layer": "TÖRZS",
    "prediction": {
      "id": "egyenlet-prediction",
      "topic": "egyenlet",
      "kind": "reason",
      "difficulty": 1,
      "prompt": "Három egyforma csomag együtt 21 egységet ér. Mindegyikben x egység és még 2 egység van: 3(x + 2) = 21. Melyik x illik bele?",
      "answer": {
        "kind": "choice",
        "correct": "five",
        "options": [
          {
            "id": "five",
            "text": "x = 5"
          },
          {
            "id": "seven",
            "text": "x = 7"
          },
          {
            "id": "nineteen",
            "text": "x = 19"
          }
        ]
      },
      "hints": [
        "Először egy egész csomag értékét keresd.",
        "Az egy csomagban lévő 2 ismert egységet még le kell venni."
      ],
      "solution": [
        {
          "expression": "21 : 3 = 7",
          "why": "Egy csomag összesen hét egységet ér."
        },
        {
          "expression": "x + 2 = 7, ezért x = 5",
          "why": "Az ismeretlen rész a csomag értékéből a két ismert egység levonásával adódik."
        },
        {
          "expression": "3 · (5 + 2) = 21",
          "why": "Az ötöt behelyettesítve az eredeti állítás igaz."
        }
      ],
      "takeaway": "A zárójeles csomagot először egyben is kezelheted.",
      "mistakes": [
        {
          "input": "seven",
          "feedback": "A 7 az egész csomag értéke. Az x mellett még 2 egység is van benne."
        },
        {
          "input": "nineteen",
          "feedback": "A 21 nem egyetlen csomag értéke: három egyforma csomag tartozik hozzá."
        }
      ]
    },
    "explanation": [
      {
        "heading": "Az egyenlőség két értéket kapcsol össze",
        "body": "Az egyenlőségjel azt állítja, hogy a bal és a jobb oldal ugyanannyit ér. Az x helyére olyan számot keresünk, amelynél ez valóban igaz. Egy tipp akkor lesz megoldás, ha az eredeti egyenletbe helyettesítve működik.",
        "formula": "x + 5 = 12 → x = 7"
      },
      {
        "heading": "Ugyanaz a változtatás mindkét oldalon",
        "body": "Ha két egyenlő mennyiséghez ugyanannyit adsz, továbbra is egyenlők. Ugyanennyi elvétele is megőrzi az egyenlőséget. A művelet visszafordítható, ezért nem cseréljük le másra a megoldások körét.",
        "formula": "x + 5 − 5 = 12 − 5"
      },
      {
        "heading": "Osztásnál a nem nulla szám számít",
        "body": "Mindkét oldalt ugyanazzal a nem nulla számmal szorozhatjuk vagy oszthatjuk. A lépést az ellenkező művelettel vissza tudjuk fordítani. Nullával osztani nem lehet. A nullával szorzás pedig eltüntetné az ismeretlenről szóló információt.",
        "formula": "3x = 15 → 3x : 3 = 15 : 3 → x = 5"
      },
      {
        "heading": "A zárójel egy egész csomag",
        "body": "A 3(x + 2) három teljes x + 2 csomagot jelent. Ezért felbontva 3x + 6 lesz. Néha kényelmesebb először elosztani a csomagok számával; máskor a zárójelbontás segít. Mindkét út működhet.",
        "formula": "3(x + 2) = 3x + 6"
      },
      {
        "heading": "Az eredeti feladatban ellenőrizz",
        "body": "A végén tedd vissza a kapott számot a kiinduló egyenletbe. Szöveges helyzetnél azt is vizsgáld, mit jelent: például lehet-e negatív egy keresett darabszám. A valódi mérleg pozitív tömegeket mutat; negatív számokhoz a számos egyenlőség és az előjeles jelölés ad pontosabb modellt.",
        "formula": "3 · (5 + 2) = 21"
      }
    ],
    "examples": [
      {
        "title": "Két jó út ugyanahhoz az ismeretlenhez",
        "prompt": "Oldd meg: 3(x + 2) = 21.",
        "steps": [
          {
            "expression": "x + 2 = 7",
            "why": "Mindkét oldalt 3-mal osztjuk. A 3 nem nulla, a lépés visszafordítható."
          },
          {
            "expression": "x = 5",
            "why": "Mindkét oldalból kettőt vonunk ki."
          }
        ],
        "check": "Az eredeti bal oldal 3 · (5 + 2) = 21, ami megegyezik a jobb oldallal.",
        "alternative": [
          {
            "expression": "3x + 6 = 21",
            "why": "A három csomag mindegyikében két ismert egység van."
          },
          {
            "expression": "3x = 15",
            "why": "Mindkét oldalból hatot vonunk ki."
          },
          {
            "expression": "x = 5",
            "why": "Mindkét oldalt hárommal osztjuk."
          }
        ]
      },
      {
        "title": "Az ismeretlen mindkét oldalon szerepel",
        "prompt": "Oldd meg: 4x + 3 = 2x + 15.",
        "steps": [
          {
            "expression": "2x + 3 = 15",
            "why": "Mindkét oldalból 2x-et vonunk ki."
          },
          {
            "expression": "2x = 12",
            "why": "Mindkét oldalból hármat vonunk ki."
          },
          {
            "expression": "x = 6",
            "why": "Mindkét oldalt kettővel osztjuk."
          }
        ],
        "check": "4 · 6 + 3 = 27 és 2 · 6 + 15 = 27. A két eredeti oldal valóban egyenlő."
      }
    ],
    "practice": [
      {
        "id": "egyenlet-practice-1",
        "topic": "egyenlet",
        "kind": "compute",
        "difficulty": 1,
        "prompt": "Oldd meg: x + 7 = 19. Add meg x értékét.",
        "answer": {
          "kind": "number",
          "expected": "12",
          "variable": "x"
        },
        "hints": [
          "Melyik művelet fordítja vissza a hét hozzáadását?",
          "Ugyanazt a műveletet végezd mindkét oldalon."
        ],
        "solution": [
          {
            "expression": "x + 7 − 7 = 19 − 7",
            "why": "Mindkét oldalból hét egységet vonunk ki."
          },
          {
            "expression": "x = 12",
            "why": "A bal oldalon csak az ismeretlen marad."
          },
          {
            "expression": "12 + 7 = 19",
            "why": "Az eredeti egyenletben ellenőrzünk."
          }
        ],
        "takeaway": "A rövid „átvitel” mögött mindkét oldalon végzett művelet áll.",
        "mistakes": [
          {
            "input": "26",
            "feedback": "A hét hozzáadását most vissza kell fordítani. Próbáld ki a tippedet az eredeti egyenletben."
          },
          {
            "input": "19",
            "feedback": "Az x mellett még 7 is szerepel. A kettőnek együtt kell 19-et adnia."
          }
        ]
      },
      {
        "id": "egyenlet-practice-2",
        "topic": "egyenlet",
        "kind": "compute",
        "difficulty": 1,
        "prompt": "Oldd meg: 5x = 35.",
        "answer": {
          "kind": "number",
          "expected": "7",
          "variable": "x"
        },
        "hints": [
          "Öt egyforma ismeretlen rész együtt 35.",
          "Hogyan kapod meg egyetlen rész értékét?"
        ],
        "solution": [
          {
            "expression": "5x : 5 = 35 : 5",
            "why": "Mindkét oldalt ugyanazzal a nem nulla számmal osztjuk."
          },
          {
            "expression": "x = 7",
            "why": "Egy rész hét egységet ér."
          },
          {
            "expression": "5 · 7 = 35",
            "why": "Visszaszorzással ellenőrizzük az eredeti kapcsolatot."
          }
        ],
        "takeaway": "Az együtthatóval való osztás az egyforma részek egyikének értékét adja.",
        "mistakes": [
          {
            "input": "30",
            "feedback": "Az 5x ötször x-et jelent, nem x + 5-öt."
          },
          {
            "input": "175",
            "feedback": "Az ötszörözést vissza kell fordítani, ezért most osztunk."
          }
        ]
      },
      {
        "id": "egyenlet-practice-3",
        "topic": "egyenlet",
        "kind": "reason",
        "difficulty": 1,
        "prompt": "A 3x + 6 = 21 egyenletben a +6-ot szeretnénk eltüntetni. Melyik következő sor őrzi meg a megoldást?",
        "answer": {
          "kind": "choice",
          "correct": "both",
          "options": [
            {
              "id": "leftonly",
              "text": "3x = 21"
            },
            {
              "id": "both",
              "text": "3x + 6 − 6 = 21 − 6"
            },
            {
              "id": "addright",
              "text": "3x = 21 + 6"
            }
          ]
        },
        "hints": [
          "A bal oldalon hatot vonunk ki.",
          "Mi történjen közben a jobb oldallal?"
        ],
        "solution": [
          {
            "expression": "3x + 6 − 6 = 21 − 6",
            "why": "Mindkét oldal ugyanannyival csökken."
          },
          {
            "expression": "3x = 15",
            "why": "A +6 és −6 együtt nulla."
          }
        ],
        "takeaway": "A két oldal együtt változik; ettől marad ugyanaz az egyenlet megoldása.",
        "mistakes": [
          {
            "input": "leftonly",
            "feedback": "Ebből a sorból a jobb oldali hat kivonása hiányzik."
          },
          {
            "input": "addright",
            "feedback": "Ha balról hatot veszünk el, jobbról is hatot kell elvenni, nem hozzáadni."
          }
        ]
      },
      {
        "id": "egyenlet-practice-4",
        "topic": "egyenlet",
        "kind": "compute",
        "difficulty": 2,
        "prompt": "Oldd meg: 4(x − 1) = 20.",
        "answer": {
          "kind": "number",
          "expected": "6",
          "variable": "x"
        },
        "hints": [
          "Először oszthatod mindkét oldalt a csomagok számával.",
          "Ha x − 1 = 5, hogyan kapod meg x-et?"
        ],
        "solution": [
          {
            "expression": "x − 1 = 5",
            "why": "Mindkét oldalt néggyel osztjuk."
          },
          {
            "expression": "x = 6",
            "why": "Mindkét oldalhoz egyet adunk."
          },
          {
            "expression": "4 · (6 − 1) = 20",
            "why": "Visszahelyettesítve az eredeti egyenlet igaz."
          }
        ],
        "takeaway": "Az x − 1 értékéből egy hozzáadásával jutsz vissza x-hez.",
        "mistakes": [
          {
            "input": "4",
            "feedback": "Próbáld visszahelyettesíteni: 4 · (4 − 1) nem 20. A kivonást hozzáadással fordítjuk vissza."
          },
          {
            "input": "5",
            "feedback": "Ez az x − 1 csomag értéke. Még vissza kell keresni x-et."
          }
        ]
      },
      {
        "id": "egyenlet-practice-5",
        "topic": "egyenlet",
        "kind": "compute",
        "difficulty": 3,
        "prompt": "Oldd meg: 7x − 5 = 3x + 19.",
        "answer": {
          "kind": "number",
          "expected": "6",
          "variable": "x"
        },
        "hints": [
          "Először vond ki mindkét oldalból a 3x-et.",
          "Ezután mindkét oldalhoz adj ötöt.",
          "A megmaradt 4x értékéből egy x-et keress."
        ],
        "solution": [
          {
            "expression": "4x − 5 = 19",
            "why": "Mindkét oldalból 3x-et vonunk ki."
          },
          {
            "expression": "4x = 24",
            "why": "Mindkét oldalhoz ötöt adunk."
          },
          {
            "expression": "x = 6",
            "why": "Mindkét oldalt néggyel osztjuk."
          },
          {
            "expression": "7 · 6 − 5 = 37 = 3 · 6 + 19",
            "why": "A két eredeti oldal ugyanannyit ér."
          }
        ],
        "takeaway": "Az ismeretlen tagjait is rendezheted mindkét oldalon végzett azonos művelettel.",
        "mistakes": [
          {
            "input": "12/5",
            "feedback": "Ha a jobb oldali 3x-et el akarod tüntetni, mindkét oldalból vond ki. Balra így 4x marad."
          },
          {
            "input": "-6",
            "feedback": "A 4x = 24 sor mindkét oldala pozitív, ezért az osztás után x is pozitív."
          }
        ]
      },
      {
        "id": "egyenlet-practice-6",
        "topic": "egyenlet",
        "kind": "compute",
        "difficulty": 2,
        "prompt": "Oldd meg: x/3 + 2 = 7.",
        "answer": {
          "kind": "number",
          "expected": "15",
          "variable": "x"
        },
        "hints": [
          "Először a kettő hozzáadását fordítsd vissza.",
          "Ha x harmada 5, mennyi x?"
        ],
        "solution": [
          {
            "expression": "x/3 = 5",
            "why": "Mindkét oldalból kettőt vonunk ki."
          },
          {
            "expression": "x = 15",
            "why": "Mindkét oldalt hárommal szorozzuk."
          },
          {
            "expression": "15/3 + 2 = 7",
            "why": "Az eredeti műveletsor visszaadja a jobb oldalt."
          }
        ],
        "takeaway": "A harmadolás visszafordítása a háromszorozás.",
        "mistakes": [
          {
            "input": "5",
            "feedback": "Az 5 most x harmadának értéke, nem magáé az x-é."
          },
          {
            "input": "5/3",
            "feedback": "Az osztást szorzással fordítjuk vissza. Próbáld beírni ezt az értéket az eredeti egyenletbe."
          }
        ]
      },
      {
        "id": "egyenlet-practice-7",
        "topic": "egyenlet",
        "kind": "reason",
        "difficulty": 2,
        "prompt": "Egy megoldás így indul: 2(x + 4) = 18 → 2x + 4 = 18 → 2x = 14. Hol van az első hiba?",
        "answer": {
          "kind": "choice",
          "correct": "bracket",
          "options": [
            {
              "id": "bracket",
              "text": "A zárójelbontásnál: 2(x + 4) helyesen 2x + 8."
            },
            {
              "id": "subtract",
              "text": "A 2x + 4 = 18 sorból nem szabad mindkét oldalból négyet kivonni."
            },
            {
              "id": "none",
              "text": "Nincs benne hiba."
            }
          ]
        },
        "hints": [
          "Nézd meg, hány x + 4 csomagot jelent a bal oldal.",
          "Két csomagban összesen hány ismert egység van?"
        ],
        "solution": [
          {
            "expression": "2(x + 4) = 2x + 8",
            "why": "A kettes a zárójel mindkét tagját szorozza."
          },
          {
            "expression": "2x + 8 = 18 → 2x = 10",
            "why": "A helyes egyenlet mindkét oldalából nyolcat vonunk ki."
          },
          {
            "expression": "x = 5",
            "why": "A tízet két egyforma x-rész adja."
          }
        ],
        "takeaway": "Hibakereséskor az első hibás lépést javítsd; az utána következő számolás lehet következetes, mégis rossz alapból indul.",
        "mistakes": [
          {
            "input": "subtract",
            "feedback": "A négy kivonása az adott sorból önmagában megengedett. A hiba már korábban, a zárójelbontásnál megjelent."
          },
          {
            "input": "none",
            "feedback": "Írd ki a két csomagot: (x + 4) + (x + 4). Hány négyes szerepel?"
          }
        ]
      },
      {
        "id": "egyenlet-practice-8",
        "topic": "egyenlet",
        "kind": "transfer",
        "difficulty": 2,
        "prompt": "Négy egyforma árú belépő és egyszeri 500 Ft kezelési költség összesen 3 300 Ft. Mennyibe kerül egy belépő?",
        "answer": {
          "kind": "number",
          "expected": "700",
          "unit": "Ft"
        },
        "hints": [
          "Az egyszeri kezelési költség nem négyszer szerepel.",
          "A 3 300 Ft-ból előbb különítsd el a belépők teljes árát."
        ],
        "solution": [
          {
            "expression": "4x + 500 = 3 300",
            "why": "Az x egy belépő árát jelöli forintban."
          },
          {
            "expression": "4x = 2 800",
            "why": "A kezelési költséget mindkét oldalból levonjuk."
          },
          {
            "expression": "x = 700 Ft",
            "why": "A belépők összegét négy egyforma részre osztjuk."
          },
          {
            "expression": "4 · 700 + 500 = 3 300 Ft",
            "why": "Az eredményt a történetben ellenőrizzük."
          }
        ],
        "takeaway": "A szövegből először a mennyiségek kapcsolatát írd fel.",
        "mistakes": [
          {
            "input": "825",
            "feedback": "Ez a kezelési költséget is négy belépő közé osztja. A kérdés a belépő külön árát kéri."
          },
          {
            "input": "2800",
            "feedback": "Ez mind a négy belépő teljes ára. Még egyetlen belépőre kell jutnod."
          }
        ]
      }
    ],
    "exit": [
      {
        "id": "egyenlet-exit-1",
        "topic": "egyenlet",
        "kind": "compute",
        "difficulty": 2,
        "prompt": "Oldd meg önállóan: 3(x + 4) = 27.",
        "answer": {
          "kind": "number",
          "expected": "5",
          "variable": "x"
        },
        "hints": [
          "Egy x + 4 csomag értékét keresd meg.",
          "A csomag értékéből vedd el a négy ismert egységet."
        ],
        "solution": [
          {
            "expression": "x + 4 = 9",
            "why": "Mindkét oldalt hárommal osztjuk."
          },
          {
            "expression": "x = 5",
            "why": "Mindkét oldalból négyet vonunk ki."
          },
          {
            "expression": "3 · (5 + 4) = 27",
            "why": "Az eredeti egyenletben ellenőrizzük a megoldást."
          }
        ],
        "takeaway": "A megoldási út és az eredeti egyenletbe való visszahelyettesítés együtt ad biztos ellenőrzést.",
        "mistakes": [
          {
            "input": "9",
            "feedback": "A 9 a teljes x + 4 csomag értéke."
          },
          {
            "input": "13",
            "feedback": "A négy hozzáadását most kivonással kell visszafordítani."
          }
        ]
      },
      {
        "id": "egyenlet-exit-2",
        "topic": "egyenlet",
        "kind": "reason",
        "difficulty": 3,
        "prompt": "Az x + 2 = 7 egyenlet mindkét oldalát nullával szorozva 0 = 0 adódik. Miért nem használható ez az ismeretlen megkeresésére?",
        "answer": {
          "kind": "choice",
          "correct": "lost",
          "options": [
            {
              "id": "lost",
              "text": "A 0 = 0 bármely x mellett igaz, ezért elveszett az eredeti egyenlet információja."
            },
            {
              "id": "zero",
              "text": "Mert ebből biztosan x = 0 következik."
            },
            {
              "id": "unequal",
              "text": "Mert a két oldal ezután nem egyenlő."
            }
          ]
        },
        "hints": [
          "A 0 = 0 igaz maradna x = 1, x = 5 és x = 100 mellett is?",
          "Az eredeti egyenletben ezek közül csak melyik érték működik?"
        ],
        "solution": [
          {
            "expression": "x + 2 = 7 → x = 5",
            "why": "Az eredeti egyenlet egy konkrét értéket keres."
          },
          {
            "expression": "0 · (x + 2) = 0 · 7 → 0 = 0",
            "why": "Ez már nem különbözteti meg a lehetséges x-eket."
          },
          {
            "expression": "Nullával szorzás nem fordítható vissza osztással",
            "why": "Ezért nem őrzi meg az eredeti megoldások körét."
          }
        ],
        "takeaway": "Nem elég, hogy egy új sor igaz legyen: az eredeti megoldásról szóló információt is meg kell őriznie.",
        "mistakes": [
          {
            "input": "zero",
            "feedback": "A 0 = 0 sorban az x értékéről már nincs információ."
          },
          {
            "input": "unequal",
            "feedback": "A 0 és 0 egyenlő. A gond az, hogy ez minden x-nél teljesül."
          }
        ]
      }
    ],
    "recap": [
      "Az egyenlet megoldása olyan érték, amelynél az eredeti két oldal egyenlő.",
      "Ugyanazt a visszafordítható műveletet végezzük mindkét oldalon.",
      "A zárójel teljes csomagot jelent; a szorzó minden tagra vonatkozik.",
      "Az ellenőrzést az eredeti egyenletben és szükség esetén a történetben végezzük."
    ],
    "glossary": [
      {
        "term": "Ismeretlen",
        "definition": "Az a mennyiség, amelynek az értékét keressük; gyakran x-szel jelöljük."
      },
      {
        "term": "Megoldás",
        "definition": "Olyan érték, amelyet az ismeretlen helyére írva az egyenlet igaz lesz."
      },
      {
        "term": "Mérlegelv",
        "definition": "Az egyenlet mindkét oldalán ugyanazt a megfelelő műveletet végezzük."
      },
      {
        "term": "Visszahelyettesítés",
        "definition": "A kapott szám beírása az eredeti egyenletbe ellenőrzésként."
      }
    ],
    "nextTopic": "grafikon"
  },
  {
    "id": "grafikon",
    "moduleId": "M13",
    "title": "Grafikonok: ugyanaz a történet többféleképpen",
    "shortTitle": "Grafikonok",
    "question": "Mit mond el egy pont, és mitől függ az egyenes helyzete?",
    "teaser": "Mozgasd az alapdíjat és a kilométerdíjat. A történet, a táblázat és a grafikon együtt változik.",
    "description": "A pontok mögötti mennyiségeket keressük. Kitalált díjszabásokkal és egyszerű változási történetekkel nézzük meg, mit jelent egy kezdőérték és az egyenletes növekedés.",
    "goals": [
      "Megnevezed a két tengelyen szereplő mennyiséget és egységet.",
      "Táblázatot, pontot és számolási szabályt kapcsolsz össze.",
      "Megkülönbözteted az egyenes arányosságot az alapdíjas kapcsolattól."
    ],
    "prerequisites": [
      "Koordinátapár első és második tagja.",
      "Egyszerű szorzás, összeadás és arány."
    ],
    "estimateMinutes": 30,
    "color": "#b6ded1",
    "layer": "TÖRZS",
    "prediction": {
      "id": "grafikon-prediction",
      "topic": "grafikon",
      "kind": "reason",
      "difficulty": 2,
      "prompt": "Egy kitalált fuvar díja 1 200 Ft alapdíj és kilométerenként 300 Ft. Ha 2 km helyett 4 km-t megyünk, kétszeres lesz a teljes díj?",
      "answer": {
        "kind": "choice",
        "correct": "less",
        "options": [
          {
            "id": "twice",
            "text": "Igen, a kétszeres út mindig kétszeres díjat jelent."
          },
          {
            "id": "less",
            "text": "Nem: 1 800 Ft-ról 2 400 Ft-ra nő, ami kevesebb a kétszeresnél."
          },
          {
            "id": "same",
            "text": "Nem változik, mert van alapdíj."
          }
        ]
      },
      "hints": [
        "Számold ki külön a 2 km és a 4 km teljes díját.",
        "Az alapdíjat minden út esetén egyszer kell hozzáadni."
      ],
      "solution": [
        {
          "expression": "2 km: 1 200 + 300 · 2 = 1 800 Ft",
          "why": "Az alapdíjhoz két kilométer díját adjuk."
        },
        {
          "expression": "4 km: 1 200 + 300 · 4 = 2 400 Ft",
          "why": "Most négy kilométer díja kerül ugyanahhoz az alapdíjhoz."
        },
        {
          "expression": "2 400 < 2 · 1 800",
          "why": "A kétszeres úthoz nem kétszeres teljes díj tartozik."
        }
      ],
      "takeaway": "Egy egyenes grafikon még nem feltétlenül egyenes arányosság.",
      "mistakes": [
        {
          "input": "twice",
          "feedback": "Az úttal arányos rész megkétszereződik, de az alapdíjat továbbra is csak egyszer fizetjük."
        },
        {
          "input": "same",
          "feedback": "Az alapdíj állandó, a kilométerenkénti rész viszont változik."
        }
      ]
    },
    "explanation": [
      {
        "heading": "A tengely neve a jelentés része",
        "body": "A vízszintes tengelyen például az út szerepelhet kilométerben, a függőlegesen a díj forintban. A beosztás mondja meg, mekkora értéket jelent egy lépés. A pont helyét csak ezekkel együtt lehet értelmezni.",
        "bullets": [
          "Mi a mennyiség?",
          "Mi a mértékegység?",
          "Mennyit ér egy beosztás?"
        ]
      },
      {
        "heading": "Egy pont két összetartozó érték",
        "body": "A (2; 1 800) pont az út–díj grafikonon azt jelenti, hogy 2 km-hez 1 800 Ft tartozik. Először a vízszintes, utána a függőleges koordinátát olvassuk. A két szám felcserélése egészen más állítást adna.",
        "formula": "(út kilométerben; díj forintban)"
      },
      {
        "heading": "A táblázat és a szabály ugyanazt írja le",
        "body": "Az alapdíjas példában a teljes díjhoz a kilométerek számát 300-zal szorozzuk, majd hozzáadunk 1 200-at. Ha ezt több úthosszra elvégezzük, értéktáblázatot kapunk. A táblázat sorai a grafikon pontjai.",
        "formula": "díj = 1 200 + 300 · út"
      },
      {
        "heading": "Kezdőérték és egyenletes növekedés",
        "body": "A 0 km-hez 1 200 Ft tartozik: ez a modell kezdőértéke. Minden új kilométer 300 Ft-tal növeli a díjat. Ha a kilométerdíj nő, meredekebben emelkedik a grafikon; ha csak az alapdíj nő, minden érték ugyanannyival lesz nagyobb.",
        "bullets": [
          "Ezek a példák kitalált, egyszerű díjmodellek.",
          "Az utat nemnegatív értékekkel vizsgáljuk."
        ]
      },
      {
        "heading": "Mikor beszélünk egyenes arányosságról?",
        "body": "Egyenes arányosságnál ugyanannyiszoros úthoz ugyanannyiszoros díj tartozik. A csak kilométerdíjas kapcsolat ilyen: 0 km-nél a díj is 0. Pozitív alapdíj mellett a növekvő grafikon lehet egyenes, de a teljes díj már nem egyenesen arányos az úttal.",
        "formula": "egyenes arányosság példája: díj = 300 · út"
      }
    ],
    "examples": [
      {
        "title": "Szabályból táblázat és pont",
        "prompt": "A díj 1 200 Ft alapdíjból és kilométerenként 300 Ft-ból áll. Mennyi a 4 km-es út teljes díja, és melyik pont jelzi?",
        "steps": [
          {
            "expression": "300 · 4 = 1 200 Ft",
            "why": "Ennyi az úthossztól függő rész."
          },
          {
            "expression": "1 200 + 1 200 = 2 400 Ft",
            "why": "Az alapdíjat egyszer hozzáadjuk."
          },
          {
            "expression": "(4; 2 400)",
            "why": "A pont első tagja a kilométer, második tagja a forint."
          }
        ],
        "check": "A 0, 2 és 4 km-hez 1 200, 1 800 és 2 400 Ft tartozik. Két új kilométer mindig 600 Ft-tal növeli a díjat.",
        "alternative": [
          {
            "expression": "0 km → 1 200 Ft",
            "why": "A kezdőértékből indulunk."
          },
          {
            "expression": "Négy 300 Ft-os lépés: +1 200 Ft",
            "why": "Az egyenletes növekedést négy lépésben is követhetjük."
          },
          {
            "expression": "1 200 + 1 200 = 2 400 Ft",
            "why": "Ugyanazt kapjuk, mint a szabály közvetlen használatával."
          }
        ]
      },
      {
        "title": "Másik történet, hasonló kapcsolat",
        "prompt": "Egy tartályban kezdetben 2 liter víz van. Percenként egyenletesen 3 liter folyik bele, és semmi nem folyik ki. Mennyi víz lesz benne 4 perc után? A tartály elég nagy.",
        "steps": [
          {
            "expression": "3 · 4 = 12 l",
            "why": "Négy perc alatt ennyi víz érkezik."
          },
          {
            "expression": "2 + 12 = 14 l",
            "why": "A kezdeti vízmennyiséget is hozzászámoljuk."
          },
          {
            "expression": "(4; 14)",
            "why": "Az idő–vízmennyiség grafikonon ez a 4 perchez tartozó pont."
          }
        ],
        "check": "A 0, 1, 2, 3 és 4 perchez 2, 5, 8, 11 és 14 liter tartozik. Minden perclépés 3 litert ad hozzá."
      }
    ],
    "practice": [
      {
        "id": "grafikon-practice-1",
        "topic": "grafikon",
        "kind": "compute",
        "difficulty": 1,
        "prompt": "Egy kitalált út díja 800 Ft alapdíj és kilométerenként 250 Ft. Mennyi a 4 km-es út teljes díja?",
        "answer": {
          "kind": "number",
          "expected": "1800",
          "unit": "Ft"
        },
        "hints": [
          "Először az úthossztól függő részt számold ki.",
          "Az alapdíjat egyszer kell hozzáadni."
        ],
        "solution": [
          {
            "expression": "250 · 4 = 1 000 Ft",
            "why": "Négy kilométer kilométerdíja."
          },
          {
            "expression": "800 + 1 000 = 1 800 Ft",
            "why": "Hozzáadjuk a minden útra egyszer fizetendő alapdíjat."
          }
        ],
        "takeaway": "A teljes díjban a kezdőérték és a változó rész is szerepel.",
        "mistakes": [
          {
            "input": "1000",
            "feedback": "Ez csak a kilométerdíj. Az egyszeri alapdíj még hiányzik."
          },
          {
            "input": "4200",
            "feedback": "Az alapdíjat nem kilométerenként fizetjük. Csak a 250 Ft-ot szorozzuk néggyel."
          }
        ]
      },
      {
        "id": "grafikon-practice-2",
        "topic": "grafikon",
        "kind": "reason",
        "difficulty": 1,
        "prompt": "Egy grafikon vízszintes tengelye az út kilométerben, függőleges tengelye a teljes díj forintban. Mit jelent a (3; 1 550) pont?",
        "answer": {
          "kind": "choice",
          "correct": "pair",
          "options": [
            {
              "id": "pair",
              "text": "A 3 km-es úthoz 1 550 Ft teljes díj tartozik."
            },
            {
              "id": "swapped",
              "text": "Az 1 550 km-es úthoz 3 Ft teljes díj tartozik."
            },
            {
              "id": "difference",
              "text": "Minden új kilométer 1 550 Ft-ba kerül."
            }
          ]
        },
        "hints": [
          "A koordinátapár első tagja a vízszintes tengelyhez tartozik.",
          "A második tag a pont teljes függőleges értéke, nem automatikusan egy változás."
        ],
        "solution": [
          {
            "expression": "x = 3 km",
            "why": "Az első koordinátát az úttengelyen értelmezzük."
          },
          {
            "expression": "y = 1 550 Ft",
            "why": "A második koordináta ehhez az úthoz tartozó teljes díj."
          }
        ],
        "takeaway": "Egy pont összetartozó mennyiségpárt mutat; a jelentéshez a tengelyek neve is kell.",
        "mistakes": [
          {
            "input": "swapped",
            "feedback": "A két koordináta sorrendje rögzített: vízszintes, majd függőleges."
          },
          {
            "input": "difference",
            "feedback": "Egyetlen pont teljes díjat ad meg. A kilométerenkénti változáshoz több információ kell."
          }
        ]
      },
      {
        "id": "grafikon-practice-3",
        "topic": "grafikon",
        "kind": "compute",
        "difficulty": 2,
        "prompt": "A díj 600 Ft alapdíj és kilométerenként 400 Ft. Hány forinttal kerül többe az 5 km-es út a 3 km-esnél?",
        "answer": {
          "kind": "number",
          "expected": "800",
          "unit": "Ft"
        },
        "hints": [
          "A két út alapdíja ugyanakkora.",
          "Csak a két további kilométer okoz különbséget."
        ],
        "solution": [
          {
            "expression": "5 − 3 = 2 km",
            "why": "Ennyivel hosszabb az egyik út."
          },
          {
            "expression": "2 · 400 = 800 Ft",
            "why": "Minden további kilométer ugyanannyi többletdíjat jelent."
          },
          {
            "expression": "2 600 − 1 800 = 800 Ft",
            "why": "A két teljes díj különbségével is ellenőrizhetjük."
          }
        ],
        "takeaway": "Az állandó alapdíj a különbségből kiesik.",
        "mistakes": [
          {
            "input": "2600",
            "feedback": "Ez az 5 km-es út teljes díja. A kérdés a két díj különbsége."
          },
          {
            "input": "1400",
            "feedback": "A közös alapdíj nem új többlet a hosszabb út miatt."
          }
        ]
      },
      {
        "id": "grafikon-practice-4",
        "topic": "grafikon",
        "kind": "compute",
        "difficulty": 2,
        "prompt": "Egy díjmodellben a teljes ár 1 200 Ft + kilométerenként 300 Ft. A teljes díj 3 000 Ft lett. Hány kilométeres az út?",
        "answer": {
          "kind": "number",
          "expected": "6",
          "unit": "km"
        },
        "hints": [
          "Először vedd le a teljes díjból az alapdíjat.",
          "A maradék összeg hány 300 Ft-os kilométert jelent?"
        ],
        "solution": [
          {
            "expression": "3 000 − 1 200 = 1 800 Ft",
            "why": "Ennyi jutott az úthossztól függő részre."
          },
          {
            "expression": "1 800 : 300 = 6 km",
            "why": "A maradék díjat az egy kilométerre jutó összeggel osztjuk."
          },
          {
            "expression": "1 200 + 300 · 6 = 3 000 Ft",
            "why": "A visszaszámolás ellenőrzi az úthosszt."
          }
        ],
        "takeaway": "Egy kapcsolatot visszafelé is olvashatsz: a díjból megkereshető az út.",
        "mistakes": [
          {
            "input": "10",
            "feedback": "A 3 000 Ft nem teljes egészében kilométerdíj: alapdíjat is tartalmaz."
          },
          {
            "input": "1800",
            "feedback": "Ez a megmaradt forintösszeg, nem az út hossza."
          }
        ]
      },
      {
        "id": "grafikon-practice-5",
        "topic": "grafikon",
        "kind": "reason",
        "difficulty": 2,
        "prompt": "Melyik díjszabásban egyenesen arányos a teljes díj a megtett úttal?",
        "answer": {
          "kind": "choice",
          "correct": "noentry",
          "options": [
            {
              "id": "noentry",
              "text": "Nincs alapdíj; minden kilométer 400 Ft."
            },
            {
              "id": "entry",
              "text": "1 000 Ft alapdíj és kilométerenként 400 Ft."
            },
            {
              "id": "flat",
              "text": "Minden útra ugyanannyi, 1 000 Ft a díj."
            }
          ]
        },
        "hints": [
          "Egyenes arányosságnál a kétszeres úthoz kétszeres díj tartozik.",
          "Gondold végig az 1 km-es és 2 km-es utat mindhárom szabállyal."
        ],
        "solution": [
          {
            "expression": "Alapdíj nélkül: 1 km → 400 Ft, 2 km → 800 Ft",
            "why": "A díj az úttal együtt kétszereződik."
          },
          {
            "expression": "A szabály: díj = 400 · út",
            "why": "A teljes díj minden pozitív úthossznál ugyanannyi forintot jelent kilométerenként."
          },
          {
            "expression": "0 km → 0 Ft",
            "why": "A grafikon az origóból indul."
          }
        ],
        "takeaway": "Az állandó fajlagos érték és a nulla kezdőérték együtt jellemzi ezt az egyenes arányosságot.",
        "mistakes": [
          {
            "input": "entry",
            "feedback": "Az alapdíj miatt 1 km-re 1 400 Ft, 2 km-re 1 800 Ft jut. Ez nem kétszereződés."
          },
          {
            "input": "flat",
            "feedback": "Az állandó 1 000 Ft nem változik kétszeresére, ha az út kétszeres lesz."
          }
        ]
      },
      {
        "id": "grafikon-practice-6",
        "topic": "grafikon",
        "kind": "compute",
        "difficulty": 1,
        "prompt": "Egy díjgrafikon függőleges tengelyén a beosztások 0, 200, 400, 600, … Ft-ot jelentenek. Egy pont a 0 fölötti harmadik beosztás magasságában van. Mennyi a díj?",
        "answer": {
          "kind": "number",
          "expected": "600",
          "unit": "Ft"
        },
        "hints": [
          "Egy beosztás most nem 1 Ft, hanem 200 Ft.",
          "A nullától három egyforma lépést számolunk."
        ],
        "solution": [
          {
            "expression": "3 · 200 Ft = 600 Ft",
            "why": "Három, egyenként 200 Ft-os tengelylépést teszünk."
          },
          {
            "expression": "A pont függőleges koordinátája 600",
            "why": "A beosztás és a forint egység együtt adja meg az értelmet."
          }
        ],
        "takeaway": "A rácsnégyzetek száma és a leolvasott érték csak a skála ismeretében kapcsolható össze.",
        "mistakes": [
          {
            "input": "3",
            "feedback": "A három a beosztások száma. Minden beosztás 200 Ft-ot jelent."
          },
          {
            "input": "400",
            "feedback": "A 0 a kiindulópont; felette az első beosztás 200, a második 400, a harmadik 600."
          }
        ]
      },
      {
        "id": "grafikon-practice-7",
        "topic": "grafikon",
        "kind": "transfer",
        "difficulty": 2,
        "prompt": "Egy tartályban 0 perc után 2 liter, 1 perc után 5 liter, 2 perc után 8 liter víz van. Percenként állandóan 3 liter folyik bele, semmi nem folyik ki. Mennyi lesz 5 perc után? A tartály elég nagy.",
        "answer": {
          "kind": "number",
          "expected": "17",
          "unit": "l"
        },
        "hints": [
          "A feladat megadja a folytatás szabályát is: minden perc +3 liter.",
          "Ne felejtsd el a kezdeti 2 litert."
        ],
        "solution": [
          {
            "expression": "5 · 3 = 15 l",
            "why": "Öt perc alatt tizenöt liter érkezik."
          },
          {
            "expression": "2 + 15 = 17 l",
            "why": "Ehhez hozzátartozik a kezdeti két liter."
          },
          {
            "expression": "2, 5, 8, 11, 14, 17",
            "why": "A percenkénti értékekkel is végigkövethetjük."
          }
        ],
        "takeaway": "A szabály a kezdőértéket és a változást is tartalmazza.",
        "mistakes": [
          {
            "input": "15",
            "feedback": "Ennyi víz érkezett újonnan. A kezdeti két liter még benne van."
          },
          {
            "input": "25",
            "feedback": "A kezdeti két liter egyszer szerepel; nem minden percben adódik hozzá újra."
          }
        ]
      },
      {
        "id": "grafikon-practice-8",
        "topic": "grafikon",
        "kind": "reason",
        "difficulty": 2,
        "prompt": "Két teljes díjat ábrázoló grafikon is egyenletesen növekvő egyenes. Az A átmegy a (0; 0), a B a (0; 500) ponton. Melyik írhat le egyenes arányosságot az úttal?",
        "answer": {
          "kind": "choice",
          "correct": "onlya",
          "options": [
            {
              "id": "both",
              "text": "Mindkettő, mert mindkettő egyenes."
            },
            {
              "id": "onlya",
              "text": "Az A; a B-nél a pozitív kezdődíj miatt nem egyenesen arányos a teljes díj az úttal."
            },
            {
              "id": "onlyb",
              "text": "A B, mert a kezdődíja nem nulla."
            }
          ]
        },
        "hints": [
          "Mihez kell tartoznia 0 útnak egyenes arányosságnál?",
          "Egy állandó pozitív alapdíj az úttal együtt kétszereződik-e?"
        ],
        "solution": [
          {
            "expression": "A: 0 úthoz 0 díj tartozik",
            "why": "Ez összeegyeztethető az egyenes arányosságot ábrázoló egyenessel."
          },
          {
            "expression": "B: 0 úthoz 500 díjegység tartozik",
            "why": "A teljes díjhoz egy állandó pozitív rész is hozzáadódik."
          },
          {
            "expression": "Csak az A felel meg",
            "why": "Az egyenes alak önmagában még nem elég."
          }
        ],
        "takeaway": "A grafikon kezdőértékét ugyanúgy vizsgáld, mint az alakját.",
        "mistakes": [
          {
            "input": "both",
            "feedback": "Az egyenes arányosság egyenese az origón is áthalad. Ellenőrizd a két kezdőértéket."
          },
          {
            "input": "onlyb",
            "feedback": "Az 500-as kezdőérték éppen az egyenes arányosságot akadályozó alapdíj."
          }
        ]
      }
    ],
    "exit": [
      {
        "id": "grafikon-exit-1",
        "topic": "grafikon",
        "kind": "compute",
        "difficulty": 2,
        "prompt": "Egy új modellben 900 Ft az alapdíj és 150 Ft a kilométerdíj. Hány forint a 6 km-hez tartozó függőleges koordináta az út–díj grafikonon?",
        "answer": {
          "kind": "number",
          "expected": "1800",
          "unit": "Ft"
        },
        "hints": [
          "A függőleges koordináta a teljes díjat adja.",
          "Számold ki a változó részt, majd add hozzá az alapdíjat."
        ],
        "solution": [
          {
            "expression": "150 · 6 = 900 Ft",
            "why": "Ez a hat kilométer díja."
          },
          {
            "expression": "900 + 900 = 1 800 Ft",
            "why": "Az alapdíjjal együtt ez a teljes összeg."
          },
          {
            "expression": "(6; 1 800)",
            "why": "Ez a keresett összetartozó értékpár."
          }
        ],
        "takeaway": "A pont második koordinátája a teljes modellből számolt érték.",
        "mistakes": [
          {
            "input": "900",
            "feedback": "Ez csak a kilométerekhez tartozó rész; az alapdíj is 900 Ft."
          },
          {
            "input": "6",
            "feedback": "Ez a vízszintes koordináta. A kérdés a díjat kéri."
          }
        ]
      },
      {
        "id": "grafikon-exit-2",
        "topic": "grafikon",
        "kind": "reason",
        "difficulty": 2,
        "prompt": "Egy kapcsolatban x = 1-hez y = 4, x = 2-höz y = 7, x = 3-hoz y = 10 tartozik. Lehet-e ez egyenes arányosság?",
        "answer": {
          "kind": "choice",
          "correct": "notdouble",
          "options": [
            {
              "id": "increase",
              "text": "Igen, mert y mindig 3-mal nő."
            },
            {
              "id": "notdouble",
              "text": "Nem: x kétszerezésekor 4 helyett 8-nak kellene lennie, de 7 szerepel."
            },
            {
              "id": "positive",
              "text": "Igen, mert minden megadott szám pozitív."
            }
          ]
        },
        "hints": [
          "Hasonlítsd össze az első két értékpárt.",
          "Egyenes arányosságnál mit kell tennie y-nak, ha x kétszeres lesz?"
        ],
        "solution": [
          {
            "expression": "1 → 2: az x kétszeresére nő",
            "why": "Az első két x között kétszerezés történik."
          },
          {
            "expression": "4 · 2 = 8, de a megadott y = 7",
            "why": "A hozzá tartozó y nem kétszereződik."
          },
          {
            "expression": "Ez nem egyenes arányosság",
            "why": "Az állandó növekmény önmagában másfajta kapcsolatot is leírhat."
          }
        ],
        "takeaway": "A kapcsolat megítéléséhez a megfelelő tulajdonságot vizsgáld: az arányosságnál a szorzódás számít.",
        "mistakes": [
          {
            "input": "increase",
            "feedback": "Az állandó különbség nem azonos az állandó aránnyal."
          },
          {
            "input": "positive",
            "feedback": "A pozitív értékek nem döntik el az arányosságot. Vizsgáld a kétszerezést."
          }
        ]
      }
    ],
    "recap": [
      "Minden grafikonhoz mennyiség, egység és skála tartozik.",
      "Egy pont egy összetartozó értékpárt mond el.",
      "A kezdőérték és az egyenletes változás külön szerepet tölt be.",
      "Egy egyenes grafikon csak megfelelő feltételekkel egyenes arányosság."
    ],
    "glossary": [
      {
        "term": "Koordinátapár",
        "definition": "A pont két, sorrendben megadott helyadata: először a vízszintes, utána a függőleges érték."
      },
      {
        "term": "Skála",
        "definition": "Megmutatja, milyen értékkülönbséget jelent egy tengelybeosztás."
      },
      {
        "term": "Kezdőérték",
        "definition": "Az a függőleges érték, amely a vízszintes mennyiség nullájához tartozik."
      },
      {
        "term": "Egyenes arányosság",
        "definition": "Az egyik mennyiség valahányszoros változásához a másik ugyanannyiszoros változása tartozik."
      }
    ],
    "nextTopic": "pitagorasz"
  },
  {
    "id": "pitagorasz",
    "moduleId": "M18",
    "title": "Pitagorasz: három oldal, három négyzet",
    "shortTitle": "Pitagorasz",
    "question": "Miért az oldalak négyzete kapcsolódik össze?",
    "teaser": "Változtasd a befogókat, és figyeld az oldalakra épített négyzetek területét.",
    "description": "A derékszögű háromszög oldalaihoz négyzeteket rendelünk. Előbb a területek kapcsolatát értjük meg, utána keresünk hiányzó átfogót vagy befogót.",
    "goals": [
      "Biztosan kiválasztod a derékszöggel szemközti átfogót.",
      "A négyzetterületek kapcsolatát összekötöd a képlettel.",
      "A feltételeket, a megfelelő műveletet és a hosszúságegységet is ellenőrzöd."
    ],
    "prerequisites": [
      "Derékszög és háromszög oldalai.",
      "Négyzet területe, négyzetszámok és négyzetgyök szemlélete."
    ],
    "estimateMinutes": 30,
    "color": "#d8c3f1",
    "layer": "TÖRZS",
    "prediction": {
      "id": "pitagorasz-prediction",
      "topic": "pitagorasz",
      "kind": "reason",
      "difficulty": 1,
      "prompt": "Egy derékszögű háromszög két befogója 6 cm és 8 cm. Mekkora lehet az átfogó?",
      "answer": {
        "kind": "choice",
        "correct": "ten",
        "options": [
          {
            "id": "fourteen",
            "text": "14 cm"
          },
          {
            "id": "ten",
            "text": "10 cm"
          },
          {
            "id": "hundred",
            "text": "100 cm"
          }
        ]
      },
      "hints": [
        "A kapcsolat a négyzetterületek között áll fenn.",
        "A 6 és a 8 négyzete együtt 100. Mekkora oldalú négyzet területe 100 cm²?"
      ],
      "solution": [
        {
          "expression": "6² + 8² = 36 + 64 = 100 cm²",
          "why": "A befogókra épített négyzetek területét adjuk össze."
        },
        {
          "expression": "c² = 100 cm², ezért c = 10 cm",
          "why": "A keresett négyzet pozitív oldalhossza tíz centiméter."
        }
      ],
      "takeaway": "A négyzetek területének összege után még vissza kell keresni az oldalhosszt.",
      "mistakes": [
        {
          "input": "fourteen",
          "feedback": "A tétel nem az oldalhosszak összegéről szól. Először a négyzeteiket kapcsold össze."
        },
        {
          "input": "hundred",
          "feedback": "A 100 a négyzet területe cm²-ben. A kérdés annak oldalhosszát kéri cm-ben."
        }
      ]
    },
    "explanation": [
      {
        "heading": "Először keresd meg a derékszöget",
        "body": "A Pitagorasz-tételt ebben a formában derékszögű háromszögre használjuk. A derékszöget közrefogó két oldal a befogó. A vele szemben fekvő oldal az átfogó. A rajz elforgatása ezen nem változtat.",
        "formula": "a és b: befogók; c: átfogó"
      },
      {
        "heading": "A négyzeteket a saját oldalukra építjük",
        "body": "Egy 6 cm-es oldalhoz 36 cm² területű négyzet tartozik. Egy 8 cm-eshez 64 cm²-es. A tétel szerint a befogók négyzeteinek együttes területe pontosan az átfogó négyzetének területe.",
        "formula": "a² + b² = c²"
      },
      {
        "heading": "A területmegmaradás adja az indokot",
        "body": "Képzelj el két egyforma, a + b oldalú nagy négyzetet, bennük ugyanazzal a négy derékszögű háromszöggel, más elrendezésben. Az egyik elrendezésben c², a másikban a² és b² együtt marad szabadon. Ugyanakkora keretből ugyanazokat a háromszögeket vettük el, ezért a maradék területük egyenlő. A mozgatható ábra a kapcsolat szemléltetését segíti; az indok a terület megőrzése."
      },
      {
        "heading": "A keresett oldal dönti el a műveletet",
        "body": "Ha az átfogó hiányzik, a két befogó négyzetét összeadjuk. Ha egy befogó hiányzik, az átfogó négyzetéből levonjuk a másik befogó négyzetét. A kapott szám még terület: ebből pozitív oldalhosszt keresünk.",
        "formula": "c = √(a² + b²); b = √(c² − a²)"
      },
      {
        "heading": "Az eredménynek a háromszöghöz is illenie kell",
        "body": "Az átfogó a derékszögű háromszög leghosszabb oldala. Egy befogó ezért rövidebb nála. Ha hosszt kér a feladat, cm, m vagy más hosszúságegység jár a válaszhoz, nem cm². A tételt csak azonos egységben megadott hosszakkal használd."
      }
    ],
    "examples": [
      {
        "title": "Az átfogó keresése",
        "prompt": "A derékszögű háromszög befogói 6 cm és 8 cm. Mekkora az átfogó?",
        "steps": [
          {
            "expression": "c² = 6² + 8²",
            "why": "A keresett c a derékszöggel szemben fekvő oldal."
          },
          {
            "expression": "c² = 36 + 64 = 100",
            "why": "A négyzetterületeket adjuk össze."
          },
          {
            "expression": "c = 10 cm",
            "why": "A 100 cm²-es négyzet pozitív oldalhossza 10 cm."
          }
        ],
        "check": "10 cm mindkét befogónál hosszabb; 10² = 6² + 8²."
      },
      {
        "title": "Most egy befogó hiányzik",
        "prompt": "Az átfogó 13 cm, az egyik befogó 5 cm. Mekkora a másik befogó?",
        "steps": [
          {
            "expression": "5² + b² = 13²",
            "why": "Az átfogó négyzete a két befogó négyzetének összege."
          },
          {
            "expression": "b² = 169 − 25 = 144",
            "why": "Az ismert befogó négyzetét levonjuk a teljes összegből."
          },
          {
            "expression": "b = 12 cm",
            "why": "Pozitív hosszúságot keresünk."
          }
        ],
        "check": "5² + 12² = 25 + 144 = 169 = 13²; a 12 cm-es befogó rövidebb a 13 cm-es átfogónál."
      }
    ],
    "practice": [
      {
        "id": "pitagorasz-practice-1",
        "topic": "pitagorasz",
        "kind": "compute",
        "difficulty": 1,
        "prompt": "Egy derékszögű háromszög két befogója 3 cm és 4 cm. Mekkora az átfogó?",
        "answer": {
          "kind": "number",
          "expected": "5",
          "unit": "cm"
        },
        "hints": [
          "Most az átfogó hiányzik, ezért a befogók négyzeteit adjuk össze.",
          "Melyik pozitív szám négyzete 9 + 16?"
        ],
        "solution": [
          {
            "expression": "c² = 3² + 4² = 9 + 16 = 25",
            "why": "A tétel a négyzetek területét kapcsolja össze."
          },
          {
            "expression": "c = 5 cm",
            "why": "A 25 cm²-es négyzet oldalhossza öt centiméter."
          }
        ],
        "takeaway": "Az átfogó hossza a négyzetösszeg pozitív négyzetgyöke.",
        "mistakes": [
          {
            "input": "7",
            "feedback": "A 3 + 4 az oldalak összege. A tétel a négyzeteik összegét használja."
          },
          {
            "input": "25",
            "feedback": "A 25 az átfogó négyzete. A hosszúsághoz még négyzetgyököt keresünk."
          }
        ]
      },
      {
        "id": "pitagorasz-practice-2",
        "topic": "pitagorasz",
        "kind": "compute",
        "difficulty": 2,
        "prompt": "Egy derékszögű háromszög átfogója 10 cm, az egyik befogója 6 cm. Mekkora a másik befogó?",
        "answer": {
          "kind": "number",
          "expected": "8",
          "unit": "cm"
        },
        "hints": [
          "A 10 cm-es átfogó négyzete a két befogó négyzetének összege.",
          "Az ismeretlen részt az összegből kivonással keresd."
        ],
        "solution": [
          {
            "expression": "6² + b² = 10²",
            "why": "Először a megfelelő oldalakat helyettesítjük."
          },
          {
            "expression": "b² = 100 − 36 = 64",
            "why": "Az ismert négyzet területét kivonjuk."
          },
          {
            "expression": "b = 8 cm",
            "why": "A pozitív négyzetgyök adja a befogó hosszát."
          }
        ],
        "takeaway": "Hiányzó befogónál az átfogó négyzetéből vonunk ki.",
        "mistakes": [
          {
            "input": "4",
            "feedback": "A hosszúságokat nem lehet közvetlenül kivonni. A kapcsolat a négyzeteikre vonatkozik."
          },
          {
            "input": "64",
            "feedback": "A 64 cm² a keresett befogóra épített négyzet területe, nem a befogó hossza."
          }
        ]
      },
      {
        "id": "pitagorasz-practice-3",
        "topic": "pitagorasz",
        "kind": "reason",
        "difficulty": 1,
        "prompt": "Elforgatunk egy derékszögű háromszöget a képernyőn. Miből ismered fel továbbra is az átfogót?",
        "answer": {
          "kind": "choice",
          "correct": "opposite",
          "options": [
            {
              "id": "bottom",
              "text": "Mindig az az oldal, amelyik alul van."
            },
            {
              "id": "opposite",
              "text": "A derékszöggel szemközti oldal az átfogó."
            },
            {
              "id": "slanted",
              "text": "Mindig az az oldal, amelyik ferdének látszik."
            }
          ]
        },
        "hints": [
          "A rajz iránya változhat, a derékszög helye az alakzaton belül nem.",
          "Melyik oldal nem vesz részt a derékszög két szárának kialakításában?"
        ],
        "solution": [
          {
            "expression": "A derékszöget a két befogó fogja közre",
            "why": "Ezek a 90°-os szög két oldalán találhatók."
          },
          {
            "expression": "A szemben lévő harmadik oldal az átfogó",
            "why": "Ez a kapcsolat elforgatás után is ugyanaz."
          }
        ],
        "takeaway": "Geometriai szerepet kapcsolatokból ismerünk fel, nem a rajz megszokott tájolásából.",
        "mistakes": [
          {
            "input": "bottom",
            "feedback": "Az alakzat elforgatható úgy, hogy egy másik oldala kerüljön alulra."
          },
          {
            "input": "slanted",
            "feedback": "A képernyőhöz képest ferde helyzet nem matematikai tulajdonság. Keresd a derékszöget."
          }
        ]
      },
      {
        "id": "pitagorasz-practice-4",
        "topic": "pitagorasz",
        "kind": "transfer",
        "difficulty": 2,
        "prompt": "Egy téglalap két oldala 5 cm és 12 cm. Mekkora az átlója?",
        "answer": {
          "kind": "number",
          "expected": "13",
          "unit": "cm"
        },
        "hints": [
          "Az átló a téglalapot két derékszögű háromszögre bontja.",
          "Egy ilyen háromszög két befogója a téglalap két szomszédos oldala."
        ],
        "solution": [
          {
            "expression": "d² = 5² + 12²",
            "why": "Az átló a derékszögű háromszög átfogója."
          },
          {
            "expression": "d² = 25 + 144 = 169",
            "why": "Összeadjuk a befogók négyzetét."
          },
          {
            "expression": "d = 13 cm",
            "why": "A négyzetgyök adja az átló hosszát."
          }
        ],
        "takeaway": "Összetettebb ábrában először keresd meg a megfelelő derékszögű háromszöget.",
        "mistakes": [
          {
            "input": "17",
            "feedback": "Ez a két szomszédos oldal együttes hossza. Az átló más útvonal."
          },
          {
            "input": "169",
            "feedback": "A 169 az átló négyzete. A hosszúságot kérjük."
          }
        ]
      },
      {
        "id": "pitagorasz-practice-5",
        "topic": "pitagorasz",
        "kind": "compute",
        "difficulty": 2,
        "prompt": "Egy derékszögű háromszög átfogója 17 cm, egyik befogója 8 cm. Mekkora a másik befogó?",
        "answer": {
          "kind": "number",
          "expected": "15",
          "unit": "cm"
        },
        "hints": [
          "Írd fel úgy a tételt, hogy a 17 legyen az átfogó helyén.",
          "A 17²-ből vonj le 8²-et, majd keress pozitív négyzetgyököt."
        ],
        "solution": [
          {
            "expression": "8² + b² = 17²",
            "why": "A 17 cm-es oldal az átfogó."
          },
          {
            "expression": "b² = 289 − 64 = 225",
            "why": "Az ismert befogó négyzetét kivonjuk."
          },
          {
            "expression": "b = 15 cm",
            "why": "A 225 pozitív négyzetgyöke 15."
          }
        ],
        "takeaway": "A műveletet a keresett oldal szerepe dönti el, nem az adatok sorrendje.",
        "mistakes": [
          {
            "input": "9",
            "feedback": "A 17 − 8 közvetlen hosszkülönbség. Itt négyzetterületek kapcsolódnak össze."
          },
          {
            "input": "225",
            "feedback": "A négyzet területét már megtaláltad; most az oldalhosszt keresd."
          }
        ]
      },
      {
        "id": "pitagorasz-practice-6",
        "topic": "pitagorasz",
        "kind": "reason",
        "difficulty": 2,
        "prompt": "Egy háromszög oldalai 6 cm, 8 cm és 9 cm. Melyik állítás helyes?",
        "answer": {
          "kind": "choice",
          "correct": "notright",
          "options": [
            {
              "id": "any",
              "text": "Derékszögű, mert minden háromszögre igaz a Pitagorasz-tétel."
            },
            {
              "id": "notright",
              "text": "Nem lehet derékszögű: a leghosszabb oldal négyzete nem egyenlő a másik kettő négyzetösszegével."
            },
            {
              "id": "sum",
              "text": "Derékszögű, mert 6 + 8 nagyobb 9-nél."
            }
          ]
        },
        "hints": [
          "Derékszög esetén melyik oldalnak kellene az átfogónak lennie?",
          "Hasonlítsd össze a 6² + 8² és a 9² értékét."
        ],
        "solution": [
          {
            "expression": "Ha derékszögű lenne, a 9 cm-es oldal lenne az átfogó",
            "why": "A derékszögű háromszög átfogója a leghosszabb oldal."
          },
          {
            "expression": "6² + 8² = 100; 9² = 81",
            "why": "A szükséges egyenlőség nem teljesül."
          },
          {
            "expression": "Ezért nem derékszögű",
            "why": "Egy derékszögű háromszögnek teljesítenie kellene a tételt."
          }
        ],
        "takeaway": "A tétel feltételét és következményét is ellenőrizd.",
        "mistakes": [
          {
            "input": "any",
            "feedback": "A tétel ebben a formában derékszögű háromszögre igaz, nem tetszőleges háromszögre."
          },
          {
            "input": "sum",
            "feedback": "A háromszög-egyenlőtlenség a szerkeszthetőséget segít ellenőrizni; önmagában nem ad derékszöget."
          }
        ]
      },
      {
        "id": "pitagorasz-practice-7",
        "topic": "pitagorasz",
        "kind": "transfer",
        "difficulty": 2,
        "prompt": "Egy 10 méter hosszú, egyenes létra a talajra merőleges falhoz támaszkodik. Az alja 6 méterre van a faltól. Milyen magasan ér a falhoz?",
        "answer": {
          "kind": "number",
          "expected": "8",
          "unit": "m"
        },
        "hints": [
          "Rajzolj egy derékszögű háromszöget a fal, a talaj és a létra mentén.",
          "A létra az átfogó; a magasság az egyik befogó."
        ],
        "solution": [
          {
            "expression": "h² + 6² = 10²",
            "why": "A derékszög a fal és a talaj között van."
          },
          {
            "expression": "h² = 100 − 36 = 64",
            "why": "A magasság négyzetét kivonással keressük."
          },
          {
            "expression": "h = 8 m",
            "why": "A pozitív magasság nyolc méter."
          }
        ],
        "takeaway": "A történetből rajzolt modellben azonosítsd az átfogót, mielőtt számolsz.",
        "mistakes": [
          {
            "input": "4",
            "feedback": "A létra hossza nem a talajtávolság és a függőleges magasság összege."
          },
          {
            "input": "64",
            "feedback": "Ez a magasság négyzete. A kérdés magasságot kér méterben."
          }
        ]
      },
      {
        "id": "pitagorasz-practice-8",
        "topic": "pitagorasz",
        "kind": "compute",
        "difficulty": 2,
        "prompt": "Egy derékszögű háromszög befogói 9 cm és 12 cm. Mekkora az átfogóra épített négyzet területe?",
        "answer": {
          "kind": "number",
          "expected": "225",
          "unit": "cm²"
        },
        "hints": [
          "Figyeld meg: most területet kérünk, nem oldalhosszt.",
          "A keresett terület közvetlenül a két befogóra épített négyzet területének összege."
        ],
        "solution": [
          {
            "expression": "9² = 81 cm²; 12² = 144 cm²",
            "why": "Meghatározzuk a két ismert négyzet területét."
          },
          {
            "expression": "81 + 144 = 225 cm²",
            "why": "A Pitagorasz-tétel szerint ez az átfogóra épített négyzet területe."
          }
        ],
        "takeaway": "A feladat kérdésétől függ, kell-e a végén négyzetgyököt vonni.",
        "mistakes": [
          {
            "input": "15",
            "feedback": "A 15 cm az átfogó hossza. Most az arra épített négyzet területét kérjük."
          },
          {
            "input": "21",
            "feedback": "A 9 + 12 hosszúságösszeg. A négyzetterületeket kell összeadni."
          }
        ]
      }
    ],
    "exit": [
      {
        "id": "pitagorasz-exit-1",
        "topic": "pitagorasz",
        "kind": "compute",
        "difficulty": 2,
        "prompt": "Egy derékszögű háromszög átfogója 15 cm, az egyik befogója 9 cm. Mekkora a másik befogó?",
        "answer": {
          "kind": "number",
          "expected": "12",
          "unit": "cm"
        },
        "hints": [
          "A hiányzó befogó négyzetét az átfogó négyzetéből kapod.",
          "A 225-ből vond le a 81-et, majd keresd a pozitív gyököt."
        ],
        "solution": [
          {
            "expression": "b² = 15² − 9² = 225 − 81 = 144",
            "why": "A befogó négyzetét az összegből visszakeressük."
          },
          {
            "expression": "b = 12 cm",
            "why": "Pozitív oldalhosszt keresünk."
          },
          {
            "expression": "9² + 12² = 15²",
            "why": "Visszahelyettesítve a tétel egyenlősége teljesül."
          }
        ],
        "takeaway": "Ismeretlen befogónál a kivonás és a pozitív négyzetgyök adja a hosszt.",
        "mistakes": [
          {
            "input": "6",
            "feedback": "Az oldalhosszak közvetlen kivonása nem a tétel művelete."
          },
          {
            "input": "144",
            "feedback": "A 144 cm² a négyzet területe; a keresett oldal 12 cm."
          }
        ]
      },
      {
        "id": "pitagorasz-exit-2",
        "topic": "pitagorasz",
        "kind": "reason",
        "difficulty": 2,
        "prompt": "Egy háromszögről csak annyit tudunk, hogy két oldala 3 cm és 4 cm. Nem ismerünk szöget. Biztosan 5 cm a harmadik oldala?",
        "answer": {
          "kind": "choice",
          "correct": "missing",
          "options": [
            {
              "id": "yes",
              "text": "Igen, mert 3² + 4² = 5²."
            },
            {
              "id": "missing",
              "text": "Nem. Ehhez tudnunk kellene, hogy a 3 cm-es és 4 cm-es oldal derékszöget zár be."
            },
            {
              "id": "seven",
              "text": "Nem, mert biztosan 7 cm."
            }
          ]
        },
        "hints": [
          "Mi a Pitagorasz-tétel használatának feltétele?",
          "A két adott oldalról tudjuk-e, hogy befogók?"
        ],
        "solution": [
          {
            "expression": "A derékszög nincs megadva",
            "why": "A két ismert hossz önmagában nem jelöli ki a tételhez szükséges háromszöget."
          },
          {
            "expression": "Ha a 3 és 4 cm befogó lenne, az átfogó 5 cm lenne",
            "why": "Ez feltételes következtetés, nem a megadott adatokból következő biztos válasz."
          }
        ],
        "takeaway": "Egy helyes számolási szabályt csak a feltételeinek megfelelő helyzetben használj.",
        "mistakes": [
          {
            "input": "yes",
            "feedback": "Az egyenlőség helyes, de a feladat nem mondta, hogy a két megadott oldal befogó."
          },
          {
            "input": "seven",
            "feedback": "A két oldal összege nem a harmadik oldal hossza; háromszögnél a harmadik ennél kisebb."
          }
        ]
      }
    ],
    "recap": [
      "A tételhez derékszögű háromszög kell.",
      "Az átfogó mindig a derékszöggel szemben van, és a leghosszabb oldal.",
      "Az oldalak négyzetei területeket jelentenek.",
      "A kérdés alapján különítsd el a keresett területet és a pozitív oldalhosszt."
    ],
    "glossary": [
      {
        "term": "Befogó",
        "definition": "A derékszöget közrefogó két oldal valamelyike."
      },
      {
        "term": "Átfogó",
        "definition": "A derékszöggel szemközti, leghosszabb oldal a derékszögű háromszögben."
      },
      {
        "term": "Pitagorasz-tétel",
        "definition": "Derékszögű háromszögben a befogók négyzetösszege az átfogó négyzete."
      },
      {
        "term": "Négyzetgyök",
        "definition": "Egy nemnegatív számnak az a nemnegatív érték a négyzetgyöke, amelynek négyzete az eredeti szám."
      }
    ],
    "nextTopic": "valoszinuseg"
  },
  {
    "id": "valoszinuseg",
    "moduleId": "M22",
    "title": "Valószínűség: számold meg a valódi lehetőségeket",
    "shortTitle": "Valószínűség",
    "question": "Miért gyakoribb a 7-es összeg, mint a 2-es?",
    "teaser": "Jelöld ki a dobáspárokat, majd hasonlítsd össze az esélyt egy kísérletsor eredményével.",
    "description": "Két megkülönböztethető, független, szabályos hatoldalú kockával dolgozunk. Külön kezeljük az elméleti esélyt és a ténylegesen megfigyelt gyakoriságot.",
    "goals": [
      "Hiány és ismétlés nélkül felsorolod az elemi dobáspárokat.",
      "A kedvező eseteket azonos esélyű kimenetelekhez viszonyítod.",
      "Megkülönbözteted a számított esélyt a kísérletben kapott aránytól."
    ],
    "prerequisites": [
      "Törtek és arányok.",
      "Rendszerezett felsorolás, sor és oszlop használata."
    ],
    "estimateMinutes": 35,
    "color": "#f5d76e",
    "layer": "TÖRZS",
    "prediction": {
      "id": "valoszinuseg-prediction",
      "topic": "valoszinuseg",
      "kind": "reason",
      "difficulty": 1,
      "context": "Modell: két megkülönböztethető, egymástól független, szabályos hatoldalú kockával dobunk. Az egymást követő dobások is függetlenek.",
      "prompt": "Melyiknek nagyobb az esélye: a két kocka összege 2, vagy az összege 7?",
      "answer": {
        "kind": "choice",
        "correct": "seven",
        "options": [
          {
            "id": "equal",
            "text": "Ugyanakkora, mert mindkettő egy lehetséges összeg."
          },
          {
            "id": "seven",
            "text": "A 7-es összegnek, mert több dobáspár adja ki."
          },
          {
            "id": "two",
            "text": "A 2-es összegnek, mert az a kisebb szám."
          }
        ]
      },
      "hints": [
        "A 2-es összeg csak melyik két szám együttállásával keletkezik?",
        "Sorolj fel több különböző párt, amelynek az összege 7."
      ],
      "solution": [
        {
          "expression": "2-es összeg: (1; 1)",
          "why": "Ehhez egyetlen elemi pár tartozik."
        },
        {
          "expression": "7-es összeg: (1; 6), (2; 5), (3; 4), (4; 3), (5; 2), (6; 1)",
          "why": "Ehhez hat különböző, egyenlő esélyű elemi pár tartozik."
        },
        {
          "expression": "6/36 > 1/36",
          "why": "Ezért a hetes összeg esélye nagyobb."
        }
      ],
      "takeaway": "Két felsorolt esemény attól még nem egyenlő esélyű, hogy mindkettőnek adtunk nevet.",
      "mistakes": [
        {
          "input": "equal",
          "feedback": "Az összegekhez eltérő számú elemi dobáspár tartozhat."
        },
        {
          "input": "two",
          "feedback": "A szám nagysága önmagában nem mondja meg az esélyét. A hozzá tartozó kimeneteleket számold."
        }
      ]
    },
    "explanation": [
      {
        "heading": "A modell feltételeit kimondjuk",
        "body": "A piros és a kék kocka is szabályos, hatoldalú: mindegyik szám 1/6 eséllyel jelenik meg. A két kocka eredménye független. A későbbi dobásokat is új, független kísérletként kezeljük. Ezek a feltételek teszik lehetővé az alábbi pontos számolást."
      },
      {
        "heading": "A kimenetel egy rendezett pár",
        "body": "A (2; 5) azt jelenti, hogy a piros kockán 2, a kéken 5 látható. Az (5; 2) másik elemi kimenetel, bár az összegük ugyanaz. Hat lehetséges piros eredményhez hat-hat kék eredmény tartozik.",
        "formula": "6 · 6 = 36 egyenlő esélyű dobáspár"
      },
      {
        "heading": "Az eseményhez több pár is tartozhat",
        "body": "Az „összeg 7” eseményhez hat pár tartozik, az „összeg 2”-höz csak egy. Az esélyhez a kedvező elemi párok számát a teljes 36-hoz viszonyítjuk. A 2-től 12-ig felsorolható összegek nem egyenlő esélyű elemi kimenetelek.",
        "formula": "esély = kedvező elemi esetek száma / összes elemi eset száma"
      },
      {
        "heading": "A kísérlet aránya eltérhet az esélytől",
        "body": "Ha 100 dobásból 18-szor lett az összeg 7, a megfigyelt relatív gyakoriság 18/100. Ez nem írja át az elméleti 1/6 esélyt. Véges kísérletsorok eltérhetnek egymástól. Több dobás sem garantálja, hogy az arány minden új lépésben közelebb kerül az elméleti értékhez.",
        "formula": "relatív gyakoriság = megfigyelt előfordulás / kísérletek száma"
      },
      {
        "heading": "A következő dobás nem emlékszik",
        "body": "A független dobások modelljében attól, hogy egy ideje nem volt 7-es összeg, a következő dobásban továbbra is 1/6 az esélye. Nincs kötelező felzárkózás. Az elméleti arány sok kísérlet értelmezéséhez ad támpontot, nem ír elő egy pontos sorrendet.",
        "formula": "a következő 7-es összeg esélye = 1/6"
      }
    ],
    "examples": [
      {
        "title": "Honnan jön az egyhatod?",
        "prompt": "Két független, szabályos hatoldalú kockával dobunk. Mennyi a 7-es összeg esélye?",
        "steps": [
          {
            "expression": "Összes eset: 6 · 6 = 36",
            "why": "A két megkülönböztethető kocka eredményeit rendezett párként írjuk."
          },
          {
            "expression": "Kedvező: (1; 6), (2; 5), (3; 4), (4; 3), (5; 2), (6; 1)",
            "why": "Mindegyik pár hetes összeget ad; összesen hat ilyen van."
          },
          {
            "expression": "6/36 = 1/6",
            "why": "A kedvező eseteket az összes egyenlő esélyű esethez viszonyítjuk."
          }
        ],
        "check": "A 6×6-os táblázat minden sorában pontosan egy kedvező mező található.",
        "alternative": [
          {
            "expression": "Bármit mutat az első kocka, a másodikon pontosan egy szám egészíti ki 7-re",
            "why": "Például 2 mellé 5 kell, 6 mellé 1."
          },
          {
            "expression": "A független második kockán ez az egy szám 1/6 esélyű",
            "why": "Így az első kocka bármely eredménye után ugyanaz az egyhatod esély adódik."
          }
        ]
      },
      {
        "title": "Az esély és a megfigyelt arány",
        "prompt": "Két független, szabályos hatoldalú kockával végzett kísérlet feljegyzésében 100 dobásból 18-szor szerepel 7-es összeg. Mennyi a relatív gyakoriság?",
        "steps": [
          {
            "expression": "18/100 = 9/50 = 0,18",
            "why": "A megfigyelt előfordulások számát a tényleges dobások számával osztjuk."
          },
          {
            "expression": "0,18 = 18%",
            "why": "Ugyanazt az arányt százalékosan is megadhatjuk."
          },
          {
            "expression": "Az elméleti esély továbbra is 1/6",
            "why": "A megfigyelt 18% a konkrét kísérletsort írja le, nem változtatja meg a modellt."
          }
        ],
        "check": "100 · 0,18 = 18 előfordulás. A kísérleti adat visszaadódik."
      }
    ],
    "practice": [
      {
        "id": "valoszinuseg-practice-1",
        "topic": "valoszinuseg",
        "kind": "compute",
        "difficulty": 1,
        "context": "Modell: két megkülönböztethető, egymástól független, szabályos hatoldalú kockával dobunk. Az egymást követő dobások is függetlenek.",
        "prompt": "Mennyi annak az esélye, hogy a két kocka összege 2? Törtet vagy tizedes számot adj meg.",
        "answer": {
          "kind": "number",
          "expected": "1/36"
        },
        "hints": [
          "Milyen párral kaphatunk 2-es összeget?",
          "A teljes táblázat 36 azonos esélyű mezőből áll."
        ],
        "solution": [
          {
            "expression": "Kedvező pár: (1; 1)",
            "why": "Más két pozitív kockaérték nem ad kettes összeget."
          },
          {
            "expression": "Esély: 1/36",
            "why": "Egy kedvező eset van a 36 egyenlő esélyű közül."
          }
        ],
        "takeaway": "Az esélyt elemi párokból számoljuk, nem a különböző összegek számából.",
        "mistakes": [
          {
            "input": "1/11",
            "feedback": "A tizenegy lehetséges összeg nem egyenlő esélyű. A 36 dobáspár viszont igen."
          },
          {
            "input": "1/6",
            "feedback": "A két kockának együtt kell 1-et és 1-et mutatnia; nem csak egyetlen kockát figyelünk."
          }
        ]
      },
      {
        "id": "valoszinuseg-practice-2",
        "topic": "valoszinuseg",
        "kind": "compute",
        "difficulty": 2,
        "context": "Modell: két megkülönböztethető, egymástól független, szabályos hatoldalú kockával dobunk. Az egymást követő dobások is függetlenek.",
        "prompt": "Mennyi a 8-as összeg esélye?",
        "answer": {
          "kind": "number",
          "expected": "5/36"
        },
        "hints": [
          "Haladj a piros kocka értéke szerint 1-től 6-ig.",
          "Mely piros számokhoz létezik 1 és 6 közötti kék kiegészítés?"
        ],
        "solution": [
          {
            "expression": "(2; 6), (3; 5), (4; 4), (5; 3), (6; 2)",
            "why": "Ez az összes nyolcas összeget adó pár."
          },
          {
            "expression": "5 kedvező eset a 36 közül",
            "why": "A párok a modellben egyenlő esélyűek."
          },
          {
            "expression": "Esély: 5/36",
            "why": "A kedvező darabszámot az összes esethez viszonyítjuk."
          }
        ],
        "takeaway": "A táblázatos felsorolás segít elkerülni a kimaradó és kétszer számolt eseteket.",
        "mistakes": [
          {
            "input": "3/36",
            "feedback": "A (2; 6) és a (6; 2) külön elemi kimenetel, mert a két kocka megkülönböztethető."
          },
          {
            "input": "1/11",
            "feedback": "A nyolcas összeg öt elemi párt fog össze; az összegek esélye nem azonos."
          }
        ]
      },
      {
        "id": "valoszinuseg-practice-3",
        "topic": "valoszinuseg",
        "kind": "reason",
        "difficulty": 2,
        "context": "Modell: két megkülönböztethető, egymástól független, szabályos hatoldalú kockával dobunk. Az egymást követő dobások is függetlenek.",
        "prompt": "Az összegek 2-től 12-ig terjednek, ez 11 különböző szám. Miért nem 1/11 mindegyik összeg esélye?",
        "answer": {
          "kind": "choice",
          "correct": "pairs",
          "options": [
            {
              "id": "pairs",
              "text": "Mert az egyes összegekhez különböző számú, egyenlő esélyű dobáspár tartozik."
            },
            {
              "id": "twelve",
              "text": "Mert 12-vel kellene osztani: a legnagyobb összeg 12."
            },
            {
              "id": "larger",
              "text": "Mert a nagyobb összeg mindig valószínűbb."
            }
          ]
        },
        "hints": [
          "Hány elemi pár ad kettes összeget, és hány ad hetest?",
          "Azonos esélyt a modellben a rendezett dobáspárokhoz rendeltünk."
        ],
        "solution": [
          {
            "expression": "2-es összeghez 1 pár; 7-eshez 6 pár tartozik",
            "why": "Az összegek különböző számú elemi kimenetelt egyesítenek."
          },
          {
            "expression": "1/36 és 6/36 különböző esély",
            "why": "Ezért nem oszthatjuk szét egyenlően az esélyt a 11 összeg között."
          }
        ],
        "takeaway": "A kedvező/összes képlet előtt ellenőrizd, hogy az összeszámolt esetek valóban egyenlő esélyűek-e.",
        "mistakes": [
          {
            "input": "twelve",
            "feedback": "A legnagyobb szám nem az esetek darabszáma."
          },
          {
            "input": "larger",
            "feedback": "A 12-es összeghez csak (6; 6) tartozik, a kisebb 7-eshez hat pár."
          }
        ]
      },
      {
        "id": "valoszinuseg-practice-4",
        "topic": "valoszinuseg",
        "kind": "compute",
        "difficulty": 2,
        "context": "Modell: két megkülönböztethető, egymástól független, szabályos hatoldalú kockával dobunk. Az egymást követő dobások is függetlenek.",
        "prompt": "Mennyi annak az esélye, hogy a két kocka ugyanazt a számot mutatja?",
        "answer": {
          "kind": "number",
          "expected": "1/6"
        },
        "hints": [
          "Sorold fel az azonos számokból álló párokat.",
          "Hány ilyen pár van a 36 mezős táblázatban?"
        ],
        "solution": [
          {
            "expression": "(1; 1), (2; 2), (3; 3), (4; 4), (5; 5), (6; 6)",
            "why": "Hat kedvező elemi kimenetel van."
          },
          {
            "expression": "6/36 = 1/6",
            "why": "A kedvező esetek száma az összes hatoda."
          }
        ],
        "takeaway": "Egy esemény több különböző elemi kimenetelből állhat.",
        "mistakes": [
          {
            "input": "1/36",
            "feedback": "Nem egy konkrét azonos párt kérdezünk: mind a hat azonos számpár megfelelő."
          },
          {
            "input": "1/2",
            "feedback": "Az „azonos” és „különböző” két elnevezés, de nem két egyenlő esélyű esemény."
          }
        ]
      },
      {
        "id": "valoszinuseg-practice-5",
        "topic": "valoszinuseg",
        "kind": "compute",
        "difficulty": 2,
        "context": "Modell: két megkülönböztethető, egymástól független, szabályos hatoldalú kockával dobunk. Az egymást követő dobások is függetlenek.",
        "prompt": "Mennyi annak az esélye, hogy a két kocka összege nagyobb 10-nél?",
        "answer": {
          "kind": "number",
          "expected": "1/12"
        },
        "hints": [
          "A „nagyobb 10-nél” a 10-et nem tartalmazza.",
          "Előbb sorold fel a 11-et és a 12-t adó párokat."
        ],
        "solution": [
          {
            "expression": "11: (5; 6), (6; 5); 12: (6; 6)",
            "why": "Ezek és csak ezek adnak 10-nél nagyobb összeget."
          },
          {
            "expression": "3 kedvező pár",
            "why": "A két különböző esemény kedvező párjai nem fedik egymást."
          },
          {
            "expression": "3/36 = 1/12",
            "why": "Az összes eset tizenketted része megfelelő."
          }
        ],
        "takeaway": "A pontos szöveg dönti el, mely kimeneteleket számoljuk bele.",
        "mistakes": [
          {
            "input": "1/6",
            "feedback": "Ez a legalább 10 feltételhez tartozna. A kérdés szigorúan 10-nél nagyobb összeget kér."
          },
          {
            "input": "2/11",
            "feedback": "A 11-es és 12-es összeget elemi dobáspárokra kell bontani; az összegek nem azonos esélyűek."
          }
        ]
      },
      {
        "id": "valoszinuseg-practice-6",
        "topic": "valoszinuseg",
        "kind": "reason",
        "difficulty": 2,
        "context": "Modell: két megkülönböztethető, egymástól független, szabályos hatoldalú kockával dobunk. Az egymást követő dobások is függetlenek.",
        "prompt": "Öt egymást követő dobás egyikében sem lett az összeg 7. Mi igaz a következő dobásra?",
        "answer": {
          "kind": "choice",
          "correct": "unchanged",
          "options": [
            {
              "id": "due",
              "text": "Most már 1/6-nál nagyobb a 7-es esélye, mert régóta nem volt."
            },
            {
              "id": "unchanged",
              "text": "Továbbra is 1/6 a 7-es összeg esélye a független dobások modelljében."
            },
            {
              "id": "impossible",
              "text": "A 7-es most már lehetetlen."
            }
          ]
        },
        "hints": [
          "A következő dobás kimenetelei megváltoztak-e a korábbiaktól?",
          "A függetlenség azt jelenti, hogy a korábbi eredmények nem módosítják a következő dobás esélyeit."
        ],
        "solution": [
          {
            "expression": "A következő dobásnak ismét 36 egyenlő esélyű párja van",
            "why": "A múltbeli eredmények nem vesznek el és nem adnak hozzá mezőt a táblázathoz."
          },
          {
            "expression": "Ebből továbbra is 6 ad 7-es összeget",
            "why": "A kedvező esetek köre változatlan."
          },
          {
            "expression": "6/36 = 1/6",
            "why": "A következő esély nem változott."
          }
        ],
        "takeaway": "A független kísérletnek nincs kötelező kiegyenlítési menetrendje.",
        "mistakes": [
          {
            "input": "due",
            "feedback": "A ritka előzmény nem hoz létre új kedvező kimeneteleket a következő dobásban."
          },
          {
            "input": "impossible",
            "feedback": "A hetest adó hat dobáspár továbbra is lehetséges."
          }
        ]
      },
      {
        "id": "valoszinuseg-practice-7",
        "topic": "valoszinuseg",
        "kind": "transfer",
        "difficulty": 2,
        "context": "Modell: két megkülönböztethető, egymástól független, szabályos hatoldalú kockával dobunk. Az egymást követő dobások is függetlenek.",
        "prompt": "Egy feljegyzett 60 dobásos kísérletsorban 9-szer lett az összeg 7. Mennyi a 7-es összeg megfigyelt relatív gyakorisága? Törtben vagy tizedes alakban válaszolj.",
        "answer": {
          "kind": "number",
          "expected": "3/20"
        },
        "hints": [
          "Most nem az elméleti esélyt kérjük, hanem a megadott kísérletsor arányát.",
          "A 9 előfordulást a 60 tényleges dobáshoz viszonyítsd."
        ],
        "solution": [
          {
            "expression": "9/60",
            "why": "Az előfordulások számát az összes elvégzett dobással osztjuk."
          },
          {
            "expression": "9/60 = 3/20 = 0,15",
            "why": "Az arány egyszerűsíthető; százalékosan 15%."
          }
        ],
        "takeaway": "Relatív gyakoriságnál a nevező a tényleges kísérletek száma.",
        "mistakes": [
          {
            "input": "1/6",
            "feedback": "Ez a modell szerinti elméleti esély. A kérdés a konkrét 9/60 megfigyelt arány."
          },
          {
            "input": "1/4",
            "feedback": "A 9-et most nem 36-tal osztjuk. A 36 a mintatér mérete; ebben a kísérletben 60 dobás történt."
          }
        ]
      },
      {
        "id": "valoszinuseg-practice-8",
        "topic": "valoszinuseg",
        "kind": "transfer",
        "difficulty": 3,
        "context": "Modell: két megkülönböztethető, egymástól független, szabályos hatoldalú kockával dobunk. Az egymást követő dobások is függetlenek.",
        "prompt": "Mennyi annak az esélye, hogy a két kocka összege 6 vagy 7?",
        "answer": {
          "kind": "number",
          "expected": "11/36"
        },
        "hints": [
          "Sorold fel külön a hatos és a hetes összeghez tartozó párokat.",
          "Egy dobás összege lehet egyszerre 6 és 7? Kell-e közös esetet levonni?"
        ],
        "solution": [
          {
            "expression": "6-os összeg: (1; 5), (2; 4), (3; 3), (4; 2), (5; 1)",
            "why": "Öt kedvező pár tartozik ide."
          },
          {
            "expression": "7-es összeghez 6 pár tartozik",
            "why": "A hatos és a hetes összeg esetei nem fedik egymást."
          },
          {
            "expression": "5 + 6 = 11 kedvező eset",
            "why": "Ezért a két csoport darabszáma összeadható."
          },
          {
            "expression": "Esély: 11/36",
            "why": "Az összes egyenlő esélyű párhoz viszonyítunk."
          }
        ],
        "takeaway": "Különálló események eseteit összeadhatod, ha közben ellenőrzöd az átfedést.",
        "mistakes": [
          {
            "input": "2/11",
            "feedback": "Két összeg szerepel, de ezek tizenegy elemi párt foglalnak össze."
          },
          {
            "input": "1/3",
            "feedback": "A 6-os összeghez öt pár tartozik, nem hat. Sorold fel őket a táblázatban."
          }
        ]
      }
    ],
    "exit": [
      {
        "id": "valoszinuseg-exit-1",
        "topic": "valoszinuseg",
        "kind": "compute",
        "difficulty": 2,
        "context": "Modell: két megkülönböztethető, egymástól független, szabályos hatoldalú kockával dobunk. Az egymást követő dobások is függetlenek.",
        "prompt": "Mennyi a 9-es összeg esélye?",
        "answer": {
          "kind": "number",
          "expected": "1/9"
        },
        "hints": [
          "Haladj rendszerezetten az első kocka értékei szerint.",
          "Csak 1 és 6 közötti második érték lehet kiegészítés."
        ],
        "solution": [
          {
            "expression": "(3; 6), (4; 5), (5; 4), (6; 3)",
            "why": "Négy különböző pár ad kilences összeget."
          },
          {
            "expression": "4/36 = 1/9",
            "why": "A négy kedvező párt a teljes 36-hoz viszonyítjuk."
          }
        ],
        "takeaway": "Új eseménynél is ugyanazt a teljes, egyenlő esélyű mintateret használjuk.",
        "mistakes": [
          {
            "input": "1/18",
            "feedback": "A felcserélt párok itt külön kimenetelek: (3; 6) és (6; 3) is számít."
          },
          {
            "input": "1/11",
            "feedback": "A kilences összeg nem egyetlen azonos esélyű elem a tizenegy összeg között."
          }
        ]
      },
      {
        "id": "valoszinuseg-exit-2",
        "topic": "valoszinuseg",
        "kind": "reason",
        "difficulty": 2,
        "context": "Modell: két megkülönböztethető, egymástól független, szabályos hatoldalú kockával dobunk. Az egymást követő dobások is függetlenek.",
        "prompt": "A 7-es összeg elméleti esélye 1/6. Biztos, hogy 36 dobásban pontosan 6-szor jelenik meg?",
        "answer": {
          "kind": "choice",
          "correct": "notguaranteed",
          "options": [
            {
              "id": "exact",
              "text": "Igen, mert 36 · 1/6 = 6."
            },
            {
              "id": "notguaranteed",
              "text": "Nem. A 6 várható átlagos darabszám, de egy konkrét sorozatban ettől eltérhet."
            },
            {
              "id": "never",
              "text": "Nem, pontosan 6-szor biztosan nem fordulhat elő."
            }
          ]
        },
        "hints": [
          "A valószínűség előírja-e egy rövid kísérletsor pontos sorrendjét?",
          "Gondolj két, egymástól függetlenül elvégzett 36 dobásos sorozatra."
        ],
        "solution": [
          {
            "expression": "36 · 1/6 = 6",
            "why": "Ez az ilyen hosszú sorozathoz tartozó várható átlagos előfordulásszám."
          },
          {
            "expression": "Egy konkrét sorozat eltérhet ettől",
            "why": "Lehet benne kevesebb, több vagy éppen hat darab 7-es összeg."
          }
        ],
        "takeaway": "A valószínűség nem garantál egy előre rögzített darabszámot minden véges kísérletsorban.",
        "mistakes": [
          {
            "input": "exact",
            "feedback": "Az átlagosan várható darabszám nem ugyanaz, mint egy minden sorozatra kötelező eredmény."
          },
          {
            "input": "never",
            "feedback": "A pontosan hat előfordulás lehetséges; csak nem garantált."
          }
        ]
      }
    ],
    "recap": [
      "A két megkülönböztethető kockának 36 egyenlő esélyű elemi dobáspárja van.",
      "Az összegekhez eltérő számú elemi pár tartozhat.",
      "Az elméleti esély és a megfigyelt relatív gyakoriság külön fogalom.",
      "Független dobásoknál a korábbi eredmények nem kényszerítik ki a következőt."
    ],
    "glossary": [
      {
        "term": "Elemi kimenetel",
        "definition": "A modell egyetlen pontos eredménye, például a két kocka rendezett dobáspárja."
      },
      {
        "term": "Esemény",
        "definition": "Olyan feltétel, amelyet egy vagy több elemi kimenetel teljesít."
      },
      {
        "term": "Valószínűség",
        "definition": "A modell szerinti esély. Egyenlő esélyű véges kimeneteleknél a kedvező és az összes eset számának aránya."
      },
      {
        "term": "Relatív gyakoriság",
        "definition": "Egy esemény megfigyelt előfordulásainak száma osztva a tényleges kísérletek számával."
      },
      {
        "term": "Függetlenség",
        "definition": "Az egyik kísérlet eredménye nem változtatja meg a másik kísérlet kimeneteleinek esélyét a modellben."
      }
    ]
  }
];

// Registry order is the public learning order; historical objects remain unchanged.
export const lessons: Lesson[] = TOPICS.map((id) => {
  const lesson = [...foundationLessons, ...bridgeLessons, ...legacyLessons].find((item) => item.id === id);
  if (!lesson) throw new Error(`Hiányzó lecke: ${id}`);
  return lesson;
});

export const legacyLessonById = Object.fromEntries(legacyLessons.map((lesson) => [lesson.id, lesson]));
export const lessonById = Object.fromEntries(
  lessons.map((lesson) => [lesson.id, lesson]),
) as Record<TopicId, Lesson>;
