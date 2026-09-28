# LGDC RPG — fiches

Sources des fiches codées pour **La Guerre des Clans RPG**
(`https://laguerredesclans-rpg.forumsactifs.com/`).

## Rangement

    lgdc/<personne>/<fiche>/

Un dossier par personne, puis un dossier par fiche, pour qu'une même personne
puisse en avoir plusieurs (`fiche-rp`, `fiche-evolution`, …) sans mélange.
Les variantes d'une même fiche (`index2.html`, `fiche-2.html`, `*.min.html`)
restent ensemble, elles partagent la même feuille de style.

| Personne | Fiche            | Ancien dépôt                    |
|----------|------------------|---------------------------------|
| spirit   | fiche-rp         | `LGDC-fiche-rp-spirit`          |
| biket    | fiche-rp         | `LGDC-fiche-rp-biket`           |
| lys      | fiche-rp         | `LGDC-fiche-rp-lys`             |
| orenji   | fiche-rp         | `fiche-rp-orenji`               |
| kirby    | fiche-evolution  | `LGDC-fiche-evolution-kirby`    |
| krys     | fiche-evolution  | `LGDC-fiche-evolution-krys`     |
| espe     | fiche-evolution  | `LGDC-fiche-evolution-espe`     |
| dusky    | fiche-evolution  | `LGDC-fiche-evolution-dusky`    |

`krys/fiche-evolution/` contient aussi `fiche-rp.html` et `fiche-rp.min.html` :
les deux fiches partageaient un seul `style.css` dans le dépôt d'origine, elles
sont restées ensemble pour ne pas casser ce lien.

Le gabarit générique non rattaché à une personne (`RPG-fiche-rp`) est dans
`divers/fiche-rp-generique/`.

## Ce que ces fichiers sont — et ne sont pas

Ce sont des **sources de travail** : gabarits avec du lorem ipsum et des
« nom du chat », prévus pour être ouverts en local. Le `<link href="style.css">`
y est relatif, il ne fonctionne que dans le dossier.

Le forum ne charge **rien** depuis GitHub : vérifié le 28/09/2026 sur le DOM
complet de l'index (615 ko) et par recherche dans les messages — aucune
occurrence de `by-teenspirit`, `githubusercontent`, `github.io` ni `jsdelivr`.
Les styles des fiches vivent sur le forum lui-même : la feuille commune
`lgdc_fiches.css` et le `<style>` collé dans chaque message.

Déplacer ou renommer ces dépôts ne casse donc aucune fiche en ligne.
