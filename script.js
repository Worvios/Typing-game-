// --- Use the Quotable API ---
const RANDOM_QUOTE_API_URL = 'https://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');

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
    // Fetch from the Quotable API
    return fetch(RANDOM_QUOTE_API_URL)
        .then(response => {
            if (!response.ok) {
                // Throw an error with the status code if response is not OK
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // --- FIX: Access the quote text correctly from Quotable's response ---
            if (data && data.content) {
                return data.content; // Get the quote text from the 'content' property
            } else {
                // Provide a fallback quote if API returns unexpected data
                console.error("API did not return expected data format.");
                return "Could not fetch a valid quote. Please try again.";
            }
        })
        .catch(error => {
            console.error("Error fetching random quote:", error);
            // Display error to user and return null to indicate failure
            quoteDisplayElement.innerText = `Error: ${error.message}. Check console.`;
            return null;
        });
}

async function renderNewQuote() {
    // Optional: Disable input while loading and provide feedback
    quoteInputElement.disabled = true;
    quoteDisplayElement.innerText = "Loading..."; // Indicate loading

    const quote = await getRandomQuote();

    // Only proceed if a quote was successfully fetched
    if (quote) {
        quoteDisplayElement.innerHTML = ''; // Clear previous quote or loading/error message
        quote.split('').forEach(character => {
            const characterSpan = document.createElement('span');
            characterSpan.innerText = character;
            quoteDisplayElement.appendChild(characterSpan);
        });
        quoteInputElement.value = null; // Clear the input field
        startTimer(); // Start the timer for the new quote
    } else {
        // Handle the case where quote fetching failed (error already logged and message shown)
        // Keep input disabled or provide further instructions if desired
    }
     // Re-enable input after loading is complete (or failed)
    quoteInputElement.disabled = false;
    if (quote) { // Only focus if a quote was loaded successfully
         quoteInputElement.focus();
    }
}


function startTimer() {
    // Clear any existing timer interval
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerElement.innerText = 0;
    startTime = new Date();
    // Store the new interval ID
    timerInterval = setInterval(() => {
        timerElement.innerText = getTimerTime();
    }, 1000);
}

function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000);
}

// Initial call to load the first quote when the page loads
renderNewQuote();

