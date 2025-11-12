# from sqlmodel import select
# from fastapi import APIRouter, Depends
# from sqlmodel.ext.asyncio.session import AsyncSession
# from typing import List
# import pandas as pd

# from .auth import fastapi_users, auth_backend, current_active_user
# from .schemas import *
# from .db import User, WorkoutRating, get_async_session
# from .recommender import recommend_content_based, hybrid_recommend, seed_ratings_if_empty

# router = APIRouter()

# router.include_router(
#     fastapi_users.get_auth_router(auth_backend), prefix="/auth/jwt", tags=["auth"]
# )
# router.include_router(
#     fastapi_users.get_register_router(UserRead, UserCreate), prefix="/auth", tags=["auth"]
# )

# @router.post("/recommend", response_model=RecommendationResponse)
# async def recommend(
#     user_input: UserInput,
#     user: User = Depends(current_active_user),
#     db: AsyncSession = Depends(get_async_session)
# ):
#     await seed_ratings_if_empty(db)
#     input_data = user_input.dict()
#     input_data.setdefault("preferred_type", input_data["goal"])
#     input_data.setdefault("preferred_bodypart", "any")

#     mode, recs = await hybrid_recommend(
#         user_input=UserInput(**input_data),
#         user_id=str(user.id),
#         db=db
#     )
#     return {"mode": mode, "recommendations": recs}

# @router.post("/rate", response_model=RatingResponse)
# async def rate(
#     rating_in: RateWorkout,
#     user: User = Depends(current_active_user),
#     db: AsyncSession = Depends(get_async_session)
# ):
#     result = await db.execute(
#         select(WorkoutRating).where(
#             WorkoutRating.user_id == str(user.id),
#             WorkoutRating.workout_id == rating_in.workout_id
#         )
#     )
#     existing = result.scalar_one_or_none()

#     if existing:
#         existing.rating = rating_in.rating
#     else:
#         rating = WorkoutRating(
#             user_id=str(user.id),
#             workout_id=rating_in.workout_id,
#             rating=rating_in.rating
#         )
#         db.add(rating)

#     await db.commit()
#     return {"message": "Rating saved"}

# @router.get("/history", response_model=List[HistoryItem])
# async def history(
#     user: User = Depends(current_active_user),
#     db: AsyncSession = Depends(get_async_session)
# ):
#     from .recommender import workout_df
#     result = await db.execute(select(WorkoutRating).where(WorkoutRating.user_id == str(user.id)))
#     ratings = result.scalars().all()
#     titles = workout_df.set_index("Unnamed: 0")["Title"]
#     return [
#         {
#             "workout_id": r.workout_id,
#             "title": titles.get(r.workout_id, "Unknown Workout"),
#             "rating": round(r.rating, 1),
#             "rated_at": r.created_at.isoformat() if r.created_at else None
#         }
#         for r in ratings
#     ]

# @router.get("/top_workouts", response_model=List[TopWorkout])
# async def top_workouts(db: AsyncSession = Depends(get_async_session)):
#     await seed_ratings_if_empty(db)
#     from .recommender import workout_df

#     result = await db.execute(select(WorkoutRating))
#     ratings = result.scalars().all()
#     if not ratings:
#         return []

#     df = pd.DataFrame([{"workout_id": r.workout_id, "rating": r.rating} for r in ratings])
#     agg = (
#         df.groupby("workout_id")
#         .agg(avg_rating=("rating", "mean"), count=("rating", "count"))
#         .query("count >= 1")
#         .sort_values("avg_rating", ascending=False)
#         .head(10)
#     )
#     titles = workout_df.set_index("Unnamed: 0")["Title"]
#     return [
#         {
#             "workout_id": int(idx),
#             "title": titles.get(idx, "Unknown Workout"),
#             "avg_rating": round(row["avg_rating"], 1),
#             "count": int(row["count"])
#         }
#         for idx, row in agg.iterrows()
#     ]



from sqlmodel import select
from fastapi import APIRouter, Depends
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List
import pandas as pd

from .auth import fastapi_users, auth_backend, current_active_user
from .schemas import *
from .db import User, WorkoutRating, get_async_session
from .recommender import recommend_content_based, hybrid_recommend, seed_ratings_if_empty

router = APIRouter()

router.include_router(
    fastapi_users.get_auth_router(auth_backend), prefix="/auth/jwt", tags=["auth"]
)
router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate), prefix="/auth", tags=["auth"]
)

@router.post("/recommend", response_model=RecommendationResponse)
async def recommend(
    user_input: UserInput,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_async_session)
):
    await seed_ratings_if_empty(db)
    input_data = user_input.dict()
    # Ensure defaults are strings for content-based matching
    input_data.setdefault("preferred_type", str(input_data.get("goal", "")))
    input_data.setdefault("preferred_bodypart", "any")

    mode, recs = await hybrid_recommend(
        user_input=UserInput(**input_data),
        user_id=str(user.id),
        db=db
    )
    return {"mode": mode, "recommendations": recs}

@router.post("/rate", response_model=RatingResponse)
async def rate(
    rating_in: RateWorkout,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_async_session)
):
    result = await db.execute(
        select(WorkoutRating).where(
            WorkoutRating.user_id == str(user.id),
            WorkoutRating.workout_id == rating_in.workout_id
        )
    )
    existing = result.scalar_one_or_none()

    if existing:
        existing.rating = rating_in.rating
    else:
        rating = WorkoutRating(
            user_id=str(user.id),
            workout_id=rating_in.workout_id,
            rating=rating_in.rating
        )
        db.add(rating)

    await db.commit()
    return {"message": "Rating saved"}

@router.get("/history", response_model=List[HistoryItem])
async def history(
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_async_session)
):
    from .recommender import workout_df
    result = await db.execute(select(WorkoutRating).where(WorkoutRating.user_id == str(user.id)))
    ratings = result.scalars().all()
    titles = workout_df.set_index("Unnamed: 0")["Title"]
    return [
        {
            "workout_id": r.workout_id,
            "title": titles.get(r.workout_id, "Unknown Workout"),
            "rating": round(r.rating, 1),
            "rated_at": r.created_at.isoformat() if r.created_at else None
        }
        for r in ratings
    ]

@router.get("/top_workouts", response_model=List[TopWorkout])
async def top_workouts(db: AsyncSession = Depends(get_async_session)):
    await seed_ratings_if_empty(db)
    from .recommender import workout_df

    result = await db.execute(select(WorkoutRating))
    ratings = result.scalars().all()
    if not ratings:
        return []

    df = pd.DataFrame([{"workout_id": r.workout_id, "rating": r.rating} for r in ratings])
    agg = (
        df.groupby("workout_id")
        .agg(avg_rating=("rating", "mean"), count=("rating", "count"))
        .query("count >= 1")
        .sort_values("avg_rating", ascending=False)
        .head(10)
    )
    titles = workout_df.set_index("Unnamed: 0")["Title"]
    return [
        {
            "workout_id": int(idx),
            "title": titles.get(idx, "Unknown Workout"),
            "avg_rating": round(row["avg_rating"], 1),
            "count": int(row["count"])
        }
        for idx, row in agg.iterrows()
    ]
