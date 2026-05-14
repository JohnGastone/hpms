# MediTrack — Hospital Patient Management System

A frontend hospital management dashboard built with Next.js, React 19, and Tailwind CSS v4.

## Features

- **Dashboard** — live stats overview (total patients, admitted, critical, observation, bed occupancy) with quick-action shortcuts
- **Patients** — list, search, and filter patients; register new patients via a form; view individual patient detail pages
- **Wards** — bed availability and occupancy by ward (cardiology, neurology, pediatrics, orthopedics, emergency, general)
- **Appointments** — manage and view scheduled appointments
- **Dark mode** — system-aware theme toggle persisted via context
- **Skeleton loading states** — graceful loading UI for all data-fetched views

## Tech stack

| Layer | Library |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Data fetching | TanStack React Query v5 |
| Global state | Zustand v5 |
| Forms | React Hook Form + Zod |
| Font | Montserrat (next/font) |

Data is served from a mock layer (`lib/mockData.ts`) with simulated async latency via `lib/api.ts`.

## Project structure

```
app/
  page.tsx                  # Dashboard
  appointments/             # Appointments page
  patients/
    page.tsx                # Patient list
    [id]/                   # Individual patient detail
    new/                    # Register new patient form
  wards/                    # Ward overview
components/                 # Shared UI (NavBar, PatientCard, StatusBadge, Skeletons…)
context/                    # Auth, React Query, and Theme providers
hooks/                      # usePatientStats
lib/                        # API layer, mock data, TypeScript types
store/                      # Zustand patient store
```

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
