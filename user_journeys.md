# Internal Portal: User Journeys

This document outlines the primary user journeys for different roles within the Internal Portal application. It helps to understand how users will interact with the system and what their goals are.

## Admin User Journeys

### Journey 1: Onboarding a New Project

**Goal**: Add a new client project and set up the team

1. **Login to Portal**
   - **Action**: Enter credentials or use SSO
   - **Expectation**: Quick access to admin dashboard
   - **Potential Pain Point**: Authentication issues

2. **Create New Project**
   - **Action**: Navigate to Projects section and click "Add New Project"
   - **Action**: Fill in project details (name, description, client, timeline, etc.)
   - **Action**: Upload relevant documents (requirements, contracts)
   - **Expectation**: Simple form with validation
   - **Potential Pain Point**: Too many required fields

3. **Configure External Links**
   - **Action**: Add links to GitHub repository, Figma designs, Jira board
   - **Expectation**: Connection validation
   - **Potential Pain Point**: Integration errors

4. **Assign Team Members**
   - **Action**: Search for available developers
   - **Action**: Add developers with specific roles and allocation percentages
   - **Expectation**: Clear visibility of developer availability
   - **Potential Pain Point**: Scheduling conflicts

5. **Review Project Setup**
   - **Action**: Preview project dashboard
   - **Action**: Make adjustments as needed
   - **Expectation**: Comprehensive overview
   - **Potential Pain Point**: Missing information

6. **Send Team Notifications**
   - **Action**: Trigger onboarding notification to team
   - **Expectation**: Automatic notifications
   - **Potential Pain Point**: Notification failures

**Success Metrics**:
- Time to set up a new project < 10 minutes
- All required information captured
- Team successfully notified
- External integrations working correctly

### Journey 2: Generating Performance Reports

**Goal**: Create and share developer performance metrics

1. **Access Reporting Module**
   - **Action**: Navigate to Reports section
   - **Expectation**: See available report templates
   - **Potential Pain Point**: Too many options

2. **Select Report Type**
   - **Action**: Choose "Developer Performance" report
   - **Expectation**: Clear template options
   - **Potential Pain Point**: Unclear naming conventions

3. **Configure Report Parameters**
   - **Action**: Select date range, developers, and metrics to include
   - **Action**: Choose visualization preferences
   - **Expectation**: Intuitive customization options
   - **Potential Pain Point**: Complex configuration

4. **Generate and Preview Report**
   - **Action**: Submit report generation request
   - **Action**: Review generated report
   - **Expectation**: Fast generation, clear visualization
   - **Potential Pain Point**: Long processing time

5. **Export or Schedule Report**
   - **Action**: Download as PDF/CSV or set up recurring schedule
   - **Action**: Add recipients if scheduling
   - **Expectation**: Multiple format options
   - **Potential Pain Point**: Format compatibility issues

**Success Metrics**:
- Report generation time < 30 seconds
- Data accuracy
- Useful visualizations
- Successful scheduling/delivery

## Developer User Journeys

### Journey 1: Daily Dashboard Check-in

**Goal**: Get up to speed on assigned projects and tasks

1. **Login to Portal**
   - **Action**: Enter credentials or use SSO
   - **Expectation**: Remember me function
   - **Potential Pain Point**: Session timeouts

2. **View Personal Dashboard**
   - **Action**: Land on personalized dashboard
   - **Expectation**: See active projects, pending tasks, notifications
   - **Potential Pain Point**: Information overload

3. **Check Project Updates**
   - **Action**: Review recent activities on assigned projects
   - **Expectation**: Chronological activity feed
   - **Potential Pain Point**: Missing context

4. **View Personal Metrics**
   - **Action**: Check performance indicators
   - **Expectation**: Clear, non-judgmental metrics
   - **Potential Pain Point**: Unclear metric definitions

5. **Access Assigned Tasks**
   - **Action**: View current Jira tickets
   - **Action**: Sort by priority or deadline
   - **Expectation**: Direct links to Jira
   - **Potential Pain Point**: Sync delays with Jira

**Success Metrics**:
- Time to get fully updated < 5 minutes
- All relevant information visible
- Clear next actions identified

### Journey 2: Updating Project Status

**Goal**: Provide updates on project progress

1. **Select Project**
   - **Action**: Navigate to project from dashboard
   - **Expectation**: Quick access to assigned projects
   - **Potential Pain Point**: Too many clicks

2. **Review Current Status**
   - **Action**: Check project timeline and milestones
   - **Action**: View recent team updates
   - **Expectation**: Clear status indicators
   - **Potential Pain Point**: Outdated information

3. **Add Status Update**
   - **Action**: Click "Add Update" button
   - **Action**: Enter progress details, blockers, next steps
   - **Expectation**: Rich text editor with templates
   - **Potential Pain Point**: Limited formatting options

4. **Attach Evidence/Links**
   - **Action**: Add screenshots, links, or references
   - **Expectation**: Easy upload/paste functionality
   - **Potential Pain Point**: File size limitations

5. **Submit Update**
   - **Action**: Post update to project feed
   - **Expectation**: Instant publishing
   - **Potential Pain Point**: Submission errors

**Success Metrics**:
- Update submission time < 3 minutes
- Team notification of update
- Clear information sharing

## Team Lead User Journeys

### Journey 1: Resource Planning

**Goal**: Allocate team members efficiently across projects

1. **Access Team Dashboard**
   - **Action**: Navigate to Team section
   - **Expectation**: Overview of team availability
   - **Potential Pain Point**: Incomplete data

2. **View Resource Allocation**
   - **Action**: Open resource planning view
   - **Expectation**: Visual representation of allocation
   - **Potential Pain Point**: Complex visualization

3. **Identify Availability/Overallocation**
   - **Action**: Filter by date range and developer skills
   - **Action**: Spot developers with capacity or overallocation
   - **Expectation**: Clear color-coding and indicators
   - **Potential Pain Point**: Inaccurate availability data

4. **Adjust Assignments**
   - **Action**: Drag-and-drop to reassign resources
   - **Action**: Modify allocation percentages
   - **Expectation**: Real-time updates
   - **Potential Pain Point**: Conflict resolution

5. **Confirm Changes**
   - **Action**: Review and apply changes
   - **Action**: Add notes for context
   - **Expectation**: Validation checks
   - **Potential Pain Point**: Notification overload

**Success Metrics**:
- Balanced allocation across team
- No critical overallocation
- Team member notification
- Accurate project timeline updates

### Journey 2: Sprint Planning and Review

**Goal**: Plan upcoming sprint and review previous sprint performance

1. **Access Project Sprint View**
   - **Action**: Navigate to project and select Sprint tab
   - **Expectation**: Current and upcoming sprint information
   - **Potential Pain Point**: Synchronization with Jira

2. **Review Previous Sprint**
   - **Action**: Select completed sprint
   - **Action**: View metrics, completion rate, and issues
   - **Expectation**: Comprehensive, actionable data
   - **Potential Pain Point**: Missing context for numbers

3. **Plan New Sprint**
   - **Action**: Create or edit upcoming sprint
   - **Action**: Set goals and allocate tickets
   - **Expectation**: Integration with Jira backlog
   - **Potential Pain Point**: Complex synchronization

4. **Balance Workload**
   - **Action**: Assign tickets to team members
   - **Action**: Check individual workloads
   - **Expectation**: Recommendations based on capacity
   - **Potential Pain Point**: Skill mismatches

5. **Communicate Plan**
   - **Action**: Share sprint plan with team
   - **Action**: Schedule sprint kick-off
   - **Expectation**: Automated notifications
   - **Potential Pain Point**: Calendar integration issues

**Success Metrics**:
- Balanced sprint plan
- All team members with appropriate tasks
- Previous sprint learnings incorporated
- Sprint goals clearly communicated

## Client User Journeys (Phase 2)

### Journey 1: Project Status Review

**Goal**: Get a clear understanding of project progress

1. **Access Client Portal**
   - **Action**: Login with provided credentials
   - **Expectation**: Simplified, branded interface
   - **Potential Pain Point**: Password management

2. **Select Project**
   - **Action**: Choose from available projects
   - **Expectation**: Clear project listing
   - **Potential Pain Point**: Too much information

3. **View Project Dashboard**
   - **Action**: Review high-level progress indicators
   - **Action**: Check timeline and milestones
   - **Expectation**: Non-technical presentation
   - **Potential Pain Point**: Technical jargon

4. **Access Latest Updates**
   - **Action**: Read recent status updates
   - **Expectation**: Curated, client-friendly updates
   - **Potential Pain Point**: Too frequent or infrequent updates

5. **View Deliverables**
   - **Action**: Access shared documents and deliverables
   - **Expectation**: Easy download/preview
   - **Potential Pain Point**: Version confusion

**Success Metrics**:
- Clear understanding of project status
- Appropriate level of detail
- Confidence in project progress
- Reduced need for status meetings

## Cross-functional Journeys

### Journey 1: Cross-project Collaboration

**Goal**: Find and collaborate with developers across different projects

1. **Search for Expertise**
   - **Action**: Use search functionality with skill filters
   - **Expectation**: Accurate developer matching
   - **Potential Pain Point**: Missing skill data

2. **View Developer Profile**
   - **Action**: Access detailed profile with experience and availability
   - **Expectation**: Comprehensive information
   - **Potential Pain Point**: Outdated information

3. **Check Availability**
   - **Action**: View calendar or allocation chart
   - **Expectation**: Clear availability indicators
   - **Potential Pain Point**: Calendar sync issues

4. **Request Collaboration**
   - **Action**: Send collaboration request with details
   - **Expectation**: Template for specific needs
   - **Potential Pain Point**: Approval workflow confusion

5. **Schedule Kick-off**
   - **Action**: Use integrated calendar to find common time
   - **Expectation**: Automatic suggestions
   - **Potential Pain Point**: Notification overload

**Success Metrics**:
- Time to find appropriate resource < 5 minutes
- Successful collaboration establishment
- Clear communication of needs
- Efficient use of shared resources

### Journey 2: Knowledge Transfer & Documentation

**Goal**: Document and share project knowledge

1. **Access Documentation Area**
   - **Action**: Navigate to project's knowledge base
   - **Expectation**: Organized documentation structure
   - **Potential Pain Point**: Navigation complexity

2. **Create New Document**
   - **Action**: Select document type (technical spec, guide, etc.)
   - **Action**: Use template or start from scratch
   - **Expectation**: Rich editing capabilities
   - **Potential Pain Point**: Limited formatting options

3. **Add Collaborators**
   - **Action**: Invite team members to contribute
   - **Expectation**: Permission settings
   - **Potential Pain Point**: Notification management

4. **Link Related Resources**
   - **Action**: Connect document to tickets, code repos, designs
   - **Expectation**: Automatic suggestions
   - **Potential Pain Point**: Broken links over time

5. **Publish and Share**
   - **Action**: Finalize and publish document
   - **Action**: Notify relevant stakeholders
   - **Expectation**: Versioning support
   - **Potential Pain Point**: Discoverability

**Success Metrics**:
- Documentation completion rate
- Knowledge reuse metrics
- Reduced onboarding time for new team members
- Search effectiveness for finding information

## Emotional Journey Mapping

### Admin User Emotional Journey

| Stage | Emotion | Improvement Opportunity |
|-------|---------|-------------------------|
| Login | Neutral | Personalized welcome |
| Project Creation | Focused, Potentially Stressed | Simplified workflow, templates |
| Team Assignment | Concerned about balance | Clear availability visualization |
| Integration Setup | Potentially Frustrated | Connection wizards, validation |
| Reporting | Analytical, Time-pressured | Saved templates, quick generation |
| Decision Making | Confident or Uncertain | Data-backed recommendations |

### Developer Emotional Journey

| Stage | Emotion | Improvement Opportunity |
|-------|---------|-------------------------|
| Login | Routine | Personalized highlights |
| Task Review | Potentially Overwhelmed | Priority sorting, focus mode |
| Status Updates | Rushed, Duty-bound | Quick templates, voice input |
| Performance Review | Anxious or Proud | Constructive framing, improvement focus |
| Collaboration | Engaged or Distracted | Streamlined communication, context |
| End of Day | Accomplished or Concerned | Progress summary, next day prep |

## User Journey Optimization Opportunities

1. **Automate Routine Tasks**
   - Auto-generate status reports based on commits and tickets
   - Pre-fill forms with likely information
   - Smart defaults based on past behavior

2. **Reduce Context Switching**
   - Integrate external tools' core functionality
   - Batch notifications intelligently
   - Maintain context between sessions

3. **Improve Information Hierarchy**
   - Personalize dashboards by role and preference
   - Progressive disclosure of complex information
   - Focus modes for different tasks

4. **Enhance Collaboration**
   - Real-time collaboration features
   - Clear ownership and responsibility indicators
   - Integrated communication with context

5. **Support Decision Making**
   - Data visualization at decision points
   - Historical trends and predictions
   - Impact analysis of potential choices 