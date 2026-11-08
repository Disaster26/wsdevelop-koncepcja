(function(){
  var b=document.getElementById('burger'),n=document.getElementById('nav');
  function zamknij(){n.classList.remove('otw');b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','Otwórz menu');}
  b.addEventListener('click',function(){var o=n.classList.toggle('otw');b.setAttribute('aria-expanded',o?'true':'false');b.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu');});
  n.addEventListener('click',function(e){if(e.target.closest('a'))zamknij();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')zamknij();});

  var rok=document.getElementById('rok'); if(rok) rok.textContent=new Date().getFullYear();

  // dolny pasek na telefonie po przewinieciu za przycisk w hero, chowany w kontakcie
  var mob=document.getElementById('mob'),cta=document.getElementById('hero-cta'),kontakt=document.getElementById('kontakt');
  if('IntersectionObserver' in window&&mob&&cta){
    var zaCta=false,wKontakcie=false;
    var ustaw=function(){var w=zaCta&&!wKontakcie;mob.classList.toggle('widac',w);mob.setAttribute('aria-hidden',w?'false':'true');mob.querySelectorAll('a').forEach(function(a){a.tabIndex=w?0:-1;});};
    new IntersectionObserver(function(e){zaCta=!e[0].isIntersecting&&e[0].boundingClientRect.top<0;ustaw();}).observe(cta);
    new IntersectionObserver(function(e){wKontakcie=e[0].isIntersecting;ustaw();},{rootMargin:'0px 0px -40% 0px'}).observe(kontakt);
  }

  // aktywna pozycja menu = dokladnie biezaca sekcja
  var linki=[].slice.call(n.querySelectorAll('a')),sek=linki.map(function(a){return document.querySelector(a.getAttribute('href'));});
  if('IntersectionObserver' in window){
    var hero=document.querySelector('.hero');
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var i=sek.indexOf(e.target);linki.forEach(function(a,j){a.classList.toggle('akt',i===j);if(i===j)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});});},{rootMargin:'-45% 0px -50% 0px'});
    sek.forEach(function(s){if(s)io.observe(s);});
    if(hero)io.observe(hero);
  }

  // karuzele: palec (natywny scroll), mysz (przeciaganie), strzalki, kropki
  document.querySelectorAll('[data-karuzela]').forEach(function(k){
    var tor=k.querySelector('.kar-tor'),el=[].slice.call(tor.children),kropki=k.querySelector('.kar-kropki'),btn=k.querySelectorAll('.kar-btn');
    el.forEach(function(){kropki.appendChild(document.createElement('i'));});
    var kr=[].slice.call(kropki.children);
    function krok(){return el.length>1?el[1].offsetLeft-el[0].offsetLeft:tor.clientWidth;}
    function stan(){
      var i=Math.round(tor.scrollLeft/krok()),max=tor.scrollWidth-tor.clientWidth-2;
      if(tor.scrollLeft>=max)i=el.length-1;
      kr.forEach(function(d,j){d.classList.toggle('akt',j===i);});
      btn[0].disabled=tor.scrollLeft<=2; btn[1].disabled=tor.scrollLeft>=max;
    }
    btn.forEach(function(x){x.addEventListener('click',function(){tor.scrollBy({left:krok()*+x.dataset.kier,behavior:'smooth'});});});
    tor.addEventListener('scroll',function(){window.requestAnimationFrame(stan);},{passive:true});
    window.addEventListener('resize',stan);
    tor.addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();tor.scrollBy({left:krok()*(e.key==='ArrowRight'?1:-1),behavior:'smooth'});}});
    var start=null,sl=0,ruch=false;
    tor.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.button!==0)return;start=e.clientX;sl=tor.scrollLeft;ruch=false;});
    window.addEventListener('pointermove',function(e){if(start===null)return;var dx=e.clientX-start;if(!ruch&&Math.abs(dx)>5){ruch=true;tor.classList.add('ciag');}if(ruch)tor.scrollLeft=sl-dx;});
    window.addEventListener('pointerup',function(){if(start===null)return;start=null;if(ruch){tor.classList.remove('ciag');var i=Math.round(tor.scrollLeft/krok());tor.scrollTo({left:i*krok(),behavior:'smooth'});}});
    tor.addEventListener('dragstart',function(e){e.preventDefault();});
    stan();
  });

  // formularz pokazowy
  var f=document.getElementById('form'),info=document.getElementById('f-info');
  f.addEventListener('submit',function(e){e.preventDefault();info.hidden=false;});
})();
