const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(cors());

// Tuya API credentials
const accessToken = 'b9c64e3776b70c531def439d0ffcb691';
const clientId = 'jgqk3frvghhp79wg7j5e';
const clientSecret = 'b6a3b61648e04aeba4aa8a7766a3a9e2';
const deviceId = 'bf6e1ae736560f10d3ccpk';

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
        const data = response.data.result;

        const powerData = {
            timestamp: new Date().toISOString(),
            voltage: (data.find(d => d.code === 'cur_voltage').value / 10).toFixed(1),
            current: (data.find(d => d.code === 'cur_current').value / 1000).toFixed(3),
            power: (data.find(d => d.code === 'cur_power').value / 10).toFixed(1),
            totalEnergy: data.find(d => d.code === 'add_ele').value,
            isOn: data.find(d => d.code === 'switch_1').value
        };

        res.json(powerData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch power data' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 