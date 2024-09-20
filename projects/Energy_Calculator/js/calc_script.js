
/* calculator functionality */
document.addEventListener("DOMContentLoaded", function() {
    var appliances = [];

    // Function to add an appliance input field
    function addApplianceInput() {
        var applianceForm = document.getElementById('applianceForm');
        var newAppliance = `
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

    // Add event listener to the "Add Appliance" button
    document.getElementById("addApplianceBtn").addEventListener("click", function() {
        addApplianceInput();
    });


    // Add event listener to the "Calculate Savings" button
    document.getElementById("calculateSavingsBtn").addEventListener("click", function() {
        var totalUsage = 0;
        var potentialSavings = 0;

        // Reset appliances array
        appliances = [];

        // Get input values for each appliance
        var applianceInputs = document.querySelectorAll('.appliance');
        applianceInputs.forEach(function(input) {
            var type = input.querySelector('.applianceType').value;
            var usage = parseFloat(input.querySelector('.energyUsage').value);
            var duration = parseFloat(input.querySelector('.usageDuration').value);

            if (!isNaN(usage) && !isNaN(duration)) {
                totalUsage += usage * duration;
                appliances.push({type: type, usage: usage, duration: duration});
            }
        });

        // Calculate potential savings
        appliances.forEach(function(appliance) {
            if (appliance.duration > 8) {
                var savings = (appliance.duration - 8) * appliance.usage; // Assuming 8 hours is optimal
                potentialSavings += savings;
            }
        });

        // Display results
        var resultDisplay = document.getElementById('savingsResult');
        resultDisplay.innerHTML = "<h3>Total Usage: " + totalUsage.toFixed(2) + " kWh</h3>";

        if (potentialSavings > 0) {
            resultDisplay.innerHTML += "<h3>Potential Savings: " + potentialSavings.toFixed(2) + " kWh</h3>";
            resultDisplay.innerHTML += "<p>This could save you approximately $" + (potentialSavings * parseFloat(document.getElementById('energyCost').value)).toFixed(2) + ".</p>"; // Calculation based on energy cost
        }

        // Generate personalized insights
        generateInsights(appliances);

        // Update the display of insights container after calculations
        updateInsightsDisplay(true); // Show the insights container
    });

    // Function to generate personalized insights
    function generateInsights(appliances) {
        var insightsDisplay = document.getElementById('personalizedInsights');
        insightsDisplay.innerHTML = ''; // Clear previous insights

        // Define thresholds for energy usage and usage duration
        var highEnergyThreshold = 100; // kWh
        var longDurationThreshold = 8; // hours

        // Add heading to the insights container
        var heading = document.createElement('h2');
        heading.textContent = "Your Personal Insights";
        insightsDisplay.appendChild(heading);

        appliances.forEach(function(appliance) {
            var insights = [];

            // Check for high energy usage
            if (appliance.usage > highEnergyThreshold) {
                insights.push("Your " + appliance.type + " consumes a high amount of energy. Consider replacing it with a more energy-efficient model.");
            }

            // Check for long usage duration
            if (appliance.duration > longDurationThreshold) {
                insights.push("You're using your " + appliance.type + " for a long duration each day. Reducing usage time can lead to significant energy savings.");
            }

            // Display insights for this appliance
            if (insights.length > 0) {
                insightsDisplay.innerHTML += "<h3>" + appliance.type + " Insights</h3>";
                insights.forEach(function(insight) {
                    insightsDisplay.innerHTML += "<p>" + insight + "</p>";
                });
            }
        });
    }

    // Update the display of insights container after calculations
    function updateInsightsDisplay(show) {
        var insightsContainer = document.getElementById('insightsContainer');
        insightsContainer.style.display = show ? 'block' : 'none';
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // Get the current URL
    var currentUrl = window.location.href;

    // Get all navigation links
    var navLinks = document.querySelectorAll("nav a");

    // Loop through each navigation link
    navLinks.forEach(function(link) {
        // Compare the href attribute of the link with the current URL
        if (link.href === currentUrl) {
            // Add the active class to the link if it matches the current URL
            link.classList.add("active");
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const contactForm = document.getElementById("contactForm");

    contactForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get form data
        const formData = new FormData(contactForm);

        // Create a URL-encoded string of form data
        const encodedFormData = new URLSearchParams(formData).toString();

        // Send form data to PHP script using fetch API
        fetch("process_contact_form.php", {
            method: "POST",
            body: encodedFormData,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        .then(response => {
            if (response.ok) {
                // Form submission successful
                console.log("Form submitted successfully!");
                // Optionally, reset the form after successful submission
                contactForm.reset();
            } else {
                // Form submission failed
                console.error("Form submission failed!");
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    });
});















