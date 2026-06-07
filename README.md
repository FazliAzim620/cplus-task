# TaskFlow — Project & Task Management Dashboard

A production-quality Project & Task Management Dashboard built with Next.js, TypeScript, and modern frontend tooling. Designed with enterprise-level architecture, reusable components, and best practices for scalable SaaS applications.

## Features

- **Authentication** — Login, registration, forgot password with React Hook Form + Zod validation
- **Dashboard** — Analytics with stat cards, pie/bar/line charts (Recharts), recent activities
- **Project Management** — Full CRUD with table/card views, search, filter, sort, pagination
- **Task Management** — Full CRUD with priority, status, assignment, filtering
- **Kanban Board** — Drag-and-drop task management with @dnd-kit
- **Dark/Light Theme** — Persistent theme toggle with Tailwind CSS
- **State Management** — Redux Toolkit with async thunks, loading/error states
- **API Layer** — Axios with interceptors, mock services, localStorage persistence
- **Error Handling** — Error boundaries, global error states, form validation
- **Accessibility** — Semantic HTML, ARIA labels, keyboard navigation, focus management
- **Performance** — React.memo, useMemo, useCallback, code splitting
- **Testing** — Jest + React Testing Library unit tests
- **Docker** — Production and development container setup

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| State | Redux Toolkit |
| Data Fetching | TanStack React Query |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| HTTP | Axios |
| DnD | @dnd-kit |
| Testing | Jest, React Testing Library |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
# Clone and install
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Credentials

```
Email: admin@taskflow.com
Password: Admin@123
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | API base URL | `/api` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `TaskFlow` |

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
npm run test      # Run unit tests
npm run test:watch # Run tests in watch mode
```

## Folder Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Auth route group
│   └── (dashboard)/        # Protected dashboard routes
├── components/
│   ├── common/             # Reusable UI components
│   ├── forms/              # Form components
│   ├── dashboard/          # Dashboard-specific components
│   ├── projects/           # Project components
│   └── tasks/              # Task & Kanban components
├── constants/              # App constants
├── data/                   # Mock data & storage helpers
├── hooks/                  # Custom React hooks
├── layouts/                # Layout components
├── providers/              # Context providers
├── services/               # API service layer
├── store/                  # Redux slices & selectors
├── tests/                  # Unit tests
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
└── validations/            # Zod schemas
```

## State Management

Redux Toolkit manages three slices:

- **authSlice** — Authentication state, login/register/logout thunks
- **projectSlice** — Project CRUD with pagination and filtering
- **taskSlice** — Task CRUD with status updates for Kanban

TanStack React Query wraps API calls with caching and stale-time configuration.

## API Integration

Mock services simulate REST API behavior with configurable delays:

```
services/
├── api.ts              # Axios instance with interceptors
├── auth.service.ts     # Authentication endpoints
├── project.service.ts  # Project CRUD
└── task.service.ts     # Task CRUD
```

Data persists in localStorage between sessions. JWT tokens are simulated with base64-encoded payloads.

## Docker Deployment

### Production

```bash
docker compose up app
```

### Development

```bash
docker compose up dev
```

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

Test coverage includes:
- Validation schemas (auth, project, task forms)
- Redux store (auth, project, task slices)
- Utility functions (sort, filter, format)
- Login form component

## License

MIT
