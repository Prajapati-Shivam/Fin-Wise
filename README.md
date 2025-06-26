# 💸 FinWise - Expense Tracker

This is a modern expense tracking web application built with **Next.js**. It allows users to track daily expenses, analyze spending patterns through interactive charts, and receive AI-powered financial advice based on their spending habits.

## 🚀 Features

- ✅ **Add, View & Manage Expenses**
- 📊 **Interactive Data Visualizations**:
  - Bar Chart (Spending by Category)
  - Line Chart (Spending Over Time)
  - Pie Chart (Category-wise Expense Distribution)
- 🤖 **AI-Powered Financial Advice**
  - Advice generated using large language models based on your financial behavior
- 🔒 **Secure Authentication** via [Clerk](https://clerk.dev)
- ☁️ **Cloud Hosted PostgreSQL** using [NeonDB](https://neon.tech)
- 📅 **Daily Spend Insights & Metrics**


## 📦 Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS, Shadcn UI
- **Charts**: Recharts
- **State Management**: Zustand
- **AI API**: Gemini API
- **Auth**: Clerk
- **Database**: NeonDB (PostgreSQL)
- **Emailing Reports (Optional)**: Resend

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Prajapati-Shivam/Fin-Wise.git
cd Fin-Wise
````

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file and add:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
NEXT_PUBLIC_DATABASE_URL=your_neon_postgres_url
NEXT_PUBLIC_GEMINI_API_KEY=your_aimlapi_key
RESEND_API_KEY=your_resend_api_key
```

### 4. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🚀
