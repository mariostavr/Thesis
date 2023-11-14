# ======================================================================#
#                                EXCHANGES                              #
# ======================================================================#

exchange_urls = {
   'binance': 'https://www.binance.com/en/trade/{base_asset}_{quote_asset}',
   'kucoin': 'https://www.kucoin.com/trade/{base_asset}-{quote_asset}',
   'gateio': 'https://www.gate.io/trade/{base_asset}_{quote_asset}',
   'ascendex': 'https://ascendex.com/en/cashtrade-spottrading/usdt/{base_asset}-{quote_asset}/route',
}

exchange_api = {
   'binance': 'https://api.binance.com/api/v3/ticker/price?symbol={base_asset}{quote_asset}',
   'kucoin': 'https://api.kucoin.com/api/v1/market/orderbook/level1?symbol={base_asset}-{quote_asset}',
   'gateio': 'https://api.gate.io/api2/1/ticker/{base_asset}_{quote_asset}',
   'ascendex': "https://ascendex.com/api/pro/v1/ticker?symbol={base_asset}_{quote_asset}"
}
