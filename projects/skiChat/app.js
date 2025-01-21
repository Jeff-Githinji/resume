// Function to send a message
function sendMessage() {
    const messageInput = document.getElementById('message');
    const messageText = messageInput.value.trim();
    if (messageText === "") return;  // Don't send empty messages

    // Create message object
    const message = {
        id: Date.now(),
        text: messageText,
        sender: 'You',
        timestamp: new Date().toLocaleTimeString(),
        status: 'sent'
    };

    // Create the message element with enhanced structure
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'sent');
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="sender">${message.sender}</span>
            <span class="timestamp">${message.timestamp}</span>
        </div>
        <div class="message-content">${message.text}</div>
        <div class="message-footer">
            <span class="status">${message.status}</span>
            <button class="delete-btn" onclick="deleteMessage(${message.id})">×</button>
        </div>
    `;
    messageDiv.dataset.messageId = message.id;

    // Save to local storage
    saveMessage(message);

    // Append the message to the chat box
    const chatBox = document.getElementById('chat-box');
    chatBox.appendChild(messageDiv);

    // Scroll to the bottom of the chat box
    chatBox.scrollTop = chatBox.scrollHeight;

    // Clear the input field
    messageInput.value = "";

    // Simulate a response with enhanced structure
    getAIResponse(messageText).then(aiResponse => {
        const response = {
            id: Date.now(),
            text: aiResponse,
            sender: 'Bot',
            timestamp: new Date().toLocaleTimeString(),
            status: 'delivered'
        };

        const responseDiv = document.createElement('div');
        responseDiv.classList.add('message', 'received');
        responseDiv.innerHTML = `
            <div class="message-header">
                <span class="sender">${response.sender}</span>
                <span class="timestamp">${response.timestamp}</span>
            </div>
            <div class="message-content">${response.text}</div>
        `;
        responseDiv.dataset.messageId = response.id;

        saveMessage(response);
        chatBox.appendChild(responseDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}

// Allow pressing Enter to send a message
document.getElementById('message').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Add these new functions
function saveMessage(message) {
    let messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    messages.push(message);
    localStorage.setItem('chatMessages', JSON.stringify(messages));
}

function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    const chatBox = document.getElementById('chat-box');
    
    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', message.sender === 'You' ? 'sent' : 'received');
        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="sender">${message.sender}</span>
                <span class="timestamp">${message.timestamp}</span>
            </div>
            <div class="message-content">${message.text}</div>
            ${message.sender === 'You' ? `
            <div class="message-footer">
                <span class="status">${message.status}</span>
                <button class="delete-btn" onclick="deleteMessage(${message.id})">×</button>
            </div>
            ` : ''}
        `;
        messageDiv.dataset.messageId = message.id;
        chatBox.appendChild(messageDiv);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
}

function deleteMessage(messageId) {
    let messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    messages = messages.filter(message => message.id !== messageId);
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    
    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
    if (messageElement) {
        messageElement.remove();
    }
}

// Load messages when page loads
document.addEventListener('DOMContentLoaded', loadMessages);

const NINJA_API_KEY = 'H2SnAvqVIeUNWKyNx21csg==IcjkkJ5oFvs5KqL8'; 

// Add reset function
function resetMessages() {
    localStorage.removeItem('chatMessages');
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = '';
}

// Update getAIResponse function
async function getAIResponse(userMessage) {
    const responseTypes = ['joke', 'fact', 'quote', 'riddle'];
    const type = responseTypes[Math.floor(Math.random() * responseTypes.length)];
    
    try {
        const response = await fetch(`https://api.api-ninjas.com/v1/${type}`, {
            headers: {
                'X-Api-Key': NINJA_API_KEY
            }
        });
        
        const data = await response.json();
        
        switch(type) {
            case 'joke':
                return data.joke;
            case 'fact':
                return data.fact;
            case 'quote':
                return `"${data.quote}" - ${data.author}`;
            case 'riddle':
                return `Riddle: ${data.question}\n\nAnswer: ${data.answer}`;
            default:
                return "Here's something interesting...";
        }
    } catch (error) {
        console.error('Error:', error);
        return "I'm having trouble thinking of a response right now!";
    }
}

// Add reset button to the page
document.addEventListener('DOMContentLoaded', () => {
    loadMessages();
    
    // Add reset button
    const inputArea = document.querySelector('.input-area');
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Chat';
    resetButton.onclick = resetMessages;
    resetButton.classList.add('reset-button');
    inputArea.appendChild(resetButton);
});
