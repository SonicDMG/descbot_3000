
"""Client for interacting with the Langflow API to process chat messages."""

import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get configuration from environment variables with fallbacks
BASE_API_URL = os.getenv("LANGFLOW_API_URL")
FLOW_ID = os.getenv("LANGFLOW_FLOW_ID")
ENDPOINT = os.getenv("LANGFLOW_ENDPOINT")

# Keep the tweaks configuration as is since it's structured data that would be complex in .env
TWEAKS = {
    "YouTubeTranscripts-hBTuU": {},
    "ChatInput-HOTGR": {},
    "ChatOutput-GoFMV": {},
    "Agent-9ul84": {},
    "URL-6DyCM": {},
    "Agent-2Ih7M": {},
    "ComposioAPI-d1saz": {},
    "Agent-98DCo": {},
    "TextOutput-oZN2K": {},
    "Prompt-r4xbT": {},
    "TextOutput-dB9qE": {}
}

def get_chatbot_response(message: str) -> tuple[str, str]:
    """
    Get a response from the chatbot and split it into left and right panel content.
    
    Args:
        message: The input message to send to the chatbot
    Returns:
        tuple: (left_panel_content, right_panel_content)
    """
    # Check if we have the required configuration
    if not BASE_API_URL:
        return "Error: LANGFLOW_API_URL is not set in environment variables", ""
    
    # Check if at least one of FLOW_ID or ENDPOINT is available
    if not FLOW_ID and not ENDPOINT:
        return "Error: Neither LANGFLOW_FLOW_ID nor LANGFLOW_ENDPOINT is set in environment variables", ""
    
    # Use ENDPOINT if available, otherwise fall back to FLOW_ID
    endpoint_to_use = ENDPOINT or FLOW_ID
    api_url = f"{BASE_API_URL}/api/v1/run/{endpoint_to_use}"
    
    payload = {
        "input_value": message,
        "output_type": "chat",
        "input_type": "chat",
        "tweaks": TWEAKS
    }

    try:
        response = requests.post(api_url, json=payload, timeout=120)
        response_data = response.json()
        full_response = response_data['outputs'][0]['outputs'][0]['results']['message']['text']

        # Split the response at the marker
        parts = full_response.split("**MARKDOWN_START**")
        left_content = parts[0].strip() if parts else "No left content"
        right_content = parts[1].strip() if len(parts) > 1 else "No right content"
        return left_content, right_content

    except (requests.RequestException, KeyError, IndexError) as e:
        return f"Error: {str(e)}", ""
