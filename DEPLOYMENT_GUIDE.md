# 🚀 LoanFlow AI Deployment Guide

## 📋 Issue: 404 NOT_FOUND Error

The 404 error you're seeing is caused by **client-side routing** not being properly configured on your deployment platform. React Router uses browser history API, but when you refresh or directly access a route like `/dashboard`, the server looks for that file and returns 404.

---

## ✅ Solution: Configure Redirects

I've created configuration files for popular deployment platforms:

### 1. **Vercel** (Recommended)
- File: `frontend/vercel.json`
- Redirects all routes to `index.html`

### 2. **Netlify**
- File: `frontend/netlify.toml`
- File: `frontend/public/_redirects`
- Both handle client-side routing

### 3. **Other Platforms**
See platform-specific instructions below.

---

## 🎯 Deployment Instructions by Platform

### **Vercel (Easiest)**

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy Frontend**:
   ```bash
   cd frontend
   vercel
   ```

3. **Follow prompts**:
   - Link to existing project or create new
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

4. **Environment Variables** (in Vercel dashboard):
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

---

### **Netlify**

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy**:
   ```bash
   cd frontend
   netlify deploy --prod
   ```

3. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Environment Variables** (in Netlify dashboard):
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

---

### **GitHub Pages**

1. **Add to `vite.config.js`**:
   ```javascript
   export default defineConfig({
     base: '/your-repo-name/',
     // ... rest of config
   })
   ```

2. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Add to `package.json`**:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

---

### **AWS Amplify**

1. **Create `amplify.yml`** in frontend root:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

2. **Rewrites** (in Amplify console):
   - Source: `</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|ttf|map|json)$)([^.]+$)/>`
   - Target: `/index.html`
   - Type: `200 (Rewrite)`

---

## 🔧 Backend Deployment

### **Railway / Render**

1. **Create `Procfile`** in backend root:
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

2. **Environment Variables**:
   ```
   SUPABASE_URL=your_url
   SUPABASE_SERVICE_ROLE_KEY=your_key
   EDENAI_API_KEY=your_key
   GEMINI_API_KEY=your_key
   ```

3. **Deploy**:
   - Connect GitHub repo
   - Set root directory to `backend`
   - Deploy

---

## 🌐 CORS Configuration

After deploying backend, update `main.py` CORS origins:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://your-frontend-domain.vercel.app",  # Add your deployed URL
        "https://your-frontend-domain.netlify.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📝 Environment Variables Checklist

### Frontend (.env)
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Backend (.env)
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
EDENAI_API_KEY=your_edenai_key
GEMINI_API_KEY=your_gemini_key
```

---

## 🐛 Troubleshooting

### Still Getting 404?

1. **Check build output**:
   ```bash
   cd frontend
   npm run build
   ls dist  # Should see index.html
   ```

2. **Verify redirect config is in place**:
   - Vercel: `vercel.json` exists
   - Netlify: `public/_redirects` exists

3. **Clear deployment cache**:
   - Vercel: Redeploy with "Clear cache"
   - Netlify: Settings → Build & deploy → Clear cache

4. **Check browser console** for errors

### API Connection Issues?

1. **Update API URL** in frontend code:
   - Find: `http://localhost:8000`
   - Replace with: `https://your-backend-url.com`

2. **Check CORS** settings in backend

3. **Verify environment variables** are set in deployment platform

---

## ✅ Quick Fix for Current Error

**If deployed on Vercel/Netlify:**

1. Make sure `vercel.json` or `netlify.toml` is committed
2. Redeploy:
   ```bash
   git add .
   git commit -m "Add deployment config"
   git push
   ```

3. Platform will auto-redeploy

**If using other platform:**
- Add the appropriate redirect configuration from above
- Redeploy

---

## 🎉 Success Checklist

- [ ] Deployment config file added (`vercel.json` or `netlify.toml`)
- [ ] Frontend builds successfully (`npm run build`)
- [ ] Environment variables set in deployment platform
- [ ] Backend deployed and accessible
- [ ] CORS configured with frontend URL
- [ ] Can access `/` route
- [ ] Can access `/dashboard` route (after login)
- [ ] No 404 errors on page refresh

---

**Need Help?** Check the deployment platform's documentation or let me know which platform you're using!
