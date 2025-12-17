# 🎯 Quick Setup Guide

## Step-by-Step Setup for AI Loan Sales Assistant

### ⏱️ Estimated Time: 15-20 minutes

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Python 3.9+ installed (`python --version`)
- [ ] Git installed
- [ ] A code editor (VS Code recommended)
- [ ] Internet connection

---

## 🔑 Step 1: Get API Keys (10 minutes)

### 1.1 Supabase Setup

1. Go to https://supabase.com
2. Click **Start your project**
3. Sign up with GitHub or email
4. Click **New Project**
5. Fill in:
   - **Name**: `ai-loan-assistant`
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to you
6. Click **Create new project** (takes 2-3 minutes)
7. Once ready, go to **Settings** → **API**
8. Copy these values:
   - **Project URL** → This is your `SUPABASE_URL`
   - **anon public** key → This is your `SUPABASE_ANON_KEY`
   - **service_role** key → This is your `SUPABASE_SERVICE_ROLE_KEY`

### 1.2 OCR.space API Key

1. Go to https://ocr.space/ocrapi
2. Click **Register for free API key**
3. Enter your email
4. Check your email for the API key
5. Copy the API key → This is your `OCR_SPACE_API_KEY`

### 1.3 HuggingFace API Token

1. Go to https://huggingface.co
2. Click **Sign Up** (or Sign In)
3. Go to **Settings** → **Access Tokens**
4. Click **New token**
5. Name: `ai-loan-assistant`
6. Role: **Read**
7. Click **Generate**
8. Copy the token → This is your `HUGGINGFACE_API_KEY`

---

## 🗄️ Step 2: Setup Database (3 minutes)

1. In your Supabase dashboard, click **SQL Editor**
2. Click **New query**
3. Open the file `database/schema.sql` from this project
4. Copy all the SQL code
5. Paste it into the Supabase SQL Editor
6. Click **Run** (bottom right)
7. You should see "Success. No rows returned"
8. Go to **Table Editor** to verify tables are created:
   - `users`
   - `loan_applications`
   - `audit_logs`

---

## 💻 Step 3: Setup Frontend (3 minutes)

Open terminal/command prompt:

```bash
# Navigate to project
cd "g:/void/EYHackathon/New_EY(2nd round)/frontend"

# Install dependencies
npm install

# Create .env file
copy .env.example .env
```

Now edit `frontend/.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace with your actual values from Step 1.1

---

## 🐍 Step 4: Setup Backend (4 minutes)

Open a NEW terminal/command prompt:

```bash
# Navigate to backend
cd "g:/void/EYHackathon/New_EY(2nd round)/backend"

# Create virtual environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env
```

Now edit `backend/.env` file:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
OCR_SPACE_API_KEY=your_ocr_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_token_here
ENVIRONMENT=development
```

Replace with your actual values from Step 1.

---

## ▶️ Step 5: Run the Application

### Terminal 1 - Backend

```bash
cd backend
venv\Scripts\activate
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

## 🎉 Step 6: Test the Application

1. Open browser to `http://localhost:3000`
2. You should see the landing page
3. Click **Sign Up**
4. Create an account:
   - Name: Your Name
   - Email: test@example.com
   - Password: password123
5. Click **Sign Up**
6. You'll be redirected to Dashboard
7. Click **Start Application**
8. Chat with the AI assistant!

---

## ✅ Verification Checklist

- [ ] Landing page loads correctly
- [ ] Sign up creates new account
- [ ] Sign in works with credentials
- [ ] Dashboard shows welcome message
- [ ] Chat interface opens
- [ ] AI responds to messages
- [ ] File upload button is visible
- [ ] Backend logs show no errors

---

## 🐛 Common Issues & Fixes

### Issue: "Module not found" in frontend

**Fix:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: "No module named 'fastapi'" in backend

**Fix:**
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

### Issue: Supabase connection error

**Fix:**
- Check `.env` files have correct values
- Ensure no extra spaces in API keys
- Verify Supabase project is active
- Restart both servers

### Issue: CORS error in browser

**Fix:**
- Ensure backend is running on port 8000
- Check frontend is on port 3000 or 5173
- Clear browser cache

---

## 📞 Need Help?

If you encounter issues:

1. Check the main `README.md` for detailed troubleshooting
2. Verify all API keys are correct
3. Ensure both servers are running
4. Check browser console for errors
5. Check backend terminal for errors

---

## 🎯 Next Steps

Once everything is working:

1. Test the complete loan flow
2. Upload a sample document for KYC
3. Check the generated PDF sanction letter
4. Review the code structure
5. Customize for your needs

---

**Happy Coding! 🚀**
