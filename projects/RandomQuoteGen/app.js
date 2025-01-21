const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const generateButton = document.getElementById("generate-button");
const categorySelect = document.getElementById("category-select");

// Update the category options to match Quotable API's actual tags
categorySelect.innerHTML = `
    <option value="">Any Category</option>
    <option value="famous-quotes">Famous Quotes</option>
    <option value="technology">Technology</option>
    <option value="wisdom">Wisdom</option>
    <option value="love">Love</option>
    <option value="life">Life</option>
    <option value="friendship">Friendship</option>
`;

let currentQuote = "";
let currentAuthor = "";

async function generateRandomQuote() {
    try {
        // Show loading state
        generateButton.disabled = true;

        // Get selected category
        const category = categorySelect.value;
        const url = `https://api.quotable.io/random${category ? `?tags=${category}` : ''}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Update the quote immediately
        currentQuote = data.content;
        currentAuthor = data.author;
        quoteText.textContent = `"${currentQuote}"`;
        authorText.textContent = `- ${currentAuthor}`;
        
        // Enable the button
        generateButton.disabled = false;

    } catch (error) {
        console.error("Error fetching quote:", error);
        quoteText.textContent = "Sorry, something went wrong. Please try again later.";
        authorText.textContent = "";
        generateButton.disabled = false;
    }
}

function shareQuote(platform) {
    const quote = `${currentQuote} - ${currentAuthor}`;
    
    if (platform === 'twitter') {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quote)}`;
        window.open(twitterUrl, '_blank');
    } else if (platform === 'copy') {
        navigator.clipboard.writeText(quote)
            .then(() => alert('Quote copied to clipboard!'))
            .catch(err => console.error('Failed to copy quote:', err));
    }
}

generateButton.addEventListener("click", generateRandomQuote);
generateRandomQuote();