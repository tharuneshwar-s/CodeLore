# CodeLore Backend

This is the backend service for Codelore. It provides API endpoints for repository analysis, code parsing, and AI-powered narrative generation using FastAPI, Celery, and Google Gemini.


## Prerequisites
- Python 3.8+
- RabbitMQ Server (for Celery)
- Google Gemini API Key

## Installation
1. Clone the repository and navigate to backend:
   ```bash
   git clone <repository-url>
   cd codelore/backend
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
   Edit `.env` and set your configuration values:
   - `GOOGLE_API_KEY`: Your Google Gemini API key
   - RabbitMQ connection details if different from defaults

## Running the Application
1. Start RabbitMQ Server (if not already running)
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
- `GET /result/{task_id}`: Get analysis results
- `GET /health`: Health check endpoint

## Development
- FastAPI for the web API
- Celery with RabbitMQ for background task processing
- Google Gemini API for narrative generation
- GitPython for repository analysis
- Python's AST module for code structure analysis

## License
This project is licensed under the MIT License.