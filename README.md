# React Template with 3-Layer Architecture

A modern, production-ready React template with a clean 3-layer architecture, designed to work seamlessly with Backend for Frontend (BFF) services.

## Architecture Overview

This template follows a **3-layer architecture** similar to traditional backend patterns (Controller-Service-Repository), adapted for modern React development:

```
┌─────────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                         │
│  Components, Pages, Layouts (UI)                            │
│  - React components                                          │
│  - No business logic, only presentation                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  BUSINESS LOGIC LAYER                        │
│  Hooks (Custom hooks, Use Cases)                            │
│  - Custom hooks with business logic                          │
│  - React Query hooks for API data                            │
│  - Domain services (validation, calculations, etc.)          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   DATA ACCESS LAYER                          │
│  Services (API, Storage, State)                             │
│  - API clients (axios)                                       │
│  - Local storage abstraction                                 │
│  - State management (Zustand for client state)              │
└─────────────────────────────────────────────────────────────┘
```

### Why This Architecture?

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Testability**: Easy to test each layer in isolation
3. **Maintainability**: Clear structure makes code easy to navigate
4. **Scalability**: Can grow with your application
5. **Team Collaboration**: Familiar pattern for backend developers

## Technology Stack

### Core
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool (replaces Create React App)

### State Management
- **TanStack Query (React Query)** - Server state management
  - Replaces Redux for API data
  - Automatic caching, refetching, and synchronization
  - Built-in loading and error states
- **Zustand** - Client state management
  - Lightweight alternative to Redux
  - Simple API, no boilerplate

### Styling
- **Tailwind CSS** - Utility-first CSS
  - Responsive by default
  - Fast development
  - Small bundle size

### Routing & Navigation
- **React Router v6** - Declarative routing

### HTTP Client
- **Axios** - Promise-based HTTP client
  - Interceptors for auth tokens
  - Request/response transformations
  - BFF integration ready

### Error Handling
- **react-error-boundary** - Error boundary components

### Dev Tools
- **React Query DevTools** - Debug server state
- **TypeScript** - Compile-time type checking

## Folder Structure

```
src/
├── components/              # Presentation Layer
│   ├── ui/                 # Reusable UI components (Button, Input, etc.)
│   ├── features/           # Feature-specific components (LoginForm, etc.)
│   ├── layouts/            # Layout components (MainLayout, etc.)
│   └── ErrorBoundary.tsx   # Error boundary component
│
├── hooks/                  # Business Logic Layer
│   ├── queries/            # React Query hooks (useUser, useProducts, etc.)
│   └── use-cases/          # Business logic hooks (useAuth, useCheckout, etc.)
│
├── services/               # Data Access Layer
│   ├── api/               # API clients and endpoints
│   │   ├── api-client.ts  # Axios instance with interceptors
│   │   └── user.api.ts    # User API endpoints
│   ├── storage/           # Local storage abstraction
│   │   └── local-storage.service.ts
│   └── domain/            # Domain services (validation, business rules)
│       └── validation.service.ts
│
├── stores/                 # Client State (Zustand)
│   └── ui.store.ts        # UI state (theme, sidebar, modals)
│
├── pages/                  # Page components
│   ├── DashboardPage.tsx
│   └── LoginPage.tsx
│
├── types/                  # TypeScript types
│   ├── api.types.ts       # API-related types
│   └── user.types.ts      # Domain types
│
├── config/                 # Configuration files
│   ├── api.config.ts      # API configuration
│   └── query-client.config.ts  # React Query configuration
│
├── utils/                  # Utility functions
│
├── App.tsx                 # Main app component
└── main.tsx               # App entry point
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone this template**:
   ```bash
   git clone git@github.com:myteksp/react-ui-template.git
   cd react-ui-template
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open http://localhost:5173**

   The template runs in **mock mode** by default (no backend needed). You'll see a working dashboard with sample data.

### Connecting to Your BFF

When you're ready to connect to a real backend:

1. **Update `.env`**:
   ```bash
   VITE_API_BASE_URL=http://your-bff-url/api
   VITE_MOCK_MODE=false  # Disable mock mode
   ```

2. **Restart the dev server**:
   ```bash
   npm run dev
   ```

The template will now make real API calls to your BFF instead of using mock data.

### Working with Claude Code

This template is designed to work seamlessly with [Claude Code](https://claude.com/claude-code). When starting a new project:

1. **Clone and open in Claude Code**:
   ```bash
   git clone git@github.com:myteksp/react-ui-template.git my-project
   cd my-project
   code .  # or open with your editor
   ```

2. **Tell Claude your requirements**:
   - Example: *"Create a dashboard for cryptocurrency portfolio tracking using CoinGecko API"*
   - Example: *"Add Supabase authentication with Google SSO"*
   - Example: *"Build an analytics dashboard with charts for user engagement"*

3. **Claude will**:
   - Remove unnecessary example code (User/Login if not needed)
   - Add required integrations (Supabase, APIs, SSO providers)
   - Create domain-specific components and hooks
   - Maintain the 3-layer architecture
   - Keep the code clean and maintainable

4. **The architecture stays, the content adapts**:
   - Claude understands this is a template, not rigid code
   - The folder structure and patterns remain
   - Only relevant code for your use case is kept
   - New features follow the established patterns

**Pro tip**: Be specific about your needs. Claude works best when you clearly describe what you're building and which services you're using.

### Build for Production
```bash
npm run build
npm run preview  # Preview production build
```

## How to Use This Template

### 1. Adding a New Feature

Let's say you want to add a "Products" feature:

#### Step 1: Define Types (Data Access Layer)
```typescript
// src/types/product.types.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}
```

#### Step 2: Create API Client (Data Access Layer)
```typescript
// src/services/api/product.api.ts
import apiClient from './api-client';
import { Product } from '@/types/product.types';

export const productApi = {
  getProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get('/products');
    return response.data.data;
  },

  getProductById: async (id: string): Promise<Product> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data.data;
  },
};
```

#### Step 3: Create React Query Hooks (Business Logic Layer)
```typescript
// src/hooks/queries/useProduct.ts
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/services/api/product.api';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productApi.getProducts,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productApi.getProductById(id),
  });
};
```

#### Step 4: Create Components (Presentation Layer)
```typescript
// src/components/features/ProductList.tsx
import { Card, LoadingSpinner } from '@/components/ui';
import { useProducts } from '@/hooks/queries/useProduct';

export const ProductList = () => {
  const { data: products, isLoading, error } = useProducts();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading products</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products?.map(product => (
        <Card key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </Card>
      ))}
    </div>
  );
};
```

#### Step 5: Create Page and Add Route
```typescript
// src/pages/ProductsPage.tsx
export const ProductsPage = () => {
  return (
    <div>
      <h1>Products</h1>
      <ProductList />
    </div>
  );
};

// Add to App.tsx routes
<Route path="/products" element={<MainLayout><ProductsPage /></MainLayout>} />
```

### 2. Working with BFF

The template is configured to work with a BFF out of the box:

1. **Configure BFF URL** in `.env`:
   ```
   VITE_API_BASE_URL=http://your-bff-url/api
   ```

2. **API Client** (`src/services/api/api-client.ts`) includes:
   - Automatic auth token injection
   - Request/response interceptors
   - Error handling
   - Token refresh logic (customize as needed)

3. **API Response Format**: The template expects responses like:
   ```json
   {
     "data": {...},
     "message": "Success",
     "timestamp": "2025-10-16T..."
   }
   ```
   Adjust `ApiResponse<T>` type in `src/types/api.types.ts` to match your BFF.

### 3. State Management Strategy

**Server State** (data from API):
- Use **React Query** hooks
- Lives in `src/hooks/queries/`
- Automatic caching, refetching, and synchronization

**Client State** (UI state):
- Use **Zustand** stores
- Lives in `src/stores/`
- For theme, sidebar state, modals, notifications, etc.

**Example**:
```typescript
// Client state (Zustand)
const { theme, toggleTheme } = useUiStore();

// Server state (React Query)
const { data: user } = useCurrentUser();
```

### 4. Adding Business Logic

Put business logic in custom hooks or domain services:

**Custom Hook** (for component-specific logic):
```typescript
// src/hooks/use-cases/useCheckout.ts
export const useCheckout = () => {
  // Orchestrate multiple API calls
  // Add validation
  // Handle complex workflows
};
```

**Domain Service** (for reusable logic):
```typescript
// src/services/domain/pricing.service.ts
export class PricingService {
  static calculateTotal(items: Item[]): number {
    return items.reduce((sum, item) => sum + item.price, 0);
  }
}
```

## Best Practices

### Component Organization
- **UI Components** (`components/ui/`): Dumb, reusable, no business logic
- **Feature Components** (`components/features/`): Smart, feature-specific
- **Pages** (`pages/`): Route-level components, compose features

### Type Safety
- Always define TypeScript types for API responses
- Use strict TypeScript settings (already configured)
- Define prop interfaces for components

### API Client
- One file per domain (user.api.ts, product.api.ts)
- Use consistent naming (getX, createX, updateX, deleteX)
- Handle errors at the API client level

### React Query
- Use query keys consistently
- Invalidate queries after mutations
- Use optimistic updates for better UX

### Styling
- Use Tailwind utilities first
- Create reusable UI components for complex patterns
- Use responsive classes (sm:, md:, lg:, xl:)

## Comparison with Traditional Backend

| Backend Pattern | Frontend Equivalent |
|----------------|---------------------|
| Controller | React Component/Page |
| Service | Custom Hook / Domain Service |
| Repository | API Client (axios) |
| DTO | TypeScript Types/Interfaces |
| Request/Response | Props / Return Values |
| Dependency Injection | React Context / Hooks |

## Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
VITE_ENV=development
```

Access in code:
```typescript
import.meta.env.VITE_API_BASE_URL
```

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Next Steps

1. **Authentication**: Customize the auth flow in `src/hooks/use-cases/useAuth.ts`
2. **Protected Routes**: Add route guards for authenticated routes
3. **Error Handling**: Customize error messages and retry logic
4. **API Integration**: Connect to your BFF endpoints
5. **Theme**: Extend Tailwind config for your brand colors
6. **Testing**: Add Vitest for unit tests, Playwright for E2E

## Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [React Router Docs](https://reactrouter.com)
- [Vite Docs](https://vitejs.dev)

## License

MIT
