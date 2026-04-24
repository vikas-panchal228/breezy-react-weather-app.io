Weather & ESP8266 Sensor Dashboard
This project is a full-stack web application designed to provide real-time weather information and localized environmental monitoring. It integrates external weather API data with live readings from an ESP8266-based sensor device, offering a comprehensive view of both outdoor and indoor conditions.

Features
1. Real-Time Weather Dashboard
  Localized Data: Displays current conditions for Jagādhri, IN, including temperature, "feels like" metrics, and general weather descriptions (e.g., "Few Clouds").

  Detailed Metrics: Provides humidity, wind speed, sunrise, and sunset times.

  Air Quality Monitoring: Integrated Google Maps overlay showing AQI levels and specific pollutant concentrations ($PM_{2.5}$, $PM_{10}$, $CO$, $O_3$, etc.).

  5-Day Forecast: Visual forecast indicating upcoming temperature trends and weather conditions.

2. ESP8266 Sensor Integration
  Live Monitoring: Connects to an ESP8266 device to display real-time indoor temperature and humidity.

  Device Status: Features a "Live" connection indicator and total reading count.

  Manual Refresh: Users can trigger an immediate data fetch from the sensor.

3. Data Storage & Analytics
   Historical Logging: Stores sensor data for up to 10 days.

  Sensor Summaries: Provides daily averages, minimums, and maximums for both temperature and humidity.

  Detailed Readings: An expandable view to inspect specific data points collected throughout the day.

4. Data Management
  Export Functionality: Users can export their collected sensor data in CSV or JSON formats for external analysis.

  Storage Control: Option to manually clear all stored historical data with a single click.

Technical Overview
  The application is built with a modern dark-themed UI, focusing on high scannability and data visualization.

  Frontend	Responsive web interface with Dark Mode support.
  Hardware	ESP8266 Microcontroller with Temperature/Humidity sensors (e.g., DHT11/DHT22).
  Data Flow	ESP8266 → Backend Server/API → Database → Frontend Dashboard.
  APIs	OpenWeatherMap (or similar) for external weather and Google Maps for AQI visualization.

Screenshots
  Weather & AQI View
    The main dashboard displays localized weather and a detailed Air Quality Index map.
    See: Screenshot 2025-05-25 233310.png & Screenshot 2025-05-25 233333.jpg

  Sensor Monitor
    The dedicated hardware interface showing live readings from the ESP8266.
    See: Screenshot 2025-05-25 233456.png

  Data Summary & Export
    Historical trends and the data management suite for exporting readings.
    See: Screenshot 2025-05-25 233532.png & Screenshot 2025-05-26 131511.png

Setup & Installation
  Hardware Setup: Flash your ESP8266 with the provided firmware, ensuring it is configured to point to your server's endpoint.
  Environment Variables: Configure your API keys for weather and map services in a .env file.
  Install Dependencies: Run npm install (or equivalent) to set up the dashboard environment.
  Launch: Start the application and ensure the ESP8266 is on the same network or accessible via a public IP.
