# 🚩 AICDA API CTF — Anonymous India Cyber Defence Academy

> **API Security Training Lab** | 10 Levels | Burpsuite + curl compatible

---

## 📁 Repository Structure

```
aicda-ctf/
├── frontend/     → Next.js 14 CTF UI  (deploy to Vercel)
└── api/          → Flask Vulnerable API (deploy to Fly.io)
```

---

## 🚀 Deployment Guide

### Step 1 — Deploy Vulnerable API to Fly.io

```bash
# Install flyctl on Kali
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Deploy from api/ directory
cd api/
flyctl launch --name aicda-api --region sin --no-deploy
flyctl deploy

# Your API will be live at: https://aicda-api.fly.dev
```

### Step 2 — Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# From frontend/ directory
cd frontend/
npm install

# Set environment variable
# Create .env.local with:
# NEXT_PUBLIC_API_URL=https://aicda-api.fly.dev

# Deploy
vercel --prod
```

---

## 🔑 Access Details

| Item              | Value                        |
|-------------------|------------------------------|
| Student Access Code | `AICDAAPICTF`              |
| Admin Dashboard   | `/admin/aicda`           |
| Admin Password    | `AICDAadmin`             |
| API Base URL      | `https://aicda-api.fly.dev`  |

---

## 🎯 The 10 CTF Levels

| # | Vulnerability       | OWASP   |
|---|---------------------|---------|
| 1 | Debug Endpoint Leak | API3+API1 |
| 2 | User Registration   | API2    |
| 3 | JWT Token Decode    | API2    |
| 4 | BOLA                | API1    |
| 5 | Mass Assignment     | API3    |
| 6 | BFLA                | API5    |
| 7 | Password Reset      | API2    |
| 8 | JWT Forgery         | API2    |
| 9 | SQL Injection       | API8    |
|10 | Rate Limit Bypass   | API4    |

---

## ⚠️ Disclaimer

This lab is **intentionally vulnerable** for educational purposes only.
Do NOT expose the API without access controls in production.

© AICDA — Anonymous India Cyber Defence Academy
