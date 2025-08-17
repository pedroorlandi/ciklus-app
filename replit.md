# CIKLUS APP

## Overview

CIKLUS APP is a comprehensive full-stack web application designed for family financial planning and management. It provides services for financial planning, investment portfolio management, income/expense tracking, goal setting, and mood-based financial insights. The application supports multiple user roles, including administrators, financial planners, and clients, and aims to offer a robust solution for managing personal and family finances. Its business vision includes providing a clear financial roadmap and fostering a deeper understanding of financial well-being.

## Recent Changes (August 13, 2025)

✓ **System Restoration Completed**: Successfully restored the original Ciklus system from GitHub backup (https://github.com/pedroorlandi/ciklus-app.git)
✓ **Architecture Restored**: Replaced Streamlit adaptation with original React+Express+TypeScript system
✓ **Database Connected**: PostgreSQL local database with 16 tables and 5 economic indices loaded
✓ **Dependencies Installed**: All original npm packages and Node.js dependencies restored
✓ **Server Running**: Backend server running on port 5000 with automatic economic indices updates
✓ **Historical Data Migration Completed**: All 852 real historical records loaded into PostgreSQL
✓ **Data Coverage**: Financial data spanning multiple years (2025-2095+) for "Eduardo e Mônica" planning
✓ **Full Data Integration**: Complete CSV data migration with all financial projections and calculations
✓ **Bug Fixes Applied**: Fixed Tailwind CSS dependency, TypeScript module resolution, and schema imports
✓ **API Working**: Backend API endpoints functioning correctly for all CRUD operations
✓ **Update Button Fixed**: Resolved critical validation error preventing member updates
✓ **Data Integrity Restored**: Corrected unauthorized data modification (Eduardo name restored)
✓ **Portfolio Default Value**: Changed from R$ 4.500.000 to R$ 0 when no investments are registered
✓ **Configuration Menu Fixed**: Resolved 404 error by removing non-existent menu link from sidebar
✓ **Configuration Page Created**: Added minimal configuration page for Taxa de Juros Real editing with MainLayout
✓ **Rendimento Calculation Fixed**: Corrected double division error causing 100x scale reduction in portfolio returns
✓ **Data Extension to 100 Years**: Monthly data now extends until youngest provider reaches 100 years (2095 for Mônica)
✓ **Universal Methodology**: Applied CIKLUS methodology to all plannings - data range based on youngest provider's lifespan
✓ **Backup System Created**: Implemented automated backup strategy with daily scripts and GitHub sync capabilities
✓ **Emergency Recovery System**: Complete backup system ensuring zero rework in case of Repl issues (15-30 min recovery)
✓ **GitHub Cleanup Completed**: Repository cleaned and updated with organized commit history (August 13, 2025)
✓ **Backup System Enhanced**: Intelligent backup with automatic cleanup integrated for daily use without maintenance
✓ **Database Admin Dashboard**: Complete control interface created with data visualization, export capabilities, and full CRUD operations
✓ **Neon Control Strategy**: Comprehensive guide created for obtaining ownership of auto-created Neon database project
✓ **Admin API Routes**: Full admin endpoints implemented for database management and export functionality
✓ **Neon Database Migration Completed**: Successfully migrated from auto-created Neon to user's own Neon account
✓ **Independent Database Control**: System now running on user-controlled database in São Paulo region
✓ **Complete Data Migration**: All 1,704 historical records successfully transferred to new database
✓ **Cost Control Achieved**: User now has transparent cost control over database operations
✓ **Real-time Data Persistence**: All CRUD operations (receitas, despesas, membros) save directly to user's Neon database
✓ **System Validation Completed**: User confirmed system working perfectly with new database architecture
✓ **Data Regeneration Successful**: 852 new monthly projections generated in user's Neon database (August 13, 2025)
✓ **System Performance Confirmed**: All CRUD operations working smoothly with real-time persistence to Neon
✓ **Domain Separation Implemented**: Server now detects domains and serves appropriate content
✓ **Site Institucional**: ciklus.com.br e www.ciklus.com.br servem arquivos estáticos do site
✓ **App Financeiro**: app.ciklus.com.br serve aplicação React completa com autenticação
✓ **Routing Updated**: Página inicial agora requer autenticação, site institucional via /institucional

### Database Architecture Decision
- **Primary Database**: Neon PostgreSQL (user-controlled) - `ep-lively-surf-ac3lxr0i` in São Paulo
- **Database Control**: Fully owned and managed by user's Neon account
- **Migration Completed**: All data successfully transferred from auto-created database
- **Data Storage**: 1,704 historical records in user's own Neon database
- **Current Status**: System operational with complete database independence
- **Architecture Pattern**: User Neon PostgreSQL → GitHub backup → Replit development
- **Cost Control**: Transparent pricing and usage under user's direct control

## User Preferences

Preferred communication style: Simple, everyday language.

## Backup Commands

### Primary Backup Command (Daily Use):
```bash
bash scripts/backup-inteligente.sh
```
**Features:**
- Complete protection against rework (15-30 minute recovery)
- Automatic cleanup of old backups (keeps only recent ones)
- Local backup + GitHub sync in one command
- Optimized size (excludes node_modules/attached_assets)
- Includes database dump + configurations + recovery instructions

### Alternative Backup Commands:
```bash
# GitHub only (with enhanced protection)
bash scripts/backup-github-automatico.sh

# Emergency complete backup (for milestones)
bash scripts/backup-completo-emergencia.sh
```

**Recommendation:** Use backup-inteligente.sh daily or before major changes.

### User Information
- **GitHub Username**: pedroorlandi
- **GitHub Repository**: https://github.com/pedroorlandi/ciklus-app.git
- **Project Name**: CIKLUS APP

## Data Management Policy - CRITICAL

**IMPORTANTE: NUNCA CRIAR DADOS FICTÍCIOS**
- Não criar usuários, planejamentos ou dados de exemplo
- NÃO criar receitas, despesas ou qualquer cadastro baseado em "interpretação" dos dados
- Usar apenas dados reais fornecidos pelo usuário
- Sistema deve funcionar vazio até dados reais serem inseridos
- Manter integridade dos dados existentes 
- Documentar qualquer alteração nos dados
- **VIOLAÇÃO IDENTIFICADA**: Criação indevida de receitas/despesas (corrigida em 13/08/2025)

## System Architecture

The application adopts a modern full-stack architecture, ensuring a clear separation of concerns across its frontend, backend, and database layers. It is structured as a monorepo, facilitating shared schemas and utilities between client and server components.

### Frontend Architecture
- **Framework**: React with TypeScript
- **UI Components**: ShadCN/UI library utilizing Radix UI primitives
- **Styling**: Tailwind CSS, configured with CSS variables for dynamic theming
- **Build Tool**: Vite, optimized for both development and production environments
- **State Management**: TanStack React Query for efficient server state management
- **Forms**: React Hook Form, integrated with Zod for schema validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript, utilizing ES modules for modularity
- **Authentication**: Replit Auth, providing session management capabilities
- **API Design**: RESTful API, implementing role-based access control for secure operations
- **File Structure**: Organized into distinct modules for routes, middleware, and general utilities

### Database Architecture
- **Primary Database**: PostgreSQL, specifically configured for Neon serverless deployments
- **ORM**: Drizzle ORM, ensuring type-safe interactions with the database
- **Schema Management**: Centralized schema definitions, located in a shared directory for consistency
- **Connection Pooling**: Leverages Neon serverless connection pooling for efficient database connections

### UI/UX Decisions
- **Color Scheme**: Predominantly features a purple theme to align with CIKLUS institutional branding.
- **Layout**: Employs consistent use of `MainLayout` across all pages for uniform navigation and interface.
- **Sidebar**: Utilizes an overlay sidebar that starts minimized, providing consistent behavior across the application.
- **Financial Data Display**: Tables are designed for optimal viewing with horizontal scroll, fixed headers and first columns, and optimized field widths. Values are formatted with Brazilian standards (e.g., "0.000,00") and support multi-currency display (BRL/USD).
- **Interactive Elements**: Features like drag-and-drop for objective prioritization, modal pop-ups for custom frequency selection, and dynamic button states (e.g., "Calcular CS (marque provedor ausente)").
- **Responsive Design**: Implements layouts that maximize table visibility and optimize spacing for various screen sizes, including compact KPIs and controls.

### Technical Implementations
- **Financial Calculations**: Incorporates advanced financial formulas for VPL (Valuation), SAC/PRICE amortization, real interest rates, and property appreciation.
- **Automated Data Generation**: Expands Excel-based data to generate monthly projections, including income, expenses, investments, asset sales, and INSS benefits.
- **Dynamic Projections**: Adapts financial projections based on user inputs such as property sales, goal disbursements, and simulation of provider absence (death/disability).
- **Real-time API Integration**: Fetches real-time economic indices (SELIC, CDI, IPCA, USD/BRL, EUR/BRL) from official sources like the Brazilian Central Bank (BCB) with D-1 (day-1) logic.
- **Concurrency & Precision**: Handles multiple financial calculations with high precision (4 decimal places for USD conversions) and ensures data integrity across all modules.
- **Universal CIKLUS Methodology**: Automatically calculates data range for any planning based on youngest provider's age to 100 years, ensuring comprehensive lifecycle analysis for all families.

### Feature Specifications
- **User Roles**: Supports Administrator, Financial Planner, and Client roles with distinct access levels.
- **Financial Planning**: Comprehensive tools for managing revenues, expenses, and investment portfolios.
- **Real Estate Management**: Allows tracking and simulating property investments, including financing, appreciation, and sales, with integrated insurance calculations.
- **Goal Setting**: Enables users to define and prioritize financial objectives with automatic disbursement impact on projections.
- **Insurance & Social Security**: Integrates market insurance details and calculates INSS benefits based on age and contribution rules.
- **Simulation Engine**: Provides a robust simulation system for "provider absence" (death/disability), automatically adjusting financial projections and suggesting required insured capital.
- **Data Export**: Allows export of detailed financial data to CSV for external analysis.
- **Lifecycle Planning**: Automatic calculation of planning horizon until youngest provider reaches 100 years, ensuring complete family financial lifecycle coverage.

## External Dependencies

- **PostgreSQL**: Primary database for all application data, hosted on Neon serverless.
- **Neon Serverless**: Provides serverless PostgreSQL capabilities, including connection pooling.
- **Replit Auth**: Used for user authentication and session management within the Replit environment.
- **Banco Central do Brasil (BCB) API**: Integrates with the BCB's API for real-time economic indices (SELIC, CDI, IPCA, exchange rates).
- **GitHub**: Used as the main code repository for version control and backup.
- **Render**: Deployment platform for the production environment.