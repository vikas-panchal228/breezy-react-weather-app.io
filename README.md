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
    See: <img width="2747" height="1404" alt="Screenshot 2025-05-25 233310" src="https://github.com/user-attachments/assets/97ca41cd-a8ff-4d2e-ab34-29f179830e8a" />
 & <img width="2455" height="1204" alt="Screenshot 2025-05-25 233333" src="https://github.com/user-attachments/assets/88395fe7-fb18-4025-a5c8-dae7e07a754f" />


  Sensor Monitor
    The dedicated hardware interface showing live readings from the ESP8266.
    See: <img width="3723" height="1983" alt="Screenshot 2025-05-25 233456" src="https://github.com/user-attachments/assets/cf999df6-bee7-41c3-93bf-938c1000bd26" />


  Data Summary & Export
    Historical trends and the data management suite for exporting readings.
    See: <img width="3739" height="1982" alt="Screenshot 2025-05-25 233532" src="https://github.com/user-attachments/assets/24bc3dd4-23c4-4a53-80ff-1ea84f091d1e" />
 & <img width="1535" height="823" alt="Screenshot 2025-05-26 131511" src="https://github.com/user-attachments/assets/11df0458-706c-41ba-a341-0500e82dc9ad" />
 & <img width="3686" height="1935" alt="Screenshot 2025-05-26 131658" src="https://github.com/user-attachments/assets/610104e0-7ee6-479e-9d47-1c6434f544c5" />

Setup & Installation
  Hardware Setup: Flash your ESP8266 with the provided firmware, ensuring it is configured to point to your server's endpoint.
  Environment Variables: Configure your API keys for weather and map services in a .env file.
  Install Dependencies: Run npm install (or equivalent) to set up the dashboard environment.
  Launch: Start the application and ensure the ESP8266 is on the same network or accessible via a public IP.
