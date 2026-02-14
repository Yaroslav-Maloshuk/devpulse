import pandas as pd
import numpy as np
from collections import Counter
import re

def process_data(jobs, quotes):
    # Convert to DataFrame
    df_jobs = pd.DataFrame(jobs)
    
    # Keyword Analysis on Job Titles
    all_titles = " ".join(df_jobs['title'].astype(str)).lower()
    # Simple tokenization
    words = re.findall(r'\b\w+\b', all_titles)
    
    # Filter common keywords (very basic stop words for demo)
    stop_words = {'python', 'senior', 'junior', 'developer', 'engineer', 'backend', 'full', 'stack', 'software', 'devops'}
    keywords = [w for w in words if w not in stop_words and len(w) > 3]

    # Numpy for frequency (simulated heavy lifting)
    # In a real scenario, numpy might be used for vectorization or more complex stats
    unique, counts = np.unique(keywords, return_counts=True)
    keyword_freq = dict(zip(unique, counts))
    
    # Top 5 keywords
    top_keywords = sorted(keyword_freq.items(), key=lambda x: x[1], reverse=True)[:5]
    
    return {
        "job_count": len(jobs),
        "quote_count": len(quotes),
        "top_keywords": [{"keyword": k, "count": int(v)} for k, v in top_keywords],
        "latest_jobs": jobs[:5],
        "latest_quotes": quotes[:3]
    }
