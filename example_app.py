
from flask import Flask, request, jsonify, send_from_directory
import os

# Initialize Flask app
app = Flask(__name__, static_folder='./dist')

# API route for chat
@app.route('/api/chat', methods=['POST'])
def chat():
    # Get the message from the request
    data = request.json
    user_message = data.get('message', '')
    
    # Process the message with your existing logic
    # For example, you might have a function like:
    # response_text, markdown_content = your_chat_processing_function(user_message)
    
    # For demonstration, returning mock data
    response_text = f"You said: {user_message}"
    
    # Create a markdown response if needed (optional)
    markdown_content = None
    if "documentation" in user_message.lower() or "help" in user_message.lower():
        markdown_content = """# Help Documentation
        
This is a sample markdown document that would be shown when a user requests help.

## Available Commands

* `/help` - Show this documentation
* `/clear` - Clear the chat history
* `/search [query]` - Search for information

"""
    
    # Return the response
    return jsonify({
        'response': response_text,
        'markdown': markdown_content
    })

# API route to clear chat session
@app.route('/api/clear-session', methods=['POST'])
def clear_session():
    # Clear any session data you might be storing
    # session.clear() for example
    return jsonify({'status': 'success'})

# Serve React frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # First, try to send the file from the static folder (React build)
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    # For any other routes, send the index.html file (React router will handle it)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
