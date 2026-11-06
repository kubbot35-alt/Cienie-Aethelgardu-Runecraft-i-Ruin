# Shadows of Aethelgard: Runecraft & Ruin

Mroczna gra przygodowa 2.5D w stylu pixel art, łącząca eksplorację lochów i starożytnych ruin z łamigłówkami przestrzennymi, rozgałęzionym drzewem dialogowym z moralnymi wyborami, dynamiczną pogodą wpływającą na świat, rzemiosłem alchemicznym i runicznym oraz taktyczną turową walką karcianą. Całość wspiera PWA offline, zapis IndexedDB z symulacją bezpiecznej synchronizacji chmurowej, uwierzytelnianie biometryczne WebAuthn i 2FA, eksport audytu CSV zgodny z RODO oraz pełne wsparcie kontrolerów i wielojęzyczności (PL, EN, IT).

## User Review & Critical Decisions

> [!IMPORTANT]
> Podsumowanie kluczowych decyzji potwierdzonych przez użytkownika w Fazie 1 oraz domyślne parametry systemowe:

- **Potwierdzona perspektywa**: Rzut izometryczny / top-down 2.5D z renderowaniem w stylu pixel art na izolowanym elemencie `<canvas>` (pixel-ratio lock, autorskie generowanie proceduralnych kafelków i sprite'ów bez zewnętrznych zawodnych linków).
- **Potwierdzony model walki**: Taktyczny turowy system dark fantasy z zagrywaniem runicznych kart akcji, zarządzaniem zasobami (Eter, Krew, Skupienie) oraz czasem reakcji.
- **Potwierdzona architektura danych**: Pełna symulacja PWA z IndexedDB, obsługa trybu offline, symulacja synchronizacji chmurowej, biometryczne logowanie WebAuthn (TouchID/FaceID), 2FA TOTP, eksport danych audytowych i telemetrycznych do CSV oraz zgodność z RODO.
- **Rygor architektoniczny (SOLID / Clean Architecture)**:
  - Czysty podział domenowy: silnik logiki gry (`Domain/Core`) nie wie o istnieniu Reacta czy drzewa DOM.
  - Ograniczenia rozmiaru: maksymalnie 200 linii na plik, maksymalnie 25 linii na metodę.
  - Programowanie do interfejsów (DIP) i wstrzykiwanie zależności.
  - Ścisłe typowanie bez typu `any`.

---

## 1. Overview & Core Concept

- **Czym jest aplikacja**: Kompleksowa gra RPG-Adventure w mrocznym uniwersum fantasy, w której gracz wciela się w Ostatniego Runomistrza badającego skażone ruiny Aethelgard. Gracz rozwiązuje mechaniczne i runiczne łamigłówki, podejmuje nieodwracalne wybory moralne zmieniające losy frakcji, przetrwa w obliczu anomalii pogodowych (kwaśny deszcz, mgła cieni, mroźna burza), wytwarza relikwie i eliksiry, a także stawia czoła potworom w taktycznych starciach turowych.
- **Grupa docelowa**: Fani klasycznych gier dark fantasy, gier logicznych, dungeon crawlerów i taktycznych karcianek ceniący głęboką atmosferę, brak "sztucznego slopu" oraz wysublimowaną estetykę retro.
- **Główna wartość**: Spójne, wciągające doświadczenie łączące eksplorację, taktykę i fabułę z bezkompromisowym wykonaniem inżynieryjnym (PWA, obsługa offline, responsywność mobilna, gamepad API, wielojęzyczność).

---

## 2. User Experience & Visual Design

### Ścieżki użytkownika (User Flows)
1. **Title Screen & Uwierzytelnianie**:
   - Klimatyczny ekran tytułowy z żywą sceną pixel art i klimatycznym ambientem audio (Web Audio synth).
   - Opcja szybkiego wejścia jako gość lub zabezpieczonego profilu: logowanie biometryczne (WebAuthn / Passkey) lub 2FA.
   - Szybki wybór języka (Polski, English, Italiano) oraz trybu jasnego/ciemnego (Night Mode / Midnight Eclipse).
2. **Eksploracja Świata (Top-Down 2.5D Canvas)**:
   - Przemieszczanie się runomistrza (klawiatura WASD/Strzałki, dotyk na ekranie mobilnym, Gamepad API).
   - Interakcje z łamigłówkami (płyty naciskowe, kolumny runiczne, zwierciadła świetlne, zapadnie).
   - Dynamiczna pogoda (deszcz runiczny, mgła eteryczna, burza popiołu) modyfikująca pole widzenia, prędkość i odporności.
3. **Drzewo Dialogowe i Wybory Moralne**:
   - Rozmowy z postaciami niezależnymi (NPC) prezentowane w minimalistycznym oknie dialogowym.
   - Skala moralna (Sprawiedliwość vs Entropia vs Pragmatyzm), której stan dynamicznie odblokowuje unikalne ścieżki i prowadzi do jednego z 4 zakończeń gry.
4. **Stół Rzemieślniczy (Runecrafting & Alchemia)**:
   - Łączenie ziół, esencji i odłamków runicznych w potężne glify, eliksiry i klucze logiczne.
5. **Taktyczna Walka Turowa**:
   - Przejście do widoku walki: gracz zarządza talią run (Atak, Ochrona, Pętla Czasu, Osłabienie) i punktami Eteru. Przeciwnicy posiadają przewidywalne intencje z telegrafowaniem kolejnego ruchu.
6. **Centrum Ustawień, Bezpieczeństwo i Administracja**:
   - Pulpit audytu (RODO / GDPR: pobranie wszystkich danych w CSV, usunięcie konta "Prawo do bycia zapomnianym").
   - Panel analityki w czasie rzeczywistym (czas sesji, rozwiązane zagadki, zużycie surowców).
   - Panel symulacji płatności (odblokowanie edycji kolekcjonerskiej / dodatkowych rozdziałów).

### Identyfikacja Wizualna i Paleta
- **Styl**: Mroczny pixel art, wysoki kontrast, precyzyjne oświetlenie punktowe pochodni i run.
- **Paleta barw (60-30-10)**:
  - 60% Tło i lochy: Głęboki grafit, bazalt i ciemny obsydian (`#0a0b10`, `#12151f`).
  - 30% Elementy strukturalne i interfejs: Kamienne płyty, pergamin, ciemna stal (`#1c2130`, `#2b334a`).
  - 10% Akcenty runiczne i ogień: Mistyczny błękit eteryczny (`#38bdf8`), szkarłatna krew (`#f43f5e`), runiczny bursztyn (`#f59e0b`).
- **Typografia**:
  - Tytuły i nagłówki: Wyrazisty krój displayowy / pixel-fantasy (`Cinzel` / retro monospace font fallback).
  - Teksty dialogowe i treść: Czytelny `Plus Jakarta Sans` / `Cinzel Decorative` z doskonałym kontrastem.
  - Liczby i statystyki: `font-mono tabular-nums`.

---

## 3. Key Product Decisions & Trade-Offs

### Architektura Domenowa (DDD & SOLID)
- **Decyzja**: Absolutny rozdział domeny (`src/domain/`) od widoku React (`src/presentation/` i canvas viewport).
- **Dlaczego**: Spełnia żelazne zasady prompta (brak "God Classes", SRP, metody < 25 linii, pliki < 200 linii). Umożliwia łatwe testowanie jednostkowe i uniezależnia mechanikę gry od frameworka renderującego.
- **Alternatywa odrzucona**: Trzymanie stanu gry w `useState` wewnątrz pojedynczego komponentu Game.tsx (tzw. monolithic god-component).

### Trwałość Danych i PWA Offline
- **Decyzja**: Repozytorium oparte o IndexedDB opakowane w interfejs `IGameStorageService`, z buforowaniem offline, rejestracją Service Workera i automatyczną detekcją powrotu do sieci (auto-sync queue).
- **Dlaczego**: Zapewnia natychmiastowe ładowanie, brak zależności od zewnętrznych awarii sieci, pełną zgodność z PWA i spełnienie wymogów zadania.

### Uwierzytelnianie, Bezpieczeństwo i RODO
- **Decyzja**: Implementacja modułów `WebAuthnSecurityService` (biometria) i `TotpAuthService` (2FA) z bezpiecznym haszowaniem w pamięci/lokalnym skarbcu, panel zarządzania zgodnością z RODO (eksport JSON/CSV, usuwanie danych).
- **Dlaczego**: Pełna realizacja wszystkich punktów specyfikacji użytkownika z zachowaniem standardów bezpieczeństwa bez konieczności zewnętrznego płatnego backendu.

---

## 4. Technical Architecture & Data Strategy

### Diagram Architektury Systemowej

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            PRESENTATION LAYER (UI)                          │
│                                                                             │
│  ┌───────────────────────┐  ┌──────────────────────┐  ┌──────────────────┐  │
│  │   PixelCanvasViewport │  │   TurnCombatView     │  │ DialogueModal    │  │
│  │ (2.5D TopDown Canvas) │  │ (Runic Cards & Mana) │  │ (Branching Tree) │  │
│  └───────────▲───────────┘  └──────────▲───────────┘  └────────▲─────────┘  │
│              │                         │                       │            │
│  ┌───────────┴─────────────────────────┴───────────────────────┴─────────┐  │
│  │             GameShellContainer (State Controller & HUD)               │  │
│  │     PWA Install · Sound Toggle · Language Switcher · Weather HUD      │  │
│  └─────────────────────────────────────▲─────────────────────────────────┘  │
└────────────────────────────────────────┼────────────────────────────────────┘
                                         │ EventBus / Subscriptions
┌────────────────────────────────────────┼────────────────────────────────────┐
│                             DOMAIN LAYER (PURE TS)                          │
│                                                                             │
│  ┌────────────────────┐   ┌─────────────────────┐   ┌────────────────────┐  │
│  │   GameEngine       │   │   WeatherSystem     │   │  MoralChoiceEngine │  │
│  │ (Tick, Grid, Move) │   │ (Rain, Fog, Storm)  │   │ (Affinity & Karma) │  │
│  └─────────┬──────────┘   └──────────┬──────────┘   └─────────┬──────────┘  │
│            │                         │                        │             │
│  ┌─────────┴──────────┐   ┌──────────┴──────────┐   ┌─────────┴──────────┐  │
│  │  CombatService     │   │  CraftingService    │   │  QuestManager      │  │
│  │ (Cards, Turns, AI) │   │ (Recipes & Alch)    │   │ (Puzzles & State)  │  │
│  └────────────────────┘   └─────────────────────┘   └────────────────────┘  │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │ Dependency Injection
┌────────────────────────────────────────┴────────────────────────────────────┐
│                         INFRASTRUCTURE & PERSISTENCE                        │
│                                                                             │
│  ┌────────────────────┐   ┌─────────────────────┐   ┌────────────────────┐  │
│  │ IndexedDbStorage   │   │  SecurityService    │   │  AnalyticsService  │  │
│  │ (Saves & Off-Sync) │   │ (WebAuthn, 2FA, CSV)│   │ (Real-Time Metrics)│  │
│  └────────────────────┘   └─────────────────────┘   └────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Kluczowe Interfejsy i Kontrakty (DIP)

1. `IGameEngine`: Zarządza ruchem, pozycją runomistrza, wykrywaniem kolizji na siatce kafelkowej i łamigłówkami.
2. `ICombatEngine`: Steruje fazami turowymi, talią run, zużyciem punktów skupienia/krwi oraz SI wrogów.
3. `IWeatherController`: Modeluje zmienne warunki atmosferyczne i ich efekty na statystyki.
4. `IDialogueManager`: Przechodzi przez drzewo dialogowe z uwzględnieniem dotychczasowych wyborów moralnych.
5. `ICraftingSystem`: Sprawdza receptury, zużywa surowce z ekwipunku i wytwarza przedmioty.
6. `ISecurityService`: Obsługuje uwierzytelnianie biometryczne, 2FA i eksport audytowy CSV (RODO).
7. `IAudioSynth`: Proceduralny syntezator Web Audio API generujący mroczne brzmienia, uderzenia i chimes.
8. `IGamepadService`: Nasłuchuje zdarzeń kontrolera zewnętrznego (Gamepad API) i mapuje na akcje.
