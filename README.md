# Mini CRM Platform

A modern, AI-powered Customer Relationship Management platform built with React, TypeScript, and Supabase. This platform enables businesses to manage customers, create targeted campaigns, segment audiences, and track performance with intelligent insights.

## 🚀 Features

- **Customer Management**: Complete customer database with order history and analytics
- **Campaign Builder**: Create and manage marketing campaigns with AI assistance
- **Smart Segmentation**: Dynamic customer segmentation with rule-based filtering
- **Data Ingestion**: Import customer data and manage bulk operations
- **Analytics Dashboard**: Real-time insights with interactive charts and AI recommendations
- **Campaign History**: Track and analyze campaign performance over time

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React/TypeScript)              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │  Dashboard  │  │  Customers  │  │  Campaigns  │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │  Segments   │  │  Ingestion  │  │   History   │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
├─────────────────────────────────────────────────────────────┤
│                    UI Components (shadcn/ui)                │
├─────────────────────────────────────────────────────────────┤
│                    State Management                         │
│  ┌─────────────────┐  ┌─────────────────────────────────┐ │
│  │  React State    │  │     TanStack Query              │ │
│  │  (Local State)  │  │  (Server State & Caching)      │ │
│  └─────────────────┘  └─────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    API Layer                                │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Supabase Client SDK                       │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │ │
│  │  │     Auth    │  │  Database   │  │   Storage   │   │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │ │
│  └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Backend Services                         │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    Supabase                            │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │ │
│  │  │ PostgreSQL  │  │    Auth     │  │Edge Functions│   │ │
│  │  │  Database   │  │   Service   │  │   (Deno)    │   │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │ │
│  │  ┌─────────────┐  ┌─────────────┐                    │ │
│  │  │   Storage   │  │  Real-time  │                    │ │
│  │  │   Service   │  │ Subscriptions│                    │ │
│  │  └─────────────┘  └─────────────┘                    │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Local Setup Instructions

### Prerequisites
- **Node.js**: Version 18 or higher ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- **npm**: Comes with Node.js
- **Git**: For version control

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - The project uses Supabase for backend services
   - Environment variables are managed through Supabase integration
   - No manual `.env` file setup required for basic functionality

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:8080`
   - The application will automatically reload when you make changes

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🗄️ Database Schema

### Core Tables

- **customers**: Customer profiles and analytics data
- **campaigns**: Marketing campaign definitions and metadata
- **segments**: Dynamic customer segmentation rules
- **orders**: Customer purchase history
- **order_products**: Product details for each order
- **communication_logs**: Campaign delivery tracking
- **events**: System events and activities
- **user_emails**: Email communication records
- **profiles**: User profile information

### Key Database Functions

- `get_matching_customers(p_segment_rules)`: Dynamic customer segmentation
- `update_customer_spend(p_customer_id, p_amount)`: Customer analytics updates
- `update_campaign_stats(p_campaign_id, p_status)`: Campaign performance tracking
- `handle_new_user()`: Automatic profile creation for new users

## 🎯 AI Tools & Integrations

### Intelligent Features

1. **AI-Powered Campaign Insights**
   - Optimal send time recommendations based on customer behavior
   - Engagement prediction algorithms
   - Performance optimization suggestions

2. **Smart Customer Segmentation**
   - Machine learning-driven customer categorization
   - Behavioral pattern recognition
   - Predictive customer lifetime value

3. **Dynamic Rule Engine**
   - Complex segmentation rules with multiple conditions
   - Real-time customer matching
   - Performance-optimized database queries

4. **Predictive Analytics**
   - Customer churn prediction
   - Revenue impact forecasting
   - Win-back opportunity identification

### Data Processing

- **Real-time Analytics**: Live dashboard updates with WebSocket connections
- **Batch Processing**: Efficient bulk data operations
- **Performance Monitoring**: Campaign delivery rate tracking

## 🚦 Known Limitations & Assumptions

### Current Limitations

1. **Authentication Dependency**
   - Full functionality requires Supabase authentication setup
   - Row Level Security policies enforce user-based data access
   - Demo data is limited without proper auth configuration

2. **Email Delivery**
   - Campaign sending functionality requires external email service integration
   - Currently simulated for demonstration purposes
   - Production deployment needs SMTP configuration

3. **Scalability Considerations**
   - Database queries are optimized for moderate data volumes (< 100K customers)
   - Large-scale deployments may require query optimization
   - Real-time features may need performance tuning for high traffic

4. **Browser Compatibility**
   - Optimized for modern browsers (Chrome, Firefox, Safari, Edge)
   - IE11 and older browsers are not supported
   - Mobile responsiveness is implemented but may need refinement
## 🔧 Configuration

### Environment Variables (Managed by Supabase Integration)

The application uses the following secrets managed through Supabase:
- `SUPABASE_URL`: Database connection endpoint
- `SUPABASE_ANON_KEY`: Public API key for client operations
- `SUPABASE_SERVICE_ROLE_KEY`: Admin operations key
- `SUPABASE_DB_URL`: Direct database connection string

## 📖 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Dashboard.tsx   # Main analytics dashboard
│   ├── Customers.tsx   # Customer management
│   ├── CampaignBuilder.tsx
│   └── ...
├── pages/              # Route components
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── App.tsx             # Main application component
```
## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
