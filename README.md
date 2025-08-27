# DRIVA - Digital Road Vehicle & Infringement Administration

DRIVA is a modern, web-based platform designed to digitize and streamline the entire lifecycle of traffic fine management. It replaces outdated, paper-based systems with a seamless digital solution for law enforcement officers, administrators, and citizens.

## ✨ Key Features

The platform is built with distinct portals and features tailored to different user roles:

### 👤 For Citizens
- **Citizen Portal**: A secure dashboard to view all personal traffic fines.
- **Online Payments**: A secure and easy way to pay single or multiple fines online.
- **Dispute Submission**: A streamlined process to dispute fines with evidence upload capabilities.
- **Fine History**: Access to a complete history of all past and present fines.
- **Emergency Contacts**: Quick access to important emergency service numbers.

### 👮 For Traffic Officers
- **Officer Dashboard**: An analytics dashboard showing key metrics like fines issued, payments collected, and violation trends.
- **Fine Management**: View lists of newly issued, outstanding, paid, and disputed fines.
- **Dispute Review**: A dedicated interface to review citizen-submitted disputes and evidence, and to approve or reject them.
- **Secure Authentication**: Role-based access to ensure data integrity and security.

### ⚙️ For System Administrators
- **Admin Dashboard**: A high-level overview and management portal.
- **Department Registration**: A system to review and approve or reject registration requests from new traffic departments.
- **User Management**: (Future Scope) A central place to manage all users in the system.

## 🚀 Tech Stack

DRIVA is built with a modern, robust, and scalable technology stack.

- **Frontend**:
  - **Framework**: React with TypeScript & Vite
  - **UI Components**: shadcn/ui, Radix UI
  - **Styling**: Tailwind CSS
  - **Routing**: React Router
  - **State Management**: React Context API
  - **Data Visualization**: Recharts
  - **Notifications**: Sonner

- **Backend (Serverless)**:
  - **Platform**: Supabase
  - **Database**: Supabase Postgres DB with Row Level Security (RLS)
  - **Authentication**: Supabase Auth
  - **File Storage**: Supabase Storage (for dispute evidence)
  - **Serverless Functions**: Supabase Edge Functions (written in Deno/TypeScript) for secure backend logic.

## 📂 Project Structure

The codebase is organized to be modular and maintainable.

```
.
├── supabase/
│   ├── functions/          # Serverless Edge Functions (e.g., pay-fines, resolve-dispute)
│   └── migrations/         # Database schema and SQL policies
├── src/
│   ├── components/         # Reusable React components (UI elements, charts, etc.)
│   ├── contexts/           # React Context for global state (e.g., SessionContext)
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # Supabase client setup
│   ├── lib/                # Utility functions
│   ├── pages/              # Top-level page components for each route
│   │   ├── admin/          # Admin-specific pages
│   │   └── ...
│   ├── App.tsx             # Main application component with routing logic
│   └── main.tsx            # Application entry point
├── tailwind.config.ts      # Tailwind CSS configuration
└── vite.config.ts          # Vite build configuration
```

## 🔐 Security

Security is a core principle of the DRIVA platform:

- **Row Level Security (RLS)**: Supabase RLS is enabled on all tables to ensure users can only access and modify data they are permitted to. For example, citizens can only see their own fines, and officers can only review disputes.
- **Secure File Storage**: Storage policies ensure that users can only upload evidence to their own designated folders and that only authorized personnel can review it.
- **Role-Based Access Control (RBAC)**: The application routes and features are protected based on user roles (`citizen`, `officer`, `admin`) defined in the `profiles` table.
- **Serverless Functions**: Sensitive operations like payment processing and dispute resolution are handled in secure Supabase Edge Functions, which use the `service_role_key` to bypass RLS when necessary and perform privileged actions.

This combination of frontend and backend security measures ensures a robust and trustworthy system for all users.