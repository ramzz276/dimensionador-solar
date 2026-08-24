// ===== VARIABLES GLOBALES PARA ALMACENAR RESULTADOS =====
let estado = {
    P_dispositivo: null,
    E_sesion: null,
    dias_autosuficiencia: null,
    E_autosuficiencia: null,
    HSP: null,
    P_arreglo: null,
    P_panel: null,
    V_oc: null,
    V_mp: null,
    I_sc: null,
    N_paneles_total: null,
    N_paneles_serie: null,
    N_paneles_paralelo: null,
    V_oc_total: null,
    I_sc_total: null,
    P_entrada: null,
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
        elemento.classList.remove('visible', 'error');
        elemento.innerHTML = '';
    }
}

function mostrarResultado(id, contenido, esError = false) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.innerHTML = contenido;
        elemento.classList.add('visible');
        if (esError) {
            elemento.classList.add('error');
        }
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
    const P_dispositivo = validarNumero(P_dispositivo_input, 'Potencia requerida del dispositivo');
    
    if (!P_dispositivo) return;
    
    estado.P_dispositivo = P_dispositivo;
    
    const contenido = `
        <h4>Potencia requerida registrada</h4>
        <p>P_dispositivo = <span class="valor">${P_dispositivo.toFixed(2)}</span> <span class="unidad">W</span></p>
    `;
    mostrarResultado('resultado-1-1', contenido);
}

// PASO 1.2: Calcular energía de sesión
function calcularPaso1_2() {
    limpiarResultado('resultado-1-2');
    
    if (!estado.P_dispositivo) {
        mostrarError('Primero debes registrar la potencia requerida del dispositivo (Paso 1.1)');
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

// PASO 1.3: Calcular energía de autosuficiencia y recomendar batería
function calcularPaso1_3() {
    limpiarResultado('resultado-1-3');
    
    if (!estado.E_sesion) {
        mostrarError('Primero debes calcular la energía de sesión (Paso 1.2)');
        return;
    }
    
    const dias_autosuficiencia_input = document.getElementById('dias_autosuficiencia').value;
    const dias_autosuficiencia = validarEntero(dias_autosuficiencia_input, 'Días de autosuficiencia');
    
    if (!dias_autosuficiencia) return;
    
    estado.dias_autosuficiencia = dias_autosuficiencia;
    
    // ECUACIÓN 2: E_autosuficiencia = E_sesion × dias_autosuficiencia
    const E_autosuficiencia_base = estado.E_sesion * dias_autosuficiencia;
    
    // Redondear hacia arriba
    const E_autosuficiencia = redondearArriba(E_autosuficiencia_base);
    estado.E_autosuficiencia = E_autosuficiencia;
    
    const contenido = `
        <h4>Cálculo de energía de autosuficiencia</h4>
        <p class="ecuacion">E_autosuficiencia = E_sesion × dias_autosuficiencia</p>
        <p class="ecuacion">E_autosuficiencia = ${estado.E_sesion.toFixed(2)} Wh × ${dias_autosuficiencia} días</p>
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
                Esto garantiza que el sistema tenga suficiente energía almacenada para alimentar el dispositivo 
                durante ${dias_autosuficiencia} día(s) sin recargas.
            </p>
        </div>
    `;
    mostrarResultado('resultado-1-3', contenido);
}

// ===== SECCIÓN 2: DIMENSIONAMIENTO DE PANELES =====

// PASO 2.1: Registrar HSP
function calcularPaso2_1() {
    limpiarResultado('resultado-2-1');
    
    const HSP_input = document.getElementById('HSP').value;
    const HSP = validarNumero(HSP_input, 'Horas Solar Pico');
    
    if (!HSP) return;
    
    estado.HSP = HSP;
    
    const contenido = `
        <h4>Horas Solar Pico registradas</h4>
        <p>HSP = <span class="valor">${HSP.toFixed(2)}</span> <span class="unidad">h</span></p>
    `;
    mostrarResultado('resultado-2-1', contenido);
}

// PASO 2.2: Calcular potencia del arreglo
function calcularPaso2_2() {
    limpiarResultado('resultado-2-2');
    
    if (!estado.E_autosuficiencia) {
        mostrarError('Primero debes calcular la energía de autosuficiencia en la Sección 1 (Paso 1.3)');
        return;
    }
    
    if (!estado.HSP) {
        mostrarError('Primero debes registrar las Horas Solar Pico (Paso 2.1)');
        return;
    }
    
    // ECUACIÓN 4: P_arreglo = E_autosuficiencia / HSP
    const P_arreglo = estado.E_autosuficiencia / estado.HSP;
    estado.P_arreglo = P_arreglo;
    
    const contenido = `
        <h4>Cálculo de potencia del arreglo solar</h4>
        <p class="ecuacion">P_arreglo = E_autosuficiencia ÷ HSP</p>
        <p class="ecuacion">P_arreglo = ${estado.E_autosuficiencia.toFixed(2)} Wh ÷ ${estado.HSP.toFixed(2)} h</p>
        <p>P_arreglo = <span class="valor">${P_arreglo.toFixed(2)}</span> <span class="unidad">W</span></p>
    `;
    mostrarResultado('resultado-2-2', contenido);
}

// PASO 2.3: Calcular cantidad y arreglo serie/paralelo de paneles
function calcularPaso2_3() {
    limpiarResultado('resultado-2-3');
    document.getElementById('decision-paneles').style.display = 'none';
    
    if (!estado.P_arreglo) {
        mostrarError('Primero debes calcular la potencia del arreglo (Paso 2.2)');
        return;
    }
    
    const P_panel_input = document.getElementById('P_panel').value;
    const P_panel = validarNumero(P_panel_input, 'Potencia nominal del panel');
    if (!P_panel) return;
    
    const V_oc_input = document.getElementById('V_oc').value;
    const V_oc = validarNumero(V_oc_input, 'Voltaje de circuito abierto (Voc)');
    if (!V_oc) return;
    
    const V_mp_input = document.getElementById('V_mp').value;
    const V_mp = validarNumero(V_mp_input, 'Voltaje en punto de máxima potencia (Vmp)');
    if (!V_mp) return;
    
    const I_sc_input = document.getElementById('I_sc').value;
    const I_sc = validarNumero(I_sc_input, 'Corriente de cortocircuito (Isc)');
    if (!I_sc) return;
    
    estado.P_panel = P_panel;
    estado.V_oc = V_oc;
    estado.V_mp = V_mp;
    estado.I_sc = I_sc;
    
    // ECUACIÓN 5: Cantidad total de paneles
    const N_paneles_float = estado.P_arreglo / P_panel;
    const N_paneles_total = redondearArriba(N_paneles_float);
    
    // Configuración simétrica: empezar con máximo 2 en serie
    // Si N_paneles_total <= 2, solo serie (1 o 2 paneles)
    // Si N_paneles_total > 2, dividir en serie (máx 2) y paralelo
    let N_paneles_serie, N_paneles_paralelo;
    
    if (N_paneles_total <= 2) {
        N_paneles_serie = N_paneles_total;
        N_paneles_paralelo = 1;
    } else {
        // Usar máximo 2 en serie como base
        N_paneles_serie = 2;
        // Calcular paralelo para mantener simetría
        N_paneles_paralelo = redondearArriba(N_paneles_total / N_paneles_serie);
        // Recalcular total para que sea simétrico
        N_paneles_total = N_paneles_serie * N_paneles_paralelo;
    }
    
    // Calcular voltajes y corrientes
    const V_oc_total = V_oc * N_paneles_serie;  // Voltaje en serie
    const I_sc_total = I_sc * N_paneles_paralelo; // Corriente en paralelo
    const P_entrada = V_oc_total * I_sc_total;   // Potencia de entrada (Voc × Isc)
    const V_mp_total = V_mp * N_paneles_serie;   // Voltaje mp para MPPT
    
    estado.N_paneles_total = N_paneles_total;
    estado.N_paneles_serie = N_paneles_serie;
    estado.N_paneles_paralelo = N_paneles_paralelo;
    estado.V_oc_total = V_oc_total;
    estado.I_sc_total = I_sc_total;
    estado.P_entrada = P_entrada;
    estado.V_mp_total = V_mp_total;
    estado.paneles_confirmados = false;
    
    const contenido = `
        <h4>Cálculo de cantidad y configuración del arreglo de paneles</h4>
        <p class="ecuacion">N_paneles = redondeo_arriba(P_arreglo ÷ P_panel)</p>
        <p class="ecuacion">N_paneles = redondeo_arriba(${estado.P_arreglo.toFixed(2)} W ÷ ${P_panel.toFixed(2)} W)</p>
        <p>Cantidad de paneles necesarios = <span class="valor">${N_paneles_total}</span> <span class="unidad">paneles</span></p>
        <hr style="margin: 15px 0; border: none; border-top: 1px solid rgba(0,0,0,0.1);">
        <p><strong>Configuración simétrica del arreglo:</strong></p>
        <p>Paneles en serie = <span class="valor">${N_paneles_serie}</span></p>
        <p>Ramas en paralelo = <span class="valor">${N_paneles_paralelo}</span></p>
        <p>Paneles totales = <span class="valor">${N_paneles_total}</span></p>
        <hr style="margin: 15px 0; border: none; border-top: 1px solid rgba(0,0,0,0.1);">
        <p><strong>Características eléctricas del arreglo:</strong></p>
        <p class="ecuacion">V_oc_total = V_oc × paneles_en_serie</p>
        <p class="ecuacion">V_oc_total = ${V_oc.toFixed(2)} V × ${N_paneles_serie}</p>
        <p>Voltaje de circuito abierto total = <span class="valor">${V_oc_total.toFixed(2)}</span> <span class="unidad">V</span></p>
        <hr style="margin: 12px 0; border: none; border-top: 1px solid rgba(0,0,0,0.1);">
        <p class="ecuacion">V_mp_total = V_mp × paneles_en_serie</p>
        <p class="ecuacion">V_mp_total = ${V_mp.toFixed(2)} V × ${N_paneles_serie}</p>
        <p>Voltaje en punto máxima potencia (para MPPT) = <span class="valor">${V_mp_total.toFixed(2)}</span> <span class="unidad">V</span></p>
        <hr style="margin: 12px 0; border: none; border-top: 1px solid rgba(0,0,0,0.1);">
        <p class="ecuacion">I_sc_total = I_sc × ramas_en_paralelo</p>
        <p class="ecuacion">I_sc_total = ${I_sc.toFixed(2)} A × ${N_paneles_paralelo}</p>
        <p>Corriente de cortocircuito total = <span class="valor">${I_sc_total.toFixed(2)}</span> <span class="unidad">A</span></p>
        <hr style="margin: 12px 0; border: none; border-top: 1px solid rgba(0,0,0,0.1);">
        <p class="ecuacion">P_entrada = V_oc_total × I_sc_total</p>
        <p class="ecuacion">P_entrada = ${V_oc_total.toFixed(2)} V × ${I_sc_total.toFixed(2)} A</p>
        <p><strong>Potencia de entrada estimada = <span class="valor">${P_entrada.toFixed(2)}</span> <span class="unidad">W</span></strong></p>
        <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; border-left: 4px solid #17a2b8; margin-top: 15px;">
            <h4 style="color: #0c5460; margin-bottom: 10px;">Resumen del arreglo</h4>
            <p style="color: #0c5460; margin: 8px 0;"><strong>Paneles: ${N_paneles_serie} en serie × ${N_paneles_paralelo} en paralelo = ${N_paneles_total} total</strong></p>
            <p style="color: #0c5460; margin: 8px 0;">V_oc total: ${V_oc_total.toFixed(2)} V | V_mp total: ${V_mp_total.toFixed(2)} V | I_sc total: ${I_sc_total.toFixed(2)} A</p>
        </div>
    `;
    mostrarResultado('resultado-2-3', contenido);
    
    // Mostrar decisión
    document.getElementById('decision-paneles').style.display = 'block';
}

function confirmarPaneles() {
    estado.paneles_confirmados = true;
    document.getElementById('decision-paneles').style.display = 'none';
    
    const elemento = document.getElementById('resultado-2-3');
    const confirmacion = `
        <div style="background: #d4edda; padding: 12px; border-radius: 4px; color: #155724; margin-top: 12px;">
            <strong>✓ Configuración de paneles confirmada: ${estado.N_paneles_total} paneles (${estado.N_paneles_serie} serie × ${estado.N_paneles_paralelo} paralelo)</strong>
        </div>
    `;
    elemento.innerHTML += confirmacion;
    
    document.getElementById('seccion-inversor').scrollIntoView({ behavior: 'smooth' });
}

function rechazarPaneles() {
    document.getElementById('P_panel').focus();
    document.getElementById('P_panel').value = '';
    document.getElementById('V_oc').value = '';
    document.getElementById('V_mp').value = '';
    document.getElementById('I_sc').value = '';
    limpiarResultado('resultado-2-3');
    document.getElementById('decision-paneles').style.display = 'none';
    alert('Ingresa nuevos valores para el panel solar y vuelve a calcular');
}

// ===== SECCIÓN 3: DIMENSIONAMIENTO DEL INVERSOR =====

function calcularPaso3() {
    limpiarResultado('resultado-3');
    
    if (!estado.paneles_confirmados) {
        mostrarError('Primero debes confirmar la configuración de paneles (Paso 2.3)');
        return;
    }
    
    if (!estado.P_entrada || !estado.P_dispositivo) {
        mostrarError('No hay suficientes datos calculados. Verifica que hayas completado todos los pasos anteriores.');
        return;
    }
    
    // Potencias redondeadas
    const P_entrada_redonda = redondearArriba(estado.P_entrada);
    const P_salida_redonda = redondearArriba(estado.P_dispositivo);
    
    const contenido = `
        <h4>Especificaciones y recomendaciones del inversor</h4>
        <hr style="margin: 15px 0; border: none; border-top: 1px solid rgba(0,0,0,0.1);">
        <p><strong>Potencia de entrada del inversor:</strong></p>
        <p>Potencia proveniente del arreglo solar = <span class="valor">${P_entrada_redonda}</span> <span class="unidad">W</span></p>
        <p style="font-size: 0.85em; color: #666;">(calculada: ${estado.P_entrada.toFixed(2)} W, redondeada)</p>
        <hr style="margin: 15px 0; border: none; border-top: 1px solid rgba(0,0,0,0.1);">
        <p><strong>Potencia de salida del inversor:</strong></p>
        <p>Potencia requerida por el dispositivo = <span class="valor">${P_salida_redonda}</span> <span class="unidad">W</span></p>
        <p style="font-size: 0.85em; color: #666;">(calculada: ${estado.P_dispositivo.toFixed(2)} W, redondeada)</p>
        <hr style="margin: 15px 0; border: none; border-top: 1px solid rgba(0,0,0,0.1);">
        <p style="background: #e7f3ff; padding: 15px; border-radius: 6px; margin-top: 20px; font-size: 1.05em; font-weight: 500;">
            <strong>Recomendación:</strong><br>
            Se recomienda un inversor con una entrada de ${P_entrada_redonda} W y una salida de ${P_salida_redonda} W.
        </p>
        <hr style="margin: 15px 0; border: none; border-top: 1px solid rgba(0,0,0,0.1);">
        <div class="warning">
            <strong>⚠️ Criterios críticos para seleccionar el inversor:</strong>
            <ul style="margin-left: 20px; margin-top: 10px;">
                <li><strong>Rango MPPT del inversor:</strong> Debe incluir el voltaje en punto máxima potencia (V_mp) del arreglo = <span class="valor">${estado.V_mp_total.toFixed(2)} V</span></li>
                <li><strong>Voltaje máximo de entrada:</strong> Debe ser ≥ voltaje de circuito abierto (V_oc) del arreglo = <span class="valor">${estado.V_oc_total.toFixed(2)} V</span></li>
                <li><strong>Corriente máxima de entrada:</strong> Debe ser ≥ corriente de cortocircuito (I_sc) del arreglo = <span class="valor">${estado.I_sc_total.toFixed(2)} A</span></li>
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
    document.getElementById('dias_autosuficiencia').value = '';
    document.getElementById('HSP').value = '';
    document.getElementById('P_panel').value = '';
    document.getElementById('V_oc').value = '';
    document.getElementById('V_mp').value = '';
    document.getElementById('I_sc').value = '';
    
    // Limpiar todos los resultados
    limpiarResultado('resultado-1-1');
    limpiarResultado('resultado-1-2');
    limpiarResultado('resultado-1-3');
    limpiarResultado('resultado-2-1');
    limpiarResultado('resultado-2-2');
    limpiarResultado('resultado-2-3');
    limpiarResultado('resultado-3');
    document.getElementById('decision-paneles').style.display = 'none';
    
    // Resetear estado
    estado = {
        P_dispositivo: null,
        E_sesion: null,
        dias_autosuficiencia: null,
        E_autosuficiencia: null,
        HSP: null,
        P_arreglo: null,
        P_panel: null,
        V_oc: null,
        V_mp: null,
        I_sc: null,
        N_paneles_total: null,
        N_paneles_serie: null,
        N_paneles_paralelo: null,
        V_oc_total: null,
        I_sc_total: null,
        P_entrada: null,
        paneles_confirmados: false
    };
    
    // Scroll al inicio
    document.querySelector('.encabezado').scrollIntoView({ behavior: 'smooth' });
    alert('✓ Aplicación reiniciada. Puedes comenzar nuevamente.');
}
