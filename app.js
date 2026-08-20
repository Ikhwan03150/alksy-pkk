// app.js

// --- State Management ---
let currentUser = null;
let currentAppPage = 'dashboard';

// --- Menu Configuration ---
const MENU_CONFIG = {
    "Super Admin": [
        { id: "dashboard", icon: "fas fa-home", text: "Dasbor" },
        { id: "manajemen_user", icon: "fas fa-users-cog", text: "Manajemen User" },
        { id: "daftar_ski", icon: "fas fa-list-alt", text: "Master SKI" },
        { id: "monitoring", icon: "fas fa-desktop", text: "Monitoring PKK" },
        { id: "settings", icon: "fas fa-cog", text: "Setting Bobot" },
        { id: "tahun_ajaran", icon: "fas fa-calendar", text: "Tahun Ajaran" },
        { id: "ubah_password", icon: "fas fa-key", text: "Ubah Password" }
    ],
    "Direktur": [
        { id: "dashboard", icon: "fas fa-home", text: "Dasbor" },
        { id: "daftar_ski", icon: "fas fa-list", text: "SKI" },
        { id: "monitoring", icon: "fas fa-desktop", text: "Monitoring PKK" },
        { id: "ubah_password", icon: "fas fa-key", text: "Ubah Password" }
    ],
    "General Manager": [
        { id: "dashboard", icon: "fas fa-home", text: "Dasbor" },
        { id: "daftar_ski", icon: "fas fa-list", text: "SKI" },
        { id: "verifikasi", icon: "fas fa-check-double", text: "Verifikasi PKK" },
        { id: "monitoring", icon: "fas fa-desktop", text: "Monitoring PKK" },
        { id: "ubah_password", icon: "fas fa-key", text: "Ubah Password" }
    ],
    "Manager": [
        { id: "dashboard", icon: "fas fa-home", text: "Dasbor" },
        { id: "daftar_ski", icon: "fas fa-list", text: "SKI" },
        { id: "verifikasi", icon: "fas fa-check-double", text: "Verifikasi PKK" },
        { id: "monitoring", icon: "fas fa-desktop", text: "Monitoring PKK" },
        { id: "evaluasi", icon: "fas fa-edit", text: "Evaluasi Mandiri" },
        { id: "riwayat", icon: "fas fa-history", text: "Riwayat PKK" },
        { id: "ubah_password", icon: "fas fa-key", text: "Ubah Password" }
    ],
    "Supervisor": [
        { id: "dashboard", icon: "fas fa-home", text: "Dasbor" },
        { id: "verifikasi", icon: "fas fa-check-double", text: "Verifikasi PKK" },
        { id: "evaluasi", icon: "fas fa-edit", text: "Evaluasi Mandiri" },
        { id: "riwayat", icon: "fas fa-history", text: "Riwayat PKK" },
        { id: "ubah_password", icon: "fas fa-key", text: "Ubah Password" }
    ],
    "Tim Leader": [
        { id: "dashboard", icon: "fas fa-home", text: "Dasbor" },
        { id: "verifikasi", icon: "fas fa-check-double", text: "Verifikasi PKK" },
        { id: "evaluasi", icon: "fas fa-edit", text: "Evaluasi Mandiri" },
        { id: "riwayat", icon: "fas fa-history", text: "Riwayat PKK" },
        { id: "ubah_password", icon: "fas fa-key", text: "Ubah Password" }
    ],
    "Staff": [
        { id: "dashboard", icon: "fas fa-home", text: "Dasbor" },
        { id: "evaluasi", icon: "fas fa-edit", text: "Evaluasi Mandiri" },
        { id: "riwayat", icon: "fas fa-history", text: "Riwayat PKK" },
        { id: "ubah_password", icon: "fas fa-key", text: "Ubah Password" }
    ],
    "Pelaksana": [
        { id: "dashboard", icon: "fas fa-home", text: "Dasbor" },
        { id: "evaluasi", icon: "fas fa-edit", text: "Evaluasi Mandiri" },
        { id: "riwayat", icon: "fas fa-history", text: "Riwayat PKK" },
        { id: "ubah_password", icon: "fas fa-key", text: "Ubah Password" }
    ]
};

// --- DOM Elements ---
const elApp = document.getElementById('app');
const elLoginScreen = document.getElementById('login-screen');
const elMainScreen = document.getElementById('main-screen');
const elLoginForm = document.getElementById('login-form');
const elSidebarMenu = document.getElementById('sidebar-menu');
const elContentArea = document.getElementById('content-area');
const elPageTitle = document.getElementById('page-title');
const elBtnToggleSidebar = document.getElementById('btn-toggle-sidebar');
const elSidebar = document.querySelector('.sidebar');
const elMainContent = document.querySelector('.main-content');
const elToastContainer = document.getElementById('toast-container');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    checkSession();

    elLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nip = document.getElementById('login-nip').value;
        const pass = document.getElementById('login-password').value;
        doLogin(nip, pass);
    });

    elBtnToggleSidebar.addEventListener('click', () => {
        elSidebar.classList.toggle('collapsed');
        elSidebar.classList.toggle('mobile-open');
        elMainContent.classList.toggle('expanded');
    });

    document.getElementById('menu-logout').addEventListener('click', (e) => {
        e.preventDefault();
        doLogout();
    });

    // Mobile User Profile Modal Handlers
    const btnUserProfile = document.getElementById('btn-user-profile');
    const modalUserProfile = document.getElementById('modal-user-profile');
    const btnCloseProfileModal = document.getElementById('btn-close-profile-modal');
    const btnMobileLogout = document.getElementById('btn-mobile-logout');

    if (btnUserProfile && modalUserProfile) {
        btnUserProfile.addEventListener('click', () => {
            updateProfileModalInfo();
            modalUserProfile.style.display = 'flex';
        });
    }

    if (btnCloseProfileModal && modalUserProfile) {
        btnCloseProfileModal.addEventListener('click', () => {
            modalUserProfile.style.display = 'none';
        });
    }

    if (modalUserProfile) {
        modalUserProfile.addEventListener('click', (e) => {
            if (e.target === modalUserProfile) {
                modalUserProfile.style.display = 'none';
            }
        });
    }

    if (btnMobileLogout) {
        btnMobileLogout.addEventListener('click', () => {
            if (modalUserProfile) modalUserProfile.style.display = 'none';
            doLogout();
        });
    }

    initPasswordToggle();
});

// --- Password Eye Toggle Handler ---
function initPasswordToggle() {
    document.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('.btn-toggle-password');
        if (!toggleBtn) return;

        let input = null;
        const targetId = toggleBtn.getAttribute('data-target');
        if (targetId) {
            input = document.getElementById(targetId);
        } else {
            const parent = toggleBtn.closest('.input-group, .password-input-group, .form-group');
            if (parent) input = parent.querySelector('input');
        }

        if (input) {
            const icon = toggleBtn.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                if (icon) {
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                }
            } else {
                input.type = 'password';
                if (icon) {
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            }
        }
    });
}

// --- Auth Functions ---
function checkSession() {
    const sessionUser = localStorage.getItem('pkk_user');
    if (sessionUser) {
        currentUser = JSON.parse(sessionUser);
        showMainScreen();
    } else {
        showLoginScreen();
    }
}

let supabaseClient = null;

function getSupabaseClient() {
    if (!supabaseClient && window.supabase && typeof window.supabase.createClient === 'function') {
        if (typeof SUPABASE_CONFIG !== 'undefined' && SUPABASE_CONFIG.URL && SUPABASE_CONFIG.URL.includes('.supabase.co')) {
            supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY);
        }
    }
    return supabaseClient;
}

async function fetchSupabaseAPI(action, payload = {}) {
    const sb = getSupabaseClient();
    if (!sb) return { success: false, message: "Supabase client belum terkonfigurasi. Periksa SUPABASE_CONFIG di config.js" };

    try {
        if (action === 'login') {
            const { nip, password } = payload;
            const targetNip = String(nip || '').trim();
            const targetPass = String(password || '').trim();

            const { data, error } = await sb.from('users').select('*');
            if (error) throw error;

            const userList = data || [];
            const cleanStr = str => String(str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

            const matched = userList.find(u => {
                const uNip = String(u.nip || '').trim().toLowerCase();
                const uPass = String(u.password || '').trim();
                const rawNip = targetNip.toLowerCase();

                const nipOk = uNip === rawNip || cleanStr(uNip) === cleanStr(targetNip);
                const passOk = uPass === targetPass || cleanStr(uPass) === cleanStr(targetPass);
                return nipOk && passOk;
            });

            if (matched) {
                return {
                    success: true,
                    user: {
                        nip: matched.nip,
                        nama: matched.nama,
                        level: matched.level,
                        jabatan: matched.jabatan,
                        unit: matched.unit,
                        atasan1: matched.atasan1 || '',
                        atasan2: matched.atasan2 || ''
                    }
                };
            }
            return { success: false, message: "NIP atau Password salah." };
        }

        if (action === 'getUsers') {
            const { data, error } = await sb.from('users').select('*');
            if (error) throw error;
            return { success: true, data: data || [] };
        }

        if (action === 'getTahunAjaran') {
            const { data, error } = await sb.from('tahun_ajaran').select('*');
            if (error) throw error;
            const list = data || [];
            const activeObj = list.find(t => t.status === 'Aktif');
            return {
                success: true,
                data: list,
                active: activeObj ? activeObj.tahun : (list[0] ? list[0].tahun : '2025/2026')
            };
        }

        if (action === 'getSKIs') {
            let query = sb.from('skis').select('*');
            if (payload.createdByNIP) {
                query = query.eq('created_by_nip', payload.createdByNIP);
            }
            const { data, error } = await query;
            if (error) throw error;
            
            const skis = (data || []).map(item => ({
                id: item.id,
                createdByNIP: item.created_by_nip,
                targetUnit: item.target_unit,
                targetLevel: item.target_level,
                targetJabatan: item.target_jabatan,
                kpiDepartemen: item.kpi_departemen,
                ski: item.ski,
                targetDetail: item.target_detail,
                kriteria1: item.kriteria1,
                kriteria2: item.kriteria2,
                kriteria3: item.kriteria3,
                kriteria4: item.kriteria4,
                kriteria5: item.kriteria5,
                bobot: item.bobot
            }));
            return { success: true, data: skis };
        }

        if (action === 'saveSKI') {
            const ski = payload.skiData || {};
            const row = {
                created_by_nip: ski.createdByNIP || '',
                target_unit: ski.targetUnit || '',
                target_level: ski.targetLevel || '',
                target_jabatan: ski.targetJabatan || '',
                kpi_departemen: ski.kpiDepartemen || '',
                ski: ski.ski || '',
                target_detail: ski.targetDetail || '',
                kriteria1: ski.kriteria1 || '',
                kriteria2: ski.kriteria2 || '',
                kriteria3: ski.kriteria3 || '',
                kriteria4: ski.kriteria4 || '',
                kriteria5: ski.kriteria5 || '',
                bobot: ski.bobot || 0
            };
            if (ski.id && !String(ski.id).startsWith('SKI_')) {
                const { error } = await sb.from('skis').update(row).eq('id', ski.id);
                if (error) throw error;
            } else {
                const { error } = await sb.from('skis').insert([row]);
                if (error) throw error;
            }
            return { success: true };
        }

        if (action === 'saveBatchSKI') {
            const list = payload.skiList || [];
            if (list.length === 0) return { success: true };

            // Jika replaceExistingGroup tidak diset false (default true),
            // perbarui (replace) data SKI lama HANYA untuk kombinasi (Unit + Level + Jabatan) yang ada di file upload
            if (payload.replaceExistingGroup !== false) {
                const uniqueGroups = [];
                list.forEach(ski => {
                    const u = (ski.targetUnit || '').trim();
                    const l = (ski.targetLevel || '').trim();
                    const j = (ski.targetJabatan || '').trim();
                    if (u || l || j) {
                        const key = `${u}||${l}||${j}`;
                        if (!uniqueGroups.some(g => g.key === key)) {
                            uniqueGroups.push({ key, unit: u, level: l, jabatan: j });
                        }
                    }
                });

                for (const group of uniqueGroups) {
                    let q = sb.from('skis').delete();
                    if (group.unit) q = q.eq('target_unit', group.unit);
                    if (group.level) q = q.eq('target_level', group.level);
                    if (group.jabatan) q = q.eq('target_jabatan', group.jabatan);
                    const { error: delErr } = await q;
                    if (delErr) console.warn("Notice: Clear existing SKI group before update:", delErr);
                }
            }

            const updates = [];
            const inserts = [];

            list.forEach(ski => {
                const row = {
                    created_by_nip: ski.createdByNIP || '',
                    target_unit: ski.targetUnit || '',
                    target_level: ski.targetLevel || '',
                    target_jabatan: ski.targetJabatan || '',
                    kpi_departemen: ski.kpiDepartemen || '',
                    ski: ski.ski || '',
                    target_detail: ski.targetDetail || '',
                    kriteria1: ski.kriteria1 || '',
                    kriteria2: ski.kriteria2 || '',
                    kriteria3: ski.kriteria3 || '',
                    kriteria4: ski.kriteria4 || '',
                    kriteria5: ski.kriteria5 || '',
                    bobot: ski.bobot || 0
                };

                if (ski.id && !String(ski.id).startsWith('SKI_')) {
                    row.id = isNaN(parseInt(ski.id)) ? ski.id : parseInt(ski.id);
                    updates.push(row);
                } else {
                    inserts.push(row);
                }
            });

            if (updates.length > 0) {
                const { error: upErr } = await sb.from('skis').upsert(updates, { onConflict: 'id' });
                if (upErr) throw upErr;
            }

            if (inserts.length > 0) {
                const { error: insErr } = await sb.from('skis').insert(inserts);
                if (insErr) throw insErr;
            }

            return { success: true };
        }

        if (action === 'deleteSKI') {
            let filterId = isNaN(parseInt(payload.id)) ? payload.id : parseInt(payload.id);
            const { error } = await sb.from('skis').delete().eq('id', filterId);
            if (error) throw error;
            return { success: true };
        }

        if (action === 'getPKKs') {
            let query = sb.from('pkks').select('*');
            if (payload.nip) query = query.eq('nip', payload.nip);
            if (payload.status) query = query.eq('status', payload.status);
            query = query.order('id', { ascending: false });

            const { data, error } = await query;
            if (error) throw error;

            const pkks = (data || []).map(p => {
                const evalData = (typeof p.evaluasi_data === 'string' ? JSON.parse(p.evaluasi_data) : p.evaluasi_data) || {};
                return {
                    id: p.id,
                    nip: p.nip,
                    nama: p.nama,
                    unit: p.unit,
                    tahunAjaran: p.tahun_ajaran,
                    finalScore: p.final_score,
                    finalGrade: p.final_grade,
                    status: p.status,
                    tanggal: p.tanggal,
                    evaluasiData: evalData,
                    verifikasi1Data: p.verifikasi1_data,
                    verifikasi2Data: p.verifikasi2_data,
                    p_kualitas_hasil_kerja: evalData.p_kualitas_hasil_kerja,
                    p_ketepatan_waktu: evalData.p_ketepatan_waktu,
                    p_keterampilan_kerja: evalData.p_keterampilan_kerja,
                    p_kerjasama: evalData.p_kerjasama,
                    p_disiplin: evalData.p_disiplin,
                    p_inisiatif: evalData.p_inisiatif,
                    p_peningkatan_tanggung_jawab: evalData.p_peningkatan_tanggung_jawab,
                    p_ahlak_islami: evalData.p_ahlak_islami,
                    p_adaptasi_terhadap_perubahan: evalData.p_adaptasi_terhadap_perubahan,
                    m_planning_organizing: evalData.m_planning_organizing,
                    m_controlling: evalData.m_controlling,
                    m_analytical_thinking: evalData.m_analytical_thinking,
                    m_decision_making: evalData.m_decision_making,
                    m_developing_others: evalData.m_developing_others,
                    rekomendasiPerbaikan: evalData.rekomendasiPerbaikan,
                    rekomendasiAkhir: evalData.rekomendasiAkhir,
                    skiAnswers: evalData.skiAnswers,
                    keteranganPerbaikan: evalData.keteranganPerbaikan,
                    alasanKeputusan: evalData.alasanKeputusan,
                    atasanNIP1: evalData.atasanNIP1,
                    atasanNIP2: evalData.atasanNIP2
                };
            });
            return { success: true, data: pkks };
        }

        if (action === 'savePKK') {
            const pkk = payload.pkkData || {};

            const evaluasiObj = (pkk.evaluasiData && Object.keys(pkk.evaluasiData).length > 0) ? pkk.evaluasiData : {
                p_kualitas_hasil_kerja: pkk.p_kualitas_hasil_kerja,
                p_ketepatan_waktu: pkk.p_ketepatan_waktu,
                p_keterampilan_kerja: pkk.p_keterampilan_kerja,
                p_kerjasama: pkk.p_kerjasama,
                p_disiplin: pkk.p_disiplin,
                p_inisiatif: pkk.p_inisiatif,
                p_peningkatan_tanggung_jawab: pkk.p_peningkatan_tanggung_jawab,
                p_ahlak_islami: pkk.p_ahlak_islami,
                p_adaptasi_terhadap_perubahan: pkk.p_adaptasi_terhadap_perubahan,
                m_planning_organizing: pkk.m_planning_organizing,
                m_controlling: pkk.m_controlling,
                m_analytical_thinking: pkk.m_analytical_thinking,
                m_decision_making: pkk.m_decision_making,
                m_developing_others: pkk.m_developing_others,
                rekomendasiPerbaikan: pkk.rekomendasiPerbaikan,
                rekomendasiAkhir: pkk.rekomendasiAkhir,
                skiAnswers: pkk.skiAnswers,
                keteranganPerbaikan: pkk.keteranganPerbaikan,
                alasanKeputusan: pkk.alasanKeputusan,
                atasanNIP1: pkk.atasanNIP1,
                atasanNIP2: pkk.atasanNIP2
            };

            const row = {
                nip: pkk.nip || '',
                nama: pkk.nama || '',
                unit: pkk.unit || '',
                tahun_ajaran: pkk.tahunAjaran || '2025/2026',
                final_score: pkk.finalScore || 0,
                final_grade: pkk.finalGrade || '-',
                status: pkk.status || 'Draft',
                tanggal: pkk.tanggal || new Date().toISOString().split('T')[0],
                evaluasi_data: evaluasiObj,
                verifikasi1_data: pkk.verifikasi1Data || {},
                verifikasi2_data: pkk.verifikasi2Data || {}
            };

            let savedId = pkk.id;
            if (pkk.id && !String(pkk.id).startsWith('PKK_')) {
                const filterId = isNaN(parseInt(pkk.id)) ? pkk.id : parseInt(pkk.id);
                const { error } = await sb.from('pkks').update(row).eq('id', filterId);
                if (error) throw error;
            } else {
                const { data: existing } = await sb.from('pkks').select('id').eq('nip', pkk.nip).order('id', { ascending: false });
                if (existing && existing.length > 0) {
                    savedId = existing[0].id;
                    const { error } = await sb.from('pkks').update(row).eq('id', savedId);
                    if (error) throw error;
                } else {
                    const { data: insData, error } = await sb.from('pkks').insert([row]).select();
                    if (error) throw error;
                    if (insData && insData.length > 0) savedId = insData[0].id;
                }
            }
            return { success: true, id: savedId, message: `Evaluasi Mandiri berhasil disimpan dengan status ${pkk.status || 'Draft'}.` };
        }

        if (action === 'getBobot') {
            const local = getLocalCache('pkk_bobot_matrix_cache');
            if (local && Array.isArray(local) && local.length > 0) {
                return { success: true, data: local };
            }
            try {
                const { data } = await sb.from('bobot').select('*').eq('jabatan', 'setting_matrix');
                if (data && data.length > 0 && data[0].kpi) {
                    let parsed = typeof data[0].kpi === 'string' ? JSON.parse(data[0].kpi) : data[0].kpi;
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        setLocalCache('pkk_bobot_matrix_cache', parsed);
                        return { success: true, data: parsed };
                    }
                }
            } catch (e) {
                console.warn("Notice: Fetching bobot matrix fallback:", e);
            }
            return { success: true, data: DEFAULT_BOBOT_MATRIX };
        }

        if (action === 'saveBobot') {
            const matrix = payload.bobotData || [];
            setLocalCache('pkk_bobot_matrix_cache', matrix);
            try {
                const { data: existing } = await sb.from('bobot').select('id').eq('jabatan', 'setting_matrix');
                if (existing && existing.length > 0) {
                    await sb.from('bobot').update({ kpi: JSON.stringify(matrix) }).eq('id', existing[0].id);
                } else {
                    await sb.from('bobot').insert([{ jabatan: 'setting_matrix', kpi: 0 }]);
                }
            } catch (e) {
                console.warn("Notice: Saved bobot matrix locally:", e);
            }
            return { success: true };
        }

        if (action === 'saveUser') {
            const u = payload.userData || {};
            const row = {
                nip: String(u.nip || '').trim(),
                password: String(u.password || u.nip || '').trim(),
                nama: String(u.nama || '').trim(),
                level: String(u.level || 'Staff').trim(),
                jabatan: String(u.jabatan || '').trim(),
                unit: String(u.unit || '').trim(),
                atasan1: String(u.atasan1 || '').trim(),
                atasan2: String(u.atasan2 || '').trim()
            };
            const { error } = await sb.from('users').upsert([row], { onConflict: 'nip' });
            if (error) throw error;
            return { success: true };
        }

        if (action === 'saveBatchUsers') {
            const list = payload.userList || [];
            const rows = list.map(u => ({
                nip: String(u.nip || '').trim(),
                password: String(u.password || u.nip || '').trim(),
                nama: String(u.nama || '').trim(),
                level: String(u.level || 'Staff').trim(),
                jabatan: String(u.jabatan || '').trim(),
                unit: String(u.unit || '').trim(),
                atasan1: String(u.atasan1 || '').trim(),
                atasan2: String(u.atasan2 || '').trim()
            })).filter(u => u.nip.length > 0);

            const { error } = await sb.from('users').upsert(rows, { onConflict: 'nip' });
            if (error) throw error;
            return { success: true };
        }

        if (action === 'deleteUser') {
            const { error } = await sb.from('users').delete().eq('nip', payload.nip);
            if (error) throw error;
            return { success: true };
        }

        if (action === 'getDashboard' || action === 'getPengumuman') {
            const { data, error } = await sb.from('pengumuman').select('*').order('id', { ascending: false });
            if (error) throw error;
            const list = (data || []).map(p => ({
                id: p.id,
                judul: p.judul,
                deskripsi: p.deskripsi,
                tanggal: p.tanggal || (p.created_at ? p.created_at.split('T')[0] : '')
            }));
            return { success: true, pengumuman: list, data: list };
        }

        if (action === 'savePengumuman') {
            const p = payload.pengumuman || {};
            const row = {
                judul: String(p.judul || '').trim(),
                deskripsi: String(p.deskripsi || '').trim(),
                tanggal: p.tanggal || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
            };

            if (p.id && !isNaN(parseInt(p.id))) {
                const { error } = await sb.from('pengumuman').update(row).eq('id', parseInt(p.id));
                if (error) throw error;
            } else {
                const { error } = await sb.from('pengumuman').insert([row]);
                if (error) throw error;
            }
            return { success: true, message: "Pengumuman berhasil disimpan!" };
        }

        if (action === 'getTahunAjaran') {
            const { data, error } = await sb.from('tahun_ajaran').select('*').order('id', { ascending: true });
            if (error) throw error;
            let list = (data || []).map(t => ({
                id: String(t.id),
                tahun: t.tahun,
                status: t.status || 'Tidak Aktif'
            }));

            if (list.length === 0) {
                try {
                    const seedRows = [
                        { tahun: '2024/2025', status: 'Tidak Aktif' },
                        { tahun: '2025/2026', status: 'Aktif' }
                    ];
                    const { data: seedData } = await sb.from('tahun_ajaran').insert(seedRows).select();
                    if (seedData && seedData.length > 0) {
                        list = seedData.map(t => ({
                            id: String(t.id),
                            tahun: t.tahun,
                            status: t.status || 'Tidak Aktif'
                        }));
                    }
                } catch (e) {
                    console.warn("Notice: Tahun Ajaran auto seed fallback:", e);
                    list = [
                        { id: '1', tahun: '2024/2025', status: 'Tidak Aktif' },
                        { id: '2', tahun: '2025/2026', status: 'Aktif' }
                    ];
                }
            }

            const activeObj = list.find(t => t.status === 'Aktif');
            const activeYear = activeObj ? activeObj.tahun : (list.length > 0 ? list[list.length - 1].tahun : '2025/2026');

            return { success: true, data: list, active: activeYear };
        }

        if (action === 'addTahunAjaran') {
            const tahun = String(payload.tahun || '').trim();
            if (!tahun) throw new Error("Tahun Ajaran tidak boleh kosong");
            const { error } = await sb.from('tahun_ajaran').insert([{ tahun: tahun, status: 'Tidak Aktif' }]);
            if (error) throw error;
            return { success: true, message: `Tahun Ajaran ${tahun} berhasil ditambahkan!` };
        }

        if (action === 'setAktifTahunAjaran') {
            const targetId = payload.id;
            const { error: resetErr } = await sb.from('tahun_ajaran').update({ status: 'Tidak Aktif' }).neq('id', 0);
            if (resetErr) console.warn("Reset TA status notice:", resetErr);

            let filterVal = isNaN(parseInt(targetId)) ? targetId : parseInt(targetId);
            const { error: actErr } = await sb.from('tahun_ajaran').update({ status: 'Aktif' }).eq('id', filterVal);
            if (actErr) throw actErr;

            return { success: true, message: "Tahun Ajaran berhasil diaktifkan!" };
        }

        if (action === 'changePassword') {
            const nip = String(payload.nip || '').trim();
            const oldPassword = String(payload.oldPassword || '').trim();
            const newPassword = String(payload.newPassword || '').trim();

            if (!nip) throw new Error("NIP tidak ditemukan");
            if (!newPassword) throw new Error("Password baru tidak boleh kosong");

            const { data: userRows, error: findErr } = await sb.from('users').select('*').eq('nip', nip);
            if (findErr || !userRows || userRows.length === 0) {
                return { success: false, message: "User tidak ditemukan di database." };
            }

            const dbUser = userRows[0];
            if (dbUser.password && dbUser.password !== oldPassword) {
                return { success: false, message: "Password lama tidak sesuai!" };
            }

            const { error: updateErr } = await sb.from('users').update({ password: newPassword }).eq('nip', nip);
            if (updateErr) throw updateErr;

            return { success: true, message: "Password berhasil diubah!" };
        }

        return { success: false, message: "Action Supabase belum didukung." };
    } catch (err) {
        console.error("Supabase API Error:", err);
        return { success: false, message: err.message || "Error Supabase API" };
    }
}

async function fetchGasAPI(action, payload = {}) {
    if (APP_CONFIG.USE_MOCK) {
        return new Promise(resolve => setTimeout(() => resolve({ success: true }), 300));
    }
    return fetchSupabaseAPI(action, payload);
}

let isDatabaseConnected = false;

async function connectDatabaseWarmup() {
    const btn = document.getElementById('btn-login');
    if (!btn) return;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Menghubungkan ke Supabase...';
    btn.disabled = true;

    try {
        await fetchSupabaseAPI('getTahunAjaran');
        setDatabaseConnectedState(true);
    } catch (e) {
        setDatabaseConnectedState(true);
    }
}

function setDatabaseConnectedState(connected) {
    isDatabaseConnected = connected;
    const btn = document.getElementById('btn-login');
    if (btn) {
        btn.innerHTML = 'Masuk <i class="fas fa-arrow-right ml-1"></i>';
        btn.disabled = false;
    }
}

async function doLogin(nip, password) {
    const btn = document.getElementById('btn-login');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Memverifikasi...';
    btn.disabled = true;

    if (APP_CONFIG.USE_MOCK) {
        const user = MOCK_DB.users.find(u => String(u.nip).trim() === String(nip).trim() && String(u.password).trim() === String(password).trim());
        if (user) {
            currentUser = user;
            localStorage.setItem('pkk_user', JSON.stringify(user));
            showToast('Login berhasil! Selamat datang, ' + user.nama, 'success');
            showMainScreen();
        } else {
            showToast('NIP atau Password salah!', 'error');
        }
    } else {
        const res = await fetchGasAPI('login', { nip, password });
        if (res && res.success) {
            currentUser = res.user;
            localStorage.setItem('pkk_user', JSON.stringify(res.user));
            showToast('Login berhasil! Selamat datang, ' + res.user.nama, 'success');
            showMainScreen();
        } else {
            showToast(res ? res.message : 'NIP atau Password salah!', 'error');
        }
    }

    btn.innerHTML = 'Masuk <i class="fas fa-arrow-right ml-1"></i>';
    btn.disabled = false;
}

function doLogout() {
    currentUser = null;
    localStorage.removeItem('pkk_user');
    showLoginScreen();
    showToast('Berhasil keluar.', 'success');
}

// --- UI Functions ---
function showLoginScreen() {
    elMainScreen.classList.remove('active');
    elLoginScreen.classList.add('active');
    document.getElementById('login-nip').value = '';
    document.getElementById('login-password').value = '';
    
    // Warm up & connect to database before user clicks login
    connectDatabaseWarmup();
}

// --- Helper LocalStorage Cache System ---
function getLocalCache(key) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed && parsed.data ? parsed.data : null;
    } catch (e) {
        return null;
    }
}

function setLocalCache(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify({
            timestamp: Date.now(),
            data: data
        }));
    } catch (e) {
        console.warn("LocalStorage caching limit reached:", e);
    }
}

function clearLocalCache(key) {
    try {
        localStorage.removeItem(key);
    } catch (e) {}
}

// --- Global Data Cache System ---
let _allUsersCache = [];
let _isUsersCacheLoaded = false;

let _allPkksCache = [];
let _isPkksCacheLoaded = false;

let _activeTahunCache = '2025/2026';
let _allTahunCache = [];
let _isTahunCacheLoaded = false;

async function loadUsersData(forceRefresh = false) {
    if (_isUsersCacheLoaded && !forceRefresh) return _allUsersCache;

    if (!forceRefresh && _allUsersCache.length === 0) {
        const local = getLocalCache('pkk_users_cache');
        if (local && Array.isArray(local) && local.length > 0) {
            _allUsersCache = local;
            _isUsersCacheLoaded = true;
            fetchGasAPI('getUsers').then(res => {
                if (res && res.success && Array.isArray(res.data)) {
                    _allUsersCache = res.data;
                    setLocalCache('pkk_users_cache', res.data);
                }
            }).catch(() => {});
            return _allUsersCache;
        }
    }

    if (APP_CONFIG.USE_MOCK) {
        _allUsersCache = MOCK_DB.users || [];
        _isUsersCacheLoaded = true;
    } else {
        const res = await fetchGasAPI('getUsers');
        if (res && res.success) {
            _allUsersCache = res.data || [];
            _isUsersCacheLoaded = true;
            setLocalCache('pkk_users_cache', _allUsersCache);
        }
    }
    return _allUsersCache;
}

async function loadPkksData(forceRefresh = false) {
    if (_isPkksCacheLoaded && !forceRefresh) return _allPkksCache;

    if (!forceRefresh && _allPkksCache.length === 0) {
        const local = getLocalCache('pkk_pkks_cache');
        if (local && Array.isArray(local) && local.length > 0) {
            _allPkksCache = local;
            _isPkksCacheLoaded = true;
            fetchGasAPI('getPKKs').then(res => {
                if (res && res.success && Array.isArray(res.data)) {
                    _allPkksCache = res.data;
                    setLocalCache('pkk_pkks_cache', res.data);
                }
            }).catch(() => {});
            return _allPkksCache;
        }
    }

    if (APP_CONFIG.USE_MOCK) {
        _allPkksCache = MOCK_DB.pkks || [];
        _isPkksCacheLoaded = true;
    } else {
        const res = await fetchGasAPI('getPKKs');
        if (res && res.success) {
            _allPkksCache = res.data || [];
            _isPkksCacheLoaded = true;
            setLocalCache('pkk_pkks_cache', _allPkksCache);
        }
    }
    return _allPkksCache;
}

async function loadTahunAjaranData(forceRefresh = false) {
    if (_isTahunCacheLoaded && !forceRefresh) return { active: _activeTahunCache, list: _allTahunCache };

    if (!forceRefresh && _allTahunCache.length === 0) {
        const local = getLocalCache('pkk_ta_cache');
        if (local && local.list && Array.isArray(local.list) && local.list.length > 0) {
            _activeTahunCache = local.active || _activeTahunCache;
            _allTahunCache = local.list;
            _isTahunCacheLoaded = true;
            fetchGasAPI('getTahunAjaran').then(res => {
                if (res && res.success) {
                    _activeTahunCache = res.active || _activeTahunCache;
                    _allTahunCache = res.data || [];
                    setLocalCache('pkk_ta_cache', { active: _activeTahunCache, list: _allTahunCache });
                }
            }).catch(() => {});
            return { active: _activeTahunCache, list: _allTahunCache };
        }
    }

    if (APP_CONFIG.USE_MOCK) {
        _activeTahunCache = '2025/2026';
        _allTahunCache = [{ id: 'TA1', tahun: '2025/2026', status: 'Aktif' }];
        _isTahunCacheLoaded = true;
    } else {
        const res = await fetchGasAPI('getTahunAjaran');
        if (res && res.success) {
            _activeTahunCache = res.active || _activeTahunCache;
            _allTahunCache = res.data || [];
            _isTahunCacheLoaded = true;
            setLocalCache('pkk_ta_cache', { active: _activeTahunCache, list: _allTahunCache });
        }
    }
    return { active: _activeTahunCache, list: _allTahunCache };
}

async function preloadAppData() {
    if (APP_CONFIG.USE_MOCK) return;
    try {
        await Promise.all([
            loadTahunAjaranData(),
            loadUsersData(),
            loadPkksData(),
            loadSkisData()
        ]);
        const taEl = document.getElementById('active-academic-year');
        if (taEl && _activeTahunCache) {
            taEl.innerText = "TA. " + _activeTahunCache;
        }
    } catch (err) {
        console.error("Error preloading data:", err);
    }
}

async function showMainScreen() {
    elLoginScreen.classList.remove('active');
    elMainScreen.classList.add('active');

    // Preload data secara paralel di background untuk respon super cepat
    preloadAppData();

    // Update sidebar info & mobile profile modal info
    document.getElementById('sidebar-user-name').innerText = currentUser.nama;
    document.getElementById('sidebar-user-role').innerText = currentUser.level;
    updateProfileModalInfo();

    renderSidebar();
    navigate('dashboard');
}

function updateProfileModalInfo() {
    if (!currentUser) return;
    const nameEl = document.getElementById('mobile-profile-name');
    const roleEl = document.getElementById('mobile-profile-role');
    const nipEl = document.getElementById('mobile-profile-nip');
    const unitEl = document.getElementById('mobile-profile-unit');
    const jabatanEl = document.getElementById('mobile-profile-jabatan');
    const initialsEl = document.getElementById('user-avatar-initials');

    if (nameEl) nameEl.innerText = currentUser.nama || '-';
    if (roleEl) roleEl.innerText = currentUser.level || '-';
    if (nipEl) nipEl.innerText = currentUser.nip || '-';
    if (unitEl) unitEl.innerText = currentUser.unit || '-';
    if (jabatanEl) jabatanEl.innerText = currentUser.jabatan || '-';

    if (initialsEl && currentUser.nama) {
        const parts = currentUser.nama.trim().split(' ');
        const init = parts.length > 1 ? (parts[0][0] + parts[1][0]) : parts[0].substring(0, 2);
        initialsEl.innerText = init.toUpperCase();
    }
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> <span>${message}</span>`;

    elToastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

const SHORT_MENU_TEXT = {
    "dashboard": "Dasbor",
    "manajemen_user": "User",
    "monitoring": "Monitoring",
    "settings": "Settings",
    "tahun_ajaran": "Periode",
    "ubah_password": "Password",
    "verifikasi": "Verifikasi",
    "evaluasi": "Evaluasi",
    "riwayat": "Riwayat",
    "daftar_ski": "SKI",
    "form_ski": "Form SKI"
};

function renderSidebar() {
    const menus = MENU_CONFIG[currentUser.level] || [];
    elSidebarMenu.innerHTML = '';

    const elMobileBottomMenu = document.getElementById('mobile-bottom-menu');
    if (elMobileBottomMenu) {
        elMobileBottomMenu.innerHTML = '';
    }

    menus.forEach(menu => {
        // Render Desktop Sidebar Item
        const a = document.createElement('a');
        a.href = `#${menu.id}`;
        a.className = 'nav-item';
        a.innerHTML = `<i class="${menu.icon}"></i> <span>${menu.text}</span>`;
        a.onclick = (e) => {
            e.preventDefault();
            window.reviewTargetPkk = null; // Reset review mode if user navigates via sidebar
            navigate(menu.id);
            if (window.innerWidth <= 768) {
                elSidebar.classList.remove('mobile-open');
            }
        };
        elSidebarMenu.appendChild(a);

        // Render Mobile Bottom Nav Item
        if (elMobileBottomMenu) {
            const shortText = SHORT_MENU_TEXT[menu.id] || menu.text;
            const mobileA = document.createElement('a');
            mobileA.href = `#${menu.id}`;
            mobileA.className = 'mobile-nav-item';
            mobileA.setAttribute('data-page', menu.id);
            mobileA.setAttribute('title', menu.text);
            mobileA.innerHTML = `<i class="${menu.icon}"></i><span>${shortText}</span>`;
            mobileA.onclick = (e) => {
                e.preventDefault();
                window.reviewTargetPkk = null;
                navigate(menu.id);
            };
            elMobileBottomMenu.appendChild(mobileA);
        }
    });
}

function navigate(pageId) {
    currentAppPage = pageId;

    if (pageId !== 'evaluasi') {
        window.reviewTargetPkk = null;
        window.isViewOnlyMode = false;
    }

    // Update Active State Desktop Sidebar
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(el => {
        el.classList.remove('active');
        if (el.getAttribute('href') === `#${pageId}`) el.classList.add('active');
    });

    // Update Active State Mobile Bottom Nav
    document.querySelectorAll('.mobile-bottom-nav .mobile-nav-item').forEach(el => {
        el.classList.remove('active');
        if (el.getAttribute('data-page') === pageId || el.getAttribute('href') === `#${pageId}`) {
            el.classList.add('active');
        }
    });

    const menuInfo = MENU_CONFIG[currentUser.level].find(m => m.id === pageId);
    elPageTitle.innerText = menuInfo ? menuInfo.text : pageId;

    renderPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderPage(pageId) {
    elContentArea.innerHTML = '';

    let tplId = `tpl-${pageId}`;
    let template = document.getElementById(tplId);

    if (template) {
        elContentArea.appendChild(template.content.cloneNode(true));

        // Execute Page Specific Logic
        if (pageId === 'dashboard') initDashboard();
        if (pageId === 'manajemen_user') initManajemenUser();
        if (pageId === 'evaluasi') initEvaluasiMandiri();
        if (pageId === 'verifikasi') initVerifikasi();
        if (pageId === 'ubah_password') initUbahPassword();
        if (pageId === 'settings') initSettings();
        if (pageId === 'tahun_ajaran') initTahunAjaran();
        if (pageId === 'form_ski') initFormSki();
        if (pageId === 'daftar_ski') initDaftarSki();
        if (pageId === 'riwayat') initRiwayat();
        if (pageId === 'monitoring') initMonitoring();
    } else {
        elContentArea.innerHTML = `<div class="card"><div class="card-body"><h4>Halaman "${pageId}" Sedang dalam pengembangan.</h4></div></div>`;
    }
}

// --- Page: Dashboard ---
let topEmployeesChartInstance = null;
let dashboardScoredEmployees = [];

async function initDashboard() {
    const annContainer = document.getElementById('dashboard-announcements');
    const statsContainer = document.getElementById('dashboard-stats');
    const chartSection = document.getElementById('dashboard-chart-section');

    // Roles that see full stats + chart
    const MANAGEMENT_ROLES = ['Super Admin', 'Direktur', 'General Manager'];
    const isManagement = MANAGEMENT_ROLES.includes(currentUser.level);

    // --- PERSONAL PROFILE (for non-management roles) ---
    if (!isManagement) {
        // Hide stats grid and chart section
        if (statsContainer) statsContainer.style.display = 'none';
        if (chartSection) chartSection.style.display = 'none';

        // Render personal info card
        const profileEl = document.getElementById('dashboard-profile-card');
        if (profileEl) {
            // Fetch own PKK data
            let myPkk = null;
            let activeTahun = '';
            if (!APP_CONFIG.USE_MOCK) {
                const [taInfo, pkkList] = await Promise.all([
                    loadTahunAjaranData(),
                    loadPkksData()
                ]);
                activeTahun = taInfo ? taInfo.active : '';
                myPkk = (pkkList || []).find(p => p.nip == currentUser.nip && (!activeTahun || p.tahunAjaran === activeTahun));
            }

            const statusLabel = myPkk ? myPkk.status : 'Belum Mengisi';
            const statusClass = !myPkk ? 'status-empty'
                : myPkk.status === 'Selesai' ? 'status-success'
                : myPkk.status === 'Draft' ? 'status-draft'
                : 'status-pending';
            const finalScore = myPkk ? (myPkk.finalScore || '-') : '-';
            const finalGrade = myPkk ? (myPkk.finalGrade || '-') : '-';
            const tahun = myPkk ? (myPkk.tahunAjaran || activeTahun || '-') : (activeTahun || '-');

            profileEl.innerHTML = `
                <div class="card glass-card" style="margin-bottom:20px;">
                    <div class="card-header" style="background:linear-gradient(135deg, #036F3E, #529837); color:white; border-radius:14px 14px 0 0;">
                        <h3 style="color:white; display:flex; align-items:center; gap:10px;">
                            <i class="fas fa-id-card"></i> Data Diri Karyawan
                        </h3>
                    </div>
                    <div class="card-body">
                        <div style="display:grid; grid-template-columns: auto 1fr; gap:20px; align-items:center;">
                            <!-- Avatar -->
                            <div style="width:80px; height:80px; border-radius:16px; background:linear-gradient(135deg,#036F3E,#529837); color:white; display:flex; align-items:center; justify-content:center; font-size:2rem; box-shadow:0 8px 20px rgba(3,111,62,0.3); flex-shrink:0;">
                                <i class="fas fa-user"></i>
                            </div>
                            <!-- Info -->
                            <div>
                                <div style="font-size:1.35rem; font-weight:800; color:#036F3E; font-family:'Outfit',sans-serif;">${currentUser.nama}</div>
                                <div style="color:#529837; font-weight:600; font-size:0.92rem; margin-top:3px;">${currentUser.jabatan || '-'}</div>
                                <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:8px;">
                                    <span style="background:#E6F4ED; color:#036F3E; padding:3px 12px; border-radius:20px; font-size:0.78rem; font-weight:600;">
                                        <i class="fas fa-building"></i> ${currentUser.unit || '-'}
                                    </span>
                                    <span style="background:#FFF7ED; color:#C2410C; padding:3px 12px; border-radius:20px; font-size:0.78rem; font-weight:600;">
                                        <i class="fas fa-layer-group"></i> ${currentUser.level || '-'}
                                    </span>
                                    <span style="background:#F1F5F9; color:#475569; padding:3px 12px; border-radius:20px; font-size:0.78rem; font-weight:600;">
                                        <i class="fas fa-hashtag"></i> NIP: ${currentUser.nip}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- PKK Status -->
                        <div style="margin-top:20px; padding:16px; background:#F0FAF5; border-radius:12px; border:1.5px solid #D1FAE5;">
                            <div style="font-size:0.8rem; font-weight:700; color:#529837; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:10px;">
                                <i class="fas fa-chart-line"></i> Status PKK — TA. ${tahun}
                            </div>
                            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
                                <span class="status-badge ${statusClass}" style="font-size:0.82rem; padding:6px 16px;">
                                    ${statusLabel}
                                </span>
                                ${finalScore !== '-' ? `
                                <div style="text-align:right;">
                                    <div style="font-size:0.75rem; color:#64748b; margin-bottom:2px;">SKOR AKHIR</div>
                                    <div style="font-size:1.8rem; font-weight:800; color:#036F3E; line-height:1;">${finalScore}</div>
                                    <div style="font-size:0.78rem; font-weight:600; color:#529837;">Kategori: ${finalGrade}</div>
                                </div>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    } else {
        // --- MANAGEMENT: Full Stats + Chart ---
        if (statsContainer) statsContainer.style.display = '';
        if (chartSection) chartSection.style.display = '';

        if (statsContainer) {
            statsContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align:center; padding:20px; color:#64748b;">
                    <i class="fas fa-spinner fa-spin fa-2x"></i><br><br>Memuat statistik dasbor...
                </div>
            `;
        }

        let allUsers = [];
        let pkkList = [];
        let activeTahun = '';

        if (APP_CONFIG.USE_MOCK) {
            allUsers = MOCK_DB.users || [];
            pkkList = MOCK_DB.pkks || [];
        } else {
            const [usersData, pkkData, taInfo] = await Promise.all([
                loadUsersData(),
                loadPkksData(),
                loadTahunAjaranData()
            ]);
            activeTahun = taInfo ? taInfo.active : '';
            allUsers = usersData || [];
            pkkList = pkkData || [];
        }

        const pkkByNip = {};
        pkkList.filter(p => !activeTahun || p.tahunAjaran === activeTahun).forEach(p => {
            pkkByNip[p.nip] = p;
        });

        let targetUsers = allUsers.filter(u => u.level !== 'Super Admin');

        if (currentUser.level === 'General Manager') {
            const isPendidikan = currentUser.jabatan && currentUser.jabatan.toLowerCase().includes('pendidikan');
            const isOperasional = currentUser.jabatan && currentUser.jabatan.toLowerCase().includes('operasional');
            targetUsers = targetUsers.filter(u => {
                const unit = u.unit ? u.unit.toLowerCase() : '';
                if (isPendidikan) return ['tk', 'sd', 'smp', 'sma'].includes(unit);
                if (isOperasional) return ['fa', 'ga', 'hrd'].includes(unit);
                return true;
            });
        }

        const totalCount = targetUsers.length;
        let belumMengisiCount = 0, sedangProsesCount = 0, sudahDinilaiCount = 0;
        dashboardScoredEmployees = [];

        targetUsers.forEach(u => {
            const pkk = pkkByNip[u.nip];
            const status = pkk ? pkk.status : 'Belum Mengisi';
            const finalScore = pkk ? (parseFloat(pkk.finalScore) || 0) : 0;
            const finalGrade = pkk ? (pkk.finalGrade || '-') : '-';

            if (!pkk) belumMengisiCount++;
            else if (status === 'Selesai') sudahDinilaiCount++;
            else sedangProsesCount++;

            dashboardScoredEmployees.push({
                nip: u.nip, nama: u.nama, unit: u.unit || '-', level: u.level || '-',
                jabatan: u.jabatan || '-', status, finalScore, finalGrade,
                hasScore: pkk !== null && finalScore > 0
            });
        });

        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="stat-card blue">
                    <div class="stat-icon blue"><i class="fas fa-users"></i></div>
                    <div class="stat-info"><h3>${totalCount}</h3><p>Total Karyawan</p></div>
                </div>
                <div class="stat-card red">
                    <div class="stat-icon red"><i class="fas fa-user-xmark"></i></div>
                    <div class="stat-info"><h3>${belumMengisiCount}</h3><p>Belum Mengisi Evaluasi</p></div>
                </div>
                <div class="stat-card orange">
                    <div class="stat-icon orange"><i class="fas fa-clock"></i></div>
                    <div class="stat-info"><h3>${sedangProsesCount}</h3><p>Proses Penilaian</p></div>
                </div>
                <div class="stat-card green">
                    <div class="stat-icon green"><i class="fas fa-award"></i></div>
                    <div class="stat-info"><h3>${sudahDinilaiCount}</h3><p>Sudah Ada Nilai</p></div>
                </div>
            `;
        }

        const selectUnit = document.getElementById('chart-filter-unit');
        const selectLevel = document.getElementById('chart-filter-level');
        if (selectUnit) {
            const units = Array.from(new Set(dashboardScoredEmployees.map(e => e.unit).filter(u => u && u !== '-'))).sort();
            selectUnit.innerHTML = '<option value="">-- Semua Unit --</option>' + units.map(u => `<option value="${u}">${u}</option>`).join('');
            selectUnit.onchange = renderTopEmployeesChart;
        }
        if (selectLevel) {
            const levels = Array.from(new Set(dashboardScoredEmployees.map(e => e.level).filter(l => l && l !== '-'))).sort();
            selectLevel.innerHTML = '<option value="">-- Semua Level --</option>' + levels.map(l => `<option value="${l}">${l}</option>`).join('');
            selectLevel.onchange = renderTopEmployeesChart;
        }
        renderTopEmployeesChart();
    }

    // Tombol Tambah Pengumuman (hanya Super Admin)
    const btnTambah = document.getElementById('btn-tambah-pengumuman');
    if (btnTambah) {
        if (currentUser.level === 'Super Admin') {
            btnTambah.style.display = 'inline-block';
            btnTambah.onclick = () => showModalPengumuman();
        } else {
            btnTambah.style.display = 'none';
        }
    }

    const loadPengumuman = async () => {
        if (!annContainer) return;
        annContainer.innerHTML = '<div style="padding:15px; text-align:center;"><i class="fas fa-spinner fa-spin"></i> Memuat pengumuman...</div>';
        let pengumuman = [];
        if (APP_CONFIG.USE_MOCK) {
            pengumuman = MOCK_DB.pengumuman;
        } else {
            const res = await fetchGasAPI('getDashboard');
            if (res && res.success) pengumuman = res.pengumuman;
        }

        if (pengumuman.length === 0) {
            annContainer.innerHTML = '<div style="padding: 15px; text-align:center; color:#999;">Belum ada pengumuman saat ini.</div>';
        } else {
            annContainer.innerHTML = pengumuman.map(p => `
                <div style="padding: 15px; border-bottom: 1px solid #E6F4ED; display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <h4 style="color: var(--primary); margin-bottom: 5px;">${p.judul}</h4>
                        <p style="font-size: 0.9rem; color: #555; white-space: pre-wrap;">${p.deskripsi}</p>
                        <small style="color: #999;">${p.tanggal || p.date || ''}</small>
                    </div>
                    ${currentUser.level === 'Super Admin' ? `
                    <div style="display: flex; gap: 5px; flex-shrink:0; margin-left:10px;">
                        <button class="btn-primary" style="padding: 4px 8px; font-size: 0.75rem; background: #eab308;" onclick="editPengumuman('${p.id}', \`${p.judul.replace(/`/g, '\\`')}\`, \`${p.deskripsi.replace(/`/g, '\\`')}\`)"><i class="fas fa-edit"></i></button>
                        <button class="btn-primary" style="padding: 4px 8px; font-size: 0.75rem; background: #ef4444;" onclick="deletePengumuman('${p.id}')"><i class="fas fa-trash"></i></button>
                    </div>` : ''}
                </div>
            `).join('');
        }
    };

    await loadPengumuman();

    // Modal logic
    const modal = document.getElementById('modal-pengumuman');
    const btnBatal = document.getElementById('btn-batal-pengumuman');
    const btnSimpan = document.getElementById('btn-simpan-pengumuman');

    if (modal && btnBatal && btnSimpan) {
        btnBatal.onclick = () => modal.style.display = 'none';

        btnSimpan.onclick = async () => {
            const id = document.getElementById('input-pengumuman-id').value;
            const judul = document.getElementById('input-pengumuman-judul').value.trim();
            const deskripsi = document.getElementById('input-pengumuman-deskripsi').value.trim();

            if (!judul || !deskripsi) return showToast('Judul dan Deskripsi tidak boleh kosong', 'error');

            const origText = btnSimpan.innerHTML;
            btnSimpan.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan';
            btnSimpan.disabled = true;

            const res = await fetchGasAPI('savePengumuman', { pengumuman: { id, judul, deskripsi } });
            if (res && res.success) {
                showToast(res.message, 'success');
                modal.style.display = 'none';
                await loadPengumuman();
            } else {
                showToast('Gagal menyimpan pengumuman', 'error');
            }

            btnSimpan.innerHTML = origText;
            btnSimpan.disabled = false;
        };
    }
}



window.showModalPengumuman = (id = '', judul = '', deskripsi = '') => {
    document.getElementById('modal-pengumuman-title').innerText = id ? 'Edit Pengumuman' : 'Tambah Pengumuman';
    document.getElementById('input-pengumuman-id').value = id;
    document.getElementById('input-pengumuman-judul').value = judul;
    document.getElementById('input-pengumuman-deskripsi').value = deskripsi;
    document.getElementById('modal-pengumuman').style.display = 'flex';
};

window.editPengumuman = (id, judul, deskripsi) => {
    showModalPengumuman(id, judul, deskripsi);
};

window.deletePengumuman = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) return;

    showToast('Menghapus pengumuman...', 'info');
    const res = await fetchGasAPI('deletePengumuman', { id });
    if (res && res.success) {
        showToast(res.message, 'success');
        initDashboard(); // refresh dashboard
    } else {
        showToast('Gagal menghapus pengumuman', 'error');
    }
};

function renderTopEmployeesChart() {
    const canvas = document.getElementById('top-employees-chart');
    const listContainer = document.getElementById('top-employees-list');
    if (!canvas || !listContainer) return;

    const unitVal = (document.getElementById('chart-filter-unit')?.value || '').toLowerCase().trim();
    const levelVal = (document.getElementById('chart-filter-level')?.value || '').toLowerCase().trim();

    let filtered = dashboardScoredEmployees.filter(emp => {
        const matchUnit = !unitVal || emp.unit.toLowerCase() === unitVal;
        const matchLevel = !levelVal || emp.level.toLowerCase() === levelVal;
        return matchUnit && matchLevel && emp.finalScore > 0;
    });

    filtered.sort((a, b) => b.finalScore - a.finalScore);
    const top10 = filtered.slice(0, 10);

    if (top10.length === 0) {
        canvas.style.display = 'none';
        listContainer.innerHTML = `
            <div style="text-align:center; padding:32px 16px; color:#94a3b8; background:#f8fafc; border-radius:8px; border:1px dashed #cbd5e1;">
                <i class="fas fa-chart-bar fa-3x" style="margin-bottom:12px; opacity:0.5; color:#64748b;"></i>
                <div style="font-weight:600; font-size:0.95rem; color:#475569;">Belum ada data nilai karyawan untuk filter ini</div>
                <div style="font-size:0.8rem; margin-top:4px; color:#94a3b8;">Pilih unit atau level lain yang sudah selesai proses penilaiannya.</div>
            </div>
        `;
        if (topEmployeesChartInstance) {
            topEmployeesChartInstance.destroy();
            topEmployeesChartInstance = null;
        }
        return;
    }

    canvas.style.display = 'block';

    const labels = top10.map((e, idx) => `${idx + 1}. ${e.nama}`);
    const dataScores = top10.map(e => e.finalScore);
    const bgColors = [
        'rgba(16, 185, 129, 0.85)',
        'rgba(59, 130, 246, 0.85)',
        'rgba(99, 102, 241, 0.85)',
        'rgba(139, 92, 246, 0.85)',
        'rgba(236, 72, 153, 0.85)',
        'rgba(245, 158, 11, 0.85)',
        'rgba(14, 165, 233, 0.85)',
        'rgba(20, 184, 166, 0.85)',
        'rgba(168, 85, 247, 0.85)',
        'rgba(100, 116, 139, 0.85)'
    ];

    if (topEmployeesChartInstance) {
        topEmployeesChartInstance.destroy();
    }

    if (window.Chart) {
        const ctx = canvas.getContext('2d');
        topEmployeesChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Skor Akhir PKK',
                    data: dataScores,
                    backgroundColor: bgColors.slice(0, top10.length),
                    borderRadius: 6,
                    borderWidth: 0,
                    barThickness: 22
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const emp = top10[context.dataIndex];
                                return ` Skor: ${emp.finalScore} | Grade: ${emp.finalGrade} (${emp.unit} - ${emp.level})`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 455,
                        grid: { color: 'rgba(226, 232, 240, 0.6)' },
                        ticks: { font: { size: 11 } }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { font: { size: 12, weight: '600' }, color: '#1e293b' }
                    }
                }
            }
        });
    }

    listContainer.innerHTML = `
        <div style="font-weight:700; color:#1e293b; margin:20px 0 10px; font-size:0.9rem;">
            <i class="fas fa-list-ol" style="color:#4f46e5;"></i> Detail Peringkat Top 10 Karyawan
        </div>
        <div class="table-responsive">
            <table class="table align-middle" style="font-size:0.85rem;">
                <thead style="background:#1e293b; color:white;">
                    <tr>
                        <th style="width:40px; text-align:center;">#</th>
                        <th>KARYAWAN</th>
                        <th>UNIT</th>
                        <th>LEVEL</th>
                        <th style="text-align:center;">SKOR AKHIR</th>
                        <th style="text-align:center;">KATEGORI</th>
                    </tr>
                </thead>
                <tbody>
                    ${top10.map((emp, idx) => `
                        <tr>
                            <td style="text-align:center;">
                                ${idx === 0 ? '<i class="fas fa-crown" style="color:#eab308; font-size:1.1rem;"></i>' : 
                                  idx === 1 ? '<i class="fas fa-medal" style="color:#94a3b8; font-size:1rem;"></i>' : 
                                  idx === 2 ? '<i class="fas fa-medal" style="color:#b45309; font-size:1rem;"></i>' : 
                                  `<strong>${idx + 1}</strong>`}
                            </td>
                            <td>
                                <strong>${emp.nama}</strong>
                                <div style="font-size:0.78rem; color:#94a3b8;">${emp.nip} &bull; ${emp.jabatan}</div>
                            </td>
                            <td>${emp.unit}</td>
                            <td>${emp.level}</td>
                            <td style="text-align:center; font-weight:800; color:#16a34a; font-size:1rem;">${emp.finalScore}</td>
                            <td style="text-align:center;"><span class="status-badge status-success" style="font-weight:600;">${emp.finalGrade}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function checkHasAtasan1(userOrPkk) {
    if (!userOrPkk) return false;
    const val = String(userOrPkk.atasanNIP1 || userOrPkk.atasan1 || '').trim();
    if (!val || val === '-' || val === '0' || val.toLowerCase() === 'null' || val.toLowerCase() === 'undefined') {
        return false;
    }
    return true;
}

function checkHasAtasan2(userOrPkk) {
    if (!userOrPkk) return false;
    const val = String(userOrPkk.atasanNIP2 || userOrPkk.atasan2 || '').trim();
    if (!val || val === '-' || val === '0' || val.toLowerCase() === 'null' || val.toLowerCase() === 'undefined') {
        return false;
    }
    return true;
}

// --- Page: Evaluasi Mandiri (PKK Form) ---
let currentKpiItems = [];
async function initEvaluasiMandiri() {
    const isTargetPkkPresent = window.reviewTargetPkk != null;
    const targetPkkStatus = window.reviewTargetPkk ? window.reviewTargetPkk.status : null;
    const isViewOnlyMode = window.isViewOnlyMode || (targetPkkStatus === 'Selesai');
    const isReviewMode = isTargetPkkPresent && !isViewOnlyMode;
    let targetUser = currentUser;

    if (isTargetPkkPresent) {
        targetUser = {
            nip: window.reviewTargetPkk.nip,
            nama: window.reviewTargetPkk.nama,
            level: window.reviewTargetPkk.level || 'Staff',
            unit: window.reviewTargetPkk.unit || '',
            atasanNIP1: window.reviewTargetPkk.atasanNIP1 || '',
            atasanNIP2: window.reviewTargetPkk.atasanNIP2 || '',
            atasan1: window.reviewTargetPkk.atasan1 || '',
            atasan2: window.reviewTargetPkk.atasan2 || '',
            id: window.reviewTargetPkk.id,
            jabatan: '-'
        };
        const usersRes = await fetchGasAPI('getUsers');
        if (usersRes && usersRes.success && Array.isArray(usersRes.data)) {
            const found = usersRes.data.find(u => String(u.nip).trim() === String(window.reviewTargetPkk.nip).trim());
            if (found) {
                targetUser.jabatan = found.jabatan || targetUser.jabatan;
                if (found.level) targetUser.level = found.level;
                if (found.unit) targetUser.unit = found.unit;
                targetUser.atasan1 = found.atasan1 || targetUser.atasan1;
                targetUser.atasan2 = found.atasan2 || targetUser.atasan2;
                targetUser.atasanNIP1 = found.atasan1 || targetUser.atasanNIP1;
                targetUser.atasanNIP2 = found.atasan2 || targetUser.atasanNIP2;
            }
        }
    }

    // Render Employee Detail Header Card if in Review or View Only Mode
    const detailCardEl = document.getElementById('review-employee-detail-card');
    if (detailCardEl) {
        if (isTargetPkkPresent) {
            detailCardEl.style.display = 'block';
            detailCardEl.innerHTML = `
                <div class="card glass-card" style="background: linear-gradient(135deg, #036F3E 0%, #024f2c 100%); color: white; border-radius: 16px; padding: 18px 24px; box-shadow: 0 10px 25px rgba(3,111,62,0.25);">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
                        <div style="display: flex; align-items: center; gap: 16px;">
                            <div style="width: 52px; height: 52px; border-radius: 14px; background: rgba(255,255,255,0.18); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0;">
                                <i class="fas ${isViewOnlyMode ? 'fa-file-signature' : 'fa-user-check'}"></i>
                            </div>
                            <div>
                                <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.8); font-weight: 600;">${isViewOnlyMode ? 'Data Penilaian Karyawan (Lihat)' : 'Verifikasi PKK Karyawan'}</div>
                                <h3 style="margin: 2px 0 0 0; font-size: 1.35rem; font-weight: 700; color: white;">${targetUser.nama || '-'}</h3>
                                <div style="font-size: 0.88rem; color: rgba(255,255,255,0.9); margin-top: 2px;">NIP: <strong>${targetUser.nip || '-'}</strong> &bull; ${targetUser.jabatan || '-'}</div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
                            <div style="background: rgba(255,255,255,0.18); color: white; padding: 6px 14px; border-radius: 20px; font-size: 0.82rem; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; border: 1px solid rgba(255,255,255,0.25); white-space: nowrap;">
                                <i class="fas fa-building" style="font-size:0.8rem; opacity:0.9;"></i> Unit: ${targetUser.unit || '-'}
                            </div>
                            <div style="background: rgba(255,255,255,0.18); color: white; padding: 6px 14px; border-radius: 20px; font-size: 0.82rem; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; border: 1px solid rgba(255,255,255,0.25); white-space: nowrap;">
                                <i class="fas fa-layer-group" style="font-size:0.8rem; opacity:0.9;"></i> Level: ${targetUser.level || '-'}
                            </div>
                            <div style="background: ${targetPkkStatus === 'Selesai' ? '#036F3E' : '#F77604'}; color: white; padding: 6px 16px; border-radius: 20px; font-size: 0.82rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); white-space: nowrap;">
                                <i class="fas ${targetPkkStatus === 'Selesai' ? 'fa-check-circle' : 'fa-clock'}" style="font-size:0.8rem;"></i> ${targetPkkStatus || 'Menunggu Verifikasi'}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            detailCardEl.style.display = 'none';
            detailCardEl.innerHTML = '';
        }
    }

    const bobot = getBobotConfig(targetUser.level);
    activeCalcLevel = targetUser.level; // Set for calculatePkk to use

    document.getElementById('bobot-kpi-text').innerText = bobot.kpi + '%';
    document.getElementById('bobot-perilaku-text').innerText = bobot.perilaku + '%';
    document.getElementById('bobot-manajerial-text').innerText = bobot.manajerial + '%';

    if (bobot.manajerial > 0) {
        document.getElementById('section-manajerial').style.display = 'block';
    } else {
        document.getElementById('section-manajerial').style.display = 'none';
    }

    // Load SKI dari database berdasarkan jabatan & unit user
    const tbodyKpi = document.getElementById('tbody-kpi');
    tbodyKpi.innerHTML = `<tr><td colspan="11" class="text-center"><i class="fas fa-spinner fa-spin"></i> Memuat data SKI...</td></tr>`;

    let skis = [];
    const res = await fetchGasAPI('getSKIs', {});
    if (res && res.success && Array.isArray(res.data)) {
        // Filter SKI yang sesuai dengan jabatan dan unit user
        skis = res.data.filter(s =>
            String(s.targetJabatan).trim().toLowerCase() === String(targetUser.jabatan).trim().toLowerCase() &&
            String(s.targetUnit).trim().toLowerCase() === String(targetUser.unit).trim().toLowerCase()
        );
    }

    currentKpiItems = skis;
    tbodyKpi.innerHTML = '';

    if (currentKpiItems.length === 0) {
        tbodyKpi.innerHTML = `<tr><td colspan="11" class="text-center" style="padding:24px; color:#64748b;">
            <i class="fas fa-info-circle"></i> Belum ada template SKI untuk jabatan <strong>${targetUser.jabatan}</strong>.<br>
            Hubungi Admin untuk membuat template SKI.
        </td></tr>`;
    } else {
        currentKpiItems.forEach((ski, index) => {
            let rawB = parseFloat(ski.bobot) || 0;
            let displayBobot = (rawB <= 1 && rawB > 0) ? Math.round(rawB * 100 * 100) / 100 : rawB;

            const kriteria = [
                ski.kriteria1 || '-',
                ski.kriteria2 || '-',
                ski.kriteria3 || '-',
                ski.kriteria4 || '-',
                ski.kriteria5 || '-'
            ];

            const kriteriaHtml = kriteria.map((k, i) => `
                <td style="font-size:0.78rem; color:#475569; vertical-align:top; padding:8px;">
                    <span style="display:block; font-weight:600; color:#94a3b8; font-size:0.7rem; margin-bottom:3px;">Skala ${i + 1}</span>
                    ${k}
                </td>
            `).join('');

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="text-align:center; vertical-align:middle;">${index + 1}</td>
                <td style="vertical-align:middle;">
                    <strong style="color:#1e293b;">${ski.ski || '-'}</strong>
                    ${ski.kpiDepartemen ? `<br><span style="font-size:0.78rem; color:#64748b;"><i class="fas fa-building" style="font-size:0.7rem;"></i> ${ski.kpiDepartemen}</span>` : ''}
                </td>
                <td style="font-size:0.82rem; color:#334155; vertical-align:middle;">
                    ${ski.targetDetail || '-'}
                </td>
                ${kriteriaHtml}
                <td style="text-align:center; vertical-align:middle; font-weight:600; color:#4f46e5;">${displayBobot}%</td>
                <td style="vertical-align:middle;">
                    <input type="number" min="1" max="5" class="form-control input-nilai-kpi"
                        data-index="${index}" data-bobot="${displayBobot}"
                        placeholder="1-5" value="" style="text-align:center; width:70px;">
                </td>
                <td class="row-bxn-kpi" id="bxn-kpi-${index}" style="text-align:center; font-weight:700; color:#16a34a; vertical-align:middle;">-</td>
            `;
            tbodyKpi.appendChild(tr);
        });
    }

    // Attach Event Listeners for Calculation & Scale Validation
    const attachListeners = () => {
        document.querySelectorAll('.input-nilai-kpi').forEach(input => {
            input.oninput = function() {
                let v = parseFloat(this.value);
                if (!isNaN(v)) {
                    if (v > 5) this.value = 5;
                    else if (v < 1 && this.value !== '') this.value = 1;
                }
                calculatePkk();
            };
        });

        document.querySelectorAll('.input-nilai-perilaku').forEach(input => {
            input.oninput = function() {
                let v = parseFloat(this.value);
                if (!isNaN(v)) {
                    if (v > 4) this.value = 4;
                    else if (v < 1 && this.value !== '') this.value = 1;
                }
                calculatePkk();
            };
        });

        document.querySelectorAll('.input-nilai-manajerial').forEach(input => {
            input.oninput = function() {
                let v = parseFloat(this.value);
                if (!isNaN(v)) {
                    if (v > 4) this.value = 4;
                    else if (v < 1 && this.value !== '') this.value = 1;
                }
                calculatePkk();
            };
        });
    };
    attachListeners();

    // Cek status evaluasi mandiri yang ada
    let existingPkk = null;
    if (isReviewMode) {
        existingPkk = window.reviewTargetPkk;
    } else {
        if (!APP_CONFIG.USE_MOCK) {
            const pkkRes = await fetchGasAPI('getPKKs', { nip: currentUser.nip });
            if (pkkRes && pkkRes.success && pkkRes.data && pkkRes.data.length > 0) {
                existingPkk = pkkRes.data[0];
            }
        } else {
            existingPkk = MOCK_DB.pkks.find(p => p.nip === currentUser.nip);
        }
    }

    if (existingPkk) {
        window.currentActivePkkId = existingPkk.id;
        document.getElementById('form-pkk-status').innerText = existingPkk.status;
        document.getElementById('form-pkk-status').className = 'status-badge ' + (existingPkk.status === 'Draft' ? 'status-draft' : 'status-pending');

        const setVal = (id, val) => {
            const el = document.querySelector(`input[data-id="${id}"]`);
            if (el && val !== undefined) el.value = val;
        };

        setVal('p_kualitas_hasil_kerja', existingPkk.p_kualitas_hasil_kerja);
        setVal('p_ketepatan_waktu', existingPkk.p_ketepatan_waktu);
        setVal('p_keterampilan_kerja', existingPkk.p_keterampilan_kerja);
        setVal('p_kerjasama', existingPkk.p_kerjasama);
        setVal('p_disiplin', existingPkk.p_disiplin);
        setVal('p_inisiatif', existingPkk.p_inisiatif);
        setVal('p_peningkatan_tanggung_jawab', existingPkk.p_peningkatan_tanggung_jawab);
        setVal('p_ahlak_islami', existingPkk.p_ahlak_islami);
        setVal('p_adaptasi_terhadap_perubahan', existingPkk.p_adaptasi_terhadap_perubahan);

        setVal('m_planning_organizing', existingPkk.m_planning_organizing);
        setVal('m_controlling', existingPkk.m_controlling);
        setVal('m_analytical_thinking', existingPkk.m_analytical_thinking);
        setVal('m_decision_making', existingPkk.m_decision_making);
        setVal('m_developing_others', existingPkk.m_developing_others);

        if (existingPkk.skiAnswers) {
            try {
                const skiArr = JSON.parse(existingPkk.skiAnswers);
                skiArr.forEach(ans => {
                    const el = document.querySelector(`.input-nilai-kpi[data-index="${ans.index}"]`);
                    if (el) el.value = ans.value;
                });
            } catch (e) { }
        }

        setTimeout(() => calculatePkk(), 300);

    }

    const formEl = document.getElementById('form-pkk');
    const btnSubmit = document.getElementById('btn-submit-pkk');
    const btnDraft = document.getElementById('btn-save-draft');

    if (isViewOnlyMode) {
        if (existingPkk) {
            const hasRekomendasi = existingPkk.rekomendasiPerbaikan || existingPkk.rekomendasiAkhir || existingPkk.keteranganPerbaikan || existingPkk.alasanKeputusan;
            if (hasRekomendasi) {
                document.getElementById('section-rekomendasi').style.display = 'block';
                const elJenis = document.getElementById('input-jenis-perbaikan');
                const elKet = document.getElementById('input-keterangan-perbaikan');
                const elKep = document.getElementById('input-keputusan-akhir');
                const elAla = document.getElementById('input-alasan-keputusan');
                if (elJenis) elJenis.value = existingPkk.rekomendasiPerbaikan || '';
                if (elKet) elKet.value = existingPkk.keteranganPerbaikan || '';
                if (elKep) elKep.value = existingPkk.rekomendasiAkhir || '';
                if (elAla) elAla.value = existingPkk.alasanKeputusan || '';
            } else {
                document.getElementById('section-rekomendasi').style.display = 'none';
            }
        }
        if (btnDraft) btnDraft.style.display = 'none';
        if (btnSubmit) btnSubmit.style.display = 'none';
        disableFormPkk();
    } else if (isReviewMode) {
        document.getElementById('section-rekomendasi').style.display = 'block';
        if (existingPkk) {
            const elJenis = document.getElementById('input-jenis-perbaikan');
            const elKet = document.getElementById('input-keterangan-perbaikan');
            const elKep = document.getElementById('input-keputusan-akhir');
            const elAla = document.getElementById('input-alasan-keputusan');
            if (elJenis) elJenis.value = existingPkk.rekomendasiPerbaikan || '';
            if (elKet) elKet.value = existingPkk.keteranganPerbaikan || '';
            if (elKep) elKep.value = existingPkk.rekomendasiAkhir || '';
            if (elAla) elAla.value = existingPkk.alasanKeputusan || '';
        }

        if (btnDraft) btnDraft.style.display = 'none';
        if (btnSubmit) {
            btnSubmit.style.display = 'inline-block';
            btnSubmit.innerHTML = 'Verifikasi & Simpan <i class="fas fa-check"></i>';
            btnSubmit.className = 'btn-primary';
        }
    } else {
        document.getElementById('section-rekomendasi').style.display = 'none';
        if (existingPkk && existingPkk.status !== 'Draft') {
            disableFormPkk();
            if (btnDraft) btnDraft.style.display = 'none';
            if (btnSubmit) btnSubmit.style.display = 'none';
        } else {
            if (btnDraft) btnDraft.style.display = 'inline-block';
            if (btnSubmit) {
                btnSubmit.style.display = 'inline-block';
                btnSubmit.innerHTML = 'Ajukan Penilaian <i class="fas fa-paper-plane"></i>';
            }
        }
    }

    if (btnSubmit) {
        btnSubmit.onclick = (e) => {
            e.preventDefault();
            
            if (isReviewMode) {
                const hasAtasan2 = checkHasAtasan2(targetUser);
                let nextStatus = 'Selesai';

                if (existingPkk && (existingPkk.status === 'Menunggu Verifikasi 1' || existingPkk.status.includes('Verifikasi 1'))) {
                    nextStatus = hasAtasan2 ? 'Menunggu Verifikasi 2' : 'Selesai';
                } else if (existingPkk && (existingPkk.status === 'Menunggu Verifikasi 2' || existingPkk.status.includes('Verifikasi 2'))) {
                    nextStatus = 'Selesai';
                }

                submitPkk(nextStatus);
            } else {
                const hasAtasan1 = checkHasAtasan1(currentUser);
                const initStatus = hasAtasan1 ? 'Menunggu Verifikasi 1' : 'Selesai';
                submitPkk(initStatus);
            }
        };
    }

    if (btnDraft) {
        btnDraft.onclick = () => {
            submitPkk('Draft');
        };
    }
}

function getBobotConfig(level) {
    if (!level) return (APP_CONFIG.BOBOT["Pelaksana"] || APP_CONFIG.BOBOT["Staff"] || { kpi: 70, perilaku: 30, manajerial: 0 });
    const key = String(level).trim();
    if (APP_CONFIG.BOBOT[key]) return APP_CONFIG.BOBOT[key];

    const lower = key.toLowerCase();
    if (lower.includes('pelaksana') || lower.includes('staff')) return (APP_CONFIG.BOBOT["Pelaksana"] || APP_CONFIG.BOBOT["Staff"]);
    if (lower.includes('leader') || lower.includes('tl')) return APP_CONFIG.BOBOT["Tim Leader"];
    if (lower.includes('supervisor') || lower.includes('spv')) return APP_CONFIG.BOBOT["Supervisor"];
    if (lower.includes('general manager') || lower.includes('gm')) return APP_CONFIG.BOBOT["General Manager"];
    if (lower.includes('manager')) return APP_CONFIG.BOBOT["Manager"];
    if (lower.includes('direktur')) return APP_CONFIG.BOBOT["Direktur"];

    return (APP_CONFIG.BOBOT["Pelaksana"] || APP_CONFIG.BOBOT["Staff"] || { kpi: 70, perilaku: 30, manajerial: 0 });
}

let activeCalcLevel = null; // Stores the level used for calculation (can be different from currentUser in review mode)

function calculatePkk() {
    const level = activeCalcLevel || (currentUser ? currentUser.level : 'Staff');
    const bobot = getBobotConfig(level);

    // 1. Hitung A. KPI
    let totalBxNKpi = 0; // max 500
    document.querySelectorAll('.input-nilai-kpi').forEach(input => {
        let val = parseFloat(input.value) || 0;
        if (val > 5) { val = 5; input.value = 5; }
        if (val < 0) val = 0;
        const bbt = parseFloat(input.getAttribute('data-bobot')) || 0;
        const bxn = bbt * val;
        const bxnEl = document.getElementById(`bxn-kpi-${input.getAttribute('data-index')}`);
        if (bxnEl) bxnEl.innerText = bxn;
        totalBxNKpi += bxn;
    });
    const totalKpiEl = document.getElementById('total-kpi-score');
    if (totalKpiEl) totalKpiEl.innerText = totalBxNKpi;
    const finalKpiPoints = totalBxNKpi * ((bobot.kpi || 70) / 100);

    // 2. Hitung B. Perilaku (9 Indikator: max 4)
    let totalPerilakuPoints = 0;
    const inputsPerilaku = document.querySelectorAll('.input-nilai-perilaku');
    const bbtPerIndikatorPerilaku = (bobot.perilaku || 30) / 9;
    inputsPerilaku.forEach(input => {
        let val = parseFloat(input.value) || 0;
        if (val > 4) { val = 4; input.value = 4; }
        if (val < 0) val = 0;
        totalPerilakuPoints += (bbtPerIndikatorPerilaku * val);
    });

    // 3. Hitung C. Manajerial (5 Indikator, jika ada)
    let totalManajerialPoints = 0;
    if (bobot.manajerial > 0) {
        const inputsManajerial = document.querySelectorAll('.input-nilai-manajerial');
        const bbtPerIndikatorManajerial = bobot.manajerial / 5;
        inputsManajerial.forEach(input => {
            let val = parseFloat(input.value) || 0;
            if (val > 4) { val = 4; input.value = 4; }
            if (val < 0) val = 0;
            totalManajerialPoints += (bbtPerIndikatorManajerial * val);
        });
    }

    // 4. Hitung Total Poin Akhir
    const finalTotalPoints = Math.round(finalKpiPoints + totalPerilakuPoints + totalManajerialPoints);

    // 5. Tentukan Grade
    let finalGrade = "-";
    let gradeClass = "";
    for (let rule of APP_CONFIG.RATING_SCALE) {
        if (finalTotalPoints >= rule.min && finalTotalPoints <= rule.max) {
            finalGrade = rule.grade;
            gradeClass = rule.class;
            break;
        }
    }

    // Fallback if finalTotalPoints > 0
    if (finalGrade === "-" && finalTotalPoints > 0) {
        if (finalTotalPoints >= 384) {
            finalGrade = "Baik Sekali";
            gradeClass = "grade-A";
        } else if (finalTotalPoints >= 312) {
            finalGrade = "Baik";
            gradeClass = "grade-B";
        } else if (finalTotalPoints >= 240) {
            finalGrade = "Cukup";
            gradeClass = "grade-C";
        } else if (finalTotalPoints >= 168) {
            finalGrade = "Kurang";
            gradeClass = "grade-C";
        } else {
            finalGrade = "Kurang Sekali";
            gradeClass = "grade-D";
        }
    }

    // Tampilkan di UI
    const scoreDisplay = document.getElementById('final-score-display');
    if (scoreDisplay) scoreDisplay.innerText = finalTotalPoints;

    const gradeEl = document.getElementById('final-grade-display');
    if (gradeEl) {
        gradeEl.innerText = finalGrade;
        gradeEl.className = 'grade-badge ' + gradeClass;
    }
}

async function submitPkk(status) {
    const btnSubmit = document.getElementById('btn-submit-pkk');
    const btnDraft = document.getElementById('btn-save-draft');

    // Disable buttons
    if (btnSubmit) btnSubmit.disabled = true;
    if (btnDraft) btnDraft.disabled = true;
    const oldText = btnSubmit ? btnSubmit.innerHTML : '';
    if (btnSubmit) btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';

    // Ensure points & grade are freshly calculated
    calculatePkk();

    const finalScore = parseFloat(document.getElementById('final-score-display')?.innerText || 0);
    let finalGrade = document.getElementById('final-grade-display')?.innerText || '-';
    if (finalGrade === '-' && finalScore > 0) {
        if (finalScore >= 384) finalGrade = "Baik Sekali";
        else if (finalScore >= 312) finalGrade = "Baik";
        else if (finalScore >= 240) finalGrade = "Cukup";
        else if (finalScore >= 168) finalGrade = "Kurang";
        else finalGrade = "Kurang Sekali";
    }

    // Collect Perilaku inputs (9 indikator)
    const p_kualitas_hasil_kerja = parseFloat(document.querySelector('.input-nilai-perilaku[data-id="p_kualitas_hasil_kerja"]')?.value || 0);
    const p_ketepatan_waktu = parseFloat(document.querySelector('.input-nilai-perilaku[data-id="p_ketepatan_waktu"]')?.value || 0);
    const p_keterampilan_kerja = parseFloat(document.querySelector('.input-nilai-perilaku[data-id="p_keterampilan_kerja"]')?.value || 0);
    const p_kerjasama = parseFloat(document.querySelector('.input-nilai-perilaku[data-id="p_kerjasama"]')?.value || 0);
    const p_disiplin = parseFloat(document.querySelector('.input-nilai-perilaku[data-id="p_disiplin"]')?.value || 0);
    const p_inisiatif = parseFloat(document.querySelector('.input-nilai-perilaku[data-id="p_inisiatif"]')?.value || 0);
    const p_peningkatan_tanggung_jawab = parseFloat(document.querySelector('.input-nilai-perilaku[data-id="p_peningkatan_tanggung_jawab"]')?.value || 0);
    const p_ahlak_islami = parseFloat(document.querySelector('.input-nilai-perilaku[data-id="p_ahlak_islami"]')?.value || 0);
    const p_adaptasi_terhadap_perubahan = parseFloat(document.querySelector('.input-nilai-perilaku[data-id="p_adaptasi_terhadap_perubahan"]')?.value || 0);

    // Collect Manajerial inputs
    const m_planning_organizing = parseFloat(document.querySelector('.input-nilai-manajerial[data-id="m_planning_organizing"]')?.value || 0);
    const m_controlling = parseFloat(document.querySelector('.input-nilai-manajerial[data-id="m_controlling"]')?.value || 0);
    const m_analytical_thinking = parseFloat(document.querySelector('.input-nilai-manajerial[data-id="m_analytical_thinking"]')?.value || 0);
    const m_decision_making = parseFloat(document.querySelector('.input-nilai-manajerial[data-id="m_decision_making"]')?.value || 0);
    const m_developing_others = parseFloat(document.querySelector('.input-nilai-manajerial[data-id="m_developing_others"]')?.value || 0);

    // Collect SKI inputs
    const skiAnswers = [];
    document.querySelectorAll('.input-nilai-kpi').forEach(input => {
        skiAnswers.push({
            index: input.getAttribute('data-index'),
            value: input.value
        });
    });

    // Check if we are reviewing as supervisor
    const isReviewMode = window.reviewTargetPkk != null;
    const targetUser = isReviewMode ? window.reviewTargetPkk : currentUser;

    if (!targetUser) {
        showToast('Terjadi kesalahan: Data target pengguna tidak ditemukan.', 'error');
        if (btnSubmit) btnSubmit.innerHTML = oldText;
        if (btnSubmit) btnSubmit.disabled = false;
        if (btnDraft) btnDraft.disabled = false;
        return;
    }

    // Collect Aspek D (Rekomendasi)
    const rekomendasiPerbaikan = document.getElementById('input-jenis-perbaikan')?.value || '';
    const keteranganPerbaikan = document.getElementById('input-keterangan-perbaikan')?.value || '';
    const rekomendasiAkhir = document.getElementById('input-keputusan-akhir')?.value || '';
    const alasanKeputusan = document.getElementById('input-alasan-keputusan')?.value || '';

    const targetId = isReviewMode ? targetUser.id : (window.currentActivePkkId || undefined);

    const pkkData = {
        id: targetId,
        nip: targetUser.nip,
        nama: targetUser.nama,
        level: targetUser.level,
        unit: targetUser.unit,
        atasanNIP1: targetUser.atasanNIP1 || targetUser.atasan1 || '',
        atasanNIP2: targetUser.atasanNIP2 || targetUser.atasan2 || '',
        p_kualitas_hasil_kerja,
        p_ketepatan_waktu,
        p_keterampilan_kerja,
        p_kerjasama,
        p_disiplin,
        p_inisiatif,
        p_peningkatan_tanggung_jawab,
        p_ahlak_islami,
        p_adaptasi_terhadap_perubahan,
        m_planning_organizing,
        m_controlling,
        m_analytical_thinking,
        m_decision_making,
        m_developing_others,
        rekomendasiPerbaikan,
        rekomendasiAkhir,
        status,
        finalScore,
        finalGrade,
        skiAnswers: JSON.stringify(skiAnswers),
        keteranganPerbaikan,
        alasanKeputusan
    };

    if (APP_CONFIG.USE_MOCK) {
        document.getElementById('form-pkk-status').innerText = status;
        document.getElementById('form-pkk-status').className = 'status-badge ' + (status === 'Draft' ? 'status-draft' : 'status-pending');
        showToast(`Formulir berhasil disimpan dengan status: ${status}`, 'success');
        if (btnSubmit) btnSubmit.disabled = false;
        if (btnDraft) btnDraft.disabled = false;
        if (btnSubmit) btnSubmit.innerHTML = oldText;
        return;
    }

    const res = await fetchGasAPI('savePKK', { pkkData });

    if (btnSubmit) btnSubmit.disabled = false;
    if (btnDraft) btnDraft.disabled = false;
    if (btnSubmit) btnSubmit.innerHTML = oldText;

    if (res && res.success) {
        if (res.id) window.currentActivePkkId = res.id;
        document.getElementById('form-pkk-status').innerText = status;
        document.getElementById('form-pkk-status').className = 'status-badge ' + (status === 'Draft' ? 'status-draft' : 'status-pending');
        showToast(res.message || `Formulir berhasil diajukan dengan status: ${status}`, 'success');
        if (status !== 'Draft') {
            disableFormPkk();
        }
        if (isReviewMode) {
            window.reviewTargetPkk = null;
            setTimeout(() => {
                navigate('verifikasi');
            }, 800);
        }
    } else {
        showToast(res ? res.message : 'Gagal menyimpan evaluasi mandiri.', 'error');
    }
}

function disableFormPkk() {
    const form = document.getElementById('form-pkk');
    if (form) {
        const inputs = form.querySelectorAll('input, button, select, textarea');
        inputs.forEach(el => el.disabled = true);
    }
}

// --- Page: Verifikasi ---
async function initVerifikasi() {
    const tbody = document.getElementById('tbody-verifikasi');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="7" class="text-center"><i class="fas fa-spinner fa-spin"></i> Memuat data verifikasi...</td></tr>`;

    let usersList = _skiUserData || [];
    if (!usersList.length) {
        usersList = await loadUsersData();
        _skiUserData = usersList || [];
    }

    let list = [];
    if (APP_CONFIG.USE_MOCK) {
        list = MOCK_DB.pkks.filter(p => p.status.includes('Menunggu'));
    } else {
        const res = await fetchGasAPI('getPKKs');
        if (res && res.success) {
            // Filter data yang sesuai dengan status dan tier atasan yang login
            list = (res.data || []).filter(p => {
                if (!p.status || !p.status.includes('Menunggu')) return false;

                // Hanya tampilkan jika login sebagai atasan yang berwenang di tahap tersebut
                if (p.status === 'Menunggu Verifikasi 1' && p.atasanNIP1 == currentUser.nip) return true;
                if (p.status === 'Menunggu Verifikasi 2' && p.atasanNIP2 == currentUser.nip) return true;

                // Super Admin atau General Manager juga bisa melihat pengajuan jika belum terfilter
                if (['Super Admin', 'General Manager', 'Direktur'].includes(currentUser.level)) return true;

                return false;
            });
        } else {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Gagal mengambil data verifikasi dari database.</td></tr>`;
            return;
        }
    }

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">Belum ada data pengajuan yang perlu diverifikasi.</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map((p, idx) => {
        const uObj = (usersList || []).find(u => String(u.nip).trim() === String(p.nip).trim());
        const jabatan = p.jabatan || (uObj ? uObj.jabatan : '-');
        return `
            <tr>
                <td style="text-align:center; font-weight:600;">${idx + 1}</td>
                <td><strong style="color:#1e293b;">${jabatan}</strong></td>
                <td>${p.nama}</td>
                <td><span style="background:#e0e7ff; color:#3730a3; padding:2px 8px; border-radius:10px; font-weight:600; font-size:0.8rem;">${p.unit}</span></td>
                <td><strong>${p.finalScore || 0}</strong> <span style="color:#64748b; font-size:0.82rem;">(${p.finalGrade || '-'})</span></td>
                <td><span class="status-badge status-pending">${p.status}</span></td>
                <td>
                    <button class="btn-primary" style="padding: 5px 12px; font-size:0.8rem; font-weight:600;" onclick="reviewPKK('${p.nip}')">Review</button>
                </td>
            </tr>
        `;
    }).join('');
}

window.reviewTargetPkk = null;
window.isViewOnlyMode = false;

async function reviewPKK(nip) {
    const res = await fetchGasAPI('getPKKs', { nip: nip });
    if (res && res.success && res.data && res.data.length > 0) {
        window.reviewTargetPkk = res.data[0];
        window.isViewOnlyMode = (res.data[0].status === 'Selesai');
        navigate('evaluasi');
    } else {
        showToast('Gagal memuat data pengajuan.', 'error');
    }
}

async function viewPKK(nip) {
    viewPKKPreview(nip);
}

// --- Page: Riwayat ---
async function initRiwayat() {
    const tbody = document.getElementById('tbody-riwayat');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="7" class="text-center"><i class="fas fa-spinner fa-spin"></i> Memuat riwayat...</td></tr>`;

    let usersList = _skiUserData || [];
    if (!usersList.length) {
        usersList = await loadUsersData();
        _skiUserData = usersList || [];
    }

    let list = [];
    if (APP_CONFIG.USE_MOCK) {
        list = MOCK_DB.pkks.filter(p => p.nip === currentUser.nip && p.status !== 'Draft');
    } else {
        const res = await fetchGasAPI('getPKKs', { nip: currentUser.nip });
        if (res && res.success) {
            list = (res.data || []).filter(p => p.status !== 'Draft');
        } else {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Gagal mengambil riwayat dari database.</td></tr>`;
            return;
        }
    }

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">Belum ada riwayat pengajuan.</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map((p, idx) => {
        const uObj = (usersList || []).find(u => String(u.nip).trim() === String(p.nip).trim());
        const jabatan = p.jabatan || (uObj ? uObj.jabatan : '-');
        return `
            <tr>
                <td style="text-align:center; font-weight:600;">${idx + 1}</td>
                <td><strong style="color:#1e293b;">${jabatan}</strong></td>
                <td>${p.nama}</td>
                <td><span style="background:#e0e7ff; color:#3730a3; padding:2px 8px; border-radius:10px; font-weight:600; font-size:0.8rem;">${p.unit}</span></td>
                <td><strong>${p.finalScore || 0}</strong> <span style="color:#64748b; font-size:0.82rem;">(${p.finalGrade || '-'})</span></td>
                <td><span class="status-badge ${p.status === 'Selesai' ? 'status-success' : 'status-pending'}">${p.status}</span></td>
                <td>
                    <button class="btn-primary" style="padding: 5px 12px; font-size:0.8rem; font-weight:600;" onclick="viewPKK('${p.nip}')"><i class="fas fa-eye"></i> Lihat</button>
                </td>
            </tr>
        `;
    }).join('');
}

// --- Page: Monitoring ---
let monitoringMasterData = [];
let currentMonitoringSortField = 'idx';
let currentMonitoringSortAsc = true;

async function initMonitoring() {
    const tbody = document.getElementById('tbody-monitoring');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="6" class="text-center"><i class="fas fa-spinner fa-spin"></i> Memuat data monitoring...</td></tr>`;

    let allUsers = [];
    let pkkList = [];
    let activeTahun = '';

    if (APP_CONFIG.USE_MOCK) {
        pkkList = MOCK_DB.pkks;
    } else {
        const [usersRes, pkkRes, taRes] = await Promise.all([
            fetchGasAPI('getUsers'),
            fetchGasAPI('getPKKs'),
            fetchGasAPI('getTahunAjaran')
        ]);

        if (taRes && taRes.active) activeTahun = taRes.active;
        const taLabel = document.getElementById('monitoring-ta-label');
        if (taLabel) taLabel.innerText = `TA. ${activeTahun || '-'}`;

        if (usersRes && usersRes.success) allUsers = usersRes.data || [];

        if (pkkRes && pkkRes.success) {
            pkkList = pkkRes.data || [];
        } else {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Gagal mengambil data monitoring.</td></tr>`;
            return;
        }
    }

    const pkkByNip = {};
    pkkList.filter(p => !activeTahun || p.tahunAjaran === activeTahun).forEach(p => { pkkByNip[p.nip] = p; });

    // Filter users by GM / Manager scope
    if (currentUser.level === 'General Manager') {
        const isPendidikan = currentUser.jabatan && currentUser.jabatan.toLowerCase().includes('pendidikan');
        const isOperasional = currentUser.jabatan && currentUser.jabatan.toLowerCase().includes('operasional');
        allUsers = allUsers.filter(u => {
            const unit = u.unit ? u.unit.toLowerCase() : '';
            if (isPendidikan) return ['tk', 'sd', 'smp', 'sma'].includes(unit);
            if (isOperasional) return ['fa', 'ga', 'hrd'].includes(unit);
            return true;
        });
    } else if (currentUser.level === 'Manager') {
        const mgrUnit = (currentUser.unit || '').trim().toLowerCase();
        const mgrNip = String(currentUser.nip || '').trim();

        allUsers = allUsers.filter(u => {
            const empUnit = (u.unit || '').trim().toLowerCase();
            const atasan1 = String(u.atasan1 || u.atasanNIP1 || '').trim();
            const atasan2 = String(u.atasan2 || u.atasanNIP2 || '').trim();

            // Match same unit or direct subordinate
            const isSameUnit = mgrUnit && empUnit === mgrUnit;
            const isSubordinate = mgrNip && (atasan1 === mgrNip || atasan2 === mgrNip);

            return isSameUnit || isSubordinate;
        });
    }

    // Exclude Super Admin
    allUsers = allUsers.filter(u => u.level !== 'Super Admin');

    if (allUsers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Tidak ada data karyawan untuk ditampilkan.</td></tr>`;
        return;
    }

    const getStatusInfo = (pkk) => {
        if (!pkk) return { label: 'Belum Mengisi', cls: 'status-empty', icon: 'fas fa-circle-xmark' };
        if (pkk.status === 'Draft') return { label: 'Draft', cls: 'status-draft', icon: 'fas fa-pen' };
        if (pkk.status === 'Menunggu Verifikasi 1') return { label: 'Menunggu Verifikasi Atasan 1', cls: 'status-pending', icon: 'fas fa-clock' };
        if (pkk.status === 'Menunggu Verifikasi 2') return { label: 'Menunggu Verifikasi Atasan 2', cls: 'status-pending', icon: 'fas fa-clock' };
        if (pkk.status === 'Selesai') return { label: 'Sudah Dinilai', cls: 'status-success', icon: 'fas fa-circle-check' };
        return { label: pkk.status, cls: 'status-pending', icon: 'fas fa-question' };
    };

    monitoringMasterData = allUsers.map((u, idx) => {
        const pkk = pkkByNip[u.nip] || null;
        const st = getStatusInfo(pkk);
        const skorNum = pkk ? (parseFloat(pkk.finalScore) || 0) : -1;
        const skorText = pkk ? `${pkk.finalScore || 0} (${pkk.finalGrade || '-'})` : '-';
        return {
            idx: idx + 1,
            nip: u.nip,
            nama: u.nama,
            level: u.level,
            jabatan: u.jabatan,
            unit: u.unit || '-',
            pkk: pkk,
            skorNum: skorNum,
            skorText: skorText,
            statusLabel: st.label,
            statusCls: st.cls,
            statusIcon: st.icon,
            hasData: pkk !== null
        };
    });

    // Populate Unit Dropdown
    const selectUnit = document.getElementById('filter-monitoring-unit');
    if (selectUnit) {
        const units = Array.from(new Set(monitoringMasterData.map(d => d.unit).filter(u => u && u !== '-'))).sort();
        selectUnit.innerHTML = '<option value="">Semua Unit</option>' + units.map(u => `<option value="${u}">${u}</option>`).join('');
    }

    // Event Listeners
    const elSearch = document.getElementById('filter-monitoring-search');
    const elUnit = document.getElementById('filter-monitoring-unit');
    const elStatus = document.getElementById('filter-monitoring-status');

    if (elSearch) elSearch.oninput = applyMonitoringFilter;
    if (elUnit) elUnit.onchange = applyMonitoringFilter;
    if (elStatus) elStatus.onchange = applyMonitoringFilter;

    // Show Export Excel button for Super Admin, GM, or Direktur
    const btnExport = document.getElementById('btn-export-excel-monitoring');
    if (btnExport) {
        if (currentUser && ['Super Admin', 'General Manager', 'Direktur'].includes(currentUser.level)) {
            btnExport.style.display = 'inline-flex';
            btnExport.onclick = exportMonitoringToExcel;
        } else {
            btnExport.style.display = 'none';
        }
    }

    applyMonitoringFilter();
}

function applyMonitoringFilter() {
    const tbody = document.getElementById('tbody-monitoring');
    if (!tbody) return;

    const searchVal = (document.getElementById('filter-monitoring-search')?.value || '').toLowerCase().trim();
    const unitVal = (document.getElementById('filter-monitoring-unit')?.value || '').toLowerCase().trim();
    const statusVal = (document.getElementById('filter-monitoring-status')?.value || '').toLowerCase().trim();

    let filtered = monitoringMasterData.filter(item => {
        const matchSearch = !searchVal || item.nama.toLowerCase().includes(searchVal) || item.nip.toLowerCase().includes(searchVal);
        const matchUnit = !unitVal || item.unit.toLowerCase() === unitVal;
        const matchStatus = !statusVal || item.statusLabel.toLowerCase() === statusVal || 
                            (statusVal.includes('verifikasi 1') && item.statusLabel.includes('Verifikasi Atasan 1')) ||
                            (statusVal.includes('verifikasi 2') && item.statusLabel.includes('Verifikasi Atasan 2'));
        return matchSearch && matchUnit && matchStatus;
    });

    filtered.sort((a, b) => {
        let valA = a[currentMonitoringSortField];
        let valB = b[currentMonitoringSortField];

        if (currentMonitoringSortField === 'skor') {
            valA = a.skorNum;
            valB = b.skorNum;
        } else if (currentMonitoringSortField === 'status') {
            valA = a.statusLabel;
            valB = b.statusLabel;
        }

        if (typeof valA === 'string') {
            const res = valA.localeCompare(valB);
            return currentMonitoringSortAsc ? res : -res;
        } else {
            return currentMonitoringSortAsc ? (valA - valB) : (valB - valA);
        }
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted" style="padding:24px;">Tidak ada data yang sesuai filter.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(item => `
        <tr>
            <td style="color:#94a3b8; font-size:0.85rem;">${item.idx}</td>
            <td>
                <div style="font-weight:600; color:#1e293b;">${item.nama}</div>
                <div style="font-size:0.78rem; color:#94a3b8;">${item.nip} &bull; ${item.jabatan || item.level}</div>
            </td>
            <td>${item.unit}</td>
            <td style="font-weight:600; color:${item.hasData ? '#16a34a' : '#94a3b8'};">${item.skorText}</td>
            <td><span class="status-badge ${item.statusCls}" style="white-space:nowrap;"><i class="${item.statusIcon}"></i> ${item.statusLabel}</span></td>
            <td style="text-align:center;">
                ${item.hasData
                    ? `<button class="btn-primary" style="padding:5px 12px;font-size:0.8rem;" onclick="viewPKKPreview('${item.nip}')"><i class="fas fa-eye"></i> Lihat</button>`
                    : `<span style="color:#cbd5e1; font-size:0.8rem;">-</span>`
                }
            </td>
        </tr>
    `).join('');
}

window.sortMonitoring = function(field) {
    if (currentMonitoringSortField === field) {
        currentMonitoringSortAsc = !currentMonitoringSortAsc;
    } else {
        currentMonitoringSortField = field;
        currentMonitoringSortAsc = true;
    }
    applyMonitoringFilter();
};

function exportMonitoringToExcel() {
    if (!monitoringMasterData || monitoringMasterData.length === 0) {
        showToast('Tidak ada data monitoring untuk di-export.', 'warning');
        return;
    }

    const searchVal = (document.getElementById('filter-monitoring-search')?.value || '').toLowerCase().trim();
    const unitVal = (document.getElementById('filter-monitoring-unit')?.value || '').toLowerCase().trim();
    const statusVal = (document.getElementById('filter-monitoring-status')?.value || '').toLowerCase().trim();

    let exportData = monitoringMasterData.filter(item => {
        const matchSearch = !searchVal || item.nama.toLowerCase().includes(searchVal) || item.nip.toLowerCase().includes(searchVal);
        const matchUnit = !unitVal || item.unit.toLowerCase() === unitVal;
        const matchStatus = !statusVal || item.statusLabel.toLowerCase() === statusVal || 
                            (statusVal.includes('verifikasi 1') && item.statusLabel.includes('Verifikasi Atasan 1')) ||
                            (statusVal.includes('verifikasi 2') && item.statusLabel.includes('Verifikasi Atasan 2'));
        return matchSearch && matchUnit && matchStatus;
    });

    if (exportData.length === 0) {
        showToast('Tidak ada data yang sesuai filter untuk di-export.', 'warning');
        return;
    }

    const activeTa = (document.getElementById('monitoring-ta-label')?.innerText || 'PKK').replace('TA.', '').trim();

    let xml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Monitoring PKK</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
<meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
<style>
  th { background-color: #036F3E; color: #ffffff; font-weight: bold; border: 0.5pt solid #000000; padding: 8px; text-align: center; }
  td { border: 0.5pt solid #cbd5e1; padding: 6px; }
  .text { mso-number-format:"\@"; }
</style>
</head>
<body>
<h2 style="color:#036F3E;">REKAP MONITORING PKK ${activeTa ? ' - TA ' + activeTa : ''}</h2>
<table border="1">
  <thead>
    <tr>
      <th>No</th>
      <th>NIP</th>
      <th>Nama Karyawan</th>
      <th>Jabatan</th>
      <th>Unit</th>
      <th>Skor Akhir</th>
      <th>Predikat</th>
      <th>Status Penilaian</th>
    </tr>
  </thead>
  <tbody>`;

    exportData.forEach((row, idx) => {
        const skorVal = row.pkk ? (row.pkk.finalScore || 0) : '-';
        const gradeVal = row.pkk ? (row.pkk.finalGrade || '-') : '-';
        xml += `
    <tr>
      <td style="text-align:center;">${idx + 1}</td>
      <td class="text" style="text-align:center;">'${row.nip}</td>
      <td>${row.nama || '-'}</td>
      <td>${row.jabatan || '-'}</td>
      <td style="text-align:center;">${row.unit || '-'}</td>
      <td style="text-align:center;">${skorVal}</td>
      <td style="text-align:center;">${gradeVal}</td>
      <td style="text-align:center;">${row.statusLabel || '-'}</td>
    </tr>`;
    });

    xml += `
  </tbody>
</table>
</body>
</html>`;

    const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cleanTa = activeTa ? activeTa.replace(/[\/\\]/g, '_') : 'Export';
    const filename = `Monitoring_PKK_${cleanTa}_${new Date().toISOString().slice(0,10)}.xls`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Berhasil meng-export ${exportData.length} data ke Excel.`, 'success');
}
window.exportMonitoringToExcel = exportMonitoringToExcel;

// Helper caches for preview
let _previewUsersCache = null;
let _previewSkisCache = null;

async function viewPKKPreview(nip) {
    const modal = document.getElementById('modal-pkk-preview');
    const content = document.getElementById('modal-pkk-preview-content');
    if (!modal || !content) return;

    content.innerHTML = `<div style="text-align:center; padding:40px;"><i class="fas fa-spinner fa-spin fa-2x"></i><br><br>Memuat data formulir...</div>`;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Load users & skis in parallel
    const promises = [];
    if (!_previewUsersCache) promises.push(fetchGasAPI('getUsers'));
    else promises.push(Promise.resolve(null));

    if (!_previewSkisCache) promises.push(fetchGasAPI('getSKIs'));
    else promises.push(Promise.resolve(null));

    promises.push(fetchGasAPI('getPKKs', { nip }));

    const [uRes, skiRes, pkkRes] = await Promise.all(promises);

    if (uRes && uRes.success) _previewUsersCache = uRes.data || [];
    if (skiRes && skiRes.success) _previewSkisCache = skiRes.data || [];

    if (!pkkRes || !pkkRes.success || !pkkRes.data || pkkRes.data.length === 0) {
        content.innerHTML = `<p style="text-align:center;color:red;padding:20px;">Gagal memuat data PKK.</p>`;
        return;
    }

    const pkk = pkkRes.data[0];
    const userInfo = (_previewUsersCache || []).find(u => u.nip == nip) || {};

    // Supervisor info for signature table
    const atasan1Nip = String(userInfo.atasan1 || pkk.atasan1 || pkk.atasanNIP1 || '').trim();
    const atasan2Nip = String(userInfo.atasan2 || pkk.atasan2 || pkk.atasanNIP2 || '').trim();

    const uAtasan1 = (_previewUsersCache || []).find(u => String(u.nip).trim() === atasan1Nip);
    const uAtasan2 = (_previewUsersCache || []).find(u => String(u.nip).trim() === atasan2Nip);

    const atasan1Name = uAtasan1 ? uAtasan1.nama : (atasan1Nip && atasan1Nip !== '-' && atasan1Nip !== '0' && atasan1Nip.toLowerCase() !== 'null' ? atasan1Nip : '-');
    const atasan2Name = uAtasan2 ? uAtasan2.nama : (atasan2Nip && atasan2Nip !== '-' && atasan2Nip !== '0' && atasan2Nip.toLowerCase() !== 'null' ? atasan2Nip : '-');

    // Get matching SKI templates
    const targetJabatan = String(userInfo.jabatan || pkk.level).trim().toLowerCase();
    const targetUnit = String(userInfo.unit || pkk.unit).trim().toLowerCase();

    let matchedSkis = (_previewSkisCache || []).filter(s =>
        String(s.targetJabatan).trim().toLowerCase() === targetJabatan &&
        String(s.targetUnit).trim().toLowerCase() === targetUnit
    );

    if (matchedSkis.length === 0) {
        matchedSkis = (_previewSkisCache || []).filter(s =>
            String(s.targetJabatan).trim().toLowerCase() === targetJabatan
        );
    }

    // Parse answers
    let skiAnswers = [];
    try {
        skiAnswers = JSON.parse(pkk.skiAnswers || '[]');
    } catch(e) { }

    // Build SKI Detail Rows
    let skiRows = '';
    const itemsToDisplay = matchedSkis.length > 0 ? matchedSkis : skiAnswers;

    if (itemsToDisplay.length > 0) {
        skiRows = itemsToDisplay.map((item, idx) => {
            const ansObj = skiAnswers.find(a => String(a.index) === String(idx)) || skiAnswers[idx] || {};
            const val = parseFloat(ansObj.value) || 0;

            const skiTitle = item.ski || ansObj.ski || `SKI #${idx+1}`;
            const targetDetail = item.targetDetail || ansObj.targetDetail || '-';
            const rawB = parseFloat(item.bobot) || parseFloat(ansObj.bobot) || 0;
            const displayBobot = (rawB <= 1 && rawB > 0) ? Math.round(rawB * 100 * 100) / 100 : rawB;
            const bxn = displayBobot ? ((displayBobot * val / 100)).toFixed(2) : '-';

            const kriteriaSummary = (item.kriteria1 || item.kriteria5) ? `
                <div style="font-size:0.75rem; color:#475569; margin-top:4px; line-height:1.4; background:#f8fafc; padding:6px 8px; border-radius:4px;">
                    <div><strong>Skala 1:</strong> ${item.kriteria1 || '-'} &nbsp;|&nbsp; <strong>Skala 2:</strong> ${item.kriteria2 || '-'} &nbsp;|&nbsp; <strong>Skala 3:</strong> ${item.kriteria3 || '-'}</div>
                    <div><strong>Skala 4:</strong> ${item.kriteria4 || '-'} &nbsp;|&nbsp; <strong>Skala 5:</strong> ${item.kriteria5 || '-'}</div>
                </div>
            ` : '';

            return `
                <tr style="border-bottom:1px solid #e2e8f0;">
                    <td style="text-align:center; vertical-align:top; padding:8px;">${idx + 1}</td>
                    <td style="vertical-align:top; padding:8px;">
                        <div style="font-weight:600; color:#1e293b;">${skiTitle}</div>
                        ${kriteriaSummary}
                    </td>
                    <td style="vertical-align:top; padding:8px; font-size:0.85rem; color:#334155;">${targetDetail}</td>
                    <td style="text-align:center; vertical-align:top; padding:8px; font-weight:600;">${displayBobot}%</td>
                    <td style="text-align:center; vertical-align:top; padding:8px; font-weight:700; color:#16a34a; font-size:1rem;">${val || '-'}</td>
                    <td style="text-align:center; vertical-align:top; padding:8px; font-weight:700; color:#1e293b;">${bxn}</td>
                </tr>
            `;
        }).join('');
    } else {
        skiRows = `<tr><td colspan="6" style="text-align:center; color:#94a3b8; padding:16px;">Tidak ada data SKI</td></tr>`;
    }

    const perilakuItems = [
        ['Kualitas Hasil Kerja', pkk.p_kualitas_hasil_kerja],
        ['Ketepatan Waktu Pengerjaan', pkk.p_ketepatan_waktu],
        ['Keterampilan Kerja', pkk.p_keterampilan_kerja],
        ['Kerjasama', pkk.p_kerjasama],
        ['Disiplin', pkk.p_disiplin],
        ['Inisiatif', pkk.p_inisiatif],
        ['Peningkatan Tanggung Jawab', pkk.p_peningkatan_tanggung_jawab],
        ['Akhlak Islami', pkk.p_ahlak_islami],
        ['Adaptasi Terhadap Perubahan', pkk.p_adaptasi_terhadap_perubahan],
    ];

    const manajerialItems = [
        ['Planning & Organizing', pkk.m_planning_organizing],
        ['Controlling', pkk.m_controlling],
        ['Analytical Thinking', pkk.m_analytical_thinking],
        ['Decision Making', pkk.m_decision_making],
        ['Developing Others', pkk.m_developing_others],
    ];
    const hasManajerial = manajerialItems.some(([,v]) => v && v > 0);

    const statusColor = pkk.status === 'Selesai' ? '#16a34a' : '#d97706';

    content.innerHTML = `
    <div style="font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:#1e293b; font-size:0.9rem;">
        <!-- Header Dokumen Cetak -->
        <div style="text-align:center; border-bottom:2px solid #1e293b; padding-bottom:16px; margin-bottom:20px;">
            <div style="font-size:0.85rem; font-weight:700; text-transform:uppercase; letter-spacing:2px; color:#475569;">PENILAIAN KINERJA KARYAWAN (PKK)</div>
            <div style="font-size:1.6rem; font-weight:800; color:#1e293b; margin-top:2px;">PERIODE TA. ${pkk.tahunAjaran || '-'}</div>
            <div class="no-print" style="display:inline-block; background:${statusColor}; color:white; border-radius:20px; padding:3px 14px; font-size:0.8rem; margin-top:6px; font-weight:600;">STATUS: ${pkk.status}</div>
        </div>

        <!-- Info Data Karyawan -->
        <div style="border:1px solid #cbd5e1; border-radius:8px; padding:14px 18px; margin-bottom:20px; background:#f8fafc;">
            <div style="font-weight:700; color:#1e293b; margin-bottom:10px; font-size:0.85rem; text-transform:uppercase; letter-spacing:0.5px; border-bottom:1px solid #e2e8f0; padding-bottom:4px;">
                DATA KARYAWAN
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px 24px; font-size:0.88rem;">
                <div><span style="color:#64748b; font-weight:600; display:inline-block; width:110px;">Nama Lengkap</span>: <strong style="color:#1e293b;">${pkk.nama}</strong></div>
                <div><span style="color:#64748b; font-weight:600; display:inline-block; width:110px;">NIP</span>: ${pkk.nip}</div>
                <div><span style="color:#64748b; font-weight:600; display:inline-block; width:110px;">Jabatan</span>: ${pkk.jabatan || userInfo.jabatan || pkk.level || '-'}</div>
                <div><span style="color:#64748b; font-weight:600; display:inline-block; width:110px;">Unit</span>: ${pkk.unit}</div>
            </div>
        </div>

        <!-- Aspek A: KPI -->
        <div style="margin-bottom:24px;">
            <div style="font-weight:700; color:#1e293b; font-size:0.9rem; padding:6px 12px; background:#1e293b; color:white; border-radius:4px 4px 0 0; letter-spacing:0.5px;">
                A. PENILAIAN HASIL KERJA (KPI)
            </div>
            <table style="width:100%; border-collapse:collapse; border:1px solid #cbd5e1; font-size:0.85rem;">
                <thead>
                    <tr style="background:#f1f5f9; color:#1e293b; font-weight:700;">
                        <th style="padding:8px; text-align:center; width:35px; border:1px solid #cbd5e1;">No</th>
                        <th style="padding:8px; text-align:left; border:1px solid #cbd5e1;">Sasaran Kerja (SKI) &amp; Kriteria</th>
                        <th style="padding:8px; text-align:left; width:130px; border:1px solid #cbd5e1;">Target</th>
                        <th style="padding:8px; text-align:center; width:65px; border:1px solid #cbd5e1;">Bobot</th>
                        <th style="padding:8px; text-align:center; width:60px; border:1px solid #cbd5e1;">Nilai</th>
                        <th style="padding:8px; text-align:center; width:70px; border:1px solid #cbd5e1;">B × N</th>
                    </tr>
                </thead>
                <tbody>${skiRows}</tbody>
            </table>
        </div>

        <!-- Container Aspek B & C Compact Layout -->
        <div style="display:grid; grid-template-columns:${hasManajerial ? '1fr 1fr' : '1fr'}; gap:20px; margin-bottom:24px;">
            <!-- Aspek B: Perilaku -->
            <div>
                <div style="font-weight:700; color:#1e293b; font-size:0.9rem; padding:6px 12px; background:#1e293b; color:white; border-radius:4px 4px 0 0; letter-spacing:0.5px;">
                    B. PENILAIAN ASPEK PERILAKU
                </div>
                <table style="width:100%; border-collapse:collapse; border:1px solid #cbd5e1; font-size:0.85rem;">
                    <thead>
                        <tr style="background:#f1f5f9; color:#1e293b;">
                            <th style="padding:8px 12px; text-align:left; border:1px solid #cbd5e1;">Indikator</th>
                            <th style="padding:8px 12px; text-align:center; width:100px; white-space:nowrap; border:1px solid #cbd5e1;">Nilai (1-4)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${perilakuItems.map(([label, val], idx) => `
                            <tr style="border-bottom:1px solid #e2e8f0; background:${idx % 2 === 0 ? '#fff' : '#fafafa'};">
                                <td style="padding:7px 12px; border-right:1px solid #cbd5e1;">${label}</td>
                                <td style="padding:7px 12px; text-align:center; font-weight:700; color:#16a34a;">${val || '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            ${hasManajerial ? `
            <!-- Aspek C: Manajerial -->
            <div>
                <div style="font-weight:700; color:#1e293b; font-size:0.9rem; padding:6px 12px; background:#1e293b; color:white; border-radius:4px 4px 0 0; letter-spacing:0.5px;">
                    C. PENILAIAN ASPEK MANAJERIAL
                </div>
                <table style="width:100%; border-collapse:collapse; border:1px solid #cbd5e1; font-size:0.85rem;">
                    <thead>
                        <tr style="background:#f1f5f9; color:#1e293b;">
                            <th style="padding:8px 12px; text-align:left; border:1px solid #cbd5e1;">Indikator</th>
                            <th style="padding:8px 12px; text-align:center; width:100px; white-space:nowrap; border:1px solid #cbd5e1;">Nilai (1-4)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${manajerialItems.map(([label, val], idx) => `
                            <tr style="border-bottom:1px solid #e2e8f0; background:${idx % 2 === 0 ? '#fff' : '#fafafa'};">
                                <td style="padding:7px 12px; border-right:1px solid #cbd5e1;">${label}</td>
                                <td style="padding:7px 12px; text-align:center; font-weight:700; color:#16a34a;">${val || '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>` : ''}
        </div>

        ${(pkk.rekomendasiPerbaikan || pkk.rekomendasiAkhir) ? `
        <!-- Aspek D: Rekomendasi Compact Layout -->
        <div style="margin-bottom:24px;">
            <div style="font-weight:700; color:white; font-size:0.9rem; padding:6px 12px; background:#4f46e5; border-radius:4px 4px 0 0; letter-spacing:0.5px;">
                D. REKOMENDASI PERBAIKAN &amp; KEPUTUSAN AKHIR
            </div>
            <div style="border:1px solid #cbd5e1; border-top:none; padding:14px; background:#f8fafc; border-radius:0 0 4px 4px;">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; font-size:0.85rem;">
                    <div style="background:white; padding:12px; border-radius:6px; border:1px solid #e2e8f0;">
                        <div style="font-weight:700; color:#4338ca; margin-bottom:4px; font-size:0.8rem; text-transform:uppercase;">JENIS PERBAIKAN</div>
                        <div style="font-weight:600; color:#1e293b; margin-bottom:6px;">${pkk.rekomendasiPerbaikan || '-'}</div>
                        <div style="color:#64748b; font-size:0.8rem;"><strong style="color:#475569;">Keterangan:</strong> ${pkk.keteranganPerbaikan || '-'}</div>
                    </div>
                    <div style="background:white; padding:12px; border-radius:6px; border:1px solid #e2e8f0;">
                        <div style="font-weight:700; color:#4338ca; margin-bottom:4px; font-size:0.8rem; text-transform:uppercase;">KEPUTUSAN AKHIR</div>
                        <div style="font-weight:600; color:#1e293b; margin-bottom:6px;">${pkk.rekomendasiAkhir || '-'}</div>
                        <div style="color:#64748b; font-size:0.8rem;"><strong style="color:#475569;">Alasan:</strong> ${pkk.alasanKeputusan || '-'}</div>
                    </div>
                </div>
            </div>
        </div>` : ''}

        <!-- Ringkasan Hasil Akhir -->
        <div style="background: linear-gradient(135deg,#1e293b,#334155); color:white; border-radius:8px; padding:16px 24px; display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
            <div>
                <div style="font-size:0.8rem; text-transform:uppercase; letter-spacing:1px; opacity:0.8;">SKOR AKHIR PENILAIAN KINERJA</div>
                <div style="font-size:1.1rem; font-weight:600; opacity:0.9;">Kategori: <strong style="color:#4ade80;">${pkk.finalGrade || '-'}</strong></div>
            </div>
            <div style="font-size:2.4rem; font-weight:800; color:#4ade80;">${pkk.finalScore || 0}</div>
        </div>

        <!-- Section G: Pengesahan (5 Tanda Tangan) -->
        <div style="margin-top:28px; page-break-inside:avoid;">
            <div style="font-weight:700; color:white; font-size:0.88rem; padding:6px 12px; background:#036F3E; border-radius:4px 4px 0 0; letter-spacing:0.5px;">
                G. PENGESAHAN DOKUMEN PENILAIAN
            </div>
            <table style="width:100%; border-collapse:collapse; border:1.5px solid #1e293b; text-align:center; font-size:0.82rem;">
                <thead>
                    <tr style="border-bottom:1.5px solid #1e293b; background:#f8fafc; font-weight:700; color:#1e293b;">
                        <th style="padding:8px 4px; border-right:1.5px solid #1e293b; width:20%;">Yang Dinilai</th>
                        <th style="padding:8px 4px; border-right:1.5px solid #1e293b; width:20%;">Penilai (Atasan 1)</th>
                        <th style="padding:8px 4px; border-right:1.5px solid #1e293b; width:20%;">Atasan Penilai 2</th>
                        <th style="padding:8px 4px; border-right:1.5px solid #1e293b; width:20%;">Kepala Divisi / GM</th>
                        <th style="padding:8px 4px; width:20%;">HRD</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="height:95px; vertical-align:bottom;">
                        <td style="border-right:1.5px solid #1e293b; padding-bottom:8px;">
                            <div style="font-weight:700; color:#1e293b; text-decoration:underline;">${pkk.nama}</div>
                            <div style="font-size:0.75rem; color:#64748b;">NIP: ${pkk.nip}</div>
                        </td>
                        <td style="border-right:1.5px solid #1e293b; padding-bottom:8px;">
                            <div style="font-weight:700; color:#1e293b; text-decoration:underline;">${atasan1Name}</div>
                            <div style="font-size:0.75rem; color:#64748b;">${atasan1Nip && atasan1Nip !== '-' && atasan1Nip !== '0' && atasan1Nip.toLowerCase() !== 'null' ? 'NIP: ' + atasan1Nip : ''}</div>
                        </td>
                        <td style="border-right:1.5px solid #1e293b; padding-bottom:8px;">
                            <div style="font-weight:700; color:#1e293b; text-decoration:underline;">${atasan2Name}</div>
                            <div style="font-size:0.75rem; color:#64748b;">${atasan2Nip && atasan2Nip !== '-' && atasan2Nip !== '0' && atasan2Nip.toLowerCase() !== 'null' ? 'NIP: ' + atasan2Nip : ''}</div>
                        </td>
                        <td style="border-right:1.5px solid #1e293b; padding-bottom:8px;">
                            <div style="font-weight:700; color:#1e293b; text-decoration:underline;">( &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; )</div>
                        </td>
                        <td style="padding-bottom:8px;">
                            <div style="font-weight:700; color:#1e293b; text-decoration:underline;">( &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; )</div>
                        </td>
                    </tr>
                    <tr style="border-top:1.5px solid #1e293b; font-size:0.78rem; color:#334155;">
                        <td style="padding:5px 4px; border-right:1.5px solid #1e293b;">Tgl. &nbsp;&nbsp;&nbsp;&nbsp; / &nbsp;&nbsp;&nbsp;&nbsp; /</td>
                        <td style="padding:5px 4px; border-right:1.5px solid #1e293b;">Tgl. &nbsp;&nbsp;&nbsp;&nbsp; / &nbsp;&nbsp;&nbsp;&nbsp; /</td>
                        <td style="padding:5px 4px; border-right:1.5px solid #1e293b;">Tgl. &nbsp;&nbsp;&nbsp;&nbsp; / &nbsp;&nbsp;&nbsp;&nbsp; /</td>
                        <td style="padding:5px 4px; border-right:1.5px solid #1e293b;">Tgl. &nbsp;&nbsp;&nbsp;&nbsp; / &nbsp;&nbsp;&nbsp;&nbsp; /</td>
                        <td style="padding:5px 4px;">Tgl. &nbsp;&nbsp;&nbsp;&nbsp; / &nbsp;&nbsp;&nbsp;&nbsp; /</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Rating Scale Info Box -->
        <div style="margin-top:20px; font-size:0.82rem; color:#1e293b; line-height:1.5; page-break-inside:avoid;">
            <div style="font-weight:700; text-decoration:underline; margin-bottom:6px;">Rating Scale (Nilai Kategori) :</div>
            <div style="display:flex; flex-wrap:wrap; gap:10px 24px; font-size:0.82rem; color:#334155; background:#f8fafc; padding:8px 14px; border-radius:6px; border:1px solid #cbd5e1;">
                <div><span>&lt; 168</span> : <strong style="color:#1e293b;">Kurang Sekali</strong></div>
                <div><span>168 - 239</span> : <strong style="color:#1e293b;">Kurang</strong></div>
                <div><span>240 - 311</span> : <strong style="color:#1e293b;">Cukup</strong></div>
                <div><span>312 - 383</span> : <strong style="color:#1e293b;">Baik</strong></div>
                <div><span>384 - 455</span> : <strong style="color:#1e293b;">Baik Sekali</strong></div>
            </div>
        </div>

        <!-- Print Action Buttons -->
        <div style="text-align:center; margin-top:24px; display:flex; justify-content:center; gap:12px;" class="no-print">
            <button onclick="window.print()" style="background:#036F3E; color:white; border:none; border-radius:8px; padding:10px 28px; font-size:0.9rem; cursor:pointer; font-family:inherit; font-weight:600; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1); transition:all 0.2s;">
                <i class="fas fa-print"></i> Cetak / Save PDF
            </button>
            <button onclick="closePreviewPKK()" style="background:#64748b; color:white; border:none; border-radius:8px; padding:10px 24px; font-size:0.9rem; cursor:pointer; font-family:inherit; font-weight:600; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
                <i class="fas fa-times"></i> Tutup
            </button>
        </div>
    </div>`;
}

window.viewPKKPreview = viewPKKPreview;
window.closePreviewPKK = function() {
    const modal = document.getElementById('modal-pkk-preview');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
    _previewUsersCache = null;
};


// --- Page: Ubah Password ---
function initUbahPassword() {
    const form = document.getElementById('form-ubah-password');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const passLama = document.getElementById('pass-lama').value;
            const passBaru = document.getElementById('pass-baru').value;
            const passKonfirm = document.getElementById('pass-konfirmasi').value;

            if (passBaru !== passKonfirm) {
                showToast('Password baru dan konfirmasi tidak cocok!', 'error');
                return;
            }

            const btn = document.getElementById('btn-submit-password');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
            btn.disabled = true;

            if (APP_CONFIG.USE_MOCK) {
                if (currentUser.password === passLama) {
                    currentUser.password = passBaru;
                    localStorage.setItem('pkk_user', JSON.stringify(currentUser));
                    showToast('Password berhasil diubah (Mock)!', 'success');
                    form.reset();
                } else {
                    showToast('Password lama salah!', 'error');
                }
            } else {
                const res = await fetchSupabaseAPI('changePassword', {
                    nip: currentUser.nip,
                    oldPassword: passLama,
                    newPassword: passBaru
                });
                if (res && res.success) {
                    currentUser.password = passBaru;
                    localStorage.setItem('pkk_user', JSON.stringify(currentUser));
                    showToast('Password berhasil diubah!', 'success');
                    form.reset();
                } else {
                    showToast(res ? res.message : 'Gagal mengubah password', 'error');
                }
            }

            btn.innerHTML = originalText;
            btn.disabled = false;
        });
    }
}

// --- Page: Settings (Bobot) ---
const DEFAULT_BOBOT_MATRIX = [
    ["Category", "Aspek", "Direktur", "General Manager", "Manager", "Supervisor", "TimLeader", "staff"],
    ["Overall", "Pekerjaan", 50, 50, 50, 50, 55, 60],
    ["Overall", "Perilaku", 30, 30, 30, 30, 35, 40],
    ["Overall", "Manajerial", 20, 20, 20, 20, 10, 0],
    ["Perilaku", "Kualitas Hasil Kerja", 2, 2, 2, 3, 3, 5],
    ["Perilaku", "Ketepatan Waktu Pengerjaan", 2, 2, 2, 3, 3, 5],
    ["Perilaku", "Keterampilan Kerja", 2, 2, 2, 3, 3, 5],
    ["Perilaku", "Kerjasama", 4, 4, 4, 3, 3, 5],
    ["Perilaku", "Disiplin", 4, 4, 4, 3, 3, 5],
    ["Perilaku", "Inisiatif", 4, 4, 4, 4, 4, 4],
    ["Perilaku", "Peningkatan Tanggung Jawab", 4, 4, 4, 4, 4, 3],
    ["Perilaku", "Ahlak Islami", 4, 4, 4, 3, 3, 4],
    ["Perilaku", "Adaptasi Terhadap Perubahan", 4, 4, 4, 4, 4, 4],
    ["Manajerial", "Planning & Organizing", 4, 4, 4, 5, 3, 0],
    ["Manajerial", "Controlling", 4, 4, 4, 4, 2, 0],
    ["Manajerial", "Analytical Thinking", 4, 4, 4, 4, 2, 0],
    ["Manajerial", "Decision Making", 3, 3, 3, 2, 1, 0],
    ["Manajerial", "Developing Others", 5, 5, 5, 5, 2, 0]
];

let currentBobotData = [];
async function initSettings() {
    const form = document.getElementById('form-settings');
    const tbodyUtama = document.querySelector('#table-bobot-utama tbody');
    const tbodyPerilaku = document.querySelector('#table-bobot-perilaku tbody');
    const tbodyManajerial = document.querySelector('#table-bobot-manajerial tbody');

    if (!form) return;

    const res = await fetchSupabaseAPI('getBobot');
    if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        currentBobotData = res.data;
    } else {
        currentBobotData = JSON.parse(JSON.stringify(DEFAULT_BOBOT_MATRIX));
    }

    renderBobotSection(currentBobotData, 'Overall', tbodyUtama);
    renderBobotSection(currentBobotData, 'Perilaku', tbodyPerilaku);
    renderBobotSection(currentBobotData, 'Manajerial', tbodyManajerial);
    calculateSettingTotals();

    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', calculateSettingTotals);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const inputs = form.querySelectorAll('input[data-row]');
        inputs.forEach(input => {
            const r = parseInt(input.getAttribute('data-row'));
            const c = parseInt(input.getAttribute('data-col'));
            if (currentBobotData[r]) {
                currentBobotData[r][c] = parseFloat(input.value) || 0;
            }
        });

        const btn = document.getElementById('btn-save-settings');
        const origText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
        btn.disabled = true;

        const saveRes = await fetchSupabaseAPI('saveBobot', { bobotData: currentBobotData });
        if (saveRes && saveRes.success) {
            showToast('Setting Bobot berhasil disimpan!', 'success');
        } else {
            showToast('Gagal menyimpan bobot.', 'error');
        }

        btn.innerHTML = origText;
        btn.disabled = false;
    });
}

function renderBobotSection(data, category, tbody) {
    if (!tbody) return;
    let html = '';
    for (let i = 1; i < data.length; i++) {
        if (data[i][0] === category) {
            html += '<tr>';
            html += `<td>${data[i][1]}</td>`;
            for (let j = 2; j < data[i].length; j++) {
                html += `<td><input type="number" class="form-control" style="min-width:60px; padding:8px 5px; text-align:center;" data-row="${i}" data-col="${j}" value="${data[i][j] || 0}"></td>`;
            }
            html += '</tr>';
        }
    }
    tbody.innerHTML = html;
}

function calculateSettingTotals() {
    const roles = [2, 3, 4, 5, 6, 7]; // column index for roles

    const sumSection = (tableId) => {
        let totals = { 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
        const tbody = document.querySelector(`${tableId} tbody`);
        if (!tbody) return totals;
        tbody.querySelectorAll('input').forEach(inp => {
            const c = parseInt(inp.getAttribute('data-col'));
            if (totals[c] !== undefined) {
                totals[c] += (parseFloat(inp.value) || 0);
            }
        });
        return totals;
    };

    const totUtama = sumSection('#table-bobot-utama');
    const totPerilaku = sumSection('#table-bobot-perilaku');
    const totManajerial = sumSection('#table-bobot-manajerial');

    roles.forEach(c => {
        const u = document.getElementById(`tot-utama-${c}`);
        if (u) u.innerText = totUtama[c] + '%';

        const p = document.getElementById(`tot-perilaku-${c}`);
        if (p) p.innerText = totPerilaku[c];

        const m = document.getElementById(`tot-manajerial-${c}`);
        if (m) m.innerText = totManajerial[c];
    });
}

// --- Page: Tahun Ajaran ---
async function initTahunAjaran() {
    const tbody = document.getElementById('tbody-tahun-ajaran');
    if (!tbody) return;

    if (APP_CONFIG.USE_MOCK) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center">Mode Mock: Fitur ini membutuhkan koneksi ke server.</td></tr>';
        return;
    }

    const loadData = async () => {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center"><i class="fas fa-spinner fa-spin"></i> Memuat Data...</td></tr>';
        const res = await fetchSupabaseAPI('getTahunAjaran');
        if (res && res.success) {
            if (res.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" class="text-center">Belum ada data Tahun Ajaran</td></tr>';
                return;
            }
            tbody.innerHTML = res.data.map(ta => `
                <tr>
                    <td>${ta.tahun}</td>
                    <td>
                        <span class="status-badge ${ta.status === 'Aktif' ? 'status-approved' : 'status-pending'}">
                            ${ta.status}
                        </span>
                    </td>
                    <td>
                        <button class="btn-primary" style="padding:5px 10px; font-size:0.8rem;" onclick="setTahunAjaranAktif('${ta.id}')" ${ta.status === 'Aktif' ? 'disabled' : ''}>Set Aktif</button>
                    </td>
                </tr>
            `).join('');

            if (res.active) {
                const elHeaderActive = document.getElementById('active-academic-year');
                if (elHeaderActive) elHeaderActive.innerText = "TA. " + res.active;
            }
        } else {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Gagal memuat data</td></tr>';
        }
    };

    await loadData();

    // Setup Modal
    const btnTambah = document.getElementById('btn-tambah-ta');
    const modal = document.getElementById('modal-ta');
    const btnBatal = document.getElementById('btn-batal-ta');
    const btnSimpan = document.getElementById('btn-simpan-ta');
    const inputTA = document.getElementById('input-ta-baru');

    if (btnTambah && modal) {
        btnTambah.onclick = () => modal.style.display = 'flex';
        btnBatal.onclick = () => modal.style.display = 'none';

        btnSimpan.onclick = async () => {
            const val = inputTA.value.trim();
            if (!val) return showToast('Tahun Ajaran tidak boleh kosong', 'error');

            btnSimpan.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan';
            btnSimpan.disabled = true;

            const res = await fetchSupabaseAPI('addTahunAjaran', { tahun: val });
            if (res && res.success) {
                showToast(res.message, 'success');
                modal.style.display = 'none';
                inputTA.value = '';
                await loadData();
            } else {
                showToast('Gagal menambah Tahun Ajaran', 'error');
            }

            btnSimpan.innerHTML = 'Simpan';
            btnSimpan.disabled = false;
        };
    }
}

window.setTahunAjaranAktif = async (id) => {
    showToast('Mengaktifkan Tahun Ajaran...', 'info');
    const res = await fetchSupabaseAPI('setAktifTahunAjaran', { id: id });
    if (res && res.success) {
        showToast(res.message, 'success');
        initTahunAjaran(); // reloads data and header
    } else {
        showToast('Gagal mengaktifkan Tahun Ajaran', 'error');
    }
};

// --- Page: Form SKI (Input SKI Baru) ---
let _skiUserData = []; // cache users dari DB

async function initFormSki() {
    const tbody = document.getElementById('tbody-ski-rows');
    const selUnit = document.getElementById('ski-sel-unit');
    const selLevel = document.getElementById('ski-sel-level');
    const selJabatan = document.getElementById('ski-sel-jabatan');
    const btnTambah = document.getElementById('btn-tambah-baris-ski');
    const btnSimpan = document.getElementById('btn-simpan-template-ski');

    if (!tbody) return;

    // --- Set Unit & Load Users ---
    let usersRes = null;
    if (APP_CONFIG.USE_MOCK) {
        _skiUserData = MOCK_DB.users;
    } else {
        const uList = await loadUsersData();
        _skiUserData = (uList && uList.length > 0) ? uList : MOCK_DB.users;
    }

    // Populate Unit Dropdown
    if (selUnit) {
        const isAdmin = ['Super Admin', 'Direktur', 'General Manager'].includes(currentUser.level);
        if (isAdmin) {
            let allUnits = [...new Set(_skiUserData.map(u => u.unit).filter(Boolean))];
            if (currentUser.level === 'General Manager') {
                const isPendidikan = currentUser.jabatan && currentUser.jabatan.toLowerCase().includes('pendidikan');
                const isOperasional = currentUser.jabatan && currentUser.jabatan.toLowerCase().includes('operasional');
                if (isPendidikan) {
                    allUnits = allUnits.filter(u => ['tk', 'sd', 'smp', 'sma'].includes((u || '').toLowerCase()));
                } else if (isOperasional) {
                    allUnits = allUnits.filter(u => ['fa', 'ga', 'hrd'].includes((u || '').toLowerCase()));
                }
            }
            selUnit.innerHTML = '<option value="">-- Pilih Unit --</option>' +
                allUnits.map(u => `<option value="${u}" ${u === currentUser.unit ? 'selected' : ''}>${u}</option>`).join('');
        } else {
            selUnit.innerHTML = `<option value="${currentUser.unit}">${currentUser.unit}</option>`;
        }
    }

    // Ensure SKI data is loaded first to check existing templates
    if (!_isSkisDataLoaded) {
        await loadSkisData();
    }

    const levelOrder = ['Pelaksana', 'Staff', 'Tim Leader', 'Supervisor', 'Manager', 'General Manager', 'Direktur'];
    const hiddenLevels = ['super admin', 'superadmin', 'gm', 'general manager', 'direksi', 'direktur'];

    const updateJabatanDropdown = () => {
        if (!selJabatan) return;
        const selectedLvl = selLevel ? selLevel.value : '';
        const selectedU = selUnit ? selUnit.value : '';

        let candidateSet = new Set();

        // 1. Get users matching BOTH selectedU and selectedLvl strictly from _skiUserData
        let filteredUsers = _skiUserData;
        if (selectedU) {
            filteredUsers = filteredUsers.filter(u => (u.unit || '').toLowerCase().trim() === selectedU.toLowerCase().trim());
        }
        if (selectedLvl) {
            filteredUsers = filteredUsers.filter(u => (u.level || '').toLowerCase().trim() === selectedLvl.toLowerCase().trim());
        }

        filteredUsers.forEach(u => {
            if (u.jabatan) candidateSet.add(u.jabatan.trim());
        });

        // 2. Also check _allSkisData for existing templates matching selectedU and selectedLvl strictly
        if (selectedU && selectedLvl) {
            _allSkisData.filter(s => {
                return (s.targetUnit || '').toLowerCase().trim() === selectedU.toLowerCase().trim()
                    && (s.targetLevel || '').toLowerCase().trim() === selectedLvl.toLowerCase().trim();
            }).forEach(s => {
                if (s.targetJabatan) candidateSet.add(s.targetJabatan.trim());
            });
        }

        // 3. Fallbacks for Manager level IF appropriate:
        if (selectedLvl === 'Manager') {
            const isSchoolUnit = ['tk', 'sd', 'smp', 'sma'].includes((selectedU || '').toLowerCase().trim());
            if (isSchoolUnit) {
                candidateSet.add(`Kepala Sekolah ${selectedU}`);
                candidateSet.add(`Kepala Sekolah`);
                candidateSet.add(`Kepala ${selectedU}`);
            } else if (selectedU) {
                candidateSet.add(`Manager ${selectedU}`);
                candidateSet.add(`Manajer ${selectedU}`);
            } else {
                candidateSet.add('Manager IT');
                candidateSet.add('Manager HRD');
                candidateSet.add('Manager Operasional');
                candidateSet.add('Manager Keuangan');
                candidateSet.add('Kepala Sekolah SMA');
                candidateSet.add('Kepala Sekolah SMP');
                candidateSet.add('Kepala Sekolah SD');
                candidateSet.add('Kepala Sekolah TK');
            }
        }

        let candidates = [...candidateSet].filter(Boolean);

        const optionsHtml = ['<option value="">-- Pilih Jabatan --</option>'];

        candidates.forEach(j => {
            const existingSkis = _allSkisData.filter(s => {
                return (s.targetUnit || '').toLowerCase().trim() === (selectedU || '').toLowerCase().trim()
                    && (s.targetLevel || '').toLowerCase().trim() === (selectedLvl || '').toLowerCase().trim()
                    && (s.targetJabatan || '').toLowerCase().trim() === (j || '').toLowerCase().trim();
            });

            if (existingSkis.length > 0) {
                const totalBobotGroup = existingSkis.reduce((sum, item) => {
                    let b = parseFloat(item.bobot) || 0;
                    return sum + ((b <= 1 && b > 0) ? b * 100 : b);
                }, 0);
                const roundedBobot = Math.round(totalBobotGroup * 10) / 10;

                if (roundedBobot >= 100) {
                    optionsHtml.push(`<option value="${j}">${j} (Sudah 100% - Edit di Master SKI)</option>`);
                } else {
                    optionsHtml.push(`<option value="${j}">${j} (Draf ${roundedBobot}%)</option>`);
                }
            } else {
                optionsHtml.push(`<option value="${j}">${j}</option>`);
            }
        });

        selJabatan.innerHTML = optionsHtml.join('');
    };

    const updateLevelDropdown = () => {
        if (!selLevel) return;
        const selectedU = selUnit ? selUnit.value : '';

        let allowedLevels = [];

        if (currentUser.level === 'General Manager') {
            // General Manager khusus hanya menginput SKI untuk level Manager
            allowedLevels = ['Manager'];
        } else {
            // Filter users berdasarkan unit terpilih
            let filteredUsers = _skiUserData;
            if (selectedU) {
                filteredUsers = filteredUsers.filter(u => u.unit === selectedU);
            }

            // Ambil level yang HANYA ADA pada unit tersebut
            let levels = [...new Set(filteredUsers.map(u => u.level).filter(Boolean))];
            if (levels.length === 0 && selectedU) {
                levels = [...new Set(_skiUserData.map(u => u.level).filter(Boolean))];
            }

            levels.sort((a, b) => levelOrder.indexOf(a) - levelOrder.indexOf(b));
            allowedLevels = levels.filter(l => !hiddenLevels.includes(l.toLowerCase().trim()));
        }

        const currentVal = selLevel.value;
        selLevel.innerHTML = '<option value="">-- Pilih Level --</option>' +
            allowedLevels.map(l => `<option value="${l}">${l}</option>`).join('');

        if (allowedLevels.includes(currentVal)) {
            selLevel.value = currentVal;
        } else if (currentUser.level === 'General Manager' && allowedLevels.length === 1) {
            selLevel.value = allowedLevels[0];
        } else {
            selLevel.value = '';
        }

        updateJabatanDropdown();
    };

    if (selUnit) {
        selUnit.onchange = () => {
            updateLevelDropdown();
        };
    }

    if (selLevel) {
        selLevel.onchange = () => {
            updateJabatanDropdown();
        };
    }

    // Inisialisasi awal
    updateLevelDropdown();

    // Tambah satu baris kosong awal
    addSkiRow();

    // --- Event: Tambah Baris ---
    if (btnTambah) {
        btnTambah.onclick = () => addSkiRow();
    }

    // --- Event: Simpan Template ---
    if (btnSimpan) {
        btnSimpan.onclick = async () => {
            if (btnSimpan.disabled) return;

            const origText = btnSimpan.innerHTML;
            btnSimpan.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
            btnSimpan.disabled = true;

            const resetBtn = () => {
                btnSimpan.innerHTML = origText;
                btnSimpan.disabled = false;
            };

            const rows = tbody.querySelectorAll('.ski-item-card');
            const selectedUnit = selUnit ? selUnit.value : currentUser.unit;
            const selectedLevel = selLevel ? selLevel.value : '';
            const selectedJabatan = document.getElementById('ski-sel-jabatan')?.value || '';

            if (!selectedLevel) {
                resetBtn();
                return showToast('Pilih Level Jabatan terlebih dahulu!', 'error');
            }
            if (!selectedJabatan) {
                resetBtn();
                return showToast('Pilih Jabatan terlebih dahulu!', 'error');
            }

            // Hitung total bobot pada form saat ini
            const newTotalBobot = [...rows].reduce((sum, r) => {
                const b = parseFloat(r.querySelector('.ski-bobot-input')?.value || 0);
                return sum + b;
            }, 0);

            // --- Cek apakah kombinasi ini sudah ada & hitung sisa bobot ---
            const existingSkis = _allSkisData.filter(s => {
                return (s.targetUnit || '').toLowerCase().trim() === (selectedUnit || '').toLowerCase().trim()
                    && (s.targetLevel || '').toLowerCase().trim() === (selectedLevel || '').toLowerCase().trim()
                    && (s.targetJabatan || '').toLowerCase().trim() === (selectedJabatan || '').toLowerCase().trim();
            });

            if (existingSkis.length > 0) {
                // Hitung total bobot yang sudah tersimpan
                const existingBobot = existingSkis.reduce((sum, s) => {
                    const b = parseFloat(s.bobot) || 0;
                    return sum + (b <= 1 && b > 0 ? b * 100 : b);
                }, 0);

                if (Math.round(existingBobot) >= 100) {
                    resetBtn();
                    return showToast(
                        `Template SKI untuk "${selectedJabatan}" (Unit: ${selectedUnit}) sudah penuh (100%). Gunakan tombol Edit untuk mengubahnya.`,
                        'error'
                    );
                }

                const siBobot = 100 - Math.round(existingBobot);
                if (Math.round(newTotalBobot) > siBobot) {
                    resetBtn();
                    return showToast(
                        `Sisa bobot yang tersedia untuk jabatan ini hanya ${siBobot}%. Isi form dengan total bobot maksimal ${siBobot}%.`,
                        'error'
                    );
                }
            }

            // Validasi total bobot form saat ini tidak boleh lebih dari 100%
            if (newTotalBobot <= 0) {
                resetBtn();
                return showToast('Isi minimal 1 baris SKI dengan bobot yang valid!', 'error');
            }
            // Validasi kelengkapan SELURUH kolom pada setiap baris
            for (let idx = 0; idx < rows.length; idx++) {
                const r = rows[idx];
                const kpi = r.querySelector('.ski-kpi-input')?.value.trim();
                const ski = r.querySelector('.ski-ski-input')?.value.trim();
                const target = r.querySelector('.ski-target-input')?.value.trim();
                const k1 = r.querySelector('.ski-k1-input')?.value.trim();
                const k2 = r.querySelector('.ski-k2-input')?.value.trim();
                const k3 = r.querySelector('.ski-k3-input')?.value.trim();
                const k4 = r.querySelector('.ski-k4-input')?.value.trim();
                const k5 = r.querySelector('.ski-k5-input')?.value.trim();
                const bobot = parseFloat(r.querySelector('.ski-bobot-input')?.value || 0);

                if (!kpi || !ski || !target || !k1 || !k2 || !k3 || !k4 || !k5 || bobot <= 0) {
                    resetBtn();
                    return showToast(`Harap lengkapi seluruh kolom (KPI, SKI, Target, Skala 1-5, dan Bobot > 0%) pada baris #${idx + 1}!`, 'error');
                }
            }

            const skiList = [...rows].map(row => {
                const rawBobot = parseFloat(row.querySelector('.ski-bobot-input')?.value || 0);
                const bobotFraction = rawBobot > 1 ? (rawBobot / 100) : rawBobot;
                return {
                    createdByNIP: currentUser ? currentUser.nip : '',
                    targetUnit: selectedUnit,
                    targetLevel: selectedLevel,
                    targetJabatan: selectedJabatan,
                    kpiDepartemen: row.querySelector('.ski-kpi-input')?.value.trim() || '',
                    ski: row.querySelector('.ski-ski-input')?.value.trim() || '',
                    targetDetail: row.querySelector('.ski-target-input')?.value.trim() || '',
                    kriteria1: row.querySelector('.ski-k1-input')?.value.trim() || '',
                    kriteria2: row.querySelector('.ski-k2-input')?.value.trim() || '',
                    kriteria3: row.querySelector('.ski-k3-input')?.value.trim() || '',
                    kriteria4: row.querySelector('.ski-k4-input')?.value.trim() || '',
                    kriteria5: row.querySelector('.ski-k5-input')?.value.trim() || '',
                    bobot: bobotFraction
                };
            });

            const res = await fetchGasAPI('saveBatchSKI', { skiList });

            if (res && res.success) {
                _isSkisDataLoaded = false;
                const roundedB = Math.round(newTotalBobot * 10) / 10;
                if (roundedB >= 100) {
                    showToast('Template SKI (100% Lengkap) berhasil disimpan!', 'success');
                } else {
                    showToast(`Draf Template SKI berhasil disimpan! (Total Bobot: ${roundedB}%)`, 'success');
                }
                navigate('daftar_ski');
            } else {
                resetBtn();
                showToast(res ? res.message : 'Gagal menyimpan template SKI.', 'error');
            }
        };
    }
}

let _skiRowCounter = 0;
function addSkiRow(data = {}) {
    const tbody = document.getElementById('tbody-ski-rows');
    if (!tbody) return;
    _skiRowCounter++;
    const n = _skiRowCounter;
    const rowId = `ski-row-${n}`;

    let initialBobot = data.bobot !== undefined && data.bobot !== '' ? data.bobot : '';
    if (initialBobot !== '' && !isNaN(initialBobot)) {
        const numB = parseFloat(initialBobot);
        if (numB <= 1 && numB > 0) {
            initialBobot = Math.round(numB * 100 * 100) / 100;
        }
    }

    const card = document.createElement('div');
    card.id = rowId;
    card.className = 'ski-item-card';
    card.style.cssText = 'background:#ffffff; border:1.5px solid #e2e8f0; border-radius:12px; padding:18px; margin-bottom:16px; box-shadow:0 2px 6px rgba(0,0,0,0.03); transition:all 0.2s;';
    card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9; padding-bottom:12px; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
            <div style="display:flex; align-items:center; gap:10px;">
                <span class="row-number-badge" style="background:#1e293b; color:white; width:28px; height:28px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-weight:700; font-size:0.85rem;">${tbody.children.length + 1}</span>
                <h5 class="row-title-text" style="margin:0; color:#1e293b; font-weight:700; font-size:0.95rem;">Sasaran Kerja Individu (SKI) #${tbody.children.length + 1}</h5>
            </div>
            <div style="display:flex; align-items:center; gap:14px;">
                <div style="display:flex; align-items:center; gap:6px; background:#f8fafc; padding:4px 12px; border-radius:8px; border:1px solid #cbd5e1;">
                    <label style="font-weight:700; color:#334155; font-size:0.85rem; margin:0;">Bobot <span style="color:#ef4444;">*</span>:</label>
                    <input type="number" class="form-control ski-bobot-input" min="0" max="100" value="${initialBobot}" placeholder="0" style="width:70px; text-align:center; font-weight:700; color:#16a34a; font-size:0.95rem; padding:4px 6px;" oninput="updateSkiTotalBobot()" required>
                    <span style="font-weight:700; color:#475569; font-size:0.85rem;">%</span>
                </div>
                <button type="button" onclick="removeSkiRow('${rowId}')" style="background:#fee2e2; color:#ef4444; border:1px solid #fca5a5; padding:6px 12px; border-radius:8px; cursor:pointer; font-weight:600; font-size:0.8rem; display:inline-flex; align-items:center; gap:6px;">
                    <i class="fas fa-trash"></i> Hapus Baris
                </button>
            </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:14px; margin-bottom:14px;">
            <div>
                <label style="font-weight:700; font-size:0.82rem; color:#475569; display:block; margin-bottom:4px;">
                    <i class="fas fa-bullseye" style="color:#2563eb;"></i> KPI Departemen <span style="color:#ef4444;">*</span>
                </label>
                <textarea class="form-control ski-kpi-input" style="min-height:75px; font-size:0.85rem; line-height:1.4; resize:vertical;" placeholder="Tuliskan KPI Departemen..." required>${data.kpiDepartemen || ''}</textarea>
            </div>
            <div>
                <label style="font-weight:700; font-size:0.82rem; color:#475569; display:block; margin-bottom:4px;">
                    <i class="fas fa-tasks" style="color:#059669;"></i> Sasaran Kerja Individu (SKI) <span style="color:#ef4444;">*</span>
                </label>
                <textarea class="form-control ski-ski-input" style="min-height:75px; font-size:0.85rem; line-height:1.4; resize:vertical; font-weight:600;" placeholder="Tuliskan Sasaran Kerja Individu..." required>${data.ski || ''}</textarea>
            </div>
            <div>
                <label style="font-weight:700; font-size:0.82rem; color:#475569; display:block; margin-bottom:4px;">
                    <i class="fas fa-flag" style="color:#d97706;"></i> Target Detail <span style="color:#ef4444;">*</span>
                </label>
                <textarea class="form-control ski-target-input" style="min-height:75px; font-size:0.85rem; line-height:1.4; resize:vertical;" placeholder="Contoh: 100% selesai tepat waktu..." required>${data.targetDetail || ''}</textarea>
            </div>
        </div>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px 14px;">
            <label style="font-weight:700; font-size:0.82rem; color:#334155; display:block; margin-bottom:8px;">
                <i class="fas fa-sliders-h" style="color:#4f46e5;"></i> Kriteria Skala Penilaian (1 s.d 5) <span style="color:#ef4444;">*</span>
            </label>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap:10px;">
                <div>
                    <div style="font-size:0.75rem; font-weight:700; color:#ef4444; margin-bottom:3px; background:#fee2e2; padding:3px 6px; border-radius:4px; text-align:center;">Skala 1 (Sangat Kurang) *</div>
                    <textarea class="form-control ski-k1-input" style="min-height:65px; font-size:0.8rem; padding:6px; resize:vertical;" placeholder="Deskripsi skala 1..." required>${data.kriteria1 || ''}</textarea>
                </div>
                <div>
                    <div style="font-size:0.75rem; font-weight:700; color:#ea580c; margin-bottom:3px; background:#ffedd5; padding:3px 6px; border-radius:4px; text-align:center;">Skala 2 (Kurang) *</div>
                    <textarea class="form-control ski-k2-input" style="min-height:65px; font-size:0.8rem; padding:6px; resize:vertical;" placeholder="Deskripsi skala 2..." required>${data.kriteria2 || ''}</textarea>
                </div>
                <div>
                    <div style="font-size:0.75rem; font-weight:700; color:#ca8a04; margin-bottom:3px; background:#fef9c3; padding:3px 6px; border-radius:4px; text-align:center;">Skala 3 (Cukup) *</div>
                    <textarea class="form-control ski-k3-input" style="min-height:65px; font-size:0.8rem; padding:6px; resize:vertical;" placeholder="Deskripsi skala 3..." required>${data.kriteria3 || ''}</textarea>
                </div>
                <div>
                    <div style="font-size:0.75rem; font-weight:700; color:#2563eb; margin-bottom:3px; background:#dbeafe; padding:3px 6px; border-radius:4px; text-align:center;">Skala 4 (Baik) *</div>
                    <textarea class="form-control ski-k4-input" style="min-height:65px; font-size:0.8rem; padding:6px; resize:vertical;" placeholder="Deskripsi skala 4..." required>${data.kriteria4 || ''}</textarea>
                </div>
                <div>
                    <div style="font-size:0.75rem; font-weight:700; color:#16a34a; margin-bottom:3px; background:#dcfce7; padding:3px 6px; border-radius:4px; text-align:center;">Skala 5 (Sangat Baik) *</div>
                    <textarea class="form-control ski-k5-input" style="min-height:65px; font-size:0.8rem; padding:6px; resize:vertical;" placeholder="Deskripsi skala 5..." required>${data.kriteria5 || ''}</textarea>
                </div>
            </div>
        </div>
    `;
    tbody.appendChild(card);
    updateSkiTotalBobot();
    renumberSkiRows();
}

window.removeSkiRow = (rowId) => {
    const row = document.getElementById(rowId);
    if (row) {
        row.remove();
        updateSkiTotalBobot();
        renumberSkiRows();
    }
};

function renumberSkiRows() {
    const tbody = document.getElementById('tbody-ski-rows');
    if (!tbody) return;
    [...tbody.children].forEach((card, i) => {
        const badge = card.querySelector('.row-number-badge');
        if (badge) badge.innerText = i + 1;
        const title = card.querySelector('.row-title-text');
        if (title) title.innerText = `Sasaran Kerja Individu (SKI) #${i + 1}`;
    });
}

function updateSkiTotalBobot() {
    const tbody = document.getElementById('tbody-ski-rows');
    const totalEl = document.getElementById('ski-total-bobot');
    if (!tbody || !totalEl) return;
    const total = [...tbody.querySelectorAll('.ski-bobot-input')].reduce((sum, inp) => sum + (parseFloat(inp.value) || 0), 0);
    const rounded = Math.round(total * 10) / 10;
    totalEl.innerText = rounded + '%';
    totalEl.style.color = Math.round(total) === 100 ? '#16a34a' : '#ef4444';
}

window.deleteSKI = async (id) => {
    if (!confirm('Hapus SKI ini?')) return;
    showToast('Menghapus...', 'info');
    const res = await fetchGasAPI('deleteSKI', { id });
    if (res && res.success) {
        showToast('SKI berhasil dihapus.', 'success');
        _isSkisDataLoaded = false;
        clearLocalCache('pkk_skis_cache');
        if (typeof initFormSki === 'function' && currentAppPage === 'form_ski') initFormSki();
        if (typeof initDaftarSki === 'function' && currentAppPage === 'daftar_ski') initDaftarSki(true);
    } else {
        showToast('Gagal menghapus SKI.', 'error');
    }
};

let _allSkisData = [];
let _isSkisDataLoaded = false;

async function loadSkisData(forceRefresh = false) {
    if (_isSkisDataLoaded && !forceRefresh) {
        return _allSkisData;
    }

    if (!forceRefresh && _allSkisData.length === 0) {
        const local = getLocalCache('pkk_skis_cache');
        if (local && Array.isArray(local) && local.length > 0) {
            _allSkisData = local;
            _isSkisDataLoaded = true;
            fetchSupabaseAPI('getSKIs').then(res => {
                if (res && res.success && Array.isArray(res.data)) {
                    _allSkisData = res.data;
                    setLocalCache('pkk_skis_cache', res.data);
                }
            }).catch(() => {});
            return _allSkisData;
        }
    }

    const res = await fetchSupabaseAPI('getSKIs');
    if (res && res.success) {
        _allSkisData = res.data || [];
        _isSkisDataLoaded = true;
        setLocalCache('pkk_skis_cache', _allSkisData);
    } else {
        return _allSkisData.length > 0 ? _allSkisData : null;
    }

    return _allSkisData;
}

async function initDaftarSki(forceRefresh = false) {
    const tbody = document.getElementById('tbody-daftar-ski');
    const filterUnit = document.getElementById('filter-ski-unit');
    const filterLevel = document.getElementById('filter-ski-level');
    const filterJabatan = document.getElementById('filter-ski-jabatan');
    const searchText = document.getElementById('search-ski-text');
    const btnInputBaru = document.getElementById('btn-input-ski-baru');
    const btnRefresh = document.getElementById('btn-refresh-ski');

    if (!tbody) return;

    setupCsvSkiModalEvents();

    // Sembunyikan tombol Input SKI Baru HANYA untuk Direktur (Read-only total)
    const isReadOnlyAll = (currentUser.level === 'Direktur');
    if (btnInputBaru) {
        if (isReadOnlyAll) {
            btnInputBaru.style.display = 'none';
        } else {
            btnInputBaru.style.display = 'inline-block';
            btnInputBaru.onclick = () => navigate('form_ski');
        }
    }

    if (btnRefresh) {
        btnRefresh.onclick = async () => {
            btnRefresh.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memuat...';
            btnRefresh.disabled = true;
            clearLocalCache('pkk_skis_cache');
            await initDaftarSki(true);
            btnRefresh.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
            btnRefresh.disabled = false;
            showToast('Data SKI diperbarui dari cloud.', 'success');
        };
    }

    if (!_isSkisDataLoaded || forceRefresh) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center" style="padding:30px;"><i class="fas fa-spinner fa-spin"></i> Memuat data SKI dari database...</td></tr>';
        const data = await loadSkisData(forceRefresh);
        if (!data) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Gagal mengambil data SKI dari database.</td></tr>';
            return;
        }
    }

    let displaySkis = [..._allSkisData];

    // Filter SKI berdasarkan role & unit pengguna
    if (currentUser.level === 'General Manager') {
        const isPendidikan = currentUser.jabatan && currentUser.jabatan.toLowerCase().includes('pendidikan');
        const isOperasional = currentUser.jabatan && currentUser.jabatan.toLowerCase().includes('operasional');

        if (isPendidikan) {
            displaySkis = displaySkis.filter(s => {
                const u = (s.targetUnit || '').toLowerCase();
                return ['tk', 'sd', 'smp', 'sma'].includes(u);
            });
        } else if (isOperasional) {
            displaySkis = displaySkis.filter(s => {
                const u = (s.targetUnit || '').toLowerCase();
                return ['fa', 'ga', 'hrd'].includes(u);
            });
        }
    } else if (!['Super Admin', 'Direktur'].includes(currentUser.level)) {
        const userUnit = (currentUser.unit || '').toLowerCase().trim();
        displaySkis = displaySkis.filter(s => {
            const skiUnit = (s.targetUnit || '').toLowerCase().trim();
            return skiUnit === userUnit;
        });
    }

    // Populate Filters (Cascading Filter Jabatan)
    const updateFilterJabatanOptions = () => {
        if (!filterJabatan) return;
        const selectedUnit = filterUnit ? filterUnit.value : '';
        const selectedLevel = filterLevel ? filterLevel.value : '';
        const currentSelectedJabatan = filterJabatan.value;

        let filteredForJabatan = displaySkis;
        if (selectedUnit) {
            filteredForJabatan = filteredForJabatan.filter(s => s.targetUnit === selectedUnit);
        }
        if (selectedLevel) {
            filteredForJabatan = filteredForJabatan.filter(s => s.targetLevel === selectedLevel);
        }

        const availableJabatans = [...new Set(filteredForJabatan.map(s => s.targetJabatan).filter(Boolean))].sort();

        filterJabatan.innerHTML = '<option value="">-- Semua Jabatan --</option>' +
            availableJabatans.map(j => `<option value="${j}">${j}</option>`).join('');

        if (availableJabatans.includes(currentSelectedJabatan)) {
            filterJabatan.value = currentSelectedJabatan;
        } else {
            filterJabatan.value = '';
        }
    };

    if (filterUnit) {
        const units = [...new Set(displaySkis.map(s => s.targetUnit).filter(Boolean))].sort();
        filterUnit.innerHTML = '<option value="">-- Semua Unit --</option>' +
            units.map(u => `<option value="${u}">${u}</option>`).join('');
    }
    if (filterLevel) {
        const levels = [...new Set(displaySkis.map(s => s.targetLevel).filter(Boolean))].sort();
        filterLevel.innerHTML = '<option value="">-- Semua Level --</option>' +
            levels.map(l => `<option value="${l}">${l}</option>`).join('');
    }
    updateFilterJabatanOptions();

    let currentSkiPage = 1;
    const skiPageSize = 10;

    const renderTable = () => {
        const uVal = filterUnit ? filterUnit.value : '';
        const lVal = filterLevel ? filterLevel.value : '';
        const jVal = filterJabatan ? filterJabatan.value : '';
        const qVal = searchText ? searchText.value.toLowerCase().trim() : '';

        // Grouping by Unit + Level + Jabatan
        const groupedMap = new Map();
        displaySkis.forEach(item => {
            const unit = item.targetUnit || '-';
            const level = item.targetLevel || '-';
            const jabatan = item.targetJabatan || '-';
            const key = `${unit}||${level}||${jabatan}`;

            if (!groupedMap.has(key)) {
                groupedMap.set(key, {
                    key: key,
                    unit: unit,
                    level: level,
                    jabatan: jabatan,
                    skis: []
                });
            }
            const g = groupedMap.get(key);
            g.skis.push(item);
        });

        let groups = Array.from(groupedMap.values());

        // Apply filters
        let filteredGroups = groups.filter(g => {
            if (uVal && g.unit !== uVal) return false;
            if (lVal && g.level !== lVal) return false;
            if (jVal && g.jabatan !== jVal) return false;
            if (qVal) {
                const searchHaystack = `${g.unit} ${g.level} ${g.jabatan} ${g.skis.map(s => `${s.kpiDepartemen || ''} ${s.ski || ''}`).join(' ')}`.toLowerCase();
                if (!searchHaystack.includes(qVal)) return false;
            }
            return true;
        });

        const pagContainer = document.getElementById('ski-pagination-container');

        if (filteredGroups.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center" style="padding:20px; color:#94a3b8;">Tidak ada data template SKI yang sesuai.</td></tr>';
            if (pagContainer) pagContainer.innerHTML = '';
            return;
        }

        const totalPages = Math.ceil(filteredGroups.length / skiPageSize) || 1;
        if (currentSkiPage > totalPages) currentSkiPage = totalPages;
        if (currentSkiPage < 1) currentSkiPage = 1;

        const startIdx = (currentSkiPage - 1) * skiPageSize;
        const pagedGroups = filteredGroups.slice(startIdx, startIdx + skiPageSize);
        const totalSkiCount = filteredGroups.reduce((sum, g) => sum + g.skis.length, 0);

        tbody.innerHTML = pagedGroups.map((g, idx) => {
            const rowNum = startIdx + idx + 1;
            const totalBobotGroup = g.skis.reduce((sum, item) => {
                let b = parseFloat(item.bobot) || 0;
                return sum + ((b <= 1 && b > 0) ? b * 100 : b);
            }, 0);
            const roundedBobot = Math.round(totalBobotGroup * 10) / 10;
            const isComplete = Math.round(roundedBobot) >= 100;

            let canEditGroup = true;
            if (currentUser.level === 'Direktur') {
                canEditGroup = false;
            } else if (currentUser.level === 'General Manager') {
                canEditGroup = (g.level === 'Manager');
            } else if (currentUser.level === 'Manager') {
                canEditGroup = (g.level !== 'Manager');
            } else if (['Pelaksana', 'Staff', 'Tim Leader', 'Supervisor'].includes(currentUser.level)) {
                canEditGroup = false;
            }

            return `
                <tr>
                    <td style="text-align:center; font-weight:600;">${rowNum}</td>
                    <td><span style="background:#e0e7ff; color:#3730a3; padding:4px 10px; border-radius:12px; font-weight:600; font-size:0.8rem; display:inline-block; white-space:nowrap;">${g.unit}</span></td>
                    <td><span style="background:#f1f5f9; color:#334155; padding:4px 10px; border-radius:12px; font-weight:600; font-size:0.8rem; display:inline-block; white-space:nowrap;">${g.level}</span></td>
                    <td><strong style="color:#1e293b; font-size:0.88rem;">${g.jabatan}</strong></td>
                    <td style="text-align:center;">
                        <span style="background:#fef3c7; color:#92400e; padding:4px 10px; border-radius:12px; font-weight:600; font-size:0.8rem; display:inline-block; white-space:nowrap;">${g.skis.length} Target</span>
                    </td>
                    <td style="text-align:center;">
                        ${isComplete ? 
                            `<span style="background:#dcfce7; color:#15803d; border:1px solid #86efac; padding:4px 10px; border-radius:12px; font-weight:700; font-size:0.78rem; display:inline-flex; align-items:center; gap:4px; white-space:nowrap;"><i class="fas fa-check-circle"></i> ${roundedBobot}% (Lengkap)</span>` :
                            `<span style="background:#fef3c7; color:#b45309; border:1px solid #fde68a; padding:4px 10px; border-radius:12px; font-weight:700; font-size:0.78rem; display:inline-flex; align-items:center; gap:4px; white-space:nowrap;"><i class="fas fa-clock"></i> ${roundedBobot}% (Draf)</span>`
                        }
                    </td>
                    <td style="text-align:center; white-space:nowrap; vertical-align:middle;">
                        <div style="display:inline-flex; align-items:center; justify-content:center; gap:5px; flex-wrap:nowrap;">
                            <button style="background:#f0f9ff; color:#0369a1; border:1px solid #bae6fd; padding:5px 9px; border-radius:7px; font-weight:600; font-size:0.75rem; cursor:pointer; display:inline-flex; align-items:center; gap:4px;" onclick="viewGroupSki('${encodeURIComponent(g.key)}')" title="Preview / Lihat SKI Jabatan Ini">
                                <i class="fas fa-eye"></i> Lihat
                            </button>
                            <button style="background:#f0fdf4; color:#166534; border:1px solid #bbf7d0; width:29px; height:29px; border-radius:7px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center;" onclick="downloadSingleGroupSKI('${encodeURIComponent(g.key)}')" title="Download File Excel SKI Jabatan Ini">
                                <i class="fas fa-file-excel" style="font-size:0.8rem; color:#16a34a;"></i>
                            </button>
                            ${canEditGroup ? `
                                <button style="background:#f0fdf4; color:#15803d; border:1px solid #bbf7d0; padding:5px 9px; border-radius:7px; font-weight:600; font-size:0.75rem; cursor:pointer; display:inline-flex; align-items:center; gap:4px;" onclick="editGroupSki('${encodeURIComponent(g.key)}')" title="Edit Template SKI">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button style="background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; width:29px; height:29px; border-radius:7px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center;" onclick="duplicateGroupSki('${encodeURIComponent(g.key)}')" title="Duplikat Template SKI Ini">
                                    <i class="fas fa-copy" style="font-size:0.75rem;"></i>
                                </button>
                                <button style="background:#fee2e2; color:#ef4444; border:1px solid #fca5a5; width:29px; height:29px; border-radius:7px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center;" onclick="deleteGroupSki('${encodeURIComponent(g.key)}')" title="Hapus Template Jabatan Ini">
                                    <i class="fas fa-trash" style="font-size:0.75rem;"></i>
                                </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        if (pagContainer) {
            const endIdx = Math.min(startIdx + skiPageSize, filteredGroups.length);
            let paginationBtns = '';

            paginationBtns += `<button class="btn-secondary" style="padding:4px 10px; font-size:0.8rem;" ${currentSkiPage === 1 ? 'disabled' : ''} onclick="window.changeSkiPage(${currentSkiPage - 1})"><i class="fas fa-chevron-left"></i> Prev</button>`;

            for (let p = 1; p <= totalPages; p++) {
                if (p === 1 || p === totalPages || (p >= currentSkiPage - 1 && p <= currentSkiPage + 1)) {
                    paginationBtns += `<button class="${p === currentSkiPage ? 'btn-primary' : 'btn-secondary'}" style="padding:4px 10px; font-size:0.8rem; min-width:32px;" onclick="window.changeSkiPage(${p})">${p}</button>`;
                } else if (p === currentSkiPage - 2 || p === currentSkiPage + 2) {
                    paginationBtns += `<span style="padding:0 4px; color:#94a3b8;">...</span>`;
                }
            }

            paginationBtns += `<button class="btn-secondary" style="padding:4px 10px; font-size:0.8rem;" ${currentSkiPage === totalPages ? 'disabled' : ''} onclick="window.changeSkiPage(${currentSkiPage + 1})">Next <i class="fas fa-chevron-right"></i></button>`;

            pagContainer.innerHTML = `
                <div>
                    Menampilkan <strong>${startIdx + 1} - ${endIdx}</strong> dari <strong>${filteredGroups.length}</strong> Template Jabatan (Total <strong>${totalSkiCount}</strong> SKI)
                </div>
                <div style="display:flex; gap:4px; align-items:center;">
                    ${paginationBtns}
                </div>
            `;
        }
    };

    window.changeSkiPage = (page) => {
        currentSkiPage = page;
        renderTable();
        const cardHeader = document.querySelector('.page-daftar-ski .card-header');
        if (cardHeader) cardHeader.scrollIntoView({ behavior: 'smooth' });
    };

    renderTable();

    let searchDebounceTimer = null;
    if (filterUnit) {
        filterUnit.onchange = () => {
            currentSkiPage = 1;
            updateFilterJabatanOptions();
            renderTable();
        };
    }
    if (filterLevel) {
        filterLevel.onchange = () => {
            currentSkiPage = 1;
            updateFilterJabatanOptions();
            renderTable();
        };
    }
    if (filterJabatan) filterJabatan.onchange = () => { currentSkiPage = 1; renderTable(); };
    if (searchText) {
        searchText.oninput = () => {
            clearTimeout(searchDebounceTimer);
            searchDebounceTimer = setTimeout(() => {
                currentSkiPage = 1;
                renderTable();
            }, 300);
        };
    }

    // Modal Close event
    const modalDetail = document.getElementById('modal-detail-ski');
    const btnCloseModal = document.getElementById('btn-close-modal-ski');
    if (modalDetail && btnCloseModal) {
        btnCloseModal.onclick = () => modalDetail.style.display = 'none';
        modalDetail.onclick = (e) => {
            if (e.target === modalDetail) modalDetail.style.display = 'none';
        };
    }
}



window.updateModalEditTotalBobot = () => {
    const tbody = document.getElementById('tbody-modal-edit-rows');
    const totalEl = document.getElementById('modal-edit-total-bobot');
    if (!tbody || !totalEl) return;
    const total = [...tbody.querySelectorAll('.edit-bobot')].reduce((sum, inp) => sum + (parseFloat(inp.value) || 0), 0);
    const rounded = Math.round(total * 10) / 10;
    totalEl.innerText = rounded + '%';
    totalEl.style.color = Math.round(total) === 100 ? '#16a34a' : '#ef4444';
};

window.renumberModalEditRows = () => {
    const tbody = document.getElementById('tbody-modal-edit-rows');
    if (!tbody) return;
    [...tbody.children].forEach((card, i) => {
        const badge = card.querySelector('.row-number-badge');
        if (badge) badge.innerText = i + 1;
        const title = card.querySelector('.row-title-text');
        if (title) title.innerText = `Target SKI #${i + 1}`;
    });
};

window.addModalEditRow = (data = {}) => {
    const tbody = document.getElementById('tbody-modal-edit-rows');
    if (!tbody) return;
    const count = tbody.children.length + 1;
    const card = document.createElement('div');
    card.className = 'ski-edit-card';
    card.setAttribute('data-ski-id', data.id || '');
    card.style.cssText = 'background:#ffffff; border:1.5px solid #cbd5e1; border-radius:12px; padding:16px; margin-bottom:14px; box-shadow:0 2px 6px rgba(0,0,0,0.03);';
    card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:10px; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; align-items:center; gap:8px;">
                <span class="row-number-badge" style="background:#1e293b; color:white; width:26px; height:26px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-weight:700; font-size:0.8rem;">${count}</span>
                <h5 class="row-title-text" style="margin:0; color:#1e293b; font-weight:700; font-size:0.9rem;">Target SKI #${count}</h5>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
                <div style="display:flex; align-items:center; gap:6px; background:#f8fafc; padding:3px 10px; border-radius:6px; border:1px solid #cbd5e1;">
                    <label style="font-weight:700; color:#334155; font-size:0.8rem; margin:0;">Bobot <span style="color:#ef4444;">*</span>:</label>
                    <input type="number" class="form-control edit-bobot" min="0" max="100" value="${data.bobot || ''}" placeholder="0" style="width:65px; text-align:center; font-weight:700; color:#16a34a; font-size:0.9rem; padding:3px 6px;" oninput="updateModalEditTotalBobot()" required>
                    <span style="font-weight:700; color:#475569; font-size:0.8rem;">%</span>
                </div>
                <button type="button" onclick="removeModalEditRow(this)" style="background:#fee2e2; color:#ef4444; border:1px solid #fca5a5; padding:5px 10px; border-radius:6px; cursor:pointer; font-weight:600; font-size:0.78rem; display:inline-flex; align-items:center; gap:5px;" title="Hapus Baris Ini">
                    <i class="fas fa-trash"></i> Hapus
                </button>
            </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:12px; margin-bottom:12px;">
            <div>
                <label style="font-weight:700; font-size:0.8rem; color:#475569; display:block; margin-bottom:4px;">KPI Departemen <span style="color:#ef4444;">*</span></label>
                <textarea class="form-control edit-kpi" style="min-height:70px; font-size:0.83rem; line-height:1.4; resize:vertical;" placeholder="KPI Departemen..." required>${data.kpiDepartemen || ''}</textarea>
            </div>
            <div>
                <label style="font-weight:700; font-size:0.8rem; color:#475569; display:block; margin-bottom:4px;">Sasaran Kerja Individu (SKI) <span style="color:#ef4444;">*</span></label>
                <textarea class="form-control edit-ski" style="min-height:70px; font-size:0.83rem; line-height:1.4; resize:vertical; font-weight:600;" placeholder="Sasaran Kerja..." required>${data.ski || ''}</textarea>
            </div>
            <div>
                <label style="font-weight:700; font-size:0.8rem; color:#475569; display:block; margin-bottom:4px;">Target Detail <span style="color:#ef4444;">*</span></label>
                <textarea class="form-control edit-target" style="min-height:70px; font-size:0.83rem; line-height:1.4; resize:vertical;" placeholder="Target detail..." required>${data.targetDetail || ''}</textarea>
            </div>
        </div>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px 12px;">
            <label style="font-weight:700; font-size:0.8rem; color:#334155; display:block; margin-bottom:6px;">Skala Penilaian (1 s.d 5) <span style="color:#ef4444;">*</span></label>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap:8px;">
                <div>
                    <div style="font-size:0.72rem; font-weight:700; color:#ef4444; margin-bottom:2px; background:#fee2e2; padding:2px 4px; border-radius:4px; text-align:center;">Skala 1 (Sangat Kurang) *</div>
                    <textarea class="form-control edit-k1" style="min-height:55px; font-size:0.78rem; padding:4px 6px; resize:vertical;" placeholder="Skala 1..." required>${data.kriteria1 || ''}</textarea>
                </div>
                <div>
                    <div style="font-size:0.72rem; font-weight:700; color:#ea580c; margin-bottom:2px; background:#ffedd5; padding:2px 4px; border-radius:4px; text-align:center;">Skala 2 (Kurang) *</div>
                    <textarea class="form-control edit-k2" style="min-height:55px; font-size:0.78rem; padding:4px 6px; resize:vertical;" placeholder="Skala 2..." required>${data.kriteria2 || ''}</textarea>
                </div>
                <div>
                    <div style="font-size:0.72rem; font-weight:700; color:#ca8a04; margin-bottom:2px; background:#fef9c3; padding:2px 4px; border-radius:4px; text-align:center;">Skala 3 (Cukup) *</div>
                    <textarea class="form-control edit-k3" style="min-height:55px; font-size:0.78rem; padding:4px 6px; resize:vertical;" placeholder="Skala 3..." required>${data.kriteria3 || ''}</textarea>
                </div>
                <div>
                    <div style="font-size:0.72rem; font-weight:700; color:#2563eb; margin-bottom:2px; background:#dbeafe; padding:2px 4px; border-radius:4px; text-align:center;">Skala 4 (Baik) *</div>
                    <textarea class="form-control edit-k4" style="min-height:55px; font-size:0.78rem; padding:4px 6px; resize:vertical;" placeholder="Skala 4..." required>${data.kriteria4 || ''}</textarea>
                </div>
                <div>
                    <div style="font-size:0.72rem; font-weight:700; color:#16a34a; margin-bottom:2px; background:#dcfce7; padding:2px 4px; border-radius:4px; text-align:center;">Skala 5 (Sangat Baik) *</div>
                    <textarea class="form-control edit-k5" style="min-height:55px; font-size:0.78rem; padding:4px 6px; resize:vertical;" placeholder="Skala 5..." required>${data.kriteria5 || ''}</textarea>
                </div>
            </div>
        </div>
    `;
    tbody.appendChild(card);
    updateModalEditTotalBobot();
    renumberModalEditRows();
};

window._modalPendingDeletedSkiIds = window._modalPendingDeletedSkiIds || [];

window.removeModalEditRow = (btn) => {
    const card = btn.closest('.ski-edit-card') || btn.closest('tr');
    if (!card) return;
    const skiId = card.getAttribute('data-ski-id');

    if (skiId) {
        if (!window._modalPendingDeletedSkiIds.includes(skiId)) {
            window._modalPendingDeletedSkiIds.push(skiId);
        }
    }
    card.remove();
    updateModalEditTotalBobot();
    renumberModalEditRows();
};

window.editGroupSki = (encodedKey) => {
    window._modalPendingDeletedSkiIds = [];

    const key = decodeURIComponent(encodedKey);
    const items = _allSkisData.filter(item => {
        const u = item.targetUnit || '-';
        const l = item.targetLevel || '-';
        const j = item.targetJabatan || '-';
        return `${u}||${l}||${j}` === key;
    });

    if (!items.length) return;

    if (currentUser.level === 'General Manager' && items[0].targetLevel !== 'Manager') {
        showToast('General Manager hanya dapat mengedit SKI khusus untuk level Manager.', 'warning');
        return viewGroupSki(encodedKey);
    }
    if (currentUser.level === 'Manager' && items[0].targetLevel === 'Manager') {
        showToast('Manager tidak dapat mengedit SKI level Manager (dibuat oleh General Manager).', 'warning');
        return viewGroupSki(encodedKey);
    }
    if (['Direktur', 'Supervisor', 'Staff', 'Pelaksana'].includes(currentUser.level)) {
        showToast('Level ' + currentUser.level + ' tidak memiliki hak akses untuk mengedit template SKI.', 'warning');
        return viewGroupSki(encodedKey);
    }

    const modal = document.getElementById('modal-detail-ski');
    const title = document.getElementById('modal-ski-title');
    const subtitle = document.getElementById('modal-ski-subtitle');
    const body = document.getElementById('modal-ski-body');

    if (!modal || !body) return;

    const cardEl = modal.querySelector('.card');
    if (cardEl) {
        cardEl.style.maxWidth = '1000px';
    }

    const first = items[0];
    if (title) title.innerHTML = `<i class="fas fa-edit text-primary"></i> Edit Template SKI: ${first.targetJabatan || '-'}`;
    if (subtitle) subtitle.innerHTML = `Unit: <strong>${first.targetUnit || '-'}</strong> | Level: <strong>${first.targetLevel || '-'}</strong> | Total: <strong>${items.length} Target</strong>`;

    body.innerHTML = `
        <div id="tbody-modal-edit-rows" style="margin-bottom:16px;">
            ${items.map((item, idx) => {
                let rawB = parseFloat(item.bobot) || 0;
                let displayB = (rawB <= 1 && rawB > 0) ? Math.round(rawB * 100 * 100) / 100 : rawB;
                return `
                    <div class="ski-edit-card" data-ski-id="${item.id}" style="background:#ffffff; border:1.5px solid #cbd5e1; border-radius:12px; padding:16px; margin-bottom:14px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
                        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:10px; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span class="row-number-badge" style="background:#1e293b; color:white; width:26px; height:26px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-weight:700; font-size:0.8rem;">${idx + 1}</span>
                                <h5 class="row-title-text" style="margin:0; color:#1e293b; font-weight:700; font-size:0.9rem;">Target SKI #${idx + 1}</h5>
                            </div>
                            <div style="display:flex; align-items:center; gap:12px;">
                                <div style="display:flex; align-items:center; gap:6px; background:#f8fafc; padding:3px 10px; border-radius:6px; border:1px solid #cbd5e1;">
                                    <label style="font-weight:700; color:#334155; font-size:0.8rem; margin:0;">Bobot <span style="color:#ef4444;">*</span>:</label>
                                    <input type="number" class="form-control edit-bobot" min="0" max="100" value="${displayB}" placeholder="0" style="width:65px; text-align:center; font-weight:700; color:#16a34a; font-size:0.9rem; padding:3px 6px;" oninput="updateModalEditTotalBobot()" required>
                                    <span style="font-weight:700; color:#475569; font-size:0.8rem;">%</span>
                                </div>
                                <button type="button" onclick="removeModalEditRow(this)" style="background:#fee2e2; color:#ef4444; border:1px solid #fca5a5; padding:5px 10px; border-radius:6px; cursor:pointer; font-weight:600; font-size:0.78rem; display:inline-flex; align-items:center; gap:5px;" title="Hapus Baris Ini">
                                    <i class="fas fa-trash"></i> Hapus
                                </button>
                            </div>
                        </div>

                        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:12px; margin-bottom:12px;">
                            <div>
                                <label style="font-weight:700; font-size:0.8rem; color:#475569; display:block; margin-bottom:4px;">KPI Departemen <span style="color:#ef4444;">*</span></label>
                                <textarea class="form-control edit-kpi" style="min-height:70px; font-size:0.83rem; line-height:1.4; resize:vertical;" placeholder="KPI Departemen..." required>${item.kpiDepartemen || ''}</textarea>
                            </div>
                            <div>
                                <label style="font-weight:700; font-size:0.8rem; color:#475569; display:block; margin-bottom:4px;">Sasaran Kerja Individu (SKI) <span style="color:#ef4444;">*</span></label>
                                <textarea class="form-control edit-ski" style="min-height:70px; font-size:0.83rem; line-height:1.4; resize:vertical; font-weight:600;" placeholder="Sasaran Kerja..." required>${item.ski || ''}</textarea>
                            </div>
                            <div>
                                <label style="font-weight:700; font-size:0.8rem; color:#475569; display:block; margin-bottom:4px;">Target Detail <span style="color:#ef4444;">*</span></label>
                                <textarea class="form-control edit-target" style="min-height:70px; font-size:0.83rem; line-height:1.4; resize:vertical;" placeholder="Target detail..." required>${item.targetDetail || ''}</textarea>
                            </div>
                        </div>

                        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px 12px;">
                            <label style="font-weight:700; font-size:0.8rem; color:#334155; display:block; margin-bottom:6px;">Skala Penilaian (1 s.d 5) <span style="color:#ef4444;">*</span></label>
                            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap:8px;">
                                <div>
                                    <div style="font-size:0.72rem; font-weight:700; color:#ef4444; margin-bottom:2px; background:#fee2e2; padding:2px 4px; border-radius:4px; text-align:center;">Skala 1 (Sangat Kurang) *</div>
                                    <textarea class="form-control edit-k1" style="min-height:55px; font-size:0.78rem; padding:4px 6px; resize:vertical;" placeholder="Skala 1..." required>${item.kriteria1 || ''}</textarea>
                                </div>
                                <div>
                                    <div style="font-size:0.72rem; font-weight:700; color:#ea580c; margin-bottom:2px; background:#ffedd5; padding:2px 4px; border-radius:4px; text-align:center;">Skala 2 (Kurang) *</div>
                                    <textarea class="form-control edit-k2" style="min-height:55px; font-size:0.78rem; padding:4px 6px; resize:vertical;" placeholder="Skala 2..." required>${item.kriteria2 || ''}</textarea>
                                </div>
                                <div>
                                    <div style="font-size:0.72rem; font-weight:700; color:#ca8a04; margin-bottom:2px; background:#fef9c3; padding:2px 4px; border-radius:4px; text-align:center;">Skala 3 (Cukup) *</div>
                                    <textarea class="form-control edit-k3" style="min-height:55px; font-size:0.78rem; padding:4px 6px; resize:vertical;" placeholder="Skala 3..." required>${item.kriteria3 || ''}</textarea>
                                </div>
                                <div>
                                    <div style="font-size:0.72rem; font-weight:700; color:#2563eb; margin-bottom:2px; background:#dbeafe; padding:2px 4px; border-radius:4px; text-align:center;">Skala 4 (Baik) *</div>
                                    <textarea class="form-control edit-k4" style="min-height:55px; font-size:0.78rem; padding:4px 6px; resize:vertical;" placeholder="Skala 4..." required>${item.kriteria4 || ''}</textarea>
                                </div>
                                <div>
                                    <div style="font-size:0.72rem; font-weight:700; color:#16a34a; margin-bottom:2px; background:#dcfce7; padding:2px 4px; border-radius:4px; text-align:center;">Skala 5 (Sangat Baik) *</div>
                                    <textarea class="form-control edit-k5" style="min-height:55px; font-size:0.78rem; padding:4px 6px; resize:vertical;" placeholder="Skala 5..." required>${item.kriteria5 || ''}</textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>

        <div style="background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:10px; padding:10px 16px; display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <div style="font-weight:700; color:#334155; font-size:0.9rem;">
                <i class="fas fa-calculator text-emerald-600"></i> TOTAL BOBOT :
            </div>
            <div id="modal-edit-total-bobot" style="font-weight:800; font-size:1.2rem; color:#16a34a;">0%</div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
            <button type="button" class="btn-secondary" onclick="addModalEditRow()"><i class="fas fa-plus"></i> Tambah Baris</button>
            <div style="display:flex; gap:10px;">
                <button class="btn-secondary" onclick="window._modalPendingDeletedSkiIds = []; document.getElementById('modal-detail-ski').style.display='none'">Batal</button>
                <button class="btn-primary" onclick="saveGroupSkiEdit('${encodeURIComponent(key)}')"><i class="fas fa-save"></i> Simpan Perubahan</button>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
    updateModalEditTotalBobot();
};

window.downloadSingleGroupSKI = (encodedKey) => {
    if (typeof XLSX === 'undefined') {
        showToast("Pustaka XLSX (SheetJS) belum dimuat. Periksa koneksi internet Anda.", "danger");
        return;
    }

    const key = decodeURIComponent(encodedKey);
    const items = _allSkisData.filter(item => {
        const u = item.targetUnit || '-';
        const l = item.targetLevel || '-';
        const j = item.targetJabatan || '-';
        return `${u}||${l}||${j}` === key;
    });

    if (!items || items.length === 0) {
        showToast("Data SKI untuk jabatan ini tidak ditemukan.", "danger");
        return;
    }

    const first = items[0];
    const unitName = first.targetUnit || 'Unit';
    const levelName = first.targetLevel || 'Level';
    const jabatanName = first.targetJabatan || 'Jabatan';

    const exportRows = items.map(item => {
        let b = parseFloat(item.bobot) || 0;
        let bobotVal = (b <= 1 && b > 0) ? Math.round(b * 100 * 100) / 100 : Math.round(b * 100) / 100;

        return {
            "Target Unit": item.targetUnit || '',
            "Target Level": item.targetLevel || '',
            "Target Jabatan": item.targetJabatan || '',
            "KPI Departemen": item.kpiDepartemen || '',
            "SKI": item.ski || '',
            "Target Detail": item.targetDetail || '',
            "Kriteria 1": item.kriteria1 || '',
            "Kriteria 2": item.kriteria2 || '',
            "Kriteria 3": item.kriteria3 || '',
            "Kriteria 4": item.kriteria4 || '',
            "Kriteria 5": item.kriteria5 || '',
            "Bobot (%)": bobotVal
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportRows);

    worksheet['!cols'] = [
        { wch: 18 }, // Target Unit
        { wch: 15 }, // Target Level
        { wch: 22 }, // Target Jabatan
        { wch: 25 }, // KPI Departemen
        { wch: 35 }, // SKI
        { wch: 45 }, // Target Detail
        { wch: 35 }, // Kriteria 1
        { wch: 35 }, // Kriteria 2
        { wch: 35 }, // Kriteria 3
        { wch: 35 }, // Kriteria 4
        { wch: 35 }, // Kriteria 5
        { wch: 12 }  // Bobot (%)
    ];

    const workbook = XLSX.utils.book_new();
    const rawSheetName = `SKI_${unitName}_${jabatanName}`.replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 31);
    XLSX.utils.book_append_sheet(workbook, worksheet, rawSheetName || "Data SKI");

    const cleanFilename = `SKI_${unitName}_${levelName}_${jabatanName}`.replace(/[^a-zA-Z0-9_-]/g, '_');
    XLSX.writeFile(workbook, `${cleanFilename}.xlsx`);

    showToast(`File Excel SKI (${unitName} - ${jabatanName}) berhasil di-download!`, "success");
};

window.viewGroupSki = (encodedKey) => {
    const key = decodeURIComponent(encodedKey);
    const items = _allSkisData.filter(item => {
        const u = item.targetUnit || '-';
        const l = item.targetLevel || '-';
        const j = item.targetJabatan || '-';
        return `${u}||${l}||${j}` === key;
    });

    if (!items.length) return;

    const modal = document.getElementById('modal-detail-ski');
    const title = document.getElementById('modal-ski-title');
    const subtitle = document.getElementById('modal-ski-subtitle');
    const body = document.getElementById('modal-ski-body');

    if (!modal || !body) return;

    const cardEl = modal.querySelector('.card');
    if (cardEl) {
        cardEl.style.maxWidth = '1100px';
    }

    const totalBobotGroup = items.reduce((sum, item) => {
        let b = parseFloat(item.bobot) || 0;
        return sum + ((b <= 1 && b > 0) ? b * 100 : b);
    }, 0);
    const roundedBobot = Math.round(totalBobotGroup * 10) / 10;
    const isComplete = Math.round(roundedBobot) >= 100;

    const first = items[0];
    if (title) title.innerHTML = `<i class="fas fa-eye text-primary"></i> Detail Template SKI: ${first.targetJabatan || '-'}`;
    if (subtitle) subtitle.innerHTML = `Unit: <strong>${first.targetUnit || '-'}</strong> | Level: <strong>${first.targetLevel || '-'}</strong> | Total: <strong>${items.length} Target</strong> | Status Bobot: <span style="color:${isComplete ? '#16a34a' : '#ea580c'}; font-weight:700;">${roundedBobot}% ${isComplete ? '(Lengkap)' : '(Draf)'}</span>`;

    body.innerHTML = `
        <div class="table-responsive" style="margin-bottom:16px;">
            <table class="table table-bordered align-middle" style="font-size:0.82rem; min-width:850px;">
                <thead style="background:#1e293b; color:white;">
                    <tr>
                        <th style="width:35px; text-align:center; background:#1e293b; color:white;">No</th>
                        <th style="width:140px; background:#1e293b; color:white;">KPI Departemen</th>
                        <th style="min-width:170px; background:#1e293b; color:white;">Sasaran Kerja (SKI)</th>
                        <th style="width:120px; background:#1e293b; color:white;">Target Detail</th>
                        <th style="width:65px; text-align:center; background:#1e293b; color:white;">Bobot</th>
                        <th style="min-width:220px; background:#1e293b; color:white;">Skala Penilaian (1 s.d 5)</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map((item, idx) => {
                        let rawB = parseFloat(item.bobot) || 0;
                        let displayB = (rawB <= 1 && rawB > 0) ? Math.round(rawB * 100 * 100) / 100 : rawB;
                        return `
                            <tr>
                                <td style="text-align:center; font-weight:600;">${idx + 1}</td>
                                <td>${item.kpiDepartemen || '-'}</td>
                                <td><strong style="color:#1e293b;">${item.ski || '-'}</strong></td>
                                <td>${item.targetDetail || '-'}</td>
                                <td style="text-align:center; font-weight:700; color:#16a34a;">${displayB}%</td>
                                <td style="font-size:0.78rem; line-height:1.5;">
                                    <div><strong>1:</strong> ${item.kriteria1 || '-'}</div>
                                    <div><strong>2:</strong> ${item.kriteria2 || '-'}</div>
                                    <div><strong>3:</strong> ${item.kriteria3 || '-'}</div>
                                    <div><strong>4:</strong> ${item.kriteria4 || '-'}</div>
                                    <div><strong>5:</strong> ${item.kriteria5 || '-'}</div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
                <tfoot style="background:#f8fafc; font-weight:700; border-top:2px solid #cbd5e1;">
                    <tr>
                        <td colspan="4" style="text-align:right; padding:10px 12px; color:#334155; font-size:0.88rem;">Total Persentase Bobot SKI:</td>
                        <td style="text-align:center; padding:10px 12px; color:${isComplete ? '#16a34a' : '#ea580c'}; font-weight:800; font-size:1.05rem; background:${isComplete ? '#dcfce7' : '#fef3c7'};">${roundedBobot}%</td>
                        <td style="padding:10px 12px; color:${isComplete ? '#16a34a' : '#ea580c'}; font-size:0.82rem;">${isComplete ? '<i class="fas fa-check-circle"></i> Lengkap 100%' : '<i class="fas fa-clock"></i> Status Draf (' + roundedBobot + '%)'}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-top:16px; border-top:2px solid #e2e8f0; padding-top:14px; background:#f8fafc; padding:12px 16px; border-radius:8px;">
            <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-weight:700; color:#334155; font-size:0.9rem;">Total Persentase Bobot SKI:</span>
                <span style="font-weight:800; font-size:1.05rem; color:${isComplete ? '#16a34a' : '#b45309'}; background:${isComplete ? '#dcfce7' : '#fef3c7'}; padding:4px 12px; border-radius:8px; border:1px solid ${isComplete ? '#86efac' : '#fde68a'};">
                    ${roundedBobot}% ${isComplete ? '(Lengkap)' : '(Draf)'}
                </span>
            </div>
            <button class="btn-secondary" onclick="document.getElementById('modal-detail-ski').style.display='none'">Tutup</button>
        </div>
    `;

    modal.style.display = 'flex';
};

window.saveGroupSkiEdit = async (encodedKey) => {
    const btnSimpan = document.querySelector('#modal-detail-ski .btn-primary');
    if (btnSimpan && btnSimpan.disabled) return;

    let origText = '';
    if (btnSimpan) {
        origText = btnSimpan.innerHTML;
        btnSimpan.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
        btnSimpan.disabled = true;
    }

    const resetBtn = () => {
        if (btnSimpan) {
            btnSimpan.innerHTML = origText;
            btnSimpan.disabled = false;
        }
    };

    const key = decodeURIComponent(encodedKey);
    const parts = key.split('||');
    const unit = parts[0];
    const level = parts[1];
    const jabatan = parts[2];

    const tbodyModal = document.getElementById('tbody-modal-edit-rows');
    if (!tbodyModal) {
        resetBtn();
        return;
    }

    const rows = [...tbodyModal.querySelectorAll('.ski-edit-card, tr')];
    if (!rows.length) {
        resetBtn();
        return showToast('Tidak ada baris SKI untuk disimpan.', 'warning');
    }

    const totalBobot = rows.reduce((sum, r) => {
        const b = parseFloat(r.querySelector('.edit-bobot')?.value || 0);
        return sum + b;
    }, 0);

    if (Math.round(totalBobot) > 100) {
        resetBtn();
        return showToast(`Total Bobot tidak boleh lebih dari 100%. Saat ini: ${Math.round(totalBobot * 10) / 10}%`, 'error');
    }

    // Validasi kelengkapan SELURUH kolom pada setiap baris
    for (let idx = 0; idx < rows.length; idx++) {
        const r = rows[idx];
        const kpi = r.querySelector('.edit-kpi')?.value.trim();
        const ski = r.querySelector('.edit-ski')?.value.trim();
        const target = r.querySelector('.edit-target')?.value.trim();
        const k1 = r.querySelector('.edit-k1')?.value.trim();
        const k2 = r.querySelector('.edit-k2')?.value.trim();
        const k3 = r.querySelector('.edit-k3')?.value.trim();
        const k4 = r.querySelector('.edit-k4')?.value.trim();
        const k5 = r.querySelector('.edit-k5')?.value.trim();
        const bobot = parseFloat(r.querySelector('.edit-bobot')?.value || 0);

        if (!kpi || !ski || !target || !k1 || !k2 || !k3 || !k4 || !k5 || bobot <= 0) {
            resetBtn();
            return showToast(`Harap lengkapi seluruh kolom (KPI, SKI, Target, Skala 1-5, dan Bobot > 0%) pada Target SKI #${idx + 1}!`, 'error');
        }
    }

    // Sort rows so existing saved rows (with data-ski-id) are saved FIRST,
    // and newly added rows (without data-ski-id) are saved SECOND.
    const sortedRows = rows.slice().sort((a, b) => {
        const idA = a.getAttribute('data-ski-id') ? 0 : 1;
        const idB = b.getAttribute('data-ski-id') ? 0 : 1;
        return idA - idB;
    });

    const skiList = sortedRows.map(row => {
        const rawBobot = parseFloat(row.querySelector('.edit-bobot')?.value || 0);
        const bobotFraction = rawBobot > 1 ? (rawBobot / 100) : rawBobot;
        return {
            id: row.getAttribute('data-ski-id') || '',
            createdByNIP: currentUser ? currentUser.nip : '',
            targetUnit: unit,
            targetLevel: level,
            targetJabatan: jabatan,
            kpiDepartemen: row.querySelector('.edit-kpi')?.value.trim() || '',
            ski: row.querySelector('.edit-ski')?.value.trim() || '',
            targetDetail: row.querySelector('.edit-target')?.value.trim() || '',
            kriteria1: row.querySelector('.edit-k1')?.value.trim() || '',
            kriteria2: row.querySelector('.edit-k2')?.value.trim() || '',
            kriteria3: row.querySelector('.edit-k3')?.value.trim() || '',
            kriteria4: row.querySelector('.edit-k4')?.value.trim() || '',
            kriteria5: row.querySelector('.edit-k5')?.value.trim() || '',
            bobot: bobotFraction
        };
    }).filter(item => item.ski);

    // Hapus baris yang ditandai hapus dalam modal saat tombol Simpan Perubahan diklik
    if (window._modalPendingDeletedSkiIds && window._modalPendingDeletedSkiIds.length > 0) {
        for (const idToDelete of window._modalPendingDeletedSkiIds) {
            await fetchGasAPI('deleteSKI', { id: idToDelete });
            if (APP_CONFIG.USE_MOCK) {
                _allSkisData = _allSkisData.filter(s => String(s.id) !== String(idToDelete));
            }
        }
        window._modalPendingDeletedSkiIds = [];
    }

    let allSuccess = true;
    let res = await fetchGasAPI('saveBatchSKI', { skiList });

    // Fallback jika Google Apps Script yang terdeploy belum mendukung saveBatchSKI
    if (!res || !res.success) {
        for (const skiData of skiList) {
            const r = await fetchGasAPI('saveSKI', { skiData });
            if (!r || !r.success) allSuccess = false;
        }
    } else if (APP_CONFIG.USE_MOCK) {
        skiList.forEach(skiData => {
            const updatedItem = { ...skiData, id: skiData.id || ('SKI_' + Date.now() + Math.random()) };
            const existingIdx = _allSkisData.findIndex(s => String(s.id) === String(skiData.id));
            if (existingIdx >= 0) {
                _allSkisData[existingIdx] = updatedItem;
            } else {
                _allSkisData.push(updatedItem);
            }
        });
    }

    if (btnSimpan) {
        btnSimpan.innerHTML = origText;
        btnSimpan.disabled = false;
    }

    // Menutup modal secara otomatis setelah simpan selesai
    const modal = document.getElementById('modal-detail-ski');
    if (modal) {
        modal.style.display = 'none';
    }

    const roundedB = Math.round(totalBobot * 10) / 10;
    if (allSuccess) {
        if (roundedB >= 100) {
            showToast('Template SKI (100% Lengkap) berhasil disimpan!', 'success');
        } else {
            showToast(`Draf Template SKI berhasil disimpan! (Total Bobot: ${roundedB}%)`, 'success');
        }
    } else {
        showToast(`Draf Template SKI telah disimpan. (Total Bobot: ${roundedB}%)`, 'success');
    }

    _isSkisDataLoaded = false;
    initDaftarSki(true);
};

window.showCustomConfirm = (message, title = 'Konfirmasi Hapus', actionText = 'Ya, Hapus') => {
    return new Promise((resolve) => {
        const modal = document.getElementById('modal-confirm-delete');
        const txt = document.getElementById('modal-confirm-text');
        const btnCancel = document.getElementById('btn-modal-cancel');
        const btnAction = document.getElementById('btn-modal-action');
        if (!modal) {
            resolve(confirm(message.replace(/<[^>]*>?/gm, '')));
            return;
        }

        if (txt) txt.innerHTML = message;
        const titleEl = modal.querySelector('h3');
        if (titleEl) titleEl.innerText = title;
        if (btnAction) btnAction.innerHTML = `<i class="fas fa-trash-alt" style="margin-right:6px;"></i> ${actionText}`;

        modal.style.display = 'flex';

        const handleCancel = () => {
            modal.style.display = 'none';
            if (btnCancel) btnCancel.onclick = null;
            if (btnAction) btnAction.onclick = null;
            resolve(false);
        };

        const handleAction = () => {
            modal.style.display = 'none';
            if (btnCancel) btnCancel.onclick = null;
            if (btnAction) btnAction.onclick = null;
            resolve(true);
        };

        if (btnCancel) btnCancel.onclick = handleCancel;
        if (btnAction) btnAction.onclick = handleAction;
    });
};

window.deleteGroupSki = async (encodedKey) => {
    const key = decodeURIComponent(encodedKey);
    const items = _allSkisData.filter(item => {
        const u = item.targetUnit || '-';
        const l = item.targetLevel || '-';
        const j = item.targetJabatan || '-';
        return `${u}||${l}||${j}` === key;
    });

    if (!items.length) return;

    if (currentUser.level === 'General Manager' && items[0].targetLevel !== 'Manager') {
        showToast('General Manager hanya dapat menghapus SKI khusus untuk level Manager.', 'warning');
        return;
    }
    if (currentUser.level === 'Manager' && items[0].targetLevel === 'Manager') {
        showToast('Manager tidak dapat menghapus SKI level Manager (dibuat oleh General Manager).', 'warning');
        return;
    }
    if (['Direktur', 'Supervisor', 'Staff', 'Pelaksana'].includes(currentUser.level)) {
        showToast('Level ' + currentUser.level + ' tidak memiliki hak akses untuk menghapus template SKI.', 'warning');
        return;
    }

    const jabatanName = items[0].targetJabatan || 'Jabatan ini';

    const confirmed = await showCustomConfirm(
        `Apakah Anda yakin ingin menghapus seluruh <strong>${items.length} template SKI</strong> untuk <strong>${jabatanName}</strong>?<br><span style="font-size:0.82rem; color:#ef4444; margin-top:8px; display:inline-block;"><i class="fas fa-exclamation-circle"></i> Tindakan ini tidak dapat dibatalkan.</span>`,
        'Konfirmasi Hapus Template',
        'Ya, Hapus'
    );

    if (!confirmed) return;

    showToast('Menghapus template SKI...', 'info');
    let allSuccess = true;
    for (const item of items) {
        const res = await fetchGasAPI('deleteSKI', { id: item.id });
        if (!res || !res.success) allSuccess = false;
    }

    if (allSuccess) {
        showToast(`Template SKI untuk ${jabatanName} berhasil dihapus.`, 'success');
    } else {
        showToast('Sebagian SKI berhasil dihapus.', 'warning');
    }

    const modal = document.getElementById('modal-detail-ski');
    if (modal) modal.style.display = 'none';

    _isSkisDataLoaded = false;
    initDaftarSki(true);
};

window.duplicateGroupSki = async (encodedKey) => {
    // Ensure SKI user data is loaded first
    if (!_skiUserData || _skiUserData.length === 0) {
        if (APP_CONFIG.USE_MOCK) {
            _skiUserData = MOCK_DB.users;
        } else {
            const uList = await loadUsersData();
            _skiUserData = (uList && uList.length > 0) ? uList : (typeof MOCK_DB !== 'undefined' ? MOCK_DB.users : []);
        }
    }

    const key = decodeURIComponent(encodedKey);
    const originItems = _allSkisData.filter(item => {
        const u = item.targetUnit || '-';
        const l = item.targetLevel || '-';
        const j = item.targetJabatan || '-';
        return `${u}||${l}||${j}` === key;
    });

    if (!originItems.length) return;

    if (currentUser.level === 'General Manager' && originItems[0].targetLevel !== 'Manager') {
        showToast('General Manager hanya dapat menduplikat SKI khusus untuk level Manager.', 'warning');
        return;
    }
    if (currentUser.level === 'Manager' && originItems[0].targetLevel === 'Manager') {
        showToast('Manager tidak dapat menduplikat SKI level Manager (dibuat oleh General Manager).', 'warning');
        return;
    }
    if (['Direktur', 'Supervisor', 'Staff', 'Pelaksana'].includes(currentUser.level)) {
        showToast('Level ' + currentUser.level + ' tidak memiliki hak akses untuk menduplikat template SKI.', 'warning');
        return;
    }

    const modal = document.getElementById('modal-duplikat-ski');
    const body = document.getElementById('modal-duplikat-ski-body');
    if (!modal || !body) return;

    const first = originItems[0];
    const totalBobotGroup = originItems.reduce((sum, item) => {
        let b = parseFloat(item.bobot) || 0;
        return sum + ((b <= 1 && b > 0) ? b * 100 : b);
    }, 0);
    const roundedBobot = Math.round(totalBobotGroup * 10) / 10;

    // Dapatkan list Unit yang bisa dipilih
    const isAdmin = ['Super Admin', 'Direktur', 'General Manager'].includes(currentUser.level);
    let allUnits = [...new Set((_skiUserData || []).map(u => u.unit).filter(Boolean))];
    if (!allUnits.length) {
        allUnits = ['SD', 'SMP', 'SMA', 'TK', 'HRD', 'GA', 'FA', 'Yayasan'];
    }

    if (currentUser.level === 'General Manager') {
        const isPendidikan = currentUser.jabatan && currentUser.jabatan.toLowerCase().includes('pendidikan');
        const isOperasional = currentUser.jabatan && currentUser.jabatan.toLowerCase().includes('operasional');
        if (isPendidikan) {
            allUnits = allUnits.filter(u => ['tk', 'sd', 'smp', 'sma'].includes((u || '').toLowerCase().trim()));
            if (!allUnits.length) allUnits = ['TK', 'SD', 'SMP', 'SMA'];
        } else if (isOperasional) {
            allUnits = allUnits.filter(u => ['fa', 'ga', 'hrd'].includes((u || '').toLowerCase().trim()));
            if (!allUnits.length) allUnits = ['FA', 'GA', 'HRD'];
        }
    } else if (!isAdmin) {
        allUnits = [currentUser.unit];
    }

    const levelOrder = ['Pelaksana', 'Staff', 'Tim Leader', 'Supervisor', 'Manager', 'General Manager', 'Direktur'];
    const hiddenLevels = ['super admin', 'superadmin', 'gm', 'general manager', 'direksi', 'direktur'];
    const defaultLevels = ['Pelaksana', 'Staff', 'Tim Leader', 'Supervisor', 'Manager'];

    body.innerHTML = `
        <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:10px; padding:12px 14px; margin-bottom:18px;">
            <div style="font-weight:700; color:#1e40af; font-size:0.88rem; margin-bottom:4px;">
                <i class="fas fa-info-circle"></i> Template Asal yang Disalin:
            </div>
            <div style="font-size:0.83rem; color:#1e3a8a;">
                Jabatan: <strong>${first.targetJabatan}</strong> | Unit: <strong>${first.targetUnit}</strong> | Level: <strong>${first.targetLevel}</strong><br>
                Jumlah Indikator: <strong>${originItems.length} Target SKI</strong> | Total Bobot: <strong>${roundedBobot}%</strong>
            </div>
        </div>

        <div style="font-weight:700; color:#334155; font-size:0.88rem; margin-bottom:12px;">Pilih Target Baru untuk Salinan Template SKI Ini:</div>

        <div class="form-group mb-3">
            <label style="font-weight:700; font-size:0.82rem; color:#475569;">Target Unit Baru <span style="color:#ef4444;">*</span></label>
            <select id="dup-sel-unit" class="form-control" style="font-size:0.88rem;">
                ${allUnits.map(u => `<option value="${u}" ${u === first.targetUnit ? 'selected' : ''}>${u}</option>`).join('')}
            </select>
        </div>

        <div class="form-group mb-3">
            <label style="font-weight:700; font-size:0.82rem; color:#475569;">Target Level Jabatan Baru <span style="color:#ef4444;">*</span></label>
            <select id="dup-sel-level" class="form-control" style="font-size:0.88rem;">
                <option value="">-- Pilih Level --</option>
            </select>
        </div>

        <div class="form-group mb-4">
            <label style="font-weight:700; font-size:0.82rem; color:#475569;">Target Jabatan Baru <span style="color:#ef4444;">*</span></label>
            <select id="dup-sel-jabatan" class="form-control" style="font-size:0.88rem;">
                <option value="">-- Pilih Jabatan --</option>
            </select>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:10px; border-top:1px solid #e2e8f0; padding-top:16px;">
            <button type="button" class="btn-secondary" onclick="document.getElementById('modal-duplikat-ski').style.display='none'">Batal</button>
            <button type="button" class="btn-primary" id="btn-submit-duplikat" style="background:#2563eb;" onclick="confirmDuplicateSki('${encodeURIComponent(key)}')">
                <i class="fas fa-copy"></i> Duplikat & Salin Template
            </button>
        </div>
    `;

    const dupUnit = document.getElementById('dup-sel-unit');
    const dupLevel = document.getElementById('dup-sel-level');
    const dupJabatan = document.getElementById('dup-sel-jabatan');

    const updateDupJabatanDropdown = () => {
        if (!dupJabatan) return;
        const selectedLvl = dupLevel ? dupLevel.value : '';
        const selectedU = dupUnit ? dupUnit.value : '';

        let filteredUsers = _skiUserData || [];
        if (selectedU) filteredUsers = filteredUsers.filter(u => u.unit === selectedU);
        if (selectedLvl) filteredUsers = filteredUsers.filter(u => u.level === selectedLvl);

        let jabatans = [...new Set(filteredUsers.map(u => u.jabatan).filter(Boolean))];
        if (jabatans.length === 0 && selectedLvl) {
            jabatans = [...new Set((_skiUserData || []).filter(u => u.level === selectedLvl).map(u => u.jabatan).filter(Boolean))];
        }

        // Smart fallback jabatans if no specific user jabatan exists for the selected unit & level
        if (jabatans.length === 0 && selectedLvl) {
            if (selectedLvl === 'Manager') {
                jabatans = selectedU ? [`Manager ${selectedU}`, `Kepala ${selectedU}`] : ['Manager IT', 'Manager HRD', 'Kepala Sekolah SD', 'Kepala Sekolah SMP', 'Kepala Sekolah SMA', 'Kepala Sekolah TK', 'Manager Operasional', 'Manager Keuangan'];
            } else if (selectedLvl === 'Supervisor') {
                jabatans = selectedU ? [`Supervisor ${selectedU}`, `Wakasek Kesiswaan ${selectedU}`, `Wakasek Kurikulum ${selectedU}`] : [`Supervisor ${selectedU}`];
            } else if (selectedLvl === 'Staff') {
                jabatans = selectedU ? [`Guru ${selectedU}`, `Staff ${selectedU}`, `Administrasi ${selectedU}`] : [`Staff ${selectedU || ''}`];
            } else if (selectedLvl === 'Tim Leader') {
                jabatans = selectedU ? [`Tim Leader ${selectedU}`, `Koordinator ${selectedU}`] : [`Tim Leader ${selectedU || ''}`];
            } else {
                jabatans = [`${selectedLvl} ${selectedU || ''}`.trim()];
            }
        }

        // Filter out jabatans that ALREADY exist in _allSkisData
        jabatans = jabatans.filter(j => {
            const exists = _allSkisData.some(s => {
                return (s.targetUnit || '').toLowerCase().trim() === (selectedU || '').toLowerCase().trim()
                    && (s.targetLevel || '').toLowerCase().trim() === (selectedLvl || '').toLowerCase().trim()
                    && (s.targetJabatan || '').toLowerCase().trim() === (j || '').toLowerCase().trim();
            });
            return !exists;
        });

        if (jabatans.length === 0 && selectedLvl) {
            dupJabatan.innerHTML = '<option value="">-- Semua Jabatan pada Level ini Sudah Ada Template --</option>';
        } else {
            dupJabatan.innerHTML = '<option value="">-- Pilih Jabatan --</option>' +
                jabatans.map(j => `<option value="${j}">${j}</option>`).join('');
        }
    };

    const updateDupLevelDropdown = () => {
        if (!dupLevel) return;
        const selectedU = dupUnit ? dupUnit.value : '';

        let allowedLevels = [];
        if (currentUser.level === 'General Manager') {
            // General Manager khusus hanya mengelola SKI untuk level Manager
            allowedLevels = ['Manager'];
        } else {
            let filteredUsers = _skiUserData || [];
            if (selectedU) filteredUsers = filteredUsers.filter(u => u.unit === selectedU);

            let levels = [...new Set(filteredUsers.map(u => u.level).filter(Boolean))];
            if (levels.length === 0) {
                levels = [...new Set((_skiUserData || []).map(u => u.level).filter(Boolean))];
            }
            if (levels.length === 0) {
                levels = defaultLevels;
            }

            levels.sort((a, b) => levelOrder.indexOf(a) - levelOrder.indexOf(b));
            allowedLevels = levels.filter(l => !hiddenLevels.includes(l.toLowerCase().trim()));
        }

        dupLevel.innerHTML = '<option value="">-- Pilih Level --</option>' +
            allowedLevels.map(l => `<option value="${l}">${l}</option>`).join('');

        if (allowedLevels.length === 1) {
            dupLevel.value = allowedLevels[0];
        }

        updateDupJabatanDropdown();
    };

    if (dupUnit) dupUnit.onchange = () => updateDupLevelDropdown();
    if (dupLevel) dupLevel.onchange = () => updateDupJabatanDropdown();

    updateDupLevelDropdown();
    modal.style.display = 'flex';
};

window.confirmDuplicateSki = async (encodedKey) => {
    const key = decodeURIComponent(encodedKey);
    const originItems = _allSkisData.filter(item => {
        const u = item.targetUnit || '-';
        const l = item.targetLevel || '-';
        const j = item.targetJabatan || '-';
        return `${u}||${l}||${j}` === key;
    });

    if (!originItems.length) return;

    const dupUnit = document.getElementById('dup-sel-unit');
    const dupLevel = document.getElementById('dup-sel-level');
    const dupJabatan = document.getElementById('dup-sel-jabatan');

    const newUnit = dupUnit ? dupUnit.value.trim() : '';
    const newLevel = dupLevel ? dupLevel.value.trim() : '';
    const newJabatan = dupJabatan ? dupJabatan.value.trim() : '';

    if (!newUnit) return showToast('Pilih Target Unit Baru!', 'error');
    if (!newLevel) return showToast('Pilih Target Level Jabatan Baru!', 'error');
    if (!newJabatan) return showToast('Pilih Target Jabatan Baru!', 'error');

    // Cek apakah kombinasi baru sudah ada
    const alreadyExists = _allSkisData.some(s => {
        return (s.targetUnit || '').toLowerCase().trim() === newUnit.toLowerCase()
            && (s.targetLevel || '').toLowerCase().trim() === newLevel.toLowerCase()
            && (s.targetJabatan || '').toLowerCase().trim() === newJabatan.toLowerCase();
    });

    if (alreadyExists) {
        return showToast(`Template SKI untuk Jabatan "${newJabatan}" sudah ada di sistem!`, 'error');
    }

    const btnSubmit = document.getElementById('btn-submit-duplikat');
    let origText = '';
    if (btnSubmit) {
        origText = btnSubmit.innerHTML;
        btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menduplikat...';
        btnSubmit.disabled = true;
    }

    // Salin items ke target baru
    const duplicatedSkiList = originItems.map(item => {
        let b = parseFloat(item.bobot) || 0;
        let bobotFraction = (b > 1) ? (b / 100) : b;
        return {
            createdByNIP: currentUser ? currentUser.nip : '',
            targetUnit: newUnit,
            targetLevel: newLevel,
            targetJabatan: newJabatan,
            kpiDepartemen: item.kpiDepartemen || '',
            ski: item.ski || '',
            targetDetail: item.targetDetail || '',
            kriteria1: item.kriteria1 || '',
            kriteria2: item.kriteria2 || '',
            kriteria3: item.kriteria3 || '',
            kriteria4: item.kriteria4 || '',
            kriteria5: item.kriteria5 || '',
            bobot: bobotFraction
        };
    });

    let res = await fetchGasAPI('saveBatchSKI', { skiList: duplicatedSkiList });

    if (!res || !res.success) {
        for (const skiData of duplicatedSkiList) {
            await fetchGasAPI('saveSKI', { skiData });
        }
    } else if (APP_CONFIG.USE_MOCK) {
        duplicatedSkiList.forEach(skiData => {
            _allSkisData.push({
                ...skiData,
                id: 'SKI_DUP_' + Date.now() + Math.random()
            });
        });
    }

    if (btnSubmit) {
        btnSubmit.innerHTML = origText;
        btnSubmit.disabled = false;
    }

    // Tutup modal duplikat
    const modal = document.getElementById('modal-duplikat-ski');
    if (modal) modal.style.display = 'none';

    _isSkisDataLoaded = false;
    await initDaftarSki(true);

    showToast(`🎉 Template SKI berhasil diduplikat untuk ${newJabatan}! Membuka editor...`, 'success');

    // Otomatis buka modal edit untuk template yang baru diduplikat agar user bisa langsung menyesuaikan
    const newGroupKey = encodeURIComponent(`${newUnit}||${newLevel}||${newJabatan}`);
    setTimeout(() => {
        editGroupSki(newGroupKey);
    }, 300);
};

// ========================================================
// --- CSV PARSER & MANAGEMENT UNTUK USER & SKI (SUPABASE) ---
// ========================================================

function parseCSVText(csvText) {
    const rows = [];
    let currentRow = [];
    let currentCell = '';
    let inQuotes = false;

    for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        const nextChar = csvText[i + 1];

        if (char === '"') {
            if (inQuotes) {
                if (nextChar === '"') {
                    currentCell += '"';
                    i++;
                } else {
                    inQuotes = false;
                }
            } else {
                if (currentCell.length === 0) {
                    inQuotes = true;
                } else {
                    currentCell += '"';
                }
            }
        } else if ((char === ',' || char === ';' || char === '\t') && !inQuotes) {
            currentRow.push(currentCell.trim());
            currentCell = '';
        } else if ((char === '\r' || char === '\n') && !inQuotes) {
            if (char === '\r' && nextChar === '\n') i++;
            currentRow.push(currentCell.trim());
            if (currentRow.some(f => f.length > 0)) {
                rows.push(currentRow);
            }
            currentRow = [];
            currentCell = '';
        } else {
            currentCell += char;
        }
    }
    if (currentCell.length > 0 || currentRow.length > 0) {
        currentRow.push(currentCell.trim());
        if (currentRow.some(f => f.length > 0)) {
            rows.push(currentRow);
        }
    }
    return rows;
}

// --- MANAJEMEN USER & IMPORT CSV USER ---
let _allUsersManagementList = [];
let _userCurrentPage = 1;
const _userRowsPerPage = 15;
let _pendingCsvUsersToImport = [];

async function initManajemenUser(forceRefresh = false) {
    const tbody = document.getElementById('tbody-manajemen-user');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="9" class="text-center" style="padding:30px;"><i class="fas fa-spinner fa-spin"></i> Memuat data user...</td></tr>`;

    _allUsersManagementList = await loadUsersData(forceRefresh);

    const unitSelect = document.getElementById('filter-user-unit');
    if (unitSelect) {
        const units = Array.from(new Set(_allUsersManagementList.map(u => u.unit).filter(Boolean))).sort();
        unitSelect.innerHTML = `<option value="">-- Semua Unit --</option>` + units.map(u => `<option value="${u}">${u}</option>`).join('');
    }

    renderManajemenUserTable();

    const btnRefresh = document.getElementById('btn-refresh-user');
    if (btnRefresh) {
        btnRefresh.onclick = async () => {
            _isUsersCacheLoaded = false;
            await initManajemenUser(true);
            showToast("Data user berhasil diperbarui!", "success");
        };
    }

    const btnTambah = document.getElementById('btn-tambah-user');
    if (btnTambah) {
        btnTambah.onclick = () => openUserFormModal();
    }

    const btnUploadCsv = document.getElementById('btn-upload-csv-user');
    if (btnUploadCsv) {
        btnUploadCsv.onclick = () => openCsvUserUploadModal();
    }

    const searchInput = document.getElementById('search-user-text');
    if (searchInput) {
        searchInput.oninput = () => { _userCurrentPage = 1; renderManajemenUserTable(); };
    }

    const filterLevel = document.getElementById('filter-user-level');
    if (filterLevel) {
        filterLevel.onchange = () => { _userCurrentPage = 1; renderManajemenUserTable(); };
    }

    const filterUnit = document.getElementById('filter-user-unit');
    if (filterUnit) {
        filterUnit.onchange = () => { _userCurrentPage = 1; renderManajemenUserTable(); };
    }

    const formUser = document.getElementById('form-user-data');
    if (formUser) {
        formUser.onsubmit = async (e) => {
            e.preventDefault();
            await saveUserDataFromModal();
        };
    }

    const btnCloseUser = document.getElementById('btn-close-modal-user');
    const btnBatalUser = document.getElementById('btn-batal-user-form');
    if (btnCloseUser) btnCloseUser.onclick = closeUserFormModal;
    if (btnBatalUser) btnBatalUser.onclick = closeUserFormModal;

    setupCsvUserModalEvents();
}

function renderManajemenUserTable() {
    const tbody = document.getElementById('tbody-manajemen-user');
    if (!tbody) return;

    const searchText = (document.getElementById('search-user-text')?.value || '').toLowerCase().trim();
    const filterLevel = document.getElementById('filter-user-level')?.value || '';
    const filterUnit = document.getElementById('filter-user-unit')?.value || '';

    let filtered = _allUsersManagementList.filter(u => {
        const nipStr = String(u.nip || '').toLowerCase();
        const namaStr = String(u.nama || '').toLowerCase();
        const jbtStr = String(u.jabatan || '').toLowerCase();
        const unitStr = String(u.unit || '').toLowerCase();

        const matchSearch = !searchText || nipStr.includes(searchText) || namaStr.includes(searchText) || jbtStr.includes(searchText) || unitStr.includes(searchText);
        const matchLevel = !filterLevel || u.level === filterLevel || (filterLevel === 'Staff' && (u.level === 'Staff' || u.level === 'Pelaksana'));
        const matchUnit = !filterUnit || u.unit === filterUnit;

        return matchSearch && matchLevel && matchUnit;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding:30px; color:#94a3b8;"><i class="fas fa-users-slash fa-2x mb-2 display-block"></i><br>Tidak ada data user yang sesuai.</td></tr>`;
        renderUserPagination(0);
        return;
    }

    const totalPages = Math.ceil(filtered.length / _userRowsPerPage);
    if (_userCurrentPage > totalPages) _userCurrentPage = totalPages;

    const startIdx = (_userCurrentPage - 1) * _userRowsPerPage;
    const pagedUsers = filtered.slice(startIdx, startIdx + _userRowsPerPage);

    tbody.innerHTML = pagedUsers.map((u, idx) => {
        const no = startIdx + idx + 1;
        const isSuperAdminUser = u.level === 'Super Admin' || u.nip === '1001';
        const levelBadgeClass = u.level === 'Super Admin' ? 'badge-danger'
            : u.level === 'Direktur' ? 'badge-primary'
            : u.level === 'General Manager' ? 'badge-warning'
            : u.level === 'Manager' ? 'badge-info'
            : 'badge-secondary';

        let atasanHtml = '<span style="color:#94a3b8;">-</span>';
        if (u.atasan1 || u.atasan2) {
            let parts = [];
            if (u.atasan1) parts.push(`<div style="font-size:0.75rem; font-family:monospace;"><span style="color:#64748b; font-weight:600;">A1:</span> ${u.atasan1}</div>`);
            if (u.atasan2) parts.push(`<div style="font-size:0.75rem; font-family:monospace;"><span style="color:#64748b; font-weight:600;">A2:</span> ${u.atasan2}</div>`);
            atasanHtml = parts.join('');
        }

        return `
            <tr>
                <td style="text-align:center; font-weight:600; vertical-align:middle;">${no}</td>
                <td style="vertical-align:middle;" class="cell-wrap">
                    <div style="font-weight:700; color:#0f172a; font-size:0.84rem;">${u.nama}</div>
                    <div style="font-size:0.73rem; color:#64748b; font-family:monospace; margin-top:1px;">NIP: ${u.nip}</div>
                </td>
                <td style="white-space:nowrap; vertical-align:middle;"><span class="badge ${levelBadgeClass}">${u.level}</span></td>
                <td style="vertical-align:middle;" class="cell-wrap">
                    <div style="font-weight:600; color:#1e293b;">${u.jabatan}</div>
                    <div style="font-size:0.73rem; color:#0369a1; margin-top:1px;"><i class="fas fa-building" style="font-size:0.7rem;"></i> ${u.unit}</div>
                </td>
                <td style="vertical-align:middle; white-space:nowrap;">${atasanHtml}</td>
                <td style="text-align:center; white-space:nowrap; vertical-align:middle;">
                    <button class="btn-sm btn-secondary" onclick="editUserByNip('${u.nip}')" title="Edit User" style="padding:4px 8px; margin-right:2px; font-size:0.75rem;">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${!isSuperAdminUser ? `
                    <button class="btn-sm btn-danger" onclick="deleteUserByNip('${u.nip}')" title="Hapus User" style="padding:4px 8px; background:#ef4444; color:white; border:none; border-radius:6px; cursor:pointer; font-size:0.75rem;">
                        <i class="fas fa-trash"></i>
                    </button>
                    ` : ''}
                </td>
            </tr>
        `;
    }).join('');

    renderUserPagination(filtered.length);
}

function renderUserPagination(totalItems) {
    const container = document.getElementById('user-pagination-container');
    if (!container) return;

    if (totalItems === 0) {
        container.innerHTML = '';
        return;
    }

    const totalPages = Math.ceil(totalItems / _userRowsPerPage);
    const startItem = (_userCurrentPage - 1) * _userRowsPerPage + 1;
    const endItem = Math.min(_userCurrentPage * _userRowsPerPage, totalItems);

    let pageButtons = '';
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= _userCurrentPage - 1 && i <= _userCurrentPage + 1)) {
            pageButtons += `<button class="btn-sm ${i === _userCurrentPage ? 'btn-primary' : 'btn-secondary'}" style="padding:4px 10px; font-size:0.8rem;" onclick="changeUserPage(${i})">${i}</button>`;
        } else if (i === _userCurrentPage - 2 || i === _userCurrentPage + 2) {
            pageButtons += `<span style="padding:0 4px;">...</span>`;
        }
    }

    container.innerHTML = `
        <div>Menampilkan ${startItem} - ${endItem} dari <strong>${totalItems}</strong> User</div>
        <div style="display:flex; gap:6px; align-items:center;">
            <button class="btn-sm btn-secondary" style="padding:4px 10px; font-size:0.8rem;" ${_userCurrentPage === 1 ? 'disabled' : ''} onclick="changeUserPage(${_userCurrentPage - 1})">Prev</button>
            ${pageButtons}
            <button class="btn-sm btn-secondary" style="padding:4px 10px; font-size:0.8rem;" ${_userCurrentPage === totalPages ? 'disabled' : ''} onclick="changeUserPage(${_userCurrentPage + 1})">Next</button>
        </div>
    `;
}

function changeUserPage(page) {
    _userCurrentPage = page;
    renderManajemenUserTable();
}

function openUserFormModal(userData = null) {
    const modal = document.getElementById('modal-user-form');
    const title = document.getElementById('modal-user-title');
    if (!modal) return;

    if (userData) {
        title.innerHTML = `<i class="fas fa-user-edit"></i> Edit Data User: ${userData.nama}`;
        document.getElementById('user-form-id').value = userData.nip;
        document.getElementById('user-input-nip').value = userData.nip;
        document.getElementById('user-input-nip').readOnly = true;
        document.getElementById('user-input-password').value = userData.password || '';
        document.getElementById('user-input-nama').value = userData.nama || '';
        document.getElementById('user-input-level').value = userData.level || 'Staff';
        document.getElementById('user-input-jabatan').value = userData.jabatan || '';
        document.getElementById('user-input-unit').value = userData.unit || '';
        document.getElementById('user-input-atasan1').value = userData.atasan1 || '';
        document.getElementById('user-input-atasan2').value = userData.atasan2 || '';
    } else {
        title.innerHTML = `<i class="fas fa-user-plus"></i> Tambah User Baru`;
        document.getElementById('form-user-data').reset();
        document.getElementById('user-form-id').value = '';
        document.getElementById('user-input-nip').readOnly = false;
    }

    modal.style.display = 'flex';
}

function closeUserFormModal() {
    const modal = document.getElementById('modal-user-form');
    if (modal) modal.style.display = 'none';
}

function editUserByNip(nip) {
    const user = _allUsersManagementList.find(u => String(u.nip) === String(nip));
    if (user) openUserFormModal(user);
}

async function deleteUserByNip(nip) {
    const user = _allUsersManagementList.find(u => String(u.nip) === String(nip));
    if (user && (user.level === 'Super Admin' || user.nip === '1001')) {
        showToast("User dengan level Super Admin tidak dapat dihapus demi keamanan sistem.", "warning");
        return;
    }

    if (!confirm(`Apakah Anda yakin ingin menghapus user NIP ${nip}?`)) return;

    const res = await fetchSupabaseAPI('deleteUser', { nip });
    if (res && res.success) {
        showToast(`User NIP ${nip} berhasil dihapus!`, 'success');
        _isUsersCacheLoaded = false;
        await initManajemenUser(true);
    } else {
        showToast(res ? res.message : "Gagal menghapus user", 'danger');
    }
}

async function saveUserDataFromModal() {
    const nip = document.getElementById('user-input-nip').value.trim();
    const password = document.getElementById('user-input-password').value.trim() || nip;
    const nama = document.getElementById('user-input-nama').value.trim();
    const level = document.getElementById('user-input-level').value;
    const jabatan = document.getElementById('user-input-jabatan').value.trim();
    const unit = document.getElementById('user-input-unit').value.trim();
    const atasan1 = document.getElementById('user-input-atasan1').value.trim();
    const atasan2 = document.getElementById('user-input-atasan2').value.trim();

    const userData = { nip, password, nama, level, jabatan, unit, atasan1, atasan2 };

    const btnSimpan = document.getElementById('btn-simpan-user-form');
    if (btnSimpan) {
        btnSimpan.disabled = true;
        btnSimpan.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Menyimpan...`;
    }

    const res = await fetchSupabaseAPI('saveUser', { userData });

    if (btnSimpan) {
        btnSimpan.disabled = false;
        btnSimpan.innerHTML = `<i class="fas fa-save"></i> Simpan User`;
    }

    if (res && res.success) {
        showToast(`User ${nama} (NIP: ${nip}) berhasil disimpan!`, 'success');
        closeUserFormModal();
        _isUsersCacheLoaded = false;
        await initManajemenUser(true);
    } else {
        showToast(res ? res.message : "Gagal menyimpan user", 'danger');
    }
}

// --- CSV USER UPLOAD LOGIC ---
function openCsvUserUploadModal() {
    const modal = document.getElementById('modal-upload-csv-user');
    if (!modal) return;
    document.getElementById('file-input-csv-user').value = '';
    const preview = document.getElementById('csv-user-preview-area');
    if (preview) { preview.style.display = 'none'; preview.innerHTML = ''; }
    const btnProses = document.getElementById('btn-proses-csv-user');
    if (btnProses) btnProses.disabled = true;
    _pendingCsvUsersToImport = [];
    modal.style.display = 'flex';
}

function closeCsvUserUploadModal() {
    const modal = document.getElementById('modal-upload-csv-user');
    if (modal) modal.style.display = 'none';
}

function setupCsvUserModalEvents() {
    const fileInput = document.getElementById('file-input-csv-user');
    const previewArea = document.getElementById('csv-user-preview-area');
    const btnProses = document.getElementById('btn-proses-csv-user');
    const btnClose = document.getElementById('btn-close-modal-csv-user');
    const btnBatal = document.getElementById('btn-batal-csv-user');

    if (btnClose) btnClose.onclick = closeCsvUserUploadModal;
    if (btnBatal) btnBatal.onclick = closeCsvUserUploadModal;

    if (fileInput) {
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (evt) => {
                const text = evt.target.result;
                const rows = parseCSVText(text);
                if (rows.length < 2) {
                    showToast("File CSV kosong atau format tidak sesuai.", "danger");
                    return;
                }

                const rawHeaders = rows[0].map(h => String(h || '').trim());
                const cleanHeaders = rawHeaders.map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
                const getCol = (names) => {
                    return cleanHeaders.findIndex(ch => names.some(n => {
                        const cleanN = n.toLowerCase().replace(/[^a-z0-9]/g, '');
                        return ch === cleanN || ch.includes(cleanN);
                    }));
                };

                const idxNip = cleanHeaders.findIndex(ch => ch === 'nip' || ch === 'nipuser' || ch === 'nippegawai');
                const idxPass = getCol(['password', 'pass']);
                const idxNama = getCol(['nama', 'name']);
                const idxLevel = getCol(['level', 'role']);
                const idxJabatan = getCol(['jabatan', 'position']);
                const idxUnit = getCol(['unit', 'dept', 'departemen']);
                const idxAtasan1 = getCol(['atasannip1', 'atasan1', 'verifikator1', 'penilai1']);
                const idxAtasan2 = getCol(['atasannip2', 'atasan2', 'verifikator2', 'penilai2']);

                const parsedUsers = [];
                for (let i = 1; i < rows.length; i++) {
                    const row = rows[i];
                    const nip = idxNip >= 0 ? String(row[idxNip] || '').trim() : '';
                    if (!nip) continue;

                    const password = idxPass >= 0 ? String(row[idxPass] || '').trim() : nip;
                    const nama = idxNama >= 0 ? String(row[idxNama] || '').trim() : nip;
                    const level = idxLevel >= 0 ? String(row[idxLevel] || '').trim() : 'Staff';
                    const jabatan = idxJabatan >= 0 ? String(row[idxJabatan] || '').trim() : '-';
                    const unit = idxUnit >= 0 ? String(row[idxUnit] || '').trim() : '-';
                    const atasan1 = idxAtasan1 >= 0 ? String(row[idxAtasan1] || '').trim() : '';
                    const atasan2 = idxAtasan2 >= 0 ? String(row[idxAtasan2] || '').trim() : '';

                    parsedUsers.push({ nip, password: password || nip, nama, level, jabatan, unit, atasan1, atasan2 });
                }

                _pendingCsvUsersToImport = parsedUsers;

                if (parsedUsers.length > 0) {
                    if (previewArea) {
                        previewArea.style.display = 'block';
                        previewArea.innerHTML = `
                            <p style="margin:0 0 6px; font-weight:600; color:#10b981;">✓ Terbaca ${parsedUsers.length} data user:</p>
                            <table class="table table-bordered mb-0" style="font-size:0.75rem;">
                                <thead><tr><th>NIP</th><th>Nama</th><th>Level</th><th>Jabatan</th><th>Unit</th><th>Atasan 1</th><th>Atasan 2</th></tr></thead>
                                <tbody>
                                    ${parsedUsers.slice(0, 5).map(u => `<tr><td>${u.nip}</td><td>${u.nama}</td><td>${u.level}</td><td>${u.jabatan}</td><td>${u.unit}</td><td style="font-family:monospace; color:#2563eb;">${u.atasan1 || '-'}</td><td style="font-family:monospace; color:#2563eb;">${u.atasan2 || '-'}</td></tr>`).join('')}
                                    ${parsedUsers.length > 5 ? `<tr><td colspan="7" class="text-center text-muted">...dan ${parsedUsers.length - 5} data lainnya</td></tr>` : ''}
                                </tbody>
                            </table>
                        `;
                    }
                    if (btnProses) btnProses.disabled = false;
                } else {
                    showToast("Gagal membaca kolom NIP dari file CSV.", "danger");
                    if (btnProses) btnProses.disabled = true;
                }
            };
            reader.readAsText(file);
        };
    }

    if (btnProses) {
        btnProses.onclick = async () => {
            if (_pendingCsvUsersToImport.length === 0) return;

            btnProses.disabled = true;
            btnProses.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Mengimpor ke Supabase...`;

            const res = await fetchSupabaseAPI('saveBatchUsers', { userList: _pendingCsvUsersToImport });

            btnProses.disabled = false;
            btnProses.innerHTML = `<i class="fas fa-upload"></i> Impor Sekarang ke Supabase`;

            if (res && res.success) {
                showToast(`🎉 Berhasil mengimpor ${_pendingCsvUsersToImport.length} data user ke Supabase!`, 'success');
                closeCsvUserUploadModal();
                _isUsersCacheLoaded = false;
                await initManajemenUser(true);
            } else {
                showToast(res ? res.message : "Gagal mengimpor data user", 'danger');
            }
        };
    }
}

// --- SKI EXCEL TEMPLATE & UPLOAD LOGIC ---

function downloadTemplateSKIExcel() {
    if (typeof XLSX === 'undefined') {
        showToast("Pustaka XLSX (SheetJS) belum dimuat. Periksa koneksi internet Anda.", "danger");
        return;
    }

    const templateData = [
        {
            "Target Unit": "SD",
            "Target Level": "Staff",
            "Target Jabatan": "Guru SD",
            "KPI Departemen": "Pendidikan dan Pengajaran",
            "SKI": "Pelaksanaan Pembelajaran Efektif dan Terstruktur",
            "Target Detail": "Menyusun RPP, media ajar, dan melaksanakan 100% tatap muka sesuai jadwal",
            "Kriteria 1": "Tatap muka < 70% atau tidak menyusun RPP",
            "Kriteria 2": "Tatap muka 70-79% dengan RPP seadanya",
            "Kriteria 3": "Tatap muka 80-89% dan RPP lengkap",
            "Kriteria 4": "Tatap muka 90-99% dan RPP + media ajar lengkap",
            "Kriteria 5": "Tatap muka 100% lengkap RPP, media ajar, & inovasi pembelajaran",
            "Bobot (%)": 25
        },
        {
            "Target Unit": "SMP",
            "Target Level": "Staff",
            "Target Jabatan": "Guru SMP",
            "KPI Departemen": "Evaluasi & Pelaporan",
            "SKI": "Input Nilai dan Laporan Hasil Belajar Siswa",
            "Target Detail": "Menyelesaikan penilaian harian, PTS, dan PAS tepat waktu",
            "Kriteria 1": "Terlambat > 1 minggu",
            "Kriteria 2": "Terlambat 4-7 hari",
            "Kriteria 3": "Terlambat 1-3 hari",
            "Kriteria 4": "Tepat waktu sesuai deadline",
            "Kriteria 5": "Selesai lebih cepat dari deadline dengan akurasi 100%",
            "Bobot (%)": 25
        },
        {
            "Target Unit": "SMA",
            "Target Level": "Staff",
            "Target Jabatan": "Guru SMA",
            "KPI Departemen": "Pembinaan Karakter Siswa",
            "SKI": "Pelaksanaan Pembiasaan Ibadah dan Karakter Islami",
            "Target Detail": "Mendampingi sholat dhuha, dzuhur berjamaah, dan muraja'ah harian",
            "Kriteria 1": "Kehadiran pendampingan < 70%",
            "Kriteria 2": "Kehadiran pendampingan 70-79%",
            "Kriteria 3": "Kehadiran pendampingan 80-89%",
            "Kriteria 4": "Kehadiran pendampingan 90-99%",
            "Kriteria 5": "Kehadiran 100% & aktif mencatat jurnal pembentukan karakter",
            "Bobot (%)": 25
        },
        {
            "Target Unit": "SMA",
            "Target Level": "Staff",
            "Target Jabatan": "Guru BK SMA & Koordinator Ekstrakurikuler",
            "KPI Departemen": "Pengembangan Diri & Bimbingan",
            "SKI": "Keikutsertaan Pelatihan dan Bimbingan Siswa",
            "Target Detail": "Mengikuti minimal 2 kali pelatihan/seminar per semester",
            "Kriteria 1": "Tidak mengikuti pelatihan",
            "Kriteria 2": "Mengikuti 1 pelatihan tanpa sertifikat",
            "Kriteria 3": "Mengikuti 1 pelatihan bersertifikat",
            "Kriteria 4": "Mengikuti 2 pelatihan bersertifikat",
            "Kriteria 5": "Mengikuti > 2 pelatihan & mengimbaskan materi ke sesama guru",
            "Bobot (%)": 25
        }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);

    // Set column widths for comfortable reading
    worksheet['!cols'] = [
        { wch: 18 }, // Target Unit
        { wch: 15 }, // Target Level
        { wch: 20 }, // Target Jabatan
        { wch: 25 }, // KPI Departemen
        { wch: 35 }, // SKI
        { wch: 45 }, // Target Detail
        { wch: 35 }, // Kriteria 1
        { wch: 35 }, // Kriteria 2
        { wch: 35 }, // Kriteria 3
        { wch: 35 }, // Kriteria 4
        { wch: 35 }, // Kriteria 5
        { wch: 12 }  // Bobot (%)
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template Master SKI");

    XLSX.writeFile(workbook, "Template_Master_SKI_AlSyukro.xlsx");
    showToast("Template Excel Master SKI berhasil di-download!", "success");
}

let _pendingCsvSkisToImport = [];

function setupCsvSkiModalEvents() {
    const btnDownloadTemplate = document.getElementById('btn-download-template-ski');
    const btnUpload = document.getElementById('btn-upload-csv-ski');
    const modal = document.getElementById('modal-upload-csv-ski');
    const btnClose = document.getElementById('btn-close-modal-csv-ski');
    const btnBatal = document.getElementById('btn-batal-csv-ski');
    const fileInput = document.getElementById('file-input-csv-ski');
    const previewArea = document.getElementById('csv-ski-preview-area');
    const btnProses = document.getElementById('btn-proses-csv-ski');

    if (btnDownloadTemplate) {
        btnDownloadTemplate.onclick = (e) => {
            e.preventDefault();
            downloadTemplateSKIExcel();
        };
    }

    if (btnUpload) {
        btnUpload.onclick = () => {
            if (modal) {
                if (fileInput) fileInput.value = '';
                if (previewArea) { previewArea.style.display = 'none'; previewArea.innerHTML = ''; }
                if (btnProses) btnProses.disabled = true;
                _pendingCsvSkisToImport = [];
                modal.style.display = 'flex';
            }
        };
    }

    if (btnClose) btnClose.onclick = () => { if (modal) modal.style.display = 'none'; };
    if (btnBatal) btnBatal.onclick = () => { if (modal) modal.style.display = 'none'; };

    if (fileInput) {
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const filename = file.name.toLowerCase();
            const isExcel = filename.endsWith('.xlsx') || filename.endsWith('.xls');

            const parseRowsData = (rows) => {
                if (!rows || rows.length < 2) {
                    showToast("File kosong atau format data tidak sesuai.", "danger");
                    return;
                }

                const cleanHeader = h => String(h || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                const normalizedHeaders = rows[0].map(cleanHeader);

                const getColExact = (...candidates) => {
                    for (const cand of candidates) {
                        const cleanCand = cleanHeader(cand);
                        const idx = normalizedHeaders.findIndex(h => h === cleanCand);
                        if (idx !== -1) return idx;
                    }
                    for (const cand of candidates) {
                        const cleanCand = cleanHeader(cand);
                        if (cleanCand.length > 3) {
                            const idx = normalizedHeaders.findIndex(h => h.includes(cleanCand));
                            if (idx !== -1) return idx;
                        }
                    }
                    return -1;
                };

                const idxUnit = getColExact('targetunit', 'unit');
                const idxLevel = getColExact('targetlevel', 'leveljabatan', 'level');
                const idxJabatan = getColExact('targetjabatan', 'jabatan');
                const idxKpi = getColExact('kpidepartemen', 'kpi');
                const idxSki = getColExact('ski', 'sasarankerja', 'sasaran');
                const idxDetail = getColExact('targetdetail', 'detail');
                const idxK1 = getColExact('kriteria1', 'k1');
                const idxK2 = getColExact('kriteria2', 'k2');
                const idxK3 = getColExact('kriteria3', 'k3');
                const idxK4 = getColExact('kriteria4', 'k4');
                const idxK5 = getColExact('kriteria5', 'k5');
                const idxBobot = getColExact('bobot', 'weight', 'bobot%');

                const parsedSkis = [];
                for (let i = 1; i < rows.length; i++) {
                    const row = rows[i];
                    if (!row || row.length === 0) continue;

                    const skiText = idxSki >= 0 ? String(row[idxSki] || '').trim() : '';
                    if (!skiText) continue;

                    let rawBobot = idxBobot >= 0 ? String(row[idxBobot] !== undefined ? row[idxBobot] : '0').replace('%', '').replace(',', '.').trim() : '0';
                    let bobotVal = parseFloat(rawBobot);
                    if (isNaN(bobotVal)) bobotVal = 0;
                    if (bobotVal > 0 && bobotVal <= 1) {
                        bobotVal = Math.round(bobotVal * 100 * 100) / 100;
                    } else {
                        bobotVal = Math.round(bobotVal * 100) / 100;
                    }

                    parsedSkis.push({
                        createdByNIP: currentUser ? currentUser.nip : '1001',
                        targetUnit: idxUnit >= 0 ? String(row[idxUnit] || '').trim() : '',
                        targetLevel: idxLevel >= 0 ? String(row[idxLevel] || '').trim() : '',
                        targetJabatan: idxJabatan >= 0 ? String(row[idxJabatan] || '').trim() : '',
                        kpiDepartemen: idxKpi >= 0 ? String(row[idxKpi] || '').trim() : '',
                        ski: skiText,
                        targetDetail: idxDetail >= 0 ? String(row[idxDetail] || '').trim() : '',
                        kriteria1: idxK1 >= 0 ? String(row[idxK1] || '').trim() : '',
                        kriteria2: idxK2 >= 0 ? String(row[idxK2] || '').trim() : '',
                        kriteria3: idxK3 >= 0 ? String(row[idxK3] || '').trim() : '',
                        kriteria4: idxK4 >= 0 ? String(row[idxK4] || '').trim() : '',
                        kriteria5: idxK5 >= 0 ? String(row[idxK5] || '').trim() : '',
                        bobot: bobotVal
                    });
                }

                _pendingCsvSkisToImport = parsedSkis;

                if (parsedSkis.length > 0) {
                    if (previewArea) {
                        previewArea.style.display = 'block';
                        previewArea.innerHTML = `
                            <p style="margin:0 0 6px; font-weight:600; color:#10b981;">✓ Terbaca ${parsedSkis.length} item SKI dari file (${file.name}):</p>
                            <table class="table table-bordered mb-0" style="font-size:0.75rem;">
                                <thead><tr><th>Unit</th><th>Jabatan</th><th>SKI</th><th>Bobot</th></tr></thead>
                                <tbody>
                                    ${parsedSkis.slice(0, 5).map(s => `<tr><td>${s.targetUnit || '-'}</td><td>${s.targetJabatan || '-'}</td><td>${s.ski}</td><td>${s.bobot}%</td></tr>`).join('')}
                                    ${parsedSkis.length > 5 ? `<tr><td colspan="4" class="text-center text-muted">...dan ${parsedSkis.length - 5} data SKI lainnya</td></tr>` : ''}
                                </tbody>
                            </table>
                        `;
                    }
                    if (btnProses) btnProses.disabled = false;
                } else {
                    showToast("Gagal membaca data SKI dari file. Pastikan kolom SKI diisi.", "danger");
                    if (btnProses) btnProses.disabled = true;
                }
            };

            const reader = new FileReader();

            if (isExcel || typeof XLSX !== 'undefined') {
                reader.onload = (evt) => {
                    try {
                        let rows = [];
                        if (typeof XLSX !== 'undefined') {
                            const data = new Uint8Array(evt.target.result);
                            const workbook = XLSX.read(data, { type: 'array' });
                            const firstSheetName = workbook.SheetNames[0];
                            const worksheet = workbook.Sheets[firstSheetName];
                            rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
                        } else {
                            const text = new TextDecoder("utf-8").decode(evt.target.result);
                            rows = parseCSVText(text);
                        }
                        parseRowsData(rows);
                    } catch (err) {
                        console.error("Excel Read Error:", err);
                        showToast("Gagal membaca file Excel. Pastikan format file valid.", "danger");
                    }
                };
                reader.readAsArrayBuffer(file);
            } else {
                reader.onload = (evt) => {
                    const text = evt.target.result;
                    const rows = parseCSVText(text);
                    parseRowsData(rows);
                };
                reader.readAsText(file);
            }
        };
    }

    if (btnProses) {
        btnProses.onclick = async () => {
            if (_pendingCsvSkisToImport.length === 0) return;

            btnProses.disabled = true;
            btnProses.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Mengimpor SKI ke Supabase...`;

            const res = await fetchSupabaseAPI('saveBatchSKI', { skiList: _pendingCsvSkisToImport, clearExisting: false });

            btnProses.disabled = false;
            btnProses.innerHTML = `<i class="fas fa-upload"></i> Impor SKI ke Supabase`;

            if (res && res.success) {
                showToast(`🎉 Berhasil mengimpor ${_pendingCsvSkisToImport.length} data Master SKI ke Supabase!`, 'success');
                if (modal) modal.style.display = 'none';
                _isSkisDataLoaded = false;
                await initDaftarSki(true);
            } else {
                showToast(res ? res.message : "Gagal mengimpor data SKI", 'danger');
            }
        };
    }
}
