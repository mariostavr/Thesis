#======================================================================#
#                             API CALLS                               #
#======================================================================#

#> Modules and Dependecies
from fastapi import FastAPI, Depends, Query, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import pydantic as _pydantic
import schemas 
import models 
import datetime
import httpx
import requests
from typing import List, Union, Dict
import services_coinrep as coinrep
import services_hummingbot as hummingbot
import docker

import exchanges

#> FastAPI App Initialization
app = FastAPI()

#> CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

#> Docker Client Initialization
docker_client = docker.from_env()
try:
    docker_client.ping()
except docker.errors.APIError:
    docker.from_env().daemon


#--------------------> Root Endpoint

@app.get("/", tags=["Root"])
async def root():
    return ("Backend Root")


#=============================== Coinrep ===============================#
#--------------------> User Management Endpoints
#> Create User
@app.post("/signup", tags=["User Management"])
async def signup_user(
    user: schemas.UserCreate, db: Session = Depends(coinrep.get_db)
):
    allowedBirthDate = datetime.datetime.now() - datetime.timedelta(days=365 * 18)
    if datetime.datetime.strptime(user.dateOfBirth, '%Y-%m-%d').date() > allowedBirthDate.date():
        raise HTTPException(
            status_code=400, detail="You must be at least 18 years old to create an account!"
        )

    db_user = db.query(models.User).filter(
        models.User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=400, detail="Email already in use!")

    user = await coinrep.create_user(user, db)
    return await coinrep.create_access_token(user)


#> Login User
@app.post("/login", tags=["User Management"])
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(coinrep.get_db),
):
    user = await coinrep.authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=401, detail="Invalid Credentials!")
    hummingbot.start_broker_instance(user.id)
    return await coinrep.create_access_token(user)


#> Get User
@app.get("/users/profile", response_model=schemas.User, tags=["User Management"])
async def get_user(user: schemas.User = Depends(coinrep.get_current_user)):
    return user


#--------------------> Agent Management Endpoints
#> Create Agent
@app.post("/agent/lm", response_model=schemas.LmAgent, tags=["Agent Management"])
async def create_lm_agent(
    agent: schemas.LmAgentCreate,
    user: schemas.User = Depends(coinrep.get_current_user),
    db: Session = Depends(coinrep.get_db),
):
    return await coinrep.create_lm_agent(user=user, db=db, agent=agent)

@app.post("/agent/pmm", response_model=schemas.PmmAgent, tags=["Agent Management"])
async def create_pmm_agent(
    agent: schemas.PmmAgentCreate,
    user: schemas.User = Depends(coinrep.get_current_user),
    db: Session = Depends(coinrep.get_db),
):
    return await coinrep.create_pmm_agent(user=user, db=db, agent=agent)

#> Get All Agents
@app.get("/agents", response_model=List[Union[schemas.LmAgent, schemas.PmmAgent]], tags=["Agent Management"])
async def get_all_agents(
    user: schemas.User = Depends(coinrep.get_current_user),
    db: Session = Depends(coinrep.get_db),
):
    lm_agents = await coinrep.get_lm_agents(user=user, db=db)
    pmm_agents = await coinrep.get_pmm_agents(user=user, db=db)
    all_agents = lm_agents + pmm_agents
    return all_agents

@app.get("/agents/lm", response_model=List[schemas.LmAgent], tags=["Agent Management"])
async def get_lm_agents(
    user: schemas.User = Depends(coinrep.get_current_user),
    db: Session = Depends(coinrep.get_db),
):
    return await coinrep.get_lm_agents(user=user, db=db)
   

@app.get("/agents/pmm", response_model=List[schemas.PmmAgent], tags=["Agent Management"])
async def get_pmm_agents(
    user: schemas.User = Depends(coinrep.get_current_user),
    db: Session = Depends(coinrep.get_db),
):
    return await coinrep.get_pmm_agents(user=user, db=db)

#> Get Agent by ID
@app.get("/agent/{strategy}/{agent_id}", status_code=200, tags=["Agent Management"])
async def get_agent(
    strategy: str,
    agent_id: int,
    user: schemas.User = Depends(coinrep.get_current_user),
    db: Session = Depends(coinrep.get_db),
):
    if strategy == "liquidity_mining":
        return await coinrep.get_lm_agent(agent_id, user, db)
    elif strategy == "pure_market_making":
        return await coinrep.get_pmm_agent(agent_id, user, db)

#> Delete Agent by ID
@app.delete("/agent/{strategy}/{agent_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Agent Management"])
async def delete_agent(
    strategy: str,
    agent_id: int,
    user: schemas.User = Depends(coinrep.get_current_user),
    db: Session = Depends(coinrep.get_db),
):
    if strategy == "liquidity_mining":
        await coinrep.delete_lm_agent(agent_id, user, db)
    elif strategy == "pure_market_making":
        await coinrep.delete_pmm_agent(agent_id, user, db)
    return {"message": "Successfully Deleted"}

#> Update Agent by ID
@app.put("/agent/{strategy}/{agent_id}", status_code=200, tags=["Agent Management"])
async def update_agent(
    strategy: str,
    agent_id: int,
    agent: Union[schemas.LmAgentCreate, schemas.PmmAgentCreate],
    user: schemas.User = Depends(coinrep.get_current_user),
    db: Session = Depends(coinrep.get_db),
):
    if strategy == "liquidity_mining":
        await coinrep.update_lm_agent(agent_id, agent, user, db)
    elif strategy == "pure_market_making":
        await coinrep.update_pmm_agent(agent_id, agent, user, db)
    return {"message": "Successfully Updated"}


#> Create Exchnage
@app.post("/exchanges", response_model=schemas.Exchange, tags=["Exchange Management"])
async def create_exchange(
    exchange: schemas.ExchangeCreate,
    user: schemas.User = Depends(coinrep.get_current_user),
    db: Session = Depends(coinrep.get_db),
):
    return await coinrep.create_exchange(user=user, db=db, exchange=exchange)

#> Get All Exchanges
@app.get("/exchanges", response_model=List[schemas.Exchange], tags=["Exchange Management"])
async def get_exchangess(
    user: schemas.User = Depends(coinrep.get_current_user),
    db: Session = Depends(coinrep.get_db),
):
    return await coinrep.get_exchanges(user=user, db=db)

#> Delete Exchange by ID
@app.delete("/exchanges/{exchange_id}", status_code=204, tags=["Exchange Management"])
async def delete_exchange(
    exchange_id: int,
    user: schemas.User = Depends(coinrep.get_current_user),
    db: Session = Depends(coinrep.get_db),
):
    await coinrep.delete_exchange(exchange_id, user, db)
    return {"message", "Successfully Deleted"}



#=============================== Docker ===============================#
#--------------------> Agent Instance Manegement Endpoing
#> Get Instance ID
@app.get('/id/{container_name}', tags=['Agent Instance Management'])
async def get_instance_id(
    container_name: str,
    container_path: str = '/home/hummingbot/conf',
    user: schemas.User = Depends(coinrep.get_current_user)
):
    container_name = container_name + '_' + str(user.id)
    return await hummingbot.get_instance_id(container_name=container_name, container_path=container_path)

#> Status Instance
@app.post('/status/{container_name}', tags=["Agent Instance Management"])
async def status_instance(
    container_name:str,
    user: schemas.User = Depends(coinrep.get_current_user)
):
    container_name = container_name + '_' + str(user.id)
    try:
        status = hummingbot.status_hummingbot_instance(container_name)
        return {"status": status}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


#> Start Instance
@app.post('/start/{container_name}', tags=["Agent Instance Management"])
async def start_instance(
    container_name:str,
    user: schemas.User = Depends(coinrep.get_current_user)
):
    container_name  = container_name + '_' + str(user.id)
    hummingbot.start_hummingbot_instance(container_name)
    return {"message": "Successfully Started"}

#> Stop Instance
@app.post('/stop/{container_name}', tags=["Agent Instance Management"])
async def stop_instance(
    container_name:str,
    user: schemas.User = Depends(coinrep.get_current_user)
):
    container_name  = container_name + '_' + str(user.id)
    hummingbot.stop_hummingbot_instance(container_name)
    return {"message": "Successfully stopped"}


#--------------------> Broker Instance Manegement Endpoing
#> Stop Broker Instance
@app.post('/broker/stop', tags=["Broker Instance Management"])
async def stop_broker_instance(
    user: schemas.User = Depends(coinrep.get_current_user),
):
    hummingbot.stop_broker_instance(user.id)
    return {"message": "Successfully Started"}




#=============================== Hummingbot ===============================#
#------------------------------> API Endpoints
#> Get Markets
@app.get("/markets", tags=["Hummingbot API"])
async def get_markets():
    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.hummingbot.io/bounty/markets")
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Error fetching markets data")
        markets = response.json()
    return markets

#> Get DEX Markets
@app.get("/dexmarkets", tags=["Hummingbot API"])
async def get_dexmarkets():
    async with httpx.AsyncClient() as client:
        response = await client.get("https://dminer-api.hummingbot.io/dminer/v1/pools")
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Error fetching dex markets data")
        dexmarkets = response.json()
    return dexmarkets

#> Get Market ID
@app.get("/market_id", tags=["Hummingbot API"]) 
async def get_market_id(base_asset: str, quote_asset: str, exchange: str):
    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.hummingbot.io/bounty/markets")
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Error fetching markets data")
        markets = response.json()

    for market in markets["markets"]:
        if (
            market["base_asset"] == base_asset
            and market["quote_asset"] == quote_asset
            and market["exchange_name"] == exchange
        ):
            market_id = market["market_id"]
            return market_id
    raise HTTPException(status_code=404, detail="Market not found")

#> Get Market Snapshot
@app.get("/market/{market_id}/snapshot/{interval}", tags=["Hummingbot API"])
#chart_Interval --> 1:1h, 2:24h, 3:7D
async def get_market_snapshot(market_id: str, interval: int):
    url = f"https://api.hummingbot.io/bounty/charts/market_band?market_id={market_id}&chart_interval={interval}"
    response = requests.get(url)
    return response.json()



#=============================== External APIs ===============================#
@app.get("/get_exchange_url")
async def get_exchange_url(exchange: str, base_asset: str, quote_asset: str):
    url = exchanges.exchange_urls.get(exchange)

    if url:
        spot = url.format(base_asset=base_asset, quote_asset=quote_asset) 
        return {"url": spot}
    else:
        return {"error": "Exchange is not available"}


@app.get("/get_current_price")
async def get_current_price(exchange: str, base_asset: str, quote_asset: str):
    url = exchanges.exchange_api.get(exchange)

    if url:
        api = url.format(base_asset=base_asset, quote_asset=quote_asset) 

        try:
            response = requests.get(api)
            response_data = response.json()

            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Error fetching markets data")
            
            price = response_data.get("price")

            if price is not None:
                return {"price": price}
            else:
                return {"error": "Price not found in API response"}
        except Exception as e:
            return {"error": f"Error fetching data from {exchange}: {str(e)}"}
    else:
        return {"error": "Exchange API is not available"}
