FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y build-essential curl

# Copy dependency files first
COPY pyproject.toml poetry.lock* /app/

# Install dependencies
RUN pip install --upgrade pip
RUN pip install poetry
RUN poetry config virtualenvs.create false
RUN poetry install --no-root --only main

# Copy all backend code including models
COPY . /app

# Expose Render port
EXPOSE $PORT

# Start Uvicorn using Render's dynamic port
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "$PORT"]
