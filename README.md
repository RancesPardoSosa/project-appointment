# Project Appointment - API Endpoints

Este documento describe los endpoints disponibles en el proyecto **Project Appointment**.

---

## 1. Crear Cita

```
POST /appointment
```

**Descripción:**
Crea una nueva cita en el sistema y la publica en SNS para su procesamiento según país.

**Body:**

```json
{
  "insuredId": "123456",
  "scheduleId": "abc-123",
  "countryISO": "PE"
}
```

**Respuesta Exitosa:**

```json
{
  "id": "uuid",
  "insuredId": "123456",
  "scheduleId": "abc-123",
  "countryISO": "PE",
  "status": "pending",
  "createdAt": "2025-11-12T17:00:00.000Z"
}
```

---

## 2. Listar Citas por Asegurado

```
GET /appointments?insuredId=123456
```

**Descripción:**
Obtiene todas las citas asociadas a un `insuredId` específico.

**Query Parameters:**

- `insuredId` (obligatorio) – Código del asegurado.

**Respuesta Exitosa:**

```json
[
  {
    "id": "uuid",
    "insuredId": "123456",
    "scheduleId": "abc-123",
    "countryISO": "PE",
    "status": "pending",
    "createdAt": "2025-11-12T17:00:00.000Z"
  },
  {
    "id": "uuid2",
    "insuredId": "123456",
    "scheduleId": "def-456",
    "countryISO": "CL",
    "status": "completed",
    "createdAt": "2025-11-11T10:00:00.000Z"
  }
]
```

**Errores posibles:**

- 400: `insuredId` no proporcionado.
- 500: Error interno al obtener citas.

---

## 3. Confirmar Citas

**Trigger:** Automático via SQS `sqs_confirmacion` (no HTTP)

**Descripción:**
Actualiza el estado de las citas a `"completed"` cuando se recibe un evento de confirmación desde EventBridge/SQS.

**Nota:**
Este endpoint no se llama directamente desde HTTP; se ejecuta como Lambda que procesa eventos.

---

## Notas Generales

- El `status` de cada cita puede ser `"pending"` o `"completed"`.
- Todas las citas nuevas se crean con `"pending"` y se actualizan automáticamente a `"completed"` mediante la confirmación.
