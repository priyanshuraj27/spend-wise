# SpendWise 💰# SpendWise – Smart Financial Analyzer 💰



A smart personal finance tracker with AI-powered expense classification and automatic PDF bank statement parsing.An intelligent MERN-based personal finance tracker that helps users understand where their money goes. SpendWise supports **manual entry**, **automatic PDF extraction**, and **AI-powered classification** to categorize expenses and provide personalized financial insights.



## Features---



- 📊 Manual transaction entry## 🌟 Key Features

- 📄 Automatic PDF bank statement parsing

- 🤖 AI-powered expense classification### 1. **Manual & Automatic Entry**

- 💾 Transaction preferences (remembers your choices)- ✅ Add transactions manually with amount, date, and purpose

- 📈 Analytics dashboard with charts- ✅ Upload **bank statement PDFs** (SBI, HDFC, ICICI, Axis, PNB, Google Pay, PayTM, PhonePe)

- 🔐 User authentication (JWT)- ✅ Automatic extraction using PDF parsing

- 📱 Responsive design- ✅ AI auto-classification of expenses



## Tech Stack### 2. **AI-Powered Classification**

- 🤖 Categorizes expenses into **Food, Travel, Bills, Shopping, Entertainment, Healthcare, Education, Investment, Salary, Other**

**Frontend:** React 19 + Vite + Tailwind CSS + Recharts  - 🤖 Assigns spending intent: **Need, Want, Investment, Income**

**Backend:** Node.js + Express.js + MongoDB  - 🤖 Generates explanatory notes for each transaction

**AI:** Google Generative AI (Gemini 2.0 Flash)- 💡 Example: *"₹350 spent at Zomato – classified as Food (Want)"*



## Setup### 3. **Dashboard & Analytics**

- 📊 Visualize monthly income vs expenses with line charts

### Backend- 📊 Pie chart showing spending by category

```bash- 📊 Bar chart showing distribution by type (Needs vs Wants)

cd backend- 📊 Monthly trends and spending patterns

npm install- 📊 AI-generated financial summary and insights

npm run dev

```### 4. **Advanced Features**

- 🔐 User authentication with JWT

### Frontend- 📱 Responsive design (mobile, tablet, desktop)

```bash- 🎨 Beautiful Tailwind CSS UI with gradient backgrounds

cd frontend- 🚀 Fast React frontend with Vite

npm install- ⚡ RESTful API backend with Express.js

npm run dev- 🗄️ MongoDB for persistent storage

```- 📊 Recharts for interactive visualizations



## Environment Variables---



Create `.env` in the backend directory:## 💡 Tech Stack

```

MONGO_URI=your_mongodb_connection_string### Frontend

JWT_SECRET=your_jwt_secret- **Framework:** React 19 + Vite

GOOGLE_API_KEY=your_google_generative_ai_key- **Styling:** Tailwind CSS 4

PORT=8000- **Charts:** Recharts

CORS_ORIGIN=http://localhost:5173- **HTTP Client:** Axios

```- **State Management:** React Context API



## API Endpoints### Backend

- **Runtime:** Node.js

- `POST /api/v1/users/register` - Register user- **Framework:** Express.js

- `POST /api/v1/users/login` - Login user- **Database:** MongoDB

- `POST /api/v1/transactions/add` - Add transaction- **Authentication:** JWT + Bcrypt

- `GET /api/v1/transactions` - Get transactions- **AI/ML:** Google Generative AI (Gemini API)

- `PUT /api/v1/transactions/:id` - Update transaction- **PDF Parsing:** pdf-parse

- `DELETE /api/v1/transactions/:id` - Delete transaction- **File Upload:** express-fileupload

- `POST /api/v1/transactions/upload-pdf` - Upload PDF

- `POST /api/v1/preferences/save` - Save preference---

- `GET /api/v1/preferences` - Get preferences

## 📁 Project Structure

## License

```

ISCSpendWise/

├── MERN backend/
│   ├── src/
│   │   ├── app.js                 # Express app setup
│   │   ├── index.js               # Server entry point
│   │   ├── constant.js            # Constants
│   │   ├── config/
│   │   │   └── environment.js      # Environment configuration
│   │   ├── controllers/
│   │   │   ├── transaction.controllers.js
│   │   │   ├── pdf.controllers.js
│   │   │   └── user.controllers.js
│   │   ├── models/
│   │   │   ├── transaction.models.js
│   │   │   └── user.models.js
│   │   ├── routes/
│   │   │   ├── transaction.routes.js
│   │   │   └── user.routes.js
│   │   ├── services/
│   │   │   ├── ai.service.js       # Gemini API integration
│   │   │   ├── pdf.service.js      # PDF parsing
│   │   │   └── transaction.service.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   └── multer.middleware.js
│   │   ├── utils/
│   │   │   ├── ApiResponse.js
│   │   │   ├── ApiError.js
│   │   │   └── asyncHandler.js
│   │   ├── validators/
│   │   └── db/
│   │       └── index.js
│   ├── public/
│   │   └── temp/
│   └── package.json
│
└── React Frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── App.css
    │   ├── index.css
    │   ├── components/
    │   │   ├── Dashboard/
    │   │   │   ├── Dashboard.jsx
    │   │   │   └── DashboardCards.jsx
    │   │   ├── Transactions/
    │   │   │   ├── TransactionList.jsx
    │   │   │   ├── TransactionForm.jsx
    │   │   │   ├── TransactionFilters.jsx
    │   │   │   └── PDFUpload.jsx
    │   │   └── Analytics/
    │   │       ├── ExpenseChart.jsx
    │   │       ├── CategoryBreakdown.jsx
    │   │       └── TypeBreakdown.jsx
    │   ├── context/
    │   │   └── TransactionContext.jsx
    │   ├── hooks/
    │   │   └── useTransaction.js
    │   ├── services/
    │   │   └── api.js
    │   ├── utils/
    │   │   └── formatters.js
    │   └── assets/
    ├── public/
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Google Generative AI API Key (Gemini)

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd "MERN backend"
   npm install
   ```

2. **Create `.env` file:**
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/spendwise
   JWT_SECRET=your_jwt_secret_key_here
   GEMINI_API_KEY=your_google_gemini_api_key
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Start the backend:**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:3000`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd "React Frontend"
   npm install
   ```

2. **Create `.env.local` file:**
   ```env
   VITE_API_URL=http://localhost:3000/api/v1
   ```

3. **Start the frontend:**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

---

## 📡 API Endpoints

### Transactions
- `POST /api/v1/transactions/add` - Add manual transaction
- `GET /api/v1/transactions` - Get all transactions (with filters)
- `GET /api/v1/transactions/analytics` - Get analytics and insights
- `PUT /api/v1/transactions/:id` - Update transaction
- `DELETE /api/v1/transactions/:id` - Delete transaction
- `POST /api/v1/transactions/upload-pdf` - Upload and parse PDF
- `GET /api/v1/transactions/batch/:batchId` - Get batch transactions

### Users
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - Login user
- `POST /api/v1/users/logout` - Logout user
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile

---

## 🤖 AI Classification Workflow

```
1. User uploads PDF statement
   ↓
2. Backend extracts text using pdf-parse
   ↓
3. Parse transaction patterns (date, amount, description)
   ↓
4. Send to Gemini API with structured prompt
   ↓
5. AI returns classification JSON
   {
     "category": "Food",
     "type": "Want",
     "merchant": "Zomato",
     "confidence": 95,
     "note": "Food delivery - discretionary spending"
   }
   ↓
6. Save to MongoDB with batch ID
   ↓
7. Frontend displays with AI insights
```

---

## 📊 Example Response Format

### Add Transaction
```json
{
  "success": true,
  "status_code": 201,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "description": "Zomato Order",
    "amount": 350,
    "date": "2025-10-12T00:00:00.000Z",
    "category": "Food",
    "type": "Want",
    "merchant": "Zomato",
    "aiNote": "Food delivery classified as discretionary Want. Consider limiting dining expenses.",
    "transactionType": "manual",
    "confidence": 95,
    "createdAt": "2025-10-24T12:00:00.000Z"
  },
  "message": "Transaction added successfully"
}
```

### Get Analytics
```json
{
  "success": true,
  "data": {
    "analytics": [
      {
        "_id": "Food",
        "total": 2500,
        "count": 8,
        "average": 312.5
      },
      {
        "_id": "Travel",
        "total": 1500,
        "count": 3,
        "average": 500
      }
    ],
    "typeBreakdown": [
      {
        "type": "Need",
        "total": 8200,
        "count": 15,
        "percentage": "52.13"
      },
      {
        "type": "Want",
        "total": 6300,
        "count": 20,
        "percentage": "40.00"
      },
      {
        "type": "Investment",
        "total": 1500,
        "count": 2,
        "percentage": "9.55"
      }
    ],
    "totalAmount": 15800
  }
}
```

---

## 🎨 Frontend Features

### Dashboard Page
- 📊 Summary cards with total spending, needs, wants, investments
- 📈 Monthly trend line chart
- 📊 Spending type breakdown bar chart
- 🥧 Category breakdown pie chart
- 💡 AI-powered financial insights

### Transactions Page
- 📋 Filterable transaction table
- 🔍 Filter by category, type, date range
- ✏️ Add new transactions manually
- 🗑️ Delete transactions
- 💡 AI notes displayed in table
- 📅 Date-based sorting

### Upload Page
- 📄 Drag-and-drop PDF upload
- 💾 Automatic extraction and classification
- 📊 Batch transaction display
- ✓ Success confirmation
- 🏦 Supported banks list

---

## 🔒 Security Features

- ✅ JWT authentication
- ✅ Password hashing with bcryptjs
- ✅ CORS protection
- ✅ Input validation
- ✅ Secure API endpoints
- ✅ User-specific data isolation

---

## 📈 Future Enhancements

- 🏦 Bank-specific extraction templates (ICICI, SBI, HDFC, etc.)
- 📧 Automatic import via email (bank statement fetch)
- 💡 Personalized savings suggestions using ML
- 📱 WhatsApp/Telegram integration for weekly summaries
- 📊 Spending goals and budget tracking
- 📲 Mobile app (React Native)
- 🌐 Multi-currency support
- 📎 Receipt image OCR
- 🔔 Smart notifications

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the maintainers.

---

## 🙏 Acknowledgments

- Google Generative AI (Gemini) for AI classification
- React and Vite for fast frontend development
- MongoDB for robust data storage
- Recharts for beautiful data visualization
- Tailwind CSS for modern styling

---

**Happy tracking! 🎉 Use SpendWise to take control of your finances today.**

Built with ❤️ for better money management
