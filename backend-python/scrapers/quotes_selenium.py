from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
import time

def scrape_quotes():
    selenium_host = os.getenv('SELENIUM_HOST', 'selenium-hub')
    selenium_url = f"http://{selenium_host}:4444/wd/hub"
    
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')

    print(f"Connecting to Selenium Hub at {selenium_url}...")
    driver = webdriver.Remote(
        command_executor=selenium_url,
        options=options
    )

    quotes_data = []
    try:
        driver.get("http://quotes.toscrape.com/js/")
        # Wait for the quotes to load (demonstrating JS handling)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "quote"))
        )
        
        quotes = driver.find_elements(By.CLASS_NAME, "quote")
        for quote in quotes:
            text = quote.find_element(By.CLASS_NAME, "text").text
            author = quote.find_element(By.CLASS_NAME, "author").text
            quotes_data.append({
                "text": text,
                "author": author,
                "source": "quotes.toscrape.com"
            })
    except Exception as e:
        print(f"Selenium Error: {e}")
    finally:
        driver.quit()
    
    return quotes_data

if __name__ == "__main__":
    print(scrape_quotes())
