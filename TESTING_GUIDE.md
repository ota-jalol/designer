# Testing Guide - Vue UI Builder

## Prerequisites

Before testing the application, ensure you have the following installed:

- **Node.js**: Version 23.9.0 (or compatible)
- **PostgreSQL**: Version 12 or higher
- **npm**: Version 10.x or higher

## Database Setup

### 1. Install PostgreSQL

If you don't have PostgreSQL installed:
- **Windows**: Download from https://www.postgresql.org/download/windows/
- **macOS**: `brew install postgresql@15`
- **Linux**: `sudo apt-get install postgresql`

### 2. Create Database

Open PostgreSQL command line or pgAdmin and run:

```sql
CREATE DATABASE ui_builder;
CREATE USER ui_builder_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE ui_builder TO ui_builder_user;
```

### 3. Configure Backend Environment

Create `backend/.env` file:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=ui_builder_user
DB_PASSWORD=your_secure_password
DB_DATABASE=ui_builder

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRATION=7d

# Server Configuration
PORT=3000
NODE_ENV=development
```

**IMPORTANT**: Change `JWT_SECRET` to a strong random string in production!

## Installation Steps

### Backend Setup

```powershell
cd backend

# Install dependencies (using legacy peer deps for Node 23 compatibility)
npm install --legacy-peer-deps

# Verify installation
npm list @nestjs/core @nestjs/typeorm typeorm pg
```

### Frontend Setup

```powershell
cd frontend

# Install dependencies
npm install --legacy-peer-deps

# Verify installation
npm list vue pinia vue-router
```

## Running the Application

### Start Backend (Terminal 1)

```powershell
cd backend
npm run start:dev
```

Expected output:
```
[Nest] INFO [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] INFO [RoutesResolver] AuthController {/auth}
[Nest] INFO [RoutesResolver] DesignerController {/designer}
[Nest] INFO [RoutesResolver] ComponentsController {/components}
[Nest] INFO Application listening on http://localhost:3000
[Nest] INFO Swagger docs available at http://localhost:3000/api
```

The backend will automatically create database tables on first run (TypeORM synchronize mode in development).

### Start Frontend (Terminal 2)

```powershell
cd frontend
npm run dev
```

Expected output:
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## Testing Workflow

### 1. Initial Access

1. Open browser: http://localhost:5173/
2. You should be redirected to `/login` page

### 2. User Registration

1. Click "Register" tab
2. Fill in:
   - **Username**: testuser
   - **Email**: test@example.com
   - **Password**: Test123!@#
3. Click "Register"
4. Should redirect to `/projects` page

### 3. Create First Project

1. Click "+ New Project" button
2. Enter project name: "My Test Project"
3. Click "Create"
4. Should redirect to designer view

### 4. Test Designer Features

#### Component Palette
- Drag a **Button** component onto canvas
- Drag a **TextInput** component
- Drag a **Container** component

#### Properties Panel
- Click on Button component
- Change properties:
  - Label: "Click Me"
  - Color: primary
  - Size: large
- Verify changes appear in real-time

#### Code Editor
- View generated Vue code at bottom
- Code should auto-update as you modify components

#### Undo/Redo
- Add a component
- Press **Ctrl+Z** → component disappears (undo)
- Press **Ctrl+Y** → component reappears (redo)
- Click undo/redo buttons in header (↶/↷)

#### Delete Component
- Select a component
- Press **Delete** key
- Component should be removed

#### Auto-save
- Make changes to layout
- Wait 300ms (debounce delay)
- Check browser DevTools Network tab for PUT `/designer/projects/:id/layout` request

### 5. Test Real-time Collaboration

1. Open **second browser tab** → http://localhost:5173/
2. Login with same credentials
3. Navigate to same project
4. Make changes in Tab 1 → should appear in Tab 2 within 1 second
5. Make changes in Tab 2 → should appear in Tab 1 within 1 second

### 6. Test Export/Import

#### Export
1. Go to Projects page
2. Find your project
3. Click "📤 Export" button
4. A JSON file should download: `project-{id}.json`

#### Import
1. Click "📥 Import" button in header
2. Select the exported JSON file
3. New project should appear in list with "(Imported)" suffix

### 7. Test Project Management

#### Delete Project
1. Find a project in list
2. Click "🗑 Delete" button
3. Confirm deletion
4. Project should disappear from list

#### Logout
1. Click "Logout" button in header
2. Should redirect to `/login` page
3. Try accessing `/projects` → should redirect to `/login` (auth guard)

## Testing API Directly

### Using Swagger UI

Open http://localhost:3000/api in browser to access interactive API documentation.

### Using curl/Postman

#### Register User
```powershell
curl -X POST http://localhost:3000/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"Test123!@#\"}'
```

#### Login
```powershell
curl -X POST http://localhost:3000/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"testuser\",\"password\":\"Test123!@#\"}'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

#### Create Project (with auth token)
```powershell
$token = "your_access_token_here"
curl -X POST http://localhost:3000/designer/projects `
  -H "Authorization: Bearer $token" `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"API Test Project\"}'
```

## Running Tests

### Backend Tests

```powershell
cd backend

# Unit tests
npm test

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

### Frontend Tests

```powershell
cd frontend

# Vitest unit tests
npm test

# E2E tests with Playwright
npm run test:e2e
```

## Troubleshooting

### Database Connection Issues

**Error**: `ECONNREFUSED ::1:5432`

**Solution**: Check PostgreSQL is running:
```powershell
# Windows (check service)
Get-Service postgresql*

# Start PostgreSQL service
Start-Service postgresql-x64-15
```

**Error**: `password authentication failed`

**Solution**: Verify credentials in `backend/.env` match PostgreSQL user:
```powershell
# Connect to PostgreSQL to test
psql -U ui_builder_user -d ui_builder -h localhost
```

### Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**: Kill process on port 3000:
```powershell
# Find process
netstat -ano | findstr :3000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### JWT Token Issues

**Error**: `401 Unauthorized` on protected routes

**Solution**: 
1. Check token in browser DevTools → Application → Local Storage
2. Token should exist as `auth_token`
3. Try logout and login again
4. Check JWT_SECRET matches in backend/.env

### WebSocket Connection Issues

**Error**: `WebSocket connection failed` in console

**Solution**:
1. Ensure backend is running on port 3000
2. Check CORS configuration in `backend/src/main.ts`
3. Verify Socket.io is initialized in `designer.gateway.ts`

### TypeORM Sync Issues

**Error**: `relation "user" does not exist`

**Solution**: Delete and recreate database:
```sql
DROP DATABASE ui_builder;
CREATE DATABASE ui_builder;
```

Then restart backend - TypeORM will recreate tables.

## Performance Testing

### Load Testing with Artillery

Install Artillery:
```powershell
npm install -g artillery
```

Create `load-test.yml`:
```yaml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Create projects"
    flow:
      - post:
          url: "/auth/login"
          json:
            username: "testuser"
            password: "Test123!@#"
          capture:
            - json: "$.access_token"
              as: "token"
      - post:
          url: "/designer/projects"
          headers:
            Authorization: "Bearer {{ token }}"
          json:
            name: "Load Test Project"
```

Run test:
```powershell
artillery run load-test.yml
```

### Memory Usage Monitoring

```powershell
# Backend memory
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Select ProcessName, WS

# Watch WebSocket connections
# Check browser DevTools → Network → WS tab
```

## Security Checklist

- [x] Passwords hashed with bcrypt
- [x] JWT tokens for authentication
- [x] Input sanitization with sanitize-html
- [x] CORS configured properly
- [x] SQL injection prevented (TypeORM parameterized queries)
- [x] XSS prevention (sanitize-html)
- [x] Secure password requirements enforced
- [ ] HTTPS enabled (production only)
- [ ] Rate limiting configured (TODO)
- [ ] Helmet.js security headers (TODO)

## Next Steps

After successful testing:

1. **Implement Component Nesting**: Allow components to have children
2. **Add Rate Limiting**: Prevent API abuse
3. **Configure Production Build**: 
   - Set `NODE_ENV=production`
   - Disable TypeORM synchronize
   - Use migrations for schema changes
   - Enable HTTPS
4. **Deploy to Cloud**: AWS, Azure, or DigitalOcean
5. **Set up CI/CD**: GitHub Actions, GitLab CI
6. **Add Monitoring**: Sentry, New Relic, DataDog

## Support

If you encounter issues not covered here:

1. Check backend logs in terminal
2. Check browser DevTools console
3. Review PostgreSQL logs
4. Check `IMPLEMENTATION_SUMMARY.md` for architecture details
5. Review `SETUP_GUIDE.md` for additional setup help
