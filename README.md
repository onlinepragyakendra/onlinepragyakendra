# Online Pragya Kendra

A starter full-stack B2C/G2C portal built with Next.js App Router, TypeScript, PostgreSQL, Prisma and Razorpay.

## Included
- Public service catalogue and responsive landing page
- Customer, retailer and distributor registration
- Password-hash-based login and HTTP-only signed session cookie
- Role field and account/KYC status foundation
- Wallet balance stored as integer paise
- Recent transaction dashboard
- Razorpay order creation endpoint
- Razorpay `payment.captured` webhook with HMAC signature validation and idempotent wallet credit
- Prisma data models for users, hierarchy, wallet, ledger transactions and service requests
- Server-side environment variable placeholders for service provider APIs

## Run locally
1. Install Node.js 20+ and PostgreSQL.
2. Copy `.env.example` to `.env.local` and fill `DATABASE_URL` and a random `JWT_SECRET` (32+ characters).
3. Install dependencies: `npm install`
4. Generate Prisma client and create tables: `npx prisma generate && npx prisma db push`
5. Start development server: `npm run dev`
6. Open `http://localhost:3000`.

## Razorpay setup
1. Start with Razorpay test-mode keys.
2. Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` server-side.
3. Configure webhook URL: `https://YOUR_DOMAIN/api/payments/webhook`.
4. Subscribe to `payment.captured`, set a webhook secret, and put it in `RAZORPAY_WEBHOOK_SECRET`.
5. Before production, implement the browser checkout flow and server-side order/payment reconciliation. The webhook is the only wallet-credit path in this starter.

## Important production work still required
This is a development starter, not a certified live fintech/G2C platform. Before accepting real users or money:
- Add OTP/SMS verification, password reset, rate limiting, CAPTCHA, CSRF/origin controls, audit logs, admin MFA and login throttling.
- Add admin-only protected routes and explicit role/permission checks for every privileged operation. Do not rely on hiding UI links.
- Implement retailer/distributor approval and KYC review workflows, documented policies, support contacts, privacy policy, terms, refund/cancellation policy and grievance redressal.
- Obtain provider contracts and production credentials for BBPS, recharge, PAN, AEPS, DMT and travel. Implement each provider's current API contract, encryption, callbacks, reconciliation and failure/refund handling. Never assume one generic API works for all.
- Add maker-checker approval and limits for sensitive financial operations; reconcile Razorpay captured payments with order IDs and amount, not just user-supplied metadata.
- Conduct security review, penetration testing, backups, monitoring and deployment hardening.

## Service/compliance note
AEPS, BBPS, DMT, PAN and government-facing services may require authorised business/provider onboarding, certifications, KYC/AML controls and regulatory compliance. Do not advertise a service as available until your provider confirms your account is approved and production access is active. Government certificates and approvals are issued by the competent government authority; this portal can only provide permitted facilitation/application assistance.

## Environment variables
See `.env.example`. Keep all secret keys on the server. Never put provider secrets in `NEXT_PUBLIC_*` variables or browser code.
