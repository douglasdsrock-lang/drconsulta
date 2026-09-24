/**
 * DR. COLUNA — INTERACTIVITY & ANIMATION LOGIC (VERSÃO 2.0 — PADRÃO AAA)
 * Desenvolvido por Hawk Marketing / Arteli Codex
 */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // 1. Element References
    // --------------------------------------------------------------------------
    const scrollProgressBar = document.getElementById('scrollProgressBar');
    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.getElementById('mainNav');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const faqItems = document.querySelectorAll('.faq-item');
    const counters = document.querySelectorAll('.counter-number');
    const progressFills = document.querySelectorAll('.progress-fill');
    const progressPercentages = document.querySelectorAll('.bar-percentage');
    
    // Unidades Tabs
    const unitTabs = document.querySelectorAll('.unit-tab-btn');
    const unitPanels = document.querySelectorAll('.unit-tab-panel');
    const copyAddressBtns = document.querySelectorAll('.btn-copy-address');

    // Triagem Interativa
    const triageChips = document.querySelectorAll('.triage-chip');
    const selectedSymptomText = document.getElementById('selectedSymptomText');
    const triageWaBtn = document.getElementById('triageWaBtn');

    // WhatsApp Popover
    const whatsappTriggerBtn = document.getElementById('whatsappTriggerBtn');
    const whatsappPopover = document.getElementById('whatsappPopover');
    const waCloseBtn = document.getElementById('waCloseBtn');

    // --------------------------------------------------------------------------
    // 2. Scroll Progress Bar & Header Shadow
    // --------------------------------------------------------------------------
    const handleScrollEffects = () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        if (scrollProgressBar) {
            scrollProgressBar.style.width = `${scrolled}%`;
        }

        if (header) {
            if (winScroll > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    };

    window.addEventListener('scroll', handleScrollEffects, { passive: true });
    handleScrollEffects();

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

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });

    // --------------------------------------------------------------------------
    // 4. Hub Interativo de Unidades (Tabs)
    // --------------------------------------------------------------------------
    if (unitTabs.length > 0) {
        unitTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetUnit = tab.getAttribute('data-unit');

                // Atualiza botões
                unitTabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');

                // Atualiza painéis
                unitPanels.forEach(panel => {
                    panel.classList.remove('active');
                });

                const targetPanel = document.getElementById(`panel-${targetUnit}`);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    }

    // Copiar Endereço com Feedback
    copyAddressBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const address = btn.getAttribute('data-copy');
            if (!address) return;

            navigator.clipboard.writeText(address).then(() => {
                const originalHtml = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-check text-green"></i> Endereço Copiado!';
                btn.style.color = '#10B981';

                setTimeout(() => {
                    btn.innerHTML = originalHtml;
                    btn.style.color = '';
                }, 2500);
            }).catch(err => {
                console.error('Falha ao copiar:', err);
            });
        });
    });

    // --------------------------------------------------------------------------
    // 5. Triagem Rápida de Sintomas (Auto-Avaliação Interativa)
    // --------------------------------------------------------------------------
    if (triageChips.length > 0) {
        triageChips.forEach(chip => {
            chip.addEventListener('click', () => {
                triageChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');

                const symptom = chip.getAttribute('data-symptom');
                const message = chip.getAttribute('data-msg');

                if (selectedSymptomText) {
                    selectedSymptomText.innerText = symptom;
                }

                if (triageWaBtn && message) {
                    triageWaBtn.setAttribute('href', `https://wa.me/5531999999999?text=${message}`);
                }
            });
        });
    }

    // --------------------------------------------------------------------------
    // 6. FAQ Accordion
    // --------------------------------------------------------------------------
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (!questionBtn) return;

        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Fecha outros itens
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherBtn = otherItem.querySelector('.faq-question');
                    if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle item atual
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
    // 7. Contadores Numéricos Animados & Barras de Progresso
    // --------------------------------------------------------------------------
    let countersStarted = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2200; // 2.2s
            const frameRate = 1000 / 60; // 60 FPS
            const totalFrames = Math.round(duration / frameRate);
            let frame = 0;

            const countUp = () => {
                frame++;
                const progress = frame / totalFrames;
                // Easing out cubic
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

    // Observer para Seção de Resultados
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
        }, { threshold: 0.2 });

        statsObserver.observe(statsSection);
    }

    // --------------------------------------------------------------------------
    // 8. Floating WhatsApp Popover Toggle
    // --------------------------------------------------------------------------
    if (whatsappTriggerBtn && whatsappPopover) {
        whatsappTriggerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            whatsappPopover.classList.toggle('active');
        });

        if (waCloseBtn) {
            waCloseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                whatsappPopover.classList.remove('active');
            });
        }

        // Fecha ao clicar fora
        document.addEventListener('click', (e) => {
            if (!whatsappPopover.contains(e.target) && e.target !== whatsappTriggerBtn) {
                whatsappPopover.classList.remove('active');
            }
        });
    }

    // --------------------------------------------------------------------------
    // 9. Active Navigation Link on Scroll
    // --------------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id], footer[id]');
    
    const sectionToNavMap = {
        'inicio': '#inicio',
        'especialidade': '#especialidade',
        'missao': '#especialidade',
        'unidades': '#unidades',
        'triagem': '#condicoes',
        'condicoes': '#condicoes',
        'resultados': '#condicoes',
        'como-funciona': '#condicoes',
        'depoimentos': '#contato',
        'faq': '#contato',
        'contato': '#contato'
    };

    const updateActiveNav = () => {
        const scrollPosition = window.scrollY + 140;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPosition >= top && scrollPosition < top + height) {
                const targetHref = sectionToNavMap[id] || `#${id}`;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === targetHref) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // --------------------------------------------------------------------------
    // 10. Rastreamento de Conversão (Google Ads / Meta Pixel)
    // --------------------------------------------------------------------------
    const trackWhatsAppConversion = (locationName) => {
        console.log(`[Conversão Registrada] Clique WhatsApp — Origem: ${locationName}`);
        
        if (typeof window.gtag === 'function') {
            window.gtag('event', 'conversion', {
                'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
                'event_category': 'WhatsApp',
                'event_label': locationName
            });
        }

        if (typeof window.fbq === 'function') {
            window.fbq('track', 'Contact', {
                content_name: locationName
            });
        }
    };

    const whatsappButtons = document.querySelectorAll('a[href*="wa.me"], a.btn-whatsapp');
    whatsappButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.closest('section, header, footer, aside, .top-bar, .whatsapp-popover');
            const location = section ? (section.id || section.className) : 'Geral';
            trackWhatsAppConversion(location);
        });
    });
});
