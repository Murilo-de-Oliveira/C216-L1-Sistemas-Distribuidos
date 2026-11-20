from typing import Annotated

from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


engine = create_engine("postgresql+psycopg://app:app@localhost:5432/app", echo=True)
Session = sessionmaker(engine)


def get_session():
    with Session() as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]