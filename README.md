# ⚡ DevPulse

<img src="https://github.com/Yaroslav-Maloshuk/devpulse/blob/main/devpulse_001.png" width="1000" height="1000">
<img src="https://github.com/Yaroslav-Maloshuk/devpulse/blob/main/devpulse_002.png" width="1000" height="1000">
<img src="https://github.com/Yaroslav-Maloshuk/devpulse/blob/main/devpulse_003.png" width="1000" height="1000">

![Python](https://img.shields.io/badge/Python-3.14-blue?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Scrapy](https://img.shields.io/badge/Scrapy-Crawler-60A839?style=for-the-badge&logo=rss&logoColor=white)
![Selenium](https://img.shields.io/badge/Selenium-Browser_Automation-43B02A?style=for-the-badge&logo=selenium&logoColor=white)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Real_Time-DC382D?style=for-the-badge&logo=redis&logoColor=white)

## 📋 Project Overview

A high-performance **tech trends monitoring dashboard** built with a microservices architecture. DevPulse scrapes job boards and quote sites in real-time, processes data for keyword analytics, and streams live updates to a modern React frontend via WebSockets.

This project demonstrates a robust data pipeline integrating **Scrapy** (static sites) and **Selenium** (dynamic JS sites), orchestrated by **FastAPI** and **Redis Pub/Sub** for reliable background processing and instant frontend updates.

---

## ✨ Features

*   **📊 Real-time Dashboard:** Live updates of job counts, quotes, and keyword trends via Socket.io.
*   **🕷️ Dual-Engine Scraping:** Combines the speed of **Scrapy** for `python.org` with the power of **Selenium (Headless Chromium)** for dynamic JS content.
*   **📈 Keyword Analytics:** Leveraging **Pandas** & **Numpy** to extract and rank trending tech terms from job titles.
*   **🔒 Secure Access:** Served via **Nginx** reverse proxy with self-signed HTTPS certificates.
*   **🌙 Premium UI:** Sleek, responsive Dark Mode interface built with **Tailwind CSS**.

---

## 🛠️ Tech Stack

### Core Backend
*   **Python 3.14:** Utilizing the latest feature-rich version.
*   **FastAPI:** High-performance async web framework.
*   **uv:** Blazing fast Python package manager for optimized builds.
*   **Redis:** Pub/Sub messaging layer for inter-service communication.

### Data & Processing
*   **Scrapy:** Efficient, asynchronous web crawling framework.
*   **Selenium (ARM64 Optimized):** Browser automation running in a dedicated `seleniarm/standalone-chromium` container.
*   **Pandas & Numpy:** High-performance data cleaning and statistical analysis.

### Infrastructure & Frontend
*   **Docker & Docker Compose:** Full containerization of 5 microservices.
*   **Nginx:** High-performance reverse proxy (Listening on ports 8000 & 443 with SSL).
*   **React (Vite):** Fast, modern frontend library.
*   **Tailwind CSS:** Utility-first CSS framework for rapid UI development.
*   **Recharts:** Composable charting library for React.
*   **Node.js 24:** Dedicated WebSocket server for real-time event streaming.

---

## 🚀 Setup & Installation

### Prerequisites
*   Docker & Docker Compose installed.

### Quick Start
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/devpulse.git
    cd devpulse
    ```

2.  **Build and Start:**
    ```bash
    docker-compose up --build
    ```

3.  **Access the Dashboard:**
    *   **HTTPS:** Open [https://localhost](https://localhost) (Accept the self-signed certificate warning)
    *   **HTTP (Proxy):** Open [http://localhost:8000](http://localhost:8000)

---

## 🏆 Key Achievements
*   **Hybrid Scraping Engine:** Seamlessly orchestrated Scrapy and Selenium within a single workflow.
*   **Real-Time Data Pipeline:** Zero-delay updates from scraper backend to React frontend using Redis and Socket.io.
*   **Modern Infrastructure:** Fully Dockerized environment with Nginx reverse proxy and HTTPS support out-of-the-box.
*   **Optimized for Apple Silicon:** Pre-configured with ARM64-compatible images (`seleniarm`, `python:3.14-slim`, `node:24-alpine`).
