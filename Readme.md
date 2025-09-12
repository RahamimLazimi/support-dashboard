# Support Dashboard - README

**Author:** Rahamim Lazimi

## Overview

This project consists of two parts:

- **Backend**: .NET API with MongoDB database  
- **Frontend**: React application using Vite and Material UI (MUI)

The system supports user management and a dashboard for handling support tickets.

---

## Prerequisites

Before you start, please ensure you have the following installed:

- **Node.js** (v16 or higher)  
- **npm** or **yarn** (package manager)  
- **.NET SDK** (e.g., .NET 6 or 7)  
- **MongoDB** (local instance or remote connection)  

---

## Step-by-step Guide

### 1. Backend Setup (.NET API)

1. Open a terminal and navigate to the backend folder (adjust path if needed):

    ```bash
    cd server
    ```

2. Make sure MongoDB is running locally on your machine. Default MongoDB URL:

    ```
    mongodb://localhost:27017
    ```

3. Restore NuGet packages:

    ```bash
    dotnet restore
    ```

4. Run the backend on port 5000 explicitly:

    ```bash
    dotnet run --urls "http://localhost:5000"
    ```

    > **Note:** This ensures the backend listens on `http://localhost:5000`

5. The backend will connect to MongoDB and expose APIs for users, tickets, and authentication.

---

### 2. Frontend Setup (React with Vite)

1. Open a new terminal and navigate to the frontend folder:

    ```bash
    cd client
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

    or, if you prefer yarn:

    ```bash
    yarn install
    ```

3. Run the development server:

    ```bash
    npm run dev
    ```

    or with yarn:

    ```bash
    yarn dev
    ```

4. The React app will open (or be available) at:

    ```
    http://localhost:3000
    ```

5. Make sure your frontend API requests target the backend on port 5000 (e.g., `http://localhost:5000/api/...`).

---

## Usage

- **MongoDB:** Run your local MongoDB service or connect to a remote MongoDB server before starting the backend.  
- **Creating Users:** You can create users directly via API or through an admin panel (if implemented).  
- **Login:** Use the login screen in the frontend to authenticate and access the dashboard.  
- **Admin Role:** Admin users can manage other users and tickets through the dashboard.  
- **Dashboard:** Agents and admins can view and update support tickets.

---

## Troubleshooting

- **CORS Issues:** Make sure your backend allows requests from the frontend origin (`http://localhost:3000`). Configure CORS in your backend if needed.  
- **MongoDB Connection:** Verify MongoDB is running and connection string is correct in backend config.  
- **Ports Conflict:** Ensure ports 5000 and 3000 are free or change them accordingly.  

---

## Summary of Commands

| Task                    | Command                                   | Directory  |
|-------------------------|-------------------------------------------|------------|
| Restore backend packages | `dotnet restore`                         | `/server` |
| Run backend server      | `dotnet run --urls "http://localhost:5000"` | `/server` |
| Install frontend deps   | `npm install` or `yarn install`           | `/client`|
| Start frontend server   | `npm run dev` or `yarn dev`                | `/client`|

---

## Optional Enhancements

- Use `.env` files to store backend URL and MongoDB connection string for easier config.  
- Add scripts to run backend and frontend concurrently (e.g., with `concurrently` npm package).  
