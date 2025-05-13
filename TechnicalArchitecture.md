# Internal Portal: Technical Architecture Document

## System Architecture Overview

![System Architecture](./assets/system_architecture.png)

The Internal Portal follows a modern microservices-based architecture with the following key components:

### Frontend Layer
- **Single Page Application (SPA)** built with React and TypeScript
- **Component Library** using Chakra UI for consistent design
- **State Management** with Redux Toolkit for global state and React Query for server state
- **Client-side Routing** via React Router with code splitting for performance
- **Progressive Web App (PWA)** capabilities for offline access to certain features

### API Gateway Layer
- **Express.js API Gateway** for routing and request handling
- **Authentication Middleware** for JWT validation and role-based access
- **Rate Limiting** to prevent abuse
- **Request Validation** using Joi/Zod schemas
- **API Documentation** via Swagger/OpenAPI

### Service Layer
- **User Service** - Authentication, authorization, and user management
- **Project Service** - Project CRUD and management
- **Developer Service** - Developer profiles and metrics
- **Integration Service** - Third-party integrations (Jira, GitHub, etc.)
- **Reporting Service** - Report generation and analytics
- **Notification Service** - Handling all types of notifications

### Data Layer
- **MongoDB** as the primary database with Mongoose ODM
- **Redis** for caching and session management
- **AWS S3** (or equivalent) for file storage
- **Time Series Database** for metrics and monitoring (optional - InfluxDB/TimescaleDB)

### Integration Layer
- **API Connectors** for external services (Jira, GitHub, Figma, etc.)
- **Webhook Handlers** for receiving real-time updates
- **OAuth Clients** for authentication with external services
- **ETL Pipelines** for data synchronization

## Detailed Component Design

### Frontend Architecture

#### Core Components
- **Layout Components** - Page templates, navigation, and common UI elements
- **Feature Components** - Specific functionality modules (Project Dashboard, Developer Profile, etc.)
- **UI Components** - Reusable UI elements (buttons, forms, cards, etc.)
- **Data Visualization Components** - Charts, graphs, and dashboards

#### State Management
- **Global State** - User authentication, app settings, and global UI state
- **Server State** - Cached API responses, query invalidation, and optimistic updates
- **Local Component State** - UI interactions and form states

#### Performance Optimizations
- **Code Splitting** - Lazy loading of routes and heavy components
- **Memoization** - React.memo, useMemo, and useCallback for expensive operations
- **Virtual Lists** - For rendering large datasets efficiently
- **Image Optimization** - Lazy loading and responsive images

### Backend Architecture

#### API Gateway Design
```
/api
├── /auth
│   ├── /login
│   ├── /register
│   ├── /refresh-token
│   └── /logout
├── /users
│   ├── /profile
│   ├── /:id
│   └── /:id/metrics
├── /projects
│   ├── /
│   ├── /:id
│   ├── /:id/developers
│   └── /:id/metrics
├── /developers
│   ├── /
│   ├── /:id
│   ├── /:id/projects
│   └── /:id/metrics
├── /integrations
│   ├── /jira
│   ├── /github
│   └── /figma
├── /reports
│   ├── /templates
│   ├── /scheduled
│   └── /generate
└── /notifications
    ├── /unread
    ├── /mark-read
    └── /preferences
```

#### Microservices Design

**User Service**
- **Responsibilities**:
  - User authentication and authorization
  - User profile management
  - Role and permission management
- **Endpoints**:
  - `POST /login` - Authenticate user
  - `POST /register` - Register new user
  - `GET /profile` - Get user profile
  - `PUT /profile` - Update user profile
  - `GET /users` - List users (admin only)
  - `GET /users/:id` - Get user by ID

**Project Service**
- **Responsibilities**:
  - Project CRUD operations
  - Project assignment management
  - Project metrics and analytics
- **Endpoints**:
  - `GET /projects` - List projects
  - `POST /projects` - Create new project
  - `GET /projects/:id` - Get project details
  - `PUT /projects/:id` - Update project
  - `DELETE /projects/:id` - Delete project
  - `GET /projects/:id/developers` - List assigned developers
  - `POST /projects/:id/developers` - Assign developer to project

**Developer Service**
- **Responsibilities**:
  - Developer profile management
  - Developer metrics and performance tracking
  - Skill and availability management
- **Endpoints**:
  - `GET /developers` - List developers
  - `GET /developers/:id` - Get developer details
  - `PUT /developers/:id` - Update developer profile
  - `GET /developers/:id/projects` - List assigned projects
  - `GET /developers/:id/metrics` - Get performance metrics

**Integration Service**
- **Responsibilities**:
  - Third-party service connections
  - Data synchronization
  - Webhook handling
- **Endpoints**:
  - `GET /integrations` - List active integrations
  - `POST /integrations/:service` - Connect new integration
  - `GET /integrations/:service/status` - Check integration status
  - `POST /integrations/:service/sync` - Trigger manual sync
  - `POST /webhooks/:service` - Webhook endpoint for incoming data

**Reporting Service**
- **Responsibilities**:
  - Report generation and scheduling
  - Data aggregation and analysis
  - Export functionality
- **Endpoints**:
  - `GET /reports/templates` - List report templates
  - `POST /reports/generate` - Generate ad-hoc report
  - `GET /reports/scheduled` - List scheduled reports
  - `POST /reports/scheduled` - Create scheduled report
  - `GET /reports/:id` - Get generated report

**Notification Service**
- **Responsibilities**:
  - Notification generation and delivery
  - Notification preferences
  - Email/Slack/etc. integration
- **Endpoints**:
  - `GET /notifications` - List notifications
  - `PUT /notifications/:id/read` - Mark notification as read
  - `GET /notifications/unread/count` - Get unread count
  - `PUT /notifications/preferences` - Update notification preferences

#### Database Models

**User Model**
```javascript
{
  _id: ObjectId,
  email: String,
  password: String, // Hashed
  firstName: String,
  lastName: String,
  role: String, // 'admin', 'developer', 'teamLead', 'client'
  permissions: [String],
  avatar: String, // URL to avatar image
  title: String, // Job title
  department: String,
  skills: [{
    name: String,
    level: Number // 1-5
  }],
  joinedAt: Date,
  lastActive: Date,
  settings: {
    theme: String,
    notifications: Object,
    dashboardLayout: Object
  },
  integrations: {
    github: { username: String, token: String },
    jira: { email: String, token: String },
    // Other integrations
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Project Model**
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  client: {
    name: String,
    contactPerson: String,
    contactEmail: String
  },
  status: String, // 'active', 'paused', 'completed'
  startDate: Date,
  endDate: Date,
  tags: [String],
  techStack: [String],
  externalLinks: {
    figma: String,
    github: String,
    jira: String,
    documentation: String
  },
  team: [{
    userId: ObjectId, // Ref to User
    role: String, // 'developer', 'teamLead', 'qa', etc.
    allocation: Number, // Percentage of time allocated
    joinedAt: Date
  }],
  metrics: {
    progress: Number, // Percentage completion
    health: String, // 'good', 'warning', 'critical'
    velocity: Number, // Story points per sprint
    bugCount: Number
    // Other metrics
  },
  documents: [{
    name: String,
    type: String,
    url: String,
    uploadedBy: ObjectId, // Ref to User
    uploadedAt: Date
  }],
  createdBy: ObjectId, // Ref to User
  createdAt: Date,
  updatedAt: Date
}
```

**Metric Model**
```javascript
{
  _id: ObjectId,
  entityType: String, // 'developer', 'project', 'team'
  entityId: ObjectId, // Ref to entity
  metricType: String, // 'velocity', 'bugs', 'commits', etc.
  value: Number,
  unit: String, // 'points', 'count', 'percentage', etc.
  timestamp: Date,
  source: String, // 'jira', 'github', 'manual', etc.
  metadata: Object // Additional context
}
```

**Report Model**
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  type: String, // 'developer', 'project', 'team', 'custom'
  filters: Object, // Query filters
  dateRange: {
    start: Date,
    end: Date
  },
  schedule: {
    frequency: String, // 'daily', 'weekly', 'monthly'
    day: Number, // Day of week/month
    time: String, // HH:MM format
    timezone: String,
    recipients: [String] // Emails
  },
  createdBy: ObjectId, // Ref to User
  lastGenerated: Date,
  outputs: [{
    format: String, // 'pdf', 'csv', 'json'
    url: String,
    generatedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

**Notification Model**
```javascript
{
  _id: ObjectId,
  recipient: ObjectId, // Ref to User
  type: String, // 'project_update', 'mention', 'deadline', etc.
  title: String,
  message: String,
  linkTo: String, // App URL to navigate to
  read: Boolean,
  readAt: Date,
  metadata: Object, // Additional context
  createdAt: Date
}
```

## Integration Implementations

### Jira Integration
- **Authentication**: OAuth 2.0 or Personal Access Token
- **Data Synchronization**:
  - Tickets/Issues
  - Sprints and releases
  - Comments and status changes
- **Scheduled Jobs**:
  - Hourly sync of active tickets
  - Daily sync of historical data
  - Weekly sync of project metrics
- **Webhook Handlers**:
  - Real-time updates for ticket changes
  - Sprint start/end events
  - Comment notifications

### GitHub Integration
- **Authentication**: OAuth 2.0 or GitHub App
- **Data Synchronization**:
  - Repositories and branches
  - Commits and pull requests
  - Code reviews and comments
- **Scheduled Jobs**:
  - Hourly sync of recent commits
  - Daily sync of PR statistics
  - Weekly code quality metrics
- **Webhook Handlers**:
  - Push events
  - Pull request status changes
  - Deployment events

### Figma Integration
- **Authentication**: OAuth 2.0 or API Key
- **Data Synchronization**:
  - Design files and frames
  - Comments and feedback
  - Version history
- **Features**:
  - File previews in project dashboard
  - Design system alignment checking
  - Design-to-implementation tracking

## Security Implementation

### Authentication Flow
1. **Login Flow**:
   - User submits credentials
   - Server validates credentials
   - Server issues JWT with short expiry (15 minutes)
   - Server issues refresh token with longer expiry (7 days)
   - Refresh token stored in HTTP-only, secure cookie
   - JWT stored in memory (not in localStorage)

2. **Token Refresh Flow**:
   - Client detects expired JWT
   - Client sends refresh token to server
   - Server validates refresh token
   - Server issues new JWT and optionally new refresh token
   - Old refresh token invalidated

3. **Logout Flow**:
   - Client sends logout request with refresh token
   - Server invalidates refresh token
   - Client clears JWT from memory
   - Server responds with successful logout

### Authorization Implementation
- **Role-Based Access Control (RBAC)**:
  - Predefined roles (Admin, Developer, Team Lead, Client)
  - Custom permission sets for fine-grained control
  - Route middleware for checking permissions
  - Component-level permission checks

- **Sensitive Data Protection**:
  - PII encryption
  - Token rotation for third-party services
  - Audit logging for sensitive actions

## Performance Optimizations

### API Performance
- **Caching Strategy**:
  - Redis cache for frequently accessed data
  - Cache invalidation on data updates
  - Configurable TTL based on data volatility

- **Query Optimization**:
  - Indexed MongoDB collections
  - Projection to limit returned fields
  - Pagination for large result sets
  - Aggregation pipeline optimization

### Frontend Performance
- **Bundle Optimization**:
  - Code splitting by route and feature
  - Tree shaking for unused code
  - Dependency optimization
  - Resource hinting and preloading

- **Rendering Optimization**:
  - Virtualized lists for large datasets
  - Incremental rendering for complex views
  - Memoization for expensive calculations
  - Skeleton screens for loading states

## Deployment Architecture

### Development Environment
- Local development setup with Docker Compose
- Mock API services for third-party integrations
- Hot reloading for frontend development
- Seeded test data

### Staging Environment
- Deployed to cloud provider with CI/CD
- Connected to test instances of third-party services
- Automated testing and integration verification
- Performance monitoring

### Production Environment
- Highly available cloud deployment
- Horizontal scaling for API services
- CDN for static assets
- Regular backups and disaster recovery
- Comprehensive monitoring and alerting

## Monitoring and Observability

### Application Monitoring
- **Error Tracking**:
  - Sentry for frontend and backend errors
  - Error categorization and prioritization
  - Automated alerts for critical errors

- **Performance Monitoring**:
  - New Relic or Datadog for APM
  - Custom metrics for business-critical functions
  - Tracing for complex request flows

### Infrastructure Monitoring
- **Resource Utilization**:
  - CPU, memory, and disk usage
  - Database performance metrics
  - Network throughput and latency

- **Health Checks**:
  - Service availability monitoring
  - Database connectivity checks
  - Third-party integration status

### Logging Strategy
- **Log Aggregation**:
  - ELK stack or cloud-based logging solution
  - Structured log format with context
  - Log retention policies

- **Audit Logging**:
  - Security-relevant actions
  - Administrative functions
  - Data access and modifications

## Future Extensibility

### Scalability Considerations
- **Horizontal Scaling**:
  - Stateless services for easy replication
  - Load balancing across instances
  - Database sharding preparation

- **Vertical Scaling**:
  - Resource optimization for individual services
  - Performance profiling and bottleneck identification
  - Efficient database query patterns

### Feature Extension Points
- **Plugin Architecture**:
  - Integration adapters for additional services
  - Custom report generators
  - Dashboard widget framework

- **API Versioning**:
  - Backward compatibility guarantees
  - Deprecation strategy
  - API evolution guidelines

## Technical Debt Management

### Code Quality Practices
- **Static Analysis**:
  - ESLint and TypeScript strict mode
  - SonarQube or similar for code quality metrics
  - Consistent code style enforcement

- **Testing Strategy**:
  - Unit test coverage targets
  - Integration test automation
  - End-to-end testing for critical flows

### Refactoring Strategy
- Regular refactoring sprints
- Incremental improvements
- Technical debt tracking and prioritization 
