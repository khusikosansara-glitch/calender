// 테마 관리 모듈
export class ThemeManager {
    constructor() {
        this.storageKey = 'diet_calendar_theme';
        this.theme = this.loadTheme();
        this.init();
    }

    // 저장된 테마 불러오기
    loadTheme() {
        const savedTheme = localStorage.getItem(this.storageKey);
        
        // 저장된 테마가 있으면 사용, 없으면 light 모드
        if (savedTheme === 'dark' || savedTheme === 'light') {
            return savedTheme;
        }
        
        return 'light';
    }

    // 테마 초기화 및 적용
    init() {
        this.applyTheme(this.theme);
    }

    // 테마 적용
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.theme = theme;
        
        // localStorage에 저장
        localStorage.setItem(this.storageKey, theme);
    }

    // 테마 전환
    toggle() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    // 현재 테마 가져오기
    getTheme() {
        return this.theme;
    }

    // 특정 테마로 설정
    setTheme(theme) {
        if (theme === 'dark' || theme === 'light') {
            this.applyTheme(theme);
        }
    }
}
