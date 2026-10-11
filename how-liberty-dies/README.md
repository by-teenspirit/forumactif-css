# how liberty dies — feuille de style et scripts

Habillage du forum Forumactif **How Liberty Dies** (thème ModernBB).

| Fichier | Rôle |
| --- | --- |
| `hld.css` | Partie 2/2 de la maquette : ce qui était dans le `<style>` d'`overall_header`, plus tout l'habillage des pages internes |
| `hld.js` | Les scripts du `<head>` et les reconstructions DOM (voir plus bas) |

La **partie 1/2** de la maquette vit dans le CSS principal du forum (Affichage ▸ Couleurs ▸ Feuille de style CSS). Elle n'est pas ici.

## Ce que fait `hld.js`

Deux scripts d'origine — ouverture des notifications et du menu profil, calage de la hauteur de la PA (`--pa-col2`) — et six reconstructions ajoutées ensuite. Toutes **déplacent les nœuds existants**, elles n'en recréent aucun : les liens, les `onclick` et les formulaires de Forumactif survivent.

| Bloc | Ce qu'il fait | Pourquoi pas en CSS |
| --- | --- | --- |
| Grille des groupes (`/groups`) | Transforme le tableau en cartes, `--gc` pris sur `.usr_grp_clr` | `display:contents` sur un `tr` avec `rowspan` fait mal calculer la hauteur du tableau dans Chrome |
| Fiche de profil (`/u1`) | Assemble l'en-tête, les tuiles et les champs | idem : tableaux imbriqués |
| Barres d'onglets | Profil et messagerie, même fonction sur deux sélecteurs | Les liens sont des frères sans conteneur |
| Colonne « Humeur » | Retirée de la liste des membres | — |
| QEEL | Texte d'arrivée raccourci, les deux `.qeel_boite` échangées | — |
| Colonne auteur d'un sujet | Regroupe la valeur de chaque champ dans un `span`, étiquette le champ (`data-champ`, `data-type`), enveloppe la citation multiple dans `.hld_mq` | La valeur d'un champ est une suite de nœuds texte et d'`img` séparés par des `<br>` : rien à cibler en CSS |
| Bloc des partenaires | Recrée le `<summary>` et remonte le `<ul>` dans le `<details>` au rendu | SCEditor, qui édite le message d'accueil, ne connaît pas `<details>` : il éjecte le `<ul>` et vide le `<summary>` à chaque enregistrement |
| Description d'un sujet | Descend le `<span class="genmed">` dans `.gwf_sujets_titre`, sous l'auteur | Forumactif le pose en frère du bloc titre, donc il devient une colonne à part dans le flex de la ligne |

## Comment le forum charge ces fichiers

Dans `overall_header`, juste avant `</head>` :

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/by-teenspirit/forumactif-css@<SHA>/how-liberty-dies/hld.css" />
<script src="https://cdn.jsdelivr.net/gh/by-teenspirit/forumactif-css@<SHA>/how-liberty-dies/hld.js" defer></script>
```

`<SHA>` est le hash du commit, **jamais `@main`** : une URL figée à un commit est immuable, donc jsDelivr la sert tout de suite. `@main` est renvoyé avec `Cache-Control: max-age=604800`, soit 7 jours dans le navigateur des visiteurs, et la purge jsDelivr est limitée à un appel toutes les 30 minutes environ.

## Publier une modification

1. Éditer le fichier ici et committer.
2. Copier le hash du nouveau commit (page Commits).
3. Dans `overall_header`, remplacer l'ancien hash par le nouveau, **enregistrer puis publier** le template.
4. Recharger le forum.

L'étape 3 n'est pas facultative : sans changement d'URL, rien ne sort. Et l'étape 4 non plus : tant que le template n'est pas *publié* (le nom passe de rouge à vert dans la liste), le forum sert toujours l'ancienne version.

La zone d'édition d'un template est pilotée par **CodeMirror**. Écrire dans le `<textarea name="template">` ne sert à rien : l'éditeur écrase sa valeur au moment de l'envoi. Il faut passer par l'instance, exposée en `window.editor` :

```js
window.editor.setValue(window.editor.getValue().replace(ancienHash, nouveauHash));
```

L'interface web de GitHub **refuse environ une écriture sur deux** avec « You can't perform that action at this time ». C'est une limitation de débit, pas un problème de jeton : attendre 20 à 60 secondes et refaire l'envoi complet. Passer par l'éditeur (`/edit/main/…`) n'y change rien.

### Remplacer un fichier dans l'éditeur de GitHub

L'éditeur de GitHub est un **CodeMirror 6 virtualisé** : seules les lignes
visibles existent dans le DOM. « Tout sélectionner puis coller » n'est donc pas
fiable — quand la sélection ne couvre que les lignes rendues, le collage
**ajoute une seconde copie du fichier** au lieu de le remplacer, et ça ne se
voit qu'au diff (`@@ -630,3 +630,663 @@` au lieu de `+630,32`).

L'instance n'est pas exposée en `cmView` comme dans un CodeMirror standard ;
GitHub la range sous `cmTile`. On la récupère depuis n'importe quelle ligne :

```js
const vue = document.querySelector('.cm-line').cmTile.dom.cmTile.parent.view;
vue.dispatch({ changes: { from: 0, to: vue.state.doc.length, insert: texte } });
```

Et comme `vue.state.doc.toString()` rend le document entier, on peut vérifier
l'empreinte **avant** de committer :

```js
const t = vue.state.doc.toString();
crypto.subtle.digest('SHA-256', new TextEncoder().encode(t))
  .then(b => console.log(Array.from(new Uint8Array(b))
    .map(x => x.toString(16).padStart(2,'0')).join('')));
```

Reconstruire le contenu en repartant d'une URL **figée au commit**
(`raw.githubusercontent.com/…/<SHA>/…`), jamais de `main` : le CDN sert `main`
avec plusieurs minutes de retard et on réécrirait alors par-dessus le commit
précédent.

Dernier détail : dans la boîte de dialogue de commit, le message est pré-rempli
par Copilot **en anglais et en différé**. Le remplacer trop tôt ne sert à rien,
la suggestion arrive après et écrase. Attendre qu'elle soit là, puis écrire le
message, puis valider. Et viser le bon champ : `document` contient aussi la
recherche de fichiers de la colonne de gauche, qui est le premier
`input[type=text]` de la page.

## Pourquoi ces fichiers sont sortis du forum

- Le **CSS principal** est plein : Forumactif refuse silencieusement l'enregistrement au-delà d'environ 65 000 caractères, et il en fait déjà 63 410.
- Le `<style>` du template `overall_header` se **réinitialise à sa valeur par défaut** au-delà d'environ 52 000 caractères ; la limite sûre est 49 000.
- La « Gestion du CSS additionnel » de Forumactif est réservée aux packages Avancé et Premium. HLD est en Package Gratuit, donc cette voie est fermée.

## À ne pas toucher dans `overall_header`

- Le `<style>` du bloc `switch_ticker_new`, plus haut dans le `<head>` : il masque le menu d'origine de Forumactif.
- Le bloc `<!-- HLD-NAV -->` et son script `hldNav()` en bas du template : il construit la barre de navigation et doit rester avec son markup.

## Points de vigilance

- **L'ordre compte.** `hld.css` est chargé après le CSS principal du forum : il le surcharge. Ne pas remonter le `<link>` dans `overall_header`.
- Le CSS principal utilise des sélecteurs `body :is(#id, …)` (1-0-1), `html body :is(…)` et des **id par élément** (`#ongle_dieux`, 1-0-0). Une règle d'ici perd contre eux si elle ne reprend pas la même forme de sélecteur — ou, quand un id impose une valeur, sans `!important`.
- **Piège du raccourci après la propriété longue** : `overflow:hidden` écrit après `overflow-y:auto` dans la même règle tue le défilement sans rien signaler. C'est arrivé deux fois sur `#fa_menulist` ; d'où `overflow-x:hidden` à la source.
- `#fa_menulist` doit rester en `position:absolute`. Le passer en `relative` le sort du positionnement absolu, le fait rentrer dans le flux de la barre de navigation et démonte tout l'en-tête.
- La hauteur de la PA est calculée par script (`--pa-col2`) à partir de `.hld_col2`. Ne pas la figer en dur : elle survit ainsi à l'ajout ou au retrait d'un bouton.
- Le bloc publicitaire `#prebid1fr728x90` (728×90, entre la bannière et le contenu) fait partie des conditions d'utilisation de Forumactif. Il n'est pas masqué, et le bandeau de 93 px sous la bannière vient de lui, pas d'une marge.

### Deux techniques interdites sur ces tableaux

- **`table-layout:fixed`** : Forumactif mélange des lignes à 2 colonnes et des lignes à 7 colonnes dans un même `table`. En `fixed`, tout est découpé en sept parts égales — la page d'un groupe s'est retrouvée avec des colonnes de 114 px. La largeur se contraint autrement : `table.forumline{width:100%}` plus `max-width:100%` sur les champs.
- **`white-space:nowrap` sur un `th`** : « Envoyer un nouveau message privé » imposait alors 819 px à `/post` et `/privmsg`, qui débordaient. Ce n'était nécessaire qu'à cause de `fixed`.

### Ce qui n'est pas réglable d'ici, mais l'est ailleurs

La fenêtre « connectés durant les dernières 24 heures » est calculée côté
serveur au moment où Forumactif génère `{LOGGED_IN_USER_LIST}` : ni la feuille
de style ni les scripts ne peuvent y toucher. En revanche elle **est** réglable
dans le panneau d'administration, en **Affichage ▸ Page d'accueil ▸
Généralités** (`period_connected_members`, à 24). Ce n'est pas dans Général ▸
Forum ▸ Configuration, où on la cherche d'abord.

## Vérifier avant de committer

```bash
npm install css-tree
node -e "
const c=require('css-tree'), fs=require('fs');
let err=[]; const ast=c.parse(fs.readFileSync('hld.css','utf8'),{positions:true,onParseError(e){err.push(e.message)}});
let r=0; c.walk(ast,n=>{if(n.type==='Rule')r++});
console.log('règles:',r,'| erreurs:',err.length); err.forEach(e=>console.log(' !',e));
"
```

État de référence : 468 règles, 6 `@media`, 0 erreur.

## Perdre contre le CSS principal

`0-ltr.css` — qui contient la feuille de base ModernBB **et** le CSS principal du
forum — est un `<link>` du `<head>`, alors que celui de `hld.css` est posé dans
le `<body>`. `hld.css` est donc bien le dernier servi et l'emporte à spécificité
égale : les règles d'ici qui n'ont eu aucun effet ont toutes perdu sur la
**spécificité**, pas sur l'ordre.

| Ce qu'il écrit | Spécificité | Ce qu'il faut ici |
|---|---|---|
| `:root{--f2:…}` | (0,1,0) | `html:root` — `body` seul vaut (0,0,1) et perd |
| `:is(.systab .tab,…,.elevator a)` | (0,2,0) | `body .elevator a[href]` — l'attribut compte comme une classe |
| `.gwf_lastpost > span > span > a:not([title])` | (0,2,3) | `body .gwf_lastpost a.last-post-icon[href]` |
| `.gwf_desc{font:…}` | (0,1,0) | `body .gwf_desc` — un raccourci `font` écrase `font-size` |

Attention aussi au piège inverse : une règle d'`hld.css` qui reprend exactement
le sélecteur d'une autre règle d'`hld.css`, posée **plus haut** dans le fichier,
gagne — c'est l'ordre qui tranche. D'où les ajouts en fin de fichier.

Et toutes les feuilles ne sont pas lisibles depuis la console : `hld.css` vient
de jsDelivr, donc `sheet.cssRules` lève une erreur dessus. Parcourir
`document.styleSheets` pour trouver « qui gagne » ne montre qu'une partie du
tableau. Quand une déclaration refuse de s'appliquer sans explication, le test
qui tranche est `el.style.setProperty('…','…','important')` : si ça bouge, c'est
qu'un `!important` est posé ailleurs — c'est le cas des liens de la barre
Forumactif, à qui une feuille servie par Forumactif impose `display:block`.

## Deux blocs publicitaires, pas un

Outre `#prebid1fr728x90` (728×90, entre la bannière et le contenu), un invité
reçoit `#pa81541e`, qui porte `#prebid2fr300x250` et `#prebid3fr300x250`. Ils
font partie des conditions d'utilisation du Package Gratuit : ils ne sont pas
masqués.

## Deux sessions distinctes

Être connectée au forum ne suffit pas pour le panneau d'administration : il a sa
propre expiration et renvoie alors sur `/admin/login.php`. La session du forum,
elle, reste valide — d'où le cas déroutant où le forum affiche « bienvenue » et
où `/admin/` rebascule sur une page de connexion.
