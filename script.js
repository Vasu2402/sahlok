// ============================================
// SAHLOK INDIA - MODERN ANIMATIONS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initNavigation();
    setupFormHandler();
    initParallaxEffects();
    initCinematicScrollEffects();
    initHoverInteractions();
    initScrollToTopButton();
});

// ============================================
// SCROLL-BASED ANIMATIONS
// ============================================

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-scroll]');

    animatedElements.forEach((element, index) => {
        element.style.setProperty('--reveal-delay', `${Math.min(index * 55, 420)}ms`);
    });

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('show');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ============================================
// NAVIGATION - MOBILE & DESKTOP
// ============================================

function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    navItems.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
            }
        });
    });

    // Update active link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 80) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// ============================================
// CONTACT FORM HANDLER
// ============================================

function setupFormHandler() {
    const form = document.querySelector('.contact-form');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameInput = form.querySelector('input[name="name"]');
            const companyInput = form.querySelector('input[name="company"]');
            const emailInput = form.querySelector('input[name="email"]');
            const phoneInput = form.querySelector('input[name="phone"]');
            const messageInput = form.querySelector('textarea[name="message"]');
            const submitButton = form.querySelector('.submit-btn');

            if (!nameInput || !emailInput || !messageInput || !submitButton) {
                return;
            }

            const name = nameInput.value.trim();
            const company = companyInput ? companyInput.value.trim() : '';
            const email = emailInput.value.trim();
            const phone = phoneInput ? phoneInput.value.trim() : '';
            const message = messageInput.value.trim();

            if (!name || !email || !message) {
                alert('Please fill all fields');
                return;
            }

            const previousHTML = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.textContent = 'Redirecting...';

            const whatsappText = `*New Website Enquiry*
*Name:* ${name}
*Brand / Company:* ${company || '-'}
*Email:* ${email}
*Phone:* ${phone || '-'}

*Message:*
${message}`;

            const whatsappURL = `https://wa.me/919896662953?text=${encodeURIComponent(whatsappText)}`;
            
            setTimeout(() => {
                window.open(whatsappURL, '_blank');
                form.reset();
                submitButton.disabled = false;
                submitButton.innerHTML = previousHTML;
                showSuccessMessage('Redirected to WhatsApp');
            }, 500);
        });
    }
}

function showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// PARALLAX EFFECTS
// ============================================

function initParallaxEffects() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const heroImage = document.querySelector('.hero-visual');
    const navbar = document.querySelector('.global-nav');
    const heroSection = document.querySelector('.hero-section');
    let isTicking = false;

    const updateParallax = () => {
        const scrollPosition = window.scrollY;

        if (heroImage && heroSection) {
            const clampedScroll = Math.max(0, Math.min(scrollPosition, heroSection.offsetHeight));
            const y = clampedScroll * 0.12;
            const scale = 1 + Math.min(clampedScroll * 0.00008, 0.04);
            heroImage.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
        }

        if (navbar) {
            navbar.classList.toggle('scrolled', scrollPosition > 50);
        }

        isTicking = false;
    };

    window.addEventListener('scroll', () => {
        if (!isTicking) {
            window.requestAnimationFrame(updateParallax);
            isTicking = true;
        }
    }, { passive: true });

    updateParallax();
}

// ============================================
// CINEMATIC SCROLL EFFECTS
// ============================================

function initCinematicScrollEffects() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const scenes = document.querySelectorAll(
        '.about-container, .company-content, .services-grid, .strengths-grid, .why-us-container, .contact-container'
    );

    scenes.forEach((scene) => {
        scene.classList.add('scroll-scene');
    });

    let isTicking = false;

    const updateScenes = () => {
        const viewportHeight = window.innerHeight;

        scenes.forEach((scene) => {
            const rect = scene.getBoundingClientRect();

            if (rect.bottom < -80 || rect.top > viewportHeight + 80) {
                return;
            }

            const start = viewportHeight;
            const end = -rect.height * 0.4;
            const rawProgress = (start - rect.top) / (start - end);
            const progress = Math.max(0, Math.min(1, rawProgress));

            const translateY = (1 - progress) * 56;
            const scale = 0.965 + progress * 0.035;
            const opacity = 0.45 + progress * 0.55;

            scene.style.setProperty('--scene-y', `${translateY.toFixed(2)}px`);
            scene.style.setProperty('--scene-scale', scale.toFixed(3));
            scene.style.setProperty('--scene-opacity', opacity.toFixed(3));
        });

        isTicking = false;
    };

    window.addEventListener('scroll', () => {
        if (!isTicking) {
            window.requestAnimationFrame(updateScenes);
            isTicking = true;
        }
    }, { passive: true });

    window.addEventListener('resize', updateScenes);
    updateScenes();
}

// ============================================
// HOVER INTERACTIONS
// ============================================

function initHoverInteractions() {
    if (
        window.matchMedia('(hover: none)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
        return;
    }

    const interactiveBlocks = document.querySelectorAll(
        '.service-card, .strength-item, .why-item, .card-glass, .hero-visual, .about-visual, .contact-container, .company-content'
    );

    interactiveBlocks.forEach((block) => {
        block.addEventListener('mousemove', (event) => {
            const rect = block.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const percentX = (x / rect.width) * 100;
            const percentY = (y / rect.height) * 100;

            const normX = (x / rect.width - 0.5) * 2;
            const normY = (y / rect.height - 0.5) * 2;

            block.style.setProperty('--pointer-x', `${percentX.toFixed(2)}%`);
            block.style.setProperty('--pointer-y', `${percentY.toFixed(2)}%`);
            block.style.setProperty('--tilt-x', `${(-normY * 3.6).toFixed(2)}deg`);
            block.style.setProperty('--tilt-y', `${(normX * 3.6).toFixed(2)}deg`);
        });

        block.addEventListener('mouseleave', () => {
            block.style.setProperty('--pointer-x', '50%');
            block.style.setProperty('--pointer-y', '50%');
            block.style.setProperty('--tilt-x', '0deg');
            block.style.setProperty('--tilt-y', '0deg');
        });
    });
}

// ============================================
// SCROLL TO TOP BUTTON
// ============================================

function initScrollToTopButton() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: #000;
        color: #fff;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease, transform 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;

    document.body.appendChild(scrollButton);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollButton.style.opacity = '1';
            scrollButton.style.pointerEvents = 'auto';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.pointerEvents = 'none';
        }
    });

    scrollButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    scrollButton.addEventListener('mouseenter', () => {
        scrollButton.style.transform = 'scale(1.1)';
    });

    scrollButton.addEventListener('mouseleave', () => {
        scrollButton.style.transform = 'scale(1)';
    });
}

console.log('✨ Sahlok India Portfolio Loaded!');
