import page from 'page';

export function initializeRoutes() {
    page('/leaderboard', () => {
        document.getElementById('app').innerHTML = `
            <div class="leaderboard">
                <h1>Leaderboard</h1>
                <div class="rankings">
                    <div class="rank">1. Player 1 - 1000 points</div>
                    <div class="rank">2. Player 2 - 850 points</div>
                    <div class="rank">3. Player 3 - 720 points</div>
                </div>
            </div>
        `;
    });

    page('/task', () => {
        document.body.style.backgroundImage = 'none';
    document.body.style.backgroundColor = '#fff'; // or any color you prefer
        document.getElementById('app').innerHTML = `
            <div class="task-container">
                <div class="task">
                    <h1>Carbon Footprint Survey</h1>
                    <form id="carbonForm" class="carbon-form">
                        <div class="form-section">
                            <h3>🚗 Transportation</h3>
                            <select name="commute_mode" required>
                                <option value="">Select Commute Type</option>
                                <option value="petrol_car">Petrol Car</option>
                                <option value="diesel_car">Diesel Car</option>
                                <option value="electric_car">Electric Car</option>
                                <option value="carpool">Carpool</option>
                                <option value="public_transport">Public Transport</option>
                                <option value="walking_biking">Walking/Biking</option>
                            </select>
                            <input type="number" name="commute_distance" placeholder="Daily Commute Distance (miles)" required>
                        </div>

                        <div class="form-section">
                            <h3>🍽️ Food Habits</h3>
                            <select name="food_type" required>
                                <option value="">Select Meal Type</option>
                                <option value="vegan">Vegan</option>
                                <option value="vegetarian">Vegetarian</option>
                                <option value="meat_based">Meat Based</option>
                            </select>
                            <select name="takeout_packaging" required>
                                <option value="">Select Packaging Type</option>
                                <option value="plastic">Plastic</option>
                                <option value="reusable">Reusable</option>
                            </select>
                        </div>

                        <div class="form-section">
                            <h3>♻️ Recyclable Items</h3>
                            <input type="number" name="pages_used" placeholder="Pages Used per Day" min="0">
                            <input type="number" name="reusable_items" placeholder="Reusable Items Used per Day" min="0">
                        </div>

                        <div class="form-section">
                            <h3>🌱 Lifestyle</h3>
                            <div class="radio-group">
                                <label>Green Initiatives Participation:</label>
                                <div>
                                    <input type="radio" name="participation" value="yes" required>
                                    <label>Yes</label>
                                    <input type="radio" name="participation" value="no">
                                    <label>No</label>
                                </div>
                            </div>
                            <div class="radio-group">
                                <label>Shopping Type:</label>
                                <div>
                                    <input type="radio" name="shopping_habits" value="eco_friendly" required>
                                    <label>Eco-friendly</label>
                                    <input type="radio" name="shopping_habits" value="non_eco_friendly">
                                    <label>Non-eco-friendly</label>
                                </div>
                            </div>
                        </div>

                        <div class="form-section">
                            <h3>✈️ Travel</h3>
                            <input type="number" name="flights_per_month" placeholder="Flights per Month" min="0">
                            <input type="number" name="train_trips_per_month" placeholder="Train Trips per Month" min="0">
                        </div>

                        <button type="submit" class="submit-btn">Track My Carbon Footprint</button>
                    </form>
                </div>
            </div>
            <style>
                .task-container {
                    min-height: 100vh;
                    background-color: #f5f6fa;
                    padding: 40px 20px;
                }
                .task {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    padding: 30px;
                }
                .carbon-form {
                    width: 100%;
                }
                .form-section {
                    margin-bottom: 25px;
                    padding: 20px;
                    border: 1px solid #e1e1e1;
                    border-radius: 8px;
                    background: #fff;
                }
                .form-section h3 {
                    margin-top: 0;
                    color: #2c3e50;
                    font-size: 1.2em;
                }
                select, input[type="number"] {
                    width: 100%;
                    padding: 12px;
                    margin: 8px 0;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 16px;
                }
                .radio-group {
                    margin: 15px 0;
                }
                .radio-group label {
                    margin-right: 20px;
                    font-size: 16px;
                }
                .submit-btn {
                    width: 100%;
                    padding: 15px;
                    background-color: #27ae60;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 18px;
                    margin-top: 20px;
                }
                .submit-btn:hover {
                    background-color: #219a52;
                }
                h1 {
                    text-align: center;
                    color: #2c3e50;
                    margin-bottom: 30px;
                }
            </style>
        `;

        document.getElementById('carbonForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for submitting your carbon footprint data!');
        });
    });

    page.start();
}