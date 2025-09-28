from datetime import datetime, timedelta
from Google import get_travel_time


from datetime import datetime, timedelta
from Google import get_travel_time

def build_daily_itinerary_with_travel(locations, start_location="The Plaza Hotel New York"):
    """
    Build a daily itinerary with meals, travel, and activities.
    locations: list of dicts with 'name' and optional 'estTime' and 'estCost'
    start_location: where the day starts and ends (default = The Plaza Hotel New York)
    """
    itinerary = []
    day = 1
    location_index = 0

    meals = [
        {"name": "Breakfast", "start": "08:00", "end": "09:00"},
        {"name": "Lunch", "start": "12:00", "end": "13:00"},
        {"name": "Dinner", "start": "18:00", "end": "19:00"}
    ]

    while location_index < len(locations):
        prev_location = start_location  # Reset to hotel at start of each day

        for meal in meals:
            # Add meal (always at the hotel in morning, otherwise wherever you are)
            meal_start = datetime.strptime(meal["start"], "%H:%M")
            meal_end = datetime.strptime(meal["end"], "%H:%M")

            itinerary.append({
                "day": day,
                "type": "meal",
                "name": meal["name"],
                "start": meal_start.strftime("%I:%M %p"),
                "end": meal_end.strftime("%I:%M %p")
            })

            # Add travel + activity
            if location_index < len(locations):
                loc = locations[location_index]

                # Travel from prev_location → this location
                travel_minutes = get_travel_time(prev_location, loc["name"])
                travel_start = meal_end
                travel_end = travel_start + timedelta(minutes=travel_minutes)

                itinerary.append({
                    "day": day,
                    "type": "travel",
                    "from": prev_location,
                    "to": loc["name"],
                    "start": travel_start.strftime("%I:%M %p"),
                    "end": travel_end.strftime("%I:%M %p"),
                    "duration_minutes": round(travel_minutes)
                })

                # Activity at this location
                activity_duration = loc.get("estTime", 1)  # default 1 hour
                activity_end = travel_end + timedelta(hours=activity_duration)

                itinerary.append({
                    "day": day,
                    "type": "activity",
                    "name": loc["name"],
                    "start": travel_end.strftime("%I:%M %p"),
                    "end": activity_end.strftime("%I:%M %p"),
                    "cost": loc.get("estCost", 0)  # <-- added cost here
                })

                prev_location = loc["name"]
                location_index += 1

        # After dinner, travel back to hotel
        travel_minutes = get_travel_time(prev_location, start_location)
        return_start = datetime.strptime("19:00", "%H:%M")
        return_end = return_start + timedelta(minutes=travel_minutes)

        itinerary.append({
            "day": day,
            "type": "travel",
            "from": prev_location,
            "to": start_location,
            "start": return_start.strftime("%I:%M %p"),
            "end": return_end.strftime("%I:%M %p"),
            "duration_minutes": round(travel_minutes)
        })

        day += 1

    return itinerary