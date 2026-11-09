# Estación Solar Inteligente

Sitio web independiente para el trabajo de grado de una estación de carga solar. Integra el dashboard público de ThingsBoard y ofrece un dimensionador preliminar.

## Páginas

- `index.html`: presentación y arquitectura.
- `dimensionamiento.html`: calculadora preliminar.
- `monitoreo.html`: resumen simulado, dashboard ThingsBoard embebido y previsualización del control futuro.

## Telemetría base

`pvPower`, `pvVoltage`, `batterySoc`, `batteryVoltage`, `batteryTemperature`, `chargeVoltage`, `chargeCurrent`, `chargePower`, `sessionEnergy`, `activeSource`, `chargingState`, `chargeEnabled`.

## Seguridad y arquitectura

GitHub Pages solo contiene archivos estáticos. No se incluyen tokens, credenciales MQTT ni claves privadas. La fase posterior prevé:

```text
Raspberry Pi -> HiveMQ -> ThingsBoard -> dashboard público
                    \-> backend Python -> Firebase (opcional)
```

El control mostrado actualmente es exclusivamente visual y no acciona hardware.

## Publicación

En GitHub: **Settings -> Pages -> Deploy from a branch -> main / root**.
