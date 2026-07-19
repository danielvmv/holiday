# Testing Jolidays Localmente

## Instrucciones Paso a Paso

### 1. Inicia el servidor de desarrollo

```bash
npm run dev
```

Verás un mensaje indicando que está usando el mock en memoria:
```
[KV] Using in-memory mock for local development
```

### 2. Abre tu navegador

Visita estas URLs:

**Página principal:**
```
http://localhost:3000
```

**Página de check-in (la nueva funcionalidad):**
```
http://localhost:3000/join
```

**Página de revelado (cualquier slug existente):**
```
http://localhost:3000/r/4NNBu648
```

### 3. Prueba el flujo de check-in

1. Ve a `http://localhost:3000/join`
2. Verás la lista de 9 participantes, todos con ⏳ (pendientes)
3. Selecciona tu nombre del dropdown
4. Haz clic en "Confirmar mi participación"
5. Deberías ver:
   - Tu nombre ahora muestra ✅ con timestamp
   - El contador cambia a 1/9
   - Un mensaje de éxito

### 4. Simula múltiples usuarios

Para simular que varios usuarios se registran:

1. Abre **ventanas de incógnito** (múltiples)
2. En cada ventana, ve a `http://localhost:3000/join`
3. Selecciona un nombre diferente en cada ventana
4. Confirma
5. En TODAS las ventanas verás actualizarse el estado cada 5 segundos

### 5. Verifica la separación de sistemas

**Importante:** Verifica que el check-in NO afecta las asignaciones secretas:

1. Ve a `http://localhost:3000/r/4NNBu648` (Victor)
2. Verifica que sigue mostrando solo su asignación (Marcela)
3. Haz check-in de Victor en `/join`
4. Vuelve a `http://localhost:3000/r/4NNBu648`
5. **Debe seguir mostrando exactamente lo mismo** - el check-in no afecta nada

### 6. Reiniciar el mock

**Nota:** El mock de KV guarda los datos en memoria mientras el servidor corre.

Para reiniciar (limpiar todos los check-ins):
```bash
# Detén el servidor (Ctrl+C)
# Vuelve a iniciarlo
npm run dev
```

Todos los check-ins se habrán limpiado.

## Notas Importantes

- **En local:** Los datos se pierden al reiniciar el servidor (es esperado)
- **En producción (Vercel):** Los datos se guardan en Vercel KV permanentemente
- **Consola del navegador:** Puedes ver las llamadas a la API en la pestaña Network
- **Terminal:** Verás logs como `[KV Mock] SET checkin:victor` en el servidor

## Solución de Problemas

**Si ves errores de KV:**
- Verifica que `.env.local` NO tenga valores en las variables KV
- Debe decir `# KV_REST_API_URL=` (comentado)
- Reinicia el servidor después de cambiar `.env.local`

**Si el polling no funciona:**
- Verifica la consola del navegador (F12)
- Debería hacer un GET a `/api/checkin` cada 5 segundos

**Si aparece "Ya te registraste anteriormente":**
- Es correcto, el sistema previene duplicados
- Para volver a probar, reinicia el servidor o usa otro nombre
