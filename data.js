/**
 * Elevo Studioo - CMS Data Store Manager
 * Centralized data storage using LocalStorage with fallback defaults
 */

const DEFAULT_ELEVO_DATA = {
    general: {

        instagramHandle: "@elevo.studioo",
        facebookHandle: "Elevo Studioo",
        promoBannerText: "🔥 LIMITED OFFER! Promo Pembuatan Website Mulai Rp 1.000.000 (Diskon Rp 200.000)",
        heroTitlePrefix: "UPGRADE BISNIS ANDA DENGAN ",
        heroTitleHighlight: "WEBSITE BARU",
        heroSubtitle: "Tingkatkan kredibilitas bisnis dan kepercayaan pelanggan Anda melalui website profesional, cepat, dan siap pakai.",
        oldPrice: "Rp 1.200.000",
        promoPrice: "Rp 1.000.000"
    },
    stats: [
        { number: "50+", label: "Website Diselesaikan" },
        { number: "100%", label: "Klien Puas & Garansi" },
        { number: "2-4 Hari", label: "Rata-rata Pengerjaan" },
        { number: "24/7", label: "Support Konsultasi" }
    ],
    portfolio: [
        {
            id: "port-1",
            title: "landing page cafe",
            category: "landing",
            niche: "Cafe & Resto",
            desc: "Website Landing Page & POS Cafe kekinian dengan integrasi pemesanan menu online dan manajemen kasir.",
            demoUrl: "https://lp-warkop1001cc.vercel.app/",
            bgClass: "portfolio-bg-1"
        },
        {
            id: "port-4",
            title: "Dealer Motor Motoverse",
            category: "landing",
            niche: "Otomotif & Motor",
            desc: "Landing page penjualan motor Honda Motoverse dengan integrasi brosur digital, simulasi kredit, dan direct chat WhatsApp.",
            demoUrl: "https://katalog-honda.vercel.app",
            bgClass: "portfolio-bg-4"
        },
        {
            id: "port-5",
            title: "Custom Web App / Kasir POS",
            category: "custom",
            niche: "Cafe & Restoran",
            desc: "Sebuah sistem terintegrasi berbasis web dan Android yang menggabungkan kontrol akses berbasis peran (RBAC), notifikasi real-time melalui Kitchen Display System (KDS), serta visualisasi data pada dashboard admin. Rancangan ini menghadirkan alur operasional yang lebih terstruktur, transparan, dan mudah dipantau bagi pelaku usaha di bidang kuliner.",
            demoUrl: "https://youtu.be/T7GjxVxbBdY",
            bgClass: "portfolio-bg-5"
        }
    ],
    pricing: [
        {
            id: "price-1",
            title: "Landing Page Promo",
            subtitle: "Cocok untuk Meta Ads / Tiktok Ads perolehan leads cepat",
            popular: true,
            oldPrice: "Rp 1.200.000",
            amount: "1.000.000",
            period: "Sekali bayar",
            features: [
                "1 Halaman Focus Conversion",
                "Gratis Domain & Hosting 1 Bulan",
                "Desain Ultra Responsive Mobile",
                "Direct WhatsApp CTA Floating",
                "Integrasi Google Analytics / Pixel",
                "Pengerjaan 2-4 Hari Kerja",
                "Gratis Revisi 2x"
            ],
            btnText: "Ambil Promo Rp 1 Juta"
        },
        {
            id: "price-2",
            title: "Company Profile",
            subtitle: "Cocok untuk Perusahaan, Jasa & Branding Bisnis",
            popular: false,
            oldPrice: "Rp 1.800.000",
            amount: "1.500.000",
            period: "Sekali bayar",
            features: [
                "Hingga 5-7 Halaman Menu",
                "Gratis Domain (.com) & Hosting",
                "Profile Tim, Visi Misi & Galeri",
                "Form Kontak & Map Integrasi",
                "Optimization SEO Google Page",
                "Pengerjaan 5-7 Hari Kerja",
                "Gratis Revisi 3x"
            ],
            btnText: "Pesan Company Profile"
        },
        {
            id: "price-3",
            title: "Custom Web & Android App",
            subtitle: "Solusi sistem enterprise kustom untuk otomatisasi bisnis skala besar",
            popular: false,
            oldPrice: "",
            amount: "Harga Didiskusikan",
            period: "Sesuai Kompleksitas Sistem",
            features: [
                "Fitur & Modul Disesuaikan Kebutuhan Bisnis",
                "Free Konsultasi & Analisis Kebutuhan Sistem",
                "Skema Support & Maintenance Fleksibel"

            ],
            btnText: "Konsultasi Sistem Kustom"
        }
    ],
    faq: [
        {
            id: "faq-1",
            question: "Berapa lama proses pembuatan websitenya?",
            answer: "Untuk Paket Landing Page Promo, pengerjaan normal memakan waktu 2 sampai 4 hari kerja setelah bahan/konten lengkap kami terima."
        },
        {
            id: "faq-2",
            question: "Apakah harga sudah termasuk domain dan hosting?",
            answer: "Ya, betul sekali! Semua harga paket di Elevo Studioo sudah termasuk gratis Domain (.com / .my.id) dan Cloud Hosting cepat selama 1 tahun penuh tanpa biaya tersembunyi."
        },
        {
            id: "faq-3",
            question: "Apakah saya bisa minta revisi kalau kurang cocok?",
            answer: "Tentu bisa! Kami memberikan garansi revisi minor hingga hasil website sesuai dengan keinginan dan kebutuhan bisnis Anda."
        },
        {
            id: "faq-4",
            question: "Apakah websitenya cepat dan cocok untuk Meta Ads?",
            answer: "Sangat cocok! Kami merancang website ini dengan struktur ringan (lightweight), clean code, dan sangat mobile responsive sehingga loading-nya instan saat calon pembeli mengklik iklan dari Facebook/Instagram Ads Anda."
        }
    ]
};

// Helper Functions
function getElevoData() {
    try {
        const stored = localStorage.getItem('elevo_studioo_cms_data');
        if (stored) {
            const data = JSON.parse(stored);
            let updated = false;

            // Sync portfolio items
            if (!data.portfolio) {
                data.portfolio = [...DEFAULT_ELEVO_DATA.portfolio];
                updated = true;
            } else {
                const defaultIds = DEFAULT_ELEVO_DATA.portfolio.map(p => p.id);
                const allKnownDefaults = ['port-1', 'port-2', 'port-3', 'port-4', 'port-5'];
                
                // Filter out default items that are no longer in DEFAULT_ELEVO_DATA
                const originalLength = data.portfolio.length;
                data.portfolio = data.portfolio.filter(p => {
                    if (allKnownDefaults.includes(p.id)) {
                        return defaultIds.includes(p.id);
                    }
                    return true;
                });
                if (data.portfolio.length !== originalLength) {
                    updated = true;
                }

                DEFAULT_ELEVO_DATA.portfolio.forEach(defaultItem => {
                    const existingIdx = data.portfolio.findIndex(p => p.id === defaultItem.id);
                    if (existingIdx === -1) {
                        data.portfolio.push(defaultItem);
                        updated = true;
                    } else {
                        const existing = data.portfolio[existingIdx];
                        if (
                            existing.bgClass !== defaultItem.bgClass ||
                            existing.desc !== defaultItem.desc ||
                            existing.category !== defaultItem.category ||
                            existing.niche !== defaultItem.niche ||
                            existing.title !== defaultItem.title ||
                            existing.demoUrl !== defaultItem.demoUrl
                        ) {
                            data.portfolio[existingIdx] = { ...existing, ...defaultItem };
                            updated = true;
                        }
                    }
                });
            }

            // Sync pricing packages
            if (!data.pricing) {
                data.pricing = [...DEFAULT_ELEVO_DATA.pricing];
                updated = true;
            } else {
                DEFAULT_ELEVO_DATA.pricing.forEach(defaultPkg => {
                    const existingIdx = data.pricing.findIndex(p => p.id === defaultPkg.id);
                    if (existingIdx === -1) {
                        data.pricing.push(defaultPkg);
                        updated = true;
                    } else {
                        const existing = data.pricing[existingIdx];
                        if (
                            existing.title !== defaultPkg.title ||
                            existing.subtitle !== defaultPkg.subtitle ||
                            existing.amount !== defaultPkg.amount ||
                            existing.oldPrice !== defaultPkg.oldPrice ||
                            JSON.stringify(existing.features) !== JSON.stringify(defaultPkg.features)
                        ) {
                            data.pricing[existingIdx] = { ...existing, ...defaultPkg };
                            updated = true;
                        }
                    }
                });
            }

            if (updated) {
                saveElevoData(data);
            }
            return data;
        }
    } catch (e) {
        console.error("Error reading from localStorage:", e);
    }
    return DEFAULT_ELEVO_DATA;
}

function saveElevoData(data) {
    try {
        localStorage.setItem('elevo_studioo_cms_data', JSON.stringify(data));
        return true;
    } catch (e) {
        console.error("Error saving to localStorage:", e);
        return false;
    }
}

function resetElevoData() {
    try {
        localStorage.removeItem('elevo_studioo_cms_data');
        return true;
    } catch (e) {
        return false;
    }
}
