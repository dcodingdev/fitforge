



import warnings
warnings.filterwarnings("ignore", category=UserWarning, module="sklearn")

import pandas as pd
import numpy as np
import joblib
import os
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
import math

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_DIR = os.path.join(BASE_DIR, "models")

WORKOUT_FILE = os.path.join(DATA_DIR, "megaGymDataset.csv")
RATINGS_SEED = os.path.join(DATA_DIR, "user_workout_ratings_full_bias.csv")
MODEL_FILE = os.path.join(MODEL_DIR, "model_knn.pkl")
SPARSE_FILE = os.path.join(MODEL_DIR, "sparse_matrix.pkl")

workout_df = pd.read_csv(WORKOUT_FILE)
model_knn = joblib.load(MODEL_FILE)
sparse_matrix = joblib.load(SPARSE_FILE)


# Helper: clean string values
def safe_str(v):
    if v is None or (isinstance(v, float) and math.isnan(v)):
        return ""
    return str(v).strip()


# --------------------------------------------------------------------
# Seed initial ratings if DB empty
# --------------------------------------------------------------------
# async def seed_ratings_if_empty(db: AsyncSession):
#     from .db import WorkoutRating
#     result = await db.execute(select(WorkoutRating).limit(1))
#     if result.scalar_one_or_none():
#         return

#     seed_df = pd.read_csv(RATINGS_SEED)
#     for _, row in seed_df.iterrows():
#         rating = WorkoutRating(
#             user_id=str(row["user_id"]),
#             workout_id=int(row["workout_id"]),
#             rating=float(row["rating"]),
#         )
#         db.add(rating)
#     await db.commit()

async def seed_ratings_if_empty(db: AsyncSession):
    from .db import WorkoutRating, User

    result = await db.execute(select(WorkoutRating).limit(1))
    if result.scalar_one_or_none():
        return

    seed_df = pd.read_csv(RATINGS_SEED)
    
    for _, row in seed_df.iterrows():
        user_id = str(row["user_id"])
        user_exists = await db.execute(select(User).where(User.id == user_id))
        if not user_exists.scalar_one_or_none():
            # Option 1: skip
            continue
            # Option 2: create user if needed
            # db.add(User(id=user_id, email=f"{user_id}@example.com", hashed_password="fakehash"))

        rating = WorkoutRating(
            user_id=user_id,
            workout_id=int(row["workout_id"]),
            rating=float(row["rating"]),
        )
        db.add(rating)

    await db.commit()
# --------------------------------------------------------------------
# Content-based recommender
# --------------------------------------------------------------------
def recommend_content_based(user_input, n=5):
    df = workout_df.copy()
    for col in ["Type", "BodyPart", "Equipment", "Level"]:
        df[col] = df[col].fillna("").astype(str).str.lower()

    goal_map = {
        "lose fat": ["cardio", "hiit", "circuit training"],
        "build muscle": ["strength", "powerlifting", "bodybuilding"],
        "improve strength": ["strength", "powerlifting"],
        "increase endurance": ["cardio", "hiit", "crossfit"],
        "improve flexibility": ["stretching", "yoga", "pilates"],
        "general fitness": ["cardio", "strength"],
    }

    g = user_input.goal.lower()
    pt = user_input.preferred_type.lower()
    eq = user_input.equipment_access.lower()
    bp = user_input.preferred_bodypart.lower()
    lvl = user_input.fitness_level.lower()

    score = np.zeros(len(df))
    if g in goal_map:
        score += df["Type"].apply(lambda x: 2 if x in goal_map[g] else 0)
    score += df["Type"].apply(lambda x: 1.5 if pt in x else 0)
    score += df["Equipment"].apply(lambda x: 1 if eq in x else 0)
    score += df["BodyPart"].apply(lambda x: 1.5 if bp in x else 0)
    score += df["Level"].apply(lambda x: 1 if lvl in x else 0)
    score += df["Rating"].fillna(7) / 10

    df["score"] = score
    top = df.sort_values("score", ascending=False).head(n)

    return [
        {
            "workout_id": int(row["Unnamed: 0"]),
            "title": safe_str(row["Title"]),
            "type": safe_str(row["Type"]).title(),
            "bodypart": safe_str(row["BodyPart"]).title(),
            "equipment": safe_str(row["Equipment"]),
            "level": safe_str(row["Level"]).title(),
            "score": round(float(row["score"]), 2),
        }
        for _, row in top.iterrows()
    ]


# --------------------------------------------------------------------
# Hybrid recommender (content + collaborative)
# --------------------------------------------------------------------
async def hybrid_recommend(user_input, user_id: str, db: AsyncSession, n=5):
    from .db import WorkoutRating
    result = await db.execute(select(WorkoutRating).where(WorkoutRating.user_id == user_id))
    ratings = result.scalars().all()
    has_history = len(ratings) > 0

    content_recs = recommend_content_based(user_input, n=100)
    df = workout_df.copy()
    df["content_score"] = 0.0

    for rec in content_recs:
        df.loc[df["Unnamed: 0"] == rec["workout_id"], "content_score"] = float(rec["score"])

    if has_history:
        collab_scores = np.zeros(len(df))
        for r in ratings:
            wid = r.workout_id
            if wid < sparse_matrix.shape[0]:
                distances, indices = model_knn.kneighbors(sparse_matrix[wid], n_neighbors=6)
                sim_ids = indices.flatten()[1:]
                weights = 10 - distances.flatten()[1:]
                collab_scores[sim_ids] += weights * r.rating
        df["collab_score"] = collab_scores
        df["final_score"] = 0.6 * df["collab_score"] + 0.4 * df["content_score"]
        mode = "hybrid"
    else:
        df["final_score"] = df["content_score"]
        mode = "content-based"

    top = df.sort_values("final_score", ascending=False).head(n)

    return mode, [
        {
            "workout_id": int(row["Unnamed: 0"]),
            "title": safe_str(row["Title"]),
            "type": safe_str(row["Type"]).title(),
            "bodypart": safe_str(row["BodyPart"]).title(),
            "equipment": safe_str(row["Equipment"]),
            "level": safe_str(row["Level"]).title(),
            "score": round(float(row["final_score"]), 2),
        }
        for _, row in top.iterrows()
    ]
