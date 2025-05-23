FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# Expose port for FastAPI
EXPOSE 8000

# Create entrypoint script
RUN echo '#!/bin/bash\n\
if [ "$1" = "web" ]; then\n\
  uvicorn api.main:app --host 0.0.0.0 --port 8000\n\
elif [ "$1" = "worker" ]; then\n\
  celery -A worker.analysis_task worker --loglevel=info\n\
else\n\
  echo "Unknown command: $1. Use 'web' or 'worker'"\n\
  exit 1\n\
fi' > entrypoint.sh

RUN chmod +x entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
CMD ["web"] 