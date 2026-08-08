// config.js
// Berisi konfigurasi aplikasi dan URL endpoint Google Apps Script

const APP_CONFIG = {
    // Ganti URL ini dengan URL Web App Google Apps Script setelah deploy
    GAS_URL: "https://script.google.com/macros/s/AKfycbzwK2s67WyHxr0nKkn9TkFX5Jau0dSLGGERTdYOy1RD5hKH_w7vf6tt0xERN9BFWSvSGw/exec",

    // Status apakah menggunakan Mock Data (Jika GAS_URL kosong)
    USE_MOCK: false,

    // Rating Scale untuk Final Grade
    RATING_SCALE: [
        { min: 0, max: 167, grade: "Kurang Sekali", class: "grade-D" },
        { min: 168, max: 239, grade: "Kurang", class: "grade-C" },
        { min: 240, max: 311, grade: "Cukup", class: "grade-C" },
        { min: 312, max: 383, grade: "Baik", class: "grade-B" },
        { min: 384, max: 9999, grade: "Baik Sekali", class: "grade-A" }
    ],

    // Bobot Default per Jabatan
    BOBOT: {
        "Staff": { kpi: 70, perilaku: 30, manajerial: 0 },
        "Pelaksana": { kpi: 70, perilaku: 30, manajerial: 0 },
        "Tim Leader": { kpi: 60, perilaku: 20, manajerial: 20 },
        "Supervisor": { kpi: 60, perilaku: 20, manajerial: 20 },
        "Manager": { kpi: 50, perilaku: 30, manajerial: 20 },
        "General Manager": { kpi: 50, perilaku: 30, manajerial: 20 },
        "Direktur": { kpi: 40, perilaku: 30, manajerial: 30 }
    }
};

// --- MOCK DATA (Digunakan jika GAS_URL kosong) ---
const MOCK_DB = {
    users: [
        { nip: "1001", password: "123", nama: "Super Admin", level: "Super Admin", jabatan: "Admin", unit: "Pusat", atasan1: "", atasan2: "" },
        { nip: "2001", password: "123", nama: "Bapak Direktur", level: "Direktur", jabatan: "Direktur", unit: "Manajemen", atasan1: "", atasan2: "" },
        { nip: "3001", password: "123", nama: "Bapak GM", level: "General Manager", jabatan: "GM Ops", unit: "Operasional", atasan1: "2001", atasan2: "" },
        { nip: "4001", password: "123", nama: "Bapak Manager", level: "Manager", jabatan: "Manager IT", unit: "IT", atasan1: "3001", atasan2: "2001" },
        { nip: "5001", password: "123", nama: "Bapak SPV", level: "Supervisor", jabatan: "SPV Support", unit: "IT", atasan1: "4001", atasan2: "3001" },
        { nip: "6001", password: "123", nama: "Bapak TL", level: "Tim Leader", jabatan: "TL Helpdesk", unit: "IT", atasan1: "5001", atasan2: "4001" },
        { nip: "7001", password: "123", nama: "Mas Staff", level: "Staff", jabatan: "IT Support", unit: "IT", atasan1: "6001", atasan2: "5001" }
    ],
    skis: [
        { id: 1, nip: "7001", ski: "Menyelesaikan tiket support < 24 jam", bobot: 50 },
        { id: 2, nip: "7001", ski: "Maintance jaringan bulanan selesai", bobot: 50 },
        { id: 3, nip: "4001", ski: "Implementasi Sistem Baru 100%", bobot: 100 }
    ],
    pkks: [
        {
            id: 1, nip: "7001", nama: "Mas Staff", unit: "IT",
            finalScore: 350, finalGrade: "Baik", status: "Selesai", tanggal: "2024-06-15"
        },
        {
            id: 2, nip: "6001", nama: "Bapak TL", unit: "IT",
            finalScore: 0, finalGrade: "-", status: "Menunggu Verifikasi 1", tanggal: "2024-06-20"
        }
    ],
    pengumuman: [
        { id: 1, judul: "Pengisian PKK Semester 1 2024", deskripsi: "Diharapkan seluruh karyawan segera mengisi evaluasi mandiri paling lambat 30 Juni 2024.", date: "2024-06-01" },
        { id: 2, judul: "Perubahan Bobot Managerial", deskripsi: "Terdapat penyesuaian perhitungan poin manajerial sesuai edaran SK Direktur terbaru.", date: "2024-06-10" }
    ]
};
