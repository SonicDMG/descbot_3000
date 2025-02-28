
"""Flask application providing a chat interface with Markdown rendering capabilities."""

import logging
import os
from logging import basicConfig, getLogger

from flask import Flask, render_template, request, jsonify, send_from_directory
from dotenv import load_dotenv
import logfire
import requests

from langflow_client import get_chatbot_response

# Initialize environment and logging
load_dotenv()
logfire.configure()

# Set up Flask app with Logfire instrumentation
app = Flask(__name__, static_folder='./dist')
logfire.instrument_flask(app)

# Set up basic logging with Logfire
basicConfig(handlers=[logfire.LogfireLoggingHandler()])
logger = getLogger(__name__)
logger.setLevel(logging.INFO)

@app.route('/api/chat', methods=['POST'])
def chat():
    """Process chat messages and return both chat and markdown responses."""
    user_message = request.json.get('message', '')
    logger.info("Received message: %s", user_message)
    if not user_message:
        return jsonify({'response': 'Please send a message!'})

    try:
        # Get response from Langflow
        chat_response, markdown_content = get_chatbot_response(user_message)

        # Return both the chat response and markdown content
        return jsonify({
            'response': chat_response,
            'markdown': markdown_content
        })

    except (requests.RequestException, KeyError, IndexError) as e:
        # Log the error in a production environment
        error_message = f"An error occurred: {str(e)}"
        logger.error(error_message)
        return jsonify({
            'response': error_message,
            'markdown': ''
        }), 500

@app.route('/api/clear-session', methods=['POST'])
def clear_session():
    """Clear the chat session."""
    logger.info("Clearing chat session")
    # Add any session clearing logic you need here
    return jsonify({'status': 'success'})

# Legacy route for backward compatibility
@app.route('/chat', methods=['POST'])
def legacy_chat():
    """Legacy endpoint for backward compatibility."""
    logger.info("Legacy chat endpoint accessed")
    return chat()

# Serve React frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """Serve the React frontend or static files."""
    logger.info(f"Serving path: {path}")
    
    # First, try to send the file from the static folder (React build)
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    
    # For any other routes, send the index.html file (React router will handle it)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
