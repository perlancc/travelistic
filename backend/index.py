from flask import Flask, request, jsonify
from Itinerary import build_daily_itinerary_with_travel

app = Flask(__name__)

# In-memory "database"
users = [
    {"id": 1, "name": "Monica", "budget": 500},
    {"id": 2, "name": "Perla", "budget": 300},
    {"id": 3, "name": "Michelle", "budget": 300},
    {"id": 4, "name": "Sol", "budget": 300}
]

locations = [
  {"id": 1, "name": "Statue of Liberty", "votes": {"yes": [1,2,3], "no": [4]}, "estCost": 25, "estTime": 3},
  {"id": 2, "name": "Times Square", "votes": {"yes": [2,3], "no": [1]}, "estCost": 0, "estTime": 2},
  {"id": 3, "name": "Empire State Building", "votes": {"yes": [1,4], "no": [2,3]}, "estCost": 44, "estTime": 2},
  {"id": 4, "name": "Brooklyn Bridge", "votes": {"yes": [2,3,4], "no": [1]}, "estCost": 0, "estTime": 1.5},
  {"id": 5, "name": "Broadway Theater District", "votes": {"yes": [1,2,3], "no": []}, "estCost": 150, "estTime": 3},
  {"id": 6, "name": "Rockefeller Center", "votes": {"yes": [1], "no": [2,3]}, "estCost": 38, "estTime": 2},
  {"id": 7, "name": "One World Observatory", "votes": {"yes": [2,3,4], "no": [1]}, "estCost": 40, "estTime": 2},
  {"id": 8, "name": "Metropolitan Museum of Art", "votes": {"yes": [1,3], "no": [2]}, "estCost": 30, "estTime": 3},
  {"id": 9, "name": "Museum of Modern Art (MoMA)", "votes": {"yes": [2,3,4], "no": []}, "estCost": 25, "estTime": 2},
  {"id": 10, "name": "American Museum of Natural History", "votes": {"yes": [1], "no": [2,3]}, "estCost": 23, "estTime": 3},
  {"id": 11, "name": "Chrysler Building", "votes": {"yes": [1,2,3], "no": []}, "estCost": 0, "estTime": 1},
  {"id": 12, "name": "Flatiron Building", "votes": {"yes": [3,4], "no": [1,2]}, "estCost": 0, "estTime": 1},
  {"id": 13, "name": "New York Public Library", "votes": {"yes": [2,3,4], "no": []}, "estCost": 0, "estTime": 1.5},
  {"id": 14, "name": "Madison Square Garden", "votes": {"yes": [1,3], "no": [2]}, "estCost": 50, "estTime": 2},
  {"id": 15, "name": "Coney Island", "votes": {"yes": [2,4], "no": [1,3]}, "estCost": 10, "estTime": 4},
  {"id": 16, "name": "Yankee Stadium", "votes": {"yes": [1,2,3], "no": []}, "estCost": 35, "estTime": 3},
  {"id": 17, "name": "Apollo Theater", "votes": {"yes": [2,3], "no": [1]}, "estCost": 30, "estTime": 2},
  {"id": 18, "name": "Brooklyn Botanic Garden", "votes": {"yes": [1,2,3], "no": [4]}, "estCost": 18, "estTime": 2}
]

# Helper function to get majority yes places
def get_majority_yes_places():
    return [loc for loc in locations if len(loc["votes"]["yes"]) > len(loc["votes"]["no"])]

# Home route
@app.route("/")
def home():
    return "Backend is running"

# Users endpoints
@app.route("/users", methods=["GET"])
def get_users():
    return jsonify(users)

@app.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = next((u for u in users if u["id"] == user_id), None)
    if not user:
        return "User not found", 404
    return jsonify(user)

@app.route("/itinerary/daily", methods=["GET"])
def daily_itinerary():
    majority_locations = get_majority_yes_places()
    itinerary = build_daily_itinerary_with_travel(majority_locations)
    return jsonify(itinerary)

@app.route("/users", methods=["POST"])
def add_user():
    data = request.get_json()
    new_user = {
        "id": len(users) + 1,
        "name": data.get("name"),
        "budget": data.get("budget", 0)
    }
    users.append(new_user)
    return jsonify(new_user), 201

@app.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    global users
    user = next((u for u in users if u["id"] == user_id), None)
    if not user:
        return "User not found", 404
    users = [u for u in users if u["id"] != user_id]
    return jsonify(user)

# Budgets endpoint
@app.route("/budgets", methods=["GET"])
def get_budgets():
    budgets = [{"id": u["id"], "name": u["name"], "budget": u["budget"]} for u in users]
    return jsonify(budgets)

# Locations endpoints
@app.route("/locations", methods=["GET"])
def get_locations():
    return jsonify(locations)

@app.route("/locations", methods=["POST"])
def add_location():
    data = request.get_json()
    new_location = {
        "id": len(locations) + 1,
        "name": data.get("name"),
        "votes": {"yes": [], "no": []},
        "estCost": data.get("estCost", 0)
    }
    locations.append(new_location)
    return jsonify(new_location), 201

@app.route("/locations/<int:loc_id>", methods=["DELETE"])
def delete_location(loc_id):
    global locations
    loc = next((l for l in locations if l["id"] == loc_id), None)
    if not loc:
        return "Location not found", 404
    locations = [l for l in locations if l["id"] != loc_id]
    return jsonify(loc)

# Voting endpoint
@app.route("/locations/<int:loc_id>/vote", methods=["POST"])
def vote(loc_id):
    data = request.get_json()
    user_id = data.get("userId")
    vote_choice = data.get("vote")  # "yes" or "no"

    loc = next((l for l in locations if l["id"] == loc_id), None)
    if not loc:
        return "Location not found", 404
    if vote_choice not in ["yes", "no"]:
        return 'Vote must be "yes" or "no"', 400

    opposite = "no" if vote_choice == "yes" else "yes"
    if user_id in loc["votes"][opposite]:
        loc["votes"][opposite].remove(user_id)
    if user_id not in loc["votes"][vote_choice]:
        loc["votes"][vote_choice].append(user_id)

    return jsonify({
        "id": loc["id"],
        "name": loc["name"],
        "votes": loc["votes"]
    })

# Itinerary endpoint (majority yes)
@app.route("/itinerary", methods=["GET"])
def itinerary():
    return jsonify(get_majority_yes_places())

if __name__ == "__main__":
    app.run(debug=True)
