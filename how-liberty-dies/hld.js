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
