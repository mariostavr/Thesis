#======================================================================#
#                           DATABASE SCHEMAS                           #
#======================================================================#

#> Modules
import pydantic

#----------------------------------------> User
class _UserBase(pydantic.BaseModel):
    username: str
    email: str
    dateOfBirth: str

class UserCreate(_UserBase):
    password: str

    class Config:
        orm_mode = True

class User(_UserBase):
    id: int

    class Config:
        orm_mode = True



#----------------------------------------> Agent
class _LmAgentBase(pydantic.BaseModel):
    filename: str
    password: str
    killswitch: float
    strategy: str
    exchange: str
    market: str
    token: str
    order_amount: float
    spread: float
    inventory_skew_enabled: bool
    target_base_pct: float
    order_refresh_time: float
    order_refresh_tolerance_pct: float
    inventory_range_multiplier: float
    volatility_interval: int
    avg_volatility_period: int
    volatility_to_spread_multiplier: float
    max_spread: float
    max_order_age: float
    
class LmAgentCreate(_LmAgentBase):
    pass

class LmAgent(_LmAgentBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True

class _PmmAgentBase(pydantic.BaseModel):
    filename: str
    password: str
    strategy : str
    killswitch: float
    exchange : str
    market : str
    bid_spread : float
    ask_spread : float
    minimum_spread : float
    order_refresh_time : float
    max_order_age : float
    order_refresh_tolerance_pct : float
    order_amount : float
    price_ceiling : float
    price_floor : float
    moving_price_band_enabled : bool
    price_ceiling_pct : float
    price_floor_pct : float
    price_band_refresh_time : int
    ping_pong_enabled : bool
    inventory_skew_enabled : bool
    inventory_target_base_pct : float
    inventory_range_multiplier : float
    inventory_price : float
    order_levels : int
    order_level_amount : int
    order_level_spread : float
    filled_order_delay : int
    hanging_orders_enabled : bool
    hanging_orders_cancel_pct : float
    order_optimization_enabled : bool
    ask_order_optimization_depth : int
    bid_order_optimization_depth : int
    add_transaction_costs : bool
    price_source : str
    price_type : str
    price_source_exchange : str
    price_source_market : str
    price_source_custom_api : str
    custom_api_update_interval : float
    take_if_crossed : bool
    order_override : bool
    split_order_levels_enabled : bool
    bid_order_level_spreads : str
    ask_order_level_spreads : str
    bid_order_level_amounts : str
    ask_order_level_amounts : str
    should_wait_order_cancel_confirmation : bool

    
class PmmAgentCreate(_PmmAgentBase):
    pass
class PmmAgent(_PmmAgentBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True


#----------------------------------------> Exchanges
class _ExchnageBase(pydantic.BaseModel):
    name: str

class ExchangeCreate(_ExchnageBase):
    api_key: str
    secret_api_key: str

class Exchange(_ExchnageBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True