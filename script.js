// Initialize EmailJS with your credentials
(function(){
    emailjs.init("j3Rp7MZvbNjt1lyiM");
})();

// Check if device is touch-enabled
const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
};

// Only initialize custom cursor on non-touch devices
if (!isTouchDevice()) {
    // Custom cursor
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.5;
        cursorY += dy * 0.5;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }

    function animateFollower() {
        const dx = mouseX - followerX;
        const dy = mouseY - followerY;
        
        followerX += dx * 0.1;
        followerY += dy * 0.1;
        
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateFollower);
    }

    if (cursor) animateCursor();
    if (cursorFollower) animateFollower();

    // Add hover effect to cursor
    const hoverElements = document.querySelectorAll('a, button, .btn, .nav-link, .feature-card, .case-card, .tool-card, .value-item, .logic-item, .review-card, .chatbot-toggle, .send-btn');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor?.classList.add('hover');
            cursorFollower?.classList.add('hover');
        });
        element.addEventListener('mouseleave', () => {
            cursor?.classList.remove('hover');
            cursorFollower?.classList.remove('hover');
        });
    });
}

// Smooth scrolling - only on non-touch devices
if (!isTouchDevice()) {
    class SmoothScroll {
        constructor() {
            this.isScrolling = false;
            this.targetY = 0;
            this.currentY = window.pageYOffset;
            this.speed = 0.08;
            
            this.init();
        }
        
        init() {
            window.addEventListener('scroll', this.handleScroll.bind(this));
            window.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
            window.addEventListener('keydown', this.handleKeydown.bind(this));
            this.animate();
        }
        
        handleScroll() {
            if (!this.isScrolling) {
                this.currentY = window.pageYOffset;
            }
        }
        
        handleWheel(e) {
            e.preventDefault();
            this.targetY += e.deltaY;
            this.isScrolling = true;
        }
        
        handleKeydown(e) {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
                this.targetY += e.key === 'ArrowUp' ? -100 : 100;
                this.isScrolling = true;
            }
        }
        
        animate() {
            const diff = this.targetY - this.currentY;
            if (Math.abs(diff) > 0.5) {
                this.currentY += diff * this.speed;
                window.scrollTo(0, this.currentY);
            } else {
                this.currentY = this.targetY;
                this.isScrolling = false;
            }
            
            requestAnimationFrame(this.animate.bind(this));
        }
    }

    // Initialize smooth scrolling
    const smoothScroll = new SmoothScroll();
}

// Page loader
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.querySelector('.loader-container');
        if (loader) {
            loader.classList.add('hidden');
        }
    }, 1000);
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Simple particle system for home page
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        
        this.init();
        this.animate();
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
        
        window.addEventListener('resize', () => {
            this.init();
        });
    }
    
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Create particles
        this.particles = [];
        for (let i = 0; i < 80; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 3 + 1
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, i) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off walls
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(74, 108, 247, 0.5)';
            this.ctx.fill();
            
            // Connect particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[j].x - particle.x;
                const dy = this.particles[j].y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(74, 108, 247, ${0.2 * (1 - distance / 150)})`;
                    this.ctx.stroke();
                }
            }
            
            // Mouse interaction - only on non-touch devices
            if (!isTouchDevice() && this.mouse.x !== null && this.mouse.y !== null) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    const forceX = (dx / distance) * force * 2;
                    const forceY = (dy / distance) * force * 2;
                    
                    particle.x -= forceX;
                    particle.y -= forceY;
                }
            }
        });
        
        requestAnimationFrame(this.animate.bind(this));
    }
}

// Initialize particle system on home page
const particlesCanvas = document.getElementById('particles-js');
if (particlesCanvas) {
    new ParticleSystem(particlesCanvas);
}

// 3D Tilt effect for cards - only on non-touch devices
if (!isTouchDevice()) {
    class TiltEffect {
        constructor(element) {
            this.element = element;
            this.width = element.offsetWidth;
            this.height = element.offsetHeight;
            this.top = element.offsetTop;
            this.left = element.offsetLeft;
            
            this.init();
        }
        
        init() {
            this.element.addEventListener('mousemove', this.handleMove.bind(this));
            this.element.addEventListener('mouseleave', this.handleLeave.bind(this));
        }
        
        handleMove(e) {
            const x = e.pageX - this.left - this.width / 2;
            const y = e.pageY - this.top - this.height / 2;
            
            const xRotation = 20 * (y / (this.height / 2));
            const yRotation = -20 * (x / (this.width / 2));
            
            this.element.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale3d(1.05, 1.05, 1.05)`;
        }
        
        handleLeave() {
            this.element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        }
    }

    // Initialize tilt effects
    document.querySelectorAll('[data-tilt]').forEach(card => {
        new TiltEffect(card);
    });
}

// Typing animation
class TypeWriter {
    constructor(element, strings, options = {}) {
        this.element = element;
        this.strings = strings;
        this.stringIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.typeSpeed = options.typeSpeed || 50;
        this.deleteSpeed = options.deleteSpeed || 30;
        this.pauseTime = options.pauseTime || 2000;
        
        this.type();
    }
    
    type() {
        const currentString = this.strings[this.stringIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentString.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentString.substring(0, this.charIndex + 1);
            this.charIndex++;
        }
        
        let typeDelay = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
        
        if (!this.isDeleting && this.charIndex === currentString.length) {
            typeDelay = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.stringIndex = (this.stringIndex + 1) % this.strings.length;
            typeDelay = 500;
        }
        
        setTimeout(() => this.type(), typeDelay);
    }
}

// Initialize typing animation on tools page
const toolsTitle = document.querySelector('.tools-section .page-title');
if (toolsTitle) {
    new TypeWriter(toolsTitle, [
        'AI & Cybersecurity Tools',
        'Essential Security Solutions',
        'Digital Protection Tools'
    ], {
        typeSpeed: 50,
        deleteSpeed: 30,
        pauseTime: 2000
    });
}

// Dark Mode Toggle
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const body = document.body;

// Check for saved dark mode preference
const savedDarkMode = localStorage.getItem('darkMode');
if (savedDarkMode === 'true') {
    body.classList.add('dark-mode');
    updateDarkModeIcon();
}

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    updateDarkModeIcon();
});

function updateDarkModeIcon() {
    const icon = darkModeToggle.querySelector('i');
    if (body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Chatbot functionality
const chatbotToggle = document.querySelector('.chatbot-toggle');
const chatbot = document.querySelector('.chatbot');
const chatbotClose = document.querySelector('.chatbot-close');
const chatbotInput = document.querySelector('.chatbot-input input');
const sendBtn = document.querySelector('.send-btn');
const chatbotMessages = document.querySelector('.chatbot-messages');

// Enhanced chatbot scroll functionality
function setupChatbotScroll() {
    if (chatbotMessages) {
        // Ensure proper scroll styling
        chatbotMessages.style.overflowY = 'auto';
        chatbotMessages.style.maxHeight = '400px';
        chatbotMessages.style.scrollBehavior = 'smooth';
        
        // Add custom scrollbar styling
        const style = document.createElement('style');
        style.textContent = `
            .chatbot-messages::-webkit-scrollbar {
                width: 6px;
            }
            .chatbot-messages::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 3px;
            }
            .chatbot-messages::-webkit-scrollbar-thumb {
                background: rgba(74, 108, 247, 0.5);
                border-radius: 3px;
            }
            .chatbot-messages::-webkit-scrollbar-thumb:hover {
                background: rgba(74, 108, 247, 0.7);
            }
        `;
        document.head.appendChild(style);
        
        // Auto-scroll to bottom on new messages
        const observer = new MutationObserver(() => {
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        });
        
        observer.observe(chatbotMessages, {
            childList: true,
            subtree: true
        });
    }
}

// Initialize scroll setup
setupChatbotScroll();

if (chatbotToggle && chatbot) {
    chatbotToggle.addEventListener('click', () => {
        chatbot.classList.toggle('active');
        // Scroll to bottom when opening
        setTimeout(() => {
            if (chatbotMessages) {
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }
        }, 100);
    });
}

if (chatbotClose && chatbot) {
    chatbotClose.addEventListener('click', () => {
        chatbot.classList.remove('active');
    });
}

// Function to show typing indicator
function showTypingIndicator() {
    if (!chatbotMessages) return;
    
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('message', 'bot-message', 'typing-indicator');
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    chatbotMessages.appendChild(typingIndicator);
    
    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    
    return typingIndicator;
}

// Function to remove typing indicator
function removeTypingIndicator(indicator) {
    if (indicator && indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
    }
}

/* =======================
   PERSONALIZED CYBERSHIELD AI ASSISTANT
   Customized for your individual style and preferences
   Features: 
   - Natural introduction in first response and when asked
   - Context-aware responses
   - Enhanced error handling
   - Cooldown management
   - Typing animations
   - Character limits
   - Network resilience
   - Judge interview question support
======================= */
let isLoading = false;
let lastCallTime = 0;
const COOLDOWN_MS = 5000; // 5 seconds cooldown between responses
const MAX_MESSAGE_LENGTH = 300; // Maximum character limit for user messages
const MAX_RESPONSE_WORDS = 30; // Maximum words for AI responses

// JUDGE INTERVIEW QUESTIONS AND ANSWERS FOR CONTEXT
const JUDGE_QUESTIONS = {
    "What is CyberShield AI?": "CyberShield AI is a comprehensive cybersecurity platform providing AI-powered threat detection, prevention, and response solutions.",
    "Why did you build it?": "To address the growing need for accessible, intelligent cybersecurity protection for websites and digital assets.",
    "Who created it?": "Created by Arshman Anil & Muhammad Izhan, cybersecurity experts and AI developers.",
    "How does the AI work?": "Uses machine learning to analyze patterns, detect threats, and provide real-time security recommendations.",
    "What problem does it solve?": "Provides affordable, effective cybersecurity protection against evolving digital threats and vulnerabilities.",
    "What technologies does it use?": "JavaScript, HTML5, CSS3, OpenRouter API, EmailJS, and modern web technologies.",
    "How is cybersecurity incorporated?": "Through threat detection algorithms, secure communication protocols, and real-time monitoring systems.",
    "What are the limitations?": "Currently limited to web-based threats; expanding to mobile and IoT security in future updates.",
    "What model does the chatbot use?": "Uses meta-llama/llama-3.2-3b-instruct model from OpenRouter for efficient, accurate responses.",
    "How do you handle rate limits?": "Implements 5-second cooldown between messages and queue-based request management.",
    "Explain the user flow": "Users interact through an intuitive interface with chatbot, tools section, and contact form for comprehensive support.",
    "UI design decisions": "Minimalist, professional design with blue color scheme representing trust and security.",
    "Performance optimizations": "Optimized animations, lazy loading, and efficient API calls for smooth user experience.",
    "Security measures": "Secure API communication, data encryption, and user privacy protection protocols."
};

// CyberShield AI System Message - Defines the AI persona and behavior
const CYBERSHIELD_SYSTEM_MESSAGE = `You are CyberShield AI Model 1 (Trial), a specialized cybersecurity assistant created by Arshman Anil & Muhammad Izhan. 
Your purpose is to provide accurate, concise cybersecurity guidance, AI tips, and digital security help for the CyberShield AI website. 
Introduce yourself naturally in the first response and when asked about your identity or creators. 
Keep responses under 30 words, clear, and professional. If a question is outside your knowledge, politely say you cannot answer it. 
Maintain a helpful but professional tone focused on cybersecurity, AI, and website security topics.

Available judge interview answers for reference:
 ${JSON.stringify(JUDGE_QUESTIONS)}

Respond concisely and accurately to all cybersecurity, AI, and website-related questions.`;

/* =======================
   OPENROUTER API CALL WITH ENHANCED ERROR HANDLING
======================= */
async function getAIResponse(message) {
    try {
        // Browser-compatible API key retrieval
        const API_KEY = getApiKey();
        
        if (!API_KEY) {
            return "⚠️ API key not configured. Please add your OpenRouter API key to enable AI chatbot functionality.";
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`,
                "HTTP-Referer": window.location.href,
                "X-Title": "CyberShield AI"
            },
            body: JSON.stringify({
                model: "meta-llama/llama-3.2-3b-instruct", // Efficient free-tier model
                max_tokens: 80, // Slightly higher for better responses
                temperature: 0.2, // Lower temperature for more consistent, factual responses
                top_p: 0.9,
                frequency_penalty: 0.5,
                presence_penalty: 0.5,
                messages: [
                    { 
                        role: "system", 
                        content: CYBERSHIELD_SYSTEM_MESSAGE 
                    },
                    { role: "user", content: message }
                ]
            })
        });

        if (!response.ok) {
            // Enhanced error handling with specific messages
            if (response.status === 401) {
                return "⚠️ Invalid API key. Please check your OpenRouter API configuration.";
            } else if (response.status === 429) {
                return "⚠️ Too many requests. Please wait a few seconds before asking another question.";
            } else if (response.status === 403) {
                return "⚠️ Access denied. Please verify your API key permissions.";
            } else if (response.status >= 500) {
                return "⚠️ Server error. Please try again later.";
            } else {
                return "⚠️ Unable to process your request. Please try again.";
            }
        }

        const data = await response.json();
        
        // Validate response structure
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            return "⚠️ Invalid response format. Please try again.";
        }

        const aiResponse = data.choices[0].message.content;
        
        // Ensure response is within word limit and relevant
        if (!aiResponse || aiResponse.trim().length === 0) {
            return "⚠️ No response generated. Please try a different question.";
        }

        // Trim and ensure professional tone
        return aiResponse.trim();

    } catch (error) {
        console.error("AI API Error:", error);
        
        // Network-specific error handling
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            return "⚠️ Network connection issue. Please check your internet connection.";
        }
        
        return "⚠️ System error. Please try again later.";
    }
}

// Browser-compatible API key function
function getApiKey() {
    // Check for data attribute on script tag
    const scriptTag = document.querySelector('script[src*="script.js"]');
    if (scriptTag && scriptTag.dataset.apiKey) {
        return scriptTag.dataset.apiKey;
    }
    
    // Check for global variable
    if (window.OPENROUTER_API_KEY) {
        return window.OPENROUTER_API_KEY;
    }
    
    // Fallback to default (for development)
    return "YOUR_API_KEY_HERE";
}

/* =======================
   DISPLAY BOT MESSAGE WITH TYPING ANIMATION
======================= */
function displayBotMessage(text) {
    if (!chatbotMessages) return;

    const botMessage = document.createElement("div");
    botMessage.classList.add("message", "bot-message", "typing");
    chatbotMessages.appendChild(botMessage);

    let index = 0;
    const typing = setInterval(() => {
        if (index < text.length) {
            botMessage.textContent = text.slice(0, index + 1);
            index++;
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        } else {
            clearInterval(typing);
            botMessage.classList.remove("typing");
        }
    }, 20); // Slightly faster typing for better UX
}

/* =======================
   SEND MESSAGE FUNCTION WITH ENHANCED VALIDATION
======================= */
async function sendMessage() {
    const now = Date.now();

    // Cooldown check - prevents spamming
    if (now - lastCallTime < COOLDOWN_MS) {
        displayBotMessage("⚠️ Please wait 5 seconds before sending another message.");
        return;
    }

    // Prevent double submissions
    if (isLoading) return;
    isLoading = true;
    sendBtn.disabled = true;

    if (!chatbotInput || !chatbotMessages) {
        isLoading = false;
        sendBtn.disabled = false;
        return;
    }

    const message = chatbotInput.value.trim();
    
    // Input validation
    if (!message) {
        isLoading = false;
        sendBtn.disabled = false;
        return;
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
        displayBotMessage(`⚠️ Message too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.`);
        isLoading = false;
        sendBtn.disabled = false;
        return;
    }

    // Update cooldown timestamp
    lastCallTime = now;

    // Add user message with proper formatting
    const userMessage = document.createElement("div");
    userMessage.classList.add("message", "user-message");
    userMessage.textContent = message;
    chatbotMessages.appendChild(userMessage);

    // Clear input and maintain focus
    chatbotInput.value = "";
    chatbotInput.focus();

    // Show typing indicator
    const typingIndicator = showTypingIndicator();

    try {
        // Get AI response with enhanced error handling
        const aiResponse = await getAIResponse(message);
        
        // Remove typing indicator
        removeTypingIndicator(typingIndicator);
        
        // Display AI response with typing animation
        displayBotMessage(aiResponse);

    } catch (error) {
        // Fallback error handling
        removeTypingIndicator(typingIndicator);
        displayBotMessage("⚠️ An unexpected error occurred. Please try again.");
        console.error("Chatbot Error:", error);
    }

    // Ensure scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    // Reset loading state
    isLoading = false;
    sendBtn.disabled = false;
}

/* =======================
   EVENT LISTENERS WITH PREVENTIVE MEASURES
======================= */
if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
}

if (chatbotInput) {
    chatbotInput.addEventListener("keydown", (e) => {
        // Allow Enter to send, Shift+Enter for new line
        if (e.key === "Enter" && !e.shiftKey && !isLoading) {
            e.preventDefault();
            sendMessage();
        }
    });
}

// Contact form submission with EmailJS - FIXED VERSION
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm && formMessage) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        const btnText = document.getElementById('btnText');
        const btnIcon = document.getElementById('btnIcon');
        
        // Show sending animation
        submitBtn.disabled = true;
        btnText.textContent = '';
        btnIcon.style.display = 'none';
        document.getElementById('sendingAnimation').style.display = 'flex';
        
        try {
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Send email using EmailJS
            await emailjs.send('service_bxjlu3p', 'template_986i0r6', formData);
            
            // Hide sending animation and show success message
            submitBtn.disabled = false;
            btnText.textContent = 'Send Message';
            btnIcon.style.display = 'inline-flex';
            document.getElementById('sendingAnimation').style.display = 'none';
            
            formMessage.textContent = 'Your message has been sent successfully!';
            formMessage.className = 'form-message success show';
            
            // Reset form
            contactForm.reset();
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.classList.remove('show');
            }, 5000);
            
        } catch (error) {
            // Handle error
            console.error('EmailJS Error:', error);
            
            // Hide sending animation
            submitBtn.disabled = false;
            btnText.textContent = 'Send Message';
            btnIcon.style.display = 'inline-flex';
            document.getElementById('sendingAnimation').style.display = 'none';
            
            // Show error message
            formMessage.textContent = 'Failed to send message. Please try again later.';
            formMessage.className = 'form-message error show';
            
            // Hide error message after 5 seconds
            setTimeout(() => {
                formMessage.classList.remove('show');
            }, 5000);
        }
    });
}

// Scroll animations
const animateElements = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, {
    threshold: 0.1
});

animateElements.forEach(element => {
    observer.observe(element);
});

// Filter functionality for tools
const filterButtons = document.querySelectorAll('.filter-btn');
const toolCards = document.querySelectorAll('.tool-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const category = button.getAttribute('data-category');
        
        // Filter tools
        toolCards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.classList.remove('hide');
            } else {
                card.classList.add('hide');
            }
        });
    });
});

// Initialize particles.js if on hero page
if (document.getElementById('particles-js')) {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#4a6cf7'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.5,
                random: false,
                anim: {
                    enable: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#4a6cf7',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 1
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
}
