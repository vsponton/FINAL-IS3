# Test Cases — Gestor de Libros

Este documento describe los principales casos de prueba del proyecto, organizados por tipo: unitarios, de integración y end-to-end (E2E).

---

## 1. Pruebas Unitarias

### TC-U-01 — Listar libros (service)
**Tipo:** Unitario
**Archivo:** `backend/__tests__/books.service.test.js`
**Precondiciones:** El repositorio de datos está mockeado (no se accede a la base real).
**Datos de entrada:** N/A
**Pasos:**
1. Invocar `svc.list()`.
**Resultado esperado:** Devuelve un array con los libros mockeados por el repositorio.

### TC-U-02 — Obtener libro por id inválido
**Tipo:** Unitario
**Archivo:** `backend/__tests__/books.service.test.js`
**Precondiciones:** N/A
**Datos de entrada:** `id = 'a'` (no numérico)
**Pasos:**
1. Invocar `svc.get('a')`.
**Resultado esperado:** La promesa es rechazada con el error `'bad id'`.

### TC-U-03 — Crear libro sin título
**Tipo:** Unitario
**Archivo:** `backend/__tests__/books.service.test.js`
**Precondiciones:** N/A
**Datos de entrada:** `{}` (objeto vacío, sin `title`)
**Pasos:**
1. Invocar `svc.create({})`.
**Resultado esperado:** La promesa es rechazada con el error `'title required'`.

### TC-U-04 — GET /api/books devuelve 200 (controller)
**Tipo:** Unitario
**Archivo:** `backend/__tests__/books.controller.test.js`
**Precondiciones:** El controller usa datos mockeados en memoria.
**Datos de entrada:** N/A
**Pasos:**
1. Enviar `GET /api/books`.
**Resultado esperado:** Status `200`, body es un array.

### TC-U-05 — POST /api/books sin título (controller)
**Tipo:** Unitario
**Archivo:** `backend/__tests__/books.controller.test.js`
**Precondiciones:** N/A
**Datos de entrada:** `{}` (sin `title`)
**Pasos:**
1. Enviar `POST /api/books` con body vacío.
**Resultado esperado:** Status `422`, body con `message: 'title required'`.

### TC-U-06 — Renderiza componente BookForm con validaciones
**Tipo:** Unitario (frontend)
**Archivo:** `frontend/src/__tests__/BookForm.test.jsx`
**Precondiciones:** N/A
**Datos de entrada:** Título vacío, autor `"A"`
**Pasos:**
1. Renderizar `<BookForm />`.
2. Completar título con `""` y autor con `"A"`.
3. Click en "guardar".
**Resultado esperado:** Se muestra un `role="alert"` con el texto `"Título requerido"`.

---

## 2. Pruebas de Integración

### TC-I-01 — GET /api/books devuelve lista real
**Tipo:** Integración
**Archivo:** `backend/__tests__/books.test.js`
**Precondiciones:** La app real (`index.js`) está montada; la base de datos está mockeada (`jest.mock('../db')`).
**Datos de entrada:** N/A
**Pasos:**
1. Mockear la respuesta de `db.query` con un libro de ejemplo.
2. Enviar `GET /api/books` contra la app real.
**Resultado esperado:** Status `200`, el array devuelto contiene el libro mockeado, y `db.query` fue invocado.

### TC-I-02 — POST /api/books crea un libro
**Tipo:** Integración
**Archivo:** `backend/__tests__/books.test.js`
**Precondiciones:** App real montada, DB mockeada.
**Datos de entrada:** `{ title: 'Libro', author: 'Autor', year: 2020, stock: 5, price: 99.5 }`
**Pasos:**
1. Enviar `POST /api/books` con el body de entrada.
**Resultado esperado:** Status `201`, la query ejecutada contiene `INSERT INTO books`, el id devuelto coincide con el mock.

### TC-I-03 — Préstamo sin stock disponible
**Tipo:** Integración
**Archivo:** `backend/__tests__/loans_sales.test.js`
**Precondiciones:** App real montada, DB mockeada con `stock: 0`.
**Datos de entrada:** `{ borrowerName: 'Pili', borrowerEmail: 'p@p.com', days: 2 }`
**Pasos:**
1. Enviar `POST /api/books/1/loan` con el body de entrada.
**Resultado esperado:** Status `409`, mensaje de error que contiene `"Sin stock"`.

### TC-I-04 — Venta exitosa actualiza stock
**Tipo:** Integración
**Archivo:** `backend/__tests__/loans_sales.test.js`
**Precondiciones:** App real montada, DB mockeada con `stock: 5, price: 10`.
**Datos de entrada:** `{ buyerName: 'Ana', quantity: 2 }`
**Pasos:**
1. Enviar `POST /api/books/1/sell` con el body de entrada.
**Resultado esperado:** Status `201`, `total_price` en la respuesta es `20`.

### TC-I-05 — Backend QA responde correctamente tras el deploy (pipeline)
**Tipo:** Integración (CI/CD)
**Ubicación:** `azure-pipelines.yml`, Stage QA, paso "QA • Pruebas de integración"
**Precondiciones:** El deploy a Render QA ya se disparó y el servicio respondió en `/health`.
**Datos de entrada:** N/A
**Pasos:**
1. `GET {BACK_QA_URL}/health`.
2. `GET {BACK_QA_URL}/api/books`.
**Resultado esperado:** Ambos endpoints devuelven código `200`. Si alguno falla, el pipeline se corta y no continúa a PROD.

---

## 3. Pruebas End-to-End (E2E)

### TC-E2E-01 — Flujo completo: listar, agregar y navegar
**Tipo:** E2E (Cypress)
**Archivo:** `frontend/cypress/e2e/app.cy.js`
**Precondiciones:** Backend y frontend corriendo (local: `localhost:4000` y `localhost:5173`), sin mocks.
**Datos de entrada:** Título: `"Libro E2E"`, Autor: `"Autor E2E"`, Año: `2024`
**Pasos:**
1. Visitar `http://localhost:5173`.
2. Confirmar que el texto "Gestor de Libros" es visible.
3. Completar el formulario con los datos de entrada.
4. Click en "Agregar libro".
5. Click en la pestaña "Ventas".
**Resultado esperado:** El libro "Libro E2E" aparece en la tabla tras agregarlo. La sección "Ventas" muestra la columna "Comprador".

### TC-E2E-02 — Agregar, editar y borrar un libro
**Tipo:** E2E (Cypress)
**Archivo:** `frontend/cypress/e2e/books.cy.js`
**Precondiciones:** Backend y frontend corriendo, sin mocks.
**Datos de entrada:** Título inicial: `"Libro Cypress"`, título editado: `"Libro Editado"`
**Pasos:**
1. Visitar `http://localhost:5173`.
2. Agregar el libro con los datos iniciales.
3. Click en "Editar" sobre ese libro, cambiar el título al valor editado, guardar.
4. Click en "Borrar" sobre el libro editado y confirmar el diálogo del navegador.
**Resultado esperado:** El libro aparece con el título editado tras guardar, y desaparece de la tabla tras confirmar el borrado.

---

## Resumen de cobertura por tipo

| Tipo | Cantidad aproximada | Herramienta |
|---|---|---|
| Unitarios (backend) | ~45 | Jest |
| Unitarios (frontend) | ~45 | Vitest + Testing Library |
| Integración (backend) | ~15 | Jest + Supertest |
| Integración (pipeline/QA) | 2 | curl (Azure Pipelines) |
| E2E | 2 specs, múltiples aserciones | Cypress |