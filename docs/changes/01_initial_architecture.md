# Architektura Rozwiązania: Shadows of Aethelgard

## 1. Zgodność z zasadami SOLID
- **SRP (Single Responsibility Principle)**: Wszystkie klasy mają ściśle wydzieloną jedną odpowiedzialność. Silnik fizyki/siatki (`GameEngine`) odpowiada wyłącznie za mechanikę kafelków, kolizje i logikę zagadek. Silnik walki (`CombatEngine`) zarządza turami i kalkulacjami ran. System pogody (`WeatherSystem`) zarządza cyklem aury. Żaden z nich nie modyfikuje DOM ani Reacta.
- **OCP (Open/Closed Principle)**: Nowe receptury rzemieślnicze, karty runiczne, stany pogody i węzły dialogowe są dodawane jako deklaratywne definicje danych bez modyfikacji kodu wykonawczego silnika.
- **LSP (Liskov Substitution Principle)**: Zewnętrzne usługi pamięci (`IStorageService`), audio (`IAudioService`) i bezpieczeństwa (`ISecurityService`) są w pełni zamienne ze swoimi implementacjami testowymi lub alternatywnymi adapterami.
- **ISP (Interface Segregation Principle)**: Każdy interfejs jest wąski i celowy (np. `IWeatherSystem`, `ICombatEngine`, `ICraftingSystem`).
- **DIP (Dependency Inversion Principle)**: Moduły wysokiego poziomu zależą wyłącznie od interfejsów, które są wstrzykiwane w konstruktorze lub fabrykach.

## 2. Podział Warstw (Clean Architecture)
- `src/domain/types/`: Czyste definicje struktur danych, unii i typów wyliczeniowych.
- `src/domain/interfaces/`: Kontrakty interfejsowe dla silników i serwisów.
- `src/domain/engine/`: Czyste algorytmy TypeScript bez zależności od frameworków widoku.
- `src/infrastructure/`: Adaptery sprzętowe i przeglądarkowe (IndexedDB, Web Audio API, WebAuthn, Gamepad API).
- `src/presentation/`: Czyste komponenty React (HUD, Canvas Viewport, Modale), które subskrybują stan domeny.

## 3. Limity Rygoru Architektonicznego
- Maksymalna długość pliku: do 200 linii kodu.
- Maksymalna długość metody/funkcji: do 25 linii kodu.
- Całkowity zakaz typu `any`.
