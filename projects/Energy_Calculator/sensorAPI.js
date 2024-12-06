// Function to update the UI with power data
function updateUI(powerData) {
    document.getElementById('voltage').textContent = powerData.voltage + 'V';
    document.getElementById('current').textContent = powerData.current + 'A';
    document.getElementById('power').textContent = powerData.power + 'W';
    document.getElementById('totalEnergy').textContent = powerData.totalEnergy + 'kWh';
    
    // Calculate costs
    const costs = calculateCosts(parseFloat(powerData.power));
    document.getElementById('hourlyCost').textContent = `KSH ${costs.hourly}`;
    document.getElementById('dailyCost').textContent = `KSH ${costs.daily}`;
    document.getElementById('monthlyCost').textContent = `KSH ${costs.monthly}`;

    // Analyze usage
    const usage = analyzeUsage(parseFloat(powerData.power));
    document.getElementById('powerStatus').textContent = powerData.isOn ? 'Active' : 'Standby';
    document.getElementById('usageLevel').textContent = usage.level;
    document.getElementById('usageLevel').className = usage.class;
    document.getElementById('efficiencyRating').textContent = usage.efficiency;

    // Generate recommendations
    const recommendations = generateRecommendations(powerData, usage);
    const recommendationsHtml = recommendations.length > 0 
        ? recommendations.map(rec => `<div class="recommendation-item">${rec}</div>`).join('')
        : '<div class="recommendation-item">Power usage is optimal</div>';
    document.getElementById('recommendations').innerHTML = recommendationsHtml;

    const deviceStatus = document.getElementById('deviceStatus');
    deviceStatus.textContent = `Device Status: ${powerData.isOn ? 'ON' : 'OFF'}`;
    deviceStatus.className = `alert ${powerData.isOn ? 'alert-success' : 'alert-warning'}`;
    
    document.getElementById('lastUpdate').textContent = new Date().toLocaleString();
}

// Function to fetch power data from backend
async function fetchPowerData() {
    try {
        const response = await fetch('http://localhost:3000/api/power-data');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        console.error('Error fetching power data:', error);
        document.getElementById('deviceStatus').textContent = 'Error: Could not fetch device data';
        document.getElementById('deviceStatus').className = 'alert alert-danger';
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initial fetch
    fetchPowerData();
    
    // Set up automatic refresh every 30 seconds
    setInterval(fetchPowerData, 30000);
    
    // Add click handler for refresh button
    const refreshButton = document.querySelector('.btn-info');
    if (refreshButton) {
        refreshButton.addEventListener('click', fetchPowerData);
    }
});

// Constants for calculations
const ELECTRICITY_RATE = 25.40; // Cost per kWh in KSH
const HIGH_POWER_THRESHOLD = 1000; // 1000W
const MODERATE_POWER_THRESHOLD = 500; // 500W

function calculateCosts(power) {
    const hourly = (power * ELECTRICITY_RATE) / 1000;
    const daily = hourly * 24;
    const monthly = daily * 30;

    return {
        hourly: hourly.toFixed(2),
        daily: daily.toFixed(2),
        monthly: monthly.toFixed(2)
    };
}

function analyzeUsage(power) {
    if (power >= HIGH_POWER_THRESHOLD) {
        return {
            level: 'High',
            class: 'high-usage',
            efficiency: 'Poor'
        };
    } else if (power >= MODERATE_POWER_THRESHOLD) {
        return {
            level: 'Moderate',
            class: 'moderate-usage',
            efficiency: 'Fair'
        };
    } else {
        return {
            level: 'Low',
            class: 'efficient-usage',
            efficiency: 'Good'
        };
    }
}

function generateRecommendations(powerData, usage) {
    const recommendations = [];

    if (usage.level === 'High') {
        recommendations.push('Consider reducing usage during peak hours');
        recommendations.push('Check for energy-intensive appliances that might be malfunctioning');
    }

    if (powerData.isOn && powerData.power < 10) {
        recommendations.push('Device is drawing standby power. Consider turning it off completely');
    }

    if (usage.level === 'Moderate') {
        recommendations.push('Monitor usage patterns to identify potential energy savings');
    }

    return recommendations;
}
