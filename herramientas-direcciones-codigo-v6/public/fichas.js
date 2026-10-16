/* Fichas de Transportadoras — solo interfaz; los datos y el validador viven en el servidor. */
(function(){var CSS="/* Layout: cabecera blanca con logo \u2192 pa\u00edses \u2192 pesta\u00f1as. Direcciones: validador arriba, tipos debajo. Un solo acento (verde F\u00e9nix); amarillo solo en el logo y un filo. */\n:host{display:block;\n  --bg:#f7f8f7; --paper:#ffffff; --ink:#16201a; --muted:#5f6b64; --faint:#8a948e; --line:#e2e7e3; --line2:#d0d8d2;\n  --accent:#00672f; --accent-soft:#eaf3ed; --on-accent:#ffffff; --brand-yellow:#ffd030;\n  --ok:#11703a; --ok-soft:#eaf5ee; --no:#b0362c; --no-soft:#fcecea; --warn:#9a5b00; --warn-soft:#fdf3e2;\n  --f-sans:\"IBM Plex Sans\",\"Segoe UI\",system-ui,sans-serif;\n  --f-mono:\"IBM Plex Mono\",ui-monospace,Menlo,monospace;\n}\n*{box-sizing:border-box}\n.fx{background:var(--bg);color:var(--ink);font:15px/1.55 var(--f-sans);-webkit-font-smoothing:antialiased}\n.inner{max-width:1160px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}\n.top{background:var(--paper);border-bottom:1px solid var(--line);box-shadow:inset 0 3px 0 var(--brand-yellow)}\n.top .inner{display:flex;flex-wrap:wrap;align-items:center;gap:10px 20px;padding-block:14px}\n.logo{height:52px;width:auto;display:block;border-radius:6px}\n.top h1{font:600 20px/1.2 var(--f-sans);margin:0;letter-spacing:-.01em}\n.top p{margin:0;color:var(--muted);font-size:13px}\n.top .meta{margin-left:auto;font:400 12px var(--f-mono);color:var(--faint)}\n.wrap{padding-block:20px 56px}\nh2,h3{margin:0;text-wrap:balance;letter-spacing:-.01em}\nh2{font:600 18px/1.3 var(--f-sans)} h3{font:600 15px/1.35 var(--f-sans)}\n.lbl{font:500 11px/1.3 var(--f-sans);text-transform:uppercase;letter-spacing:.07em;color:var(--faint)}\n.countries{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px}\n.cbtn{font:500 14px/1 var(--f-sans);padding:8px 12px;border:1px solid var(--line2);border-radius:6px;background:var(--paper);color:var(--ink);cursor:pointer;display:flex;gap:7px;align-items:center}\n.cbtn small{font:400 11px var(--f-mono);color:var(--faint)}\n.cbtn:hover{border-color:var(--accent)}\n.cbtn[aria-pressed=\"true\"]{background:var(--accent);border-color:var(--accent);color:var(--on-accent)}\n.cbtn[aria-pressed=\"true\"] small{color:var(--on-accent);opacity:.75}\nbutton:focus-visible,input:focus-visible,textarea:focus-visible,a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}\n.tabs{display:flex;gap:4px;border-bottom:1px solid var(--line);margin-bottom:22px;overflow-x:auto}\n.tab{font:500 14px/1 var(--f-sans);background:none;border:0;border-bottom:2px solid transparent;padding:11px 12px;color:var(--muted);cursor:pointer;white-space:nowrap;margin-bottom:-1px}\n.tab[aria-selected=\"true\"]{color:var(--ink);border-color:var(--accent)}\n.src{font:400 11px var(--f-mono);color:var(--faint)}\n.src.v{color:var(--warn)}\n.card-s{background:var(--paper);border:1px solid var(--line);border-radius:10px}\n/* Validador */\n.val{padding:18px;margin-bottom:28px}\n.val-head{display:flex;flex-wrap:wrap;justify-content:space-between;gap:6px 12px;align-items:baseline;margin-bottom:12px}\n.val-head p{margin:2px 0 0;color:var(--muted);font-size:13px}\n.vform{display:grid;grid-template-columns:minmax(0,1fr) 200px auto auto;gap:8px;align-items:start}\n.vform.mx{grid-template-columns:minmax(0,1fr) 180px 120px auto auto}\n.btn.clear{background:var(--paper);color:var(--muted);border-color:var(--line2)}\n.btn.clear:hover{color:var(--ink);border-color:var(--ink)}\n@media (max-width:760px){.vform,.vform.mx{grid-template-columns:1fr}}\ntextarea,input[type=text],input[type=search]{font:14px/1.45 var(--f-sans);padding:9px 11px;border:1px solid var(--line2);border-radius:6px;background:var(--paper);color:var(--ink);width:100%;min-width:0}\ntextarea{resize:vertical;min-height:42px;height:42px}\n.btn{font:600 14px/1 var(--f-sans);padding:12px 16px;border-radius:6px;border:1px solid var(--accent);background:var(--accent);color:var(--on-accent);cursor:pointer;white-space:nowrap}\n.btn.ghost{background:var(--paper);color:var(--accent);padding:6px 10px;font-size:13px;font-weight:500}\n.tries{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:10px;font-size:13px;color:var(--muted)}\n.try{font:400 12px var(--f-mono);border:1px dashed var(--line2);background:none;color:var(--muted);border-radius:4px;padding:3px 7px;cursor:pointer;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.try:hover{color:var(--ink);border-color:var(--accent)}\n.res{margin-top:16px;border-top:1px solid var(--line);padding-top:16px;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px 24px}\n@media (max-width:760px){.res{grid-template-columns:1fr}}\n.verdict-line{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center}\n.status{display:inline-flex;align-items:center;gap:8px;font:600 15px var(--f-sans);padding:6px 12px;border-radius:6px}\n.status::before{content:\"\";width:8px;height:8px;border-radius:50%;background:currentColor}\n.status.ok{background:var(--ok-soft);color:var(--ok)} .status.bad{background:var(--no-soft);color:var(--no)} .status.review{background:var(--warn-soft);color:var(--warn)}\n.vtype{color:var(--muted);font-size:14px}\n.vtype b{color:var(--ink);font-weight:600}\n.checks{list-style:none;margin:0;padding:0}\n.checks li{display:grid;grid-template-columns:20px minmax(0,1fr);gap:6px;padding:5px 0;font-size:14px;border-bottom:1px solid var(--line)}\n.checks li:last-child{border-bottom:0}\n.checks i{font-style:normal;font-weight:700;text-align:center}\n.checks .y i{color:var(--ok)} .checks .n i{color:var(--no)} .checks .o i{color:var(--faint)}\n.checks small{display:block;color:var(--muted);font-size:12px}\n.outbox{display:flex;flex-direction:column;gap:12px;min-width:0}\n.out h4{margin:0 0 6px;font:500 11px var(--f-sans);text-transform:uppercase;letter-spacing:.07em;color:var(--faint);display:flex;justify-content:space-between;align-items:center;gap:8px}\n.mono{font:400 13px/1.55 var(--f-mono);background:var(--bg);border:1px solid var(--line);border-radius:6px;padding:9px 11px;white-space:pre-wrap;word-break:break-word}\n.maps{display:inline-flex;align-items:center;gap:6px;font:500 13px var(--f-sans);color:var(--accent);text-decoration:none;border-bottom:1px solid currentColor;padding-bottom:1px;align-self:flex-start}\n.note{font-size:12px;color:var(--faint);margin:0}\n/* Tipos */\n.dhead{display:flex;flex-wrap:wrap;gap:6px 14px;align-items:baseline;justify-content:space-between;margin-bottom:12px}\n.types{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px}\n.type{font:500 14px/1.25 var(--f-sans);padding:8px 12px;border:1px solid var(--line2);border-radius:6px;background:var(--paper);color:var(--ink);cursor:pointer;text-align:left}\n.type small{display:block;font:400 12px var(--f-sans);color:var(--faint)}\n.type[aria-pressed=\"true\"]{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent);background:var(--accent-soft)}\n.type.hit{position:relative}\n.type.hit::after{content:\"detectado\";position:absolute;top:-8px;right:6px;font:600 9px/1 var(--f-sans);text-transform:uppercase;letter-spacing:.06em;background:var(--accent);color:var(--on-accent);padding:3px 5px;border-radius:3px}\n.dgrid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:16px}\n@media (max-width:860px){.dgrid{grid-template-columns:1fr}}\n.panel{overflow:hidden}\n.panel>header{padding:14px 16px 10px}\n.when{color:var(--muted);font-size:13px;display:block;margin-top:2px}\n.fmt{font:400 13px/1.6 var(--f-mono);background:var(--bg);border-block:1px solid var(--line);padding:9px 16px;white-space:pre-wrap;word-break:break-word}\n.fields{width:100%;border-collapse:collapse;font-size:14px}\n.fields td{padding:8px 16px;border-bottom:1px solid var(--line);vertical-align:top}\n.fields tr:last-child td{border-bottom:0}\n.fields td:last-child{text-align:right;white-space:nowrap}\n.fields em{display:block;font-style:normal;color:var(--faint);font-size:12px}\n.tag{display:inline-block;font:500 11px/1 var(--f-sans);padding:3px 6px;border-radius:4px;white-space:nowrap}\n.tag.ob{color:var(--ok);background:var(--ok-soft)} .tag.ap{color:var(--warn);background:var(--warn-soft)} .tag.op{color:var(--faint);border:1px solid var(--line2)}\n.tag.si{color:var(--ok);background:var(--ok-soft)} .tag.no{color:var(--no);background:var(--no-soft)} .tag.q{color:var(--warn);background:var(--warn-soft)}\n.side{display:flex;flex-direction:column;gap:12px;min-width:0}\n.box{padding:14px 16px}\n.box h3{margin-bottom:8px}\n.yn{display:grid;grid-template-columns:1fr 1fr;gap:12px}\n@media (max-width:520px){.yn{grid-template-columns:1fr}}\n.yn h4{margin:0 0 4px;font:600 13px var(--f-sans)}\n.yn .y h4{color:var(--ok)} .yn .n h4{color:var(--no)}\n.yn ul,ul.plain{margin:0;padding-left:16px;font-size:13px;color:var(--muted)}\n.yn li,ul.plain li{margin:3px 0}\nul.plain{color:var(--ink);font-size:14px}\n.phone{margin:10px 0 0;font-size:13px;color:var(--muted)}\n/* Transportadoras */\n.bar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;margin-bottom:14px}\n.seg{display:inline-flex;border:1px solid var(--line2);border-radius:6px;overflow:hidden}\n.tg{font:500 13px var(--f-sans);padding:7px 14px;background:var(--paper);color:var(--muted);border:0;cursor:pointer}\n.tg[aria-pressed=\"true\"]{background:var(--accent);color:var(--on-accent)}\ninput[type=search]{width:280px;max-width:100%}\n.common{padding:12px 16px;margin-bottom:16px;border-left:3px solid var(--accent)}\n.common ul{margin:6px 0 0;padding-left:16px;font-size:14px}\n.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:14px}\n.card{display:flex;flex-direction:column;min-width:0;overflow:hidden}\n.card header{padding:14px 16px 10px;display:flex;justify-content:space-between;align-items:baseline;gap:8px}\n.card h3{font:600 17px/1.2 var(--f-sans)}\n.kpis{display:grid;grid-template-columns:repeat(3,1fr);border-block:1px solid var(--line)}\n.kpi{padding:9px 14px;border-right:1px solid var(--line);min-width:0}\n.kpi:last-child{border-right:0}\n.kpi b{display:block;font:600 16px/1.2 var(--f-sans);font-variant-numeric:tabular-nums}\n.kpi span{font-size:11px;color:var(--faint)}\n.rows{margin:0}\n.row{display:grid;grid-template-columns:112px minmax(0,1fr);gap:10px;padding:8px 16px;border-bottom:1px solid var(--line);font-size:14px}\n.row:last-child{border-bottom:0}\n.row dt{font-size:12px;color:var(--faint);padding-top:1px}\n.row dd{margin:0;min-width:0}\n.row .tag{margin-right:6px}\n.na{color:var(--faint)}\n.alert{margin:0 16px 16px;padding:9px 12px;background:var(--warn-soft);border-radius:6px;font-size:13px}\n.alert strong{color:var(--warn)}\n.tablewrap{overflow-x:auto}\ntable.cmp{border-collapse:collapse;width:100%;min-width:720px;font-size:13px}\n.cmp th,.cmp td{text-align:left;vertical-align:top;padding:9px 12px;border-bottom:1px solid var(--line)}\n.cmp thead th{font:600 14px var(--f-sans);border-bottom:2px solid var(--accent)}\n.cmp tbody th{font-weight:500;color:var(--faint);width:140px;font-size:12px}\n.empty{padding:28px;text-align:center;color:var(--muted)}\nfooter{margin-top:40px;color:var(--faint);font-size:12px;border-top:1px solid var(--line);padding-top:12px}\n@media (max-width:480px){.row{grid-template-columns:1fr;gap:1px}.top .meta{margin-left:0}}";
  var ST_TXT={ok:"Cumple el formato",bad:"Incompleta: pedir dato",review:"Revisar manualmente"};
  var ORDER=["Cobertura","Tiempo entrega","Intentos","Novedades","Gestión novedad","Retiro oficina","Apertura","Contacto cliente","Cambio dirección","Pago","Peso máx","Entregas","Devolución","Recolección","Reclamos"];
  var LV={ob:"Obligatorio",ap:"Si aplica",op:"Opcional"};
  var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};
  var val=function(v){if(v==null)return '<span class="na">No informado</span>';if(Array.isArray(v)){var t={si:"Sí",no:"No",q:"Validar"}[v[0]];return '<span class="tag '+v[0]+'">'+t+'</span>'+esc(v[1])}return esc(v)};

  window.initFichas = function(host, api){
    var root = host.attachShadow({mode:'open'});
    root.innerHTML = '<style>'+CSS+'</style><div class="fx"><main class="inner wrap">' +
      '<nav class="countries" id="countries" aria-label="País"></nav>' +
      '<div class="tabs" role="tablist"><button class="tab" role="tab" id="t-dir" aria-selected="true">Direcciones</button><button class="tab" role="tab" id="t-tra" aria-selected="false">Transportadoras</button></div>' +
      '<section id="v-dir"></section><section id="v-tra" hidden></section>' +
      '<footer>Fuentes: Direcciones Fénix — Reglas y Prompts (corte 6-oct-2026), carpetas de Drive de transportadoras de Dropi (MX, AR, PY, EC) e información interna de Panamá. El validador revisa el formato con esas reglas; no confirma que la dirección exista en el mapa.</footer>' +
      '</main></div>';
    var $ = function(id){ return root.getElementById(id); };

    var countries = [], CACHE = {};
    var st = {c:"co", view:"dir", mode:"cards", q:"", t:{}, v:{}};
    try{ var s0 = JSON.parse(localStorage.getItem("fichas3")||"{}"); Object.assign(st, s0, {q:"", v:{}}); }catch(e){}
    var save = function(){ try{ localStorage.setItem("fichas3", JSON.stringify({c:st.c,view:st.view,mode:st.mode,t:st.t})); }catch(e){} };

    function nav(){
      var el = $("countries");
      el.innerHTML = countries.map(function(d){ return '<button class="cbtn" data-c="'+d.key+'" aria-pressed="'+(d.key===st.c)+'">'+esc(d.name)+'<small>'+esc(d.code)+'</small></button>'; }).join("");
      el.querySelectorAll("[data-c]").forEach(function(b){ b.onclick=function(){ st.c=b.dataset.c; st.q=""; save(); render(); }; });
    }
    function copyBtn(id,targetId){ return '<button class="btn ghost" data-copy="'+targetId+'" id="'+id+'">Copiar</button>'; }
    function resultHTML(r,input,city,d){
      var mapsQ = encodeURIComponent([r.norm||input,city,d.name].filter(Boolean).join(", "));
      var icon = function(v){ return v===true?["y","✓"]:v===false?["n","✕"]:["o","–"]; };
      return '<div class="res" aria-live="polite">'+
        '<div class="verdict-line"><span class="status '+r.status+'">'+ST_TXT[r.status]+'</span><span class="vtype">Tipo detectado: <b>'+esc(r.type)+'</b></span></div>'+
        '<ul class="checks">'+r.checks.map(function(c){ var ic=icon(c[1]); return '<li class="'+ic[0]+'"><i>'+ic[1]+'</i><span>'+esc(c[0])+(c[2]?'<small>'+esc(c[2])+'</small>':'')+'</span></li>'; }).join("")+'</ul>'+
        '<div class="outbox">'+
          (r.norm?'<div class="out"><h4>Dirección normalizada '+copyBtn("cpn","o-norm")+'</h4><div class="mono" id="o-norm">'+esc(r.norm)+'</div></div>':'')+
          (r.ask?'<div class="out"><h4>Mensaje para el cliente '+copyBtn("cpa","o-ask")+'</h4><div class="mono" id="o-ask">'+esc(r.ask)+'</div></div>':'')+
          (r.notes||[]).map(function(n){ return '<p class="alert"><strong>Atención:</strong> '+esc(n)+'</p>'; }).join("")+
          '<a class="maps" href="https://www.google.com/maps/search/?api=1&query='+mapsQ+'" target="_blank" rel="noopener">Ver en Google Maps ↗</a>'+
          '<p class="note">El validador revisa el formato con las reglas de Fénix. Que cumpla no garantiza que exista en el mapa.</p>'+
        '</div></div>';
    }
    function validator(c){
      var d=CACHE[c], v=st.v[c]||{a:"",city:"",cp:"",r:null}, mx=c==="mx";
      return '<div class="card-s val">'+
        '<div class="val-head"><div><h2>Validar dirección</h2><p>Pega la dirección tal como la escribió el cliente.</p></div><span class="lbl">'+esc(d.data.name)+'</span></div>'+
        '<form class="vform'+(mx?" mx":"")+'" id="vf" autocomplete="off">'+
          '<textarea id="va" rows="1" placeholder="'+esc(d.tries[0])+'" aria-label="Dirección del cliente">'+esc(v.a)+'</textarea>'+
          '<input type="text" id="vc" placeholder="Ciudad / municipio (opcional)" value="'+esc(v.city)+'" aria-label="Ciudad o municipio">'+
          (mx?'<input type="text" id="vp" inputmode="numeric" maxlength="5" placeholder="CP del pedido" value="'+esc(v.cp)+'" aria-label="CP del pedido">':'')+
          '<button class="btn" type="submit">Validar</button>'+
          '<button class="btn clear" type="button" id="vclear">Limpiar</button>'+
        '</form>'+
        '<div class="tries">Probar: '+d.tries.map(function(x,i){ return '<button class="try" data-try="'+i+'" title="'+esc(x)+'">'+esc(x)+'</button>'; }).join("")+'</div>'+
        (v.r?resultHTML(v.r,v.a,v.city,d.data):'')+
      '</div>';
    }
    function dir(c){
      var d=CACHE[c], a=d.addr, v=st.v[c], r=v&&v.r;
      var ti=Math.min(st.t[c]||0,a.types.length-1), t=a.types[ti];
      return validator(c)+'<div class="dhead"><h2>Tipos de dirección</h2><span class="src '+(a.ok?"":"v")+'">'+(a.ok?"Fuente":"Validar")+': '+esc(a.src)+'</span></div>'+
       '<div class="types" role="group" aria-label="Tipo de dirección">'+a.types.map(function(x,i){ return '<button class="type'+(r&&r.hit===i?" hit":"")+'" data-t="'+i+'" aria-pressed="'+(i===ti)+'">'+esc(x.name)+'<small>'+esc(x.hint)+'</small></button>'; }).join("")+'</div>'+
       '<div class="dgrid">'+
        '<div class="card-s panel">'+
         '<header><h3>'+esc(t.name)+'</h3><span class="when">'+esc(t.when)+'</span></header>'+
         '<div class="fmt">'+esc(t.fmt)+'</div>'+
         '<table class="fields"><tbody>'+t.f.map(function(f){ return '<tr><td>'+esc(f[0])+(f[2]?'<em>'+esc(f[2])+'</em>':'')+'</td><td><span class="tag '+f[1]+'">'+LV[f[1]]+'</span></td></tr>'; }).join("")+'</tbody></table>'+
        '</div>'+
        '<div class="side">'+
         '<div class="card-s box"><div class="out"><h4>Ejemplo</h4><div class="mono" id="ex">'+esc(t.ex)+'</div></div></div>'+
         '<div class="card-s box yn"><div class="y"><h4>✓ Se confirma</h4><ul>'+t.y.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join("")+'</ul></div><div class="n"><h4>✕ Se pide o corrige</h4><ul>'+t.n.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join("")+'</ul></div></div>'+
         '<div class="card-s box"><h3>Reglas del país</h3><ul class="plain">'+a.rules.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join("")+'</ul><p class="phone">Teléfono: '+esc(a.phone)+'</p></div>'+
        '</div>'+
       '</div>';
    }
    function rowsOf(c){ return ORDER.filter(function(k){ return k in c.rows; }); }
    function tra(cc){
      var d=CACHE[cc].data, q=st.q.trim().toLowerCase();
      if(!d.carriers.length) return '<div class="card-s empty"><h3>Fichas de '+esc(d.name)+' pendientes</h3><p style="margin:6px 0 0">Las direcciones de '+esc(d.name)+' ya están en la pestaña Direcciones. Falta la información de sus transportadoras.</p></div>';
      var list=d.carriers.filter(function(c){ return !q||c.name.toLowerCase().includes(q)||JSON.stringify(c.rows).toLowerCase().includes(q)||(c.alert||"").toLowerCase().includes(q); });
      var body;
      if(!list.length) body='<div class="card-s empty">Ninguna transportadora de '+esc(d.name)+' coincide con “'+esc(st.q)+'”.</div>';
      else if(st.mode==="cards") body='<div class="cards">'+list.map(function(c){ return '<article class="card-s card">'+
        '<header><h3>'+esc(c.name)+'</h3>'+(c.tag?'<span class="tag q">'+esc(c.tag)+'</span>':'<span class="lbl">'+esc(d.code)+'</span>')+'</header>'+
        '<div class="kpis">'+c.kpi.map(function(k){ return '<div class="kpi"><b>'+esc(k[0])+'</b><span>'+esc(k[1])+'</span></div>'; }).join("")+'</div>'+
        '<dl class="rows">'+rowsOf(c).map(function(k){ return '<div class="row"><dt>'+k+'</dt><dd>'+val(c.rows[k])+'</dd></div>'; }).join("")+'</dl>'+
        (c.alert?'<div class="alert"><strong>Atención:</strong> '+esc(c.alert)+'</div>':'')+'</article>'; }).join("")+'</div>';
      else { var keys=ORDER.filter(function(k){ return list.some(function(c){ return k in c.rows; }); });
        body='<div class="card-s tablewrap"><table class="cmp"><thead><tr><th></th>'+list.map(function(c){ return '<th>'+esc(c.name)+'</th>'; }).join("")+'</tr></thead><tbody>'+
        keys.map(function(k){ return '<tr><th>'+k+'</th>'+list.map(function(c){ return '<td>'+(k in c.rows?val(c.rows[k]):'<span class="na">—</span>')+'</td>'; }).join("")+'</tr>'; }).join("")+
        '<tr><th>Atención</th>'+list.map(function(c){ return '<td>'+(c.alert?esc(c.alert):'<span class="na">—</span>')+'</td>'; }).join("")+'</tr></tbody></table></div>'; }
      return '<div class="card-s common"><span class="lbl">Reglas comunes · '+esc(d.name)+'</span><ul>'+d.common.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join("")+'</ul></div>'+
       '<div class="bar"><div class="seg" role="group" aria-label="Vista"><button class="tg" data-m="cards" aria-pressed="'+(st.mode==="cards")+'">Fichas</button><button class="tg" data-m="table" aria-pressed="'+(st.mode==="table")+'">Comparar</button></div>'+
       '<input type="search" id="q" placeholder="Buscar: oficina, efectivo, Michoacán…" value="'+esc(st.q)+'" aria-label="Buscar en fichas"></div>'+body;
    }
    function bindCopy(rt){ rt.querySelectorAll("[data-copy]").forEach(function(b){ b.onclick=function(e){ e.preventDefault();
      var el=$(b.dataset.copy), t=el.textContent;
      var sel=function(){ var r=document.createRange(); r.selectNodeContents(el); var s=window.getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent="Seleccionado"; };
      try{ navigator.clipboard.writeText(t).then(function(){ b.textContent="Copiado"; setTimeout(function(){ b.textContent="Copiar"; },1400); }, sel); }catch(_){ sel(); } }; }); }

    function runValidate(){
      var c=st.c, a=$("va").value, city=$("vc").value, cpEl=$("vp"), cp=cpEl?cpEl.value:"";
      st.v[c]={a:a,city:city,cp:cp,r:null};
      if(!a.trim()){ render(); return; }
      api('fichas-validate',{pais:c,raw:a,city:city,cp:cp}).then(function(res){
        st.v[c].r = res && res.result ? res.result : null;
        if(st.v[c].r && st.v[c].r.hit>=0){ st.t[c]=st.v[c].r.hit; save(); }
        render();
      }).catch(function(){});
    }

    function paint(){
      nav();
      $("t-dir").setAttribute("aria-selected", st.view==="dir");
      $("t-tra").setAttribute("aria-selected", st.view==="tra");
      var vd=$("v-dir"), vt=$("v-tra");
      vd.hidden=st.view!=="dir"; vt.hidden=st.view!=="tra";
      if(st.view==="dir"){
        vd.innerHTML=dir(st.c); bindCopy(vd);
        vd.querySelectorAll("[data-t]").forEach(function(b){ b.onclick=function(){ st.t[st.c]=+b.dataset.t; save(); render(); }; });
        $("vf").onsubmit=function(e){ e.preventDefault(); runValidate(); };
        $("vclear").onclick=function(){ delete st.v[st.c]; render(); $("va").focus(); };
        var ta=$("va"); ta.onkeydown=function(e){ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); runValidate(); } };
        vd.querySelectorAll("[data-try]").forEach(function(b){ b.onclick=function(){ ta.value=CACHE[st.c].tries[+b.dataset.try]; runValidate(); }; });
      } else {
        vt.innerHTML=tra(st.c);
        vt.querySelectorAll("[data-m]").forEach(function(b){ b.onclick=function(){ st.mode=b.dataset.m; save(); render(); }; });
        var q=$("q"); if(q) q.oninput=function(){ st.q=q.value; var p=q.selectionStart; render(); var n=$("q"); n.focus(); n.setSelectionRange(p,p); };
      }
    }
    function render(){
      if(CACHE[st.c]){ paint(); return; }
      var c=st.c;
      api('fichas-data',{pais:c}).then(function(res){
        if(!res || !res.ok) return;
        CACHE[c]={data:res.data, addr:res.addr, tries:res.tries};
        if(st.c===c) paint();
      }).catch(function(){});
    }
    $("t-dir").onclick=function(){ st.view="dir"; save(); render(); };
    $("t-tra").onclick=function(){ st.view="tra"; save(); render(); };

    api('fichas-data',{}).then(function(res){
      if(!res || !res.ok) return;
      countries=res.paises;
      if(!countries.some(function(p){ return p.key===st.c; })) st.c=countries[0].key;
      render();
    }).catch(function(){});
  };
})();
