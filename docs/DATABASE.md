# KeyRoster — Projekt bazy danych

## 1. Cel dokumentu

Ten dokument opisuje strukturę bazy danych dla aplikacji KeyRoster.

Baza danych ma wspierać:

* zarządzanie teamami,
* zarządzanie graczami,
* zarządzanie postaciami,
* dostępność graczy,
* planowanie runów Mythic+,
* ręczne budowanie składów,
* walidację rosteru,
* późniejsze sugestie składu,
* późniejsze statystyki i integracje.

Dokument jest podstawą pod późniejszy plik:

```txt id="o7ov6q"
prisma/schema.prisma
```

---

## 2. Główne założenia bazy

Najważniejsze zasady:

* aplikacja ma obsługiwać wiele teamów,
* `User` i `Player` to nie zawsze to samo,
* admin może dodać gracza zanim ten założy konto,
* gracz może mieć wiele postaci,
* team ma wielu graczy,
* run zawsze należy do teamu,
* run ma 5 slotów,
* slot może mieć przypisaną postać albo być pusty,
* historii runów nie powinno się tracić,
* nie usuwamy twardo ważnych danych, jeśli mogą być potrzebne później,
* klasy, specjalizacje, sezony i dungeony powinny być w bazie, a nie hardcodowane w UI.

---

## 3. Lista głównych modeli

Pierwsza wersja bazy zawiera modele:

```txt id="mpdh1n"
User
Team
TeamMember
Player
Character
GameClass
GameSpec
Season
Dungeon
Availability
Run
RunSlot
```

Docelowo później można dodać:

```txt id="djlbdh"
AvailabilityException
RunResult
CharacterUtility
SpecUtility
Invite
AuditLog
IntegrationAccount
```

Ale nie dodajemy ich na start, żeby nie komplikować MVP.

---

## 4. Diagram logiczny relacji

Ogólny schemat:

```txt id="i18q5f"
User
 └── TeamMember
      └── Team
           ├── Player
           │    ├── Character
           │    └── Availability
           │
           └── Run
                └── RunSlot
                     └── Character

GameClass
 └── GameSpec
      └── Character

Season
 └── Dungeon
      └── Run
```

Najważniejsze relacje:

```txt id="y5oyix"
Team 1..n Player
Player 1..n Character
Player 1..n Availability
Team 1..n Run
Run 1..n RunSlot
Character 1..n RunSlot
GameClass 1..n GameSpec
GameSpec 1..n Character
Season 1..n Dungeon
Dungeon 1..n Run
```

---

## 5. User

Model `User` reprezentuje konto w aplikacji.

Nie każdy `Player` musi mieć konto użytkownika.

Przykład:

Admin może dodać gracza `Skoez` do rosteru, nawet jeśli `Skoez` jeszcze nigdy nie zalogował się do aplikacji.

### Pola

```txt id="sgaxeo"
User
- id
- email
- name
- image?
- createdAt
- updatedAt
```

### Zasady

* `email` powinien być unikalny,
* `User` może należeć do wielu teamów przez `TeamMember`,
* później `User` może być powiązany z `Player`,
* dokładny kształt modelu może zostać dostosowany do wybranego systemu auth.

---

## 6. Team

Model `Team` reprezentuje grupę, roster, gildyjny team albo push groupę.

Przykłady:

```txt id="z2knj5"
Weekend Push Team
Guild M+ Roster
Skoez Keys
```

### Pola

```txt id="o7r8pn"
Team
- id
- name
- slug
- createdAt
- updatedAt
```

### Zasady

* `slug` powinien być unikalny,
* team ma wielu członków przez `TeamMember`,
* team ma wielu graczy przez `Player`,
* team ma wiele runów przez `Run`.

---

## 7. TeamMember

Model `TeamMember` łączy `User` z `Team`.

Dzięki temu jeden użytkownik może należeć do wielu teamów.

### Pola

```txt id="aqqykq"
TeamMember
- id
- userId
- teamId
- role
- createdAt
```

### Role

```txt id="qcje3m"
OWNER
ADMIN
MEMBER
```

### Zasady

* jeden `User` nie powinien być dodany dwa razy do tego samego `Team`,
* para `userId + teamId` powinna być unikalna,
* `OWNER` ma pełne uprawnienia,
* `ADMIN` zarządza rosterem i runami,
* `MEMBER` ma ograniczony dostęp.

---

## 8. Player

Model `Player` reprezentuje osobę w rosterze.

To jest bardzo ważna decyzja:

```txt id="mj4v2v"
Player nie jest tym samym co User.
```

Dlaczego?

Bo:

* admin może ręcznie dodać gracza,
* gracz może nie mieć jeszcze konta,
* jeden user może później zostać powiązany z rekordem playera,
* historia rosteru nie powinna zależeć od konta logowania.

### Pola

```txt id="qscguo"
Player
- id
- teamId
- userId?
- nickname
- battleTag?
- discordName?
- note?
- status
- createdAt
- updatedAt
```

### Statusy

```txt id="csfdij"
ACTIVE
INACTIVE
TRIAL
BENCHED
```

### Zasady

* `nickname` jest wymagany,
* `userId` jest opcjonalny,
* `teamId` jest wymagany,
* gracz należy do jednego teamu,
* gracz ma wiele postaci,
* gracz ma wiele wpisów dostępności,
* gracza nie usuwamy twardo na początku,
* zamiast usuwania zmieniamy `status`.

### Dlaczego status zamiast usuwania?

Jeśli gracz brał udział w runach, twarde usunięcie mogłoby zepsuć historię.

Lepsze podejście:

```txt id="dm8css"
ACTIVE    — normalnie gra
TRIAL     — testowany gracz
BENCHED   — w rosterze, ale aktualnie nieużywany
INACTIVE  — historyczny albo nieaktywny
```

---

## 9. GameClass

Model `GameClass` reprezentuje klasę w World of Warcraft.

Przykłady:

```txt id="z6vefw"
Mage
Warrior
Paladin
Priest
Druid
```

### Pola

```txt id="xxp9so"
GameClass
- id
- name
- slug
- color?
- icon?
- createdAt
- updatedAt
```

### Zasady

* klasy powinny być dodawane przez seed,
* UI nie powinno hardcodować listy klas,
* `slug` powinien być unikalny,
* `color` może służyć później do kolorowania klasy w UI,
* `icon` może służyć później do ikon.

---

## 10. GameSpec

Model `GameSpec` reprezentuje specjalizację klasy.

Przykłady:

```txt id="0qqvwj"
Frost Mage
Fire Mage
Protection Warrior
Restoration Druid
Holy Paladin
```

### Pola

```txt id="nh762l"
GameSpec
- id
- classId
- name
- slug
- role
- icon?
- createdAt
- updatedAt
```

### Role speca

```txt id="k4lgq0"
TANK
HEALER
DPS
```

### Zasady

* spec zawsze należy do jednej klasy,
* spec ma domyślną rolę,
* rola postaci może wynikać ze speca,
* lista speców powinna pochodzić z seeda,
* później do speca można dodać utility.

### Dlaczego specy są w bazie?

Bo wtedy:

* UI pobiera aktualną listę z bazy,
* można poprawić dane bez dużych zmian w kodzie,
* można później dodać utility per spec,
* można rozbudować system pod kolejne sezony.

---

## 11. Character

Model `Character` reprezentuje postać gracza.

Jeden `Player` może mieć wiele postaci.

### Pola

```txt id="dmje9l"
Character
- id
- playerId
- name
- realm
- region
- classId
- specId
- role
- itemLevel?
- rioScore?
- isMain
- isActive
- createdAt
- updatedAt
```

### Role

```txt id="yyfgmn"
TANK
HEALER
DPS
```

### Regiony

Na start można użyć prostego tekstu albo enuma.

Przykłady:

```txt id="fr1lqg"
EU
US
KR
TW
```

### Zasady

* postać zawsze należy do jednego gracza,
* postać ma jedną klasę,
* postać ma jedną specjalizację,
* `role` może być skopiowane z `GameSpec.role`,
* `isMain` oznacza główną postać gracza,
* `isActive` pozwala ukryć stare alty bez usuwania,
* `itemLevel` i `rioScore` są opcjonalne,
* później mogą być aktualizowane z integracji zewnętrznych.

### Ważna decyzja o `role`

Mimo że `GameSpec` ma rolę, `Character` też ma pole `role`.

Dlaczego?

Bo jest to wygodne dla zapytań i roster buildera.

Przykład:

```txt id="4zbkuw"
Pokaż wszystkie aktywne postacie DPS w teamie.
```

Z takim polem query jest proste.

Na etapie tworzenia lub edycji postaci aplikacja powinna pilnować, żeby rola była zgodna ze specem.

---

## 12. Season

Model `Season` reprezentuje sezon Mythic+.

### Pola

```txt id="gxb9l7"
Season
- id
- name
- slug
- isActive
- startsAt?
- endsAt?
- createdAt
- updatedAt
```

### Zasady

* tylko jeden sezon powinien być aktywny w danym momencie,
* dungeony są przypisane do sezonu,
* runy korzystają z dungeonów przypisanych do sezonu,
* później statystyki mogą być filtrowane po sezonie.

---

## 13. Dungeon

Model `Dungeon` reprezentuje dungeon dostępny w danym sezonie.

### Pola

```txt id="tvc9gw"
Dungeon
- id
- seasonId
- name
- shortName
- slug
- isActive
- createdAt
- updatedAt
```

### Zasady

* dungeon należy do jednego sezonu,
* `shortName` służy do krótkiego wyświetlania,
* `slug` powinien być unikalny w ramach sezonu,
* dungeony powinny być dodawane przez seed albo panel admina później,
* run zawsze wskazuje konkretny dungeon.

---

## 14. Availability

Model `Availability` reprezentuje tygodniową dostępność gracza.

Na start robimy prosty model tygodniowy.

Nie robimy jeszcze pełnego kalendarza ani wyjątków na konkretne daty.

### Pola

```txt id="qjyw95"
Availability
- id
- playerId
- dayOfWeek
- startTime
- endTime
- createdAt
- updatedAt
```

### `dayOfWeek`

Możliwe wartości:

```txt id="cybh44"
MONDAY
TUESDAY
WEDNESDAY
THURSDAY
FRIDAY
SATURDAY
SUNDAY
```

### `startTime` i `endTime`

Na poziomie Prisma/PostgreSQL można to rozwiązać jako:

```txt id="2crxen"
String w formacie HH:mm
```

albo jako typ czasu w bazie.

Na start prostsze i wystarczające będzie:

```txt id="m7q8pg"
"20:00"
"23:00"
```

### Zasady

* jeden gracz może mieć wiele okien dostępności,
* gracz może mieć kilka okien tego samego dnia,
* dostępność jest tygodniowa,
* timezone na start traktujemy jako timezone teamu,
* później można dodać wyjątki na konkretne daty.

### Przykład

```txt id="fnpgny"
Player: Skoez

FRIDAY 20:00-23:00
SATURDAY 19:00-01:00
```

---

## 15. Run

Model `Run` reprezentuje zaplanowany klucz Mythic+.

### Pola

```txt id="vg4or8"
Run
- id
- teamId
- dungeonId
- keyLevel
- scheduledAt
- status
- note?
- createdAt
- updatedAt
```

### Statusy

```txt id="014lhf"
PLANNED
COMPLETED
CANCELLED
FAILED
```

### Zasady

* run zawsze należy do teamu,
* run zawsze wskazuje dungeon,
* run ma poziom klucza,
* run ma datę i godzinę,
* po utworzeniu runu powstaje 5 slotów,
* historia runów powinna zostać w bazie nawet po dezaktywacji graczy.

### Późniejsze pola

Nie dodajemy ich na start, ale później można dodać:

```txt id="5drjqv"
completedAt
durationSeconds
isTimed
depleted
scoreGain
```

---

## 16. RunSlot

Model `RunSlot` reprezentuje miejsce w składzie konkretnego runu.

Każdy run powinien mieć 5 slotów:

```txt id="kyyhh5"
1. Tank
2. Healer
3. DPS
4. DPS
5. DPS
```

### Pola

```txt id="emkzfx"
RunSlot
- id
- runId
- role
- position
- characterId?
- createdAt
- updatedAt
```

### Role slotu

```txt id="rv59op"
TANK
HEALER
DPS
```

### Zasady

* slot zawsze należy do runu,
* slot może, ale nie musi mieć przypisanej postaci,
* `position` ustala kolejność wyświetlania,
* `characterId` jest opcjonalne,
* jedna postać nie może być przypisana do dwóch slotów w tym samym runie,
* jeden gracz nie powinien mieć dwóch postaci w tym samym runie,
* rola postaci powinna pasować do roli slotu.

### Przykład slotów

```txt id="lt4e45"
Run: Ara-Kara +10

1 TANK   Protection Warrior
2 HEALER Restoration Shaman
3 DPS    Frost Mage
4 DPS    Havoc Demon Hunter
5 DPS    Augmentation Evoker
```

---

## 17. Enums

Pierwsza wersja bazy powinna mieć enumy:

```txt id="zs6w07"
TeamRole
PlayerStatus
CharacterRole
RunStatus
DayOfWeek
Region
```

### TeamRole

```txt id="rb73wc"
OWNER
ADMIN
MEMBER
```

### PlayerStatus

```txt id="k66a4k"
ACTIVE
INACTIVE
TRIAL
BENCHED
```

### CharacterRole

```txt id="qziajd"
TANK
HEALER
DPS
```

### RunStatus

```txt id="za5gbz"
PLANNED
COMPLETED
CANCELLED
FAILED
```

### DayOfWeek

```txt id="hnwodp"
MONDAY
TUESDAY
WEDNESDAY
THURSDAY
FRIDAY
SATURDAY
SUNDAY
```

### Region

```txt id="1xyapg"
EU
US
KR
TW
```

---

## 18. Relacje szczegółowe

### User → TeamMember

```txt id="49z2bn"
User 1..n TeamMember
```

Jeden użytkownik może być członkiem wielu teamów.

### Team → TeamMember

```txt id="7e1o6l"
Team 1..n TeamMember
```

Jeden team ma wielu użytkowników.

### Team → Player

```txt id="2c5ig9"
Team 1..n Player
```

Team ma wielu graczy w rosterze.

### User → Player

```txt id="zbg4gy"
User 0..n Player
```

W przyszłości jeden użytkownik może być powiązany z jednym albo więcej rekordami `Player`.

Na start najczęściej będzie to jeden `Player`.

### Player → Character

```txt id="rsnmoa"
Player 1..n Character
```

Jeden gracz może mieć wiele postaci.

### Player → Availability

```txt id="kmx12c"
Player 1..n Availability
```

Jeden gracz może mieć wiele okien dostępności.

### Team → Run

```txt id="bpr72t"
Team 1..n Run
```

Team ma wiele zaplanowanych runów.

### Run → RunSlot

```txt id="rjcumk"
Run 1..n RunSlot
```

Jeden run ma pięć slotów.

### Character → RunSlot

```txt id="kn0eim"
Character 0..n RunSlot
```

Jedna postać może pojawić się w wielu runach historycznie, ale nie może pojawić się dwa razy w tym samym runie.

### GameClass → GameSpec

```txt id="14tv8n"
GameClass 1..n GameSpec
```

Klasa ma wiele specjalizacji.

### GameSpec → Character

```txt id="2osvfj"
GameSpec 1..n Character
```

Postać ma jedną specjalizację.

### Season → Dungeon

```txt id="b2tyvm"
Season 1..n Dungeon
```

Sezon ma wiele dungeonów.

### Dungeon → Run

```txt id="1grhf7"
Dungeon 1..n Run
```

Run odbywa się w jednym dungeonie.

---

## 19. Unikalności i indeksy

Warto zaplanować unikalności:

```txt id="tx08g1"
User.email unique
Team.slug unique
TeamMember userId + teamId unique
GameClass.slug unique
GameSpec classId + slug unique
Season.slug unique
Dungeon seasonId + slug unique
RunSlot runId + position unique
```

Potencjalne indeksy:

```txt id="e4r5sn"
Player.teamId
Player.status
Character.playerId
Character.role
Character.isActive
Run.teamId
Run.scheduledAt
Run.status
RunSlot.runId
RunSlot.characterId
Availability.playerId
Availability.dayOfWeek
```

Dzięki temu podstawowe widoki będą szybkie:

* lista graczy teamu,
* aktywne postacie,
* runy teamu,
* najbliższe runy,
* dostępność gracza.

---

## 20. Usuwanie danych

Na start przyjmujemy zasadę:

```txt id="xsjdc5"
Nie usuwamy twardo graczy i postaci, jeśli mogą być potrzebni w historii.
```

### Player

Zamiast usuwać:

```txt id="adhjvr"
status = INACTIVE
```

### Character

Zamiast usuwać:

```txt id="266cru"
isActive = false
```

### Run

Runów nie usuwamy, jeśli mają znaczenie historyczne.

Można zmienić status na:

```txt id="lck9d2"
CANCELLED
```

### RunSlot

Sloty są częścią runu.

Jeśli run istnieje, sloty powinny istnieć.

---

## 21. Seed danych developerskich

Seed powinien dodać minimalne dane potrzebne do pracy lokalnej.

Plik:

```txt id="guf5i2"
prisma/seed.ts
```

Powinien utworzyć:

```txt id="h7f4wu"
- testowego użytkownika,
- testowy team,
- powiązanie TeamMember,
- klasy gry,
- specjalizacje gry,
- aktywny sezon,
- dungeony sezonu,
- kilku graczy,
- kilka postaci,
- przykładową dostępność,
- przykładowy run,
- 5 slotów dla runu.
```

### Ważne

Seed nie jest mockiem UI.

Seed tworzy prawdziwe rekordy w bazie developerskiej.

---

## 22. Minimalny flow danych w MVP

### Dodanie gracza

```txt id="bpqmql"
Admin wypełnia formularz
 -> createPlayer
 -> walidacja
 -> zapis Player
 -> powrót do listy graczy
```

### Dodanie postaci

```txt id="m93rls"
Admin wybiera Player
 -> wybiera GameClass
 -> wybiera GameSpec
 -> aplikacja ustawia role
 -> zapis Character
```

### Utworzenie runu

```txt id="ag4x57"
Admin wybiera Dungeon
 -> wpisuje keyLevel
 -> wybiera scheduledAt
 -> createRun
 -> zapis Run
 -> automatyczne utworzenie 5 RunSlot
```

### Przypisanie postaci do slotu

```txt id="nqi0vk"
Admin wybiera slot
 -> UI pokazuje pasujące postacie
 -> assignCharacterToRunSlot
 -> walidacja
 -> zapis characterId w RunSlot
```

---

## 23. Walidacje biznesowe

Baza i server actions powinny wspierać walidacje:

### Player

```txt id="jty0o1"
- nickname jest wymagany,
- player musi należeć do teamu,
- nie powinno być dwóch aktywnych graczy o tym samym nicku w jednym teamie.
```

### Character

```txt id="o498mk"
- name jest wymagany,
- character musi należeć do playera,
- spec musi należeć do wybranej klasy,
- role powinna pasować do speca,
- itemLevel nie może być ujemny,
- rioScore nie może być ujemny.
```

### Run

```txt id="ogqjlt"
- run musi należeć do teamu,
- dungeon jest wymagany,
- keyLevel musi być większy od 0,
- scheduledAt jest wymagane.
```

### RunSlot

```txt id="gftqhd"
- slot musi należeć do runu,
- character musi należeć do tego samego teamu co run,
- character musi być aktywny,
- player nie może być inactive,
- character role musi pasować do slot role,
- ta sama postać nie może być w dwóch slotach tego samego runu,
- ten sam gracz nie powinien mieć dwóch postaci w tym samym runie.
```

### Availability

```txt id="dkwcpg"
- dayOfWeek jest wymagany,
- startTime jest wymagany,
- endTime jest wymagany,
- format czasu powinien być HH:mm,
- startTime i endTime nie powinny być takie same.
```

---

## 24. Dostępność a przejście przez północ

Przykład:

```txt id="3qu7sa"
Saturday 22:00-01:00
```

To oznacza, że gracz jest dostępny od soboty 22:00 do niedzieli 01:00.

Na start możemy to obsłużyć w logice aplikacji, a nie komplikować modelu bazy.

Zasada:

```txt id="5de7f7"
Jeśli endTime jest mniejsze niż startTime, traktujemy to jako dostępność przechodzącą przez północ.
```

Przykład:

```txt id="3pbngx"
startTime = "22:00"
endTime = "01:00"
```

oznacza:

```txt id="8peuaw"
22:00 -> 24:00
00:00 -> 01:00 następnego dnia
```

---

## 25. Czego celowo nie dodajemy na start

Na start nie dodajemy:

```txt id="yowb29"
AvailabilityException
CharacterUtility
RunResult
Invite
DiscordIntegration
RaiderIoProfile
BattleNetAccount
AuditLog
Notification
```

Dlaczego?

Bo MVP ma najpierw działać jako ręczny roster builder.

Te modele można dodać później, kiedy core aplikacji będzie stabilny.

---

## 26. Modele do dodania później

### AvailabilityException

Pozwoli nadpisać tygodniową dostępność konkretną datą.

Przykład:

```txt id="ldoi99"
W każdy piątek gram 20:00-23:00,
ale 2026-08-14 mnie nie ma.
```

### CharacterUtility

Pozwoli przypisać utility do postaci albo speca.

Przykłady:

```txt id="28p35a"
Bloodlust
Battle Res
Curse Dispel
Poison Dispel
Disease Dispel
Mass Dispel
Immunity
```

### RunResult

Pozwoli zapisywać wynik runu.

Przykład:

```txt id="t1ha8w"
completed
timed
duration
score gain
```

### Invite

Pozwoli zapraszać użytkowników do teamu.

### IntegrationAccount

Pozwoli połączyć konto z Battle.net, Raider.IO albo Discordem.

---

## 27. Pierwsza wersja schema.prisma

Pierwsza wersja `schema.prisma` powinna zawierać:

```txt id="un2hc0"
- enumy,
- User,
- Team,
- TeamMember,
- Player,
- GameClass,
- GameSpec,
- Character,
- Season,
- Dungeon,
- Availability,
- Run,
- RunSlot.
```

Nie musi jeszcze zawierać:

```txt id="ans69h"
- auth provider tables,
- session tables,
- account tables,
- verification tokens,
- integration tables,
- advanced statistics.
```

Jeżeli wybierzemy Auth.js, później dojdą modele wymagane przez adapter Auth.js.

Jeżeli wybierzemy Clerk, model `User` może być prostszy, bo auth będzie zarządzany zewnętrznie.

---

## 28. Pytania do decyzji później

Te decyzje nie blokują MVP, ale wrócimy do nich później:

```txt id="nd0flh"
1. Czy używamy Auth.js czy Clerk?
2. Czy User może mieć wiele Playerów w różnych teamach?
3. Czy dostępność jest globalna dla playera, czy osobna per team?
4. Czy itemLevel i rioScore aktualizujemy ręcznie, czy przez API?
5. Czy dungeony edytuje admin, czy tylko seed/system?
6. Czy roster builder ma blokować brak dostępności, czy tylko ostrzegać?
7. Czy jeden gracz może mieć dwie postacie w jednym runie jako wyjątek?
```

Domyślne decyzje na MVP:

```txt id="7c2juj"
1. Auth odkładamy na później.
2. User może być powiązany z Playerem.
3. Dostępność jest per Player.
4. itemLevel i rioScore wpisujemy ręcznie.
5. Dungeony dodajemy seedem.
6. Brak dostępności daje ostrzeżenie.
7. Dwie postacie jednego gracza w jednym runie są blokowane.
```

---

## 29. Aktualny status

Ten dokument opisuje plan bazy danych przed implementacją.

Następny techniczny krok:

```txt id="ol41cz"
Utworzyć projekt Next.js.
```

Potem:

```txt id="ejgnch"
Skonfigurować Prisma i przepisać ten projekt bazy do prisma/schema.prisma.
```
