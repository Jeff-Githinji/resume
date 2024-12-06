const axios = require('axios');
const crypto = require('crypto');

// Your Tuya credentials
const clientId = 'jgqk3frvghhp79wg7j5e';
const clientSecret = 'b6a3b61648e04aeba4aa8a7766a3a9e2';

// Generate timestamp
const timestamp = Date.now().toString();

// Prepare the signature components
const method = 'GET';
const signUrl = '/v1.0/token?grant_type=1';
const contentHash = crypto.createHash('sha256').update('').digest('hex');
const stringToSign = [method, contentHash, '', signUrl].join('\n');
const signStr = clientId + timestamp + stringToSign;

// Generate the signature
async function encryptStr(str, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(str, 'utf8')
    .digest('hex')
    .toUpperCase();
}

// Make the request
async function getToken() {
  const headers = {
    t: timestamp,
    sign_method: 'HMAC-SHA256',
    client_id: clientId,
    sign: await encryptStr(signStr, clientSecret)
  };

  try {
    const response = await axios.get('https://openapi.tuyaeu.com/v1.0/token?grant_type=1', { headers });
    console.log('Full API Response:', JSON.stringify(response.data, null, 2));
    return response.data.result.access_token;
  } catch (error) {
    console.error('Error Details:', error.response?.data || error.message);
    throw error;
  }
}

// Execute the request
getToken()
  .then(token => {
    console.log('Access Token:', token);
  })
  .catch(error => {
    console.error('Failed to get token:', error.message);
  });

