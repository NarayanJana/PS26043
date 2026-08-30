# PS26043 — Societal Innovation Collaboration Platform

> **A digital platform to crowdsource societal challenges and facilitate collaborative problem solving through universities and industry partnerships.**

## Overview

**PS26043** is a Jharkhand-focused digital platform designed to transform real-world societal problems into collaborative, technology-driven solutions.

Citizens and communities can submit challenges related to areas such as agriculture, healthcare, education, water management, sanitation, environment, accessibility, rural livelihoods, urban infrastructure, and public services.

The platform uses **AI-assisted problem analysis** to categorize challenges, identify their priority and required expertise, and detect potentially similar problems. Validated challenges can then be matched with suitable universities, where students and faculty can develop solutions with support from industries, startups, MSMEs, CSR organizations, and other partners.

Government authorities can monitor the complete ecosystem through dashboards and analytics, from problem submission to project development, deployment, and measurable social impact.

---

## Problem Statement

### Problem Statement ID: 26043

**Title:**
*A digital platform to crowdsource societal challenges and facilitate collaborative problem solving through universities and industry partnerships.*

### Organization

**Government of Jharkhand**
**Department of Higher & Technical Education**

### Category

**Software**

### Theme

**Smart Education**

---

## Our Solution

The platform creates a structured ecosystem connecting four primary stakeholders:

* **Citizens / Communities** — Identify and submit real-world societal problems.
* **Government** — Validate challenges, monitor projects, and measure social impact.
* **Universities / HEIs** — Review challenges, form multidisciplinary teams, and develop solutions.
* **Industry / Startups / MSMEs** — Provide funding, mentorship, technology, testing, prototyping, and deployment support.

An **Admin** role is also provided for platform-level management, including users, organizations, categories, permissions, and system administration.

---

## End-to-End Workflow

```text
Citizen Identifies Problem
          ↓
Challenge Submission
          ↓
AI-Powered Analysis
          ↓
Classification + Priority + Expertise
          ↓
Duplicate / Similarity Detection
          ↓
Government Validation
          ↓
University Matching
          ↓
University Accepts Challenge
          ↓
Project Creation
          ↓
Student + Faculty Team
          ↓
Prototype & Development
          ↓
Industry Collaboration
          ↓
Testing & Pilot
          ↓
Deployment
          ↓
Social Impact Measurement
          ↓
Government Analytics
```

---

## Key Features

### 1. Citizen Engagement

Citizens can:

* Register and log in
* Submit societal challenges
* Add detailed problem descriptions
* Provide district and location information
* Upload photos, videos, and documents
* Specify the number of people affected
* Add expected solutions
* Track challenge status
* View submitted challenges

---

### 2. AI-Powered Problem Analysis

The platform is designed to use an LLM-based AI service to analyze submitted challenges.

AI-assisted capabilities include:

* Problem classification
* Sub-category identification
* Problem summarization
* Priority recommendation
* Keyword extraction
* Required expertise identification
* Similar problem detection

Example:

```json
{
  "category": "Agriculture",
  "subCategory": "Irrigation",
  "priority": "High",
  "summary": "Farmers are facing inadequate irrigation facilities.",
  "keywords": [
    "irrigation",
    "agriculture",
    "water management"
  ],
  "requiredExpertise": [
    "Agricultural Engineering",
    "IoT",
    "Water Management"
  ]
}
```

> AI is used as a decision-support mechanism. Human/government validation remains part of the workflow.

---

### 3. Duplicate & Similar Challenge Detection

The platform identifies potentially similar challenges to reduce duplicate submissions.

For example:

```text
Challenge A:
"No clean drinking water in Village X."

Challenge B:
"Residents of Village X do not have access to safe drinking water."

                ↓

Potentially Similar Challenge
Similarity Score: 89%
```

The system can then present the similar challenges for review instead of automatically rejecting a submission.

---

### 4. Intelligent University Matching

Validated challenges are matched with universities based on their capabilities and expertise.

Matching factors can include:

* Academic departments
* Faculty expertise
* Research areas
* Laboratories
* Innovation centres
* Incubation facilities
* Previous projects
* Required challenge expertise

Example:

```text
Challenge Requirements
AI + IoT + Agriculture + Water Management

University A → 91% Match
University B → 84% Match
University C → 76% Match
```

The platform also provides explainable matching indicators such as:

```text
✓ Artificial Intelligence
✓ IoT
✓ Agriculture
✓ Water Management
```

The final assignment can remain subject to institutional/government review rather than being decided solely by AI.

---

### 5. University Collaboration

Universities can:

* View assigned challenges
* Accept or reject challenges
* Create projects
* Form multidisciplinary student teams
* Assign faculty mentors
* Create milestones
* Manage tasks
* Upload project documents
* Track project progress
* Post project updates
* Record project outcomes and impact

---

### 6. Project Lifecycle Management

Each approved challenge can become a structured project.

```text
Research
   ↓
Design
   ↓
Prototype
   ↓
Testing
   ↓
Pilot
   ↓
Deployment
```

Project workspaces can include:

* Overview
* Team
* Faculty Mentor
* Milestones
* Tasks
* Documents
* Industry Partners
* Updates
* Impact

---

### 7. Industry Collaboration

Industry partners, startups, MSMEs, CSR organizations, and other organizations can discover relevant projects and collaborate with universities.

Possible support includes:

* Funding
* Technical mentorship
* Hardware
* Software
* Prototyping
* Testing
* Manufacturing
* Deployment

Collaboration workflow:

```text
Industry Finds Project
        ↓
Expresses Interest
        ↓
Selects Support Type
        ↓
University Reviews
        ↓
Accept / Decline
        ↓
Collaboration
```

---

### 8. Government Dashboard & Analytics

Government authorities can monitor the overall innovation ecosystem.

The dashboard can provide:

* Total challenges
* Validated challenges
* Active projects
* Completed projects
* Deployed solutions
* University participation
* Industry participation
* District-wise challenge distribution
* Domain-wise distribution
* Project completion rates
* Innovation outcomes
* Citizens benefited
* Social impact

Example analytics:

```text
Challenges by District
Challenges by Domain
Project Status
University Participation
Industry Engagement
Deployment Rate
Social Impact
```

---

### 9. Notifications & Communication

The platform supports communication between stakeholders throughout the project lifecycle.

Examples:

```text
Citizen:
"Your challenge has been validated."

University:
"A new challenge matching your expertise is available."

Industry:
"A project matching your support capabilities is available."

Government:
"A project milestone has been completed."
```

---

### 10. Role-Based Access Control

The platform provides role-specific access.

| Role           | Primary Responsibility                          |
| -------------- | ----------------------------------------------- |
| **Citizen**    | Submit and track societal challenges            |
| **University** | Develop solutions and manage projects           |
| **Industry**   | Collaborate and provide support                 |
| **Government** | Validate, monitor and measure impact            |
| **Admin**      | Manage the platform and system-level operations |

---

## Technology Stack

### Frontend

* React
* Vite
* JavaScript
* Tailwind CSS
* React Router
* Redux Toolkit
* Axios
* Lucide React
* Recharts

### Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication
* bcrypt
* Multer

### Database

* MongoDB
* Mongoose

### AI

* LLM API
* AI-assisted classification
* Priority analysis
* Summarization
* Expertise extraction
* Similarity analysis

---

## System Architecture

```text
                   ┌──────────────────────┐
                   │      React + Vite    │
                   │      Frontend        │
                   └──────────┬───────────┘
                              │
                           REST API
                              │
                   ┌──────────▼───────────┐
                   │   Node.js + Express  │
                   │      Backend         │
                   └──────┬───────┬───────┘
                          │       │
              ┌───────────┘       └────────────┐
              ▼                                ▼
     ┌─────────────────┐              ┌─────────────────┐
     │ MongoDB         │              │ AI / LLM API    │
     │ + Mongoose      │              │                 │
     └─────────────────┘              └─────────────────┘
```

---

## Project Structure

```text
PS26043/
│
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── Landing/
│   │   │   ├── Auth/
│   │   │   ├── Citizen/
│   │   │   ├── University/
│   │   │   ├── Industry/
│   │   │   ├── Government/
│   │   │   └── Admin/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── store/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── server/
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   ├── services/
    │   │   ├── ai/
    │   │   ├── matching/
    │   │   └── notifications/
    │   ├── utils/
    │   ├── validators/
    │   └── server.js
    └── package.json
```

---

## Core Data Models

The platform uses MongoDB collections/models for:

```text
User
Challenge
University
IndustryPartner
Project
Milestone
Notification
```

These models represent users, societal challenges, participating organizations, projects, project progress, and stakeholder communication.

---

## Security

The platform incorporates:

* JWT-based authentication
* Password hashing using bcrypt
* Protected routes
* Role-based authorization
* Environment variables for secrets
* Server-side validation
* File upload restrictions
* API-level access control

---

## Jharkhand-Focused Implementation

The initial implementation is focused on **Jharkhand**, in accordance with the problem statement issued by the Government of Jharkhand.

The platform can accommodate challenges from different districts and domains across the state.

The architecture is designed to be scalable so that the same model could potentially be extended to other regions in the future.

---

## Expected Impact

PS26043 aims to create a structured pathway from **community problem identification to real-world solution deployment**.

The platform can help:

* Give citizens a structured voice
* Connect problems with relevant academic expertise
* Encourage experiential learning for students
* Promote multidisciplinary research
* Strengthen university-industry collaboration
* Encourage innovation and entrepreneurship
* Improve utilization of academic resources
* Support government decision-making
* Enable measurable social impact

---

## Vision

```text
REAL-WORLD PROBLEM
        ↓
COLLABORATIVE INNOVATION
        ↓
ACADEMIC + INDUSTRY EXPERTISE
        ↓
PRACTICAL SOLUTION
        ↓
FIELD DEPLOYMENT
        ↓
MEASURABLE SOCIAL IMPACT
```

**PS26043 aims to transform societal challenges from isolated complaints into collaborative innovation projects that can produce measurable, deployable solutions for communities across Jharkhand.**

---

## Status

**Development Status:** Active Development

### Completed

* MERN project setup
* Landing page
* Authentication & authorization
* Database models
* Citizen module
* Challenge management
* Challenge Explorer
* Challenge Details
* Duplicate detection
* University matching
* University dashboard
* Project workspace
* Industry dashboard
* Industry collaboration
* Government dashboard and analytics
* Notifications
* Admin functionality
* Integration and responsive UI work
* Testing and production preparation

### In Progress

* Final AI/LLM API integration and stabilization
* Final UI/UX refinement
* Final end-to-end testing and optimization

---

## Team

**Hackathon Project — PS26043**

Built using the MERN stack for the **Government of Jharkhand — Department of Higher & Technical Education**.

---

## License

This project is developed as a hackathon solution for **Problem Statement 26043**.
