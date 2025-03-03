
"""Client for interacting with the Langflow API to process chat messages."""

import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get configuration from environment variables with fallbacks
BASE_API_URL = os.getenv("LANGFLOW_API_URL", "http://127.0.0.1:7860")
FLOW_ID = os.getenv("LANGFLOW_FLOW_ID", "64cdeeba-6a56-48f1-8cc0-b21e47f91956")
ENDPOINT = os.getenv("LANGFLOW_ENDPOINT", "generate_yt_description")  # You can set a specific endpoint name in the flow settings

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
    api_url = f"{BASE_API_URL}/api/v1/run/{ENDPOINT or FLOW_ID}"
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
