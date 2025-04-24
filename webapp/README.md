# Codelore Web Application

This is the web frontend for Codelore, built with Next.js 14 and TypeScript.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Modern UI with Tailwind CSS
- Type-safe development with TypeScript
- Fast and responsive design
- SEO optimized

## Project Structure

```
webapp/
├── src/
│   ├── app/
│   │   ├── layout.tsx    # Root layout component
│   │   ├── page.tsx      # Home page component
│   │   └── globals.css   # Global styles
│   ├── components/       # Reusable components
│   └── lib/             # Utility functions and shared logic
├── public/              # Static files
└── ...config files
```

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Heroicons
- ESLint for code quality

## Development

The application uses the following development tools:

- TypeScript for type checking
- ESLint for code linting
- Prettier for code formatting
- Tailwind CSS for styling

## Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

Then start the production server:

```bash
npm start
# or
yarn start
# or
pnpm start
``` 