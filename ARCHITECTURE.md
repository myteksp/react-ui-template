# Architecture Deep Dive

This document provides an in-depth explanation of the 3-layer architecture used in this template.

## Overview

The architecture is inspired by traditional backend layered architectures (like Spring Boot's Controller-Service-Repository pattern) but adapted for modern React development.

## The Three Layers

### 1. Presentation Layer (View)

**Location**: `src/components/`, `src/pages/`

**Responsibility**: Rendering UI and handling user interactions

**Contents**:
- React components
- JSX/TSX markup
- Event handlers (that delegate to business logic)
- Visual state (open/closed, hover, etc.)

**Rules**:
- No business logic
- No direct API calls
- No complex calculations
- Only calls hooks from Business Logic Layer

**Example**:
```typescript
// ✅ GOOD - Presentation only
export const UserCard = () => {
  const { data: user, isLoading } = useCurrentUser(); // Business logic hook

  if (isLoading) return <LoadingSpinner />;

  return <Card>{user.name}</Card>;
};

// ❌ BAD - Business logic in component
export const UserCard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/users/me')  // Direct API call
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  return <Card>{user?.name}</Card>;
};
```

### 2. Business Logic Layer (Service)

**Location**: `src/hooks/`, `src/services/domain/`

**Responsibility**: Business rules, orchestration, and data transformations

**Contents**:
- Custom hooks with business logic
- React Query hooks (wrapping API calls)
- Domain services (validation, calculations)
- Orchestration of multiple data sources

**Rules**:
- No JSX/rendering logic
- Calls Data Access Layer
- Contains all business rules
- Reusable across components

**Example**:
```typescript
// ✅ GOOD - Business logic in hook
export const useAuth = () => {
  const navigate = useNavigate();
  const { mutateAsync: loginMutation } = useLogin();

  const login = async (credentials: LoginRequest) => {
    // Business logic: validate, call API, handle navigation
    try {
      const response = await loginMutation(credentials);
      navigate('/dashboard');
      return response;
    } catch (error) {
      // Error handling logic
      console.error('Login failed:', error);
      throw error;
    }
  };

  return { login };
};

// ❌ BAD - Business logic in component
const LoginForm = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {...}); // Should be in hook
      if (response.ok) {
        navigate('/dashboard'); // Should be in hook
      }
    } catch (error) {
      // ...
    }
  };
};
```

### 3. Data Access Layer (Repository)

**Location**: `src/services/api/`, `src/services/storage/`, `src/stores/`

**Responsibility**: Data fetching, caching, and persistence

**Contents**:
- API clients (axios)
- Local storage wrappers
- State management stores (Zustand)
- HTTP interceptors

**Rules**:
- No business logic
- No React components
- Only data operations (CRUD)
- Can be tested independently

**Example**:
```typescript
// ✅ GOOD - Pure data access
export const userApi = {
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/users/me');
    return response.data.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data.data;
  }
};

// ❌ BAD - Business logic in data layer
export const userApi = {
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/users/me');

    // Business logic - should be in service layer
    if (!response.data.data.isActive) {
      throw new Error('User is not active');
    }

    // Transformation - should be in service layer
    return {
      ...response.data.data,
      displayName: `${response.data.data.firstName} ${response.data.data.lastName}`
    };
  }
};
```

## Layer Communication

### Flow Direction

```
User Interaction → Component → Hook → API Client → BFF
                     ↓            ↓         ↓
                  (View)    (Business)  (Data)
```

### Data Flow

```
BFF Response → API Client → React Query → Hook → Component → DOM
                  ↓            ↓           ↓        ↓
               (Data)     (Caching)  (Business) (View)
```

## State Management Strategy

### Server State (React Query)

**When to use**: Data from your BFF API

**Why**:
- Automatic caching
- Background refetching
- Optimistic updates
- Loading/error states

**Example**:
```typescript
// Hook wraps API call with React Query
export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userApi.getUserById(id),
  });
};

// Component uses the hook
const UserProfile = ({ userId }) => {
  const { data, isLoading, error } = useUser(userId);
  // React Query handles all the caching and state
};
```

### Client State (Zustand)

**When to use**: UI state (theme, modals, sidebar)

**Why**:
- Lightweight
- No boilerplate
- Easy to use
- Doesn't belong on server

**Example**:
```typescript
// Store definition
export const useUiStore = create<UiState>((set) => ({
  theme: 'light',
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light'
  })),
}));

// Component usage
const Header = () => {
  const { theme, toggleTheme } = useUiStore();
  // ...
};
```

## Comparison with Backend Architecture

### Spring Boot → React Mapping

| Spring Boot | React Equivalent | Location |
|-------------|------------------|----------|
| `@Controller` | Page Component | `src/pages/` |
| `@Service` | Custom Hook | `src/hooks/use-cases/` |
| `@Repository` | API Client | `src/services/api/` |
| `@Entity` | TypeScript Type | `src/types/` |
| `@RequestBody` | Function Parameter | Hook params |
| `@ResponseBody` | Function Return | Hook return value |
| `@Autowired` | `import` / Hook call | N/A |
| `application.yml` | `.env` | `.env` |

### Example Mapping

**Spring Boot**:
```java
@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser(@PathVariable String id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
}

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User getUserById(String id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));
    }
}

@Repository
public interface UserRepository extends JpaRepository<User, String> {
}
```

**React Equivalent**:
```typescript
// Page (Controller)
export const UserPage = ({ userId }: { userId: string }) => {
  const { data: user, isLoading, error } = useUserProfile(userId);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;

  return <UserProfile user={user} />;
};

// Custom Hook (Service)
export const useUserProfile = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userApi.getUserById(id),
  });
};

// API Client (Repository)
export const userApi = {
  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data.data;
  }
};
```

## Design Patterns Used

### 1. Repository Pattern
- `src/services/api/*.api.ts` files
- Abstracts data access
- Easy to mock for testing

### 2. Custom Hooks Pattern
- Encapsulates business logic
- Reusable across components
- Testable in isolation

### 3. Dependency Injection (via imports)
- Modules import what they need
- Easy to swap implementations
- Clear dependencies

### 4. Observer Pattern (React Query)
- Components subscribe to data
- Automatic updates on changes
- Efficient re-renders

### 5. Facade Pattern (API Client)
- Single interface to axios
- Hides complexity of interceptors
- Consistent error handling

## Testing Strategy

### Layer Testing

**Presentation Layer**:
```typescript
// Test component rendering
test('renders user card', () => {
  const mockUser = { id: '1', name: 'John' };
  render(<UserCard user={mockUser} />);
  expect(screen.getByText('John')).toBeInTheDocument();
});
```

**Business Logic Layer**:
```typescript
// Test hooks with React Testing Library
test('useAuth login success', async () => {
  const { result } = renderHook(() => useAuth());

  await act(async () => {
    await result.current.login({ email: 'test@test.com', password: 'pass' });
  });

  expect(result.current.isAuthenticated).toBe(true);
});
```

**Data Access Layer**:
```typescript
// Test API clients with mocks
test('userApi.getCurrentUser fetches user', async () => {
  const mockUser = { id: '1', name: 'John' };
  mockedApiClient.get.mockResolvedValue({ data: { data: mockUser } });

  const user = await userApi.getCurrentUser();

  expect(user).toEqual(mockUser);
  expect(apiClient.get).toHaveBeenCalledWith('/users/me');
});
```

## When to Break the Rules

Sometimes strict layer separation isn't necessary:

### Simple Forms
For very simple forms without business logic, you can skip the hook layer:
```typescript
const SimpleForm = () => {
  const [value, setValue] = useState('');
  return <input value={value} onChange={e => setValue(e.target.value)} />;
};
```

### Static Content
For pages with no data fetching or business logic:
```typescript
const AboutPage = () => {
  return <div>About us...</div>;
};
```

### Utility Functions
Pure functions don't need to be in any specific layer:
```typescript
// src/utils/format.ts
export const formatDate = (date: Date) => {
  return date.toLocaleDateString();
};
```

## Common Mistakes to Avoid

1. **Business logic in components**: Always extract to hooks
2. **Direct API calls in components**: Use React Query hooks
3. **Business logic in API clients**: Keep them pure data operations
4. **Prop drilling**: Use Context or state management
5. **Global state for server data**: Use React Query, not Zustand
6. **Not using TypeScript types**: Always type your data

## Benefits of This Architecture

1. **Maintainability**: Clear where code belongs
2. **Testability**: Each layer can be tested independently
3. **Reusability**: Hooks and services are reusable
4. **Scalability**: Easy to add features
5. **Team Collaboration**: Clear ownership of layers
6. **Onboarding**: Familiar pattern for backend developers

## Resources

- [Clean Architecture (Robert C. Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [React Hooks Patterns](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)
