/**
 * Generator Simulator - Educational Tool
 * Purpose: Demonstrate why "Grow A Garden generators" are fake
 * Author: GAG Calculator Team
 */

class GeneratorSimulator {
    constructor() {
        this.selectedItems = new Set();
        this.isGenerating = false;
        this.username = '';
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupAchievements();
        
        // Add some entrance animations
        this.animateEntrance();
    }

    bindEvents() {
        // Item selection
        const itemCards = document.querySelectorAll('.item-card');
        itemCards.forEach(card => {
            card.addEventListener('click', (e) => this.toggleItemSelection(e));
        });

        // Username input
        const usernameInput = document.getElementById('username-input');
        if (usernameInput) {
            usernameInput.addEventListener('input', (e) => this.updateUsername(e));
            usernameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.startGeneration();
                }
            });
        }

        // Generate button
        const generateBtn = document.getElementById('generate-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.startGeneration());
        }

        // Modal close buttons
        const closeButtons = document.querySelectorAll('#close-truth-modal, #go-to-calculator');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleModalAction(e));
        });

        // FAQ interactions
        this.initFAQ();

        // Achievement interactions
        this.initAchievements();
    }

    toggleItemSelection(event) {
        const card = event.currentTarget;
        const itemName = card.dataset.name;
        const itemType = card.dataset.type;

        if (card.classList.contains('selected')) {
            card.classList.remove('selected');
            this.selectedItems.delete(`${itemType}:${itemName}`);
        } else {
            card.classList.add('selected');
            this.selectedItems.add(`${itemType}:${itemName}`);
            
            // Add selection animation
            this.animateSelection(card);
        }

        this.updateGenerateButton();
    }

    animateSelection(card) {
        card.style.transform = 'scale(1.1)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 200);
    }

    updateUsername(event) {
        this.username = event.target.value.trim();
        this.updateGenerateButton();
    }

    updateGenerateButton() {
        const generateBtn = document.getElementById('generate-btn');
        const hasItems = this.selectedItems.size > 0;
        const hasUsername = this.username.length > 0;

        if (hasItems && hasUsername) {
            generateBtn.classList.add('ready');
            generateBtn.disabled = false;
        } else {
            generateBtn.classList.remove('ready');
            generateBtn.disabled = true;
        }
    }

    async startGeneration() {
        if (this.isGenerating) return;
        if (this.selectedItems.size === 0) {
            this.showTooltip('Please select at least one item! 🎯');
            return;
        }
        if (!this.username) {
            this.showTooltip('Please enter your username! 👤');
            return;
        }

        this.isGenerating = true;
        
        // Show loading modal
        this.showLoadingModal();
        
        // Start the "generation" process
        await this.simulateGeneration();
        
        // Show truth reveal
        this.showTruthModal();
        
        this.isGenerating = false;
    }

    showLoadingModal() {
        const modal = document.getElementById('loading-modal');
        const usernameDisplay = document.getElementById('display-username');
        
        if (usernameDisplay) {
            usernameDisplay.textContent = this.username;
        }
        
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    async simulateGeneration() {
        const steps = [
            { id: 'step-1', duration: 1000, progress: 10 },
            { id: 'step-2', duration: 800, progress: 25 },
            { id: 'step-3', duration: 1200, progress: 40 },
            { id: 'step-4', duration: 600, progress: 55 },
            { id: 'step-5', duration: 1500, progress: 80 },
            { id: 'step-6', duration: 1000, progress: 95 }
        ];

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            
            // Update step status
            this.updateStepStatus(step.id, 'active');
            
            // Update progress bar
            this.updateProgress(step.progress);
            
            // Wait for step duration
            await this.delay(step.duration);
            
            // Complete step (except the last one)
            if (i < steps.length - 1) {
                this.updateStepStatus(step.id, 'completed');
            } else {
                // Last step fails
                this.updateStepStatus(step.id, 'failed');
                this.updateProgress(100);
                await this.delay(500);
            }
        }
    }

    updateStepStatus(stepId, status) {
        const step = document.getElementById(stepId);
        if (!step) return;

        const icon = step.querySelector('.step-icon');
        const text = step.querySelector('.step-text');

        step.className = `step ${status}`;

        switch (status) {
            case 'active':
                icon.textContent = '🔄';
                break;
            case 'completed':
                icon.textContent = '✅';
                break;
            case 'failed':
                icon.textContent = '❌';
                if (stepId === 'step-6') {
                    text.textContent = 'Transfer failed - Server rejected request!';
                }
                break;
        }
    }

    updateProgress(percentage) {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-percentage');

        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        if (progressText) {
            progressText.textContent = `${percentage}%`;
        }
    }

    async showTruthModal() {
        // Hide loading modal first
        const loadingModal = document.getElementById('loading-modal');
        loadingModal.classList.remove('active');

        // Brief delay for dramatic effect
        await this.delay(500);

        // Show truth modal with animation
        const truthModal = document.getElementById('truth-modal');
        truthModal.classList.add('active');
        
        // Trigger achievement
        this.unlockAchievement('scam-detector');
        
        // Add confetti effect
        this.addConfettiEffect();
    }

    handleModalAction(event) {
        const action = event.target.id;
        const truthModal = document.getElementById('truth-modal');

        if (action === 'go-to-calculator') {
            // Redirect to calculator
            window.location.href = 'index.html#calculator-module';
        } else if (action === 'close-truth-modal') {
            // Close modal
            truthModal.classList.remove('active');
            document.body.classList.remove('modal-open');
            
            // Reset simulator
            this.resetSimulator();
        }
    }

    resetSimulator() {
        // Clear selections
        this.selectedItems.clear();
        document.querySelectorAll('.item-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Clear username
        this.username = '';
        const usernameInput = document.getElementById('username-input');
        if (usernameInput) {
            usernameInput.value = '';
        }

        // Reset button
        this.updateGenerateButton();

        // Reset progress
        this.updateProgress(0);
        
        // Reset steps
        for (let i = 1; i <= 6; i++) {
            const step = document.getElementById(`step-${i}`);
            if (step) {
                step.className = 'step';
                const icon = step.querySelector('.step-icon');
                const text = step.querySelector('.step-text');
                
                if (icon) icon.textContent = '⏳';
                
                // Reset step 6 text
                if (i === 6 && text) {
                    text.textContent = 'Transferring items to Grow a Garden game...';
                }
            }
        }
    }

    initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-toggle').textContent = '+';
                });

                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                    question.querySelector('.faq-toggle').textContent = '−';
                }
            });
        });
    }

    initAchievements() {
        const achievementCards = document.querySelectorAll('.achievement-card');
        achievementCards.forEach(card => {
            card.addEventListener('click', () => {
                this.showAchievementDetail(card.dataset.achievement);
            });
        });
    }

    setupAchievements() {
        // Track page visit time for speed learner achievement
        this.pageStartTime = Date.now();
        
        setTimeout(() => {
            this.unlockAchievement('speed-learner');
        }, 30000); // 30 seconds

        // Big brain achievement unlocked on page load
        setTimeout(() => {
            this.unlockAchievement('big-brain');
        }, 2000);
    }

    unlockAchievement(achievementId) {
        const achievementCard = document.querySelector(`[data-achievement="${achievementId}"]`);
        if (achievementCard && !achievementCard.classList.contains('unlocked')) {
            achievementCard.classList.add('unlocked');
            this.showAchievementNotification(achievementId);
        }
    }

    showAchievementNotification(achievementId) {
        const achievements = {
            'big-brain': { icon: '🧠', title: 'Big Brain Player', desc: 'You found our educational page!' },
            'scam-shield': { icon: '🛡️', title: 'Scam Shield', desc: 'Protected from fake generators!' },
            'speed-learner': { icon: '⚡', title: 'Speed Learner', desc: 'Learning about scam protection!' },
            'scam-detector': { icon: '🕵️', title: 'Scam Detector', desc: 'You discovered the truth!' }
        };

        const achievement = achievements[achievementId];
        if (!achievement) return;

        // Create notification
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-notification-content">
                <span class="achievement-notification-icon">${achievement.icon}</span>
                <div class="achievement-notification-text">
                    <strong>Achievement Unlocked!</strong>
                    <span>${achievement.title}</span>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Hide notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    showAchievementDetail(achievementId) {
        const achievements = {
            'big-brain': 'You found our educational page instead of falling for fake generators. Smart choice! 🧠',
            'scam-shield': 'You\'re now protected from phishing attempts and account theft. Stay safe! 🛡️',
            'speed-learner': 'You\'re learning about scam protection faster than most players. Impressive! ⚡',
            'reality-check': 'You chose education over false promises. That\'s wisdom! 🎯'
        };

        const message = achievements[achievementId];
        if (message) {
            this.showTooltip(message, 'achievement');
        }
    }

    addConfettiEffect() {
        // Simple confetti effect for the truth reveal
        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createConfettiPiece(colors[Math.floor(Math.random() * colors.length)]);
            }, i * 50);
        }
    }

    createConfettiPiece(color) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            top: -10px;
            left: ${Math.random() * 100}vw;
            width: 8px;
            height: 8px;
            background: ${color};
            pointer-events: none;
            z-index: 10000;
            animation: confetti-fall 3s linear forwards;
        `;

        document.body.appendChild(confetti);

        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 3000);
    }

    showTooltip(message, type = 'info') {
        const tooltip = document.createElement('div');
        tooltip.className = `tooltip tooltip-${type}`;
        tooltip.textContent = message;

        document.body.appendChild(tooltip);

        // Position tooltip
        const rect = tooltip.getBoundingClientRect();
        tooltip.style.left = `${(window.innerWidth - rect.width) / 2}px`;
        tooltip.style.top = '20px';

        // Show tooltip
        setTimeout(() => tooltip.classList.add('show'), 100);

        // Hide tooltip
        setTimeout(() => {
            tooltip.classList.remove('show');
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }, 300);
        }, 3000);
    }

    animateEntrance() {
        // Animate hero elements
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const simulator = document.querySelector('.generator-simulator');

        if (heroTitle) {
            heroTitle.style.opacity = '0';
            heroTitle.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                heroTitle.style.transition = 'all 0.6s ease';
                heroTitle.style.opacity = '1';
                heroTitle.style.transform = 'translateY(0)';
            }, 200);
        }

        if (heroSubtitle) {
            heroSubtitle.style.opacity = '0';
            heroSubtitle.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                heroSubtitle.style.transition = 'all 0.6s ease';
                heroSubtitle.style.opacity = '1';
                heroSubtitle.style.transform = 'translateY(0)';
            }, 400);
        }

        if (simulator) {
            simulator.style.opacity = '0';
            simulator.style.transform = 'translateY(20px)';
            setTimeout(() => {
                simulator.style.transition = 'all 0.8s ease';
                simulator.style.opacity = '1';
                simulator.style.transform = 'translateY(0)';
            }, 600);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GeneratorSimulator();
});

// Add CSS animations for confetti
const style = document.createElement('style');
style.textContent = `
    @keyframes confetti-fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }

    .tooltip {
        position: fixed;
        background: var(--bg-card);
        color: var(--text-primary);
        padding: var(--spacing-sm) var(--spacing);
        border-radius: var(--radius);
        box-shadow: var(--shadow-lg);
        font-size: var(--text-sm);
        font-weight: 500;
        z-index: 10000;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        border: 1px solid var(--border-color);
        max-width: 300px;
        text-align: center;
    }

    .tooltip.show {
        opacity: 1;
        transform: translateY(0);
    }

    .tooltip-achievement {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        border: none;
    }

    .achievement-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--success-color), var(--primary-color));
        color: white;
        padding: var(--spacing);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        min-width: 250px;
    }

    .achievement-notification.show {
        opacity: 1;
        transform: translateX(0);
    }

    .achievement-notification-content {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }

    .achievement-notification-icon {
        font-size: var(--text-xl);
        flex-shrink: 0;
    }

    .achievement-notification-text {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
    }

    .achievement-notification-text strong {
        font-size: var(--text-sm);
        font-weight: 600;
    }

    .achievement-notification-text span {
        font-size: var(--text-xs);
        opacity: 0.9;
    }

    @media (max-width: 768px) {
        .achievement-notification {
            right: 10px;
            min-width: 200px;
        }
    }
`;

document.head.appendChild(style); 