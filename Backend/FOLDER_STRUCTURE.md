# AssetFlow - Modular Monolith Folder Structure

```
backend-folder-structure/
├── src/
│   ├── app/
│   │   ├── app.ts
│   │   ├── routes.ts
│   │   └── server.ts
│   ├── config/
│   │   └── env.ts
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeds/
│   │   └── models/
│   ├── modules/
│   │   ├── auth/                    # Feature 1: Login/Signup
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   ├── schemas/
│   │   │   └── types/
│   │   ├── assets/                  # Feature 4: Asset Registration & Directory
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   ├── schemas/
│   │   │   └── types/
│   │   ├── departments/             # Feature 3A: Department Management
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   ├── schemas/
│   │   │   └── types/
│   │   ├── employees/               # Feature 3C: Employee Directory
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   ├── schemas/
│   │   │   └── types/
│   │   ├── categories/              # Feature 3B: Asset Category Management
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   ├── schemas/
│   │   │   └── types/
│   │   ├── allocations/             # Feature 5: Asset Allocation & Transfer
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   ├── schemas/
│   │   │   └── types/
│   │   ├── bookings/                # Feature 6: Resource Booking
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   ├── schemas/
│   │   │   └── types/
│   │   ├── maintenance/             # Feature 7: Maintenance Management
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   ├── schemas/
│   │   │   └── types/
│   │   ├── audits/                  # Feature 8: Asset Audit
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   ├── schemas/
│   │   │   └── types/
│   │   ├── reports/                 # Feature 9: Reports & Analytics
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   ├── schemas/
│   │   │   └── types/
│   │   ├── notifications/           # Feature 10: Activity Logs & Notifications
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   ├── schemas/
│   │   │   └── types/
│   │   └── dashboard/               # Feature 2: Dashboard / Home Screen
│   │       ├── controllers/
│   │       ├── services/
│   │       ├── repositories/
│   │       ├── routes/
│   │       ├── schemas/
│   │       └── types/
│   ├── shared/
│   │   ├── utils/
│   │   ├── middleware/
│   │   ├── types/
│   │   ├── constants/
│   │   └── validators/
│   └── docs/
├── tests/
│   ├── e2e/
│   ├── integration/
│   └── unit/
├── uploads/
├── .env.example
├── .gitignore
├── Dockerfile
├── README.md
├── docker-compose.yml
├── package.json
└── tsconfig.json
```

## Module Mapping to Features

| Module | Feature | Description |
|--------|---------|-------------|
| `auth` | Feature 1 | Login/Signup Screen - Authentication with role-based access |
| `dashboard` | Feature 2 | Dashboard/Home Screen - KPI cards and real-time snapshot |
| `departments` | Feature 3A | Department Management - Create/edit/deactivate departments |
| `categories` | Feature 3B | Asset Category Management - Create/edit asset categories |
| `employees` | Feature 3C | Employee Directory - Manage employees and role assignments |
| `assets` | Feature 4 | Asset Registration & Directory - Register and track assets |
| `allocations` | Feature 5 | Asset Allocation & Transfer - Manage asset assignments |
| `bookings` | Feature 6 | Resource Booking - Time-slot booking for shared resources |
| `maintenance` | Feature 7 | Maintenance Management - Repair approval workflow |
| `audits` | Feature 8 | Asset Audit - Structured verification cycles |
| `reports` | Feature 9 | Reports & Analytics - Operational insights and reports |
| `notifications` | Feature 10 | Activity Logs & Notifications - Keep users informed |

## Architecture Principles

1. **Modular Monolith**: Each module is self-contained with its own controllers, services, repositories, routes, schemas, and types
2. **Separation of Concerns**: Clear separation between business logic (services), data access (repositories), and API layer (controllers/routes)
3. **Scalability**: Modules can be extracted to microservices if needed in the future
4. **Maintainability**: Each feature is isolated, making the codebase easier to understand and modify
5. **Role-Based Access Control**: Auth module handles RBAC across all modules
