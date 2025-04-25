# CodeLore

CodeLore is an AI-powered web application that analyzes public Git repositories and generates compelling narratives about their history, purpose, structure, and evolution. It serves as a powerful tool for quickly understanding unfamiliar codebases and can be used for portfolio demonstrations or team onboarding.

## Features

- Analyze public Git repositories
- Extract code structure and patterns
- Generate engaging narratives using AI
- Asynchronous processing with real-time status updates
- Support for Python codebases (MVP)

## Prerequisites

- Python 3.8+
- Redis Server
- Google Gemini API Key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/codelore.git
cd codelore
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Copy the example environment file and configure your settings:
```bash
cp .env.example .env
```

Edit `.env` and set your configuration values, especially:
- `GOOGLE_API_KEY`: Your Google Gemini API key
- Redis connection details if different from defaults

## Running the Application

1. Start Redis Server (if not already running)

2. Start the Celery worker:
```bash
celery -A worker.analysis_task worker --pool=solo --loglevel=info
```

3. Start the FastAPI server:
```bash
uvicorn api.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

- `POST /analyze`: Submit a repository for analysis
  - Request body: `{"repo_url": "https://github.com/user/repo"}`
  - Returns: `{"task_id": "..."}`

- `GET /result/{task_id}`: Get analysis results
  - Returns: Analysis status and results when complete

- `GET /health`: Health check endpoint

## Development

- The application uses FastAPI for the web API
- Celery with Redis for background task processing
- Google Gemini API for narrative generation
- GitPython for repository analysis
- Python's AST module for code structure analysis

## Future Enhancements

- Support for additional programming languages
- Deeper static analysis capabilities
- Design pattern detection
- Technical debt identification
- Result caching
- Text-to-video narrative generation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 