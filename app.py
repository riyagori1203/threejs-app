
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

# Initialize Flask app
app = Flask(__name__)

# Configure CORS
CORS(app, resources={r"/calculate": {"origins": "*"}}, supports_credentials=True)

# Initialize OpenAI client

@app.route('/calculate', methods=['GET', 'POST', 'OPTIONS'])
def calculate_footprint():
    """API to calculate daily carbon footprint and suggest a challenge"""

    # Handle CORS preflight
    if request.method == 'OPTIONS':
        response = jsonify({"message": "CORS preflight successful"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        return response, 200

    # Validate JSON input
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 415
    
    data = request.get_json()

    # Validate required fields
    required_fields = [
        "commute_mode", "commute_distance", "food_type", "takeout_packaging", 
        "pages_used", "reusable_items", "participation", "shopping_habits", 
        "flights_per_month", "train_trips_per_month"
    ]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    # Construct AI prompt with structured formatting
    prompt = f"""
    The user is tracking their carbon footprint **daily**. Calculate the **total daily CO₂ emissions in kg** based on:

    - **Commute**: {data['commute_mode']} ({data['commute_distance']} miles)
    - **Food**: {data['food_type']} with {data['takeout_packaging']} packaging
    - **Pages Used**: {data['pages_used']}, Reusables: {data['reusable_items']}
    - **Green Initiatives**: {data['participation']}
    - **Shopping**: {data['shopping_habits']}
    - **Travel**: {data['flights_per_month']} flights, {data['train_trips_per_month']} train trips

    **Response Format (strict, two lines only):**
    - **[Carbon footprint] kg CO₂ per day**
    - **[One actionable challenge based on the highest contributor]**

    **Rules for Challenge:**
    - If **commute is highest**, suggest alternatives like carpooling, walking, or using public transport.
    - If **flights are highest**, suggest replacing a flight with a train ride or virtual meeting.
    - If **food is highest**, suggest reducing meat or switching to a lower-carbon diet.
    - If **shopping is highest**, suggest reducing unnecessary purchases or buying eco-friendly items.
    - Keep the challenge **short, actionable, and realistic**.
    """

    try:
        # ✅ OpenAI API Call using the new client
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a carbon footprint tracker. Identify the highest emission source and provide a practical, realistic challenge."},
                {"role": "user", "content": prompt}
            ]
        )

        # ✅ Parse AI response with strict structure
        ai_response = response.choices[0].message.content.strip().split('\n')

        carbon = ai_response[0] if len(ai_response) > 0 else "N/A"
        challenge = ai_response[1] if len(ai_response) > 1 else "No challenge available"

        return jsonify({
            'carbon': carbon,
            'challenge': challenge
        })

    except Exception as e:
        return jsonify({"error": f"OpenAI API Error: {str(e)}"}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, port=8000)
