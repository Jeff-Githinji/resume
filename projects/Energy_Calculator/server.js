const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');

const app = express();

// Add CORS configuration
app.use(cors({
    origin: '*', // Be more specific in production
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Update these with your new credentials
const accessToken = '3bb97e461044635377722a6cbb24e83f'; // Your new token
const clientId = 'jgqk3frvghhp79wg7j5e';
const clientSecret = 'b6a3b61648e04aeba4aa8a7766a3a9e2';
const deviceId = 'bf6e1ae736560f10d3ccpk';

// Add a test endpoint to verify device status
app.get('/api/device-status', async (req, res) => {
    try {
        const timestamp = Date.now().toString();
        const method = 'GET';
        const signUrl = `/v1.0/devices/${deviceId}`;  // Just get device info first
        
        const contentHash = crypto.createHash('sha256').update('').digest('hex');
        const stringToSign = [method, contentHash, '', signUrl].join('\n');
        const signStr = clientId + accessToken + timestamp + stringToSign;

        const sign = crypto
            .createHmac('sha256', clientSecret)
            .update(signStr, 'utf8')
            .digest('hex')
            .toUpperCase();

        const headers = {
            't': timestamp,
            'sign_method': 'HMAC-SHA256',
            'client_id': clientId,
            'sign': sign,
            'access_token': accessToken
        };

        console.log('Making request with headers:', headers);
        
        const url = `https://openapi.tuyaeu.com${signUrl}`;
        const response = await axios.get(url, { headers });
        
        console.log('Device Status Response:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error checking device:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        res.status(500).json({
            error: 'Failed to check device status',
            details: error.response?.data || error.message
        });
    }
});

app.get('/api/power-data', async (req, res) => {
    try {
        const timestamp = Date.now().toString();
        const method = 'GET';
        const signUrl = `/v1.0/devices/${deviceId}/status`;
        
        const contentHash = crypto.createHash('sha256').update('').digest('hex');
        const stringToSign = [method, contentHash, '', signUrl].join('\n');
        const signStr = clientId + accessToken + timestamp + stringToSign;

        const sign = crypto
            .createHmac('sha256', clientSecret)
            .update(signStr, 'utf8')
            .digest('hex')
            .toUpperCase();

        const headers = {
            't': timestamp,
            'sign_method': 'HMAC-SHA256',
            'client_id': clientId,
            'sign': sign,
            'access_token': accessToken
        };

        const url = `https://openapi.tuyaeu.com${signUrl}`;
        const response = await axios.get(url, { headers });
        const statusArray = response.data.result;

        // Log each status item
        console.log('All status items:');
        statusArray.forEach(item => {
            console.log(`${item.code}: ${item.value}`);
        });

        // Find specific values with detailed logging
        const findValue = (code) => {
            const item = statusArray.find(item => item.code === code);
            console.log(`Looking for ${code}:`, item);
            return item ? item.value : null;
        };

        // Get raw values with null checks
        const rawVoltage = findValue('cur_voltage');
        const rawCurrent = findValue('cur_current');
        const rawPower = findValue('cur_power');
        const rawEnergy = findValue('add_ele');
        const isOn = findValue('switch_1');

        console.log('Raw values found:', {
            voltage: rawVoltage,
            current: rawCurrent,
            power: rawPower,
            energy: rawEnergy,
            isOn: isOn
        });

        // Convert values with null checks
        const powerData = {
            timestamp: new Date().toISOString(),
            voltage: rawVoltage ? rawVoltage / 10 : 0,
            current: rawCurrent ? rawCurrent / 1000 : 0,
            power: rawPower ? rawPower / 10 : 0,
            totalEnergy: rawEnergy || 0,
            isOn: isOn === true,
            status: isOn ? 'Device online' : 'Device offline'
        };

        // Log final processed data
        console.log('Final processed data:', powerData);

        res.json(powerData);

    } catch (error) {
        console.error('Detailed Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        res.status(500).json({ 
            error: 'Failed to fetch power data',
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Test the API at: http://localhost:${PORT}/api/power-data`);
}); 