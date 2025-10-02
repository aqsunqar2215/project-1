# 🧠 AI-Powered Smart City Dashboard - Features Guide

## 🎯 Overview
Your Smart City Dashboard now includes **real AI integration** using TensorFlow.js, with in-browser model training, predictions, and persistent storage.

---

## ✨ New Features

### 1. **3D City Visualization** (Dashboard)
- **Interactive 3D city** built with Three.js
- Animated cars, traffic lights, and energy stations
- Rotate, zoom, and pan with mouse controls
- Real-time visual feedback of city operations

### 2. **AI Model Training Panel** (Dashboard)
- Train two AI models in-browser:
  - **Traffic Prediction Model**: Predicts congestion based on hour, day, and weather
  - **Energy Prediction Model**: Forecasts demand based on hour, temperature, and day type
- **Live training progress** with loss metrics
- Models train on 20 samples over 50 epochs (~10-15 seconds)
- **Persistent training**: Once trained, models remain ready for predictions

### 3. **AI Predictions** (Dashboard)
- Run real-time predictions after training models
- **Traffic**: Predicts congestion percentage (0-100%)
- **Energy**: Predicts demand in kWh
- Results are based on current time and simulated conditions
- All predictions are **saved to IndexedDB**

### 4. **AI Recommendations Engine** (Dashboard)
- Automatically generates context-aware recommendations
- **Traffic recommendations**: Rerouting, alerts, public transport deployment
- **Energy recommendations**: Grid optimization, renewable integration, load balancing
- Recommendations adapt based on predicted values

### 5. **Prediction History** (Analytics)
- View all past predictions in a database-backed dashboard
- **Charts comparing** predicted vs actual values
- Separate views for traffic and energy predictions
- Shows last 10 predictions per type
- **Refresh** and **Clear History** controls

### 6. **Local Database** (IndexedDB)
- All simulation results stored locally in browser
- No backend required
- Persists between sessions
- Stores: timestamp, type, prediction, actual value, scenario details

---

## 🚀 How to Use

### Step 1: Train AI Models
1. Go to **Dashboard**
2. Find the **AI Model Training** panel
3. Click **"Train Traffic AI"** and wait ~10-15 seconds
4. Click **"Train Energy AI"** and wait ~10-15 seconds
5. ✅ Green checkmarks appear when training completes

### Step 2: Run Predictions
1. After training, go to **AI Predictions** section
2. Click **"Predict Traffic"** or **"Predict Energy"**
3. AI analyzes current conditions and generates prediction
4. Results display with AI recommendations
5. All predictions auto-save to database

### Step 3: View History
1. Navigate to **Analytics** page
2. See **AI Prediction History** at the top
3. Charts show predicted vs actual values
4. Use **Refresh** to update or **Clear History** to reset

---

## 📊 Data Sources

### Training Data
- **Traffic**: `src/data/traffic.json`
  - Features: hour, day of week, weather
  - Target: congestion percentage
  - 20 training samples

- **Energy**: `src/data/energy.json`
  - Features: hour, temperature, weekday flag
  - Target: demand in kWh
  - 20 training samples

### Model Architecture (Both Models)
```
Input Layer (3 features)
  ↓
Dense Layer (16 units, ReLU)
  ↓
Dropout (20%)
  ↓
Dense Layer (8 units, ReLU)
  ↓
Dense Layer (1 unit, Sigmoid)
```

---

## 🔧 Technical Details

### Libraries Used
- **TensorFlow.js**: In-browser ML model training and inference
- **Three.js**: 3D city visualization
- **React Three Fiber**: React integration for Three.js
- **IndexedDB**: Browser-based persistent storage

### Model Performance
- **Training Time**: 10-15 seconds per model
- **Inference Time**: <100ms per prediction
- **Storage**: ~50KB per 100 predictions
- **Accuracy**: Training loss typically ~0.02-0.05

### Database Schema
```typescript
interface SimulationRecord {
  id: number;
  timestamp: number;
  type: "traffic" | "energy";
  prediction: number;
  actual?: number;
  scenario?: string;
  metrics?: Record<string, any>;
}
```

---

## 💡 Tips

1. **Train before predicting**: Models must be trained before running predictions
2. **Check training loss**: Lower loss (< 0.05) = better predictions
3. **Run multiple predictions**: More data = better history visualization
4. **Clear history**: Use when testing or resetting demo
5. **3D city controls**: Click + drag to rotate, scroll to zoom

---

## 🎓 Educational Use Cases

### For Students
- Learn how ML models train in real-time
- Understand the relationship between features and predictions
- Visualize model accuracy with before/after charts

### For Researchers
- Test different scenarios and compare outcomes
- Analyze prediction accuracy over time
- Export data for further analysis (via browser DevTools)

### For City Planners
- Demonstrate AI-powered optimization potential
- Show data-driven decision making
- Illustrate smart city concept feasibility

---

## 🛠️ Customization

### Add More Training Data
Edit `src/data/traffic.json` or `src/data/energy.json`:
```json
{
  "trainingData": [
    { "hour": 8, "dayOfWeek": 1, "weather": 1, "congestion": 85 }
    // Add more samples...
  ]
}
```

### Modify Model Architecture
Edit `src/lib/aiModel.ts`:
```typescript
// Change layers, units, or activation functions
tf.layers.dense({ units: 32, activation: "relu" })
```

### Adjust Training Parameters
```typescript
await model.fit(xs, ys, {
  epochs: 100,        // More epochs = better training
  batchSize: 8,       // Larger batch = faster training
  validationSplit: 0.2
});
```

---

## 🐛 Troubleshooting

**Issue**: "Model not trained yet" error
- **Solution**: Click "Train [Type] AI" button first

**Issue**: Training takes too long
- **Solution**: Reduce epochs in `aiModel.ts` or use smaller dataset

**Issue**: No predictions showing in Analytics
- **Solution**: Run predictions from Dashboard first

**Issue**: 3D city not loading
- **Solution**: Check browser console for WebGL errors

---

## 📚 Learn More

- [TensorFlow.js Docs](https://www.tensorflow.org/js)
- [Three.js Examples](https://threejs.org/examples/)
- [IndexedDB Guide](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

---

**Built with ❤️ for your diploma project**
