
# DescBot 3000

Welcome to DescBot 3000 - Lazily generating video descriptions so you don't have to!

## Project info

**URL**: https://lovable.dev/projects/597f30b2-4c68-4147-8c78-f136f86370f0

## About this Application

DescBot 3000 is a Python-based application with an embedded React frontend. It uses Flask to serve both the API endpoints and the pre-built React interface. The application generates video descriptions for YouTube videos using AI, saving you time and effort.

## Getting Started

### Prerequisites

- Python 3.9+ installed
- Node.js & npm installed (for frontend development only)
- Git

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd descbot_3000

# Step 3: Set up a Python virtual environment
python -m venv venv

# Step 4: Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Step 5: Install Python dependencies
pip install -r requirements.txt

# Step 6: Set up environment variables (if needed)
# Copy .env.example to .env and fill in required values
```

### Running the Application

To start the application, run:

```sh
# With the virtual environment activated
python app.py
```

The application will be available at http://localhost:5000

## Frontend Development (Optional)

If you need to modify the React frontend:

```sh
# Install frontend dependencies
npm install

# Start the development server
npm run dev

# Build the frontend (required before deploying changes)
npm run build
```

After building the React app, the Flask server will serve the updated frontend automatically.

## Project Structure

- `app.py` - Main Flask application serving both API endpoints and frontend
- `langflow_client.py` - Client for AI chatbot responses
- `src/` - React frontend source code
- `dist/` - Built React frontend (served by Flask)

## API Endpoints

- `POST /api/chat` - Send messages to the chatbot
- `POST /api/clear-session` - Clear the current chat session

## Technologies Used

- **Backend**: Flask, Python
- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Other**: Logfire for logging

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/597f30b2-4c68-4147-8c78-f136f86370f0) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

Follow the installation instructions above to set up your local environment.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## How can I deploy this project?

For simple visualization, open [Lovable](https://lovable.dev/projects/597f30b2-4c68-4147-8c78-f136f86370f0) and click on Share -> Publish.

For production deployment, you can use platforms like Heroku, PythonAnywhere, or any other service that supports Python Flask applications.
