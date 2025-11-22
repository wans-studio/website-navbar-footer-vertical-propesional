// Main JavaScript file

// Navbar functionality
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTopBtn = document.getElementById('scrollTop');

// Mobile menu toggle
navToggle?.addEventListener('click', () => {
    navbar.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 992) {
            navbar.classList.remove('active');
        }
    });
});

// Smooth scroll and active link highlighting
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop;
            window.scrollTo({
                top: offsetTop - 20,
                behavior: 'smooth'
            });
        }
        
        // Update active link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Scroll event for navbar and scroll-to-top button
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Show/hide scroll to top button
    if (currentScroll > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
    
    // Update active nav link based on scroll position
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
    
    lastScroll = currentScroll;
});

// Scroll to top functionality
scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Counter animation for statistics
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            animateCounter(entry.target);
            entry.target.classList.add('counted');
        }
    });
}, observerOptions);

// Observe all stat numbers
const statNumbers = document.querySelectorAll('.stat-number');
statNumbers.forEach(stat => statsObserver.observe(stat));

// Testimonial slider
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialPrev = document.querySelector('.testimonial-prev');
const testimonialNext = document.querySelector('.testimonial-next');
const dots = document.querySelectorAll('.dot');
let currentTestimonial = 0;
let testimonialInterval;

const showTestimonial = (index) => {
    testimonialCards.forEach(card => card.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    testimonialCards[index].classList.add('active');
    dots[index].classList.add('active');
};

const nextTestimonial = () => {
    currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
    showTestimonial(currentTestimonial);
};

const prevTestimonial = () => {
    currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
    showTestimonial(currentTestimonial);
};

testimonialNext?.addEventListener('click', () => {
    nextTestimonial();
    resetTestimonialInterval();
});

testimonialPrev?.addEventListener('click', () => {
    prevTestimonial();
    resetTestimonialInterval();
});

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentTestimonial = index;
        showTestimonial(currentTestimonial);
        resetTestimonialInterval();
    });
});

// Auto-play testimonial slider
const startTestimonialInterval = () => {
    testimonialInterval = setInterval(nextTestimonial, 5000);
};

const resetTestimonialInterval = () => {
    clearInterval(testimonialInterval);
    startTestimonialInterval();
};

startTestimonialInterval();

// FAQ accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        faqItems.forEach(faq => faq.classList.remove('active'));
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Contact form validation
const contactForm = document.getElementById('contactForm');

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePhone = (phone) => {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

const showError = (input, message) => {
    const formGroup = input.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');
    
    formGroup.classList.add('error');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
};

const clearError = (input) => {
    const formGroup = input.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');
    
    formGroup.classList.remove('error');
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
};

const validateForm = () => {
    let isValid = true;
    
    // Name validation
    const nameInput = document.getElementById('name');
    if (nameInput.value.trim() === '') {
        showError(nameInput, 'Nama lengkap harus diisi');
        isValid = false;
    } else if (nameInput.value.trim().length < 3) {
        showError(nameInput, 'Nama minimal 3 karakter');
        isValid = false;
    } else {
        clearError(nameInput);
    }
    
    // Email validation
    const emailInput = document.getElementById('email');
    if (emailInput.value.trim() === '') {
        showError(emailInput, 'Email harus diisi');
        isValid = false;
    } else if (!validateEmail(emailInput.value)) {
        showError(emailInput, 'Format email tidak valid');
        isValid = false;
    } else {
        clearError(emailInput);
    }
    
    // Phone validation
    const phoneInput = document.getElementById('phone');
    if (phoneInput.value.trim() === '') {
        showError(phoneInput, 'Nomor telepon harus diisi');
        isValid = false;
    } else if (!validatePhone(phoneInput.value)) {
        showError(phoneInput, 'Format nomor telepon tidak valid');
        isValid = false;
    } else {
        clearError(phoneInput);
    }
    
    // Subject validation
    const subjectInput = document.getElementById('subject');
    if (subjectInput.value.trim() === '') {
        showError(subjectInput, 'Subjek harus diisi');
        isValid = false;
    } else {
        clearError(subjectInput);
    }
    
    // Message validation
    const messageInput = document.getElementById('message');
    if (messageInput.value.trim() === '') {
        showError(messageInput, 'Pesan harus diisi');
        isValid = false;
    } else if (messageInput.value.trim().length < 10) {
        showError(messageInput, 'Pesan minimal 10 karakter');
        isValid = false;
    } else {
        clearError(messageInput);
    }
    
    return isValid;
};

contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateForm()) {
        // Form is valid, show success message
        alert('Terima kasih! Pesan Anda telah berhasil dikirim. Tim kami akan segera menghubungi Anda.');
        contactForm.reset();
        
        // Clear all errors
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => clearError(input));
    } else {
        // Scroll to first error
        const firstError = contactForm.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

// Real-time validation
const formInputs = contactForm?.querySelectorAll('input, textarea');
formInputs?.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() !== '') {
            if (input.id === 'email' && !validateEmail(input.value)) {
                showError(input, 'Format email tidak valid');
            } else if (input.id === 'phone' && !validatePhone(input.value)) {
                showError(input, 'Format nomor telepon tidak valid');
            } else {
                clearError(input);
            }
        }
    });
    
    input.addEventListener('input', () => {
        if (input.parentElement.classList.contains('error')) {
            clearError(input);
        }
    });
});

// Search functionality
const searchInput = document.getElementById('searchInput');

searchInput?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm.length > 2) {
        // Simple search implementation - highlights matching sections
        const sections = document.querySelectorAll('section');
        let found = false;
        
        sections.forEach(section => {
            const text = section.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                section.style.backgroundColor = 'rgba(0, 102, 204, 0.05)';
                if (!found) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    found = true;
                }
            } else {
                section.style.backgroundColor = '';
            }
        });
    } else {
        // Clear highlights
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.style.backgroundColor = '';
        });
    }
});

// Intersection Observer for scroll animations
const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Add fade-in animation to cards
const animatedElements = document.querySelectorAll('.feature-card, .service-card, .blog-card, .portfolio-item, .team-card');
animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(element);
});

// CTA buttons functionality
const ctaButtons = document.querySelectorAll('.nav-cta, .btn-primary, .btn-secondary');
ctaButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        if (!button.closest('form')) {
            e.preventDefault();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Service buttons
const serviceButtons = document.querySelectorAll('.btn-service');
serviceButtons.forEach(button => {
    button.addEventListener('click', () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
            
            // Pre-fill service in contact form
            const serviceSelect = document.getElementById('service');
            const serviceName = button.closest('.service-card').querySelector('h3').textContent;
            
            // Map service names to select options
            const serviceMap = {
                'Web Development': 'web',
                'Mobile App Development': 'mobile',
                'Cloud Solutions': 'cloud',
                'Digital Marketing': 'marketing',
                'UI/UX Design': 'design',
                'Data Analytics': 'analytics'
            };
            
            if (serviceSelect && serviceMap[serviceName]) {
                serviceSelect.value = serviceMap[serviceName];
            }
        }
    });
});

// Portfolio item click
const portfolioItems = document.querySelectorAll('.portfolio-item');
portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
        const title = item.querySelector('h3').textContent;
        alert(`Portfolio: ${title}\n\nDetail proyek akan segera tersedia. Hubungi kami untuk informasi lebih lanjut.`);
    });
});

// Video placeholder click
const videoPlaceholder = document.querySelector('.video-placeholder');
videoPlaceholder?.addEventListener('click', () => {
    alert('Video pengenalan akan segera tersedia. Terima kasih atas minat Anda!');
});

// Blog link functionality
const blogLinks = document.querySelectorAll('.blog-link');
blogLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const title = link.closest('.blog-card').querySelector('h3').textContent;
        alert(`Artikel: ${title}\n\nHalaman artikel lengkap akan segera tersedia.`);
    });
});

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class to body for CSS animations
    document.body.classList.add('loaded');
    
    // Trigger initial counter animation if stats are in viewport
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const rect = aboutSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
            statNumbers.forEach(stat => {
                if (!stat.classList.contains('counted')) {
                    animateCounter(stat);
                    stat.classList.add('counted');
                }
            });
        }
    }
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 992) {
            navbar.classList.remove('active');
        }
    }, 250);
});

// Prevent default behavior for demo links
document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
    });
});

console.log('ProCompany website loaded successfully!');