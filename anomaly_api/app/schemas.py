from pydantic import BaseModel

class StockRequest(BaseModel):
    symbol: str
    from_date: str = "2018-01-01"  # valeur par défaut
    to_date: str = "2025-07-15"    # valeur par défaut

 
