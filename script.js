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
const settingsModal = document.getElementById('settings-modal');
const settingsBtn = document.getElementById('settings-btn');
const closeSettingsBtn = document.getElementById('close-settings');
const saveSettingsBtn = document.getElementById('save-settings');
const timerChime = document.getElementById('timer-chime');

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

function notifyTimerEnd() {
    // Play the chime sound
    timerChime.play();
    
    // Force window to front
    window.focus();
    
    // Try to bring window to front using multiple methods
    if (window.blur) {
        window.blur();
    }
    window.focus();
    
    // Create a visual notification effect
    const notification = document.createElement('div');
    notification.className = 'timer-notification';
    notification.textContent = isBreakMode ? 'Break Time is Over!' : 'Focus Time Complete!';
    document.body.appendChild(notification);
    
    // Remove the notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
    
    // Flash the window title
    let flashCount = 0;
    const originalTitle = document.title;
    const flashInterval = setInterval(() => {
        document.title = flashCount % 2 === 0 ? 
            (isBreakMode ? '⏰ Break Time is Over!' : '⏰ Focus Time Complete!') : 
            originalTitle;
        flashCount++;
        if (flashCount >= 6) { // Flash 3 times
            clearInterval(flashInterval);
            document.title = originalTitle;
        }
    }, 500);
    
    // Request browser notification if window is hidden
    if (document.hidden) {
        if ("Notification" in window) {
            Notification.requestPermission().then(function(permission) {
                if (permission === "granted") {
                    new Notification("Timer Complete!", {
                        body: isBreakMode ? "Break time is over! Back to work!" : "Focus time complete! Take a break!",
                        icon: "https://example.com/icon.png"
                    });
                }
            });
        }
    }
    
    // Try to maximize the window if possible
    try {
        if (window.screen && window.screen.width) {
            window.moveTo(0, 0);
            window.resizeTo(window.screen.width, window.screen.height);
        }
    } catch (e) {
        console.log('Window maximize not supported');
    }
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
                        notifyTimerEnd();
                        switchToBreakMode();
                    } else {
                        notifyTimerEnd();
                        switchToFocusMode();
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

// Settings Modal Functions
function openSettings() {
    settingsModal.classList.add('show');
}

function closeSettings() {
    settingsModal.classList.remove('show');
}

function saveSettings() {
    if (!isBreakMode && timerId === null) {
        setTimer(parseInt(focusMinutesInput.value));
    }
    closeSettings();
}

// Event Listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
stopButton.addEventListener('click', stopTimer);
skipBreakButton.addEventListener('click', skipBreak);

// Settings Modal Event Listeners
settingsBtn.addEventListener('click', openSettings);
closeSettingsBtn.addEventListener('click', closeSettings);
saveSettingsBtn.addEventListener('click', saveSettings);

// Close modal when clicking outside
settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        closeSettings();
    }
});

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