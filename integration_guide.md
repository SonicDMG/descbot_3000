
# Integration Guide: React Frontend with Python Backend

This guide explains how to integrate the React frontend with your existing Python application.

## Step 1: Build the React App

First, you'll need to build the React app to generate static files:

```bash
cd /path/to/react/project
npm run build
```

This will create a `dist` folder with optimized static files.

## Step 2: Configure Your Python App

Modify your existing `app.py` to serve the React static files and handle API requests.

### Key Components to Implement:

1. **Set up the static folder** to point to the React build output
2. **Create API endpoints** needed by the React app
   - `/api/chat` for message handling
   - `/api/clear-session` for clearing chat history
3. **Create a catch-all route** to serve the React app for any other routes

## Step 3: File Structure

Your project structure should look like this:

```
your-project/
├── app.py                 # Your Python application
├── dist/                  # Built React files
│   ├── index.html
│   ├── assets/
│   │   ├── index-[hash].js
│   │   ├── index-[hash].css
│   │   └── ...
│   └── ...
└── other_python_files/    # Your existing Python files
```

## Step 4: Running the Application

You should be able to run your Python application as before:

```bash
python app.py
```

This will start the server, serving both the React frontend and handling the API requests.

## Integration Notes

### API Communication

The React frontend expects these API endpoints:

1. `POST /api/chat`
   - Request body: `{ "message": "user message text" }`
   - Response: `{ "response": "assistant response text", "markdown": "optional markdown content" }`

2. `POST /api/clear-session`
   - No request body needed
   - Response: `{ "status": "success" }`

### Environment Variables

If you need to specify a different API URL, you can set it through an environment variable:

```
REACT_APP_API_URL=http://your-api-url
```

Otherwise, the frontend will default to using `http://localhost:5000/api`.
