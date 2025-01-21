document.addEventListener('DOMContentLoaded', () => {
    const customUrlCheckbox = document.getElementById('customUrlCheckbox');
    const customUrlInput = document.getElementById('customUrlInput');

    // Show custom URL input if checkbox is checked
    customUrlCheckbox.addEventListener('change', () => {
        customUrlInput.style.display = customUrlCheckbox.checked ? 'block' : 'none';
    });

    document.getElementById('shortenBtn').addEventListener('click', async () => {
        const urlInput = document.getElementById('urlInput').value;
        const isCustomUrlChecked = customUrlCheckbox.checked; // Renamed for clarity
        const customUrlValue = customUrlInput.value.trim(); // Trim any extra whitespace

        let shortUrl = isCustomUrlChecked ? customUrlValue : ''; // Use the custom URL if checked

        const response = await fetch('/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ originalUrl: urlInput, customUrl: shortUrl }),
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('result').innerHTML = `Shortened URL: <a href="${data.shortUrl}">${data.shortUrl}</a>`;
        } else {
            document.getElementById('result').innerText = 'Error: ' + data;
        }
    });
});

