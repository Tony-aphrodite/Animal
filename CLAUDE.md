# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PIPO is a QR code-based pet identification system that helps lost pets reunite with their owners. The system consists of a Next.js web application (`pipo-app/`) that allows three types of access:

- **Admin**: Manages QR code generation and system administration
- **Tutor**: Pet owners who register and edit pet information  
- **Public**: Anyone who scans a QR code to view pet information

## Core Architecture

The application follows a standard Next.js 14+ structure with App Router:

- **Database**: SQLite with Prisma ORM (`pipo-app/prisma/schema.prisma`)
- **Authentication**: NextAuth.js with credentials provider (`pipo-app/src/lib/auth.ts`)
- **UI**: Tailwind CSS with custom PIPO brand colors (`pipo-app/src/app/globals.css`)
- **File Uploads**: Handled via API routes, stored in `pipo-app/public/uploads/`
- **QR Codes**: Generated using `qrcode` library, stored in `pipo-app/public/qrcodes/`

### Key Models

**QRCode**: Tracks QR codes with unique numeric codes and status (RAW/ACTIVE)
**User**: Admin and Tutor accounts with role-based access  
**Pet**: Pet information linked to QR codes and tutors

### Route Structure

- `/` - Public landing page
- `/pet/[code]` - Public pet profile page (or activation page if QR is RAW)
- `/activate/[code]` - QR code activation for new pets
- `/admin/*` - Admin dashboard for QR management and statistics
- `/tutor/*` - Tutor dashboard for pet information management
- `/api/*` - REST API endpoints for all operations

### Color Scheme

PIPO uses a consistent brand color palette:
- Yellow: `#ffde59` (primary brand color)
- Blue: `#5271ff` (secondary)
- Blue Background: `#6376B1`
- Green: `#71C79F`

## Development Commands

Navigate to `pipo-app/` directory for all commands:

```bash
# Development
npm run dev          # Start development server (http://localhost:3000)

# Building
npm run build        # Create production build
npm start           # Start production server

# Database
npm run seed        # Seed database with initial data (creates admin user)

# Code Quality
npm run lint        # Run ESLint
```

## Database Management

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Create and apply new migration
npx prisma migrate dev --name migration_name

# Reset database (development only)
npx prisma migrate reset

# Open Prisma Studio for database inspection
npx prisma studio
```

## Key Business Logic

1. **QR Code Lifecycle**: QR codes start as "RAW" (unregistered) and become "ACTIVE" when associated with a pet
2. **Contact Privacy**: Pet pages only show the tutor's preferred contact method (WhatsApp OR phone, never both)
3. **Field Visibility**: Empty pet information fields are never displayed on public pages
4. **Admin Functions**: QR code generation, bulk export, and system statistics
5. **File Handling**: Pet photos and QR code images are managed through specific API endpoints

## Authentication Flow

- Uses NextAuth.js with JWT strategy
- Session expires after 30 days
- Role-based redirects: Admin → `/admin`, Tutor → `/tutor`
- Password hashing with bcryptjs (12 salt rounds)

## Environment Setup

Copy `.env` example and configure:
- `DATABASE_URL` for SQLite database
- `NEXTAUTH_SECRET` for session encryption
- `NEXTAUTH_URL` for deployment

Run `npm run seed` after database setup to create the initial admin user.