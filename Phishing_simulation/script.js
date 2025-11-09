 // ===== CUSTOMIZATION VARIABLES =====
        // Edit these values to customize the simulation for your organization
        const ORGANIZATION_NAME = "Example Corp";
        const DEMO_ID = "lab01";
        const CONTACT_EMAIL = "security@example.local";
        const COLOR_THEME = "blue"; // Options: blue, purple, green (not implemented in this version)

        // ===== QUIZ ANSWERS =====
        const correctAnswers = {
            q1: "C", // Verify by calling
            q2: "C", // Domain doesn't match
            q3: "B"  // MFA is best protection
        };

        const explanations = {
            q1: "This is a common 'CEO fraud' or 'business email compromise' attack. Even if the sender address looks legitimate, attackers can spoof email addresses. Always verify unusual or urgent requests through a separate communication channel (phone call, in-person). The legitimate CEO will understand the need for verification.",
            q2: "Always check the actual domain of a link, not just keywords in the URL. Attackers often use domains that include your company's name but end in unfamiliar extensions (.xyz, .tk, .top) or misspelled versions of legitimate domains. Your company's real domain is likely .com, .org, or a country-specific extension. When in doubt, don't click—navigate to the service directly by typing the known URL in your browser.",
            q3: "While being cautious about email links is important, enabling multi-factor authentication (MFA) provides the strongest protection. Even if an attacker obtains your password through phishing, they cannot access your account without the second factor (code from your phone, security key, etc.). Strong, unique passwords for each account also limit the damage if one password is compromised."
        };

        // ===== INITIALIZATION =====
        let sessionLog = {
            demoId: DEMO_ID,
            timestamp: new Date().toISOString(),
            events: []
        };

        function init() {
            // Set custom values in the page
            document.getElementById('org-name').textContent = ORGANIZATION_NAME;
            document.getElementById('demo-id').textContent = DEMO_ID;
            document.getElementById('contact-email').textContent = CONTACT_EMAIL;
            
            const demoEmailElements = document.querySelectorAll('.demo-email');
            demoEmailElements.forEach(el => el.textContent = DEMO_ID + '@test.local');
            
            const contactElements = document.querySelectorAll('.contact-email-text');
            contactElements.forEach(el => el.textContent = CONTACT_EMAIL);

            // Set current date
            const now = new Date();
            document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            // Log page load
            logEvent('page_loaded');
            
            console.log('%c🔒 Phishing Simulation Training Loaded', 'color: #667eea; font-size: 16px; font-weight: bold;');
            console.log('%cDemo ID: ' + DEMO_ID, 'color: #555;');
            console.log('%cOrganization: ' + ORGANIZATION_NAME, 'color: #555;');
            console.log('%cAll interactions are logged to localStorage (key: phish-sim-log) and console', 'color: #999;');
            console.log('%cTo view stored data: localStorage.getItem("phish-sim-log")', 'color: #999;');
            console.log('%cTo clear data: localStorage.removeItem("phish-sim-log")', 'color: #999;');
        }

        // ===== LOGGING FUNCTIONS =====
    function logEvent(eventName, data = {}) {
        const event = {
            event: eventName,
            time: new Date().toISOString(),
            ...data
        };
        sessionLog.events.push(event);
    
        // Store in localStorage
        try {
            localStorage.setItem('phish-sim-log', JSON.stringify(sessionLog));
            console.log('📊 Event logged:', event);
        } catch (e) {
            console.error('Failed to log to localStorage:', e);
        }
    }

    // ===== NAVIGATION FUNCTIONS =====
    function showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        document.getElementById(screenId).classList.add('active');
        
        // Update progress indicator
        updateProgress(screenId);
        
        // Scroll to top
        window.scrollTo(0, 0);
    }

    function updateProgress(screenId) {
        const progressMap = {
            'screen-email': ['progress-email'],
            'screen-training': ['progress-email', 'progress-training'],
            'screen-quiz': ['progress-email', 'progress-training', 'progress-quiz'],
            'screen-completion': ['progress-email', 'progress-training', 'progress-quiz', 'progress-complete']
        };
        
        // Reset all
        document.querySelectorAll('.progress-step').forEach(step => {
            step.classList.remove('active', 'completed');
        });
        
        // Mark completed and active
        const steps = progressMap[screenId] || [];
        steps.forEach((stepId, index) => {
            const element = document.getElementById(stepId);
            if (index < steps.length - 1) {
                element.classList.add('completed');
            } else {
                element.classList.add('active');
            }
        });
    }

    function showEmail() {
        showScreen('screen-email');
        logEvent('returned_to_email');
    }

    function showTraining() {
        showScreen('screen-training');
        logEvent('returned_to_training');
    }

    function showQuiz() {
        showScreen('screen-quiz');
        logEvent('quiz_started');
    }

    function showCompletion() {
        showScreen('screen-completion');
    }

    // ===== CTA CLICK =====
    function clickCTA() {
        logEvent('cta_clicked', { button: 'Verify Account Now' });
        showScreen('screen-training');
        logEvent('training_started');
    }

    // ===== QUIZ FUNCTIONS =====
    function submitQuiz() {
        let score = 0;
        let answers = {};
        
        // Check each question
        for (let qNum = 1; qNum <= 3; qNum++) {
            const selected = document.querySelector(`input[name="q${qNum}"]:checked`);
            
            if (!selected) {
                alert(`Please answer Question ${qNum} before submitting.`);
                return;
            }
            
            const answer = selected.value;
            answers[`q${qNum}`] = answer;
            const isCorrect = answer === correctAnswers[`q${qNum}`];
            
            if (isCorrect) {
                score++;
            }
            
            // Show feedback
            showFeedback(qNum, answer, isCorrect);
        }
        
        // Log quiz completion
        logEvent('quiz_completed', { score: score, total: 3, answers: answers });
        
        // Disable all radio buttons
        document.querySelectorAll('input[type="radio"]').forEach(input => {
            input.disabled = true;
        });
        
        // Show completion after a delay
        setTimeout(() => {
            displayScore(score);
            showCompletion();
            logEvent('completion_viewed', { score: score });
        }, 2000);
    }

    function showFeedback(questionNum, selectedAnswer, isCorrect) {
        const feedback = document.getElementById(`feedback${questionNum}`);
        const question = document.getElementById(`q${questionNum}`);
        
        // Highlight selected option
        const options = question.querySelectorAll('.quiz-option');
        options.forEach(option => {
            const input = option.querySelector('input');
            if (input.value === correctAnswers[`q${questionNum}`]) {
                option.classList.add('correct');
            } else if (input.value === selectedAnswer && !isCorrect) {
                option.classList.add('incorrect');
            }
        });
        
        // Show feedback message
        feedback.classList.add('show');
        if (isCorrect) {
            feedback.classList.add('correct');
            feedback.innerHTML = `<strong>✓ Correct!</strong><br>${explanations[`q${questionNum}`]}`;
        } else {
            feedback.classList.add('incorrect');
            feedback.innerHTML = `<strong>✗ Incorrect.</strong> The correct answer is ${correctAnswers[`q${questionNum}`]}.<br>${explanations[`q${questionNum}`]}`;
        }
    }

    function displayScore(score) {
        const percentage = Math.round((score / 3) * 100);
        const scoreDisplay = document.getElementById('final-score');
        const scoreMessage = document.getElementById('score-message');
        
        scoreDisplay.textContent = `${score}/3 (${percentage}%)`;
        
        if (score === 3) {
            scoreMessage.textContent = "Perfect! You've mastered phishing awareness.";
        } else if (score === 2) {
            scoreMessage.textContent = "Great job! Review the explanations to strengthen your knowledge.";
        } else if (score === 1) {
            scoreMessage.textContent = "Good start! Review the training materials and try again.";
        } else {
            scoreMessage.textContent = "Keep learning! Review the training materials carefully.";
        }
    }

    // ===== DEMO FUNCTIONS =====
    function restartDemo() {
        // Reset quiz
        document.querySelectorAll('input[type="radio"]').forEach(input => {
            input.checked = false;
            input.disabled = false;
        });
        
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.classList.remove('correct', 'incorrect');
        });
        
        document.querySelectorAll('.feedback').forEach(feedback => {
            feedback.classList.remove('show', 'correct', 'incorrect');
            feedback.innerHTML = '';
        });
        
        // Reset session log
        sessionLog = {
            demoId: DEMO_ID,
            timestamp: new Date().toISOString(),
            events: []
        };
        
        // Go back to start
        showScreen('screen-email');
        logEvent('demo_restarted');
        
        console.log('%c🔄 Demo restarted', 'color: #667eea; font-weight: bold;');
    }

    function viewLogs() {
        console.log('%c📊 Current Session Log:', 'color: #667eea; font-size: 14px; font-weight: bold;');
        console.log(sessionLog);
        
        console.log('%c💾 LocalStorage Data:', 'color: #667eea; font-size: 14px; font-weight: bold;');
        const stored = localStorage.getItem('phish-sim-log');
        if (stored) {
            console.log(JSON.parse(stored));
        } else {
            console.log('No data in localStorage');
        }
        
        alert('Logs have been printed to the browser console. Press F12 to view them.');
    }

    // ===== INITIALIZE ON LOAD =====
    window.addEventListener('DOMContentLoaded', init);

    // ===== EXPORT FUNCTION (for demo purposes) =====
    function exportSessionData() {
        const dataStr = JSON.stringify(sessionLog, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `phishing-sim-${DEMO_ID}-${new Date().getTime()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        console.log('%c📥 Session data exported', 'color: #28a745; font-weight: bold;');
    }

    // Make functions available in console for demo
    window.exportSessionData = exportSessionData;
    window.viewStoredData = viewLogs;
    
    console.log('%cDemo Functions Available:', 'color: #667eea; font-weight: bold;');
    console.log('- exportSessionData() : Download session log as JSON file');
    console.log('- viewStoredData() : View localStorage data in console');
    console.log('- restartDemo() : Reset and restart the simulation');