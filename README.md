# AI-Test-Plan-Manager

# AI Test Plan Manager

A minimal Test Plan Management tool with generative AI. This application allows engineers and developers to manage test plans and automatically generate test steps with Gemini based on provided application requirements.

---

## Features

* **Test Plan Management:** Create, view, update, and delete (CRUD) testing plans.
* **Test Steps:** Add, edit, and delete individual steps within a test plan.
* **AI-Powered Step Generation:** Paste your requirement documentation, and the integrated AI  will automatically suggest a list of test steps.

---

## Tech Stack

### Backend
* **Language:** Python 3.X
* **Framework:** FastAPI
* **Database:** SQLite (with SQLAlchemy ORM)
* **AI Integration:** Google Generative AI

### Frontend
* **Core:** HTML5, JavaScript
* **Styling:** PicoCSS

---

## Project Structure

/project-root

│── main.py
│── models.py
│── crud.py
│── db.py
│── static/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── .env
└── requirements.txt


---

## Approach

This project is a minimal Test Plan Management tool with AI-assisted test-step generation. It is implemented as a FastAPI backend with a SQLite database (SQLAlchemy ORM) and a lightweight frontend (HTML/JavaScript/CSS).

Key points of the approach:
- **RESTful Endpoints**: The backend (FastAPI) exposes RESTful endpoints to manage test plans and steps, and an AI endpoint to generate suggestions. The frontend HTML and JS files call these endpoints.
- **Database**: Uses SQLite through SQLAlchemy. The database file `test_plans.db` is created automatically in the project root when the app runs.
- **AI integration**: The AI endpoint sends a prompt to Google's Gemini model and returns a simple list of suggestions. If no `GOOGLE_API_KEY` is configured, AI features are disabled and the server warns on startup.

The main source files:
- `main.py` — FastAPI application and route definitions.
- `models.py` — SQLAlchemy models and Pydantic schemas.
- `crud.py` — Database CRUD functions.
- `db.py` — SQLAlchemy engine and session.
- `static/` — Frontend: `index.html`, `app.js`, `style.css`.

Notes:
- Running the server will create `test_plans.db` automatically on the first run.
- AI generation requires a valid `GOOGLE_API_KEY` (Gemini). Without a valid API key, a warning will show and AI features will not work.

---

## How to run and interact with the application

Follow the steps below to set up and run the application on Windows. These instructions assume you have Python 3.8+ installed and available as `python` on your PATH.

1) Create and activate a virtual environment

```
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2) Install dependencies

```
pip install --upgrade pip
pip install -r requirements.txt
```

3) Configure the Gemini API key

Create a file named `.env` in the project root with the following content:

```
GOOGLE_API_KEY=your_gemini_api_key_here
```

4) Run the app with Uvicorn

```
uvicorn main:app --reload
```

This starts the server at `http://127.0.0.1:8000/`. Open the URL in a browser to interact with the application.

5) Interacting with the app

- UI: Open `http://127.0.0.1:8000/` to create, select, edit, and delete test plans and test steps. Use the AI Step Generator sidebar to paste requirement text and click `Generate` for test step suggestions.
- API endpoints (JSON):
	- `GET /api/plans`
	- `POST /api/plans`
	- `GET /api/plans/{plan_id}`
	- `PUT /api/plans/{plan_id}`
	- `DELETE /api/plans/{plan_id}`
	- `POST /api/plans/{plan_id}/steps`
	- `PUT /api/steps/{step_id}`
	- `DELETE /api/steps/{step_id}`
	- `POST /api/generate-steps`


# AI Usage

- **Boilerplate:** Use AI to quickly generate project boilerplate and templates.
- **Line completion (GitHub Copilot):** Use Copilot to speed up common code patterns (loops, data parsing, simple CRUD handlers). Accepted suggestions selectively and ran tests to validate behavior.