Zumaa Properties

Mobile-first real estate app for traditional lands in Lusaka (Namayani, Lusaka West, Chalala Shantumbu).

Features
- Clean green-and-white theme, big buttons, chat-like flow
- Choose location → plot size → book appointment
- Stores appointments with Prisma (SQLite by default, MySQL-ready)
- Optional n8n webhook on new appointment

Quick Start
1) Install dependencies:
```bash
cd zumaa-properties
npm install
```
2) Configure environment:
```bash
cp .env.example .env
```
3) Setup DB and run:
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Switch to MySQL
- Set `DB_PROVIDER=mysql` and update `DATABASE_URL` in `.env`.
- Run generate and migrate again.

n8n
- Set `N8N_WEBHOOK_URL` in `.env` to receive JSON payloads on new appointments.

