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

## Bugs / caveats

Noen ganger ser plasseringen av markører på kartet mistenkelig forskjøvet ut. Etter litt undersøkelse tror jeg at det skjer fordi forespørselen til APIen som genererer markørene har en limit verdi. Dersom det er mange søkeresultater for området brukeren ser på, kan grensen nås før kartet er fyllt, og de første søkeresultatene er samlet rundt en mindre del av kartet. Da ser det ut som at søkeområdet er feil, men det er egentlig en høflig limit satt på API-forespørselen, og området som undersøkes har veldig mange søkeresultater.

## Distribusjon og sikkerhet

Prosjektet publiseres til GitHub Pages ved bruk av GitHub Actions som bygger siden med Vite.

Vite pakker sammen og optimiserer assets, fjerner eventuell ubrukt kode, og flater ut sirkulære avhengigheter. Under bygging vurderes filstørrelser og bundles sammen avhengig av om størrelsene gjør det hensiktsmessig, for å redusere nettverkstraffikk.

API-nøkler lagres lokalt som miljøvariabler i en `.env` fil, filen ignoreres ved pushing til GitHub via `.gitignore`, og nøkler gjøres tilgjengelig for GitHub Actions via GitHub Environment Secrets. Nøklene er ikke tilgjengelige i selve GitHub repositoiriet.

GitHub Pages lar oss ikke kjøre vår egen backend, så Vite omgjør prosjektet til en statisk nettside, dermed blir nøkler tilgjengelig til slutt dersom nettsiden er offentlig og noen ser godt nok etter. Nøkler må til slutt være en del av forespørslene, og uten vår egen backend kan de ikke fullstendig skjules.

Tilgang til å bruke API-nøklene er begrenset via API-tilbydernes konfigurasjonssider hvor prosjektets adresse er lagt til som eneste tillatte opphav, men API-tilbydere baserer sin vurdering av forespørslenes opphav på HTTP-headere som brukeren selv kan manipulere.

Bare en av API-tilbyderne som brukes her krever noen nøkkel, og denne tilbyderen begrenser gratis-kontoers antall daglige forespørsler. Stjeling av gratis-nøkler er uønsket men vurderes til å ha begrenset skadeomfang i dette tilfellet.
