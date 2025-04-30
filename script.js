const RANDOM_QUOTE_API_URL = 'https://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');

let timerInterval = null;
let startTime;

// Prevent pasting in the input field
quoteInputElement.addEventListener('paste', (e) => {
    e.preventDefault();
});

// Check input against displayed quote
quoteInputElement.addEventListener('input', () => {
    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const arrayValue = quoteInputElement.value.split('');
    let correct = true;

    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        if (character == null) {
            characterSpan.classList.remove('correct', 'incorrect');
            correct = false;
        } else if (character === characterSpan.innerText) {
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
        } else {
            characterSpan.classList.add('incorrect');
            characterSpan.classList.remove('correct');
            correct = false;
        }
    });

    if (correct) {
        renderNewQuote();
    }
});

async function getRandomQuote() {
    try {
        const response = await fetch('https://type.fit/api/quotes');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const randomQuote = data[Math.floor(Math.random() * data.length)];
        return randomQuote.text || "The only way to do great work is to love what you do.";
    } catch (error) {
        console.error("Error fetching quote:", error);
        quoteDisplayElement.innerText = "Failed to load quote. Please try again.";
        return null;
    }
}

async function renderNewQuote() {
    quoteInputElement.disabled = true;
    quoteDisplayElement.innerText = "Loading...";

    const quote = await getRandomQuote();
    if (quote) {
        quoteDisplayElement.innerHTML = '';
        quote.split('').forEach(character => {
            const characterSpan = document.createElement('span');
            characterSpan.innerText = character;
            quoteDisplayElement.appendChild(characterSpan);
        });
        quoteInputElement.value = '';
        startTimer();
        quoteInputElement.disabled = false;
        quoteInputElement.focus();
    } else {
        quoteInputElement.disabled = false;
    }
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerElement.innerText = 0;
    startTime = new Date();
    timerInterval = setInterval(() => {
        timerElement.innerText = getTimerTime();
    }, 1000);
}

function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000);
}

// Load the first quote
renderNewQuote();
