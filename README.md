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

- walidacja danych użytkownika
- funkcja autologowania oraz autowylogowywania
- bezpieczne przechowywanie haseł w usłudze Firebase

Strona jest responsywna.

#### Screenshots

![Alt text](/src/screenshots/1.png?raw=true "Strona główna")

![Alt text](/src/screenshots/2.png?raw=true "Wyszukiwarka przepisów")

![Alt text](/src/screenshots/3.png?raw=true "Wybrany przepis")

![Alt text](/src/screenshots/4.png?raw=true "Menu w wersji mobilnej")

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
