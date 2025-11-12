import warnings
warnings.filterwarnings("ignore", message=".*orm_mode.*renamed to.*from_attributes.*")

from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.app import router
from src.db import create_db_and_tables

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()  # <-- creates PostgreSQL tables
    yield

app = FastAPI(title="Gym Recommender API", lifespan=lifespan)


from fastapi.middleware.cors import CORSMiddleware

# # CORS
# origins = [
#     "http://localhost:3000",  # for local browser
#     "http://127.0.0.1:3000",
#     "http://frontend:3000",   # for container-to-container
# ]

app.add_middleware(
    CORSMiddleware,
    # allow_origins=origins,s
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(router)

@app.get("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
