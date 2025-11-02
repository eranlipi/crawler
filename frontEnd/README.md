# Spider Web Crawler - Frontend

## Overview
A modern React + TypeScript web application built with Vite for web crawling operations. This frontend provides an intuitive interface for logging in, selecting websites to crawl, viewing deals, and downloading deal files.

## Features

- **User Authentication**: Secure login system
- **Website Selection**: Choose between multiple crawler sources (FO1, FO2)
- **Deals Dashboard**: View and manage crawled deals
- **File Downloads**: Download deal files and documents
- **Responsive Design**: Built with Tailwind CSS for mobile-friendly UI
- **Type-Safe**: Full TypeScript support for robust development
- **Modern React**: Uses React 19 with hooks and functional components

## Prerequisites

- **Node.js** 16.x or higher (recommended: 18.x or 20.x)
- **npm** (comes with Node.js) or **yarn**

## Installation

### 1. Navigate to Frontend Directory

```bash
cd frontEnd
```

### 2. Install Dependencies

```bash
npm install
```

Or if you prefer yarn:

```bash
yarn install
```

This will install all dependencies including:
- React 19.1.1
- TypeScript 5.9.3
- Vite (Rolldown) 7.1.14
- Axios for HTTP requests
- Tailwind CSS for styling
- ESLint for code quality

### 3. Environment Configuration

Create a `.env` file in the `frontEnd` directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit the `.env` file to configure your backend API URL:

```bash
# API Base URL - Your backend FastAPI server
VITE_API_BASE_URL=http://localhost:8000/api
```

**Important**: Make sure the backend server is running on the specified URL.

## Running the Application

### Development Mode

```bash
npm run dev
```

Or with yarn:

```bash
yarn dev
```

The application will start on **`http://localhost:5173`** by default.

You should see output similar to:
```
VITE v7.1.14  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

This will:
1. Run TypeScript compiler to check types
2. Build the application for production
3. Output optimized files to the `dist/` directory

### Preview Production Build

After building, you can preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## Project Structure

```
frontEnd/
├── src/
│   ├── main.tsx                  # Application entry point
│   ├── App.tsx                   # Root component with routing
│   ├── index.css                 # Global styles and Tailwind imports
│   ├── components/
│   │   ├── LoginForm.tsx         # User login component
│   │   ├── WebsiteSelector.tsx   # Website/crawler selection
│   │   ├── DealsList.tsx         # Deals display component
│   │   ├── DealFilesModal.tsx    # File download modal
│   │   └── ErrorMessage.tsx      # Error display component
│   ├── pages/
│   │   └── CrawlerPage.tsx       # Main crawler page
│   ├── hooks/
│   │   └── useCrawler.ts         # Custom hook for crawler logic
│   ├── services/
│   │   └── api.service.ts        # API integration layer
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   └── assets/                   # Static assets
├── public/                        # Public static files
├── index.html                     # HTML entry point
├── vite.config.ts                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
├── eslint.config.js               # ESLint configuration
├── package.json                   # Dependencies and scripts
├── .env                          # Environment variables (create this)
└── README.md                     # This file
```

## Available Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build for production
- **`npm run preview`** - Preview production build locally
- **`npm run lint`** - Run ESLint to check code quality

## Technology Stack

- **React 19.1.1** - UI library
- **TypeScript 5.9.3** - Type-safe JavaScript
- **Vite (Rolldown)** - Fast build tool and dev server
- **Axios** - HTTP client for API requests
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Compiler** - Optimized React rendering (experimental)

## Connecting to Backend

Before running the frontend, ensure:

1. The backend server is running (default: `http://localhost:8000`)
2. The `.env` file is configured with the correct `VITE_API_BASE_URL`
3. CORS is properly configured in the backend to allow requests from `http://localhost:5173`

## Development Notes

- **React Compiler**: This project uses the experimental React Compiler for automatic optimization. This may impact build performance.
- **Hot Module Replacement (HMR)**: Changes to `.tsx` and `.ts` files will automatically refresh in the browser without losing state.
- **TypeScript**: All components are written in TypeScript for type safety and better developer experience.

## Troubleshooting

### Cannot connect to backend
- Verify the backend is running on `http://localhost:8000`
- Check the `VITE_API_BASE_URL` in your `.env` file
- Ensure no firewall is blocking the connection

### Port 5173 is already in use
- Vite will automatically try the next available port
- Or specify a different port: `npm run dev -- --port 3000`

### Build errors
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Ensure you're using Node.js 16.x or higher: `node --version`

## Browser Support

This application supports all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
