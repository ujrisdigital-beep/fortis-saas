# Fortis Invicta SaaS - Deployment Guide

## Status: ✅ PRODUCTION BUILD READY

Your Next.js application has been successfully built and is ready for deployment to Vercel.

---

## Quick Start Deployment (5 minutes)

### Step 1: Prepare GitHub Repository

```bash
# Initialize git repo (if not already done)
git init
git add .
git commit -m "Initial commit: Production-ready Fortis SaaS"

# Create new repo on GitHub (https://github.com/new)
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/fortis-saas.git
git branch -M main
git push -u origin main
```

### Step 2: Create Vercel Project

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import the GitHub repository you just created
4. Click "Import"

### Step 3: Configure Environment Variables

In Vercel dashboard → Settings → Environment Variables, add:

**Required Variables:**

```
DATABASE_URL=postgresql://user:password@host:port/database
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=https://app.fortisinvicta.com
NEXT_PUBLIC_API_URL=https://app.fortisinvicta.com
```

**Optional (for email/payments):**

```
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@fortisinvicta.com

STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

### Step 4: Database Setup

Choose one:

**Option A: Supabase (Recommended)**
- Go to https://supabase.com
- Create new project
- Wait for provisioning
- Copy Connection String (use the "Connection Pooling" string for production)
- Paste as `DATABASE_URL` in Vercel

**Option B: Vercel Postgres**
- In Vercel dashboard → Storage → Create Database → Postgres
- Copy connection string automatically added to env vars

**Option C: Railway**
- Go to https://railway.app
- Create new project → PostgreSQL
- Copy PostgreSQL connection string
- Paste as `DATABASE_URL` in Vercel

### Step 5: Deploy

1. In Vercel dashboard, refresh the page or click "Redeploy"
2. Vercel will automatically:
   - Run `npm run vercel-build` (which includes `prisma db push` for schema sync)
   - Build the Next.js app
   - Deploy to production

3. Monitor deployment in the "Deployments" tab

### Step 6: Custom Domain

1. In Vercel dashboard → Settings → Domains
2. Add domain `app.fortisinvicta.com`
3. Follow DNS configuration steps
4. Update your domain registrar (Hostinger/Namecheap/etc)

---

## Build Details

- **Framework**: Next.js 14.2.24
- **Build Command**: `npm run vercel-build` (includes Prisma schema sync)
- **Output Size**: 77 MB (healthy for production)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT + bcrypt password hashing
- **API Routes**: 6 AI endpoints + Auth endpoints

---

## Troubleshooting

### Build Fails in Vercel

Check build logs in Vercel dashboard → Deployments → [Latest] → Logs

Common issues:
- Missing `DATABASE_URL` env var → Add it in Settings
- Wrong database connection string → Test locally first
- Missing `NEXTAUTH_SECRET` → Generate new one with `openssl rand -base64 32`

### Database Schema Not Syncing

The build includes `prisma db push` which auto-syncs schema. If it fails:
1. Check `DATABASE_URL` is correct
2. Ensure database user has CREATE TABLE permissions
3. Check Vercel build logs for detailed error

### Site Unreachable After Deploy

1. Check deployment status is "Ready"
2. Verify custom domain DNS propagated (wait up to 24 hours)
3. Test with Vercel's default domain first: `https://fortis-saas.vercel.app`

---

## Environment Variables Reference

| Variable | Required | Example | Source |
|----------|----------|---------|--------|
| DATABASE_URL | ✅ Yes | `postgresql://...` | Supabase/Railway/Vercel |
| NEXTAUTH_SECRET | ✅ Yes | `abc123...` | Generate locally |
| NEXTAUTH_URL | ✅ Yes | `https://app.fortisinvicta.com` | Your domain |
| NEXT_PUBLIC_API_URL | ✅ Yes | `https://app.fortisinvicta.com` | Your domain |
| SMTP_HOST | ❌ Optional | `smtp.gmail.com` | Email provider |
| STRIPE_PUBLIC_KEY | ❌ Optional | `pk_live_...` | Stripe dashboard |
| STRIPE_SECRET_KEY | ❌ Optional | `sk_live_...` | Stripe dashboard |

---

## Post-Deployment Checklist

- [ ] Test login at https://app.fortisinvicta.com/auth/login
- [ ] Verify registration at https://app.fortisinvicta.com/auth/register
- [ ] Test board dashboard at https://app.fortisinvicta.com/board/dashboard
- [ ] Verify database connection (check User table has entries)
- [ ] Test AI endpoints (board-briefing, grant application)
- [ ] Set up SSL certificate (Vercel handles this automatically)
- [ ] Configure error tracking (optional: Sentry, LogRocket)
- [ ] Set up monitoring (optional: Vercel Analytics)

---

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- NextAuth Docs: https://next-auth.js.org

**Last Built**: $(date)
**Build Status**: ✅ READY FOR DEPLOYMENT
