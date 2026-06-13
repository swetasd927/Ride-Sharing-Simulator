# Namlo Rides — Real-Time Ride-Sharing Simulation Platform

A high-fidelity, client-driven real-time ride-sharing simulation platform representing both **Rider** and **Driver** workflows simultaneously. The system uses a hybrid client architecture, combining high-frequency real-time event broadcasting with persistent HTTP REST logging.

---

## Testing Credentials

Access the application routing using these hardcoded credentials on the login screen:
- **Username:** `intern@namlotech.com`
- **Password:** `namlo2026`

---

## Quick Start (Local Run)

Get the application up and running locally in seconds.

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### Commands
```bash
# 1. Clone the repository and navigate to the project directory
cd Real_Time_RideSharing

# 2. Install package dependencies
npm install

# 3. Launch the local Vite development server
npm run dev
```

The application will be served at `http://localhost:5173`. Open this URL in your browser to evaluate the simulation.

---

## Configuration & Real-Time Sync Options

This platform features a **Dual-Mode Sync Layer** designed to work out-of-the-box with zero setup, while supporting full cloud database syncing:

1. **Zero-Config Mode (Recommended for instant evaluation):**
   If no environment variables are defined, the app automatically utilizes a local browser **`BroadcastChannel`** registry. Opening split-screen mode or placing two browser windows side-by-side on your local machine will trigger instant, zero-latency coordinate broadcasts and state transitions locally.
2. **Cloud Database Sync Mode (Supabase Realtime):**
   To sync telemetry across separate remote computers, configure your Supabase project credentials in a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
   The client will detect these keys and automatically pivot from local broadcasts to the remote Supabase Realtime channel.

---

## Technical Architecture & Design Decisions

### 1. Hybrid Data Registry
- **Telemetry Sync (Supabase / BroadcastChannel):** Coordinates the high-frequency stream of driver locations and state shifts. It uses ephemeral broadcasts rather than persistent tables to avoid indexing latency.
- **REST Archive (History Registry):** Fired only on terminal state transitions (`COMPLETED`, `CANCELLED`). Fulfills archiving compliance by POSTing JSON transaction data to an external REST pipeline:
  `https://ride-sharing-challenge.free.beeceptor.com/api/history`
  A robust local cache registry provides fallbacks if the mock REST server encounters CORS or usage limits.

### 2. Strict State Machine
All interactions follow a strict, one-way state transition schema:
- `IDLE`: Driver online, Rider searching.
- `REQUESTING`: Rider sets route. Broadcasts request details.
- `ACCEPTED`: Driver accepts. Calculations route the driver toward pickup.
- `ARRIVED`: Driver reaches pickup, awaiting rider entry.
- `IN_PROGRESS`: Active transit moving along the pickup-dropoff route line.
- `COMPLETED` / `CANCELLED`: Terminal states triggering persistent HTTP REST archiving.

### 3. Rendering & Performance Optimization
- **Custom Map Elements:** Standard Leaflet markers frequently face path asset load failures. We replaced default markers with custom SVG `L.divIcon` layers, rendering pulsing green pickups, rose dropoffs, and Nexon EV cars with zero external dependency.
- **Memory Leak Protection:** All intervals, database channels, and `BroadcastChannel` listeners are unlinked inside React's `useEffect` cleanups on view toggles and component unmounts to prevent memory degradation.

---

## Interactive Evaluation Viewports

Evaluators can cycle through three dedicated layout panels in the header:
- **Split Screen (Recommended):** Displays Rider Panel, Map Canvas, and Driver Panel side-by-side in a single viewport. Great for witnessing real-time interactions side-by-side.
- **Rider View:** Full Rider perspective, coordinates selector, and historical logs table.
- **Driver View:** Car status toggle (Online/Offline) and accepted dispatch tracking tools.
