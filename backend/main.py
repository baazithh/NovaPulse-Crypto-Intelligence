import asyncio
import random
import time
import socketio
from fastapi import FastAPI
import math
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI and Socket.io
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
app.mount('/ws', socketio.ASGIApp(sio))

# Assets to simulate
ASSETS = [
    {"id": "BTC", "name": "Bitcoin", "price": 64000.0, "volatility": 0.001},
    {"id": "ETH", "name": "Ethereum", "price": 3500.0, "volatility": 0.0015},
    {"id": "SOL", "name": "Solana", "price": 140.0, "volatility": 0.003},
    {"id": "ADA", "name": "Cardano", "price": 0.45, "volatility": 0.0025},
    {"id": "DOT", "name": "Polkadot", "price": 7.20, "volatility": 0.002},
]

# State tracking
asset_states = {asset["id"]: {"price": asset["price"], "history": [], "status": "Stable"} for asset in ASSETS}

# Simulation logic
async def update_prices():
    while True:
        timestamp = time.time() * 1000  # ms
        updates = []
        for asset in ASSETS:
            aid = asset["id"]
            state = asset_states[aid]
            
            # Random walk
            change = random.gauss(0, asset["volatility"])
            new_price = state["price"] * (1 + change)
            state["price"] = new_price
            
            # keep history of last 20 ticks for status
            state["history"].append(new_price)
            if len(state["history"]) > 20:
                state["history"].pop(0)
                
            # Determine status
            status = "Stable"
            if len(state["history"]) == 20:
                start_price = state["history"][0]
                diff = (new_price - start_price) / start_price
                if diff > 0.01:
                    status = "Surging Now"
                elif diff < -0.01:
                    status = "Crashing Now"
            state["status"] = status
            
            updates.append({
                "id": aid,
                "name": asset["name"],
                "price": round(new_price, 2),
                "timestamp": timestamp,
                "status": status,
                "change24h": round((new_price / asset["price"] - 1) * 100, 2)
            })
            
        await sio.emit("price_update", updates)
        await asyncio.sleep(0.5)  # 500ms real-time updates


async def simulate_predictions():
    reasons_buy = ["Whale Accumulation", "MACD Crossover", "Oversold RSI"]
    reasons_sell = ["Large Exchange Inflow", "RSI Overbought", "Bearish Divergence"]
    
    while True:
        await asyncio.sleep(random.uniform(5, 10))  # every 5-10s emit a random signal
        
        asset = random.choice(ASSETS)
        is_buy = random.choice([True, False])
        
        signalType = "RISE soon" if is_buy else "CRASH soon"
        reason = random.choice(reasons_buy) if is_buy else random.choice(reasons_sell)
        
        signal = {
            "id": f"sig-{int(time.time()*1000)}",
            "asset": asset["id"],
            "type": signalType,
            "reason": reason,
            "probability": round(random.uniform(0.75, 0.98), 2),
            "timestamp": time.time() * 1000,
            "priceAtSignal": round(asset_states[asset["id"]]["price"], 2)
        }
        
        await sio.emit("ml_prediction", signal)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(update_prices())
    asyncio.create_task(simulate_predictions())

@sio.on("connect")
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.on("disconnect")
def disconnect(sid):
    print(f"Client disconnected: {sid}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
