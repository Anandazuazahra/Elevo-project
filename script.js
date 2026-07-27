/**
 * Elevo Studioo - Dynamic CMS-Driven Renderer & UI Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Load Data from CMS Store
    const cmsData = getElevoData();
    renderCMSContent(cmsData);

    // 2. Setup Event Listeners after rendering
    setupPortfolioFilters();
    setupPortfolioModal();
    setupFAQAccordion();
    setupNavScrollActive();
    setupRevealAnimations();
});

// Render Dynamic CMS Content
function renderCMSContent(data) {
    if (!data) return;

    // Render General Settings
    const { general, stats, portfolio, pricing, faq } = data;
    const waNum = general.whatsappNumber || "62895634887437";

    // Top Banner
    const promoBannerSpan = document.querySelector('.promo-banner span');
    if (promoBannerSpan && general.promoBannerText) {
        promoBannerSpan.innerHTML = general.promoBannerText;
    }

    // Hero Text & Prices
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.innerHTML = `${general.heroTitlePrefix || 'UPGRADE BISNIS ANDA DENGAN '} <span class="highlight-cyan">${general.heroTitleHighlight || 'WEBSITE BARU'}</span>`;
    }

    const heroSub = document.querySelector('.hero-subtitle');
    if (heroSub && general.heroSubtitle) {
        heroSub.textContent = general.heroSubtitle;
    }

    const oldPriceEl = document.querySelector('.offer-box .old-price');
    if (oldPriceEl && general.oldPrice) oldPriceEl.textContent = general.oldPrice;

    const mainPriceEl = document.querySelector('.offer-box .main-price');
    if (mainPriceEl && general.promoPrice) mainPriceEl.textContent = general.promoPrice;

    const mobilePriceVal = document.querySelector('.mobile-price-tag .val');
    if (mobilePriceVal && general.promoPrice) mobilePriceVal.textContent = general.promoPrice;

    // Social Links & WA Links
    const waLinks = document.querySelectorAll('a[href*="wa.me"]');
    waLinks.forEach(link => {
        const currentHref = link.getAttribute('href');
        const textParam = currentHref.includes('text=') ? currentHref.split('text=')[1] : '';
        link.href = `https://wa.me/${waNum}?text=${textParam}`;
    });

    const igLink = document.querySelector('.header-socials a[href*="instagram"]');
    if (igLink && general.instagramHandle) {
        igLink.href = `https://instagram.com/${general.instagramHandle.replace('@', '')}`;
        igLink.querySelector('span').textContent = general.instagramHandle;
    }

    const fbLink = document.querySelector('.header-socials a[href*="facebook"]');
    if (fbLink && general.facebookHandle) {
        fbLink.href = `https://facebook.com/${encodeURIComponent(general.facebookHandle)}`;
    }

    // Render Stats Bar
    const statsContainer = document.querySelector('.stats-grid');
    if (statsContainer && stats && stats.length > 0) {
        statsContainer.innerHTML = stats.map(s => `
            <div class="stat-item">
                <div class="stat-number">${s.number}</div>
                <div class="stat-label">${s.label}</div>
            </div>
        `).join('');
    }

    // Render Portfolio Showcase
    const portfolioGrid = document.querySelector('.portfolio-grid');
    if (portfolioGrid && portfolio && portfolio.length > 0) {
        portfolioGrid.innerHTML = portfolio.map(p => {
            const ytId = getYouTubeId(p.demoUrl);
            let visualMediaHTML = '';

            if (ytId) {
                visualMediaHTML = `
                    <div class="portfolio-video-wrapper">
                        <iframe src="https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}" 
                            title="${p.title}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen 
                            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;">
                        </iframe>
                    </div>
                `;
            } else {
                visualMediaHTML = `
                    <div class="portfolio-img ${p.bgClass || 'portfolio-bg-1'}">
                        <span class="portfolio-tag">${(p.niche || 'WEBSITE').toUpperCase()}</span>
                        <div class="portfolio-overlay">
                            <button type="button" class="btn btn-sm btn-outline portfolio-detail-btn" data-title="${p.title}" data-desc="${p.desc}" data-niche="${p.niche}" data-demo-url="${p.demoUrl || ''}">
                                <i class="fa-solid fa-eye"></i> Lihat Detail
                            </button>
                        </div>
                    </div>
                `;
            }

            return `
                <div class="portfolio-card" data-category="${p.category || 'landing'}">
                    ${visualMediaHTML}
                    <div class="portfolio-info">
                        <h4>${p.title}</h4>
                        <p>${p.desc}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Render Pricing Packages
    const pricingGrid = document.querySelector('.pricing-grid');
    if (pricingGrid && pricing && pricing.length > 0) {
        pricingGrid.innerHTML = pricing.map(pkg => `
            <div class="pricing-card ${pkg.popular ? 'popular' : ''}">
                ${pkg.popular ? '<div class="popular-ribbon">PALING LARIS</div>' : ''}
                <div class="card-header">
                    <h3>${pkg.title}</h3>
                    <p>${pkg.subtitle}</p>
                </div>
                <div class="card-price">
                    ${pkg.oldPrice ? `<span class="strikethrough">${pkg.oldPrice}</span>` : ''}
                    <div class="price-val">
                        <span class="currency">Rp</span>
                        <span class="amount">${pkg.amount}</span>
                    </div>
                    <span class="period">${pkg.period}</span>
                </div>
                <ul class="card-features">
                    ${(pkg.features || []).map(f => `<li><i class="fa-solid fa-check text-green"></i> ${f}</li>`).join('')}
                </ul>
                <a href="https://wa.me/${waNum}?text=Halo%20Elevo%20Studioo,%20saya%20tertarik%20dengan%20${encodeURIComponent(pkg.title)}" target="_blank" rel="noopener noreferrer" class="btn ${pkg.popular ? 'btn-primary' : 'btn-outline'} btn-block">
                    ${pkg.btnText || 'Pesan Sekarang'}
                </a>
            </div>
        `).join('');
    }

    // Render FAQ Accordion
    const faqAccordion = document.querySelector('.faq-accordion');
    if (faqAccordion && faq && faq.length > 0) {
        faqAccordion.innerHTML = faq.map((item, idx) => `
            <div class="faq-item ${idx === 0 ? 'active' : ''}">
                <button type="button" class="faq-question" aria-expanded="${idx === 0 ? 'true' : 'false'}">
                    <span>${item.question}</span>
                    <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
                </button>
                <div class="faq-answer">
                    <p>${item.answer}</p>
                </div>
            </div>
        `).join('');
    }
}

// Interactive Component Functions
function setupPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            document.querySelectorAll('.portfolio-card').forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

function getYouTubeId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function setupPortfolioModal() {
    const modal = document.getElementById('portfolioModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalNiche = document.getElementById('modalNiche');
    const modalWaBtn = document.getElementById('modalWaBtn');
    const modalClose = document.getElementById('modalClose');
    const modalVideoContainer = document.getElementById('modalVideoContainer');

    const cmsData = getElevoData();
    const waNum = (cmsData.general && cmsData.general.whatsappNumber) ? cmsData.general.whatsappNumber : "62895634887437";

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
        }
        if (modalVideoContainer) {
            modalVideoContainer.innerHTML = '';
            modalVideoContainer.style.display = 'none';
        }
    }

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.portfolio-detail-btn');
        if (btn) {
            e.preventDefault();
            const title = btn.getAttribute('data-title');
            const desc = btn.getAttribute('data-desc');
            const niche = btn.getAttribute('data-niche');
            const demoUrl = btn.getAttribute('data-demo-url');

            if (modalTitle) modalTitle.textContent = title;
            if (modalDesc) modalDesc.textContent = desc;
            if (modalNiche) modalNiche.textContent = niche;
            if (modalWaBtn) {
                modalWaBtn.href = `https://wa.me/${waNum}?text=Halo%20Elevo%20Studioo,%20saya%20tertarik%20dengan%20sampel%20website%20${encodeURIComponent(title)}`;
            }

            const modalDemoBtn = document.getElementById('modalDemoBtn');
            if (modalDemoBtn) {
                if (demoUrl && demoUrl.trim() !== '') {
                    modalDemoBtn.href = demoUrl;
                    modalDemoBtn.style.display = 'inline-flex';
                } else {
                    modalDemoBtn.style.display = 'none';
                }
            }

            const ytId = getYouTubeId(demoUrl);
            if (modalVideoContainer) {
                if (ytId) {
                    modalVideoContainer.innerHTML = `
                        <iframe width="420" height="315" 
                            src="https://www.youtube.com/embed/${ytId}" 
                            title="YouTube video player" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen 
                            style="border-radius: 8px; max-width: 100%; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                        </iframe>
                    `;
                    modalVideoContainer.style.display = 'flex';
                } else {
                    modalVideoContainer.innerHTML = '';
                    modalVideoContainer.style.display = 'none';
                }
            }

            if (modal) {
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
            }
        }
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function setupFAQAccordion() {
    document.addEventListener('click', (e) => {
        const questionBtn = e.target.closest('.faq-question');
        if (questionBtn) {
            const item = questionBtn.closest('.faq-item');
            const isActive = item.classList.contains('active');

            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                const btn = i.querySelector('.faq-question');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });

            if (!isActive) {
                item.classList.add('active');
                questionBtn.setAttribute('aria-expanded', 'true');
            }
        }
    });
}

function setupNavScrollActive() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links .nav-item');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
}

function setupRevealAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.feature-card, .pricing-card, .step-card, .portfolio-card, .stat-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(25px)';
        el.style.transition = 'all 0.45s ease-out';
        revealObserver.observe(el);
    });
}
