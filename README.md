# Open HubSpot

An open-source CRM (Customer Relationship Management) platform inspired by HubSpot. Built with modern web technologies, Open HubSpot provides essential CRM functionalities including contact management, company tracking, deal pipelines, and task management with multi-tenant organization support.

## Overview

Open HubSpot is a self-hosted CRM solution designed for teams and small businesses who want full control over their customer data. It features a clean, modern interface with a dark theme and provides core CRM capabilities without the complexity or cost of enterprise solutions.

### Key Features

- **Dashboard Analytics**: Real-time overview of revenue, contacts, pipeline value, and pending tasks with visual charts
- **Contact Management**: Create, edit, and organize contacts with company associations and lifecycle stage tracking
- **Company Directory**: Manage company records with industry, size, revenue, and location information
- **Deals Pipeline**: Visual Kanban-style deal board with drag-and-drop functionality across sales stages
- **Task Management**: Create and track tasks with priority levels, due dates, and associations to contacts/companies
- **Team Management**: Invite team members via email and manage your organization
- **Multi-Tenant Architecture**: Each organization has isolated data with secure authentication
- **CSV Import**: Bulk import deals from CSV files

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js v5 (Credentials Provider)
- **UI Components**: Custom components with Lucide icons and Framer Motion animations
- **Charts**: Recharts
- **Drag and Drop**: dnd-kit

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.x or later
- npm, yarn, pnpm, or bun
- PostgreSQL database (local or hosted)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/prat011/open-hubspot.git
cd open-hubspot
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root with the following variables:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/open_hubspot
AUTH_SECRET=your-secret-key-here
```

- `DATABASE_URL`: Connection string for your PostgreSQL database
- `AUTH_SECRET`: A random secret key for NextAuth.js session encryption (generate with `openssl rand -base64 32`)

### 4. Run Database Migrations

This will create all necessary tables and seed the database with demo data:

```bash
npm run db:migrate
```

The migration creates the following tables:
- `organizations` - Multi-tenant organization data
- `users` - User accounts with password hashing
- `invitations` - Pending team invitations
- `companies` - Company records
- `contacts` - Contact records linked to companies
- `deals` - Sales pipeline deals
- `tasks` - Task management

A demo user is created with these credentials:
- Email: `user@example.com`
- Password: `password123`

### 5. Start the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality checks |
| `npm run db:migrate` | Run database migrations and seed data |

## Project Structure

```
open-hubspot/
├── app/
│   ├── (auth)/           # Authentication pages (login, signup)
│   ├── (dashboard)/      # Main application pages
│   │   ├── companies/    # Company management
│   │   ├── contacts/     # Contact management
│   │   ├── deals/        # Deal pipeline with drag-and-drop
│   │   ├── tasks/        # Task management
│   │   └── settings/     # User and team settings
│   ├── api/              # API routes
│   └── actions.ts        # Server actions for CRUD operations
├── components/
│   ├── hubspot/          # CRM-specific components
│   ├── layout/           # Layout components (sidebar)
│   └── ui/               # Reusable UI components
├── lib/
│   ├── db.ts             # Database connection pool
│   └── utils.ts          # Utility functions
├── scripts/
│   └── migrate.ts        # Database migration script
└── public/               # Static assets
```

## Deployment

### Vercel (Recommended)

1. Push your code to a GitHub repository
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables (`DATABASE_URL`, `AUTH_SECRET`)
4. Deploy

### Self-Hosted

1. Build the production bundle:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

3. Configure your reverse proxy (nginx, Apache) to point to port 3000

## Future Roadmap

The following features are planned for future releases:

- **Email Integration**: Connect email accounts to track communications with contacts
- **Activity Timeline**: Detailed activity history for contacts and deals
- **Custom Fields**: User-defined fields for contacts, companies, and deals
- **Reporting Dashboard**: Advanced analytics and exportable reports
- **API Access**: REST/GraphQL API for third-party integrations
- **Workflow Automation**: Automated actions based on deal stage changes or task completion
- **Email Templates**: Pre-built email templates for common sales scenarios
- **Mobile Responsive**: Enhanced mobile experience for on-the-go access
- **Data Export**: Export data to CSV/Excel formats
- **Role-Based Access Control**: Granular permissions for team members
- **Calendar Integration**: Sync with Google Calendar and Outlook
- **Notes and Comments**: Add notes to contacts, companies, and deals
- **File Attachments**: Attach documents to records
- **Search and Filters**: Advanced search across all CRM data

## Contributing

Contributions are welcome. Please open an issue first to discuss what you would like to change.

## License

This project is open source. See the repository for license details.

## Links

- [GitHub Repository](https://github.com/prat011/open-hubspot)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
