# ZhenAI — AI-Powered Practice Management for TCM

Landing page for ZhenAI, the first practice management platform built by an acupuncturist.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (waitlist storage)

## Getting Started

```bash
npm install
cp .env.local.example .env.local
# Fill in your Supabase credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase Setup

1. Create a new Supabase project
2. Run `schema.sql` in the SQL Editor to create the waitlist table
3. Copy your project URL and anon key to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Import into [Vercel](https://vercel.com/new)
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

Or use the Vercel CLI:

```bash
npx vercel --prod
```

## Project Structure

```
src/
├── app/
│   ├── api/waitlist/route.ts   # Waitlist API endpoint
│   ├── globals.css             # Global styles + animations
│   ├── layout.tsx              # Root layout + metadata
│   └── page.tsx                # Landing page (all sections)
└── lib/
    └── supabase.ts             # Supabase client
schema.sql                      # Waitlist table DDL
```
