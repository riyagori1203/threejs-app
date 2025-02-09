

import page from 'page';

export function initializeRoutes() {
    page('/rewards', () => {
        document.getElementById('app')!.innerHTML = `
            <div class="rewards-container">
                <h1 class="rewards-title">🎁 Rewards</h1>
                <div class="rewards-panel">
                    <p class="reward-points">You have <span>1250</span> points!</p>
                    <h2 class="redeem-title">🎉 Redeem Your Points</h2>
                    <ul class="redeem-options">
                        <li>☕ Free Coffee (500 Points)</li>
                        <li>🎟️ Movie Ticket (800 Points)</li>
                        <li>🎁 $10 Gift Card (1000 Points)</li>
                        <li>🍔 Free Meal (1500 Points)</li>
                    </ul>
                </div>
            </div>
    
            <style>
                .rewards-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    background: linear-gradient(135deg, #1e1e2e, #222242);
                    color: white;
                    font-family: 'Arial', sans-serif;
                    text-align: center;
                }
    
                .rewards-title {
                    font-size: 3rem;
                    margin-bottom: 20px;
                    text-shadow: 2px 2px 10px rgba(255, 215, 0, 0.8);
                }
    
                .rewards-panel {
                    background: rgba(0, 0, 0, 0.6);
                    border-radius: 15px;
                    padding: 20px;
                    width: 40%;
                    min-width: 300px;
                    box-shadow: 0px 0px 15px rgba(255, 215, 0, 0.5);
                }
    
                .reward-points {
                    font-size: 1.8rem;
                    margin-bottom: 10px;
                    font-weight: bold;
                    color: gold;
                }
    
                .redeem-title {
                    font-size: 1.5rem;
                    margin-top: 15px;
                    color: #FFD700;
                }
    
                .redeem-options {
                    list-style: none;
                    padding: 0;
                    font-size: 1.2rem;
                    margin-top: 10px;
                }
    
                .redeem-options li {
                    padding: 10px;
                    border-radius: 10px;
                    margin: 5px 0;
                    background: rgba(255, 255, 255, 0.1);
                    transition: transform 0.3s ease;
                }
    
                .redeem-options li:hover {
                    transform: scale(1.05);
                    background: rgba(255, 255, 255, 0.2);
                }
            </style>
        `;
    });
    
    page('/leaderboard', () => {
        document.getElementById('app')!.innerHTML = `
            <div class="leaderboard-container">
                <h1 class="leaderboard-title">🏆 Leaderboard</h1>
                <div class="leaderboard-panel">
                    <div class="rank top-rank">🥇 Liam - <span>1000</span> points</div>
                    <div class="rank second-rank">🥈 Sarah - <span>850</span> points</div>
                    <div class="rank third-rank">🥉 Veron - <span>720</span> points</div>
                    <div class="rank fourth-rank"> 🥉 Harry - <span>650</span> points</div>
                    <div class="rank fifth-rank"> 🥉 Niall - <span>580</span> points</div>
                </div>
            </div>
    
            <style>
                .leaderboard-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    background: linear-gradient(135deg, #1e1e2e, #222242);
                    color: white;
                    font-family: 'Arial', sans-serif;
                    text-align: center;
                }
    
                .leaderboard-title {
                    font-size: 3rem;
                    margin-bottom: 20px;
                    text-shadow: 2px 2px 10px rgba(255, 215, 0, 0.8);
                }
    
                .leaderboard-panel {
                    background: rgba(0, 0, 0, 0.6);
                    border-radius: 15px;
                    padding: 20px;
                    width: 40%;
                    min-width: 300px;
                    box-shadow: 0px 0px 15px rgba(255, 215, 0, 0.5);
                }
    
                .rank {
                    font-size: 1.5rem;
                    padding: 10px;
                    border-radius: 10px;
                    margin: 5px 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.1);
                    transition: transform 0.3s ease;
                }
    
                .rank:hover {
                    transform: scale(1.05);
                    background: rgba(255, 255, 255, 0.2);
                }
    
                .top-rank {
                    background: rgba(255, 223, 0, 0.3);
                    color: gold;
                    font-weight: bold;
                }
    
                .second-rank {
                    background: rgba(192, 192, 192, 0.3);
                    color: silver;
                    font-weight: bold;
                }
    
                .third-rank {
                    background: rgba(205, 127, 50, 0.3);
                    color: #cd7f32;
                    font-weight: bold;
                }
    
                span {
                    font-weight: bold;
                }
            </style>
        `;
    });
    

    page('/task', () => {
        // Clear and recreate app container
        document.body.innerHTML = '';
        const appElement = document.createElement('div');
        appElement.id = 'app';
        document.body.className="fullscreen"
        document.body.appendChild(appElement);
    
        // Inject the task form with improved styling
        appElement.innerHTML = `
            <div class="task-container">
                <h1 class="task-title">🌍 Task of the Day</h1>
                <div class="task-panel">
                    <h2 class="task-subtitle">Carbon Footprint Survey</h2>
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
                                <input type="radio" name="participation" value="yes" required>
                                <label>Yes</label>
                                <input type="radio" name="participation" value="no">
                                <label>No</label>
                            </div>
                            <div class="radio-group">
                                <label>Shopping Type:</label>
                                <input type="radio" name="shopping_habits" value="eco_friendly" required>
                                <label>Eco-friendly</label>
                                <input type="radio" name="shopping_habits" value="non_eco_friendly">
                                <label>Non-eco-friendly</label>
                            </div>
                        </div>
    
                        <div class="form-section">
                            <h3>✈️ Travel</h3>
                            <input type="number" name="flights_per_month" placeholder="Flights per Month" min="0">
                            <input type="number" name="train_trips_per_month" placeholder="Train Trips per Month" min="0">
                        </div>
    
                        <button type="submit" class="submit-btn">Track My Carbon Footprint</button>
                    </form>
                    <div id="resultContainer"></div>
                </div>
            </div>
    
            <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            .full-screen-background {
                margin: 0;
                padding: 0;
                height: 100vh;
                width: 100vw;
                overflow: hidden;
                background: linear-gradient(135deg, #1e1e2e, #222242);
                color: white;
                font-family: 'Arial', sans-serif;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .task-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                width: 100vw;
                overflow: hidden;
            }

            .task-title {
                font-size: 3rem;
                margin-bottom: 20px;
                text-shadow: 2px 2px 10px rgba(255, 215, 0, 0.8);
            }

            .task-panel {
                background: rgba(0, 0, 0, 0.6);
                border-radius: 15px;
                padding: 20px;
                width: 50%;
                min-width: 320px;
                box-shadow: 0px 0px 15px rgba(255, 215, 0, 0.5);
                display: flex;
                flex-direction: column;
                justify-content: center;
                flex-grow: 1;
            }

            .task-subtitle {
                font-size: 2rem;
                margin-bottom: 10px;
                color: gold;
            }

            .form-section {
                margin-bottom: 15px;
                text-align: left;
            }

            h3 {
                color: #FFD700;
                font-size: 1.5rem;
                margin-bottom: 10px;
            }

            select, input {
                width: 100%;
                padding: 10px;
                margin: 5px 0;
                border-radius: 8px;
                border: none;
                background: rgba(255, 255, 255, 0.1);
                color: white;
                font-size: 1rem;
            }

            select:focus, input:focus {
                outline: none;
                background: rgba(255, 255, 255, 0.2);
            }

            .submit-btn {
                width: 100%;
                padding: 15px;
                margin-top: 15px;
                font-size: 1.2rem;
                background: gold;
                color: black;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s ease-in-out;
            }

            .submit-btn:hover {
                background: #FFD700;
                transform: scale(1.05);
            }

            #resultContainer {
                margin-top: 20px;
                font-size: 1.3rem;
                font-weight: bold;
            }
        </style>
        `;
    
        // Handle form submission
        document.getElementById('carbonForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.currentTarget as HTMLFormElement;
            const resultContainer = document.getElementById('resultContainer')!;

            try {
                // Extract form values
                const elements = form.elements as unknown as {
                    commute_mode: HTMLSelectElement;
                    commute_distance: HTMLInputElement;
                    food_type: HTMLSelectElement;
                    takeout_packaging: HTMLSelectElement;
                    pages_used: HTMLInputElement;
                    reusable_items: HTMLInputElement;
                    participation: RadioNodeList;
                    shopping_habits: RadioNodeList;
                    flights_per_month: HTMLInputElement;
                    train_trips_per_month: HTMLInputElement;
                };

                // Validate required fields
                if (!elements.commute_mode.value || !elements.food_type.value) {
                    throw new Error("Please fill all required fields.");
                }

                // Construct JSON data
                const formData = {
                    commute_mode: elements.commute_mode.value,
                    commute_distance: parseFloat(elements.commute_distance.value),
                    food_type: elements.food_type.value,
                    takeout_packaging: elements.takeout_packaging.value,
                    pages_used: parseInt(elements.pages_used.value) || 0,
                    reusable_items: parseInt(elements.reusable_items.value) || 0,
                    participation: elements.participation.value,
                    shopping_habits: elements.shopping_habits.value,
                    flights_per_month: parseInt(elements.flights_per_month.value) || 0,
                    train_trips_per_month: parseInt(elements.train_trips_per_month.value) || 0
                };

                // Send request to Flask backend
                const response = await fetch('http://localhost:8000/calculate', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                });

                // Handle API response
                if (!response.ok) throw new Error(`Server Error: ${response.statusText}`);
                
                const data = await response.json();
                resultContainer.innerHTML = `
                    <h3>Your Carbon Footprint:</h3>
                    <p>${data.carbon}</p>
                    <h3>Daily Challenge:</h3>
                    <p>${data.challenge}</p>
                `;

            } catch (error) {
                console.error('Submission error:', error);
                resultContainer.innerHTML = `
                    <div class="error-message">
                        Error: ${error instanceof Error ? error.message : 'Failed to calculate footprint'}
                    </div>
                `;
            }
        });
    });

    // Start the routing system
    page.start();
}




