from flask import Flask, request, jsonify
from flask_cors import CORS  # <-- Correct import
import mysql.connector
import openai


app = Flask(__name__)
CORS(app, resources={r"/calculate": {"origins": "http://localhost:8000"}})  

# Configure OpenAI API
openai.api_key = "sk-proj-xdqSwi519CLePLJGAMIKT3BlbkFJxGZW6RtLPjjzUJSmN3bt"
user_history = {}

# Database Config
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '1234567890',
    'database': 'hack'
}

def get_db_connection():
    try:
        conn = mysql.connector.connect(**db_config)
        if not conn.is_connected():
            raise mysql.connector.Error("Failed to connect to the database")
        return conn
    except mysql.connector.Error as e:
        print(f"Error connecting to MySQL database: {e}")
        return None

@app.route('/calculate', methods=['POST'])
def calculate_footprint():
    data = request.get_json()
    username = data.get('username')  # Get username from the request
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
    carbon = int(result[0])  # Extract carbon value from AI response
    challenge = result[1]  # Extract challenge from AI response

    # Database operations
    conn = get_db_connection()
    if conn is None:
        return jsonify({'error': 'Database connection failed'}), 500

    cur = conn.cursor()

    # Check if the user exists in the points table
    cur.execute("SELECT * FROM points WHERE username = %s", (username,))
    user = cur.fetchone()

    if user:
        # User exists: Update points and prevpts
        prev_points = user[1]  # Current points
        new_prevpts = prev_points - carbon  # Calculate new prevpts
        cur.execute(
            "UPDATE points SET points = %s, prevpts = %s WHERE username = %s",
            (carbon, new_prevpts, username)
        )
    else:
        # User does not exist: Insert new record
        cur.execute(
            "INSERT INTO points (username, points, prevpts) VALUES (%s, %s, %s)",
            (username, carbon, carbon)
        )

    conn.commit()
    cur.close()
    conn.close()
    
    return jsonify({
        'carbon': result[0], 
        'challenge': result[1]
    })
    
if __name__ == '__main__':
    app.run(debug=True, port=8000)
