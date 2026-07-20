/**
 * Elevo Studioo - CMS Admin Dashboard Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Authentication Check
    const loginScreen = document.getElementById('loginScreen');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const logoutBtn = document.getElementById('logoutBtn');

    const DEFAULT_PASS = 'elevo123';

    if (sessionStorage.getItem('elevo_admin_auth') === 'true') {
        loginScreen.style.display = 'none';
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pass = document.getElementById('adminPass').value;
        if (pass === DEFAULT_PASS) {
            sessionStorage.setItem('elevo_admin_auth', 'true');
            loginScreen.style.display = 'none';
            loginError.style.display = 'none';
            showToast("Login Berhasil!");
        } else {
            loginError.style.display = 'block';
        }
    });

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('elevo_admin_auth');
            loginScreen.style.display = 'flex';
        });
    }

    // 2. Tab Navigation
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.style.display = 'none');

            btn.classList.add('active');
            const targetTab = btn.getAttribute('data-tab');
            const targetEl = document.getElementById(`tab-${targetTab}`);
            if (targetEl) targetEl.style.display = 'block';
        });
    });

    // 3. Load Initial Data into Forms
    let cmsData = getElevoData();
    populateGeneralForm(cmsData);
    renderPortfolioTable(cmsData);
    renderPricingForms(cmsData);
    renderFAQTable(cmsData);

    // 4. Handle General Settings Save
    const formGeneral = document.getElementById('formGeneral');
    formGeneral.addEventListener('submit', (e) => {
        e.preventDefault();
        cmsData.general = {
            whatsappNumber: document.getElementById('inputWa').value.trim(),
            instagramHandle: document.getElementById('inputIg').value.trim(),
            facebookHandle: document.getElementById('inputFb').value.trim(),
            promoBannerText: document.getElementById('inputPromoBanner').value.trim(),
            heroTitlePrefix: document.getElementById('inputHeroTitlePrefix').value.trim(),
            heroTitleHighlight: document.getElementById('inputHeroTitleHighlight').value.trim(),
            heroSubtitle: document.getElementById('inputHeroSub').value.trim(),
            oldPrice: document.getElementById('inputOldPrice').value.trim(),
            promoPrice: document.getElementById('inputPromoPrice').value.trim()
        };

        if (saveElevoData(cmsData)) {
            showToast("Pengaturan Umum Berhasil Disimpan!");
        }
    });

    // 5. Portfolio CRUD
    const portModal = document.getElementById('portModal');
    const portModalTitle = document.getElementById('portModalTitle');
    const portForm = document.getElementById('portForm');
    const portModalClose = document.getElementById('portModalClose');
    const addPortBtn = document.getElementById('addPortBtn');

    addPortBtn.addEventListener('click', () => {
        portModalTitle.textContent = "Tambah Proyek Portofolio";
        document.getElementById('portId').value = "";
        portForm.reset();
        portModal.classList.add('active');
    });

    if (portModalClose) {
        portModalClose.addEventListener('click', () => portModal.classList.remove('active'));
    }

    portForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('portId').value;
        const newItem = {
            id: id || `port-${Date.now()}`,
            title: document.getElementById('portTitle').value.trim(),
            category: document.getElementById('portCategory').value,
            niche: document.getElementById('portNiche').value.trim(),
            desc: document.getElementById('portDesc').value.trim(),
            bgClass: `portfolio-bg-${Math.floor(Math.random() * 3) + 1}`
        };

        if (id) {
            const idx = cmsData.portfolio.findIndex(p => p.id === id);
            if (idx !== -1) cmsData.portfolio[idx] = newItem;
        } else {
            cmsData.portfolio.push(newItem);
        }

        saveElevoData(cmsData);
        renderPortfolioTable(cmsData);
        portModal.classList.remove('active');
        showToast("Portofolio Berhasil Disimpan!");
    });

    // 6. FAQ CRUD
    const faqModal = document.getElementById('faqModal');
    const faqModalTitle = document.getElementById('faqModalTitle');
    const faqForm = document.getElementById('faqForm');
    const faqModalClose = document.getElementById('faqModalClose');
    const addFaqBtn = document.getElementById('addFaqBtn');

    addFaqBtn.addEventListener('click', () => {
        faqModalTitle.textContent = "Tambah FAQ";
        document.getElementById('faqId').value = "";
        faqForm.reset();
        faqModal.classList.add('active');
    });

    if (faqModalClose) {
        faqModalClose.addEventListener('click', () => faqModal.classList.remove('active'));
    }

    faqForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('faqId').value;
        const newItem = {
            id: id || `faq-${Date.now()}`,
            question: document.getElementById('faqQuestion').value.trim(),
            answer: document.getElementById('faqAnswer').value.trim()
        };

        if (id) {
            const idx = cmsData.faq.findIndex(f => f.id === id);
            if (idx !== -1) cmsData.faq[idx] = newItem;
        } else {
            cmsData.faq.push(newItem);
        }

        saveElevoData(cmsData);
        renderFAQTable(cmsData);
        faqModal.classList.remove('active');
        showToast("FAQ Berhasil Disimpan!");
    });

    // 7. Export / Import / Reset
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const importFileInput = document.getElementById('importFileInput');
    const resetDataBtn = document.getElementById('resetDataBtn');

    exportBtn.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cmsData, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `elevo_studioo_cms_${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    });

    importBtn.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const parsed = JSON.parse(event.target.result);
                    saveElevoData(parsed);
                    cmsData = parsed;
                    populateGeneralForm(cmsData);
                    renderPortfolioTable(cmsData);
                    renderPricingForms(cmsData);
                    renderFAQTable(cmsData);
                    showToast("Data Berhasil Di-import!");
                } catch (err) {
                    alert("Format file JSON tidak valid!");
                }
            };
            reader.readAsText(file);
        }
    });

    resetDataBtn.addEventListener('click', () => {
        if (confirm("Apakah Anda yakin ingin mereset seluruh data kembali ke awal?")) {
            resetElevoData();
            cmsData = getElevoData();
            populateGeneralForm(cmsData);
            renderPortfolioTable(cmsData);
            renderPricingForms(cmsData);
            renderFAQTable(cmsData);
            showToast("Data Berhasil Direset!");
        }
    });
});

// Helper Functions
function populateGeneralForm(data) {
    const g = data.general || {};
    document.getElementById('inputWa').value = g.whatsappNumber || '';
    document.getElementById('inputIg').value = g.instagramHandle || '';
    document.getElementById('inputFb').value = g.facebookHandle || '';
    document.getElementById('inputPromoBanner').value = g.promoBannerText || '';
    document.getElementById('inputHeroTitlePrefix').value = g.heroTitlePrefix || '';
    document.getElementById('inputHeroTitleHighlight').value = g.heroTitleHighlight || '';
    document.getElementById('inputHeroSub').value = g.heroSubtitle || '';
    document.getElementById('inputOldPrice').value = g.oldPrice || '';
    document.getElementById('inputPromoPrice').value = g.promoPrice || '';
}

function renderPortfolioTable(data) {
    const tbody = document.getElementById('portfolioTableBody');
    if (!tbody) return;
    const items = data.portfolio || [];

    tbody.innerHTML = items.map(p => `
        <tr>
            <td><strong>${p.title}</strong></td>
            <td><span class="modal-tag-pill">${p.category}</span></td>
            <td>${p.niche}</td>
            <td>
                <div class="action-btns">
                    <button type="button" class="btn-edit" onclick="editPortfolio('${p.id}')"><i class="fa-solid fa-pen"></i> Edit</button>
                    <button type="button" class="btn-delete" onclick="deletePortfolio('${p.id}')"><i class="fa-solid fa-trash"></i> Hapus</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function editPortfolio(id) {
    const data = getElevoData();
    const item = data.portfolio.find(p => p.id === id);
    if (item) {
        document.getElementById('portModalTitle').textContent = "Edit Proyek Portofolio";
        document.getElementById('portId').value = item.id;
        document.getElementById('portTitle').value = item.title;
        document.getElementById('portCategory').value = item.category;
        document.getElementById('portNiche').value = item.niche;
        document.getElementById('portDesc').value = item.desc;
        document.getElementById('portModal').classList.add('active');
    }
}

function deletePortfolio(id) {
    if (confirm("Hapus proyek portofolio ini?")) {
        let data = getElevoData();
        data.portfolio = data.portfolio.filter(p => p.id !== id);
        saveElevoData(data);
        renderPortfolioTable(data);
        showToast("Portofolio Dihapus!");
    }
}

function renderPricingForms(data) {
    const container = document.getElementById('pricingFormList');
    if (!container) return;
    const pkgs = data.pricing || [];

    container.innerHTML = pkgs.map((pkg, idx) => `
        <div style="background: rgba(6, 11, 30, 0.6); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 20px; margin-bottom: 20px;">
            <h4 style="color: var(--primary-cyan); margin-bottom: 15px; font-family: var(--font-heading);">Paket #${idx+1}: ${pkg.title}</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 15px;">
                <div class="form-group">
                    <label>Nama Paket</label>
                    <input type="text" class="form-control" id="pkg-title-${pkg.id}" value="${pkg.title}">
                </div>
                <div class="form-group">
                    <label>Harga Coret</label>
                    <input type="text" class="form-control" id="pkg-oldPrice-${pkg.id}" value="${pkg.oldPrice || ''}">
                </div>
                <div class="form-group">
                    <label>Harga Promo (Rp)</label>
                    <input type="text" class="form-control" id="pkg-amount-${pkg.id}" value="${pkg.amount}">
                </div>
            </div>
            <div class="form-group">
                <label>Fitur (Pisahkan dengan koma)</label>
                <textarea class="form-control" id="pkg-features-${pkg.id}">${(pkg.features || []).join(', ')}</textarea>
            </div>
            <button type="button" class="btn btn-sm btn-primary" onclick="savePackage('${pkg.id}')">
                <i class="fa-solid fa-floppy-disk"></i> Simpan Paket Ini
            </button>
        </div>
    `).join('');
}

function savePackage(id) {
    let data = getElevoData();
    const pkg = data.pricing.find(p => p.id === id);
    if (pkg) {
        pkg.title = document.getElementById(`pkg-title-${id}`).value.trim();
        pkg.oldPrice = document.getElementById(`pkg-oldPrice-${id}`).value.trim();
        pkg.amount = document.getElementById(`pkg-amount-${id}`).value.trim();
        const featuresText = document.getElementById(`pkg-features-${id}`).value;
        pkg.features = featuresText.split(',').map(f => f.trim()).filter(f => f.length > 0);

        saveElevoData(data);
        showToast(`Paket ${pkg.title} Berhasil Diperbarui!`);
    }
}

function renderFAQTable(data) {
    const tbody = document.getElementById('faqTableBody');
    if (!tbody) return;
    const items = data.faq || [];

    tbody.innerHTML = items.map(f => `
        <tr>
            <td><strong>${f.question}</strong></td>
            <td>${f.answer}</td>
            <td>
                <div class="action-btns">
                    <button type="button" class="btn-edit" onclick="editFAQ('${f.id}')"><i class="fa-solid fa-pen"></i> Edit</button>
                    <button type="button" class="btn-delete" onclick="deleteFAQ('${f.id}')"><i class="fa-solid fa-trash"></i> Hapus</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function editFAQ(id) {
    const data = getElevoData();
    const item = data.faq.find(f => f.id === id);
    if (item) {
        document.getElementById('faqModalTitle').textContent = "Edit FAQ";
        document.getElementById('faqId').value = item.id;
        document.getElementById('faqQuestion').value = item.question;
        document.getElementById('faqAnswer').value = item.answer;
        document.getElementById('faqModal').classList.add('active');
    }
}

function deleteFAQ(id) {
    if (confirm("Hapus item FAQ ini?")) {
        let data = getElevoData();
        data.faq = data.faq.filter(f => f.id !== id);
        saveElevoData(data);
        renderFAQTable(data);
        showToast("FAQ Dihapus!");
    }
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${msg}`;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}
