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

            // Calculate potential savings assuming 8 hours optimal usage
            appliances.forEach(function(appliance) {
                if (appliance.duration > 8) {
                    const excessUsage = (appliance.duration - 8) * appliance.usage;
                    potentialSavings += excessUsage;
                }
            });

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

window.calculateTotalSavings = function() {
    const appliances = document.getElementsByClassName('appliance-entry');
    const rate = parseFloat(document.getElementById('rate').value) || 0;
    const errorMessage = document.getElementById('errorMessage');
    
    // Validation
    if (!rate) {
        errorMessage.classList.add('show');
        errorMessage.querySelector('span').textContent = 'Please enter the electricity rate';
        return;
    }

    let hasEmptyFields = false;
    Array.from(appliances).forEach(appliance => {
        const name = appliance.querySelector('.appliance-name').value;
        const watts = appliance.querySelector('.watts').value;
        const hours = appliance.querySelector('.hours').value;
        
        if (!name || !watts || !hours) {
            hasEmptyFields = true;
        }
    });

    if (hasEmptyFields) {
        errorMessage.classList.add('show');
        errorMessage.querySelector('span').textContent = 'Please fill in all appliance details';
        return;
    }

    // Hide error message if validation passes
    errorMessage.classList.remove('show');

    // Calculate totals
    let totalDaily = 0;
    let totalMonthly = 0;
    let totalCost = 0;
    let totalCO2 = 0;
    const insights = [];

    Array.from(appliances).forEach(appliance => {
        const name = appliance.querySelector('.appliance-name').value;
        const watts = parseFloat(appliance.querySelector('.watts').value);
        const hours = parseFloat(appliance.querySelector('.hours').value);
        
        const dailyKWh = (watts * hours) / 1000;
        const monthlyKWh = dailyKWh * 30;
        const monthlyCost = monthlyKWh * rate;
        
        totalDaily += dailyKWh;
        totalMonthly += monthlyKWh;
        totalCost += monthlyCost;
        totalCO2 += monthlyKWh * 0.5;

        // Generate insights
        if (hours > 8) {
            insights.push(`<li><i class="fas fa-exclamation-triangle"></i> Your ${name} runs for ${hours} hours. Consider reducing usage time to save energy.</li>`);
        }
        
        if (watts > 1000) {
            insights.push(`<li><i class="fas fa-plug"></i> ${name} is a high-power appliance. Using it during off-peak hours could reduce costs.</li>`);
        }
    });

    // Calculate potential savings (20% reduction)
    const potentialMonthlySavings = totalCost * 0.2;

    // Update the display
    document.getElementById('dailyUsage').textContent = totalDaily.toFixed(2) + ' kWh';
    document.getElementById('monthlyUsage').textContent = totalMonthly.toFixed(2) + ' kWh';
    document.getElementById('monthlyCost').textContent = 'Ksh ' + totalCost.toFixed(2);
    document.getElementById('co2Impact').textContent = totalCO2.toFixed(2) + ' kg';
    document.getElementById('potentialSavings').textContent = 
        `Ksh ${potentialMonthlySavings.toFixed(2)} (20% reduction in usage)`;
    document.getElementById('insightsList').innerHTML = insights.join('');

    // Show results
    document.getElementById('result').style.display = 'block';

    // Save results if user is logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        const userEmail = localStorage.getItem('userEmail');
        const results = {
            dailyUsage: totalDaily.toFixed(2),
            monthlyUsage: totalMonthly.toFixed(2),
            monthlyCost: totalCost.toFixed(2),
            co2Impact: totalCO2.toFixed(2),
            potentialSavings: potentialMonthlySavings.toFixed(2),
            insights: insights,
            rate: rate,
            appliances: Array.from(appliances).map(appliance => ({
                name: appliance.querySelector('.appliance-name').value,
                watts: appliance.querySelector('.watts').value,
                hours: appliance.querySelector('.hours').value
            }))
        };
        
        // Save calculations
        localStorage.setItem(`calculationResults_${userEmail}`, JSON.stringify(results));
        console.log('Calculations saved for:', userEmail);
    }
};

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
















