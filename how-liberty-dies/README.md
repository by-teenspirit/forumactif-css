# how liberty dies — feuille de style et scripts

Habillage du forum Forumactif **How Liberty Dies** (thème ModernBB).

| Fichier | Rôle |
| --- | --- |
| `hld.css` | Partie 2/2 de la maquette : tout ce qui était dans le `<style>` du template `overall_header` |
| `hld.js` | Les deux scripts du `<head>` : ouverture des notifications et du menu profil, calage de la hauteur de la PA |

La **partie 1/2** de la maquette vit dans le CSS principal du forum (Affichage ▸ Couleurs ▸ Feuille de style CSS). Elle n'est pas ici.

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

L'étape 3 n'est pas facultative : sans changement d'URL, rien ne sort.

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

État de référence : 264 règles, 5 `@media`, 0 erreur.
