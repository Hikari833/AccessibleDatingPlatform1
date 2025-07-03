# AccessLove - Accessible Dating Platform

## Overview

AccessLove is a modern, inclusive dating platform specifically designed with accessibility as a core feature. The application focuses on creating meaningful connections within the disability community while ensuring full accessibility compliance and user-friendly features for all users.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Accessibility**: Comprehensive accessibility framework with screen reader support, voice navigation, and high contrast modes

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with JSON responses
- **Session Management**: PostgreSQL-based session storage

### Build System
- **Frontend Bundler**: Vite with React plugin
- **Backend Bundler**: esbuild for production builds
- **Development**: Hot module replacement with Vite dev server
- **TypeScript**: Strict type checking across the entire codebase

## Key Components

### Accessibility System
- **AccessibilityProvider**: React context providing accessibility settings and controls
- **AccessibilityToolbar**: Always-visible toolbar with accessibility options
- **Voice Navigation**: Speech recognition and synthesis for hands-free interaction
- **Screen Reader Support**: Comprehensive ARIA labels and announcements
- **Visual Accessibility**: High contrast mode, adjustable text sizes, reduced motion support

### User Management
- **User Registration/Authentication**: Complete user account management
- **Profile System**: Detailed profiles with disability-specific information
- **Matching Algorithm**: Mutual like system with accessibility preferences consideration

### Communication Features
- **Real-time Messaging**: Text, voice, and video message support
- **Accessible Communication**: Multiple communication preference options
- **Match System**: Secure messaging only between matched users

### Database Schema
- **Users**: Core user account information
- **Profiles**: Detailed user profiles with accessibility needs
- **Matches**: Mutual like relationships
- **Messages**: Communication between matched users
- **Likes/Blocks/Reports**: User interaction and safety features

## Data Flow

1. **User Registration**: Users create accounts and detailed accessibility-focused profiles
2. **Discovery**: Users browse profiles with filtering based on accessibility needs
3. **Matching**: Mutual likes create matches enabling communication
4. **Communication**: Matched users can exchange messages with accessibility accommodations
5. **Safety**: Comprehensive blocking and reporting system for user protection

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **react-hook-form**: Form management with validation
- **zod**: Runtime type validation and schema validation

### Development Dependencies
- **vite**: Fast development server and build tool
- **typescript**: Type safety across the application
- **tailwindcss**: Utility-first CSS framework
- **@replit/vite-plugin-***: Replit-specific development enhancements

## Deployment Strategy

### Development Environment
- **Database**: Managed PostgreSQL via Neon Database
- **Frontend**: Vite dev server with HMR
- **Backend**: Node.js with tsx for TypeScript execution
- **Environment Variables**: DATABASE_URL for database connection

### Production Build
- **Frontend**: Static assets built with Vite to `dist/public`
- **Backend**: Bundled with esbuild to `dist/index.js`
- **Database**: Production PostgreSQL with migration system
- **Deployment**: Single server deployment with static file serving

### Database Management
- **Migrations**: Drizzle Kit for schema migrations
- **Schema**: Centralized in `shared/schema.ts` for type safety
- **Connection**: Environment-based configuration with connection pooling

## Changelog

```
Changelog:
- July 03, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```