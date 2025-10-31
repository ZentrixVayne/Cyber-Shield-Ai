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

// Function to call OpenRouter API
async function getAIResponse(message) {
    try {
        // IMPORTANT: Replace YOUR_API_KEY_HERE with your actual OpenRouter API key
        const API_KEY = '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';
        
        // If you have a new API key, replace it above
        // Make sure it starts with 'sk-or-v1-'
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'CyberShield AI Assistant'
            },
            body: JSON.stringify({
                // Using a reliable free model
                model: 'meta-llama/llama-3.2-3b-instruct:free',
                max_tokens: 60, // Reduced for shorter messages
                temperature: 0.3, // Lower for more concise responses
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful cybersecurity assistant created by CyberShield AI. Your owners are CyberShield AI, Arshman Anil, and Muhammad Izhan. Provide very short, concise answers. Maximum 30 words. Be direct and helpful.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ]
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API Error Details:', errorData);
            
            if (response.status === 401) {
                return '⚠️ Authentication error: Check your API key.';
            } else if (response.status === 429) {
                return '⚠️ Rate limit exceeded. Try again later.';
            } else if (response.status === 403) {
                return '⚠️ Access forbidden. Model unavailable.';
            } else {
                return `⚠️ API Error (${response.status}). Try again.`;
            }
        }
        
        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error('Invalid API response:', data);
            return '⚠️ Invalid response. Try again.';
        }
        
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error calling AI API:', error);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            return '⚠️ Network error. Check connection.';
        }
        
        return '⚠️ Error occurred. Try again later.';
    }
}

// Function to display bot message with typing animation
function displayBotMessage(text) {
    if (!chatbotMessages) return;
    
    const botMessage = document.createElement('div');
    botMessage.classList.add('message', 'bot-message');
    chatbotMessages.appendChild(botMessage);
    
    // Typing animation
    let index = 0;
    const typingInterval = setInterval(() => {
        if (index < text.length) {
            botMessage.textContent = text.substring(0, index + 1);
            index++;
            // Scroll to bottom as text appears
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        } else {
            clearInterval(typingInterval);
        }
    }, 15); // Slightly faster for short messages
    
    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Function to send message and get AI response
async function sendMessage() {
    if (!chatbotInput || !chatbotMessages) return;
    
    const message = chatbotInput.value.trim();
    if (message === '') return;
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.classList.add('message', 'user-message');
    userMessage.textContent = message;
    chatbotMessages.appendChild(userMessage);
    
    // Clear input
    chatbotInput.value = '';
    
    // Show typing indicator
    const typingIndicator = showTypingIndicator();
    
    // Get AI response
    const aiResponse = await getAIResponse(message);
    
    // Remove typing indicator
    removeTypingIndicator(typingIndicator);
    
    // Display AI response with typing animation
    displayBotMessage(aiResponse);
    
    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
}

if (chatbotInput) {
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
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
