# DEMENTOR CLUB — POLITYKA PRYWATNOŚCI

Status: `DRAFT / LEGAL REVIEW REQUIRED`
Version: `v0.2`
Updated: `2026-08-28`
Language: `PL — master draft`

## 1. Administrator danych

Administratorem danych osobowych jest:

`[PEŁNA NAZWA JDG]`

adres: `[ADRES]`
NIP: `[NIP]`
e-mail privacy: `[PRIVACY EMAIL]`

Dalej: **Administrator** albo **Dementor Club**.

## 2. Jakie dane mogą być przetwarzane

W zależności od używanej funkcji serwisu mogą być przetwarzane w szczególności:

### Konto i logowanie

- adres e-mail;
- imię/nazwa profilu przekazana przez dostawcę logowania;
- identyfikatory konta i sesji;
- dane techniczne związane z uwierzytelnieniem.

Aktualna architektura przewiduje Google OAuth oraz Supabase Auth.

### Assessment / diagnostyka Dementor Club

- wybrane odpowiedzi;
- wynik assessment;
- identyfikator sfery i wersji assessment;
- data ukończenia;
- dane historii wyników, jeżeli użytkownik jest zalogowany i synchronizacja jest aktywna.

Assessment ma charakter klubowy/kulturowy i nie powinien prosić o szczególne kategorie danych osobowych, chyba że istnieje osobna, zatwierdzona potrzeba prawna i produktowa.

### Koszyk i zamówienia

- produkty/SKU;
- wariant, rozmiar, ilość;
- cena;
- dane koszyka;
- dane identyfikujące zamówienie;
- imię i nazwisko / dane odbiorcy;
- e-mail lub inne zatwierdzone dane kontaktowe;
- kraj, miasto i adres dostawy, jeżeli są wymagane;
- notatka do zamówienia;
- indywidualna specyfikacja produktu, np. `OWNER MARK`;
- status płatności, identyfikator/referencja płatności;
- dane potrzebne do wystawienia dokumentu sprzedaży lub faktury;
- historia reklamacji, zwrotów i obsługi zamówienia.

Nie należy przechowywać pełnych danych instrumentu płatniczego, jeżeli płatność obsługuje zewnętrzny dostawca i nie jest to niezbędne.

### Kontakt

- treść wiadomości;
- adres e-mail / nazwa konta kontaktowego;
- inne dane dobrowolnie podane w korespondencji.

### Dane techniczne i bezpieczeństwo

- adres IP i logi techniczne, jeżeli są generowane przez hosting/backend;
- informacje o błędach, sesji i bezpieczeństwie;
- dane niezbędne do ochrony serwisu przed nadużyciami.

## 3. Cele i podstawy prawne

Dane mogą być przetwarzane w szczególności w celu:

### wykonania umowy lub działań przed zawarciem umowy

Podstawa: art. 6 ust. 1 lit. b RODO.

Dotyczy m.in. konta, koszyka, zamówienia, personalizacji, dostawy, realizacji usługi, komunikacji bezpośrednio związanej z zamówieniem.

### realizacji obowiązków prawnych

Podstawa: art. 6 ust. 1 lit. c RODO.

Dotyczy m.in. obowiązków księgowych, podatkowych, dokumentowania sprzedaży, rozpatrywania praw konsumenckich oraz udostępniania danych uprawnionym organom, gdy wymagają tego przepisy.

### prawnie uzasadnionego interesu Administratora

Podstawa: art. 6 ust. 1 lit. f RODO.

Może obejmować m.in.:

- ochronę przed nadużyciami;
- bezpieczeństwo systemów;
- ustalenie, dochodzenie lub obronę roszczeń;
- zachowanie dowodu wersji regulaminu i specyfikacji zaakceptowanej przez klienta;
- niezbędne logi operacyjne;
- podstawową analizę błędów produktu, jeżeli nie wymaga zgody na urządzeniu końcowym.

### zgody

Podstawa: art. 6 ust. 1 lit. a RODO, tylko gdy zgoda jest rzeczywiście właściwą podstawą, np. dla określonych działań marketingowych lub niekoniecznych technologii śledzących.

Nie należy wymuszać checkboxa „zgadzam się na Politykę Prywatności” jako podstawy przetwarzania danych niezbędnych do realizacji zamówienia. Polityka Prywatności ma przede wszystkim informować; podstawą dla danych zamówienia jest zwykle umowa lub obowiązek prawny.

## 4. Odbiorcy danych

Dane mogą być ujawniane podmiotom, które wspierają Administratora, wyłącznie w zakresie niezbędnym do danego celu, w szczególności:

- dostawcy backendu/bazy i uwierzytelniania, obecnie Supabase;
- Google jako dostawcy OAuth, jeżeli użytkownik wybiera logowanie Google;
- dostawcy hostingu i infrastruktury strony, obecnie Vercel / powiązana infrastruktura;
- dostawcy płatności lub bankowi Operatora;
- księgowości;
- dostawcom i firmom kurierskim;
- producentom/podwykonawcom, jeśli do wykonania indywidualnego produktu potrzebują określonej części specyfikacji;
- doradcom prawnym, podatkowym i technicznym;
- organom publicznym, gdy obowiązek wynika z prawa.

Dane `OWNER MARK` należy przekazywać producentowi tylko w zakresie niezbędnym do wykonania graweru/personalizacji. Jeżeli treść może nie być prawdziwym imieniem, nie należy traktować jej jako danych potrzebnych do innych celów.

## 5. Transfery poza EOG

Niektórzy dostawcy technologiczni mogą przetwarzać dane poza Europejskim Obszarem Gospodarczym lub korzystać z infrastruktury globalnej.

Przed publikacją produkcyjną należy zweryfikować faktyczne regiony przetwarzania dla Supabase, Google i Vercel oraz wskazać właściwy mechanizm transferu, jeżeli ma zastosowanie, np. decyzję stwierdzającą odpowiedni stopień ochrony, EU-US Data Privacy Framework dla certyfikowanego odbiorcy lub standardowe klauzule umowne wraz z wymaganymi zabezpieczeniami.

Nie wolno publikować ogólnego zdania „dane nie opuszczają UE”, jeśli konfiguracja tego nie potwierdza.

## 6. Okres przechowywania

Dane są przechowywane nie dłużej niż jest to potrzebne do celu i obowiązków prawnych.

Kategorie do doprecyzowania przed produkcją:

- konto: do usunięcia konta + okres techniczny/roszczeniowy;
- assessment: do usunięcia profilu/konkretnego wyniku lub przez okres uzasadniony funkcją historii;
- koszyk anonimowy: zgodnie z okresem localStorage lub do jego usunięcia przez użytkownika;
- zamówienia/sprzedaż: przez okres wymagany przez prawo podatkowe, rachunkowe, konsumenckie i przedawnienie roszczeń;
- dowód personalizacji i akceptacji warunków: co najmniej przez okres potrzebny do obrony/realizacji praw wynikających z umowy;
- reklamacje: przez okres obsługi oraz okres roszczeniowy;
- korespondencja: przez okres potrzebny do celu rozmowy i ewentualnych roszczeń;
- logi bezpieczeństwa: przez krótki, zdefiniowany okres adekwatny do ryzyka.

Dokładne okresy muszą zostać zatwierdzone w produkcyjnej wersji polityki.

## 7. Prawa osoby

W granicach wynikających z RODO osobie mogą przysługiwać prawa do:

- dostępu do danych;
- sprostowania;
- usunięcia;
- ograniczenia przetwarzania;
- przenoszenia danych;
- sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie;
- cofnięcia zgody w dowolnym momencie, gdy przetwarzanie opiera się na zgodzie, bez wpływu na zgodność wcześniejszego przetwarzania z prawem;
- wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.

Żądania można kierować na `[PRIVACY EMAIL]`.

Nie każde żądanie usunięcia powoduje natychmiastowe usunięcie całej dokumentacji sprzedaży, jeśli przepisy wymagają jej dalszego przechowywania.

## 8. LocalStorage, cookies i podobne technologie

Aktualna architektura Dementor Club korzysta z pamięci przeglądarki m.in. dla funkcji użytkowych.

Znane klucze/procesy obejmują m.in.:

- `dementorClubOnboardingV3` — stan lokalny assessment/onboarding;
- `dementorClubCartV1` — anonimowy koszyk lokalny;
- dane sesyjne niezbędne do uwierzytelniania Supabase/Google zgodnie z implementacją bibliotek.

Technologie ściśle niezbędne do świadczenia funkcji wyraźnie żądanej przez użytkownika mogą być stosowane bez odrębnej zgody w zakresie dopuszczonym przez Prawo komunikacji elektronicznej.

Nieistotne analityczne, reklamowe, marketingowe i profilujące technologie wymagają wcześniejszego zbadania podstawy i — gdy prawo tego wymaga — zgody przed zapisaniem/odczytem informacji z urządzenia.

Jeżeli takie technologie zostaną dodane, należy wdrożyć prawidłowy consent layer przed ich uruchomieniem i zaktualizować niniejszą Politykę.

## 9. Profilowanie i decyzje automatyczne

Assessment może automatycznie przeliczać odpowiedzi i prezentować wynik według zdefiniowanej logiki produktu. Samo wygenerowanie klubowego wyniku/portretu nie powinno być przedstawiane jako decyzja wywołująca skutki prawne lub podobnie istotnie wpływająca na osobę.

Jeżeli w przyszłości automatyczne profilowanie będzie wykorzystywane do cen, odmowy dostępu, istotnych uprawnień lub innych decyzji o znaczącym wpływie, należy przeprowadzić odrębną analizę RODO i obowiązków informacyjnych.

## 10. Bezpieczeństwo

Administrator stosuje adekwatne środki organizacyjne i techniczne stosownie do ryzyka, w szczególności kontrolę dostępu, ograniczenie zakresu danych, bezpieczne uwierzytelnianie i właściwe zarządzanie uprawnieniami backendu.

Publiczny frontend nie może zawierać sekretów, service-role keys ani innych poufnych credentiali.

## 11. Dzieci

Serwis nie powinien świadomie zbierać danych dzieci do płatnych produktów lub profilu bez odrębnie zatwierdzonej podstawy, mechaniki wieku i zasad zgody/opiekuna tam, gdzie są wymagane.

Przed wprowadzeniem produktów kierowanych do osób małoletnich należy przygotować osobny legal flow.

## 12. Zmiany Polityki

Polityka może być aktualizowana wraz ze zmianą funkcji serwisu, dostawców, podstaw prawnych lub obowiązków.

Wersja publikacyjna powinna zawierać datę wejścia w życie i być dostępna w sposób umożliwiający użytkownikowi zapoznanie się z aktualną treścią.