// Datos y reglas de validación de las Fichas de Transportadoras (solo servidor).
const S="si",N="no",Q="q";
const DATA={
 mx:{name:"México",code:"MX",
  addr:{src:"Drive Dropi MX · Recomendaciones Logísticas",verified:true,
   steps:[["Estado","Equivale a departamento/región.",1],["Municipio / Alcaldía","",1],["Colonia","Es el barrio. Debe coincidir con el CP.",1],["Código postal (5 dígitos)","Lo da el cliente. Si no coincide con municipio y colonia, la paquetera rechaza el pedido.",1],["Calle + número exterior","Las calles tienen nombre propio (ej. Calle Horacio).",1],["Número interior","Obligatorio si es condominio, edificio o unidad. Sin él no hay entrega.",1],["Entre calles","Ej. Calle Homero entre Av. Tulipán y Av. Rosales.",1],["Referencias","Cerca de iglesia, escuela, estación del metro…",1]],
   ex:"Estado: Ciudad de México\nMunicipio: Miguel Hidalgo\nColonia: Polanco V Sección · CP 11560\nCalle Homero 1425, Int. 302\nEntre Av. Tulipán y Av. Rosales\nRef: frente a la farmacia",
   phone:"Celular de 10 dígitos (normalmente es el mismo WhatsApp).",
   bad:["CP que no corresponde a la colonia","Falta número interior en edificio o condominio","Sin entre calles ni referencias","Teléfono incompleto (menos de 10 dígitos)"]},
  common:["2 intentos estipulados. Sin obligación de 3er intento (salvo lo indicado por transportadora).","Un único intento si la novedad es: fuera de cobertura, zona de alto riesgo, amenaza al repartidor, COD rechazado, cliente canceló o no reconoce la compra. Sin evidencia (foto o geolocalización) puede ir a investigación.","Responder novedades en 24–48 h máximo; sin respuesta efectiva puede pasar a devolución.","No permite cambiar dirección en el mismo municipio/estado: revisar cobertura por colonia.","Recaudo máx. $4,999 MXN · sin tarjeta · 3 kg volumétrico (excedente se cobra por kilo).","Reclamos: 15 días hábiles por el chat flotante. Investigación 15–30 días hábiles; pago 15–30 días calendario. No cobran devoluciones."],
  carriers:[
   {n:"TIUI",k:["15,114","CP con recaudo"],intentos:"2 · sin 3er intento",oficina:[N,"No permite pasar a sucursal"],contacto:"No informado",dev:[N,"No genera nueva guía para devolución"],bodega:[S,"Recoge en bodegas externas"]},
   {n:"AMPM",k:["3,409","CP con recaudo (18,515 pago anticipado)"],intentos:"2 · sin 3er intento",oficina:[N,"No permite pasar a sucursal"],contacto:"No informado",dev:[S,"Genera nueva guía para devolución"],bodega:[N,"No recoge en bodegas externas"],alert:"Posibles demoras por bloqueos en Michoacán (Morelia, Tzintzuntzan, Coeneo, Zacapu, La Piedad, Ecuandureo, Zamora, Chilchota, Churintzio, Zináparo, Purépero, Ixtlán, Tangancícuaro) y en corredores Guadalajara–CDMX."},
   {n:"AFIMEX",k:["12,088","CP con recaudo"],intentos:"2 · sin 3er intento",oficina:[N,"No permite pasar a sucursal"],contacto:"No informado",dev:[S,"Genera nueva guía para devolución"],bodega:[N,"No recoge en bodegas externas"]},
   {n:"VELOCES",k:["1,615","CP con recaudo"],intentos:"2 · 3er intento solo si el drop lo pide con respuesta efectiva",oficina:[N,"No permite pasar a sucursal"],contacto:"Llamada / SMS",dev:[N,"No genera nueva guía para devolución"],bodega:[S,"Recoge en bodegas externas"]},
   {n:"COORDI",k:["4,783","CP con recaudo"],intentos:"2 · 3er intento con costo (nueva guía, cobro proporcional)",oficina:[S,"Permite pasar recolección a sucursal"],contacto:"Llamada / SMS",dev:[S,"Genera nueva guía para devolución"],bodega:[S,"Recoge en bodegas externas"],alert:"Despachos suspendidos temporalmente a Chihuahua y Coahuila. No generar guías a esos estados."},
   {n:"QUALITY POST",k:["74,439","CP con recaudo"],intentos:"2 · sin 3er intento",oficina:[N,"No permite pasar a sucursal"],contacto:"No informado",dev:[N,"No genera nueva guía para devolución"],bodega:[S,"Recoge en bodegas externas"]}
  ].map(c=>({name:c.n,kpi:[[c.k[0],"CP cobertura"],["2","Intentos"],["$4,999","Recaudo máx"]],
   rows:{"Cobertura":c.k[0]+" "+c.k[1],"Tiempo entrega":null,"Intentos":c.intentos,"Novedades":"Responder en 24–48 h","Retiro oficina":c.oficina,"Apertura":null,"Contacto cliente":c.contacto,"Cambio dirección":[N,"No (validar cobertura por colonia)"],"Pago":"Efectivo contra entrega · sin tarjeta","Peso máx":"3 kg volumétrico","Devolución":c.dev,"Recolección":c.bodega,"Reclamos":"15 días hábiles · chat flotante"},alert:c.alert}))
 },
 ar:{name:"Argentina",code:"AR",
  addr:{src:"Drive Dropi AR · Buenas prácticas logísticas y capacitación Fixy",verified:true,
   steps:[["Provincia","Ej. Ciudad Autónoma de Buenos Aires, Córdoba.",1],["Localidad","Barrio o municipio (ej. Palermo, Ramos Mejía).",1],["Código postal (4 dígitos)","Debe corresponder a la localidad. Define el ruteo.",1],["Calle","Nombre completo, sin abreviaturas confusas (Av. Rivadavia).",1],["Altura","En zona urbana no existen calles sin número. Sin altura = 1 solo intento (Urbano).",1],["Piso y depto.","Obligatorio si es edificio.",1],["Entre calles","Lo pide Fixy para geolocalizar.",1],["Link de Google Maps","Reduce la novedad “Dirección no geolocalizada”.",0]],
   ex:"Provincia: CABA\nLocalidad: Belgrano · CP 1428\nAv. Cabildo 2040, Piso 5, Depto B\nEntre Juramento y Mendoza\nMaps: link de ubicación",
   phone:"Celular con código de área (ej. 11 para AMBA), sin 0 ni 15.",
   bad:["Calle sin altura","CP que no coincide con la localidad","Edificio sin piso/depto.","Enviar con Fixy fuera de AMBA o con Urbano dentro de AMBA"]},
  common:["Regla de asignación: CABA/AMBA → FIXY · Interior del país → URBANO.","Avisar al cliente por WhatsApp cómo paga: billetes exactos (Fixy) o app con QR Mercado Pago (Urbano)."],
  carriers:[
   {name:"FIXY",kpi:[["AMBA","Cobertura"],["2","Salidas efectivas"],["24 h","Entrega"]],
    rows:{"Cobertura":"CABA, AMBA y zonas del Gran Buenos Aires (CP 1000–1439 CABA + partidos AMBA). Córdoba próximamente.","Tiempo entrega":"24 h · L a V, franja 08:00–20:00 (nunca prometer hora exacta)","Intentos":"Hasta 2 salidas; 3ª solo excepcional. Después se crea guía nueva.","Novedades":"Responder en máx. 7 días. “Esperando programación” vence a los 10 días hábiles. Reprogramación máx. 5 días hábiles.","Retiro oficina":[S,"Retiro en depósito Fixy (opción para zonas peligrosas)"],"Apertura":[N,"No abre ni muestra el paquete. No se aceptan pruebas ni cambios en la entrega."],"Contacto cliente":"Notificación automática en cada estado + link para cambiar ubicación y fecha. Destinatario: +54 9 11 3381-0216","Cambio dirección":[S,"Vía link del correo o respuesta a la novedad"],"Pago":"SOLO efectivo, monto exacto. Sin transferencia, tarjeta ni QR.","Peso máx":null,"Devolución":"Sin respuesta en plazo → cobro de servicio y devolución","Recolección":"Solicitar 07:00–13:00 para colecta el mismo día (retiro 13:30–19:00)","Reclamos":"Empresas: +54 9 11 3381-0122"},
    alert:"Zonas peligrosas sin entrega a domicilio: Villa Celina (1772), Fuerte Apache (1702), Dock Sud–Isla Maciel (1871), Villa 1-11-14 (1406), Villa 31 (1100/1001/1006), Villa 20 (1439), Villa Soldati (1407), Villa Zabaleta (1437). Ofrecer dirección alternativa o retiro en depósito."},
   {name:"URBANO",kpi:[["Nacional","Cobertura"],["2","Intentos"],["5 d háb.","Rescate (SP)"]],
    rows:{"Cobertura":"Todo el país. Menor tasa de entrega en zonas urbanas densas.","Tiempo entrega":"SLA en días hábiles desde el check AS (sin fines de semana ni feriados)","Intentos":"Hasta 2 (2º hasta 72 h hábiles). Solo 1 si falta altura, dirección insuficiente, destinatario desconocido o mudado.","Novedades":"Estado SP (Servicio Pendiente): 5 días hábiles para rescatar en el Módulo de Rescate. Sin gestión → devolución.","Retiro oficina":[S,"Retiro en sucursal coordinado por Call Center"],"Apertura":null,"Contacto cliente":"Destinatario usa URBI (asistente web) · urbano.com.ar/segui-tu-envio","Cambio dirección":[S,"Desde Módulo de Rescate durante SP (corregir datos, nueva visita o nuevo domicilio)"],"Pago":"SOLO QR de Mercado Pago. No acepta efectivo.","Peso máx":null,"Devolución":"DV = en proceso de devolución · RV = devolución","Recolección":null,"Reclamos":"cxurbano@urbano.com.ar (shipper + ID en el asunto) · 9:00–18:00"},
    alert:"Sin listado de zonas peligrosas: el chofer decide al llegar. Si no entra, queda en SP y se puede cambiar domicilio o retirar en sucursal."}
  ]
 },
 py:{name:"Paraguay",code:"PY",
  addr:{src:"Estándar operativo — no está en el Drive PY",verified:false,
   steps:[["Departamento","Ej. Central, Capital (Asunción), Alto Paraná.",1],["Ciudad","Ej. Luque, San Lorenzo, Fernando de la Mora.",1],["Barrio o compañía","En zonas rurales se usa “compañía”.",1],["Calle principal + número de casa","Si la casa no tiene número, indicarlo.",1],["Calle transversal (c/ o esq.)","Ej. Mcal. López c/ Brasilia.",1],["Referencias","Color de casa, portón, comercio cercano.",1],["Ubicación de Google Maps","Muy recomendada: muchas zonas no tienen numeración.",0]],
   ex:"Departamento: Central\nCiudad: San Lorenzo · Barrio Villa Laurelty\nAv. Mcal. Estigarribia 1250 c/ Tte. Ruiz\nRef: casa blanca con portón negro, frente a farmacia\nMaps: link de ubicación",
   phone:"Celular de 10 dígitos que empieza con 09 (ej. 0981 123 456).",
   bad:["Sin calle transversal ni referencia","Barrio en zona peligrosa sin opción de retiro","Pedir cambio de dirección (ninguna lo permite)"]},
  common:["Ninguna permite cambiar dirección en la misma ciudad ni cambiar de ciudad.","No aceptan tarjeta de crédito ni débito. Todas manejan novedades en Dropi.","Consultas con la transportadora por CAS (Mis Pedidos → ícono CAS): orden sin movimiento (+24 h), corrección de estado (foto de guía + producto) o informar novedad."],
  carriers:[
   {name:"FIXY",kpi:[["27","Poblaciones"],["2","Intentos"],["3.000.000 Gs","Recaudo máx"]],
    rows:{"Cobertura":"27 poblaciones","Tiempo entrega":null,"Intentos":"2","Novedades":"Gestión en Dropi","Retiro oficina":[N,"No tiene reclamo en oficina"],"Apertura":null,"Contacto cliente":null,"Cambio dirección":[N,"No permite"],"Pago":"Solo efectivo (sin transferencia)","Peso máx":"10 kg · 50×50×50 cm","Devolución":"Genera nueva guía · cobra devolución y flete","Recolección":"En bodega: sí · servicio Next Day / Same Day","Reclamos":"7 días hábiles desde entregada o devolución"},
    alert:"Cobertura condicionada en Asunción: Bañado Sur, Bañado Norte, Ricardo Brugada/Chacarita, Tacumbú. Caso a caso en periferias de Luque, San Lorenzo, Capiatá, Limpio, MRA, J.A. Saldívar, Ñemby y San Antonio."},
   {name:"AEX",kpi:[["121","Poblaciones"],["3","Intentos"],["2.500.000 Gs","Recaudo máx"]],
    rows:{"Cobertura":"121 poblaciones","Tiempo entrega":null,"Intentos":"3","Novedades":"Gestión en Dropi","Retiro oficina":[S,"Retiro en oficina: 72 h. Retiene hasta 5 días y luego devuelve."],"Apertura":null,"Contacto cliente":null,"Cambio dirección":[N,"No. Si está en oficina se puede pedir entrega en puerta en la misma zona; otra zona/ciudad = guía nueva."],"Pago":"Efectivo o transferencia","Peso máx":"Hasta 15 T (móvil exclusivo) · 220×220×90 cm","Devolución":"Nueva guía con costo adicional","Recolección":"En bodega: sí","Reclamos":"Según contrato de servicios"}},
   {name:"PUNTO A PUNTO",kpi:[["31","Poblaciones"],["4","Intentos"],["2.000.000 Gs","Recaudo máx"]],
    rows:{"Cobertura":"31 poblaciones","Tiempo entrega":null,"Intentos":"4","Novedades":"Gestión en Dropi","Retiro oficina":[S,"Todas las sucursales · 5 días hábiles (se pueden pedir cambios en ese plazo)"],"Apertura":null,"Contacto cliente":null,"Cambio dirección":[N,"No permite"],"Pago":"Efectivo o transferencia","Peso máx":"5 a 8 kg · 40×40×40 cm","Devolución":"No genera nueva guía · cobra devolución","Recolección":"L a V 09:00–16:00 · en oficina antes de 15:00 con planilla","Reclamos":"5 días desde el evento · reembolso 100% del valor declarado"},
    alert:"Barrio Ricardo Brugada (Chacarita / Pelopincho / San Felipe) sin cobertura: retiro en Casa Central (Av. Gral. Santos esq. Concordia) o salir con el driver a zona regular. No transporta líquidos ni químicos."}
  ]
 },
 ec:{name:"Ecuador",code:"EC",
  addr:{src:"Estándar operativo — no está en el Drive EC",verified:false,
   steps:[["Provincia","Ej. Pichincha, Guayas.",1],["Ciudad / cantón","Ej. Quito, Guayaquil, Daule.",1],["Parroquia, sector o ciudadela","Ej. Cdla. Sauces, La Carolina.",1],["Calle principal + numeración","Quito usa nomenclatura N/S/E/Oe (ej. N34-120). Guayaquil usa Manzana y Villa (Mz 250 V 12).",1],["Calle secundaria (intersección)","Ej. Av. Amazonas y República.",1],["Referencias","Edificio, color de casa, local cercano.",1]],
   ex:"Provincia: Pichincha · Ciudad: Quito\nSector: La Carolina\nAv. Amazonas N34-120 y Av. República\nEdif. Torre Azul, piso 3, of. 302\nRef: junto al banco",
   phone:"Celular de 10 dígitos que empieza con 09.",
   bad:["Sin calle secundaria","En Guayaquil, sin manzana y villa","Cambiar de ciudad (ninguna lo permite)"]},
  common:["Pago: solo efectivo y valor exacto. Sin tarjeta, PSE, Wompi, Nequi ni Daviplata.","Todas permiten cambiar dirección en la misma ciudad; ninguna permite cambiar de ciudad.","No cobran devoluciones ni generan guía nueva. Robos con violencia no se indemnizan.","Reclamos solo por botón flotante con factura o nota de venta (SRI). Producto dañado entregado: 24 h desde “Entregado”, con video de preparación."],
  carriers:[
   {name:"LAARCOURIER",kpi:[["405","Poblaciones"],["3","Intentos"],["USD 400","Recaudo máx"]],
    rows:{"Cobertura":"405 poblaciones · recolección L a V","Tiempo entrega":null,"Intentos":"3","Novedades":"Gestión en Dropi","Retiro oficina":[S,"Hasta 5 días · solo oficinas autorizadas Dropi. En oficina ya no cambia punto ni sale a ruta."],"Apertura":null,"Contacto cliente":null,"Cambio dirección":[S,"Misma ciudad"],"Pago":"Efectivo exacto","Peso máx":"2 kg","Devolución":"Sin cobro","Recolección":"Bodega: pedir antes de 12:00 · oficina hasta 17:00 con manifiesto","Reclamos":"5 días hábiles (pérdida, daño, robo)"}},
   {name:"SERVIENTREGA",kpi:[["599","Poblaciones"],["2","Intentos"],["USD 500","Recaudo máx"]],
    rows:{"Cobertura":"599 poblaciones · recolección L a S","Tiempo entrega":null,"Intentos":"2","Novedades":"Gestión en Dropi","Retiro oficina":[S,"Hasta 7 días · solo oficinas autorizadas Dropi. En oficina ya no cambia punto ni sale a ruta."],"Apertura":null,"Contacto cliente":null,"Cambio dirección":[S,"Misma ciudad"],"Pago":"Efectivo exacto","Peso máx":"2 kg","Devolución":"Sin cobro","Recolección":"Oficina: máx. 14 paquetes/día, hasta 18:00 · entrega insumos (frágil, sábado, líquidos)","Reclamos":"5 días · indemniza máx. 80% · pago ≈90 días"}},
   {name:"GINTRACOM",kpi:[["313","Poblaciones"],["3","Intentos"],["USD 500","Recaudo máx"]],
    rows:{"Cobertura":"313 poblaciones · recolección L a S","Tiempo entrega":null,"Intentos":"3","Novedades":"Gestión en Dropi","Retiro oficina":[N,"No tiene retiro en oficina"],"Apertura":[S,"Permite abrir el paquete"],"Contacto cliente":null,"Cambio dirección":[S,"Misma ciudad"],"Pago":"Efectivo exacto","Peso máx":"5 kg · 45×30 cm","Devolución":"Sin cobro · no refactura por sobrepeso","Recolección":"Valida cada guía en recolección · oficinas solo Quito y Guayaquil, hasta 16:30","Reclamos":"5 días · con factura del costo del producto"},
    alert:"Tras generar la guía hay 7 días para despachar; si no, pasa a CANCELADO POR TRANSPORTADORA."},
   {name:"VELOCES",kpi:[["79","Poblaciones"],["3","Intentos"],["USD 250","Recaudo máx"]],
    rows:{"Cobertura":"79 poblaciones · recolección L a S en Quito, Guayaquil, Daule (La Aurora) y Samborondón","Tiempo entrega":null,"Intentos":"3","Novedades":"Gestión en Dropi","Retiro oficina":[N,"No tiene retiro en oficina"],"Apertura":null,"Contacto cliente":null,"Cambio dirección":[S,"Misma ciudad"],"Pago":"Efectivo exacto","Peso máx":"2 kg · 30×30 cm","Devolución":"Sin cobro · no refactura por sobrepeso","Recolección":"Valida cada guía · oficina máx. 20 paquetes/día, hasta 16:30","Reclamos":"No indemniza daños en ningún caso"}},
   {name:"URBANO",kpi:[["335","Poblaciones"],["2","Intentos"],["USD 500","Recaudo máx"]],
    rows:{"Cobertura":"335 poblaciones · recolección L a V","Tiempo entrega":null,"Intentos":"2","Novedades":"Gestión en Dropi","Retiro oficina":[S,"Hasta 7 días · si hubo un intento previo, máx. 4 días en oficina"],"Apertura":null,"Contacto cliente":null,"Cambio dirección":[S,"Misma ciudad"],"Pago":"Efectivo exacto","Peso máx":"2 kg","Devolución":"Sin cobro","Recolección":"Oficina: máx. 14 paquetes/día, hasta 17:00","Reclamos":"24 h (robo, pérdida, daño) · devolución no recibida: 3 días"}}
  ]
 },
 pa:{name:"Panamá",code:"PA",
  addr:{src:"Información interna Fénix (Panamá)",verified:true,
   steps:[["Provincia","Ej. Panamá, Panamá Oeste, Colón, Chiriquí.",1],["Corregimiento","Ej. Bella Vista, San Francisco, Juan Díaz.",1],["Barriada o zona","Nombre de la barriada, urbanización o sector.",1],["Dirección detallada","Calle, nombre del PH o edificio, número de piso y apartamento o casa.",1],["Punto de referencia","Local, parada o lugar conocido cercano.",1]],
   ex:"Provincia: Panamá\nCorregimiento: San Francisco\nBarriada: Coco del Mar\nCalle 74, PH Ocean View, piso 12, apto 12B\nRef: frente al Super 99",
   phone:"Celular de 8 dígitos que empieza con 6 (ej. 6123-4567).",
   bad:["Sin corregimiento","PH sin piso ni apartamento","Sin punto de referencia"]},
  common:["Datos cargados por el equipo; confirmar el nombre de la transportadora y los puntos marcados como Validar."],
  carriers:[
   {name:"Transportadora Panamá",tag:"Nombre por confirmar",kpi:[["76%","Efectividad"],["3","Intentos (a veces 4)"],["24–72 h","Entrega"]],
    rows:{"Cobertura":"Redirección dentro de la misma provincia","Tiempo entrega":"24 a 72 horas","Intentos":"3 (en ocasiones 4)","Novedades":"La tienda tiene 5 días para gestionar. Sacan a reparto aunque la tienda no responda.","Gestión novedad":"Equipo interno que llama al cliente (filtro)","Retiro oficina":[N,"No tiene envío a oficina (solo Bocagrande)"],"Apertura":[Q,"No permiten abrir la mercancía (el reporte también dice que sí: confirmar)"],"Contacto cliente":"Llaman e insisten. Canal (llamada local / WhatsApp): por confirmar","Cambio dirección":[S,"Dentro de la misma provincia"],"Pago":"Todos los medios digitales (Yappy)","Peso máx":null,"Entregas":"Algunos mensajeros entregan festivos y domingos","Reclamos":null}}
  ]
 }
};
DATA.co={name:"Colombia",code:"CO",carriers:[],common:[]};
DATA.cl={name:"Chile",code:"CL",carriers:[],common:[]};
DATA.gt={name:"Guatemala",code:"GT",carriers:[],common:[]};
const COUNTRY_ORDER=["co","mx","gt","cl","ec","pa","ar","py"];
const SRC_F="Direcciones Fénix · Reglas 6-oct-2026";
/* f = [campo, nivel ob|ap|op, nota] */
const ADDR={
 co:{src:SRC_F,ok:true,phone:"Celular de 10 dígitos que empieza por 3.",
  rules:["Vía completa: Carrera, Calle, Avenida, Transversal, Diagonal (no Cra, Cl, Av).","# separa la vía del cruce y el guion va en la placa: # 12 - 20.","Nunca borrar letras ni cambiar dígitos: B, BIS, dobles de Medellín (AA…HH), Sur, Norte.","“Casa 56” no es la placa. Si falta el segundo número, se pide.","Ciudad y departamento van en sus campos, no dentro de la dirección."],
  types:[
   {name:"Urbana con placa",hint:"La más común",when:"Casa o local en ciudad o cabecera con nomenclatura.",fmt:"[Vía] [N] [letra] # [X] [letra] - [Y]",
    f:[["Vía completa + número","ob","Carrera 20 B"],["Cruce después de #","ob","# 12 A"],["Número de placa después del guion","ob","- 20"],["Barrio","op",""],["Apto, interior, piso","ap","Si es edificio o casa interna"]],
    ex:"Carrera 20 B # 12 A - 20, Barrio La Floresta",
    y:["Calle 15 Bis # 13-44","Calle 83 C # 80 N - 11 (Cali: N = Norte)","Calle 77 BB # 52 - 10 (Medellín)","Carrera 26 con calle 29, casa 2913 → Carrera 26 # 29 - 13"],
    n:["Calle 2D 12 casa 56 (falta el 2º número)","Calle 12 con 30 carrera 8 (ambigua)","# 880 sin guion (no se adivina)","Esquina sin número de casa"]},
   {name:"Conjunto / edificio",hint:"Sin placa también vale",when:"Conjunto residencial, torre o edificio con unidades.",fmt:"[Nombre conjunto], Torre [T], Apto [N]",
    f:[["Nombre del conjunto o edificio","ob",""],["Torre / bloque / interior","ap",""],["Apartamento o casa","ob",""],["Dirección del conjunto","op","Ayuda si es ciudad grande"]],
    ex:"Conjunto Reserva del Bosque, Torre 3, Apto 502",y:["Exenta del formato de placa si trae unidad"],n:["Solo el nombre del conjunto, sin torre ni apto"]},
   {name:"Costera Manzana-Lote",hint:"Barrios de la costa",when:"Barrios que se ubican por manzana y lote.",fmt:"Barrio [nombre], Manzana [M], Lote [L]",
    f:[["Barrio","ob",""],["Manzana","ob","Letras como “Manzana K” se conservan"],["Lote o casa","ob",""],["Referencia","op",""]],
    ex:"Barrio El Pozón, Manzana 23, Lote 8",y:["Válida sin placa"],n:["Manzana sin lote"]},
   {name:"Rural",hint:"Km, vereda o finca",when:"Fuera del casco urbano.",fmt:"Vereda [nombre] / Km [N] vía [A-B], Finca [nombre] + referencia",
    f:[["Vereda, kilómetro o finca","ob",""],["Referencia","ob","Escuela, tienda, puente…"],["Municipio","ob","En su campo"]],
    ex:"Vereda El Rosal, Finca La Esperanza, a 200 m de la escuela",y:["Válida sin placa"],n:["Solo “vereda” sin nombre ni referencia"]},
   {name:"Oficina transportadora",hint:"Recoge el cliente",when:"El cliente retira en oficina del carrier.",fmt:"Oficina [Transportadora] [barrio / zona]",
    f:[["Transportadora","ob",""],["Barrio o zona de la oficina","ap","Obligatorio en ciudad grande (hay varias oficinas)"]],
    ex:"Oficina Interrapidísimo Prado",y:["“Oficina principal de X” en municipio pequeño"],n:["“Oficina principal” a secas en Bogotá, Medellín, Cali, Barranquilla…"]}
  ]},
 mx:{src:SRC_F+" + Recomendaciones Logísticas MX",ok:true,phone:"Celular de 10 dígitos (normalmente es el mismo WhatsApp).",
  rules:["Obligatorio: CP de 5 dígitos + número de calle + estado o municipio.","Si el texto no trae CP, se toma del campo CP del pedido en Dropi. No se le pide al cliente.","Colonia no es obligatoria para validar, pero la paquetera la usa: debe coincidir con el CP. Fraccionamiento o Residencial = Colonia.","Coordenadas GPS entre paréntesis: se dejan tal cual."],
  types:[
   {name:"Urbana con número",hint:"La más común",when:"Casa o local con número exterior.",fmt:"[Calle] [Núm ext], [Int], Col. [Colonia], [Municipio], [Estado], CP [XXXXX]",
    f:[["Calle + número exterior","ob",""],["CP (5 dígitos)","ob","Si falta, usar el del pedido"],["Estado o municipio","ob","Al menos uno"],["Colonia","op","Debe coincidir con el CP"],["Entre calles / referencias","op","Ayudan al repartidor"]],
    ex:"Calle Homero 1425, Col. Polanco V Secc., Miguel Hidalgo, CDMX, CP 11560\nEntre Av. Tulipán y Av. Rosales",
    y:["Sin CP en el texto pero con CP en el pedido","Fraccionamiento en vez de colonia"],n:["Sin número de calle y sin “S/N”","CP que no corresponde a la colonia"]},
   {name:"Condominio / edificio",hint:"Número interior",when:"Departamento, condominio o unidad habitacional.",fmt:"[Calle] [Núm ext], Int. [N], Col. [Colonia], CP [XXXXX]",
    f:[["Calle + número exterior","ob",""],["Número interior","ob","Sin él la paquetera no entrega"],["CP (5 dígitos)","ob",""],["Estado o municipio","ob",""]],
    ex:"Av. Universidad 1200, Int. 302, Col. Xoco, Benito Juárez, CDMX, CP 03330",y:["Int., Depto. o Dpto. valen igual"],n:["Edificio sin número interior"]},
   {name:"Sin número (S/N)",hint:"Casa sin número",when:"El cliente dice que su casa no tiene número.",fmt:"[Calle] S/N, Col. [Colonia], CP [XXXXX] + referencia",
    f:[["“S/N” escrito","ob",""],["Colonia","ob",""],["CP","ob",""],["Referencia","ap","Obligatoria en zona rural"]],
    ex:"Calle Hidalgo S/N, Col. Centro, Tepoztlán, Morelos, CP 62520\nRef: frente a la iglesia",y:["S/N + colonia + CP: no pedir número (sería un bucle)"],n:["Calle sin número y sin “S/N”"]}
  ]},
 gt:{src:SRC_F,ok:true,phone:"Celular de 8 dígitos.",
  rules:["En Ciudad de Guatemala la ZONA es obligatoria (1 a 25).","Fuera de la capital, el municipio es obligatorio.","Número local en formato N-N (ej. 12-34).","“Zona tres” escrita en letras vale como Zona 3."],
  types:[
   {name:"Capital",hint:"Ciudad de Guatemala",when:"Dentro de Ciudad de Guatemala.",fmt:"Zona [N], [Avenida/Calle] [N-N], [Colonia]",
    f:[["Zona","ob","Sin zona = incompleta"],["Avenida o calle + número N-N","ob",""],["Colonia","op",""]],
    ex:"Zona 2, 4 Avenida 1-19, Colonia El Carmen",y:["4 av 1-19 zona 2"],n:["4 Avenida 1-19 sin zona"]},
   {name:"Cabecera municipal",hint:"Fuera de la capital",when:"Casco urbano de otro municipio.",fmt:"[Municipio], [Avenida/Calle] [Número]",
    f:[["Municipio","ob",""],["Calle o avenida + número","ob",""],["Referencia","op",""]],
    ex:"Mixco, 3 Calle 5-20, Colonia Lo de Fuentes",y:["Número + coma + municipio"],n:["Dirección sin municipio"]},
   {name:"Rural",hint:"Aldea, caserío, cantón, km",when:"66 municipios no tienen nomenclatura de calles.",fmt:"Aldea / Caserío / Cantón [nombre] o Km [N] + referencia",
    f:[["Aldea, caserío, cantón o Km","ob",""],["Referencia real","ob","Frente a…, iglesia, escuela, gasolinera, color de la casa"],["Número","op","No se exige"]],
    ex:"Aldea Trancas, casa verde frente a la escuela",y:["Km 111, casa rosada junto a la gasolinera","Aldea Trancas, casa verde"],n:["“Aldea Rosada” sin otra referencia (el color es el nombre del lugar)","Cantón Verde sin referencia"]}
  ]},
 cl:{src:SRC_F,ok:true,phone:"Celular de 9 dígitos que empieza por 9 (+56 9).",
  rules:["Número obligatorio (98% de los casos).","No se exige código postal.","La comuna va en su campo, no dentro de la dirección.","No usar formato colombiano (Carrera # 30-40)."],
  types:[
   {name:"Urbana",hint:"Calle + número",when:"Casa o local en ciudad.",fmt:"[Tipo vía] [Nombre] [Número]",
    f:[["Tipo de vía","op","Calle, Avenida, Pasaje, Camino, Ruta"],["Nombre de la vía","ob","Los Leones, Apoquindo…"],["Número","ob",""]],
    ex:"Av. Apoquindo 5000",y:["Los Leones 1234"],n:["Los Leones (sin número)"]},
   {name:"Departamento / villa",hint:"Unidad interna",when:"Edificio, condominio, villa o pasaje.",fmt:"[Vía] [Nombre] [Número], Depto [N]",
    f:[["Vía + número","ob",""],["Depto, casa o block","ob",""],["Villa o condominio","op",""]],
    ex:"Los Leones 1234, Depto 502",y:["Pasaje Las Rosas 45, Villa Los Aromos"],n:["Edificio sin número de depto."]},
   {name:"Rural",hint:"Parcela, sitio, km",when:"Sin numeración de calle.",fmt:"Parcela / Sitio [N] o Km [N] + referencia",
    f:[["Parcela, sitio o km","ob",""],["Referencia","ob",""]],
    ex:"Parcela 14, Camino a Lampa km 3, portón azul",y:["Única excepción al número obligatorio"],n:["Camino sin parcela, km ni referencia"]}
  ]},
 ec:{src:SRC_F,ok:true,phone:"Celular de 10 dígitos que empieza por 09.",
  rules:["Ciudad o provincia obligatoria en el texto.","No rechazar por falta de número: 30% de las direcciones válidas no lo tienen.","Se conservan ciudadela, manzana, sector y referencia.","Referencias válidas: frente a, junto a, detrás de."],
  types:[
   {name:"Intersección",hint:"Calle y calle",when:"25% del volumen. Muy usada en Quito.",fmt:"[Calle] y [Calle], [Sector], [Ciudad]",
    f:[["Calle principal","ob",""],["Calle secundaria (“y”)","ob",""],["Sector o barrio","ap",""],["Ciudad o provincia","ob",""]],
    ex:"Av. Amazonas y Av. República, La Carolina, Quito",y:["Av. Amazonas N34-120 y República, Quito"],n:["Av. Amazonas y República (sin ciudad)"]},
   {name:"Con número",hint:"Calle + número",when:"Casa con numeración.",fmt:"[Calle] [N], [Barrio], [Ciudad]",
    f:[["Calle","ob",""],["Número","ob",""],["Barrio","ap",""],["Ciudad o provincia","ob",""]],
    ex:"Calle Bolívar 12-45, Barrio Centro, Cuenca",y:["Guayaquil: Mz 250 Villa 12, Cdla. Sauces 6"],n:["Número sin ciudad"]},
   {name:"Sin número",hint:"Sector o referencia",when:"30% del volumen. Válida si tiene referencia fuerte.",fmt:"[Ciudadela/Sector/Barrio] + referencia, [Ciudad]",
    f:[["Ciudadela, sector o barrio","ob",""],["Referencia","ob","frente a, junto a, detrás de"],["Ciudad","ob",""],["“S/N”","op","Si lo escriben, vale con ciudad + referencia"]],
    ex:"Cdla. Alborada 5ta etapa, junto al parque, Guayaquil",y:["S/N + ciudad + referencia"],n:["Solo ciudad, sin sector ni referencia"]},
   {name:"Retiro en oficina",hint:"LAAR, Servientrega, Urbano",when:"El cliente retira en oficina autorizada por Dropi.",fmt:"Oficina [Transportadora] [ciudad / sector]",
    f:[["Transportadora","ob","Gintracom y Veloces no tienen"],["Oficina autorizada Dropi","ob",""]],
    ex:"Oficina Servientrega La Mariscal, Quito",y:["LAAR hasta 5 días · Servientrega y Urbano hasta 7"],n:["Oficina no autorizada para Dropi"]}
  ]},
 pa:{src:"Información interna Fénix (Panamá)",ok:true,phone:"Celular de 8 dígitos que empieza por 6.",
  rules:["Siempre: Provincia + Corregimiento + dirección detallada + referencia.","La redirección solo se puede dentro de la misma provincia."],
  types:[
   {name:"PH / edificio",hint:"Apartamento",when:"Propiedad horizontal o edificio.",fmt:"[Provincia], [Corregimiento], [Barriada], PH [nombre], piso [N], apto [N] + referencia",
    f:[["Provincia","ob",""],["Corregimiento","ob",""],["Barriada o zona","ob",""],["Nombre del PH","ob",""],["Piso y apartamento","ob",""],["Punto de referencia","ob",""]],
    ex:"Panamá, San Francisco, Coco del Mar\nPH Ocean View, piso 12, apto 12B\nRef: frente al Super 99",y:["Con nombre del PH y piso"],n:["PH sin piso ni apartamento"]},
   {name:"Casa en barriada",hint:"Casa",when:"Vivienda en barriada o urbanización.",fmt:"[Provincia], [Corregimiento], [Barriada], calle [X], casa [N] + referencia",
    f:[["Provincia","ob",""],["Corregimiento","ob",""],["Barriada","ob",""],["Calle y número de casa","ob",""],["Punto de referencia","ob",""]],
    ex:"Panamá Oeste, Vista Alegre, Barriada Altos de Vista Alegre\nCalle 5, casa 12\nRef: al lado de la tienda china",y:["Con barriada y referencia"],n:["Sin corregimiento"]}
  ]},
 ar:{src:"Drive Dropi AR · Buenas prácticas y capacitación Fixy",ok:true,phone:"Celular con código de área (11 en AMBA), sin 0 ni 15.",
  rules:["En zona urbana no existen calles sin número: siempre altura.","CP de 4 dígitos que corresponda a la localidad.","CABA/AMBA → Fixy. Interior → Urbano."],
  types:[
   {name:"Casa",hint:"Calle + altura",when:"Vivienda con frente a la calle.",fmt:"[Calle] [Altura], entre [X] y [Y], [Localidad], CP [XXXX], [Provincia]",
    f:[["Calle sin abreviar","ob",""],["Altura","ob","Sin altura, Urbano hace 1 solo intento"],["Localidad","ob",""],["CP (4 dígitos)","ob",""],["Provincia","ob",""],["Entre calles","ap","Fixy lo pide"],["Link de Google Maps","op",""]],
    ex:"Av. Rivadavia 1420, entre Paraná y Uruguay, Balvanera, CP 1033, CABA",y:["Con altura y CP correcto"],n:["Calle sin altura","CP de otra localidad"]},
   {name:"Edificio",hint:"Piso y depto.",when:"Departamento en edificio.",fmt:"[Calle] [Altura], Piso [N], Depto [X], [Localidad], CP [XXXX]",
    f:[["Calle + altura","ob",""],["Piso y departamento","ob",""],["Localidad + CP","ob",""]],
    ex:"Av. Cabildo 2040, Piso 5, Depto B, Belgrano, CP 1428, CABA",y:["Piso y depto. completos"],n:["Edificio sin piso o depto."]},
   {name:"Zona peligrosa",hint:"Sin entrega a domicilio",when:"Villa Celina, Fuerte Apache, Villa 31, Villa 20 y otras (ver ficha Fixy).",fmt:"Dirección alternativa segura o retiro en depósito / sucursal",
    f:[["Dirección alternativa en zona con cobertura","ap",""],["o retiro en depósito Fixy / sucursal Urbano","ap",""]],
    ex:"Retiro en sucursal Urbano más cercana (coordinar por Call Center)",y:["Dirección alternativa completa"],n:["Insistir con entrega en la zona"]}
  ]},
 py:{src:"Estándar operativo · no está en el Drive PY",ok:false,phone:"Celular de 10 dígitos que empieza por 09.",
  rules:["Ninguna transportadora permite cambiar dirección después: pedirla completa desde el inicio.","Pedir ubicación de Google Maps: muchas zonas no tienen numeración."],
  types:[
   {name:"Urbana",hint:"Calle + transversal",when:"Ciudad con calles nombradas.",fmt:"[Calle] [N° casa] c/ [Transversal], Barrio [X], [Ciudad], [Departamento]",
    f:[["Calle principal","ob",""],["Número de casa","ap","Si existe"],["Calle transversal (c/)","ob",""],["Barrio","ob",""],["Ciudad y departamento","ob",""],["Referencia","ob",""]],
    ex:"Av. Mcal. Estigarribia 1250 c/ Tte. Ruiz, Barrio Villa Laurelty, San Lorenzo, Central\nRef: casa blanca, portón negro",y:["Con transversal y referencia"],n:["Solo calle principal"]},
   {name:"Compañía / rural",hint:"Sin numeración",when:"Compañías y zonas periféricas.",fmt:"Compañía [nombre], [Ciudad] + referencia + ubicación Maps",
    f:[["Compañía","ob",""],["Ciudad","ob",""],["Referencia","ob",""],["Ubicación de Maps","ob",""]],
    ex:"Compañía Isla Bogado, Luque. Ref: frente al almacén Don Juan. Maps: link",y:["Con ubicación"],n:["Zonas peligrosas sin opción de retiro (ver fichas)"]},
   {name:"Retiro en oficina",hint:"AEX o Punto a Punto",when:"Zona sin cobertura o cliente prefiere retirar.",fmt:"Sucursal [Transportadora] [ciudad]",
    f:[["Transportadora","ob","Fixy no tiene retiro en oficina"],["Sucursal","ob",""]],
    ex:"Casa Central Punto a Punto, Av. Gral. Santos esq. Concordia, Asunción",y:["AEX: 72 h · PAP: 5 días hábiles"],n:["Retiro con Fixy"]}
  ]}
};
/* ===== Validador de formato por país (reglas Direcciones Fénix 6-oct) ===== */
const deacc=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
const has=(t,re)=>re.test(t);
const R=(status,type,checks,ask,extra)=>Object.assign({status,type,checks,ask},extra||{});
const C=(label,ok,note)=>[label,ok,note||""];
const REF=/\b(frente|junto|detras|diagonal a|cerca|al lado|a lado|a la par|alapar|contiguo|esquina|iglesia|escuela|colegio|tienda|gasolinera|parque|cancha|salon|mercado|porton|casa (blanca|verde|azul|roja|rosada|amarilla|celeste|naranja|gris|crema|morada|cafe)|ref\b|referencia)/;

/* ---------- Colombia ---------- */
const CO_NORTE=["cali","armenia","popayan","yumbo","cartago","cucuta","aguachica","roldanillo","fusagasuga","piedecuesta","valledupar","ipiales","dosquebradas"];
const CO_GRANDE=["bogota","medellin","cali","barranquilla","cartagena","bucaramanga","cucuta","pereira","ibague","santa marta","villavicencio","manizales","pasto","neiva","soacha","bello","soledad","valledupar","monteria","armenia"];
const CO_CARR=/\b(interrapidisimo|inter rapidisimo|inter|servientrega|envia|coordinadora|tcc|deprisa|472|domina)\b/;
const VIA={calle:"Calle",cll:"Calle",cl:"Calle",clle:"Calle",calla:"Calle",calke:"Calle",caiie:"Calle",carrera:"Carrera",cra:"Carrera",cr:"Carrera",kra:"Carrera",kr:"Carrera",k:"Carrera",car:"Carrera",kar:"Carrera",karr:"Carrera",crra:"Carrera",cara:"Carrera",kara:"Carrera",karera:"Carrera",carera:"Carrera",carreara:"Carrera",avenida:"Avenida",av:"Avenida",avd:"Avenida",ave:"Avenida",ak:"Avenida Carrera",ac:"Avenida Calle",transversal:"Transversal",tv:"Transversal",tr:"Transversal",trans:"Transversal",trav:"Transversal",tranv:"Transversal",trasv:"Transversal",travessal:"Transversal",diagonal:"Diagonal",dg:"Diagonal",diag:"Diagonal",dig:"Diagonal",circular:"Circular",cq:"Circular",autopista:"Autopista"};
const STOP=/\b(barrio|br|b\/|apto|apartamento|apt|ap|torre|to|interior|int|piso|local|conjunto|conj|edificio|edif|casa|sector|urb|urbanizacion|manzana|mz|bloque|etapa|oficina|ofc|frente|cerca|junto|ref|referencia|via|vereda)\b|,/;
function vCO(raw,city){
  const t=deacc(raw).replace(/\s+/g," ").trim(), c=deacc(city||"");
  const bigCity=CO_GRANDE.some(x=>c.includes(x)||t.includes(x));
  if(/\b(oficina|retiro en|reclamar en|recoger en)\b/.test(t)){
    const place=t.replace(/\b(oficina|principal|de|del|la|el|en|retiro|reclamar|recoger|transportadora)\b/g,"").replace(CO_CARR,"").replace(new RegExp(CO_GRANDE.join("|"),"g"),"").replace(/[^a-z0-9]/g,"");
    const okPlace=place.length>2||(!bigCity&&!!c);
    return R(okPlace?"ok":(!c&&!bigCity?"review":"bad"),"Oficina transportadora",[C("Transportadora indicada",CO_CARR.test(t)),C("Dice cuál oficina (barrio o zona)",place.length>2,bigCity?"Obligatorio en ciudad grande":"En municipio pequeño basta “oficina principal”")],okPlace||(!c&&!bigCity)?"":"¿En cuál oficina de la transportadora quieres recoger? Indícanos el barrio o la zona.",{hit:4,notes:!okPlace&&!c&&!bigCity?["Escribe la ciudad: si es ciudad grande, hay que preguntar en cuál oficina (barrio o zona)."]:[]});
  }
  if(/\b(vereda|vda|km|kilometro|finca|corregimiento|parcela|hacienda)\b/.test(t)){
    const named=/\b(vereda|vda|finca|corregimiento|parcela|hacienda)\s+((el|la|los|las|san|santa) )?[a-z]{3,}/.test(t)||/\bkm\s*\d+/.test(t)||/\bkilometro\s*\d+/.test(t), ref=REF.test(t);
    return R(named&&ref?"ok":"bad","Rural",[C("Vereda, finca o km con nombre",named),C("Referencia",ref,"Escuela, tienda, puente…"),C("Municipio",!!c||null,"En el campo ciudad")],named&&ref?"":"Para ubicarte en la zona rural, ¿nos das el nombre de la vereda o finca y una referencia cercana (escuela, tienda, puente)?",{hit:3});
  }
  if(/\b(manzana|mz|mza)\s*[a-z0-9]+/.test(t)&&/\b(lote|lt|casa|cs)\s*[a-z]?\d+/.test(t)&&!/^(calle|carrera|cra|cl|cll|kr|avenida|av|transversal|diagonal|tv|dg)\b/.test(t))
    return R("ok","Costera Manzana-Lote",[C("Manzana",true),C("Lote o casa",true),C("Barrio",/\b(barrio|br|urb|urbanizacion|sector)\b/.test(t)||null,"Recomendado")],"",{hit:2});
  const unit=/\b(apto|apartamento|apt|ap|casa|interior|int)\s*[a-z]?\d+/.test(t);
  if(/\b(conjunto|conj|edificio|edif|torre|bloque|unidad|urbanizacion|residencial)\b/.test(t)&&unit&&!/\d+\s*[a-z]{0,2}\s*(#|no|nro|n°|num|numero)?\s*\d+\s*[a-z]{0,2}\s*-\s*\d+/.test(t))
    return R("ok","Conjunto / edificio",[C("Nombre del conjunto o edificio",true),C("Unidad (apto, casa, interior)",true),C("Placa",null,"No se exige en esta modalidad")],"",{hit:1});
  // Urbana con placa
  const m=t.match(/^([a-z]+)\.?\s*(?=\d)/);
  const viaKey=m&&VIA[m[1]]?m[1]:null;
  const checks=[];
  if(!viaKey){
    return R("bad","Sin tipo reconocido",[C("Empieza por una vía (Calle, Carrera…)",false),C("Conjunto con unidad, Manzana-Lote, rural u oficina",false)],"Para hacer tu entrega necesitamos la dirección completa, por ejemplo: Carrera 20 # 12 - 20, barrio y apartamento si aplica.",{hit:-1});
  }
  const via=VIA[viaKey];
  let rest=t.slice(m[0].length);
  const r2=raw.replace(/\s+/g," ").trim();
  const stopAt=rest.search(STOP); let tail="";
  // conservar "casa N" para la regla casa-N
  const casaM=rest.match(/\bcasa\s*(\d{1,4})([a-z])?\b/);
  if(stopAt>0){tail=r2.slice(m[0].length+stopAt).trim();rest=rest.slice(0,stopAt)}
  rest=rest.replace(/\b(con|y|no|nro|num|numero|nunero|mumero|nuemero|nu|nomenclatura|n°|#)\b|#|n°|º/g," ");
  rest=rest.replace(/\b(calle|carrera|cra|cr|kr|kra|cl|cll|avenida|av|transversal|tv|diagonal|dg)\b/g," ");
  const sur=/\b(sur|este|oeste)\b/.exec(t); rest=rest.replace(/\b(sur|este|oeste|norte)\b/g," ");
  const g=[];const re=/(\d+)\s*(bis(?![a-z])|[a-z]{1,2}(?![a-z]))?\s*(bis(?![a-z]))?/g;let x;
  while((x=re.exec(rest))){g.push({n:x[1],l:[x[2],x[3]].filter(Boolean).map(s=>s.toUpperCase().replace("BIS","Bis")).join(" ")})}
  const norte=CO_NORTE.some(n=>deacc(city||"").includes(n)||t.includes(n));
  if(g[0]&&g[0].l==="N"&&!norte)g[0].l="";
  const L=o=>o.n+(o.l?" "+o.l:"");
  let status="ok",ask="",norm="",type="Urbana con placa";
  checks.push(C("Vía reconocida: "+via,true,viaKey!==deacc(via).split(" ")[0]?"Se escribe completa":""));
  if(g.length>=3){norm=`${via} ${L(g[0])} # ${L(g[1])} - ${L(g[2])}`;checks.push(C("Cruce después de #",true),C("Número de placa",true));
    if(/^\d{3,4}$/.test(g[2].n)&&!g[2].l&&(g[2].n.startsWith(g[1].n)||g[2].n.startsWith(g[0].n))&&/\b(calle|carrera|cra|cr|kr|cl|cll|avenida|av|transversal|tv|diagonal|dg)\b/.test(t.slice(m[0].length))){status="review";norm="";checks.push(C("Placa sin ambigüedad",false,"“"+g[2].n+"” puede leerse de dos formas: no se toca"));ask="¿Nos confirmas el número completo de tu dirección con el guion? Ejemplo: # 9 - 22."}
    if(g.length>3){status="review";ask="";checks.push(C("Sin números de más",false,"Hay más de 3 números: revisar si es ambigua"))}}
  else if(g.length===2){
    const n2=g[1].n;
    if(casaM&&casaM[1].length>=3&&!casaM[2]){const cd=casaM[1],pre=[g[1].n,g[0].n].find(p=>cd.startsWith(p)&&cd.length-p.length===2);
      if(pre){const c2=pre===g[1].n?g[1]:g[0];let v2=via;if(pre===g[0].n){const sv=t.slice(m[0].length).match(/\b(calle|carrera|cra|cr|kr|kra|cl|cll|avenida|av|transversal|tv|diagonal|dg)\b/);if(sv)v2=VIA[sv[1]]}norm=`${v2} ${L(pre===g[1].n?g[0]:g[1])} # ${L(c2)} - ${cd.slice(pre.length)}`;checks.push(C("Placa leída desde “casa "+cd+"”",true,"Excepción del 3-oct"))}
      else{status="bad";checks.push(C("Número de placa",false,"“Casa "+cd+"” no es la placa"))}}
    else if(/^\d{4}$/.test(n2)&&!g[1].l){norm=`${via} ${L(g[0])} # ${n2.slice(0,2)} - ${n2.slice(2)}`;checks.push(C("Cruce y placa (4 cifras separadas 2-2)",true))}
    else if(/^\d{3}$/.test(n2)&&!g[1].l){status="review";checks.push(C("Placa de 3 cifras pegada",false,"No se adivina la partición"))}
    else if(casaM){status="bad";checks.push(C("Número de placa",false,"“Casa "+casaM[1]+"” no es la placa"))}
    else{status="bad";checks.push(C("Número de placa después del guion",false))}
    if(status==="bad")ask="Nos falta el número de la placa de tu dirección. Por ejemplo: "+via+" "+L(g[0])+" # "+L(g[1])+" - 20. ¿Nos lo confirmas?";
    if(status==="review")ask="¿Nos confirmas el número completo de tu dirección con el guion? Ejemplo: # 8 - 80 o # 88 - 0.";
  } else {status="bad";checks.push(C("Cruce y número de placa",false));ask="Nos falta el cruce y el número de tu dirección. Ejemplo: "+via+" "+(g[0]?L(g[0]):"20")+" # 12 - 20.";}
  if(norm&&sur)norm+=" "+sur[1][0].toUpperCase()+sur[1].slice(1);
  if(norm&&tail){let tl=tail.replace(/^,\s*/,"");if(checks.some(c=>/casa/.test(c[0])&&c[1]))tl=tl.replace(/\bcasa\s*\d+\b,?\s*/i,"").trim();if(tl)norm+=", "+tl}
  checks.push(C("Apto, torre o barrio",/\b(apto|apartamento|torre|interior|barrio|piso)\b/.test(t)||null,"Si aplica"));
  return R(status,type,checks,ask,{norm,hit:0});
}

/* ---------- México ---------- */
const MX_EST=/\b(aguascalientes|baja california|bcs|campeche|chiapas|chihuahua|cdmx|ciudad de mexico|mexico df|df|coahuila|colima|durango|guanajuato|guerrero|hidalgo|jalisco|edomex|estado de mexico|edo mex|michoacan|morelos|nayarit|nuevo leon|oaxaca|puebla|queretaro|quintana roo|san luis potosi|sinaloa|sonora|tabasco|tamaulipas|tlaxcala|veracruz|yucatan|zacatecas|municipio|alcaldia|delegacion)\b/;
function vMX(raw,city,cpOrder){
  const t=deacc(raw), cps=(t.match(/\b\d{5}\b/g)||[]), cpText=cps[0]||"", cpO=(cpOrder||"").trim();
  const cp=cpText||(/^\d{5}$/.test(cpO)?cpO:"");
  const sn=/\b(s\/n|s\.n\.|sn|sin numero)\b/.test(t);
  const nums=(t.replace(/\b\d{5}\b/g," ").replace(/\(-?\d+\.\d+,\s*-?\d+\.\d+\)/g," ").match(/\b\d{1,5}\s?[a-z]?\b/g)||[]);
  const num=nums.length>0||/\bnumero (uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\b/.test(t);
  const col=/\b(col\.?|colonia|fracc\.?|fraccionamiento|residencial|barrio|unidad|ejido|pueblo)\b/.test(t);
  const est=MX_EST.test(t)||!!(city&&city.trim());
  const edif=/\b(depto|departamento|edificio|condominio|torre|unidad habitacional|u\.?h\.?|privada|cerrada)\b/.test(t);
  const intr=/\b(int\.?|interior|depto\.?|dpto\.?|departamento)\s*[a-z]?\s*\d+/.test(t);
  const gps=/\(-?\d+\.\d+,\s*-?\d+\.\d+\)/.test(t);
  const checks=[C("Código postal (5 dígitos)",!!cp,cpText?"En el texto":cp?"Tomado del CP del pedido":"No está en el texto ni en el pedido")];
  let status="ok",ask="",type="Urbana con número",hit=0;
  if(sn){type="Sin número (S/N)";hit=2;checks.push(C("“S/N” escrito",true),C("Colonia",col));if(!col){status="bad";ask="Para entregar sin número necesitamos tu colonia. ¿Nos la indicas?"}}
  else{checks.push(C("Número de calle",num));if(!num){status="bad";ask="Nos falta el número exterior de tu domicilio. Si tu casa no tiene número, respóndenos “S/N”."}}
  checks.push(C("Estado o municipio",est,city?"Del campo ciudad":""));
  if(!est&&status==="ok"){status="bad";ask="¿En qué estado y municipio se entrega tu pedido?"}
  if(!cp){status="bad";ask=ask||"¿Nos compartes tu código postal (5 dígitos)?"}
  if(!sn)checks.push(C("Colonia",col||null,"No obligatoria para validar; la paquetera la usa"));
  if(edif){type="Condominio / edificio";hit=1;checks.push(C("Número interior",intr,"Sin él la paquetera no entrega"));if(!intr&&status==="ok"){status="review";ask="¿Cuál es tu número interior (departamento)?"}}
  if(cpText&&cpO&&cpText!==cpO)checks.push(C("CP del texto = CP del pedido",false,cpText+" ≠ "+cpO));
  const notes=gps?["Trae coordenadas GPS: se conservan tal cual."]:[];
  return R(status,type,checks,ask,{hit,notes});
}

/* ---------- Guatemala ---------- */
const GT_COLOR=/^(la |el )?(rosada|rosado|verde|blanca|blanco|azul|roja|rojo|amarilla|amarillo|negra|negro|colorada|colorado|morada|celeste|gris)\b/;
const NUMW={uno:1,dos:2,tres:3,cuatro:4,cinco:5,seis:6,siete:7,ocho:8,nueve:9,diez:10,once:11,doce:12,trece:13,catorce:14,quince:15,dieciseis:16,diecisiete:17,dieciocho:18,diecinueve:19,veinte:20,veintiuno:21,veintidos:22,veintitres:23,veinticuatro:24,veinticinco:25};
function vGT(raw,city){
  const t=deacc(raw),c=deacc(city||"");
  const zm=t.match(/\bzona\s*(\d{1,2}|[a-z]+)\b/), zona=zm&&(/^\d+$/.test(zm[1])||NUMW[zm[1]]);
  const capital=/ciudad de guatemala|guatemala ciudad|capital/.test(t+" "+c)||/^guatemala$/.test(c.trim());
  const rural=t.match(/\b(aldea|caserio|canton|km|kilometro)\b\s*([a-z0-9 ]{0,30})/);
  if(rural){
    let refText=t;
    const after=rural[2]||"";const colorName=["aldea","caserio","canton"].includes(rural[1])&&GT_COLOR.test(after.trim());
    if(colorName)refText=t.replace(rural[0],rural[1]+" ");
    const colorElsewhere=/\b(rosada|verde|blanca|azul|roja|amarilla|celeste|morada|crema)\b/.test(refText.replace(/^.*?\b(aldea|caserio|canton)\b\s*\S+/,""));
    const ref=REF.test(refText)||colorElsewhere||/alapar|frentea|ala par/.test(refText);
    const named=/\b(km|kilometro)\s*\d+/.test(t)||/\b(aldea|caserio|canton)\s+((el|la|los|las|san|santa) )?[a-z]{3,}/.test(t);
    const ok=named&&ref;
    return R(ok?"ok":"bad","Rural",[C("Aldea, caserío, cantón o km con nombre",named),C("Referencia real",ref,colorName?"El color es el NOMBRE del lugar: no cuenta como referencia":"Frente a, iglesia, escuela, color de la casa…"),C("Número",null,"No se exige en rural")],ok?"":"Para ubicar tu casa en la aldea, ¿nos das una referencia? Por ejemplo: frente a la iglesia o casa de color verde.",{hit:2});
  }
  const numNN=/\d+\s*-\s*\d+/.test(t), via=/\b(avenida|av|calle|cl|diagonal|calzada|bulevar|boulevard|blvd|via)\b/.test(t);
  const muni=!!c.trim()||/,\s*[a-z]{3,}/.test(t);
  if(capital||zona){
    const ok=zona&&(numNN||via);
    return R(ok?"ok":"bad","Capital",[C("Zona",!!zona,zm&&!/^\d+$/.test(zm[1])?"Zona en letras = Zona "+NUMW[zm[1]]:"Obligatoria en Ciudad de Guatemala"),C("Avenida o calle",via),C("Número N-N",numNN)],!zona?"¿En qué zona de la ciudad está tu dirección?":!ok?"¿Nos das la avenida o calle y el número (ej. 4 Avenida 1-19)?":"",{hit:0});
  }
  const ok=muni&&(numNN||via);
  return R(ok?"ok":"bad","Cabecera municipal",[C("Municipio",muni,"En el texto o en el campo ciudad"),C("Calle o avenida",via),C("Número",numNN||/\d+/.test(t))],ok?"":!muni?"¿En qué municipio se entrega tu pedido?":"¿Nos das la calle o avenida y el número de tu casa?",{hit:1});
}

/* ---------- Chile ---------- */
function vCL(raw){
  const t=deacc(raw);
  if(/#\s*\d+\s*-\s*\d+/.test(t)||/\b(carrera|cra)\s*\d+/.test(t))return R("review","Formato incorrecto",[C("Formato chileno: vía + nombre + número",false,"Parece formato colombiano")],"¿Nos confirmas tu dirección como calle y número? Ejemplo: Los Leones 1234, Depto 502.",{hit:-1});
  if(/\b(parcela|sitio|km|kilometro|hijuela|fundo|lote)\b/.test(t)){const ref=REF.test(t)||/\d/.test(t);return R(ref?"ok":"bad","Rural",[C("Parcela, sitio o km",true),C("Número o referencia",ref)],ref?"":"¿Nos das el número de parcela o una referencia (portón, camino)?",{hit:2})}
  const num=/[a-z]\.?\s+\d{1,5}\b/.test(t), depto=/\b(depto|dpto|departamento|block|casa|villa|condominio)\b/.test(t);
  const unitNum=/\b(depto|dpto|departamento|block|casa)\s*\.?\s*[a-z]?\d+/.test(t);
  let status=num?"ok":"bad",ask=num?"":"Nos falta el número de tu dirección. ¿Nos lo indicas? Ejemplo: Av. Apoquindo 5000.";
  const checks=[C("Nombre de la vía",/[a-z]{3,}/.test(t)),C("Número",num,"Obligatorio")];
  if(/\bedificio|torre\b/.test(t)||depto){checks.push(C("Depto, casa o block con número",unitNum));if(!unitNum&&status==="ok"){status="review";ask="¿Cuál es tu número de departamento o casa?"}}
  checks.push(C("Código postal",null,"No se exige"));
  return R(status,depto?"Departamento / villa":"Urbana",checks,ask,{hit:depto?1:0});
}

/* ---------- Ecuador ---------- */
const EC_CITY=/\b(quito|guayaquil|cuenca|ambato|manta|portoviejo|machala|loja|riobamba|esmeraldas|ibarra|santo domingo|duran|daule|samborondon|milagro|babahoyo|quevedo|latacunga|tulcan|salinas|la libertad|otavalo|sangolqui|cumbaya|tumbaco|pichincha|guayas|azuay|manabi|el oro|tungurahua|chimborazo|imbabura|cotopaxi|los rios|santa elena|carchi|bolivar|canar|napo|pastaza|sucumbios|orellana|zamora|morona|galapagos)\b/;
function vEC(raw,city){
  const t=deacc(raw),cityOk=EC_CITY.test(t)||!!(city&&city.trim());
  if(/\b(oficina|agencia|retiro en|retirar en)\b/.test(t)){const carr=/\b(laar|servientrega|urbano)\b/.test(t),bad=/\b(gintracom|veloces)\b/.test(t);
    return R(carr&&cityOk?"ok":"bad","Retiro en oficina",[C("Transportadora con oficina autorizada",carr,bad?"Gintracom y Veloces no tienen retiro en oficina":"LAAR, Servientrega o Urbano"),C("Ciudad",cityOk)],carr&&cityOk?"":"¿En qué ciudad y oficina quieres retirar tu pedido?",{hit:3})}
  const inter=/[a-z0-9]\s+(y|e)\s+(av|avenida|calle|[a-z]{3,})/.test(t)&&/\b(av|avenida|calle|pasaje|psje|[nseo]\d+)\b|\b[a-z]{4,}\s+(y|e)\s+[a-z]{4,}/.test(t);
  const num=/\b[nseo]?\d+\s*-\s*\d+\b|\b(mz|manzana|villa|solar|lote)\s*\d+|\b\d+\b/.test(t.replace(/\b(1ra|2da|3ra|[0-9]+(ra|da|ta|va|na))\b/g,""));
  const sector=/\b(cdla|ciudadela|sector|barrio|urb|urbanizacion|coop|cooperativa|conjunto|etapa|recinto|parroquia)\b/.test(t), ref=REF.test(t);
  const sn=/\b(s\/n|sin numero)\b/.test(t);
  let type=inter?"Intersección":num&&!sn?"Con número":"Sin número",hit=inter?0:num&&!sn?1:2;
  const ok=cityOk&&(inter||(num&&!sn)||sector||ref);
  const checks=[C("Ciudad o provincia",cityOk,"Obligatoria"),C("Intersección (calle y calle)",inter||null),C("Número",num&&!sn||null,"No es obligatorio"),C("Sector, ciudadela o barrio",sector||null),C("Referencia (frente a, junto a…)",ref||null)];
  if(sn)checks.push(C("“S/N” con ciudad + referencia",cityOk&&ref));
  return R(ok?"ok":"bad",type,checks,ok?"":!cityOk?"¿En qué ciudad se entrega tu pedido?":"¿Nos das el sector o ciudadela y una referencia (frente a, junto a)?",{hit});
}

/* ---------- Panamá ---------- */
const PA_PROV=/\b(panama oeste|panama|colon|chiriqui|cocle|herrera|los santos|veraguas|bocas del toro|darien|arraijan|la chorrera|san miguelito|david|santiago)\b/;
const PA_CORR=/\b(corregimiento|correg|bella vista|san francisco|betania|pueblo nuevo|parque lefevre|rio abajo|juan diaz|pedregal|tocumen|24 de diciembre|pacora|las cumbres|chilibre|ancon|curundu|calidonia|chorrillo|santa ana|san felipe|don bosco|jose domingo espinar|belisario porras|amelia denis|victoriano lorenzo|omar torrijos|rufina alfaro|mateo iturralde|ernesto cordoba|alcalde diaz|las mananitas|vista alegre|burunga|cerro silvestre|juan demostenes|nuevo emperador|veracruz|barrio colon|guadalupe|el coco|playa leona|herrera|cristobal|sabanitas|puerto pilon|barrio balboa|las garzas|caimitillo|el tecal|feuillet|nuevo arraijan|santa clara|pedasi)\b/;
function vPA(raw,city){
  const t=deacc(raw),c=deacc(city||"");
  const prov=PA_PROV.test(t+" "+c), corr=PA_CORR.test(t), ph=/\b(ph|p\.h\.|edificio|edif|torre|residencial|condominio)\b/.test(t);
  const zona=/\b(barriada|urbanizacion|urb|residencial|sector|villa|altos de|calle|avenida|ave|via|ph)\b/.test(t)||ph;
  const unit=ph?/\b(piso|apto|apartamento|apt)\s*\.?\s*[a-z0-9]+/.test(t)&&/\bpiso\b/.test(t):/\b(casa|lote|#)\s*[a-z]?\d+/.test(t);
  const ref=REF.test(t)||/\b(super|farmacia|parada|estacion|metro|mall|plaza|banco|restaurante)\b/.test(t);
  const checks=[C("Provincia",prov),C("Corregimiento",corr||null,corr?"":"No se reconoce: confirmar"),C("Barriada, calle o zona",zona),C(ph?"Piso y apartamento":"Número de casa",unit),C("Punto de referencia",ref)];
  const bad=!prov||!zona||!unit||!ref;
  const status=bad?"bad":corr?"ok":"review";
  const miss=[!prov&&"provincia",!corr&&"corregimiento",!zona&&"barriada o calle",!unit&&(ph?"piso y apartamento":"número de casa"),!ref&&"un punto de referencia"].filter(Boolean);
  return R(status,ph?"PH / edificio":"Casa en barriada",checks,miss.length?"Para completar tu entrega nos falta: "+miss.join(", ")+".":"",{hit:ph?0:1});
}

/* ---------- Argentina ---------- */
const AR_PELIGRO=/\b(villa celina|fuerte apache|ejercito de los andes|dock sud|isla maciel|villa 1-11-14|1-11-14|barrio rivadavia|villa 31|padre mugica|villa 20|villa soldati|lago soldati|zabaleta|villa 21)\b/;
function vAR(raw,city){
  const t=deacc(raw);
  const cp=/\b([a-z]?\d{4}[a-z]{0,3})\b/.exec(t), alt=/[a-z]{3,}\.?\s+\d{1,5}\b/.test(t.replace(/\b(c\.?p\.?|cp)\s*[a-z]?\d{4}[a-z]{0,3}\b/g,"")), sn=/\b(s\/n|sin numero|sin altura)\b/.test(t);
  const loc=!!(city&&city.trim())||/,\s*[a-z]{3,}/.test(t);
  const edif=/\b(piso|depto|dpto|departamento|torre|edificio)\b/.test(t), pd=/\bpiso\s*\d+/.test(t)&&/\b(depto|dpto|departamento)\s*\.?\s*[a-z0-9]+/.test(t);
  const peligro=AR_PELIGRO.test(t)||(cp&&["1772","1702","1871","1406","1100","1001","1006","1439","1407","1437"].includes(cp[1].replace(/\D/g,""))&&/\bvilla|barrio\b/.test(t));
  const checks=[C("Calle con altura",alt&&!sn,"En zona urbana no existen calles sin número"),C("Código postal (4 dígitos)",!!cp),C("Localidad y provincia",loc),C("Entre calles",/\bentre\b/.test(t)||null,"Fixy lo pide")];
  let status=alt&&!sn&&cp&&loc?"ok":"bad",type=edif?"Edificio":"Casa",hit=edif?1:0;
  if(edif){checks.push(C("Piso y departamento",pd));if(!pd&&status==="ok")status="bad"}
  const miss=[!(alt&&!sn)&&"la altura (número) de la calle",!cp&&"el código postal",!loc&&"la localidad",edif&&!pd&&"piso y departamento"].filter(Boolean);
  const notes=peligro?["Posible zona peligrosa (Fixy no entrega a domicilio): ofrecer dirección alternativa o retiro en depósito/sucursal."]:[];
  if(peligro){status=status==="ok"?"review":status;type="Zona peligrosa";hit=2}
  return R(status,type,checks,miss.length?"Para completar tu envío nos falta "+miss.join(", ")+".":"",{hit,notes});
}

/* ---------- Paraguay ---------- */
function vPY(raw,city){
  const t=deacc(raw);
  if(/\b(sucursal|oficina|retiro en|casa central)\b/.test(t)){const carr=/\b(aex|punto a punto|pap)\b/.test(t),fixy=/\bfixy\b/.test(t);
    return R(carr?"ok":"bad","Retiro en oficina",[C("Transportadora con sucursal (AEX o Punto a Punto)",carr,fixy?"Fixy no tiene retiro en oficina":"")],carr?"":"¿En qué sucursal de AEX o Punto a Punto quieres retirar?",{hit:2})}
  const comp=/\bcompa(n|ñ)ia\b/.test(t), ref=REF.test(t), maps=/maps|goo\.gl|ubicacion|https?:\/\//.test(t);
  const cityOk=!!(city&&city.trim())||/\b(asuncion|luque|san lorenzo|capiata|lambare|fernando de la mora|limpio|nemby|mariano roque alonso|mra|villa elisa|san antonio|itaugua|aregua|encarnacion|ciudad del este|central|caaguazu|coronel oviedo|pedro juan caballero|concepcion|villarrica)\b/.test(t);
  const peligro=/\b(chacarita|banado|ricardo brugada|tacumbu|pelopincho|san felipe)\b/.test(t);
  let checks,ok,type,hit;
  if(comp){type="Compañía / rural";hit=1;checks=[C("Compañía",true),C("Ciudad",cityOk),C("Referencia",ref),C("Ubicación de Maps",maps,"Muy recomendada")];ok=cityOk&&ref}
  else{type="Urbana";hit=0;const transv=/(c\/|\bcasi\b|\besq\b|\besquina\b|\bentre\b|\by\b)/.test(t),barrio=/\b(barrio|b°|bo\.)\b/.test(t);
    checks=[C("Calle principal",/[a-z]{3,}/.test(t)),C("Calle transversal (c/, esq.)",transv),C("Barrio",barrio||null,"Recomendado"),C("Ciudad",cityOk),C("Referencia",ref),C("Ubicación de Maps",maps||null,"Recomendada")];ok=transv&&cityOk&&ref}
  const notes=peligro?["Zona peligrosa: Fixy cobertura condicionada; Punto a Punto sin cobertura (retiro en Casa Central)."]:[];
  return R(ok?(peligro?"review":"ok"):"bad",type,checks,ok?"":"Para ubicarte necesitamos la calle transversal (c/), la ciudad y una referencia de tu casa. Si puedes, envíanos tu ubicación de Maps.",{hit,notes});
}
const VALID={co:vCO,mx:vMX,gt:vGT,cl:vCL,ec:vEC,pa:vPA,ar:vAR,py:vPY};
const TRIES={
 co:["Cra 20b 12a 20 barrio La Floresta","Calle 2D 12 casa 56","Calke 37c 1H39","Conjunto Reserva del Bosque torre 3 apto 502","Oficina principal de Interrapidisimo"],
 mx:["Calle Hidalgo 45, Col. Centro, Puebla, CP 72000","Calle Hidalgo S/N, Col. Centro, Tepoztlán, Morelos, CP 62520","Calle Morelos, Col. Roma, CDMX"],
 gt:["4 av 1-19 zona 2","Aldea Rosada, Jalapa","Aldea Trancas, casa verde frente a la escuela"],
 cl:["Los Leones 1234, Depto 502","Avenida Apoquindo","Parcela 14 camino a Lampa, portón azul"],
 ec:["Av. Amazonas y República, Quito","Cdla. Alborada 5ta etapa junto al parque, Guayaquil","Calle Bolívar"],
 pa:["Panamá, San Francisco, Coco del Mar, PH Ocean View piso 12 apto 12B, frente al Super 99","Panamá, Calle 50, casa 12"],
 ar:["Av. Rivadavia 1420, entre Paraná y Uruguay, CP 1033, CABA","Calle Mitre sin número, Lanús"],
 py:["Mcal. Estigarribia 1250 c/ Tte. Ruiz, Barrio Villa Laurelty, San Lorenzo, frente a farmacia","Compañía Isla Bogado, Luque"]
};

module.exports = { DATA, ADDR, TRIES, VALID, COUNTRY_ORDER };
