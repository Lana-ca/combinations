// City Matcher Application
class CityMatcher {
    constructor() {
        this.cities = [];
        this.questions = [
            {
                id: 1,
                text: "What's your ideal climate?",
                type: "single",
                attribute: "climate",
                options: [
                    { value: "tropical", label: "Tropical - Hot and humid year-round" },
                    { value: "mediterranean", label: "Mediterranean - Warm, dry summers and mild winters" },
                    { value: "temperate", label: "Temperate - Four distinct seasons" },
                    { value: "oceanic", label: "Oceanic - Cool and rainy" },
                    { value: "desert", label: "Desert - Hot and dry" },
                    { value: "subarctic", label: "Cold - Long, cold winters" }
                ]
            },
            {
                id: 2,
                text: "What's your budget for cost of living?",
                type: "single",
                attribute: "costOfLiving",
                options: [
                    { value: "very-low", label: "Very Low - I want to stretch my money" },
                    { value: "low", label: "Low - Budget-friendly" },
                    { value: "moderate", label: "Moderate - Average expenses" },
                    { value: "high", label: "High - Willing to pay for quality" },
                    { value: "very-high", label: "Very High - Money is not a concern" }
                ]
            },
            {
                id: 3,
                text: "How important is the job market?",
                type: "single",
                attribute: "jobMarket",
                options: [
                    { value: "excellent", label: "Essential - I need excellent opportunities" },
                    { value: "good", label: "Important - Good opportunities preferred" },
                    { value: "moderate", label: "Moderate - Some opportunities needed" },
                    { value: "growing", label: "Flexible - Growing market is fine" }
                ]
            },
            {
                id: 4,
                text: "How important is public transportation?",
                type: "single",
                attribute: "publicTransport",
                options: [
                    { value: "excellent", label: "Essential - I rely on public transport" },
                    { value: "good", label: "Important - I prefer good options" },
                    { value: "moderate", label: "Nice to have - I might use it sometimes" }
                ]
            },
            {
                id: 5,
                text: "What city size do you prefer?",
                type: "single",
                attribute: "population",
                options: [
                    { value: "small", label: "Small - Intimate and quiet" },
                    { value: "medium", label: "Medium - Not too big, not too small" },
                    { value: "large", label: "Large - Big city energy" }
                ]
            },
            {
                id: 6,
                text: "How important is nightlife to you?",
                type: "single",
                attribute: "nightlife",
                options: [
                    { value: "world-class", label: "Essential - I love going out" },
                    { value: "vibrant", label: "Important - I enjoy nightlife" },
                    { value: "moderate", label: "Nice to have - Occasional nights out" }
                ]
            },
            {
                id: 7,
                text: "How important are outdoor activities?",
                type: "single",
                attribute: "outdoorActivities",
                options: [
                    { value: "excellent", label: "Essential - I'm very outdoorsy" },
                    { value: "good", label: "Important - I enjoy outdoor activities" },
                    { value: "moderate", label: "Nice to have - Occasional outdoor time" }
                ]
            },
            {
                id: 8,
                text: "How important is safety?",
                type: "single",
                attribute: "safety",
                options: [
                    { value: "excellent", label: "Essential - Top priority" },
                    { value: "good", label: "Important - Very important to me" },
                    { value: "moderate", label: "Moderate - I can be cautious" }
                ]
            },
            {
                id: 9,
                text: "How important is English-friendliness?",
                type: "single",
                attribute: "englishFriendly",
                options: [
                    { value: "excellent", label: "Essential - I only speak English" },
                    { value: "good", label: "Important - Makes life easier" },
                    { value: "moderate", label: "Flexible - I can learn the language" }
                ]
            },
            {
                id: 10,
                text: "What pace of life do you prefer?",
                type: "single",
                attribute: "pace",
                options: [
                    { value: "fast", label: "Fast - I thrive on energy and hustle" },
                    { value: "moderate", label: "Moderate - Balanced pace" },
                    { value: "relaxed", label: "Relaxed - Slow and steady" }
                ]
            },
            {
                id: 11,
                text: "Are you looking for a tech hub?",
                type: "boolean",
                attribute: "techHub",
                options: [
                    { value: true, label: "Yes - Tech opportunities are important" },
                    { value: false, label: "No - Not important to me" }
                ]
            },
            {
                id: 12,
                text: "What geographic features do you want nearby?",
                type: "multiple",
                attributes: ["beachAccess", "mountainAccess"],
                options: [
                    { value: "beachAccess", label: "Beach access" },
                    { value: "mountainAccess", label: "Mountain access" },
                    { value: "neither", label: "Neither is important" }
                ]
            }
        ];

        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.init();
    }

    async init() {
        await this.loadCities();
        this.loadUserAnswers();
        this.setupEventListeners();
        this.showWelcomeScreen();
    }

    async loadCities() {
        try {
            const response = await fetch('cities.json');
            const data = await response.json();
            this.cities = data.cities;
        } catch (error) {
            console.error('Error loading cities:', error);
            alert('Failed to load city data. Please refresh the page.');
        }
    }

    loadUserAnswers() {
        const saved = localStorage.getItem('cityMatcherAnswers');
        if (saved) {
            this.userAnswers = JSON.parse(saved);
        }
    }

    saveUserAnswers() {
        localStorage.setItem('cityMatcherAnswers', JSON.stringify(this.userAnswers));
    }

    resetProgress() {
        if (confirm('Are you sure you want to reset your progress? This will clear all your answers.')) {
            localStorage.removeItem('cityMatcherAnswers');
            this.userAnswers = {};
            this.currentQuestionIndex = 0;
            this.showWelcomeScreen();
        }
    }

    setupEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => this.startQuiz());
        document.getElementById('reset-btn').addEventListener('click', () => this.resetProgress());
        document.getElementById('prev-btn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('next-btn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('retake-btn').addEventListener('click', () => this.retakeQuiz());
        document.getElementById('view-all-btn').addEventListener('click', () => this.showAllMatches());

        const modal = document.getElementById('all-matches-modal');
        const closeBtn = document.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    showWelcomeScreen() {
        this.hideAllScreens();
        document.getElementById('welcome-screen').classList.add('active');
    }

    startQuiz() {
        this.currentQuestionIndex = 0;
        this.hideAllScreens();
        document.getElementById('quiz-screen').classList.add('active');
        this.displayQuestion();
    }

    retakeQuiz() {
        this.userAnswers = {};
        this.saveUserAnswers();
        this.startQuiz();
    }

    hideAllScreens() {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        const totalQuestions = this.questions.length;

        // Update progress bar
        const progress = ((this.currentQuestionIndex + 1) / totalQuestions) * 100;
        document.getElementById('progress-fill').style.width = progress + '%';

        // Update question counter
        document.getElementById('current-question').textContent = this.currentQuestionIndex + 1;
        document.getElementById('total-questions').textContent = totalQuestions;

        // Display question text
        document.getElementById('question-text').textContent = question.text;

        // Create options
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';

        if (question.type === 'multiple') {
            question.options.forEach(option => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'option-checkbox';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `option-${option.value}`;
                checkbox.value = option.value;

                // Check if this option was previously selected
                if (this.userAnswers[question.id]) {
                    if (option.value === 'neither') {
                        checkbox.checked = this.userAnswers[question.id].neither === true;
                    } else {
                        checkbox.checked = this.userAnswers[question.id][option.value] === true;
                    }
                }

                checkbox.addEventListener('change', () => this.handleMultipleChoice(question, option.value));

                const label = document.createElement('label');
                label.htmlFor = `option-${option.value}`;
                label.textContent = option.label;

                optionDiv.appendChild(checkbox);
                optionDiv.appendChild(label);
                optionsContainer.appendChild(optionDiv);
            });
        } else {
            question.options.forEach(option => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'option';
                optionDiv.textContent = option.label;
                optionDiv.dataset.value = option.value;

                // Check if this option was previously selected
                if (this.userAnswers[question.id] === option.value) {
                    optionDiv.classList.add('selected');
                }

                optionDiv.addEventListener('click', () => this.handleSingleChoice(question, option.value));

                optionsContainer.appendChild(optionDiv);
            });
        }

        // Update navigation buttons
        document.getElementById('prev-btn').disabled = this.currentQuestionIndex === 0;
        this.updateNextButton();
    }

    handleSingleChoice(question, value) {
        // Remove selection from all options
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Add selection to clicked option
        event.target.classList.add('selected');

        // Save answer
        this.userAnswers[question.id] = value;
        this.saveUserAnswers();
        this.updateNextButton();
    }

    handleMultipleChoice(question, value) {
        if (!this.userAnswers[question.id]) {
            this.userAnswers[question.id] = {};
        }

        if (value === 'neither') {
            // If "neither" is selected, uncheck all other options
            const checkboxes = document.querySelectorAll('.option-checkbox input[type="checkbox"]');
            checkboxes.forEach(cb => {
                if (cb.value !== 'neither') {
                    cb.checked = false;
                    this.userAnswers[question.id][cb.value] = false;
                }
            });
            this.userAnswers[question.id].neither = event.target.checked;
        } else {
            // If any other option is selected, uncheck "neither"
            const neitherCheckbox = document.getElementById('option-neither');
            if (neitherCheckbox) {
                neitherCheckbox.checked = false;
                this.userAnswers[question.id].neither = false;
            }
            this.userAnswers[question.id][value] = event.target.checked;
        }

        this.saveUserAnswers();
        this.updateNextButton();
    }

    updateNextButton() {
        const question = this.questions[this.currentQuestionIndex];
        const isAnswered = this.isQuestionAnswered(question);
        document.getElementById('next-btn').disabled = !isAnswered;
    }

    isQuestionAnswered(question) {
        if (question.type === 'multiple') {
            const answer = this.userAnswers[question.id];
            if (!answer) return false;
            // Check if at least one option is selected
            return Object.values(answer).some(val => val === true);
        } else {
            return this.userAnswers[question.id] !== undefined;
        }
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        } else {
            this.showResults();
        }
    }

    calculateMatches() {
        const matches = this.cities.map(city => {
            let score = 0;
            let maxScore = 0;

            this.questions.forEach(question => {
                const answer = this.userAnswers[question.id];

                if (question.type === 'single') {
                    maxScore += 10;
                    if (city[question.attribute] === answer) {
                        score += 10;
                    } else {
                        // Partial credit for similar values
                        const similarityScore = this.getSimilarityScore(question.attribute, city[question.attribute], answer);
                        score += similarityScore;
                    }
                } else if (question.type === 'boolean') {
                    maxScore += 10;
                    if (city[question.attribute] === answer) {
                        score += 10;
                    }
                } else if (question.type === 'multiple') {
                    maxScore += 10;
                    if (answer.neither) {
                        score += 10;
                    } else {
                        let matchedAttributes = 0;
                        let selectedAttributes = 0;

                        question.attributes.forEach(attr => {
                            if (answer[attr]) {
                                selectedAttributes++;
                                if (city[attr]) {
                                    matchedAttributes++;
                                }
                            }
                        });

                        if (selectedAttributes > 0) {
                            score += (matchedAttributes / selectedAttributes) * 10;
                        } else {
                            score += 10;
                        }
                    }
                }
            });

            const matchPercentage = Math.round((score / maxScore) * 100);

            return {
                city,
                score,
                matchPercentage
            };
        });

        // Sort by match percentage (descending)
        matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

        return matches;
    }

    getSimilarityScore(attribute, cityValue, userValue) {
        // Define similarity mappings for partial credit
        const similarityMaps = {
            costOfLiving: {
                'very-low': { 'low': 7, 'moderate': 4 },
                'low': { 'very-low': 7, 'moderate': 7, 'high': 4 },
                'moderate': { 'low': 7, 'high': 7 },
                'high': { 'moderate': 7, 'very-high': 7 },
                'very-high': { 'high': 7 }
            },
            jobMarket: {
                'excellent': { 'good': 7, 'growing': 4 },
                'good': { 'excellent': 7, 'moderate': 7, 'growing': 7 },
                'moderate': { 'good': 7, 'growing': 7 },
                'growing': { 'moderate': 7, 'good': 7 }
            },
            publicTransport: {
                'excellent': { 'good': 7, 'moderate': 4 },
                'good': { 'excellent': 7, 'moderate': 7 },
                'moderate': { 'good': 7 }
            },
            population: {
                'small': { 'medium': 5 },
                'medium': { 'small': 5, 'large': 5 },
                'large': { 'medium': 5 }
            },
            nightlife: {
                'world-class': { 'vibrant': 7, 'moderate': 4 },
                'vibrant': { 'world-class': 7, 'moderate': 7 },
                'moderate': { 'vibrant': 7 }
            },
            outdoorActivities: {
                'excellent': { 'good': 7, 'moderate': 4 },
                'good': { 'excellent': 7, 'moderate': 7 },
                'moderate': { 'good': 7 }
            },
            safety: {
                'excellent': { 'good': 7, 'moderate': 4 },
                'good': { 'excellent': 7, 'moderate': 7 },
                'moderate': { 'good': 7 }
            },
            englishFriendly: {
                'excellent': { 'good': 7, 'moderate': 4 },
                'good': { 'excellent': 7, 'moderate': 7 },
                'moderate': { 'good': 7 }
            },
            pace: {
                'fast': { 'moderate': 5 },
                'moderate': { 'fast': 5, 'relaxed': 5 },
                'relaxed': { 'moderate': 5 }
            }
        };

        if (similarityMaps[attribute] && similarityMaps[attribute][userValue]) {
            return similarityMaps[attribute][userValue][cityValue] || 0;
        }

        return 0;
    }

    showResults() {
        this.hideAllScreens();
        document.getElementById('results-screen').classList.add('active');

        const matches = this.calculateMatches();
        const topMatches = matches.slice(0, 5);

        const resultsContainer = document.getElementById('results-container');
        resultsContainer.innerHTML = '';

        topMatches.forEach((match, index) => {
            const cityCard = this.createCityCard(match, index + 1);
            resultsContainer.appendChild(cityCard);
        });
    }

    createCityCard(match, rank) {
        const card = document.createElement('div');
        card.className = 'city-card';

        const rankBadge = rank <= 3 ? `<span class="rank-badge rank-${rank}">#${rank}</span>` : `<span class="rank-badge">#${rank}</span>`;

        card.innerHTML = `
            ${rankBadge}
            <div class="city-header">
                <h3>${match.city.name}</h3>
                <p class="country">${match.city.country}, ${match.city.continent}</p>
            </div>
            <div class="match-percentage">
                <div class="percentage-circle">
                    <span class="percentage-value">${match.matchPercentage}%</span>
                    <span class="percentage-label">Match</span>
                </div>
            </div>
            <div class="city-details">
                <div class="detail-row">
                    <span class="detail-label">Climate:</span>
                    <span class="detail-value">${this.formatValue(match.city.climate)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Cost of Living:</span>
                    <span class="detail-value">${this.formatValue(match.city.costOfLiving)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Job Market:</span>
                    <span class="detail-value">${this.formatValue(match.city.jobMarket)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Culture:</span>
                    <span class="detail-value">${this.formatValue(match.city.culture)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Safety:</span>
                    <span class="detail-value">${this.formatValue(match.city.safety)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Public Transport:</span>
                    <span class="detail-value">${this.formatValue(match.city.publicTransport)}</span>
                </div>
            </div>
            <div class="city-tags">
                ${match.city.beachAccess ? '<span class="tag">Beach</span>' : ''}
                ${match.city.mountainAccess ? '<span class="tag">Mountains</span>' : ''}
                ${match.city.techHub ? '<span class="tag">Tech Hub</span>' : ''}
            </div>
        `;

        return card;
    }

    showAllMatches() {
        const matches = this.calculateMatches();
        const modal = document.getElementById('all-matches-modal');
        const container = document.getElementById('all-matches-container');

        container.innerHTML = '';

        matches.forEach((match, index) => {
            const cityCard = this.createCityCard(match, index + 1);
            container.appendChild(cityCard);
        });

        modal.style.display = 'block';
    }

    formatValue(value) {
        if (typeof value === 'string') {
            return value.split('-').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
        }
        return value;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CityMatcher();
});
