// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.98)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        }
    });

    // Initialize EmailJS
    emailjs.init('ImQmKbmyodHBk40WS'); // Tu Public Key

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('.form-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            // Send email using EmailJS
            emailjs.sendForm('service_kg3fqz5', 'template_f7lmfgx', this)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    
                    // Show success message
                    showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
                    
                    // Reset form
                    contactForm.reset();
                    
                }, function(error) {
                    console.log('FAILED...', error);
                    
                    // Show error message
                    showNotification('Error al enviar el mensaje. Por favor, intenta nuevamente.', 'error');
                })
                .finally(function() {
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Different animations for different sections (excluding about-card)
                if (entry.target.classList.contains('service-card')) {
                    entry.target.classList.add('fade-in-scale');
                } else if (entry.target.classList.contains('case-card')) {
                    entry.target.classList.add('slide-in-left');
                } else if (entry.target.classList.contains('contact-info')) {
                    entry.target.classList.add('slide-in-left');
                } else if (entry.target.classList.contains('contact-form')) {
                    entry.target.classList.add('slide-in-right');
                } else {
                    entry.target.classList.add('fade-in-scale');
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation (excluding about-card)
    const animateElements = document.querySelectorAll('.service-card, .case-card, .contact-info, .contact-form');
    animateElements.forEach(el => observer.observe(el));

    // Counter animation for metrics
    function animateCounters() {
        const counters = document.querySelectorAll('.metric-value');
        
        counters.forEach(counter => {
            const target = counter.textContent;
            const isPercentage = target.includes('%');
            const isMultiplier = target.includes('x');
            const numericValue = parseInt(target.replace(/[^\d]/g, ''));
            
            let current = 0;
            const increment = numericValue / 50;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    current = numericValue;
                    clearInterval(timer);
                }
                
                let displayValue = Math.floor(current);
                if (isPercentage) {
                    displayValue += '%';
                } else if (isMultiplier) {
                    displayValue += 'x';
                }
                
                counter.textContent = displayValue;
            }, 20);
        });
    }

    // Trigger counter animation when cases section is visible
    const casesSection = document.querySelector('.cases');
    if (casesSection) {
        const casesObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    casesObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        casesObserver.observe(casesSection);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10B981' : '#22D3EE'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 350px;
        `;
        
        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0;
            margin-left: auto;
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Add loading states to service CTAs
    const serviceCTAs = document.querySelectorAll('.service-cta');
    serviceCTAs.forEach(cta => {
        cta.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Scroll to contact form
            const contactSection = document.querySelector('#contacto');
            const offsetTop = contactSection.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Pre-fill service selection
            setTimeout(() => {
                const serviceSelect = document.querySelector('#servicio');
                const serviceName = this.textContent.toLowerCase();
                
                if (serviceName.includes('pdf')) {
                    serviceSelect.value = 'pdf-rag';
                } else if (serviceName.includes('qr')) {
                    serviceSelect.value = 'qr-automation';
                } else if (serviceName.includes('generador')) {
                    serviceSelect.value = 'generador-propuestas';
                }
                
                // Add highlight effect
                serviceSelect.style.borderColor = '#22D3EE';
                serviceSelect.style.boxShadow = '0 0 0 3px rgba(34, 211, 238, 0.1)';
                
                setTimeout(() => {
                    serviceSelect.style.borderColor = '';
                    serviceSelect.style.boxShadow = '';
                }, 2000);
            }, 1000);
        });
    });

    // Parallax effect for hero background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroHeight = hero.offsetHeight;
        
        if (scrolled < heroHeight) {
            const parallaxSpeed = scrolled * 0.5;
            hero.style.transform = `translateY(${parallaxSpeed}px)`;
        }
    });

    // Add hover effects to cards
    const cards = document.querySelectorAll('.about-card, .service-card, .case-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Form validation
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Validation rules
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo es obligatorio';
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Ingresa un email válido';
            }
        }

        if (!isValid) {
            field.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errorMessage;
            errorDiv.style.cssText = `
                color: #F87171;
                font-size: 0.875rem;
                margin-top: 5px;
            `;
            field.parentNode.appendChild(errorDiv);
        }

        return isValid;
    }

    // Add error styles to CSS
    const style = document.createElement('style');
    style.textContent = `
        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
            border-color: #F87171;
            box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.1);
        }
    `;
    document.head.appendChild(style);
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll events
const debouncedScrollHandler = debounce(function() {
    // Scroll-based animations can be added here
}, 10);