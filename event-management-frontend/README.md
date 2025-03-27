# Event Management Frontend

This is the frontend application for the Event Management System, built with Next.js, TypeScript, and Tailwind CSS. It features a modern, responsive UI with smooth animations powered by Framer Motion.

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

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory:

```bash
cd event-management-frontend
```

3. Install dependencies:

```bash
npm install
# or
yarn install
```

4. Create a `.env.local` file with the following content:

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

5. Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Development

- Login page: `/login`
- Register page: `/register`
- Home page (protected): `/`

## Backend Integration

This frontend application connects to a Spring Boot backend API. Make sure the backend server is running at http://localhost:8080 before using the authentication features.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
