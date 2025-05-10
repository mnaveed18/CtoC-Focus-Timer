let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isPaused = false;
let isBreakMode = false;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const stopButton = document.getElementById('stop');
const skipBreakButton = document.getElementById('skip-break');
const focusMinutesInput = document.getElementById('focus-minutes');
const breakMinutesInput = document.getElementById('break-minutes');
const modeDisplay = document.getElementById('mode-display');
const container = document.querySelector('.container');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function setTimer(minutes) {
    timeLeft = minutes * 60;
    updateDisplay();
}

function switchToBreakMode() {
    isBreakMode = true;
    modeDisplay.textContent = 'Break Time';
    container.classList.remove('focus-mode');
    container.classList.add('break-mode');
    setTimer(parseInt(breakMinutesInput.value));
    skipBreakButton.classList.remove('hidden');
}

function switchToFocusMode() {
    isBreakMode = false;
    modeDisplay.textContent = 'Focus Time';
    container.classList.remove('break-mode');
    container.classList.add('focus-mode');
    setTimer(parseInt(focusMinutesInput.value));
    skipBreakButton.classList.add('hidden');
}

function startTimer() {
    if (timerId === null) {
        timerId = setInterval(() => {
            if (!isPaused) {
                timeLeft--;
                updateDisplay();
                
                if (timeLeft === 0) {
                    clearInterval(timerId);
                    timerId = null;
                    
                    if (!isBreakMode) {
                        switchToBreakMode();
                        alert('Focus time complete! Take a break.');
                    } else {
                        switchToFocusMode();
                        alert('Break time complete! Back to work.');
                    }
                }
            }
        }, 1000);
    }
}

function pauseTimer() {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
}

function stopTimer() {
    clearInterval(timerId);
    timerId = null;
    isPaused = false;
    pauseButton.textContent = 'Pause';
    switchToFocusMode();
}

function skipBreak() {
    if (isBreakMode) {
        clearInterval(timerId);
        timerId = null;
        switchToFocusMode();
        startTimer();
    }
}

// Event Listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
stopButton.addEventListener('click', stopTimer);
skipBreakButton.addEventListener('click', skipBreak);

// Update timer when input values change
focusMinutesInput.addEventListener('change', () => {
    if (!isBreakMode && timerId === null) {
        setTimer(parseInt(focusMinutesInput.value));
    }
});

breakMinutesInput.addEventListener('change', () => {
    if (isBreakMode && timerId === null) {
        setTimer(parseInt(breakMinutesInput.value));
    }
});

// Initialize display and mode
updateDisplay();
container.classList.add('focus-mode'); 