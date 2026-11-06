# VoxelCraft 3D: Otwarty Świat Wokselowy w stylu Minecraft

Kompleksowa transformacja gry w trójwymiarowy, proceduralny świat wokselowy inspirowany grą Minecraft, zbudowany w technologii Three.js z widokiem pierwszoosobowym (FPV), niszczeniem i stawianiem klocków, fizyką poruszania się i kolizji, autentycznym interfejsem HUD (serduszka życia, pasek głodu, 9-slotowy hotbar), animowaną ręką gracza, cyklem dnia/nocy oraz systemem rzemiosła (crafting 2x2 i 3x3).

## User Review & Critical Decisions

> [!IMPORTANT]
> Kluczowe decyzje dotyczące przejścia z widoku 2D na pełny świat 3D (Three.js):

- **Perspektywa i styl wizualny**: Pełne 3D w stylu Minecraft (kamera FPV, celownik `+`, proceduralne klocki wokselowe z proceduralnymi teksturami bez zewnętrznych linków, animowana ręka w prawym dolnym rogu reagująca na uderzenia).
- **Interakcja ze światem**: Raycasting z celownika z podświetleniem obwódki wskazywanego klocka (wireframe box). Lewy przycisk myszy / przycisk mobilny kopie klocek, prawy przycisk stawia wybrany klocek z hotbara.
- **Fizyka gracza**: Płynny ruch FPV (WASD), grawitacja, skok (Spacja), kolizje AABB z klockami terenu, PointerLockControls na desktopie oraz wirtualny joystick na urządzeniach mobilnych.
- **HUD i Crafting**: 10 serduszek życia, 10 pałek głodu, 9 slotów hotbara, okno ekwipunku i rzemiosła pod klawiszem 'E' (receptury: deski, patyki, stół rzemieślniczy, kilofy, pochodnie).
- **Zapis i tryb offline**: Zapis modyfikacji bloków i ekwipunku w IndexedDB z buforowaniem offline.
- **Zasady SOLID & SRP**: Wszystkie nowe pliki poniżej 200 linii, metody poniżej 25 linii, ścisłe typowanie bez typu `any`.

---

## 1. Overview & Core Concept

- **Czym jest gra**: W pełni grywalna gra w otwartym świecie wokselowym 3D, w której gracz eksploruje proceduralnie generowany świat (trawa, ziemia, kamień, węgiel, żelazo, drewno, liście, woda), wydobywa surowce, wytwarza narzędzia i buduje własne konstrukcje.
- **Klimat**: Przetrwanie w otwartym świecie z cyklem dobowym (wschód, zenit, zachód, mroźna noc z księżycem i gwiazdami).
- **Wartość dla gracza**: Autentyczne doświadczenie Minecrafta bezpośrednio w przeglądarce, z natychmiastowym ładowaniem, bez instalacji i z obsługą urządzeń mobilnych.

---

## 2. User Experience & Visual Design

### Ścieżka użytkownika (User Flow)
1. **Pojawienie się w świecie**: Gracz pojawia się na powierzchni zielonego wzgórza z widokiem na drzewa, jezioro i pasma górskie.
2. **Sterowanie FPV**: Kliknięcie w ekran blokuje wskaźnik myszy (PointerLock). Mysz steruje rozglądaniem się, klawisze WASD ruchem, Spacja skokiem. Na urządzeniach mobilnych wyświetlany jest ergonomiczny joystick i przyciski akcji.
3. **Wydobycie i budowanie**:
   - Skierowanie celownika na klocek wyświetla czarną siatkę selekcji.
   - Przytrzymanie/kliknięcie lewego przycisku wykonuje zamach ręką i niszczy klocek, dodając go do ekwipunku.
   - Prawy przycisk myszy stawia klocek z aktywnego slotu hotbara na sąsiedniej wolnej ścianie.
4. **Zarządzanie Ekwipunkiem i Rzemiosło**:
   - Klawisz 'E' otwiera siatkę ekwipunku z polami craftingu 2x2 (zamiana pni dębu na deski, desek na patyki, stół rzemieślniczy itp.).
   - Klawisze 1–9 lub kółko myszy zmieniają aktywny przedmiot w dłoni.
5. **Cykl Dobowy i Środowisko**:
   - Słońce i księżyc poruszają się po nieboskłonie, dynamicznie zmieniając kolor światła kierunkowego i mgłę horyzontu.

### Styl Wizualny i UI
- **Tekstury klocków**: 100% proceduralne generowane w Canvas 16x16 (trawa, ziemia, kamień, kora dębu, liście, deski, węgiel, woda).
- **HUD Minecrafta**:
  - Pasek zdrowia (10 serduszek).
  - Pasek głodu (10 ikonek pożywienia).
  - Pasek szybkiego wyboru (9 slotów w szarej ramce z podświetleniem aktywnego).
  - Klasyczny celownik krzyżakowy na środku ekranu.

---

## 3. Key Product Decisions & Trade-Offs

### Architektura Świata Wokselowego (Three.js Instanced / Chunk Mesh)
- **Wybór**: Użycie `THREE.InstancedMesh` dla każdego typu bloku (lub połączonej geometrii ścian) ze słownikiem wokseli o stałym rozmiarze świata (np. 32x16x32 klocków) zoptymalizowanym pod kątem 60 fps na przeglądarkach mobilnych.
- **Dlaczego**: Tradycyjne tworzenie pojedynczych obiektów `THREE.Mesh` dla każdego klocka zabiłoby wydajność (tysiące draw calls). `InstancedMesh` pozwala na renderowanie tysięcy bloków w zaledwie 5-8 draw calls z płynnymi 60 klatkami na sekundę.

### Fizyka i Kolizje (Custom Voxel AABB)
- **Wybór**: Lekki silnik kolizji prostopadłościanów (AABB) sprawdzający sąsiadujące woksele wokół pozycji gracza.
- **Dlaczego**: Zapewnia precyzyjne wchodzenie na klocki o wysokości 1, brak przenikania przez ściany i realistyczny skok bez konieczności ładowania ciężkich zewnętrznych silników fizyki typu Cannon.js czy Ammo.js.

### Zapis w IndexedDB
- **Wybór**: Serializacja tylko zmodyfikowanych klocków (różnicowy format mapy) oraz stanu ekwipunku.
- **Dlaczego**: Zapewnia natychmiastowy zapis i odczyt (< 5ms) bez zaśmiecania pamięci przeglądarki.

---

## 4. Technical Architecture & Data Strategy

### Diagram Architektury Systemowej

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PRESENTATION & 3D VIEWPORT LAYER                      │
│                                                                             │
│  ┌───────────────────────┐  ┌──────────────────────┐  ┌──────────────────┐  │
│  │   VoxelWorldCanvas    │  │   MinecraftHUD       │  │ InventoryOverlay │  │
│  │ (Three.js FPV Scene)  │  │ (Hearts, Hunger, Bar)│  │ (2x2 / 3x3 Craft)│  │
│  └───────────▲───────────┘  └──────────▲───────────┘  └────────▲─────────┘  │
│              │                         │                       │            │
│  ┌───────────┴─────────────────────────┴───────────────────────┴─────────┐  │
│  │                     VoxelGameContainer (App Shell)                    │  │
│  │        PointerLock · Key Listener · Touch Controls · Audio Synth      │  │
│  └─────────────────────────────────────▲─────────────────────────────────┘  │
└────────────────────────────────────────┼────────────────────────────────────┘
                                         │ State & Event Dispatch
┌────────────────────────────────────────┼────────────────────────────────────┐
│                        DOMAIN VOXEL CORE ENGINE (PURE TS)                   │
│                                                                             │
│  ┌────────────────────┐   ┌─────────────────────┐   ┌────────────────────┐  │
│  │    VoxelWorld      │   │   PlayerPhysics     │   │   VoxelRaycaster   │  │
│  │ (Terrain & Blocks) │   │  (AABB, Gravity)    │   │  (Mine & Place)    │  │
│  └─────────┬──────────┘   └──────────┬──────────┘   └─────────┬──────────┘  │
│            │                         │                        │             │
│  ┌─────────┴──────────┐   ┌──────────┴──────────┐   ┌─────────┴──────────┐  │
│  │  TextureGenerator  │   │   VoxelCrafting     │   │   DayNightCycle    │  │
│  │ (Pixel Textures)   │   │  (Block Recipes)    │   │   (Sun & Moon)     │  │
│  └────────────────────┘   └─────────────────────┘   └────────────────────┘  │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │ Persistence
┌────────────────────────────────────────┴────────────────────────────────────┐
│                       PERSISTENCE & AUDIO INFRASTRUCTURE                    │
│                                                                             │
│  ┌────────────────────┐   ┌─────────────────────┐   ┌────────────────────┐  │
│  │  VoxelStorage      │   │  WebAudioVoxelSynth │   │  MobileTouchDock   │  │
│  │ (IndexedDB Delta)  │   │ (Mine, Place, Step) │   │ (Joystick & Action)│  │
│  └────────────────────┘   └─────────────────────┘   └────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Podział Modułów (Wszystkie pliki < 200 linii, metody < 25 linii)
1. `src/domain/voxel/types.ts`: Definicje typów bloków (Grass, Dirt, Stone, Wood, Leaves, Planks, Coal, Water), dane gracza, hotbar, receptury.
2. `src/domain/voxel/VoxelWorld.ts`: Siatka wokseli, generator terenu (wzgórza, drzewa), metody `getBlock(x,y,z)`, `setBlock(x,y,z,type)`.
3. `src/domain/voxel/PlayerPhysics.ts`: Wektor prędkości, grawitacja, kolizje AABB z wokselami, testy podłoża (`onGround`).
4. `src/domain/voxel/TextureAtlas.ts`: Proceduralne generowanie pikselowych tekstur klocków w stylu Minecraft (trawa, ziemia, kamień, drewno).
5. `src/domain/voxel/CraftingRecipes.ts`: Receptury rzemieślnicze (drewno -> deski, deski -> patyki, stół, narzędzia).
6. `src/infrastructure/audio/VoxelAudio.ts`: Proceduralne odgłosy kroków po trawie/kamieniu, kopania i stawiania bloków.
7. `src/presentation/components/VoxelCanvas.tsx`: Montowanie Three.js, PointerLock, pętla renderowania, animowane ramię gracza.
8. `src/presentation/components/MinecraftHUD.tsx`: Pasek serduszek, głodu, celownik, 9 slotów hotbara.
9. `src/presentation/components/VoxelInventoryModal.tsx`: Siatka ekwipunku z craftingiem 2x2.
10. `src/App.tsx`: Główny koordynator gry łączący silnik z widokiem i zapisem w IndexedDB.
