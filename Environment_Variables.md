# Environment Variables Reference

This document lists the required environment variables for both the backend and frontend of Rematch.

---

## Backend (`/backend/.env`)

The following variables are **mandatory** for running the backend:

| Variable Name       | Purpose                                               | Required? |
|---------------------|-------------------------------------------------------|-----------|
| MongoDB_URI         | MongoDB connection string for database access         | Yes       |
| pasdword            | Database password (if authentication enabled)         | Yes       |
| SECRET_KEY          | Used for authentication/session (JWT or similar)      | Yes       |
| OPENAI_API_KEY      | Access key for OpenAI API (AI features)               | Yes       |
| OPENAI_MODEL        | Specifies which OpenAI model to use                   | Yes       |
| OPENAI_MAX_TOKENS   | Max tokens for OpenAI responses                       | Yes       |

> **Note:**  
> All listed variables are required for full backend functionality. If a feature (e.g. authentication or OpenAI integration) is not used, related variables may be optional.  
> See your backend code for defaults or optional handling.

---

## Frontend (`/frontend/.env`)

The following variable is **mandatory** for running the frontend:

| Variable Name   | Purpose                              | Required? |
|-----------------|--------------------------------------|-----------|
| VITE_BASE_URL   | Backend API endpoint for HTTP calls  | Yes       |

---

## Tips

- Never expose sensitive values (like passwords or API keys) in public repositories or client-side code.
- Always keep a `.env.example` updated for contributors.

---

## Example Files

**Backend:**
```env
MongoDB_URI = mongodb://127.0.0.1:27017
pasdword = <your-db-password>
SECRET_KEY = <your-secret-key>
OPENAI_API_KEY = <your-openai-key>
OPENAI_MODEL = gpt-4o-mini
OPENAI_MAX_TOKENS = 4000
```

**Frontend:**
```env
VITE_BASE_URL = http://localhost:5000
```

---

If you add new features or integrations, update this reference and your `.env.example` files accordingly.
