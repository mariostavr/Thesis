# ======================================================================#
#                           COINREP SERVICES                            #
# ======================================================================#

# > Moudels and Dependecies
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
import jwt
import database
import models
import schemas
import sqlalchemy.orm as _orm
import passlib.hash as _hash
import services_hummingbot as hummingbot
import docker
import encryption as _encryption
import datetime
from typing import Dict

# > Token Autherization
oauth2schema = OAuth2PasswordBearer(tokenUrl="/login")
JWT_SECRET = "myjwtsecret"

# > Docker Client
docker_client = docker.from_env()


# ----------------------------------------> Database
# > Create Database
def create_database():
    return database.Base.metadata.create_all(bind=database.engine)

# > Get Database


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ----------------------------------------> User
# > Create User
async def create_user(user: schemas.UserCreate, db: _orm.Session):
    user = models.User(
        username=user.username,
        dateOfBirth=datetime.datetime.strptime(
            user.dateOfBirth, '%Y-%m-%d').date(),
        email=user.email,
        password=_hash.bcrypt.hash(user.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    hummingbot.create_broker_instance(user.id)
    return user


# > Authenticate User by Password
async def authenticate_user(email: str, password: str, db: _orm.Session):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user or not user.verify_password(password):
        return False
    return user

# > Create User Token
async def create_access_token(user: models.User):
    user_obj = schemas.User.from_orm(user)
    token = jwt.encode(user_obj.dict(), JWT_SECRET)
    return dict(access_token=token, token_type="bearer")

# > Get User
async def get_current_user(
    db: _orm.Session = Depends(get_db),
    token: str = Depends(oauth2schema),
):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = db.query(models.User).get(payload["id"])
    except:
        raise HTTPException(
            status_code=401, detail="User Not Found"
        )
    return schemas.User.from_orm(user)


# ----------------------------------------> Agents
# Create Liquidity Mining Agent
async def create_lm_agent(user: schemas.User, db: _orm.Session, agent: schemas.LmAgentCreate):
    agent.password = _hash.bcrypt.hash(agent.password)
    agent = models.LmAgent(**agent.dict(), owner_id=user.id)
    db.add(agent)
    db.commit()
    db.refresh(agent)

    strategy_config: Dict[str, str] = {
        "template_version": 3,
        "strategy": agent.strategy,
        "exchange": agent.exchange,
        "markets": agent.market,
        "token": agent.token,
        "order_amount": agent.order_amount,
        "spread": agent.spread,
        "inventory_skew_enabled": agent.inventory_skew_enabled,
        "target_base_pct": agent.target_base_pct,
        "order_refresh_time": agent.order_refresh_time,
        "order_refresh_tolerance_pct": agent.order_refresh_tolerance_pct,
        "inventory_range_multiplier": agent.inventory_range_multiplier,
        "volatility_interval": agent.volatility_interval,
        "avg_volatility_period": agent.avg_volatility_period,
        "volatility_to_spread_multiplier": agent.volatility_to_spread_multiplier,
        "max_spread": agent.max_spread,
        "max_order_age": agent.max_order_age,
    }

    file_name = agent.strategy + "_" + agent.exchange + "_" + agent.market + '.yml'
    container_name = f'{agent.strategy}_{agent.id}_{user.id}'
    await hummingbot.create_hummingbot_instance(container_name, agent.password, agent.killswitch)
    await hummingbot.create_strategy_file(container_name, strategy_config, file_name)
    return schemas.LmAgent.from_orm(agent)

# Create Pure Market Making Agent
async def create_pmm_agent(user: schemas.User, db: _orm.Session, agent: schemas.PmmAgentCreate):
    agent.password = _hash.bcrypt.hash(agent.password)
    agent = models.PmmAgent(**agent.dict(), owner_id=user.id)
    db.add(agent)
    db.commit()
    db.refresh(agent)
    strategy_config: Dict[str, str] = {
        "template_version": 24,
        "strategy": agent.strategy,
        "exchange": agent.exchange,
        "market": agent.market,
        "bid_spread": agent.bid_spread,
        "ask_spread": agent.ask_spread,
        "minimum_spread": agent.minimum_spread,
        "order_refresh_time": agent.order_refresh_time,
        "max_order_age": agent.max_order_age,
        "order_refresh_tolerance_pct": agent.order_refresh_tolerance_pct,
        "order_amount": agent.order_amount,
        "price_ceiling": agent.price_ceiling,
        "price_floor": agent.price_floor,
        "moving_price_band_enabled": agent.moving_price_band_enabled,
        "price_ceiling_pct": agent.price_ceiling_pct,
        "price_floor_pct": agent.price_floor_pct,
        "price_band_refresh_time": agent.price_band_refresh_time,
        "ping_pong_enabled": agent.ping_pong_enabled,
        "inventory_skew_enabled": agent.inventory_skew_enabled,
        "inventory_target_base_pct": agent.inventory_target_base_pct,
        "inventory_range_multiplier": agent.inventory_range_multiplier,
        "inventory_price": agent.inventory_price,
        "order_levels": agent.order_levels,
        "order_level_amount": agent.order_level_amount,
        "order_level_spread": agent.order_level_spread,
        "filled_order_delay": agent.filled_order_delay,
        "hanging_orders_enabled": agent.hanging_orders_enabled,
        "hanging_orders_cancel_pct": agent.hanging_orders_cancel_pct,
        "order_optimization_enabled": agent.order_optimization_enabled,
        "ask_order_optimization_depth": agent.ask_order_optimization_depth,
        "bid_order_optimization_depth": agent.bid_order_optimization_depth,
        "add_transaction_costs": agent.add_transaction_costs,
        "price_source": agent.price_source,
        "price_type": agent.price_type,
        "price_source_exchange": agent.price_source_exchange,
        "price_source_market": agent.price_source_market,
        "price_source_custom_api": agent.price_source_custom_api,
        "custom_api_update_interval": agent.custom_api_update_interval,
        "take_if_crossed": agent.take_if_crossed,
        "split_order_levels_enabled": agent.split_order_levels_enabled,
        "bid_order_level_spreads": agent.bid_order_level_spreads,
        "ask_order_level_spreads": agent.ask_order_level_spreads,
        "bid_order_level_amounts": agent.bid_order_level_amounts,
        "ask_order_level_amounts": agent.ask_order_level_amounts,
        "should_wait_order_cancel_confirmation": agent.should_wait_order_cancel_confirmation
    }

    file_name = agent.strategy + "_" + agent.exchange + "_" + agent.market + '.yml'
    container_name = f'{agent.strategy}_{agent.id}_{user.id}'
    await hummingbot.create_hummingbot_instance(container_name, agent.password, agent.killswitch)
    await hummingbot.create_strategy_file(container_name, strategy_config, file_name)
    return schemas.PmmAgent.from_orm(agent)

# > Get Liquidity Mining Agents
async def get_lm_agents(user: schemas.User, db: _orm.Session):
    agents = db.query(models.LmAgent).filter_by(owner_id=user.id)
    return list(map(schemas.LmAgent.from_orm, agents))

# > Get Pure Market Making Agents
async def get_pmm_agents(user: schemas.User, db: _orm.Session):
    agents = db.query(models.PmmAgent).filter_by(owner_id=user.id)
    return list(map(schemas.PmmAgent.from_orm, agents))

# > Select Liquidity Mining Agent
async def _lm_agent_selector(agent_id: int, user: schemas.User, db: _orm.Session):
    agent = (
        db.query(models.LmAgent)
        .filter_by(owner_id=user.id)
        .filter(models.LmAgent.id == agent_id)
        .first()
    )
    if agent is None:
        raise HTTPException(
            status_code=404, detail="Agent does not exist")
    return agent

# > Select Pure Market Making Agent
async def _pmm_agent_selector(agent_id: int, user: schemas.User, db: _orm.Session):
    agent = (
        db.query(models.PmmAgent)
        .filter_by(owner_id=user.id)
        .filter(models.PmmAgent.id == agent_id)
        .first()
    )
    if agent is None:
        raise HTTPException(
            status_code=404, detail="Agent does not exist")
    return agent

# > Get Liquidity Mining Agent by ID
async def get_lm_agent(agent_id: int, user: schemas.User, db: _orm.Session):
    agent = await _lm_agent_selector(agent_id=agent_id, user=user, db=db)
    return schemas.LmAgent.from_orm(agent)

# > Get Pure Market Making Agent by ID
async def get_pmm_agent(agent_id: int, user: schemas.User, db: _orm.Session):
    agent = await _pmm_agent_selector(agent_id=agent_id, user=user, db=db)
    return schemas.PmmAgent.from_orm(agent)

# > Delete Liquidity Mining Agent by ID
async def delete_lm_agent(agent_id: int, user: schemas.User, db: _orm.Session):
    agent = await _lm_agent_selector(agent_id, user, db)
    db.delete(agent)
    db.commit()
    container_name = f'{agent.strategy}_{agent.id}_{user.id}'
    hummingbot.delete_container(container_name)

# > Delete Pure Market Making Agent by ID
async def delete_pmm_agent(agent_id: int, user: schemas.User, db: _orm.Session):
    agent = await _pmm_agent_selector(agent_id, user, db)
    db.delete(agent)
    db.commit()
    container_name = f'{agent.strategy}_{agent.id}_{user.id}'
    hummingbot.delete_container(container_name)

# > Update Liquidity Mining Agent by ID
async def update_lm_agent(agent_id: int, agent: schemas.LmAgentCreate, user: schemas.User, db: _orm.Session):
    agent_db = await _lm_agent_selector(agent_id, user, db)

    agent_db.filename = agent.filename
    agent_db.killswitch = agent.killswitch
    agent_db.token = agent.token
    agent_db.order_amount = agent.order_amount
    agent_db.spread = agent.spread
    agent_db.inventory_skew_enabled = agent.inventory_skew_enabled
    agent_db.target_base_pct = agent.target_base_pct
    agent_db.order_refresh_time = agent.order_refresh_time
    agent_db.order_refresh_tolerance_pct = agent.order_refresh_tolerance_pct
    agent_db.inventory_range_multiplier = agent.inventory_range_multiplier
    agent_db.volatility_interval = agent.volatility_interval
    agent_db.avg_volatility_period = agent.avg_volatility_period
    agent_db.volatility_to_spread_multiplier = agent.volatility_to_spread_multiplier
    agent_db.max_spread = agent.max_spread
    agent_db.max_order_age = agent.max_order_age

    db.commit()
    db.refresh(agent_db)

    strategy_config: Dict[str, str] = {
        "template_version": 3,
        "strategy": agent.strategy,
        "exchange": agent.exchange,
        "markets": agent.market,
        "token": agent.token,
        "order_amount": agent.order_amount,
        "spread": agent.spread,
        "inventory_skew_enabled": agent.inventory_skew_enabled,
        "target_base_pct": agent.target_base_pct,
        "order_refresh_time": agent.order_refresh_time,
        "order_refresh_tolerance_pct": agent.order_refresh_tolerance_pct,
        "inventory_range_multiplier": agent.inventory_range_multiplier,
        "volatility_interval": agent.volatility_interval,
        "avg_volatility_period": agent.avg_volatility_period,
        "volatility_to_spread_multiplier": agent.volatility_to_spread_multiplier,
        "max_spread": agent.max_spread,
        "max_order_age": agent.max_order_age,
    }

    file_name = agent.strategy + "_" + agent.exchange + "_" + agent.market + '.yml'
    container_name = f'{agent.strategy}_{agent_id}_{user.id}'
    await hummingbot.modify_conf(container_name, agent_db.killswitch)
    await hummingbot.create_strategy_file(container_name, strategy_config, file_name)
    return schemas.LmAgent.from_orm(agent_db)

# > Update Pure Market Making Agent by ID


async def update_pmm_agent(agent_id: int, agent: schemas.PmmAgentCreate, user: schemas.User, db: _orm.Session):
    agent_db = await _pmm_agent_selector(agent_id, user, db)

    agent_db.filename = agent.filename
    agent_db.killswitch = agent.killswitch
    agent_db.bid_spread = agent.bid_spread
    agent_db.ask_spread = agent.ask_spread
    agent_db.minimum_spread = agent.minimum_spread
    agent_db.order_refresh_time = agent.order_refresh_time
    agent_db.max_order_age = agent.max_order_age
    agent_db.order_refresh_tolerance_pct = agent.order_refresh_tolerance_pct
    agent_db.order_amount = agent.order_amount
    agent_db.price_ceiling = agent.price_ceiling
    agent_db.price_floor = agent.price_floor
    agent_db.moving_price_band_enabled = agent.moving_price_band_enabled
    agent_db.price_ceiling_pct = agent.price_ceiling_pct
    agent_db.price_band_refresh_time = agent.price_band_refresh_time
    agent_db.ping_pong_enabled = agent.ping_pong_enabled
    agent_db.order_levels = agent.order_levels
    agent_db.order_level_amount = agent.order_level_amount
    agent_db.order_level_spread = agent.order_level_spread
    agent_db.inventory_skew_enabled = agent.inventory_skew_enabled
    agent_db.inventory_target_base_pct = agent.inventory_target_base_pct
    agent_db.inventory_range_multiplier = agent.inventory_range_multiplier
    agent_db.inventory_price = agent.inventory_price
    agent_db.filled_order_delay = agent.filled_order_delay
    agent_db.hanging_orders_enabled = agent.hanging_orders_enabled
    agent_db.hanging_orders_cancel_pct = agent.hanging_orders_cancel_pct
    agent_db.order_optimization_enabled = agent.order_optimization_enabled
    agent_db.ask_order_optimization_depth = agent.ask_order_optimization_depth
    agent_db.bid_order_optimization_depth = agent.bid_order_optimization_depth
    agent_db.price_source = agent.price_source
    agent_db.price_type = agent.price_type
    agent_db.price_source_exchange = agent.price_source_exchange
    agent_db.price_source_market = agent.price_source_market
    agent_db.price_source_custom_api = agent.price_source_custom_api
    agent_db.custom_api_update_interval = agent.custom_api_update_interval
    agent_db.add_transaction_costs = agent.add_transaction_costs
    agent_db.take_if_crossed = agent.take_if_crossed
    agent_db.order_override = agent.order_override
    agent_db.should_wait_order_cancel_confirmation = agent.should_wait_order_cancel_confirmation
    agent_db.bid_order_level_spreads = agent.bid_order_level_spreads
    agent_db.ask_order_level_spreads = agent.ask_order_level_spreads
    agent_db.bid_order_level_amounts = agent.bid_order_level_amounts
    agent_db.ask_order_level_amounts = agent.ask_order_level_amounts

    db.commit()
    db.refresh(agent_db)

    strategy_config: Dict[str, str] = {
        "template_version": 24,
        "strategy": agent.strategy,
        "exchange": agent.exchange,
        "market": agent.market,
        "bid_spread": agent.bid_spread,
        "ask_spread": agent.ask_spread,
        "minimum_spread": agent.minimum_spread,
        "order_refresh_time": agent.order_refresh_time,
        "max_order_age": agent.max_order_age,
        "order_refresh_tolerance_pct": agent.order_refresh_tolerance_pct,
        "order_amount": agent.order_amount,
        "price_ceiling": agent.price_ceiling,
        "price_floor": agent.price_floor,
        "moving_price_band_enabled": agent.moving_price_band_enabled,
        "price_ceiling_pct": agent.price_ceiling_pct,
        "price_floor_pct": agent.price_floor_pct,
        "price_band_refresh_time": agent.price_band_refresh_time,
        "ping_pong_enabled": agent.ping_pong_enabled,
        "inventory_skew_enabled": agent.inventory_skew_enabled,
        "inventory_target_base_pct": agent.inventory_target_base_pct,
        "inventory_range_multiplier": agent.inventory_range_multiplier,
        "inventory_price": agent.inventory_price,
        "order_levels": agent.order_levels,
        "order_level_amount": agent.order_level_amount,
        "order_level_spread": agent.order_level_spread,
        "filled_order_delay": agent.filled_order_delay,
        "hanging_orders_enabled": agent.hanging_orders_enabled,
        "hanging_orders_cancel_pct": agent.hanging_orders_cancel_pct,
        "order_optimization_enabled": agent.order_optimization_enabled,
        "ask_order_optimization_depth": agent.ask_order_optimization_depth,
        "bid_order_optimization_depth": agent.bid_order_optimization_depth,
        "add_transaction_costs": agent.add_transaction_costs,
        "price_source": agent.price_source,
        "price_type": agent.price_type,
        "price_source_exchange": agent.exchange,
        "price_source_market": agent.price_source_market,
        "price_source_custom_api": agent.price_source_custom_api,
        "custom_api_update_interval": agent.custom_api_update_interval,
        "take_if_crossed": agent.take_if_crossed,
        "order_override": agent.order_override,
        "split_order_levels_enabled": agent.split_order_levels_enabled,
        "bid_order_level_spreads": agent.bid_order_level_spreads,
        "ask_order_level_spreads": agent.ask_order_level_spreads,
        "bid_order_level_amounts": agent.bid_order_level_amounts,
        "ask_order_level_amounts": agent.ask_order_level_amounts,
        "should_wait_order_cancel_confirmation": agent.should_wait_order_cancel_confirmation

    }
    file_name = agent.strategy + "_" + agent.exchange + "_" + agent.market + '.yml'
    container_name = f'{agent.strategy}_{agent_id}_{user.id}'

    await hummingbot.modify_conf(container_name, agent_db.killswitch)
    await hummingbot.create_strategy_file(container_name, strategy_config, file_name)
    return schemas.PmmAgent.from_orm(agent_db)


# ----------------------------------------> Exchange
# > Create/Connect Exchange
async def create_exchange(user: schemas.User, db: _orm.Session, exchange: schemas.ExchangeCreate):
    exchange_db = models.Exchange(
        name=exchange.name,
        owner_id=user.id,
    )

    if db.query(models.Exchange).filter(models.Exchange.name == exchange.name).first():
        raise HTTPException(
            status_code=400, detail="Exchange is already exists."
        )

    container_name = None
    lm_agent = db.query(models.LmAgent).filter_by(owner_id=user.id).first()
    pmm_agent = db.query(models.PmmAgent).filter_by(owner_id=user.id).first()
    if lm_agent:
        container_name: str = f'liquidity_mining_{lm_agent.id}_{user.id}'
    elif pmm_agent:
        container_name: str = f'pure_market_making{pmm_agent.id}_{user.id}'
    if container_name is None:
        raise HTTPException(
            status_code=400, detail="There is no agent created yet!"
        )
    hummingbot.create_exchange_config(container_name, exchange)

    db.add(exchange_db)
    db.commit()
    db.refresh(exchange_db)
    return schemas.Exchange.from_orm(exchange_db)

# > Get All Exchanges
async def get_exchanges(user: schemas.User, db: _orm.Session):
    exchanges = db.query(models.Exchange).filter_by(owner_id=user.id)
    return list(map(schemas.Exchange.from_orm, exchanges))

# > Select Exchange
async def _exchange_selector(exchange_id: int, user: schemas.User, db: _orm.Session):
    exchange = (
        db.query(models.Exchange)
        .filter_by(owner_id=user.id)
        .filter(models.Exchange.id == exchange_id)
        .first()
    )
    if exchange is None:
        raise HTTPException(
            status_code=404, detail="Exchange does not exist")
    return exchange

# > Get Exchange by ID
async def get_exchange(exchange_id: int, user: schemas.User, db: _orm.Session):
    exchange = await _exchange_selector(exchange_id=exchange_id, user=user, db=db)
    return schemas.Exchange.from_orm(exchange)

# > Delete Exchange by ID
async def delete_exchange(exchange_id: int, user: schemas.User, db: _orm.Session):
    exchange = await _exchange_selector(exchange_id, user, db)
    hummingbot.remove_exchange_configuration(exchange.name,)
    db.delete(exchange)
    db.commit()
