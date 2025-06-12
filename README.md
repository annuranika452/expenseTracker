# 📊 Smart Expense Tracker (with Receipt OCR)

A full-stack web application that helps users track and visualize personal expenses. It features receipt image upload with OCR to extract expense details automatically. Built with Node.js, PostgreSQL, Python, Docker, and deployed on Render.

---

## 🚀 Features

- 🧾 Upload receipt image to auto-extract expense data using OCR
- ✍️ Add expenses manually via form
- 📈 Interactive Pie Chart by category (Chart.js)
- 📋 Live-updating expense table
- 🗑️ Delete individual expenses
- ☁️ Backend deployed using Render

---

## 🛠️ Tech Stack

| Layer            | Tech                                                                 |
|------------------|----------------------------------------------------------------------|
| Frontend         | HTML, CSS, JavaScript (Vanilla), Chart.js                           |
| Backend          | Node.js, Express.js, pg (PostgreSQL driver)                         |
| OCR Microservice | Python, Flask, Tesseract OCR, Pillow                                |
| Database         | PostgreSQL (Dockerized)                                              |
| Deployment       | Docker, Docker Compose, Render                                       |
| Dev Tools        | VS Code, GitHub, Browser DevTools, cURL                             |

---

## 🧠 Architecture

```bash
expenseTracker/
├── backend/              # Node.js Express API
│   ├── routes/expenses.js
│   ├── routes/ocr.js
│   ├── db.js
│   ├── app.js
│   ├── uploads/
│   └── Dockerfile
├── ocr-service/          # Python Flask OCR microservice
│   ├── app.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/             # HTML/JS dashboard
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── docker-compose.yml
└── .env
```

---

## 🧪 How to Run Locally

Follow these steps to run the Smart Expense Tracker locally using Docker and VS Code:

---

### ⚙️ 1. Clone the Repository

```bash
git clone https://github.com/yourusername/expenseTracker.git
cd expenseTracker
```

### 2. Create Environment Variables

Create a .env file inside the backend/ directory with the following content:

---
```bash
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=db
DB_PORT=5432
DB_NAME=expenses

```

### 🐳 3. Start All Services with Docker


Use Docker Compose to build and run:
---
```bash
docker compose up --build
```
This will:

Spin up PostgreSQL, backend (Express), and ocr-service (Flask)

Map ports:

Backend API → http://localhost:5050

OCR Service → http://localhost:5001

### 🌐 4. Launch the Frontend
Use the Live Server extension in VS Code or open the file manually:
---

```bash
frontend/index.html
```
Recommended URL if using Live Server:
---

```bash
http://127.0.0.1:5500/frontend/index.html
```
Make sure your script.js points to:
---

```bash
const API_URL = "http://localhost:5050/api/expenses";
```
### 🧪 5. Test Everything

✅ Submit an expense via the form

📸 Upload a receipt image (JPEG/PNG)

📊 Check if the table and pie chart update

🗑️ Click the 🗑️ button to delete

### 🧹 6. Stop Everything

```bash
docker compose down 
```
## 🌐 Deployment
Backend API deployed on Render

Replace API_URL in script.js with your live Render backend:

```bash
const API_URL = "https://your-render-url.onrender.com/api/expenses";
```



## 🐞 Common Issues Solved

| Problem                         | Solution                                                |
|---------------------------------|---------------------------------------------------------|
| `relation "expenses" does not exist` | Manually created table inside PostgreSQL container      |
| CORS errors in browser         | Added `cors()` middleware in Express                    |
| OCR service not starting       | Installed missing dependencies in `ocr-service`         |
| Docker port conflicts          | Changed ports in `docker-compose.yml`                   |
| 404 on DELETE requests         | Fixed Express route registration and rebuilt Docker 



## 🎯 What's Next
🔐 Add user authentication (JWT/Auth0)

🧠 Improve OCR parsing logic with regex or ML

☁️ Upload receipts to cloud storage (S3/GCS)

📤 Export expenses as CSV

🧪 Add automated tests (Jest, Supertest)

📱 Convert to a responsive mobile PWA

