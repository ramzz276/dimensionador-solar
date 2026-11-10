graph TD
    A["🚀 INICIO<br/>Dimensionador Solar v1.5.1"] --> B["📋 SECCIÓN 1<br/>Dimensionamiento de Baterías"]
    
    B --> B1["Paso 1.1: Ingresa potencia vehículo<br/>P_dispositivo W"]
    B1 --> B1V{¿P_dispositivo<br/>válido?}
    B1V -->|No| B1E["⚠️ Error:<br/>Debe ser número > 0"]
    B1E --> B1
    B1V -->|Sí| B1R["✅ Registra P"]
    B1R --> B2["Paso 1.2: Ingresa tiempo sesión<br/>t_sesion h"]
    
    B2 --> B2V{¿t_sesion<br/>válido?}
    B2V -->|No| B2E["⚠️ Error:<br/>Debe ser número > 0"]
    B2E --> B2
    B2V -->|Sí| B2C["📊 Calcula:<br/>E_sesion = P × t"]
    B2C --> B2R["✅ E_sesion = X Wh"]
    B2R --> B3["Paso 1.3: Ingresa vehículos simultáneos<br/>num_dispositivos"]
    
    B3 --> B3V{¿num_dispositivos<br/>es entero > 0?}
    B3V -->|No| B3E["⚠️ Error:<br/>Debe ser entero > 0"]
    B3E --> B3
    B3V -->|Sí| B3C["📊 Calcula:<br/>E_auto = E_sesion × N"]
    B3C --> B3R["✅ E_autosuficiencia = X Wh<br/>💡 Recomendación batería"]
    
    B3R --> S2["📋 SECCIÓN 2<br/>Dimensionamiento de Paneles"]
    
    S2 --> S2_1["Paso 2.1: Ingresa Horas Solar Pico<br/>HSP h"]
    S2_1 --> S2_1B["🔘 Click: Registrar Horas Solar Pico"]
    S2_1B --> S2_1V{¿HSP<br/>válido?<br/>E_auto existe?}
    S2_1V -->|No E_auto| S2_1E["⚠️ Error:<br/>Completa Sección 1 primero"]
    S2_1E --> S2_1
    S2_1V -->|No HSP| S2_1E2["⚠️ Error:<br/>Campo requerido"]
    S2_1E2 --> S2_1
    S2_1V -->|Sí| S2_1R["✅ HSP registrado"]
    
    S2_1R --> S2_2["Paso 2.2: Potencia del Arreglo<br/>(AUTOMÁTICO)"]
    S2_2 --> S2_2C["📊 Calcula:<br/>P_arreglo = E_auto ÷ HSP"]
    S2_2C --> S2_2R["✅ P_arreglo = X W<br/>(Se abre automáticamente)"]
    
    S2_2R --> S2_3["Paso 2.3: Datos del Panel"]
    S2_3 --> S2_3A["Ingresa potencia nominal<br/>P_panel W"]
    S2_3A --> S2_3B["Selecciona voltaje nominal<br/>V_nominal ∈ {12V, 24V, 48V}"]
    S2_3B --> S2_3C["Auto-calcula: N_paneles"]
    S2_3C --> S2_3V{¿N_paneles<br/>> 15?}
    S2_3V -->|Sí| S2_3W["⚠️ Advertencia:<br/>Excede límite, aumenta P_panel"]
    S2_3W --> S2_3OP
    S2_3V -->|No| S2_3OP["🎨 GENERA 3 OPCIONES<br/>de Arreglo"]
    
    S2_3OP --> S2_3O["Opción A: Todo en serie<br/>N_serie × N_paralelo = N × 1"]
    S2_3O --> S2_3OB["Opción B: 2 ramas paralelas<br/>N_serie × N_paralelo = ⌈N/2⌉ × 2"]
    S2_3OB --> S2_3OC["Opción C: 3 ramas paralelas<br/>N_serie × N_paralelo = ⌈N/3⌉ × 3"]
    
    S2_3OC --> S2_3SEL["Usuario selecciona opción<br/>(A, B o C)"]
    S2_3SEL --> S2_3CALC["📊 Calcula para opción:<br/>V_arreglo, I_arreglo"]
    S2_3CALC --> S2_3MARK["✅ Opción seleccionada"]
    
    S2_3MARK --> S3["📋 SECCIÓN 3<br/>Dimensionamiento del Inversor<br/>(SE ABRE AUTOMÁTICO)"]
    
    S3 --> S3C["📊 Calcula:<br/>P_entrada = V_arreglo × I_arreglo<br/>P_salida = P_dispositivo"]
    S3C --> S3R["✅ RECOMENDACIÓN:<br/>Inversor entrada ≥ X W<br/>Inversor salida ≥ Y W<br/><br/>⚠️ Criterios MPPT:<br/>• V_max ≥ V_arreglo<br/>• I_max ≥ I_arreglo"]
    
    S3R --> END["🎯 FIN<br/>Proyecto dimensionado completamente<br/><br/>🔄 Botón: Reiniciar cálculos"]
    
    style A fill:#2c5aa0,stroke:#1e3f7f,color:#fff
    style B fill:#0c63e4,stroke:#0a4fb0,color:#fff
    style S2 fill:#0c63e4,stroke:#0a4fb0,color:#fff
    style S3 fill:#0c63e4,stroke:#0a4fb0,color:#fff
    style END fill:#28a745,stroke:#1e7e34,color:#fff
    
    style B1E fill:#dc3545,stroke:#c82333,color:#fff
    style B2E fill:#dc3545,stroke:#c82333,color:#fff
    style B3E fill:#dc3545,stroke:#c82333,color:#fff
    style S2_1E fill:#dc3545,stroke:#c82333,color:#fff
    style S2_1E2 fill:#dc3545,stroke:#c82333,color:#fff
    style S2_3W fill:#ffc107,stroke:#ff8c00,color:#000
    
    style B1R fill:#d4edda,stroke:#28a745,color:#155724
    style B2R fill:#d4edda,stroke:#28a745,color:#155724
    style B3R fill:#d4edda,stroke:#28a745,color:#155724
    style S2_1R fill:#d4edda,stroke:#28a745,color:#155724
    style S2_2R fill:#d4edda,stroke:#28a745,color:#155724
    style S2_3OP fill:#d4edda,stroke:#28a745,color:#155724
    style S2_3MARK fill:#d4edda,stroke:#28a745,color:#155724
    style S3R fill:#d4edda,stroke:#28a745,color:#155724
