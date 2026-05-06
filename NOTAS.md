# Notas de reflexión — Lab TDD con Jest y Supertest

## 1. ¿Qué ventaja tiene escribir los tests ANTES de la implementación?

Escribir los tests antes (ciclo Red → Green → Refactor) te obliga a pensar en el comportamiento esperado de tu API antes de escribir código. Esto tiene varias ventajas:

- **Diseño más limpio**: Al pensar primero en cómo se va a usar la API (desde la perspectiva del consumidor), tiendes a crear interfaces más intuitivas y modulares.
- **Cobertura completa**: Es imposible olvidar un caso borde cuando lo defines antes de implementar.
- **Confianza al refactorizar**: Si el refactor rompe algo, los tests lo detectan inmediatamente.

**Situación donde escribir tests después habría escondido un bug**: En el endpoint `POST /api/favoritos/:peliculaId`, el caso del código de error `23505` (unique violation de PostgreSQL) se captura específicamente para devolver un `409 Conflict`. Si hubiéramos implementado primero y escrito tests después, podríamos haber probado solo el camino feliz (201) y olvidado que la base de datos puede lanzar este error cuando un usuario intenta añadir la misma película dos veces. Sin el test escrito antes, ese caso podría haber quedado sin manejar o devolviendo un 500 genérico.

## 2. ¿Por qué usamos una base de datos de test separada en lugar de mockear el módulo db?

Usar una base de datos real de test (integration testing) nos da **más confianza** en que el sistema funciona de verdad:

- Los queries SQL se ejecutan realmente, verificando que la sintaxis es correcta.
- Las constraints de la BD (UNIQUE, FOREIGN KEY, ON DELETE CASCADE) se comportan como en producción.
- Capturamos bugs que los mocks no pueden simular (ej: errores de PostgreSQL como `23505`).

**¿Cuándo sí tendría sentido mockear?**
- En **unit tests** de un controlador específico, donde solo queremos verificar la lógica de ese controlador sin depender de la BD.
- Cuando la BD no está disponible (CI/CD sin PostgreSQL).
- Para tests que necesitan ser extremadamente rápidos (bcrypt y queries reales son lentos).
- Cuando queremos simular errores específicos de BD de forma determinista.

## 3. ¿Qué es el error de PostgreSQL con código 23505 y por qué lo capturamos específicamente?

El código `23505` es el error **unique_violation** de PostgreSQL. Se produce cuando intentas insertar una fila que viola una constraint UNIQUE.

En nuestra tabla `favoritos`, tenemos:
```sql
UNIQUE(usuario_id, pelicula_id)
```

Esto significa que un mismo usuario no puede tener la misma película en favoritos dos veces. Si intenta hacer un `INSERT` duplicado, PostgreSQL lanza el error `23505`.

Lo capturamos específicamente (`err.code === '23505'`) para convertirlo en un `409 Conflict` amigable para el cliente, en lugar de dejar que el error handler genérico devuelva un `500 Internal Server Error`. Esto le dice al usuario claramente: "Esta película ya está en tus favoritos".
