# FortisOS Ombudsman Module

Complete production-ready Ombudsman module for the Gambia's Office of the Ombudsman.

## Features

- **Multi-language Support**: English, Mandinka, and Pulaar
- **Anonymous Complaints**: Citizens can file complaints anonymously
- **UJRIS Integration**: Automatic document verification and integrity scoring
- **Case Tracking**: Real-time status updates for complainants
- **Investigator Dashboard**: Full case management for Ombudsman staff
- **Legal Compliance**: Automated recommendations based on Gambia Labour Act 2007
- **MDA Ranking**: Track ministry compliance and performance
- **SMS Notifications**: Automated updates via SMS (Africa's Talking/Twilio)

## Project Structure

```
fortisos/
├── app/
│   ├── api/
│   │   ├── ombudsman/
│   │   │   ├── submit/route.ts      # Submit complaint
│   │   │   ├── cases/route.ts       # List all cases
│   │   │   ├── case/[id]/route.ts  # Get/update single case
│   │   │   ├── verify/route.ts     # UJRIS verification
│   │   │   ├── recommend/route.ts  # Generate recommendation
│   │   │   └── dashboard/route.ts # Dashboard data
│   │   └── upload/route.ts        # File uploads
│   ├── ombudsman/
│   │   ├── page.tsx               # Landing page
│   │   ├── complain/page.tsx      # Complaint form
│   │   ├── track/page.tsx         # Case tracking entry
│   │   ├── track/[id]/page.tsx   # Case status view
│   │   ├── dashboard/page.tsx     # Investigator dashboard
│   │   └── rights/page.tsx       # Know Your Rights
│   ├── components/ombudsman/
│   │   ├── CaseList.tsx
│   │   ├── CaseTracker.tsx
│   │   ├── ComplaintForm.tsx
│   │   ├── MDARanking.tsx
│   │   └── RecommendationLetter.tsx
│   └── lib/ombudsman/
│       ├── ujris.ts               # Document verification
│       ├── legal.ts               # Legal compliance
│       └── dashboard.ts           # Analytics engine
├── prisma/
│   └── schema.prisma             # Database schema
└── public/uploads/ombudsman/     # File storage
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fortisos
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database URL and API keys
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start development server:
```bash
npm run dev
```

## Environment Variables

See `.env.example` for all required variables:

- `DATABASE_URL`: PostgreSQL connection string
- `SMS_API_KEY`: SMS provider API key (Africa's Talking/Twilio)
- `NEXT_PUBLIC_APP_URL`: Your app's public URL
- `NEXTAUTH_SECRET`: Secret for NextAuth.js

## API Endpoints

### Submit Complaint
```
POST /api/ombudsman/submit
Body: {
  "isAnonymous": true,
  "complainantName": "John Doe",
  "complainantPhone": "+2201234567",
  "mdaId": "MOL",
  "mdaName": "Ministry of Labour",
  "complaintText": "Complaint details...",
  "complaintLanguage": "en",
  "evidenceUrls": []
}
```

### Get Cases
```
GET /api/ombudsman/cases?status=RECEIVED&mdaId=MOL
```

### Get Single Case
```
GET /api/ombudsman/case/[id]
```

### Generate Recommendation
```
POST /api/ombudsman/recommend
Body: { "caseId": "OMB-2026-0001" }
```

### UJRIS Verification
```
POST /api/ombudsman/verify
Body: { "text": "Complaint text...", "documentUrls": [] }
```

### Dashboard Data
```
GET /api/ombudsman/dashboard
```

## Database Schema

### OmbudsmanCase
- Tracks all complaints with full audit trail
- UJRIS integrity scoring
- Case status workflow: RECEIVED → INVESTIGATING → MDA_RESPONDED → RESOLVED → CLOSED

### OmbudsmanRecommendation
- Stores generated recommendations
- Tracks MDA compliance
- Escalation tracking

### OmbudsmanAuditLog
- Immutable log of all case actions
- Supports transparency and accountability

## Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

### Docker
```bash
docker build -t fortisos-ombudsman .
docker run -p 3000:3000 fortisos-ombudsman
```

### Environment for Production
- Use PostgreSQL (not SQLite)
- Set `DATABASE_URL` to your PostgreSQL instance
- Configure SMS provider for notifications
- Set `NEXT_PUBLIC_APP_URL` to your production URL

## Testing

Use the sample complaints in `testing/data.json` to test the system:

```bash
# Test complaint submission
curl -X POST http://localhost:3000/api/ombudsman/submit \
  -H "Content-Type: application/json" \
  -d @testing/sample-complaint.json
```

## Legal References

- Gambia Labour Act 2007
- Ombudsman Act
- Constitution of the Gambia 1997

## Support

- Office of the Ombudsman: +220 123 4567
- Email: ombudsman@fortisos.gov.gm

## License

Proprietary - Prepared for CEO Cadjatu Djało, FortisOS
