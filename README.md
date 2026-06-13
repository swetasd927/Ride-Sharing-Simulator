# Namlo Rides

Real-Time Ride-Sharing Simulation Platform

A web-based ride-sharing simulation platform built with React that allows real-time interaction between Rider and Driver workflows inside a single application.

The project focuses on real-time synchronization, state management, rendering performance, and clean frontend architecture without using a custom backend server.

## Live Demo

Production URL: https://ride-sharing-simulator.vercel.app/

## Test Credentials

Email: [intern@namlotech.com](mailto:intern@namlotech.com)
Password: namlo2026

## Features

* Login-protected application flow
* Rider and Driver simulation inside one frontend application
* Real-time communication between views
* Interactive map built with React Leaflet
* Ride lifecycle management using a strict state machine
* Ride history persistence using REST API
* Split-screen mode for side-by-side evaluation
* Responsive interface
* Automatic local sync without setup
* Cloud sync support using Supabase Realtime
* CI/CD deployment pipeline using GitHub and Vercel


## Project Structure

```txt
src/
 ├── components
 ├── pages
 ├── services
 ├── hooks
 ├── state
 ├── utils
 ├── types
 └── assets
```

## Tech Stack

Frontend

* React
* Vite
* TypeScript

Realtime Layer

* BroadcastChannel
* Supabase Realtime

Persistence

* REST API
* Beeceptor

Deployment

* Vercel
* GitHub Actions
* CI Yaml

## Local Setup

### Prerequisites

* Node.js v18+

### Installation

```bash
git clone <repository-url>

cd Real_Time_RideSharing

npm install

npm run dev
```

Open:

```bash
http://localhost:5173
```

## Environment Variables

Optional for cloud synchronization.

Create a `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co

VITE_SUPABASE_ANON_KEY=your-anon-key
```

If environment variables are not provided, the application automatically switches to local BroadcastChannel mode.

## System Architecture

### Real-Time Layer

Handles:

* Driver location updates
* Ride status updates
* Rider and Driver synchronization

Uses:

* BroadcastChannel for local simulation
* Supabase Realtime for remote synchronization

### Persistent Layer

Handles:

* Ride completion records
* Cancellation records
* Historical ride storage

REST endpoint:

```txt
https://ride-sharing-challenge.free.beeceptor.com/api/history
```

Local caching is used when the external endpoint is unavailable.

## Ride States

```txt
IDLE
REQUESTING
ACCEPTED
ARRIVED
IN_PROGRESS
COMPLETED
CANCELLED
```

Each state follows one-way transitions to maintain consistency.

## Evaluation Modes

### Split Screen

Rider, Driver, and Map displayed together.

### Rider View

Route selection and ride history.

### Driver View

Availability control and ride execution.

## Performance Considerations

* Memoized updates to reduce rerenders
* Cleanup for intervals and subscriptions
* Channel disposal on unmount
* Lightweight custom SVG map markers
* Efficient state transition handling

## CI/CD

Deployment is automated.

Flow:

```txt
Push to GitHub
↓
Automatic Build
↓
Vercel Deployment
↓
Production Update
```

Every new commit automatically triggers deployment.

## Notes

* No custom backend is used
* All communication happens directly from client to realtime services and REST endpoints
* Designed for real-time simulation and frontend architecture evaluation
