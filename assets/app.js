
// фильтры (статус + месяц)
document.querySelectorAll('.page').forEach(box=>{
  if(!box.querySelector('.filters'))return;
  let f='all',m=0;
  function apply(){
    let n=0;
    box.querySelectorAll('[data-status],[data-st]').forEach(c=>{
      const st=c.dataset.status||c.dataset.st;
      const ms=(c.dataset.m||'').split(',').filter(Boolean).map(Number);
      const ok=(f==='all'||st===f)&&(!m||ms.includes(m));
      c.hidden=!ok; if(ok)n++;
    });
    const ic=box.querySelector('.ideas-card'); if(ic) ic.hidden=!((f==='all'||f==='plan')&&!m);
    let e=box.querySelector('.empty');
    if(!e){e=document.createElement('p');e.className='empty';e.textContent='В этом месяце ничего не подходит — попробуй другой.';box.querySelector('.grid').after(e);}
    e.hidden=n>0||(ic&&!ic.hidden);
  }
  box.querySelectorAll('.filters button').forEach(b=>b.onclick=()=>{box.querySelectorAll('.filters button').forEach(x=>x.classList.toggle('on',x===b));f=b.dataset.f;apply();});
  box.querySelectorAll('.months button').forEach(b=>b.onclick=()=>{box.querySelectorAll('.months button').forEach(x=>x.classList.toggle('on',x===b));m=+b.dataset.mo;apply();});
});
// просмотр фото
const lb=document.getElementById('lb');
document.addEventListener('click',ev=>{const i=ev.target.closest('img.zoom');
  if(i){lb.querySelector('img').src=i.src;lb.classList.add('on');}else if(lb.classList.contains('on'))lb.classList.remove('on');});
// карта маршрута
const mp=document.getElementById('map');
if(mp&&window.L){
  const pts=JSON.parse(mp.dataset.points),line=JSON.parse(mp.dataset.line);
  const map=L.map('map',{scrollWheelZoom:false});
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OpenStreetMap',maxZoom:18}).addTo(map);
  const ll=pts.map(p=>[p[1],p[2]]);
  L.polyline(line.map(i=>ll[i]),{color:'#c8553d',weight:3,dashArray:'7 7'}).addTo(map);
  pts.forEach((p,i)=>L.marker(ll[i],{icon:L.divIcon({className:'',html:'<div class="mk">'+(i+1)+'</div>',iconSize:[26,26],iconAnchor:[13,13]})})
    .addTo(map).bindPopup('<b>'+p[0]+'</b><br>'+p[3]+'<br><a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query='+p[1]+','+p[2]+'">Открыть в Google Maps</a>'));
  map.fitBounds(ll,{padding:[30,30],maxZoom:12});
}
