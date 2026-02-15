# Gym Class Site

Local gym website with class scheduling and bookings. Built with Next.js, Supabase, Stripe, and Resend.

## Quick Start

```bash
# Install dependencies (if needed)
npm install

# Copy env template and add your keys
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- **Next.js 16** – React framework (App Router)
- **Tailwind CSS** – Styling
- **Supabase** – Database, auth
- **Stripe** – Payments
- **Resend** – Transactional email

## Project Structure

- `docs/` – PRD and planning docs
- `app/` – Next.js App Router pages and layouts

## Documentation and product spec

When you add or change product-facing features, **update the product spec** so it stays the single source of truth:

- **Product spec:** [docs/gym_website_prd.md](docs/gym_website_prd.md)
- Add or revise the relevant section (e.g. under Feature Requirements) and bump the **Revision History** at the bottom of the file.
