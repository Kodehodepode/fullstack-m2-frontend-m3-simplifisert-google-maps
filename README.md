# Forenklet versjon av Google Maps

Demonstrerer burk av et rammeverk (Leaflet) og kombinasjon av flere APIer

[Oppgavetekst](OPPGAVE.md)

## APIer

* OpenStreetMap (via LeafletJS)
* GeoApify GeoCode
* GeoApify Places

**LeafletJS** sørger for å rendrere et interaktivt kart og lar oss plassere informasjon på kartet

**OpenStreetMap** tilbyr selve kartet i form av lastbare firkanter som LeafletJS benytter seg av

**GeoCode** lar oss søke opp stedsnavn og finne stedets koordinater

**Places** gir oss informasjon om steder i nærheten av et koordinat

## Stack

**Vite** pakker sammen og optimiserer assets, fjerner eventuell ubrukt kode, og flater ut sirkulære avhengigheter. Under bygging vurderes filstørrelser og bundles sammen avhengig av om størrelsene gjør det hensiktsmessig, for å redusere nettverkstraffikk.

**GitHub Actions** bygger Vite-prosjektet hver gang det pushes til `main` i repositoriet.

Prosjektet publiseres til **GitHub Pages**.

## Gjennomføring

Diverse funksjoner er laget som kaller APIer for å finne informasjon om området som ses på. Disse brukes av en funksjon som oppdaterer markører på karted basert på filtre / kategorier brukeren velger. Denne funksjonen kjøres når en kategori velges. I tillegg er en `event-listener` er registrert på kart-elementet som kjører samme funksjon når brukeren har flyttet på kartet.

En tekstboks kan spesifisere et sted brukeren ønsker å søke opp / hoppe til. Når søket gjennomføres flyttes kartet til stedet navngitt i tekstboksen, og event-listener'en som trigges av flytting av kartet tar seg av å kjøre oppdatering av markørene igjen.

## Bugs / caveats

Noen ganger ser plasseringen av markører på kartet mistenkelig mangelfull ut. Etter litt undersøkelse tror jeg at det kan være to årsaker til dette:

Fordi forespørselen til APIen som genererer markørene har en limit verdi, kan grensen nås før kartet fylles jevnt dersom det er velig mange søkeresultater i området. De første resultatene er da samlet rundt en mindre del av kartet selv om flere resultater ville fyllt et større område. Da ser det ut som at søkeområdet er feil.

Det ser også ut som at APIen ikke alltid sender fullstendige svar, selv om http-responsen er i orden (fullstendig JSON string). Å flytte bittelitt på kartet (trigge ny forespørsel) fyller på med manglende markører uten å vesentlig endre søkeområdet, så det kan hende serveren av og til begrenser sin respons.

Ellers vet jeg ikke hva som er årsaken til tidvis mangelfull markering av kartet. Jeg ser samme problemet ved bruk av andre tjenester (Finn, Propr, 1881, etc) hvor jeg flytter bittelitt på kartet og får nye resultater midt på bildet, så kanskje det har en naturlig forklaring i at APIene har en tidsbegrensning på generering av svar eller andre optimiseringer som av og til reduserer antallet søkeresultater. Eller kanskje har koden min en ordentlig face-palm type logisk feil.

## Distribusjon og sikkerhet

Prosjektet publiseres til GitHub Pages ved bruk av GitHub Actions som bygger siden med Vite.

API-nøkler lagres lokalt som miljøvariabler i en `.env` fil, filen ignoreres ved pushing til GitHub via `.gitignore`, og nøkler gjøres tilgjengelig for GitHub Actions via GitHub Environment Secrets. Nøklene er ikke tilgjengelige i selve GitHub repositoiriet.

GitHub Pages lar oss ikke kjøre vår egen backend, så Vite omgjør prosjektet til en statisk nettside, dermed blir nøkler tilgjengelig til slutt dersom nettsiden er offentlig og noen ser godt nok etter. Nøkler må til slutt være en del av forespørslene, og uten vår egen backend kan de ikke fullstendig skjules.

Tilgang til å bruke API-nøklene er begrenset via API-tilbydernes konfigurasjonssider hvor prosjektets adresse er lagt til som eneste tillatte opphav, men API-tilbydere baserer sin vurdering av forespørslenes opphav på HTTP-headere som brukeren selv kan manipulere.

Bare en av API-tilbyderne som brukes her krever noen nøkkel, og denne tilbyderen begrenser gratis-kontoers antall daglige forespørsler. Stjeling av gratis-nøkler er uønsket men vurderes til å ha begrenset skadeomfang i dette tilfellet.
