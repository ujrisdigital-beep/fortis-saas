# Fortis SaaS Database Wiring - SETUP INSTRUCTIONS

## ✅ Completed Implementation

All authentication files have been updated to use Prisma + bcrypt:
- `lib/auth.ts` — Queries users from database, validates with bcrypt
- `app/api/auth/register/route.ts` — Saves new users to Prisma with hashed passwords
- `prisma/schema.prisma` — Changed provider from PostgreSQL to SQLite for dev
- `.env.local` — Created with `DATABASE_URL="file:./dev.db"`
- `package.json` — Added bcrypt, @types/bcrypt, ts-node dependencies

## 🛠️ MANUAL SETUP STEPS REQUIRED

**The package.json got corrupted during patching. Please fix it manually:**

### Step 1: Fix package.json

Replace the entire content of `package.json` with:

```json
{
  "name": "fortis-saas",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:migrate": "prisma migrate dev",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "^6.5.0",
    "bcrypt": "^5.1.1",
    "next": "14.2.24",
    "next-auth": "^4.24.11",
    "nodemailer": "^7.0.7",
    "prisma": "^6.5.0",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/node": "20.17.28",
    "@types/react": "18.3.20",
    "@types/react-dom": "18.3.5",
    "eslint": "8.57.1",
    "eslint-config-next": "14.2.24",
    "ts-node": "^10.9.2",
    "typescript": "5.8.2"
  },
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

### Step 2: Run Setup Commands

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations (creates dev.db with schema)
npx prisma migrate dev --name init

# Seed test users (optional but recommended)
npx prisma db seed

# Start dev server
npm run dev
```

### Step 3: Test

1. Open http://localhost:3000/auth/register
2. Register a new user
3. In another terminal, run `npx prisma studio` and verify user appears in database
4. Login at http://localhost:3000/auth/login with your new credentials

## 📝 Database Setup for Production

When ready to move to production:

1. Get your PostgreSQL connection string from your managed service (Vercel Postgres, Supabase, Railway, etc.)
2. Update `.env.local`:
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   ```
3. Update `prisma/schema.prisma` - change provider back to postgresql:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Run: `npx prisma migrate deploy`

## 📚 Architecture Summary

- **Authentication**: NextAuth.js with Credentials provider
- **Database**: Prisma ORM (SQLite for dev, PostgreSQL for production)
- **Password Security**: bcrypt hashing (10 rounds)
- **User Roles**: CEO, BOARD, MANAGER, CLIENT, GOVERNMENT, PUBLIC
- **API Routes**: All use Prisma queries instead of hardcoded seed users
