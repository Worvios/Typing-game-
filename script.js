//const RANDOM_QUOTE_API_URL = 'https://zenquotes.io/api/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');
// const RANDOM_QUOTE_API_URL = 'https://zenquotes.io/api/random'; // Original
const PROXY_URL = 'https://cors-anywhere.herokuapp.com/'; // Example proxy
const RANDOM_QUOTE_API_URL = PROXY_URL + 'https://zenquotes.io/api/random'; // Proxied URL


// Variable to hold the timer interval ID
let timerInterval = null;
let startTime;

quoteInputElement.addEventListener('paste', (e) => {
    e.preventDefault(); // Prevent pasting
});

quoteInputElement.addEventListener('input', () => {
    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const arrayValue = quoteInputElement.value.split('');

    let correct = true;
    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        if (character == null) {
            characterSpan.classList.remove('correct');
            characterSpan.classList.remove('incorrect');
            correct = false;
        } else if (character === characterSpan.innerText) {
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
        } else {
            characterSpan.classList.remove('correct');
            characterSpan.classList.add('incorrect');
            correct = false;
        }
    });

    if (correct) {
        renderNewQuote(); // Load the next quote if typed correctly
    }
});

function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // --- FIX 1: Access the quote text correctly ---
            if (data && data.length > 0 && data[0].q) {
                return data[0].q; // Get the quote text from the 'q' property of the first object
            } else {
                // Provide a fallback quote if API fails or returns unexpected data
                console.error("Failed to fetch a proper quote, using fallback.");
                return "Could not fetch quote. Please try again.";
            }
        })
        .catch(error => {
            console.error("Error fetching random quote:", error);
            // Provide a fallback quote on fetch error
             quoteDisplayElement.innerText = "Error loading quote. Check console."; // Display error to user
            return null; // Return null to indicate failure
        });
}

async function renderNewQuote() {
    // Optional: Disable input while loading
    quoteInputElement.disabled = true;
    quoteDisplayElement.innerText = "Loading..."; // Indicate loading

    const quote = await getRandomQuote();

    // Only proceed if a quote was successfully fetched
    if (quote) {
        quoteDisplayElement.innerHTML = ''; // Clear previous quote or loading message
        quote.split('').forEach(character => {
            const characterSpan = document.createElement('span');
            characterSpan.innerText = character;
            quoteDisplayElement.appendChild(characterSpan);
        });
        quoteInputElement.value = null; // Clear the input field
        startTimer(); // Start the timer for the new quote
    } else {
        // Handle the case where quote fetching failed (error already logged)
        // Keep input disabled or provide further instructions
        // For simplicity, we'll just leave the error message in quoteDisplayElement
    }
     // Re-enable input after loading is complete (or failed)
    quoteInputElement.disabled = false;
    if (quote) { // Only focus if a quote was loaded successfully
         quoteInputElement.focus();
    }
}


function startTimer() {
    // --- FIX 2: Clear any existing timer interval ---
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerElement.innerText = 0;
    startTime = new Date();
    // Store the new interval ID
    timerInterval = setInterval(() => {
        // Ensure timerElement is used, not the global 'timer' which might be undefined
        timerElement.innerText = getTimerTime();
    }, 1000);
}

function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000);
}

// Initial call to load the first quote when the page loads
renderNewQuote();
