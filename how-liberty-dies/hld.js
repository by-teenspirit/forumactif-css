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
          a.textContent=(a.textContent||'').trim();
          nav.appendChild(a);
        } else {
          var txt=(spans[i].textContent||'').trim();
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
    barre(['#page-body a.mainmenu[href*="page_profil"]','#page-body a[href$="folder=sentbox"]']);
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
    col.setAttribute('data-hld-vt','1');
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
