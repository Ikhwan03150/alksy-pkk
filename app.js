// app.js

// --- State Management ---
let currentUser = null;
let currentAppPage = 'dashboard';

// --- Menu Configuration ---
const MENU_CONFIG = {
    "Super Admin": [
        { id: "dashboard", icon: "fas fa-home", text: "Dasbor" },
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

// --- API Utility ---
async function fetchGasAPI(action, payload = {}) {
    if (APP_CONFIG.USE_MOCK) {
        return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500)); // Simulasi delay mock
    }

    payload.action = action;
    try {
        const response = await fetch(APP_CONFIG.GAS_URL, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            }
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("API Error:", error);
        return { success: false, message: "Terjadi kesalahan koneksi ke server." };
    }
}

async function doLogin(nip, password) {
    const btn = document.getElementById('btn-login');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    btn.disabled = true;

    if (APP_CONFIG.USE_MOCK) {
        await fetchGasAPI('login');
        const user = MOCK_DB.users.find(u => u.nip === nip && u.password === password);
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

    btn.innerHTML = originalText;
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
    if (APP_CONFIG.USE_MOCK) {
        _allUsersCache = MOCK_DB.users || [];
        _isUsersCacheLoaded = true;
    } else {
        const res = await fetchGasAPI('getUsers');
        if (res && res.success) {
            _allUsersCache = res.data || [];
            _isUsersCacheLoaded = true;
        }
    }
    return _allUsersCache;
}

async function loadPkksData(forceRefresh = false) {
    if (_isPkksCacheLoaded && !forceRefresh) return _allPkksCache;
    if (APP_CONFIG.USE_MOCK) {
        _allPkksCache = MOCK_DB.pkks || [];
        _isPkksCacheLoaded = true;
    } else {
        const res = await fetchGasAPI('getPKKs');
        if (res && res.success) {
            _allPkksCache = res.data || [];
            _isPkksCacheLoaded = true;
        }
    }
    return _allPkksCache;
}

async function loadTahunAjaranData(forceRefresh = false) {
    if (_isTahunCacheLoaded && !forceRefresh) return { active: _activeTahunCache, list: _allTahunCache };
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

// --- Page: Evaluasi Mandiri (PKK Form) ---
let currentKpiItems = [];
async function initEvaluasiMandiri() {
    const isReviewMode = window.reviewTargetPkk != null;
    let targetUser = currentUser;

    if (isReviewMode) {
        targetUser = {
            nip: window.reviewTargetPkk.nip,
            nama: window.reviewTargetPkk.nama,
            level: window.reviewTargetPkk.level || 'Staff',
            unit: window.reviewTargetPkk.unit || '',
            atasanNIP1: window.reviewTargetPkk.atasanNIP1 || '',
            atasanNIP2: window.reviewTargetPkk.atasanNIP2 || '',
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
            }
        }
    }

    // Render Employee Detail Header Card if in Review Mode
    const detailCardEl = document.getElementById('review-employee-detail-card');
    if (detailCardEl) {
        if (isReviewMode) {
            detailCardEl.style.display = 'block';
            detailCardEl.innerHTML = `
                <div class="card glass-card" style="background: linear-gradient(135deg, #036F3E 0%, #024f2c 100%); color: white; border-radius: 16px; padding: 18px 24px; box-shadow: 0 10px 25px rgba(3,111,62,0.25);">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
                        <div style="display: flex; align-items: center; gap: 16px;">
                            <div style="width: 52px; height: 52px; border-radius: 14px; background: rgba(255,255,255,0.18); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0;">
                                <i class="fas fa-user-check"></i>
                            </div>
                            <div>
                                <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.8); font-weight: 600;">Verifikasi PKK Karyawan</div>
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
                            <div style="background: #F77604; color: white; padding: 6px 16px; border-radius: 20px; font-size: 0.82rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(247,118,4,0.35); white-space: nowrap;">
                                <i class="fas fa-clock" style="font-size:0.8rem;"></i> ${window.reviewTargetPkk ? window.reviewTargetPkk.status : 'Menunggu Verifikasi'}
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

        if (!isReviewMode && existingPkk.status !== 'Draft') {
            disableFormPkk();
        }
    }

    const formEl = document.getElementById('form-pkk');
    const btnSubmit = document.getElementById('btn-submit-pkk');
    const btnDraft = document.getElementById('btn-save-draft');

    if (isReviewMode) {
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
            btnSubmit.innerHTML = 'Verifikasi & Simpan <i class="fas fa-check"></i>';
            btnSubmit.className = 'btn-primary';
        }
    } else {
        document.getElementById('section-rekomendasi').style.display = 'none';
        if (btnDraft) btnDraft.style.display = 'inline-block';
        if (btnSubmit) {
            btnSubmit.innerHTML = 'Ajukan Penilaian <i class="fas fa-paper-plane"></i>';
        }
    }

    if (btnSubmit) {
        btnSubmit.onclick = (e) => {
            e.preventDefault();
            
            if (isReviewMode) {
                let nextStatus = 'Selesai';
                const hasAtasan2 = !!(targetUser.atasanNIP2 || targetUser.atasan2);

                if (existingPkk && existingPkk.status === 'Menunggu Verifikasi 1') {
                    nextStatus = hasAtasan2 ? 'Menunggu Verifikasi 2' : 'Selesai';
                } else if (existingPkk && existingPkk.status === 'Menunggu Verifikasi 2') {
                    nextStatus = 'Selesai';
                }

                submitPkk(nextStatus);
            } else {
                submitPkk('Menunggu Verifikasi 1');
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
    tbody.innerHTML = `<tr><td colspan="7" class="text-center"><i class="fas fa-spinner fa-spin"></i> Memuat data verifikasi...</td></tr>`;

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
                
                // Super Admin atau level tinggi tertentu mungkin bisa mem-bypass jika diperlukan,
                // tapi standar rule-nya harus sesuai NIP
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

    tbody.innerHTML = list.map(p => `
        <tr>
            <td>${p.tahunAjaran || '-'}</td>
            <td>${p.nip}</td>
            <td>${p.nama}</td>
            <td>${p.unit}</td>
            <td>${p.finalScore || 0} (${p.finalGrade || '-'})</td>
            <td><span class="status-badge status-pending">${p.status}</span></td>
            <td>
                <button class="btn-primary" style="padding: 5px 10px; font-size:0.8rem;" onclick="reviewPKK('${p.nip}')">Review</button>
            </td>
        </tr>
    `).join('');
}

window.reviewTargetPkk = null;
async function reviewPKK(nip) {
    const res = await fetchGasAPI('getPKKs', { nip: nip });
    if (res && res.success && res.data && res.data.length > 0) {
        window.reviewTargetPkk = res.data[0];
        navigate('evaluasi');
    } else {
        showToast('Gagal memuat data pengajuan.', 'error');
    }
}

// --- Page: Riwayat ---
async function initRiwayat() {
    const tbody = document.getElementById('tbody-riwayat');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="7" class="text-center"><i class="fas fa-spinner fa-spin"></i> Memuat riwayat...</td></tr>`;

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

    tbody.innerHTML = list.map(p => `
        <tr>
            <td>${p.tahunAjaran || '-'}</td>
            <td>${p.nip}</td>
            <td>${p.nama}</td>
            <td>${p.unit}</td>
            <td>${p.finalScore || 0} (${p.finalGrade || '-'})</td>
            <td><span class="status-badge ${p.status === 'Selesai' ? 'status-success' : 'status-pending'}">${p.status}</span></td>
            <td>
                <button class="btn-primary" style="padding: 5px 10px; font-size:0.8rem;" onclick="reviewPKK('${p.nip}')"><i class="fas fa-eye"></i> Lihat</button>
            </td>
        </tr>
    `).join('');
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

    // Filter users by GM scope
    if (currentUser.level === 'General Manager') {
        const isPendidikan = currentUser.jabatan && currentUser.jabatan.toLowerCase().includes('pendidikan');
        const isOperasional = currentUser.jabatan && currentUser.jabatan.toLowerCase().includes('operasional');
        allUsers = allUsers.filter(u => {
            const unit = u.unit ? u.unit.toLowerCase() : '';
            if (isPendidikan) return ['tk', 'sd', 'smp', 'sma'].includes(unit);
            if (isOperasional) return ['fa', 'ga', 'hrd'].includes(unit);
            return true;
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
                <div><span style="color:#64748b; font-weight:600; display:inline-block; width:110px;">Jabatan</span>: ${userInfo.jabatan || pkk.level}</div>
                <div><span style="color:#64748b; font-weight:600; display:inline-block; width:110px;">Unit</span>: ${pkk.unit}</div>
                <div><span style="color:#64748b; font-weight:600; display:inline-block; width:110px;">Level</span>: ${pkk.level}</div>
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
            <div style="font-weight:700; color:white; font-size:0.88rem; padding:6px 12px; background:#10b981; border-radius:4px 4px 0 0; letter-spacing:0.5px;">
                G. PENGESAHAN
            </div>
            <table style="width:100%; border-collapse:collapse; border:1.5px solid #1e293b; text-align:center; font-size:0.82rem;">
                <thead>
                    <tr style="border-bottom:1.5px solid #1e293b; background:#f8fafc; font-weight:700; color:#1e293b;">
                        <th style="padding:8px 4px; border-right:1.5px solid #1e293b; width:20%;">Yang Dinilai</th>
                        <th style="padding:8px 4px; border-right:1.5px solid #1e293b; width:20%;">Penilai</th>
                        <th style="padding:8px 4px; border-right:1.5px solid #1e293b; width:20%;">Atasan Penilai</th>
                        <th style="padding:8px 4px; border-right:1.5px solid #1e293b; width:20%;">Kepala Divisi</th>
                        <th style="padding:8px 4px; width:20%;">HRD</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="height:75px;">
                        <td style="border-right:1.5px solid #1e293b; vertical-align:bottom; padding-bottom:6px; font-weight:600; color:#1e293b;">${pkk.nama}</td>
                        <td style="border-right:1.5px solid #1e293b;"></td>
                        <td style="border-right:1.5px solid #1e293b;"></td>
                        <td style="border-right:1.5px solid #1e293b;"></td>
                        <td></td>
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

        <!-- Print Action Button -->
        <div style="text-align:center; margin-top:24px;" class="no-print">
            <button onclick="window.print()" style="background:#1e293b; color:white; border:none; border-radius:8px; padding:10px 28px; font-size:0.9rem; cursor:pointer; font-family:inherit; font-weight:600; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
                <i class="fas fa-print"></i> Cetak / Save PDF
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
                await fetchGasAPI('changePassword');
                if (currentUser.password === passLama) {
                    currentUser.password = passBaru;
                    localStorage.setItem('pkk_user', JSON.stringify(currentUser));
                    showToast('Password berhasil diubah (Mock)!', 'success');
                    form.reset();
                } else {
                    showToast('Password lama salah!', 'error');
                }
            } else {
                const res = await fetchGasAPI('changePassword', {
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
let currentBobotData = [];
async function initSettings() {
    const form = document.getElementById('form-settings');
    const tbodyUtama = document.querySelector('#table-bobot-utama tbody');
    const tbodyPerilaku = document.querySelector('#table-bobot-perilaku tbody');
    const tbodyManajerial = document.querySelector('#table-bobot-manajerial tbody');

    if (!form) return;

    if (APP_CONFIG.USE_MOCK) {
        tbodyUtama.innerHTML = '<tr><td colspan="7" class="text-center">Mode Mock: Fitur Edit Bobot membutuhkan koneksi ke server.</td></tr>';
        return;
    }

    const res = await fetchGasAPI('getBobot');
    if (res && res.success && res.data.length > 0) {
        currentBobotData = res.data;
        renderBobotSection(res.data, 'Overall', tbodyUtama);
        renderBobotSection(res.data, 'Perilaku', tbodyPerilaku);
        renderBobotSection(res.data, 'Manajerial', tbodyManajerial);
        calculateSettingTotals();

        // Attach input listener to recalculate totals
        form.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', calculateSettingTotals);
        });
    } else {
        tbodyUtama.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Gagal memuat data bobot.</td></tr>';
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Grab updated values
        const inputs = form.querySelectorAll('input[data-row]');
        inputs.forEach(input => {
            const r = parseInt(input.getAttribute('data-row'));
            const c = parseInt(input.getAttribute('data-col'));
            currentBobotData[r][c] = input.value;
        });

        const btn = document.getElementById('btn-save-settings');
        const origText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
        btn.disabled = true;

        const saveRes = await fetchGasAPI('saveBobot', { bobotData: currentBobotData });
        if (saveRes && saveRes.success) {
            showToast('Bobot berhasil disimpan!', 'success');
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
        const res = await fetchGasAPI('getTahunAjaran');
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
                document.getElementById('active-academic-year').innerText = "TA. " + res.active;
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

            const res = await fetchGasAPI('addTahunAjaran', { tahun: val });
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
    const res = await fetchGasAPI('setAktifTahunAjaran', { id: id });
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

    const levelOrder = ['Pelaksana', 'Staff', 'Tim Leader', 'Supervisor', 'Manager', 'General Manager', 'Direktur'];
    const hiddenLevels = ['super admin', 'superadmin', 'gm', 'general manager', 'direksi', 'direktur'];

    const updateJabatanDropdown = () => {
        if (!selJabatan) return;
        const selectedLvl = selLevel ? selLevel.value : '';
        const selectedU = selUnit ? selUnit.value : '';

        let filteredUsers = _skiUserData;
        if (selectedU) {
            filteredUsers = filteredUsers.filter(u => u.unit === selectedU);
        }
        if (selectedLvl) {
            filteredUsers = filteredUsers.filter(u => u.level === selectedLvl);
        }

        let jabatans = [...new Set(filteredUsers.map(u => u.jabatan).filter(Boolean))];

        if (jabatans.length === 0 && selectedLvl) {
            jabatans = [...new Set(_skiUserData.filter(u => u.level === selectedLvl).map(u => u.jabatan).filter(Boolean))];
        }

        if (jabatans.length === 0 && selectedLvl === 'Manager') {
            if (selectedU) {
                jabatans = [`Manager ${selectedU}`, `Kepala ${selectedU}`];
            } else {
                jabatans = ['Manager IT', 'Manager HRD', 'Kepala Sekolah SD', 'Kepala Sekolah SMP', 'Kepala Sekolah SMA', 'Kepala Sekolah TK', 'Manager Operasional', 'Manager Keuangan'];
            }
        }

        const currentVal = selJabatan.value;
        selJabatan.innerHTML = '<option value="">-- Pilih Jabatan --</option>' +
            jabatans.map(j => `<option value="${j}">${j}</option>`).join('');

        if (jabatans.includes(currentVal)) {
            selJabatan.value = currentVal;
        } else {
            selJabatan.value = '';
        }
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
            const rows = tbody.querySelectorAll('.ski-item-card');
            const selectedUnit = selUnit ? selUnit.value : currentUser.unit;
            const selectedLevel = selLevel ? selLevel.value : '';
            const selectedJabatan = document.getElementById('ski-sel-jabatan')?.value || '';

            if (!selectedLevel) return showToast('Pilih Level Jabatan terlebih dahulu!', 'error');
            if (!selectedJabatan) return showToast('Pilih Jabatan terlebih dahulu!', 'error');

            // Hitung total bobot pada form saat ini
            const newTotalBobot = [...rows].reduce((sum, r) => {
                const b = parseFloat(r.querySelector('.ski-bobot-input')?.value || 0);
                return sum + b;
            }, 0);

            // --- Cek apakah kombinasi ini sudah ada & hitung sisa bobot ---
            const checkRes = await fetchGasAPI('getSKIs');
            if (checkRes && checkRes.success && checkRes.data) {
                const existingSkis = checkRes.data.filter(s => {
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
                        return showToast(
                            `Template SKI untuk "${selectedJabatan}" (Unit: ${selectedUnit}) sudah penuh (100%). Gunakan tombol Edit untuk mengubahnya.`,
                            'error'
                        );
                    }

                    const siBobot = 100 - Math.round(existingBobot);
                    if (Math.round(newTotalBobot) > siBobot) {
                        return showToast(
                            `Sisa bobot yang tersedia untuk jabatan ini hanya ${siBobot}%. Isi form dengan total bobot maksimal ${siBobot}%.`,
                            'error'
                        );
                    }
                }
            }

            // Validasi total bobot form saat ini tidak boleh lebih dari 100%
            if (newTotalBobot <= 0) {
                return showToast('Isi minimal 1 baris SKI dengan bobot yang valid!', 'error');
            }
            if (Math.round(newTotalBobot) > 100) {
                return showToast(`Total Bobot form ini melebihi 100%. Saat ini: ${newTotalBobot}%`, 'error');
            }

            const origText = btnSimpan.innerHTML;
            btnSimpan.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
            btnSimpan.disabled = true;

            let allSuccess = true;
            let savedCount = 0;
            for (const row of rows) {
                const rawBobot = parseFloat(row.querySelector('.ski-bobot-input')?.value || 0);
                const bobotFraction = rawBobot > 1 ? (rawBobot / 100) : rawBobot;

                const skiData = {
                    createdByNIP: currentUser.nip,
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
                if (!skiData.ski) continue; // skip baris kosong
                const res = await fetchGasAPI('saveSKI', { skiData });
                if (res && res.success) savedCount++;
                else allSuccess = false;
            }

            btnSimpan.innerHTML = origText;
            btnSimpan.disabled = false;

            if (savedCount > 0 && allSuccess) {
                _isSkisDataLoaded = false;
                showToast('Template SKI berhasil disimpan!', 'success');
                navigate('daftar_ski');
            } else if (savedCount > 0) {
                _isSkisDataLoaded = false;
                showToast('Sebagian SKI berhasil disimpan, sebagian gagal.', 'error');
                navigate('daftar_ski');
            } else {
                showToast('Tidak ada SKI yang disimpan. Pastikan kolom SKI tidak kosong.', 'error');
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
                    <label style="font-weight:700; color:#334155; font-size:0.85rem; margin:0;">Bobot:</label>
                    <input type="number" class="form-control ski-bobot-input" min="0" max="100" value="${initialBobot}" placeholder="0" style="width:70px; text-align:center; font-weight:700; color:#16a34a; font-size:0.95rem; padding:4px 6px;" oninput="updateSkiTotalBobot()">
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
                    <i class="fas fa-bullseye" style="color:#2563eb;"></i> KPI Departemen
                </label>
                <textarea class="form-control ski-kpi-input" style="min-height:75px; font-size:0.85rem; line-height:1.4; resize:vertical;" placeholder="Tuliskan KPI Departemen...">${data.kpiDepartemen || ''}</textarea>
            </div>
            <div>
                <label style="font-weight:700; font-size:0.82rem; color:#475569; display:block; margin-bottom:4px;">
                    <i class="fas fa-tasks" style="color:#059669;"></i> Sasaran Kerja Individu (SKI) <span style="color:#ef4444;">*</span>
                </label>
                <textarea class="form-control ski-ski-input" style="min-height:75px; font-size:0.85rem; line-height:1.4; resize:vertical; font-weight:600;" placeholder="Tuliskan Sasaran Kerja Individu..." required>${data.ski || ''}</textarea>
            </div>
            <div>
                <label style="font-weight:700; font-size:0.82rem; color:#475569; display:block; margin-bottom:4px;">
                    <i class="fas fa-flag" style="color:#d97706;"></i> Target Detail
                </label>
                <textarea class="form-control ski-target-input" style="min-height:75px; font-size:0.85rem; line-height:1.4; resize:vertical;" placeholder="Contoh: 100% selesai tepat waktu...">${data.targetDetail || ''}</textarea>
            </div>
        </div>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px 14px;">
            <label style="font-weight:700; font-size:0.82rem; color:#334155; display:block; margin-bottom:8px;">
                <i class="fas fa-sliders-h" style="color:#4f46e5;"></i> Kriteria Skala Penilaian (1 s.d 5)
            </label>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap:10px;">
                <div>
                    <div style="font-size:0.75rem; font-weight:700; color:#ef4444; margin-bottom:3px; background:#fee2e2; padding:3px 6px; border-radius:4px; text-align:center;">Skala 1 (Sangat Kurang)</div>
                    <textarea class="form-control ski-k1-input" style="min-height:65px; font-size:0.8rem; padding:6px; resize:vertical;" placeholder="Deskripsi skala 1...">${data.kriteria1 || ''}</textarea>
                </div>
                <div>
                    <div style="font-size:0.75rem; font-weight:700; color:#ea580c; margin-bottom:3px; background:#ffedd5; padding:3px 6px; border-radius:4px; text-align:center;">Skala 2 (Kurang)</div>
                    <textarea class="form-control ski-k2-input" style="min-height:65px; font-size:0.8rem; padding:6px; resize:vertical;" placeholder="Deskripsi skala 2...">${data.kriteria2 || ''}</textarea>
                </div>
                <div>
                    <div style="font-size:0.75rem; font-weight:700; color:#ca8a04; margin-bottom:3px; background:#fef9c3; padding:3px 6px; border-radius:4px; text-align:center;">Skala 3 (Cukup)</div>
                    <textarea class="form-control ski-k3-input" style="min-height:65px; font-size:0.8rem; padding:6px; resize:vertical;" placeholder="Deskripsi skala 3...">${data.kriteria3 || ''}</textarea>
                </div>
                <div>
                    <div style="font-size:0.75rem; font-weight:700; color:#2563eb; margin-bottom:3px; background:#dbeafe; padding:3px 6px; border-radius:4px; text-align:center;">Skala 4 (Baik)</div>
                    <textarea class="form-control ski-k4-input" style="min-height:65px; font-size:0.8rem; padding:6px; resize:vertical;" placeholder="Deskripsi skala 4...">${data.kriteria4 || ''}</textarea>
                </div>
                <div>
                    <div style="font-size:0.75rem; font-weight:700; color:#16a34a; margin-bottom:3px; background:#dcfce7; padding:3px 6px; border-radius:4px; text-align:center;">Skala 5 (Sangat Baik)</div>
                    <textarea class="form-control ski-k5-input" style="min-height:65px; font-size:0.8rem; padding:6px; resize:vertical;" placeholder="Deskripsi skala 5...">${data.kriteria5 || ''}</textarea>
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
        if (currentAppPage === 'form_ski') initFormSki();
        if (currentAppPage === 'daftar_ski') initDaftarSki();
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

    if (APP_CONFIG.USE_MOCK) {
        _allSkisData = MOCK_DB.skis.map((s, idx) => ({
            id: s.id || (idx + 1),
            targetUnit: currentUser ? currentUser.unit : 'IT',
            targetLevel: 'Staff',
            targetJabatan: 'IT Support',
            kpiDepartemen: 'KPI Support IT',
            ski: s.ski,
            targetDetail: '100% Selesai',
            kriteria1: 'Sangat kurang (< 50%)',
            kriteria2: 'Kurang (50-69%)',
            kriteria3: 'Cukup (70-84%)',
            kriteria4: 'Baik (85-95%)',
            kriteria5: 'Sangat Baik (> 95%)',
            bobot: s.bobot,
            tahunAjaran: '2025/2026'
        }));
        _isSkisDataLoaded = true;
    } else {
        const res = await fetchGasAPI('getSKIs');
        if (res && res.success) {
            _allSkisData = res.data || [];
            _isSkisDataLoaded = true;
        } else {
            return null;
        }
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
            await initDaftarSki(true);
            btnRefresh.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
            btnRefresh.disabled = false;
            showToast('Data SKI diperbarui dari cloud.', 'success');
        };
    }

    if (!_isSkisDataLoaded || forceRefresh) {
        tbody.innerHTML = '<tr><td colspan="10" class="text-center" style="padding:30px;"><i class="fas fa-spinner fa-spin"></i> Memuat data SKI dari database...</td></tr>';
        const data = await loadSkisData(forceRefresh);
        if (!data) {
            tbody.innerHTML = '<tr><td colspan="10" class="text-center text-danger">Gagal mengambil data SKI dari database.</td></tr>';
            return;
        }
    }

    // --- Filter SKI berdasarkan role & unit pengguna ---
    if (currentUser.level === 'General Manager') {
        // GM: filter berdasarkan bidang jabatan
        const isPendidikan = currentUser.jabatan && currentUser.jabatan.toLowerCase().includes('pendidikan');
        const isOperasional = currentUser.jabatan && currentUser.jabatan.toLowerCase().includes('operasional');

        if (isPendidikan) {
            _allSkisData = _allSkisData.filter(s => {
                const u = (s.targetUnit || '').toLowerCase();
                return ['tk', 'sd', 'smp', 'sma'].includes(u);
            });
        } else if (isOperasional) {
            _allSkisData = _allSkisData.filter(s => {
                const u = (s.targetUnit || '').toLowerCase();
                return ['fa', 'ga', 'hrd'].includes(u);
            });
        }
    } else if (!['Super Admin', 'Direktur'].includes(currentUser.level)) {
        // Manager, Supervisor, Tim Leader, Staff, Pelaksana:
        // hanya tampilkan SKI sesuai unit mereka sendiri
        const userUnit = (currentUser.unit || '').toLowerCase().trim();
        _allSkisData = _allSkisData.filter(s => {
            const skiUnit = (s.targetUnit || '').toLowerCase().trim();
            return skiUnit === userUnit;
        });
    }
    // Direktur & Super Admin: tampilkan semua unit (tidak difilter)

    // Populate Filters
    if (filterUnit) {
        const units = [...new Set(_allSkisData.map(s => s.targetUnit).filter(Boolean))];
        filterUnit.innerHTML = '<option value="">-- Semua Unit --</option>' +
            units.map(u => `<option value="${u}">${u}</option>`).join('');
    }
    if (filterLevel) {
        const levels = [...new Set(_allSkisData.map(s => s.targetLevel).filter(Boolean))];
        filterLevel.innerHTML = '<option value="">-- Semua Level --</option>' +
            levels.map(l => `<option value="${l}">${l}</option>`).join('');
    }
    if (filterJabatan) {
        const jabatans = [...new Set(_allSkisData.map(s => s.targetJabatan).filter(Boolean))];
        filterJabatan.innerHTML = '<option value="">-- Semua Jabatan --</option>' +
            jabatans.map(j => `<option value="${j}">${j}</option>`).join('');
    }

    const renderTable = () => {
        const uVal = filterUnit ? filterUnit.value : '';
        const lVal = filterLevel ? filterLevel.value : '';
        const jVal = filterJabatan ? filterJabatan.value : '';
        const qVal = searchText ? searchText.value.toLowerCase().trim() : '';

        // Grouping by Unit + Level + Jabatan
        const groupedMap = new Map();
        _allSkisData.forEach(item => {
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

        if (filteredGroups.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center" style="padding:20px; color:#94a3b8;">Tidak ada data template SKI yang sesuai.</td></tr>';
            return;
        }

        tbody.innerHTML = filteredGroups.map((g, idx) => {
            // Hak akses edit per grup:
            // - Direktur: read-only
            // - General Manager: hanya bisa edit/hapus SKI khusus level Manager
            // - Super Admin / Manager / SPV / TL: bisa edit SKI grupnya
            let canEditGroup = true;
            if (currentUser.level === 'Direktur') {
                canEditGroup = false;
            } else if (currentUser.level === 'General Manager') {
                canEditGroup = (g.level === 'Manager');
            }

            return `
                <tr>
                    <td style="text-align:center; font-weight:600;">${idx + 1}</td>
                    <td><span style="background:#e0e7ff; color:#3730a3; padding:3px 10px; border-radius:12px; font-weight:600; font-size:0.8rem;">${g.unit}</span></td>
                    <td><span style="background:#f1f5f9; color:#334155; padding:3px 10px; border-radius:12px; font-weight:600; font-size:0.8rem;">${g.level}</span></td>
                    <td><strong style="color:#1e293b; font-size:0.88rem;">${g.jabatan}</strong></td>
                    <td style="text-align:center;">
                        <span style="background:#fef3c7; color:#92400e; padding:3px 10px; border-radius:12px; font-weight:600; font-size:0.8rem;">${g.skis.length} Target</span>
                    </td>
                    <td style="text-align:center;">
                        ${!canEditGroup ? `
                            <div style="display:flex; justify-content:center;">
                                <button class="btn-outline" style="padding:4px 12px; font-size:0.78rem; border-color:#3b82f6; color:#1d4ed8;" onclick="viewGroupSki('${encodeURIComponent(g.key)}')">
                                    <i class="fas fa-eye"></i> Lihat
                                </button>
                            </div>
                        ` : `
                            <div style="display:flex; justify-content:center; gap:6px;">
                                <button class="btn-outline" style="padding:4px 10px; font-size:0.78rem;" onclick="editGroupSki('${encodeURIComponent(g.key)}')">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button style="background:#ef4444; color:white; border:none; width:30px; height:30px; border-radius:6px; cursor:pointer;" onclick="deleteGroupSki('${encodeURIComponent(g.key)}')" title="Hapus Template Jabatan Ini">
                                    <i class="fas fa-trash" style="font-size:0.78rem;"></i>
                                </button>
                            </div>
                        `}
                    </td>
                </tr>
            `;
        }).join('');
    };

    renderTable();

    if (filterUnit) filterUnit.onchange = renderTable;
    if (filterLevel) filterLevel.onchange = renderTable;
    if (filterJabatan) filterJabatan.onchange = renderTable;
    if (searchText) searchText.oninput = renderTable;

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
                    <label style="font-weight:700; color:#334155; font-size:0.8rem; margin:0;">Bobot:</label>
                    <input type="number" class="form-control edit-bobot" min="0" max="100" value="${data.bobot || ''}" placeholder="0" style="width:65px; text-align:center; font-weight:700; color:#16a34a; font-size:0.9rem; padding:3px 6px;" oninput="updateModalEditTotalBobot()">
                    <span style="font-weight:700; color:#475569; font-size:0.8rem;">%</span>
                </div>
                <button type="button" onclick="removeModalEditRow(this)" style="background:#fee2e2; color:#ef4444; border:1px solid #fca5a5; padding:5px 10px; border-radius:6px; cursor:pointer; font-weight:600; font-size:0.78rem; display:inline-flex; align-items:center; gap:5px;" title="Hapus Baris Ini">
                    <i class="fas fa-trash"></i> Hapus
                </button>
            </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:12px; margin-bottom:12px;">
            <div>
                <label style="font-weight:700; font-size:0.8rem; color:#475569; display:block; margin-bottom:4px;">KPI Departemen</label>
                <textarea class="form-control edit-kpi" style="min-height:70px; font-size:0.83rem; line-height:1.4; resize:vertical;" placeholder="KPI Departemen...">${data.kpiDepartemen || ''}</textarea>
            </div>
            <div>
                <label style="font-weight:700; font-size:0.8rem; color:#475569; display:block; margin-bottom:4px;">Sasaran Kerja Individu (SKI) <span style="color:#ef4444;">*</span></label>
                <textarea class="form-control edit-ski" style="min-height:70px; font-size:0.83rem; line-height:1.4; resize:vertical; font-weight:600;" placeholder="Sasaran Kerja..." required>${data.ski || ''}</textarea>
            </div>
            <div>
                <label style="font-weight:700; font-size:0.8rem; color:#475569; display:block; margin-bottom:4px;">Target Detail</label>
                <textarea class="form-control edit-target" style="min-height:70px; font-size:0.83rem; line-height:1.4; resize:vertical;" placeholder="Target detail...">${data.targetDetail || ''}</textarea>
            </div>
        </div>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px 12px;">
            <label style="font-weight:700; font-size:0.8rem; color:#334155; display:block; margin-bottom:6px;">Skala Penilaian (1 s.d 5)</label>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap:8px;">
                <div>
                    <div style="font-size:0.72rem; font-weight:700; color:#ef4444; margin-bottom:2px; background:#fee2e2; padding:2px 4px; border-radius:4px; text-align:center;">Skala 1 (Sangat Kurang)</div>
                    <textarea class="form-control edit-k1" style="min-height:55px; font-size:0.78rem; padding:4px 6px; resize:vertical;" placeholder="Skala 1...">${data.kriteria1 || ''}</textarea>
                </div>
                <div>
                    <div style="font-size:0.72rem; font-weight:700; color:#ea580c; margin-bottom:2px; background:#ffedd5; padding:2px 4px; border-radius:4px; text-align:center;">Skala 2 (Kurang)</div>
                    <textarea class="form-control edit-k2" style="min-height:55px; font-size:0.78rem; padding:4px 6px; resize:vertical;" placeholder="Skala 2...">${data.kriteria2 || ''}</textarea>
                </div>
                <div>
                    <div style="font-size:0.72rem; font-weight:700; color:#ca8a04; margin-bottom:2px; background:#fef9c3; padding:2px 4px; border-radius:4px; text-align:center;">Skala 3 (Cukup)</div>
                    <textarea class="form-control edit-k3" style="min-height:55px; font-size:0.78rem; padding:4px 6px; resize:vertical;" placeholder="Skala 3...">${data.kriteria3 || ''}</textarea>
                </div>
                <div>
                    <div style="font-size:0.72rem; font-weight:700; color:#2563eb; margin-bottom:2px; background:#dbeafe; padding:2px 4px; border-radius:4px; text-align:center;">Skala 4 (Baik)</div>
                    <textarea class="form-control edit-k4" style="min-height:55px; font-size:0.78rem; padding:4px 6px; resize:vertical;" placeholder="Skala 4...">${data.kriteria4 || ''}</textarea>
                </div>
                <div>
                    <div style="font-size:0.72rem; font-weight:700; color:#16a34a; margin-bottom:2px; background:#dcfce7; padding:2px 4px; border-radius:4px; text-align:center;">Skala 5 (Sangat Baik)</div>
                    <textarea class="form-control edit-k5" style="min-height:55px; font-size:0.78rem; padding:4px 6px; resize:vertical;" placeholder="Skala 5...">${data.kriteria5 || ''}</textarea>
                </div>
            </div>
        </div>
    `;
    tbody.appendChild(card);
    updateModalEditTotalBobot();
    renumberModalEditRows();
};

window.removeModalEditRow = async (btn) => {
    const card = btn.closest('.ski-edit-card') || btn.closest('tr');
    if (!card) return;
    const skiId = card.getAttribute('data-ski-id');

    if (skiId) {
        if (!confirm('Apakah Anda yakin ingin menghapus baris SKI ini?')) return;
        showToast('Menghapus baris SKI...', 'info');
        const res = await fetchGasAPI('deleteSKI', { id: skiId });
        if (res && res.success) {
            showToast('Baris SKI berhasil dihapus.', 'success');
            if (APP_CONFIG.USE_MOCK) {
                _allSkisData = _allSkisData.filter(s => String(s.id) !== String(skiId));
            }
        } else {
            showToast(res ? res.message : 'Gagal menghapus baris SKI.', 'error');
            return;
        }
    }
    card.remove();
    updateModalEditTotalBobot();
    renumberModalEditRows();
};

window.editGroupSki = (encodedKey) => {
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
                                    <label style="font-weight:700; color:#334155; font-size:0.8rem; margin:0;">Bobot:</label>
                                    <input type="number" class="form-control edit-bobot" min="0" max="100" value="${displayB}" placeholder="0" style="width:65px; text-align:center; font-weight:700; color:#16a34a; font-size:0.9rem; padding:3px 6px;" oninput="updateModalEditTotalBobot()">
                                    <span style="font-weight:700; color:#475569; font-size:0.8rem;">%</span>
                                </div>
                                <button type="button" onclick="removeModalEditRow(this)" style="background:#fee2e2; color:#ef4444; border:1px solid #fca5a5; padding:5px 10px; border-radius:6px; cursor:pointer; font-weight:600; font-size:0.78rem; display:inline-flex; align-items:center; gap:5px;" title="Hapus Baris Ini">
                                    <i class="fas fa-trash"></i> Hapus
                                </button>
                            </div>
                        </div>

                        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:12px; margin-bottom:12px;">
                            <div>
                                <label style="font-weight:700; font-size:0.8rem; color:#475569; display:block; margin-bottom:4px;">KPI Departemen</label>
                                <textarea class="form-control edit-kpi" style="min-height:70px; font-size:0.83rem; line-height:1.4; resize:vertical;" placeholder="KPI Departemen...">${item.kpiDepartemen || ''}</textarea>
                            </div>
                            <div>
                                <label style="font-weight:700; font-size:0.8rem; color:#475569; display:block; margin-bottom:4px;">Sasaran Kerja Individu (SKI) <span style="color:#ef4444;">*</span></label>
                                <textarea class="form-control edit-ski" style="min-height:70px; font-size:0.83rem; line-height:1.4; resize:vertical; font-weight:600;" placeholder="Sasaran Kerja..." required>${item.ski || ''}</textarea>
                            </div>
                            <div>
                                <label style="font-weight:700; font-size:0.8rem; color:#475569; display:block; margin-bottom:4px;">Target Detail</label>
                                <textarea class="form-control edit-target" style="min-height:70px; font-size:0.83rem; line-height:1.4; resize:vertical;" placeholder="Target detail...">${item.targetDetail || ''}</textarea>
                            </div>
                        </div>

                        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px 12px;">
                            <label style="font-weight:700; font-size:0.8rem; color:#334155; display:block; margin-bottom:6px;">Skala Penilaian (1 s.d 5)</label>
                            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap:8px;">
                                <div>
                                    <div style="font-size:0.72rem; font-weight:700; color:#ef4444; margin-bottom:2px; background:#fee2e2; padding:2px 4px; border-radius:4px; text-align:center;">Skala 1 (Sangat Kurang)</div>
                                    <textarea class="form-control edit-k1" style="min-height:55px; font-size:0.78rem; padding:4px 6px; resize:vertical;" placeholder="Skala 1...">${item.kriteria1 || ''}</textarea>
                                </div>
                                <div>
                                    <div style="font-size:0.72rem; font-weight:700; color:#ea580c; margin-bottom:2px; background:#ffedd5; padding:2px 4px; border-radius:4px; text-align:center;">Skala 2 (Kurang)</div>
                                    <textarea class="form-control edit-k2" style="min-height:55px; font-size:0.78rem; padding:4px 6px; resize:vertical;" placeholder="Skala 2...">${item.kriteria2 || ''}</textarea>
                                </div>
                                <div>
                                    <div style="font-size:0.72rem; font-weight:700; color:#ca8a04; margin-bottom:2px; background:#fef9c3; padding:2px 4px; border-radius:4px; text-align:center;">Skala 3 (Cukup)</div>
                                    <textarea class="form-control edit-k3" style="min-height:55px; font-size:0.78rem; padding:4px 6px; resize:vertical;" placeholder="Skala 3...">${item.kriteria3 || ''}</textarea>
                                </div>
                                <div>
                                    <div style="font-size:0.72rem; font-weight:700; color:#2563eb; margin-bottom:2px; background:#dbeafe; padding:2px 4px; border-radius:4px; text-align:center;">Skala 4 (Baik)</div>
                                    <textarea class="form-control edit-k4" style="min-height:55px; font-size:0.78rem; padding:4px 6px; resize:vertical;" placeholder="Skala 4...">${item.kriteria4 || ''}</textarea>
                                </div>
                                <div>
                                    <div style="font-size:0.72rem; font-weight:700; color:#16a34a; margin-bottom:2px; background:#dcfce7; padding:2px 4px; border-radius:4px; text-align:center;">Skala 5 (Sangat Baik)</div>
                                    <textarea class="form-control edit-k5" style="min-height:55px; font-size:0.78rem; padding:4px 6px; resize:vertical;" placeholder="Skala 5...">${item.kriteria5 || ''}</textarea>
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
                <button class="btn-secondary" onclick="document.getElementById('modal-detail-ski').style.display='none'">Batal</button>
                <button class="btn-primary" onclick="saveGroupSkiEdit('${encodeURIComponent(key)}')"><i class="fas fa-save"></i> Simpan Perubahan</button>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
    updateModalEditTotalBobot();
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

    const first = items[0];
    if (title) title.innerHTML = `<i class="fas fa-eye text-primary"></i> Detail Template SKI: ${first.targetJabatan || '-'}`;
    if (subtitle) subtitle.innerHTML = `Unit: <strong>${first.targetUnit || '-'}</strong> | Level: <strong>${first.targetLevel || '-'}</strong> | Total: <strong>${items.length} Target</strong>`;

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
            </table>
        </div>
        <div style="display:flex; justify-content:flex-end;">
            <button class="btn-secondary" onclick="document.getElementById('modal-detail-ski').style.display='none'">Tutup</button>
        </div>
    `;

    modal.style.display = 'flex';
};

window.saveGroupSkiEdit = async (encodedKey) => {
    const key = decodeURIComponent(encodedKey);
    const parts = key.split('||');
    const unit = parts[0];
    const level = parts[1];
    const jabatan = parts[2];

    const tbodyModal = document.getElementById('tbody-modal-edit-rows');
    if (!tbodyModal) return;

    const rows = [...tbodyModal.querySelectorAll('.ski-edit-card, tr')];
    if (!rows.length) return showToast('Tidak ada baris SKI untuk disimpan.', 'warning');

    const totalBobot = rows.reduce((sum, r) => {
        const b = parseFloat(r.querySelector('.edit-bobot')?.value || 0);
        return sum + b;
    }, 0);

    if (Math.round(totalBobot) !== 100) {
        return showToast(`Total Bobot harus 100%. Saat ini: ${Math.round(totalBobot * 10) / 10}%`, 'error');
    }

    const btnSimpan = document.querySelector('#modal-detail-ski .btn-primary');
    let origText = '';
    if (btnSimpan) {
        origText = btnSimpan.innerHTML;
        btnSimpan.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
        btnSimpan.disabled = true;
    } else {
        showToast('Menyimpan perubahan...', 'info');
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

    if (allSuccess) {
        showToast('Template SKI berhasil diperbarui!', 'success');
    } else {
        showToast('Perubahan Template SKI telah disimpan.', 'success');
    }

    _isSkisDataLoaded = false;
    initDaftarSki(true);
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

    const jabatanName = items[0].targetJabatan || 'Jabatan ini';

    if (!confirm(`Hapus seluruh ${items.length} template SKI untuk ${jabatanName}?`)) return;

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
