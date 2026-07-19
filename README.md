# 🎄 Jolidays - Intercambio de Regalos Familiar 2026

Sitio web para el intercambio de regalos navideño durante el viaje familiar a la Riviera Nayarit, del 22 al 29 de diciembre de 2026.

## 🌊 Descripción

**Jolidays** es un sitio web personalizado que organiza un sorteo de "amigo secreto" para el intercambio de regalos familiar durante las vacaciones en la Riviera Nayarit. El sitio incluye:

- ✨ Página principal con cuenta regresiva al intercambio (24 de diciembre, 2026)
- 📅 Itinerario del viaje
- 🖼️ Galería de fotos familiares (placeholders por ahora)
- 🎁 Enlaces privados únicos para cada participante donde pueden ver su asignación

## 🔐 Características de Privacidad

El sorteo está diseñado con privacidad máxima:

- Cada persona tiene un **enlace único no adivinable** (ej: `/r/4NNBu648`)
- Cada página estática contiene **solo la información de esa persona**, nunca el sorteo completo
- No hay forma de descubrir las otras asignaciones inspeccionando el código del sitio
- Los enlaces se distribuyen individualmente por WhatsApp

## 🎯 Participantes (9 personas)

### Familia Bujanda-Madrigal
- Victor Bujanda
- Lizzeta Madrigal
- Jose Andrés Bujanda Madrigal
- Juan Pablo Bujanda Madrigal

### Familia Madrigal-Villanueva
- Marcela Madrigal Montalvo
- Daniel Villanueva
- Ulani Masso Madrigal
- Ricardo Villarreal (novio de Ulani)

### Abuela
- Thelma Montalvo Garcia

## 🛠️ Tecnología

- **Framework:** Next.js 16 con App Router
- **Styling:** Tailwind CSS 4
- **Despliegue:** Vercel
- **Generación:** Estática (SSG) para máxima privacidad y rendimiento

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ver la versión de producción localmente
npm start
```

## 🎲 Generar/Regenerar Sorteo

El sorteo se genera automáticamente antes de cada build. Si ya existen asignaciones, el script las reutiliza (no regenera).

```bash
# Ver las asignaciones actuales (ya generadas)
cat data/assignments.json

# Regenerar el sorteo (¡CUIDADO! Esto cambiará todas las asignaciones)
npm run generate:force
```

### Restricciones del Sorteo

El algoritmo garantiza que:

1. ✅ Nadie se regala a sí mismo
2. ✅ Las parejas no se regalan entre sí:
   - Victor ↔ Lizzeta
   - Marcela ↔ Daniel
   - Ulani ↔ Ricardo
3. ✅ Padres e hijos no se regalan entre sí:
   - Victor/Lizzeta ↔ Jose/Juan
   - Marcela/Daniel ↔ Ulani
4. ✅ Los hermanos (Jose y Juan) SÍ pueden regalarse entre ellos
5. ✅ Thelma (abuela) no tiene restricciones

## 🔗 Enlaces Privados

Los enlaces privados están en:
```
data/PRIVATE_LINKS.md
```

**⚠️ IMPORTANTE:** Este archivo contiene todos los enlaces privados y **NO está** en el repositorio git (está en .gitignore). Distribúyelos individualmente por WhatsApp.

## 🖼️ Integrar Fotos Familiares

Para reemplazar los placeholders con fotos reales:

1. Agrega tus fotos a la carpeta `public/photos/`
2. Edita `app/page.tsx` en la sección "Photo gallery"
3. Reemplaza los divs de placeholder con componentes `Image` de Next.js:

```tsx
import Image from 'next/image';

// En lugar de:
<div className="aspect-square bg-gradient-to-br...">
  <div className="text-center text-[#6B7280]">
    <div className="text-4xl mb-2">📸</div>
  </div>
</div>

// Usa:
<div className="aspect-square overflow-hidden rounded-2xl">
  <Image
    src="/photos/foto1.jpg"
    alt="Descripción de la foto"
    width={600}
    height={600}
    className="w-full h-full object-cover"
  />
</div>
```

## 🚀 Desplegar a Vercel

### Opción 1: Desde el CLI de Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Desplegar a producción
vercel --prod
```

### Opción 2: Desde GitHub

1. Sube el código a un repositorio de GitHub
2. Importa el proyecto en [vercel.com](https://vercel.com)
3. Vercel detectará automáticamente Next.js y lo desplegará

**Nota:** El dominio será `jolidays.vercel.app` (o el que configures). Si quieres un dominio personalizado, puedes agregarlo en la configuración de Vercel.

## 📁 Estructura del Proyecto

```
jolidays/
├── app/                      # App Router de Next.js
│   ├── page.tsx             # Página principal (landing page)
│   ├── layout.tsx           # Layout raíz con metadata
│   ├── globals.css          # Estilos globales + tema
│   └── r/[slug]/            # Rutas dinámicas para reveal pages
│       └── page.tsx         # Página de revelado individual
├── data/                     # Datos generados
│   ├── assignments.json     # Asignaciones del sorteo (en git)
│   └── PRIVATE_LINKS.md     # Enlaces privados (NO en git)
├── scripts/                  # Scripts de utilidad
│   └── generate-assignments.ts  # Generador del sorteo
└── public/                   # Archivos estáticos
    └── photos/              # (crear) Fotos familiares
```

## 🎨 Tema Visual

Paleta tropical-navideña:
- **Océano:** Turquesa/cyan (#0891B2, #22D3EE)
- **Arena:** Crema/amarillo claro (#FEF3C7, #FDE68A)
- **Navidad:** Rojo (#DC2626) y dorado (#F59E0B)
- **Naturaleza:** Verde (#059669)

Tipografía:
- **Display (títulos):** Poppins
- **Body (texto):** Inter

## 📝 Licencia

Este es un proyecto privado para uso familiar.

---

**¿Preguntas?** Este sitio fue generado con Claude Code.

🎄 ¡Felices fiestas! 🌴
