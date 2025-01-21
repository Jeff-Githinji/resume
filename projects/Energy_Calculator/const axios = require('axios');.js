const axios = require('axios');

// Your API endpoint (replace with the actual endpoint for your plug's data)
const apiUrl = 'https://api.smartlife.com/v1/device/status'; // example endpoint, replace with the real one

// Your authorization key (replace with your actual authorization token)
const authKey = 'YOUR_AUTHORIZATION_KEY'; 

// Make the API request
axios.get(apiUrl, {
    headers: {
        'Authorization': `Bearer ${authKey}`,
        'Content-Type': 'application/json'
    }
})
.then(response => {
    // Handle the API response here
    console.log('Data from Smart Plug:', response.data);
})
.catch(error => {
    // Handle any errors
    console.error('Error fetching data:', error);
});
