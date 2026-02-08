# AI-Driven Task Manager - Setup & Testing Guide

## Project Architecture

**3-Tier Full-Stack Application:**
- **Frontend**: Vite + React (TypeScript) - `localhost:5173`
- **Backend**: FastAPI (Python) - `localhost:8000`
- **Database**: SQLite - `database/aitasks.db`

## Prerequisites

- **Node.js**: 20.19+ or 22.12+
- **Python**: 3.10+
- **Groq API Key**: Get from https://console.groq.com (free tier available)

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

pip install -r requirements.txt
```

### 2. Backend Configuration

Create/update `.env`:
```
DATABASE_URL=sqlite:///./database/aitasks.db
GROQ_API_KEY=your_actual_groq_api_key_here
```

**Important**: Do NOT use quotes around the API key.

### 3. Start Backend

```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload
```

Expected output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

### 4. Frontend Setup (New Terminal)

```bash
cd frontend
npm install
npm run dev
```

Expected output:
```
➜  Local:   http://localhost:5173/
```

## Features & User Flow

### 🧠 Brain Dump Page (`/add`)
1. Enter messy thoughts or task notes
2. Click **"AI Parse"** button
3. Groq AI extracts structured tasks with:
   - Title
   - Category (Work/Personal/Urgent)
   - Priority (High/Medium/Low)
   - Estimated time
   - Due date
4. Tasks appear as a list
5. Click **"Save"** to persist each task

**Example Input:**
```
Finish DevOps resume today
Push all GitHub projects tomorrow
Schedule mock interview this weekend
Pay electricity bill
Buy groceries
```

**AI Output**: 5 structured tasks with priority, category, time estimate, and dates.

### 📊 Dashboard Page (`/`)
- View all tasks in a list
- See task details: title, category, priority, time estimate, due date
- Delete tasks (if implemented)
- Click "Focus Mode" to prioritize

### 🎯 Focus Mode Page (`/focus`)
- All tasks sorted by **priority** (High → Medium → Low)
- Color-coded left border:
  - 🔴 Red: High priority
  - 🟠 Orange: Medium priority
  - 🟢 Green: Low priority
- Click **"✓ Complete"** to mark task as done
- Completed tasks are removed from the list
- Shows: priority, category, est. time, due date

## API Endpoints

### AI Parsing
- **POST** `/api/ai/parse-task`
  - Request: `{ "text": "brain dump text..." }`
  - Response: `[ { "title": "...", "priority": "High", ... } ]`

### Task Management
- **POST** `/api/tasks` - Create a task
- **GET** `/api/tasks` - Get all tasks
- **PUT** `/api/tasks/{task_id}` - Update task (mark as completed)

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Frontend loads at `http://localhost:5173`
- [ ] Can navigate between Dashboard, Smart Add, Focus Mode
- [ ] Brain Dump page accepts text input
- [ ] AI Parse button works and returns structured tasks
- [ ] Can click "Save" to persist tasks to database
- [ ] Dashboard displays saved tasks
- [ ] Focus Mode shows tasks sorted by priority
- [ ] Can mark tasks as complete in Focus Mode
- [ ] Completed tasks disappear from Focus Mode
- [ ] Task data persists after page refresh

## Troubleshooting

### Backend Errors

**"GROQ_API_KEY is not set"**
- Add `GROQ_API_KEY=...` to `.env` without quotes
- Restart backend: `Ctrl+C`, then `uvicorn app.main:app --reload`

**"Model `X` has been decommissioned"**
- Check `.env` has the correct Groq API key
- AI parser uses `llama-3.3-70b-versatile` (update in `app/services/ai_parser.py` if needed)

**"Failed to load resource" 500 error on frontend**
- Check backend is running on `http://127.0.0.1:8000`
- Check browser console for error details
- Check backend terminal for Python exceptions

### Frontend Issues

**"Failed to resolve import" (react-router-dom, axios)**
- Run `npm install` in frontend folder
- Restart dev server: `npm run dev`

**TypeScript errors**
- Ensure `tsconfig.json` has correct settings
- Run TypeScript check: `npx tsc --noEmit`

**Node version warning**
- Update Node.js to 20.19+ or 22.12+

## Database

- **Location**: `backend/database/aitasks.db`
- **Auto-created** on first backend startup
- **Schema**: Tasks table with id, title, category, priority, estimated_minutes, due_date, status, created_at

To inspect:
```bash
sqlite3 backend/database/aitasks.db
sqlite> SELECT * FROM tasks;
```

## Performance Tips

- AI parsing latency: 1-3 seconds (Groq API response time)
- Dashboard loads instantly (all tasks in memory)
- Focus Mode sorts on client side (no backend call)

## Portfolio Highlight

This is a **production-grade SaaS-style application** demonstrating:
- ✅ Full-stack development (frontend, backend, database)
- ✅ Real AI integration (Groq LLM API)
- ✅ RESTful API design
- ✅ TypeScript for type safety
- ✅ CORS & security
- ✅ Error handling & logging
- ✅ Database persistence
- ✅ UX best practices

Perfect for a **software engineering portfolio**!

