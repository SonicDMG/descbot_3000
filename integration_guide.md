
# Integration Guide: React Frontend with Your Flask Application

This guide explains how to integrate the React frontend with your existing Flask application.

## Project Structure

Your project structure should look like this after integration:

```
CURSOR_CHATBOT/
├── app.py                   # Your modified Flask application
├── langflow_client.py       # Your existing client for chatbot responses
├── dist/                    # Built React files (created after building)
│   ├── index.html
│   ├── assets/
│   │   ├── index-[hash].js
│   │   ├── index-[hash].css
│   │   └── ...
├── static/                  # Your existing static files (keep for backward compatibility)
│   └── css/
│       └── style.css
├── templates/               # Your existing templates (keep for backward compatibility)
│   └── index.html
├── .logfire/                # Logfire configuration
├── .env                     # Environment variables
└── requirements.txt         # Updated project dependencies
```

## Step 1: Build the React App

First, you'll need to build the React app to generate static files:

```bash
# In your React project directory
npm run build
```

Then, copy the entire `dist` folder to the root of your Flask project.

## Step 2: Updated API Endpoints

The Flask app now exposes these endpoints:

1. `POST /api/chat`
   - Request body: `{ "message": "user message text" }`
   - Response: `{ "response": "assistant response text", "markdown": "markdown content" }`

2. `POST /api/clear-session`
   - No request body needed
   - Response: `{ "status": "success" }`

3. `POST /chat` (Legacy endpoint)
   - This is maintained for backward compatibility with existing code

## Step 3: Running the Application

You can run your Flask application as before:

```bash
python app.py
```

This will serve both the React frontend and handle the API requests, with logging handled by Logfire as in your original implementation.

## Notes

- The application now serves the React frontend from the `dist` directory
- All API endpoints that were previously at the root are now under the `/api` prefix
- Legacy endpoints are maintained for backward compatibility
- The React app communicates with the backend through the API endpoints
