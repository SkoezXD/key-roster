KeyRoster — Roadmapa projektu
1. Cel aplikacji

KeyRoster to aplikacja do zarządzania rosterem na Mythic+ keys.

Aplikacja ma pomagać liderowi/adminowi odpowiedzieć na pytania:

kto jest w teamie,
jakie postacie mają gracze,
kto może grać danego dnia,
jaki skład można złożyć na konkretny klucz,
czy grupa ma poprawny układ ról,
czy ktoś nie został przypisany podwójnie,
kto był już używany w runach,
jakie role lub klasy są brakujące.

Pierwszym celem nie jest automatyczne dobieranie idealnego składu.

Pierwszym celem jest stworzenie solidnego panelu, w którym admin może ręcznie zarządzać rosterem i planować klucze.

2. Główne założenia

Projekt budujemy krok po kroku.

Najważniejsze zasady:

aplikacja ma być praktyczna dla admina,
gracz ma mieć prosty i szybki panel,
nie budujemy od razu integracji z Raider.IO, Battle.net ani Discordem,
nie zaczynamy od automatycznego algorytmu,
najpierw robimy działający manual roster builder,
aplikacja od początku ma być przygotowana pod prawdziwą bazę danych,
mocki w UI nie są głównym źródłem danych,
dane testowe mogą pochodzić z seedów bazy danych.
3. Stack technologiczny

Docelowy stack:

Next.js
React
TypeScript
PostgreSQL
Prisma
Zod
Tailwind CSS
shadcn/ui
Auth.js albo Clerk
Vercel
Neon, Supabase albo Railway dla bazy danych

Na start projekt budujemy jako fullstackową aplikację Next.js.

4. Główni użytkownicy
Admin / Leader

Admin zarządza rosterem.

Admin powinien móc:

dodawać graczy,
edytować graczy,
dodawać postacie,
edytować postacie,
ustawiać status gracza,
sprawdzać dostępność,
tworzyć runy,
przypisywać skład do runu,
widzieć braki w rosterze.
Player

Gracz powinien mieć prosty panel.

Gracz powinien móc:

widzieć swoje postacie,
edytować swoją dostępność,
widzieć nadchodzące runy,
sprawdzić, czy został przypisany do składu.
5. Główne moduły aplikacji

Docelowe moduły:

Dashboard
Players
Characters
Availability
Runs
Roster Builder
Settings
Auth
Player Panel
Suggestions
Statistics
Integrations
6. MVP

Pierwsze MVP ma być małe, ale użyteczne.

MVP powinno pozwalać adminowi:

utworzyć team,
dodać graczy,
dodać postacie graczy,
ustawić role, klasy i specjalizacje,
ustawić dostępność graczy,
stworzyć run,
wybrać dungeon, poziom klucza i datę,
przypisać 5 postaci do runu,
zapisać skład.

Pierwsze MVP nie musi mieć:

automatycznego dobierania składu,
integracji z zewnętrznymi API,
Discord bota,
statystyk,
zaawansowanego systemu utility,
pełnego panelu gracza.
7. Kolejność budowy
Etap 0 — Dokumentacja projektu

Cel: ustalić plan przed kodowaniem.

Do zrobienia:

docs/ROADMAP.md
docs/ARCHITECTURE.md
docs/DATABASE.md

Efekt:

wiadomo, co budujemy,
wiadomo, w jakiej kolejności,
Codex może później korzystać z dokumentacji jako kontekstu.
Etap 1 — Setup projektu

Cel: uruchomić pustą aplikację Next.js.

Do zrobienia:

utworzyć projekt Next.js,
dodać TypeScript,
dodać Tailwind CSS,
dodać podstawową strukturę folderów,
dodać podstawowe strony,
dodać prosty layout.

Strony na start:

/
/dashboard
/players
/characters
/availability
/runs
/settings
Etap 2 — Prisma i baza danych

Cel: aplikacja ma działać na prawdziwej bazie danych.

Do zrobienia:

zainstalować Prisma,
skonfigurować PostgreSQL,
dodać schema.prisma,
dodać pierwszą migrację,
dodać seed danych developerskich,
dodać helper lib/prisma.ts.
Etap 3 — Modele gry

Cel: mieć dane bazowe potrzebne do postaci i runów.

Do zrobienia:

GameClass
GameSpec
Season
Dungeon

Założenie:

klasy, specy, sezony i dungeony nie powinny być hardcodowane w UI,
powinny pochodzić z bazy danych,
na start mogą być dodawane przez seed.
Etap 4 — Team foundation

Cel: przygotować aplikację pod teamy.

Do zrobienia:

User
Team
TeamMember
role: OWNER, ADMIN, MEMBER.

Na początku auth może być uproszczony, ale baza powinna być gotowa pod wielu użytkowników.

Etap 5 — Players

Cel: admin może zarządzać graczami.

Do zrobienia:

lista graczy,
dodawanie gracza,
edycja gracza,
status gracza,
notatka,
Discord name,
BattleTag.

Statusy gracza:

ACTIVE
INACTIVE
TRIAL
BENCHED

Na start nie usuwamy graczy twardo, tylko zmieniamy ich status.

Etap 6 — Characters

Cel: gracze mają swoje postacie.

Do zrobienia:

lista postaci,
dodawanie postaci,
edycja postaci,
przypisanie postaci do gracza,
wybór klasy,
wybór specjalizacji,
rola postaci,
item level,
rio score,
main/offspec,
active/inactive.

Założenie UX:

admin wybiera gracza, klasę i spec,
aplikacja powinna domyślnie znać rolę speca,
postać może być oznaczona jako main.
Etap 7 — Availability

Cel: admin wie, kto kiedy może grać.

Pierwsza wersja dostępności:

dzień tygodnia,
godzina startu,
godzina końca.

Na start nie robimy rozbudowanego kalendarza.

Później można dodać wyjątki na konkretne daty.

Etap 8 — Runs

Cel: admin może planować klucze.

Run powinien mieć:

team,
dungeon,
key level,
datę i godzinę,
status,
notatkę.

Statusy runu:

PLANNED
COMPLETED
CANCELLED
FAILED

Po utworzeniu runu aplikacja powinna utworzyć 5 slotów:

Tank
Healer
DPS
DPS
DPS
Etap 9 — Manual Roster Builder

Cel: admin może ręcznie złożyć skład.

Na stronie runu powinno być 5 slotów:

Tank
Healer
DPS
DPS
DPS

Admin może przypisać postać do każdego slotu.

Podstawowe zasady:

slot Tank pokazuje tanków,
slot Healer pokazuje healerów,
slot DPS pokazuje dpsów,
nie można przypisać tej samej postaci dwa razy,
jeden gracz nie powinien mieć dwóch postaci w tym samym runie,
aplikacja powinna ostrzegać, jeśli gracz nie jest dostępny.
Etap 10 — Walidacje składu

Cel: aplikacja pilnuje podstawowych reguł.

Walidacje:

dokładnie 1 tank,
dokładnie 1 healer,
dokładnie 3 DPS,
brak duplikatów postaci,
brak duplikatów gracza,
postać musi należeć do teamu,
postać musi być aktywna,
gracz nie może być inactive,
ostrzeżenie, jeśli gracz nie ma dostępności.

Duplikaty powinny blokować zapis.

Dostępność może na początku być ostrzeżeniem, a nie twardą blokadą.

Etap 11 — Dashboard

Cel: admin szybko widzi stan rosteru.

Dashboard powinien pokazywać:

najbliższe runy,
liczbę aktywnych graczy,
liczbę tanków,
liczbę healerów,
liczbę DPS,
braki w rolach,
dzisiejszą dostępność.

Dashboard robimy dopiero wtedy, gdy istnieją już dane: players, characters, availability i runs.

Etap 12 — Auth i panel gracza

Cel: gracz może sam zarządzać swoimi danymi.

Do zrobienia:

logowanie,
powiązanie User z Player,
role użytkowników,
panel gracza,
moje postacie,
moja dostępność,
moje runy.

Ten etap robimy po panelu admina.

Etap 13 — Suggestions

Cel: aplikacja pomaga dobrać skład.

Pierwsza wersja:

pokaż dostępne postacie do slotu,
filtruj po roli,
sortuj po rio score,
sortuj po item level,
uwzględnij dostępność.

Druga wersja:

zaproponuj cały skład,
preferuj mainy,
preferuj aktywnych graczy,
unikaj duplikatów gracza.

Trzecia wersja:

uwzględnij bloodlust,
battle res,
dispelle,
party buffs,
balance melee/ranged.
Etap 14 — Historia i statystyki

Cel: aplikacja pokazuje historię runów.

Do zrobienia:

oznaczanie runu jako completed,
oznaczanie runu jako failed,
oznaczanie runu jako cancelled,
intime true/false,
duration,
historia runów gracza,
liczba runów per gracz,
najczęściej grane klasy,
najczęściej grane dungeony.
Etap 15 — Integracje

Cel: automatyzacja danych.

Potencjalne integracje:

Raider.IO API,
Battle.net API,
Discord OAuth,
Discord bot.

Integracje robimy dopiero po działającym core aplikacji.

8. Zasady pracy z Codexem

Codex ma być używany tylko do małych, kontrolowanych zmian.

Dobre zadania dla Codexa:

dodaj jeden model do Prisma,
utwórz jeden komponent,
popraw layout jednego formularza,
dodaj jedną server action,
napraw konkretny błąd w konkretnym pliku.

Złe zadania dla Codexa:

zbuduj całą aplikację,
dodaj cały system rosterów,
napraw projekt,
zaprojektuj całą bazę od nowa.

Workflow:

Ustalamy mały krok.
Opisujemy, dlaczego go robimy.
Tworzymy kod ręcznie albo dajemy mały prompt do Codexa.
Sprawdzamy wynik.
Dopiero potem przechodzimy dalej.
9. Aktualny status

Aktualny etap:

Etap 0 — Dokumentacja projektu

Aktualnie robimy:

docs/ROADMAP.md

Następny plik:

docs/ARCHITECTURE.md

Potem:

docs/DATABASE.md