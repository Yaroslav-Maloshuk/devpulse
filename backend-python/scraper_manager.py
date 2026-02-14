import asyncio
from scrapers.python_jobs_spider import PythonJobsSpider
from scrapers.quotes_selenium import scrape_quotes
from data_processor import process_data
from scrapy.crawler import CrawlerProcess, CrawlerRunner
from scrapy.utils.project import get_project_settings
from crochet import setup, wait_for
import json
import redis
import os

# Initialize Crochet to run Scrapy in a separate thread but allowing async control
setup()

redis_client = redis.Redis(host=os.getenv('REDIS_HOST', 'redis'), port=6379, db=0)

class ScraperManager:
    def __init__(self):
        self.jobs_data = []

    @wait_for(timeout=60.0)
    def run_scrapy(self):
        # We need a custom runner to capture the data
        runner = CrawlerRunner(get_project_settings())
        d = runner.crawl(PythonJobsSpider)
        # We need to hook into the signals to get items, but for simplicity in this demo,
        # we can modify the spider to write to a class attribute or file.
        # Let's simple use a global list or similar mechanis inside the spider if we could,
        # but Scrapy is async.
        # Alternatively, simpler: use Scrapy's feed export to a temporary JSON file.
        return d

    def run_all(self):
        print("Starting Scrapy...")
        # For simplicity in this demo, we will use `subprocess` to run scrapy if we want to avoid Reactor issues,
        # OR use crochet. Let's use a subprocess for Scrapy to keep it robust against the main event loop.
        # Actually, let's just use `scrapy runspider` via os.system or subprocess and dump to file.
        if os.path.exists("jobs.json"):
            os.remove("jobs.json")
            
        os.system("scrapy runspider scrapers/python_jobs_spider.py -o jobs.json")
        
        jobs = []
        if os.path.exists("jobs.json"):
            with open("jobs.json", "r") as f:
                try:
                    jobs = json.load(f)
                except:
                    pass
        
        print(f"Scrapy finished. Found {len(jobs)} jobs.")
        redis_client.publish('updates', json.dumps({"type": "log", "message": f"Scraped {len(jobs)} jobs from Python.org"}))

        print("Starting Selenium...")
        redis_client.publish('updates', json.dumps({"type": "log", "message": "Starting Selenium scrape..."}))
        quotes = scrape_quotes()
        print(f"Selenium finished. Found {len(quotes)} quotes.")
        redis_client.publish('updates', json.dumps({"type": "log", "message": f"Scraped {len(quotes)} quotes via Selenium"}))

        print("Processing data...")
        stats = process_data(jobs, quotes)
        
        # Save to Redis for persistence or caching
        redis_client.set('latest_stats', json.dumps(stats))
        
        # Notify completion
        redis_client.publish('updates', json.dumps({"type": "stats", "data": stats}))
        redis_client.publish('updates', json.dumps({"type": "log", "message": "Data processing complete."}))
        
        return stats

if __name__ == "__main__":
    manager = ScraperManager()
    manager.run_all()
