# Getting Started Guide

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser at http://localhost:5173
```

## What's Included

This template provides a **production-ready React application** with:

### Core Features
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for responsive styling
- ✅ React Router for navigation
- ✅ 3-layer architecture (Presentation, Business Logic, Data Access)

### State Management
- ✅ React Query (TanStack Query) for server state
- ✅ Zustand for client state (UI)
- ✅ Automatic caching and refetching

### API Integration
- ✅ Axios client with interceptors
- ✅ BFF-ready configuration
- ✅ Authentication token handling
- ✅ Error handling

### Example Components
- ✅ UI Components (Button, Input, Card, LoadingSpinner)
- ✅ Layout with responsive sidebar
- ✅ Login form with validation
- ✅ Dashboard page
- ✅ Error boundaries

## File Structure

```
react-template/
├── src/
│   ├── components/          # Presentation Layer
│   │   ├── ui/             # Reusable components
│   │   ├── features/       # Feature components
│   │   ├── layouts/        # Layouts
│   │   └── ErrorBoundary.tsx
│   │
│   ├── hooks/              # Business Logic Layer
│   │   ├── queries/        # React Query hooks
│   │   └── use-cases/      # Business logic hooks
│   │
│   ├── services/           # Data Access Layer
│   │   ├── api/           # API clients
│   │   ├── storage/       # Local storage
│   │   └── domain/        # Domain services
│   │
│   ├── stores/             # Client state
│   ├── pages/              # Page components
│   ├── types/              # TypeScript types
│   ├── config/             # Configuration
│   ├── utils/              # Utilities
│   ├── App.tsx
│   └── main.tsx
│
├── README.md               # Main documentation
├── ARCHITECTURE.md         # Architecture deep dive
└── .env.example           # Environment template
```

## Your First Steps

### 1. Configure Your BFF

Create `.env` file:
```bash
cp .env.example .env
```

Update with your BFF URL:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

### 2. Update API Types

Edit `src/types/api.types.ts` to match your BFF's response format:

```typescript
// Adjust to match your BFF
export interface ApiResponse<T> {
  data: T;
  message?: string;
  // Add your fields here
}
```

### 3. Add Your First Feature

Follow the pattern in `README.md` "Adding a New Feature" section:

1. Define types (`src/types/`)
2. Create API client (`src/services/api/`)
3. Create React Query hooks (`src/hooks/queries/`)
4. Create components (`src/components/features/`)
5. Add page and route (`src/pages/`, `src/App.tsx`)

### 4. Customize UI

- **Colors**: Edit `tailwind.config.js`
- **Layout**: Edit `src/components/layouts/MainLayout.tsx`
- **Theme**: Update `src/stores/ui.store.ts`

## Common Tasks

### Add a New Page

```typescript
// 1. Create page
// src/pages/MyPage.tsx
export const MyPage = () => {
  return <div>My Page</div>;
};

// 2. Add route in App.tsx
<Route
  path="/my-page"
  element={
    <MainLayout>
      <MyPage />
    </MainLayout>
  }
/>
```

### Add a New API Endpoint

```typescript
// src/services/api/my-domain.api.ts
import apiClient from './api-client';

export const myDomainApi = {
  getData: async () => {
    const response = await apiClient.get('/my-endpoint');
    return response.data.data;
  },
};

// src/hooks/queries/useMyDomain.ts
export const useMyData = () => {
  return useQuery({
    queryKey: ['my-data'],
    queryFn: myDomainApi.getData,
  });
};

// Use in component
const MyComponent = () => {
  const { data, isLoading } = useMyData();
  // ...
};
```

### Add Client State

```typescript
// src/stores/my-feature.store.ts
import { create } from 'zustand';

interface MyState {
  count: number;
  increment: () => void;
}

export const useMyStore = create<MyState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// Use in component
const MyComponent = () => {
  const { count, increment } = useMyStore();
  // ...
};
```

## Architecture Decision Guide

**Use React Query when:**
- Data comes from your BFF
- You need caching and refetching
- You want loading/error states

**Use Zustand when:**
- UI state (theme, modals, sidebar)
- Client-side only data
- No backend persistence needed

**Use Custom Hook when:**
- Complex business logic
- Orchestrating multiple API calls
- Reusable logic across components

**Use Domain Service when:**
- Pure functions (validation, calculations)
- No React dependencies
- Reusable across the app

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## Next Steps

1. Read `README.md` for complete documentation
2. Read `ARCHITECTURE.md` for architecture details
3. Customize to your needs
4. Connect to your BFF
5. Build your features

## Need Help?

- **Architecture**: See `ARCHITECTURE.md`
- **Full Documentation**: See `README.md`
- **React Query**: https://tanstack.com/query/latest
- **Tailwind CSS**: https://tailwindcss.com
- **TypeScript**: https://www.typescriptlang.org

## Key Principles

1. **Separation of Concerns**: Keep layers separate
2. **Type Safety**: Always use TypeScript types
3. **Reusability**: Create reusable components and hooks
4. **Consistency**: Follow the established patterns
5. **Simplicity**: Don't over-engineer

Happy coding!
