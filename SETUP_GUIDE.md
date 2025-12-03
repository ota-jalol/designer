# Real-time UI Builder - Setup Guide

## Yangi Featurelar ✨

### 1. Database Integration (PostgreSQL + TypeORM)
- ✅ Ma'lumotlar endi databaseda saqlanadi
- ✅ Project va Component entitylari
- ✅ Migrations support

### 2. Authentication & Authorization (JWT)
- ✅ User registration va login
- ✅ JWT token authentication
- ✅ Protected routes
- ✅ Project ownership

### 3. Performance Optimizations
- ✅ WebSocket updates debouncing (300ms)
- ✅ Reduced network traffic
- ✅ Better real-time collaboration

### 4. Undo/Redo Functionality
- ✅ Layout history tracking (50 steps)
- ✅ Ctrl+Z / Ctrl+Y keyboard shortcuts
- ✅ State management with Pinia

### 5. Export/Import Projects
- ✅ JSON export functionality
- ✅ Import from file
- ✅ Project backup/restore

### 6. Security Improvements
- ✅ Input sanitization (sanitize-html)
- ✅ XSS prevention
- ✅ CORS configuration
- ✅ JWT-based authentication

### 7. API Documentation
- ✅ Swagger/OpenAPI docs
- ✅ Available at: http://localhost:3001/api/docs

---

## O'rnatish (Installation)

### Prerequisites
- Node.js 23.x
- PostgreSQL 12+
- npm or yarn

### 1. Database Setup

PostgreSQL o'rnating va database yarating:

\`\`\`bash
# PostgreSQL ga kirish
psql -U postgres

# Database yaratish
CREATE DATABASE ui_builder;

# User yaratish (optional)
CREATE USER ui_builder_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ui_builder TO ui_builder_user;

# Chiqish
\\q
\`\`\`

### 2. Backend Setup

\`\`\`bash
cd backend

# Dependencies o'rnatish
npm install

# Environment variables
cp .env.example .env
# Edit .env file with your database credentials

# Database sync (development)
npm run start:dev
# TypeORM automatically synchronizes schema in development mode

# Yoki migration ishlatish (production)
npm run migration:generate -- src/migrations/InitialMigration
npm run migration:run
\`\`\`

**.env file** example:
\`\`\`env
NODE_ENV=development
PORT=3001

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=ui_builder

JWT_SECRET=your-very-secure-secret-key-change-in-production
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:5173
\`\`\`

### 3. Frontend Setup

\`\`\`bash
cd frontend

# Dependencies o'rnatish
npm install

# Development server
npm run dev
\`\`\`

### 4. Run Everything

Terminal 1 - Backend:
\`\`\`bash
cd backend
npm run start:dev
\`\`\`

Terminal 2 - Frontend:
\`\`\`bash
cd frontend
npm run dev
\`\`\`

Yoki root directoriyadan:
\`\`\`bash
npm run dev
\`\`\`

---

## Foydalanish (Usage)

### 1. Register / Login
- Frontend: http://localhost:5173
- Login page'da yoki "Register" tugmasini bosing
- Email va parol bilan ro'yxatdan o'ting

### 2. Create Project
- Projects page'da "New Project" tugmasini bosing
- Nom kiriting va "Create" bosing

### 3. Design Interface
- Component Palette'dan komponentlarni tanlang
- Canvas'ga drag & drop qiling
- Properties Panel'da properties o'zgartiring
- Real-time collaboration ishlaydi!

### 4. Keyboard Shortcuts
- **Ctrl + Z**: Undo
- **Ctrl + Y** or **Ctrl + Shift + Z**: Redo
- **Delete**: Remove selected component

### 5. Export/Import
- Project menu'dan "Export" tugmasini bosing (JSON format)
- "Import" tugmasi bilan JSON faylni yuklab oling

### 6. Generate Code
- "Generate Code" tugmasini bosing
- Vue yoki HTML formatini tanlang
- Kod ko'chirib oling

---

## API Documentation

Backend ishga tushgandan so'ng Swagger docs mavjud:
- **URL**: http://localhost:3001/api/docs
- Barcha endpoint'larni ko'rish va test qilish mumkin

### Main Endpoints

**Auth:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login

**Projects:**
- `GET /api/designer/projects` - Get all user projects
- `POST /api/designer/projects` - Create project
- `GET /api/designer/projects/:id` - Get project
- `DELETE /api/designer/projects/:id` - Delete project
- `GET /api/designer/projects/:id/export` - Export project
- `POST /api/designer/projects/import` - Import project

**Layout:**
- `PUT /api/designer/projects/:id/layout` - Save layout
- `PUT /api/designer/projects/:id/layout/item` - Update item
- `DELETE /api/designer/projects/:id/layout/:itemId` - Remove item

**Components:**
- `GET /api/components` - Get all components
- `GET /api/components/category/:category` - Get by category

---

## Testlar (Tests)

### Backend Tests
\`\`\`bash
cd backend
npm test
npm run test:cov  # with coverage
\`\`\`

### Frontend Tests
\`\`\`bash
cd frontend
npm run test
npm run test:e2e  # Playwright E2E tests
\`\`\`

---

## Production Deployment

### Environment Variables
Production uchun .env file'ni to'g'ri sozlang:

\`\`\`env
NODE_ENV=production
JWT_SECRET=generate-strong-secret-key-here
CORS_ORIGIN=https://your-domain.com
DB_PASSWORD=strong-database-password
\`\`\`

### Database Migrations
\`\`\`bash
cd backend
npm run migration:generate -- src/migrations/ProductionMigration
npm run migration:run
\`\`\`

### Build
\`\`\`bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
# Dist folder'ni static hosting'ga deploy qiling
\`\`\`

---

## Troubleshooting

### Database Connection Error
- PostgreSQL ishga tushganini tekshiring: `pg_ctl status`
- .env file'dagi credentials to'g'ri ekanligini tekshiring
- Database yaratilganini tekshiring

### JWT Authentication Error
- Token expiration muddatini tekshiring
- JWT_SECRET to'g'ri sozlanganligini tekshiring
- LocalStorage'da token borligini tekshiring

### WebSocket Connection Error
- Backend ishlayotganini tekshiring
- CORS settings to'g'riligini tekshiring
- Frontend socket.io client versiyasi backend bilan mos ekanligini tekshiring

---

## Next Steps / Rejalashtirish

### Qo'shimcha Featurelar:
- [ ] Component nesting/composition
- [ ] Responsive preview modes
- [ ] Dark/Light theme toggle
- [ ] Keyboard shortcuts modal
- [ ] Asset management (image upload)
- [ ] Template library
- [ ] Team collaboration features
- [ ] Version control for projects
- [ ] Component marketplace

### Yaxshilanishlar:
- [ ] Better error handling UI
- [ ] Loading states
- [ ] Toast notifications
- [ ] Form validation
- [ ] Better TypeScript types
- [ ] More comprehensive tests
- [ ] Performance monitoring
- [ ] Analytics

---

## License

MIT

## Contributors

- Your Name

## Support

Issues: https://github.com/your-repo/issues
