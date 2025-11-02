# Deals Portal Backend - FastAPI

## Overview
This FastAPI backend acts as a proxy between the React frontend and the Altius Finance API. It handles authentication, session management, and deals retrieval.

## Architecture

```
React Frontend → FastAPI Backend → Altius Finance API
                      ↓
              (Session Storage)
```

## Features

- **Login Proxy**: Forwards authentication requests to Altius Finance API
- **Session Management**: Stores active user sessions with tokens
- **Deals Retrieval**: Fetches deals using stored authentication tokens
- **CORS Support**: Configured for frontend communication
- **Error Handling**: Comprehensive error responses

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## Installation

### 1. Create Virtual Environment

```bash
# Navigate to backend directory
cd backEnd

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install fastapi uvicorn httpx pydantic email-validator
```

Or create a `requirements.txt` file:
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
httpx==0.25.0
pydantic[email]==2.5.0
```

Then install:
```bash
pip install -r requirements.txt
```

## Running the Server

### Development Mode

```bash
# Make sure virtual environment is activated
# From the backEnd directory
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The server will start on `http://localhost:8000`

### Production Mode

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
backEnd/
├── app/
│   ├── routers/
│   │   └── auth.py           # Authentication endpoints
│   ├── services/
│   │   ├── base_crawler.py   # Abstract base class for crawlers
│   │   ├── fo1_crawler.py    # FO1 API integration
│   │   └── fo2_crawler.py    # FO2 API integration
│   ├── models/
│   │   └── schemas.py        # Pydantic models
│   ├── core/
│   │   ├── config.py         # Configuration
│   │   └── http_client.py    # HTTP client utilities
│   ├── utils/
│   │   └── exceptions.py     # Custom exceptions
│   └── main.py               # FastAPI application
├── venv/                     # Virtual environment
└── README.md                 # This file
```

## API Endpoints

### 1. Root Endpoint
```http
GET /
```
Returns API status message.

### 2. Login
```http
POST /api/login
Content-Type: application/json

{
  "website": "fo1",
  "email": "fo1_test_user@whatever.com",
  "password": "Test123!"
}
```

**Response:**
```json
{
  "success": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...",
    "broadcast_token": "...",
    "user": {
      "id": 193,
      "email": "fo1_test_user@whatever.com",
      "first_name": "Test",
      "last_name": "User",
      "full_name": "Test User",
      "role": {
        "id": 5,
        "name": "viewer",
        "presentation_name": "Viewer"
      },
      "account": {
        "id": 2,
        "name": "FO1",
        "domain": "fo1.altius.finance"
      }
    },
    "redirect_to": "fo1.altius.finance"
  }
}
```

### 3. Get Deals
```http
POST /api/deals-list
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": 5644,
      "title": "Shared deal for home assignment",
      "created_at": "2023-11-07T12:00:40.000000Z",
      "firm": "",
      "asset_class": "General",
      "deal_status": "New",
      "currency": "USD",
      "user_id": 133,
      "deal_capital_seeker_email": ""
    }
  ],
  "message": "Successful"
}
```

### 4. Logout
```http
POST /api/logout
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

## How It Works

### Login Flow
1. Frontend sends login credentials with website selection
2. Backend selects appropriate crawler (FO1 or FO2)
3. Crawler makes request to external Altius Finance API
4. Backend receives response with token and user data
5. Token is stored in `active_sessions` dictionary
6. Full response is returned to frontend

### Deals Retrieval Flow
1. Frontend sends request with Authorization header
2. Backend extracts token from header
3. Backend looks up session to determine which API to use
4. Crawler makes request to external API with token
5. Deals data is returned to frontend

### Session Management
- Sessions are stored in-memory (dictionary)
- In production, use Redis or similar for scalability
- Sessions are created on login
- Sessions are deleted on logout
- Token serves as session key

## External API Integration

### FO1 Crawler
- Base URL: `https://fo1.api.altius.finance`
- Login endpoint: `/api/v0.0.2/login`
- Deals endpoint: `/api/v0.0.2/deals-list`
- Authentication: Cookie-based with `Authorization2` header

### FO2 Crawler
- Base URL: `https://fo2.api.altius.finance`
- Same endpoints as FO1
- Same authentication mechanism

## Configuration

### CORS Settings
Edit `app/main.py` to modify CORS settings:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Error Handling

The API returns standard HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid website selection)
- `401`: Unauthorized (missing or invalid token)
- `500`: Internal Server Error (API communication issues)

Example error response:
```json
{
  "detail": "Login failed: Invalid credentials"
}
```

## Development

### Adding a New Website

1. Create new crawler in `app/services/`:
```python
from .base_crawler import BaseCrawler

class FO3Crawler(BaseCrawler):
    def __init__(self):
        super().__init__("https://fo3.api.altius.finance")

    async def login(self, email: str, password: str):
        # Implementation
        pass

    async def get_deals(self, token: str):
        # Implementation
        pass
```

2. Register crawler in `app/routers/auth.py`:
```python
crawlers = {
    "fo1": FO1Crawler(),
    "fo2": FO2Crawler(),
    "fo3": FO3Crawler(),  # Add here
}
```

## Testing

### Manual Testing with cURL

**Login:**
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "website": "fo1",
    "email": "fo1_test_user@whatever.com",
    "password": "Test123!"
  }'
```

**Get Deals:**
```bash
curl -X POST http://localhost:8000/api/deals-list \
  -H "Authorization: Bearer <your-token-here>"
```

### Testing with Python

```python
import httpx

# Login
response = httpx.post(
    "http://localhost:8000/api/login",
    json={
        "website": "fo1",
        "email": "fo1_test_user@whatever.com",
        "password": "Test123!"
    }
)
data = response.json()
token = data["success"]["token"]

# Get Deals
deals_response = httpx.post(
    "http://localhost:8000/api/deals-list",
    headers={"Authorization": f"Bearer {token}"}
)
print(deals_response.json())
```

## Production Deployment

### Recommendations

1. **Use Redis for session storage**
   ```python
   import redis
   redis_client = redis.Redis(host='localhost', port=6379, db=0)
   ```

2. **Add environment variables**
   ```python
   from pydantic_settings import BaseSettings

   class Settings(BaseSettings):
       fo1_api_url: str
       fo2_api_url: str
       redis_url: str
   ```

3. **Add logging**
   ```python
   import logging
   logging.basicConfig(level=logging.INFO)
   ```

4. **Add rate limiting**
   ```python
   from slowapi import Limiter
   limiter = Limiter(key_func=get_remote_address)
   ```

5. **Use HTTPS**
6. **Add authentication middleware**
7. **Implement token refresh mechanism**

## Troubleshooting

### Server won't start
- Check if port 8000 is already in use
- Verify virtual environment is activated
- Check all dependencies are installed

### CORS errors
- Verify frontend URL is in `allow_origins`
- Check frontend is making requests to correct URL

### Connection errors to external API
- Check network connectivity
- Verify external API URLs are correct
- Check firewall settings

## Monitoring

### Check server health
```bash
curl http://localhost:8000/
```

### View logs
Enable debug logging in `main.py`:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Next Steps

- [ ] Implement Redis session storage
- [ ] Add rate limiting
- [ ] Add comprehensive logging
- [ ] Implement token refresh
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Set up CI/CD
- [ ] Add API versioning
- [ ] Implement webhook support
- [ ] Add admin dashboard

## License

[Your License Here]

## Support

For issues or questions, contact [Your Contact Info]
