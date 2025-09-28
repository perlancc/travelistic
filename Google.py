import os
from flask import Flask, request, jsonify
import requests
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests (needed for iOS or web apps)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

@app.route("/distance")
def get_distance():
    # Get query params
    origin = request.args.get("origin")
    destination = request.args.get("destination")

    # Validate input
    if not origin or not destination:
        return jsonify({"error": "Please provide both origin and destination"}), 400

    # Google Distance Matrix API URL
    url = "https://maps.googleapis.com/maps/api/distancematrix/json"
    params = {
        "origins": origin,
        "destinations": destination,
        "key": GOOGLE_API_KEY
    }

    # Make API request
    response = requests.get(url, params=params)
    data = response.json()

    # Check for API-level errors
    if data.get("status") != "OK":
        return jsonify({"error": f"Google API error: {data.get('status')}", "details": data}), 500

    # Safely parse response
    try:
        rows = data.get("rows", [])
        if not rows or not rows[0].get("elements"):
            return jsonify({"error": "No distance data found"}), 404

        element = rows[0]["elements"][0]

        if element.get("status") != "OK":
            return jsonify({"error": f"No route found: {element.get('status')}"}), 404

        distance_text = element["distance"]["text"]
        duration_text = element["duration"]["text"]

        return jsonify({
            "origin": origin,
            "destination": destination,
            "distance": distance_text,
            "duration": duration_text
        })

    except (IndexError, KeyError):
        return jsonify({"error": "Unexpected API response format", "data": data}), 500


@app.route("/optimize-itinerary")
def optimize_itinerary():
    """
    Optimizes a list of stops using Google Directions API with optimize:true
    Example query (with attractions):
    /optimize-itinerary
    """
    # Example origin & destination
    origin = "JFK Airport, NY"
    destination = "JFK Airport, NY"

    # Example waypoints (attractions in New York)
    waypoints = [
        "Statue of Liberty, NY",
        "Empire State Building, NY",
        "Central Park, NY",
        "Times Square, NY"
    ]

    # Build request to Directions API
    url = "https://maps.googleapis.com/maps/api/directions/json"
    params = {
        "origin": origin,
        "destination": destination,
        "waypoints": "optimize:true|" + "|".join(waypoints),
        "key": GOOGLE_API_KEY
    }

    response = requests.get(url, params=params)
    data = response.json()

    if data.get("status") != "OK":
        return jsonify({"error": "Google API error", "details": data}), 500

    route = data["routes"][0]

    # Get optimized order from Google
    optimized_order = route["waypoint_order"]
    ordered_stops = [waypoints[i] for i in optimized_order]

    # Prepare detailed legs info
    legs_info = []
    for leg in route["legs"]:
        legs_info.append({
            "start": leg["start_address"],
            "end": leg["end_address"],
            "distance": leg["distance"]["text"],
            "duration": leg["duration"]["text"]
        })

    return jsonify({
        "origin": origin,
        "destination": destination,
        "optimized_order": ordered_stops,
        "legs": legs_info
    })

if __name__ == "__main__":
    app.run(debug=True)
