from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from scraper_manager import ScraperManager
import redis
import json
import os

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

redis_client = redis.Redis(host=os.getenv('REDIS_HOST', 'redis'), port=6379, db=0)
scraper_manager = ScraperManager()

def run_scrapers_background():
    try:
        redis_client.publish('updates', json.dumps({"type": "status", "status": "running"}))
        scraper_manager.run_all()
        redis_client.publish('updates', json.dumps({"type": "status", "status": "idle"}))
    except Exception as e:
        redis_client.publish('updates', json.dumps({"type": "error", "message": str(e)}))
        print(f"Error running scrapers: {e}")

@app.get("/api/stats")
async def get_stats():
    # Retrieve latest stats from Redis (or DB)
    stats_json = redis_client.get('latest_stats')
    if stats_json:
        return json.loads(stats_json)
    return {"message": "No stats available yet. Trigger a scrape to populate data.", "data": {}}

@app.post("/api/trigger")
async def trigger_scrape(background_tasks: BackgroundTasks):
    background_tasks.add_task(run_scrapers_background)
    return {"message": "Scraping started in background"}

@app.get("/")
def read_root():
    return {"Hello": "DevPulse API"}
