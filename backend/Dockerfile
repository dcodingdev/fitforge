FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y build-essential curl

COPY pyproject.toml poetry.lock* /app/

RUN pip install --upgrade pip
RUN pip install poetry
RUN poetry config virtualenvs.create false
RUN poetry install --no-root --only main

COPY . /app

EXPOSE $PORT

# Use shell form to expand $PORT
CMD uvicorn main:app --host 0.0.0.0 --port $PORT
