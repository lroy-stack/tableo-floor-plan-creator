# 🏢 Gestor de Mapas de Planta Virtual

Una aplicación web moderna y profesional para la gestión visual de mapas de planta de restaurantes, cafeterías y espacios comerciales. Permite crear, editar y gestionar la distribución de mesas y elementos arquitectónicos de forma intuitiva.

![Versión](https://img.shields.io/badge/versión-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-blue.svg)

## ✨ Características Principales

### 🎨 Interfaz de Usuario Avanzada
- **Diseño Glassmorphism**: Interfaz moderna con efectos de cristal y transparencias
- **Tema Oscuro/Claro**: Soporte completo para ambos temas
- **Responsive Design**: Optimizado para dispositivos móviles y desktop
- **Animaciones Fluidas**: Transiciones suaves y micro-interacciones

### 🗺️ Canvas Interactivo
- **Zoom y Pan**: Navegación fluida con controles de zoom (0.5x - 3x)
- **Grid Inteligente**: Sistema de rejilla adaptativo con snap automático
- **Drag & Drop**: Arrastra y suelta mesas con facilidad
- **Selección Visual**: Feedback visual claro para elementos seleccionados

### 🪑 Gestión de Mesas
- **Formas Múltiples**: Mesas circulares y rectangulares
- **Capacidad Configurable**: Define capacidad mínima y máxima por mesa
- **Zonas de Comedor**: Clasifica mesas por área (interior/exterior)
- **Estados Dinámicos**: Control de estado activo/inactivo

### 🏗️ Elementos Arquitectónicos
- **Paredes**: Diferentes materiales (hormigón, ladrillo, madera)
- **Puertas**: Varios tipos (batiente, corredera) con dirección de apertura
- **Ventanas**: Con efectos de cristal y marcos personalizables
- **Plantas**: Árboles, arbustos y plantas en maceta
- **Mobiliario**: Barras, columnas, escaleras, obras de arte
- **Decoración**: Alfombras con patrones, chimeneas

### 🛠️ Herramientas Profesionales
- **Barra de Herramientas**: Controles de selección, zoom y guardado
- **Barra de Estado**: Información en tiempo real del proyecto
- **Panel de Elementos**: Biblioteca completa de elementos disponibles
- **Tooltips Informativos**: Guías contextuales para todas las funciones

## 🚀 Tecnologías Utilizadas

### Frontend Core
- **React 18.3.1**: Biblioteca principal de UI
- **TypeScript**: Tipado estático para mayor robustez
- **Vite**: Build tool ultra-rápido
- **React Router Dom**: Navegación SPA

### Estilos y UI
- **Tailwind CSS**: Framework de CSS utility-first
- **Shadcn/UI**: Componentes de UI accesibles y customizables
- **Radix UI**: Primitivos de UI sin estilos
- **Lucide React**: Iconografía moderna y consistente

### Funcionalidades Avanzadas
- **Canvas API**: Renderizado 2D de alta performance
- **React Hook Form**: Gestión eficiente de formularios
- **Sonner**: Sistema de notificaciones elegante
- **Zod**: Validación de esquemas TypeScript-first

## 📦 Instalación

### Prerrequisitos
- Node.js 18.0 o superior
- npm, yarn o bun

### Configuración del Proyecto

```bash
# Clonar el repositorio
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Instalar dependencias
npm install
# o
yarn install
# o
bun install

# Iniciar servidor de desarrollo
npm run dev
# o
yarn dev
# o
bun dev
```

El proyecto estará disponible en `http://localhost:5173`

### Build para Producción

```bash
# Generar build optimizado
npm run build

# Previsualizar build de producción
npm run preview
```

## 🎯 Uso de la Aplicación

### Navegación Básica
1. **Zoom**: Usa los botones `+` y `-` o la rueda del mouse
2. **Pan**: Arrastra el canvas manteniendo presionado el botón del mouse
3. **Reset**: Botón de reset para volver a la vista inicial

### Gestión de Mesas
1. **Seleccionar Mesa**: Click en cualquier mesa del canvas
2. **Mover Mesa**: Arrastra la mesa seleccionada a la nueva posición
3. **Configurar Mesa**: Usa el panel lateral para ajustar propiedades

### Agregar Elementos
1. **Panel de Elementos**: Selecciona el tipo de elemento deseado
2. **Colocación**: Click en el canvas para posicionar
3. **Configuración**: Ajusta propiedades específicas del elemento

### Guardar Proyecto
- **Guardado Automático**: Los cambios se guardan automáticamente
- **Guardado Manual**: Usa el botón "Guardar" en la barra de herramientas
- **Notificaciones**: Confirmación visual de guardado exitoso

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── ui/              # Componentes base de Shadcn/UI
│   └── FloorPlan/       # Componentes específicos del floor plan
│       ├── FloorPlanCanvas.tsx      # Canvas principal
│       ├── ElementRenderer.tsx      # Renderizador de elementos
│       ├── CanvasToolbar.tsx       # Barra de herramientas
│       ├── CanvasStatusBar.tsx     # Barra de estado
│       ├── ElementsPanel.tsx       # Panel de elementos
│       ├── TableConfigModal.tsx    # Modal de configuración
│       └── types.ts                # Tipos TypeScript
├── pages/               # Páginas de la aplicación
│   ├── Index.tsx        # Página principal
│   ├── FloorPlanManager.tsx # Gestor principal
│   └── NotFound.tsx     # Página 404
├── hooks/               # Custom hooks
├── lib/                 # Utilidades y configuración
├── assets/             # Recursos estáticos
└── index.css           # Estilos globales y design system
```

## 🎨 Sistema de Diseño

### Paleta de Colores
- **Primario**: `hsl(217, 91%, 50%)` - Azul vibrante
- **Secundario**: `hsl(210, 40%, 96%)` - Gris claro
- **Acento**: `hsl(142, 76%, 36%)` - Verde elegante
- **Destructivo**: `hsl(0, 84%, 60%)` - Rojo de advertencia

### Componentes Glassmorphism
```css
.glass-panel {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

### Gradientes Personalizados
- **Primario**: `linear-gradient(135deg, hsl(217 91% 50%), hsl(217 85% 65%))`
- **Sutil**: `linear-gradient(180deg, transparent, rgba(0,0,0,0.05))`

## 🔧 Configuración Avanzada

### Personalización de Temas
Modifica `src/index.css` para ajustar el design system:

```css
:root {
  --primary: 217 91% 50%;        /* Tu color primario */
  --accent: 142 76% 36%;         /* Tu color de acento */
  --background: 0 0% 100%;       /* Color de fondo */
}
```

## 🚀 Despliegue

### Con Lovable (Recomendado)
1. Abre tu [Proyecto en Lovable](https://lovable.dev/projects/2300f171-d32a-46cd-9434-d8630585b8cd)
2. Haz click en **Share** → **Publish**
3. Tu aplicación estará disponible instantáneamente

### Dominio Personalizado
Para conectar un dominio personalizado:
1. Ve a **Project** → **Settings** → **Domains**
2. Haz click en **Connect Domain**
3. Sigue las instrucciones para configurar tu dominio

Más información: [Configurar dominio personalizado](https://docs.lovable.dev/tips-tricks/custom-domain)

## 🤝 Contribución

### Formas de Editar el Código

**Usando Lovable (Recomendado)**
- Visita el [Proyecto en Lovable](https://lovable.dev/projects/2300f171-d32a-46cd-9434-d8630585b8cd)
- Los cambios se commitean automáticamente

**Usando tu IDE preferido**
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install
npm run dev
```

**Directamente en GitHub**
- Navega al archivo deseado
- Haz click en el botón "Edit" (ícono de lápiz)
- Realiza tus cambios y commitea

**Usando GitHub Codespaces**
- En la página principal del repo, click "Code" → "Codespaces" → "New codespace"

### Estándares de Código
- **TypeScript**: Tipado estricto obligatorio
- **ESLint**: Configuración estándar incluida
- **Prettier**: Formateo automático de código
- **Conventional Commits**: Para mensajes de commit consistentes

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **Lovable**: Por la plataforma de desarrollo AI
- **Shadcn/UI**: Por los componentes base excepcionales
- **Radix UI**: Por los primitivos accesibles
- **Lucide React**: Por la iconografía consistente
- **Tailwind CSS**: Por el sistema de utilidades

---

⭐ **¡Si te gusta este proyecto, no olvides darle una estrella en GitHub!** ⭐
