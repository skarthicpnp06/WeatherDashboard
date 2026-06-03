# 🌤️ SkySync Weather Engine

SkySync Weather is a modern, responsive full-stack weather intelligence platform engineered with a React frontend web application and a robust Spring Boot backend architecture. The system integrates seamless automated multi-source weather API polling, real-time threshold alert dispatches via email, historical data persistence cache tracking, side-by-side visual analytics, and user customizable settings module preferences.

---

## ✨ Features

* **Real-time Atmospheric Sync:** Dual-gateway engine that dynamically queries the OpenWeather API and weatherapi.com simultaneously. It features automatic schema parsing fallback routes to an offline database cache index if network exceptions occur.
* **Granular 5-Day Forecasts:** Temporal dashboard cards parsing forecast projections including automated simulated rainfall precipitation levels ($mm$) and targeted Air Quality Index (AQI) evaluations.
* **Side-by-Side City Comparison:** Quick inspection layouts to load multi-station dimensions side by side for comparison.
* **Database Cache Analytics:** Interactive visual telemetry rendering historical trajectory graphs using `Recharts` for localized temperature curves, humidity indexes, and wind velocity tracking variables.
* **Targeted Alert Dispatches:** Active scheduling monitors that query atmospheric parameters every 30 seconds. It handles automatic asynchronous SMTP email transmissions if custom thresholds go `ABOVE` or `BELOW` desired targets.
* **Self-Service Alert Deactivation Panel:** Direct toggle tool to immediately turn off or terminate background alarms for specified profile combinations on demand.
* **Workspace Settings Configuration Control:**
  * Toggle interface workspaces seamlessly between modern Light Mode and Dark Mode gradients.
  * Instant scalar metrics switcher across Celsius ($^\circ\text{C}$)/Fahrenheit ($^\circ\text{F}$) and meters per second ($m/s$)/kilometers per hour ($km/h$).
  * Persistent favorite home city configuration utilizing local storage caching layers.
  * Real-time network architecture endpoint diagnostics verification.
  * One-click manual database cache eviction tools.

---

## 🛠️ Tech Stack & Architecture

### Frontend (Client Tier)
* **Library:** React.js (Functional components, Hooks, Context pipelines)
* **Tooling:** Vite (Rapid build bundling runner compilation)
* **Visualization:** Recharts (SVG layout charting)
* **Styling:** CSS3 Variables (Dynamic structural dark/light tokens injection mapping)

### Backend (Service Tier)
* **Framework:** Spring Boot 3.2.5 (Starter Web, Starter JPA, Starter Mail)
* **Background Processing:** Dynamic Task Scheduler Configurations via Spring `SchedulingConfigurer`
* **Concurrency Handling:** Asynchronous Multi-threaded SMTP Mailing (`@Async` pipelines)
* **REST client:** RestTemplate (External API JSON stream bindings ingestion mapping)

### Database Layer (Persistence Tier)
* **Relational Core Database:** MySQL 8.0+
* **ORM Connector Engine:** Hibernate / Spring Data JPA (Automated DDL lifecycle updates schema mapping)

---

## 🚀 Getting Started

### Prerequisites
Ensure your local system architecture has the following platforms deployed:
* **Java Development Kit (JDK):** Version 17 or higher
* **Build tool:** Apache Maven 3+
* **Runtime Environment:** Node.js (Version 18+) & NPM
* **Database Engine:** MySQL Server instance running locally

---

### 📦 1. Backend Service Configuration (Spring Boot)

1. Open a terminal instance and navigate to your `Backend` configuration directory.
2. Open `src/main/resources/application.properties` and configure your database parameters and your secure Gmail App Password token values:
```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/weatherdb?createDatabaseIfNotExist=true
   spring.datasource.username=YOUR_MYSQL_USERNAME
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   
   spring.mail.username=yourname@gmail.com
   spring.mail.password=your_16_digit_gmail_app_password
