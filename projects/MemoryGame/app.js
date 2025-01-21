const gameBoard = document.getElementById("game-board");
const cardValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];  // You can replace these with images if you prefer

let cards = [];
let flippedCards = [];
let matchedCards = 0;
let moves = 0;
let timer = null;
let seconds = 0;
let bestScore = localStorage.getItem('bestScore') || Infinity;

// Create a deck by duplicating the card values and shuffling
function createDeck() {
    const deck = [...cardValues, ...cardValues];
    return shuffle(deck);
}

// Shuffle the cards
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Create and display the cards
function displayCards() {
    const deck = createDeck();
    gameBoard.innerHTML = "";

    deck.forEach((value, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.value = value;
        card.addEventListener("click", flipCard);
        gameBoard.appendChild(card);
        cards.push(card);
    });

    // Reset stats only
    moves = 0;
    seconds = 0;
    document.getElementById('moves').textContent = moves;
    document.getElementById('timer').textContent = '0:00';
}

// Flip the card and check for matches
function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains("flipped") && !this.classList.contains("matched")) {
        // Start timer on first move
        if (moves === 0 && !timer) {
            timer = setInterval(updateTimer, 1000);
        }

        this.classList.add("flipped");
        this.textContent = this.dataset.value;
        flippedCards.push(this);
        
        moves++;
        document.getElementById('moves').textContent = moves;

        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }
}

// Check if the flipped cards match
function checkForMatch() {
    const [firstCard, secondCard] = flippedCards;

    if (firstCard.dataset.value === secondCard.dataset.value) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        matchedCards++;

        // Check if the game is over
        if (matchedCards === cardValues.length) {
            clearInterval(timer);
            
            // Update best score
            if (moves < bestScore) {
                bestScore = moves;
                localStorage.setItem('bestScore', moves);
                document.getElementById('best-score').textContent = moves;
            }
            
            setTimeout(() => {
                alert(`Congratulations! You've won in ${moves} moves and ${seconds} seconds!`);
                resetGame();
            }, 500);
        }

        flippedCards = [];
    } else {
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            firstCard.textContent = "";
            secondCard.textContent = "";
            flippedCards = [];
        }, 1000);
    }
}

// Reset the game
function resetGame() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    cards.forEach(card => {
        card.classList.remove("flipped", "matched");
        card.textContent = "";
    });
    matchedCards = 0;
    flippedCards = [];
    displayCards();
}

// Add event listener for reset button
document.getElementById('reset-btn').addEventListener('click', resetGame);

// Add timer function
function updateTimer() {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    document.getElementById('timer').textContent = 
        `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Initialize best score display
document.getElementById('best-score').textContent = 
    bestScore === Infinity ? '-' : bestScore;

// Initialize the game
displayCards();
