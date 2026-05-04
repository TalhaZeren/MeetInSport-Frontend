# MeetInSport Client — Complete Frontend Context Prompt

> **Purpose:** Copy-paste this entire document into a new LLM conversation to continue developing the MeetInSport React frontend with full context.

---

## 1. Project Overview

**meetinsport-client** is the frontend application for the MeetInSport coaching marketplace. It allows students to browse and book professional coaches, and coaches to manage their packages and schedules.

**Current Status:** The project is freshly initialized with foundational configurations. Basic routing is set up, authentication state management is working (via Zustand + localStorage), and `axios` is configured to communicate with the .NET backend API. Login and Register feature components are scaffolded.

**Tech Stack:**
- React 19
- TypeScript
- Vite (bundler & dev server)
- Tailwind CSS 3.4 (styling)
- React Router v7 (`react-router-dom`)
- Zustand 5.0 (global state management)
- React Query v5 (`@tanstack/react-query` - data fetching & caching)
- React Hook Form 7.74 + Zod 4.4 (form validation)
- Axios (HTTP client)
- Lucide React (icons)

---

## 2. Architecture & Folder Structure

The project follows a feature-based folder structure inside `src/`.

```text
meetinsport-client/
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── src/
    ├── api/              # Axios instance and API service calls
    │   ├── axiosClient.ts
    │   └── services/     # Feature-specific services (e.g., authService.ts)
    ├── assets/           # Static files (images, svgs, videos)
    ├── components/       # Shared UI components (Layout, ProtectedRoute, Buttons, etc.)
    ├── constants/        # Global constants (routes, config variables)
    ├── features/         # Feature modules (auth, public, dashboard, coaches)
    │   ├── auth/         # Login, Register, authStore
    │   └── public/       # Home page
    ├── hooks/            # Custom reusable React hooks
    ├── types/            # TypeScript interfaces and type definitions
    └── utils/            # Helper functions (formatters, validators)
```

---

## 3. Core Configurations

### 3.1 Routing (`App.tsx`)
Routing is currently configured using the standard `<BrowserRouter>` and `<Routes>` setup (not object-based router yet).
- **Public Routes:** `/` (Home), `/login`, `/register`, `/coaches`
- **Protected Routes:** `/dashboard` (Wrapped in `<ProtectedRoute>`)
- **Layout:** All routes are wrapped in a shared `<Layout>` component for consistent navigation/footers.

### 3.2 State Management (`authStore.ts`)
Zustand is used for global auth state management, synchronized with `localStorage` for persistence.
**State:** `token`, `userId`, `name`, `role`, `isAuthenticated`
**Actions:**
- `setAuth(token, userId, name, role)`: Saves to Zustand state and `localStorage`.
- `logout()`: Clears Zustand state and `localStorage`.

### 3.3 API Client (`axiosClient.ts`)
Configured to point to the .NET backend at `http://localhost:8080`.
- Includes a request interceptor that automatically attaches the `Bearer {token}` from `localStorage` if it exists.

---

## 4. Features & Components

### 4.1 Auth Feature (`src/features/auth`)
- **`authService.ts`**: Contains `login` and `register` API calls.
- **`Login.tsx`**: Uses React Hook Form + Zod for validation. Calls `authService.login()`, updates `authStore` on success, and redirects.
- **`Register.tsx`**: Uses React Hook Form + Zod. Calls `authService.register()`, redirects to login on success. Includes a field for `sportId` when registering as a coach.

### 4.2 Shared Components (`src/components`)
- **`Layout.tsx`**: Top-level container providing the Navbar, main content outlet, and footer.
- **`ProtectedRoute.tsx`**: Checks `isAuthenticated` from `useAuthStore`. If false, redirects to `/login`.

---

## 5. Next Steps & Development Roadmap

1. **Setup React Query:** Wrap the application in `QueryClientProvider` in `main.tsx` and start using `useQuery` and `useMutation` for API interactions instead of manual `useEffect` fetches.
2. **Implement UI Library:** Start building out reusable UI components (Buttons, Inputs, Cards, Modals) using Tailwind CSS and potentially headless UI libraries like Radix UI or HeadlessUI.
3. **Coaches Directory (`/coaches`):** Build the public-facing directory using `GET /api/v1/coaches` to list and filter coaches.
4. **Dashboard Features:** Build out role-aware dashboards (Student vs Coach) showing reservations and packages.
5. **Coach Profile Management:** Create forms for coaches to update their profile (`PUT /api/v1/coaches/profile`) and manage lesson packages.

---

## 6. Scripts & Commands

```bash
npm run dev      # Start Vite dev server on localhost:5173
npm run build    # Build for production using TypeScript and Vite
npm run lint     # Run ESLint
```

---

*Last updated: 2026-05-04*
