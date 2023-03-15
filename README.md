# RECIPETORY

## Aplikacja do wyszukiwania przepisów kulinarnych.

https://recipetory.netlify.app/ - link do hostowanej aplikacji na portalu Netlify

Projekt przedstawia zdobyte umiejętności po ukończeniu kursu "Vue - The Complete Guide (incl. Router & Composition API) - Maximilian Schwarzmüller".
Zawartość projektu wykorzystuje wszystkie zagadnienia zawarte w kursie dotyczące projektowania stron za pomocą frameworku Vue 3.

#### Użyte technologie:

- Vue 3 - Composition API
- Vue Router
- Vuex
- Css & HTML
- Edamam API
- Firebase

### Funkcjonalność strony:

1. Wyszukiwarka przepisów

- walidacja danych wyszukiwania
- możliwość sortowania oraz filtrowania wyników
- paginacja

2. Przeglądanie przepisu

- pobieranie danych o przepisie z zewnętrznego API
- możliwość przeliczania składników do ilości porcji

  po zalogowaniu:

- możliwość oceny (zliczanie średniej ocen użytkowników) oraz dodania komentarza
- dodawanie oraz usuwanie przepisów z ulubionych

  (dane przechowywane w Firebase)

3. Tworzenie konta i logowania w aplikacji

- rejestracja użytkownika
- walidacja danych użytkownika
- funkcja auto-logowania oraz auto-wylogowywania
- bezpieczne przechowywanie haseł w usłudze Firebase

4. Inne

- przechowywanie stanu aplikacji w "store" (vuex)
- użycie Vue Routera oraz zastosowanie "guard clause"
- wykorzystanie dynamicznych komponentów
- wykorzystanie innych funkcji Vue typu transition, teleport, keep-alive, props, injections
- responsywność z urządzeniami mobilnymi

#### Screenshots

- strona główna

<p align="center">
  <img src="/src/screenshots/1.png" />
</p>

- wyszukiwarka przepisów

<p align="center">
  <img src="/src/screenshots/2.png" />
</p>

- wybrany przepis

<p align="center">
  <img src="/src/screenshots/3.png" />
</p>

- menu w wersji mobilnej

<p align="center">
  <img src="/src/screenshots/4.png" />
</p>

#### Komendy

```
npm run build
npm run serve
npm install
```

### Przypisy

- Jakub Szklarski
- EDAMAM

### Kontakt

jakubszklarski1@gmail.com
