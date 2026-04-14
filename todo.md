# ATE Builder - TODO

## Estructura de Datos
- [x] Diseñar schema de base de datos para ATEs
- [x] Crear tabla de ATEs con metadatos (nombre, grado, competencia, tipo)
- [x] Crear tabla de fases con contenido estructurado
- [x] Crear tabla de plantillas predefinidas
- [x] Implementar relaciones entre tablas

## Wizard y Componentes UI
- [x] Crear componente WizardContainer con navegación entre fases
- [x] Implementar Fase 1: Identificación del problema
- [x] Implementar Fase 2: Exploración y documentación
- [x] Implementar Fase 3: Diseño de la solución
- [x] Implementar Fase 4: Planeación y construcción
- [x] Implementar Fase 5: Evaluación y mejora
- [x] Implementar Fase 6: Comunicación y socialización
- [x] Crear barra de progreso visual con indicadores de estado
- [x] Implementar indicadores de fase (completado, en progreso, pendiente)

## Gestión de ATEs
- [x] Crear página de listado de ATEs del docente
- [x] Implementar funcionalidad de crear nueva ATE
- [ ] Implementar funcionalidad de editar ATE
- [x] Implementar funcionalidad de duplicar ATE
- [x] Implementar funcionalidad de eliminar ATE
- [x] Implementar guardado automático de progreso
- [ ] Crear sistema de recuperación de sesión

## Asistente de IA
- [ ] Integrar LLM para sugerencias contextuales
- [ ] Implementar generación de preguntas orientadoras
- [ ] Implementar retroalimentación pedagógica
- [ ] Crear prompts específicos para cada fase
- [ ] Añadir interfaz de chat/sugerencias en cada fase

## Vista Previa y Exportación
- [ ] Crear vista previa del documento ATE completo
- [ ] Implementar exportación a PDF
- [ ] Diseñar plantilla de documento PDF
- [ ] Añadir opciones de personalización de PDF

## Plantillas Predefinidas
- [ ] Crear plantilla tipo "Producto"
- [ ] Crear plantilla tipo "Proceso"
- [ ] Crear plantilla tipo "Sistema"
- [ ] Implementar selector de plantillas
- [ ] Añadir ejemplos de cada tipo

## Diseño Visual y UX
- [ ] Definir paleta de colores elegante
- [ ] Seleccionar tipografía refinada
- [ ] Implementar espaciado generoso
- [ ] Crear componentes visuales impecables
- [ ] Pulir experiencia de usuario
- [ ] Asegurar responsividad en dispositivos

## Autenticación y Seguridad
- [ ] Verificar autenticación de docentes
- [ ] Implementar control de acceso por usuario
- [ ] Asegurar que cada docente solo vea sus ATEs
- [ ] Implementar protección de rutas

## Mejoras y Correcciones Necesarias
- [ ] Agregar foreign keys reales en el schema para integridad relacional
- [ ] Implementar autosave real con debounce para guardado automático
- [ ] Actualizar `ultimaFaseCompletada` al guardar cada fase
- [ ] Implementar indicadores reales de estado (completado, en progreso, pendiente)
- [ ] Corregir seguridad en deleteATE verificando propiedad del usuario
- [ ] Implementar transacciones para duplicar y eliminar ATEs
- [ ] Sembrar plantillas predefinidas reales (producto, proceso, sistema)
- [ ] Conectar plantillas a la UI de creación de ATEs
- [ ] Validar campos de fases contra presentación oficial
- [ ] Implementar vista previa del documento ATE completo
- [ ] Implementar exportación a PDF
- [ ] Integrar asistente de IA para sugerencias contextuales
- [ ] Agregar rúbrica editable en Fase 5
- [ ] Agregar indicadores de logro en Fase 5
- [ ] Permitir subida de evidencias (fotos/videos) en fases

## Pruebas y Entrega
- [ ] Escribir tests unitarios con Vitest
- [ ] Realizar pruebas de funcionalidad
- [ ] Validar flujo completo del wizard
- [ ] Probar guardado automático
- [ ] Probar exportación PDF
- [ ] Crear checkpoint final
- [ ] Entregar aplicación al usuario
