from flask import Flask, request, jsonify

app = Flask(__name__)

# In-memory "database"
users = [
    {"id": 1, "name": "Monica", "budget": 500},
    {"id": 2, "name": "Perla", "budget": 300},
    {"id": 3, "name": "Michelle", "budget": 300},
    {"id": 4, "name": "Sol", "budget": 300}
]

locations = [
    {"id": 1, "name": "Statue of Liberty", "votes": {"yes": [], "no": []}, "estCost": 25},
    {"id": 2, "name": "Times Square", "votes": {"yes": [], "no": []}, "estCost": 0},
    {"id": 3, "name": "Empire State Building", "votes": {"yes": [], "no": []}, "estCost": 44},
    {"id": 4, "name": "Brooklyn Bridge", "votes": {"yes": [], "no": []}, "estCost": 0},
    {"id": 5, "name": "Broadway Theater District", "votes": {"yes": [], "no": []}, "estCost": 150},
    {"id": 6, "name": "Rockefeller Center", "votes": {"yes": [], "no": []}, "estCost": 38},
    {"id": 7, "name": "One World Observatory", "votes": {"yes": [], "no": []}, "estCost": 40},
    {"id": 8, "name": "Metropolitan Museum of Art", "votes": {"yes": [], "no": []}, "estCost": 30},
    {"id": 9, "name": "Museum of Modern Art (MoMA)", "votes": {"yes": [], "no": []}, "estCost": 25},
    {"id": 10, "name": "American Museum of Natural History", "votes": {"yes": [], "no": []}, "estCost": 23},
    {"id": 11, "name": "Chrysler Building", "votes": {"yes": [], "no": []}, "estCost": 0},
    {"id": 12, "name": "Flatiron Building", "votes": {"yes": [], "no": []}, "estCost": 0},
    {"id": 13, "name": "New York Public Library", "votes": {"yes": [], "no": []}, "estCost": 0},
    {"id": 14, "name": "Madison Square Garden", "votes": {"yes": [], "no": []}, "estCost": 50},
    {"id": 15, "name": "Coney Island", "votes": {"yes": [], "no": []}, "estCost": 10},
    {"id": 16, "name": "Yankee Stadium", "votes": {"yes": [], "no": []}, "estCost": 35},
    {"id": 17, "name": "Apollo Theater", "votes": {"yes": [], "no": []}, "estCost": 30},
    {"id": 18, "name": "Brooklyn Botanic Garden", "votes": {"yes": [], "no": []}, "estCost": 18}
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
