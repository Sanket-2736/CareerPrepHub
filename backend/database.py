from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "mysql+aiomysql://root:SKBelekar2736@localhost:3306/careerprep"

engine = create_async_engine(DATABASE_URL, echo=True, future=True)

SessionLocal = sessionmaker(
    bind=engine, 
    expire_on_commit=False, 
    class_=AsyncSession
)

Base = declarative_base()

from fastapi import Depends

async def get_db():
    async with SessionLocal() as session:
        yield session
