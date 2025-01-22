/* Energy Saving Calculator Functionality */
document.addEventListener("DOMContentLoaded", function() {
    // Appliance array to store each added appliance data
    let appliances = [];

    // Add new element references
    const resetBtn = document.getElementById('resetBtn');
    const calculateBtn = document.getElementById('calculateSavingsBtn');
    const loadingSpinner = calculateBtn.querySelector('.loading-spinner');
    const buttonText = calculateBtn.querySelector('.button-text');
    const applianceForm = document.getElementById('applianceForm');

    // Reset functionality
    resetBtn.addEventListener('click', function() {
        document.getElementById('energyCost').value = '';
        applianceForm.innerHTML = '<p class="helper-text" id="noAppliancesMessage">Click \'Add Appliance\' to begin your calculation</p>';
        document.getElementById('savingsResult').innerHTML = '';
        document.getElementById('personalizedInsights').innerHTML = '';
        appliances = []; // Clear the appliances array
    });

    // Function to add an appliance input field
    function addApplianceInput() {
        // Remove the initial helper text if it exists
        const helperText = document.getElementById('noAppliancesMessage');
        if (helperText) {
            helperText.remove();
        }

        const newAppliance = `
            <div class="appliance">
                <div class="input-group">
                    <label>Appliance Type</label>
                    <select class="applianceType">
                        <option value="">Select an appliance</option>
                        <option value="Fridge">Fridge</option>
                        <option value="TV">TV</option>
                        <option value="Microwave">Microwave</option>
                        <option value="Washing Machine">Washing Machine</option>
                        <option value="Dishwasher">Dishwasher</option>
                        <option value="Air Conditioner">Air Conditioner</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Energy Usage (kWh)</label>
                    <input type="number" min="0" step="0.1" class="energyUsage" placeholder="Enter energy usage">
                </div>
                <div class="input-group">
                    <label>Usage Duration (hours/day)</label>
                    <input type="number" min="0" max="24" step="0.5" class="usageDuration" placeholder="Enter usage duration">
                </div>
                <button type="button" class="removeApplianceBtn">Remove</button>
            </div>
        `;
        applianceForm.insertAdjacentHTML('beforeend', newAppliance);
        
        // Add event listener to new remove button
        const removeBtn = applianceForm.lastElementChild.querySelector('.removeApplianceBtn');
        removeBtn.addEventListener('click', (e) => e.target.closest('.appliance').remove());
    }

    // Event listener to add appliance inputs
    document.getElementById("addApplianceBtn").addEventListener("click", addApplianceInput);

    // Event listener to calculate savings
    document.getElementById("calculateSavingsBtn").addEventListener("click", async function() {
        // Show loading state
        buttonText.style.visibility = 'hidden'; // Hide the text
        loadingSpinner.style.display = 'inline-block'; // Show spinner
        calculateBtn.disabled = true;

        try {
            // Your existing calculation logic
            let totalUsage = 0;
            let potentialSavings = 0;
            const energyCost = parseFloat(document.getElementById('energyCost').value) || 0;

            // Validate energy cost
            if (energyCost <= 0) {
                throw new Error('Please enter a valid energy cost');
            }

            // Clear appliances array for fresh data
            appliances = [];

            // Loop through each appliance input for data extraction
            const applianceInputs = document.querySelectorAll('.appliance');
            applianceInputs.forEach(function(input) {
                const type = input.querySelector('.applianceType').value;
                const usage = parseFloat(input.querySelector('.energyUsage').value);
                const duration = parseFloat(input.querySelector('.usageDuration').value);

                if (!isNaN(usage) && !isNaN(duration)) {
                    totalUsage += usage * duration;
                    appliances.push({ type, usage, duration });
                }
            });

            // Calculate potential savings based on dynamic optimal hours
            appliances.forEach(function(appliance) {
                const efficiency = APPLIANCE_EFFICIENCY[appliance.type];
                if (appliance.duration > efficiency.optimalHours) {
                    const excessUsage = (appliance.duration - efficiency.optimalHours) * appliance.usage;
                    potentialSavings += excessUsage;
                }
            });

            // Validate user input for usage duration
            const durationInput = input.querySelector('.usageDuration');
            if (duration > efficiency.maxHours) {
                alert(`The maximum usage for a ${appliance.type} is ${efficiency.maxHours} hours.`);
                return; // Prevent further calculations
            }

            // Add a small delay to make the loading state visible
            await new Promise(resolve => setTimeout(resolve, 800));

            // Display results and insights
            displayResults(totalUsage, potentialSavings, energyCost);
            generateInsights(appliances);

        } catch (error) {
            // Handle errors
            document.getElementById('savingsResult').innerHTML = `
                <div class="error-message">
                    ${error.message}
                </div>
            `;
        } finally {
            // Reset loading state
            buttonText.style.visibility = 'visible'; // Show the text again
            loadingSpinner.style.display = 'none'; // Hide spinner
            calculateBtn.disabled = false;
        }
    });

    // Display total usage and potential savings
    function displayResults(totalUsage, potentialSavings, energyCost) {
        const resultDisplay = document.getElementById('savingsResult');
        const dailyCost = (totalUsage * energyCost).toFixed(2);
        const monthlyCost = (dailyCost * 30).toFixed(2);
        const yearlyCost = (monthlyCost * 12).toFixed(2);
        
        resultDisplay.innerHTML = `
            <h3>Energy Usage Summary</h3>
            <p>Daily Usage: ${totalUsage.toFixed(2)} kWh ($${dailyCost})</p>
            <p>Monthly Usage: ${(totalUsage * 30).toFixed(2)} kWh ($${monthlyCost})</p>
            <p>Yearly Usage: ${(totalUsage * 365).toFixed(2)} kWh ($${yearlyCost})</p>
        `;

        if (potentialSavings > 0) {
            const dailySavings = (potentialSavings * energyCost).toFixed(2);
            const monthlySavings = (dailySavings * 30).toFixed(2);
            const yearlySavings = (monthlySavings * 12).toFixed(2);
            
            resultDisplay.innerHTML += `
                <h3>Potential Savings</h3>
                <p>Daily Savings: ${potentialSavings.toFixed(2)} kWh ($${dailySavings})</p>
                <p>Monthly Savings: ${(potentialSavings * 30).toFixed(2)} kWh ($${monthlySavings})</p>
                <p>Yearly Savings: ${(potentialSavings * 365).toFixed(2)} kWh ($${yearlySavings})</p>
            `;
        }
    }

    // Generate personalized insights based on usage patterns
    function generateInsights(appliances) {
        const insightsDisplay = document.getElementById('personalizedInsights');
        insightsDisplay.innerHTML = '<h3>Energy Saving Recommendations</h3>';

        const applianceData = {
            'Fridge': { maxUsage: 2, optimalHours: 24 },
            'TV': { maxUsage: 0.2, optimalHours: 4 },
            'Microwave': { maxUsage: 1.2, optimalHours: 1 },
            'Washing Machine': { maxUsage: 2.5, optimalHours: 2 },
            'Dishwasher': { maxUsage: 1.5, optimalHours: 2 },
            'Air Conditioner': { maxUsage: 3.5, optimalHours: 8 }
        };

        appliances.forEach(function(appliance) {
            const insights = [];
            const standardData = applianceData[appliance.type];

            if (standardData) {
                if (appliance.usage > standardData.maxUsage) {
                    insights.push(`Your ${appliance.type} uses ${appliance.usage.toFixed(1)} kWh, which is above the efficient range of ${standardData.maxUsage} kWh. Consider upgrading to an energy-efficient model.`);
                }

                if (appliance.duration > standardData.optimalHours) {
                    insights.push(`Consider reducing ${appliance.type} usage from ${appliance.duration} hours to ${standardData.optimalHours} hours per day for optimal efficiency.`);
                }
            }

            if (insights.length > 0) {
                insightsDisplay.innerHTML += `
                    <div class="appliance-insight">
                        <h4>${appliance.type}</h4>
                        ${insights.map(insight => `<p>• ${insight}</p>`).join('')}
                    </div>
                `;
            }
        });
    }

    // Highlight active navigation links based on the current page
    const currentUrl = window.location.href;
    const navLinks = document.querySelectorAll("nav a");
    navLinks.forEach(link => {
        if (link.href === currentUrl) {
            link.classList.add("active");
        }
    });

    // Contact form submission handling with Fetch API
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent form's default submission behavior
            const formData = new FormData(contactForm);
            const encodedFormData = new URLSearchParams(formData).toString();

            // Submit form data to PHP script
            fetch("process_contact_form.php", {
                method: "POST",
                body: encodedFormData,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            .then(response => {
                if (response.ok) {
                    console.log("Form submitted successfully!");
                    contactForm.reset();
                } else {
                    console.error("Form submission failed!");
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
        });
    }
});

// Common appliance wattages
const applianceWattages = {
    refrigerator: 250,
    tv: 200,
    ac: 2000,
    washer: 700,
    microwave: 1000,
    iron: 1500,
    computer: 200,
    fan: 75,
    bulb: 60,
    water_heater: 3500
};

window.updateWattage = function(selectElement) {
    const wattageInput = selectElement.closest('.appliance-entry').querySelector('.watts');
    const nameInput = selectElement.closest('.appliance-entry').querySelector('.appliance-name');
    const selectedValue = selectElement.value;

    if (selectedValue && applianceWattages[selectedValue]) {
        wattageInput.value = applianceWattages[selectedValue];
        nameInput.value = selectElement.options[selectElement.selectedIndex].text.split('(')[0].trim();
    }
}

window.addAppliance = function() {
    const container = document.getElementById('appliances-container');
    const newEntry = document.createElement('div');
    newEntry.className = 'appliance-entry';
    newEntry.innerHTML = `
        <button class="remove-appliance" onclick="removeAppliance(this)">
            <i class="fas fa-times"></i>
        </button>
        <div class="input-group">
            <label>Appliance Name</label>
            <div class="appliance-input-group">
                <select class="appliance-select" onchange="updateWattage(this)">
                    <option value="">Select an appliance or type below</option>
                    <option value="refrigerator">Refrigerator (150-400W)</option>
                    <option value="tv">Television (80-400W)</option>
                    <option value="ac">Air Conditioner (1000-3500W)</option>
                    <option value="washer">Washing Machine (500-900W)</option>
                    <option value="microwave">Microwave (600-1500W)</option>
                    <option value="iron">Iron (1000-2000W)</option>
                    <option value="computer">Computer (150-300W)</option>
                    <option value="fan">Fan (50-100W)</option>
                    <option value="bulb">Light Bulb (40-100W)</option>
                    <option value="water_heater">Water Heater (3000-4500W)</option>
                </select>
                <input type="text" class="appliance-name" placeholder="or type appliance name">
            </div>
        </div>
        <div class="input-group">
            <label>Power Rating (Watts)</label>
            <input type="number" class="watts" placeholder="e.g., 100">
        </div>
        <div class="input-group">
            <label>Hours Used Per Day</label>
            <input type="number" class="hours" placeholder="e.g., 8">
        </div>
    `;
    container.appendChild(newEntry);
}

function calculateTotalSavings() {
    // Get all appliance entries
    const applianceEntries = document.querySelectorAll('.appliance-entry');
    const rate = parseFloat(document.getElementById('rate').value) || 25.40; // Default rate

    // Validate inputs
    let hasEmptyFields = false;
    applianceEntries.forEach(entry => {
        const name = entry.querySelector('.appliance-name').value;
        const watts = entry.querySelector('.watts').value;
        const hours = entry.querySelector('.hours').value;
        
        if (!name || !watts || !hours) {
            hasEmptyFields = true;
        }
    });

    if (hasEmptyFields) {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.classList.add('show');
        errorMessage.querySelector('span').textContent = 'Please fill in all appliance details';
        return;
    }

    // Calculate totals
    let totalDaily = 0;
    let totalMonthly = 0;
    let totalCost = 0;
    let totalCO2 = 0;
    let potentialMonthlySavings = 0;
    const insights = [];

    applianceEntries.forEach(entry => {
        const name = entry.querySelector('.appliance-name').value;
        const watts = parseFloat(entry.querySelector('.watts').value);
        const hours = parseFloat(entry.querySelector('.hours').value);
        
        // Daily calculations
        const dailyKWh = (watts * hours) / 1000;
        const monthlyKWh = dailyKWh * 30;
        const monthlyCost = monthlyKWh * rate;
        
        totalDaily += dailyKWh;
        totalMonthly += monthlyKWh;
        totalCost += monthlyCost;
        totalCO2 += monthlyKWh * 0.5; // CO2 emission factor

        // Calculate savings opportunities
        let applianceSavings = 0;

        // 1. Excess hours reduction
        if (hours > 8 && name.toLowerCase() !== 'refrigerator') {
            const excessHours = hours - 8;
            const excessKWh = (watts * excessHours) / 1000;
            const excessCost = excessKWh * 30 * rate;
            applianceSavings += excessCost * 0.5;
            insights.push(`<li><i class="fas fa-clock"></i> Reducing ${name}'s usage by ${excessHours} hours could save KSH ${excessCost.toFixed(2)} monthly</li>`);
        }

        // 2. High-power appliance optimization
        if (watts >= 1000) {
            const offPeakSavings = monthlyCost * 0.15; // 15% savings for off-peak usage
            applianceSavings += offPeakSavings;
            insights.push(`<li><i class="fas fa-bolt"></i> Using ${name} during off-peak hours could save KSH ${offPeakSavings.toFixed(2)} monthly</li>`);
        }

        // 3. Efficiency improvements for specific appliances
        if (watts > 100 && name.toLowerCase().includes('bulb')) {
            const ledSavings = monthlyCost * 0.8; // 80% savings with LED
            applianceSavings += ledSavings;
            insights.push(`<li><i class="fas fa-lightbulb"></i> Switching ${name} to LED could save KSH ${ledSavings.toFixed(2)} monthly</li>`);
        }

        potentialMonthlySavings += applianceSavings;
    });

    // Update display
    document.getElementById('dailyUsage').textContent = totalDaily.toFixed(2) + ' kWh';
    document.getElementById('monthlyUsage').textContent = totalMonthly.toFixed(2) + ' kWh';
    document.getElementById('monthlyCost').textContent = 'KSH ' + totalCost.toFixed(2);
    document.getElementById('co2Impact').textContent = totalCO2.toFixed(2) + ' kg';
    
    // Format potential savings
    const savingsText = potentialMonthlySavings > 0 
        ? `KSH ${potentialMonthlySavings.toFixed(2)} through recommended actions`
        : 'Your usage is already optimized';
    
    document.getElementById('potentialSavings').textContent = savingsText;

    // Add general insights if needed
    if (totalMonthly > 300) {
        insights.push(`<li><i class="fas fa-exclamation-circle"></i> Your monthly consumption is above average. Consider an energy audit.</li>`);
    }

    // Update insights display
    document.getElementById('insightsList').innerHTML = insights.join('');
    
    // Show results
    document.getElementById('result').style.display = 'block';
}

window.removeAppliance = function(button) {
    button.parentElement.remove();
}

// Add this to hide error message when user starts filling in fields
document.addEventListener('input', function(e) {
    if (e.target.closest('.calculator-form')) {
        document.getElementById('errorMessage').classList.remove('show');
    }
});

// Add this function to load previous results
function loadPreviousCalculation() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        const userEmail = localStorage.getItem('userEmail');
        const savedResults = localStorage.getItem(`calculationResults_${userEmail}`);
        
        if (savedResults) {
            const results = JSON.parse(savedResults);
            
            // Set the rate
            document.getElementById('rate').value = results.rate;
            
            // Clear existing appliances except the first one
            const container = document.getElementById('appliances-container');
            container.innerHTML = '';
            
            // Add saved appliances
            results.appliances.forEach((appliance, index) => {
                if (index === 0) {
                    // First appliance
                    addAppliance();
                } else {
                    // Additional appliances
                    addAppliance();
                }
            });
            
            // Fill in the values for each appliance
            const applianceEntries = document.getElementsByClassName('appliance-entry');
            results.appliances.forEach((appliance, index) => {
                const entry = applianceEntries[index];
                entry.querySelector('.appliance-name').value = appliance.name;
                entry.querySelector('.watts').value = appliance.watts;
                entry.querySelector('.hours').value = appliance.hours;
            });
            
            // Display the results
            document.getElementById('dailyUsage').textContent = results.dailyUsage + ' kWh';
            document.getElementById('monthlyUsage').textContent = results.monthlyUsage + ' kWh';
            document.getElementById('monthlyCost').textContent = 'Ksh ' + results.monthlyCost;
            document.getElementById('co2Impact').textContent = results.co2Impact + ' kg';
            document.getElementById('potentialSavings').textContent = 'Ksh ' + results.potentialSavings;
            document.getElementById('insightsList').innerHTML = results.insights.join('');
            
            // Show results section
            document.getElementById('result').style.display = 'block';
        }
    }
}

// Call this when the calculator page loads
document.addEventListener('DOMContentLoaded', function() {
    loadPreviousCalculation();
});

// Add this to handle login/logout button display
document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (localStorage.getItem('isLoggedIn') === 'true') {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        loadPreviousCalculation();
    } else {
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
    }
});

// Add these constants at the top of your file
const APPLIANCE_EFFICIENCY = {
    'refrigerator': { maxHours: 24, optimalHours: 24, potentialSaving: 0.1 },
    'tv': { maxHours: 6, optimalHours: 4, potentialSaving: 0.15 },
    'ac': { maxHours: 8, optimalHours: 6, potentialSaving: 0.25 },
    'washer': { maxHours: 3, optimalHours: 2, potentialSaving: 0.2 },
    'microwave': { maxHours: 2, optimalHours: 1, potentialSaving: 0.1 },
    'iron': { maxHours: 3, optimalHours: 2, potentialSaving: 0.15 },
    'computer': { maxHours: 8, optimalHours: 6, potentialSaving: 0.15 },
    'fan': { maxHours: 12, optimalHours: 8, potentialSaving: 0.2 },
    'bulb': { maxHours: 12, optimalHours: 8, potentialSaving: 0.3 },
    'water_heater': { maxHours: 4, optimalHours: 2, potentialSaving: 0.3 }
};

function calculatePotentialSavings(appliance, hours, watts) {
    const type = appliance.toLowerCase();
    const efficiency = APPLIANCE_EFFICIENCY[type] || { maxHours: 8, optimalHours: 6, potentialSaving: 0.15 };
    let savings = 0;
    let savingTips = [];

    // Calculate based on usage hours
    if (hours > efficiency.maxHours) {
        const excessHours = hours - efficiency.maxHours;
        const dailyExcessKWh = (watts * excessHours) / 1000;
        savings += dailyExcessKWh * 30 * ELECTRICITY_RATE;
        savingTips.push(`Reduce usage time by ${excessHours} hours`);
    }

    // Calculate based on appliance efficiency
    const baselineUsage = (watts * Math.min(hours, efficiency.maxHours)) / 1000;
    const efficiencySavings = baselineUsage * efficiency.potentialSaving;
    savings += efficiencySavings * 30 * ELECTRICITY_RATE;

    // Add specific recommendations
    if (watts > 1000) {
        savingTips.push('Consider using during off-peak hours (10 PM - 6 AM)');
    }
    
    if (type === 'bulb' && watts > 60) {
        savingTips.push('Switch to LED bulbs for up to 90% energy savings');
    }

    return {
        amount: savings,
        tips: savingTips
    };
}

function generateDetailedInsights(appliances, totalMonthly, totalCost) {
    const insights = [];
    let totalPotentialSavings = 0;
    const applianceInsights = [];

    // Analyze each appliance
    appliances.forEach(appliance => {
        const name = appliance.querySelector('.appliance-name').value;
        const watts = parseFloat(appliance.querySelector('.watts').value);
        const hours = parseFloat(appliance.querySelector('.hours').value);
        
        const savings = calculatePotentialSavings(name, hours, watts);
        totalPotentialSavings += savings.amount;
        
        if (savings.amount > 0) {
            applianceInsights.push({
                name,
                savings: savings.amount,
                tips: savings.tips
            });
        }
    });

    // Usage Overview
    insights.push(`<div class="insight-category">
        <h4><i class="fas fa-chart-line"></i> Usage Overview</h4>
        <p>Monthly consumption: ${totalMonthly.toFixed(2)} kWh</p>
        <p>Current cost: KSH ${totalCost.toFixed(2)}</p>
        <p>Potential savings: KSH ${totalPotentialSavings.toFixed(2)}</p>
    </div>`);

    // Appliance-specific insights
    if (applianceInsights.length > 0) {
        insights.push(`<div class="insight-category">
            <h4><i class="fas fa-plug"></i> Appliance-Specific Recommendations</h4>
            ${applianceInsights.map(app => `
                <div class="appliance-insight">
                    <h5>${app.name}</h5>
                    <p>Potential monthly savings: KSH ${app.savings.toFixed(2)}</p>
                    <ul>
                        ${app.tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>`);
    }

    // Add general efficiency tips
    insights.push(`<div class="insight-category">
        <h4><i class="fas fa-lightbulb"></i> General Energy Saving Tips</h4>
        <ul>
            <li>Use natural light when possible</li>
            <li>Maintain your appliances regularly</li>
            <li>Unplug devices when not in use to avoid standby power consumption</li>
            <li>Consider upgrading to energy-efficient models</li>
            ${totalMonthly > 300 ? '<li>Schedule a professional energy audit</li>' : ''}
        </ul>
    </div>`);

    return insights;
}

// Add event listener for the calculate button
document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.querySelector('.btn-calculate');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateTotalSavings);
    }
});
















