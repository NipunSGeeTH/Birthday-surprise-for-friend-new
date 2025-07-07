// Default data configuration
const defaultData = {
    message1: "Power On",
    message2: "Hi' baba",
    message3: "I'm Your New Phone",
    message4: "Please Turn up Volume bit.",
    message5: "I have to Say You Something",
    entertext1: "Enter your friend's name please",
    SecondScreenText1: "Okay [Name]",
    SecondScreenText2: "Do you know",
    SecondScreenText3: "is a Good Friend",
    SecondScreenText4: "So, I'm sure",
    GlobalMesssageLast: [
        "So Yaluu,",
        "You Are Good Friend",
        "I have to go now",
        "Wait more 10 seconds",
        "Good bye !"
    ],
    fire_title: "Happy Birthday",
    fire_name: "Nimal"
};

// Rate limiting configuration
const RATE_LIMIT_KEY = 'birthday_creator_last_request';
const RATE_LIMIT_MINUTES = 10;

// Initialize form with default values
function initializeForm() {
    document.getElementById("message1").value = defaultData.message1;
    document.getElementById("message2").value = defaultData.message2;
    document.getElementById("message3").value = defaultData.message3;
    document.getElementById("message4").value = defaultData.message4;
    document.getElementById("message5").value = defaultData.message5;
    document.getElementById("entertext1").value = defaultData.entertext1;
    document.getElementById("second_screen1").value = defaultData.SecondScreenText1;
    document.getElementById("second_screen2").value = defaultData.SecondScreenText2;
    document.getElementById("second_screen3").value = defaultData.SecondScreenText3;
    document.getElementById("second_screen4").value = defaultData.SecondScreenText4;
    document.getElementById("global_messages").value = defaultData.GlobalMesssageLast.join("\n");
    document.getElementById("fire_title").value = defaultData.fire_title;
    document.getElementById("fire_name").value = defaultData.fire_name;
}

// Check rate limiting
function checkRateLimit() {
    const lastRequest = localStorage.getItem(RATE_LIMIT_KEY);
    if (lastRequest) {
        const lastRequestTime = new Date(lastRequest);
        const now = new Date();
        const timeDiff = (now - lastRequestTime) / 1000 / 60; // in minutes
        
        if (timeDiff < RATE_LIMIT_MINUTES) {
            const remainingTime = Math.ceil(RATE_LIMIT_MINUTES - timeDiff);
            return {
                allowed: false,
                remainingTime: remainingTime
            };
        }
    }
    return { allowed: true };
}

// Update rate limit timestamp
function updateRateLimit() {
    localStorage.setItem(RATE_LIMIT_KEY, new Date().toISOString());
}

// Show loading state
function showLoading() {
    const submitBtn = document.querySelector('.btn-submit');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
}

// Hide loading state
function hideLoading() {
    const submitBtn = document.querySelector('.btn-submit');
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
}

// Show popup
function showPopup(type, title, content) {
    const popup = document.getElementById('popup');
    const popupTitle = document.getElementById('popup-title');
    const popupMessage = document.getElementById('popup-message');
    
    popupTitle.textContent = title;
    popupMessage.innerHTML = content;
    popup.classList.add('show');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// Close popup
function closePopup() {
    const popup = document.getElementById('popup');
    popup.classList.remove('show');
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
}

// Create success popup content
function createSuccessContent(shareUrl) {
    return `
        <div class="success-content">
            <span class="success-icon">🎉</span>
            <h4>Your Magic Link is Ready!</h4>
            <p>Share this link with your friend to surprise them:</p>
            <div class="share-section">
                <input type="text" class="share-input" id="shareLink" value="${shareUrl}" readonly>
                <div class="share-buttons">
                    <button class="btn-copy" onclick="copyToClipboard()">📋 Copy Link</button>
                    <button class="btn-share" onclick="shareLink()">🔗 Share Link</button>
                </div>
            </div>
            <p style="margin-top: 15px; font-size: 0.9rem; color: #666;">
                <strong>Note:</strong> You can create another link after 10 minutes to prevent spam.
            </p>
        </div>
    `;
}

// Create rate limit warning content
function createRateLimitContent(remainingTime) {
    return `
        <div class="warning-content">
            <span class="warning-icon">⏰</span>
            <h4>Please Wait!</h4>
            <p>You can only create one link every 10 minutes to prevent spam.</p>
            <p><strong>Please wait ${remainingTime} more minute${remainingTime > 1 ? 's' : ''} before creating another link.</strong></p>
            <p style="margin-top: 15px; font-size: 0.9rem;">
                This helps us keep the service free and prevent abuse. Thank you for understanding! 🙏
            </p>
        </div>
    `;
}

// Create error content
function createErrorContent(error) {
    return `
        <div class="warning-content">
            <span class="warning-icon">❌</span>
            <h4>Oops! Something went wrong</h4>
            <p>We couldn't create your magic link right now. Please try again in a few minutes.</p>
            <p style="margin-top: 15px; font-size: 0.9rem; color: #666;">
                Error: ${error}
            </p>
        </div>
    `;
}

// Copy to clipboard function
function copyToClipboard() {
    const shareLink = document.getElementById('shareLink');
    shareLink.select();
    shareLink.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            const copyBtn = document.querySelector('.btn-copy');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✅ Copied!';
            copyBtn.style.background = '#38a169';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '#4299e1';
            }, 2000);
        }
    } catch (err) {
        console.error('Copy failed:', err);
        // Fallback for modern browsers
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareLink.value).then(() => {
                const copyBtn = document.querySelector('.btn-copy');
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✅ Copied!';
                copyBtn.style.background = '#38a169';
                
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.background = '#4299e1';
                }, 2000);
            });
        }
    }
}

// Share link function
function shareLink() {
    const shareUrl = document.getElementById('shareLink').value;
    
    if (navigator.share) {
        navigator.share({
            title: 'Birthday Surprise! 🎉',
            text: 'Someone created a special birthday message for you! Click to see the surprise:',
            url: shareUrl
        }).catch(err => {
            console.log('Share failed:', err);
            // Fallback to manual sharing
            fallbackShare(shareUrl);
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        fallbackShare(shareUrl);
    }
}

// Fallback share function
function fallbackShare(url) {
    const shareText = `🎉 Someone created a special birthday message for you! Click to see the surprise: ${url}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Link copied to clipboard! You can now paste it in your messaging app.');
        });
    } else {
        // Ultimate fallback - show prompt
        prompt('Copy this link to share:', url);
    }
}

// Collect form data
function collectFormData() {
    return {
        message1: document.getElementById("message1").value.trim(),
        message2: document.getElementById("message2").value.trim(),
        message3: document.getElementById("message3").value.trim(),
        message4: document.getElementById("message4").value.trim(),
        message5: document.getElementById("message5").value.trim(),
        entertext1: document.getElementById("entertext1").value.trim(),
        second_screen1: document.getElementById("second_screen1").value.trim(),
        second_screen2: document.getElementById("second_screen2").value.trim(),
        second_screen3: document.getElementById("second_screen3").value.trim(),
        second_screen4: document.getElementById("second_screen4").value.trim(),
        global_messages: {
            messages: document.getElementById("global_messages").value
                .split("\n")
                .map(msg => msg.trim())
                .filter(msg => msg.length > 0)
        },
        fire_title: document.getElementById("fire_title").value.trim(),
        fire_name: document.getElementById("fire_name").value.trim()
    };
}

// Validate form data
function validateFormData(data) {
    const errors = [];
    
    // Check required fields
    if (!data.fire_name) errors.push("Birthday person's name is required");
    if (!data.fire_title) errors.push("Celebration title is required");
    if (data.global_messages.messages.length === 0) errors.push("At least one final message is required");
    
    // Check message lengths
    const maxLength = 100;
    Object.keys(data).forEach(key => {
        if (typeof data[key] === 'string' && data[key].length > maxLength) {
            errors.push(`${key} is too long (max ${maxLength} characters)`);
        }
    });
    
    return errors;
}

// Submit form handler
async function submitForm(formData) {
    try {
        const response = await fetch("https://bitymuqzjivftbneisfg.supabase.co/functions/v1/add-birthday-message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result && result.random_id) {
            const shareUrl = `https://my-domain.com/?${result.random_id}`;
            updateRateLimit();
            showPopup('success', 'Success! 🎉', createSuccessContent(shareUrl));
        } else {
            throw new Error('Invalid response format');
        }

    } catch (error) {
        console.error('Submission error:', error);
        showPopup('error', 'Error', createErrorContent(error.message));
    }
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Check rate limiting
    const rateLimitCheck = checkRateLimit();
    if (!rateLimitCheck.allowed) {
        showPopup('warning', 'Rate Limited', createRateLimitContent(rateLimitCheck.remainingTime));
        return;
    }
    
    // Collect and validate form data
    const formData = collectFormData();
    const validationErrors = validateFormData(formData);
    
    if (validationErrors.length > 0) {
        showPopup('error', 'Validation Error', createErrorContent(validationErrors.join('<br>')));
        return;
    }
    
    // Show loading and submit
    showLoading();
    
    submitForm(formData)
        .finally(() => {
            hideLoading();
        });
}

// Add smooth scrolling for form sections
function addSmoothScrolling() {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            // Small delay to ensure virtual keyboard is shown on mobile
            setTimeout(() => {
                this.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }, 300);
        });
    });
}

// Add input validation feedback
function addInputValidation() {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#e53e3e';
            } else {
                this.style.borderColor = '#e2e8f0';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(229, 62, 62)') {
                this.style.borderColor = '#e2e8f0';
            }
        });
    });
}

// Handle escape key to close popup
function handleEscapeKey(event) {
    if (event.key === 'Escape') {
        closePopup();
    }
}

// Handle click outside popup to close
function handleClickOutside(event) {
    const popup = document.getElementById('popup');
    const popupContent = document.querySelector('.popup-content');
    
    if (event.target === popup && !popupContent.contains(event.target)) {
        closePopup();
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form with default values
    initializeForm();
    
    // Add form submission handler
    document.getElementById('birthdayForm').addEventListener('submit', handleFormSubmit);
    
    // Add smooth scrolling
    addSmoothScrolling();
    
    // Add input validation
    addInputValidation();
    
    // Add keyboard and click handlers
    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('click', handleClickOutside);
    
    // Add character counter for textarea
    const textarea = document.getElementById('global_messages');
    textarea.addEventListener('input', function() {
        const lines = this.value.split('\n').filter(line => line.trim());
        const counter = document.querySelector('.char-counter');
        if (counter) {
            counter.textContent = `${lines.length} messages`;
        }
    });
    
    // Add some visual feedback for better UX
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        if (input) {
            input.addEventListener('focus', () => {
                group.style.transform = 'translateY(-2px)';
                group.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            });
            
            input.addEventListener('blur', () => {
                group.style.transform = 'translateY(0)';
                group.style.boxShadow = 'none';
            });
        }
    });
});

// Prevent form submission on Enter key for inputs (except textarea)
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && event.target.tagName === 'INPUT') {
        event.preventDefault();
        // Move to next input
        const inputs = Array.from(document.querySelectorAll('input, textarea'));
        const currentIndex = inputs.indexOf(event.target);
        if (currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].focus();
        }
    }
});

// Add PWA-like features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Could register service worker here for offline functionality
        console.log('App loaded successfully');
    });
}

// Add haptic feedback for mobile devices
function addHapticFeedback() {
    if ('vibrate' in navigator) {
        document.querySelector('.btn-submit').addEventListener('click', () => {
            navigator.vibrate(50);
        });
        
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-copy') || e.target.classList.contains('btn-share')) {
                navigator.vibrate(30);
            }
        });
    }
}

// Initialize haptic feedback
addHapticFeedback();

// Export functions for global access
window.closePopup = closePopup;
window.copyToClipboard = copyToClipboard;
window.shareLink = shareLink;