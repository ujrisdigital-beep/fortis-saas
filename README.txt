FORTIS SAAS FOUNDATION

1) In terminal:
   cd fortis-saas
   npx create-next-app@latest . --ts --eslint --app --src-dir=false --import-alias "@/*"

2) When prompted about existing files, keep existing files and merge manually if needed.

3) Install required packages:
   npm install prisma @prisma/client next-auth stripe nodemailer zustand @tanstack/react-query @anthropic-ai/sdk

4) Setup env:
   copy .env.local.example .env.local
   Edit .env.local with real secrets.

5) Run locally:
   npm run dev

6) Deploy SaaS app:
   Push fortis-saas to GitHub and deploy on Vercel.

NOTE:
- Keep public funnel files (index.html, partners.html, investor-pack.html) on Hostinger root.
- Point app.fortisinvicta.com to Vercel deployment for SaaS.

CURRENTLY IMPLEMENTED ROUTES

- /auth/login
- /auth/register
- /dashboard
- /board/dashboard
- /funding
- /funding/[grantId]/apply
- /investors
- /payments

CURRENTLY IMPLEMENTED API ROUTES

- /api/auth/[...nextauth]
- /api/auth/register
- /api/welcome-email
- /api/ai/board-briefing
- /api/ai/generate-grant-application
- /api/ai/generate-investor-pack

DEPLOYMENT ORDER

1) Hostinger public_html:
   - Upload index.html, partners.html, investor-pack.html

2) Local setup for SaaS:
   - Install Node.js LTS so npm is available
   - cd fortis-saas
   - npm install
   - copy .env.local.example .env.local
   - fill all required secrets
   - npm run dev

3) Vercel deployment:
   - Create new Vercel project from fortis-saas
   - Add all env variables in Vercel dashboard
   - Set production domain to app.fortisinvicta.com

4) DNS:
   - Keep fortisinvicta.com on Hostinger
   - Point subdomain app.fortisinvicta.com to Vercel

SECURITY BASELINE

- Keep API keys server-side only
- Verify Stripe and other webhook signatures before state updates
- Never send bank credentials or payment secrets to client code
- Use role-based route protection for board, admin, and partner workspaces
