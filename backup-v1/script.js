/**
 * DR. COLUNA — INTERACTIVITY & ANIMATION LOGIC
 * Desenvolvido por Hawk Marketing / Arteli Codex
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Element References
    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.getElementById('mainNav');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const faqItems = document.querySelectorAll('.faq-item');
    const counters = document.querySelectorAll('.counter-number');
    const progressFills = document.querySelectorAll('.progress-fill');
    const progressPercentages = document.querySelectorAll('.bar-percentage');

    // --------------------------------------------------------------------------
    // 2. Header Scroll Effect
    // --------------------------------------------------------------------------
    const handleHeaderScroll = () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    // --------------------------------------------------------------------------
    // 3. Mobile Navigation Drawer
    // --------------------------------------------------------------------------
    const toggleMobileMenu = () => {
        const isOpen = mainNav.classList.contains('open');
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    };

    const openMobileMenu = () => {
        mainNav.classList.add('open');
        drawerOverlay.classList.add('active');
        mobileToggle.classList.add('open');
        mobileToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    };

    const closeMobileMenu = () => {
        mainNav.classList.remove('open');
        drawerOverlay.classList.remove('active');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }
    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });

    // --------------------------------------------------------------------------
    // 4. FAQ Accordion
    // --------------------------------------------------------------------------
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (!questionBtn) return;

        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherBtn = otherItem.querySelector('.faq-question');
                    if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                questionBtn.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('active');
                questionBtn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // --------------------------------------------------------------------------
    // 5. Contadores Numéricos Animados (IntersectionObserver)
    // --------------------------------------------------------------------------
    let countersStarted = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // 2s
            const frameRate = 1000 / 60; // 60 FPS
            const totalFrames = Math.round(duration / frameRate);
            let frame = 0;

            const countUp = () => {
                frame++;
                const progress = frame / totalFrames;
                // Easing out quadratic
                const currentCount = Math.round(target * (1 - Math.pow(1 - progress, 3)));
                
                if (target >= 1000) {
                    counter.innerText = currentCount.toLocaleString('pt-BR');
                } else {
                    counter.innerText = currentCount;
                }

                if (frame < totalFrames) {
                    requestAnimationFrame(countUp);
                } else {
                    if (target >= 1000) {
                        counter.innerText = target.toLocaleString('pt-BR');
                    } else {
                        counter.innerText = target;
                    }
                }
            };

            countUp();
        });
    };

    // --------------------------------------------------------------------------
    // 6. Barras de Progresso Animadas
    // --------------------------------------------------------------------------
    const animateProgressBars = () => {
        progressFills.forEach(fill => {
            const percent = fill.getAttribute('data-percent');
            fill.style.width = `${percent}%`;
        });

        progressPercentages.forEach(perc => {
            const target = +perc.getAttribute('data-percent');
            let count = 0;
            const step = () => {
                if (count < target) {
                    count++;
                    perc.innerText = `${count}%`;
                    setTimeout(step, 20);
                } else {
                    perc.innerText = `${target}%`;
                }
            };
            step();
        });
    };

    // Observer para Seção de Resultados / Estatísticas
    const statsSection = document.getElementById('resultados');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    animateCounters();
                    animateProgressBars();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });

        statsObserver.observe(statsSection);
    }

    // --------------------------------------------------------------------------
    // 7. Active Navigation Link on Scroll
    // --------------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id], footer[id]');
    
    const updateActiveNav = () => {
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPosition >= top && scrollPosition < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // --------------------------------------------------------------------------
    // 8. Rastreamento de Conversão (Google Ads / Meta Pixel)
    // --------------------------------------------------------------------------
    const trackWhatsAppConversion = (locationName) => {
        console.log(`[Conversão Registrada] Clique WhatsApp — Origem: ${locationName}`);
        
        // Simulação / Preparado para Google Ads GTAG
        if (typeof window.gtag === 'function') {
            window.gtag('event', 'conversion', {
                'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
                'event_category': 'WhatsApp',
                'event_label': locationName
            });
        }

        // Simulação / Preparado para Meta Pixel
        if (typeof window.fbq === 'function') {
            window.fbq('track', 'Contact', {
                content_name: locationName
            });
        }
    };

    // Bind em todos os botões e links de WhatsApp
    const whatsappButtons = document.querySelectorAll('a[href*="wa.me"], a.btn-whatsapp');
    whatsappButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const section = btn.closest('section, header, footer, aside, .top-bar');
            const location = section ? (section.id || section.className) : 'Geral';
            trackWhatsAppConversion(location);
        });
    });
});
