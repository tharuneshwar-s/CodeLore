# Codelore Web Application

This is the web frontend for Codelore, built with Next.js 14, React 18, TypeScript, and Tailwind CSS. It provides a modern UI for exploring repository analysis results and AI-generated narratives.

## Getting Started

### Prerequisites
- Node.js (v14 or later)

### Installation
1. Install dependencies:
   ```bash
   npm install
   # or yarn install
   # or pnpm install
   ```
2. Copy the example environment file and configure your settings:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your API/backend URLs as needed.

### Running the Development Server
```bash
npm run dev
# or yarn dev
# or pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building for Production
To build the application for production:
```bash
npm run build
# or yarn build
# or pnpm build
```
Then start the production server:
```bash
npm start
# or yarn start
# or pnpm start
```


## Project Structure
```
webapp/
├── src/
│   ├── app/           # App routes and pages
│   ├── components/    # Reusable components
│   └── lib/           # Utility functions and shared logic
├── public/            # Static files
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
- TypeScript for type checking
- ESLint for code linting
- Prettier for code formatting
- Tailwind CSS for styling

## License
This project is licensed under the MIT License.