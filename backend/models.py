# ======================================================================#
#                           DATABASE TABLES                            #
# ======================================================================#

# > Modules
import sqlalchemy as sql
import sqlalchemy.orm as orm
import passlib.hash as hash
import database

# ----------------------------------------> User
class User(database.Base):
    __tablename__ = "users"
    id = sql.Column(sql.Integer, primary_key=True)
    username = sql.Column(sql.String)
    dateOfBirth = sql.Column(sql.String)
    email = sql.Column(sql.String, unique=True)
    password = sql.Column(sql.String)

    lmAgents = orm.relationship("LmAgent", back_populates="lmAgent_owner")
    pmmAgents = orm.relationship("PmmAgent", back_populates="pmmAgent_owner")
    exchanges = orm.relationship("Exchange", back_populates="exchange_owner")

    def verify_password(self, password: str):
        return hash.bcrypt.verify(password, self.password)


# ----------------------------------------> Agent
class LmAgent(database.Base):
    __tablename__ = "lmAgents"
    id = sql.Column(sql.Integer, primary_key=True)
    owner_id = sql.Column(sql.Integer, sql.ForeignKey("users.id"))
    filename = sql.Column(sql.String)
    password = sql.Column(sql.String)
    killswitch = sql.Column(sql.Float)
    strategy = sql.Column(sql.String)
    exchange = sql.Column(sql.String)
    market = sql.Column(sql.String)
    token = sql.Column(sql.String)
    order_amount = sql.Column(sql.Float)
    spread = sql.Column(sql.Float)
    inventory_skew_enabled = sql.Column(sql.Boolean)
    target_base_pct = sql.Column(sql.Float)
    order_refresh_time = sql.Column(sql.Float)
    order_refresh_tolerance_pct = sql.Column(sql.Float)
    inventory_range_multiplier = sql.Column(sql.Float)
    volatility_interval = sql.Column(sql.Integer)
    avg_volatility_period = sql.Column(sql.Integer)
    volatility_to_spread_multiplier = sql.Column(sql.Float)
    max_spread = sql.Column(sql.Float)
    max_order_age = sql.Column(sql.Float)

    lmAgent_owner = orm.relationship("User", back_populates="lmAgents")


class PmmAgent(database.Base):
    __tablename__ = "pmmAgents"
    id = sql.Column(sql.Integer, primary_key=True)
    owner_id = sql.Column(sql.Integer, sql.ForeignKey("users.id"))
    filename = sql.Column(sql.String)
    password = sql.Column(sql.String)
    killswitch = sql.Column(sql.Float)
    strategy = sql.Column(sql.String)
    exchange = sql.Column(sql.String)
    market = sql.Column(sql.String)
    bid_spread = sql.Column(sql.Float)
    ask_spread = sql.Column(sql.Float)
    minimum_spread = sql.Column(sql.Float)
    order_refresh_time = sql.Column(sql.Float)
    max_order_age = sql.Column(sql.Float)
    order_refresh_tolerance_pct = sql.Column(sql.Float)
    order_amount = sql.Column(sql.Float)
    price_ceiling = sql.Column(sql.Float)
    price_floor = sql.Column(sql.Float)
    moving_price_band_enabled = sql.Column(sql.Boolean)
    price_ceiling_pct = sql.Column(sql.Float)
    price_floor_pct = sql.Column(sql.Float)
    price_band_refresh_time = sql.Column(sql.Integer)
    ping_pong_enabled = sql.Column(sql.Boolean)
    inventory_skew_enabled = sql.Column(sql.Boolean)
    inventory_target_base_pct = sql.Column(sql.Float)
    inventory_range_multiplier = sql.Column(sql.Float)
    inventory_price = sql.Column(sql.Float)
    order_levels = sql.Column(sql.Integer)
    order_level_amount = sql.Column(sql.Integer)
    order_level_spread = sql.Column(sql.Float)
    filled_order_delay = sql.Column(sql.Integer)
    hanging_orders_enabled = sql.Column(sql.Boolean)
    hanging_orders_cancel_pct = sql.Column(sql.Float)
    order_optimization_enabled = sql.Column(sql.Boolean)
    ask_order_optimization_depth = sql.Column(sql.Integer)
    bid_order_optimization_depth = sql.Column(sql.Integer)
    add_transaction_costs = sql.Column(sql.Boolean)
    price_source = sql.Column(sql.String)
    price_type = sql.Column(sql.String)
    price_source_exchange = sql.Column(sql.String)
    price_source_market = sql.Column(sql.String)
    price_source_custom_api = sql.Column(sql.String)
    custom_api_update_interval = sql.Column(sql.Float)
    take_if_crossed = sql.Column(sql.Boolean)
    order_override = sql.Column(sql.Boolean)
    split_order_levels_enabled = sql.Column(sql.Boolean)
    bid_order_level_spreads = sql.Column(sql.Integer)
    ask_order_level_spreads = sql.Column(sql.Integer)
    bid_order_level_amounts = sql.Column(sql.Integer)
    ask_order_level_amounts = sql.Column(sql.Integer)
    should_wait_order_cancel_confirmation = sql.Column(sql.Boolean)

    pmmAgent_owner = orm.relationship("User", back_populates="pmmAgents")


# ----------------------------------------> Exchange
class Exchange(database.Base):
    __tablename__ = "exchanges"
    id = sql.Column(sql.Integer, primary_key=True)
    owner_id = sql.Column(sql.Integer, sql.ForeignKey("users.id"))
    name = sql.Column(sql.String, unique=True)
    exchange_owner = orm.relationship("User", back_populates="exchanges")