// ===== VARIABLES GLOBALES PARA ALMACENAR RESULTADOS =====
let estado = {
    P_dispositivo: null,
    E_sesion: null,
    dias_autosuficiencia: null,
    factor_sobreestima: null,
    E_autosuficiencia: null,
    V_bateria: null,
    Ah_bateria: null,
    E_bateria: null,
    V_banco: null,
    N_baterias_serie: null,
    N_baterias_paralelo: null,
    N_baterias_total: null,
    V_banco_real: null,
    Ah_banco: null,
    E_banco: null,
    HSP: null,
    P_arreglo: null,
    P_panel: null,
    N_paneles: null,
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
            elemento.classList.remove('visible');
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

// PASO 1.3: Calcular energía de autosuficiencia con sobreestimación
function calcularPaso1_3() {
    limpiarResultado('resultado-1-3');
    
    if (!estado.E_sesion) {
        mostrarError('Primero debes calcular la energía de sesión (Paso 1.2)');
        return;
    }
    
    const dias_autosuficiencia_input = document.getElementById('dias_autosuficiencia').value;
    const dias_autosuficiencia = validarNumero(dias_autosuficiencia_input, 'Días de autosuficiencia');
    
    if (!dias_autosuficiencia) return;
    
    // Validar que sea un número entero
    if (!Number.isInteger(dias_autosuficiencia)) {
        mostrarError('Los días de autosuficiencia deben ser un número entero (sin decimales)');
        return;
    }
    
    const factor_sobreestima_input = document.getElementById('factor_sobreestima').value;
    const factor_sobreestima = validarNumero(factor_sobreestima_input, 'Factor de sobreestimación');
    
    if (!factor_sobreestima) return;
    
    estado.dias_autosuficiencia = dias_autosuficiencia;
    estado.factor_sobreestima = factor_sobreestima;
    
    // ECUACIÓN 2: E_autosuficiencia = E_sesion × dias_autosuficiencia
    const E_autosuficiencia_base = estado.E_sesion * dias_autosuficiencia;
    
    // Aplicar sobreestimación
    const E_autosuficiencia = E_autosuficiencia_base * factor_sobreestima;
    estado.E_autosuficiencia = E_autosuficiencia;
    
    const contenido = `
        <h4>Cálculo de energía de autosuficiencia</h4>
        <p class="ecuacion">E_autosuficiencia = E_sesion × dias_autosuficiencia</p>
        <p class="ecuacion">E_autosuficiencia = ${estado.E_sesion.toFixed(2)} Wh × ${dias_autosuficiencia.toFixed(2)} días</p>
        <p>E_autosuficiencia (base) = <span class="valor">${E_autosuficiencia_base.toFixed(2)}</span> <span class="unidad">Wh</span></p>
        <hr style="margin: 15px 0; border: none; border-top: 1px solid rgba(0,0,0,0.1);">
        <p><strong>Aplicando sobreestimación:</strong></p>
        <p class="ecuacion">E_autosuficiencia (sobreestimada) = ${E_autosuficiencia_base.toFixed(2)} Wh × ${factor_sobreestima.toFixed(2)}</p>
        <p>E_autosuficiencia (final) = <span class="valor">${E_autosuficiencia.toFixed(2)}</span> <span class="unidad">Wh</span></p>
    `;
    mostrarResultado('resultado-1-3', contenido);
}

// PASO 1.4: Calcular cantidad de baterías y configuración
function calcularPaso1_4() {
    limpiarResultado('resultado-1-4');
    
    if (!estado.E_autosuficiencia) {
        mostrarError('Primero debes calcular la energía de autosuficiencia (Paso 1.3)');
        return;
    }
    
    const V_bateria_input = document.getElementById('V_bateria').value;
    const V_bateria = validarNumero(V_bateria_input, 'Voltaje nominal de la batería');
    
    if (!V_bateria) return;
    
    const Ah_bateria_input = document.getElementById('Ah_bateria').value;
    const Ah_bateria = validarNumero(Ah_bateria_input, 'Capacidad de la batería');
    
    if (!Ah_bateria) return;
    
    const V_banco_input = document.getElementById('V_banco').value;
    const V_banco = validarNumero(V_banco_input, 'Voltaje requerido del banco');
    
    if (!V_banco) return;
    
    estado.V_bateria = V_bateria;
    estado.Ah_bateria = Ah_bateria;
    estado.V_banco = V_banco;
    
    // ECUACIÓN 3: E_bateria = V_bateria × Ah_bateria
    const E_bateria = V_bateria * Ah_bateria;
    estado.E_bateria = E_bateria;
    
    // Calcular cantidad total de baterías necesarias
    const N_baterias_total_float = estado.E_autosuficiencia / E_bateria;
    const N_baterias_total = redondearArriba(N_baterias_total_float);
    
    // Calcular configuración serie/paralelo
    const N_baterias_serie = redondearArriba(V_banco / V_bateria);
    const N_baterias_paralelo = redondearArriba(N_baterias_total / N_baterias_serie);
    
    // Valores reales del banco
    const V_banco_real = V_bateria * N_baterias_serie;
    const Ah_banco = Ah_bateria * N_baterias_paralelo;
    const E_banco = V_banco_real * Ah_banco;
    
    estado.N_baterias_serie = N_baterias_serie;
    estado.N_baterias_paralelo = N_baterias_paralelo;
    estado.N_baterias_total = N_baterias_total;
    estado.V_banco_real = V_banco_real;
    estado.Ah_banco = Ah_banco;
    estado.E_banco = E_banco;
    
    const contenido = `
        <h4>Cálculo de cantidad de baterías</h4>
        <p><strong>Energía de una batería:</strong></p>
        <p class="ecuacion">E_bateria = V_bateria × Ah_bateria</p>
        <p class="ecuacion">E_bateria = ${V_bateria.toFixed(2)} V × ${Ah_bateria.toFixed(2)} Ah</p>
        <p>E_bateria = <span class="valor">${E_bateria.toFixed(2)}</span> <span class="unidad">Wh</span></p>
        <hr style="margin: 15px 0; border: none; border-top: 1px solid rgba(0,0,0,0.1);">
        <p><strong>Cantidad total de baterías:</strong></p>
        <p class="ecuacion">N_baterias = E_autosuficiencia ÷ E_bateria</p>
        <p class="ecuacion">N_baterias = ${estado.E_autosuficiencia.toFixed(2)} Wh ÷ ${E_bateria.toFixed(2)} Wh</p>
        <p>N_baterias = <span class="valor">${N_baterias_total}</span> baterías</p>
        <hr style="margin: 15px 0; border: none; border-top: 1px solid rgba(0,0,0,0.1);">
        <p><strong>Configuración serie/paralelo:</strong></p>
        <p>Baterías en serie (para alcanzar ${V_banco.toFixed(2)} V): <span class="valor">${N_baterias_serie}</span> baterías</p>
        <p>Baterías en paralelo (por cada rama): <span class="valor">${N_baterias_paralelo}</span> baterías</p>
        <hr style="margin: 15px 0; border: none; border-top: 1px solid rgba(0,0,0,0.1);">
        <p><strong>Especificaciones del banco de baterías:</strong></p>
        <p>Voltaje total del banco: <span class="valor">${V_banco_real.toFixed(2)}</span> <span class="unidad">V</span></p>
        <p>Capacidad total del banco: <span class="valor">${Ah_banco.toFixed(2)}</span> <span class="unidad">Ah</span></p>
        <p>Energía total del banco: <span class="valor">${E_banco.toFixed(2)}</span> <span class="unidad">Wh</span></p>
    `;
    mostrarResultado('resultado-1-4', contenido);
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

// PASO 2.3: Calcular cantidad de paneles
function calcularPaso2_3() {
    limpiarResultado('resultado-2-3');
    document.getElementById('decision-paneles').style.display = 'none';
    
    if (!estado.P_arreglo) {
        mostrarError('Primero debes calcular la potencia del arreglo (Paso 2.2)');
        return;
    }
    
    const P_panel_input = document.getElementById('P_panel').value;
    const P_panel = validarNumero(P_panel_input, 'Potencia del panel solar');
    
    if (!P_panel) return;
    
    estado.P_panel = P_panel;
    
    // ECUACIÓN 5: N_paneles = P_arreglo / P_panel
    const N_paneles_float = estado.P_arreglo / P_panel;
    const N_paneles = redondearArriba(N_paneles_float);
    
    estado.N_paneles = N_paneles;
    estado.paneles_confirmados = false;
    
    const contenido = `
        <h4>Cálculo de cantidad de paneles</h4>
        <p class="ecuacion">N_paneles = P_arreglo ÷ P_panel</p>
        <p class="ecuacion">N_paneles = ${estado.P_arreglo.toFixed(2)} W ÷ ${P_panel.toFixed(2)} W</p>
        <p>N_paneles = <span class="valor">${N_paneles}</span> <span class="unidad">paneles</span></p>
    `;
    mostrarResultado('resultado-2-3', contenido);
    
    // Mostrar decisión
    document.getElementById('decision-paneles').style.display = 'block';
}

// Confirmar cantidad de paneles - continúa a inversor
function confirmarPaneles() {
    estado.paneles_confirmados = true;
    document.getElementById('decision-paneles').style.display = 'none';
    
    const contenido = `
        <div style="background: #d4edda; padding: 12px; border-radius: 4px; color: #155724;">
            <strong>✓ Cantidad de paneles confirmada:</strong> ${estado.N_paneles} paneles
        </div>
    `;
    
    const elemento = document.getElementById('resultado-2-3');
    elemento.innerHTML += contenido;
    
    // Habilitar Sección 3
    document.getElementById('seccion-inversor').scrollIntoView({ behavior: 'smooth' });
}

// Rechazar y volver a ingresar potencia del panel
function rechazarPaneles() {
    document.getElementById('P_panel').focus();
    document.getElementById('P_panel').value = '';
    limpiarResultado('resultado-2-3');
    document.getElementById('decision-paneles').style.display = 'none';
    alert('Ingresa una nueva potencia del panel y vuelve a calcular');
}

// ===== SECCIÓN 3: DIMENSIONAMIENTO DEL INVERSOR =====

function calcularPaso3() {
    limpiarResultado('resultado-3');
    
    if (!estado.paneles_confirmados) {
        mostrarError('Primero debes confirmar la cantidad de paneles (Paso 2.3)');
        return;
    }
    
    if (!estado.P_arreglo || !estado.P_dispositivo) {
        mostrarError('No hay suficientes datos calculados. Verifica que hayas completado todos los pasos anteriores.');
        return;
    }
    
    // Entrada y salida del inversor (sin cálculos adicionales)
    const P_entrada = estado.P_arreglo;
    const P_salida = estado.P_dispositivo;
    
    const contenido = `
        <h4>Especificaciones del inversor</h4>
        <hr style="margin: 15px 0; border: none; border-top: 1px solid rgba(0,0,0,0.1);">
        <p><strong>Entrada del inversor:</strong></p>
        <p>Potencia proveniente del arreglo solar = <span class="valor">${P_entrada.toFixed(2)}</span> <span class="unidad">W</span></p>
        <hr style="margin: 15px 0; border: none; border-top: 1px solid rgba(0,0,0,0.1);">
        <p><strong>Salida del inversor:</strong></p>
        <p>Potencia requerida por el dispositivo = <span class="valor">${P_salida.toFixed(2)}</span> <span class="unidad">W</span></p>
        <hr style="margin: 15px 0; border: none; border-top: 1px solid rgba(0,0,0,0.1);">
        <p style="background: #e7f3ff; padding: 15px; border-radius: 6px; margin-top: 20px; font-size: 1.05em; font-weight: 500;">
            <strong>Recomendación:</strong><br>
            Se recomienda un inversor con una entrada de ${P_entrada.toFixed(2)} W y una salida de ${P_salida.toFixed(2)} W.
        </p>
    `;
    mostrarResultado('resultado-3', contenido);
}

// ===== FUNCIÓN DE REINICIO =====
function reiniciarApp() {
    // Limpiar todos los inputs
    document.getElementById('P_dispositivo').value = '';
    document.getElementById('t_sesion').value = '';
    document.getElementById('dias_autosuficiencia').value = '';
    document.getElementById('factor_sobreestima').value = '1.25';
    document.getElementById('V_bateria').value = '';
    document.getElementById('Ah_bateria').value = '';
    document.getElementById('V_banco').value = '';
    document.getElementById('HSP').value = '';
    document.getElementById('P_panel').value = '';
    
    // Limpiar todos los resultados
    limpiarResultado('resultado-1-1');
    limpiarResultado('resultado-1-2');
    limpiarResultado('resultado-1-3');
    limpiarResultado('resultado-1-4');
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
        factor_sobreestima: null,
        E_autosuficiencia: null,
        V_bateria: null,
        Ah_bateria: null,
        E_bateria: null,
        V_banco: null,
        N_baterias_serie: null,
        N_baterias_paralelo: null,
        N_baterias_total: null,
        V_banco_real: null,
        Ah_banco: null,
        E_banco: null,
        HSP: null,
        P_arreglo: null,
        P_panel: null,
        N_paneles: null,
        paneles_confirmados: false
    };
    
    // Scroll al inicio
    document.querySelector('.encabezado').scrollIntoView({ behavior: 'smooth' });
    alert('✓ Aplicación reiniciada. Puedes comenzar nuevamente.');
}
