/* La barre Forumactif n'attache aucun gestionnaire au lien Notifications
   une fois deplace dans la barre du theme : on rebranche l'ouverture. */
(function(){
  function proche(el,sel){ while(el && el.nodeType===1){ if(el.matches && el.matches(sel)) return el; el=el.parentElement; } return null; }
  document.addEventListener('click', function(e){
    var liste=document.getElementById('notif_list');
    if(!liste) return;
    if(proche(e.target,'#fa_notifications')){
      e.preventDefault();
      liste.style.display = (getComputedStyle(liste).display==='none') ? 'block' : 'none';
    } else if(!proche(e.target,'#notif_list')){
      liste.style.display='none';
    }
  }, false);
  /* le rond ouvre le menu du profil : c'est un span sans action, et
     relayer le clic vers #fa_welcome entrait en conflit avec le
     gestionnaire de la barre Forumactif. On pilote la liste. */
  document.addEventListener('click', function(e){
    var liste=document.getElementById('fa_menulist');
    if(!liste) return;
    if(proche(e.target,'#hld_ava')){
      e.preventDefault();
      var avm=document.querySelector('#fa_usermenu img');
      if(avm && !avm.complete){ avm.loading='eager'; avm.src=avm.src; }
      liste.style.display=(getComputedStyle(liste).display==='none')?'block':'none';
    } else if(!proche(e.target,'#fa_menulist') && !proche(e.target,'#fa_welcome')){
      liste.style.display='';
    }
  }, false);
})();


(function(){
  function calePA(){
    var pa=document.querySelector('.gwf_pa'), c=document.querySelector('.hld_col2');
    if(!pa||!c) return;
    var k=c.children, g=parseFloat(getComputedStyle(c).rowGap)||0, h=0;
    for(var n=0;n<k.length;n++){ h+=k[n].offsetHeight; }
    h+=(k.length-1)*g;
    if(h>60){ pa.style.setProperty('--pa-col2', h+'px'); }
  }
  if(document.readyState!=='loading'){ calePA(); }
  else { document.addEventListener('DOMContentLoaded', calePA); }
  window.addEventListener('load', calePA);
  window.addEventListener('resize', calePA);
})();

/* Les cinq raccourcis du bas portent des libelles Forumactif trop longs
   pour tenir sur une ligne dans les 800px de la carte : on les raccourcit
   ici, par leur adresse et non par leur texte, pour rester robuste. */
(function(){
  var courts=[
    ['mark=forums','Tout marquer comme lu'],
    ['activetopics','Sujets actifs'],
    ['today_posters','Top 20 du jour'],
    ['overall_posters','Top 20 du forum'],
    ['delete_cookies','Cookies']
  ];
  function renomme(){
    var liens=document.querySelectorAll('a.gensmall');
    for(var i=0;i<liens.length;i++){
      var h=liens[i].getAttribute('href')||'';
      for(var j=0;j<courts.length;j++){
        if(h.indexOf(courts[j][0])>-1){ liens[i].textContent=courts[j][1]; break; }
      }
    }
  }
  if(document.readyState!=='loading'){ renomme(); }
  else { document.addEventListener('DOMContentLoaded', renomme); }
})();

/* Page des groupes : Forumactif rend chaque groupe dans une ligne de tableau,
   avec un td[rowspan] qui empeche toute mise en grille en CSS (display:contents
   sur tr fausse le calcul de hauteur du tableau). On reconstruit donc une vraie
   grille de blocs, en DEPLACANT les noeuds d'origine : liens et formulaires
   eventuels restent intacts. La couleur du groupe est portee par --gc. */
(function(){
  function grilleGroupes(){
    var tables=document.querySelectorAll('#page-body table.forumline');
    for(var i=0;i<tables.length;i++){
      var t=tables[i];
      if(!t.querySelector('a.usr_grp_clr') || t.getAttribute('data-hld-grp')) continue;
      var bloc=document.createElement('div');
      bloc.className='hld_groupes';
      var titre=t.querySelector('th');
      if(titre){
        var h=document.createElement('div');
        h.className='hld_groupes_titre';
        h.textContent=(titre.textContent||'').trim();
        bloc.appendChild(h);
      }
      var grille=document.createElement('div');
      grille.className='hld_groupes_grille';
      var cells=t.querySelectorAll('td');
      for(var j=0;j<cells.length;j++){
        var a=cells[j].querySelector('a.usr_grp_clr');
        if(!a) continue;
        var carte=document.createElement('div');
        carte.className='hld_groupe';
        carte.style.setProperty('--gc', a.style.color || 'var(--fn)');
        a.className='hld_groupe_nom';
        carte.appendChild(a);
        var info=cells[j].querySelector('div');
        if(info){
          var nb=info.querySelector('span[id^="nb-users"]');
          var n=nb?(info.textContent.match(/(\d+)\s*$/)||[])[1]:'';
          var statut=(info.textContent||'').split('-')[0].trim();
          if(statut){
            var p1=document.createElement('p');
            p1.className='hld_groupe_info';
            p1.textContent=statut;
            carte.appendChild(p1);
          }
          if(n){
            var p2=document.createElement('p');
            p2.className='hld_groupe_nb';
            p2.textContent=n+' '+(n==='1'?'membre':'membres');
            carte.appendChild(p2);
          }
        }
        grille.appendChild(carte);
      }
      bloc.appendChild(grille);
      t.setAttribute('data-hld-grp','1');
      t.parentNode.insertBefore(bloc, t);
      t.style.display='none';
    }
  }
  if(document.readyState!=='loading'){ grilleGroupes(); }
  else { document.addEventListener('DOMContentLoaded', grilleGroupes); }
})();

/* Les liens de contact perdent leur image au profit d'une icone CSS :
   on reporte l'alt d'origine en title pour garder l'infobulle. */
(function(){
  function infobulles(){
    var imgs=document.querySelectorAll('#page-body a > img[src*="icon_pm"],#page-body a > img[src*="icon_email"],#page-body a > img[src*="icon_www"],#page-body a > img[src*="presentation.gif"]');
    for(var i=0;i<imgs.length;i++){
      var a=imgs[i].parentElement, alt=imgs[i].getAttribute('alt');
      if(a && alt && !a.getAttribute('title')) a.setAttribute('title', alt);
    }
  }
  if(document.readyState!=='loading'){ infobulles(); }
  else { document.addEventListener('DOMContentLoaded', infobulles); }
})();

/* Page de profil : Forumactif la rend en tableaux imbriques de paires
   libelle / valeur. On la reconstruit en fiche — bandeau teinte par la couleur
   du groupe, avatar en grand, tuiles de statistiques, champs en liste — en
   DEPLACANT les noeuds d'origine, donc liens, images et champs restent intacts.
   Les champs vides (valeur "-") sont retires. */
(function(){
  var ICO={'Holomessages':'forum','Points de faction':'military_tech','Date d’inscription':'event',"Date d'inscription":'event','Dernière visite':'schedule','Messages':'forum','Date d’enregistrement':'event'};
  function ficheProfil(){
    var t=null;
    var tables=document.querySelectorAll('#page-body table.forumline');
    for(var i=0;i<tables.length;i++){ if(tables[i].querySelector('h1.h_member')) t=tables[i]; }
    if(!t || t.getAttribute('data-hld-profil')) return;

    var nomSpan=t.querySelector('.usr_grp_clr');
    var couleur=(nomSpan && nomSpan.style.color) ? nomSpan.style.color : 'var(--fn)';
    var nom=nomSpan?(nomSpan.textContent||'').trim():'';
    if(!nom) return;

    var paires=[], lignes=t.querySelectorAll('td.row1 > table > tbody > tr');
    for(var j=0;j<lignes.length;j++){
      if(lignes[j].children.length<2) continue;
      paires.push({lab:(lignes[j].children[0].textContent||'').replace(/\s*:\s*$/,'').trim(), cell:lignes[j].children[1]});
    }
    if(!paires.length) return;

    var racine=document.createElement('div');
    racine.className='hld_profil';
    racine.style.setProperty('--gc', couleur);

    var tete=document.createElement('header'); tete.className='hld_profil_tete';
    var h=document.createElement('p'); h.className='hld_profil_nom'; h.textContent=nom; tete.appendChild(h);
    var sous=document.createElement('p'); sous.className='hld_profil_rang'; tete.appendChild(sous);
    racine.appendChild(tete);

    var corps=document.createElement('div'); corps.className='hld_profil_corps';
    var gauche=document.createElement('aside'); gauche.className='hld_profil_gauche';
    var droite=document.createElement('div'); droite.className='hld_profil_droite';
    corps.appendChild(gauche); corps.appendChild(droite);
    racine.appendChild(corps);

    var boiteAv=document.createElement('div'); boiteAv.className='hld_profil_avatar'; gauche.appendChild(boiteAv);
    var boiteCt=document.createElement('div'); boiteCt.className='hld_profil_contacts'; gauche.appendChild(boiteCt);
    var tuiles=document.createElement('div'); tuiles.className='hld_profil_stats';
    var champs=document.createElement('dl'); champs.className='hld_profil_champs';
    var meta=[], vus={};

    for(var k=0;k<paires.length;k++){
      var p=paires[k], txt=(p.cell.textContent||'').trim();
      if(/^Avatar/i.test(p.lab)){ var im=p.cell.querySelector('img'); if(im) boiteAv.appendChild(im); continue; }
      if(/^Citation/i.test(p.lab)){
        if(txt && txt!=='-'){ var q=document.createElement('blockquote'); q.className='hld_profil_citation'; q.textContent=txt; droite.appendChild(q); }
        continue;
      }
      if(/^Administrer/i.test(p.lab)){ p.cell.className='hld_profil_admin'; racine.appendChild(p.cell); continue; }
      var liensIco=p.cell.querySelectorAll('a');
      var estContact=false;
      for(var m=0;m<liensIco.length;m++){
        var img=liensIco[m].querySelector('img');
        if(img && /icon_pm|icon_email|icon_www|presentation\.gif/.test(img.getAttribute('src')||'')){
          estContact=true;
          var href=liensIco[m].getAttribute('href')||'';
          if(!vus[href]){ vus[href]=1; boiteCt.appendChild(liensIco[m]); }
        }
      }
      if(estContact) continue;
      if(ICO[p.lab]){
        var d=document.createElement('div'); d.className='hld_profil_tuile';
        var ic=document.createElement('i'); ic.className='hld_ico'; ic.textContent=ICO[p.lab]; d.appendChild(ic);
        var v=document.createElement('b'); v.textContent=(txt.split(/[\[\n]/)[0]||'').trim(); d.appendChild(v);
        var l=document.createElement('span'); l.textContent=p.lab; d.appendChild(l);
        tuiles.appendChild(d);
        continue;
      }
      if(/^(Rang|Statut)$/i.test(p.lab)){ if(txt && txt!=='-') meta.push(txt); continue; }
      if(!txt || txt==='-') continue;
      var dt=document.createElement('dt'); dt.textContent=p.lab;
      var dd=document.createElement('dd');
      while(p.cell.firstChild) dd.appendChild(p.cell.firstChild);
      var pair=document.createElement('div'); pair.className='hld_profil_champ';
      pair.appendChild(dt); pair.appendChild(dd);
      champs.appendChild(pair);
    }
    sous.textContent=meta.join(' · ');
    if(tuiles.children.length) droite.appendChild(tuiles);
    if(champs.children.length) droite.appendChild(champs);

    t.setAttribute('data-hld-profil','1');
    t.parentNode.insertBefore(racine, t);
    t.style.display='none';
  }
  if(document.readyState!=='loading'){ ficheProfil(); }
  else { document.addEventListener('DOMContentLoaded', ficheProfil); }
})();

/* Liste des membres : la colonne Humeur n'est pas utilisee sur le forum.
   On la retire par son en-tete plutot que par sa position, pour rester juste
   si Forumactif change l'ordre des colonnes. */
(function(){
  function sansHumeur(){
    var tables=document.querySelectorAll('#page-body table.forumline');
    for(var i=0;i<tables.length;i++){
      var t=tables[i], premiere=t.querySelector('tr');
      if(!premiere) continue;
      var idx=-1, ths=premiere.children;
      for(var j=0;j<ths.length;j++){ if(/^\s*Humeur\s*$/i.test(ths[j].textContent||'')) idx=j; }
      if(idx<0) continue;
      var lignes=t.querySelectorAll('tr');
      for(var k=0;k<lignes.length;k++){
        var c=lignes[k].children[idx];
        if(c) c.style.display='none';
      }
    }
  }
  if(document.readyState!=='loading'){ sansHumeur(); }
  else { document.addEventListener('DOMContentLoaded', sansHumeur); }
})();

/* Barres de navigation en onglets : le menu du panneau de profil
   (Informations | Preferences | ...) et les dossiers de la messagerie.
   Dans les deux cas l'entree courante est du texte sans lien, ce qui la rendait
   visuellement etrangere aux autres. On rebatit la barre a partir des span.gen
   de la ligne, en deplacant les liens d'origine. */
(function(){
  /* Forumactif separe ses entrees par un « | » qui fait partie du texte du
     span : « Informations | ». En onglets il n'a plus de sens, on le retire
     des deux cotes du libelle. */
  function libelle(t){
    return (t||'').replace(/^[\s|]+/,'').replace(/[\s|]+$/,'');
  }
  function barre(reperes){
    for(var r=0;r<reperes.length;r++){
      var lien=document.querySelector(reperes[r]);
      if(!lien) continue;
      var ligne=lien.closest('tr') || lien.closest('td');
      if(!ligne || ligne.getAttribute('data-hld-ong')) continue;
      var nav=document.createElement('nav');
      nav.className='hld_onglets';
      var spans=ligne.querySelectorAll('span.gen');
      for(var i=0;i<spans.length;i++){
        var a=spans[i].querySelector('a');
        if(a){
          a.className='hld_onglet';
          a.textContent=libelle(a.textContent);
          nav.appendChild(a);
        } else {
          var txt=libelle(spans[i].textContent);
          if(!txt) continue;
          var b=document.createElement('span');
          b.className='hld_onglet hld_onglet_actif';
          b.textContent=txt;
          nav.appendChild(b);
        }
      }
      if(nav.children.length<2) continue;
      var table=ligne.closest('table');
      ligne.setAttribute('data-hld-ong','1');
      table.parentNode.insertBefore(nav, table);
      table.style.display='none';
    }
  }
  function onglets(){
    /* Le repere doit exister sur toutes les pages de la messagerie. Sur
       /privmsg?folder=sentbox l'entree « Messages envoyes » est justement
       celle qui n'a pas de lien : il faut donc aussi viser la boite de
       reception, sinon la barre n'est pas reconstruite sur cette page. La
       ligne est marquee data-hld-ong, le second repere ne fait donc jamais
       le travail deux fois. */
    barre(['#page-body a.mainmenu[href*="page_profil"]','#page-body a[href$="folder=sentbox"]','#page-body a[href$="folder=inbox"]']);
  }
  if(document.readyState!=='loading'){ onglets(); }
  else { document.addEventListener('DOMContentLoaded', onglets); }
})();

/* QEEL : deux retouches demandees le 30/09.
   - la phrase d'arrivee s'arrete a "vient d'atterrir" ;
   - la liste des connectes et celle des dernieres 24h echangent de colonne.
   Les deux se font ici plutot que dans index_body pour garder toutes les
   retouches au meme endroit ; le garde-fou evite une double inversion. */
(function(){
  function qeel(){
    var q=document.querySelector('.gwf_qeel');
    if(!q || q.getAttribute('data-hld-qeel')) return;
    var n=document.querySelector('.gwf_qeel_new');
    if(n){
      for(var i=0;i<n.childNodes.length;i++){
        var nd=n.childNodes[i];
        if(nd.nodeType===3 && /atterrir/.test(nd.nodeValue)) nd.nodeValue=' vient d’atterrir';
      }
    }
    var g=document.querySelector('.gwf_qeel_bloc_gauche .qeel_boite');
    var d=document.querySelector('.gwf_qeel_bloc_droit .qeel_boite');
    if(g && d){
      var repere=document.createComment('hld');
      g.parentNode.insertBefore(repere,g);
      d.parentNode.insertBefore(g,d);
      repere.parentNode.insertBefore(d,repere);
      repere.parentNode.removeChild(repere);
    }
    q.setAttribute('data-hld-qeel','1');
  }
  if(document.readyState!=='loading'){ qeel(); }
  else { document.addEventListener('DOMContentLoaded', qeel); }
})();

/* Affichage d'un sujet : colonne auteur.
   On ne recree aucun markup, on deplace les noeuds existants : la valeur de
   chaque champ (texte nu + images, separes par des <br>) est regroupee dans
   un span pour pouvoir poser une grille libelle / valeur. Chaque champ est
   etiquete par son libelle (data-champ) et par la forme de sa valeur
   (data-type) pour que le CSS traite images, nombres et citation a part. */
(function(){
  function slug(s){
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')
            .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  }
  function colonne(col){
    if(col.getAttribute('data-hld-vt')) return;
    var a=col.querySelector('.usr_grp_clr');
    col.style.setProperty('--gc', (a && a.style && a.style.color) ? a.style.color : 'var(--fn)');
    var champs=col.querySelectorAll('.infos-posteur');
    for(var i=0;i<champs.length;i++){
      var c=champs[i];
      var lab=c.querySelector('.label');
      var nom=lab ? lab.textContent.replace(/\s*:\s*$/,'').trim() : '';
      if(nom){ c.setAttribute('data-champ', slug(nom)); lab.textContent=nom; }
      var pl=c.querySelector('.profil_label');
      var val=document.createElement('span');
      val.className='hld_champ_val';
      var n=pl ? pl.nextSibling : c.firstChild;
      while(n){
        var suiv=n.nextSibling;
        if(n.nodeName==='BR'){ c.removeChild(n); } else { val.appendChild(n); }
        n=suiv;
      }
      c.appendChild(val);
      var txt=val.textContent.replace(/\s+/g,'').trim();
      var img=val.querySelector('img');
      if(img && !txt){ c.setAttribute('data-type','image'); }
      else if(!img && /^\d{1,7}$/.test(txt)){ c.setAttribute('data-type','nombre'); }
      if(!txt && !img && !val.querySelector('a')){ c.setAttribute('data-vide','1'); }
    }
    rang(col);
    liens(col);
    col.setAttribute('data-hld-vt','1');
  }
  /* Le rang ("PNJ") est un noeud de texte nu pose apres un <br>, donc
     impossible a styler et impossible a deplacer sous le pseudo. On
     l'enveloppe dans .hld_rang et on retire les <br> : le pseudo et le rang
     deviennent deux blocs, le CSS fait le reste. .hld_chip lui donne la
     pastille de la charte, qui reste reglee dans le CSS principal. */
  function rang(col){
    var nm=col.querySelector('.gwf_viewtopic_name');
    if(!nm || nm.querySelector('.hld_rang')) return;
    var bouts=[].slice.call(nm.childNodes), dernier=-1;
    for(var b=0;b<bouts.length;b++){ if(bouts[b].nodeName==='BR') dernier=b; }
    if(dernier<0) return;
    var sp=document.createElement('span');
    sp.className='hld_rang hld_chip';
    for(var k=dernier+1;k<bouts.length;k++) sp.appendChild(bouts[k]);
    for(var j=0;j<bouts.length;j++){ if(bouts[j].nodeName==='BR' && bouts[j].parentNode===nm) nm.removeChild(bouts[j]); }
    if((sp.textContent||'').replace(/\s+/g,'')) nm.appendChild(sp);
  }
  /* Les liens de bas de colonne ne sont que des icones subsilver. On etiquette
     chaque lien par le champ dont il vient (data-lien) et le CSS ecrit le mot
     a la place de l'image. Le site web sort deux fois (gabarit prosilver +
     subsilver) : seule la premiere est gardee. */
  var ICONES=[['i_icon_profile','profil'],['i_icon_pm','mp'],
              ['icon_email','email'],['presentation.gif','presentation'],
              ['icon_www','site']];
  function liens(col){
    var as=col.querySelectorAll('.gwf_liens_profil a');
    for(var i=0;i<as.length;i++){
      var im=as[i].querySelector('img');
      if(!im) continue;
      var nom=(im.getAttribute('src')||'').split('/').pop(), cl=im.className||'';
      for(var k=0;k<ICONES.length;k++){
        if(cl.indexOf(ICONES[k][0])>-1 || nom.indexOf(ICONES[k][0])>-1){
          as[i].setAttribute('data-lien',ICONES[k][1]); break;
        }
      }
    }
  }
  function outils(){
    var mqs=document.querySelectorAll('.gwf_viewtopic_petit_titre>div>img[id^="post_mq"]');
    for(var i=0;i<mqs.length;i++){
      var im=mqs[i];
      var sp=document.createElement('span');
      sp.className='hld_mq';
      im.parentNode.insertBefore(sp, im);
      sp.appendChild(im);
    }
  }
  function sujet(){
    var cols=document.querySelectorAll('.gwf_viewtopic_left');
    for(var i=0;i<cols.length;i++) colonne(cols[i]);
    outils();
  }
  if(document.readyState!=='loading'){ sujet(); }
  else { document.addEventListener('DOMContentLoaded', sujet); }
})();

/* Page de redaction : panneau de smileys.
   Forumactif le pose dans la colonne des libelles (180px) alors qu'il en fait
   238 : il debordait sur l'editeur. On deplace le conteneur existant sous
   l'editeur — pas de markup recree, les onclick des smileys restent ceux du
   forum — et on habille le document de l'iframe, qui est sur le meme domaine
   donc accessible.

   Deux pieges : l'editeur SCEditor est construit par Forumactif apres
   DOMContentLoaded, donc on attend qu'il existe avant de chercher sa cellule ;
   et reparenter une iframe la recharge, donc le style interne est pose sur
   l'evenement load, qui sert aussi quand « Voir plus de smileys » recharge le
   panneau. */
(function(){
  var interne = 'html,body{background:#FAFAFA;margin:0;padding:0;font-family:Tahoma,sans-serif;color:#3F3F3F}'
    /* Forumactif cible la barre en #sceditor_smilies #smilies_header (deux id) :
       il faut la meme forme de selecteur pour passer devant, sinon la barre
       bleue et son back_title.gif restent. */
    + '#smilies_header,#sceditor_smilies #smilies_header{background:none;background-image:none;height:auto;font-weight:400;text-align:left;color:#3F3F3F;border:0;border-bottom:.5px solid #E0E0DD;padding:8px 10px}'
    + '#smilies_header form{margin:0;display:flex;gap:6px;align-items:center}'
    + '#smilies_header select{flex:1;min-width:0;padding:5px 8px;border:.5px solid #E0E0DD;border-radius:3px;background:#fff;font:400 11px Tahoma,sans-serif;color:#3F3F3F}'
    + '#smilies_header input{padding:5px 12px;border:.5px solid #E0E0DD;border-radius:999px;background:#fff;font:400 10px Tahoma,sans-serif;color:#3F3F3F;cursor:pointer}'
    + 'table{width:100%;border:0;border-collapse:collapse}'
    + 'td,td.row1{background:none !important;border:0;padding:10px;line-height:2.1}'
    + 'img[id^=smiley_]{margin:3px;cursor:pointer;vertical-align:middle}';

  function habiller(f){
    var d;
    try{ d = f.contentDocument; }catch(e){ return false; }
    if(!d || !d.head || !d.body || !d.getElementById('smilies_header')) return false;
    var ancien = d.getElementById('hld_smileys');
    if(ancien) ancien.parentNode.removeChild(ancien);
    var st = d.createElement('style');
    st.id = 'hld_smileys';
    st.appendChild(d.createTextNode(interne));
    d.head.appendChild(st);
    /* La hauteur ne vient plus du contenu : le panneau se cale sur celle du
       bloc d'edition (voir aligner), l'iframe fait 100% et la grille defile
       a l'interieur si elle est plus haute. */
    return true;
  }

  /* Le panneau s'arrete en meme temps que le bloc d'edition (26/10). Il
     commence plus bas que lui, sous le libelle « Corps du message » : on
     mesure donc l'ecart jusqu'au bas de l'editeur plutot que de recopier sa
     hauteur, sinon le panneau depassait d'une ligne. La hauteur de l'editeur
     dependant de sa largeur, on remesure au redimensionnement. */
  function aligner(boite){
    var ed = document.querySelector('.sceditor-container');
    if(!ed) return;
    var h = Math.round(ed.getBoundingClientRect().bottom - boite.getBoundingClientRect().top);
    if(h > 60) boite.style.height = h + 'px';
  }

  /* L'iframe peut avoir fini de charger avant qu'on pose l'ecouteur : on
     reessaie quelques fois plutot que de dependre du seul evenement. */
  function insister(f, n){
    if(habiller(f) || n <= 0) return;
    setTimeout(function(){ insister(f, n - 1); }, 300);
  }

  /* Le gabarit reserve a gauche de l'editeur une colonne de libelles de
     180px. Sur la page de signature elle est vide : on la marque pour que
     le CSS la masque et rende sa largeur a l'editeur, qui partage desormais
     sa cellule avec le panneau de smileys. Si elle contient quoi que ce soit
     (page de redaction d'un message), on n'y touche pas. */
  function colonneVide(cellule){
    /* L'editeur est dans un tableau imbrique : on remonte au forumline
       exterieur, dont la premiere rangee porte la colonne des libelles. */
    var tbl = cellule.closest('table.forumline');
    if(!tbl) return;
    var g = tbl.querySelector(':scope > tbody > tr > td.row1');
    if(!g || g === cellule || g.contains(cellule)) return;
    if(g.textContent.trim()) return;
    if(g.querySelector('input,select,textarea,img,a')) return;
    g.setAttribute('data-hld-vide','1');
  }

  function poser(boite, cellule){
    if(boite.getAttribute('data-hld-sm')) return;
    boite.setAttribute('data-hld-sm','1');
    /* Le panneau va sous le libelle « Corps du message », dans la colonne de
       gauche, et non dans la cellule de l'editeur (26/10). On vise la cellule
       de libelle qui precede celle de l'editeur dans la meme rangee ; si elle
       n'existe pas, on retombe sur l'ancien comportement. */
    var cel2 = cellule.closest('td.row2') || cellule;
    var prec = cel2.previousElementSibling;
    var hote = (prec && prec.matches && prec.matches('td.row1')) ? prec : cellule;
    hote.appendChild(boite);
    /* La colonne de libelles n'est masquee que si le panneau n'y est pas :
       sinon on masquerait les smileys avec elle. */
    if(hote === cellule) colonneVide(cellule);
    /* Page de redaction : la cellule d'origine porte le meme id et reste dans
       la rangee, vide (elle ne contient que le script qui fabrique le
       panneau). Elle reservait 232px pour rien : on la marque, le CSS la
       retire. On vise l'attribut id, pour ne pas dependre de l'unicite. */
    var doublons = document.querySelectorAll('[id="smileyContainer"]');
    for(var k=0;k<doublons.length;k++){
      if(doublons[k] !== boite) doublons[k].setAttribute('data-hld-reste','1');
    }
    setTimeout(function(){ aligner(boite); }, 400);
    window.addEventListener('resize', function(){ aligner(boite); });
    var f = boite.querySelector('iframe');
    if(!f) return;
    f.addEventListener('load', function(){ habiller(f); });
    insister(f, 20);
  }

  function attendre(n){
    var boite = document.getElementById('smileyContainer');
    if(!boite) return;
    var ed = document.querySelector('.sceditor-container');
    var cellule = ed && ed.closest('td');
    if(cellule){ poser(boite, cellule); return; }
    if(n > 0) setTimeout(function(){ attendre(n - 1); }, 300);
  }

  if(document.readyState !== 'loading'){ attendre(30); }
  else { document.addEventListener('DOMContentLoaded', function(){ attendre(30); }); }
})();

/* Bloc des partenaires de la page d'accueil.

   Le message d'accueil (Affichage > Page d'accueil > Generalites) est edite
   par SCEditor, qui ne connait pas <details>/<summary>. A chaque
   enregistrement il re-serialise le HTML : le <ul> des partenaires sort du
   <details> et devient un frere, et le libelle sort du <summary>, qui reste
   vide. Resultat : la liste s'affiche en permanence et l'entete est muette.

   On ne peut pas empecher l'editeur de faire ca. On repare donc a
   l'affichage, a chaque chargement : le libelle retourne dans le <summary>
   et la liste rentre dans le <details>. Le bloc survit ainsi a toutes les
   modifications de la page d'accueil. */
(function(){
  function reparer(d){
    if(d.getAttribute('data-hld-parto')) return;
    var sum = d.querySelector('summary');
    if(!sum){ sum = document.createElement('summary'); d.insertBefore(sum, d.firstChild); }

    /* Le libelle : les noeuds texte restes directement dans le <details>. */
    if(!sum.textContent.trim()){
      var mots = [];
      for(var i = 0; i < d.childNodes.length; i++){
        var n = d.childNodes[i];
        if(n.nodeType === 3 && n.nodeValue.trim()){ mots.push(n.nodeValue.trim()); n.nodeValue = ''; }
      }
      if(mots.length) sum.textContent = mots.join(' ');
    }

    /* La liste : le premier <ul> frere, s'il n'est pas deja dedans. */
    if(!d.querySelector('ul')){
      var f = d.nextElementSibling;
      while(f && f.tagName !== 'UL' && !f.querySelector('li')) f = f.nextElementSibling;
      if(f && f.tagName === 'UL') d.appendChild(f);
    }
    d.setAttribute('data-hld-parto','1');
  }

  function partenaires(){
    var blocs = document.querySelectorAll('details.hld_parto');
    for(var i = 0; i < blocs.length; i++) reparer(blocs[i]);

    /* SCEditor laisse parfois un second <details> derriere lui, vide : pas de
       libelle, pas de liste. Il s'affichait comme une deuxieme barre
       « partenaires ». On le marque une fois la reparation faite — a ce
       moment-la, un bloc encore sans <li> n'a rien a montrer — et le CSS le
       masque. On ne le supprime pas : si des partenaires y sont ajoutes un
       jour, il revient tout seul. */
    for(var j = 0; j < blocs.length; j++){
      var b = blocs[j];
      var sum = b.querySelector('summary');
      var vide = !b.querySelector('li') && !(sum && sum.textContent.trim());
      if(vide) b.setAttribute('data-hld-vide','1');
      else b.removeAttribute('data-hld-vide');
    }
  }

  if(document.readyState !== 'loading'){ partenaires(); }
  else { document.addEventListener('DOMContentLoaded', partenaires); }
})();

/* Liste des sujets : « par X » devient « sujet ouvert par X ».
   Le « par » est un noeud texte nu au debut de .gwf_sujets_name, donc hors
   de portee du CSS : on le reecrit, sans toucher au lien qui suit. */
(function(){
  function auteurs(){
    var lignes = document.querySelectorAll('.gwf_sujets_name');
    for(var i = 0; i < lignes.length; i++){
      var l = lignes[i];
      if(l.getAttribute('data-hld-par')) continue;
      for(var j = 0; j < l.childNodes.length; j++){
        var n = l.childNodes[j];
        if(n.nodeType === 3 && /^\s*par\s*$/i.test(n.nodeValue)){
          n.nodeValue = n.nodeValue.replace(/par/i, 'sujet ouvert par');
          break;
        }
      }
      l.setAttribute('data-hld-par','1');
    }
  }
  if(document.readyState !== 'loading'){ auteurs(); }
  else { document.addEventListener('DOMContentLoaded', auteurs); }
})();

/* Liste des sujets : la description du sujet.
   Forumactif la pose dans un <span class="genmed"> frere du bloc titre, donc
   elle devient une colonne a part dans le flex de .gwf_sujets_left et se
   retrouve au milieu de la ligne. On la descend dans .gwf_sujets_titre, apres
   l'auteur. Le noeud est deplace, pas recree : les liens qu'elle peut
   contenir survivent. */
(function(){
  function descriptions(){
    var lignes = document.querySelectorAll('.gwf_sujets .gwf_sujets_left');
    for(var i = 0; i < lignes.length; i++){
      var g = lignes[i];
      if(g.getAttribute('data-hld-desc')) continue;
      g.setAttribute('data-hld-desc','1');
      var titre = g.querySelector('.gwf_sujets_titre');
      if(!titre) continue;
      var sp = g.querySelector(':scope > span.genmed');
      if(!sp) continue;
      while(sp.firstChild && (sp.firstChild.nodeName === 'BR' ||
            (sp.firstChild.nodeType === 3 && !sp.firstChild.nodeValue.trim()))){
        sp.removeChild(sp.firstChild);
      }
      if(!sp.textContent.trim()){ sp.remove(); continue; }
      sp.className = (sp.className + ' hld_sujet_desc').trim();
      titre.appendChild(sp);
    }
  }
  if(document.readyState !== 'loading'){ descriptions(); }
  else { document.addEventListener('DOMContentLoaded', descriptions); }
})();

/* Index : les liens de bas de page.
   Forumactif les repartit sur deux tableaux : celui de la derniere visite
   (« voir les nouveaux messages… »), que le gabarit place juste sous la PA,
   et celui de « tout marquer comme lu », coince entre la derniere categorie
   et le QEEL. On en fait une seule barre, tout en bas, sous le QEEL : les
   liens sont deplaces (pas recrees, donc les href restent ceux du forum) et
   les deux tableaux d'origine sont marques pour que le CSS les masque. Si
   ce bloc ne tourne pas, rien n'est masque et la page reste utilisable. */
(function(){
  var ORDRE = ['search_id=newposts','search_id=egosearch','search_id=unanswered',
               'mark=forums','search_id=activetopics','mode=today_posters',
               'mode=overall_posters','mode=delete_cookies'];
  function pied(){
    /* .gwf_pa n'existe que sur l'index : ailleurs on ne touche a rien. */
    if(!document.querySelector('.gwf_pa')) return;
    if(document.querySelector('.hld_pied')) return;
    var a = document.querySelector('a[href*="search_id=newposts"]');
    var b = document.querySelector('a[href*="mark=forums"]');
    var A = a && a.closest('table');
    var B = b && b.closest('table');
    if(!A || !B) return;
    var nav = document.createElement('nav');
    nav.className = 'hld_pied';
    for(var i=0;i<ORDRE.length;i++){
      var lien = A.querySelector('a[href*="'+ORDRE[i]+'"]') ||
                 B.querySelector('a[href*="'+ORDRE[i]+'"]');
      if(!lien) continue;
      lien.className = 'hld_pied_lien';
      lien.removeAttribute('style');
      nav.appendChild(lien);
    }
    if(!nav.children.length) return;
    var qeel = document.querySelector('.gwf_qeel');
    var ancre = (qeel && qeel.parentNode === B.parentNode) ? qeel : B;
    ancre.insertAdjacentElement('afterend', nav);
    A.setAttribute('data-hld-pied','1');
    B.setAttribute('data-hld-pied','1');
  }
  if(document.readyState !== 'loading'){ pied(); }
  else { document.addEventListener('DOMContentLoaded', pied); }
})();

/* Liste des sujets : la colonne des compteurs.
   La maquette affiche « 30 MESSAGES / 249 VUES ». Le gabarit, lui, donne le
   nombre de REPONSES, qui vaut un de moins que le nombre de messages du
   sujet : on ajoute donc 1 avant de changer le libelle, sinon un sujet qui
   vient d'etre ouvert afficherait « 0 message » alors qu'il en contient un.
   L'ordre d'affichage (messages au-dessus des vues) est fait en CSS. */
(function(){
  function compteurs(){
    var cases = document.querySelectorAll('.gwf_sujets_view div');
    for(var i=0;i<cases.length;i++){
      var d = cases[i];
      if(d.getAttribute('data-hld-msg')) continue;
      var m = (d.textContent||'').match(/^\s*(\d+)\s+r[ée]ponses?\s*$/i);
      if(!m) continue;
      var n = parseInt(m[1],10) + 1;
      d.textContent = n + (n > 1 ? ' messages' : ' message');
      d.setAttribute('data-hld-msg','1');
    }
  }
  if(document.readyState !== 'loading'){ compteurs(); }
  else { document.addEventListener('DOMContentLoaded', compteurs); }
})();
