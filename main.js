document.addEventListener('DOMContentLoaded', () => {
    // Essential selectors - keep these as they're needed throughout the code
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    const navItems = document.querySelectorAll('.nav-links li');
    const contactForm = document.getElementById('contact-form');
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

    // Device detection - essential for performance decisions
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
    const isLowPerfDevice = isMobile && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

    // Apply minimal performance optimizations for mobile
    if (isMobile) {
        document.documentElement.style.scrollBehavior = 'auto';
    }

    // Essential hamburger menu functionality
    if (menuToggle) {
        // Reset menu to a known state
        navLinks.style.visibility = 'hidden';
        navLinks.style.opacity = '0';
        navLinks.style.pointerEvents = 'none';

        // Emergency menu fix function (keep for debugging)
        window.fixMenu = function () {
            menuToggle.classList.add('active');
            navLinks.classList.add('active');
            navLinks.style.opacity = '1';
            navLinks.style.visibility = 'visible';
            navLinks.style.pointerEvents = 'auto';
            navItems.forEach(item => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            });
        };

        // Main click handler (simplified)
        menuToggle.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();

            // Toggle classes
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            body.classList.toggle('menu-open');

            // Set explicit styles to ensure menu shows/hides correctly
            if (navLinks.classList.contains('active')) {
                navLinks.style.opacity = '1';
                navLinks.style.visibility = 'visible';
                navLinks.style.pointerEvents = 'auto';

                // Animate menu items
                navItems.forEach((item, index) => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                    item.style.transitionDelay = `${index * 0.1}s`;
                });
            } else {
                // Reset menu items first
                navItems.forEach(item => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    item.style.transitionDelay = '0s';
                });

                // Delay hiding the menu itself
                setTimeout(() => {
                    if (!navLinks.classList.contains('active')) {
                        navLinks.style.opacity = '0';
                        navLinks.style.visibility = 'hidden';
                        navLinks.style.pointerEvents = 'none';
                    }
                }, 300);
            }

            return false;
        };

        // Close menu when clicking a link with improved reliability
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');

                navItems.forEach(item => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    item.style.transitionDelay = '0s';
                });
            });
        });

        // Close menu when clicking outside - optimized for mobile
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') &&
                !e.target.closest('.nav-links') &&
                !e.target.closest('.menu-toggle')) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');

                navItems.forEach(item => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                });
            }
        });
    }

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (menuToggle && menuToggle.classList.contains('active')) {
                    menuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    body.style.overflow = '';

                    setTimeout(() => {
                        scrollToElement(targetElement);
                    }, isLowPerfDevice ? 100 : 300);
                } else {
                    scrollToElement(targetElement);
                }
            }
        });
    });

    // Scroll helper function
    function scrollToElement(element) {
        const headerOffset = isMobile ? 70 : 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        if (isLowPerfDevice) {
            window.scrollTo(0, offsetPosition);
        } else {
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Critical fix for About section numbers
    function fixAboutNumbers() {
        const statNumbers = document.querySelectorAll('.about-stats .number');
        statNumbers.forEach(stat => {
            // Apply multiple styling approaches to ensure numbers display
            stat.style.color = 'var(--accent-color)';
            stat.style.opacity = '1';

            // Fix gradient text rendering
            stat.style.background = 'linear-gradient(135deg, var(--accent-color) 0%, #5ac8fa 100%)';
            stat.style.webkitBackgroundClip = 'text';
            stat.style.backgroundClip = 'text';
        });
    }

    // Form validation
    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const submitButton = contactForm.querySelector('.submit-button');

        // Simple email validation
        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        // Show/hide error states
        function showError(input, message) {
            const formGroup = input.closest('.form-group');
            formGroup.classList.add('error');
            const errorMessage = formGroup.querySelector('.error-message');
            if (errorMessage) errorMessage.textContent = message;
        }

        function removeError(input) {
            input.closest('.form-group').classList.remove('error');
        }

        // Add input event listeners for real-time validation
        nameInput.addEventListener('input', () => {
            if (nameInput.value.trim().length > 0) removeError(nameInput);
        });

        emailInput.addEventListener('input', () => {
            if (isValidEmail(emailInput.value)) removeError(emailInput);
        });

        messageInput.addEventListener('input', () => {
            if (messageInput.value.trim().length > 0) removeError(messageInput);
        });

        // Form submission handler
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            // Validate fields
            if (nameInput.value.trim() === '') {
                showError(nameInput, 'Bitte geben Sie Ihren Namen ein');
                isValid = false;
            }

            if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Bitte geben Sie eine gültige E-Mail ein');
                isValid = false;
            }

            if (messageInput.value.trim() === '') {
                showError(messageInput, 'Bitte geben Sie Ihre Nachricht ein');
                isValid = false;
            }

            if (isValid) {
                // Store form data
                const formData = {
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    message: messageInput.value.trim(),
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent
                };

                storeFormDataLocally(formData);

                // Show loading state
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Wird gesendet...';
                submitButton.disabled = true;

                // Simulate form submission
                setTimeout(() => {
                    submitButton.textContent = 'Nachricht gesendet!';
                    submitButton.style.backgroundColor = 'var(--success-color)';
                    contactForm.reset();

                    setTimeout(() => {
                        submitButton.textContent = originalText;
                        submitButton.style.backgroundColor = '';
                        submitButton.disabled = false;
                    }, isLowPerfDevice ? 1500 : 2000);
                }, isLowPerfDevice ? 800 : 1000);
            } else {
                // Show validation errors
                contactForm.classList.add('shake');
                setTimeout(() => contactForm.classList.remove('shake'), 650);

                // Scroll to first error
                const firstError = contactForm.querySelector('.form-group.error');
                if (firstError) {
                    const y = firstError.getBoundingClientRect().top + window.pageYOffset -
                        (isMobile ? 120 : 100);
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }
        });

        // Form data storage function
        window.storeFormDataLocally = function (data) {
            try {
                const existingData = JSON.parse(localStorage.getItem('contactSubmissions')) || [];
                existingData.push(data);
                localStorage.setItem('contactSubmissions', JSON.stringify(existingData));

                window.getContactSubmissions = function () {
                    return JSON.parse(localStorage.getItem('contactSubmissions')) || [];
                };

                return true;
            } catch (error) {
                console.error("Error storing form data:", error);
                return false;
            }
        };
    }

    // Fix iOS viewport height
    function setMobileHeight() {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }
    setMobileHeight();
    window.addEventListener('resize', setMobileHeight);

    // Initialize form labels
    formInputs.forEach(input => {
        input.setAttribute('placeholder', ' ');

        const label = input.nextElementSibling;
        if (!label) return;

        if (input.value.trim() !== '') {
            label.classList.add('active');
        }

        input.addEventListener('focus', () => label.classList.add('active'));

        input.addEventListener('blur', () => {
            if (input.value.trim() === '') label.classList.remove('active');
        });
    });

    // Handle form reset
    if (contactForm) {
        const originalReset = contactForm.reset;
        contactForm.reset = function () {
            originalReset.call(this);
            setTimeout(() => {
                const formLabels = contactForm.querySelectorAll('.form-group label');
                formLabels.forEach(label => label.classList.remove('active'));
            }, 10);
        };
    }

    // CTA button setup
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function (e) {
            e.preventDefault();
            const contactSection = document.getElementById('contact');
            if (contactSection) scrollToElement(contactSection);
        });
    }

    // Run once on load
    window.addEventListener('load', fixAboutNumbers);

    // Run immediately
    fixAboutNumbers();
});

// Add enhanced animation for the service cards
window.addEventListener('load', () => {
    // Enhanced services section animations
    const servicesSection = document.getElementById('services');
    const cards = document.querySelectorAll('.card');
    const bundleBanner = document.querySelector('.bundle-banner');

    function animateServicesOnScroll() {
        if (!servicesSection) return;

        const rect = servicesSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;

        if (isVisible) {
            // Animate bundle banner
            if (bundleBanner) {
                setTimeout(() => {
                    bundleBanner.style.opacity = '1';
                    bundleBanner.style.transform = 'translateY(0)';
                }, 300);
            }

            // Staggered animation for cards
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 500 + (index * 200));
            });

            // Remove scroll listener once animated
            window.removeEventListener('scroll', animateServicesOnScroll);
        }
    }

    // Initialize cards for animation
    if (cards.length) {
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
    }

    // Initialize bundle banner for animation
    if (bundleBanner) {
        bundleBanner.style.opacity = '0';
        bundleBanner.style.transform = 'translateY(30px)';
        bundleBanner.style.transition = 'opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    }

    // Check if already in viewport on page load
    animateServicesOnScroll();

    // Add scroll listener
    window.addEventListener('scroll', animateServicesOnScroll, { passive: true });
});
