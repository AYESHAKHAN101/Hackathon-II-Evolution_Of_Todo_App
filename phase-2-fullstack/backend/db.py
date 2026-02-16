from sqlmodel import create_engine, Session
from sqlalchemy import text
from settings import settings


# Create the database engine
engine = create_engine(
    settings.database_url,
    echo=settings.debug,  # This will log SQL queries in debug mode
)


def get_session():
    """Dependency to get database session"""
    with Session(engine) as session:
        yield session


def init_db():
    """Initialize the database and create tables"""
    from models import SQLModel
    SQLModel.metadata.create_all(engine)