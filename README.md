# PriceShield AI with impact

Build a production-ready web application called “PriceShield AI – Essential Commodity Price Surge Early Warning System for India.”

This is an AI-powered economic intelligence platform that predicts sudden price surges in essential commodities 2–4 weeks in advance and provides intervention simulations.

🎯 Core Objective

The system must:

Predict short-term price surges (2–4 weeks ahead)

Detect abnormal price spikes using anomaly detection

Show state-wise and mandi-level trends

Provide a risk score for each commodity

Simulate government intervention impact

🥕 Commodities to Include

Onion

Tomato

Potato

Rice

Wheat

Tur Dal

Make the system modular so more commodities can be added.

📊 Data Inputs (Use Mock Data Initially but Structure Properly)

Design the system to support:

Historical mandi price data (time-series format)

Weather forecast data (temperature, rainfall)

Production/arrival volume data

Transportation disruption indicators

Storage/buffer stock estimates

Create structured dummy datasets for demonstration.

🧠 AI Features

Time-Series Price Forecasting Model

Use LSTM or Prophet-style model

Forecast next 30 days

Show prediction graph with confidence intervals

Price Surge Risk Scoring Engine

Combine:

Recent price volatility

Weather anomaly score

Arrival volume drop

Output:

Low Risk

Medium Risk

High Risk

Surge Probability %

Anomaly Detection Module

Detect abnormal historical price jumps

Highlight in red on graph

Intervention Simulation Engine

User can input:

“Release X tons buffer stock”

“Import Y quantity”

“Transport delay reduced by Z%”

System outputs:

Estimated new price trajectory

Expected % price reduction

📍 Dashboard Requirements

Main Dashboard:

India map heatmap (state-wise surge risk)

Commodity selection dropdown

Current average price

30-day forecast chart

Surge risk meter (visual gauge)

Intervention simulation panel

Historical price trend line chart

Alert panel for “High Surge Risk Commodities”

🧩 UI Requirements

Clean government-grade design

Dark + Light theme toggle

Data visualization heavy

Modern charts

Professional look (not startup toy style)

🛠 Tech Stack

Frontend: Modern responsive UI

Backend: API-based architecture

AI Module: Python-based forecasting logic

Mock API endpoints for data

Modular architecture for scaling

📈 Add an “Economic Impact” Section

Show:

How early detection reduces inflation

Consumer savings estimate

Government policy recommendation box

Farmer planning insight

🚀 Deployment Ready

Make the app:

Fully navigable

With demo data

Presentation ready

Investor-ready explanation tooltips

End goal:

This should look like a serious National Economic Monitoring Tool, not a college project.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://price-shield-ai.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/afbe12e5-bf6d-4b71-ac3d-6ddb125ab3ad).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
