Site Crawler - Full Stack Assignment
A web application that allows users to log in to Altius Finance websites and view available deals.
Tech Stack
Backend: Python, FastAPI, httpx
Frontend: React, Vite, Axios
Prerequisites

Python 3.8+
Node.js 16+

Installation
Backend
bashcd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
requirements.txt:
fastapi==0.104.1
uvicorn[standard]==0.24.0
httpx==0.25.1
python-multipart==0.0.6
Frontend
bashcd frontend
npm install
Running the Application
Start Backend
bashcd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn main:app --reload --port 8000
Start Frontend
bashcd frontend
npm run dev
Access

Frontend: http://localhost:5173
Backend API: http://localhost:8000
API Docs: http://localhost:8000/docs

Usage

Select website (FO1 or FO2)
Enter credentials:

FO1: fo1_test_user@whatever.com / Test123!
FO2: fo2_test_user@whatever.com / Test223!


Click Login
View token and available deals

API
POST /login
json{
  "website": "fo1",
  "username": "fo1_test_user@whatever.com",
  "password": "Test123!"
}
Response:
json{
  "success": true,
  "token": "...",
  "deals": [...],
  "website": "fo1.altius.finance"
}
