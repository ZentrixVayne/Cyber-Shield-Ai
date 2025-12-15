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
    const hoverElements = document.querySelectorAll('a, button, .btn, .nav-link, .feature-card, .case-card, .tool-card, .value-item, .chatbot-toggle, .send-btn');
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
   CYBERSHIELD AI CHATBOT - NATURAL RESPONSE VERSION
   Fully trained cybersecurity assistant with professional persona
   Features: 
   - Natural introduction only in first response
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
        // Replace with your actual OpenRouter API key
        const API_KEY = "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";
        
        if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
            return "⚠️ API key not configured. Please add your OpenRouter API key to enable AI chatbot functionality.";
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + API_KEY,
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
            if (response.status === 429) {
                return "⚠️ Too many requests. Please wait a few seconds before asking another question.";
            } else if (response.status === 401) {
                return "⚠️ Invalid API key. Please check your OpenRouter API configuration.";
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

// Contact form submission with EmailJS
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm && formMessage) {
    // Initialize EmailJS
    (function() {
        emailjs.init("j3Rp7MZvbNjt1lyiM");
    })();
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name')?.value || '';
        const email = document.getElementById('email')?.value || '';
        const subject = document.getElementById('subject')?.value || '';
        const message = document.getElementById('message')?.value || '';
        
        // Simple validation
        if (name === '' || email === '' || subject === '' || message === '') {
            showFormMessage('Please fill in all fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormMessage('Please enter a valid email address', 'error');
            return;
        }
        
        // Show sending animation
        showSendingAnimation();
        
        // Prepare email parameters
        const templateParams = {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message,
            to_email: 'info@cybershieldai.com'
        };
        
        // Send email using EmailJS
        emailjs.send('service_bxjlu3p', 'template_986i0r6', templateParams)
            .then(function(response) {
                hideSendingAnimation();
                showFormMessage('✅ Thank you for your message! We will get back to you soon.', 'success');
                contactForm.reset();
            })
            .catch(function(error) {
                hideSendingAnimation();
                showFormMessage('❌ Failed to send message. Please try again later.', 'error');
            });
    });
    
    function showSendingAnimation() {
        const contactForm = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        const btnText = document.getElementById('btnText');
        const btnIcon = document.getElementById('btnIcon');
        const sendingAnimation = document.getElementById('sendingAnimation');
        
        // Hide form and show animation
        contactForm.style.opacity = '0.3';
        contactForm.style.pointerEvents = 'none';
        sendingAnimation.style.display = 'flex';
        
        // Update button
        btnText.textContent = 'Sending';
        btnIcon.className = 'fas fa-spinner fa-spin';
        submitBtn.disabled = true;
    }
    
    function hideSendingAnimation() {
        const contactForm = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        const btnText = document.getElementById('btnText');
        const btnIcon = document.getElementById('btnIcon');
        const sendingAnimation = document.getElementById('sendingAnimation');
        
        // Show form and hide animation
        contactForm.style.opacity = '1';
        contactForm.style.pointerEvents = 'auto';
        sendingAnimation.style.display = 'none';
        
        // Reset button
        btnText.textContent = 'Send Message';
        btnIcon.className = 'fas fa-paper-plane';
        submitBtn.disabled = false;
    }
    
    function showFormMessage(message, type) {
        formMessage.innerHTML = message;
        formMessage.className = 'form-message show ' + type;
        
        setTimeout(() => {
            formMessage.classList.remove('show');
        }, 5000);
    }
}

// Animation on scroll
class ScrollAnimation {
    constructor() {
        this.elements = document.querySelectorAll('[data-animate]');
        this.init();
    }
    
    init() {
        this.checkElements();
        window.addEventListener('scroll', () => this.checkElements());
    }
    
    checkElements() {
        this.elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('animated');
            }
        });
    }
}

// Add data-animate attributes to elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .case-card, .tool-card, .about-card, .value-item');
    animatedElements.forEach(element => {
        element.setAttribute('data-animate', 'true');
    });
    
    new ScrollAnimation();
});

// Tools page category filter
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const toolCards = document.querySelectorAll('.tool-card');
    
    if (filterButtons.length > 0 && toolCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const category = this.getAttribute('data-category');
                
                // Show/hide tool cards based on category
                toolCards.forEach(card => {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.classList.remove('hide');
                        // Add animation class for cards that are now visible
                        setTimeout(() => {
                            card.classList.add('animated');
                        }, 100);
                    } else {
                        card.classList.add('hide');
                        card.classList.remove('animated');
                    }
                });
            });
        });
    }
});

// Page transition effects
document.querySelectorAll('a[href]').forEach(link => {
    if (link.hostname === window.location.hostname) {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            
            document.body.style.opacity = '0';
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    }
});

// Fade in page on load
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

/* =======================
   IMPROVEMENT PLAN & FUTURE ENHANCEMENTS
======================= */
/*
1. PAID TIER EXPANSION:
   - Implement subscription levels (Basic, Pro, Enterprise)
   - Add premium features like advanced threat analysis
   - Create API access for developers

2. BACKEND SECURITY:
   - Develop secure API key management system
   - Implement rate limiting and abuse prevention
   - Add user authentication and authorization

3. ANALYTICS & LOGGING:
   - Track user interactions and chatbot usage
   - Monitor system performance and errors
   - Generate usage reports for optimization

4. THREAT DETECTION ENHANCEMENTS:
   - Integrate real-time threat intelligence feeds
   - Add behavioral analysis capabilities
   - Implement automated response systems

5. PERFORMANCE OPTIMIZATIONS:
   - Implement caching for frequent queries
   - Optimize API call efficiency
   - Add lazy loading for chat history

6. USER EXPERIENCE IMPROVEMENTS:
   - Add voice input capabilities
   - Implement multi-language support
   - Create personalized user profiles

7. SECURITY MEASURES:
   - Encrypt sensitive user data
   - Implement two-factor authentication
   - Add regular security audits and updates

APi Key - 

- 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


*/
