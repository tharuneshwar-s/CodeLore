# Codelore

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.8+-blue?logo=python" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-API-green?logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Celery-Task%20Queue-37814A?logo=celery" alt="Celery" />
  <img src="https://img.shields.io/badge/RabbitMQ-Broker-FF6600?logo=rabbitmq" alt="RabbitMQ" />
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-Type%20Safe-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-Utility-38B2AC?logo=tailwindcss" alt="Tailwind CSS" />
</p>

Codelore is an AI-powered platform for analyzing and understanding code repositories. It consists of a Python backend (FastAPI, Celery, Gemini LLM) and a modern web frontend (Next.js, React, TypeScript, Tailwind CSS).

## Demo

<p align="center">
  <a href="samples/samplevideo.mp4">
    <img src="https://img.shields.io/badge/Watch-Demo_Video-FF0000?logo=youtube&logoColor=white" alt="Demo Video" width="200"/>
  </a>
</p>

Check out our [sample video](samples/samplevideo.mp4) to see Codelore in action!

## Table of Contents
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Project Structure
```
codelore/
  backend/   # Backend services and APIs (see backend/README.md)
  webapp/    # Web frontend (see webapp/README.md)
```

## Technologies Used
- **Backend:** Python, FastAPI, Celery, Google Gemini API
- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS

## Installation
### Prerequisites
- Node.js (v14+)
- Python (3.8+)
- RabbitMQ (for Celery)

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
   cd ../webapp
   npm install
   # or yarn install
   # or pnpm install
   ```

## Usage
### Running the Backend
```bash
cd backend
uvicorn api.main:app --reload
```

### Running the Frontend
```bash
cd webapp
npm run dev
# or yarn dev
# or pnpm dev
```

See [backend/README.md](backend/README.md) and [webapp/README.md](webapp/README.md) for more details.

## Features
- Analyze public Git repositories and extract their structure
- Generate human-readable, AI-powered narratives for codebases
- Visualize code dependencies and structure with interactive graphs
- Explore repository details and summaries in a modern web UI
- Quickly search and browse analyzed repositories
- Responsive and accessible design for all devices
- Easy integration with GitHub for repository import

## Development
- TypeScript for type checking (frontend)
- ESLint for code linting
- Prettier for code formatting
- Tailwind CSS for styling

## License
This project is licensed under the MIT License.

## Contact
For questions or support, please open an issue or contact the maintainers.
