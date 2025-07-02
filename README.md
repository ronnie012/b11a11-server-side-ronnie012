# TourZen - Tour Package Booking Platform (Server)

## Project Purpose

This is the server-side application for TourZen, a full-stack tour package booking platform. It handles API requests from the client, manages data persistence with MongoDB, and implements business logic for user authentication, tour package management, and bookings.

## Features

*   **User Authentication & Authorization:**
    *   JWT-based authentication for secure API access.
    *   Middleware to verify tokens and protect routes.
    *   Endpoint to generate JWT upon successful Firebase user verification.
*   **Tour Package Management:**
    *   CRUD operations for tour packages (Create, Read, Update, Delete).
    *   Guides can manage their own packages.
    *   Endpoint to fetch featured packages.
    *   Endpoint to fetch packages created by a specific guide.
*   **Booking System:**
    *   Endpoints for users to book tour packages.
    *   Endpoints for users to view their bookings.
    *   Endpoint for guides/users to update booking status (e.g., to "completed").
*   **Data Management:**
    *   Stores and retrieves data from MongoDB (tour packages, bookings).
    *   Increments booking count for packages.
*   **API Endpoints:**
    *   RESTful API for all client-server interactions.

## Live URL

*   **Server:** https://b11a11-server-side-ronnie012.vercel.app/
*   **Client:** https://tour-zen-012-upgraded.web.app/

## Tech Stack

*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB
*   **Authentication:** JWT (JSON Web Tokens)
*   **Middleware:** Cors, Custom JWT verification
*   **Environment Variables:** Dotenv

## Used NPM Packages

*   `express`
*   `mongodb`
*   `jsonwebtoken`
*   `cors`
*   `dotenv`

## Getting Started

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Set up environment variables in a `.env` file (see `.env.example` if you create one). Key variables include `MONGODB_URI`, `JWT_SECRET`, `PORT`.
4.  Run the development server: `npm run dev` (or your defined script)


