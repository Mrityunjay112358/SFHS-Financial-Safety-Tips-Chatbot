const sendButton = document.getElementById('send-button');
const userInput = document.getElementById('user-input');
const chatbox = document.getElementById('chatbox');
const loadingSpinner = document.getElementById('loading-spinner');

sendButton.addEventListener('click', () => {
    const message = userInput.value.trim();
    if (message === '') return;

    appendMessage('User', message);
    userInput.value = '';

    loadingSpinner.style.display = 'flex';  // Show the three-dot loading spinner

    fetch('/chatbot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
        loadingSpinner.style.display = 'none';  // Hide the loading spinner
        appendMessage('Bot', data.response);
    })
    .catch(error => {
        loadingSpinner.style.display = 'none';  // Hide the loading spinner
        console.error('Error:', error);
        appendMessage('Bot', "Sorry, there was an error. Please try again.");
    });
});

function appendMessage(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender.toLowerCase());

    const messageText = document.createElement('div');
    messageText.classList.add('message-text');
    messageText.textContent = message;

    messageDiv.appendChild(messageText);
    chatbox.appendChild(messageDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}

userInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendButton.click();
    }
});
