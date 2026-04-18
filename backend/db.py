from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = ""

#データベース接続窓口
db_engine = create_engine(DATABASE_URL)

session = sessionmaker(autoflush=False,
                       bind=db_engine)

def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()
