# NetTopo Sim — Network Topology Design & Simulation Platform

> **Final-year / portfolio project** — Full-stack web app for designing network topologies, running Dijkstra shortest-path routing, simulating packet transfer, and analyzing link failures.

![Tech Stack](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4-6DB33F?style=flat&logo=spring)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-4169E1?style=flat&logo=postgresql)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat)

## Highlights for recruiters

- **Visual topology editor** with drag-and-drop devices (PC, Router, Switch, Server, Firewall) using `@xyflow/react`
- **Dijkstra shortest-path** algorithm with delay-weighted edges and inactive node/link exclusion
- **Packet simulation** (ICMP / TCP / UDP) with hop-by-hop animation and live logs
- **Failure simulation** — disable devices/links and observe rerouting or unreachable destinations
- **JWT authentication** — register, login, per-user cloud-saved projects
- **Analytics & JSON reports** — hop count, delay, validation, exportable simulation results
- **Demo templates** — one-click sample networks for presentations and interviews

## Architecture

```
┌─────────────┐     REST + JWT      ┌──────────────────┐     JPA      ┌────────────┐
│ React + TS  │ ◄─────────────────► │ Spring Boot API  │ ◄──────────► │ PostgreSQL │
│ Vite        │                     │ Port 8080        │              │            │
└─────────────┘                     └──────────────────┘              └────────────┘
```

## Quick start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

### Backend

1. Install PostgreSQL and create the database (see SQL below).
2. Run:

```bash
cd network-simulator
mvn spring-boot:run
```

**PostgreSQL:** database `networkdb`, user `postgre`, password `2002` (see `application.properties`).

### Demo account

| Email | Password |
|-------|----------|
| `demo@nettopo.com` | `demo123` |

Created automatically on first backend startup.

## Main routes

| Route | Description |
|-------|-------------|
| `/` | Landing page — project overview & tech stack |
| `/designer` | Topology editor & simulation (guest OK) |
| `/login` | Sign in |
| `/register` | Create account |
| `/dashboard` | Your saved projects (auth required) |

## API endpoints

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/auth/me` | Yes |
| GET/POST | `/api/topologies` | Yes |
| GET/PUT/DELETE | `/api/topologies/:id` | Yes |

## Skills demonstrated

- React 19, TypeScript, React Router, Vite
- Graph algorithms (Dijkstra, adjacency list)
- Spring Boot, Spring Security, JWT, JPA, PostgreSQL
- REST API design, CORS, validation
- UI/UX — responsive layout, toast notifications, dark theme

## Suggested CV bullet points

- Built a **full-stack network simulation platform** with visual topology design, Dijkstra routing, and real-time packet animation.
- Implemented **JWT-secured REST APIs** and user-scoped persistence with Spring Boot and PostgreSQL.
- Designed **interactive graph editor** using React Flow (`@xyflow/react`) with custom device nodes and link configuration.

## Author

Add your name, GitHub link, and LinkedIn here before submitting applications.
