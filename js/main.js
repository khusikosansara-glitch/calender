// 메인 진입점 - 앱 초기화
import { ThemeManager } from './theme.js';
import { Calendar } from './calendar.js';
import { AuthManager } from './auth.js';
import { Modal } from './modal.js';
import { MealManager } from './meal.js';
import { MealModal } from './mealModal.js';
import { StatsManager } from './stats.js';
import { StatsPage } from './statsPage.js';

// DOM 요소들
const loginPage = document.getElementById('loginPage');
const registerPage = document.getElementById('registerPage');
const mainApp = document.getElementById('mainApp');
const calendarView = document.getElementById('calendarView');
const statsView = document.getElementById('statsView');
const profileView = document.getElementById('profileView');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutButton = document.getElementById('logoutButton');
const statsButton = document.getElementById('statsButton');
const profileButton = document.getElementById('profileButton');
const backToCalendar = document.getElementById('backToCalendar');
const showRegisterBtn = document.getElementById('showRegister');
const showLoginBtn = document.getElementById('showLogin');
const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');

// 프로필 페이지 요소들
const changePasswordBtn = document.getElementById('changePasswordBtn');
const deleteAccountBtn = document.getElementById('deleteAccountBtn');

// 매니저 인스턴스 생성
const authManager = new AuthManager();
const themeManager = new ThemeManager();
const modal = new Modal();
const mealManager = new MealManager();
const statsManager = new StatsManager(mealManager);
let calendar = null;
let mealModal = null;
let statsPage = null;

// 에러 메시지 표시 함수
function showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
}

function hideError(element) {
    element.textContent = '';
    element.classList.remove('show');
}

// 테마 아이콘 업데이트
function updateThemeIcon() {
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        const currentTheme = themeManager.getTheme();
        themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    }
}

// 날짜 포맷팅 함수
function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 프로필 정보 로드
function loadProfileInfo() {
    const userInfo = authManager.getCurrentUserFullInfo();
    if (!userInfo) return;

    document.getElementById('profileEmail').textContent = userInfo.email;
    document.getElementById('profileEmailDetail').textContent = userInfo.email;
    document.getElementById('profileCreatedAt').textContent = formatDate(userInfo.createdAt);
    document.getElementById('profileLastLogin').textContent = formatDate(userInfo.loginTime);
}

// 페이지 전환 함수
function showLoginPage() {
    loginPage.style.display = 'flex';
    registerPage.style.display = 'none';
    mainApp.style.display = 'none';
    hideError(loginError);
}

function showRegisterPage() {
    loginPage.style.display = 'none';
    registerPage.style.display = 'flex';
    mainApp.style.display = 'none';
    hideError(registerError);
}

function showMainApp() {
    loginPage.style.display = 'none';
    registerPage.style.display = 'none';
    mainApp.style.display = 'block';
    
    // 캘린더 뷰 표시, 다른 뷰 숨김
    calendarView.style.display = 'block';
    statsView.style.display = 'none';
    profileView.style.display = 'none';
    
    // 테마 아이콘 업데이트
    updateThemeIcon();
    
    // 캘린더 초기화 (한 번만)
    if (!calendar) {
        const calendarContainer = document.getElementById('calendar');
        
        // 편집 버튼 클릭 핸들러
        const handleEditClick = (year, month, day) => {
            mealModal.open(year, month, day);
        };
        
        calendar = new Calendar(calendarContainer, mealManager, handleEditClick);
        calendar.render();
        
        // 식사 모달 초기화
        mealModal = new MealModal(mealManager, () => {
            // 모달 닫을 때 캘린더 리렌더링
            calendar.render();
        });
    }
}

function showStatsView() {
    calendarView.style.display = 'none';
    statsView.style.display = 'block';
    profileView.style.display = 'none';
    
    // 통계 페이지 초기화 및 렌더링
    if (!statsPage) {
        const statsContainer = document.getElementById('statsContainer');
        statsPage = new StatsPage(statsContainer, statsManager);
    }
    statsPage.render();
}

function showProfileView() {
    calendarView.style.display = 'none';
    statsView.style.display = 'none';
    profileView.style.display = 'block';
    loadProfileInfo();
}

function showCalendarView() {
    calendarView.style.display = 'block';
    statsView.style.display = 'none';
    profileView.style.display = 'none';
}

// 로그인 폼 제출 처리
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    hideError(loginError);
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const result = authManager.login(email, password);
    
    if (result.success) {
        showMainApp();
    } else {
        showError(loginError, result.message);
    }
});

// 회원가입 폼 제출 처리
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    hideError(registerError);
    
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    
    if (password !== passwordConfirm) {
        showError(registerError, '비밀번호가 일치하지 않습니다.');
        return;
    }
    
    if (password.length < 6) {
        showError(registerError, '비밀번호는 최소 6자 이상이어야 합니다.');
        return;
    }
    
    const result = authManager.register(email, password);
    
    if (result.success) {
        modal.show('회원가입 완료', result.message);
        registerForm.reset();
        
        const modalCloseBtn = document.getElementById('modalClose');
        modalCloseBtn.addEventListener('click', () => {
            showLoginPage();
        }, { once: true });
        
    } else {
        showError(registerError, result.message);
    }
});

// 로그아웃 버튼 처리
logoutButton.addEventListener('click', () => {
    authManager.logout();
    loginForm.reset();
    showLoginPage();
});

// 통계 버튼 처리
statsButton.addEventListener('click', () => {
    showStatsView();
});

// 프로필 버튼 처리
profileButton.addEventListener('click', () => {
    showProfileView();
});

// 캘린더로 돌아가기
backToCalendar.addEventListener('click', () => {
    showCalendarView();
});

// 비밀번호 변경 버튼
changePasswordBtn.addEventListener('click', () => {
    modal.show('알림', '비밀번호 변경 기능은 추후 구현 예정입니다.');
});

// 계정 삭제 버튼
deleteAccountBtn.addEventListener('click', () => {
    const confirmed = confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
    if (confirmed) {
        const userInfo = authManager.getCurrentUser();
        authManager.deleteAccount(userInfo.email);
        modal.show('계정 삭제 완료', '계정이 삭제되었습니다.');
        
        const modalCloseBtn = document.getElementById('modalClose');
        modalCloseBtn.addEventListener('click', () => {
            showLoginPage();
        }, { once: true });
    }
});

// 페이지 전환 버튼들
showRegisterBtn.addEventListener('click', () => {
    registerForm.reset();
    showRegisterPage();
});

showLoginBtn.addEventListener('click', () => {
    loginForm.reset();
    showLoginPage();
});

// 테마 토글 버튼
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    themeManager.toggle();
    updateThemeIcon();
});

// 앱 시작 - 로그인 상태 확인
document.addEventListener('DOMContentLoaded', () => {
    if (authManager.isLoggedIn()) {
        showMainApp();
    } else {
        showLoginPage();
    }
});
