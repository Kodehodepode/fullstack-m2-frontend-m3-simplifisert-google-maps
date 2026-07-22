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

## Gjennomføring

En funksjon er laget som oppdaterer markører på karted basert på filtre / kategorier brukeren velger. Funksjonen kjøres når en kategori velges. En `event-listener` er registrert på kart-objektet som kjører funksjonen når brukeren har flyttet på kartet. En tekstboks kan spesifisere et sted brukeren ønsker å hoppe til. Når søket gjennomføres flyttes kartet til stedet navngitt i tekstboksen, og samme `event-listener` tar seg av å oppdatere markørene igjen.

## Distribusjon og sikkerhet

Prosjektet publiseres til GitHub Pages ved bruk av GitHub Actions som bygger siden med Vite.

Vite pakker sammen og optimiserer assets, fjerner eventuell ubrukt kode, og flater ut sirkulære avhengigheter. Under bygging vurderes filstørrelser og bundles sammen avhengig av om størrelsene gjør det hensiktsmessig, for å redusere nettverkstraffikk.

API-nøkler lagres lokalt som miljøvariabler i en `.env` fil, filen ignoreres ved pushing til GitHub via `.gitignore`, og nøklen gjøres tilgjengelig for GitHub Actions via GitHub Environment Secrets.

GitHub Pages lar oss ikke kjøre vår egen backend, Vite omgjør prosjektet til en statisk nettside. Tilgang til å bruke API-nøklene begrenses noe via API-tilbydernes konfigurasjonssider hvor prosjektets adresse er lagt til som eneste tillatte opphav.

API-tilbydere baserer sin vurdering av forespørslenes opphav på HTTP-headere som brukeren selv kan manipulere og det er generelt sett ikke trygt å bruke private nøkler som sluttbrukeren kan se.

Nøklene er tilgjengelige via brukeres nettleser ved å inspisere kode generert av Vite, eller overvåke nettverksforespørsler. API-forespørsler som sendes må til slutt inneholde nøklene, så nøkler kan ikke være hemmelige uten å kjøre API-forespørslene fra en backend.

API-tilbyderne som brukes her, begrenser gratis-kontoers antall daglige forespørsler. Gratis-nøkler kan opprettes av hvem som helst. Stjeling av gratis-nøkler er likevel uønsket men vurderes til å ha begrenset skadeomfang.
