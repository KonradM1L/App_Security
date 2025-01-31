Praca dla Aspekty bezpieczeństwa w programowaniu, Konrad Milewski 159826

# Platforma Edukacyjna Bezpieczeństwa Cyfrowego

Zaawansowana platforma edukacyjna demonstrująca podstawowe koncepcje bezpieczeństwa cyfrowego poprzez interaktywne przykłady i wizualizacje. Projekt ma na celu praktyczne przedstawienie zagadnień związanych z szyfrowaniem, bezpieczną komunikacją i potencjalnymi zagrożeniami.

## 🚀 Główne Funkcje

1. **Moduł Szyfrowanej Komunikacji**
   - Szyfrowanie wiadomości w czasie rzeczywistym
   - Wizualizacja procesu szyfrowania
   - Historia zaszyfrowanych wiadomości

2. **Symulator Ataków**
   - Demonstracja ataku Man-in-the-Middle
   - Porównanie zabezpieczonej i niezabezpieczonej komunikacji
   - Interaktywna symulacja różnych scenariuszy ataków

3. **Interaktywny Tutorial**
   - Krok po kroku wprowadzenie do bezpieczeństwa cyfrowego
   - Praktyczne ćwiczenia
   - Natychmiastowa informacja zwrotna

4. **Dokumentacja Techniczna**
   - Szczegółowy opis wykorzystanych algorytmów
   - Analiza potencjalnych zagrożeń
   - Implementowane zabezpieczenia

## 🛠️ Technologie

- **Frontend:**
  - React + TypeScript
  - Shadcn/ui dla komponentów
  - Socket.io-client dla komunikacji w czasie rzeczywistym
  - Framer Motion dla animacji

- **Backend:**
  - Express.js
  - Socket.io dla WebSocket
  - PostgreSQL + Drizzle ORM
  - CryptoJS dla operacji kryptograficznych

## 📦 Instalacja

1. Sklonuj repozytorium
```bash
git clone [url-repozytorium]
cd [nazwa-folderu]
```

2. Zainstaluj zależności
```bash
npm install
```

3. Skonfiguruj bazę danych
```bash
npm run db:push
```

4. Uruchom aplikację
```bash
npm run dev
```

## 🏗️ Struktura Projektu

```
├── client/                # Kod frontendu
│   ├── src/
│   │   ├── components/   # Komponenty React
│   │   ├── pages/        # Strony aplikacji
│   │   └── lib/          # Narzędzia i utilities
├── server/               # Kod backendu
│   ├── routes.ts        # Endpointy API
│   ├── socket.ts        # Obsługa WebSocket
│   └── encryption.ts    # Logika szyfrowania
└── db/                  # Warstwa bazy danych
    └── schema.ts        # Schema Drizzle
```

## 🔐 Implementacja Zabezpieczeń

### Algorytmy Szyfrowania
- **AES (Advanced Encryption Standard)**
  - Szyfrowanie symetryczne
  - Klucz 256-bitowy
  - Implementacja poprzez CryptoJS

### Zabezpieczenia przed Atakami
- Walidacja danych wejściowych
- Parametryzowane zapytania SQL
- Rate limiting
- Szyfrowanie end-to-end dla komunikacji

## 🤝 Rozwój Projektu

Zapraszamy do współpracy! Aby zgłosić błąd lub zaproponować nową funkcjonalność:
1. Utwórz nowy Issue
2. Opisz propozycję lub problem
3. W przypadku zmian w kodzie, utwórz Pull Request

## 📄 Licencja

Ten projekt jest udostępniony na licencji MIT.

## ⚠️ Disclaimer

Ta aplikacja służy celom edukacyjnym i demonstracyjnym. Nie powinna być używana w środowisku produkcyjnym bez dodatkowych zabezpieczeń.
