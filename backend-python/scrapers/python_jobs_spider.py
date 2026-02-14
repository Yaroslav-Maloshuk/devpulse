import scrapy

class PythonJobsSpider(scrapy.Spider):
    name = "python_jobs"
    start_urls = ['https://www.python.org/jobs/']
    custom_settings = {
        'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'ROBOTSTXT_OBEY': False,
        'LOG_LEVEL': 'WARNING'
    }

    def parse(self, response):
        jobs = []
        for job in response.css('.list-recent-jobs li'):
            title = job.css('h2 a::text').get()
            # Company is in a text node mixed with other tags, ::text gets all direct text nodes
            company_text = job.css('h2 span.listing-company-name::text').getall()
            company = "".join([c.strip() for c in company_text if c.strip()])
            
            jobs.append({
                'title': title.strip() if title else 'Unknown',
                'company': company if company else 'Unknown',
                'source': 'python.org'
            })
        
        # In a real scenario, we might yield items to a pipeline or simply return them.
        # Since we are running this from a script (scraper_manager), we will just yield items.
        for job in jobs:
            yield job

        # Pagination: only if needed. For this demo, first page is enough.
        # next_page = response.css('li.next a::attr(href)').get()
        # if next_page:
        #     yield response.follow(next_page, self.parse)
