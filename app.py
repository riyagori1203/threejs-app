from flask import Flask, request, jsonify
from flask_cors import CORS  # <-- Correct import
import openai


app = Flask(__name__)
CORS(app, resources={r"/calculate": {"origins": "http://localhost:8080"}})  

# Configure OpenAI API
openai.api_key = "sk-proj-xdqSwi519CLePLJGAMIKT3BlbkFJxGZW6RtLPjjzUJSmN3bt"
user_history = {}

@app.route('/calculate', methods=['POST'])
def calculate_footprint():
    data = request.get_json()
    
    # Construct the AI prompt
    prompt = f"""
    The user is tracking their carbon footprint **daily**. Calculate the **total daily CO₂ emissions in kg** based on:
    - Commute: {data['commute_mode']} ({data['commute_distance']} miles)
    - Food: {data['food_type']} with {data['takeout_packaging']} packaging
    - Pages Used: {data['pages_used']}, Reusables: {data['reusable_items']}
    - Green Initiatives: {data['participation']}
    - Shopping: {data['shopping_habits']}
    - Travel: {data['flights_per_month']} flights, {data['train_trips_per_month']} train trips

    1️⃣ Calculate total daily CO₂ in kg (just the number)
    2️⃣ Provide ONE challenge for the highest contributor
    """
    
    # Get AI response
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Provide carbon footprint calculation and one challenge."},
            {"role": "user", "content": prompt}
        ]
    )
    
    result = response.choices[0].message.content.strip().split('\n')
    return jsonify({
        'carbon': result[0], 
        'challenge': result[1]
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
