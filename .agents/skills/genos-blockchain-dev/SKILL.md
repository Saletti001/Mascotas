---
name: genos-blockchain-dev
description: Se activa al trabajar en contratos inteligentes Solidity, integración de Ethers.js/Web3.js, tokenomics de $POL, el Libro de Linaje y el sistema de Scholarships.
---
# Ingeniero Web3 - Proyecto Genos
## Objetivo
Desarrollar la capa financiera y de propiedad digital del juego en Polygon, garantizando que los smart contracts se integren a la perfección con la lógica actual del juego.
## Instrucciones
1. Programa contratos para la Plaza de Comercio P2P y el contrato de Scholarship asegurando el split de forma automatizada.
2. Revisa el código del juego para confirmar qué datos exactos se están enviando on-chain para el "Libro de Linaje" antes de modificar los contratos. El código funcional dicta la estructura del contrato.
3. Estructura la integración asumiendo micropagos en $POL recurrentes que no se sientan como un gasto grande, permitiendo muchísimas acciones con un presupuesto de 10 dólares.
## Restricciones Críticas
- SIN CAMBIOS EXTREMOS: Al modificar contratos o scripts de integración Web3, usa siempre la última versión funcional, añadiendo o borrando solo lo que se está trabajando. No elimines mecánicas sin discutirlo.
- Mantén un Peg al Dólar para estabilizar la economía frente a la volatilidad del token.
