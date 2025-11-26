# Vue UI Builder

A real-time drag-and-drop UI builder built with Vue 3, TypeScript, and Node.js (NestJS).

## Features

- 🎨 **Visual Drag-and-Drop Interface** - Intuitive UI builder with component palette, design canvas, and properties panel
- ⚡ **Real-Time Collaboration** - WebSocket-based real-time updates using Socket.IO
- 📝 **Code Editor** - Integrated CodeMirror editor with syntax highlighting for generated code
- 🔧 **Code Generation** - Automatically generates Vue or HTML code from your designs
- 📦 **Component Library** - Pre-built HTML and layout components ready to use
- 🏗️ **Modular Architecture** - Clean, scalable folder structure following Vue best practices

## Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework with TypeScript
- **Socket.IO** - Real-time bidirectional event-based communication
- **class-validator** - Validation using decorators

### Frontend
- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation frontend tooling
- **Pinia** - Intuitive Vue store
- **Vue Router** - Official Vue routing library
- **vue3-grid-layout-next** - Draggable and resizable grid layout
- **Vue CodeMirror** - Code editor integration
- **Socket.IO Client** - Real-time communication

### Testing
- **Vitest** - Fast unit testing framework
- **Vue Test Utils** - Official testing utilities for Vue
- **Jest** - Backend testing
- **Playwright** - End-to-end testing

## Project Structure

```
├── backend/                    # NestJS backend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── designer/       # Designer module
│   │   │   │   ├── controllers/
│   │   │   │   ├── services/
│   │   │   │   ├── gateways/   # WebSocket gateway
│   │   │   │   ├── dto/
│   │   │   │   └── entities/
│   │   │   └── components/     # Components module
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
│
├── frontend/                   # Vue 3 frontend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── designer/       # Designer feature module
│   │   │   │   ├── components/
│   │   │   │   ├── pages/
│   │   │   │   ├── services/
│   │   │   │   ├── stores/
│   │   │   │   ├── types/
│   │   │   │   └── composables/
│   │   │   └── xodisalar/      # Example module structure
│   │   ├── shared/             # Shared utilities
│   │   ├── router/
│   │   ├── assets/
│   │   ├── App.vue
│   │   └── main.ts
│   ├── e2e/                    # E2E tests
│   └── package.json
│
└── package.json                # Root package.json (monorepo)
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 8+

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd designer
```

2. Install dependencies
```bash
npm run install:all
```

### Development

Start both backend and frontend in development mode:
```bash
npm run dev
```

Or run them separately:
```bash
# Backend (runs on http://localhost:3001)
npm run dev:backend

# Frontend (runs on http://localhost:5173)
npm run dev:frontend
```

### Building

```bash
npm run build
```

### Testing

```bash
# Run all tests
npm run test

# Backend tests only
npm run test:backend

# Frontend unit tests only
npm run test:frontend

# E2E tests
npm run test:e2e
```

## Usage

1. Open the application at http://localhost:5173
2. Create a new project or select an existing one
3. Drag components from the left panel onto the canvas
4. Resize and position components using the grid layout
5. Edit component properties in the right panel
6. View and copy the generated code in the code editor panel

## Module Structure (Example: xodisalar)

Following Vue's recommended modular architecture:

```
src/modules/xodisalar/
├── components/      # Reusable Vue components
├── pages/           # Route-level page components
├── services/        # API service layer
├── stores/          # Pinia store
├── types/           # TypeScript interfaces/types
└── composables/     # Composable functions
```

## API Endpoints

### Designer API
- `POST /api/designer/projects` - Create a new project
- `GET /api/designer/projects` - Get all projects
- `GET /api/designer/projects/:id` - Get project by ID
- `PUT /api/designer/projects/:id/layout` - Save project layout
- `POST /api/designer/generate-code` - Generate code from layout

### Components API
- `GET /api/components` - Get all available components
- `GET /api/components/categories` - Get component categories
- `GET /api/components/:id` - Get component by ID

## WebSocket Events

- `joinProject` - Join a project room for real-time updates
- `leaveProject` - Leave a project room
- `updateLayout` - Broadcast layout changes
- `addComponent` - Add a new component
- `updateComponent` - Update component properties
- `removeComponent` - Remove a component

## License

MIT
