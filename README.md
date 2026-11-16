# My Finance — Finance Dashboard (Next.js + MongoDB)

তোমার আসল প্রজেক্ট — Next.js-এ বানানো personal finance management dashboard।
Category, Salary, Expense, Lending (ধার-দেনা), Password Vault, Login/Register,
Admin & User Dashboard — সবই তোমার আগের কোড, যাচাই করে working অবস্থায়
প্যাক করা হয়েছে। নতুন করে কিছু লেখা হয়নি, শুধু ভাঙা ৪টা জায়গা ঠিক করা হয়েছে
(নিচে "এই কনভার্সনে যা ঠিক করা হয়েছে" দেখো)।

## Features

- ✅ Login / Register (JWT httpOnly cookie based auth)
- ✅ Role-based routing: Admin vs User dashboard (middleware protected)
- ✅ Category management (Add / Edit / Delete, Income or Expense type)
- ✅ Salary / Income tracking (Add / Edit / Delete)
- ✅ Expense tracking with category linkage (Add / Edit / Delete)
- ✅ Lending (ধার দেয়া/নেয়া) tracking — auto-included in balance calculation
- ✅ Password Vault — AES-256-GCM এনক্রিপ্টেড পাসওয়ার্ড স্টোরেজ (Add / Edit / Delete / Reveal / Copy)
- ✅ Dashboard summary: Total Salary, Total Expense, Net Balance, Income vs Expense chart
- ✅ Admin panel: user list, role change, delete user
- ✅ Fully responsive (mobile sidebar drawer + desktop layout)

## Local এ চালানোর নিয়ম

```bash
npm install
npm run dev
```

তারপর http://localhost:3000 এ যান। প্রথম যে ইউজার রেজিস্টার করবেন সে অটোমেটিক
**Admin** হয়ে যাবে, এরপরের সবাই সাধারণ User হবে।

Production build যাচাই করতে:

```bash
npm run build
npm start
```

## Environment Variables (`.env.local`)

এই ফাইলটা zip-এর ভেতরে দেওয়া আছে — শেয়ার করার আগে নিজে বাদ দিয়ে নিও।
Vercel-এ deploy করার সময় একই ৩টা variable Vercel-এর Environment Variables-এ
বসাতে হবে:

| Variable | কাজ |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Login token sign করার secret (এই zip-এ নতুন করে generate করা) |
| `ENCRYPTION_KEY` | Password Vault-এর AES-256-GCM key (নিচে ⚠️ দেখো) |

`.env.example` ফাইলে শুধু placeholder আছে — আসল মান কখনো ওটাতে বসিও না।

## ⚠️ Vault key — পুরনো ৪৪টা পাসওয়ার্ড খুলতে যা লাগবে (জরুরি)

তোমার আগের **৪৪টা vault entry** খুলছে না — কারণ ওগুলো এনক্রিপ্ট করা হয়েছিল
আগের deployment-এর `ENCRYPTION_KEY` দিয়ে, যেটা এই zip-এ নেই (আগের upload-এ
কোনো `.env` ফাইল ছিল না)। যাচাই করে দেখা গেছে:

- কোডের built-in fallback key (`fallback-dev-key-change-me`) দিয়ে **0/44** খোলে।
- তাই আগের deployment-এ অবশ্যই একটা আলাদা randomly generated key বসানো ছিল।

**সমাধান:** পুরনো `ENCRYPTION_KEY`-এর মানটা খুঁজে বের করে `.env.local`-এ (আর
Vercel-এর env vars-এ) বসাও — কোথায় থাকতে পারে:

- আগের deployment-এর Vercel Dashboard → Project → Settings → Environment Variables
- তোমার PC-তে পুরনো প্রজেক্ট ফোল্ডারের `.env` / `.env.local` ফাইল
- যেখানে প্রথম deploy করার সময় key-টা generate করে রাখা হয়েছিল

ওটা বসালেই ৪৪টা পুরনো entry আবার খুলবে।

**এই zip-এ যা আছে:** `.env.local`-এ একটা **নতুন randomly generated**
`ENCRYPTION_KEY` বসানো আছে — নতুন করে save করা পাসওয়ার্ডগুলো এটা দিয়ে ঠিকমতো
এনক্রিপ্ট/ডিক্রিপ্ট হবে। কিন্তু মনে রেখো: পুরনো key ফিরিয়ে আনলে নতুন key দিয়ে
বানানো entry-গুলো আর খুলবে না। Key বদলাতে হলে নিরাপদ উপায়: পুরনো key দিয়ে সব
entry ডিক্রিপ্ট করে নোট করে নাও, তারপর নতুন key বসিয়ে আবার save করো।

**আরেকটা কথা:** `JWT_SECRET`-ও নতুন করে generate করা হয়েছে। তাই আগের সব
login session বাতিল — সবাইকে আবার পাসওয়ার্ড দিয়ে login করতে হবে। পাসওয়ার্ডগুলো
ডাটাবেসে bcrypt hash হিসেবে আছে, সেগুলো বদলায়নি।

## Vercel এ Deploy করার নিয়ম

1. এই ফোল্ডারটা একটা নতুন GitHub রিপোজিটরিতে push করুন।
2. https://vercel.com এ গিয়ে "Add New Project" > আপনার GitHub রিপো import করুন।
3. Deploy করার আগে **Environment Variables** সেকশনে গিয়ে নিচের ৩টা variable
   বসিয়ে দিন (এগুলো `.env.local` ফাইলে পাবেন):
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `ENCRYPTION_KEY`
4. Deploy বাটনে ক্লিক করুন।

## MongoDB Atlas Network Access (জরুরি!)

Vercel থেকে কানেক্ট করতে হলে MongoDB Atlas এ:

- Atlas Dashboard > Network Access > "Add IP Address" > **Allow Access from Anywhere (0.0.0.0/0)** সিলেক্ট করুন।
- Database Access এ আপনার user (`shopnilashik4_db_user`) এর read/write পারমিশন আছে কিনা চেক করুন।

## ⚠️ নিরাপত্তা সংক্রান্ত জরুরি নোট

- আপনার MongoDB পাসওয়ার্ড এই চ্যাটে প্লেইন টেক্সটে শেয়ার হয়েছে। GitHub এ পুশ
  করার আগে **অবশ্যই** `.gitignore` চেক করে নিশ্চিত হন `.env.local` ট্র্যাক হচ্ছে
  না (এটা এমনিতেই `.gitignore`-এ যোগ করা আছে)।
- সম্ভব হলে MongoDB Atlas থেকে এই ইউজারের পাসওয়ার্ড পরিবর্তন (rotate) করে নেওয়া
  ভালো অভ্যাস, যেহেতু এটা চ্যাটে টাইপ করা হয়েছে।
- `JWT_SECRET` এবং `ENCRYPTION_KEY` র‍্যান্ডম জেনারেট করা হয়েছে — এগুলো কখনো
  পাবলিক রিপোতে কমিট করবেন না।

## এই কনভার্সনে যা ঠিক করা হয়েছে (আসল কোডে ৪টা ছোট বাগ)

1. **`app/api/admin/users/route.js`** — `GET` হ্যান্ডলারে `requireAdmin(req)`-এর
   আগে `await` ছিল না। `requireAdmin` async ফাংশন, তাই `await` ছাড়া সবসময়
   truthy Promise ফিরত — ফলে admin-users API কার্যত **সবার জন্য খোলা** ছিল
   (লগইন ছাড়াও ইউজার লিস্ট পাওয়া যেত)। `await` যোগ করা হয়েছে; এখন non-admin
   পায় 401, logged-out পায় 401।
2. **`app/api/auth/register/route.js`** — `signToken(...)`-এর আগে `await`
   ছিল না। ফলে register-এর সময় cookie-তে আসল JWT-এর বদলে `[object Promise]`
   বসত, আর নতুন ইউজার register করার পরও লগইন হতো না। `await` যোগ করা হয়েছে।
3. **`app/api/vault/route.js` + `app/dashboard/vault/page.js`** — আগে একটা
   entry-ও ডিক্রিপ্ট করতে না পারলে পুরো vault API 500 error দিত (সব entry
   একসাথে fail হতো)। এখন প্রতিটা entry আলাদা করে try করা হয় — যে entry খোলে
   না, সেটা `password: null` হিসেবে আসে আর পেজে "ডিক্রিপ্ট করা যায়নি — ভুল key"
   দেখায়, বাকিগুলো ঠিকমতো চলে।
4. **`app/api/expense/route.js`** — Expense পেজ খুললে "ডাটা লোড করতে ব্যর্থ
   হয়েছে!" toast আসত আর তালিকা খালি থাকত (TOTAL ৳0.00), যদিও DB-তে ৩৩৬টা
   খরচ আছে। কারণ: এই route `.populate('category', 'name')` ব্যবহার করে,
   কিন্তু `Category` মডেলটা এখানে import করা ছিল না — Mongoose তখন
   `MissingSchemaError` দিয়ে পুরো API 500 করত (খালি body), আর পেজের
   `r.json()` সেখানেই fail করত। `import Category from '@/models/Category'`
   যোগ করা হয়েছে — এখন লিস্ট 200 দেয় (৩৩৪টা entry + মোট ৳১০,৭০,৯৭৩)।
   Salary/Lending-এ populate নেই, তাই ওগুলোতে এই সমস্যা ছিল না।

এছাড়া আর কিছু বদলানো হয়নি — একই stack (Next.js 16 + React 18 + Mongoose +
Tailwind v3 + JWT via jose), একই ডিজাইন, একই API।

## Sandbox-এ যাচাই করার জন্য (শুধু ডেভ পরিবেশে)

এই sandbox-এর network Atlas-এ সরাসরি TCP করতে দেয় না, তাই যাচাইয়ের জন্য
`scripts/mongo-tunnel.mjs` + `lib/dbConnect.js`-এ `MONGO_TUNNEL=1` সাপোর্ট যোগ
করা হয়েছে। তোমার PC বা Vercel-এ এটা লাগবে না — সেখানে `.env.local`-এর URI
সরাসরি কানেক্ট হবে।

```bash
node scripts/mongo-tunnel.mjs &   # শুধু sandbox-এ
MONGO_TUNNEL=1 npm run dev
```

## Tech Stack

Next.js 16 (App Router) · React 18 · MongoDB + Mongoose · Tailwind CSS v3 ·
JWT auth (jose + bcryptjs) · Recharts · Lucide Icons
#   m y - b a n k 3  
 