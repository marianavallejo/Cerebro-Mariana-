const sceneTitle = document.querySelector('.title');
const sceneDesc  = document.querySelector('.desc');
const toolbar    = document.querySelector('.toolbar');
const ground     = document.getElementById('playground');
const overlay    = document.getElementById('overlay');
const resetBtn   = document.getElementById('resetAll');
const randomBtn  = document.getElementById('randomScene');

const TEXT = {
  1:{title:'Mañanas: cereal + música',desc:'"En las mañanas, mi cerebro es como un cereal..." — Reactiva el ánimo con una canción que haga retumbar cuerpo y mente.'},
  2:{title:'Película proyectada + manitas que dibujan',desc:'El cerebro proyecta lo que ven los ojos y unas manitas añaden seres fantásticos. Haz clic para sumar doodles y recuerdos.'},
  3:{title:'Fijarme en lo insignificante',desc:'Imagina historias de un papel en la calle, edificios viejos o parejas besándose. Descubre relatos diminutos.'},
  4:{title:'Filtros de color para el día',desc:'Tiñe el mundo según el ánimo: rosado, verde, rojo o amarillo. Ajusta intensidad.'},
  5:{title:'Encuentros que tiñen la película',desc:'Saludar a alguien cambia el color de la escena: risas, llantos o bloqueo social.'},
  6:{title:'Nervios: DVD dañado',desc:'Cuando alguien te pone nerviosa: apagón. Vuelve con rosa, corona y brillo para suavizar la emoción.'},
  7:{title:'Odio → Solución: comer algo delicioso',desc:'Día gris que se arregla comiendo rico: modo "bola disco" con arcoíris euforia.'},
  8:{title:'Refugio: cascada cristalina',desc:'Ducha tibia mental, aire fresco, peces y animales. Sumérgete y flota.'},
};

function clearPlayground(){
  ground.innerHTML = '<div class="overlay" id="overlay"></div>';
}

function rng(min,max){return Math.floor(Math.random()*(max-min+1))+min}
function randItem(arr){return arr[Math.floor(Math.random()*arr.length)]}

// SCENE BUILDERS
const Scenes = {
  1(){ // cereal + music
    clearPlayground();
    const bowl = document.createElement('div'); bowl.className='bowl';
    const milk = document.createElement('div'); milk.className='milk';
    const cereal = document.createElement('div'); cereal.className='cereal';
    bowl.appendChild(milk); bowl.appendChild(cereal); ground.appendChild(bowl);
    const flakes=['⭐','💫','✨','🍓','🫐','🍯','🍬'];
    for(let i=0;i<26;i++){
      const f=document.createElement('div'); f.className='flake'; f.textContent=randItem(flakes);
      f.style.left=rng(10,250)+'px'; f.style.top=rng(10,120)+'px'; f.style.animationDuration=rng(8,18)+'s';
      cereal.appendChild(f);
    }
    const row=document.createElement('div'); row.className='row';
    const b1=btn('Poner canción (¡vibra!)',()=> bowl.classList.toggle('vibe'));
    const b2=btn('Más azúcar ✨',()=> document.querySelectorAll('.flake').forEach(el=> el.style.animationDuration = (parseFloat(el.style.animationDuration||12)*0.8)+'s'));
    const b3=btn('Pausa',()=> document.querySelectorAll('.flake').forEach(el=> el.style.animationPlayState = (el.style.animationPlayState==='paused'?'running':'paused')));
    row.append(b1,b2,b3); toolbar.replaceChildren(row);
  },
  2(){ // projector + doodles memories
    clearPlayground();
    ground.insertAdjacentHTML('beforeend','<div class="projector"></div><div class="beam"></div>');
    const addDoodle = () =>{
      const el=document.createElement('div'); el.className='doodle'; el.textContent=randItem(['🦄','🐙','🌈','🧚‍♀️','🎈','🐉','🌟','🎭']);
      el.style.left=rng(140,220)+'px'; el.style.bottom=rng(120,240)+'px'; el.style.animationDuration=rng(9,16)+'s';
      ground.appendChild(el);
      setTimeout(()=> el.remove(), 16000);
    };
    const addMemory = () =>{
      const t = document.createElement('div'); t.className='story';
      t.textContent=randItem([
        'Recuerdo vívido que provoca risa: el primer baile en la sala.',
        'Una lágrima dulce: la última carta que escribí y nunca envié.',
        'Un disgusto breve: aquel adiós sin explicación en la estación.',
      ]);
      ground.appendChild(t); setTimeout(()=>t.remove(), 2600);
    }
    const row=document.createElement('div'); row.className='row';
    row.append(btn('Añadir doodle', addDoodle), btn('Conectar recuerdo', addMemory));
    toolbar.replaceChildren(row);
    // seed a few
    for(let i=0;i<4;i++) addDoodle();
  },
  3(){ // tiny details
    clearPlayground();
    const wrap=document.createElement('div'); wrap.className='street';
    wrap.innerHTML=`<div class="scene3">
      <div class="card3" data-kind="papel">🧾</div>
      <div class="card3" data-kind="edificio">🏚️</div>
      <div class="card3" data-kind="pareja">💏</div>
    </div>`; ground.appendChild(wrap);
    const stories={
      papel:[
        'El envoltorio fue un mapa del tesoro para dos niños antes de volverse basura.',
        'Guardó un teléfono escrito a lápiz; ahora navega con el viento.',
        'Fue billete de un caramelo que cambió un día gris por uno dulce.',
      ],
      edificio:[
        'Sus muros susurran nombres que el eco aún guarda.',
        'Ventanas como ojos viejos que vieron bailes y despedidas.',
        'La escalera cruje cuando el pasado baja a saludar.',
      ],
      pareja:[
        'Ese beso huele a reencuentro después de una tormenta.',
        'Hay amor tímido escondido detrás de una risa nerviosa.',
        'Parece primer beso: torpe, brillante y eterno 3 segundos.',
      ]
    };
    wrap.querySelectorAll('.card3').forEach(card=>{
      card.addEventListener('click',()=>{
        const k=card.dataset.kind; const t=document.createElement('div'); t.className='story';
        t.textContent=randItem(stories[k]); ground.appendChild(t); setTimeout(()=>t.remove(), 3000);
      })
    })
    toolbar.replaceChildren(info('Toca cada carta para imaginar su historia.'))
  },
  4(){ // color filters
    clearPlayground();
    const tint=document.createElement('div'); tint.className='tint'; ground.appendChild(tint);
    const row=document.createElement('div'); row.className='row';
    const colors={'Rosado':'#ff5ea1','Verde':'#00ff95','Rojo':'#ff4747','Amarillo':'#ffd400','Azul':'#69a7ff'}
    const sel=document.createElement('select'); sel.className='btn';
    for(const [k,v] of Object.entries(colors)){const o=document.createElement('option'); o.value=v; o.textContent=k; sel.appendChild(o)}
    const range=document.createElement('input'); range.type='range'; range.min=0; range.max=100; range.value=30;
    range.addEventListener('input',()=> apply()); sel.addEventListener('input',()=> apply());
    function apply(){const c=sel.value; const a=range.value/100; tint.style.background=`rgba(${hexToRgb(c)}, ${a})`}
    apply();
    row.append(sel,range,info('Ajusta color e intensidad.'));
    toolbar.replaceChildren(row);
  },
  5(){ // social encounters
    clearPlayground();
    const splash=document.createElement('div'); splash.className='emoji-splash'; ground.appendChild(splash);
    const row=document.createElement('div'); row.className='row';
    const sel=document.createElement('select'); sel.className='btn';
    ;['Amigo que amo','Alguien neutral','Alguien que evito'].forEach(t=>{const o=document.createElement('option'); o.textContent=t; sel.appendChild(o)});
    const act=()=>{
      const mood=sel.value; tone(mood)
      for(let i=0;i<18;i++) puff(mood)
    }
    row.append(sel, btn('Encontrar ➜', act));
    toolbar.replaceChildren(row);
    function tone(mood){
      const t=document.createElement('div'); t.className='story';
      const map={
        'Amigo que amo':['#62ffba','🌞 risas & chismes','💚'],
        'Alguien neutral':['#69a7ff','día normal','💬'],
        'Alguien que evito':['#ff7a9a','bloqueo social','⛔']
      };
      const [col,txt,emo]=map[mood];
      ground.style.background=`radial-gradient(800px 400px at 20% 10%, ${hexWithAlpha(col,.18)}, transparent), linear-gradient(180deg,#0e1027,#0b0c22)`;
      t.textContent=`La película se tiñe: ${txt}.`; ground.appendChild(t); setTimeout(()=>t.remove(),2200)
    }
    function puff(mood){
      const e=document.createElement('div'); e.className='splash-item'; e.textContent=randItem(mood==='Amigo que amo'?['😂','🥰','🎉','🤗','💖']: mood==='Alguien neutral'?['🙂','👋','🫶','😶'] : ['🙈','🚫','😵‍💫','🫥']);
      e.style.left=rng(0, ground.clientWidth-20)+'px'; e.style.top=rng(0, ground.clientHeight-20)+'px';
      splash.appendChild(e); setTimeout(()=>e.remove(),900)
    }
  },
  6(){ // nerves blackout then pinkify
    clearPlayground();
    const blackout=document.createElement('div'); blackout.className='blackout';
    const pink=document.createElement('div'); pink.className='pinkify'; pink.textContent='Modo rosa: 👑 + 💎 + vestido — respira';
    ground.append(blackout,pink);
    const row=document.createElement('div'); row.className='row';
    row.append(btn('Me pongo nerviosa 😶‍🌫️',()=> blackout.classList.toggle('show')),
               btn('Suavizar con rosa 💗',()=> pink.classList.toggle('show')));
    toolbar.replaceChildren(row);
  },
  7(){ // hate -> eat delicious disco
    clearPlayground();
    const gray=document.createElement('div'); gray.className='gray'; ground.appendChild(gray);
    const row=document.createElement('div'); row.className='row';
    row.append(btn('Día gris 😤',()=> gray.style.opacity = .85), btn('Comer algo delicioso 🍰', party));
    toolbar.replaceChildren(row);
    function party(){
      gray.style.opacity = .2;
      const ball=document.createElement('div'); ball.className='disco'; ground.appendChild(ball);
      const beam=document.createElement('div'); beam.className='beamline'; ground.appendChild(beam);
      for(let i=0;i<80;i++) confetti();
    }
    function confetti(){
      const c=document.createElement('div'); c.className='confetti'; c.textContent=randItem(['🟨','🟪','🟥','🟩','🟦','🟧','⭐','✨']);
      c.style.left=rng(0, ground.clientWidth-20)+'px'; c.style.top=rng(-20,20)+'px';
      c.style.animationDuration=(Math.random()*1.6 + .8)+'s'; ground.appendChild(c);
      setTimeout(()=>c.remove(),2400);
    }
  },
  8(){ // refuge waterfall
    clearPlayground();
    const water=document.createElement('div'); water.className='water'; ground.appendChild(water);
    const fishy=()=>{
      const f=document.createElement('div'); f.className='fish'; f.textContent=randItem(['🐟','🐠','🐡','🐬','🐳','🐙']);
      f.style.top=rng(40,420)+'px'; ground.appendChild(f); setTimeout(()=>f.remove(), 9000);
    }
    for(let i=0;i<4;i++) fishy();
    const row=document.createElement('div'); row.className='row';
    row.append(btn('Flotar 🫧',()=> ground.style.filter = ground.style.filter? '' : 'blur(1px) brightness(1.2)'), btn('Añadir pez', fishy));
    toolbar.replaceChildren(row);
  }
};

// Helpers
function btn(label, fn){const b=document.createElement('button'); b.className='btn'; b.textContent=label; b.addEventListener('click',fn); return b}
function info(text){const s=document.createElement('span'); s.className='muted small'; s.textContent=text; return s}
function hexToRgb(hex){hex=hex.replace('#',''); if(hex.length===3){hex=hex.split('').map(x=>x+x).join('')} const v=parseInt(hex,16); return [(v>>16)&255,(v>>8)&255,v&255].join(',')}
function hexWithAlpha(hex,a){const [r,g,b]=hexToRgb(hex).split(','); return `rgba(${r}, ${g}, ${b}, ${a})`}

// Wiring
document.querySelectorAll('.part').forEach(p=>{
  p.addEventListener('click',()=> activate(+p.dataset.scene));
  p.addEventListener('keydown',e=>{if(e.key==='Enter' || e.key===' '){e.preventDefault(); activate(+p.dataset.scene)}})
});
resetBtn.addEventListener('click',()=> activate(0));
randomBtn.addEventListener('click',()=> activate(rng(1,8)));

function activate(id){
  if(!id){
    sceneTitle.textContent='Elige una zona del cerebro';
    sceneDesc.textContent='Este simulador traduce tu narrativa en micro-experimentos sensoriales: colores, vibraciones, recuerdos, encuentro con personas, comida-escenario, apagón nervioso y refugio acuático.';
    toolbar.replaceChildren(); clearPlayground(); return;
  }
  const t=TEXT[id]; sceneTitle.textContent=t.title; sceneDesc.textContent=t.desc; Scenes[id]();
}

// Start with a gentle attractor
activate(4); // filtros de color por defecto