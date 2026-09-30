# forumactif-css

Sources des forums Forumactif que je personnalise : feuilles de style, scripts
et fiches, **un dossier par forum**.

| Dossier | Forum | Contenu | Chargé par le forum ? |
|---|---|---|---|
| [`how-liberty-dies/`](how-liberty-dies/) | [How Liberty Dies](https://how-liberty-dies.forumactif.com/) (ModernBB) | `hld.css`, `hld.js` | **Oui**, via jsDelivr |
| [`lgdc/`](lgdc/) | [La Guerre des Clans RPG](https://laguerredesclans-rpg.forumsactifs.com/) | Fiches codées, un dossier par personne | Non — sources de travail |
| [`divers/fiche-rp-generique/`](divers/fiche-rp-generique/) | — | Gabarit de fiche RP non rattaché à une personne | Non |
| `adwad.css` | a dream within a dream (ModernBB) | Toute la feuille du forum | **À vérifier**, voir plus bas |

Chaque dossier a son propre README avec ce qui lui est particulier. Celui-ci ne
dit que ce qui vaut pour tout le dépôt.

## Deux natures de fichiers

Le dépôt mélange deux choses qui ne se manipulent pas pareil, et c'est la
première question à se poser avant de toucher à un fichier.

**Ce que le forum charge en direct** — `how-liberty-dies/`, `adwad.css`. Un
commit ici change le forum en ligne dès que l'URL est mise à jour dans le
template. Voir la procédure ci-dessous.

**Les sources de travail** — `lgdc/`, `divers/`. Des gabarits avec du lorem
ipsum, prévus pour être ouverts en local ; leur `<link href="style.css">` est
relatif. Le forum ne charge rien depuis GitHub : les styles de ces fiches
vivent sur le forum lui-même. On peut les déplacer ou les renommer sans rien
casser en ligne.

## Publier une modification sur un forum qui charge d'ici

Le `<link>` est posé dans le template `overall_header`, juste avant `</head>`,
et il est **figé au hash d'un commit** :

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/by-teenspirit/<dépôt>@<SHA>/<chemin>" />
```

`<SHA>`, jamais `@main`. Une URL figée à un commit est immuable, donc jsDelivr
la sert tout de suite. `@main` est renvoyé avec `Cache-Control: max-age=604800`
— sept jours dans le navigateur des visiteurs — et la purge jsDelivr est
limitée à un appel toutes les trente minutes environ.

1. Éditer le fichier et committer.
2. Copier le hash du nouveau commit (page *Commits*).
3. Dans `overall_header`, remplacer l'ancien hash, **enregistrer puis publier**
   le template.
4. Recharger le forum.

L'étape 3 n'est pas facultative : sans changement d'URL, rien ne sort. La
publication non plus — tant que le nom du template est rouge dans la liste, le
forum sert l'ancienne version ; il doit passer au vert.

> **Ne jamais reconstruire un fichier à partir de `@main` sur le CDN.** Il peut
> être périmé de plusieurs commits, et on écrase alors du travail. Repartir du
> dépôt, ou d'une URL figée au commit.

### La zone d'édition d'un template est pilotée par CodeMirror

Écrire dans le `<textarea name="template">` ne sert à rien : l'éditeur écrase
sa valeur au moment de l'envoi. Il faut passer par l'instance, exposée en
`window.editor` :

```js
window.editor.setValue(window.editor.getValue().replace(ancienHash, nouveauHash));
```

## Pourquoi le code est ici et pas dans le panneau d'administration

Forumactif **tronque silencieusement** une feuille de style au-delà d'environ
65 000 caractères, et un template se réinitialise à sa valeur par défaut
au-delà d'environ 52 000. La « Gestion du CSS additionnel », qui contournerait
le problème, est réservée aux packages Avancé et Premium.

Le dépôt a un autre avantage : on versionne, on revient en arrière, et on écrit
dans un vrai éditeur au lieu d'une zone de texte.

## Ce qui vaut pour tous les forums

- **L'ordre compte.** Le fichier est chargé *après* la feuille de base du
  thème : il la surcharge. Ne pas remonter le `<link>` dans `overall_header`.
- **Ne jamais utiliser `table-layout:fixed`** sur les tableaux de Forumactif :
  il mélange des lignes à 2 colonnes et des lignes à 7 colonnes dans un même
  `table`, et tout se découpe en sept parts égales. La largeur se contraint par
  `width:100%` sur la table plus `max-width:100%` sur les champs.
- **Ni `white-space:nowrap` sur un `th`** : un libellé long impose alors sa
  largeur à toute la page.
- **Le bloc publicitaire** (`#prebid1fr728x90` et équivalents) fait partie des
  conditions d'utilisation de Forumactif. Il n'est pas masqué.
- **L'interface web de GitHub refuse environ une écriture sur deux** avec
  « You can't perform that action at this time ». C'est une limitation de
  débit : attendre 20 à 60 secondes et refaire l'envoi complet.

## Vérifier une feuille avant de committer

```bash
npm install css-tree
node -e "
const c=require('css-tree'), fs=require('fs');
let err=[]; const ast=c.parse(fs.readFileSync(process.argv[1],'utf8'),{positions:true,onParseError(e){err.push(e.message)}});
let r=0,m=0; c.walk(ast,n=>{if(n.type==='Rule')r++;if(n.type==='Atrule'&&n.name==='media')m++});
console.log('règles:',r,'| @media:',m,'| erreurs:',err.length); err.forEach(e=>console.log(' !',e));
" <fichier.css>
```

États de référence : `how-liberty-dies/hld.css` 421 règles / 6 `@media`,
`adwad.css` 676 règles / 21 `@media`, 0 erreur dans les deux cas.

## Point en suspens : `adwad.css`

Le fichier est à la racine, et non dans un dossier `adwad/` comme les autres
forums. Surtout, il existe **en double** : `by-teenspirit/weak-and-geek` en
contient une copie au même octet près, et c'est ce dépôt-là que nomme le
`<link>` documenté pour ce forum.

Tant que ce n'est pas tranché, le risque est d'éditer la copie qui n'est pas
servie et de ne rien voir changer. Deux sorties possibles : soit on déplace le
fichier dans `adwad/` ici et on repointe le template sur ce dépôt, soit on
supprime la copie d'ici et `weak-and-geek` reste la source. À décider avant la
prochaine modification d'ADWAD.
