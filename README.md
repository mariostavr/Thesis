# Low-Code Platform for Liquidity Mining Agents in Cryptocurrency Markets
In our days, the term “Cryptocurrency” has been evolved to the point where it now constitutes a part of everyday life. In recent years, cryptocurrency trading has become increasingly popular and continues to grow exponentially. New markets are constantly being announced by various exchanges, resulting in increased cryptocurrency trading activity.
Despite the daily rapid growth, many of these markets do not meet efficiency and functionality standards. The factor that determines the health of a market is called liquidity. Liquidity is perhaps the most important metric for a market.
Providing liquidity is considered a necessary function in financial markets, as its purpose is to ensure their smooth operation. In traditional financial markets, providing liquidity was accessible by a limited number of entities that had the necessary resources to actively participate and provide liquidity. However, due to the limited number of liquidity providers, this could potentially lead to fragmented liquidity in various markets.
The introduction of liquidity mining aims to address the above problem that was mentioned, the limited number of participants in liquidity provision. It allows anyone to provide liquidity in centralized and decentralized markets by developing and configuring automated market-making strategies according to their preferences.

# Dependencies
Python: https://www.python.org/downloads/
Node: https://nodejs.org/en/download
Docker: https://docs.docker.com/desktop/install/windows-install/

# How to start
Backend Initialization:
1. Go to *"backend"* directory
2. Run the **command "python"** and then the following commands
	1. **import services_coinrep**
	2. **services_coinrep.create_database()**
4. Go back to *"backend"* directory
5. Run the **command "uvicorn main:app --reload"**
>
>
Frontend Initialization:
1. Go to *"frontend"* directory
2. Run the following **commands**:
	1. **npm install**
	2. **npm start**

