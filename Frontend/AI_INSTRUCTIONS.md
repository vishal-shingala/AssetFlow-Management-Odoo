# Strict AI Agent Instructions

These instructions MUST be followed strictly by any AI agent when generating, refactoring, or modifying code in this project.

## 1. Architecture
- **Strictly Feature-Based Architecture**: All domain-specific logic must be self-contained within its own directory under `src/features/`. Each feature should contain its own `api`, `components`, `hooks`, `routes`, `stores`, `types`, and `utils` as needed.
- **Global Scope vs Feature Scope**: Only code that is truly shared across multiple disparate features belongs in the global `src/` directories.


## 2. Validation, Forms & Data Integrity
- **React Hook Form**: All forms MUST be built using `react-hook-form` to manage form state, avoid unnecessary re-renders, and ensure performance.
- **Zod for Validation**: Always use `zod` and `@hookform/resolvers/zod` for any form schema definition, data parsing, API response validation, and user input validation.

## 3. Component Design & Reusability
- **Reusable Components**: UI Components must be designed generically to be reusable. If a component is specific to one feature, it stays in that feature's `components` folder. If it's generic, it goes in the global `src/components`.
- **Component Organization**: Organize global components into subdirectories:
  - `src/components/ui/` - Base UI primitives (Button, Input, LoadingSpinner, etc.)
  - `src/components/layout/` - Layout components (Header, Sidebar, etc.)
  - `src/components/error/` - Error handling components (ErrorBoundary, NotFound, etc.)


## 4. Task Tracking
- **Use Comments for Checkmarks**: When implementing complex logic or multi-step tasks, use comments as checklists to track progress directly in the code (e.g., `// [x] Initialize state`, `// [ ] Fetch data`).

## 5. Library Configurations
- **Common Configuration Instances**: Any third-party library setup (e.g., Axios, Firebase, etc.) must be created once in the `src/config` or `src/lib` folder. Export the configured instance and import that single instance everywhere instead of configuring the library multiple times.

## 6. Code Quality & DRY Principle
- **Zero Code Redundancy**: Code redundancy must not occur. Not a single line of duplicated business logic or UI component structure is allowed. Extract repeated logic into helper functions, hooks, or shared components immediately.


## 7. Custom Hooks
- **Global vs Local Hooks**: You can create custom hooks, but to place them in the global `src/hooks` folder, they MUST be used in multiple files across different features. If a hook is only used in a single file or a single feature, it MUST be created within that specific feature's `hooks` folder.

## 8. State Management
- **Context API for Data Sharing**: Use React Context files when data sharing is required across a component tree to avoid prop-drilling. Keep Contexts scoped to features when possible, or global if the data is app-wide (like Theme or Auth).

## 9. Added Best Practices (AI Guidelines)
- **API Abstraction**: Never make inline API calls (like `axios.get`) directly inside a React component. All API calls must be abstracted into a dedicated `api/` file within the respective feature.
- **Modern React Only**: Strictly use Functional Components and React Hooks. Avoid deprecated patterns.
- **Tailwind CSS Cleanliness**: Avoid excessively long strings of utility classes if they are repeated. Extract repeated UI patterns into reusable React components.
- **Error Handling**: Gracefully handle errors and loading states for every asynchronous operation. Never leave an unhandled Promise rejection.
- **Performance Optimizations**: Use `React.memo()` for components that don't need to re-render frequently. Use `useMemo()` and `useCallback()` judiciously for expensive computations and function references.

## 10. Toast Notifications
- **Global Toast System**: Use `react-hot-toast` for all client-side notifications (success, error, warning, info messages). Import and use `toast` from `react-hot-toast`.
- **Toast Provider**: Ensure `<Toaster />` from `react-hot-toast` is included in the application root (e.g., `App.jsx`).
- **Usage Pattern**: Call `toast.success()`, `toast.error()`, or `toast()` with the message.
- **No Alert/Confirm**: Never use native `alert()`, `confirm()`, or `prompt()` dialogs. Always use the Toast system for user notifications.

## 11. File Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile.jsx`, `LoadingSpinner.jsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useUserData.js`, `useAuth.js`)
- **Utilities**: camelCase (e.g., `formatDate.js`, `apiHelpers.js`)
- **Types**: PascalCase with 'I' or 'T' prefix (e.g., `IUser.ts`, `TUserProps.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL.js`, `APP_CONFIG.js`)
- **No Semicolons**: Do not use semicolons at the end of statements (enforced by Prettier config)

## 12. PrimeReact Components Usage
- **Frontend Components**: Use PrimeReact for building React components in the frontend. Ensure you import the necessary PrimeReact components from `primereact/<component_name>`.