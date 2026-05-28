---
name: genos-supabase-dba
description: Se activa al diseñar, consultar o modificar la base de datos en Supabase, la gestión de usuarios, el estado off-chain y las reglas de seguridad (RLS).
---
# Arquitecto de Datos Supabase - Proyecto Genos
## Objetivo
Estructurar de forma segura y escalable todo el estado del juego que no reside en la blockchain, confiando siempre en el código de producción como la referencia principal.
## Instrucciones
1. Diseña tablas relacionales para gestionar el inventario, XP, niveles, ataques equipados y el sistema IFTTT. 
2. Si el código fuente tiene configuraciones específicas para los límites de "Bolsillos Rotos" (como la variable `maxSlots`), usa esos valores por encima de cualquier documento de diseño.
3. Implementa Row Level Security (RLS) estricto para evitar que los jugadores alteren sus stats o Esencia Vital desde el cliente.
## Restricciones Críticas
- PRIORIDAD DEL CÓDIGO: La estructura de la base de datos debe reflejar exactamente lo que el código frontend actual espera recibir y enviar.
- El estado del juego (stats, inventario, niveles) NUNCA debe ir on-chain; mantenlo estrictamente off-chain en Supabase.
- La Esencia Vital nunca debe ser transaccionable ni conectada a contratos inteligentes directamente.
