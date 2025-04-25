# Codelore

Codelore is a comprehensive application designed to provide a seamless experience for managing and analyzing code. It consists of a backend service and a web frontend.

## Table of Contents
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)
- [Contact Information](#contact-information)

## Project Structure
```
codelore/
  backend/          # Backend services and APIs
  webapp/           # Web frontend built with Next.js
```

## Technologies Used
- **Backend**: Python, FastAPI, Celery
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS

## Installation
### Prerequisites
- Node.js (version 14 or later)
- Python (version 3.8 or later)

### Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd codelore
   ```
2. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
3. Install frontend dependencies:
   ```bash
   cd webapp
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

## Usage
### Running the Backend
```bash
cd backend
uvicorn main:app --reload
```

### Running the Frontend
```bash
cd webapp
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Features
- Modern UI with Tailwind CSS
- Type-safe development with TypeScript
- Fast and responsive design

## Development
- TypeScript for type checking
- ESLint for code linting
- Prettier for code formatting
- Tailwind CSS for styling


## License
This project is licensed under the MIT License.
