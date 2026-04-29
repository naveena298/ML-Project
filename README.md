# GovForecast - ML Demand Prediction System

A full-stack web application that predicts demand for government schemes using machine learning and social media trends.

## 🎯 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      GOVFORECAST                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   FRONTEND      │◄──►│   BACKEND    │◄──►│    MODEL     │  │
│  │  (HTML/CSS/JS)  │    │  (Flask API) │    │ (LinearReg)  │  │
│  └─────────────────┘    └──────────────┘    └──────────────┘  │
│         ▲                                             △          │
│         │                                             │          │
│    User Interface                              ML Predictions   │
│    - Login                                      - Feature        │
│    - Scheme Selection                             Engineering   │
│    - Real-time Results                          - Forecasting   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 📦 Complete Project Structure

```
newml/
├── app.py                           # Flask backend & ML integration
├── requirements.txt                 # Python dependencies
├── final_linear_regression_model.pkl # Trained ML model
├── scaler.pkl                       # Feature scaler
├── Book 1.xlsx                      # Sample dataset
├── static/
│   ├── style.css                   # Enhanced UI styling
│   └── script.js                   # Frontend logic & API calls
└── templates/
    └── index.html                  # Modern responsive UI
```

## 🚀 How to Run

### 1. Install Dependencies
```bash
cd c:\Users\naveena\Documents\MLT\newml
.venv\Scripts\python.exe -m pip install -r requirements.txt
```

### 2. Start the Server
```bash
.venv\Scripts\python.exe app.py
```

### 3. Access the Application
Open your browser and navigate to: `http://127.0.0.1:5000`

### 4. Login
- **Username:** admin
- **Password:** 1234

## 🔗 API Integration

### Backend (Flask) - app.py
The backend connects three main components:

#### 1. **Data Loading & Feature Engineering**
- Loads Excel dataset (`Book 1.xlsx`)
- Extracts features: Likes, Retweets, Sentiment, Time features
- Calculates engagement metrics and rolling averages
- Performs sentiment analysis using TextBlob

```python
df['engagement'] = df['Likes'] + df['Retweets']
df['Sentiment'] = df['Tweet'].apply(get_sentiment)
df['lag_1'] = df['Demand'].shift(1)
df['rolling_avg'] = df['Demand'].rolling(window=2).mean()
```

#### 2. **Model Loading**
- Loads trained Linear Regression model
- Loads MinMaxScaler for feature normalization
- Handles model predictions with confidence scores

```python
model = joblib.load("final_linear_regression_model.pkl")
scaler = joblib.load("scaler.pkl")
```

#### 3. **API Endpoints**

##### POST /api/login
```json
Request:
{
  "username": "admin",
  "password": "1234"
}

Response:
{
  "success": true,
  "message": "Login successful"
}
```

##### POST /api/forecast
```json
Request:
{
  "scheme": "PM Kisan"
}

Response:
{
  "success": true,
  "scheme": "PM Kisan",
  "previous_demand": 45.23,
  "predicted_demand": 78.5,
  "recommendation": "🟢 High demand expected - Excellent opportunity",
  "status": "high",
  "confidence": "92%"
}
```

##### GET /api/schemes
```json
Response:
{
  "success": true,
  "schemes": [
    "PM Kisan",
    "MGNREGA",
    "Ayushman Bharat",
    ...
  ]
}
```

## 🎨 Frontend Integration

### HTML (index.html)
- Modern gradient design with glassmorphism
- Responsive layout (mobile, tablet, desktop)
- Login form with validation
- 10 scheme cards with emoji icons
- Real-time results display
- Loading spinner animation

### CSS (style.css)
Features:
- Gradient backgrounds and animations
- Glassmorphic UI elements
- Hover effects with smooth transitions
- Responsive grid layout
- Animated demand level bars
- Status-based color coding

### JavaScript (script.js)
Functions:
- `login()` - Authenticates user via API
- `selectScheme(name, element)` - Selects scheme card
- `forecast()` - Calls ML prediction API
- `displayResults(data)` - Shows predictions with visuals
- `logout()` - Clears session and returns to login
- `getBarColor(demand)` - Colors bar based on demand level

## 🤖 Model Integration

### Feature Engineering
```python
Features used for prediction:
- Likes (from tweets)
- Retweets (from tweets)
- Sentiment (polarity score 0-1)
- Month (time feature)
- Year (time feature)
- Engagement (Likes + Retweets)
- Lag_1 (previous period demand)
- Lag_2 (two periods back demand)
- Rolling_avg (2-period moving average)
```

### Prediction Logic
```python
1. Extract features based on selected scheme
2. Normalize features using MinMaxScaler
3. Run Linear Regression model
4. Clamp prediction between 0-100
5. Generate recommendation based on demand level:
   - > 80: 🟢 High demand
   - 60-80: 🟡 Moderate-High
   - 40-60: 🟠 Moderate
   - < 40: 🔴 Low demand
```

## 📊 Supported Schemes

| Scheme | Icon | Category |
|--------|------|----------|
| PM Kisan | 👨‍🌾 | Farmer Support |
| MGNREGA | 🏗️ | Employment |
| Ayushman Bharat | 🏥 | Health Coverage |
| Agriculture Infrastructure Fund | 🌾 | Infrastructure |
| CM Health Insurance Scheme | ⚕️ | Insurance |
| Deen Dayal Yojana | 📚 | Skills |
| Pre-Matric Scholarship | 🎓 | Education |
| Indira Mahila Scheme | 👩 | Women |
| Shramik Sahayata | 💼 | Labor |
| Garuda Scheme | 🚀 | Workers |

## 🎯 Key Features

### Backend
✅ CORS enabled for cross-origin requests
✅ Error handling with proper HTTP status codes
✅ Input validation and sanitization
✅ Model prediction caching
✅ Feature scaling and normalization
✅ Sentiment analysis integration

### Frontend
✅ Modern glassmorphic UI design
✅ Real-time API integration
✅ Loading states and animations
✅ Error messages and validation
✅ Responsive design (mobile-first)
✅ Smooth transitions and hover effects
✅ Interactive scheme selection
✅ Visual demand level indicators

### Model
✅ Trained Linear Regression model
✅ MinMaxScaler for feature normalization
✅ Feature engineering pipeline
✅ Time-series analysis (lag features)
✅ Sentiment analysis using TextBlob

## 📋 Requirements

```python
Flask==3.1.3
Flask-CORS==6.0.2
pandas>=2.0.0
numpy>=1.24.0
joblib>=1.3.0
scikit-learn>=1.2.0
textblob>=0.17.0
openpyxl>=3.10.0
```

## 🐛 Troubleshooting

### Issue: Model not loading
**Solution:** Ensure `final_linear_regression_model.pkl` and `scaler.pkl` exist in the project root

### Issue: CORS errors
**Solution:** Flask-CORS is enabled. Make sure requests use correct API endpoint: `http://127.0.0.1:5000`

### Issue: Excel file not found
**Solution:** Ensure `Book 1.xlsx` exists with columns: Date, Tweet, Likes, Retweets

### Issue: Port 5000 already in use
**Solution:** Change Flask port in app.py: `app.run(debug=True, port=5001)`

## 🔄 Data Flow

```
User Login
    ↓
Select Scheme
    ↓
Click "Predict Demand"
    ↓
Frontend sends POST to /api/forecast
    ↓
Backend extracts features from Excel data
    ↓
Features normalized by MinMaxScaler
    ↓
Linear Regression model makes prediction
    ↓
Recommendation generated based on prediction
    ↓
Results sent back to frontend as JSON
    ↓
Frontend displays results with visualization
```

## 📈 Future Enhancements

- [ ] Database integration (SQLite/PostgreSQL)
- [ ] Historical predictions tracking
- [ ] Advanced analytics dashboard
- [ ] Multi-model ensemble predictions
- [ ] Real-time Twitter API integration
- [ ] Export reports as PDF
- [ ] Admin panel for model retraining
- [ ] User authentication with JWT tokens
- [ ] Production-grade WSGI server deployment

## 📝 License

This project is open-source and available for educational purposes.

---

**Status:** ✅ Fully Integrated & Working
**Last Updated:** April 11, 2026
**Python Version:** 3.13.5
