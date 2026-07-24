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
        { number: "3-5 Hari", label: "Rata-rata Pengerjaan" },
        { number: "24/7", label: "Support Konsultasi" }
    ],
    portfolio: [
        {
            id: "port-1",
            title: "landing page cafe",
            category: "landing",
            niche: "Cafe & Resto",
            desc: "Website Landing Page & POS Cafe kekinian dengan integrasi pemesanan menu online dan manajemen kasir.",
            demoUrl: "https://warkop-1001cc.vercel.app",
            bgClass: "portfolio-bg-1"
        },
        {
            id: "port-2",
            title: "Nusantara Construction",
            category: "company",
            niche: "Properti & Konstruksi",
            desc: "Company Profile profesional untuk perusahaan kontraktor & properti lengkap dengan galeri proyek dan form penawaran.",
            demoUrl: "",
            bgClass: "portfolio-bg-2"
        },
        {
            id: "port-3",
            title: "Hijab & Fashion Store",
            category: "ecom",
            niche: "Fashion & Retail",
            desc: "Toko online katalog busana muslimah dengan fitur direct checkout WhatsApp dan manajemen produk.",
            demoUrl: "",
            bgClass: "portfolio-bg-3"
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
            period: "Sekali bayar / 1 Tahun",
            features: [
                "1 Halaman Focus Conversion",
                "Gratis Domain & Hosting 1 Thn",
                "Desain Ultra Responsive Mobile",
                "Direct WhatsApp CTA Floating",
                "Integrasi Google Analytics / Pixel",
                "Pengerjaan 3-5 Hari Kerja",
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
            period: "Sekali bayar / 1 Tahun",
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
            title: "Toko Online / Custom",
            subtitle: "Cocok untuk penjualan produk katalog & e-commerce",
            popular: false,
            oldPrice: "Rp 2.800.000",
            amount: "2.300.000",
            period: "Sekali bayar / 1 Tahun",
            features: [
                "Sistem Katalog Produk & Cart",
                "Checkout Otomatis via WA/Payment",
                "Gratis Domain & Server Cepat",
                "Halaman Admin Manajemen Produk",
                "Hitung Ongkir Auto Integrasi",
                "Panduan Kelola Web (Panduan)",
                "Support Pendampingan"
            ],
            btnText: "Konsultasi Custom"
        }
    ],
    faq: [
        {
            id: "faq-1",
            question: "Berapa lama proses pembuatan websitenya?",
            answer: "Untuk Paket Landing Page Promo, pengerjaan normal memakan waktu 3 sampai 5 hari kerja setelah bahan/konten lengkap kami terima."
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
            return JSON.parse(stored);
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
