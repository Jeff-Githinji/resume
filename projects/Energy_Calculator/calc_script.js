
/* Energy Saving Calculator Functionality */
document.addEventListener("DOMContentLoaded", function() {
    // Appliance array to store each added appliance data
    let appliances = [];

    // Function to add an appliance input field
    function addApplianceInput() {
        const applianceForm = document.getElementById('applianceForm');
        const newAppliance = `
            <div class="appliance">
                <div class="input-group">
                    <label>Appliance Type</label>
                    <select class="applianceType">
                        <option value="Fridge">Fridge</option>
                        <option value="TV">TV</option>
                        <option value="Microwave">Microwave</option>
                        <!-- Add more appliance options as needed -->
                    </select>
                </div>
                <div class="input-group">
                    <label>Energy Usage (kWh)</label>
                    <input type="number" class="energyUsage" placeholder="Enter energy usage">
                </div>
                <div class="input-group">
                    <label>Usage Duration (hours/day)</label>
                    <input type="number" class="usageDuration" placeholder="Enter usage duration">
                </div>
            </div>
        `;
        applianceForm.insertAdjacentHTML('beforeend', newAppliance);
    }

    // Event listener to add appliance inputs
    document.getElementById("addApplianceBtn").addEventListener("click", addApplianceInput);

    // Event listener to calculate savings
    document.getElementById("calculateSavingsBtn").addEventListener("click", function() {
        let totalUsage = 0;
        let potentialSavings = 0;
        const energyCost = parseFloat(document.getElementById('energyCost').value) || 0;

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

        // Display results
        displayResults(totalUsage, potentialSavings, energyCost);

        // Generate and display personalized insights
        generateInsights(appliances);
    });

    // Display total usage and potential savings
    function displayResults(totalUsage, potentialSavings, energyCost) {
        const resultDisplay = document.getElementById('savingsResult');
        resultDisplay.innerHTML = `<h3>Total Usage: ${totalUsage.toFixed(2)} kWh</h3>`;

        if (potentialSavings > 0) {
            const savingsAmount = (potentialSavings * energyCost).toFixed(2);
            resultDisplay.innerHTML += `<h3>Potential Savings: ${potentialSavings.toFixed(2)} kWh</h3>`;
            resultDisplay.innerHTML += `<p>This could save you approximately $${savingsAmount}.</p>`;
        }
    }

    // Generate personalized insights based on usage patterns
    function generateInsights(appliances) {
        const insightsDisplay = document.getElementById('personalizedInsights');
        insightsDisplay.innerHTML = ''; // Clear previous insights

        appliances.forEach(function(appliance) {
            const insights = [];
            const highEnergyThreshold = 100; // High usage threshold in kWh
            const longDurationThreshold = 8; // Long usage threshold in hours

            // Check for high energy usage
            if (appliance.usage > highEnergyThreshold) {
                insights.push(`Your ${appliance.type} consumes a high amount of energy. Consider a more efficient model.`);
            }

            // Check for extended usage duration
            if (appliance.duration > longDurationThreshold) {
                insights.push(`Your ${appliance.type} is used for an extended period daily. Reducing usage time could save energy.`);
            }

            // Display appliance-specific insights
            if (insights.length > 0) {
                insightsDisplay.innerHTML += `<h3>${appliance.type} Insights</h3>`;
                insights.forEach(function(insight) {
                    insightsDisplay.innerHTML += `<p>${insight}</p>`;
                });
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
















