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
