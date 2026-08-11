# 🚀 AILISTING - Automated Listing System

**AI-powered product listing automation for Etsy and beyond**

---

## Quick Start

### Windows Users
```bash
double-click start.bat
```

### macOS/Linux Users
```bash
chmod +x start.sh
./start.sh
```

---

## What is AILISTING?

AILISTING automates the entire product listing workflow:

1. **📸 Upload Product Images** - Drop photos of your products
2. **🤖 AI Analysis** - Vision LLM analyzes the product
3. **✍️ Auto-Write Listings** - Generates SEO-optimized titles & descriptions
4. **💰 Smart Pricing** - Calculates optimal pricing
5. **🏷️ Auto-Tagging** - Suggests relevant product tags
6. **🚀 One-Click Publish** - Publish directly to Etsy as draft

---

## Features

- ✅ **Magic Listing** - AI writes complete Etsy listings from photos
- ✅ **Etsy Integration** - Real OAuth2 connection to your shop
- ✅ **Batch Upload** - Process multiple products at once
- ✅ **Dashboard** - Monitor listings, sales, and inventory
- ✅ **Automation Engine** - Schedule listings for optimal times
- ✅ **Multi-Platform Support** - Ready for eBay, Amazon, Shopify

---

## System Requirements

### Minimum
- Python 3.11+
- Node.js 18+
- Yarn or npm
- 2GB RAM
- 500MB disk space

### Optional (for full features)
- MongoDB (local or cloud)
- Etsy API credentials
- Emergent LLM API key

---

## Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd AILISTING
```

### 2. Configure Environment

Create `backend/.env`:
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=ailisting
ETSY_KEYSTRING=your_etsy_key
ETSY_SHARED_SECRET=your_etsy_secret
EMERGENT_LLM_KEY=your_llm_key
CORS_ORIGINS=http://localhost:3000
```

Create `frontend/.env`:
```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

### 3. Launch Application

**Automatic (Recommended):**
- **Windows:** Double-click `start.bat`
- **macOS/Linux:** `./start.sh`

**Manual:**
```bash
# Terminal 1 - Backend
cd backend
pip install -r requirements.txt
uvicorn server:app --reload

# Terminal 2 - Frontend
cd frontend
yarn install
yarn start
```

---

## Access the Application

Once running:
- 🌐 **Frontend:** http://localhost:3000
- 🔧 **Backend:** http://localhost:8000
- 📚 **API Docs:** http://localhost:8000/docs

---

## How to Use

### 1. Connect Etsy Account
1. Go to **Integrations** page
2. Click **Connect** on Etsy card
3. Authorize OAuth flow
4. Your shop will be linked

### 2. Create Your First Listing
1. Navigate to **Magic Listing** page
2. Drop or click to upload product image(s)
3. Click **Generate Listings** (waits for AI)
4. Review the generated listings
5. Click **Push to Etsy** to publish as draft
6. Login to Etsy to review and publish

### 3. Manage Listings
- **Dashboard:** View sales, inventory, trending items
- **Products:** Manage your catalog
- **Reports:** Analytics and performance metrics

---

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8000
kill -9 <PID>
```

### MongoDB Connection Failed
```bash
# Verify MongoDB is running
mongosh

# If not running, start it:
# Windows: MongoDB should auto-start if installed via MSI
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Or use Docker:
docker run -d -p 27017:27017 mongo:latest
```

### Dependencies Installation Failed
```bash
# Backend
cd backend
pip install --upgrade setuptools wheel
pip install -r requirements.txt

# Frontend
cd frontend
rm -rf node_modules package-lock.json
yarn install
```

### CORS Errors
Update `CORS_ORIGINS` in `backend/.env` to include your frontend URL.

### API Connection Errors
Verify `REACT_APP_BACKEND_URL` in `frontend/.env` matches backend URL.

---

## Project Structure

```
AILISTING/
├── backend/                 # FastAPI backend
│   ├── server.py           # Main application
│   ├── etsy_service.py     # Etsy API integration
│   ├── magic_service.py    # AI listing generator
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
├── frontend/               # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── hooks/         # Custom React hooks
│   │   └── App.js        # Main app component
│   ├── package.json      # Dependencies
│   └── .env             # Environment variables
├── start.bat            # Windows quick start
├── start.sh            # macOS/Linux quick start
└── README.md           # This file
```

---

## API Endpoints

### Core
- `GET /api/` - Health check
- `POST/GET /api/status` - Status tracking

### Etsy Integration
- `GET /api/etsy/status` - Connection status
- `GET /api/etsy/connect` - Start OAuth flow
- `GET /api/etsy/callback` - OAuth callback
- `POST /api/etsy/disconnect` - Disconnect account
- `POST /api/etsy/publish` - Publish listing

### Magic Listing
- `POST /api/magic/generate` - Generate listing from image
- `GET /api/magic/image/{image_id}` - Retrieve stored image

---

## Development

### Running Tests
```bash
cd backend
pytest
```

### Code Quality
```bash
cd backend
black .
isort .
flake8 .
mypy .
```

### Building for Production
```bash
# Backend (no build needed - just deploy server.py)

# Frontend
cd frontend
yarn build
# Output in: frontend/build/
```

---

## Deployment

### Deploy Backend
```bash
# Using Heroku, Railway, Render, or your cloud provider
# Environment variables must be set in the cloud platform
# uvicorn server:app --host 0.0.0.0 --port $PORT
```

### Deploy Frontend
```bash
# Build locally
yarn build

# Deploy to Vercel, Netlify, or any static host
# Set REACT_APP_BACKEND_URL to production backend URL
```

---

## Environment Variables Reference

### Backend (backend/.env)
| Variable | Description | Default |
|----------|-------------|---------|
| MONGO_URL | MongoDB connection string | mongodb://localhost:27017 |
| DB_NAME | Database name | ailisting |
| ETSY_KEYSTRING | Etsy API key | - |
| ETSY_SHARED_SECRET | Etsy API secret | - |
| EMERGENT_LLM_KEY | Vision LLM API key | - |
| CORS_ORIGINS | Allowed origins | * |

### Frontend (frontend/.env)
| Variable | Description | Default |
|----------|-------------|---------|
| REACT_APP_BACKEND_URL | Backend API URL | http://localhost:8000 |

---

## License

Proprietary - All rights reserved

---

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review API docs at `http://localhost:8000/docs`
3. Check backend logs in terminal

---

## Recent Fixes (v1.0.1)

✅ Fixed Etsy Bearer token authentication  
✅ Fixed StatusCheck timestamp handling  
✅ Fixed Etsy API IndexError on empty shops  
✅ Fixed JSON parsing error handling  
✅ Added comprehensive error messages  

---

**Ready to automate your listing workflow!** 🚀
