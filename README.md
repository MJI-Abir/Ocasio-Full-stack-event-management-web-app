# Ocasio

**OCASIO** is an application for the Event Management System, built with **Next.js, TypeScript, and Tailwind CSS** for frontend, **Spring Boot** for backend, and **mysql** for database management. It features a modern, responsive UI with smooth animations powered by Framer Motion.

## Features

- User authentication (login/register)
- JWT-based authentication
- Protected routes
- Responsive design
- Smooth animations and transitions

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Axios for API requests
- js-cookie for cookie management
- Java Spring Boot
- MySQL Database

## Setup and Configuration

Clone the repository.

### Environment Variables

The application uses environment variables for configuration. You can set these up by:

1. Copy the `.env.example` file to `.env`
2. Update the values in `.env` with your configuration

## Required environment variables

```bash
# Database Configuration
DB_URL=jdbc:mysql://localhost:3306/event_management
DB_USERNAME=root
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_secret_key_at_least_32_characters_long
JWT_EXPIRATION=86400000
```

### Running the Application

Make sure MySQL is running on your machine, then:

```bash
# Run the application
./mvnw spring-boot:run

```bash
Navigate to the project directory:

```bash
cd event-management-frontend
```

```bash
Start the development server:
npm run dev
# or
yarn dev
```

## Backend Integration

This frontend application connects to a Spring Boot backend API. Make sure the backend server is running at <http://localhost:8080> before using the authentication features.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
