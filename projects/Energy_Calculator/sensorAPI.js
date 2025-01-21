async function fetchPowerData() {
    try {
        console.log('Fetching power data...');
        const response = await fetch('http://localhost:3001/api/power-data');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received power data:', data);  // Debug log
        
        if (data.error) {
            console.error('API Error:', data.error);
            return;
        }

        // Update the display with new values
        document.getElementById('voltage').textContent = data.voltage.toFixed(1) + ' V';
        document.getElementById('current').textContent = data.current.toFixed(3) + ' A';
        document.getElementById('power').textContent = data.power.toFixed(1) + ' W';
        document.getElementById('energy').textContent = data.totalEnergy + ' kWh';
        document.getElementById('deviceStatus').textContent = data.status;
        
    } catch (error) {
        console.error('Error fetching power data:', error);
    }
}

// Fetch data every 30 seconds
setInterval(fetchPowerData, 30000);
fetchPowerData(); // Initial fetch
