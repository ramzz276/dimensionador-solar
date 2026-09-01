// ===== VARIABLES GLOBALES PARA ALMACENAR RESULTADOS =====
let estado = {
    P_dispositivo: null,
    E_sesion: null,
    num_dispositivos: null,
    E_autosuficiencia: null,
    HSP: null,
    P_arreglo: null,
    P_panel: null,
    V_nominal: null,
    N_paneles_total: null,
    opciones_arreglo: [],
    arreglo_seleccionado: null,
    paneles_confirmados: false
};

// ===== FUNCIONES DE VALIDACIÓN =====
function validarNumero(valor, nombre) {
    if (valor === null || valor === undefined || valor === '') {
        mostrarError(`El campo "${nombre}" es requerido`);
        return false;
    }
    const num = parseFloat(valor);
    if (isNaN(num)) {
        mostrarError(`El valor "${nombre}" debe ser un número válido`);
        return false;
    }
    if (num <= 0) {
        mostrarError(`El valor "${nombre}" debe ser mayor que cero`);
        return false;
    }
    return num;
}

function validarEntero(valor, nombre) {
    if (valor === null || valor === undefined || valor === '') {
        mostrarError(`El campo "${nombre}" es requerido`);
        return false;
    }
    const num = parseInt(valor, 10);
    if (isNaN(num)) {
        mostrarError(`El valor "${nombre}" debe ser un número entero válido`);
        return false;
    }
    if (num <= 0) {
        mostrarError(`El valor "${nombre}" debe ser mayor que cero`);
        return false;
    }
    if (num !== parseFloat(valor)) {
        mostrarError(`El valor "${nombre}" debe ser un número entero, sin decimales`);
        return false;
    }
    return num;
}

function mostrarError(mensaje) {
    alert(`⚠️ Error de validación: ${mensaje}`);
}

function limpiarResultado(id) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.classList.remove('visible', 'error', 'warning');
        elemento.innerHTML = '';
    }
}

function mostrarResultado(id, contenido, clase = 'visible') {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.innerHTML = contenido;
        elemento.classList.add(clase);
    }
}

function redondearArriba(numero) {
    return Math.ceil(numero);
}

// ===== SECCIÓN 1: DIMENSIONAMIENTO DE BATERÍAS =====

// PASO 1.1: Registrar potencia requerida
function calcularPaso1_1() {
    limpiarResultado('resultado-1-1');
    
    const P_dispositivo_input = document.getElementById('P_dispositivo').value;
    const P_dispositivo = validarNumero(P_dispositivo_input, 'Potencia del vehículo eléctrico');
    
    if (!P_dispositivo) return;
    
    estado.P_dispositivo = P_dispositivo;
    
    const contenido = `
        <h4>Potencia registrada</h4>
        <p>P_dispositivo = <span class="valor">${P_dispositivo.toFixed(2)}</span> <span class="unidad">W</span></p>
    `;
    mostrarResultado('resultado-1-1', contenido);
}

// PASO 1.2: Calcular energía de sesión
function calcularPaso1_2() {
    limpiarResultado('resultado-1-2');
    
    if (!estado.P_dispositivo) {
        mostrarError('Primero debes registrar la potencia del vehículo eléctrico (Paso 1.1)');
        return;
    }
    
    const t_sesion_input = document.getElementById('t_sesion').value;
    const t_sesion = validarNumero(t_sesion_input, 'Duración de la sesión');
    
    if (!t_sesion) return;
    
    estado.t_sesion = t_sesion;
    
    // ECUACIÓN 1: E_sesion = P_dispositivo × t_sesion
    const E_sesion = estado.P_dispositivo * t_sesion;
    estado.E_sesion = E_sesion;
    
    const contenido = `
        <h4>Cálculo de energía por sesión</h4>
        <p class="ecuacion">E_sesion = P_dispositivo × t_sesion</p>
        <p class="ecuacion">E_sesion = ${estado.P_dispositivo.toFixed(2)} W × ${t_sesion.toFixed(2)} h</p>
        <p>E_sesion = <span class="valor">${E_sesion.toFixed(2)}</span> <span class="unidad">Wh</span></p>
    `;
    mostrarResultado('resultado-1-2', contenido);
}

// PASO 1.3: Calcular energía de autosuficiencia según dispositivos conectados
function calcularPaso1_3() {
    limpiarResultado('resultado-1-3');
    
    if (!estado.E_sesion) {
        mostrarError('Primero debes calcular la energía de sesión (Paso 1.2)');
        return;
    }
    
    const num_dispositivos_input = document.getElementById('num_dispositivos').value;
    const num_dispositivos = validarEntero(num_dispositivos_input, 'Número de vehículos simultáneos');
    
    if (!num_dispositivos) return;
    
    estado.num_dispositivos = num_dispositivos;
    
    // ECUACIÓN 2: E_autosuficiencia = E_sesion × num_dispositivos
    const E_autosuficiencia_base = estado.E_sesion * num_dispositivos;
    
    // Redondear hacia arriba
    const E_autosuficiencia = redondearArriba(E_autosuficiencia_base);
    estado.E_autosuficiencia = E_autosuficiencia;
    
    const contenido = `
        <h4>Cálculo de energía requerida</h4>
        <p class="ecuacion">E_autosuficiencia = E_sesion × num_dispositivos</p>
        <p class="ecuacion">E_autosuficiencia = ${estado.E_sesion.toFixed(2)} Wh × ${num_dispositivos}</p>
        <p>E_autosuficiencia (base) = <span class="valor">${E_autosuficiencia_base.toFixed(2)}</span> <span class="unidad">Wh</span></p>
        <hr style="margin: 12px 0; border: none; border-top: 1px solid rgba(0,0,0,0.1);">
        <p style="font-weight: 600;">E_autosuficiencia (redondeado) = <span class="valor">${E_autosuficiencia.toFixed(0)}</span> <span class="unidad">Wh</span></p>
        <hr style="margin: 12px 0; border: none; border-top: 1px solid rgba(0,0,0,0.1);">
        <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; border-left: 4px solid #17a2b8; margin-top: 15px;">
            <h4 style="color: #0c5460; margin-bottom: 12px;">Recomendación de batería</h4>
            <p style="margin: 10px 0; color: #0c5460;">
                Se debe seleccionar una batería o banco de baterías con una capacidad de almacenamiento 
                <strong>igual o mayor a ${E_autosuficiencia.toFixed(0)} Wh</strong>.
            </p>
            <p style="margin: 10px 0; font-size: 0.9em; color: #0c5460;">
                Esto garantiza que el sistema tenga suficiente energía almacenada para alimentar simultáneamente 
                ${num_dispositivos} vehículo(s) eléctrico(s) durante ${estado.t_sesion.toFixed(2)} hora(s).
            </p>
        </div>
    `;
    mostrarResultado('resultado-1-3', contenido);
}

// ===== SECCIÓN 2: DIMENSIONAMIENTO DE PANELES =====

// PASO 2.1: Registrar HSP y calcular automáticamente 2.2
function autoCalcularPaso2_2() {
    const HSP_input = document.getElementById('HSP').value;
    
    if (!HSP_input || HSP_input === '') {
        limpiarResultado('resultado-2-1');
        limpiarResultado('resultado-2-2');
        document.getElementById('paso-2-2').style.display = 'none';
        return;
    }
    
    const HSP = validarNumero(HSP_input, 'Horas Solar Pico');
    if (!HSP) {
        limpiarResultado('resultado-2-1');
        limpiarResultado('resultado-2-2');
        return;
    }
    
    estado.HSP = HSP;
    
    // Mostrar resultado 2.1
    const contenido2_1 = `
        <h4>Horas Solar Pico registradas</h4>
        <p>Horas Solar Pico promedio anual = <span class="valor">${HSP.toFixed(2)}</span> <span class="unidad">h</span></p>
    `;
    mostrarResultado('resultado-2-1', contenido2_1);
    
    // Calcular y mostrar 2.2 automáticamente
    if (estado.E_autosuficiencia) {
        document.getElementById('paso-2-2').style.display = 'block';
        const P_arreglo = estado.E_autosuficiencia / HSP;
        estado.P_arreglo = P_arreglo;
        
        const contenido2_2 = `
            <h4>Cálculo de potencia del arreglo solar</h4>
            <p class="ecuacion">P_arreglo = E_autosuficiencia ÷ Horas Solar Pico</p>
            <p class="ecuacion">P_arreglo = ${estado.E_autosuficiencia.toFixed(2)} Wh ÷ ${HSP.toFixed(2)} h</p>
            <p>P_arreglo = <span class="valor">${P_arreglo.toFixed(2)}</span> <span class="unidad">W</span></p>
        `;
        mostrarResultado('resultado-2-2', contenido2_2);
        
        // Auto-calcular 2.3 si hay datos
        autoCalcularPaso2_3();
    }
}

// PASO 2.3: Generar opciones de arreglo serie/paralelo automáticamente
function autoCalcularPaso2_3() {
    const P_panel_input = document.getElementById('P_panel').value;
    const V_nominal_input = document.getElementById('V_nominal').value;
    
    // Si falta alguno de los inputs, limpiar resultado
    if (!P_panel_input || !V_nominal_input || !estado.P_arreglo) {
        limpiarResultado('resultado-2-3');
        document.getElementById('selector-opciones').style.display = 'none';
        return;
    }
    
    const P_panel = validarNumero(P_panel_input, 'Potencia nominal del panel');
    const V_nominal = parseFloat(V_nominal_input);
    
    if (!P_panel) return;
    
    estado.P_panel = P_panel;
    estado.V_nominal = V_nominal;
    
    // ECUACIÓN 5: Cantidad total de paneles
    const N_paneles_float = estado.P_arreglo / P_panel;
    const N_paneles_total = redondearArriba(N_paneles_float);
    estado.N_paneles_total = N_paneles_total;
    
    // Verificar límite de 15-16 paneles
    let advertenciaLimite = '';
    if (N_paneles_total > 15) {
        advertenciaLimite = `
            <div class="resultado warning" style="display: block; margin-bottom: 20px;">
                <strong>⚠️ Advertencia de diseño:</strong><br>
                Se necesitan <strong>${N_paneles_total} paneles</strong>, lo que excede el límite recomendado de 15-16 paneles.
                Se recomienda seleccionar paneles con mayor potencia nominal para reducir la cantidad total.
            </div>
        `;
    }
    
    // Corriente de un panel
    const I_panel = P_panel / V_nominal;
    
    // Generar 3 opciones
    const opciones = [];
    
    // OPCIÓN A: Todo en serie
    const opcionA = {
        nombre: 'A',
        N_serie: N_paneles_total,
        N_paralelo: 1,
        N_total: N_paneles_total,
        V_arreglo: V_nominal * N_paneles_total,
        I_arreglo: I_panel * 1,
        advertencia: ''
    };
    opciones.push(opcionA);
    
    // OPCIÓN B: 2 ramas en paralelo (simétrico)
    const N_serie_B = redondearArriba(N_paneles_total / 2);
    const N_paralelo_B = 2;
    const N_total_B = N_serie_B * N_paralelo_B;
    const opcionB = {
        nombre: 'B',
        N_serie: N_serie_B,
        N_paralelo: N_paralelo_B,
        N_total: N_total_B,
        V_arreglo: V_nominal * N_serie_B,
        I_arreglo: I_panel * N_paralelo_B,
        advertencia: N_total_B > N_paneles_total ? `Se agregó ${N_total_B - N_paneles_total} panel(es) según el diseño del arreglo` : ''
    };
    opciones.push(opcionB);
    
    // OPCIÓN C: 3 ramas en paralelo (simétrico)
    const N_serie_C = redondearArriba(N_paneles_total / 3);
    const N_paralelo_C = 3;
    const N_total_C = N_serie_C * N_paralelo_C;
    const opcionC = {
        nombre: 'C',
        N_serie: N_serie_C,
        N_paralelo: N_paralelo_C,
        N_total: N_total_C,
        V_arreglo: V_nominal * N_serie_C,
        I_arreglo: I_panel * N_paralelo_C,
        advertencia: N_total_C > N_paneles_total ? `Se agregó ${N_total_C - N_paneles_total} panel(es) según el diseño del arreglo` : ''
    };
    opciones.push(opcionC);
    
    estado.opciones_arreglo = opciones;
    
    // Mostrar resumen de cálculo
    const contenido = `
        <h4>Cálculo de cantidad y opciones de arreglo</h4>
        <p class="ecuacion">N_paneles = redondeo_arriba(P_arreglo ÷ P_panel)</p>
        <p class="ecuacion">N_paneles = redondeo_arriba(${estado.P_arreglo.toFixed(2)} W ÷ ${P_panel.toFixed(2)} W)</p>
        <p>Cantidad de paneles necesarios = <span class="valor">${N_paneles_total}</span> <span class="unidad">paneles</span></p>
        <hr style="margin: 15px 0; border: none; border-top: 1px solid rgba(0,0,0,0.1);">
        <p><strong>Se generaron 3 opciones de arreglo simétrico:</strong> (selecciona una)</p>
    `;
    
    mostrarResultado('resultado-2-3', advertenciaLimite + contenido);
    
    // Mostrar selector de opciones
    generarSelectorOpciones();
}

function generarSelectorOpciones() {
    const contenedor = document.getElementById('opciones-container');
    contenedor.innerHTML = '';
    
    // Descripción inicial
    const descripcion = `
        <div class="descripcion-opciones">
            <p>
                <strong>Todas las opciones son válidas</strong> desde el punto de vista de generación de energía. 
                La elección depende de tus preferencias de voltaje y corriente del arreglo. Según la opción que selecciones, 
                deberás considerar cuidados específicos al elegir el inversor:
            </p>
            <ul style="margin-left: 20px; margin-top: 10px;">
                <li>Mayor voltaje en serie → requiere inversor con entrada de voltaje más alta</li>
                <li>Mayor corriente en paralelo → requiere inversor con entrada de corriente más alta</li>
            </ul>
        </div>
    `;
    contenedor.insertAdjacentHTML('beforebegin', descripcion);
    
    estado.opciones_arreglo.forEach((opcion) => {
        const html = `
            <div class="opcion-arreglo" id="opcion-${opcion.nombre}">
                <h4>Opción ${opcion.nombre}</h4>
                ${opcion.advertencia ? `<div class="advertencia">⚠️ ${opcion.advertencia}</div>` : ''}
                <div class="detalle">
                    <div class="detalle-item">
                        <label>Paneles totales</label>
                        <div class="valor">${opcion.N_total}</div>
                    </div>
                    <div class="detalle-item">
                        <label>En serie × Paralelo</label>
                        <div class="valor">${opcion.N_serie} × ${opcion.N_paralelo}</div>
                    </div>
                    <div class="detalle-item">
                        <label>Voltaje del arreglo</label>
                        <div class="valor">${opcion.V_arreglo.toFixed(2)} V</div>
                    </div>
                    <div class="detalle-item">
                        <label>Corriente del arreglo</label>
                        <div class="valor">${opcion.I_arreglo.toFixed(2)} A</div>
                    </div>
                </div>
                <button class="btn-seleccionar" onclick="seleccionarOpcion('${opcion.nombre}')">Seleccionar esta opción</button>
            </div>
        `;
        contenedor.innerHTML += html;
    });
    
    document.getElementById('selector-opciones').style.display = 'block';
}

function seleccionarOpcion(nombreOpcion) {
    const opcion = estado.opciones_arreglo.find(o => o.nombre === nombreOpcion);
    if (!opcion) return;
    
    estado.arreglo_seleccionado = opcion;
    estado.paneles_confirmados = true;
    
    // Marcar como seleccionada
    document.querySelectorAll('.opcion-arreglo').forEach(el => {
        el.classList.remove('seleccionada');
        el.querySelector('.btn-seleccionar').disabled = false;
        el.querySelector('.btn-seleccionar').textContent = 'Seleccionar esta opción';
    });
    
    const elementoSeleccionado = document.getElementById(`opcion-${nombreOpcion}`);
    elementoSeleccionado.classList.add('seleccionada');
    elementoSeleccionado.querySelector('.btn-seleccionar').disabled = true;
    
    alert(`✓ Opción ${nombreOpcion} confirmada: ${opcion.N_total} paneles (${opcion.N_serie} serie × ${opcion.N_paralelo} paralelo)`);
    
    // Calcular automáticamente paso 3
    calcularPaso3();
    
    // Scroll a sección 3
    document.getElementById('seccion-inversor').scrollIntoView({ behavior: 'smooth' });
}

// ===== SECCIÓN 3: DIMENSIONAMIENTO DEL INVERSOR =====

function calcularPaso3() {
    limpiarResultado('resultado-3');
    
    if (!estado.paneles_confirmados || !estado.arreglo_seleccionado) {
        return;
    }
    
    if (!estado.P_dispositivo) {
        mostrarError('No hay suficientes datos calculados. Verifica que hayas completado todos los pasos anteriores.');
        return;
    }
    
    const opcion = estado.arreglo_seleccionado;
    const P_entrada = opcion.V_arreglo * opcion.I_arreglo;
    const P_entrada_redonda = redondearArriba(P_entrada);
    const P_salida_redonda = redondearArriba(estado.P_dispositivo);
    
    const contenido = `
        <h4>Especificaciones y recomendaciones del inversor</h4>
        <hr style="margin: 15px 0; border: none; border-top: 1px solid rgba(0,0,0,0.1);">
        <p><strong>Potencia de entrada del inversor:</strong></p>
        <p>Potencia proveniente del arreglo = <span class="valor">${P_entrada_redonda}</span> <span class="unidad">W</span></p>
        <p style="font-size: 0.85em; color: #666;">(calculada: ${P_entrada.toFixed(2)} W, redondeada al entero superior)</p>
        <hr style="margin: 15px 0; border: none; border-top: 1px solid rgba(0,0,0,0.1);">
        <p><strong>Potencia de salida del inversor:</strong></p>
        <p>Potencia requerida por el vehículo eléctrico = <span class="valor">${P_salida_redonda}</span> <span class="unidad">W</span></p>
        <p style="font-size: 0.85em; color: #666;">(calculada: ${estado.P_dispositivo.toFixed(2)} W, redondeada al entero superior)</p>
        <hr style="margin: 15px 0; border: none; border-top: 1px solid rgba(0,0,0,0.1);">
        <p style="background: #e7f3ff; padding: 15px; border-radius: 6px; margin-top: 20px; font-size: 1.05em; font-weight: 500;">
            <strong>Recomendación:</strong><br>
            Se recomienda un inversor con una entrada de ${P_entrada_redonda} W y una salida de ${P_salida_redonda} W.
        </p>
        <hr style="margin: 15px 0; border: none; border-top: 1px solid rgba(0,0,0,0.1);">
        <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin-top: 15px;">
            <strong style="color: #856404;">⚠️ Precauciones importantes para la selección:</strong>
            <ul style="margin-left: 20px; margin-top: 10px; color: #856404;">
                <li>El voltaje de entrada máximo del inversor debe ser ≥ <span class="valor">${opcion.V_arreglo.toFixed(2)} V</span></li>
                <li>La corriente máxima de entrada del inversor debe ser ≥ <span class="valor">${opcion.I_arreglo.toFixed(2)} A</span></li>
                <li>Verifica que el inversor sea compatible con la potencia DC de entrada y AC de salida especificadas</li>
            </ul>
        </div>
    `;
    mostrarResultado('resultado-3', contenido);
}

// ===== FUNCIÓN DE REINICIO =====
function reiniciarApp() {
    // Limpiar todos los inputs
    document.getElementById('P_dispositivo').value = '';
    document.getElementById('t_sesion').value = '';
    document.getElementById('num_dispositivos').value = '';
    document.getElementById('HSP').value = '';
    document.getElementById('P_panel').value = '';
    document.getElementById('V_nominal').value = '';
    
    // Limpiar todos los resultados
    limpiarResultado('resultado-1-1');
    limpiarResultado('resultado-1-2');
    limpiarResultado('resultado-1-3');
    limpiarResultado('resultado-2-1');
    limpiarResultado('resultado-2-2');
    limpiarResultado('resultado-2-3');
    limpiarResultado('resultado-3');
    document.getElementById('paso-2-2').style.display = 'none';
    document.getElementById('selector-opciones').style.display = 'none';
    
    // Resetear estado
    estado = {
        P_dispositivo: null,
        E_sesion: null,
        num_dispositivos: null,
        E_autosuficiencia: null,
        HSP: null,
        P_arreglo: null,
        P_panel: null,
        V_nominal: null,
        N_paneles_total: null,
        opciones_arreglo: [],
        arreglo_seleccionado: null,
        paneles_confirmados: false
    };
    
    // Scroll al inicio
    document.querySelector('.encabezado').scrollIntoView({ behavior: 'smooth' });
    alert('✓ Aplicación reiniciada. Puedes comenzar nuevamente.');
}
