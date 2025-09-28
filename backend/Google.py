from datetime import datetime, timedelta
import requests
import os

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

def get_travel_time(origin, destination):
    """
    Calls your /distance endpoint internally or directly Google API
    Returns travel time in minutes
    """
    url = "https://maps.googleapis.com/maps/api/distancematrix/json"
    params = {
        "origins": origin,
        "destinations": destination,
        "key": GOOGLE_API_KEY
    }
    response = requests.get(url, params=params).json()
    try:
        element = response["rows"][0]["elements"][0]
        if element.get("status") == "OK":
            return element["duration"]["value"] / 60  # seconds → minutes
        else:
            return 30  # default if no route
    except (KeyError, IndexError):
        return 30  # fallback