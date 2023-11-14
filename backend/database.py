#======================================================================#
#                              DATABASE                                #
#======================================================================#

#> Modules
import sqlalchemy as _sql
import sqlalchemy.ext.declarative as _declarative
import sqlalchemy.orm as _orm

#> Database URL to SQLite Database
DATABASE_URL = "sqlite:///./database.db"

#> Engine for connecting to Database
engine = _sql.create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

#> Session for connecting to Database
SessionLocal = _orm.sessionmaker(autocommit=False, autoflush=False, bind=engine)

#> Base Class for Database Models
Base = _declarative.declarative_base()