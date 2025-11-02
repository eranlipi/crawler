# Deals Portal - Setup Guide

## Overview
This is a React frontend application that integrates with the Altius Finance API through a FastAPI backend. The application allows users to login and view a scrollable list of deals.

## Architecture

```
Frontend (React + Vite)
    ↓
Backend (FastAPI)
    ↓
External API (Altius Finance)
```

### Flow:
1. User logs in through the frontend
2. Frontend sends credentials to FastAPI backend (`/api/login`)
3. Backend proxies the request to Altius Finance API
4. Backend receives token and user data, returns to frontend
5. Frontend automatically requests deals list (`/api/deals-list`)
6. Backend uses the stored token to fetch deals from Altius Finance API
7. Deals are displayed in a scrollable grid

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Running FastAPI backend at `http://localhost:8000`

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory (already created for you):

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

This points to your FastAPI backend. Adjust the URL if your backend runs on a different port.

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:5173` (Vite default port).

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Features

### 1. Login Screen
- Select website (FO1 or FO2)
- Enter email and password
- Auto-filled with test credentials for quick testing
- Beautiful gradient background with centered login card

### 2. Deals Dashboard
- **Header**: Displays user info (name, role, company) with Refresh and Logout buttons
- **Deals Count**: Shows total number of deals
- **Scrollable Grid**:
  - Responsive card layout
  - Each card shows: title, status, asset class, currency, firm, creation date
  - Hover effects for better UX
  - Color-coded status badges
- **Loading States**: Spinner animation while fetching data
- **Empty States**: Helpful message when no deals found

### 3. UX Enhancements
- Smooth animations and transitions
- Custom scrollbar styling
- Responsive design (adapts to different screen sizes)
- Error handling with dismissible error messages
- Loading indicators for all async operations

## Project Structure

```
frontEnd/
├── src/
│   ├── components/
│   │   ├── DealsList.tsx      # Scrollable deals grid
│   │   ├── LoginForm.tsx      # Login form component
│   │   ├── WebsiteSelector.tsx # Website dropdown
│   │   └── ErrorMessage.tsx   # Error display component
│   ├── hooks/
│   │   └── useCrawler.ts      # Authentication & data fetching logic
│   ├── pages/
│   │   └── CrawlerPage.tsx    # Main page component
│   ├── services/
│   │   └── api.service.ts     # Axios API client
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   ├── App.tsx                # Root component
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
├── .env                       # Environment variables
├── package.json               # Dependencies
├── vite.config.ts            # Vite configuration
└── tsconfig.json             # TypeScript configuration
```

## API Integration

### Endpoints Used

#### 1. Login
```typescript
POST /api/login
Body: {
  website: "fo1",
  email: "user@example.com",
  password: "password"
}
Response: {
  success: {
    token: "...",
    user: {...},
    ...
  }
}
```

#### 2. Get Deals
```typescript
POST /api/deals-list
Headers: {
  Authorization: "Bearer <token>"
}
Response: {
  data: [...],
  message: "Successful"
}
```

## Customization

### Changing Colors

Edit `src/index.css`:
- Login background gradient: Line 9 (`background: linear-gradient(...)`)
- Button colors: Line 84
- Card hover effects: Line 287-291

### Adding New Deal Fields

1. Update TypeScript interface in `src/types/index.ts`
2. Update display in `src/components/DealsList.tsx`

### Modifying API Base URL

Update `.env` file:
```env
VITE_API_BASE_URL=https://your-backend-url/api
```

## Troubleshooting

### CORS Issues
If you see CORS errors in the browser console:
- Ensure backend has CORS middleware configured
- Check that `allow_origins` includes your frontend URL

### API Connection Failed
- Verify backend is running on the correct port
- Check `.env` file has correct `VITE_API_BASE_URL`
- Verify network connectivity

### Token Issues
- Tokens are stored in the API service instance
- Logout clears the token
- Token is automatically included in subsequent requests

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Testing

Test credentials are pre-filled in the login form:
- **FO1**: fo1_test_user@whatever.com / Test123!
- **FO2**: fo2_test_user@whatever.com / Test223!

## Best Practices

1. **Error Handling**: All API calls are wrapped in try-catch blocks
2. **Loading States**: Users see feedback during async operations
3. **Responsive Design**: Works on desktop, tablet, and mobile
4. **Type Safety**: Full TypeScript coverage
5. **Code Organization**: Clear separation of concerns (components, hooks, services)

## Next Steps

- Add pagination for large deal lists
- Implement deal search and filtering
- Add deal detail view
- Implement real-time updates with WebSockets
- Add user preferences storage (localStorage)
- Implement token refresh mechanism
- Add unit tests with Jest and React Testing Library

## Support

For issues or questions, refer to:
- Main documentation: `REACT_INTRODUCTIONS.md`
- Backend setup: Check backend README
