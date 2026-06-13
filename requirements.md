The Objective
Your task is to build a web-only, real-time ride-sharing simulation platform. The system must implement both a
Rider interface and a Driver interface encapsulated inside a single unified frontend codebase.
Instead of relying on a dedicated custom backend application server, you will handle data state distribution
using a hybrid client architecture: orchestration of live map metrics via a serverless cloud provider,
complemented by a persistent external REST API for structural history records.
Core Constraints & Guidelines
Authentication & Access: Secure the application route workflow behind a simple, clean login screen.
Hardcode the testing access credentials explicitly as:
Testing Credentials
Username: intern@namlotech.com
Password: namlo2026

Dual-Role Simulation: A single running application instance must allow an evaluator to simulate both
sides of the experience (Rider and Driver) dynamically. Hint: Think about how a reviewer might place two
independent browser viewports side-by-side to observe immediate interactions.
Map Integration: Integrate a flexible open-source web map framework (e.g., Leaflet.js / React-Leaflet).
The map interface configuration must default its centering point gracefully around Kathmandu.
•

•

•

Namlo Technologies Pvt. Ltd. — Confidential Challenge Page 1 of 3

Real-Time Synchronization Layer: Incorporate any standard free cloud-based real-time database SDK
(e.g., Firebase Realtime Database or Supabase Realtime) directly into the client client-side environment to
handle changing positions and transient trip communications.
Persistent Ride History (REST API): Integrate any free, public mock REST endpoint service (e.g.,
Mockapi.io, Beeceptor, or similar dummy pipelines) to save and fetch structural history. When a simulated
ride reaches a final resolved terminal state (completed, cancelled, or rejected), the application must fire a
standard HTTP REST request to preserve the transaction log. A history view must also render these
persisted logs within the application.
No Custom Backends: You are strictly restricted from developing an independent Node/Express, Python,
or Go backend service. All communication flows must operate strictly between your React setup, your
cloud streaming SDK, and the mock REST server.
What We Are Evaluating
We care less about an absolute feature list compliance and far more about your fundamental structural
engineering choices. During your technical presentation, we will review:

1. Hybrid Data Architecture
How cleanly you separate responsibilities between high-frequency WebSocket streams (live updates) and standard
transactional HTTP requests (archival history logic). We will look at how state switches smoothly from socket
telemetry to persistent REST payloads.

2. State Machine Integrity
How well your application UI tracks discrete lifecycle changes (e.g., Requesting, Processing, Active, Terminal
States). Your logic should account cleanly for sudden disruptions like user cancellation or backend failures mid-trip.

3. Rendering Optimization
Real-time streams trigger continuous state changes every single second. We expect to see how you mitigate
redundant virtual DOM cycles, preserve custom map layer settings, and maintain solid performance overhead.

4. Code Hygiene & Cleanup
Proper application of life-cycle hooks and cleanup expressions. Ensure all active listeners, data stream updates, and
system intervals are properly unlinked to avoid severe memory leaks across continuous views.

Submission Requirements
GitHub Repository: A public repository featuring organized component structures and clear commits.
•

•

•

•

Namlo Technologies Pvt. Ltd. — Confidential Challenge Page 2 of 3

Documentation: A complete README.md detailing clear commands to get up and running locally, coupled
with a brief technical summary outlining your specific choice of architectural patterns and layout strategies.
Live Link: A stable production URL deployment (via platforms like Vercel, Netlify, or GitHub Pages) that
functions completely with the hardcoded testing accounts. Ensure your mock endpoints remain active and
readable.