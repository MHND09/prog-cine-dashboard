# Theater Dashboard

A comprehensive dashboard application designed for theater owners to manage their content for a mobile app [github](https://github.com/Abd-Elhakim-Arabet/Prog-Cine). This web-based management system allows theater owners to efficiently handle their movie listings, showtimes, and other content that will be displayed in their mobile application.

live demo available [here](https://prog-cine-dashboard.vercel.app) you can use demo credentials given below

## Project Demo


https://github.com/user-attachments/assets/0def8871-dbfa-4f37-abf7-23e94a1a2114




## Project Overview

This dashboard serves as the backend management interface for theater owners, providing them with tools to:

- **Movie Management**: Add, edit, and remove movies from their theater listings, integrating with the IMDb database.
- **Showtime Management**: Create and manage movie showtimes and schedules
- **Content Control**: Full control over what content appears in their mobile app
- **User-Friendly Interface**: Intuitive design built with modern web technologies

## Technology Stack

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), built with:

- **Next.js 15+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend database and authentication

## Demo Credentials

For reference and testing purposes, you can use the following credentials:

```
Email: cosmos_beta@progcine.co
Password: SXSG0luJo4xdeKX
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Features

- **Movie Management**
  - Add new movies with detailed information
  - Edit existing movie details
  - Search and import movies from external sources
  - Manage movie metadata and images

- **Showtime Management**
  - Create and schedule movie showtimes
  - Edit existing showtimes
  - Manage theater schedules and availability

- **Dashboard Overview**
  - Real-time content management
  - User-friendly navigation
  - Responsive design for various devices

## Project Structure

- `/src/app` - Next.js App Router pages and layouts
- `/src/components` - Reusable React components
- `/src/actions` - Server actions for data operations
- `/src/lib` - Utility functions and type definitions
- `/src/utils` - Firebase and Supabase configurations

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
