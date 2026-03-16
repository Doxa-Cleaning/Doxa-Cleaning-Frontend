# Doxa Cleaning — Frontend

A React-based job management dashboard for a small cleaning business. Built as a full-stack capstone project by Emiliano Canseco III.

## Live Demo
[Coming soon after deployment]

## GitHub
- Frontend: https://github.com/Emiliano-Canseco-III/Doxa-Cleaning-Frontend
- Backend: https://github.com/Emiliano-Canseco-III/Doxa-Cleaning-Backend

## Tech Stack
- React 18 (Vite)
- React Router DOM
- Custom Hooks Architecture
- CSS Variables + BEM naming convention

## Features
### Admin
- Create, edit, and delete jobs
- Assign jobs to employees
- Add notes to jobs
- Create and delete employees
- Filter jobs by employee
- View employee list panel with active job counts
- Stats bar showing pending, in-progress, and completed job counts

### Employee
- View assigned jobs
- Start jobs (sets status to in-progress)
- Mark jobs as completed

## Architecture
The app uses a three-layer custom hook pattern to separate concerns:

- `useDataLogic` — fetches and stores all data from the API
- `useModals` — manages all modal open/close state
- `useFunctionLogic` — contains all handlers and computed values

Components are kept as pure display layers that receive props and emit events upward.

## Getting Started

### Prerequisites
- Node.js
- Backend server running on port 3000

### Installation
```bash
git clone https://github.com/Emiliano-Canseco-III/Doxa-Cleaning-Frontend
cd Doxa-Cleaning-Frontend
npm install
npm run dev
```

App runs at http://localhost:5173

## Test Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@doxacleaning.com | admin123 |
| Employee | john@doxacleaning.com | admin123 |
| Employee | sarah@doxacleaning.com | admin123 |
