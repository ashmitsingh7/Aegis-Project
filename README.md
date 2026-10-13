# Aegis - AI-Powered Decision Intelligence Platform

Aegis is an AI-powered decision intelligence platform for critical electrical infrastructure. It monitors electrical asset health, predicts degradation, simulates possible interventions through a digital twin, and recommends the safest and most cost-effective action to an engineer.

## Project Overview

This project implements a working end-to-end prototype focused on one critical electrical asset: a power transformer.

**Core Innovation**: Unlike traditional predictive maintenance systems that stop at `Observe → Predict → Alert`, Aegis goes further:
```
Observe → Predict → Simulate → Evaluate → Recommend → Explain
```

## Repository Structure

```
aegis/
├── backend/
│   ├── api/              # API endpoints and routing
│   ├── models/           # ML models for health prediction
│   │   ├── health_model.py
│   │   ├── rul_model.py
│   │   └── risk_model.py
│   ├── digital_twin/     # Transformer simulation
│   │   └── enhanced_transformer.py
│   ├── decision_engine/  # Action evaluation and optimization
│   │   └── optimizer.py
│   └── simulator/        # Telemetry simulation
│       └── telemetry.py
├── frontend/
│   ├── app/              # Next.js 14 App Router pages
│   │   ├── page.tsx              # Dashboard
│   │   ├── asset/[assetId]/      # Asset detail
│   │   ├── decision/             # Decision center
│   │   ├── simulation/           # Digital twin simulation
│   │   ├── analytics/            # Advanced analytics
│   │   ├── demo/                 # Demo mode
│   │   ├── degradation/          # Degradation scenario
│   │   └── validation/           # Validation testing
│   ├── components/       # React components
│   │   ├── visualizations/       # Charts (HealthGauge, RiskFactors, etc.)
│   │   └── analytics/            # Analytics panels
│   ├── lib/              # Services & utilities
│   │   ├── apiService.ts         # Backend API client
│   │   └── analytics/            # Advanced analytics service
│   └── types/            # TypeScript types
├── docs/                 # Documentation
│   ├── ADVANCED_FEATURES_SUMMARY.md
│   ├── Aegis_BUILD_AND_RUN_GUIDE.md
│   ├── DEMONSTRATION_SUMMARY.md
│   ├── IMPLEMENTATION_SUMMARY.md
│   ├── IMPROVEMENTS_SUMMARY.md
│   ├── QUICK_START.md
│   └── USAGE_GUIDE_ADVANCED_FEATURES.md
└── start_aegis.py        # Startup script (backend + frontend)
```

## Quick Start

```bash
# Option 1: Startup script (recommended)
python start_aegis.py

# Option 2: Manual
cd backend && pip install -r requirements.txt && python main.py
cd frontend && npm install && npm run dev
```

**Access Points:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Platform Features

1. **Dashboard** - Real-time asset health, risk, telemetry trends, AI recommendation
2. **Asset Detail** - Deep dive: health, risk, live telemetry, model explanations
3. **Decision Center** - Compare interventions by risk/cost/downtime/life impact
4. **Digital Twin** - What-if simulation: adjust load, ambient temp, cooling mode
5. **Advanced Analytics** - Root cause analysis, what-if scenarios, optimization
6. **Validation** - Test scenarios with accuracy metrics

## Team Structure

- **Person 1**: AI/Asset Health Engineer (Health scoring, failure prediction, RUL)
- **Person 2**: Digital Twin/Simulation Engineer (Transformer behavior modeling)
- **Person 3**: Decision Intelligence Engineer (Action evaluation, optimization)
- **Person 4**: Full-Stack/Product Engineer (UI, integration, UX)

## Documentation

See the [`docs/`](docs/) folder for detailed guides:

| Document | Description |
|----------|-------------|
| [QUICK_START.md](docs/QUICK_START.md) | Quick start guide |
| [Aegis_BUILD_AND_RUN_GUIDE.md](docs/Aegis_BUILD_AND_RUN_GUIDE.md) | Build and run instructions |
| [USAGE_GUIDE_ADVANCED_FEATURES.md](docs/USAGE_GUIDE_ADVANCED_FEATURES.md) | Advanced features usage |
| [IMPLEMENTATION_SUMMARY.md](docs/IMPLEMENTATION_SUMMARY.md) | Implementation details |
| [IMPROVEMENTS_SUMMARY.md](docs/IMPROVEMENTS_SUMMARY.md) | Improvements overview |
| [DEMONSTRATION_SUMMARY.md](docs/DEMONSTRATION_SUMMARY.md) | Demo guide |
| [ADVANCED_FEATURES_SUMMARY.md](docs/ADVANCED_FEATURES_SUMMARY.md) | Advanced features summary |